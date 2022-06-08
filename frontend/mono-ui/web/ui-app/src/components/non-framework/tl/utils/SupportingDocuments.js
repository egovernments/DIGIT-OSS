import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { translate, validate_fileupload } from '../../../common/common';
import FileInput from './FileInput';
import TextField from 'material-ui/TextField';
const constants = require('../../../common/constants');

const customStyles = {
  cardTitle: {
    padding: '16px 16px 0',
  },
  th: {
    padding: '15px 10px !important',
  },
};

export default class SupportingDocuments extends Component {
  constructor() {
    super();
    this.fileInputOnChange = this.fileInputOnChange.bind(this);
  }

  fileInputOnChange(e, doc) {
    e.preventDefault();
    var files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    // console.log(e.target.files);
    // console.log(doc);

    if (!files) return;

    //validate file input
    let validationResult = validate_fileupload(files, constants.TRADE_LICENSE_FILE_FORMATS_ALLOWED);

    // console.log('validationResult', validationResult);

    if (typeof validationResult === 'string' || !validationResult) {
      if (this.props.dialogOpener) this.props.dialogOpener(true, validationResult);
      return;
    }

    var existingFile = this.props.files ? this.props.files.find(file => file.code == doc.id) : undefined;
    if (existingFile && existingFile.files && existingFile.files.length > 0) {
      this.props.removeFile({
        isRequired: doc.mandatory,
        code: doc.id,
        name: existingFile.files[0].name,
      });
    }
    this.props.addFile({
      isRequired: doc.mandatory,
      code: doc.id,
      files: [...files],
    });
  }

  render() {
    const props = this.props;
    // console.log('files', this.props.docs);

    return (
      <Card>
        <CardTitle style={customStyles.cardTitle} title={translate(props.title)} />
        <CardText>
          <Grid fluid={true}>
            <Row>
              <Col xs={12} lg={12} sm={12} md={12}>
                <Table style={{ width: '100%' }} responsive>
                  <thead>
                    <tr>
                      <th style={customStyles.th}>#</th>
                      <th style={customStyles.th}>{translate('tl.create.license.table.documentTypeName')}</th>
                      <th style={customStyles.th}>{translate('tl.create.license.table.attachDocument')}</th>
                      <th style={customStyles.th}>{translate('tl.create.license.table.comments')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.docs &&
                      props.docs.map((doc, index) => {
                        if (doc.enabled) {
                          var file = this.props.files && this.props.files.find(file => file.code === doc.id);
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <span>
                                  {translate(doc.name)}
                                  <span style={{ color: '#FF0000' }}>{doc.mandatory ? ' *' : ''}</span>
                                </span>
                              </td>
                              <td>
                                <FileInput
                                  doc={doc}
                                  id={`file_${index}`}
                                  key={`file${index}`}
                                  file={file || null}
                                  fileInputOnChange={this.fileInputOnChange}
                                />
                              </td>
                              <td>
                                <TextField
                                  id={`file_${index}_comments`}
                                  hintText={translate('tl.create.license.table.comments')}
                                  multiLine={true}
                                  fullWidth={true}
                                  value={this.props.comments[`${doc.id}_comments`]}
                                  onChange={(e, newValue) => {
                                    this.props.fileSectionChange(newValue, doc);
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        }
                      })}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Grid>
        </CardText>
      </Card>
    );
  }
}
