import React from "react";
import formHoc from "hocs/form";
import Banner from "modules/common/common/Banner";
import Screen from "modules/common/common/Screen";
import LoginForm from "./components/LoginForm";

const LoginFormHOC = formHoc({ formKey: "employeeLogin" })(LoginForm);

const Login = () => {
  return (
    <Screen>
      <Banner className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8">
        <LoginFormHOC />
      </Banner>
    </Screen>
  );
};

export default Login;
