import React, {PropTypes} from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    return (
      <div style={{backgroundColor: "red"}}>
        <Link to="/">
          <button>Home</button>
        </Link>
        {' '}
        <Link to="packages">
          <button>Packages</button>
        </Link>
        {' '}
        <Link to="settings">
          <button>Settings</button>
        </Link>
        {this.props.children}
      </div>);
  }
};
