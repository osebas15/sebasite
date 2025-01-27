import styles from './App.module.css';
import images from './assets/imageConstants';
import LogoLink from './shared/components/LogoLink';
import QRGenerator from './shared/components/QRCodeCreator';
import { HToolsContainer, ToolContainer } from './shared/components/HToolsContainer';
import { useNavigate } from "@solidjs/router";
import ShareListCreator from './shared/components/ShareListCreator';
import { Component } from 'solid-js';
import AboutMe from './AboutMe';

const Home: Component = () => {
  const navigate = useNavigate()

  const qrCodeContainer: ToolContainer = {
    title: "QRCode Generator",
    tool: () => <QRGenerator/>,
    color: 'black'
  }

  const shareListCreatorContainer: ToolContainer = {
    title: "Create a Todo List to share",
    tool: () => <ShareListCreator/>,
    color: 'black'
  }

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <p>
          Hi! I'm <b>Sebastian Aguirre</b>, <br/> 
          I have <b>10+ years experience</b> engineering and managing projects across a wide variety of stacks. <br/> 
          I'm experienced in <b>iOS, Javascript, C#, SQL, and Cloud Services</b> amongst other technologies
        </p>
      </header>
      <HToolsContainer containers={[qrCodeContainer, shareListCreatorContainer]} height='320px'/>
      {/*<AboutMe/>*/}
    </div>
  );
}

export default Home;
