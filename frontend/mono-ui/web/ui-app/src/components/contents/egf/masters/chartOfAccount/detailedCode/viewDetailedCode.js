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

class ChartOfAccontViewDetailedCode extends Component {
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
    let { ChartOfAccontViewDetailedCode, handleChange, isFormValid, fieldErrors, buttonText } = this.props;
    return (
      <div className="ChartOfAccontViewDetailedCode">
        <Card>
          <CardHeader title={<strong style={{ color: brown500 }}>Add Detailed Chart Of Accounts</strong>} />
          <CardText>
            <Card>
              <CardText>
                <Grid>
                  <Row>
                    <Col xs={12} md={6}>
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
  ChartOfAccontViewDetailedCode: state.form.form,
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

export default connect(mapStateToProps, mapDispatchToProps)(ChartOfAccontViewDetailedCode);
