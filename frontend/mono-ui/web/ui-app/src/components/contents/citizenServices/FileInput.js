import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { translate, validate_fileupload } from '../../common/common';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileAttachment from 'material-ui/svg-icons/file/attachment';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import ActionQueryBuilder from 'material-ui/svg-icons/action/query-builder';
import { blue500, yellow600 } from 'material-ui/styles/colors';
const constants = require('../../common/constants');

const styles = {
  iconStyle: {
    width: 22,
    height: 22,
    color: '#9E9E9E',
  },
  inputFileStyle: {
    display: 'none',
  },
  listItemStyle: {
    wordBreak: 'break-word',
  },
};

class FileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewFiles: [],
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillMount() {
    this.openFileBrowser = this.openFileBrowser.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(e) {
    e.preventDefault();
    var files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if (!files) return;

    //validate file input
    let validationResult = validate_fileupload(files, this.props.fileFormats);
    if (typeof validationResult === 'string' || !validationResult) {
      if (this.props.dialogOpener) this.props.dialogOpener(true, validationResult);
      return;
    }

    this.populateFilePreviews([...files]);
    this.props.addFileHandler({
      isRequired: this.props.isRequired,
      code: this.props.code,
      files: [...files],
    }); //It's mandatory to define [...files]
  }

  populateFilePreviews(files) {
    if (files && files.length > 0) {
      files.map(file => {
        if (file.type.startsWith('image')) {
          var reader = new FileReader();
          var url = reader.readAsDataURL(file);
          reader.onloadend = function(e) {
            const previewFiles = this.state.previewFiles;
            previewFiles.push({
              name: file.name,
              src: e.target.result,
            });
            this.setState(previewFiles);
          }.bind(this);
        } else {
          const previewFiles = this.state.previewFiles;
          previewFiles.push({
            name: file.name,
            icon: <ActionAssignment />,
          });
          this.setState(previewFiles);
        }
      });
    }
  }

  removeFile(code, name, isRequired) {
    this.props.removeFileHandler({ code, name, isRequired });
  }

  openFileBrowser() {
    this.refs[this.props.code].click();
  }

  renderAvatar = file => {
    var file = this.state.previewFiles.find(f => f.name == file.name);
    if (file && file.src) {
      return <Avatar src={file.src} />;
    } else if (file && file.icon) {
      return <Avatar icon={file.icon} backgroundColor={blue500} />;
    } else {
      return <Avatar icon={<ActionQueryBuilder />} />;
    }
  };

  bytesToSize = bytes => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  showFiles() {
    return this.props.files.map((file, index) => {
      return (
        <ListItem
          style={styles.listItemStyle}
          key={index}
          disabled={true}
          leftAvatar={this.renderAvatar(file)}
          rightIcon={
            <div>
              <IconButton
                className="list-remove-button"
                onTouchTap={e => {
                  this.refs[this.props.code].value = null;
                  this.removeFile(this.props.code, file.name, this.props.isRequired);
                }}
              >
                <ActionDelete />
              </IconButton>
            </div>
          }
          primaryText={file.name}
          secondaryText={this.bytesToSize(file.size)}
        />
      );
    });
  }

  renderInputFile = () => {
    if (this.props.isMultipleFile) {
      return <input type="file" multiple ref={this.props.code} style={styles.inputFileStyle} onChange={this.handleFileChange} />;
    } else {
      return <input type="file" ref={this.props.code} style={styles.inputFileStyle} onChange={this.handleFileChange} />;
    }
  };

  render() {
    const files = this.showFiles();
    const inputFile = this.renderInputFile();
    return (
      <div className={'file-input-container ' + (this.props.error ? 'error' : '')}>
        <List>
          <div>
            <div className="file-header">
              <div className="name">
                {translate(this.props.name)} {this.props.isRequired ? '*' : ''}{' '}
                {this.props.error ? (
                  <span className="errorMsg">
                    <br />
                    {this.props.error}
                  </span>
                ) : null}
              </div>
              {!this.props.files || this.props.files.length === 0 ? (
                <div>
                  <FileAttachment style={styles.iconStyle} />
                  <span>No Attachments</span>
                </div>
              ) : null}
            </div>
            {this.props.files && this.props.files.length > 0 ? <div>{files}</div> : null}
          </div>

          {!this.props.files || this.props.files.length == 0 || this.props.isMultipleFile ? (
            <div className="file-browser">
              <RaisedButton label="Browse Files" onTouchTap={this.openFileBrowser} />
            </div>
          ) : null}
          {inputFile}
        </List>
      </div>
    );
  }
}

FileInput.defaultProps = {
  isMultipleFile: false,
  isRequired: false,
  error: '',
  fileFormats: constants.COMMON_FILE_FORMATS_ALLOWED,
};

export default FileInput;
