import React, { useState, useRef, useEffect, useContext  } from "react";
import Personalinfo from "./Personalinfo";
import Genarelinfo from "./Generalinfo";
import Developerinfo from "./Developerinfo";
import AppliedLandinfo from "./AppliedLand";
import Feeandcharges from "./Feeandcharges";
// import JeLandinfo from "./Scrutiny LOI/JE/JE";
// import DisApprovalList from "./DisApprovalList";
// import HistoryList from "./History";
import ScrutinyDevelopment from "./ScrutinyDevelopment/ScrutinyDevelopment";
import { Button, Row, Col } from "react-bootstrap";
// import LicenseDetailsScrutiny from "../ScrutinyBasic/Developer/LicenseDetailsScrutiny";
import { useForkRef } from "@mui/material";
import axios from "axios";
import { ScrutinyRemarksContext } from "../../../../context/remarks-data-context";
import DataGridDemo from "./PatwariHQ";
// import AddIcon from "@mui/icons-material/Add";
// import TemplatesPatwar from "./TemplatePatwari";
import RadioButtonsGroup from "../Proforma/ProformaForAccount";
import IndeterminateCheckbox from "../Proforma/ProformaForJE";
import DrawingBranch from "../Proforma/ProformaForDB";
import ProformaForlegalBranch from "../Proforma/ProformaForlegalBranch";
import ProformaPatwari from "../Proforma/ProformaForPatwari";
import Addmoreinput from "../Complaince/Compliances";
import ProformForRevenu from "../Proforma/ProformForRevenu";
import AdditionalDocument from "./AdditionalDocument/ApplicantInfo";
import Component from "../Proforma/Index";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";
// import AddPost from "../Material/TextEditor";
import {useForm} from "react-hook-form";


import AccountSection from "./CurrentRemarks/CurrentRemarks"
import DrawingSection from "./CurrentRemarks/CurrentDrawing";
import RevnueSection from "./CurrentRemarks/CurrentRevnue";
import LegalSection from "./CurrentRemarks/CurentLegal";
import TechinicalSection from "./CurrentRemarks/CurrentTechinical";
import STPFieldSection from "./CurrentRemarks/CurrentSTPFieldSection";
import DTPFieldSection from "./CurrentRemarks/CurrentDTPFieldSection";
import MainSection from "./CurrentRemarks/CurrentMain";
import LOASection from "./CurrentRemarks/CurrentLOA";
import ExternalSection from "./CurrentRemarks/CurrentExternalSection";
import HistoryList from "./ScrutinyDevelopment/HistoryList";
// import HelpPost from "../Material/TextArea";

