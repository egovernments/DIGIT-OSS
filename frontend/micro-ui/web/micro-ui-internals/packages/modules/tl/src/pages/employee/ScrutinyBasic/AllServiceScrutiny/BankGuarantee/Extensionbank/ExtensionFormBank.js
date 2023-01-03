import React, { useState, useRef, useEffect, useContext } from "react";

// import ScrutinyDevelopment from "./ScrutinyDevelopment/ScrutinyDevelopment";
import { Button, Row, Col } from "react-bootstrap";
import { useForkRef } from "@mui/material";
import axios from "axios";
import Scrutiny from "../../BankScrutiny/basicScrutiny";
import ScrutinyDevelopment from "../../../ScrutinyDevelopment/ScrutinyDevelopment";
import { ScrutinyRemarksContext } from "../../../../../../../context/remarks-data-context/index";
import Extension from "../Extension";

const ExtensionFormBank = () => {
  const personalInfoRef = useRef();
  // const generalInfoRef = useRef();
  // const developerInfoRef = useRef();
  // const appliedInfoRef = useRef();
  // const feeandchargesInfoRef = useRef();
  const [purpose, setPurpose] = useState("");

  const { remarksData, iconStates, handleGetFiledsStatesById, handleGetRemarkssValues } = useContext(ScrutinyRemarksContext);
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

  const [urlGetShareHoldingDoc, setDocShareHoldingUrl] = useState("");

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

  return (
    <div>
      <div style={{ position: "relative", maxWidth: "100%", padding: 2 }}>
        <div>
          <div>
            <Extension />
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
        <ScrutinyDevelopment remarkData={remarksData.egScrutiny !== undefined ? remarksData.egScrutiny : null}></ScrutinyDevelopment>
      </div>
    </div>
  );
};

export default ExtensionFormBank;
