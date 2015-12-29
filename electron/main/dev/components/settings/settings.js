import React, { PropTypes } from 'react';
import openBrowser from '../../../../cmd/execShellCommand';
import AppActions from '../../actions/actions';
import configUtils from '../../../../config/configUtils';

export default class Settings extends React.Component {
  render() {
    return (
      <div>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Jarvis"
            ref="newName"
          />
          <span className="input-group-btn">
            <button
              className="btn btn-success"
              type="button"
              onClick={ e => {
                //TODO: if we want to chane anything else in the config, we do it here
                let name = this.refs.newName.value;
                AppActions.changeConfig({ name });
              }}
            >
              Change Name</button>
          </span>
        </div>
        <div>
          <button
            onClick={ e => {
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
