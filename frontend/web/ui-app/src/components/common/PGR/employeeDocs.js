import React, { Component } from 'react';
import { Row, Col, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FileDownload from 'material-ui/svg-icons/action/get-app';
import styles from '../../../styles/material-ui';
import { translate } from '../common';

class employeeDocs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      available: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.srn && nextProps.srn[0].attribValues) {
      var docsarray = [];
      nextProps.srn[0].attribValues.map((attrib, index) => {
        if (attrib['key'].indexOf('employeeDocs') !== -1) {
          docsarray.push(attrib);
        }
      });
      this.setState({ docs: docsarray });
    }
  }
  docs = () => {
    return this.state.docs.map((attrib, index) => {
      if (attrib['key'].indexOf('employeeDocs') !== -1) {
        let key =
          attrib['key'].split(/_(.+)/)[1].length > 15 ? attrib['key'].split(/_(.+)/)[1].substr(0, 12) + '...' : attrib['key'].split(/_(.+)/)[1];
        return (
          <Col xs={12} sm={6} md={4} lg={3} key={index}>
            <RaisedButton
              href={'/filestore/v1/files/id?fileStoreId=' + attrib['name'] + '&tenantId=' + localStorage.getItem('tenantId')}
              download
              label={key}
              primary={true}
              fullWidth={true}
              style={styles.marginStyle}
              labelPosition="before"
              icon={<FileDownload />}
            />
          </Col>
        );
      }
    });
  };
  render() {
    return (
      <div>
        {this.state.docs != undefined && this.state.docs.length > 0 ? (
          <div>
            <Card style={styles.cardMargin}>
              <CardHeader style={styles.cardHeaderPadding} title={<div style={styles.headerStyle}>{translate('core.documents')}</div>} />
              <CardText style={styles.cardTextPadding}>
                <Row>{this.docs()}</Row>
              </CardText>
            </Card>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default employeeDocs;
