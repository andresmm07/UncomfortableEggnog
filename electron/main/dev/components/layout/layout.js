import React, {PropTypes} from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="layout">
        <div className="buttons-group">
          <div className="button col4">
            <Link to="/">
              Home
            </Link>
          </div>
          <div className="button col4">
            <Link to="packages">
              Packages
            </Link>
          </div>
          <div className="button col4">
            <Link to="settings">
              Settings
            </Link>
          </div>
        </div>
        <div>
          {this.props.children}
        </div>
    </div>
    )
  }
};
