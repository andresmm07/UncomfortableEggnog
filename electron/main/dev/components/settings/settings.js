import React, { PropTypes } from 'react';
import AppActions from '../../actions/actions';
import Store from '../../stores/store';
import StoreWatchMixin from '../../mixins/mixins';


function getConfig () {
  return {
    config: Store.getConfig()
  };
}

const Settings = (props) => {
  let {name, exactMatchThreshold, closeMatchThreshold} = props.config;
  return (
    <div className="row">
      <div className="col-md-12">
        <label> Name </label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={ e => {
            name = e.target.value;
            AppActions.changeConfig({
              name
            });
          }}
        />
        <span>
          <label> exactMatchThreshold </label>
          <input
            type="range"
            step="0.01"
            max="1"
            min="0"
            value={exactMatchThreshold}
            onChange={ e => {
              exactMatchThreshold = e.target.value;
              AppActions.changeConfig({
                exactMatchThreshold
              });
            }}

          />
          {exactMatchThreshold}
        </span>
        <span>
          <label> closeMatchThreshold </label>
          <input
            type="range"
            step="0.01"
            max="1"
            min="0"
            value={closeMatchThreshold}
            onChange={ e => {
              closeMatchThreshold = e.target.value;
              AppActions.changeConfig({
                closeMatchThreshold
              });
            }}

          />
          {closeMatchThreshold}
        </span>

        <button
          className="btn btn-success"
          onClick={ e => {
            AppActions.saveConfig();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default StoreWatchMixin(Settings, getConfig);
