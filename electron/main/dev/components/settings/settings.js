import React, {PropTypes} from 'react';
import openBrowser from '../../../../cmd/execShellCommand';
import AppActions from '../../actions/actions';
import configUtils from '../../../../config/configUtils';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
  render() {
    return (
      <div>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Jarvis" ref="newName"/>
          <span className="input-group-btn">
            <button className="btn btn-success" type="button" onClick={e => {
              console.log(this.refs.newName.value);
              AppActions.changeConfig(this.refs.newName.value);
            }}>Change Name</button>
          </span>
        </div>
        <div>
          <button
            onClick={e => {
              openBrowser('open http://voicecommand.herokuapp.com')
            }}
            className="btn btn-success"
          >
            Visit Us
          </button>
        </div>
      </div>
    );
  }
}
