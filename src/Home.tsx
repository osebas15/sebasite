import styles from './App.module.css';
import images from './assets/imageConstants';
import LogoLink from './shared/components/LogoLink';
import QRGenerator from './shared/components/QRCodeCreator';
import { HToolsContainer, ToolContainer } from './shared/components/HToolsContainer';
import { useNavigate } from "@solidjs/router";
import ShareListCreator from './shared/components/ShareListCreator';
import { Component } from 'solid-js';
import AboutMe from './AboutMe';
import ShareList from './sharelist/ShareList';

interface HomeProps {
  list_id?: string
}

const Home: Component<HomeProps> = ({list_id}) => {
  const navigate = useNavigate()

  const qrCodeContainer: ToolContainer = {
    title: "QRCode Generator",
    tool: () => <QRGenerator placeholder={'https://sebasite.netlify.app/'}/>,
    color: 'black'
  }

  const shareListCreatorContainer: ToolContainer = {
    title: "Create a Todo List to share",
    tool: () => {
      if (list_id){
        return <ShareList list_id={list_id}/>
      }
      else {
        return <ShareListCreator/>
      }
    },
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
      <HToolsContainer containers={[qrCodeContainer, shareListCreatorContainer]} min-height='320px'/>
      {/*<AboutMe/>*/}
    </div>
  );
}

export default Home;
