import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import App from './components/App';
import Main from './components/Main';

// require('./style.css');

const routes = <Route component={App}>
  <Route path="/:username" component={Main} />
  <Route path="/:username/tracks/:track" component={Main} />
  <Route path="/tracks/:track" component={Main} />
  <Route path="/" component={Main} />
</Route>;

ReactDOM.render(
  <Router history={hashHistory}>{routes}</Router>,
  document.getElementById('app')
);