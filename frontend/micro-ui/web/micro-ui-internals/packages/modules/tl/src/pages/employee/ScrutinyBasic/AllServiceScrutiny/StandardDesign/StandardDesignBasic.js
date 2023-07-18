import React, { useState, useRef, useEffect, useContext } from "react";
import ScrutinyDevelopment from "../../ScrutinyDevelopment/ScrutinyDevelopment";
import { ScrutinyRemarksContext } from "../../../../../../context/remarks-data-context/index";

import { Button, Row, Col } from "react-bootstrap";
import { useForkRef } from "@mui/material";
import axios from "axios";
import StandardDesign from "./StandardDesign";

import AccountSection from "../../CurrentRemarks/CurrentRemarks";
import DrawingSection from "../../CurrentRemarks/CurrentDrawing";
import LegalSection from "../../CurrentRemarks/CurentLegal";
import RevnueSection from "../../CurrentRemarks/CurrentRevnue";
import TechinicalSection from "../../CurrentRemarks/CurrentTechinical";
import MainSection from "../../CurrentRemarks/CurrentMain";
import DTPFieldSection from "../../CurrentRemarks/CurrentDTPFieldSection";
import STPFieldSection from "../../CurrentRemarks/CurrentSTPFieldSection";
import ExternalSection from "../../CurrentRemarks/CurrentExternalSection";
import Addmoreinput from "../../../Complaince/Compliances";
import BaseTableGrid from "../../ServicePlanScrutniy/BaseTableGrid";
import HistoryList from "../../ScrutinyDevelopment/HistoryList";

import {useForm} from "react-hook-form";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";

const StandardDesignBasic = ({apiResponse,applicationNumber,refreshScrutinyData,setAdditionalDetails,histeroyData,idwDataTreade,edcDataTreade,applicationStatus,applicationimp }) => {
  const dateTime = new Date();
  
  const [purpose, setPurpose] = useState("");
  const jeLandInfoRef = useRef();
  const { register, handleSubmit , watch , setValue, formState:{errors}} = useForm();
  
  const { id } = useParams();
  const [displayPersonal, setDisplayPersonalInfo] = useState([]);
  const [displayPersonalCHeckedList, setDisplayCheckedPersonalList] = useState([]);
  const [displayGeneralCHeckedList, setDisplayCheckedGeneralList] = useState([]);
  const [displayPurposeCHeckedList, setDisplayCheckedPurposeList] = useState([]);
  const [displayAppliedLandCheckedList, setDisplayCheckedAppliedLandList] = useState([]);
  const [displayPurpose, setDisplayPurposeInfo] = useState([]);
  const [displayGeneral, setDisplayGeneralInfo] = useState([]);
  const [displayAppliedLand, setDisplayAppliedLandInfo] = useState([]);
  const [displayFeeandCharges, setDisplayFeeandChargesInfo] = useState([]);
  // const [displayLicenseDetails, setDisplayLicenseDetailsInfo] = useState([]);
  // const [displayLicenseDetailsCheckedlist, setDisplayCheckedLicenseDetailsList] = useState([]);
const {remarksData,notingRemarksData,iconStates,rolesDate,handleRoles,handleGetFiledsStatesById,handleGetRemarkssValues,handleGetNotingRemarkssValues } = useContext(ScrutinyRemarksContext);
  const [displayJeLand, setDisplayJeLand] = useState([]);
  const [ActiveKey, setActiveKey] = useState(1);
  const [defaultHeightPersonal, setDefaultHeightPersonal] = useState(0);
  const [defaultHeightGen, setDefaultHeightGen] = useState(120);
  const [defaultheightDevelper, setDefaultheightDevelper] = useState(0);
  const [defaultheightApplied, setDefaultheightApplied] = useState(0);
  const [defaultheightFee, setDefaultheightFee] = useState(0);
  const [remarksDataAccount, setRemarksDataAccount] = useState({});
  const [remarksDataDrawing, setRemarksDataDrawing] = useState({});
  const [remarksDataLegal, setRemarksDataLegal] = useState({});
  const [remarksDataRevnue, setRemarksDataRevnue] = useState({});
  const [remarksDataTechinical, setRemarksDataTechinical] = useState({});
  const [remarksDataMain, setRemarksDataMain] = useState({});
  const [remarksDataDTPField, setRemarksDataDTPField] = useState({});
  const [remarksDataSTPField, setRemarksDataSTPField] = useState({});
  const [remarksDataExternal, setRemarksDataExternal] = useState({});
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);
  const [open6, setOpen6] = useState(false);
  const [open7, setOpen7] = useState(false);
  const [open8, setOpen8] = useState(false);
  const [open9, setOpen9] = useState(false);
  const [open10, setOpen10] = useState(false);
  const [open11, setOpen11] = useState(false);
  const [open12, setOpen12] = useState(false);
  const [open13, setOpen13] = useState(false);
  const [open14, setOpen14] = useState(false);
  const [open15, setOpen15] = useState(false);
  const [open16, setOpen16] = useState(false);
  const [open17, setOpen17] = useState(false);
  const [open18, setOpen18] = useState(false);
  const [open19, setOpen19] = useState(false);

  const [smShow, setSmShow] = useState(false);
