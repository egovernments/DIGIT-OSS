import React, { Component } from "react";
import { Icon, Card, Dialog } from "components";
import PropertyAddress from "./components/PropertyAddress";
//import AdditionalDetails from "./components/AdditionalDetails";
import AssessmentInfo from "./components/AssessmentInfo";
import OwnerInfo from "./components/OwnerInfo";
import AddRebateExemption from "./components/addRebateBox";
import PropertyTaxDetailsCard from "./components/PropertyTaxDetails";
import CalculationDetails from "./components/CalculationDetails";
import propertyAddressConfig from "./formConfigs/propertyAddress";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import EditIcon from "./components/EditIcon";

import "./index.css";
const defaultIconStyle = {
  fill: "#767676",
  width: 18,
  height: 20,
  marginLeft: 26,
  marginRight: 10,
  totalAmountTobePaid: "",
};

const PropAddressIcon = <Icon style={defaultIconStyle} color="#ffffff" action="action" name="home" className="review-title-icon"/>;
const AssessmentInfoIcon = <Icon style={defaultIconStyle} color="#ffffff" action="action" name="assessment"  className="review-title-icon"/>;
const OwnerInfoIcon = <Icon style={defaultIconStyle} color="#ffffff" action="social" name="person"  className="review-title-icon"/>;

const AddRebatePopUp = formHoc({ formKey: "additionalRebate", path: "PropertyTaxPay" })(AddRebateExemption);

class ReviewForm extends Component {
  state = {
    valueSelected: "",
    showRebateBox: false,
    calculationDetails: false,
  };

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
    onTabClick(index);
  };

  render() {
    let { addRebateBox, updateCalculation, onEditButtonClick } = this;
    let { showRebateBox } = this.state;
    let { stepZero, stepTwo, stepOne, estimationDetails, importantDates, totalAmount } = this.props;
    return (
      <div>
        <PropertyAddress icon={PropAddressIcon} editIcon={<EditIcon onIconClick={() => onEditButtonClick(0)} />} component={stepZero} />
        <AssessmentInfo icon={AssessmentInfoIcon} editIcon={<EditIcon onIconClick={() => onEditButtonClick(1)} />} component={stepOne} />
        <OwnerInfo icon={OwnerInfoIcon} editIcon={<EditIcon onIconClick={() => onEditButtonClick(2)} />} component={stepTwo} />
        <PropertyTaxDetailsCard
          estimationDetails={estimationDetails}
          importantDates={importantDates}
          addRebateBox={addRebateBox}
          openCalculationDetails={this.openCalculationDetails}
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

const mapDispatchToProps = (dispatch) => ({
  setRoute: (route) => dispatch({ type: "SET_ROUTE", route }),
});
export default connect(
  null,
  mapDispatchToProps
)(ReviewForm);
