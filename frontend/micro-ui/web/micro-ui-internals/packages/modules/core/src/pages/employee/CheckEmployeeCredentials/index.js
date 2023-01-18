// import { CircularProgress } from "@mui/material"
import { Loader } from "@egovernments/digit-ui-react-components";
import axios from "axios";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function CheckCredentials() {
  const history = useHistory();
  const queryParameters = new URLSearchParams(window.location.search);

  const checkCrednetials = async () => {
    let body = {
      SsoEmployee: {
        applicantName: queryParameters.get("applicantName"),
        mobileNumber: queryParameters.get("mobileNumber"),
        uid: queryParameters.get("uid"),
        userName: queryParameters.get("userName"),
        email: queryParameters.get("email"),
        rtnUrl: queryParameters.get("rtnUrl"),
        ssoDashboardURL: queryParameters.get("ssoDashboardURL"),
        tokenId: queryParameters.get("tokenId"),
        designationID: queryParameters.get("designationID"),
        designation: queryParameters.get("designation"),
        officeID: queryParameters.get("officeID"),
        officeName: queryParameters.get("officeName"),
      },
    };
    const response = await axios.post("http://103.166.62.118:80/user/users/_ssoEmployee", body);
    sessionStorage.setItem("access_token", response.data.access_token);
    window.open(response.data.ReturnUrl, "_self");
  };

  useEffect(() => {
    checkCrednetials();
  }, []);
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Loader />
    </div>
  );
}
