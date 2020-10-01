import { Card, Dialog, Icon } from "components";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import AssessmentInfo from 'egov-ui-kit/common/propertyTax/Property/components/AssessmentInfo';
import DocumentsInfo from "egov-ui-kit/common/propertyTax/Property/components/DocumentsInfo";
import OwnerInfo from 'egov-ui-kit/common/propertyTax/Property/components/OwnerInfo';
import PropertyAddressInfo from 'egov-ui-kit/common/propertyTax/Property/components/PropertyAddressInfo';
import { convertToArray } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyCreateUtils";
import formHoc from "egov-ui-kit/hocs/form";
import { formWizardConstants, getPurpose } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import AddRebateExemption from "./components/addRebateBox";
import CalculationDetails from "./components/CalculationDetails";
import EditIcon from "./components/EditIcon";
import PropertyTaxDetailsCard from "./components/PropertyTaxDetails";
import "./index.css";

const defaultIconStyle = {
  fill: "#767676",
  width: 18,
  height: 20,
  marginLeft: 26,
  marginRight: 10,
  totalAmountTobePaid: "",
};

const AddRebatePopUp = formHoc({ formKey: "additionalRebate", path: "PropertyTaxPay" })(AddRebateExemption);

class ReviewForm extends Component {
  state = {
    valueSelected: "",
    showRebateBox: false,
    calculationDetails: false,
  };

  componentDidMount() {
    this.props.getEstimates();
  }
  handleOptionsChange = (event, value) => {
    this.setState({ valueSelected: value });
  };

  onRadioButtonChange = (e) => {
    const inputValue = e.target.value;
    this.setState({ totalAmountTobePaid: inputValue });
  };

  addRebateBox = (show) => {
    this.setState({
      showRebateBox: show,
    });
  };

  updateCalculation = () => {
    this.addRebateBox(false);
    // const { updateEstimate } = this.props;
    // updateEstimate();
  };

  openCalculationDetails = () => {
    this.setState({ calculationDetails: true });
  };

  closeCalculationDetails = () => {
    this.setState({ calculationDetails: false });
  };

  editIcon = <Icon onClick={this.handleEdit} style={defaultIconStyle} color="#ffffff" action="image" name="edit" />;


  onEditButtonClick = index => {

    const { onTabClick, prepareFinalObject } = this.props;
    prepareFinalObject("propertiesEdited", true);
    onTabClick(index);
  };

  render() {
    let { addRebateBox, updateCalculation, onEditButtonClick } = this;
    let { showRebateBox } = this.state;
    let { stepZero, stepTwo, stepOne, estimationDetails, importantDates, totalAmount } = this.props;
    const { generalMDMSDataById = {}, location = {}, OldProperty } = this.props;
    const { search } = location;
    const purpose = getPurpose();


    return (
      <div>
        <Card
          textChildren={
            <div className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
              <div>
                <Label
                  labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                  label={'PT_APPLICATION_SUMMARY'}
                  fontSize="20px"
                />
              </div>
              {formWizardConstants[purpose].isEstimateDetails && <PropertyTaxDetailsCard
                estimationDetails={estimationDetails}
                importantDates={importantDates}
                addRebateBox={addRebateBox}
                openCalculationDetails={this.openCalculationDetails}
              />}
              <PropertyAddressInfo OldProperty={OldProperty} generalMDMSDataById={generalMDMSDataById} properties={this.props.properties} editIcon={formWizardConstants[purpose].isEditButton ? <EditIcon onIconClick={() => onEditButtonClick(0)} /> : null}></PropertyAddressInfo>
              <AssessmentInfo OldProperty={OldProperty} generalMDMSDataById={generalMDMSDataById} properties={this.props.properties} editIcon={formWizardConstants[purpose].isEditButton ? <EditIcon onIconClick={() => onEditButtonClick(1)} /> : null}></AssessmentInfo>
              <OwnerInfo OldProperty={OldProperty} generalMDMSDataById={generalMDMSDataById} properties={this.props.properties} editIcon={formWizardConstants[purpose].canEditOwner ? <EditIcon onIconClick={() => onEditButtonClick(2)} /> : null}></OwnerInfo>
              <DocumentsInfo generalMDMSDataById={generalMDMSDataById} documentsUploaded={this.props.documentsUploadRedux} editIcon={formWizardConstants[purpose].isEditButton ? <EditIcon onIconClick={() => onEditButtonClick(3)} /> : null}></DocumentsInfo>
            </div>
          }
        />
        {!this.props.isCompletePayment && (
          <CalculationDetails
            open={this.state.calculationDetails}
            data={this.props.calculationScreenData}
            closeDialogue={() => this.closeCalculationDetails()}
          />
        )}
        <div className="pt-rebate-exemption-box">
          <Dialog
            open={showRebateBox}
            children={[
              <div className="pt-rebate-box">
                <AddRebatePopUp handleClose={() => addRebateBox(false)} />
              </div>,
            ]}
            bodyStyle={{ backgroundColor: "#ffffff" }}
            isClose={true}
            handleClose={() => addRebateBox(false)}
            onRequestClose={() => addRebateBox(false)}
            contentStyle={{ width: "56%" }}
            contentClassName="rebate-modal-content"
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const { common = {}, screenConfiguration } = state;
  const { generalMDMSDataById } = common || {};
  const { preparedFinalObject } = screenConfiguration;
  let { documentsUploadRedux, OldProperty } = preparedFinalObject;
  documentsUploadRedux = convertToArray(documentsUploadRedux);
  return {
    ownProps,
    generalMDMSDataById,
    documentsUploadRedux,
    OldProperty
  };
};
const mapDispatchToProps = (dispatch) => ({
  setRoute: (route) => dispatch({ type: "SET_ROUTE", route }),
  prepareFinalObject: (jsonPath, value) =>
    dispatch(prepareFinalObject(jsonPath, value)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewForm);
