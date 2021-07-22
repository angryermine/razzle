import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import Home from './Home';
import About from './About';

import './App.css';

const App = () => (
  <>
    <ul>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
    </ul>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
    </Switch>
  </>
);

export default App;
