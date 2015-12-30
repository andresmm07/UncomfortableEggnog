import React, {PropTypes} from 'react';
import openBrowser from '../../../../cmd/execShellCommand';
// import AppActions from '../../actions/actions';
import configUtils from '../../../../config/configUtils';

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }
  render() {
    const aboutStyle =
    {
      position: "relative",
      marginTop: "20%",
      transform: "translateX(50%)",
      width: "50vh",
      textAlign: "center",
      color: "#343D5C",
      fontFamily: '"Courier New", Courier, monospace'
    }

    const aboutText = "Welcome to a new world of awesome.  We are engineers and dreamers currently living in the San\
    Francisco Bay Area.  Check the website for updates and reach out if we made your world just a little bit more\
    like Blade Runner."



    return (
      <div style={aboutStyle}>
        <div className="primary-header">
          <h1>Jarvis</h1>
          <h3>Version 1.0.0</h3>
          <h5><strong>Voice Command for your Computer</strong></h5>
        </div>
        <div>
          <p>{aboutText}</p>
          <p>Tracy x Yilen x Andres x Mitchell</p>
          <a onClick={e => {
              openBrowser('open http://voicecommand.herokuapp.com');
            }}>www.voicecommand.herokuapp.com</a>
        </div>
      </div>
    );
  }
}

