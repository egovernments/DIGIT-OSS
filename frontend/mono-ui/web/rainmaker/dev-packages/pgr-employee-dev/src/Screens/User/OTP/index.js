import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import { Banner } from "modules/common";
import OTPForm from "./components/OTPForm";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { sendOTP } from "egov-ui-kit/redux/auth/actions";

const OTPFormHOC = formHoc({ formKey: "employeeOTP" })(OTPForm);

class OTP extends Component {
  resendOTP = () => {
    const { sendOTP, forgotPasswdFormKey } = this.props;
    sendOTP(forgotPasswdFormKey);
  };

  render() {
    const { phoneNumber, loading, toggleSnackbarAndSetText } = this.props;
    const { resendOTP } = this;
    //className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8"
    return (
      <Screen loading={loading}>
        <Banner>
          <OTPFormHOC toggleSnackbarAndSetText={toggleSnackbarAndSetText} resendOTP={resendOTP} phoneNumber={phoneNumber} />
        </Banner>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { authenticating } = state.auth;
  const { previousRoute } = state.app;
  let phoneNumber = null;
  const forgotPasswdFormKey = "employeeForgotPasswd";
  const forgotPasswdform = state.form[forgotPasswdFormKey] || {};
  if (forgotPasswdform.fields && forgotPasswdform.fields.username) {
    phoneNumber = forgotPasswdform.fields.username.value;
  }
  return { previousRoute, phoneNumber, loading: authenticating, forgotPasswdFormKey };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendOTP: (otp) => dispatch(sendOTP(otp)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OTP);
