import logo from './logo.svg';
import styles from './App.module.css';
import images from './assets/imageConstants';
import ColoredLine from './shared/components/ColoredLine';
import LogoLink from './shared/components/LogoLink';
import QRGenerator from './shared/components/QRCodeCreator';

import Home from './Home';
import { Component } from 'solid-js';
import { Router, Route } from "@solidjs/router";
import ShareList from './sharelist/ShareList';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route
        path="/sharelist/:list_id"
        component={({params}) => <ShareList list_id={params.list_id} />}
      />
    </Router>
  );
};

export default App