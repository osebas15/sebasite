import styles from './App.module.css';
import { Component } from 'solid-js';
import LogoLink from './shared/components/LogoLink';
import images from './assets/imageConstants';

const AboutMe: Component = () => {
    return (
        <div class={styles.banner}>
          <img src={images.my_pic} class={styles.my_pic} alt="logo" />

        </div>
    )
}

export default AboutMe