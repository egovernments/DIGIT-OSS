import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const customStyles = {
  fileInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

const FileInput = props => {
  let fileName = props.file ? (props.file.files && props.file.files.length > 0 ? props.file.files[0].name : '') : '';

  //check uploaded file or not
  if (fileName && props.file.files[0].fileStoreId) {
    fileName = (
      <a href={`/filestore/v1/files/id?fileStoreId=${props.file.files[0].fileStoreId}&tenantId=${localStorage.getItem('tenantId')}`} download>
        {fileName}
      </a>
    );
  }

  // console.log('fileName', props.file ? props.file.code : 'empty', props.file ? props.file.files[0].name : 'empty');

  return (
    <div>
      <RaisedButton label={props.label || 'Browse'} labelPosition="before" containerElement="label">
        <input
          type="file"
          id={props.id || ''}
          style={customStyles.fileInput}
          onChange={e => {
            props.fileInputOnChange(e, props.doc);
          }}
        />
      </RaisedButton>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <label>{fileName}</label>
    </div>
  );
};

export default FileInput;
