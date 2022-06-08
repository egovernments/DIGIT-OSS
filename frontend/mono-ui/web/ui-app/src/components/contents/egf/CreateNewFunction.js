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
import Api from '../../api/financialsApi';

//declare css in common file and include here
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

class NewFunction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: {
        checked: false,
      },
    };
  }

  componentWillMount() {
    //call boundary service fetch wards,location,zone data
  }

  componentDidMount() {
    let { initForm } = this.props;
    initForm();

    Api.commonApiPost('egf-masters', 'functionaries', '_search').then(
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

  handleCheckBoxChange = prevState => {
    this.setState(prevState => {
      prevState.isActive.checked = !prevState.isActive.checked;
    });
  };

  render() {
    let { NewFunction, handleChange, isFormValid, fieldErrors, buttonText } = this.props;
    return (
      <div className="NewFunction">
        <Card>
          //header style should be defined and reused
          <CardHeader title={<strong style={{ color: brown500 }}>Function</strong>} />
          <CardText>
            <Card>
              <CardText>
                <Grid>
                  <Row>
                    //xs md should be commonly defined and used
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.name ? fieldErrors.name : ''}
                        value={NewFunction.name ? NewFunction.name : ''}
                        onChange={e => handleChange(e, 'name', false, '')}
                        hintText="Name"
                        floatingLabelText="Name"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.code ? fieldErrors.code : ''}
                        value={NewFunction.code ? NewFunction.code : ''}
                        onChange={e => handleChange(e, 'code', false, '')}
                        hintText="Code "
                        floatingLabelText="Code"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <TextField
                        errorText={fieldErrors.level ? fieldErrors.level : ''}
                        value={NewFunction.level ? NewFunction.level : ''}
                        onChange={e => handleChange(e, 'level', false, '')}
                        hintText="Level"
                        floatingLabelText="Level"
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <Checkbox label="Active" style={styles.checkbox} onCheck={this.handleCheckBoxChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <SelectField
                        errorText={fieldErrors.parentType ? fieldErrors.parentType : ''}
                        value={NewFunction.parentType ? NewFunction.parentType : ''}
                        onChange={(event, index, value) => {
                          var e = {
                            target: {
                              value: value,
                            },
                          };
                          handleChange(e, 'parentType', false, '');
                        }}
                        floatingLabelText="Parent Type"
                      >
                        <MenuItem value={1} primaryText="Housing" />
                        <MenuItem value={2} primaryText="Welfare of Children" />
                        <MenuItem value={3} primaryText="Welfare of Aged" />
                        <MenuItem value={4} primaryText="Slum Improvements" />
                        <MenuItem value={5} primaryText="Urban Poverty Alleviation" />
                      </SelectField>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <Checkbox label="Isnotleaf" style={styles.checkbox} onCheck={this.handleCheckBoxChange} />
                    </Col>
                  </Row>
                </Grid>
              </CardText>
            </Card>

            <div style={{ float: 'center' }}>
              <RaisedButton type="submit" label="Create" backgroundColor={brown500} labelColor={white} />
              <RaisedButton label="Close" />
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}
//move to common page and resuse these functions
const mapStateToProps = state => ({
  NewFunction: state.form.form,
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

export default connect(mapStateToProps, mapDispatchToProps)(NewFunction);
