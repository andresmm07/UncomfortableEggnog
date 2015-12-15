import React from 'react';
import ReactDOM from 'react-dom';
import cmdUtils from '../../../../commandsUtil/commandsUtil';

export default class AddCommand extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleSubmit() {
    const formData = this.sendFormData();
    console.log("Action: ", formData.action);
    cmdUtils.addCommand(formData.action);
    //addPhrase()
  }
  sendFormData() {
    return {
      title: ReactDOM.findDOMNode(this.refs.title).value,
      description: ReactDOM.findDOMNode(this.refs.description).value,
      command: ReactDOM.findDOMNode(this.refs.command).value,
      action: ReactDOM.findDOMNode(this.refs.action).value
    };
  }
  render() {
    return (
      <form>
      <label>Title: </label>
      <input type="text" ref="title" />
      <label>Description: </label>
      <input type="text" ref="description" />
      <label>Command: </label>
      <input type="text" ref="command" />
      <label>Action: </label>
      <input type="text" ref="action" />
      <button type="button" onClick={this.handleSubmit.bind(this)}>Submit</button>
      </form>
    );
  }
};