// const [roleDataModal, setRoleDataModal] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const handlemodaldData = () => {
    setSmShow(false);
  };
  // const [open6, setOpen6] = useState(false);
  // const [open6, setOpen6] = useState(false);
  // const [apiResponse, setApiResponse] = useState({});
  // const [remarksResponse, setRemarksResponse] = useState({});
  const [sumrol, setSumrol] = useState({});
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [remarksChanges, setRemarksChanges] = useState("");
  const [disapprovalData, setDisapprovalData] = useState({});
  const [applictaionNo, setApplicationNO] = useState(null);
  // const [iconStates,setIconState]= useState(null)
  const [urlGetShareHoldingDoc, setDocShareHoldingUrl] = useState("");

  // const userInfo = Digit.UserService.getUser()?.info || {};
  const authToken = Digit.UserService.getUser()?.access_token || null;

  const userInfo = Digit.UserService.getUser()?.info || {};
 const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
  const filterDataRole = userRolesArray?.[0]?.code;
  const designation = userRolesArray?.[0]?.name;
  

  console.log("usern23233" , userRolesArray );
  console.log("usern23" , filterDataRole );
  console.log("usern23434" , designation );


  const getUncheckedPersonalinfos = (data) => {
    setDisplayPersonalInfo(data.data);
    console.log("data parent label", data);
  };
  const getCheckedPersonalInfoValue = (data) => {
    setDisplayCheckedPersonalList(data.data);
    console.log("checked parent personal info data", data);
  };
  // g

  // const getUncheckedLicenseDetailsInfo = (data) => {
  //   setDisplayLicenseDetailsInfo(data.data);
  //   console.log("data parent label", data);
  // };
  // const getCheckedLicenseDetailsInfoValue = (data) => {
  //   setDisplayCheckedLicenseDetailsList(data.data);
  //   console.log("checked parent personal info data", data);
  // };

  const getUncheckedGeneralinfos = (data) => {
    setPurpose(data.purpose);
    setDisplayGeneralInfo(data.data);
    // console.log("abc", data);
    console.log(data);
  };
  const getCheckedGeneralInfoValue = (data) => {
    setDisplayCheckedGeneralList(data.data);
    console.log("checked parent General info data", data);
  };

  const getUncheckedPurposeinfos = (data) => {
    setDisplayPurposeInfo(data.data);
    console.log(data);
  };
  const getCheckedPurposeInfoValue = (data) => {
    setDisplayCheckedPurposeList(data.data);
    console.log("checked parent personal info data", data);
  };

  const getUncheckedAppliedLandInfo = (data) => {
    setDisplayAppliedLandInfo(data.data);
    console.log(data);
  };
  const getCheckedAppliedInfoValue = (data) => {
    setDisplayCheckedAppliedLandList(data.data);
    console.log("checked parent personal info data", data);
  };
  const getUncheckedFeeandChargesInfo = (data) => {
    setDisplayFeeandChargesInfo(data.data);
    console.log(data);
  };
  // const handleGetInputFieldsValues = async () => {
  //   try {
  //     const Resp = await axios.get("/tl-services/new/licenses/_get?id=702").then((response) => {
  //       return response.data;
  //     });

  //     console.log("Response From API", Resp);
  //     setApiResponse(Resp);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleGetFiledsStatesById=async()=>{
  //     const dataToPass={
  //       "RequestInfo": {
  //           "api_id": "1",
  //           "ver": "1",
  //           "ts": null,
  //           "action": "create",
  //           "did": "",
  //           "key": "",
  //           "msg_id": "",
  //           "requester_id": "",
  //           "auth_token": authToken,
  //           "authToken": authToken
  //       }
  //   };
  //   try {
  //     const Resp = await axios.post(`/land-services/egscrutiny/_search?applicationNumber=${applicationNumber}&userId=${userInfo?.id}`, dataToPass).then((response) => {
  //       return response.data;
  //     });

  //     console.log("Response From API", Resp);
  //     setIconState(Resp);
  //     // setApiResponse(Resp);
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }
  const handleGetDisapprovalList = async () => {
    setLoader(true);
   
    const dataToPass = {
      RequestInfo: {
        api_id: "1",
        ver: "1",
        ts: null,
        action: "create",
        did: "",
        key: "",
        msg_id: "",
        requester_id: "",
        auth_token: authToken,
        // authToken: authToken
      },
    };
    try {
      const Resp = await axios
        .post(`/land-services/egscrutiny/_searchbylogin?applicationId=${apiResponse?.id}&userid=${userInfo?.id}`, dataToPass)
        .then((response) => {
          return response.data;
        });
        setLoader(false);
      console.log("Response From API", Resp);
      setDisapprovalData(Resp);
      
    } catch (error) {
      console.log(error);
      setLoader(false);
      return error.message;
    }
  };
  // const handleGetRemarkssValues = async () => {
  //   const dataToSend = {
  //     RequestInfo: {
  //       apiId: "Rainmaker",
  //       action: "_create",
  //       did: 1,
  //       key: "",
  //       msgId: "20170310130900|en_IN",
  //       ts: 0,
  //       ver: ".01",
  //       authToken: authToken,
  //       userInfo: userInfo,
  //     },
  //   };
  //   try {
  //     const Resp = await axios.post(`/land-services/egscrutiny/_search?applicationNumber=${applicationNumber}&userId=${userInfo?.id}`, dataToSend).then((response) => {
  //       return response.data;
  //     });

  //     console.log("Response From API", Resp);
  //     setRemarksResponse(Resp);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (apiResponse?.id) {
      handleGetDisapprovalList();
    }
  }, [remarksChanges, apiResponse]);

  useEffect(() => {
    if (applicationNumber) {
      handleGetRemarkssValues(applicationNumber);
    }
  }, [applicationNumber]);

  useEffect(() => {
    if (applicationNumber) {
      handleGetFiledsStatesById(applicationNumber);
    }
  }, [applicationNumber]);

  useEffect(() => {
    if (applicationNumber) {
      
      handleRoles(applicationNumber); 
      handleGetNotingRemarkssValues(applicationNumber); 
    }
   
  }, [applicationNumber]);

  

  const curentDataPersonal = (data) => {
    setRemarksChanges(data.data);
  };

  console.log(uncheckedValue);
  console.log("React", purpose);

  const ApllicantFormHandler = (data) => {
    setActiveKey(2);
  };
  const PuposeformHandler = (data) => {
    setActiveKey(3);
  };
  const LandFormHandler = (data) => {
    setActiveKey(4);
  };
  const AppliedDetailFormHandler = (data) => {
    setActiveKey(5);
  };

  const handleScrolltoPersonal = () => {
    // personalInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultHeightPersonal === 0) {
      setDefaultHeightPersonal("auto");
    } else {
      setDefaultHeightPersonal(0);
    }
  };

  const handleScrolltOGeneral = () => {
    // generalInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultHeightGen === 0) {
      setDefaultHeightGen("auto");
    } else {
      setDefaultHeightGen(0);
    }
  };
  const handleScrolltoDeveloper = () => {
    // developerInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightDevelper === 0) {
      setDefaultheightDevelper("auto");
    } else {
      setDefaultheightDevelper(0);
    }
  };

  const handleScrolltoAppliedLandInfo = () => {
    // appliedInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightApplied === 0) {
      setDefaultheightApplied("auto");
    } else {
      setDefaultheightApplied(0);
    }
  };
  const handleScrolltoFeeandChargesInfo = () => {
    // feeandchargesInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightFee === 0) {
      setDefaultheightFee("auto");
    } else {
      setDefaultheightFee(0);
    }
  };
