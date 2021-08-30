import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FileDownload from 'material-ui/svg-icons/action/get-app';
import RemoveFile from 'material-ui/svg-icons/action/highlight-off';
import Api from '../../../api/api';
import _ from 'lodash';
import { translate } from '../../common/common';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';

class UiDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
    };
  }
  componentDidMount() {
    // console.log('came to did mount');
    this.initData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    // console.log('receive props');
    this.initData(nextProps);
  }
  initData(props) {
    let { item, handler, useTimestamp } = props;
    if (item.url) {
      let fIndex = item.url.indexOf('{');
      let lIndex = item.url.indexOf('}');
      let regexp = new RegExp(/{(.*?)}/);
      let url = item.url.replace(regexp, _.get(this.props.formData, item.url.substring(fIndex + 1, lIndex)));
      if (_.get(this.props.formData, item.url.substring(fIndex + 1, lIndex))) {
        Promise.all([Api.commonApiPost(url, {}, {}, '', useTimestamp, false)]).then(responses => {
          try {
            let allowedMax = item.maxFile - responses[0].documentDetails.length;
            this.setState({
              docs: responses[0].documentDetails,
              allowedMax,
              fileCount: 1,
            });
          } catch (e) {
            console.log('error', e);
          }
        });
      }
    } else {
      let fileCount = (_.get(props.formData, item.jsonPath) && _.get(props.formData, item.jsonPath).length) || 1;
      this.setState({
        docs: [],
        allowedMax: item.maxFile,
        fileCount,
      });
    }
  }
  addFile = () => {
    this.setState((prevState, props) => {
      return { fileCount: prevState.fileCount + 1 };
    });
  };
  showDocs = () => {
    if (this.state.docs && this.state.docs.length > 0) {
      return (
        this.state.docs &&
        this.state.docs.map((doc, index) => {
          return (
            <Col xs={12} sm={3} md={4} lg={3}>
              <RaisedButton
                href={'/filestore/v1/files/id?fileStoreId=' + doc.fileStore + '&tenantId=' + localStorage.getItem('tenantId')}
                download
                label={`file ${index + 1}`}
                style={{ marginBottom: 15 }}
                primary={true}
                fullWidth={true}
                labelPosition="before"
                icon={<FileDownload />}
              />
            </Col>
          );
        })
      );
    }
    // else {
    //   return <div>NA</div>
    // }
  };
  uploadDocs = () => {
    return _.times(this.state.allowedMax, idx => {
      if (
        _.get(this.props.formData, `${this.props.item.jsonPath}[${idx}]`) &&
        _.get(this.props.formData, `${this.props.item.jsonPath}[${idx}]`).name
      ) {
        //file exists from client side
        let fileName = _.get(this.props.formData, `${this.props.item.jsonPath}[${idx}]`).name;
        return (
          <Col xs={12} sm={4} md={3} lg={3} key={idx} className={idx < this.state.fileCount ? '' : 'hide'}>
            <RaisedButton
              download
              label={fileName.length > 15 ? fileName.substr(0, 12) + '...' : fileName}
              style={{ marginBottom: 15 }}
              primary={true}
              fullWidth={true}
              labelPosition="before"
              icon={<RemoveFile />}
              onTouchTap={event => {
                this.removeFile(`${this.props.item.jsonPath}[${idx}]`);
              }}
            />
          </Col>
        );
      } else {
        //allow them to upload file
        return (
          <Col xs={12} sm={4} md={3} lg={3} key={idx} className={idx < this.state.fileCount ? '' : 'hide'}>
            <div className="input-group">
              <input
                type="file"
                id={`file${idx}`}
                ref={`file${idx}`}
                className="form-control"
                onChange={e => {
                  this.props.handler({ target: { value: e.target.files[0] } }, `${this.props.item.jsonPath}[${idx}]`, false);
                }}
              />
            </div>
            <br />
          </Col>
        );
      }
    });
  };
  removeFile = jp => {
    this.props.handler({ target: { value: '' } }, jp, false);
  };
  render() {
    let { showDocs, uploadDocs, addFile } = this;
    let { item } = this.props;
    return (
      <Row>
        {showDocs()}
        {item.addRequired ? uploadDocs() : ''}
        {item.addRequired && this.state.fileCount != this.state.allowedMax ? (
          <Col xs={12} sm={4} md={3} lg={3}>
            <div
              className="material-icons"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                addFile();
              }}
            >
              add
            </div>
          </Col>
        ) : (
          ''
        )}
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  formData: state.frameworkForm.form,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UiDocuments);
