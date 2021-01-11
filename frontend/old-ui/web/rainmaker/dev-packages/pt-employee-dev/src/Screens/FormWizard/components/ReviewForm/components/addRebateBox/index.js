import { Button, DropDown, TextField } from "components";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { displayFormErrors, setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { getFormattedEstimate } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import { connect } from "react-redux";

const labelStyle = {
  fontFamily: "Roboto",
  fontSize: 16,
  fontWeight: 500,
  fontStyle: "normal",
  letterSpacing: 0.7,
  color: "#484848",
  marginLeft: 14
};

class AddRebateExemption extends React.Component {
  state = {
    showExtraPenaltyField: false,
    showExtraExemptField: false,
    exemptValue: null,
    initialTaxValue: 0,
    isTaxValueInitialized: false
  };
  validateForm = () => {
    const { adhocPenalty,
      adhocPenaltyReason, adhocOtherPenaltyReason,
      adhocExemption,
      adhocExemptionReason, adhocOtherExemptionReason } = this.props;
    if ((adhocPenaltyReason == 'Others' && !(adhocOtherPenaltyReason && adhocOtherPenaltyReason.length > 0)) || (adhocExemptionReason == 'Others' && !(adhocOtherExemptionReason && adhocOtherExemptionReason.length > 0))) {
      alert('Enter Other Reason');
      return false
    }
    if (adhocPenalty && adhocPenalty != '' && Number(adhocPenalty) > 0 && (!adhocPenaltyReason || adhocPenaltyReason.length == 0)) {
      alert('Select any Reason');
      return false;
    } else if (adhocExemption && adhocExemption != '' && Number(adhocExemption) > 0 && (!adhocExemptionReason || adhocExemptionReason.length == 0)) {
      alert('Select any Reason');
      return false;
    }
    return true;
  }
  onChangePenaltyField = value => {
    let show = false;
    const { setFieldProperty } = this.props;
    if (value === "Others") {
      show = true;
      setFieldProperty(
        "additionalRebate",
        "otherPenaltyReason",
        "required",
        true
      );
    } else {
      show = false;
      setFieldProperty(
        "additionalRebate",
        "otherPenaltyReason",
        "required",
        false
      );
    }
    this.setState({
      showExtraPenaltyField: show
    });
    this.props.prepareFinalObject("adhocExemptionPenalty.adhocPenaltyReason", value);
  };
  onChangeExemptField = value => {
    let show = false;
    const { setFieldProperty } = this.props;
    if (value === "Others") {
      show = true;
      setFieldProperty(
        "additionalRebate",
        "otherExemptionReason",
        "required",
        true
      );
    } else {
      show = false;
      setFieldProperty(
        "additionalRebate",
        "otherExemptionReason",
        "required",
        false
      );
    }
    this.setState({
      showExtraExemptField: show
    });
    this.props.prepareFinalObject("adhocExemptionPenalty.adhocExemptionReason", value);
  };

  updateValueToEstimate = () => {
    let {

      adhocPenalty,
      adhocExemption, estimateResponse, prepareFinalObject
    } = this.props;

    adhocPenalty = adhocPenalty && adhocPenalty != '' ? Number.parseInt(adhocPenalty) : 0
    adhocExemption = adhocExemption && adhocExemption != '' ? Number.parseInt(adhocExemption) : 0
    estimateResponse = getFormattedEstimate(estimateResponse, adhocPenalty, adhocExemption)
    /*  let { taxHeadEstimates, initialAmount: totalAmount, adhocPenaltyAmt: initialAdhocPenaltyAmt, adhocExemptionAmt: initialAdhocExemptionAmt } = estimateResponse[0] || {};
 
     let adhocPenaltyAmt = adhocPenalty && adhocPenalty != '' ? Number.parseInt(adhocPenalty) : 0
     let adhocExemptionAmt = adhocExemption && adhocExemption != '' ? Number.parseInt(adhocExemption) : 0
     taxHeadEstimates.map(taxHead => {
       if (taxHead.taxHeadCode == "PT_TIME_PENALTY") {
         taxHead.estimateAmount = initialAdhocPenaltyAmt + adhocPenaltyAmt;
       }
       if (taxHead.taxHeadCode == "PT_TIME_REBATE") {
         taxHead.estimateAmount = initialAdhocExemptionAmt + adhocExemptionAmt;
       }
     }
     );
     estimateResponse[0].totalAmount = totalAmount + adhocPenaltyAmt - adhocExemptionAmt; */
    prepareFinalObject('estimateResponse', [...estimateResponse]);
  }

  onSubmit = () => {
    const {
      handleClose,
      displayFormErrors,
      adhocPenalty,
      additionalRebate, adhocExemption, estimateResponse
    } = this.props;

    const { exemptValue } = this.state;


    let { taxHeadEstimates, totalAmount } = estimateResponse[0] || {};
    let ownerExemption=0;
    taxHeadEstimates.map(taxHead => {
      if (taxHead.taxHeadCode == "PT_TAX") {
        totalAmount = taxHead.estimateAmount;
      }
      if (taxHead.taxHeadCode == "PT_OWNER_EXEMPTION") {
        ownerExemption = taxHead.estimateAmount||0;
      }
    });



    if (adhocExemption >= 0) {
      if (adhocExemption > totalAmount) {
        if (this.validateForm(additionalRebate)) {
          alert(
            "Adhoc Exemption cannot be greater than the estimated tax for the given property"
          );
          return;
        } else {
          displayFormErrors("additionalRebate");
        }
      } else {
        if (this.validateForm(additionalRebate)) {
          // exemptValue !== null &&
          // this.props.handleFieldChange("adhocExemption", exemptValue);
          // updateEstimate();
          if(ownerExemption+totalAmount==0){
            alert(
              "Adhoc Exemption cannot be applied for the given property as it has owner exemption"
            );
            return;
          }
          this.updateValueToEstimate();
          handleClose();
        } else {
          displayFormErrors("additionalRebate");
        }
      }
      displayFormErrors("additionalRebate");
    }
    if (adhocPenalty >= 0) {
      if (!this.validateForm(additionalRebate)) {
        displayFormErrors("additionalRebate");
      } else {
        this.updateValueToEstimate();
        handleClose();
        // updateEstimate();
      }
    }
  };
  resetFields = () => {
    this.props.prepareFinalObject('adhocExemptionPenalty', {});
  }
  componentDidMount = () => {
    this.resetFields();
  }

  render() {

    const { adhocPenalty,
      adhocPenaltyReason, adhocOtherPenaltyReason,
      adhocExemption,
      adhocExemptionReason, adhocOtherExemptionReason, estimateResponse, prepareFinalObject, fields } = this.props;
    let {
      adhocPenalty: adhocPenaltyForm,
      adhocPenaltyReason: adhocPenaltyReasonForm,
      adhocExemption: adhocExemptionForm,
      adhocExemptionReason: adhocExemptionReasonForm,
      otherExemptionReason: otherExemptionReasonForm,
      otherPenaltyReason: otherPenaltyReasonForm
    } = fields || {};

    let { taxHeadEstimates, totalAmount } = estimateResponse[0] || {};
    taxHeadEstimates.map(taxHead => {
      if (taxHead.taxHeadCode == "PT_TAX") {
        totalAmount = taxHead.estimateAmount;
      }
    });
    // const { handleFieldChange, fields,totalAmount } = this.props;
    const {
      showExtraExemptField,
      showExtraPenaltyField,
      exemptValue
    } = this.state;
    // let {
    //   adhocPenalty,
    //   adhocPenaltyReason,
    //   adhocExemption,
    //   adhocExemptionReason,
    //   otherExemptionReason,
    //   otherPenaltyReason
    // } = fields || {};
    if (!sessionStorage.getItem('taxValue')) {
      sessionStorage.setItem('taxValue', totalAmount)
    }
    if (!this.state.isTaxValueInitialized) {

      this.setState({
        isTaxValueInitialized: true,
        initialTaxValue: totalAmount
      })
    }
    // adhocExemption = { ...adhocExemption, value: exemptValue };



    //     adhocPenalty
    // adhocPenaltyReason
    // adhocExemption
    // adhocExemptionReason
    return (
      <div className="add-rebate-box">
        <div className="pt-emp-penalty-charges col-xs-12">
          <Label
            label="PT_ADDITIONAL_CHARGES"
            className="rebate-box-labels"
            labelStyle={labelStyle}
          />
          <div className="adhocPenalty col-sm-6 col-xs-12">
            <TextField
              onChange={(e, value) => prepareFinalObject("adhocExemptionPenalty.adhocPenalty", value)}
              // {...adhocPenalty}
              {...adhocPenaltyForm}
              value={adhocPenalty}

            />
          </div>
          <div className="adhocPenaltyReason col-sm-6 col-xs-12">
            <DropDown
              onChange={e => this.onChangePenaltyField(e.target.innerText)}
              {...adhocPenaltyReasonForm}
              value={adhocPenaltyReason}
            />
          </div>
          {showExtraPenaltyField && (
            <div className="col-sm-6 col-xs-12">
              <TextField
                onChange={(e, value) =>
                  prepareFinalObject("adhocExemptionPenalty.adhocOtherPenaltyReason", value)
                }
                fullWidth={true}
                {...otherPenaltyReasonForm}
                value={adhocOtherPenaltyReason}
              />
            </div>
          )}
        </div>
        <div className="pt-emp-rebate-charges col-xs-12">
          <Label

            label="PT_ADDITIONAL_REBATE"
            labelStyle={labelStyle} />
          <div className="adhocExemption col-sm-6 col-xs-12">
            <TextField
              onChange={(e, value) => prepareFinalObject("adhocExemptionPenalty.adhocExemption", value)}
              {...adhocExemptionForm}
              value={adhocExemption}
            />
          </div>
          <div className="adhocExemptionReason col-sm-6 col-xs-12">
            <DropDown
              onChange={e => this.onChangeExemptField(e.target.innerText)}
              {...adhocExemptionReasonForm}
              value={adhocExemptionReason}
            />
          </div>
          {showExtraExemptField && (
            <div className="col-sm-6 col-xs-12">
              <TextField
                onChange={(e, value) =>
                  prepareFinalObject("adhocExemptionPenalty.adhocOtherExemptionReason", value)
                }
                fullWidth={true}
                {...
                otherExemptionReasonForm}
                value={adhocOtherExemptionReason}
              />
            </div>
          )}
        </div>
        <div className="pt-rebate-box-btn">
          <Button
            primary={true}
            style={{
              boxShadow:
                "0 2px 5px 0 rgba(100, 100, 100, 0.5), 0 2px 10px 0 rgba(167, 167, 167, 0.5)"
            }}
            className="add-rebate-action-button"
            onClick={this.onSubmit}
            buttonLabel={true}
            label={<Label label="CS_COMMON_SUBMIT" buttonLabel={true} />}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration, form } = state;
  const { additionalRebate = {} } = form;
  const { fields = {} } = additionalRebate;

  const { preparedFinalObject } = screenConfiguration;
  let { estimateResponse = [], adhocExemptionPenalty = {} } = preparedFinalObject;
  let { adhocPenalty,
    adhocPenaltyReason, adhocOtherPenaltyReason,
    adhocExemption,
    adhocExemptionReason, adhocOtherExemptionReason } = adhocExemptionPenalty;

  return {
    adhocPenalty,
    adhocPenaltyReason, adhocOtherPenaltyReason,
    adhocExemption,
    adhocExemptionReason, adhocOtherExemptionReason, estimateResponse: [...estimateResponse], fields
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setFieldProperty: (formKey, fieldKey, propertyName, propertyValue) =>
      dispatch(
        setFieldProperty(formKey, fieldKey, propertyName, propertyValue)
      ),
    displayFormErrors: formKey => dispatch(displayFormErrors(formKey)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRebateExemption);