// parforma
// const userID = profrmaID?.id
// function convertToObjectArray(obj) {
//   const result = [];

//   for (const key in obj) {
//     if (key.endsWith("Label")) {
//       const labelKey = key;
//       const valueKey = key.replace("Label", "");
//       const remarksKey = valueKey + "Remarks";

//       const item = {
//           fieldIdL: obj[labelKey] || "",
//           fieldValue: obj[valueKey] || null,
//           comment: obj[remarksKey] || null,
//           applicationId: applicationNumber,
//           isApproved: "Proforma",
//           isLOIPart: "",
//           userid: userInfo?.id,
//           serviceId: "123",
//           documentId: null,
         
//           bussinessServiceName: "TL",
//           designation: designation,
//           name: userInfo?.name,
//           employeeName: userInfo?.name || null,
//           role: filterDataRole,
//           applicationStatus: applicationStatus
//       };

//       result.push(item);
//     }
//   }

//   return result;
// }




// const handleData = async (data) => {
//   if (!userID) {
//     setLoader(true);
//  const payload = {
//   "requestInfo": {
//       "api_id": "1",
//       "ver": "1",
//       "ts": null,
//       "action": "create",
//       "did": "",
//       "key": "",
//       "msg_id": "",
//       "requester_id": "",
//       authToken: authToken,
//       userInfo: userInfo,
//   },
//   egScrutiny: convertToObjectArray(data || {}) || []
      
     
  
