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
    // console.log("GETUSERDATA",user);
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
