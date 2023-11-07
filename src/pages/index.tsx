import { GetStaticProps } from "next";
import Head from "next/head";
import Styles from "./home.module.scss";
import { SubscribeButton } from "@/components/SubscribeButton";
import { stripe } from "@/service/stripe";


interface HomeProps{
  product:{
    priceId: string;
    amount: number
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | IgNews Next</title>
      </Head>
      <main className={Styles.contentContainer}>
        <section className={Styles.hero}>
          <span>👋 Hey, welcome!</span>
          <h1>
            News about he <span>React</span> word.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}


export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1O9diNHiEwZ1hXy09nb7cASQ", {
    expand: ["product"],
  });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

