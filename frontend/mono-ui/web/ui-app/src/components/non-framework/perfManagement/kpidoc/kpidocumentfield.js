import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { translate } from '../../../common/common';
import { fileUpload } from '../../../framework/utility/utility';
import {grey500,grey50} from 'material-ui/styles/colors';

class KPIDocumentField extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      documents: [],
      open: false,
      cell:'',
      fileAttrList: [],
      currentFileName: [],
      currentFileStoreID: [],
      data:"",
    };
  }

  docUpload = () => {
    let { actionName, moduleName } = this.props;
    this.state.cell;
    //console.log(this.state.cell);
    //console.log(this.state.documents[this.state.cell.valueid]);
    if (this.state.documents[this.state.cell.valueid]) {
      this.state.documents[this.state.cell.valueid][this.state.cell.period].map((fileInfo, id) => {
      let valueid = this.state.cell.valueid;
      let period = this.state.cell.period;
      let code = fileInfo.code;
      let result = new Promise(function(resolve, reject) {
        fileUpload(fileInfo.file, moduleName, function(err, res) {
          if (err) {
            console.log('unable to upload');
          } else {
            resolve({ fileStoreId: res.files[0].fileStoreId, name: fileInfo.name, valueid: valueid, period: period, docCode: code });
          }
        });
      });

      result.then(file => {
        this.props.setUploadedFiles(file);
      });
    });

    this.props.switchDialog(false);

    }
    else{
      this.props.switchDialog(false);
    }

  };

  handleClose = () => {
    this.props.switchDialog(false);
  };

  handleFile(event, valueid, period, doc, index, docList, docCode) {
    let files = this.state.documents.slice();
    if (!files[valueid]) {
      files[valueid] = [];
    }
    if (!files[valueid][period]) {
      files[valueid][period] = [];
    }

    files[valueid][period][index] = { file: event.target.files[0], name: doc, code: docCode };
    this.setState({ documents: files });
    this.setState({ cell: { valueid: valueid, period: period } });

    docList.map((files, i) => {
      if (files.active) {
      }
    });
    //console.log(docList);
  }

  getFileDetails(filestoreID, self, valueid, period, code) {
    let result = new Promise(function(resolve, reject) {
      let url = '/filestore/v1/files/id?tenantId=' + localStorage.getItem('tenantId') + '&fileStoreId=' + filestoreID;

      var oReq = new XMLHttpRequest();
      oReq.open('GET', url, true);
      oReq.responseType = 'arraybuffer';
      oReq.onload = function(oEvent) {
        var blob = new Blob([oReq.response], { type: oReq.getResponseHeader('content-type') });
        var url = URL.createObjectURL(blob);

        let disposition = oReq.getResponseHeader('content-disposition');
        let filename = '';
        if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
            //self.setState({ currentFileName: filename, currentFileStoreID: filestoreID });

            resolve({ currentFileName: filename, currentFileStoreID: filestoreID });
          }
        }
      };
      oReq.send();
    });

    result.then(filename => {
      let fileDetails = self.state.currentFileName.slice();

      if (!fileDetails[valueid]) {
        fileDetails[valueid] = [];
      }
      if (!fileDetails[valueid][period]) {
        fileDetails[valueid][period] = [];
      }

      if (!fileDetails[valueid][period][code]) {
        fileDetails[valueid][period][code] = [];
      }
      fileDetails[valueid][period][code]['name'] = filename.currentFileName;
      fileDetails[valueid][period][code]['fileStoreId'] = filename.currentFileStoreID;
      //console.log(filename.currentFileStoreID, 'setting values');
      self.setState({ currentFileName: fileDetails, currentFileStoreID: filename.currentFileStoreID });
    });
  }



  renderFilePanel(self, item, i, code) {
    let displayFile = false;
    let fileNameArr = [];
    let storeID;
    //console.log(item);
    self.props.kpiresult.map(kpi => {
      //console.log(kpi,'kpi Value list');
      kpi.kpiValue.valueList.map(kpiValue => {

    if (kpiValue.documents) {    
         kpiValue.documents.map(kpidoc => {
          //console.log(kpidoc, 'elements :');

          let valueid = kpiValue.valueid;
          let period = kpiValue.period;

          if (kpidoc.fileStoreId) {
            if (!fileNameArr[valueid]) {
              fileNameArr[valueid] = [];
            }

            if (!fileNameArr[valueid][period]) {
              fileNameArr[valueid][period] = [];
            }

            if (kpidoc.code == code) {
              fileNameArr[valueid][period][kpidoc.code] = kpidoc.fileStoreId;
            }
          }
        });
       }

      });
    });

    //console.log('file details',self.state.currentFileName);
   
    let filestoreId = '';
    if (self.state.currentFileName &&
      self.state.currentFileName[self.props.cell.valueid] && 
      self.state.currentFileName[self.props.cell.valueid][self.props.cell.period] &&
      self.state.currentFileName[self.props.cell.valueid][self.props.cell.period][code]
      ) {
      filestoreId = self.state.currentFileName[self.props.cell.valueid][self.props.cell.period][code]['fileStoreId'];

      //console.log(code,'--filestore id map--',self.state.currentFileName[self.props.cell.valueid][self.props.cell.period][code]);
      //console.log('--check equality--',(self.state.currentFileName[self.props.cell.valueid][self.props.cell.period][code]['fileStoreId'] == fileNameArr[self.props.cell.valueid][self.props.cell.period][code]) );
    }
    if (
      fileNameArr[self.props.cell.valueid] &&
      fileNameArr[self.props.cell.valueid][self.props.cell.period] &&
      fileNameArr[self.props.cell.valueid][self.props.cell.period][code] &&
      filestoreId != fileNameArr[self.props.cell.valueid][self.props.cell.period][code]
    ) {
      //console.log('file id fetched',filestoreId);
      //console.log('file id',fileNameArr[self.props.cell.valueid][self.props.cell.period][code]);
      self.getFileDetails(
        fileNameArr[self.props.cell.valueid][self.props.cell.period][code],
        self,
        self.props.cell.valueid,
        self.props.cell.period,
        code
      );
    }

    let display = '';
    if (
      self.state.currentFileName[self.props.cell.valueid] &&
      self.state.currentFileName[self.props.cell.valueid][self.props.cell.period] &&
      self.state.currentFileName[self.props.cell.valueid][self.props.cell.period][code]
    ) {
      display = self.state.currentFileName[self.props.cell.valueid][self.props.cell.period][code]['name'];
    }

    // console.log(self.state.currentFileName, 'current file details ---');
    // console.log(self.props.cell.period, 'period ---');
    // console.log(code, 'code ---');
    // console.log(display, 'display');
    return [
        <Col xs={4} md={4}>
          <div ClassName="pull-left">
            <input
              id={'file_' + self.props.cell.valueid + self.props.cell.period}
              type="file"
              accept=".xls,.xlsx,.txt,.doc,.docx"
              onChange={e => self.handleFile(e, self.props.cell.valueid, self.props.cell.period, item.name, i, self.props.data, code)}
            />
          </div>
        </Col>,
        <Col xs={4} md={4}>
          {display && (
            <div ClassName="pull-right">
              <a
                href={
                  window.location.origin +
                  '/filestore/v1/files/id?tenantId=' +
                  localStorage.tenantId +
                  '&fileStoreId=' +
                  filestoreId
                }
                target="_blank"
              >
                {display}{' '}
              </a>
            </div>
          )}
        </Col>,
          <Col xs={2} md={2} >
            {display && (
              <FlatButton label="Delete" primary={true} onClick={(e) => this.unlinkKpiDoc(filestoreId,this,self.props.cell.valueid, self.props.cell.period,code)} />
            )}
          </Col>
        ];
  }


  unlinkKpiDoc(filestoreID,self, valueid, period, code)
  {

    //console.log('delete operation'+code);
    self.props.unlinkKpiDoc(filestoreID,valueid, period, code);

    let currentFileClone = self.state.currentFileName.slice();
     if (
      currentFileClone[valueid] &&
      currentFileClone[valueid][period] &&
      currentFileClone[valueid][period][code]
    ) {
      //currentFileClone[valueid][period][code];
      //console.log(currentFileClone[valueid][period],'file details');
      delete currentFileClone[valueid][period][code];
      //currentFileClone[valueid][period].splice(code, 1);
    }
    //console.log(currentFileClone,'currentFileClone');
    self.setState({ currentFileName: currentFileClone });
  }

  render() {
    const actions = [
      <FlatButton 
          label={translate('perfManagement.create.KPIs.groups.CANCEL')}
          primary={true} 
          onClick={this.handleClose.bind(this)}
          style={{marginRight:"10px"}} 
      />,
      <RaisedButton 
        label={translate('perfManagement.create.KPIs.groups.UPLOAD')}
        primary={true} 
        onClick={this.docUpload.bind(this)} 
      />,
    ];
    //this.setState({fileAttrList:this.props.data});
    //console.log('data array from here',this.props);
    return (
      <Dialog title={translate('perfManagement.create.KPIs.groups.kpidoc')} actions={actions} modal={true} open={this.props.open}>
        {this.props.data.length > 0 &&
          this.props.data.map((item, i) => {
            //console.log(item, 'render panel');
            return [
              <Row>
                <Col xs={2} md={2}>
                  <strong>{item.name}</strong>
                  {item.active && (
                    <span
                      style={{
                        color: '#FF0000',
                      }}
                    >
                      *
                    </span>
                  )}
                </Col>
                {this.renderFilePanel(this, item, i, item.code)}
              </Row>,
              <br />,
            ];
          })}
        {!this.props.data.length && (
          <Row>
            <Col xs={12} md={12}>
              {translate('perfManagement.create.KPIs.groups.nokpidoc')}
            </Col>
          </Row>
        )}
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  metaData: state.framework.metaData,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  formData: state.frameworkForm.form,
  fieldErrors: state.frameworkForm.fieldErrors,
  isFormValid: state.frameworkForm.isFormValid,
  requiredFields: state.frameworkForm.requiredFields,
  dropDownData: state.framework.dropDownData,
});

export default connect(mapStateToProps)(KPIDocumentField);
