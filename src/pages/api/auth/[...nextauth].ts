import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna as db } from "../../../service/fauna";
import { query as q } from "faunadb";

const ensureIndexExists = async (indexName, collectionName, terms = []) => {
  try {
    await db.query(
      q.If(
        q.Not(q.Exists(q.Index(indexName))),
        q.CreateIndex({
          name: indexName,
          source: q.Collection(collectionName),
          terms: terms,
          // Outros parâmetros do índice, se necessário
        }),
        true // Índice já existe, não é necessário criar
      )
    );
  } catch (error) {
    console.error(
      `Erro ao garantir a existência do índice ${indexName}:`,
      error
    );
  }
};

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "read:user" } },
    }),
  ],
  callbacks: {
    async session({ session }) {
      let userActiveSubscription = null;

      try {
        const { email } = session.user;

        // Garante a existência do índice antes de fazer a consulta
        await ensureIndexExists("subscription_by_user_ref", "subscriptions", [
          { field: ["data", "userId"] },
        ]);
        await ensureIndexExists("subscription_by_status", "subscriptions", [
          { field: ["data", "status"] },
        ]);

        userActiveSubscription = await db.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (error) {
        console.log(error);
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn({ user }) {
      const { email } = user;

      try {
        // await db.query(
        //   q.CreateIndex({
        //     name: "user_by_email",
        //     source: q.Collection("users"),
        //     terms: [{ field: ["data", "email"] }],
        //     values: [{ field: ["data", "email"] }],
        //     unique: true,
        //   })
        // );

        //     await db.query(
        //   q.Create(q.Collection("users"), { data: { email: email } })
        // );
        await db.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(email ?? ""))
              )
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email ?? "")))
          )
        );

        return true;
      } catch (err) {
        return false;
      }
    },
  },
});
