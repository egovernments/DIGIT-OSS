import React, { useState, useEffect } from "react";
import { FormComposer, Dropdown } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const ForgotPassword = ({ config: propsConfig, t }) => {
  const cities = Digit.Hooks.fsm.useTenants();
  const [user, setUser] = useState(null);
  const history = useHistory();
  const getUserType = () => Digit.UserService.getType();

  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.UserService.setUser(user);
    const redirectPath = location.state?.from || "/digit-ui/employee";
    history.replace(redirectPath);
  }, [user]);

  const onForgotPassword = async (data) => {
    if (!data.city) {
      alert("Please Select City!");
      return;
    }
    const requestData = {
      otp: {
        ...data,
        userType: getUserType().toUpperCase(),
        type: "passwordreset",
        tenantId: data.city.code,
      },
    };
    try {
      await Digit.UserService.sendOtp(requestData, data.city.code);
      history.push(`/digit-ui/employee/change-password?mobile_number=${data.mobileNumber}&tenantId=${data.city.code}`);
    } catch (err) {
      console.log({ err });
      alert(err?.response?.data?.error_description || "Invalid login credentials!");
    }
  };

  const navigateToLogin = () => {
    history.replace("/digit-ui/employee/login");
  };

  console.log({ propsConfig });
  const [userId, city] = propsConfig.inputs;
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
          label: t(city.label),
          type: city.type,
          populators: {
            name: city.name,
            customProps: {},
            component: (props, customProps) => (
              <Dropdown
                option={cities}
                optionKey="name"
                id={city.name}
                select={(d) => {
                  props.onChange(d);
                }}
                {...customProps}
              />
            ),
          },
          isMandatory: true,
        },
      ],
    },
  ];

  return (
    <FormComposer
      onSubmit={onForgotPassword}
      noBoxShadow
      inline
      submitInForm
      config={config}
      label={propsConfig.texts.submitButtonLabel}
      secondaryActionLabel={propsConfig.texts.secondaryButtonLabel}
      onSecondayActionClick={navigateToLogin}
      heading={propsConfig.texts.header}
      headingStyle={{ textAlign: "center" }}
      cardStyle={{ maxWidth: "400px", margin: "auto" }}
    />
  );
};

ForgotPassword.propTypes = {
  loginParams: PropTypes.any,
};

ForgotPassword.defaultProps = {
  loginParams: null,
};

export default ForgotPassword;
