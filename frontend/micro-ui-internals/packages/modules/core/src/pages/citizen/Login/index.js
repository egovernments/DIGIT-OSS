import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContainer, BackButton } from "@egovernments/digit-ui-react-components";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { loginSteps } from "./config";
import SelectMobileNumber from "./SelectMobileNumber";
import SelectOtp from "./SelectOtp";
import SelectName from "./SelectName";

const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
const DEFAULT_USER = "digit-user";

const Login = ({ stateCode, cityCode }) => {
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const [isUserRegistered, setIsUserRegistered] = useState(null);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [params, setParmas] = useState({});

  useEffect(() => {
    if (!user) {
      return;
    }
    const { name } = user;
    if (!name || name === DEFAULT_USER) {
      history.push(`${path}/name`);
    } else {
      history.push("/");
    }
  }, [user]);

  useEffect(() => {
    if (!tokens) return;
    const { access_token } = tokens;
    const { mobileNumber } = params;
    Digit.UserService.setUser({ token: access_token, mobileNumber });
  }, [tokens]);

  const stepItems = useMemo(() =>
    loginSteps.map(
      (step) => {
        const texts = {};
        for (const key in step.texts) {
          texts[key] = t(step.texts[key]);
        }
        return { ...step, texts };
      },
      [loginSteps]
    )
  );

  const getUserType = () => Digit.UserService.getType();

  const handleOtpChange = (otp) => {
    setParmas({ ...params, otp });
  };

  const selectMobileNumber = async (mobileNumber) => {
    setParmas({ ...params, ...mobileNumber });
    const data = {
      ...mobileNumber,
      tenantId: stateCode,
      userType: getUserType(),
    };
    const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
    if (!err) {
      setIsUserRegistered(true);
      history.push(`${path}/otp`);
      return;
    }
    const [res2, err2] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    if (!err2) {
      setIsUserRegistered(false);
      history.push(`${path}/otp`);
      return;
    }
  };

  const selectName = async (name) => {
    const data = {
      ...user,
      ...name,
    };
    const { user: updatedUser } = await Digit.UserService.updateUser(data, stateCode);
    setUser(updatedUser[0]);
  };

  const selectOtp = async () => {
    try {
      const { mobileNumber, otp } = params;
      if (isUserRegistered) {
        const data = {
          username: mobileNumber,
          password: otp,
          tenantId: stateCode,
          userType: getUserType(),
        };

        const {
          data: { ResponseInfo, UserRequest, ...tokens },
        } = await Digit.UserService.authenticate(data);
        setTokens(tokens);
        setUser(UserRequest);
      } else if (!isUserRegistered) {
        const data = {
          name: DEFAULT_USER,
          username: mobileNumber,
          otpReference: otp,
          tenantId: stateCode,
          permanentCity: cityCode,
        };

        const {
          data: { ResponseInfo, UserRequest, ...tokens },
        } = await Digit.UserService.registerUser(data, stateCode);
        setTokens(tokens);
        setUser(UserRequest);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resendOtp = async () => {
    const { mobileNumber } = params;
    const data = {
      mobileNumber,
      tenantId: stateCode,
      userType: getUserType(),
    };
    if (!isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    } else if (isUserRegistered) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
    }
  };

  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, stateCode);
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };

  return (
    <Switch>
      <AppContainer>
        <BackButton />
        <Route path={`${path}`} exact>
          <SelectMobileNumber onSelect={selectMobileNumber} config={stepItems[0]} t={t} />
        </Route>
        <Route path={`${path}/otp`}>
          <SelectOtp config={stepItems[1]} onOtpChange={handleOtpChange} onResend={resendOtp} onSelect={selectOtp} otp={params.otp} t={t} />
        </Route>
        <Route path={`${path}/name`}>
          <SelectName config={stepItems[2]} onSelect={selectName} t={t} />
        </Route>
      </AppContainer>
    </Switch>
  );
};

export default Login;
