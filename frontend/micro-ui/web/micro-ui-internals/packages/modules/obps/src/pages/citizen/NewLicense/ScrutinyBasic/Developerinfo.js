import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
// import { ArrowDownCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyles } from "./css/personalInfoChild.style";

const Developerinfo = (props) => {

  const dataIcons = props.dataForIcons;
  const landScheduleData = props.ApiResponseData;

  const [vacant, setVacant] = useState("");
  const [construction, setConstruction] = useState("");
  const [typeCons, setTypeCons] = useState("");
  const [ht, setHt] = useState("");
  const [htRemark, setHtRemark] = useState("");
  const [gas, setGas] = useState("");
  const [gasRemark, setGasRemark] = useState("");
  const [nallah, setNallah] = useState("");
  const [nallahRemark, setNallahremark] = useState("");
  const [road, setRoad] = useState("");
  const [roadWidth, setRoadwidth] = useState("");
  const [land, setLand] = useState("");
  const [landRemark, setLandRemark] = useState("");
  const [layoutPlan, setLayoutPlan] = useState("");
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  // const [fieldValue, setFieldValue] = useState("");

  const [showhide1, setShowhide1] = useState("No");
  const [showhide2, setShowhide2] = useState("No");
  const [showhide3, setShowhide3] = useState("No");
  const [showhide4, setShowhide4] = useState("No");
  const [showhide5, setShowhide5] = useState("No");
  const [showhide6, setShowhide6] = useState("No");
  const [showhide7, setShowhide7] = useState("No");
  const [showhide8, setShowhide8] = useState("No");
  const [showhide9, setShowhide9] = useState("No");
  const [showhide0, setShowhide0] = useState("No");
  const [showhide13, setShowhide13] = useState("No");
  const [showhide18, setShowhide18] = useState("No");
  const [showhide16, setShowhide16] = useState("No");
  const [showhide17, setShowhide17] = useState("No");

  const [open2, setOpen2] = useState(false);
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide2(getshow);
  };
  const handleshow2 = (e) => {
    const getshow = e.target.value;
    setShowhide3(getshow);
  };
  const handleshow3 = (e) => {
    const getshow = e.target.value;
    setShowhide4(getshow);
  };
  const handleshow4 = (e) => {
    const getshow = e.target.value;
    setShowhide4(getshow);
  };
  const handleshow5 = (e) => {
    const getshow = e.target.value;
    setShowhide5(getshow);
  };
  const handleshow6 = (e) => {
    const getshow = e.target.value;
    setShowhide6(getshow);
  };
  const handleshow7 = (e) => {
    const getshow = e.target.value;
    setShowhide7(getshow);
  };
  const handleshow8 = (e) => {
    const getshow = e.target.value;
    setShowhide8(getshow);
  };
  const handleshow9 = (e) => {
    const getshow = e.target.value;
    setShowhide9(getshow);
  };
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  };
  const handleshow13 = (e) => {
    const getshow = e.target.value;
    setShowhide13(getshow);
  };
  const handleshow18 = (e) => {
    const getshow = e.target.value;
    setShowhide18(getshow);
  };
  const handleshow16 = (e) => {
    const getshow = e.target.value;
    setShowhide16(getshow);
  };
  const handleshow17 = (e) => {
    const getshow = e.target.value;
    setShowhide17(getshow);
  };
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  console.log(uncheckedValue);
  const [color, setColor] = useState({ yes: false, no: false });

  const [smShow2, setSmShow2] = useState(false);
  const [smShow3, setSmShow3] = useState(false);
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);
  const [checkValue, setCheckedVAlue] = useState([]);

  const handleYesOrNochecked = (data) => {
    setYesorNochecked(data.data);
  };
  const handlemodalsubmit = () => {
    console.log("here");
    const filteredObj = uncheckedValue.filter((obj) => {
      return obj.label == modaldData.label;
    });
    const filteredObjCheked = checkValue.filter((obj) => {
      return obj.label == modaldData.label;
    });
    if (filteredObj.length !== 0) {
      const removedList = uncheckedValue.filter((obj) => {
        return obj.label !== modaldData.label;
      });
      setUncheckedVlue(removedList);
    }
    if (filteredObjCheked.length !== 0) {
      const removedList = checkValue.filter((obj) => {
        return obj.label !== modaldData.label;
      });
      setCheckedVAlue(removedList);
    }

    if (isyesOrNochecked === false) {
      if (modaldData.label !== "" || modaldData.Remarks !== "") {
        if (filteredObj.length === 0) {
          setUncheckedVlue((prev) => [...prev, modaldData]);
        }
      }
    } else {
      if (modaldData.label !== "" || modaldData.Remarks !== "") {
        if (filteredObjCheked.length === 0) {
          setCheckedVAlue((prev) => [...prev, modaldData]);
        }
      }
    }
  };
  useEffect(() => {
    console.log("called");
    handlemodalsubmit();
  }, [modaldData.Remarks]);
  useEffect(() => {
    props.passUncheckedList({ data: uncheckedValue });
  }, [uncheckedValue]);

  useEffect(() => {
    props.passCheckedList({ data: checkValue });
  }, [checkValue]);
  console.log("unchecked values", uncheckedValue);

  console.log(uncheckedValue.indexOf("developer"));

  const developerInputFiledColor = uncheckedValue.filter((obj) => {
    return obj.label === "Whether licence applied for additional area ?";
  });
  const developerInputCheckedFiledColor = checkValue.filter((obj) => {
    return obj.label === "Whether licence applied for additional area ?";
  });
  // console.log("color from array", developerInputFiledColor);

  const developerInputFiledColor1 = uncheckedValue.filter((obj) => {
    return obj.label === "License No. of Parent License";
  });
  const developerInputCheckedFiledColor1 = checkValue.filter((obj) => {
    return obj.label === "License No. of Parent License";
  });
  const developerInputFiledColor2 = uncheckedValue.filter((obj) => {
    return obj.label === "Potential Zone:";
  });
  const developerInputCheckedFiledColor2 = checkValue.filter((obj) => {
    return obj.label === "Potential Zone:";
  });
  const developerInputFiledColor3 = uncheckedValue.filter((obj) => {
    return obj.label === "Site Location Purpose";
  });
  const developerInputCheckedFiledColor3 = checkValue.filter((obj) => {
    return obj.label === "Site Location Purpose";
  });
  const developerInputFiledColor4 = uncheckedValue.filter((obj) => {
    return obj.label === "Approach Type (Type of Policy)";
  });
  const developerInputCheckedFiledColor4 = checkValue.filter((obj) => {
    return obj.label === "Approach Type (Type of Policy)";
  });
  const developerInputFiledColor5 = uncheckedValue.filter((obj) => {
    return obj.label === "Approach Road Width";
  });
  const developerInputCheckedFiledColor5 = checkValue.filter((obj) => {
    return obj.label === "Approach Road Width";
  });
  const developerInputFiledColor6 = uncheckedValue.filter((obj) => {
    return obj.label === "Specify Other";
  });
  const developerInputCheckedFiledColor6 = checkValue.filter((obj) => {
    return obj.label === "Specify Other";
  });
  const developerInputFiledColor7 = uncheckedValue.filter((obj) => {
    return obj.label === "Type of land";
  });
  const developerInputCheckedFiledColor7 = checkValue.filter((obj) => {
    return obj.label === "Type of land";
  });
  const developerInputFiledColor8 = uncheckedValue.filter((obj) => {
    return obj.label === "Third-party right created";
  });
  const developerInputCheckedFiledColor8 = checkValue.filter((obj) => {
    return obj.label === "Third-party right created";
  });
  const developerInputFiledColor9 = uncheckedValue.filter((obj) => {
    return obj.label === "(ii)Whether licence applied under Migration policy?";
  });
  const developerInputCheckedFiledColor9 = checkValue.filter((obj) => {
    return obj.label === "(ii)Whether licence applied under Migration policy?";
  });
  const developerInputFiledColor10 = uncheckedValue.filter((obj) => {
    return obj.label === "2. Any encumbrance with respect to following";
  });
  const developerInputCheckedFiledColor10 = checkValue.filter((obj) => {
    return obj.label === "2. Any encumbrance with respect to following";
  });
  const developerInputFiledColor11 = uncheckedValue.filter((obj) => {
    return obj.label === "(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator";
  });
  const developerInputCheckedFiledColor11 = checkValue.filter((obj) => {
    return obj.label === "(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator";
  });
  const developerInputFiledColor12 = uncheckedValue.filter((obj) => {
    return obj.label === "(iii) Court orders, if any, affecting applied land";
  });
  const developerInputCheckedFiledColor12 = checkValue.filter((obj) => {
    return obj.label === "(iii) Court orders, if any, affecting applied land";
  });
  const developerInputFiledColor13 = uncheckedValue.filter((obj) => {
    return obj.label === "(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed ";
  });
  const developerInputCheckedFiledColor13 = checkValue.filter((obj) => {
    return obj.label === "(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed ";
  });
  const developerInputFiledColor14 = uncheckedValue.filter((obj) => {
    return obj.label === "(a)As per applied land (Yes/No)";
  });
  const developerInputCheckedFiledColor14 = checkValue.filter((obj) => {
    return obj.label === "(a)As per applied land (Yes/No)";
  });
  const developerInputFiledColor15 = uncheckedValue.filter((obj) => {
    return obj.label === "Revenue rasta";
  });
  const developerInputCheckedFiledColor15 = checkValue.filter((obj) => {
    return obj.label === "Revenue rasta";
  });
  const developerInputFiledColor16 = uncheckedValue.filter((obj) => {
    return obj.label === "Watercourse running";
  });
  const developerInputCheckedFiledColor16 = checkValue.filter((obj) => {
    return obj.label === "Watercourse running";
  });
  const developerInputFiledColor17 = uncheckedValue.filter((obj) => {
    return obj.label === "(d)Whether in Compact Block (Yes/No)";
  });
  const developerInputCheckedFiledColor17 = checkValue.filter((obj) => {
    return obj.label === "(d)Whether in Compact Block (Yes/No)";
  });
  const developerInputFiledColor18 = uncheckedValue.filter((obj) => {
    return obj.label === "Land Sandwiched";
  });
  const developerInputCheckedFiledColor18 = checkValue.filter((obj) => {
    return obj.label === "Land Sandwiched";
  });
  const developerInputFiledColor19 = uncheckedValue.filter((obj) => {
    return obj.label === "(f)Acquisition status (Yes/No)";
  });
  const developerInputCheckedFiledColor19 = checkValue.filter((obj) => {
    return obj.label === "(f)Acquisition status (Yes/No)";
  });
  const developerInputFiledColor20 = uncheckedValue.filter((obj) => {
    return obj.label === "Date of section 6 notification";
  });
  const developerInputCheckedFiledColor20 = checkValue.filter((obj) => {
    return obj.label === "Date of section 6 notification";
  });
  const developerInputFiledColor21 = uncheckedValue.filter((obj) => {
    return obj.label === "Orders Upload";
  });
  const developerInputCheckedFiledColor21 = checkValue.filter((obj) => {
    return obj.label === "Orders Upload";
  });
  const developerInputFiledColor22 = uncheckedValue.filter((obj) => {
    return obj.label === "(h) Whether land compensation received";
  });
  const developerInputCheckedFiledColor22 = checkValue.filter((obj) => {
    return obj.label === "(h) Whether land compensation received";
  });
  const developerInputFiledColor23 = uncheckedValue.filter((obj) => {
    return obj.label === "Status of release";
  });
  const developerInputCheckedFiledColor23 = checkValue.filter((obj) => {
    return obj.label === "Status of release";
  });
  const developerInputFiledColor24 = uncheckedValue.filter((obj) => {
    return obj.label === "Date of Award";
  });
  const developerInputCheckedFiledColor24 = checkValue.filter((obj) => {
    return obj.label === "Date of Award";
  });
  const developerInputFiledColor25 = uncheckedValue.filter((obj) => {
    return obj.label === "Date of Release";
  });
  const developerInputCheckedFiledColor25 = checkValue.filter((obj) => {
    return obj.label === "Date of Release";
  });
  const developerInputFiledColor26 = uncheckedValue.filter((obj) => {
    return obj.label === "Site Details";
  });
  const developerInputCheckedFiledColor26 = checkValue.filter((obj) => {
    return obj.label === "Site Details";
  });
  const developerInputFiledColor27 = uncheckedValue.filter((obj) => {
    return (
      obj.label === "whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road. (yes/no)"
    );
  });
  const developerInputCheckedFiledColor27 = checkValue.filter((obj) => {
    return (
      obj.label === "whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road. (yes/no)"
    );
  });
  const developerInputFiledColor28 = uncheckedValue.filter((obj) => {
    return obj.label === "(a)vacant: (Yes/No)";
  });
  const developerInputCheckedFiledColor28 = checkValue.filter((obj) => {
    return obj.label === "(a)vacant: (Yes/No)";
  });
  const developerInputFiledColor29 = uncheckedValue.filter((obj) => {
    return obj.label === "(b)Construction: (Yes/No)";
  });
  const developerInputCheckedFiledColor29 = checkValue.filter((obj) => {
    return obj.label === "(b)Construction: (Yes/No)";
  });
  const developerInputFiledColor30 = uncheckedValue.filter((obj) => {
    return obj.label === "(c)HT line";
  });
  const developerInputCheckedFiledColor30 = checkValue.filter((obj) => {
    return obj.label === "(c)HT line";
  });
  const developerInputFiledColor31 = uncheckedValue.filter((obj) => {
    return obj.label === "(d) IOC Gas Pipeline";
  });
  const developerInputCheckedFiledColor31 = checkValue.filter((obj) => {
    return obj.label === "(d) IOC Gas Pipeline";
  });
  const developerInputFiledColor32 = uncheckedValue.filter((obj) => {
    return obj.label === "(e)Nallah";
  });
  const developerInputCheckedFiledColor32 = checkValue.filter((obj) => {
    return obj.label === "(e)Nallah";
  });
  const developerInputFiledColor33 = uncheckedValue.filter((obj) => {
    return obj.label === "(f)Any revenue rasta/road";
  });
  const developerInputCheckedFiledColor33 = checkValue.filter((obj) => {
    return obj.label === "(f)Any revenue rasta/road";
  });
  const developerInputFiledColor34 = uncheckedValue.filter((obj) => {
    return obj.label === "(g)Any marginal land";
  });
  const developerInputCheckedFiledColor34 = checkValue.filter((obj) => {
    return obj.label === "(g)Any marginal land";
  });
  const developerInputFiledColor35 = uncheckedValue.filter((obj) => {
    return obj.label === "Utility Line";
  });
  const developerInputCheckedFiledColor35 = checkValue.filter((obj) => {
    return obj.label === "Utility Line";
  });
  const developerInputFiledColor36 = uncheckedValue.filter((obj) => {
    return obj.label === "5. Enclose the following documents as Annexures";
  });
  const developerInputCheckedFiledColor36 = checkValue.filter((obj) => {
    return obj.label === "5. Enclose the following documents as Annexures";
  });
  const developerInputFiledColor37 = uncheckedValue.filter((obj) => {
    return obj.label === "Land schedule";
  });
  const developerInputCheckedFiledColor37 = checkValue.filter((obj) => {
    return obj.label === "Land schedule";
  });
  const developerInputFiledColor38 = uncheckedValue.filter((obj) => {
    return obj.label === "Copy of Mutation";
  });
  const developerInputCheckedFiledColor38 = checkValue.filter((obj) => {
    return obj.label === "Copy of Mutation";
  });
  const developerInputFiledColor39 = uncheckedValue.filter((obj) => {
    return obj.label === "Copy of Jamabandi";
  });
  const developerInputCheckedFiledColor39 = checkValue.filter((obj) => {
    return obj.label === "Copy of Jamabandi";
  });
  const developerInputFiledColor40 = uncheckedValue.filter((obj) => {
    return obj.label === "Details of lease / patta, if any";
  });
  const developerInputCheckedFiledColor40 = checkValue.filter((obj) => {
    return obj.label === "Details of lease / patta, if any";
  });
  const developerInputFiledColor41 = uncheckedValue.filter((obj) => {
    return obj.label === "Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration";
  });
  const developerInputCheckedFiledColor41 = checkValue.filter((obj) => {
    return obj.label === "Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration";
  });
  const developerInputFiledColor42 = uncheckedValue.filter((obj) => {
    return obj.label === "Proposed Layout of Plan /site plan for area applied for migration.";
  });
  const developerInputCheckedFiledColor42 = checkValue.filter((obj) => {
    return obj.label === "Proposed Layout of Plan /site plan for area applied for migration.";
  });
  const developerInputFiledColor43 = uncheckedValue.filter((obj) => {
    return obj.label === "Revised Land Schedule";
  });
  const developerInputCheckedFiledColor43 = checkValue.filter((obj) => {
    return obj.label === "Revised Land Schedule";
  });


  
  const classes = useStyles();

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    licenceApplied: Colors.info,
    licenceNo: Colors.info,
    potentialZone: Colors.info,
    siteLocationPurpose: Colors.info,
    approachType: Colors.info,
    approachRoadWidth: Colors.info,
    specifyOthers: Colors.info,
    typeOfLand:Colors.info,
    thirdPartyRightCreated:Colors.info,
    migrationPolicy: Colors.info,
    encumbrance: Colors.info,
    existinglitigation: Colors.info,
    courtOrders: Colors.info,
    anyInsolvency: Colors.info,
    asPerAppliedLand: Colors.info,
    revenueRasta: Colors.info,
    waterCourseRunning: Colors.info,
    whetherInCompactBlock: Colors.info,
    landSandwiche: Colors.info,
    acquisitionStatus: Colors.info,
    dateOfSection4Notification: Colors.info,
    dateOfSection6Notification: Colors.info,
    ordersUpload: Colors.info,
    internalSectoralPlan: Colors.info,
    vacant: Colors.info,
    construction: Colors.info,
    htLine: Colors.info,
    iocGasPipeline: Colors.info,
    nallah: Colors.info,
    anyRevenueRasta: Colors.info,
    anyMarginalLand: Colors.info,
    utilityLine: Colors.info,
    documentsAsAnnexures: Colors.info,
    landSchedule: Colors.info,
    copyOfMutation: Colors.info,
    copyOfJamabandi: Colors.info,
    detailsOfLease: Colors.info,
    approvalLayoutPlan: Colors.info,
    proposedLayout: Colors.info,
    revisedLandSchedule: Colors.info
  })

  const fieldIdList = [{ label: "Whether licence applied for additional area", key: "licenceApplied" },{ label: "License No. of Parent License", key: "licenceNo" },{ label: "Potential Zone", key: "potentialZone" },{ label: "Site Location Purpose", key: "siteLocationPurpose" },{ label: "Approach Type (Type of Policy)", key: "approachType" },{ label: "Approach Road Width", key: "approachRoadWidth" },{ label: "Specify Others", key: "specifyOthers" },{ label: "Type of land", key: "typeOfLand" },{ label: "Third-party right created ", key: "thirdPartyRightCreated" },{ label: "Whether licence applied under Migration policy", key: "migrationPolicy" },{ label: "Any encumbrance with respect to following", key: "encumbrance" },{ label: "Existing litigation, if any, concerning applied land including co-sharers and collaborator", key: "existinglitigation" },{ label: "Court orders, if any, affecting applied land", key: "courtOrders" },{ label: "Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed", key: "anyInsolvency" },{ label: "As per applied land", key: "asPerAppliedLand" },{ label: "Revenue rasta", key: "revenueRasta" },{ label: "Watercourse running", key: "waterCourseRunning" },{ label: "Whether in Compact Block", key: "whetherInCompactBlock" },{ label: "Land Sandwiched", key: "landSandwiche" },{ label: "Acquisition status", key: "acquisitionStatus" },{ label: "Date of section 4 notification", key: "dateOfSection4Notification" },{ label: "Date of section 6 notification", key: "dateOfSection6Notification" },{ label: "Orders Upload", key: "ordersUpload" },{ label: "whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road", key: "internalSectoralPlan" },{ label: "vacant", key: "vacant" },{ label: "Construction", key: "construction" },{ label: "HT line", key: "htLine" },{ label: "IOC Gas Pipeline", key: "iocGasPipeline" },{ label: "Nallah", key: "nallah" },{ label: "Any revenue rasta/road", key: "anyRevenueRasta" },{ label: "Any marginal land", key: "anyMarginalLand" },{ label: "Utility Line", key: "utilityLine" },{ label: "Enclose the following documents as Annexures", key: "documentsAsAnnexures" },{ label: "Land schedule", key: "landSchedule" },{ label: "Copy of Mutation", key: "copyOfMutation" },{ label: "Copy of Jamabandi", key: "copyOfJamabandi" },{ label: "Details of lease / patta, if any", key: "detailsOfLease" },{ label: "Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration", key: "approvalLayoutPlan" },{ label: "Proposed Layout of Plan /site plan for area applied for migration", key: "proposedLayout" },{ label: "Revised Land Schedule", key: "revisedLandSchedule" }];


  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved ? Colors.approved : Colors.disapproved }

        }
      }
    })

    setFieldIconColors(tempFieldColorState);

  };


  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...",)
  }, [dataIcons])

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === labelValue));
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue])



  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved })
    }
    setOpennedModal("");
    setLabelValue("");
  };


  return (
    <Form
      ref={props.developerInfoRef}
      // style={{
      //   width: "100%",
      //   height: props.heightDevelper,
      //   overflow: "hidden",
      //   marginBottom: 20,
      //   borderColor: "#C3C3C3",
      //   borderStyle: "solid",
      //   borderWidth: 2,
      //   padding: 2,
      // }}
    >
      <ModalChild
        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        onClose={() => setSmShow(false)}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
      ></ModalChild>

      <div
        className="collapse-header"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
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
        <span style={{ color: "#817f7f" }} className="">
          Land Schedule
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open}>
        <div id="example-collapse-text">
          <Form.Group
            style={{ display: props.displayGeneral, border: "2px solid #e9ecef", margin: 10, padding: 10 }}
            className={`justify-content-center ${classes.formLabel}`}
          >
            <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col className="ms-auto" md={4} xxl lg="12">
                <Form.Label
                // placeholder={personalinfo !== null ? personalinfo.authorizedDeveloper : null}
                >
                  (i)Whether licence applied for additional area ? 

                  <div  className="d-flex flex-row">
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow}  />
                  <label className="m-0  mx-2" for="Yes">Yes</label>
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow}  />
                  <label className="m-0 mx-2" for="No">No</label>
                  {/* <Form.Control height={30} style={{ maxWidth: 120, marginRight: 5 }} disabled></Form.Control> */}
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.licenceApplied
                    }}
                    onClick={() => {
                      setLabelValue("Whether licence applied for additional area"),
                      setOpennedModal("licenceApplied")
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue();
                    }}
                  ></ReportProblemIcon>
                  
                </div>

                </Form.Label>
 
              </Col>
            </Row>

            <div>
              <Row className="ms-auto" style={{ marginBottom: 20 }}>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    {/* License No. of Parent License */}
                    <h5>License No. of Parent License &nbsp;</h5>
                  </label>

                  <div className="d-flex flex-row align-items-center my-1 ">
                    <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      placeholder={landScheduleData !== null ? landScheduleData?.licNo : null}
                      disabled
                    ></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.licenceNo
                      }}
                      onClick={() => {
                        setLabelValue("License No. of Parent License"),
                      setOpennedModal("licenceNo")
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(landScheduleData !== null ? landScheduleData?.licNo : null);
                        // setFieldValue(personalinfo !== null ? personalinfo.licenseApplied : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  {/* <input type="number" className="form-control" /> */}
                </Col>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label htmlFor="potential">
                    <h6>
                      {/* Potential Zone: */}
                      <h5>Potential Zone: &nbsp;</h5>
                    </h6>
                  </label>

                  <div  className="d-flex flex-row  align-items-center">
                  <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      placeholder={landScheduleData !== null ? landScheduleData?.potential : null}
                      disabled
                    ></Form.Control>

                    {/* <Form.Select
                      type="text"
                      placeholder={landScheduleData !== null ? landScheduleData?.potential : null}
                      // onChange={handleChangesetPurpose}
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      disabled
                    > */}
                      {/* <select className="form-control" id="Puropse" name="potential" placeholder="Puropse" onChange={handleChangesetPurpose} disabled> */}
                      {/* <option value="">--Potential Zone--</option>
                      <option value="K.Mishra">Hyper</option>
                      <option value="potential 1">High I</option>
                      <option value="potential 2">High II</option>
                      <option value="potential 2">Medium</option>
                      <option value="potential 2">Low I</option>
                      <option value="potential 2">Low II</option> */}
                      {/* </select> */}
                    {/* </Form.Select> */}
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.potentialZone
                      }}
                      onClick={() => {
                        setLabelValue("Potential Zone"),
                        setOpennedModal("potentialZone")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(landScheduleData !== null ? landScheduleData?.potential : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    {/* Site Location Purpose */}
                    <h5>Site Location Purpose: &nbsp;</h5>
                  </label>
                  <div  className="d-flex flex-row  align-items-center">
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.siteLocationPurpose
                      }}
                      onClick={() => {
                        setLabelValue("Site Location Purpose"),
                        setOpennedModal("siteLocationPurpose")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(landScheduleData !== null ? landScheduleData?.potential : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                {/* </Row>
              <Row className="ms-auto" style={{ marginBottom: 20 }}> */}
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    {/* Approach Type (Type of Policy) */}
                    <h5>Approach Type (Type of Policy) &nbsp;</h5>
                  </label>

                  <div  className="d-flex flex-row  align-items-center">
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.approachType
                      }}
                      onClick={() => {
                        setLabelValue("Approach Type (Type of Policy)"),
                        setOpennedModal("approachType")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    <h6>Approach Road Width&nbsp;&nbsp;</h6>{" "}
                  </label>
                  <div  className="d-flex flex-row  align-items-center">
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.approachRoadWidth
                      }}
                      onClick={() => {
                        setLabelValue("Approach Road Width"),
                        setOpennedModal("approachRoadWidth")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="ms-auto" md={4} xxl lg="4">
                  <label>
                    <h6>Specify Others</h6>
                  </label>
                  <div  className="d-flex flex-row  align-items-center">
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.specifyOthers
                      }}
                      onClick={() => {
                        setLabelValue("Specify Others"),
                        setOpennedModal("specifyOthers")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
              </Row>
              <Row className="ms-auto" style={{ marginBottom: 20 }}>
                <div className="col col-4">
                  <h6>Type of land</h6>{" "}
                  <div  className="d-flex flex-row  align-items-center">
                    <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.typeOfLand
                      }}
                      onClick={() => {
                        setLabelValue("Type of land"),
                        setOpennedModal("typeOfLand")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>

                <div className="col col-4">
                  <h6>Third-party right created&nbsp;

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.thirdPartyRightCreated
                      }}
                      onClick={() => {
                        setLabelValue("Third-party right created"),
                        setOpennedModal("thirdPartyRightCreated")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </h6>

                  <div className="d-flex flex-row align-items-center my-1 ">
                    <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow13}  />
                    &nbsp;&nbsp;
                    <label className="m-0 mx-2" for="Yes">
                      Yes
                    </label>
                    &nbsp;&nbsp;
                    <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow13}  />
                    &nbsp;&nbsp;
                    <label className="m-0 mx-2" for="No">
                      No
                    </label>
                    <DownloadForOfflineIcon color="primary" />
                  </div>
                </div>

                {/* {showhide13 === "Yes" && (
                    <div className="row ">
                      <div className="col col-4">
                      <label> Remark </label>
                      <input type="text" className="form-control" disabled />
                      </div>
                      <div className="col col-4">
                      <label> Document Download </label>
                      <DownloadForOfflineIcon color="primary" />
                      </div>
                    </div>
                  )}
                  {showhide13 === "No" && (
                    <div className="row ">
                      <div className="col col-4">
                      <label> Document Download </label>
                      <DownloadForOfflineIcon color="primary" />
                      </div>
                    </div>
                  )} */}
              </Row>
            </div>
            {/* )} */}
            <Row className="ms-auto">
              <Col md={4} xxl lg="12">
                <Form.Label>(ii)Whether licence applied under Migration policy?</Form.Label>
                &nbsp;&nbsp;
                <div className="d-flex flex-row align-items-center my-1 ">
                  {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow17}  />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow17}  />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.migrationPolicy
                    }}
                    onClick={() => {
                      setLabelValue("Whether licence applied under Migration policy"),
                        setOpennedModal("migrationPolicy")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
                <br></br>
                {showhide17 === "Yes" && (
                  <div className="col col-6 ">
                    <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Another Copy of Shahjra Plan&nbsp;&nbsp;
                      <DownloadForOfflineIcon color="primary" />{" "}
                    </h6>
                    <input type="file" className="form-control" />
                  </div>
                )}
              </Col>
            </Row>
            <hr className="mb-3"></hr>
            <h5 className={`text-black ml-2 ${classes.formLabel}`}>
              2. Any encumbrance with respect to following :&nbsp;&nbsp;
              <div className="d-flex mt-2 align-items-center">
                {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                <label className="m-0 mx-2" htmlFor="gen">Rehan / Mortgage</label>
                <input type="radio" disabled id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow18} />
                <label className="m-0 mx-2" htmlFor="npnl">Patta/Lease</label>
                <input type="radio" disabled id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
                <label className="m-0 mx-2" htmlFor="npnl">Gair/Marusi</label>
                <input type="radio" disabled id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
                <ReportProblemIcon
                className="m-0 mx-2"
                  style={{
                    color: fieldIconColors.encumbrance
                  }}
                  onClick={() => {
                    setLabelValue("Any encumbrance with respect to following"),
                        setOpennedModal("encumbrance")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                  }}
                ></ReportProblemIcon>
              </div>
            </h5>
            {/* <label htmlFor="gen">Rehan / Mortgage</label>&nbsp;&nbsp;
            <input type="radio" disabled id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp;
            <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="npnl">Patta/Lease</label>&nbsp;&nbsp;
            <input type="radio" disabled id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp;
            <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="npnl">Gair/Marusi</label>&nbsp;&nbsp;
            <input type="radio" disabled id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
            &nbsp;&nbsp; */}
            <div className="row ml-3 mb-3">
              <div className="col col-4 m-0 p-0">
                <label htmlFor="npnl">
                  <h6>Any other, please specify</h6>
                </label>
                <input type="text" className="form-control" disabled />
              </div>
            </div>
            <hr />
            <h6 className="m-3">
              (ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator&nbsp;&nbsp;
              {/* <Form.Check
                value=" Existing litigation"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group47"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value=" Existing litigation"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group47"
                inline
              ></Form.Check> */}
              <div className="d-flex mt-2">
                {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                <label className="m-0 mx-2" for="No">No</label>
                <ReportProblemIcon
                  style={{
                    color:fieldIconColors.existinglitigation
                  }}
                  onClick={() => {
                    setLabelValue("Existing litigation, if any, concerning applied land including co-sharers and collaborator"),
                        setOpennedModal("existinglitigation")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");;
                  }}
                ></ReportProblemIcon>
              </div>
            </h6>
            {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
            <label className="m-0 mx-2" for="No">No</label> */}
            <hr />
            <h6 className="m-3">
              (iii) Court orders, if any, affecting applied land&nbsp;&nbsp;
              {/* <Form.Check
                value=" Court orders"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group48"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value=" Court orders"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group48"
                inline
              ></Form.Check> */}
              <div className="d-flex mt-2">
                {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                <label className="m-0 mx-2" for="No">No</label>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.courtOrders
                  }}
                  onClick={() => {
                    setLabelValue("Court orders, if any, affecting applied land"),
                        setOpennedModal("courtOrders")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                  }}
                ></ReportProblemIcon>
              </div>
            </h6>
            {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
            <label className="m-0 mx-2" for="No">No</label> */}
            <hr />
            <h6 className="m-3">
              (iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed :&nbsp;&nbsp;
              {/* <Form.Check
                value=" Any insolvency"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group49"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="  Any insolvency"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group49"
                inline
              ></Form.Check> */}
              <div className="d-flex mt-2">
                {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                <label className="m-0 mx-2" for="No">No</label>
                <ReportProblemIcon
                  style={{
                    color:fieldIconColors.anyInsolvency
                  }}
                  onClick={() => {
                    setLabelValue("Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed"),
                        setOpennedModal("anyInsolvency")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                  }}
                ></ReportProblemIcon>
              </div>
            </h6>
            {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
            <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
            <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
            <label className="m-0 mx-2" for="No">No</label> */}
            <hr className="mb-3" />
            <h5 className="text-black ml-2 mb-2">3.Shajra Plan</h5>
            <div className="row mx-1">
              <div className="col col-3 p-1">
                <h6>
                  (a)&nbsp;As per applied land&nbsp;
                  {/* <Form.Check
                    value=" As per applied land "
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group50"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="As per applied land "
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group50"
                    inline
                  ></Form.Check> */}
                  <div className="d-flex flex-row align-items-center my-1 ">
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                    <label className="m-0 mx-2" for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.asPerAppliedLand
                      }}
                      onClick={() => {
                        setLabelValue("As per applied land"),
                        setOpennedModal("asPerAppliedLand")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                <label className="m-0 mx-2" for="No">No</label> */}
              </div>

              <div className="col col-3 p-1">
                <h6 data-toggle="tooltip" data-placement="top" title="If any revenue rasta abuts to the applied site ?">
                  (b)&nbsp;Revenue rasta&nbsp;
                  {/* <InfoIcon style={{color:"blue"}}/>  */}
                  &nbsp;&nbsp;
                  {/* <Form.Check
                    value=" revenue rasta "
                    type="radio"
                    id="default-radio"
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group51"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="revenue rasta"
                    type="radio"
                    id="default-radio"
                    label={<CancelIcon color="error" />}
                    name="group51"
                    inline
                  ></Form.Check> */}
                  <div className="d-flex flex-row align-items-center my-1 ">
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                    <label className="m-0 mx-2" for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.revenueRasta
                      }}
                      onClick={() => {
                        setLabelValue("Revenue rasta"),
                        setOpennedModal("revenueRasta")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                <label className="m-0 mx-2" for="No">No</label> */}
                {showhide2 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label> Width of revenue rasta </label>
                      <input type="number" className="form-control" disabled />
                    </div>
                  </div>
                )}
              </div>

              <div className="col col-3 p-1">
                <h6 data-toggle="tooltip" data-placement="top" title="Watercourse running along boundary through the applied site ?">
                  (c)&nbsp;Watercourse running&nbsp;
                  {/* <InfoIcon style={{color:"blue"}}/>  */}
                  &nbsp;&nbsp;
                  {/* <Form.Check
                    value=" Yes"
                    type="radio"
                    id="default-radio"
                    onChange1={handleChange}
                    onClick={handleshow2}
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group53"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="No "
                    type="radio"
                    id="default-radio"
                    onChange1={handleChange}
                    onClick={handleshow2}
                    label={<CancelIcon color="error" />}
                    name="group53"
                    inline
                  ></Form.Check> */}
                  <div className="d-flex flex-row align-items-center my-1 ">
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                    <label className="m-0 mx-2" for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.waterCourseRunning
                      }}
                      onClick={() => {
                        setLabelValue("Watercourse running"),
                        setOpennedModal("waterCourseRunning")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                <label className="m-0 mx-2" for="No">No</label> */}
                {showhide3 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label> Rev. rasta width </label>
                      <input type="number" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3 p-1">
                <h6>
                  (d)&nbsp;Whether in Compact Block
                  {/* <Form.Check
                    value=" Compact Block"
                    type="radio"
                    id="default-radio"
                    onChange1={handleChange}
                    onClick={handleshow2}
                    label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                    name="group55"
                    inline
                  ></Form.Check>
                  <Form.Check
                    onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                    value="Compact Block "
                    type="radio"
                    id="default-radio"
                    onChange1={handleChange}
                    onClick={handleshow2}
                    label={<CancelIcon color="error" />}
                    name="group55"
                    inline
                  ></Form.Check> */}
                  <div className="d-flex flex-row align-items-center my-1 ">
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                    <label className="m-0 mx-2" for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.whetherInCompactBlock
                      }}
                      onClick={() => {
                        setLabelValue("Whether in Compact Block"),
                        setOpennedModal("whetherInCompactBlock")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                <label className="m-0 mx-2" for="No">No</label> */}
              </div>
              <br></br>
              
                <div className="col col-3 p-1">
                  <h6 data-toggle="tooltip" data-placement="top" title="If any other owners' land is sandwiched within applied land.">
                    (e)&nbsp;Land Sandwiched&nbsp;
                    {/* <InfoIcon style={{color:"blue"}}/>  */}
                    &nbsp;&nbsp;
                    <div className="d-flex flex-row align-items-center my-1 ">
                      <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                      <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                      <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                      <label className="m-0 mx-2" for="No">No</label>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.landSandwiche
                        }}
                        onClick={() => {
                          setLabelValue("Land Sandwiched"),
                        setOpennedModal("landSandwiche")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </h6>
                </div>
                <div className="col col-3 p-1">
                  <h6>
                    (f)&nbsp;Acquisition status&nbsp;
                    <div className="d-flex flex-row align-items-center my-1 ">
                      {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                      <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow3} />
                      <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                      <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow3} />
                      <label className="m-0 mx-2" for="No">No</label>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.acquisitionStatus
                        }}
                        onClick={() => {
                          setLabelValue("Acquisition status"),
                        setOpennedModal("acquisitionStatus")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </h6>

                  {showhide4 === "Yes" && (
                    <div className="row ">
                      <div className="col col">
                        <label>Remark</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col col-3 p-1">
                  <div>
                    <label className="m-0">Date of section 4 notification </label>
                    <div className="d-flex flex-row align-items-center my-1 ">
                      <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.dateOfSection4Notification
                        }}
                        onClick={() => {
                          setLabelValue("Date of section 4 notification"),
                        setOpennedModal("dateOfSection4Notification")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue("");
                        }}
                      ></ReportProblemIcon>
                    </div>
                    {/* <Form.Control style={{ maxWidth: 200, marginTop: 10 }} disabled></Form.Control> */}
                  </div>
                </div>
                <div className="col col-3 p-1">
                  <div>
                    <label className="m-0">Date of section 6 notification</label>
                    <div className="d-flex flex-row align-items-center my-1 ">
                      <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                      <ReportProblemIcon
                        style={{
                          color: fieldIconColors.dateOfSection6Notification
                        }}
                        onClick={() => {
                          setLabelValue("Date of section 6 notification"),
                          setOpennedModal("dateOfSection6Notification")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                        }}
                      ></ReportProblemIcon>
                    </div>
                    {/* <Form.Control style={{ maxWidth: 200, marginTop: 10 }} disabled></Form.Control> */}
                  </div>
              </div>
            </div>
            <div className="row mx-1">
              <div className="col col-12 p-1">
                <h6 data-toggle="tooltip" data-placement="top" title="Whether details/orders of release/exclusion of land uploaded.">
                  (g)&nbsp;Orders Upload
                  {/* <InfoIcon style={{color:"blue"}}/>  */}
                  <div className="d-flex flex-row align-items-center my-1 ">
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow16} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow16} />
                    <label className="m-0 mx-2" for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.ordersUpload
                      }}
                      onClick={() => {
                        setLabelValue("Orders Upload"),
                          setOpennedModal("ordersUpload")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                      {/* comment by me */}
                {/* {showhide16 === "Yes" && (
                  <div className="row ">
                    <div className="col col-3 p-1">
                      <h6>
                        (h) Whether land compensation received&nbsp;&nbsp;
                        <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                        &nbsp;&nbsp;
                        <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                        <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                        &nbsp;&nbsp;
                        <label className="m-0 mx-2" for="No">No</label>
                      </h6>

                      <div className="d-flex flex-row align-items-center my-1 ">
                        <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                        <ReportProblemIcon
                          style={{
                            color:
                              developerInputFiledColor22.length > 0
                                ? developerInputFiledColor22[0].color.data
                                : developerInputCheckedFiledColor22.length > 0
                                ? developerInputCheckedFiledColor22[0].color.data
                                : "#FFB602",
                          }}
                          onClick={() => {
                            setLabelValue("(h) Whether land compensation received"), setSmShow(true), console.log("modal open");
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </div>
                    <div className="col col-3 p-1">
                      <div className="form-group">
                        <label htmlFor="releasestatus">
                          <h6>Status of release</h6>
                        </label>

                        <div className="d-flex flex-row align-items-center my-1 ">
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor23.length > 0
                                  ? developerInputFiledColor23[0].color.data
                                  : developerInputCheckedFiledColor23.length > 0
                                  ? developerInputCheckedFiledColor23[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Status of release"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                        <select className="form-control" id="releasestatus" name="releasestatus">
                          <option value=""></option>
                          <option></option>
                          <option></option>
                          <option></option>
                        </select>
                      </div>
                    </div>
                    <div className="col col-3 p-1">
                      <div className="form-group ">
                        <label htmlFor="awarddate">
                          <h6>Date of Award</h6>
                        </label> */}
                        {/* <Form.Check
                          value="Date of Award"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group64"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Date of Award"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group64"
                          inline
                        ></Form.Check> */}
                        {/* <div className="d-flex flex-row align-items-center my-1 ">
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor24.length > 0
                                  ? developerInputFiledColor24[0].color.data
                                  : developerInputCheckedFiledColor24.length > 0
                                  ? developerInputCheckedFiledColor24[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Date of Award"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div> */}
                        {/* <input type="date" name="awarddate" className="form-control"></input> */}
                        {/* comment by me */}
                      {/* </div>
                    </div>
                    <div className="col col-3 p-1">
                      <div className="form-group ">
                        <label htmlFor="releasedate">
                          <h6>Date of Release</h6>{" "}
                        </label>

                        <div className="d-flex flex-row align-items-center my-1 ">
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor25.length > 0
                                  ? developerInputFiledColor25[0].color.data
                                  : developerInputCheckedFiledColor25.length > 0
                                  ? developerInputCheckedFiledColor25[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Date of Release"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div>
                        <input type="date" name="releasedate" className="form-control"></input>
                      </div>
                    </div>
                    <div className="col col-3 p-1">
                      <div className="form-group ">
                        <label htmlFor="sitedetails">
                          <h6>Site Details</h6>
                        </label> */}
                        {/* <Form.Check
                          value="Site Details"
                          type="radio"
                          id="default-radio"
                          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                          name="group66"
                          inline
                        ></Form.Check>
                        <Form.Check
                          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                          value="Site Details"
                          type="radio"
                          id="default-radio"
                          label={<CancelIcon color="error" />}
                          name="group66"
                          inline
                        ></Form.Check> */}
                        {/* comment by me */}
                        {/* <div className="d-flex flex-row align-items-center my-1 ">
                          <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                          <ReportProblemIcon
                            style={{
                              color:
                                developerInputFiledColor26.length > 0
                                  ? developerInputFiledColor26[0].color.data
                                  : developerInputCheckedFiledColor26.length > 0
                                  ? developerInputCheckedFiledColor26[0].color.data
                                  : "#FFB602",
                            }}
                            onClick={() => {
                              setLabelValue("Site Details"), setSmShow(true), console.log("modal open");
                            }}
                          ></ReportProblemIcon>
                        </div> */}
                        {/* <input type="number" name="sitedetails" className="form-control " /> */}

                        {/* comment by me */}
                      {/* </div> 
                    </div>
                  </div>
                )} */}
              </div>
            </div>
            <br></br>
            <div className="row mx-1">
              <div className="col col-12 p-1">
                <h6>
                  whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road.
                  <div className="d-flex flex-row align-items-center my-1 ">
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                    <label className="m-0 mx-2" for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.internalSectoralPlan
                      }}
                      onClick={() => {
                        setLabelValue("whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road"),
                          setOpennedModal("internalSectoralPlan")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
                {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                <label className="m-0 mx-2" for="No">No</label> */}
              </div>
            </div>
            <hr className="my-3"/>
            <h5 className="text-black ml-2 mb-2">4. Site condition</h5>
            <div className="row mx-1">
              <div className="col col-3 p-1">
                <h6>
                  (a) vacant: (Yes/No){" "}
                  <div className="d-flex flex-row align-items-center my-1 ">
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" />
                    <label className="m-0 mx-2" for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.vacant
                      }}
                      onClick={() => {
                        setLabelValue("vacant"),
                          setOpennedModal("vacant")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h6>
              </div>
              <div className="col col-3 p-1">
                <h6 onChange={(e) => setConstruction(e.target.value)} value={construction}>
                  (b) Construction: (Yes/No)
                </h6>

                <div className="d-flex flex-row align-items-center my-1 ">
                  {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow4} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow4} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.construction
                    }}
                    onClick={() => {
                      setLabelValue("Construction"),
                          setOpennedModal("construction")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>

                {showhide4 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Type of Construction</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3 p-1">
                <h6 onChange={(e) => setHt(e.target.value)} value={ht}>
                  (c) HT line
                </h6>

                <div className="d-flex flex-row align-items-center my-1 ">
                  {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow5} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow5} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.htLine
                    }}
                    onClick={() => {
                      setLabelValue("HT line"),
                          setOpennedModal("htLine")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>

                {showhide5 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>HT Remarks</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3 p-1">
                <h6 onChange={(e) => setGas(e.target.value)} value={gas}>
                  (d) IOC Gas Pipeline
                </h6>

                <div className="d-flex flex-row align-items-center my-1 ">
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.iocGasPipeline
                    }}
                    onClick={() => {
                      setLabelValue("IOC Gas Pipeline"),
                          setOpennedModal("iocGasPipeline")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
                {/* <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                <label className="m-0 mx-2" for="No">No</label> */}
                {showhide6 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>IOC Remarks</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* <br></br> */}
            <div className="row mx-1">
              <div className="col col-3 p-1">
                <h6 onChange={(e) => setNallah(e.target.value)} value={nallah}>
                  (e) Nallah{" "}
                </h6>

                <div className="d-flex flex-row align-items-center my-1 ">
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow7} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow7} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.nallah
                    }}
                    onClick={() => {
                      setLabelValue("Nallah"),
                          setOpennedModal("nallah")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>

                {showhide7 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Nallah Remarks</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3 p-1">
                <h6 onChange={(e) => setRoad(e.target.value)} value={road}>
                  (f) Any revenue rasta/road
                </h6>{" "}
                <div className="d-flex flex-row align-items-center my-1 ">
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow8} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow8} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.anyRevenueRasta
                    }}
                    onClick={() => {
                      setLabelValue("Any revenue rasta/road"),
                          setOpennedModal("anyRevenueRasta")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
                {showhide8 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Width</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3 p-1">
                <h6 onChange={(e) => setLand(e.target.value)} value={land}>
                  (g) Any marginal land
                </h6>{" "}
                <div className="d-flex flex-row align-items-center my-1 ">
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow9} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow9} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.anyMarginalLand
                    }}
                    onClick={() => {
                      setLabelValue("Any marginal land"),
                          setOpennedModal("anyMarginalLand")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
                {showhide9 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Remark</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
              <div className="col col-3 p-1">
                <h6
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Whether any utility line passing through the site is incorporated/adjusted in the layout plan (Yes/No)
"
                >
                  (h)&nbsp;Utility Line &nbsp;
                </h6>

                <div className="d-flex flex-row align-items-center my-1 ">
                  <input type="radio" disabled value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.utilityLine
                    }}
                    onClick={() => {
                      setLabelValue("Utility Line"),
                          setOpennedModal("utilityLine")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>

                {showhide0 === "Yes" && (
                  <div className="row ">
                    <div className="col col">
                      <label>Width of row</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <hr className="my-3"/>
            <h5 className={`text-black ml-2 mb-2 ${classes.formLabel}`}>
              5. Enclose the following documents as Annexures&nbsp;&nbsp;
              <div className="d-flex flex-row align-items-center my-1 ">
                <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control>
                <ReportProblemIcon
                  style={{
                    color: fieldIconColors.documentsAsAnnexures
                  }}
                  onClick={() => {
                    setLabelValue("Enclose the following documents as Annexures"),
                          setOpennedModal("documentsAsAnnexures")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                  }}
                ></ReportProblemIcon>
              </div>
            </h5>
            <div className="row mx-1">
              <div className="col col-3 p-1">
                <h6>Land schedule</h6>
                <div className="d-flex flex-row align-items-center my-1 ">
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.landSchedule
                    }}
                    onClick={() => {
                      setLabelValue("Land schedule"),
                          setOpennedModal("landSchedule")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3 p-1">
                <h6>Copy of Mutation</h6>
                <div className="d-flex flex-row align-items-center my-1 ">
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.copyOfMutation
                    }}
                    onClick={() => {
                      setLabelValue("Copy of Mutation"),
                          setOpennedModal("copyOfMutation")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3 p-1">
                <h6>Copy of Jamabandi</h6>
                <div className="d-flex flex-row align-items-center my-1 ">
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.copyOfJamabandi
                    }}
                    onClick={() => {
                      setLabelValue("Copy of Jamabandi"),
                          setOpennedModal("copyOfJamabandi")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3 p-1">
                <h6>Details of lease / patta, if any</h6>
                <div className="d-flex flex-row align-items-center my-1 ">
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.detailsOfLease
                    }}
                    onClick={() => {
                      setLabelValue("Details of lease / patta, if any"),
                          setOpennedModal("detailsOfLease")
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
            </div>
            <br></br>
            <div className="row mx-1">
              <div className="col col-3 p-1">
                {/* &nbsp;&nbsp; */}
                <h6>Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration</h6>
                {/* &nbsp;&nbsp; */}
                <div className="d-flex flex-row align-items-center my-1 ">
                  {<DownloadForOfflineIcon color="primary" />}

                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.approvalLayoutPlan
                    }}
                    onClick={() => {
                      setLabelValue("Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration"),
                      setOpennedModal("approvalLayoutPlan")
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3 p-1">
                <h6>Proposed Layout of Plan /site plan for area applied for migration.</h6>
                {/* <br/> */}
                <div className="d-flex flex-row align-items-center my-1 ">
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.proposedLayout
                    }}
                    onClick={() => {
                      setLabelValue("Proposed Layout of Plan /site plan for area applied for migration"),
                      setOpennedModal("proposedLayout")
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <div className="col col-3 p-1">
                <h6>Revised Land Schedule</h6>
                <br/><br/>
                <div className="d-flex flex-row align-items-center my-1 ">
                  {<DownloadForOfflineIcon color="primary" />}
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.revisedLandSchedule
                    }}
                    onClick={() => {
                      setLabelValue("Revised Land Schedule"),
                      setOpennedModal("revisedLandSchedule")
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
            </div>
            <br></br>
            {/* <div style={{ position: "relative", marginBottom: 40 }}>
              <Button onClick={() => props.passUncheckedList({ data: uncheckedValue })}>Submit</Button>
            </div> */}
          </Form.Group>
        </div>
      </Collapse>
    </Form>
  );
};

export default Developerinfo;
