import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import PasswordForm from "./components/PasswordForm";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

const PasswordFormHOC = formHoc({ formKey: "employeeChangePassword" })(PasswordForm);

class ChangePassword extends Component {
  render() {
    const { toggleSnackbarAndSetText } = this.props;
    return (
      <Screen className="employee-change-passwd-screen">
        <PasswordFormHOC toggleSnackbarAndSetText={toggleSnackbarAndSetText} />
      </Screen>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ChangePassword);
