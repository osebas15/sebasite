import styles from './App.module.css';
import { Component } from 'solid-js';
import LogoLink from './shared/components/LogoLink';
import images from './assets/imageConstants';

const AboutMe: Component = () => {
    return (
        <div class={styles.banner}>
          <img src={images.my_pic} class={styles.my_pic} alt="logo" />
          <div class={styles.socials}>
            <LogoLink text="osebas15" link={new URL("https://github.com/osebas15")} imgSrc="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"/>
            <LogoLink text="Sebastian Aguirre" link={new URL("https://www.linkedin.com/in/sebastian-aguirre-52ba93aa/")} imgSrc="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"/>
          </div>
        </div>
    )
}

export default AboutMe