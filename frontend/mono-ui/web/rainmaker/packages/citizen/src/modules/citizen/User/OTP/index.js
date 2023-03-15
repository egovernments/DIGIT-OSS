import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Banner } from "modules/common";
import OTPForm from "./components/OTPForm";
import { handleFieldChange, submitForm, setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { sendOTP } from "egov-ui-kit/redux/auth/actions";
import { Screen } from "modules/common";
import { httpRequest } from "egov-ui-kit/utils/api";
import { withRouter } from "react-router";
import commonConfig from "config/common";
import { getQueryArg } from "egov-ui-kit/utils/commons";
import get from "lodash/get";
import { localStorageSet } from "egov-ui-kit/utils/localStorageUtils";

const OTPFormHOC = formHoc({ formKey: "otp" })(OTPForm);

class OTP extends Component {
  state = {
    timerSwitch: false,
    timeLeft: 30000
  };
  componentWillMount() {
    const { previousRoute } = this.props;
    if (previousRoute.length === 0) {
      this.props.history.push("/user/register");
    }
  }

  sendOtpForAutoLogin = async () => {
    let { phoneNumber, setFieldProperty } = this.props;
    if (phoneNumber && typeof phoneNumber == 'string' && phoneNumber.length > 11 && phoneNumber.startsWith('91')) {
      phoneNumber = phoneNumber && phoneNumber.replace && phoneNumber.replace('91', '') || phoneNumber;
    }
    if (phoneNumber) {
      await httpRequest(`/user-otp/v1/_send`, "_send", [], {
        otp: { mobileNumber: phoneNumber, type: "login", tenantId: commonConfig.tenantId },
      });
      setFieldProperty("otp", "otp", "phone", phoneNumber);
    }
  };

  componentDidMount() {
    const { submitForm, handleFieldChange, previousRoute } = this.props;
    const otpElement = document.getElementById("otp");
    if (window.mSewaApp) {
      localStorageSet("isNative", true);
    } else {
      localStorageSet("isNative", false);
    }
    otpElement.addEventListener("smsReceived", (e) => {
      // localStorageSet("isNative", true);
      const { otp } = e.detail;
      handleFieldChange("otp", "otp", otp);
      if (previousRoute === "/citizen/user/register") {
        submitForm("otp", "/user/citizen/_create");
      } else {
        submitForm("otp");
      }
    });
    getQueryArg("", "smsLink") && this.sendOtpForAutoLogin();
  }

  componentWillUnmount() {
    const otpElement = document.getElementById("otp");
    otpElement.removeEventListener("smsReceived", null);
  }

  resendOTP = () => {
    const { sendOTP, intent } = this.props;
    if (intent) sendOTP(intent);
    else if (getQueryArg("", "smsLink")) this.sendOtpForAutoLogin();
  };

  completed = () => {
    this.setState({
      timerSwitch: true
    });
  };
  reset = () => {
    this.setState({
      timerSwitch: false
    });
    this.setState({
      timeLeft: 60000
    });
  };


  render() {
    let { phoneNumber, loading, bannerUrl, logoUrl, history } = this.props;
    const { resendOTP, completed, reset } = this;
    const { timerSwitch, timeLeft } = this.state;
    if (phoneNumber && typeof phoneNumber == 'string' && phoneNumber.length > 11 && phoneNumber.startsWith('91')) {
      phoneNumber = phoneNumber && phoneNumber.replace && phoneNumber.replace('91', '') || phoneNumber;
    }
    return (
      <Screen loading={loading} className="force-padding-0">
        <Banner bannerUrl={bannerUrl} logoUrl={logoUrl}>
          <OTPFormHOC resendOTP={resendOTP} phoneNumber={phoneNumber} logoUrl={logoUrl} history={history} timerSwitch={timerSwitch} completed={completed} timeLeft={timeLeft} reset={reset} />
        </Banner>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { authenticating } = state.auth;
  const { previousRoute } = state.app;
  const { stateInfoById } = state.common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  const intent = previousRoute.endsWith("register") ? "register" : previousRoute.endsWith("login") ? "login" : null;
  let phoneNumber = null;
  if (intent) {
    phoneNumber = state.form[intent].fields.phone.value;
  }
  if (phoneNumber === null && getQueryArg("", "smsLink")) phoneNumber = getQueryArg(previousRoute, "mobileNo");
  return { previousRoute, intent, phoneNumber, loading: authenticating, bannerUrl, logoUrl };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
    submitForm: (formKey, saveUrl) => dispatch(submitForm(formKey, saveUrl)),
    sendOTP: (otp) => dispatch(sendOTP(otp)),
    setFieldProperty: (formKey, fieldKey, propertyName, propertyValue) => dispatch(setFieldProperty(formKey, fieldKey, propertyName, propertyValue)),
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(OTP));
