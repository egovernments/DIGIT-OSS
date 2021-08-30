import React, { Component } from 'react';
import { Row, Col, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FileDownload from 'material-ui/svg-icons/action/get-app';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import { translate } from '../common';
import styles from '../../../styles/material-ui';
var axios = require('axios');

class viewsrn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
    };
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.srn.lat !== 0 && nextprops.srn.lng !== 0 && (nextprops.srn.lat && nextprops.srn.lng))
      this.getAddress(nextprops.srn.lat, nextprops.srn.lng);
  }
  filesUploaded = () => {
    if (this.props.srn.files != undefined && this.props.srn.files.length > 0) {
      return this.props.srn.files.map((files, index) => {
        return (
          <Col xs={12} sm={6} md={4} lg={3} key={index}>
            <RaisedButton
              href={files.url}
              download
              label={'File ' + (index + 1)}
              primary={true}
              fullWidth={true}
              style={styles.marginStyle}
              labelPosition="before"
              icon={<FileDownload />}
            />
          </Col>
        );
      });
    }
  };
  getAddress = (lat, lng) => {
    var _this = this;
    axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true').then(function(response) {
      if (response.data.results.length > 0)
        _this.setState({
          address: response.data.results[0].formatted_address,
        });
    });
  };
  render() {
    return (
      <div>
        <Card style={styles.cardMargin}>
          <CardHeader style={styles.cardHeaderPadding} title={<div style={styles.headerStyle}>{translate('pgr.0061')}</div>} />
          <CardText style={styles.cardTextPadding}>
            <List>
              <Row>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('core.lbl.add.name')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.firstName}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('core.lbl.mobilenumber')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.phone ? this.props.srn.phone : 'N/A'}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('core.lbl.email.compulsory')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.email ? this.props.srn.email : 'N/A'}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('core.lbl.address')}
                    secondaryText={
                      <p style={styles.customColumnStyle}>{this.props.srn.systemRequesterAddress ? this.props.srn.systemRequesterAddress : 'N/A'}</p>
                    }
                  />
                </Col>
              </Row>
            </List>
          </CardText>
        </Card>
        <Card style={styles.cardMargin}>
          <CardHeader style={styles.cardHeaderPadding} title={<div style={styles.headerStyle}>{translate('pgr.lbl.grievancedetails')}</div>} />
          <CardText style={styles.cardTextPadding}>
            <List>
              <Row>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('core.lbl.description')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.description}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('pgr.lbl.grievance.type')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.serviceName}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('core.lbl.department')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.departmentName}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('pgr.lbl.registered.date')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.requestedDatetime}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('pgr.lbl.nextescalation.date')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.expectedDatetime}</p>}
                  />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('pgr.lbl.filedvia')}
                    secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.systemReceivingMode}</p>}
                  />
                </Col>
                {this.props.srn.receivingCenterName ? (
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.receivingcenter')}
                      secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.receivingCenterName}</p>}
                    />
                  </Col>
                ) : (
                  ''
                )}
                <Col xs={12} sm={6} md={4} lg={3}>
                  <ListItem
                    primaryText={translate('core.lbl.location')}
                    secondaryText={
                      <p style={styles.customColumnStyle}>
                        {this.state.address
                          ? this.state.address
                          : this.props.srn.childLocationName
                            ? this.props.srn.childLocationName + ' - ' + this.props.srn.locationName
                            : this.props.srn.locationName}
                      </p>
                    }
                  />
                </Col>
                {this.props.srn.address ? (
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.landmark')}
                      secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.address}</p>}
                    />
                  </Col>
                ) : (
                  ''
                )}
                {this.props.srn.systemExternalCRN ? (
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.externalcrn')}
                      secondaryText={<p style={styles.customColumnStyle}>{this.props.srn.systemExternalCRN}</p>}
                    />
                  </Col>
                ) : (
                  ''
                )}
              </Row>
              <div>
                {this.props.srn.files != undefined && this.props.srn.files.length > 0 ? (
                  <Row>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <ListItem primaryText={translate('pgr.lbl.files')} />
                    </Col>
                    {this.filesUploaded()}
                  </Row>
                ) : (
                  ''
                )}
              </div>
            </List>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default viewsrn;
