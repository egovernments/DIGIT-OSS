import React, { useState, useRef, useEffect } from "react";
import Personalinfo from "./Personalinfo";
import Genarelinfo from "./Generalinfo";
import Developerinfo from "./Developerinfo";
import AppliedLandinfo from "./AppliedLand";
import Feeandcharges from "./Feeandcharges";
// import JeLandinfo from "./Scrutiny LOI/JE/JE";
import DisApprovalList from "./DisApprovalList";
// import HistoryList from "./History";
import ScrutinyDevelopment from "./ScrutinyDevelopment/ScrutinyDevelopment";
import { Button, Row, Col } from "react-bootstrap";
import LicenseDetailsScrutiny from "../ScrutinyBasic/Developer/LicenseDetailsScrutiny";
import { useForkRef } from "@mui/material";
import axios from "axios";
// import AddIcon from "@mui/icons-material/Add";

const ScrutitnyForms = () => {
  const personalInfoRef = useRef();
  const generalInfoRef = useRef();
  const developerInfoRef = useRef();
  const appliedInfoRef = useRef();
  const feeandchargesInfoRef = useRef();
  const licenseDetailsInfoRef = useRef();
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
  const [displayLicenseDetails, setDisplayLicenseDetailsInfo] = useState([]);
  const [displayLicenseDetailsCheckedlist, setDisplayCheckedLicenseDetailsList] = useState([]);
  const [displayJeLand, setDisplayJeLand] = useState([]);
  const [ActiveKey, setActiveKey] = useState(1);
  const [defaultHeightPersonal, setDefaultHeightPersonal] = useState(0);
  const [defaultHeightGen, setDefaultHeightGen] = useState(120);
  const [defaultheightDevelper, setDefaultheightDevelper] = useState(0);
  const [defaultheightApplied, setDefaultheightApplied] = useState(0);
  const [defaultheightFee, setDefaultheightFee] = useState(0);
  const [open, setOpen] = useState(false);
  const [apiResppnse, setApiResponse] = useState({});
  const [remarksResponse, setRemarksResponse] = useState({});
  const [uncheckedValue, setUncheckedVlue] = useState([]);

  const getUncheckedPersonalinfos = (data) => {
    setDisplayPersonalInfo(data.data);
    console.log("data parent label", data);
  };
  const getCheckedPersonalInfoValue = (data) => {
    setDisplayCheckedPersonalList(data.data);
    console.log("checked parent personal info data", data);
  };

  const getUncheckedLicenseDetailsInfo = (data) => {
    setDisplayLicenseDetailsInfo(data.data);
    console.log("data parent label", data);
  };
  const getCheckedLicenseDetailsInfoValue = (data) => {
    setDisplayCheckedLicenseDetailsList(data.data);
    console.log("checked parent personal info data", data);
  };

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
  const handleGetInputFieldsValues = async () => {
    try {
      const Resp = await axios.get("/land-services/new/licenses/_get?id=1099696").then((response) => {
        return response.data;
      });

      console.log("Response From API", Resp);
      setApiResponse(Resp);
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
        userInfo: {
          uuid: "5fe074f2-c12d-4a27-bd7b-92d15f9ab19c",
          name: "rahul7",
          userName: "rahul7",
          tenantId: "hr",
          id: 97,
          mobileNumber: "7895877833",
        },
      },
    };
    try {
      const Resp = await axios.post("/land-services/egscrutiny/_search?applicationNumber=123", dataToSend).then((response) => {
        return response.data;
      });

      console.log("Response From API", Resp);
      setRemarksResponse(Resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetInputFieldsValues();
  }, []);
  useEffect(() => {
    handleGetRemarkssValues();
  }, []);

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
  console.log("scrutiny form api get", apiResppnse.newServiceInfoData !== undefined ? apiResppnse.newServiceInfoData[0].ApplicantInfo : apiResppnse);
  console.log("remarks api", remarksResponse.egScrutiny !== undefined ? remarksResponse.egScrutiny : null);
  return (
    <div>
      <div style={{ position: "relative", maxWidth: "100%", padding: 2 }}>
        {/* <div style={{ position: "relative", minWidth: "10%", height: 380, padding: 10, display: "inline-grid" }}>
          <Button onClick={handleScrolltoPersonal} style={{ height: 50, marginBottom: 10 }}>
            Step 1
          </Button>
          <Button onClick={handleScrolltOGeneral} style={{ height: 50, marginBottom: 10 }}>
            Step 2
          </Button>
          <Button onClick={handleScrolltoDeveloper} style={{ height: 50, marginBottom: 10 }}>
            Step 3
          </Button>
          <Button onClick={handleScrolltoAppliedLandInfo} style={{ height: 50, marginBottom: 10 }}>
            Step 4
          </Button>
          <Button onClick={handleScrolltoFeeandChargesInfo} style={{ height: 50, marginBottom: 10 }}>
            Step 5
          </Button>
        </div> */}

        {/* {ActiveKey == 1 ? (
          <Personalinfo personalInfoRef={ApllicantFormHandler}></Personalinfo>
        ) : ActiveKey == 2 ? (
          <Genarelinfo generalInfoRef={PuposeformHandler}></Genarelinfo>
        ) : ActiveKey == 3 ? (
          <Developerinfo developerInfoRef={LandFormHandler}></Developerinfo>
        ) : ActiveKey == 4 ? (
          <AppliedLandinfo appliedLandInfoRef={AppliedDetailFormHandler}></AppliedLandinfo>
        ) : (
          <div></div>
        )} */}
        <div
        // style={{
        //   position: "relative",
        //   width: "100%",
        //   padding: 5,
        //   height: "100%",
        //   overflowY: "auto",
        //   borderStyle: "solid",
        //   borderWidth: 1,
        //   borderColor: "black",
        // }}
        >
          <div>
            {/* <Col class="col-12">
              <Button
                className="d-block"
                onClick={handleScrolltoPersonal}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Applicant info
                <AddIcon style={{ textAlign: "rightend", width: "70em" }}></AddIcon>
              </Button>
            </Col> */}

            <Personalinfo
              personalInfoRef={personalInfoRef}
              passUncheckedList={getUncheckedPersonalinfos}
              passCheckedList={getCheckedPersonalInfoValue}
              // heightPersonal={defaultHeightPersonal}
              onClick={() => setOpen(!open)}
              ApiResponseData={apiResppnse.newServiceInfoData !== undefined ? apiResppnse.newServiceInfoData[0].ApplicantInfo : null}
            ></Personalinfo>
          </div>
          <div>
            {/* <Col class="col-12">
              <Button
                onClick={handleScrolltOGeneral}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Applicant Puropse
                <AddIcon style={{ textAlign: "rightend", width: "68em" }}></AddIcon>
              </Button> */}
            <Genarelinfo
              generalInfoRef={generalInfoRef}
              passUncheckedList={getUncheckedGeneralinfos}
              passCheckedList={getCheckedGeneralInfoValue}
              // heightGen={defaultHeightGen}
              onClick={() => setOpen(!open)}
            ></Genarelinfo>
            {/* </Col> */}
          </div>

          <div>
            {/* <Col class="col-12">
              <Button
                onClick={handleScrolltoDeveloper}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Details of Applied Land
                <AddIcon style={{ textAlign: "rightend", width: "66em" }}></AddIcon>
              </Button> */}
            <Developerinfo
              developerInfoRef={developerInfoRef}
              passUncheckedList={getUncheckedPurposeinfos}
              // heightDevelper={defaultheightDevelper}
              passCheckedList={getCheckedPurposeInfoValue}
              onClick={() => setOpen(!open)}
            ></Developerinfo>
            {/* </Col> */}
          </div>
          <div>
            {/* <Col class="col-12">
              <Button
                onClick={handleScrolltoAppliedLandInfo}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Geographical Specifications
                <AddIcon style={{ textAlign: "rightend", width: "64em" }}></AddIcon>
              </Button> */}
            <AppliedLandinfo
              appliedInfoRef={appliedInfoRef}
              purpose={purpose}
              passUncheckedList={getUncheckedAppliedLandInfo}
              passCheckedList={getCheckedAppliedInfoValue}
              heightApplied={defaultheightApplied}
            ></AppliedLandinfo>
            {/* </Col> */}
          </div>
          <div>
            {/* <Col class="col-12">
              <Button
                onClick={handleScrolltoFeeandChargesInfo}
                style={{
                  background: "#007bff",
                  width: "100%",
                  textAlign: "left",
                  padding: "0.35rem 0.5rem",
                  borderRadius: "0.2rem",
                  color: "#fff",
                }}
              >
                Fee and charges
                <AddIcon style={{ textAlign: "rightend", width: "70em" }}></AddIcon>
              </Button> */}
            <Feeandcharges
              feeandchargesInfoRef={feeandchargesInfoRef}
              passUncheckedList={getUncheckedFeeandChargesInfo}
              heightFee={defaultheightFee}
            ></Feeandcharges>
            {/* </Col> */}
          </div>
          <div>
            <LicenseDetailsScrutiny
              licenseDetailsInfoRef={licenseDetailsInfoRef}
              purpose={purpose}
              passUncheckedList={getUncheckedLicenseDetailsInfo}
              passCheckedList={getCheckedLicenseDetailsInfoValue}
              // heightApplied={defaultheightApplied}
              onClick={() => setOpen(!open)}
            ></LicenseDetailsScrutiny>
          </div>

          {/* <JeLandinfo jeLandInfoRef={jeLandInfoRef} passUncheckedList={getUncheckedJeLandInfo}></JeLandinfo> */}
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", display: "flex", marginBottom: 2 }}>
        <DisApprovalList
          disapprovallistDeveloper={displayPurpose}
          disapprovallistGeneral={displayGeneral}
          disapprovallistAppliedLand={displayAppliedLand}
          disapprovalCheckedAppliedLand={displayAppliedLandCheckedList}
          disapprovallistPersonal={displayPersonal}
          disapprovalCheckedPersonal={displayPersonalCHeckedList}
          disapprovalCheckedGeneral={displayGeneralCHeckedList}
          disapprovalCheckedPurpose={displayPurposeCHeckedList}
          DisApprovalListFeeandCharges={displayFeeandCharges}
        ></DisApprovalList>
        {/* <HistoryList></HistoryList> */}
      </div>
      <div style={{ position: "relative", width: "100%", height: "50%", display: "flex" }}>
        <ScrutinyDevelopment remarkData={remarksResponse.egScrutiny !== undefined ? remarksResponse.egScrutiny : null}></ScrutinyDevelopment>
      </div>
    </div>
  );
};

export default ScrutitnyForms;
