import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "hocs/form";
import PropertyAddressForm from "./components/PropertyAddressForm";
import Screen from "modules/common/common/Screen";

const PropertyAddressHOC = formHoc({ formKey: "propertyAddress" })(PropertyAddressForm);

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
