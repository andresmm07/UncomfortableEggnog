import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';
import Layout from './layout/layout';
import Packages from './packages/packages';
import Settings from './settings/settings';
import Commands from './commands/commands';
import AddCommand from './addCommand/addCommand';
import EditCommand from './editCommand/editCommand';
import Landing from './landing/landing';

export default class AppContainer extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" component={Layout}>
          <IndexRoute component={Landing} />
          <Route path="landing" component={Landing}/>
          <Route path="packages" component={Packages}/>
          <Route path="commands" component={Commands}/>
          <Route path="addCommand" component={AddCommand}/>
          <Route path="editCommand" component={EditCommand}/>
          <Route path="settings" component={Settings}/>
        </Route>
      </Router>
    );
  }
}
