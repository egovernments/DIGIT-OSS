import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

const style = {
  margin: 12,
};

const CashOrMops = () => {
  return (
    <div>
      <Col xs={12} md={12}>
        <TextField
          className="custom-form-control-for-textfield"
          floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
          floatingLabelFixed={true}
          floatingLabelText="Amount:"
        />
        <br />
        <TextField floatingLabelStyle={{ color: '#696969', fontSize: '20px' }} floatingLabelText="Paid By:" />
      </Col>
    </div>
  );
};

const ChequeOrDD = () => {
  return (
    <div>
      <Col xs={12} md={12}>
        <Col xs={12} md={6}>
          <TextField
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="DD/Cheque Number:"
          />
        </Col>
        <Col xs={12} md={6}>
          <DatePicker
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelText="DD/Cheque Date"
            container="inline"
          />
        </Col>
      </Col>

      <Col xs={12} md={12}>
        <Col xs={12} md={6}>
          <TextField
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="Bank Name:"
          />
        </Col>
        <Col xs={12} md={6}>
          <TextField
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="Branch Name:"
          />
        </Col>
      </Col>

      <Col xs={12} md={12}>
        <TextField
          className="custom-form-control-for-textfield"
          floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
          floatingLabelFixed={true}
          floatingLabelText="Amount:"
        />
        <br />
        <TextField floatingLabelStyle={{ color: '#696969', fontSize: '20px' }} floatingLabelText="Paid By:" />
      </Col>
    </div>
  );
};

const CreditOrDebitCard = () => {
  return (
    <div>
      <Col xs={12} md={12}>
        <Col xs={12} md={4}>
          <TextField
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="Last four digits of card:"
          />
        </Col>
        <Col xs={12} md={4}>
          <TextField
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="Transacttion Number:"
          />
        </Col>
        <Col xs={12} md={4}>
          <TextField
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="Re-enter Transacttion Number:"
          />
        </Col>
      </Col>
      <Col xs={12} md={12}>
        <TextField
          className="custom-form-control-for-textfield"
          floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
          floatingLabelFixed={true}
          floatingLabelText="Amount:"
        />
        <br />
        <TextField
          className="custom-form-control-for-textfield"
          floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
          floatingLabelFixed={true}
          floatingLabelText="Paid By:"
        />
      </Col>
    </div>
  );
};

const DirectBank = props => {
  return (
    <div>
      <Col xs={12} md={12}>
        <Col xs={12} md={6}>
          <TextField
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="Challan/Reference No"
          />
        </Col>
        <Col xs={12} md={6}>
          <DatePicker
            className="custom-form-control-for-textfield"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelText="Challan/Transaction Date"
            container="inline"
          />
        </Col>
      </Col>

      <Col xs={12} md={12}>
        <Col xs={12} md={6}>
          <SelectField
            className="custom-form-control-for-select"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="Bank Name"
            value={props.value.valueBankName}
            onChange={props.handleChange}
          >
            <MenuItem value={'null'} primaryText="--Select--" />
            <MenuItem value={'bank1'} primaryText="bank1" />
            <MenuItem value={'bank2'} primaryText="bank2" />
            <MenuItem value={'bank3'} primaryText="bank3" />
            <MenuItem value={'bank4'} primaryText="bank4" />
            <MenuItem value={'bank5'} primaryText="bank5" />
            <MenuItem value={'bank6'} primaryText="bank6" />
          </SelectField>
        </Col>
        <Col xs={12} md={6}>
          <SelectField
            className="custom-form-control-for-select"
            floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
            floatingLabelFixed={true}
            floatingLabelText="Account Number"
            value={props.value.valueActNum}
            onChange={(e, index, value) => {
              var e = {
                target: {
                  value: value,
                },
              };
              props.handleChange(e, 'valueBankName');
            }}
          >
            <MenuItem value={'null'} primaryText="--Select--" />
            <MenuItem value={'acc1'} primaryText="acc1" />
            <MenuItem value={'acc2'} primaryText="acc2" />
            <MenuItem value={'acc3'} primaryText="acc3" />
            <MenuItem value={'acc4'} primaryText="acc4" />
            <MenuItem value={'acc5'} primaryText="acc5" />
            <MenuItem value={'acc6'} primaryText="acc6" />
          </SelectField>
        </Col>
      </Col>
      <Col xs={12} md={12}>
        <TextField
          className="custom-form-control-for-textfield"
          floatingLabelStyle={{ color: '#696969', fontSize: '20px' }}
          floatingLabelFixed={true}
          floatingLabelText="Amount:"
        />
        <br />
        <TextField floatingLabelStyle={{ color: '#696969', fontSize: '20px' }} floatingLabelText="Paid By:" />
      </Col>
    </div>
  );
};

class CollectionsNew extends Component {
  state = {
    dropDown: {
      modeOfPayment: null,
      valueBankName: null,
      valueActNum: null,
    },
  };

  handleChange = (event, property) => {
    this.setState({
      dropdown: {
        ...this.state.dropdown,
        [property]: event.target.value,
      },
    });
  };

  render() {
    console.log(this.state.dropDown);
    let { modeOfPayment } = this.state.dropDown;
    return (
      <div>
        <card>
          <Col xs={12} md={6}>
            <h4>Total Amount To Be Received:</h4>
          </Col>

          <Col xs={12} md={6}>
            <h4>Total Amount Received:</h4>
          </Col>

          <Col xs={12} md={12}>
            <SelectField
              floatingLabelFixed={true}
              floatingLabelText="How would you like to pay?"
              value={modeOfPayment ? modeOfPayment : null}
              onChange={(e, index, value) => {
                let event = {
                  target: {
                    value: value,
                  },
                };
                this.handleChange(event, 'modeOfPayment');
              }}
            >
              >
              <MenuItem value={null} primaryText="" />
              <MenuItem value={1} primaryText="Cash" />
              <MenuItem value={2} primaryText="Cheque" />
              <MenuItem value={3} primaryText="DD" />
              <MenuItem value={4} primaryText="Credit/Debit Card" />
              <MenuItem value={5} primaryText="Direct Bank" />
              <MenuItem value={6} primaryText="SBI MOPS Bank Callan" />
            </SelectField>
          </Col>

          {this.state.dropDown.modeOfPayment == 1 && <CashOrMops />}
          {this.state.dropDown.modeOfPayment == 2 && <ChequeOrDD />}
          {this.state.dropDown.modeOfPayment == 3 && <ChequeOrDD />}
          {this.state.dropDown.modeOfPayment == 4 && <CreditOrDebitCard />}
          {this.state.dropDown.modeOfPayment == 5 && <DirectBank value={this.state.dropdown} handleChange={this.state.handleChange} />}
          {this.state.dropDown.modeOfPayment == 6 && <CashOrMops />}

          <Col xs={12} md={12}>
            <Col xs={12} md={2}>
              <RaisedButton label="Pay" primary={true} style={style} />
            </Col>
            <Col xs={12} md={2}>
              <RaisedButton label="Option2" secondary={true} style={style} />
            </Col>
            <Col xs={12} md={2}>
              <RaisedButton label="Option3" secondary={true} style={style} />
            </Col>
          </Col>

          <h4>Label3</h4>
        </card>
      </div>
    );
  }
}

export default CollectionsNew;
