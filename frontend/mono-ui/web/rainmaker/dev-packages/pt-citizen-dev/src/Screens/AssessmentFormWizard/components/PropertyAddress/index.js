import React, { Component } from "react";
import formHoc from "egov-ui-kit/hocs/form";
import PropertyAddressForm from "./components/PropertyAddressForm";
import { Screen } from "modules/common";

const PropertyAddressHOC = formHoc({ formKey: "propertyAddress",isCoreConfiguration:true,path:"PropertyTaxPay" })(PropertyAddressForm);

class PropertyAddress extends Component {
  render() {
    return (
      <Screen>
        <PropertyAddressHOC />
      </Screen>
    );
  }
}

export default PropertyAddress;
