import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna as db } from "../../../service/fauna";
import { query as q } from "faunadb";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "read:user" } },
    }),
  ],
  callbacks: {
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
