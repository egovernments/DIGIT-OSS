import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Api from '../../../../../api/api';
import styles from '../../../../../styles/material-ui';
import { translate } from '../../../../common/common';

var _this;

class viewReceivingSet extends Component {
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
      Api.commonApiPost('/pgr-master/receivingmode/v1/_search', { id: this.props.match.params.id }, {})
        .then(function(response) {
          current.setState({ data: response.ReceivingModeType });
          setForm(response.ReceivingModeType[0]);
        })
        .catch(error => {});
    }
  }

  render() {
    let {
      viewReceivingSet,
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
    console.log(viewReceivingSet.channels);
    return (
      <div className="viewReceivingSet">
        <Grid style={{ width: '100%' }}>
          <Card style={{ margin: '15px 0' }}>
            <CardHeader
              style={{ paddingBottom: 0 }}
              title={
                <div style={styles.headerStyle}>
                  {translate('pgr.lbl.view')} {translate('pgr.lbl.receivingmode')}
                </div>
              }
            />
            <CardText style={{ padding: '8px 16px 0' }}>
              <List>
                <Row>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.add.name')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingSet.name ? viewReceivingSet.name : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.code')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingSet.code ? viewReceivingSet.code : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('core.lbl.description')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingSet.description ? viewReceivingSet.description : ''}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.active')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingSet.active ? 'Yes' : 'No'}</p>}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={4} lg={3}>
                    <ListItem
                      primaryText={translate('pgr.lbl.channel')}
                      secondaryText={<p style={styles.customColumnStyle}>{viewReceivingSet.channels ? viewReceivingSet.channels.join(', ') : ''}</p>}
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
    viewReceivingSet: state.form.form,
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

export default connect(mapStateToProps, mapDispatchToProps)(viewReceivingSet);
