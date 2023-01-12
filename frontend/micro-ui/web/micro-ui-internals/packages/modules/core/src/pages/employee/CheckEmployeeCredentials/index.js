// import { CircularProgress } from "@mui/material"
import { Loader } from "@egovernments/digit-ui-react-components"
import axios from "axios"
import React, { useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"




export default function CheckCredentials(){

    const history = useHistory();
    const queryParameters = new URLSearchParams(window.location.search)

    const checkCrednetials = async () => {
        const body = {
            "RequestInfo": {
                "apiId": "Rainmaker",
                "authToken": queryParameters.get("authToken"),
                "userInfo": {
                    "id": 1776,
                    "uuid": queryParameters.get("uuid"),
                    "userName": queryParameters.get("userName"),
                    "name": queryParameters.get("name"),
                    "mobileNumber": queryParameters.get("mobileNumber"),
                    "emailId": queryParameters.get("email"),
                    "locale": null,
                    "type": "CITIZEN",
                    "roles": [
                        {
                            "name": "Builder",
                            "code": "BPA_BUILDER",
                            "tenantId": "hr"
                        },
                        {
                            "name": "Citizen",
                            "code": "CITIZEN",
                            "tenantId": "hr"
                        }
                    ],
                    "active": true,
                    "tenantId": "hr",
                    "permanentCity": null
                },
                "msgId": "1672461837709|en_IN"
            },
            "SsoCitizen": {
                "userId": queryParameters.get("userId"),
                "emailId": queryParameters.get("emailId"),
                "mobileNumber": queryParameters.get("mobileNumber"),
                "returnUrl":  queryParameters.get("returnUrl"),
                "redirectUrl":  queryParameters.get("redirectUrl"),
                "tokenId": queryParameters.get("tokenId")
            }
        }
        const response = await axios.post("http://103.166.62.118:80/user/users/_ssoCitizen",body)
        // console.log("_ssoCitizen response ",response.data)
        window.open(response.data.ReturnUrl,"_self");

    }

    useEffect(()=>{
        checkCrednetials();
    },[])
    return(
        <div style={{height:"100%",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}} >
            <Loader/>
        </div>
    )
}