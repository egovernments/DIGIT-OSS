import React, { useState, useRef } from "react";
import Personalinfo from "./Personalinfo";
import Genarelinfo from "./Generalinfo";
import Developerinfo from "./Developerinfo";
import AppliedLandinfo from "./AppliedLand";
import Feeandcharges from "./Feeandcharges";
// import JeLandinfo from "./Scrutiny LOI/JE/JE";
import DisApprovalList from "./DisApprovalList";
import HistoryList from "./History";
import { Button } from "react-bootstrap";
import { padding } from "@mui/system";

const ScrutitnyForms = () => {
  const personalInfoRef = useRef();
  const generalInfoRef = useRef();
  const developerInfoRef = useRef();
  const appliedInfoRef = useRef();
  const feeandchargesInfoRef = useRef();
  const jeLandInfoRef = useRef();

  const [displayPersonal, setDisplayPersonalInfo] = useState([]);
  const [displayPurpose, setDisplayPurposeInfo] = useState([]);
  const [displayGeneral, setDisplayGeneralInfo] = useState([]);
  const [displayAppliedLand, setDisplayAppliedLandInfo] = useState([]);
  const [displayFeeandCharges, setDisplayFeeandChargesInfo] = useState([]);
  const [displayJeLand, setDisplayJeLand] = useState([]);
  const [ActiveKey, setActiveKey] = useState(1);
  const [defaultHeightPersonal, setDefaultHeightPersonal] = useState(120);
  const [defaultHeightGen, setDefaultHeightGen] = useState(120);
  const [defaultheightDevelper, setDefaultheightDevelper] = useState(160);
  const [defaultheightApplied, setDefaultheightApplied] = useState(140);
  const [defaultheightFee, setDefaultheightFee] = useState(120);
  const [purpose, setPurpose] = useState("");

  const [uncheckedValue, setUncheckedVlue] = useState([]);

  const getUncheckedPersonalinfos = (data) => {
    setDisplayPersonalInfo(data.data);
    console.log(data);
  };

  const getUncheckedPurposeinfos = (data) => {
    setDisplayPurposeInfo(data.data);
    console.log(data);
  };
  const getUncheckedGeneralinfos = (data) => {
    console.log("abc", data);
    setPurpose(data.purpose);
    setDisplayGeneralInfo(data.data);
    // console.log(data);
  };
  const getUncheckedAppliedLandInfo = (data) => {
    setDisplayAppliedLandInfo(data.data);
    console.log(data);
  };
  const getUncheckedFeeandChargesInfo = (data) => {
    setDisplayFeeandChargesInfo(data.data);
    console.log(data);
  };
  const getUncheckedJeLandInfo = (data) => {
    setDisplayJeLand(data.data);
    console.log(data);
  };

  console.log(uncheckedValue);

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
    if (defaultHeightPersonal === 120) {
      setDefaultHeightPersonal("auto");
    } else {
      setDefaultHeightPersonal(120);
    }
  };

  const handleScrolltOGeneral = () => {
    // generalInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultHeightGen === 120) {
      setDefaultHeightGen("auto");
    } else {
      setDefaultHeightGen(120);
    }
  };
  const handleScrolltoDeveloper = () => {
    // developerInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightDevelper === 160) {
      setDefaultheightDevelper("auto");
    } else {
      setDefaultheightDevelper(160);
    }
  };

  const handleScrolltoAppliedLandInfo = () => {
    // appliedInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightApplied === 140) {
      setDefaultheightApplied("auto");
    } else {
      setDefaultheightApplied(140);
    }
  };
  const handleScrolltoFeeandChargesInfo = () => {
    // feeandchargesInfoRef.current.scrollIntoView({ behavior: "smooth" });
    if (defaultheightFee === 120) {
      setDefaultheightFee("auto");
    } else {
      setDefaultheightFee(120);
    }
  };
  //   const handleScrolltoJeLandInfo = () => {
  //     jeLandInfoRef.current.scrollIntoView({ behavior: "smooth" });
  //   };

  console.log(displayPersonal);
  console.log("Adit", purpose);
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
            <Button onClick={handleScrolltoPersonal} style={{ height: 50, marginBottom: 10 }}>
              Step 1
            </Button>
            <Personalinfo
              personalInfoRef={personalInfoRef}
              passUncheckedList={getUncheckedPersonalinfos}
              heightPersonal={defaultHeightPersonal}
            ></Personalinfo>
          </div>
          <div>
            <Button onClick={handleScrolltOGeneral} style={{ height: 50, marginBottom: 10 }}>
              Step 2
            </Button>
            <Genarelinfo generalInfoRef={generalInfoRef} passUncheckedList={getUncheckedGeneralinfos} heightGen={defaultHeightGen}></Genarelinfo>
          </div>
          <div>
            <Button onClick={handleScrolltoDeveloper} style={{ height: 50, marginBottom: 10 }}>
              Step 3
            </Button>
            <Developerinfo
              developerInfoRef={developerInfoRef}
              passUncheckedList={getUncheckedPurposeinfos}
              heightDevelper={defaultheightDevelper}
            ></Developerinfo>
          </div>
          <div>
            <Button onClick={handleScrolltoAppliedLandInfo} style={{ height: 50, marginBottom: 10 }}>
              Step 4
            </Button>
            <AppliedLandinfo
              appliedInfoRef={appliedInfoRef}
              purpose={purpose}
              passUncheckedList={getUncheckedAppliedLandInfo}
              heightApplied={defaultheightApplied}
            ></AppliedLandinfo>
          </div>
          <div>
            <Button onClick={handleScrolltoFeeandChargesInfo} style={{ height: 50, marginBottom: 10 }}>
              Step 5
            </Button>
            <Feeandcharges
              feeandchargesInfoRef={feeandchargesInfoRef}
              passUncheckedList={getUncheckedFeeandChargesInfo}
              heightFee={defaultheightFee}
            ></Feeandcharges>
          </div>

          {/* <JeLandinfo jeLandInfoRef={jeLandInfoRef} passUncheckedList={getUncheckedJeLandInfo}></JeLandinfo> */}
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", height: "30%", display: "flex" }}>
        <DisApprovalList
          disapprovallistDeveloper={displayPurpose}
          disapprovallistGeneral={displayGeneral}
          disapprovallistAppliedLand={displayAppliedLand}
          disapprovallistPersonal={displayPersonal}
          DisApprovalListFeeandCharges={displayFeeandCharges}
        ></DisApprovalList>
        <HistoryList></HistoryList>
      </div>
    </div>
  );
};

export default ScrutitnyForms;
