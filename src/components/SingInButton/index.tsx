import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import Styles from "./styles.module.scss";
import { signIn, useSession, signOut } from "next-auth/react";

export function SignInButton() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  return session ? (
    <button type="button" className={Styles.signInButton} onClick={()=>signOut()}>
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={Styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={Styles.signInButton}
      onClick={() => {
        signIn("github");
      }}
    >
      <FaGithub color="#eba417" />
      Sign in Github
    </button>
  );
}
