import { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';

import Home from './Home';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/sharelist/:list_id" component={Home} />
    </Router>
  );
};

export default App;
