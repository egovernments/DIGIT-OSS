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
            "SsoCitizen": {
                "userId": queryParameters.get("UserId"),
                "emailId": queryParameters.get("EmailId"),
                "mobileNumber": queryParameters.get("MobNo"),
                "returnUrl": queryParameters.get("RedirectUrl"),
                "redirectUrl": queryParameters.get("ReturnUrl"),
                "tokenId": queryParameters.get("TokenId")
            }
        }
        const response = await axios.post("http://103.166.62.118:80/user/users/_ssoCitizen",body)
        localStorage.setItem("access_token",response?.data?.access_token || response?.data?.TokenId);
        localStorage.setItem("token",response?.data?.access_token || response?.data?.TokenId);
        // console.log("_ssoCitizen response ",response.data)
        // window.open(response.data.ReturnUrl,"_self");

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