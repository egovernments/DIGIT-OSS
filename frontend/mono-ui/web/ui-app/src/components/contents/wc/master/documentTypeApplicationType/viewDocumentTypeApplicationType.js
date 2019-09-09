import React, { Component } from 'react';
import { connect } from 'react-redux';
import SimpleMap from '../../../../common/GoogleMaps.js';
import Divider from 'material-ui/Divider';
import { Grid, Row, Col, DropdownButton, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import { brown500, red500, white, orange800 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Api from '../../../../../api/api';
import { translate } from '../../../../common/common';

var flag = 0;
const styles = {
  headerStyle: {
    fontSize: 19,
  },
  marginStyle: {
    margin: '15px',
  },
  paddingStyle: {
    padding: '15px',
  },
  errorStyle: {
    color: red500,
  },
  underlineStyle: {
    borderColor: brown500,
  },
  underlineFocusStyle: {
    borderColor: brown500,
  },
  floatingLabelStyle: {
    color: brown500,
  },
  floatingLabelFocusStyle: {
    color: brown500,
  },
  customWidth: {
    width: 100,
  },
  checkbox: {
    marginTop: 37,
  },
  bold: {
    fontWeight: 'bolder',
  },
};

var _this;

class ViewCategoryType extends Component {
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

      Api.commonApiPost('/wcms/masters/categorytype/_search', { id: this.props.match.params.id }, {}, false, true)
        .then(function(response) {
          console.log(response);
          current.setState({ data: response.CategoryTypes });
          setForm(response.CategoryTypes[0]);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  componentDidMount() {}

  render() {
    let {
      viewCategoryType,
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

    console.log(isFormValid);

    return (
      <div className="viewCategoryType">
        <Card style={styles.marginStyle}>
          <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}>View Category Type</div>} />
          <CardText style={{ padding: 0 }}>
            <Grid>
              <br />
              <Card>
                <CardText>
                  <ListGroup>
                    <ListGroupItem>
                      <Row>
                        <Col xs={4} md={2} style={styles.bold}>
                          {translate('core.lbl.code')}
                        </Col>
                        <Col xs={8} md={10}>
                          {viewCategoryType.code ? viewCategoryType.code : ''}
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col xs={4} md={2} style={styles.bold}>
                          {translate('core.lbl.add.name')}
                        </Col>
                        <Col xs={8} md={10}>
                          {viewCategoryType.name ? viewCategoryType.name : ''}
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col xs={4} md={2} style={styles.bold}>
                          {translate('core.lbl.description')}
                        </Col>
                        <Col xs={8} md={10}>
                          {viewCategoryType.description ? viewCategoryType.description : ''}
                        </Col>
                      </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                      <Row>
                        <Col xs={4} md={2} style={styles.bold}>
                          {translate('pgr.lbl.active')}
                        </Col>
                        <Col xs={8} md={10}>
                          {viewCategoryType.active ? 'true' : 'false'}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </CardText>
              </Card>
            </Grid>
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    viewCategoryType: state.form.form,
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewCategoryType);
