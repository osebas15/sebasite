import logo from './logo.svg';
import styles from './App.module.css';
import images from './assets/imageConstants';
import ColoredLine from './shared/components/ColoredLine';
import LogoLink from './shared/components/LogoLink';
import QRGenerator from './shared/components/QRCodeCreator';

function App() {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div class={styles.banner}>
          <img src={images.my_pic} class={styles.my_pic} alt="logo" />
          <div class={styles.socials}>
            <LogoLink text="osebas15" link={new URL("https://github.com/osebas15")} imgSrc="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/>
            <LogoLink text="Sebastian Aguirre" link={new URL("https://www.linkedin.com/in/sebastian-aguirre-52ba93aa/")} imgSrc="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"/>
          </div>
        </div>
        <p>
          Hi! I'm <b>Sebastian Aguirre</b>, <br/> 
          I have <b>10+ years experience</b> engineering and managing projects across a wide variety of stacks. I'm experienced in <br/>
          <b>iOS, Javascript, C#, SQL, and Cloud Services</b> amongst other technologies
        </p>
      </header>
      <ColoredLine backgroundColor='black' height='40px' text='Quick Tools' textColor='white'/>
      <div class={styles.quicktools}>
        <QRGenerator/>
      </div>
    </div>
  );
}

export default App;
