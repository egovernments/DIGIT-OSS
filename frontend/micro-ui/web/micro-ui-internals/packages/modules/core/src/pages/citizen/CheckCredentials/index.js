// import { CircularProgress } from "@mui/material"
import { Loader } from "@egovernments/digit-ui-react-components"
import axios from "axios"
import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"



export default function CheckCredentials(){
    const history = useHistory();
    const checkCrednetials = async () => {
        console.log("log123... in checkk creadnetials")
        const body = {
            "RequestInfo": {
                "apiId": "Rainmaker",
                "authToken": "64a07739-ea01-465a-a934-28cd5da89ad8",
                "userInfo": {
                    "id": 1776,
                    "uuid": "d9be6393-8aa7-44e4-849a-3361a353f91c",
                    "userName": "7979797979",
                    "name": "Riya",
                    "mobileNumber": "7979797979",
                    "emailId": "riya@gmail.com",
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
                "userId": "39",
                "emailId": "ab@gmail.com",
                "mobileNumber": "9050784899",
                "returnUrl": "http;//103.166.62.118:3001/digit-ui/citizen",
                "redirectUrl": "http;//103.166.62.118:3001/digit-ui/citizen",
                "tokenId": "f03f929c039a90e3ca01b47b403ee61a78084fd9dbc006ae1e04e13fa998fa3d0b358a2468a82eebebc2e65da0da21482ad8136e152466b32974801480c85c1e45e01c9261eef9708117c78751705b72"
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