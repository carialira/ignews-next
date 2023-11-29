import { getStripeJs } from "../../service/stripe-js";
import { api } from "../../service/api";
import Styles from "./styles.module.scss";
import { signIn, useSession } from "next-auth/react";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session, status } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId: sessionId });
    } catch (err) {
      console.log(err,'err')
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={Styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
