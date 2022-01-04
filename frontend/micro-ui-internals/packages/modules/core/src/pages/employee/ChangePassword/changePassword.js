import React, { useState, useEffect } from "react";
import { FormComposer, Dropdown, CardSubHeader, CardLabel, TextInput, CardLabelDesc } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const ChangePasswordComponent = ({ config: propsConfig, t }) => {
  const [user, setUser] = useState(null);
  const { mobile_number: mobileNumber, tenantId } = Digit.Hooks.useQueryParams();
  const history = useHistory();
  const getUserType = () => Digit.UserService.getType();
  let otpReference = "";
  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.UserService.setUser(user);
    const redirectPath = location.state?.from || "/digit-ui/employee";
    history.replace(redirectPath);
  }, [user]);

  const onResendOTP = async () => {
    const requestData = {
      otp: {
        mobileNumber,
        userType: getUserType().toUpperCase(),
        type: "passwordreset",
        tenantId,
      },
    };
    try {
      await Digit.UserService.sendOtp(requestData, tenantId);
      alert("OTP resend successfull");
    } catch (err) {
      console.log({ err });
      alert(err?.response?.data?.error_description || "Invalid login credentials!");
    }
  };

  const onChangePassword = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        return alert(t("ERR_PASSWORD_DO_NOT_MATCH"));
      }

      const requestData = {
        ...data,
        otpReference,
        tenantId,
        type: getUserType().toUpperCase(),
      };
      const response = await Digit.UserService.changePassword(requestData, tenantId);
      console.log({ response });
      navigateToLogin();
    } catch (err) {
      alert(err?.response?.data?.Errors[0]?.message || "Something went wrong!");
    }
  };

  const updateOtp = (data) => {
    otpReference = data.target.value || "";
  };

  const navigateToLogin = () => {
    history.replace("/digit-ui/employee/login");
  };

  const [username, password, confirmPassword] = propsConfig.inputs;
  const config = [
    {
      body: [
        {
          label: t(username.label),
          type: username.type,
          populators: {
            name: username.name,
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
          label: t(confirmPassword.label),
          type: confirmPassword.type,
          populators: {
            name: confirmPassword.name,
          },
          isMandatory: true,
        },
      ],
    },
  ];

  return (
    <FormComposer
      onSubmit={onChangePassword}
      noBoxShadow
      inline
      submitInForm
      config={config}
      label={propsConfig.texts.submitButtonLabel}
      cardStyle={{ maxWidth: "400px", margin: "auto" }}
    >
      <CardSubHeader style={{ textAlign: "center" }}> {propsConfig.texts.header} </CardSubHeader>
      <div>
        <CardLabel style={{ marginBottom: "8px" }}>{t("CORE_OTP_SENT_MESSAGE")}</CardLabel>
        <CardLabelDesc style={{ marginBottom: "0px" }}> {mobileNumber} </CardLabelDesc>
        <CardLabelDesc style={{ marginBottom: "8px" }}> {t("CORE_EMPLOYEE_OTP_CHECK_MESSAGE")}</CardLabelDesc>
      </div>
      <CardLabel style={{ marginBottom: "8px" }}>{t("CORE_OTP_OTP")} *</CardLabel>
      <TextInput className="field" name={otpReference} isRequired={true} onChange={updateOtp} type={"text"} style={{ marginBottom: "10px" }} />
      <div className="flex-right">
        <div className="primary-label-btn" onClick={onResendOTP}>
          {t("CORE_OTP_RESEND")}
        </div>
      </div>
    </FormComposer>
  );
};

ChangePasswordComponent.propTypes = {
  loginParams: PropTypes.any,
};

ChangePasswordComponent.defaultProps = {
  loginParams: null,
};

export default ChangePasswordComponent;
