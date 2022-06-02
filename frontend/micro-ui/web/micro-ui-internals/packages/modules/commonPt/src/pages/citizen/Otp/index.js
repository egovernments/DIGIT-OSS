import React, { useMemo,useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useRouteMatch, useLocation, useHistory} from "react-router-dom";
import SelectOtp from "./SelectOtp";
import { loginSteps } from "./config";

const CitizenOtp = (props) => {
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  const [params1, setParmas1] = useState({mobileNumber: location.state.mobileNumber, otp: ''});
  const [isOtpValid, setIsOtpValid] = useState(true);

  const getUserType = () => Digit.UserService.getType();

  // const params = useMemo(() => {
  //   return config?.map?.((step) => {
  //     const texts = {};
  //     for (const key in step.texts) {
  //       texts[key] = t(step.texts[key]);
  //     }
  //     return { ...step, texts };
  //   });
  // }, [config]);
  ////////////////////////after add
  const selectOtp = async () => {
    try {
      setIsOtpValid(true);
      
      const { mobileNumber, otp, name } = params1;

        const requestData = {
          username: mobileNumber,
          password: otp,
          tenantId: props.stateCode,
          userType: getUserType(),
        };
        
        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);
        
        if (location.state?.redirectBackTo) {
          history.replace(location.state?.redirectBackTo, {
            data: location.state?.redirectData
          });
        } else {
          history.replace('digit-ui/citizen/');
        }
    } catch (err) {
      setIsOtpValid(false);
    }
  };
  const resendOtp = async () => {
    const { mobileNumber } = params1;

    const data = {
      mobileNumber,
      tenantId: props.stateCode,
      userType: getUserType(),
    };
   
    const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
  };

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
  
  const handleOtpChange = (otp) => {
    setParmas1({ ...params1, otp });
  };
  
  return (
    <SelectOtp
      config={{ ...stepItems[1], texts: { ...stepItems[1].texts, cardText: `${stepItems[1].texts.cardText} ${params1.mobileNumber || ""}` } }}
      onOtpChange={handleOtpChange}
      onResend={resendOtp}
      onSelect={selectOtp}
      otp={params1.otp}
      error={isOtpValid}
      t={t}
    />
  );
};
export default CitizenOtp;