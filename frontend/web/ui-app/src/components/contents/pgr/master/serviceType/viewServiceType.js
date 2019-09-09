import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { List, ListItem } from 'material-ui/List';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

var _this;

const getNameById = function(object, id, property = '') {
  console.log(object, id, property);
  if (id == '' || id == null) {
    return '';
  }
  for (var i = 0; i < object.length; i++) {
    if (property == '') {
      if (object[i].id == id) {
        console.log(object[i].name);
        return object[i].name;
      }
    } else {
      if (object[i].hasOwnProperty(property)) {
        if (object[i].id == id) {
          return object[i][property];
        }
      } else {
        return '';
      }
    }
  }
  return '';
};

class ViewServiceType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      data: '',
    };
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.setState({ id: this.props.match.params.id });
      let current = this;
      let { setForm } = this.props;

      Api.commonApiPost('/pgr-master/service/v1/_search', { id: this.props.match.params.id, keywords: 'complaint' }, {})
        .then(function(response) {
          console.log(response);
          current.setState({ data: response.Service });
          setForm(response.Service[0]);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    let { setForm } = this.props;

    _this = this;

    Api.commonApiPost('/pgr-master/serviceGroup/v1/_search', {
      keyword: 'complaint',
    }).then(
      function(response) {
        _this.setState({
          categorySource: response.ServiceGroups,
        });
      },
      function(err) {
        _this.setState({
          categorySource: [],
        });
      }
    );
  }

  render() {
    let { categorySource } = this.state;
    let {
      viewServiceType,
      fieldErrors,
      isFormValid,
      isTableShow,
      handleUpload,
      files,
      handleChange,
      handleMap,
      handleChangeNextOne,
      handleChangeNextTwo,
      buttonText,
    } = this.props;

    let { submitForm } = this;

    return (
      <div className="viewServiceType">
        <Grid style={{ width: '100%' }}>
          <Card style={{ margin: '15px 0' }}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}>View Grievance Type</div>} />
            <CardText style={{ padding: '8px 16px 0' }}>
              <List>
                <Row>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.add.name')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewServiceType.serviceName ? viewServiceType.serviceName : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.code')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewServiceType.serviceCode ? viewServiceType.serviceCode : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.service.localName')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewServiceType.localName ? viewServiceType.localName : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.description')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewServiceType.description ? viewServiceType.description : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.active')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewServiceType.active ? 'Yes' : 'No'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.category')}
                      secondaryText={
                        <p style={styles.customColumnStyle}>
                          {getNameById(categorySource, viewServiceType.category) ? getNameById(categorySource, viewServiceType.category) : ''}
                        </p>
                      }
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.slahour')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewServiceType.slaHours ? viewServiceType.slaHours : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.finimpact')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewServiceType.hasFinancialImpact ? 'Yes' : 'No'}</p>}
                    />
                  </Col>
                </Row>
              </List>
            </CardText>
          </Card>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    viewServiceType: state.form.form,
    files: state.form.files,
    fieldErrors: state.form.fieldErrors,
    isFormValid: state.form.isFormValid,
  };
};

const mapDispatchToProps = dispatch => ({
  setForm: data => {
    dispatch({
      type: 'SET_FORM',
      data,
      isFormValid: true,
      fieldErrors: {},
      validationData: {
        required: {
          current: [],
          required: [],
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewServiceType);
