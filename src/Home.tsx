import styles from './App.module.css';
import images from './assets/imageConstants';
import LogoLink from './shared/components/LogoLink';
import QRGenerator from './shared/components/QRCodeCreator';

import { 
  HToolsContainer, 
  ToolContainer 
} from './shared/components/HToolsContainer';

import { 
  useNavigate,
  useParams 
} from "@solidjs/router";

import ShareListCreator from './shared/components/ShareListCreator';

import { 
  Component 
} from 'solid-js';

import AboutMe from './AboutMe';
import ShareList from './shared/components/sharelist/ShareList';

const Home: Component = () => {
  const navigate = useNavigate()
  const params = useParams()

  const qrCodeContainer: ToolContainer = {
    tool: () => <QRGenerator placeholder={'https://sebasite.netlify.app/'}/>,
    color: 'black'
  }

  const shareListCreatorContainer: ToolContainer = {
    tool: () => {
      if (params.list_id){
        return <ShareList list_id={params.list_id}/>
      }
      else {
        return <ShareListCreator/>
      }
    },
    color: 'black'
  }

  let containers: () => ToolContainer[] = () => {
    if (params.list_id){
      return [shareListCreatorContainer, qrCodeContainer]
    }
    else {
      return [qrCodeContainer, shareListCreatorContainer]
    }
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
      <HToolsContainer containers={containers()} minHeight='320px'/>
      {/*<AboutMe/>*/}
    </div>
  );
}

export default Home;
