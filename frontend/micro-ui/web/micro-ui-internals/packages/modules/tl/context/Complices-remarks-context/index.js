import axios from "axios";
import React, { createContext, useState } from "react";



const ComplicesRemarksContext = createContext();



const ComplicesRemarksProvider = ({ children }) => {

    const [remarksData, setRemarksData] = useState({});
    // const [ additionalDocRespon, SetAdditionalDocRespon]= useState(null);
    const [rolesDate,setRolesData]= useState(null);
    const [bussinessService , setBusinessService] = useState("");
  
    const userInfo = Digit.UserService.getUser()?.info || {};
    const authToken = Digit.UserService.getUser()?.access_token || null;



    const compliceGetRemarkssValues = async (tcpApplicationNumber) => {
        console.log("logger1234...",tcpApplicationNumber)
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
                userInfo: userInfo
               
            },
        };
        try {
            const Resp = await axios.post(`/tl-services/_compliance/_search?applicationNumber=${tcpApplicationNumber}`, dataToSend).then((response) => {
                return response.data;
            });

            console.log("Response From API", Resp);
            setRemarksData(Resp);
        } catch (error) {
            console.log(error);
        }
    };


    // const parfomaGetRemarkssValues = async (tcpApplicationNumber) => {
    //     console.log("logger1234...",tcpApplicationNumber)
    //     const dataToSend = {
    //         RequestInfo: {
    //             apiId: "Rainmaker",
    //             action: "_create",
    //             did: 1,
    //             key: "",
    //             msgId: "20170310130900|en_IN",
    //             ts: 0,
    //             ver: ".01",
    //             authToken: authToken,
    //             userInfo: userInfo
               
    //         },
    //     };
    //     try {
            
    //         const Resp = await axios.post(`/tl-services/_compliance/_search?applicationNumber=${tcpApplicationNumber}&businessService=NewTL`, dataToSend).then((response) => {
    //             return response.data;
    //         });

    //         console.log("Response From API", Resp);
    //         SetAdditionalDocRespon(Resp);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

   


    return (
        <ComplicesRemarksContext.Provider value={{remarksData,compliceGetRemarkssValues,setRemarksData }}>
            {children}
        </ComplicesRemarksContext.Provider>
    )
}

export { ComplicesRemarksContext, ComplicesRemarksProvider  }