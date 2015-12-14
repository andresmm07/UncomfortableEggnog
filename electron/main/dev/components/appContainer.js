import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';
import Layout from './layout/layout';
import Packages from './packages/packages';
import Settings from './settings/settings';


class App extends React.Component {
  render() {
    return (<div>Hello</div>);
  }
};


export default class AppContainer extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" component={Layout}>
          <IndexRoute component={App} />
          <Route path="packages" saying="hello" component={Packages}/>
          <Route path="settings" component={Settings}/>
        </Route>
      </Router>
    );
  }
}
