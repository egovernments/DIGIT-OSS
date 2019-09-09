import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "hocs/form";
import Banner from "modules/common/common/Banner";
import OTPForm from "./components/OTPForm";
import { handleFieldChange, submitForm } from "redux/form/actions";
import { sendOTP } from "redux/auth/actions";
import Screen from "modules/common/common/Screen";

const OTPFormHOC = formHoc({ formKey: "otp" })(OTPForm);

class OTP extends Component {
  componentWillMount() {
    const { previousRoute } = this.props;
    if (previousRoute.length === 0) {
      this.props.history.push("/citizen/user/register");
    }
  }

  componentDidMount() {
    const { submitForm, handleFieldChange } = this.props;
    const otpElement = document.getElementById("otp");
    otpElement.addEventListener("smsReceived", (e) => {
      const { otp } = e.detail;
      handleFieldChange("otp", "otp", otp);
      submitForm("otp");
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
    const { handleFieldChange, submitForm, phoneNumber, loading } = this.props;
    const { resendOTP } = this;

    return (
      <Screen loading={loading}>
        <Banner className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8">
          <OTPFormHOC resendOTP={resendOTP} phoneNumber={phoneNumber} />
        </Banner>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const formKey = "otp";
  const { authenticating } = state.auth;
  const { previousRoute } = state.app;
  const intent = previousRoute.endsWith("register") ? "register" : previousRoute.endsWith("login") ? "login" : null;
  let phoneNumber = null;
  if (intent) {
    phoneNumber = state.form[intent].fields.phone.value;
  }
  return { previousRoute, intent, phoneNumber, loading: authenticating };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
    submitForm: (formKey) => dispatch(submitForm(formKey)),
    sendOTP: (otp) => dispatch(sendOTP(otp)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OTP);
