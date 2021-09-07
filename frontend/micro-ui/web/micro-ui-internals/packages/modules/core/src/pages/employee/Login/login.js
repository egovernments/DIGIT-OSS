import React, { useState, useEffect } from "react";
import { FormComposer, Dropdown, Loader } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const Login = ({ config: propsConfig, t }) => {
  const {data: cities, isLoading} = Digit.Hooks.useTenants();
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

  const onLogin = async (data) => {
    if (!data.city) {
      alert("Please Select City!");
      return;
    }
    const requestData = {
      ...data,
      userType: getUserType(),
    };
    requestData.tenantId = data.city.code;
    delete requestData.city;
    try {
      const { UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
      setUser({ info, ...tokens });
    } catch (err) {
      console.log({ err });
      alert(err?.response?.data?.error_description || "Invalid login credentials!");
    }
  };

  const onForgotPassword = () => {
    history.push("/digit-ui/employee/forgot-password");
  };

  console.log({ propsConfig });
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
                {...customProps}
              />
            ),
          },
          isMandatory: true,
        },
      ],
    },
  ];

  return isLoading ? <Loader /> : (
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
      cardStyle={{ maxWidth: "400px", margin: "auto" }}
    />
  );
};

Login.propTypes = {
  loginParams: PropTypes.any,
};

Login.defaultProps = {
  loginParams: null,
};

export default Login;
