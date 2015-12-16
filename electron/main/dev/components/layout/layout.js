import React, {PropTypes} from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className="navbar row">
          <div className="buttons-group">
            <div className="button col-xs-4">
              <Link to="/">
                <button>Home</button>
              </Link>
            </div>
            <div className="button col-xs-4">
              <Link to="packages">
                <button>Packages</button>
              </Link>
            </div>
            <div className="button col-xs-4">
              <Link to="settings">
                <button>Settings</button>
              </Link>
            </div>
          </div>
        <div className="row">
            {this.props.children}
        </div>
      </div>
    </div>
    )
  }
};
