import React, {PropTypes} from 'react';
import openBrowser from '../../../../cmd/execShellCommand';
import remote from 'remote';

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
    const webContent = remote.getCurrentWindow().webContents;
    webContent.send('nameChanged', this.refs.newName.value);
    this.refs.newName.value="";
  }
  render() {
    return (
      <div>
        <div className="change">
          <input placeholder="jarvis" ref="newName" />
          <button onClick={this.handleSubmit.bind(this)}>Change Name</button>
        </div>
        <button onClick={this.handleClick.bind(this)}>Visit Us</button>
      </div>
    );
  }
}
