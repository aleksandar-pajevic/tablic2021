import React from 'react';

import Join from './component/Join/Join';
import Game from './component/Game/Game';
import Loby from './component/Loby/Loby';

import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/loby" component={Loby} />
      <Route path="/game" component={Game} />
    </Router>
  );
};

export default App;
