import React, { Component } from "react";
import { Icon, Card, Dialog } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import AddRebateExemption from "./components/addRebateBox";
import PropertyTaxDetailsCard from "./components/PropertyTaxDetails";
import CalculationDetails from "./components/CalculationDetails";
import propertyAddressConfig from "./formConfigs/propertyAddress";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import EditIcon from "./components/EditIcon";
import {getQueryValue,
  } from "egov-ui-kit/utils/PTCommon";
import { convertToArray } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyCreateUtils";
import PropertyAddressInfo from 'egov-ui-kit/common/propertyTax/Property/components/PropertyAddressInfo';
import AssessmentInfo from 'egov-ui-kit/common/propertyTax/Property/components/AssessmentInfo';
import OwnerInfo from 'egov-ui-kit/common/propertyTax/Property/components/OwnerInfo';
import DocumentsInfo from "egov-ui-kit/common/propertyTax/Property/components/DocumentsInfo";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";


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
    const { updateEstimate } = this.props;
    updateEstimate();
  };

  openCalculationDetails = () => {
    this.setState({ calculationDetails: true });
  };

  closeCalculationDetails = () => {
    this.setState({ calculationDetails: false });
  };

  editIcon = <Icon onClick={this.handleEdit} style={defaultIconStyle} color="#ffffff" action="image" name="edit" />;

  onEditButtonClick = (index) => {
    let { onTabClick } = this.props;
    this.props.prepareFinalObject("propertiesEdited", true);
    onTabClick(index);
  };

  render() {
    let { addRebateBox, updateCalculation, onEditButtonClick } = this;
    let { showRebateBox } = this.state;
    let { stepZero, stepTwo, stepOne, estimationDetails, importantDates, totalAmount } = this.props;
    const { generalMDMSDataById = {},location={} } = this.props;
    const { search } = location;
    const isReassess = Boolean(getQueryValue(search, "isReassesment").replace('false', ''));
    const isAssess = Boolean(getQueryValue(search, "isAssesment").replace('false', ''));
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
              {(isAssess||isReassess) && <PropertyTaxDetailsCard
                estimationDetails={estimationDetails}
                importantDates={importantDates}
                addRebateBox={addRebateBox}
                openCalculationDetails={this.openCalculationDetails}
              />}
              <PropertyAddressInfo generalMDMSDataById={generalMDMSDataById} properties={this.props.properties} editIcon={<EditIcon onIconClick={() => onEditButtonClick(0)} />}></PropertyAddressInfo>
              <AssessmentInfo generalMDMSDataById={generalMDMSDataById} properties={this.props.properties} editIcon={<EditIcon onIconClick={() => onEditButtonClick(1)} />}></AssessmentInfo>
              <OwnerInfo generalMDMSDataById={generalMDMSDataById} properties={this.props.properties} ></OwnerInfo>
              <DocumentsInfo generalMDMSDataById={generalMDMSDataById} documentsUploaded={this.props.documentsUploadRedux} editIcon={<EditIcon onIconClick={() => onEditButtonClick(3)} />}></DocumentsInfo>
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
                <AddRebatePopUp updateEstimate={updateCalculation} totalAmount={totalAmount} />
              </div>,
            ]}
            bodyStyle={{ backgroundColor: "#ffffff" }}
            isClose={false}
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
  const { preparedFinalObject} = screenConfiguration;
  let { documentsUploadRedux } = preparedFinalObject;
  documentsUploadRedux = convertToArray(documentsUploadRedux);
  return {
    ownProps,
    generalMDMSDataById,
    documentsUploadRedux
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
