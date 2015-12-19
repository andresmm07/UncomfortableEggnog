import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';

export default class Landing extends React.Component {
  render() {
    var style = {
      backgroundColor: "purple",
      color: "white"
    };
    return (
      <div className="row">
        <div className="col-xs-12" style={style}>
          <h1>
            Landing Page
          </h1>
        </div>
        <div className="col-4">
          <Link to="commands">
            <button>List of Commands</button>
          </Link>
        </div>
      </div>
    );

  };

}
