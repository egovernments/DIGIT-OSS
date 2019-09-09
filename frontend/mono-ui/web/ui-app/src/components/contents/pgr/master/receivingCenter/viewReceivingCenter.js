import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

var _this;

class ViewReceivingCenter extends Component {
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

      Api.commonApiPost('/pgr-master/receivingcenter/v1/_search', { id: this.props.match.params.id }, {})
        .then(function(response) {
          current.setState({ data: response.ReceivingCenterType });
          setForm(response.ReceivingCenterType[0]);
        })
        .catch(error => {});
    }
  }

  componentDidMount() {}

  render() {
    let {
      viewReceivingCenter,
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
      <div className="viewReceivingCenter">
        <Grid style={{ width: '100%' }}>
          <Card style={{ margin: '15px 0' }}>
            <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}>{translate('pgr.lbl.receivingcenter')}</div>} />
            <CardText style={{ padding: '8px 16px 0' }}>
              <List>
                <Row>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.add.name')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingCenter.name ? viewReceivingCenter.name : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.code')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingCenter.code ? viewReceivingCenter.code : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.description')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingCenter.description ? viewReceivingCenter.description : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.active')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingCenter.active ? 'Yes' : 'No'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.crn')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingCenter.iscrnrequired ? 'Yes' : 'No'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.order.no')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingCenter.orderno ? viewReceivingCenter.orderno : ''}</p>}
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
    viewReceivingCenter: state.form.form,
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewReceivingCenter);
