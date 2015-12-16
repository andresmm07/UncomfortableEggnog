import React, {PropTypes} from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    var home = "./icons/home.png";
    // var
    return (
      <div>
        <div className="navbar row">
          <div className="buttons-group">
            <div className="col-xs-5 pull-left buttons-left">
              <div id="home" className='buttons-left'>
                <Link to="/" className="center">
                  <img src={home} className="img-responsive"/>
                  <p style={{color: 'white'}}>
                    Home
                  </p>
                </Link>
              </div>
              <div className='buttons-left'>
                <Link className=" button btn btn-success" to="packages">
                  Packages
                </Link>
              </div>
              <div className='buttons-left'>
                <Link className="button btn btn-success" to="settings">
                  Settings
                </Link>
              </div>
            </div>
            <div className="col-xs-4 pull-right">
              <div className="pull-right">
                <Link className="button btn btn-success" to="settings">
                  Contact
                </Link>
              </div>
              <div className="pull-right">
                <Link className="button btn btn-success" to="packages">
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row content">
          <div className="col-md-12">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
};
