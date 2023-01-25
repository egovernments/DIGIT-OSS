// import { CircularProgress } from "@mui/material"
import { Loader } from "@egovernments/digit-ui-react-components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";


const DEFAULT_REDIRECT_URL = "/digit-ui/citizen";



export default function CheckCredentials() {
  const location = useLocation();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const queryParameters = new URLSearchParams(window.location.search);
  // const [user, setUser] = useState(null);

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
    const response = await axios.post("http://103.166.62.118:80/user/users/_ssoCitizen", body)
    localStorage.setItem("access_token", response?.data?.Token?.access_token);
    localStorage.setItem("token", response?.data?.Token?.refresh_token);
    localStorage.setItem("Citizen.tenant-id",response?.data?.Token?.UserRequest?.tenantId);
    localStorage.setItem("tenant-id",response?.data?.Token?.UserRequest?.tenantId);
    localStorage.setItem("citizen.userRequestObject",JSON.stringify(response?.data?.Token?.UserRequest));
    localStorage.setItem("locale",response?.data?.Token?.UserRequest?.locale);
    localStorage.setItem("Citizen.locale",response?.data?.Token?.UserRequest?.locale);
    localStorage.setItem("token",response?.data?.Token?.access_token);
    localStorage.setItem("Citizen.token",response?.data?.Token?.access_token);
    localStorage.setItem("user-info",JSON.stringify(response?.data?.Token?.UserRequest));
    localStorage.setItem("Citizen.user-info",JSON.stringify(response?.data?.Token?.UserRequest));  
    sessionStorage.setItem("citizen.userRequestObject",JSON.stringify(response?.data?.Token?.UserRequest));
    console.log("SSoAUTH",response?.data?.Token?.access_token);

    Digit.SessionStorage.set("citizen.userRequestObject", response?.data?.Token?.UserRequest);
    Digit.UserService.setUser(response?.data?.Token?.UserRequest);

    // try {
      const reqBodyUser = 
        {
          "tenantId": response?.data?.Token?.UserRequest?.tenantId,
          "uuid": [response?.data?.Token?.UserRequest?.uuid],
          "pageSize": "100",
          "RequestInfo": {
            "authToken": response?.data?.Token?.access_token,
            "userInfo": response?.data?.Token?.UserRequest,
            
          }
        }
      
      const usersResponse = await axios.post(`/user/_search`,reqBodyUser);
      console.log("GETUSER",usersResponse);
      setUser(usersResponse);
    // }catch{
      
    // }
    
    
    
      




    // if (location.state?.role) {
    //   const roleInfo = info.roles.find((userRole) => userRole.code === location.state.role);
    //   if (!roleInfo || !roleInfo.code) {
    //     setError(t("ES_ERROR_USER_NOT_PERMITTED"));
    //     setTimeout(() => history.replace(DEFAULT_REDIRECT_URL), 5000);
    //     return;
    //   }
    // }
    // if(window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")){
    // info.tenantId= Digit.ULBService.getStateId();
    // }

    // setUser({ info, ...tokens });
    // setCitizenDetail(user?.info,user?.access_token)
    // const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
    // history.replace(redirectPath);
    // console.log("SSoAUTHTOKEN",response?.data);
    // console.log("_ssoCitizen response ",response.data)
    // window.open(response?.data?.ReturnUrl,"_self");

    // redirectReturnUrl();
    // setCitizenDetail(user?.info,user?.access_token)

 
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