// }


// let requestProfrma = {}
// try {
//   const Resp = await axios.post("/land-services/egscrutiny/_performa/_create?status=submit", payload, {}).then((response) => {
//     return response.data;
//   });

//  requestProfrma = {

//     "RequestInfo": {
  
//         "apiId": "Rainmaker",
  
//         authToken: authToken,
//          userInfo: userInfo,
  
//         "msgId": "1684320117934|en_IN"
  
//     },
  
//     PerformaScruitny: {
  
//         applicationNumber: applicationNumber,
  
//         applicationStatus: applicationStatus,
  
//         userName: userInfo?.name,
  
//         userId: userInfo?.id,
  
//         designation: designation ,
  
       
  
//         additionalDetails: {
  
//           data
  
//         }
  
  
  
//     }
  
//   }

//   setLoader(true);
 

// } catch (error) {
//   console.log(error);
// }

// try {
//   const Resp = await axios.post(`/tl-services/_performaScrutiny/_create`, requestProfrma).then((response) => {
//     return response?.data;
//   });

//   setLoader(false);
//   console.log("savehandle" , data);
//   console.log("savehandle" , Resps);
  
 
// } 
// catch (error) {
//   console.log(error);

// }
// handleGetNotingRemarkssValues(id)
// setOpen19(true);
// console.log("response from API3242526277", Resp);

// } else { 
//   setLoader(true);
 
   
//  const payload = {
//   "requestInfo": {
//       "api_id": "1",
//       "ver": "1",
//       "ts": null,
//       "action": "create",
//       "did": "",
//       "key": "",
//       "msg_id": "",
//       "requester_id": "",
//       authToken: authToken,
//       userInfo: userInfo,
//   },
//   egScrutiny: convertToObjectArray(data || {}) || []
      
// }


// let requestProfrma = {}
// try {
//   const Resp = await axios.post("/land-services/egscrutiny/_performa/_update", payload, {}).then((response) => {
//     return response.data;
//   });

//  requestProfrma = {

//     "RequestInfo": {
  
//         "apiId": "Rainmaker",
  
//         authToken: authToken,
//          userInfo: userInfo,
  
//         "msgId": "1684320117934|en_IN"
  
