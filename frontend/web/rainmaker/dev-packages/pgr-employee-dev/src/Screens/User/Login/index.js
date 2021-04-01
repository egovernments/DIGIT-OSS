import React from "react";
import formHoc from "egov-ui-kit/hocs/form";
import { Banner } from "modules/common";
import { Screen } from "modules/common";
import LoginForm from "./components/LoginForm";

const LoginFormHOC = formHoc({ formKey: "employeeLogin" })(LoginForm);

const Login = () => {
  // className="col-lg-offset-2 col-md-offset-2 col-md-8 col-lg-8"
  return (
    <Banner hideBackButton={true}>
      <LoginFormHOC />
    </Banner>
  );
};

export default Login;
