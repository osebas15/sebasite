import logo from './logo.svg';
import images from './assets/imageConstants';
import ColoredLine from './shared/components/ColoredLine';
import LogoLink from './shared/components/LogoLink';
import QRGenerator from './shared/components/QRCodeCreator';

import Home from './Home';
import styles from './App.module.css';
import { Component } from 'solid-js';
import { Router, Route } from "@solidjs/router";
import ShareList from './shared/components/sharelist/ShareList';

const App: Component = () => {
  return (
    <div class={styles.nav_main}>
      <Router>
        <Route path="/" component={() => <Home/>} />
        <Route
          path="/sharelist/:list_id"
          component={({params}) => <Home list_id={params.list_id}/>}
        />
      </Router>
      <div class={styles.bottomBar}>
      </div>
    </div>
  );
};

export default App