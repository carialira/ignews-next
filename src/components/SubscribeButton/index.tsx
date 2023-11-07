import Styles from "./styles.module.scss";

interface SubscribeButtonProps{
    priceId: string;
}


export function SubscribeButton({priceId}: SubscribeButtonProps) {
  return (
    <button type="button" className={Styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
