import { Card } from "components";
import commonConfig from "config/common.js";
import Label from "egov-ui-kit/utils/translationNode";
import { businessServiceInfo } from "egov-ui-kit/utils/commons";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";
import AssessmentInfo from "../../../Property/components/AssessmentInfo";
import DocumentsInfo from "../../../Property/components/DocumentsInfo";
import OwnerInfo from "../../../Property/components/OwnerInfo";
import PdfHeader from "../../../Property/components/PdfHeader";
import PropertyAddressInfo from "../../../Property/components/PropertyAddressInfo";
import TotalDues from "../../../Property/components/TotalDues";
import ApplicationHistory from "./components/ApplicationHistory";
import AssessmentHistory from "./components/AssessmentHistory";
import PaymentHistory from "./components/PaymentHistory";
import "./index.css";

const logoStyle = {
  height: "61px",
  width: "60px",
};

class PTInformation extends React.Component {
  state = {
    businessServiceInfoItem: {}
  }
  componentDidMount = () => {
    const mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "BillingService",
            masterDetails: [{ name: "BusinessService" }]
          }
        ]
      }
    };
    const businessServiceInfoItem = businessServiceInfo(mdmsBody, "PT");
    this.setState({businessServiceInfoItem});
  }
  updateProperty = () => {
    let {
      propertiesAudit,
      properties
    } = this.props;
    if (propertiesAudit.length === 0) propertiesAudit.push(properties);
    let Owners = [];
    let Institution = null;
    let ownershipCategory = '';
    propertiesAudit.reverse().map(property => {
      if (property.status == "ACTIVE") {
        Owners = property.owners.filter(owner => owner.status == "ACTIVE");
        Institution = property.institution;
        ownershipCategory = property.ownershipCategory;
      }
    })
    if (Owners.length == 0) {
      Owners = propertiesAudit[0].owners.filter(owner => owner.status == "ACTIVE");
      Institution = propertiesAudit[0].institution;
      ownershipCategory = propertiesAudit[0].ownershipCategory;
    }
    return { owners: Owners, institution: Institution, ownershipCategory };


  }
  getLogoUrl = (tenantId) => {
    const { cities } = this.props
    const filteredCity = cities && cities.length > 0 && cities.filter(item => item.code === tenantId);
    return filteredCity ? get(filteredCity[0], "logoId") : "";
  }

  render() {
    const {
      label,
      properties,
      generalMDMSDataById,
      totalBillAmountDue,
      documentsUploaded,
      toggleSnackbarAndSetText,
      cities,
      propertiesAudit
    } = this.props;
    const { businessServiceInfoItem } = this.state;
    let logoUrl = "";
    let corpCity = "";
    let ulbGrade = "";
    if (get(properties, "tenantId")) {
      let tenantid = get(properties, "tenantId");
      // logoUrl = get(properties, "tenantId") ? this.getLogoUrl(get(properties, "tenantId")) : "";
      logoUrl = window.location.origin + `/${commonConfig.tenantId}-egov-assets/${tenantid}/logo.png`;
      corpCity = `TENANT_TENANTS_${get(properties, "tenantId").toUpperCase().replace(/[.:-\s\/]/g, "_")}`;
      const selectedCityObject = cities && cities.length > 0 && cities.filter(item => item.code === get(properties, "tenantId"));
      ulbGrade = selectedCityObject ? `ULBGRADE_${get(selectedCityObject[0], "city.ulbGrade")}` : "MUNICIPAL CORPORATION";
    }
    if (properties.status == "INWORKFLOW") {
      const updatedOnwerInfo = this.updateProperty();
      properties.propertyDetails[0].owners = updatedOnwerInfo.owners;
      properties.propertyDetails[0].institution = updatedOnwerInfo.institution;
      properties.propertyDetails[0].ownershipCategory = updatedOnwerInfo.ownershipCategory;
    }
    return (
      <div className="form-without-button-cont-generic">
        {label && (
          <Label
            label={label}
            containerStyle={{ padding: "24px 0px 24px 0", marginLeft: "16px" }}
            dark={true}
            bold={true}
            labelStyle={{ letterSpacing: 0 }}
            fontSize={"20px"}
          />
        )}
        <div>
          <Card
            textChildren={
              <div id="property-review-form" className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
                {(totalBillAmountDue > 0 || (totalBillAmountDue === 0 && businessServiceInfoItem.isAdvanceAllowed)) && (
                  <Card
                    textChildren={
                      <TotalDues
                        history
                        tenantId={properties.tenantId}
                        consumerCode={properties.propertyId}
                        totalBillAmountDue={totalBillAmountDue}
                        isAdvanceAllowed={businessServiceInfoItem.isAdvanceAllowed}
                      />
                    }
                    style={{ backgroundColor: "rgb(242,242,242)", boxShadow: "none" }}
                  />
                )}
                <PdfHeader header={{
                  logoUrl: logoUrl, corpCity: corpCity, ulbGrade: ulbGrade,
                  label: "PT_PDF_SUBHEADER"
                }}
                  subHeader={{
                    label: "PT_PROPERTY_ID",
                    value: `: ${get(properties, "propertyId")}`
                  }}>
                </PdfHeader>
                <PropertyAddressInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></PropertyAddressInfo>
                <AssessmentInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></AssessmentInfo>
                <OwnerInfo
                  toggleSnackbarAndSetText={toggleSnackbarAndSetText}
                  properties={properties}
                  generalMDMSDataById={generalMDMSDataById}
                  totalBillAmountDue={totalBillAmountDue}
                  ownershipTransfer={true}
                  viewHistory={true}
                  propertiesAudit={propertiesAudit}
                ></OwnerInfo>
                <DocumentsInfo documentsUploaded={documentsUploaded}></DocumentsInfo>
                <div id="property-assess-form">
                  <AssessmentHistory></AssessmentHistory>
                  <PaymentHistory></PaymentHistory>
                  <ApplicationHistory></ApplicationHistory>
                </div>
              </div>
            }
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { screenConfiguration = {} } = state;
  const { cities } = state.common || [];

  const { preparedFinalObject } = screenConfiguration;
  let { propertiesAudit = [] } = preparedFinalObject;
  return { cities, propertiesAudit };
}


export default connect(
  mapStateToProps,
  null
)(PTInformation);
