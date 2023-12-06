import { fauna } from "../../../service/fauna";
import { stripe } from "../../../service/stripe";
import { query as q } from "faunadb";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  try {
    // Nome do índice
    const indexName = "user_by_stripe_customer_id";

    // Verificar se o índice já existe
    const indexExists = await fauna.query(q.Exists(q.Index(indexName)));
    // Criar o índice se ele não existir
    if (!indexExists) {
      await fauna.query(
        q.CreateIndex({
          name: indexName,
          source: q.Collection("users"),
          terms: [{ field: ["data", "stripe_customer_id"] }],
        })
      );
    }

    // Verificar se o documento existe antes de acessá-lo
    const documentExists = await fauna.query(
      q.Exists(q.Match(q.Index(indexName), customerId))
    );

    let userRef: any;

    if (documentExists) {
      userRef = await fauna.query(
        q.Select("ref", q.Get(q.Match(q.Index(indexName), customerId)))
      );
    } else {
      // Documento não existe, então criamos
      const newUser = {
        data: {
          stripe_customer_id: customerId,
          // outras informações do usuário, se necessário
        },
      };

      const createdUser: any = await fauna.query(
        q.Create(q.Collection("users"), newUser)
      );

      userRef = createdUser.ref;
    }
    // Obter informações da assinatura no Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Estruturar dados da assinatura
    const subscriptionData = {
      id: subscription.id,
      userId: userRef,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
    };

    // Nome da coleção
    const collectionName = "subscriptions";

    // Verificar se a coleção já existe
    const collectionExists = await fauna.query(
      q.Exists(q.Collection(collectionName))
    );

    // Criar a coleção se ela não existir
    if (!collectionExists) {
      await fauna.query(q.CreateCollection({ name: collectionName }));
    }

        // Nome do índice
        const indexSubscriptions = "subscription_by_id";

        // Verificar se o índice já existe
        const indexSubscriptionsExists = await fauna.query(q.Exists(q.Index(indexSubscriptions)));
        // Criar o índice se ele não existir
        if (!indexExists) {
          await fauna.query(
            q.CreateIndex({
              name: indexSubscriptionsExists,
              source: q.Collection("subscriptions"),
              terms: [{ field: ["data", "subscription_by_id"] }],
            })
          );
        }
        
    if (createAction) {
      // Adicionar a assinatura à coleção
      await fauna.query(
        q.Create(q.Collection(collectionName), { data: subscriptionData })
      );
    } else {
   
       // atualiza a assinatura da coleção
      await fauna.query(
        q.Replace(
          q.Select(
            "ref",
            q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
          ),
          { data: subscriptionData }
        )
      );
    }
  } catch (error) {
    console.error(error, "Error saving subscription");
  }
}
