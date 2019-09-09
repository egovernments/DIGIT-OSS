import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Api from '../../../api/api';
import _ from 'lodash';
import { translate } from '../../common/common';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';

export default class UiDocumentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
    };
  }

  renderFileObject = (item, i) => {
    let self = this;
    if (self.props.readonly) {
      return (
        <a
          href={
            window.location.origin +
            '/filestore/v1/files/id?tenantId=' +
            localStorage.tenantId +
            '&fileStoreId=' +
            self.props.getVal(item.jsonPath + '[' + i + '].fileStoreId')
          }
          target="_blank"
        >
          {translate('wc.craete.file.Download')}
        </a>
      );
    } else {
      return (
        <input
          type="file"
          onChange={e => {
            self.props.handler(
              { target: { value: e.target.files[0] } },
              item.jsonPath + '[' + i + '].fileStoreId',
              true,
              '',
              item.requiredErrMsg,
              item.patternErrMsg
            );
            self.props.handler(
              { target: { value: e.target.files[0].name } },
              item.jsonPath + '[' + i + '].name',
              true,
              '',
              item.requiredErrMsg,
              item.patternErrMsg
            );
          }}
        />
      );
    }
  };

  renderDocumentList = item => {
    let self = this;
    switch (this.props.ui) {
      case 'google':
        /*return self.state.documents.map(function(doc, i) {
					return (
						<Col xs={12} md={12}>
							<TextField
								id={item.jsonPath.split(".").join("-")}
								floatingLabelStyle={{"color": "#696969", "fontSize": "20px"}}
								floatingLabelFixed={true}
								fullWidth={true}
								type="text"
								floatingLabelText={<span>{item.label} <span style={{"color": "#FF0000"}}>{item.isRequired ? " *" : ""}</span></span>}
								value={self.props.getVal(item.jsonPath + "[" + i + "].name")}
								disabled={item.isDisabled}
								errorText={self.props.fieldErrors[item.jsonPath]}
								onChange={(e) => self.props.handler(e, (item.jsonPath + "[" + i + "].name"), true, '', '', '')} />
							<RaisedButton
							  containerElement='label'
							  fullWidth={true}
							  value={self.props.getVal(item.jsonPath + "[" + i + "].fileStoreId")}
							  label={doc["displayName"]}>
							    <input type="file" style={{ display: 'none' }} onChange={(e) => {
							    	self.props.handler({target:{value: e.target.files[0]}}, (item.jsonPath + "[" + i + "].fileStoreId"), true, '', item.requiredErrMsg, item.patternErrMsg)
							    	self.props.handler({target:{value: e.target.files[0].name}}, (item.jsonPath + "[" + i + "].name"), true, '', item.requiredErrMsg, item.patternErrMsg)
							    }}/>
							</RaisedButton>
						</Col>
					)
				})*/
        return (
          <Table className="table table-striped table-bordered" cellspacing="0" width="100%" responsive>
            <thead>
              <th>#</th>
              <th>{translate('reports.common.businesskey')}</th>
              <th>{translate('wc.create.name')}</th>
              <th>{translate('tl.create.license.table.file')}</th>
            </thead>
            <tbody>
              {self.state.documents.map(function(doc, i) {
                return (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{doc['displayName']}</td>
                    <td>
                      <TextField
                        fullWidth={true}
                        disabled={self.props.readonly}
                        type="text"
                        value={self.props.getVal(item.jsonPath + '[' + i + '].name')}
                        errorText={self.props.fieldErrors[item.jsonPath]}
                        onChange={e => self.props.handler(e, item.jsonPath + '[' + i + '].name', true, '', '', '')}
                      />
                    </td>
                    <td>{self.renderFileObject(item, i)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        );
    }
  };

  componentDidMount() {
    let self = this;
    let { item, useTimestamp, handler } = this.props;
    if (item.url) {
      var context = item.url.split('?')[0];
      var query = {};
      if (item.url.split('?')[1]) {
        var queryArr = item.url.split('?')[1].split('&');
        for (var i = 0; i < queryArr.length; i++) {
          query[queryArr[i].split('=')[0]] = queryArr[i].split('=')[1];
        }
      }

      Api.commonApiPost(context, query, {}, '', useTimestamp, false, null, item.appendUserInfo ? JSON.parse(localStorage.userRequest) : null).then(
        function(res) {
          var documents = [];
          var arr = _.get(res, item.pathToArray);
          if (arr && arr.length) {
            for (var k = 0; k < arr.length; k++) {
              var temp = {
                fileStoreId: '',
                displayName: arr[k][item.displayNameJsonPath],
                name: '',
              };
              for (var i = 0; i < item.autoFillFields.length; i++) {
                temp[item.autoFillFields[i].name] = arr[k][item.autoFillFields[i].jsonPath];
              }

              documents.push(temp);
            }

            self.setState({ documents }, function() {
              self.props.handler({ target: { value: documents } }, item.jsonPath, false, '');
            });
          }
        },
        function(err) {
          console.log(err);
        }
      );
    }
  }

  render() {
    return <div>{this.renderDocumentList(this.props.item)}</div>;
  }
}
