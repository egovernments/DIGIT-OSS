import React, { Component } from "react";
import formHoc from "egov-ui-kit/hocs/form";
import LoginForm from "./components/LoginForm";
import { Banner } from "modules/common";
import { connect } from "react-redux";
import get from "lodash/get";
import { fetchCitizenConsentForm } from "egov-ui-kit/redux/app/actions";


const LoginFormHOC = formHoc({ formKey: "login" })(LoginForm);

class Login extends Component {

  componentDidMount = () => {
    this.props.fetchCitizenConsentForm();
  }

  //className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8"
  render() {
    const { bannerUrl, logoUrl,qrCodeURL,enableWhatsApp, citizenConsentFormData } = this.props;
    return (
      <Banner bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <LoginFormHOC logoUrl={logoUrl} qrCodeURL={qrCodeURL} enableWhatsApp={enableWhatsApp} citizenConsentFormData={citizenConsentFormData}/>
      </Banner>
    );
  }
}

const mapStateToProps = ({ common, app }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  let qrCodeURL = get(stateInfoById, "0.qrCodeURL");
  let enableWhatsApp=get(stateInfoById,"0.enableWhatsApp");
  let citizenConsentFormData = app && app.citizenConsentForm
  return { bannerUrl, logoUrl,qrCodeURL ,enableWhatsApp, citizenConsentFormData};
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCitizenConsentForm: () => dispatch(fetchCitizenConsentForm())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