//     },
  
//     PerformaScruitny: {
  
//         applicationNumber: applicationNumber,
  
//         applicationStatus: applicationStatus,
  
//         userName: userInfo?.name,
  
//         userId: userInfo?.id,
  
//         designation: designation ,
  
  
//         additionalDetails: {
  
//           data
  
//         }
  
  
  
//     }
  
//   }




// } catch (error) {
//   console.log(error);
// }

// try {
//   const Resp = await axios.post(`/tl-services/_performaScrutiny/_update`, requestProfrma).then((response) => {
//     return response?.data;
//   });

//   setLoader(false);
//   console.log("savehandle" , data);
//   console.log("savehandle" , Resps);
 
 
// } 
// catch (error) {
//   console.log(error);

// }
// setLoader(false);
// setOpen19(true);
// }

// handleGetNotingRemarkssValues(id)

// };


// const handalfinal = () => {
//   setOpen(false);
// }

////////////////////(1)Account Section ///////////////

const handleAccountClick = async () =>{
  setLoader(true);
   console.log("logger1234...",applicationNumber)
  // if(open5===true){

  
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=Accounts,Accounts Officer,AO_HQ,CAO,CAO_HQ,AO,SO,SO_HQ`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataAccount(Resp);
      
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
// }
// else{
//   console.log(error);
// }
};

////////////////////(2)Drawing Section ///////////////
const handleDrawingClick = async () =>{
  setLoader(true);
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=Drawing Branch,Drafts Man,SD_HQ,Draftsman,Senior Draftmans,Assistant Draftsman,JD,Junior Draftsman,JD_HQ,PA,PA_HQ,ADA_HQ,AD_HQ,JE_HQ,ASST_JE_HQ`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataDrawing(Resp);
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
};

////////////////////(3)Legal Section ///////////////
const handleLegalClick = async () =>{
  setLoader(true);
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=DA,DDA,ADA,DA_HQ,DDA_HQ,ADA_HQ,Assistant District Atorney,District Attorney`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataLegal(Resp);
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
};
////////////////////(4)Revnue Section ///////////////
const handleRevnueClick = async () =>{
  setLoader(true);
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=Naib Tehsildar,Patwari_HQ,Patwari,Naib Tehsildar,Patwari,PATWARI`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataRevnue(Resp);
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
};
////////////////////(5)Techinical Section ///////////////
const handleTechinicalClick = async () =>{
  setLoader(true);
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=Personal Assistant,JD_HQ,PA,PA_HQ,JE,Assistant,JE_HQ,Junior Engineer,Junier Engineer,Jr Engineer`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataTechinical(Resp);
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
};
////////////////////(6)Main Section ///////////////
const handleMainClick = async () =>{
  setLoader(true);
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=DGTCP,District Town Planner,DISTRICT TOWN PLANNER,STPEnforcement Office HQ,DTP_HQ,DTP,ATP_HQ,ATP,STP_HQ,STP,CTP_HQ,CTP,DTCP_HQ`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataMain(Resp);
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
};

