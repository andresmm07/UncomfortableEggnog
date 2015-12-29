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
    <div>
      <div className="input-group">
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
          onBlur={ e => {
            AppActions.saveConfig();
          }}
        />
        <input
          type="text"
          className="form-control"
          value={exactMatchThreshold}
          onChange={ e => {
            exactMatchThreshold = e.target.value;
            AppActions.changeConfig({
              exactMatchThreshold
            });
          }}
          onBlur={ e => {
            AppActions.saveConfig();
          }}
        />
        <input
          type="text"
          className="form-control"
          value={closeMatchThreshold}
          onChange={ e => {
            closeMatchThreshold = e.target.value;
            AppActions.changeConfig({
              closeMatchThreshold
            });
          }}
          onBlur={ e => {
            AppActions.saveConfig();
          }}
        />
      </div>
    </div>
  );
}

export default StoreWatchMixin(Settings, getConfig);
