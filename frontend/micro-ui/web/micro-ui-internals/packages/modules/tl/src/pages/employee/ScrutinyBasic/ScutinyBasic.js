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
import AdditionalDocument from "./AdditionalDocument";
import Component from "../Proforma/Index";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";
// import AddPost from "../Material/TextEditor";
import {useForm} from "react-hook-form";

const ScrutitnyForms = ({ apiResponse, applicationNumber, refreshScrutinyData , histeroyData,additionalDocResponData, applicationStatus ,mDMSData ,applicationimp , dataMDMS }) => {
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
  const { register, handleSubmit , watch } = useForm();
  

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
const { remarksData,iconStates,rolesDate,handleRoles,handleGetFiledsStatesById,handleGetRemarkssValues } = useContext(ScrutinyRemarksContext);
  const [displayJeLand, setDisplayJeLand] = useState([]);
  const [ActiveKey, setActiveKey] = useState(1);
  const [defaultHeightPersonal, setDefaultHeightPersonal] = useState(0);
  const [defaultHeightGen, setDefaultHeightGen] = useState(120);
  const [defaultheightDevelper, setDefaultheightDevelper] = useState(0);
  const [defaultheightApplied, setDefaultheightApplied] = useState(0);
  const [defaultheightFee, setDefaultheightFee] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
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

const Resp = await axios.post(`/land-services/egscrutiny/_performa/_create?status=submit`, payload )
console.log("savehandle" , data);
console.log("savehandle" , Resp);
}



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
            ></Feeandcharges>
         
          </div>
          <div>
            <AdditionalDocument
            additionalDocRespon={additionalDocResponData}
           
            >
              
            </AdditionalDocument>
          </div>
          <div>
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
          </div>
         
          <div>
          <ProformaPatwari
           apiResponseData ={applicationimp}
           applicationStatus={applicationStatus}

           >
           
      </ProformaPatwari>
          </div>
          <div>
            <div
            className="collapse-header"
            onClick={() => setOpen2(!open2)}
            aria-controls="example-collapse-text"
            aria-expanded={open2}
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
            <span style={{ color: "#817f7f", fontSize: 14 }} className="">
              - Performa
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

         />
           {/* <input as="textarea" rows={1} type="text" className="form-control" placeholder="" {...register("landOwnerA")}/> */}
          <button type="submit" >save</button>
            </form>
          </div>
          </Collapse>
          </div>
          
          <div>
            
          </div>

        </div>
      </div>
      {/* <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
       <AddPost></AddPost>
      </div> */}

      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
        <ScrutinyDevelopment
          remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
          // remarksum={sumrol.egScrutiny !== undefined ? sumrol.egScrutiny : null}
          histeroyData={histeroyData}
        ></ScrutinyDevelopment>
      </div>
      {/* <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
        <TemplatesPatwar
           ApiResponseData={apiResponse !== undefined ? apiResponse?.ApplicantPurpose : null}
        ></TemplatesPatwar>
      </div> */}
      
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
      <Addmoreinput
      applicationimp={applicationimp}
      >
      </Addmoreinput>
      </div>
      

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
  );
};

export default ScrutitnyForms;
