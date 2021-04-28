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
    const { bannerUrl, logoUrl,qrCodeURL,enableWhatsApp } = this.props;

    return (
      <Banner bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <LoginFormHOC logoUrl={logoUrl} qrCodeURL={qrCodeURL} enableWhatsApp={enableWhatsApp}/>
      </Banner>
    );
  }
}

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  let qrCodeURL = get(stateInfoById, "0.qrCodeURL");
  let enableWhatsApp=get(stateInfoById,"0.enableWhatsApp"); 
  return { bannerUrl, logoUrl,qrCodeURL ,enableWhatsApp};
};

export default connect(
  mapStateToProps,
  null
)(Login);
