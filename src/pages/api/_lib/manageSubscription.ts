import { fauna } from "../../../service/fauna";
import { stripe } from "../../..//service/stripe";
import { query as q } from "faunadb";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  try {
    // Nome do índice
    console.log('oooooooooooi')
    const indexName = "user_by_stripe_customer_id";

    // Verificar se o índice já existe
    const indexExists = await fauna.query(q.Exists(q.Index(indexName)));
    console.log(indexExists, "indexExists");
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


    const documentExists = await fauna.query(
      q.Exists(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    );
    
    let userRef;
    if (documentExists) {
       userRef = await fauna.query(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
        )
      );
    
    } 
    
   
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

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
    console.log(collectionExists, "collectionExists");

    // Criar a coleção se ela não existir
    if (!collectionExists) {
      await fauna.query(q.CreateCollection({ name: collectionName }));
    }

    // Agora, você pode adicionar documentos à coleção
    await fauna.query(
      q.Create(q.Collection(collectionName), { data: subscriptionData })
    );
  } catch (error) {
    console.log(error, "err");
  }
}