////////////////////(7)DTP Field Section ///////////////
const handleDTPFieldClick = async () =>{
  setLoader(true);
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=Planning Assistant Field,Accounts Field,Personal Assistant Field,Junior Draftsman Field,DTP_FIELD,DB Field,ATP Field,Draftsman Field,DTP Field,Patwari_FIELD,PATWARI Field,Patwari,PATWARI Circle,PATWARI,JE_FIELD,JD_FIELD,SD_FIELD,Junior Engineer Field,Draftsman Field,Assistant District Atorney Field`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataDTPField(Resp);
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
};
////////////////////(8)STP Field Section ///////////////
const handleSTPFieldClick = async () =>{
  setLoader(true);
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=STPEnforcement Office-Gurugram,STP Circle,STP_Circle,STP Office-Gurugram,STP Office-Faridabad,STP Office-Panchkula,STP Office-Rohtak,STP Office-Hisar,STP Circle`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataSTPField(Resp);
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
};
////////////////////(9)External Section ///////////////
const handleExternalClick = async () =>{
  setLoader(true);
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
      const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${applicationNumber}&roles=LAO,HSIIDC,DFO,DUE,DC`, dataToSend).then((response) => {
          return response.data;
      });

      console.log("RemarksSection", Resp);
      setLoader(false);
      setRemarksDataExternal(Resp);
  } catch (error) {
    setLoader(false);
      console.log(error);
  }
};




  return (
    <div>
      <div style={{ position: "relative", maxWidth: "100%", padding: 2 }}>
        <div>
         <div>
         <StandardDesign
       
           apiResponse={apiResponse}
           refreshScrutinyData={refreshScrutinyData}
           applicationNumber={applicationNumber}
           passUncheckedList={getUncheckedGeneralinfos}
           passCheckedList={getCheckedGeneralInfoValue}
           onClick={() => setOpen(!open)}
           dataForIcons={iconStates}
           applicationStatus={applicationStatus}
           ></StandardDesign>
         </div>
        </div>
      </div>
      
      <div  style={{ position: "relative", maxWidth: "100%", padding: 2 }}>
            
           
        
        
              <div
                    className="collapse-header"
                    onClick={() => setOpen3(!open3)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open3}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                   
                    Current Remarks Section
                     
                    </span>
                    {open3 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open3}>
                    <div id="example-collapse-text" 
                 
                    >
        
        
                    <div
                    className="collapse-header"
                    onClick={() => {setOpen5(!open5) , handleAccountClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open5}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                     
                      - AccountSection
                     
                    </span>
                    {open5 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open5}>
                    <div id="example-collapse-text"
                      style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
                     >
              <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
             
               <AccountSection remarkData={remarksDataAccount.egScrutiny !== undefined ? remarksDataAccount.egScrutiny : null}
              
               histeroyData={histeroyData}></AccountSection>
            
              </div>
              </div>
              </Collapse>
              <div
                    className="collapse-header"
                    onClick={() => {setOpen6(!open6) , handleDrawingClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open6}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                   
                      - DrawingSection
                     
                    </span>
                    {open6 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open6}>
                    <div id="example-collapse-text" 
                    style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
                    >
               <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
               <DrawingSection remarkData={remarksDataDrawing.egScrutiny !== undefined ? remarksDataDrawing.egScrutiny : null}
              
               histeroyData={histeroyData}></DrawingSection>
            
              </div>
              </div>
              </Collapse>
        
        
              <div
                    className="collapse-header"
                    onClick={() => {setOpen7(!open7) , handleLegalClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open7}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                   
                      - LegalSection
                     
                    </span>
                    {open7 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open7}>
                    <div id="example-collapse-text" 
                 
                    >
             
        
                      
              <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
               <LegalSection remarkData={remarksDataLegal.egScrutiny !== undefined ? remarksDataLegal.egScrutiny : null}
              
               histeroyData={histeroyData}></LegalSection>
            
              </div>
              </div>
              </Collapse>
           
        
              <div
                    className="collapse-header"
                    onClick={() => {setOpen8(!open8) , handleRevnueClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open8}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
               
                      - RevnueSection
                     
                    </span>
                    {open8 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open8}>
                    <div id="example-collapse-text" 
                 
                    >
               
        
        
              <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
               <RevnueSection remarkData={remarksDataRevnue.egScrutiny !== undefined ? remarksDataRevnue.egScrutiny : null}
              
               histeroyData={histeroyData}></RevnueSection>
            
              </div>
              </div>
              </Collapse>
        
        
              <div
                    className="collapse-header"
                    onClick={() => {setOpen9(!open9) , handleTechinicalClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open9}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                
                      - TechinicalSection
                     
                    </span>
                    {open9 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open9}>
                    <div id="example-collapse-text" 
         
                    >
        
             
              
        
              <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
               <TechinicalSection remarkData={remarksDataTechinical.egScrutiny !== undefined ? remarksDataTechinical.egScrutiny : null}
              
               histeroyData={histeroyData}></TechinicalSection>
            
              </div>
              </div>
              </Collapse>
        
        
              <div
                    className="collapse-header"
                    onClick={() => {setOpen10(!open10) , handleMainClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open10}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                
                      - MainSection
                     
                    </span>
                    {open10 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open10}>
                    <div id="example-collapse-text" 
                  
                    >
             
              <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
               <MainSection remarkData={remarksDataMain.egScrutiny !== undefined ? remarksDataMain.egScrutiny : null}
              
               histeroyData={histeroyData}></MainSection>
            
              </div>
              </div>
              </Collapse>
        
        
              <div
                    className="collapse-header"
                    onClick={() => {setOpen11(!open11) , handleDTPFieldClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open11}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                   
                      - DTPFieldSection
                     
                    </span>
                    {open11 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open11}>
                    <div id="example-collapse-text" 
                 
                    >
              
              <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
               <DTPFieldSection remarkData={remarksDataDTPField.egScrutiny !== undefined ? remarksDataDTPField.egScrutiny : null}
              
               histeroyData={histeroyData}></DTPFieldSection>
            
              </div>
        
              </div>
                    </Collapse>
        
        
                    <div
                    className="collapse-header"
                    onClick={() => {setOpen12(!open12) , handleSTPFieldClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open12}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
        
                      - STP Field Section
                     
                    </span>
                    {open12 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open12}>
                    <div id="example-collapse-text" 
           
                    >
           
              <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
               <STPFieldSection remarkData={remarksDataSTPField.egScrutiny !== undefined ? remarksDataSTPField.egScrutiny : null}
              
               histeroyData={histeroyData}></STPFieldSection>
            
              </div>
        
              </div>
              </Collapse>
        
        
        
        
        
              <div
                    className="collapse-header"
                    onClick={() => {setOpen14(!open14) , handleExternalClick()}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open14}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                 
                      - External Section
                     
                    </span>
                    {open14 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open14}>
                    <div id="example-collapse-text" 
               
                    >
            
              <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
               <ExternalSection remarkData={remarksDataExternal.egScrutiny !== undefined ? remarksDataExternal.egScrutiny : null}
              
               histeroyData={histeroyData}></ExternalSection>
            
              </div>
              </div>
                    </Collapse>
        </div>
        </Collapse>
        
         
        
        
   
        
        
        
              <div
                    className="collapse-header"
                    onClick={() => setOpen13(!open13)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open13}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                     
                      Add Compliances
                     
                    </span>
                    {open13 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open13}>
                    <div id="example-collapse-text"
                      style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
                     >
              
              <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
              <Addmoreinput
              applicationimp={applicationimp}
              >
              </Addmoreinput>
              </div>
              </div>
              </Collapse>
             
              
         
              
              <div
                    className="collapse-header"
                    onClick={() => {
                      setOpen15(!open15); 
                      setSmShow(true);}}
                    aria-controls="example-collapse-text"
                    aria-expanded={open15}
                    style={{
                      background: "#E9E5DE",
                      padding: "0.25rem 1.25rem",
                      borderRadius: "0.25rem",
                      fontWeight: "600",
                      display: "flex",
                      cursor: "pointer",
                      color: "#817f7f",
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <span style={{ color: "#817f7f", fontSize: 16 }} className="">
                      
                      ONLINE LICENSE APPLICATION SCRUTINY PROFORMA
                     
                    </span>
                    {open15 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
                  </div>
                  <Collapse in={open15}>
                    <div id="example-collapse-text"
                      style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
                     >
              <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
              <BaseTableGrid
                   passmodalData={handlemodaldData}
                   displaymodal={smShow}
                 
                   onClose={() => { setSmShow(false); setDocModal(false) }}
                
                  >
                  
                  </BaseTableGrid>
                
              </div>
              </div>
              </Collapse>
        
        
        <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 , marginTop: 3}}>
               <HistoryList remarkData={notingRemarksData.egScrutiny !== undefined ? notingRemarksData.egScrutiny : null}
              
               histeroyData={histeroyData}
               applicationStatus={applicationStatus}
           
               ></HistoryList>
            
              </div>
        
        
        </div>

      {/* <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
        <ScrutinyDevelopment
          remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
    
          histeroyData={histeroyData}
        ></ScrutinyDevelopment>
      </div> */}
      
    </div>
  );
};

export default StandardDesignBasic;
