import React, { Component } from "react";
import formHoc from "egov-ui-kit/hocs/form";
import { Button, TimeLine, Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import OwnerDetails from "./components/OwnerDetails";
import PropertyAddress from "./components/PropertyAddress";
import TaxAssessmentDetailsOne from "./components/TaxAssessmentDetailsOne";
import TaxAssessmentDetailsTwo from "./components/TaxAssessmentDetailsTwo";
import FullOrPartialExemption from "./components/FullOrPartialExemption";
import "./index.css";

const iconStyle = {
  display: "inline-block",
};

const activeStepperStyle = {
  width: 20,
  height: 20,
  boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.24)",
  backgroundColor: "#fe7a51",
  borderRadius: "50%",
  position: "relative",
  zIndex: 100,
};

const defaultStepperStyle = {
  width: 18,
  height: 18,
};

const formKey = "propertyTaxAssessment";
const OwnerDetailsHOC = formHoc({ formKey })(OwnerDetails);
const PropertyAddressHOC = formHoc({ formKey })(PropertyAddress);
const TaxAssessmentDetailsOneHOC = formHoc({ formKey })(TaxAssessmentDetailsOne);
const TaxAssessmentDetailsTwoHOC = formHoc({ formKey })(TaxAssessmentDetailsTwo);
const FullOrPartialExemptionHOC = formHoc({ formKey })(FullOrPartialExemption);

class AssessmentFormWizard extends Component {
  constructor(props) {
    super(props);
    const isBackFromMap = sessionStorage.getItem("backFromPTMap");
    this.state = {
      stepIndex: isBackFromMap ? 1 : 0,
    };
    isBackFromMap && sessionStorage.removeItem("backFromPTMap");

    this.wizardFields = [
      ["name", "fatherHusbandName", "aadharNumber", "mobileNumber", "address"],
      ["propertyNumber", "colony", "street", "location"],
      ["propertyType", "plotSize", "floorCount"],
      ["builtUpArea1", "builtUpArea2"],
      ["propertcategoryNumber", "referenceId", "proof"],
    ];
  }

  getWizardFields = (index) => (formFields) => {
    const fields = this.wizardFields[index];
    return fields.reduce((wizardFields, fieldKey) => {
      const field = formFields[fieldKey];
      wizardFields[fieldKey] = field;
      return wizardFields;
    }, {});
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex < 5) {
      this.setState({
        stepIndex: stepIndex + 1,
      });
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  getStepContent = (stepIndex, fields) => {
    const wizardFields = this.getWizardFields(stepIndex);
    switch (stepIndex) {
      case 0:
        return {
          component: <OwnerDetailsHOC wizardFields={wizardFields} />,
          trianglePos: "2%",
          iconName: "person",
          iconAction: "social",
          header: "Owner Details",
        };
      case 1:
        return {
          component: <PropertyAddressHOC wizardFields={wizardFields} />,
          trianglePos: "25%",
          iconName: "home",
          iconAction: "action",
          header: "Property Address",
        };
      case 2:
        return {
          component: <TaxAssessmentDetailsOneHOC wizardFields={wizardFields} />,
          trianglePos: "48%",
          iconName: "person",
          iconAction: "social",
          header: "Tax Assessment Details - 1",
        };
      case 3:
        return {
          component: <TaxAssessmentDetailsTwoHOC wizardFields={wizardFields} />,
          trianglePos: "70%",
          iconName: "person",
          iconAction: "social",
          header: "Tax Assessment Details - 2",
        };
      default:
        return {
          component: <FullOrPartialExemptionHOC wizardFields={wizardFields} />,
          trianglePos: "93%",
          iconName: "person",
          iconAction: "social",
          header: "Full/ Partial Exemption (if any)",
        };
    }
  };

  render() {
    const { stepIndex } = this.state;
    const { getStepContent } = this;
    const { component, iconAction, header, iconName, trianglePos } = getStepContent(stepIndex);

    const steps = [1, 2, 3, 4, 5].map((item, index) => {
      return {
        labelChildren: "",
        labelProps: {
          icon:
            this.state.stepIndex === index ? (
              <div style={activeStepperStyle} />
            ) : this.state.stepIndex > index ? (
              <Icon style={defaultStepperStyle} color="#ffffff" action="custom" name="check-circle" />
            ) : (
              <Icon style={defaultStepperStyle} color="#ffffff" action="custom" name="circle" />
            ),
          style: {
            padding: 0,
          },
          iconContainerStyle: {
            padding: 0,
            display: "flex",
          },
        },
      };
    });

    return (
      <div>
        <TimeLine
          stepperProps={{
            activeStep: stepIndex,
            style: { background: "rgb(0, 188, 209)", position: "relative", zIndex: 10000, padding: "0 24px" },
            connector: <div style={{ border: "1px solid #fff", width: "100%", marginLeft: "-2px", marginRight: "4px" }} />,
          }}
          steps={steps}
          horizontal={true}
        />
        
        <div>
          <Card
            style={{ margin: "24px 8px" }}
            textChildren={
              <div style={{ position: "relative" }}>
                <div style={{ left: trianglePos }} className="card-triangle" />
                <div className="pt-form-card-header-cont">
                  <Icon name={iconName} action={iconAction} style={iconStyle} />
                  <Label
                    label={header}
                    bold={true}
                    dark={true}
                    labelStyle={{ letterSpacing: 0.6 }}
                    containerStyle={{ display: "inline-block", marginLeft: 16 }}
                  />
                </div>
                {component}
              </div>
            }
          />
          <div className="flexbox-container">
            <div className="flex-item">
              <Button
                onClick={this.handlePrev}
                fullWidth={true}
                primary={true}
                label={<Label buttonLabel={true} label="PT_COMMONS_GO_BACK" color="#fe7a51" />}
              />
            </div>
            <div className="flex-item">
              <Button onClick={this.handleNext} fullWidth={true} label={<Label buttonLabel={true} label="PT_COMMONS_NEXT" color="#ffffff" />} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssessmentFormWizard;
