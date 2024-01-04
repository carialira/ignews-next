
import  {ActiveLink}  from "../ActiveLink";
import { SignInButton } from "../SingInButton";
import Styles from "./styles.module.scss";



export function Header() {

  
  return (
    <header className={Styles.headerContainer}>
      <div className={Styles.headerContent}>
        <img src="/images/logo.svg" alt="logo" />
        <nav>
          <ActiveLink activeClassName={Styles.active} href="/">
            Home
          </ActiveLink>
          <ActiveLink activeClassName={Styles.active} href="/posts">Posts </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
