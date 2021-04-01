import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Banner } from "modules/common";
import OTPForm from "./components/OTPForm";
import { handleFieldChange, submitForm } from "egov-ui-kit/redux/form/actions";
import { sendOTP } from "egov-ui-kit/redux/auth/actions";
import { Screen } from "modules/common";
import { localStorageSet } from "egov-ui-kit/utils/localStorageUtils";

const OTPFormHOC = formHoc({ formKey: "otp" })(OTPForm);

class OTP extends Component {
  componentWillMount() {
    const { previousRoute } = this.props;
    if (previousRoute.length === 0) {
      this.props.history.push("/user/register");
    }
  }

  componentDidMount() {
    const { submitForm, handleFieldChange, previousRoute } = this.props;
    const otpElement = document.getElementById("otp");
    if(window.mSewaApp){
      localStorageSet("isNative", true);
    }else{
      localStorageSet("isNative", false);
    }
    otpElement.addEventListener("smsReceived", e => {
      // localStorageSet("isNative", true);
      const { otp } = e.detail;
      handleFieldChange("otp", "otp", otp);
      if (previousRoute === "/citizen/user/register") {
        submitForm("otp", "/user/citizen/_create");
      } else {
        submitForm("otp");
      }
    });
  }

  componentWillUnmount() {
    const otpElement = document.getElementById("otp");
    otpElement.removeEventListener("smsReceived", null);
  }

  resendOTP = () => {
    const { sendOTP, intent } = this.props;
    sendOTP(intent);
  };

  render() {
    const { phoneNumber, loading } = this.props;
    const { resendOTP } = this;

    return (
      <Screen loading={loading} className="force-padding-0">
        <Banner>
          <OTPFormHOC resendOTP={resendOTP} phoneNumber={phoneNumber} />
        </Banner>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { authenticating } = state.auth;
  const { previousRoute } = state.app;
  const intent = previousRoute.endsWith("register")
    ? "register"
    : previousRoute.endsWith("login")
    ? "login"
    : null;
  let phoneNumber = null;
  if (intent) {
    phoneNumber = state.form[intent].fields.phone.value;
  }
  return { previousRoute, intent, phoneNumber, loading: authenticating };
};

const mapDispatchToProps = dispatch => {
  return {
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    submitForm: (formKey, saveUrl) => dispatch(submitForm(formKey, saveUrl)),
    sendOTP: otp => dispatch(sendOTP(otp))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OTP);
