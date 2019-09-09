import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "hocs/form";
import BasicInformationForm from "./components/BasicInformationForm";
import Screen from "modules/common/common/Screen";

const BasicInformationHOC = formHoc({ formKey: "basicInformation" })(BasicInformationForm);

class BasicInformation extends Component {
  render() {
    return (
      <Screen>
        <BasicInformationHOC />
      </Screen>
    );
  }
}

export default BasicInformation;
