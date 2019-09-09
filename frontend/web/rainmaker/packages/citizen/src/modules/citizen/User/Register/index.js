import React, { Component } from "react";
import formHoc from "egov-ui-kit/hocs/form";
import RegisterForm from "./components/RegisterForm";
import { Banner } from "modules/common";
import { connect } from "react-redux";
import get from "lodash/get";

const RegisterFormHOC = formHoc({ formKey: "register" })(RegisterForm);

class Register extends Component {
  render() {
    const { bannerUrl, logoUrl } = this.props;
    return (
      <Banner hideBackButton={true} bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <RegisterFormHOC logoUrl={logoUrl} />
      </Banner>
    );
  }
}

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  return { bannerUrl, logoUrl };
};

export default connect(
  mapStateToProps,
  null
)(Register);
