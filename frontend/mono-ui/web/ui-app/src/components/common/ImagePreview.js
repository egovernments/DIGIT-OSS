import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FileRemove from 'material-ui/svg-icons/action/highlight-off';

var filename;
const renderImage = props => {
  const readURL = (e, idx) => {
    if (props.file) {
      let section = 'image' + idx;
      var reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById(section).src = e.target.result;
      };
      reader.readAsDataURL(props.file);
    }
  };

  const removeFile = fileobjToDelete => {
    props.handler(fileobjToDelete.name);
  };

  return (
    <Col xs={12} md={3}>
      <RaisedButton
        label={props.file.name.length > 15 ? props.file.name.substr(0, 12) + '...' : props.file.name}
        primary={true}
        fullWidth={true}
        icon={<FileRemove />}
        onTouchTap={event => {
          removeFile(props.file);
        }}
      />
      <img
        src="#"
        id={'image' + props.idx}
        width="100%"
        height="100px"
        style={{ objectFit: 'cover', cursor: 'pointer', marginBottom: '20px' }}
        onClick={e => {
          props.preview(document.getElementById('image' + props.idx).src);
        }}
      />
      {readURL(this, props.idx)}
    </Col>
  );
};

export default renderImage;
