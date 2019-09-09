import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { translate, epochToDate } from '../../../common/common';
import Api from '../../../../api/api';
import styles from '../../../../styles/material-ui';

import $ from 'jquery';
import JSZip from 'jszip/dist/jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML 5 file export
import 'datatables.net-buttons/js/buttons.flash.js'; // Flash file export
import { fonts } from '../../../common/pdf-generation/PdfConfig';
pdfMake.fonts = fonts;
window.JSZip = JSZip;

export default class NoticeSearchResult extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }
  componentDidMount() {
    for (var k in this.props.noticeSearch) {
      if (!this.props.noticeSearch[k]) delete this.props.noticeSearch[k];
    }
    this.getSearchNotice(this.props.searchParams);
  }
  componentWillUpdate() {
    $('#searchTable')
      .DataTable()
      .destroy();
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.searchParams, this.props.searchParams)) {
      this.getSearchNotice(nextProps.searchParams);
    }
    // for(var k in nextProps.noticeSearch){
    //   if(!nextProps.noticeSearch[k])
    //     delete nextProps.noticeSearch[k];
    // }
    // if(_.isEqual(nextProps.searchParams, nextProps.noticeSearch)){
    //   this.getSearchNotice(nextProps.searchParams);
    // }
  }
  // shouldComponentUpdate(nextProps, nextState){
  //     for(var k in nextProps.noticeSearch){
  //       if(!nextProps.noticeSearch[k])
  //         delete nextProps.noticeSearch[k];
  //     }
  //     if(_.isEqual(nextProps.searchParams, nextProps.noticeSearch) && !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState))){
  //       return true;
  //     }else{
  //       return false;
  //     }
  // }
  componentDidUpdate(prevProps, prevState) {
    $('#searchTable').DataTable({
      dom: '<"col-md-4"l><"col-md-4"B><"col-md-4"f>rtip',
      buttons: [
        'excel',
        {
          extend: 'pdf',
          filename: 'Notice',
          title: 'Notice',
          orientation: 'landscape',
          pageSize: 'TABLOID',
          footer: true,
        },
      ],
      bDestroy: true,
      order: [],
    });
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  getSearchNotice = searchParams => {
    let { setLoadingStatus, handleError } = this.props;
    setLoadingStatus('loading');
    var self = this;
    Api.commonApiPost('tl-services/noticedocument/v1/_search', searchParams, {}, false, true).then(
      function(response) {
        self.setState(
          {
            noticeResponse: response.NoticeDocument,
          },
          setLoadingStatus('hide')
        );
      },
      function(err) {
        setLoadingStatus('hide');
        handleError(err.message);
      }
    );
  };
  showFile = fileStoreId => {
    var self = this;
    let { setLoadingStatus } = this.props;
    setLoadingStatus('loading');
    var fileURL = '/filestore/v1/files/id?fileStoreId=' + fileStoreId + '&tenantId=' + localStorage.getItem('tenantId');
    var oReq = new XMLHttpRequest();
    oReq.open('GET', fileURL, true);
    oReq.responseType = 'arraybuffer';
    // console.log(fileURL);
    oReq.onload = function(oEvent) {
      var blob = new Blob([oReq.response], {
        type: oReq.getResponseHeader('content-type'),
      });
      var url = URL.createObjectURL(blob);
      self.setState(
        {
          iframe_src: url,
          contentType: oReq.getResponseHeader('content-type'),
        },
        setLoadingStatus('hide')
      );
      self.handleOpen();
    };
    oReq.send();
  };
  viewer = () => {
    let contentType = this.state.contentType;
    if (contentType === 'application/pdf') {
      return <iframe title="Document" src={this.state.iframe_src} frameBorder="0" allowFullScreen height="500" width="100%" />;
    } else if (contentType === 'image/jpeg') {
      return <img src={this.state.iframe_src} style={{ width: '100%' }} alt="" />;
    } else {
      return <iframe title="Document" src={this.state.iframe_src} frameBorder="0" allowFullScreen height="500" width="100%" />;
    }
  };
  render() {
    const actions = [
      <FlatButton style={styles.marginStyle} href={this.state.iframe_src} label={translate('tl.download')} download primary={true} />,
      <FlatButton label={translate('core.lbl.cancel')} primary={true} onClick={this.handleClose} />,
    ];
    return (
      <Card style={styles.marginStyle}>
        <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('Search Notice')}</div>} />
        <CardText style={{ paddingTop: 0 }}>
          <Table id="searchTable">
            <thead>
              <tr>
                <th>{translate('tl.search.groups.applicationNumber')}</th>
                <th>{translate('tl.search.groups.licenseNumber')}</th>
                <th>{translate('tl.view.groups.feematrixtype.applicationtype')}</th>
                <th>{translate('tl.search.documenttype')}</th>
                <th>{translate('tl.view.workflow.history.date')}</th>
                <th>{translate('tl.search.result.groups.validityYears')}</th>
                <th>{translate('tl.search.groups.adminWardName')}</th>
                <th>{translate('tl.view.workflow.history.status')}</th>
                <th>{translate('tl.view.groups.tradeOwnerName')}</th>
                <th>{translate('tl.search.groups.mobileNumber')}</th>
                <th>{translate('tl.search.groups.tradeTitle')}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.noticeResponse &&
                this.state.noticeResponse.map((notice, index) => {
                  return (
                    <tr key={index} onClick={e => this.showFile(notice.fileStoreId)}>
                      <td>{notice.applicationNumber}</td>
                      <td>{notice.tradeLicenseNumber}</td>
                      <td>{notice.applicationType}</td>
                      <td>{notice.documentType}</td>
                      <td>{epochToDate(notice.date)}</td>
                      <td>{notice.validityYear}</td>
                      <td>{notice.wardName}</td>
                      <td>{notice.statusName}</td>
                      <td>{notice.ownerName}</td>
                      <td>{notice.mobileNumber}</td>
                      <td>{notice.tradeTitle}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </CardText>
        <Dialog
          title="Document"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={styles.dialogContent}
          bodyStyle={styles.dialogBody}
          style={styles.dialogRoot}
          repositionOnUpdate={false}
        >
          {this.viewer()}
        </Dialog>
      </Card>
    );
  }
}
