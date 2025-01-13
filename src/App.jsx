import logo from './logo.svg';
import styles from './App.module.css';
import images from './assets/imageConstants';
import ColoredLine from './shared/components/ColoredLine';

function App() {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={images.main_banner} class={styles.logo} alt="logo" />
        <p>
          Hi! I'm <b>Sebastian Aguirre</b>, <br/> 
          I have <b>10+ years experience</b> engineering and managing projects<br/>
          across a wide variety of stacks. I'm experienced in <br/>
          <b>iOS, Javascript, C#, SQL, and Cloud Services</b> amongst other technologies
        </p>
      </header>
      
      <ColoredLine color='red'/>
    </div>
  );
}

export default App;
