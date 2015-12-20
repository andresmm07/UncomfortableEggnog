import React from 'react';
import {getListeners} from '../../../../listener/listeners';

//still work on progress
export default class Languages extends React.Component {
  handleChange(event){
    console.log("CHANGED!", event.target.value);
    console.log(getListeners());
  }
  render(){
    return (
      <div>
        <select id="select_dialect" onChange={this.handleChange.bind(this)}>
          <option value="en-US">United States</option>
          <option value="cmn-Hans-CN">China</option>
          <option value="es-MX">Mexico</option>
        </select>
      </div>
    )
  }
}