const ScrutitnyForms = ({ apiResponse, applicationNumber, refreshScrutinyData ,profrmaID, histeroyData,additionalDocResponData, applicationStatus ,mDMSData ,applicationimp ,dataProfrmaFileds, dataMDMS }) => {
  const personalInfoRef = useRef();
  const generalInfoRef = useRef();
  const developerInfoRef = useRef();
  const appliedInfoRef = useRef();
  const feeandchargesInfoRef = useRef();
  // const feeandcharges = useRef();
  // const licenseDetailsInfoRef = useRef();
  const dateTime = new Date();
  
  const [purpose, setPurpose] = useState("");
  const jeLandInfoRef = useRef();
  const { register, handleSubmit , watch , setValue} = useForm();
  

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

      console.log("Response From API", Resp);
      setDisapprovalData(Resp);
      
    } catch (error) {
      console.log(error);
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
//   console.log("scrutiny form api get", apiResponse !== undefined ? apiResponse?.ApplicantInfo : apiResponse);
//   console.log("scrutiny form api get1", apiResponse !== undefined ? apiResponse?.ApplicantPurpose : apiResponse);
  
//   console.log("remarks api", remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null);

//   console.log("remakes data parsnalinfo", remarksChanges);
// console.log("basiceData",iconStates )
// console.log("roleData",rolesDate )
// const handleData=(data)=>{
//   console.log("savehandle" , data);
// }
const userID = profrmaID?.id
function convertToObjectArray(obj) {
  const result = [];

  for (const key in obj) {
    if (key.endsWith("Label")) {
      const labelKey = key;
      const valueKey = key.replace("Label", "");
      const remarksKey = valueKey + "Remarks";

      const item = {
          fieldIdL: obj[labelKey] || "",
          fieldValue: obj[valueKey] || null,
          comment: obj[remarksKey] || null,
          applicationId: applicationNumber,
          isApproved: "Performa",
          isLOIPart: "",
          userid: userInfo?.id,
          serviceId: "123",
          documentId: null,
          ts: dateTime.toUTCString(),
          bussinessServiceName: "TL",
          designation: designation,
          name: userInfo?.name,
          employeeName: userInfo?.name || null,
          role: filterDataRole,
          applicationStatus: applicationStatus
      };

      result.push(item);
    }
  }

  return result;
}




const handleData = async (data) => {
  if (!userID) {
   
 const payload = {
  "requestInfo": {
      "api_id": "1",
      "ver": "1",
      "ts": null,
      "action": "create",
      "did": "",
      "key": "",
      "msg_id": "",
      "requester_id": "",
      authToken: authToken,
      userInfo: userInfo,
  },
  egScrutiny: convertToObjectArray(data || {}) || []
      
     
  
}


let requestProfrma = {}
try {
  const Resp = await axios.post("/land-services/egscrutiny/_performa/_create?status=submit", payload, {}).then((response) => {
    return response.data;
  });

 requestProfrma = {

    "RequestInfo": {
  
        "apiId": "Rainmaker",
  
        authToken: authToken,
         userInfo: userInfo,
  
        "msgId": "1684320117934|en_IN"
  
    },
  
    PerformaScruitny: {
  
        applicationNumber: applicationNumber,
  
        applicationStatus: applicationStatus,
  
        userName: userInfo?.name,
  
        userId: userInfo?.id,
  
        designation: designation ,
  
        createdOn: dateTime.toUTCString(),
  
        additionalDetails: {
  
          data
  
        }
  
  
  
    }
  
  }




} catch (error) {
  console.log(error);
}

try {
  const Resp = await axios.post(`/tl-services/_performaScrutiny/_create`, requestProfrma).then((response) => {
    return response?.data;
  });


  console.log("savehandle" , data);
  console.log("savehandle" , Resps);

 
} 
catch (error) {
  console.log(error);

}

// handleGetFiledsStatesById(id);
// handleGetRemarkssValues(id);
// handleRoles(id)
console.log("response from API3242526277", Resp);
// props?.remarksUpdate({ data: RemarksDeveloper.data });
} else { 
  // const requestProfrmaUpdate = {

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
    
  //         createdOn: dateTime.toUTCString(),
    
  //         additionalDetails: {
    
  //           data
    
  //         }
    
    
    
  //     }
    
  //   }
  //   try {
  //     const Resp = await axios.post(`/tl-services/_performaScrutiny/_update`, requestProfrmaUpdate).then((response) => {
  //       return response?.data;
  //     });
    
    
  //     console.log("savehandle323" , data);
  //     console.log("savehandle3434" , Resps);
    
     
  //   } 
  //   catch (error) {
  //     console.log(error);
    
  //   }
   
 const payload = {
  "requestInfo": {
      "api_id": "1",
      "ver": "1",
      "ts": null,
      "action": "create",
      "did": "",
      "key": "",
      "msg_id": "",
      "requester_id": "",
      authToken: authToken,
      userInfo: userInfo,
  },
  egScrutiny: convertToObjectArray(data || {}) || []
      
     
  
}


let requestProfrma = {}
try {
  const Resp = await axios.post("/land-services/egscrutiny/_performa/_update", payload, {}).then((response) => {
    return response.data;
  });

 requestProfrma = {

    "RequestInfo": {
  
        "apiId": "Rainmaker",
  
        authToken: authToken,
         userInfo: userInfo,
  
        "msgId": "1684320117934|en_IN"
  
    },
  
    PerformaScruitny: {
  
        applicationNumber: applicationNumber,
  
        applicationStatus: applicationStatus,
  
        userName: userInfo?.name,
  
        userId: userInfo?.id,
  
        designation: designation ,
  
        createdOn: dateTime.toUTCString(),
  
        additionalDetails: {
  
          data
  
        }
  
  
  
    }
  
  }




} catch (error) {
  console.log(error);
}

try {
  const Resp = await axios.post(`/tl-services/_performaScrutiny/_update`, requestProfrma).then((response) => {
    return response?.data;
  });


  console.log("savehandle" , data);
  console.log("savehandle" , Resps);

 
} 
catch (error) {
  console.log(error);

}

}
};

// console.log("Logger...",  convertToObjectArray(x))

// const handleData = async (data) => {
  
//   const payload = {

//   "RequestInfo": {

//       "apiId": "Rainmaker",

//       authToken: authToken,
//        userInfo: userInfo,

//       "msgId": "1684320117934|en_IN"

//   },

//   PerformaScruitny: {

//       applicationNumber: applicationNumber,

//       applicationStatus: applicationStatus,

//       userName: userInfo?.name,

//       userId: userInfo?.id,

//       designation: designation ,

//       createdOn: dateTime.toUTCString(),

//       additionalDetails: {

//         data

//       }



//   }

// }
// const Resp = await axios.post(`/tl-services/_performaScrutiny/_create`, payload )
// console.log("savehandle" , data);
// console.log("savehandle" , Resp);

// }


console.log("userInFODATA123" , userInfo);

  return (
    <div>
      <div style={{ position: "relative", maxWidth: "100%", padding: 2 }}>
        <div>
          <div>
            <Personalinfo
              personalInfoRef={personalInfoRef}
              passUncheckedList={getUncheckedPersonalinfos}
              passCheckedList={getCheckedPersonalInfoValue}
              onClick={() => setOpen(!open)}
              ApiResponseData={apiResponse !== undefined ? apiResponse?.ApplicantInfo : null}
              showTable={curentDataPersonal}
              dataForIcons={iconStates}
              applicationStatus={applicationStatus}
              mDMSData={mDMSData}
              additionalDocRespon={additionalDocResponData}
            ></Personalinfo>
          </div>
          <div>
            <Genarelinfo
              generalInfoRef={generalInfoRef}
              passUncheckedList={getUncheckedGeneralinfos}
              passCheckedList={getCheckedGeneralInfoValue}
              onClick={() => setOpen(!open)}
              ApiResponseData={apiResponse !== undefined ? apiResponse?.ApplicantPurpose : null}
              dataForIcons={iconStates}
              applicationStatus={applicationStatus}
              mDMSData={mDMSData}
              additionalDocRespon={additionalDocResponData}
            ></Genarelinfo>
            {/* </Col> */}
          </div>

          <div>
            <Developerinfo
              developerInfoRef={developerInfoRef}
              purpose={apiResponse ? apiResponse?.ApplicantPurpose?.purpose : null}
              passUncheckedList={getUncheckedPurposeinfos}
              passCheckedList={getCheckedPurposeInfoValue}
              onClick={() => setOpen(!open)}
              ApiResponseData={apiResponse !== undefined ? apiResponse?.LandSchedule : null}
              dataForIcons={iconStates}
              applicationStatus={applicationStatus}
              mDMSData={mDMSData}
              additionalDocRespon={additionalDocResponData}
            ></Developerinfo>
            {/* </Col> */}
          </div>
          <div>
            <AppliedLandinfo
              appliedInfoRef={appliedInfoRef}
              purpose={apiResponse ? apiResponse?.ApplicantPurpose?.purpose : null}
              totalArea={apiResponse ? apiResponse?.ApplicantPurpose?.totalArea : null}
              passUncheckedList={getUncheckedAppliedLandInfo}
              passCheckedList={getCheckedAppliedInfoValue}
              ApiResponseData={apiResponse !== undefined ? apiResponse?.DetailsofAppliedLand : null}
              heightApplied={defaultheightApplied}
              dataForIcons={iconStates}
              applicationStatus={applicationStatus}
              mDMSData={mDMSData}
              additionalDocRespon={additionalDocResponData}
            ></AppliedLandinfo>
            {/* </Col> */}
          </div>
          <div>
            <Feeandcharges
              feeandchargesInfoRef={feeandchargesInfoRef}
              passUncheckedList={getUncheckedFeeandChargesInfo}
              heightFee={defaultheightFee}
              ApiResponseData={apiResponse !== undefined ? apiResponse?.FeesAndCharges : null}
              // feeandchargesData={feeandcharges}
              applicationStatus={applicationStatus}
              mDMSData={mDMSData}
              additionalDocRespon={additionalDocResponData}
            ></Feeandcharges>
         
          </div>
          </div>
          </div>
          {/* <div>
            <AdditionalDocument
            additionalDocRespon={additionalDocResponData}
           
            >
              
            </AdditionalDocument>
          </div> */}

          {/* <div>
            <ProformForRevenu></ProformForRevenu>
          </div>
          <div>
          <RadioButtonsGroup
             apiResponseData ={applicationimp}
             applicationStatus={applicationStatus}
             dataMDMS = {dataMDMS}
          >
      </RadioButtonsGroup>
          </div>
          <div>
          <IndeterminateCheckbox>
      </IndeterminateCheckbox>
          </div>
          <div>
          <ProformaForlegalBranch>
      </ProformaForlegalBranch>
          </div>
          <div>
          <DrawingBranch>
      </DrawingBranch>
          </div> */}
         
          {/* <div>
          <ProformaPatwari
           apiResponseData ={applicationimp}
           applicationStatus={applicationStatus}

           >
           
      </ProformaPatwari>
          </div> */}
          <div  style={{ position: "relative", maxWidth: "100%", padding: 2 }}>
          <div>
            <div
            className="collapse-header"
            onClick={() => setOpen2(!open2)}
            aria-controls="example-collapse-text"
            aria-expanded={open2}
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
            Performa For Scruitny {designation} 
              
            </span>
            {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open2}>
            <div id="example-collapse-text" style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}>
            <form 
            onSubmit={handleSubmit(handleData)}>
            <Component 
          dataMDMS = {dataMDMS}
          register = {register}
          setValue = {setValue}
          dataProfrmaFileds ={dataProfrmaFileds}
              // style={{}}
         />
           {/* <input as="textarea" rows={1} type="text" className="form-control" placeholder="" {...register("landOwnerA")}/> */}
          {/* <button type="submit" >save</button> */}
          <div className="col-sm-2">
            <Button style={{ textAlign: "right" }} value="Submit" id="Submit" type="submit">Submit</Button>
          </div>
            </form>
          </div>
          </Collapse>
          </div>
          
  

        {/* </div> */}
    

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
              {/* - Current Remarks Scruitny  */}
            Current Remarks Section
             
            </span>
            {open3 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open3}>
            <div id="example-collapse-text" 
            // style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >


            <div
            className="collapse-header"
            onClick={() => setOpen5(!open5)}
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
              {/* - Current Remarks Scruitny  */}
              - AccountSection
             
            </span>
            {open5 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open5}>
            <div id="example-collapse-text"
              style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
             >
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
     
       <AccountSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></AccountSection>
    
      </div>
      </div>
      </Collapse>
      <div
            className="collapse-header"
            onClick={() => setOpen6(!open6)}
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
              {/* - Current Remarks Scruitny  */}
              - DrawingSection
             
            </span>
            {open6 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open6}>
            <div id="example-collapse-text" 
            style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >
       <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <DrawingSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></DrawingSection>
    
      </div>
      </div>
      </Collapse>


      <div
            className="collapse-header"
            onClick={() => setOpen7(!open7)}
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
              {/* - Current Remarks Scruitny  */}
              - LegalSection
             
            </span>
            {open7 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open7}>
            <div id="example-collapse-text" 
            // style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >
     

              
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <LegalSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></LegalSection>
    
      </div>
      </div>
      </Collapse>
   

      <div
            className="collapse-header"
            onClick={() => setOpen8(!open8)}
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
              {/* - Current Remarks Scruitny  */}
              - RevnueSection
             
            </span>
            {open8 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open8}>
            <div id="example-collapse-text" 
            // style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >
       


      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <RevnueSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></RevnueSection>
    
      </div>
      </div>
      </Collapse>


      <div
            className="collapse-header"
            onClick={() => setOpen9(!open9)}
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
              {/* - Current Remarks Scruitny  */}
              - TechinicalSection
             
            </span>
            {open9 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open9}>
            <div id="example-collapse-text" 
            // style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >

     
      

      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <TechinicalSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></TechinicalSection>
    
      </div>
      </div>
      </Collapse>


      <div
            className="collapse-header"
            onClick={() => setOpen10(!open10)}
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
              {/* - Current Remarks Scruitny  */}
              - MainSection
             
            </span>
            {open10 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open10}>
            <div id="example-collapse-text" 
            // style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >
     
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <MainSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></MainSection>
    
      </div>
      </div>
      </Collapse>


      <div
            className="collapse-header"
            onClick={() => setOpen11(!open11)}
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
              {/* - Current Remarks Scruitny  */}
              - DTPFieldSection
             
            </span>
            {open11 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open11}>
            <div id="example-collapse-text" 
            // style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >
      
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <DTPFieldSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></DTPFieldSection>
    
      </div>

      </div>
            </Collapse>


            <div
            className="collapse-header"
            onClick={() => setOpen12(!open12)}
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
              {/* - Current Remarks Scruitny  */}
              - STP Field Section
             
            </span>
            {open12 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open12}>
            <div id="example-collapse-text" 
            // style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >
   
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <STPFieldSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></STPFieldSection>
    
      </div>

      </div>
      </Collapse>



      {/* <div
            className="collapse-header"
            onClick={() => setOpen6(!open6)}
            aria-controls="example-collapse-text"
            aria-expanded={open6}
            style={{
              background: "#f1f1f1",
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
          >
      
      
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <LOASection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></LOASection>
    
      </div>


      </div>
      </Collapse> */}



      <div
            className="collapse-header"
            onClick={() => setOpen14(!open14)}
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
              {/* - Current Remarks Scruitny  */}
              - External Section
             
            </span>
            {open14 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open14}>
            <div id="example-collapse-text" 
            // style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
            >
    
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <ExternalSection remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></ExternalSection>
    
      </div>
      </div>
            </Collapse>
</div>
</Collapse>




{/* <div
            className="collapse-header"
            onClick={() => setOpen4(!open4)}
            aria-controls="example-collapse-text"
            aria-expanded={open4}
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
            History Remarks Section 
             
            </span>
            {open4 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open4}>
            <div id="example-collapse-text" style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}>
<div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <HistoryList remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
      
       histeroyData={histeroyData}></HistoryList>
    
      </div>
      </div>
      </Collapse> */}



      {/* <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
        <ScrutinyDevelopment
          remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
        
          histeroyData={histeroyData}
        ></ScrutinyDevelopment>
      </div> */}
      {/* <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
        <TemplatesPatwar
           ApiResponseData={apiResponse !== undefined ? apiResponse?.ApplicantPurpose : null}
        ></TemplatesPatwar>
      </div> */}
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
              {/* - Current Remarks Scruitny  */}
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
            onClick={() => setOpen15(!open15)}
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
              {/* - Current Remarks Scruitny  */}
              ONLINE LICENSE APPLICATION SCRUTINY PROFORMA
             
            </span>
            {open15 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open15}>
            <div id="example-collapse-text"
              style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}
             >
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
      <DataGridDemo
          
          applicationNumber={applicationNumber}
          dataForIcons={rolesDate}
          applicationStatus={applicationStatus}
          remarksData={remarksData}
          >
          </DataGridDemo>
      </div>
      </div>
      </Collapse>


      {/* <div
            className="collapse-header"
            onClick={() => setOpen4(!open4)}
            aria-controls="example-collapse-text"
            aria-expanded={open4}
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
            History Remarks Section 
             
            </span>
            {open4 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
          </div>
          <Collapse in={open4}>
            <div id="example-collapse-text" style={{ marginTop: 12, paddingLeft: 12, paddingRight: 12 }}> */}
<div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 , marginTop: 3}}>
       <HistoryList remarkData={notingRemarksData.egScrutiny !== undefined ? notingRemarksData.egScrutiny : null}
      
       histeroyData={histeroyData}
       applicationStatus={applicationStatus}
       ></HistoryList>
    
      </div>
{/* <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 , marginTop: 3}}>
       <HelpPost 
       ></HelpPost>
    
      </div> */}
      {/* </div>
      </Collapse> */}


    </div>
    </div>
  );
};

export default ScrutitnyForms;
