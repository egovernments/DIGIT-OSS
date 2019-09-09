import React, { Component } from "react";
import formHoc from "egov-ui-kit/hocs/form";
import LoginForm from "./components/LoginForm";
import { Banner } from "modules/common";
import { connect } from "react-redux";
import get from "lodash/get";

const LoginFormHOC = formHoc({ formKey: "login" })(LoginForm);

class Login extends Component {
  //className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8"
  render() {
    const { bannerUrl, logoUrl } = this.props;

    return (
      <Banner bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <LoginFormHOC logoUrl={logoUrl} />
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
)(Login);
