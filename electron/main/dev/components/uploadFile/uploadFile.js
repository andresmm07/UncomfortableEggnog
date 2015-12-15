import React from 'react';

export default class UploadFile extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      data_uri: null
    };
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  handleFile(e) {
    let self = this;
    const reader = new FileReader();
    const file = e.target.files[0];
    console.log("FILE: ", file);
    reader.onload = (upload) => {
      console.log(upload);
      self.setState({
        data_uri: upload.target.result
      });
    };
    reader.readAsDataURL(file);
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
        <input type="file" onChange={this.handleFile.bind(this)} />
      </form>
    );
  }
}