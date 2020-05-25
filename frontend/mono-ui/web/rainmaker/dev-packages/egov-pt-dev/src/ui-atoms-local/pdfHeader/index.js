import PdfHeader from "egov-ui-kit/common/propertyTax/Property/components/PdfHeader";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";
import commonConfig from "config/common.js";

class pdfHeader extends React.Component {
  getLogoUrl = (tenantId) => {
    const { cities } = this.props
    const filteredCity = cities && cities.length > 0 && cities.filter(item => item.code === tenantId);
    return filteredCity ? get(filteredCity[0], "logoId") : "";
  }
  render() {
    const { properties, cities } = this.props;
    let logoUrl = "";
    let corpCity = "";
    let ulbGrade = "";
    if (get(properties, "tenantId")) {
      let tenantid = get(properties, "tenantId");
      logoUrl = window.location.origin + `/${commonConfig.tenantId}-egov-assets/${tenantid}/logo.png`;
      //  logoUrl =get(properties,"tenantId") ?  this.getLogoUrl(get(properties,"tenantId")) : "";
      corpCity = `TENANT_TENANTS_${get(properties, "tenantId").toUpperCase().replace(/[.:-\s\/]/g, "_")}`;
      const selectedCityObject = cities && cities.length > 0 && cities.filter(item => item.code === get(properties, "tenantId"));
      ulbGrade = selectedCityObject ? `ULBGRADE_${get(selectedCityObject[0], "city.ulbGrade")}` : "MUNICIPAL CORPORATION";
    }
    return (
      <PdfHeader header={{
        logoUrl: logoUrl, corpCity: corpCity, ulbGrade: ulbGrade,
        label: "PT_MUTATION_PDF_SUBHEADER"
      }}
        subHeader={{
          label: "PT_PROPERTY_ID",
          value: `: ${get(properties, "propertyId")}`
        }}>
      </PdfHeader>
    );
  }
}


const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { cities } = state.common || [];
  const { preparedFinalObject } = screenConfiguration;
  const { Properties } = preparedFinalObject;
  const properties = Properties[0];
  return { properties, cities, preparedFinalObject, state };
};

export default connect(mapStateToProps)(pdfHeader);

