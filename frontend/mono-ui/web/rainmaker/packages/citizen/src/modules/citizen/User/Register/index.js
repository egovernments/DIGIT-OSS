import formHoc from "egov-ui-kit/hocs/form";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale, getLocalization } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { Banner } from "modules/common";
import React, { Component } from "react";
import { connect } from "react-redux";
import RegisterForm from "./components/RegisterForm";

const RegisterFormHOC = formHoc({ formKey: "register" })(RegisterForm);

class Register extends Component {
  componentDidMount = () => {
    const locale = getLocale() || 'en_IN';
    const localizationLabels = JSON.parse(getLocalization(`localization_${locale}`)) || [];
    if (localizationLabels && Array.isArray(localizationLabels) && localizationLabels.length == 0) {
      this.props.fetchLocalizationLabel(locale);
    }
  }

  render() {
    const { bannerUrl, logoUrl, qrCodeURL, enableWhatsApp } = this.props;
    return (
      <Banner hideBackButton={false} bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <RegisterFormHOC logoUrl={logoUrl} qrCodeURL={qrCodeURL} enableWhatsApp={enableWhatsApp} />
      </Banner>
    );
  }
}

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  let qrCodeURL = get(stateInfoById, "0.qrCodeURL");
  let enableWhatsApp = get(stateInfoById, "0.enableWhatsApp");
  return { bannerUrl, logoUrl, qrCodeURL, enableWhatsApp };
};


const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
