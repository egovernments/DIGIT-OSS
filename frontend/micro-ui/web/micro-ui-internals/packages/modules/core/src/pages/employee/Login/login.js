import React, { useState, useEffect } from "react";
import { FormComposer, Dropdown, Loader, Toast, BackButton } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Background from "../../../components/Background";
import Header from "../../../components/Header";

const Login = ({ config: propsConfig, t }) => {
  const { data: cities, isLoading } = Digit.Hooks.useTenants();
  const { data: storeData, isLoading: isStoreLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const history = useHistory();
  // const getUserType = () => "EMPLOYEE" || Digit.UserService.getType();


  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.UserService.setUser(user);
    Digit.UserService.setType('EMPLOYEE');
    const redirectPath = location.state?.from || "/digit-ui/employee";
    history.replace(redirectPath);
  }, [user]);

  const onLogin = async (data) => {
    if (!data.city) {
      alert("Please Select City!");
      return;
    }
    const requestData = {
      ...data,
      userType: 'EMPLOYEE',
    };
    requestData.tenantId = data.city.code;
    delete requestData.city;
    try {
      const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
      Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
      setUser({ info, ...tokens });
    } catch (err) {
      setShowToast(err?.response?.data?.error_description || "Invalid login credentials!");
      setTimeout(closeToast, 5000);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onForgotPassword = () => {
    history.push("/digit-ui/employee/user/forgot-password");
  };

  const [userId, password, city] = propsConfig.inputs;
  const config = [
    {
      body: [
        {
          label: t(userId.label),
          type: userId.type,
          populators: {
            name: userId.name,
          },
          isMandatory: true,
        },
        {
          label: t(password.label),
          type: password.type,
          populators: {
            name: password.name,
          },
          isMandatory: true,
        },
        {
          label: t(city.label),
          type: city.type,
          populators: {
            name: city.name,
            customProps: {},
            component: (props, customProps) => (
              <Dropdown
                option={cities}
                optionKey="i18nKey"
                select={(d) => {
                  props.onChange(d);
                }}
                t={t}
                {...customProps}
              />
            ),
          },
          isMandatory: true,
        },
      ],
    },
  ];

  return (isLoading || isStoreLoading) ? <Loader /> : (
    <Background>
      <div className="employeeBackbuttonAlign">
        <BackButton />
      </div>
      <FormComposer
        onSubmit={onLogin}
        noBoxShadow
        inline
        submitInForm
        config={config}
        label={propsConfig.texts.submitButtonLabel}
        secondaryActionLabel={propsConfig.texts.secondaryButtonLabel}
        onSecondayActionClick={onForgotPassword}
        heading={propsConfig.texts.header}
        headingStyle={{ textAlign: "center" }}
        cardStyle={{ margin: "auto", minWidth: "408px" }}
        className="loginFormStyleEmployee"
      >
        <Header />
      </FormComposer>
      {showToast && <Toast
        error={true}
        label={t(showToast)}
        onClose={closeToast}
      />}
      <div className="EmployeeLoginFooter">
        <img alt="Powered by DIGIT" src="https://s3.ap-south-1.amazonaws.com/egov-qa-assets/digit-footer-bw.png" />
      </div>
    </Background>
  );
};

Login.propTypes = {
  loginParams: PropTypes.any,
};

Login.defaultProps = {
  loginParams: null,
};

export default Login;
