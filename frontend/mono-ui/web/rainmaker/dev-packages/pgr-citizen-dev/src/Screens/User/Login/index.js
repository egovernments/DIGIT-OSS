import React, { Component } from "react";
import formHoc from "egov-ui-kit/hocs/form";
import LoginForm from "./components/LoginForm";
import { Banner } from "modules/common";

const LoginFormHOC = formHoc({ formKey: "login" })(LoginForm);

class Login extends Component {
  //className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8"
  render() {
    return (
      <Banner>
        <LoginFormHOC />
      </Banner>
    );
  }
}

export default Login;
