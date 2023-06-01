import React, { useState, useRef, useEffect, useContext } from "react";
import ScrutinyDevelopment from "../../ScrutinyDevelopment/ScrutinyDevelopment";
import { ScrutinyRemarksContext } from "../../../../../../context/remarks-data-context/index";

import { Button, Row, Col } from "react-bootstrap";
import { useForkRef } from "@mui/material";
import axios from "axios";
import StandardDesign from "./StandardDesign";

const StandardDesignBasic = ({apiResponse,applicationNumber,refreshScrutinyData,setAdditionalDetails,histeroyData,idwDataTreade,edcDataTreade,applicationStatus }) => {
  const [purpose, setPurpose] = useState("");
  const jeLandInfoRef = useRef();

  const [displayPersonal, setDisplayPersonalInfo] = useState([]);
  const [displayPersonalCHeckedList, setDisplayCheckedPersonalList] = useState([]);
  const [displayGeneralCHeckedList, setDisplayCheckedGeneralList] = useState([]);
  const [displayPurposeCHeckedList, setDisplayCheckedPurposeList] = useState([]);
  const [displayAppliedLandCheckedList, setDisplayCheckedAppliedLandList] = useState([]);
  const [displayPurpose, setDisplayPurposeInfo] = useState([]);
  const [displayGeneral, setDisplayGeneralInfo] = useState([]);
  const [displayAppliedLand, setDisplayAppliedLandInfo] = useState([]);
  const [displayFeeandCharges, setDisplayFeeandChargesInfo] = useState([]);

const { remarksData,iconStates,handleGetFiledsStatesById,handleGetRemarkssValues } = useContext(ScrutinyRemarksContext);
  const [displayJeLand, setDisplayJeLand] = useState([]);
  const [ActiveKey, setActiveKey] = useState(1);
  const [defaultHeightPersonal, setDefaultHeightPersonal] = useState(0);
  const [defaultHeightGen, setDefaultHeightGen] = useState(120);
  const [defaultheightDevelper, setDefaultheightDevelper] = useState(0);
  const [defaultheightApplied, setDefaultheightApplied] = useState(0);
  const [defaultheightFee, setDefaultheightFee] = useState(0);
  const [open, setOpen] = useState(false);
  
  const [sumrol, setSumrol] = useState({});
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [remarksChanges, setRemarksChanges] = useState("");
  const [disapprovalData, setDisapprovalData] = useState({});
  const [applictaionNo, setApplicationNO] = useState(null);
  
  const [urlGetShareHoldingDoc,setDocShareHoldingUrl] = useState("")

  const userInfo = Digit.UserService.getUser()?.info || {};
  const authToken = Digit.UserService.getUser()?.access_token || null;


  const getUncheckedPersonalinfos = (data) => {
    setDisplayPersonalInfo(data.data);
    console.log("data parent label", data);
  };
  const getCheckedPersonalInfoValue = (data) => {
    setDisplayCheckedPersonalList(data.data);
    console.log("checked parent personal info data", data);
  };
  
  const getUncheckedGeneralinfos = (data) => {
    setPurpose(data.purpose);
    setDisplayGeneralInfo(data.data);
  
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
      
      },
    };
    try {
      const Resp = await axios.post(`/land-services/egscrutiny/_searchbylogin?applicationId=${apiResponse?.id}&userid=${userInfo?.id}`, dataToPass).then((response) => {
        return response.data;
      });

      console.log("Response From API", Resp);
      setDisapprovalData(Resp);
    
    } catch (error) {
      console.log(error);
    }
  };
 

  useEffect(() => {
    if(apiResponse?.id){
      handleGetDisapprovalList();
    }
  }, [remarksChanges,apiResponse]);

  useEffect(() => {
    if(applicationNumber){
    
      handleGetRemarkssValues(applicationNumber);
    }
  }, [applicationNumber]);

  useEffect(()=>{
    if(applicationNumber){
      handleGetFiledsStatesById(applicationNumber);
    }
  },[applicationNumber]);

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
    
    if (defaultHeightPersonal === 0) {
      setDefaultHeightPersonal("auto");
    } else {
      setDefaultHeightPersonal(0);
    }
  };

  const handleScrolltOGeneral = () => {
  
    if (defaultHeightGen === 0) {
      setDefaultHeightGen("auto");
    } else {
      setDefaultHeightGen(0);
    }
  };
  const handleScrolltoDeveloper = () => {
  
    if (defaultheightDevelper === 0) {
      setDefaultheightDevelper("auto");
    } else {
      setDefaultheightDevelper(0);
    }
  };

  const handleScrolltoAppliedLandInfo = () => {
  
    if (defaultheightApplied === 0) {
      setDefaultheightApplied("auto");
    } else {
      setDefaultheightApplied(0);
    }
  };
  const handleScrolltoFeeandChargesInfo = () => {
   
    if (defaultheightFee === 0) {
      setDefaultheightFee("auto");
    } else {
      setDefaultheightFee(0);
    }
  };
  console.log("scrutiny form api get", apiResponse !== undefined ? apiResponse?.ApplicantInfo : apiResponse);
  console.log(
    "scrutiny form api get1",
    apiResponse !== undefined ? apiResponse?.ApplicantPurpose : apiResponse
  );
  console.log("remarks api", remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null);

  console.log("remakes data parsnalinfo", remarksChanges);





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
      

      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
        <ScrutinyDevelopment
          remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}
    
          histeroyData={histeroyData}
        ></ScrutinyDevelopment>
      </div>
      
    </div>
  );
};

export default StandardDesignBasic;