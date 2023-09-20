
import Styles from './styles.module.scss'


export function Header(){

  return(
    <header className={Styles.headerContainer}>
      <div className={Styles.headerContent}>
        <img src="/images/logo.svg" alt="logo"/>
        <nav>
          <a className={Styles.active} href="/">Home</a>
          <a href="/">Posts</a>
        </nav>
      </div>
    </header>
  )
}