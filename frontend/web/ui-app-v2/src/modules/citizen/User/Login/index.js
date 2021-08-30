import React, { Component } from "react";
import formHoc from "hocs/form";
import LoginForm from "./components/LoginForm";
import Banner from "modules/common/common/Banner";
import Screen from "modules/common/common/Screen";

const LoginFormHOC = formHoc({ formKey: "login" })(LoginForm);

class Login extends Component {
  render() {
    return (
      <Screen>
        <Banner className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8">
          <LoginFormHOC />
        </Banner>
      </Screen>
    );
  }
}

export default Login;
