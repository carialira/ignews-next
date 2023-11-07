import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Styles from "./styles.module.scss";

export function SignInButton() {
  const isUserLoggedIn = true
  return isUserLoggedIn ? (<button type="button" className={Styles.signInButton}>
  <FaGithub color="#04d361" />
  Ariadne
  <FiX color="#737380" className={Styles.closeIcon}/>
</button>): (
    <button type="button" className={Styles.signInButton}>
      <FaGithub color="#eba417" />
      Sign in Github
    </button>
  );
}
