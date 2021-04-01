import React, { Component } from "react";

import PaymentAmountDetails from "../PaymentAmountDetails";
import CalculationDetails from "../CalculationDetails";
import PropertyTaxDetailsCard from "../PropertyTaxDetails";

import { Card } from "components";
import { httpRequest } from "egov-ui-kit/utils/api";
import { connect } from "react-redux";
import { MDMS } from "egov-ui-kit/utils/endPoints";

import {
  findCorrectDateObj,
  findCorrectDateObjPenaltyIntrest
} from "egov-ui-kit/utils/PTCommon";

import "./index.css";

class PaymentForm extends Component {
  state = {
    valueSelected: "Full_Amount",
    importantDates: {},
    totalAmountTobePaid: 0,
    errorText: "",
    pattern: false,
    minLength: 1,
    maxLength: 11,
    calculationDetails: false

  };

  // componentWillReceiveProps(nextProps) {
  //   let { estimationDetails: nextEstimationDetails } = nextProps;
  //   const { totalAmountToBePaid } = this.state
  //   const { totalAmount: nextTotalAmount } = this.props.estimationDetails[0] || 0
  //   if (totalAmountToBePaid !== nextTotalAmount && !isNaN(parseFloat(nextTotalAmount)) && isFinite(nextTotalAmount)) {
  //     this.setState({
  //       totalAmountTobePaid: nextTotalAmount,
  //     })
  //   }
  // }

  componentDidMount() {
    this.getImportantDates();
  }


  getImportantDates = async () => {
    const { currentTenantId } = this.props;
    try {
      let ImpDatesResponse = await httpRequest(
        MDMS.GET.URL,
        MDMS.GET.ACTION,
        [],
        {
          MdmsCriteria: {
            tenantId: currentTenantId,
            moduleDetails: [
              {
                moduleName: "PropertyTax",
                masterDetails: [
                  {
                    name: "Rebate"
                  },
                  {
                    name: "Penalty"
                  },
                  {
                    name: "Interest"
                  },
                  {
                    name: "FireCess"
                  }
                ]
              }
            ]
          }
        }
      );
      if (ImpDatesResponse && ImpDatesResponse.MdmsRes.PropertyTax) {
        const {
          Interest,
          FireCess,
          Rebate,
          Penalty
        } = ImpDatesResponse.MdmsRes.PropertyTax;
        const { financialYr } = this.props;
        const intrest = findCorrectDateObjPenaltyIntrest(financialYr, Interest);
        const fireCess = findCorrectDateObj(financialYr, FireCess);
        const rebate = findCorrectDateObj(financialYr, Rebate);
        const penalty = findCorrectDateObjPenaltyIntrest(financialYr, Penalty);
        this.setState({
          importantDates: {
            intrest,
            fireCess,
            rebate,
            penalty
          }
        });
      }
    } catch (e) {
      alert(e);
    }
  };

  getErrorMessage = value => {
    let { totalAmount } = this.props.estimationDetails[0] || {};
    let errorText = `amount should be numeric`;
    if (isFinite(value) && value >= totalAmount) {
      errorText = `can't be greater than ${parseInt(totalAmount) - 1}`;
    } else if (isFinite(value) && value <= 100) {
      errorText = "can't be less than 100";
    }
    return errorText;
  };

  handleFieldChange = (event, value) => {
    let { totalAmount } = this.props.estimationDetails[0] || {};
    if (
      isNaN(parseFloat(value)) ||
      !isFinite(value) ||
      value >= totalAmount ||
      value < 100
    ) {
      this.setState(
        {
          errorText: this.getErrorMessage(value)
        },
        () => {
          this.props.updateTotalAmount(
            value,
            this.state.valueSelected === "Full_Amount",
            this.state.errorText
          );
        }
      );
    } else {
      this.setState(
        {
          errorText: ""
        },
        () => {
          this.props.updateTotalAmount(
            value,
            this.state.valueSelected === "Full_Amount",
            this.state.errorText
          );
        }
      );
    }
  };

  updateTotalAmount = value =>
    this.props.updateTotalAmount(
      value,
      this.state.valueSelected === "Full_Amount",
      this.state.errorText
    );

  onRadioButtonChange = e => {
    let { estimationDetails } = this.props;
    let { totalAmount } = estimationDetails[0] || {};
    if (e.target.value === "Full_Amount") {
      this.setState(
        {
          totalAmountTobePaid: totalAmount,
          valueSelected: "Full_Amount",
          errorText: ""
        },
        () => {
          this.updateTotalAmount(this.props.totalAmountToBePaid);
        }
      );
    } else {
      this.setState(
        { totalAmountTobePaid: 0, valueSelected: "Partial_Amount" },
        () => {
          this.updateTotalAmount(100);
        }
      );
    }
  };



  openCalculationDetails = () => {
    this.setState({ calculationDetails: true });
  };

  closeCalculationDetails = () => {
    this.setState({ calculationDetails: false });
  };


  render() {
    let { handleFieldChange, onRadioButtonChange } = this;
    let { valueSelected, importantDates, errorText } = this.state;
    let {
      estimationDetails,
      totalAmountToBePaid,
      isPartialPaymentInValid,
    } = this.props;
    let { totalAmount } = estimationDetails[0] || {};
    return (
      <div>
        <Card

          textChildren={
            <div className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
              <PropertyTaxDetailsCard
                estimationDetails={estimationDetails}
                importantDates={importantDates}
                openCalculationDetails={this.openCalculationDetails}
                optionSelected={valueSelected}
              />
              {!this.props.isCompletePayment && (
                <CalculationDetails
                  open={this.state.calculationDetails}
                  data={this.props.calculationScreenData}
                  closeDialogue={() => this.closeCalculationDetails()}
                />
              )}
              {!isPartialPaymentInValid && (
                <PaymentAmountDetails
                  value={
                    valueSelected === "Partial_Amount"
                      ? totalAmountToBePaid
                      : totalAmount
                  }
                  onRadioButtonChange={onRadioButtonChange}
                  handleFieldChange={handleFieldChange}
                  optionSelected={valueSelected}
                  totalAmount={totalAmount && totalAmount}
                  estimationDetails={estimationDetails}
                  errorText={errorText}
                />
              )}
            </div>
          }
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setRoute: route => dispatch({ type: "SET_ROUTE", route })
});
export default connect(
  null,
  mapDispatchToProps
)(PaymentForm);
