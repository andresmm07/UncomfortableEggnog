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
  handleClick(){
    openBrowser('open http://voicecommand.herokuapp.com');
  }
  handleSubmit(evt){
    configUtils.write("name", this.refs.newName.value, function (err, data) {
      console.log(data);
    });
    // const webContent = remote.getCurrentWindow().webContents;
    // webContent.send('nameChanged', this.refs.newName.value);
    // this.refs.newName.value="";
  }
  render() {
    return (
      <div>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Jarvis" ref="newName"/>
          <span className="input-group-btn">
            <button className="btn btn-success" type="button" onClick={this.handleSubmit.bind(this)}>Change Name</button>
          </span>
        </div>
        <div>
          <button onClick={this.handleClick.bind(this)} className="btn btn-success">
            Visit Us
          </button>
        </div>
      </div>
    );
  }
}
