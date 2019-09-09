import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Table } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import { brown500, red500, white } from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import AutoComplete from 'material-ui/AutoComplete';

const styles = {
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
  checkbox: {
    marginBottom: 16,
    marginTop: 24,
  },
};

class AddNewDetailedCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: {
        checked: false,
      },
      dataSource: [],
    };
  }

  componentWillMount() {
    //call boundary service fetch wards,location,zone data
  }

  componentDidMount() {
    let { initForm } = this.props;
    initForm();
  }

  componentWillUnmount() {}

  componentWillUpdate() {}

  componentDidUpdate(prevProps, prevState) {}

  handleCheckBoxChange = prevState => {
    this.setState(prevState => {
      prevState.isActive.checked = !prevState.isActive.checked;
    });
  };
  handleUpdateInput = value => {
    this.setState({
      dataSource: [value, value + value, value + value + value],
    });
  };

  render() {
    let { AddNewDetailedCode, handleChange, isFormValid, fieldErrors, buttonText } = this.props;
    return (
      <div className="AddNewDetailedCode">
        <Card>
          <CardHeader title={<strong style={{ color: brown500 }}>Add Detailed Chart Of Accounts</strong>} />
          <CardText>
            <Card>
              <CardText>
                <Grid>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.name ? fieldErrors.name : ''}
                        value={AddNewDetailedCode.name ? AddNewDetailedCode.name : ''}
                        onChange={e => handleChange(e, 'name', false, '')}
                        hintText="Parent Account Code"
                        floatingLabelText="Parent Account Code"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.code ? fieldErrors.code : ''}
                        value={AddNewDetailedCode.code ? AddNewDetailedCode.code : ''}
                        onChange={e => handleChange(e, 'code', false, '')}
                        hintText="Account Code "
                        floatingLabelText="Account Code"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.name ? fieldErrors.name : ''}
                        value={AddNewDetailedCode.name ? AddNewDetailedCode.name : ''}
                        onChange={e => handleChange(e, 'name', false, '')}
                        hintText="Name"
                        floatingLabelText="Name"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.description ? fieldErrors.description : ''}
                        value={AddNewDetailedCode.description ? AddNewDetailedCode.description : ''}
                        onChange={e => handleChange(e, 'description', false, '')}
                        hintText="Description "
                        floatingLabelText="Description"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <SelectField
                        errorText={fieldErrors.purpose ? fieldErrors.purpose : ''}
                        value={AddNewDetailedCode.purpose ? AddNewDetailedCode.purpose : ''}
                        onChange={(event, index, value) => {
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChange(e, 'purpose', false, '');
                        }}
                        floatingLabelText="Purpose "
                      >
                        <MenuItem value={1} primaryText="Accumulated Depreciation" />
                        <MenuItem value={2} primaryText="Bank Account Codes" />
                        <MenuItem value={3} primaryText="Bank Charges" />
                        <MenuItem value={4} primaryText="BPA Deposit CWIP Account Code" />
                        <MenuItem value={5} primaryText="Cash In Hand" />
                      </SelectField>
                    </Col>
                    <Col xs={12} md={6}>
                      <SelectField
                        multiple={true}
                        errorText={fieldErrors.purpose ? fieldErrors.purpose : ''}
                        value={AddNewDetailedCode.purpose ? AddNewDetailedCode.purpose : ''}
                        onChange={(event, index, value) => {
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChange(e, 'purpose', false, '');
                        }}
                        floatingLabelText="Purpose "
                      >
                        <MenuItem value={1} primaryText="Accumulated Depreciation" />
                        <MenuItem value={2} primaryText="Bank Account Codes" />
                        <MenuItem value={3} primaryText="Bank Charges" />
                        <MenuItem value={4} primaryText="BPA Deposit CWIP Account Code" />
                        <MenuItem value={5} primaryText="Cash In Hand" />
                      </SelectField>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      Parent Account Code:*
                      <AutoComplete
                        hintText="Ex: 123"
                        dataSource={this.state.dataSource}
                        onUpdateInput={this.handleUpdateInput}
                        floatingLabelText="Account Code"
                      />
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>

            <div style={{ float: 'center' }}>
              <RaisedButton type="submit" label="Search and View" backgroundColor={brown500} labelColor={white} />
              <RaisedButton label="Close" />
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  AddNewDetailedCode: state.form.form,
  fieldErrors: state.form.fieldErrors,
  isFormValid: state.form.isFormValid,
  isTableShow: state.form.showTable,
  buttonText: state.form.buttonText,
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

export default connect(mapStateToProps, mapDispatchToProps)(AddNewDetailedCode);
