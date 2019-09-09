import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white } from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
// import DataTable from '../common/Table';
import Api from '../../../api/api';

const styles = {
  errorStyle: {
    color: red500,
  },
};

class ViewFunction extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    //call boundary service fetch wards,location,zone data
  }

  componentDidMount() {
    let { initForm } = this.props;
    initForm();

    Api.commonApiPost('egf-masters/functions/_search', { id: 1 }).then(
      function(response) {
        console.log(response);
      },
      function(err) {
        console.log(err);
      }
    );
  }

  componentWillUnmount() {}

  componentWillUpdate() {}

  componentDidUpdate(prevProps, prevState) {}

  render() {
    let { viewFunction, handleChange, isFormValid, fieldErrors } = this.props;

    console.log(viewFunction);

    return (
      <div className="ViewFunction">
        <Card>
          <CardHeader title={<strong style={{ color: brown500 }}>Search Function</strong>} />
          <CardText>
            <Card>
              <CardText>
                <Grid>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.name ? fieldErrors.name : ''}
                        value={viewFunction.name ? viewFunction.name : ''}
                        onChange={e => handleChange(e, 'name', false, '')}
                        hintText="Name"
                        floatingLabelText="Name"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.code ? fieldErrors.code : ''}
                        value={viewFunction.code ? viewFunction.code : ''}
                        onChange={e => handleChange(e, 'code', false, '')}
                        hintText="Code "
                        floatingLabelText="Code"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <br />
                      <br />
                      <Checkbox
                        label="Active"
                        style={styles.checkbox}
                        defaultChecked={viewFunction.isActive}
                        onCheck={(e, i, v) => {
                          var e = {
                            target: {
                              value: i,
                            },
                          };
                          handleChange(e, 'isActive', false, '');
                        }}
                      />
                    </Col>

                    <Col xs={12} md={6}>
                      <SelectField
                        errorText={fieldErrors.parentType ? fieldErrors.parentType : ''}
                        value={viewFunction.parentType ? viewFunction.parentType : ''}
                        onChange={(event, index, value) => {
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChange(e, 'parentType', false, '');
                        }}
                        floatingLabelText="Parent Type "
                      >
                        <MenuItem value={1} primaryText="Housing" />
                        <MenuItem value={2} primaryText="Welfare of Children" />
                        <MenuItem value={3} primaryText="Welfare of Aged" />
                        <MenuItem value={4} primaryText="Slum Improvements" />
                        <MenuItem value={5} primaryText="Urban Poverty Alleviation" />
                      </SelectField>
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>

            <div style={{ float: 'center' }}>
              <RaisedButton type="button" label="Search" backgroundColor={brown500} labelColor={white} />
              <RaisedButton label="Close" />
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  viewFunction: state.form.form,
  fieldErrors: state.form.fieldErrors,
  isFormValid: state.form.isFormValid,
});

const mapDispatchToProps = dispatch => ({
  initForm: () => {
    dispatch({
      type: 'RESET_STATE',
      validationData: {
        required: {
          current: [],
          required: [],
        },
      },
    });
  },
  handleChange: (e, property, isRequired, pattern) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      property,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewFunction);
