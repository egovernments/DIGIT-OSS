import React from "react";
import formHoc from "egov-ui-kit/hocs/form";
import { Banner } from "modules/common";
import { Screen } from "modules/common";
import LoginForm from "./components/LoginForm";
import { connect } from "react-redux";
import get from "lodash/get";

const LoginFormHOC = formHoc({ formKey: "employeeLogin" })(LoginForm);

const Login = ({ bannerUrl, logoUrl }) => {
  // className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8"
  return (
    <Banner hideBackButton={true} bannerUrl={bannerUrl} logoUrl={logoUrl}>
      <LoginFormHOC logoUrl={logoUrl} />
    </Banner>
  );
};

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  return { bannerUrl, logoUrl };
};

export default connect(
  mapStateToProps,
  null
)(Login);
