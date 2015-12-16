import React from 'react';
import packageUtil from '../../../../packagesUtil/packagesUtil';

export default class UploadFile extends React.Component {
  handleFile(e) {
    let self = this;
    const reader = new FileReader();
    const file = e.target.files[0];
    var path = file.path;
    var fileName = file.name;
    if (fileName.split('.')[1] !== 'json') {
      alert("The package needs to be a JSON file");
    } else {
      packageUtil.uploadPackage(path, fileName);
    }
  }
  render() {
    return (
      <form encType="multipart/form-data">
        <input type="file" onChange={this.handleFile.bind(this)} />
      </form>
    );
  }
}