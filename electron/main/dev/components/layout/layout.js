import React, {PropTypes} from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="navbar row">
        <div className="buttons-group">
          <div className="button col-4" style={{width: "300px"}}>
            <Link to="/">
              <button>Home</button>
            </Link>
          </div>
          <div className="button col-4">
            <Link to="packages" style={{width: "300px"}}>
              <button>Packages</button>
            </Link>
          </div>
          <div className="button col-4" style={{width: "300px"}}>
            <Link to="settings">
              <button>Settings</button>
            </Link>
          </div>
        </div>
        <div className="content">
          {this.props.children}
        </div>
    </div>
    )
  }
};
