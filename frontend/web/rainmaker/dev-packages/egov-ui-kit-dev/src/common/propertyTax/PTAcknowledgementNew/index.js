import { Button, Card } from "components";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-kit/utils/api";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import { getQueryValue } from "egov-ui-kit/utils/PTCommon";
import { formWizardConstants, getPurpose, PROPERTY_FORM_PURPOSE } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import FloatingActionButton from "material-ui/FloatingActionButton";
import React from "react";
import { connect } from "react-redux";
import store from "ui-redux/store";
import PTHeader from "../../common/PTHeader";
import "./index.css";

class PTAcknowledgement extends React.Component {
  state = {
    propertyId: "",
    fetchBill: false,
    fetchingBill: false,
    showPay: false,
  };

  componentDidMount = () => {
    const { location } = this.props;
    const { search } = location;
    const propertyId = getQueryValue(search, "propertyId");
    const tenantId = getQueryValue(search, "tenantId");

    this.setState({ propertyId: propertyId });
    loadUlbLogo(tenantId);
  };
  
  onGoHomeClick = () => {
    process.env.REACT_APP_NAME === "Employee" ? store.dispatch(setRoute("/property-tax/search-property")) : store.dispatch(setRoute("/property-tax"));
  };

  
  getFetchBillResponse = async (propertyId, tenantId) => {
    let showPay = false;
    let fetchBill = true;
    this.setState({ fetchingBill: true });
    const queryObject = [
      { key: "consumerCode", value: propertyId },
      { key: "tenantId", value: tenantId },
      { key: "businessService", value: "PT" },
    ];
    try {
      const payload = await httpRequest("billing-service/bill/v2/_fetchbill", "_search", queryObject);
      if (payload && payload.Bill.length > 0) {
        showPay = true;
      }
      this.setState({ showPay, fetchBill });
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    const {
      acknowledgeType = "success",
      propertiesById,
    } = this.props;
    const purpose = getPurpose();
    const status = getQueryArg(window.location.href, "status");
    const financialYear = getQueryArg(window.location.href, "FY");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const propertyId = getQueryArg(window.location.href, "propertyId") || "";
    const secondNumber = getQueryArg(window.location.href, "secondNumber") || "";
    const properties = propertiesById[propertyId];
    if (
      (purpose == PROPERTY_FORM_PURPOSE.ASSESS || purpose == PROPERTY_FORM_PURPOSE.REASSESS) &&
      !this.state.fetchBill &&
      !this.state.showPay &&
      !this.state.fetchingBill
    ) {
      this.getFetchBillResponse(propertyId, tenantId);
    }

    let icon;
    let iconColor;
    if (acknowledgeType == "success") {
      icon = "done";
      iconColor = "#39CB74";
    } else if (acknowledgeType == "failed") {
      icon = "close";
      iconColor = "#E54D42";
    } else {
      icon = "done";
      iconColor = "#39CB74";
    }
    let ptHeader = {};
    let ptMsg = {};
    let ptSubMsg = {};
    let Button1 = { name: "", onClick: "", visibility: false };
    let Button2 = { name: "", onClick: "", visibility: false };
    let Button3 = { name: "", onClick: "", visibility: false };
    let statusIcon = {};
    let ptIDLabel = {};
    if (purpose === PROPERTY_FORM_PURPOSE.CREATE && status === "success") {
      ptHeader = {
        labelName: "New Property",
        labelKey: formWizardConstants[purpose].header,
        dynamicArray: [financialYear],
        subheader: "propertyId",
        subHeaderValue: "propertyId",
      };

      ptMsg = {
        labelName: "New Property Application Submitted Successfully",
        labelKey: "PT_NEW_PROPERTY_SUCCESS_MSG",
      };
      ptSubMsg = {
        labelName: "A notification regarding new property application has been sent to property owner at registered Mobile No.",
        labelKey: "PT_NEW_PROPERTY_SUCCESS_SUB_MSG",
      };
      statusIcon = {
        icon: "done",
        iconColor: "#39CB74",
      };
      ptIDLabel = {
        labelName: "Poperty ID",
        labelKey: "PT_ACKNOWLEDGEMENT_ID",
        visibility: true,
      };
      Button1 = { name: "PT_GOHOME", buttonClick: this.onGoHomeClick, visibility: true };
     
    } else if (purpose === PROPERTY_FORM_PURPOSE.UPDATE && status === "success") {
      ptHeader = {
        labelName: "New Property",
        labelKey: formWizardConstants[purpose].header,
        dynamicArray: [financialYear],
        subheader: "propertyId",
        subHeaderValue: "propertyId",
      };

      ptMsg = {
        labelName: "New Property Application Submitted Successfully",
        labelKey: "PT_UPDATE_PROPERTY_SUCCESS_MSG",
      };
      ptSubMsg = {
        labelName: "A notification regarding new property application has been sent to property owner at registered Mobile No.",
        labelKey: "PT_UPDATE_PROPERTY_SUCCESS_SUB_MSG",
      };
      statusIcon = {
        icon: "done",
        iconColor: "#39CB74",
      };
      ptIDLabel = {
        labelName: "Poperty ID",
        labelKey: "PT_ACKNOWLEDGEMENT_ID",
        visibility: true,
      };
      Button1 = { name: "PT_GOHOME", buttonClick: this.onGoHomeClick, visibility: true };
      
    } else if (purpose === PROPERTY_FORM_PURPOSE.CREATE && status === "failure") {
      ptHeader = {
        labelName: "New Property",
        labelKey: formWizardConstants[purpose].header,
        dynamicArray: [financialYear],
      };
      ptMsg = {
        labelName: "New Property Application Submission Failed",
        labelKey: "PT_NEW_PROPERTY_FAILURE_MSG",
      };
      ptIDLabel = {
        labelName: "Poperty ID",
        labelKey: "PT_PROPERTY_ID",
        visibility: false,
      };
      statusIcon = {
        icon: "close",
        iconColor: "#E54D42",
      };
      ptSubMsg = {
        labelName: "A notification regarding new property application has been sent to property owner at registered Mobile No.",
        labelKey: "PT_NEW_PROPERTY_FAILURE_SUB_MSG",
      };

      Button1 = { name: "PT_GOHOME", buttonClick: this.onGoHomeClick, visibility: true };
    } else if (purpose === PROPERTY_FORM_PURPOSE.UPDATE && status === "failure") {
      ptHeader = {
        labelName: "New Property",
        labelKey: formWizardConstants[purpose].header,
        dynamicArray: [financialYear],
      };
      ptMsg = {
        labelName: "New Property Application Submission Failed",
        labelKey: "PT_UPDATE_PROPERTY_FAILURE_MSG",
      };
      ptIDLabel = {
        labelName: "Poperty ID",
        labelKey: "PT_PROPERTY_ID",
        visibility: false,
      };
      statusIcon = {
        icon: "close",
        iconColor: "#E54D42",
      };
      ptSubMsg = {
        labelName: "A notification regarding new property application has been sent to property owner at registered Mobile No.",
        labelKey: "PT_UPDATE_PROPERTY_FAILURE_SUB_MSG",
      };

      Button1 = { name: "PT_GOHOME", buttonClick: this.onGoHomeClick, visibility: true };
    } else if (purpose === PROPERTY_FORM_PURPOSE.ASSESS && status === "success") {
      ptHeader = {
        labelName: "Property Assessment",
        labelKey: formWizardConstants[purpose].header,
        dynamicArray: [financialYear],
      };
      ptIDLabel = {
        labelName: "Poperty ID",
        labelKey: "PT_ASSESSMENT_NUMBER",
        visibility: true,
      };
      statusIcon = {
        icon: "done",
        iconColor: "#39CB74",
      };
      ptMsg = {
        labelName: "Property Assessed Successfully",
        labelKey: "PT_PROPERTY_ASSESSMENT_SUCCESS_MSG",
      };
      ptSubMsg = {
        labelName: "A notification regarding property assessment has been sent to property owner at registered Mobile No.",
        labelKey: "PT_PROPERTY_ASSESSMENT_SUCCESS_SUB_MSG",
      };
      Button1 = { name: "PT_GOHOME", buttonClick: this.onGoHomeClick, visibility: true };
    } else if (purpose === PROPERTY_FORM_PURPOSE.ASSESS && status === "failure") {
      ptHeader = {
        labelName: "Property Assessment",
        labelKey: formWizardConstants[purpose].header,
        dynamicArray: [financialYear],
      };
      ptIDLabel = {
        labelName: "Poperty ID",
        labelKey: "PT_PROPERTY_ID",
        visibility: false,
      };
      statusIcon = {
        icon: "close",
        iconColor: "#E54D42",
      };
      ptMsg = {
        labelName: "Property Assessment Failed",
        labelKey: "PT_PROPERTY_ASSESSMENT_Failure_MSG",
      };
      ptSubMsg = {
        labelName: "A notification regarding property assessment has been sent to property owner at registered Mobile No.",
        labelKey: "PT_PROPERTY_ASSESSMENT_FAILURE_SUB_MSG",
      };
      Button1 = { name: "PT_GOHOME", buttonClick: this.onGoHomeClick, visibility: true };
    } else if (purpose === PROPERTY_FORM_PURPOSE.REASSESS && status === "success") {
      ptHeader = {
        labelName: "Re-Assess Property",
        labelKey: formWizardConstants[purpose].header,
        dynamicArray: [financialYear],
      };
      ptIDLabel = {
        labelName: "Poperty ID",
        labelKey: "PT_ASSESSMENT_NUMBER",
        visibility: true,
      };
      statusIcon = {
        icon: "done",
        iconColor: "#39CB74",
      };
      ptMsg = {
        labelName: "Assessment Updated Successfully",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT_SUCCESS_MSG",
      };
      ptSubMsg = {
        labelName: "A notification regarding property assessment has been sent to property owner at registered Mobile No.",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT_SUCCESS_SUB_MSG",
      };
      Button1 = { name: "PT_GOHOME", buttonClick: this.onGoHomeClick, visibility: true };
    } else if (purpose === PROPERTY_FORM_PURPOSE.REASSESS && status === "failure") {
      ptHeader = {
        labelName: "Re-Assess Property",
        labelKey: formWizardConstants[purpose].header,
        dynamicArray: [financialYear],
      };
      ptIDLabel = {
        labelName: "Poperty ID",
        labelKey: "PT_PROPERTY_ID",
        visibility: false,
      };
      statusIcon = {
        icon: "close",
        iconColor: "#E54D42",
      };
      ptMsg = {
        labelName: "Property Assessment Failed",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT_FAILED_MSG",
      };
      ptSubMsg = {
        labelName: "A notification regarding property reassessment has been sent to property owner at registered Mobile No.",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT_FAILURE_SUB_MSG",
      };
      Button1 = { name: "PT_GOHOME", buttonClick: this.onGoHomeClick, visibility: true };
    }
    return (
      <div>
        <div className="mainContainer flex-container">
          <PTHeader header={ptHeader && ptHeader.labelKey} subHeaderTitle="PT_PROPERTY_ID" subHeaderValue={propertyId} />
        </div>
        <div className="ptCards">
          <Card
            style={{ backgroundColor: "white" }}
            textChildren={
              <div className="MuiCardContent-root-97">
                <div className="ack-header MuiGrid-container-98" id="material-ui-applicationSuccessContainer">
                  <div
                    className="MuiAvatar-root-195 MuiAvatar-colorDefault-196"
                    id="material-ui-avatar"
                    style={{ width: "72px", height: "72px", backgroundColor: statusIcon.iconColor }}
                  >
                    <FloatingActionButton className="floating-button" style={{ boxShadow: 0 }} backgroundColor={statusIcon.iconColor}>
                      <i id="custom-atoms-body" className="material-icons" style={{ fontSize: "50px" }}>
                        {statusIcon.icon}
                      </i>
                    </FloatingActionButton>
                  </div>
                  <div className="ack-body" id="custom-atoms-body">
                    <h1 className="MuiTypography-root-8 MuiTypography-headline-13" id="material-ui-header">
                      <span id="custom-containers-key">
                        {" "}
                        <Label
                          className="ptMsg"
                          label={ptMsg.labelKey}
                          color="rgba(0, 0, 0, 0.87)"
                          fontSize="24px"
                          fontWeight="400"
                          fontFamily="Roboto"
                          lineHeight="1.35417em"
                        />
                      </span>
                    </h1>
                    <div className="ack-sub-body" id="custom-atoms-paragraph">
                      <span>
                        {" "}
                        <Label label={ptSubMsg.labelKey} color="rgba(0, 0, 0, 0.6)" fontFamily="Roboto" />
                      </span>
                    </div>
                  </div>
                  <div className="ack-text" id="custom-atoms-tail">
                    <h1
                      className="MuiTypography-root-8 MuiTypography-headline-13"
                      id="material-ui-text"
                      style={{ fontSize: "16px", fontWeight: "400", color: "rgba(0, 0, 0, 0.6)" }}
                    >
                      {ptIDLabel.visibility && (
                        <span>
                          <Label label={ptIDLabel.labelKey} fontSize="16px" fontWeight="400" color="rgba(0, 0, 0, 0.6)" />
                        </span>
                      )}
                    </h1>
                    <h1
                      className="MuiTypography-root-8 MuiTypography-headline-13"
                      id="material-ui-paragraph"
                      style={{ fontSize: "24px", fontWeight: "500" }}
                    >
                      {ptIDLabel.visibility && (
                        <span>
                          <Label label={secondNumber} fontSize="24px" color="rgba(0, 0, 0, 0.87)" fontWeight="500" />
                        </span>
                      )}
                    </h1>
                  </div>
                  <div id="tax-wizard-buttons" className="wizard-footer col-sm-12" style={{ textAlign: "right" }}>
                    <div
                      className="button-container col-xs-12 col-md-4 col-lg-2 property-info-access-btn first-button"
                      style={{ float: "right", right: "20px", width: "auto" }}
                    >
                      {Button1 && Button1.visibility && (
                        <Button
                          onClick={Button1.buttonClick}
                          label={<Label buttonLabel={true} label={Button1.name} fontSize="16px" />}
                          primary={true}
                          style={{ lineHeight: "auto", minWidth: "inherit", width: "200px" }}
                        />
                      )}
                     {properties && properties.source != "MUNICIPAL_RECORDS" && Button3 && Button3.visibility && (
                        <Button
                          onClick={Button3.buttonClick}
                          label={<Label buttonLabel={true} label={Button3.name} fontSize="16px" />}
                          primary={true}
                          style={{ marginLeft :"20px",lineHeight: "auto", minWidth: "inherit", width: "200px", backgroundColor: "white" }}
                        />
                      )}
                    </div>
                    <div className="button-container col-xs-12 col-md-4 col-lg-2 property-info-access-btn" style={{ float: "right", right: "30px" }}>
                      {Button2 && Button2.visibility && (
                        <Button
                          onClick={Button2.buttonClick}
                          label={<Label buttonLabel={true} label={Button2.name} fontSize="16px" />}
                          primary={true}
                          style={{ lineHeight: "auto", minWidth: "inherit", width: "200px", backgroundColor: "white" }}
                        />
                      )}
                    </div>
                   
                  </div>
                </div>
              </div>
            }
          />
        </div>
        <div className="print-application-conainer" style={{ position: "fixed", opacity: 0, zIndex: -9999, height: "100%" }}>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { location } = ownProps;
  const { search } = location;
  const propertyId = getQueryValue(search, "propertyId");
  const { screenConfiguration, common, app, properties } = state || {};
  let { propertiesById, totalBillAmountDue = 0, Assessments = [] } = properties;
  const { generalMDMSDataById } = common;
  const purpose = getQueryArg(window.location.href, "purpose");
  const { preparedFinalObject } = screenConfiguration;
  return {
    propertiesById,    
    common,
    app,
    generalMDMSDataById,     
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PTAcknowledgement);