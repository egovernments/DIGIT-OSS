import React, { useState, useRef, useEffect } from "react";
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
// import AddIcon from "@mui/icons-material/Add";

const ScrutitnyForms = ({ apiResponse, applicationNumber, refreshScrutinyData }) => {
  const personalInfoRef = useRef();
  const generalInfoRef = useRef();
  const developerInfoRef = useRef();
  const appliedInfoRef = useRef();
  const feeandchargesInfoRef = useRef();
  // const licenseDetailsInfoRef = useRef();
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
  // const [displayLicenseDetails, setDisplayLicenseDetailsInfo] = useState([]);
  // const [displayLicenseDetailsCheckedlist, setDisplayCheckedLicenseDetailsList] = useState([]);
  const [displayJeLand, setDisplayJeLand] = useState([]);
  const [ActiveKey, setActiveKey] = useState(1);
  const [defaultHeightPersonal, setDefaultHeightPersonal] = useState(0);
  const [defaultHeightGen, setDefaultHeightGen] = useState(120);
  const [defaultheightDevelper, setDefaultheightDevelper] = useState(0);
  const [defaultheightApplied, setDefaultheightApplied] = useState(0);
  const [defaultheightFee, setDefaultheightFee] = useState(0);
  const [open, setOpen] = useState(false);
  // const [apiResponse, setApiResponse] = useState({});
  const [remarksResponse, setRemarksResponse] = useState({});
  const [sumrol, setSumrol] = useState({});
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [remarksChanges, setRemarksChanges] = useState("");
  const [disapprovalData, setDisapprovalData] = useState({});
  const [applictaionNo, setApplicationNO] = useState(null);
  const [iconStates, setIconState] = useState(null);
  const [urlGetShareHoldingDoc, setDocShareHoldingUrl] = useState("");

  const userInfo = Digit.UserService.getUser()?.info || {};

  const getUncheckedPersonalinfos = (data) => {
    setDisplayPersonalInfo(data.data);
    console.log("data parent label", data);
  };
  const getCheckedPersonalInfoValue = (data) => {
    setDisplayCheckedPersonalList(data.data);
    console.log("checked parent personal info data", data);
  };

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
  const handleGetFiledsStatesById = async () => {
    const dataToPass = {
      requestInfo: {
        api_id: "1",
        ver: "1",
        ts: null,
        action: "create",
        did: "",
        key: "",
        msg_id: "",
        requester_id: "",
        auth_token: null,
      },
    };
    try {
      const Resp = await axios
        .post(`/land-services/egscrutiny/_search?applicationNumber=${applicationNumber}&userId=${userInfo?.id}`, dataToPass)
        .then((response) => {
          return response.data;
        });

      console.log("Response From API", Resp);
      setIconState(Resp);
      // setApiResponse(Resp);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetDisapprovalList = async () => {
    const dataToPass = {
      requestInfo: {
        api_id: "1",
        ver: "1",
        ts: null,
        action: "create",
        did: "",
        key: "",
        msg_id: "",
        requester_id: "",
        auth_token: null,
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
      // setApiResponse(Resp);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetRemarkssValues = async () => {
    const dataToSend = {
      RequestInfo: {
        apiId: "Rainmaker",
        action: "_create",
        did: 1,
        key: "",
        msgId: "20170310130900|en_IN",
        ts: 0,
        ver: ".01",
        authToken: "80458c19-3b48-4aa8-b86e-e2e195e6753a",
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios
        .post(`/land-services/egscrutiny/_search?applicationNumber=${applicationNumber}&userId=${userInfo?.id}`, dataToSend)
        .then((response) => {
          return response.data;
        });

      console.log("Response From API", Resp);
      setRemarksResponse(Resp);
    } catch (error) {
      console.log(error);
    }
    // console.log("MdMS123",remarksResponse)
  };

  useEffect(() => {
    if (apiResponse?.id) {
      handleGetDisapprovalList();
    }
  }, [remarksChanges, apiResponse]);

  // useEffect(() => {
  //   handleGetInputFieldsValues();
  // }, []);
  useEffect(() => {
    if (applicationNumber) {
      // console.log("log123...",userInfo)
      handleGetRemarkssValues();
    }
  }, [applicationNumber]);

  useEffect(() => {
    if (applicationNumber) {
      handleGetFiledsStatesById();
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
  console.log(
    "scrutiny form api get",
    apiResponse?.newServiceInfoData !== undefined ? apiResponse?.newServiceInfoData[0]?.ApplicantInfo : apiResponse
  );
  console.log(
    "scrutiny form api get1",
    apiResponse?.newServiceInfoData !== undefined ? apiResponse?.newServiceInfoData[0]?.ApplicantPurpose : apiResponse
  );
  // console.log("scrutiny form api get2", apiResponse?.newServiceInfoData !== undefined ? apiResponse?.newServiceInfoData[0].LandSchedule : apiResponse);
  console.log("remarks api", remarksResponse.egScrutiny !== undefined ? remarksResponse.egScrutiny : null);

  console.log("remakes data parsnalinfo", remarksChanges);

  return (
    <div>
      <div style={{ position: "relative", maxWidth: "100%", padding: 2 }}>
        {/* <b>Application : {remarksResponse?.egScrutiny?.[0]?.applicationId} </b> */}
        <Row style={{ top: 25, padding: 5 }}>
          <div className="ml-auto">
            {/* applicationNumber: "HR-TL-2022-12-06-000450" */}
            {/* <h2>Application : 
        {apiResppnse.newServiceInfoData !== undefined ? apiResppnse.applicationNumber:null}
          </h2> */}
          </div>
        </Row>
        <div>
          <div>
            <Personalinfo
              personalInfoRef={personalInfoRef}
              passUncheckedList={getUncheckedPersonalinfos}
              passCheckedList={getCheckedPersonalInfoValue}
              onClick={() => setOpen(!open)}
              ApiResponseData={apiResponse?.newServiceInfoData !== undefined ? apiResponse?.newServiceInfoData[0].ApplicantInfo : null}
              showTable={curentDataPersonal}
              dataForIcons={iconStates}
            ></Personalinfo>
          </div>
          <div>
            <Genarelinfo
              generalInfoRef={generalInfoRef}
              passUncheckedList={getUncheckedGeneralinfos}
              passCheckedList={getCheckedGeneralInfoValue}
              onClick={() => setOpen(!open)}
              ApiResponseData={apiResponse?.newServiceInfoData !== undefined ? apiResponse?.newServiceInfoData[0].ApplicantPurpose : null}
              dataForIcons={iconStates}
            ></Genarelinfo>
            {/* </Col> */}
          </div>

          <div>
            <Developerinfo
              developerInfoRef={developerInfoRef}
              passUncheckedList={getUncheckedPurposeinfos}
              passCheckedList={getCheckedPurposeInfoValue}
              onClick={() => setOpen(!open)}
              ApiResponseData={apiResponse?.newServiceInfoData !== undefined ? apiResponse?.newServiceInfoData[0].LandSchedule : null}
              dataForIcons={iconStates}
            ></Developerinfo>
            {/* </Col> */}
          </div>
          <div>
            <AppliedLandinfo
              appliedInfoRef={appliedInfoRef}
              purpose={apiResponse?.newServiceInfoData ? apiResponse?.newServiceInfoData[0]?.ApplicantPurpose?.purpose : null}
              passUncheckedList={getUncheckedAppliedLandInfo}
              passCheckedList={getCheckedAppliedInfoValue}
              ApiResponseData={apiResponse?.newServiceInfoData !== undefined ? apiResponse?.newServiceInfoData[0].DetailsofAppliedLand : null}
              heightApplied={defaultheightApplied}
              dataForIcons={iconStates}
            ></AppliedLandinfo>
            {/* </Col> */}
          </div>
          <div>
            <Feeandcharges
              feeandchargesInfoRef={feeandchargesInfoRef}
              passUncheckedList={getUncheckedFeeandChargesInfo}
              heightFee={defaultheightFee}
              ApiResponseData={apiResponse?.newServiceInfoData !== undefined ? apiResponse?.newServiceInfoData[0].FeesAndCharges : null}
            ></Feeandcharges>
            {/* </Col> */}
          </div>

          {/* <JeLandinfo jeLandInfoRef={jeLandInfoRef} passUncheckedList={getUncheckedJeLandInfo}></JeLandinfo> */}
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
        {/* <DisApprovalList
          disapprovallistDeveloper={displayPurpose}
          disapprovallistGeneral={displayGeneral}
          disapprovallistAppliedLand={displayAppliedLand}
          disapprovalCheckedAppliedLand={displayAppliedLandCheckedList}
          disapprovallistPersonal={displayPersonal}
          disapprovalCheckedPersonal={displayPersonalCHeckedList}
          disapprovalCheckedGeneral={displayGeneralCHeckedList}
          disapprovalCheckedPurpose={displayPurposeCHeckedList}
          DisApprovalListFeeandCharges={displayFeeandCharges}
          dataList={disapprovalData}
        ></DisApprovalList> */}
        {/* <HistoryList></HistoryList> */}
      </div>

      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex" }}>
        <ScrutinyDevelopment
          remarkData={remarksResponse.egScrutiny !== undefined ? remarksResponse.egScrutiny : null}
          // remarksum={sumrol.egScrutiny !== undefined ? sumrol.egScrutiny : null}
        ></ScrutinyDevelopment>
      </div>
    </div>
  );
};

export default ScrutitnyForms;
