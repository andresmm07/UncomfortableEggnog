import React, {PropTypes} from 'react';

export default class CommandsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    let { commands } = this.props;
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Voice Command</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    );
  }
}

CommandsTable.propTypes = {
};
