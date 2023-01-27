// import { CircularProgress } from "@mui/material"
import { Loader } from "@egovernments/digit-ui-react-components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";


const DEFAULT_REDIRECT_URL = "/digit-ui/citizen";

const setCitizenDetail = (userObject, token, tenantId) => {
  let locale = JSON.parse(sessionStorage.getItem("Digit.initData"))?.value?.selectedLanguage;
  localStorage.setItem("Citizen.tenant-id", tenantId);
  localStorage.setItem("tenant-id", tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Citizen.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Citizen.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
}

export default function CheckCredentials({stateCode}) {
  const location = useLocation();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const queryParameters = new URLSearchParams(window.location.search);
  // const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    console.log("GETUSERDATA",user);
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    Digit.UserService.setUser(user);
    setCitizenDetail(user?.UserRequest, user?.access_token, stateCode)
    const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
    history.replace(redirectPath);
  }, [user]);

  const checkCrednetials = async () => {
    const body = {
      "SsoCitizen": {
        "userId": queryParameters.get("UserId"),
        "emailId": queryParameters.get("EmailId"),
        "mobileNumber": queryParameters.get("MobNo"),
        "returnUrl": queryParameters.get("RedirectUrl"),
        "redirectUrl": queryParameters.get("ReturnUrl"),
        "tokenId": queryParameters.get("TokenId")
      }
    }
    const resp = await axios.post("http://103.166.62.118:80/user/users/_ssoCitizen", body);
    
    const info = resp?.data?.Token?.UserRequest;
    // const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.ssoUser(body);
    console.log("REINfo",info, resp);
    // console.log("UserReq",{UserRequest: info});
    // console.log("UserTok",...tokens);
    // localStorage.setItem("access_token", ResponseInfo?.data?.Token?.access_token);
    // localStorage.setItem("token", ResponseInfo?.data?.Token?.refresh_token);
    // localStorage.setItem("Citizen.tenant-id",ResponseInfo?.data?.Token?.UserRequest?.tenantId);
    // localStorage.setItem("tenant-id",ResponseInfo?.data?.Token?.UserRequest?.tenantId);
    // localStorage.setItem("citizen.userRequestObject",JSON.stringify(ResponseInfo?.data?.Token?.UserRequest));
    // localStorage.setItem("locale",ResponseInfo?.data?.Token?.UserRequest?.locale);
    // localStorage.setItem("Citizen.locale",ResponseInfo?.data?.Token?.UserRequest?.locale);
    // localStorage.setItem("token",ResponseInfo?.data?.Token?.access_token);
    // localStorage.setItem("Citizen.token",ResponseInfo?.data?.Token?.access_token);
    // localStorage.setItem("user-info",JSON.stringify(ResponseInfo?.data?.Token?.UserRequest));
    // localStorage.setItem("Citizen.user-info",JSON.stringify(ResponseInfo?.data?.Token?.UserRequest));  
    // sessionStorage.setItem("citizen.userRequestObject",JSON.stringify(ResponseInfo?.data?.Token?.UserRequest));
    // Digit.SessionStorage.set("citizen.userRequestObject", JSON.stringify(ResponseInfo?.data?.Token?.UserRequest));
    // console.log("SSoAUTH",ResponseInfo?.data);

    // Digit.SessionStorage.set("citizen.userRequestObject", ResponseInfo?.data?.Token?.UserRequest);
    // Digit.UserService.setUser(ResponseInfo?.data?.Token);
    // const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
    // history.replace(redirectPath);

    // const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);

    // if (location.state?.role) {
    //   const roleInfo = ResponseInfo?.data?.Token?.UserRequest.roles.find((userRole) => userRole.code === location.state.role);
    //   if (!roleInfo || !roleInfo.code) {
    //     setError(t("ES_ERROR_USER_NOT_PERMITTED"));
    //     setTimeout(() => history.replace(DEFAULT_REDIRECT_URL), 5000);
    //     return;
    //   }
    // }
    // if (window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")) {
    //   ResponseInfo.data.Token.UserRequest.tenantId = Digit.ULBService.getStateId();
    // }
    // console.log("INFOTOK",ResponseInfo?.data?.Token?.UserRequest);
    setUser({ info, ...resp?.data?.Token });
   
 
  }
  useEffect(() => {
    checkCrednetials();
  }, []); 

  
  

  // useEffect(() => {
  //   if (!user) {
  //     return;
  //   }
  //   Digit.SessionStorage.set("citizen.userRequestObject", user);
  //   Digit.UserService.setUser(user);
  //   setCitizenDetail(user?.info,user?.access_token,stateCode)
  //   const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
  //   history.replace(redirectPath);
  // }, [user]);
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Loader />
    </div>
  );
}
