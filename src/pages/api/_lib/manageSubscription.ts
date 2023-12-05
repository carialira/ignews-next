import { fauna } from "../../../service/fauna";
import { stripe } from "../../..//service/stripe";
import { query as q } from "faunadb";

export async function saveSubscription(subscriptionId: string, customerId: string) {
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

      console.log(`Index ${indexName} created successfully.`);
    }

    // Verificar se o documento existe antes de acessá-lo
    const documentExists = await fauna.query(
      q.Exists(q.Match(q.Index(indexName), customerId))
    );

    let userRef;

    if (documentExists) {
      userRef = await fauna.query(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index(indexName), customerId))
        )
      );
    } else {
      // Documento não existe, então criamos
      const newUser = {
        data: {
          stripe_customer_id: customerId,
          // outras informações do usuário, se necessário
        },
      };

      const createdUser = await fauna.query(
        q.Create(q.Collection("users"), newUser)
      );

      userRef = createdUser.ref;

      console.log(`User with ID ${customerId} created successfully.`);
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
    const collectionExists = await fauna.query(q.Exists(q.Collection(collectionName)));

    // Criar a coleção se ela não existir
    if (!collectionExists) {
      await fauna.query(q.CreateCollection({ name: collectionName }));
      console.log(`Collection ${collectionName} created successfully.`);
    }

    // Adicionar a assinatura à coleção
    await fauna.query(
      q.Create(q.Collection(collectionName), { data: subscriptionData })
    );

    console.log(`Subscription ${subscriptionData.id} saved successfully.`);

  } catch (error) {
    console.error(error, "Error saving subscription");
  }
}
