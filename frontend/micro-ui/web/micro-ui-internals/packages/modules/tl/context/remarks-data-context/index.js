import axios from "axios";
import React, { createContext, useState } from "react";



const ScrutinyRemarksContext = createContext();



const ScrutinyRemarksProvider = ({ children }) => {

    const [remarksData, setRemarksData] = useState({});
    const [iconStates,setIconState]= useState(null);
    const [rolesDate,setRolesData]= useState(null);
    const [bussinessService , setBusinessService] = useState("");
  
    const userInfo = Digit.UserService.getUser()?.info || {};
    const authToken = Digit.UserService.getUser()?.access_token || null;



    const handleGetRemarkssValues = async (applicationNumber) => {
        console.log("logger1234...",applicationNumber)
        const dataToSend = {
            RequestInfo: {
                apiId: "Rainmaker",
                action: "_create",
                did: 1,
                key: "",
                msgId: "20170310130900|en_IN",
                ts: 0,
                ver: ".01",
                authToken: authToken,
               
            },
        };
        try {
            const Resp = await axios.post(`/land-services/egscrutiny/_search3?applicationNumber=${applicationNumber}`, dataToSend).then((response) => {
                return response.data;
            });

            console.log("Response From API", Resp);
            setRemarksData(Resp);
        } catch (error) {
            console.log(error);
        }
    };


    const handleGetFiledsStatesById=async(applicationNumber)=>{
        console.log("logger123...",applicationNumber)
        const dataToPass={
          "RequestInfo": {
              "api_id": "1",
              "ver": "1",
              "ts": null,
              "action": "create",
              "did": "",
              "key": "",
              "msg_id": "",
              "requester_id": "",
              "auth_token": authToken,
              "authToken": authToken
          }
      };
      try {
        const Resp = await axios.post(`/land-services/egscrutiny/_search?applicationNumber=${applicationNumber}&userId=${userInfo?.id}`, dataToPass).then((response) => {
          return response.data;
        });
  
        console.log("Response From API", Resp);
        setIconState(Resp);
        // setApiResponse(Resp);
      } catch (error) {
        console.log(error);
      }
  
    }

    const handleRoles = async (applicationNumber) => {
        console.log("applicationlog...",applicationNumber)
        const dataToSend = {
            RequestInfo: {
                apiId: "Rainmaker",
                action: "_create",
                did: 1,
                key: "",
                msgId: "20170310130900|en_IN",
                ts: 0,
                ver: ".01",
                authToken: authToken,
               
            },
        };
        try {
            const Resp = await axios.post(`/land-services/egscrutiny/_search2?applicationNumber=${applicationNumber}`, dataToSend).then((response) => {
                return response.data;
            });

            console.log("Response roles", Resp);
            setRolesData(Resp);
        } catch (error) {
            console.log(error);
        }
    };
    


    return (
        <ScrutinyRemarksContext.Provider value={{remarksData,iconStates,rolesDate,handleRoles,handleGetFiledsStatesById,handleGetRemarkssValues,bussinessService,setBusinessService}}>
            {children}
        </ScrutinyRemarksContext.Provider>
    )
}

export { ScrutinyRemarksContext, ScrutinyRemarksProvider }