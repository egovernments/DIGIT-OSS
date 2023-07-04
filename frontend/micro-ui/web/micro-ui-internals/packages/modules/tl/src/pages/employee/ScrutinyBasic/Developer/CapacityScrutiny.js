import React, { useState, useEffect, Fragment } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
import { Button, Form, FormLabel } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";
// import Timeline from "../../../../../../src/components/Timeline" AB;
import { FormStep } from "@egovernments/digit-ui-react-components";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";

import ModalChild from "../Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "../css/personalInfoChild.style";
import { add } from "lodash";

const CapacityScrutiny = ({ t, config, onSelect, showTable, formData, formDataValue, data, addInfo, applicationStatus, capacityScrutinyInfo, iconColorState, showDevTypeFields, getRemarkData, mDMSData }) => {
  const { pathname: url } = useLocation();
  // const userInfo = Digit.UserService.getUser();
  let validation = {};
  let isOpenLinkFlow = window.location.href.includes("openlink");

  const [isDevType, setIsDevType] = useState(false);
  const [isDevTypeComp, setIsDevTypeComp] = useState(false);
  const [modal, setmodal] = useState(false);
  const [modalColony, setmodalColony] = useState(false);
  const [capacityDevelopColonyHdruAct, setModalCapacityDevelopColonyHdruAct] = useState(
    formDataValue?.DeveloperCapacity?.capacityDevelopColonyHdruAct || []
  );

  const [capacityDevelopColonyLawAct, setCapacityDevelopColonyLawAct] = useState(formDataValue?.DeveloperCapacity?.capacityDevelopColonyLawAct || []);
  const [capacityDevelopAColony, setcapacityDevelopAColony] = useState([]);

  const [licenceNumber, setModalLcNo] = useState(formDataValue?.DeveloperCapacity?.licenceNumber || "");
  const [nameOfDeveloper, setModalDevName] = useState(formDataValue?.DeveloperCapacity?.nameOfDeveloper || "");
  const [purposeOfColony, setModalPurposeCol] = useState(formDataValue?.DeveloperCapacity?.purposeOfColony || "");
  const [sectorAndDevelopmentPlan, setModalDevPlan] = useState(formDataValue?.DeveloperCapacity?.sectorAndDevelopmentPlan || "");
  const [validatingLicence, setModalDevValidity] = useState(formDataValue?.DeveloperCapacity?.validatingLicence || "");

  const [coloniesDeveloped, setColonyDev] = useState(formDataValue?.DeveloperCapacity?.coloniesDeveloped || "");
  const [area, setColonyArea] = useState(formDataValue?.DeveloperCapacity?.area || "");
  const [purpose, setColonyPurpose] = useState(formDataValue?.DeveloperCapacity?.purpose || "");
  const [statusOfDevelopment, setColonyStatusDev] = useState(formDataValue?.DeveloperCapacity?.statusOfDevelopment || "");
  const [outstandingDues, setColonyoutstandingDue] = useState(formDataValue?.DeveloperCapacity?.outstandingDues || "");

  const [engineerName, setEngineerName] = useState(formDataValue?.DeveloperCapacity?.engineerName || "");
  const [engineerQualification, setEngineerQualification] = useState(formDataValue?.DeveloperCapacity?.engineerQualification || "");
  const [engineerSign, setEngineerSign] = useState(formDataValue?.DeveloperCapacity?.engineerSign || "");
  const [engineerDegree, setEngineerDegree] = useState(formDataValue?.DeveloperCapacity?.engineerDegree || "");
  const [architectName, setArchitectName] = useState(formDataValue?.DeveloperCapacity?.architectName || "");
  const [architectQualification, setArchitectQualification] = useState(formDataValue?.DeveloperCapacity?.architectQualification || "");
  const [architectSign, setArchitectSign] = useState(formDataValue?.DeveloperCapacity?.architectSign || "");
  const [architectDegree, setArchitectDegree] = useState(formDataValue?.DeveloperCapacity?.architectDegree || "");
  const [townPlannerName, setTownPlannerName] = useState(formDataValue?.DeveloperCapacity?.townPlannerName || "");
  const [townPlannerQualification, setTownPlannerQualification] = useState(formDataValue?.DeveloperCapacity?.townPlannerQualification || "");
  const [townPlannerSign, setTownPlannerSign] = useState(formDataValue?.DeveloperCapacity?.townPlannerSign || "");
  const [townPlannerDegree, setTownPlannerDegree] = useState(formDataValue?.DeveloperCapacity?.townPlannerDegree || "");
  const [existingDeveloperAgreement, setExistingDev] = useState(formDataValue?.DeveloperCapacity?.existingDeveloperAgreement || "");
  const [existingDeveloperAgreementDoc, setExistingDevDoc] = useState(formDataValue?.DeveloperCapacity?.existingDeveloperAgreementDoc || "");
  const [technicalCapacity, setTechnicalCapacity] = useState(formDataValue?.DeveloperCapacity?.technicalCapacity || "");
  const [technicalCapacityDoc, setTechnicalCapacityDoc] = useState(formDataValue?.DeveloperCapacity?.technicalCapacityDoc || "");
  const [engineerNameN, setengineerNameN] = useState(formDataValue?.DeveloperCapacity?.engineerNameN || "");
  const [engineerDocN, setEngineerDocN] = useState(formDataValue?.DeveloperCapacity?.engineerDocN || "");
  const [architectNameN, setArchitectNameN] = useState(formDataValue?.DeveloperCapacity?.architectNameN || "");
  const [architectDocN, setArchitectDocN] = useState(formDataValue?.DeveloperCapacity?.architectDocN || "");
  const [uplaodSpaBoard, setUplaodSpaBoard] = useState(formDataValue?.DeveloperCapacity?.uplaodSpaBoard || "");
  const [uplaodSpaBoardDoc, setUplaodSpaBoardDoc] = useState(formDataValue?.DeveloperCapacity?.uplaodSpaBoardDoc || "");
  const [agreementDoc, setAgreementDoc] = useState(formDataValue?.DeveloperCapacity?.agreementDoc || "");
  const [boardDoc, setBoardDoc] = useState(formDataValue?.DeveloperCapacity?.boardDoc || "");
  const [registeredDoc, setRegisteredDoc] = useState(formDataValue?.DeveloperCapacity?.registeredDoc || "");
  const [boardDocY, setBoardDocY] = useState(formDataValue?.DeveloperCapacity?.boardDocY || "");
  const [earlierDocY, setEarlierDocY] = useState(formDataValue?.DeveloperCapacity?.earlierDocY || "");
  const [boardDocN, setBoardDocN] = useState(formDataValue?.DeveloperCapacity?.boardDocN || "");
  const [earlierDocN, setEarlierDocN] = useState(formDataValue?.DeveloperCapacity?.earlierDocN || "");
  const [technicalAssistanceAgreementDoc, setTechnicalAssistanceAgreementDoc] = useState(
    formDataValue?.DeveloperCapacity?.technicalAssistanceAgreementDoc || ""
  );

  // let user = Digit.UserService.getUser();
  // const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  // const hideRemarks = userRoles.some((item)=>item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
  // const hideRemarksPatwari = userRoles.some((item)=>item ==="Patwari_HQ")

  // const applicationStatus = props.applicationStatus ;
  let user = Digit.UserService.getUser();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const userRolesArray = userInfo?.roles.filter((user) => user.code !== "EMPLOYEE");
  const filterDataRole = userRolesArray?.[0]?.code;
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];

  console.log("rolelogintime", userRoles);
  console.log("afterfilter12", filterDataRole)

  // const mDMSData = props.mDMSData;
  const mDMSDataRole = mDMSData?.map((e) => e.role) || [];
  const hideRemarks = mDMSDataRole.includes(filterDataRole);
  const applicationStatusMdms = mDMSData?.map((e) => e.applicationStatus) || [];
  const hideRemarksPatwari = applicationStatusMdms.some((item) => item === applicationStatus) || [];
  const [fileddataName, setFiledDataName] = useState();

  useEffect(() => {
    if (mDMSData && mDMSData?.length) {
      console.log("filedDataMdms", mDMSData, mDMSData?.[0]?.field, mDMSData?.[0]?.field.map((item, index) => item.fields));
      setFiledDataName(mDMSData?.[0]?.field.map((item, index) => item.fields))

    }

  }, [mDMSData]
  )
  const showReportProblemIcon = (filedName) => {
    if (fileddataName && fileddataName.length) {
      let show = fileddataName.includes(filedName)
      return show;
    } else {
      return false;
    }
  }

  // mDMSData?.map((e) => e.role)||[]
  console.log("happyRole", userRoles);
  console.log("happyDate", mDMSData);
  console.log("happyROLE", mDMSDataRole);
  console.log("happyapplicationStatusMdms564654", applicationStatusMdms);
  console.log("happyDateHIDE45655", hideRemarksPatwari, showReportProblemIcon("Purpose of colony"), hideRemarks);





  // console.log("AUTHNAME", authUserName);

  // const dispatch = useDispatch();

  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);

  const [open2, setOpen2] = useState(false);
  const [messege, setMessege] = useState("");
  const [developerLabel, setDeveloperLabel] = useState(true);
  const [show, setshow] = useState(false);
  const [show3, setshow3] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");
  const [color, setColor] = useState({ yes: false, no: false });

  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);
  // const [fieldValue1, setFieldValue1] = useState("");




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
  //   useEffect(() => {
  //     props.passUncheckedList({ data: uncheckedValue });
  //   }, [uncheckedValue]);

  //   useEffect(() => {
  //     props.passCheckedList({ data: checkValue });
  //   }, [checkValue]);
  console.log("unchecked values", uncheckedValue);

  console.log(uncheckedValue.indexOf("developer"));

  const developerInputFiledColor = uncheckedValue.filter((obj) => {
    return obj.label === "Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act,1975";
  });
  const developerInputCheckedFiledColor = checkValue.filter((obj) => {
    return obj.label === "Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act,1975";
  });
  const developerInputFiledColor1 = uncheckedValue.filter((obj) => {
    return obj.label === "Whether any technical expert(s) engaged";
  });
  const developerInputCheckedFiledColor1 = checkValue.filter((obj) => {
    return obj.label === "Whether any technical expert(s) engaged";
  });
  const developerInputFiledColor2 = uncheckedValue.filter((obj) => {
    return obj.label === "technical capacity sought";
  });
  const developerInputCheckedFiledColor2 = checkValue.filter((obj) => {
    return obj.label === "technical capacity sought";
  });
  const developerInputFiledColor3 = uncheckedValue.filter((obj) => {
    return obj.label === "Licences/permissions granted to Developer/ group company for development of colony under any other law/Act as";
  });
  const developerInputCheckedFiledColor3 = checkValue.filter((obj) => {
    return obj.label === "Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act,1975";
  });
  const developerInputFiledColor4 = uncheckedValue.filter((obj) => {
    return obj.label === "the proposed developer company/firm";
  });
  const developerInputCheckedFiledColor4 = checkValue.filter((obj) => {
    return obj.label === "the proposed developer company/firm";
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm([{ XLongitude: "", YLatitude: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [AppliedDetailFormSubmitted, SetAppliedDetailFormSubmitted] = useState(false);

  const [open, setOpen] = useState(false);
  const [showhide, setShowhide] = useState("No");
  const [showhide1, setShowhide1] = useState("no");
  const [showhide0, setShowhide0] = useState("No");
  const [showhide6, setShowhide6] = useState("No");

  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  };
  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };

  const handleshow6 = (e) => {
    const getshow = e.target.value;
    setShowhide6(getshow);
  };

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  const devTypeFlagVal = localStorage.getItem("devTypeValueFlag");

  const handleArrayValues = () => {
    if (licenceNumber !== "" && nameOfDeveloper !== "" && purposeOfColony !== "") {
      const values = {
        licenceNumber: licenceNumber,
        nameOfDeveloper: nameOfDeveloper,
        purposeOfColony: purposeOfColony,
        sectorAndDevelopmentPlan: sectorAndDevelopmentPlan,
        validatingLicence: validatingLicence,
      };
      setModalCapacityDevelopColonyHdruAct((prev) => [...prev, values]);
      setmodal(!modal);
    }
    console.log("DevCapacityFirst", capacityDevelopColonyHdruAct);
    localStorage.setItem("DevCapacityDetails", JSON.stringify(capacityDevelopColonyHdruAct));
  };

  const handleColonyDevGrp = () => {
    const colonyDevValues = {
      coloniesDeveloped: coloniesDeveloped,
      area: area,
      purpose: purpose,
      statusOfDevelopment: statusOfDevelopment,
      outstandingDues: outstandingDues,
    };
    setCapacityDevelopColonyLawAct((prev) => [...prev, colonyDevValues]);
    setmodalColony(!modalColony);
    console.log("DevCapacityColony", capacityDevelopColonyLawAct);
  };

  const submitTechdevData = async (e) => {
    //   e.preventDefault();
    const formDataValues = {
      capacityDevelopAColony: {
        capacityDevelopColonyHdruAct: capacityDevelopColonyHdruAct,
        capacityDevelopColonyLawAct: capacityDevelopColonyLawAct,
        technicalExpertEngaged: {
          engineerName: engineerName,
          engineerQualification: engineerQualification,
          engineerSign: engineerSign,
          engineerDegree: engineerDegree,
          architectName: architectName,
          architectQualification: architectQualification,
          architectSign: architectSign,
          architectDegree: architectDegree,
          townPlannerName: townPlannerName,
          townPlannerQualification: townPlannerQualification,
          townPlannerSign: townPlannerSign,
          townPlannerDegree: townPlannerDegree,
          existingDeveloperAgreement: existingDeveloperAgreement,
          existingDeveloperAgreementDoc: existingDeveloperAgreementDoc,
          technicalCapacity: technicalCapacity,
          technicalCapacityDoc: technicalCapacityDoc,
          engineerNameN: engineerNameN,
          engineerDocN: engineerDocN,
          architectNameN: architectNameN,
          architectDocN: architectDocN,
          uplaodSpaBoard: uplaodSpaBoard,
          uplaodSpaBoardDoc: uplaodSpaBoardDoc,
        },
        designationDirector: {
          agreementDoc: agreementDoc,
          boardDoc: boardDoc,
        },
        obtainedLicense: {
          registeredDoc: registeredDoc,
          boardDocY: boardDocY,
          earlierDocY: earlierDocY,
          boardDocN: boardDocN,
          earlierDocN: earlierDocN,
          technicalAssistanceAgreementDoc: technicalAssistanceAgreementDoc,
        },
      },
    };
    onSelect(config.key, formDataValues);

    console.log("FINAL SUBMIT", formDataValues);
    localStorage.setItem("capacity", JSON.stringify(formDataValues));
    setcapacityDevelopAColony((prev) => [...prev, formDataValues]);
  };
  const jsonobj = localStorage.getItem("capacity");
  console.log(JSON.parse(jsonobj));

  const [noofRows, setNoOfRows] = useState(1);
  const [noofRow, setNoOfRow] = useState(1);
  const [noofRow1, setNoOfRow1] = useState(1);
  const onSkip = () => onSelect();





  const classes = useStyles();

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    conditional: "#2874A6",
    approved: "#09cb3d",
    disapproved: "#ff0000",

    info: "#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    caution1: Colors.info,
    caution2: Colors.info,
    caution3: Colors.info,
    caution4: Colors.info,
    caution5: Colors.info,
    caution6: Colors.info,
    caution7: Colors.info,
    caution8: Colors.info,
    caution9: Colors.info,
    caution10: Colors.info,
    caution11: Colors.info,
    caution12: Colors.info,
    caution13: Colors.info,
    caution14: Colors.info,
  })

  const fieldIdList = [{ label: "Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975", key: "caution1" },
  { label: "Bank statement for the last 3 years", key: "caution2" },
  { label: "Balance sheet of last 3 years", key: "caution3" },
  { label: "Ps-3(Representing Paid-UP capital)", key: "caution4" },
  { label: "Reserves and surpluses", key: "caution5" },
  { label: "Any other documents (in the case of the company)", key: "caution6" },
  { label: "Whether the Developer has earlier been granted permission to set up a colony under HDRU Act,1975:", key: "caution7" },
  { label: "Name of Project", key: "caution8" },
  { label: "Name of Authority", key: "caution9" },
  { label: "Status of Development", key: "caution11" },
  { label: "Location", key: "caution14" },
  { label: "Permission letter", key: "caution12" },
  { label: "Area of the project in acres ", key: "caution13" },
  { label: "(ii) Have you developed projects outside Haryana:-", key: "caution10" },]

  const iconStates = iconColorState
  console.log("RemarksColor", iconStates);
  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (iconStates !== null && iconStates !== undefined) {
        console.log("color method called");
        const fieldPresent = iconStates.egScrutiny.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value1", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved === "In Order" ? Colors.approved : fieldPresent[0].isApproved === "Not In Order" ? Colors.disapproved : fieldPresent[0].isApproved === "conditional" ? Colors.conditional : Colors.info }

        }
      }
    })

    setFieldIconColors(tempFieldColorState);

  };


  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...",)
  }, [iconStates])

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = iconStates.egScrutiny.filter(ele => (ele.fieldIdL === labelValue));
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue])



  const currentRemarks = (data) => {
    showTable({ data: data.data });
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved })


      // fieldPresent[0].isApproved === "approved" ?Colors.approved: fieldPresent[0].isApproved === "disapproved" ? Colors.disapproved:fieldPresent[0].isApproved === "conditional" ? Colors.conditional:Colors.info
    }
    setOpennedModal("");
    setLabelValue("");
  };

  console.log("happy akash", capacityScrutinyInfo);
  console.log("happy akash2", addInfo);

  return (
    <div>
      <ModalChild
        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        onClose={() => setSmShow(false)}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
        applicationStatus={applicationStatus}
      // getRemarkData={props.getRemarkData}
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
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - Developer Capacity
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text">
          <FormStep config={config} onSelect={submitTechdevData} onSkip={onSkip} t={t}>
            {/* kit  {developerType} */}

            {/* oti {addInfo?.showDevTypeFields} */}

            {addInfo?.showDevTypeFields === "Individual" && (
              <div className="card-body">
                <div className="form-group row mb-12">
                  <label className="col-sm-3 col-form-label">Individual</label>
                  <div className="col-sm-12">
                    {/* <textarea type="text" className="employee-card-input" id="details" placeholder="Enter Details" /> */}
                    <table className="table table-bordered" size="sm">
                      <thead>
                        <tr>
                          <th class="fw-normal">S.No.</th>
                          <th class="fw-normal">Particulars of document</th>
                          <th class="fw-normal">Details </th>
                          <th class="fw-normal">Annexure </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td> 1 </td>
                          <td>Net Worth in case of individual certified by CA/ Or Income tax return in case of an individual (for the last three years)</td>
                          <td>
                            {/* <input type="file" name="upload" placeholder="" class="employee-card-input" /> */}
                            <div className="row">
                              {/* <button className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </button>
                                  <button className="btn btn-sm col-md-6">
                                    <FileDownloadIcon color="primary" />
                                  </button> */}

                              {
                                item?.agreementDoc &&
                                <Fragment>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                  </div>
                                </Fragment>
                              }

                            </div>
                          </td>
                          <td align="center" size="large">
                            {JSON.stringify(hideRemarks)}
                            {/*  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none", */}
                            <div>
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution1
                                }}
                                onClick={() => {
                                  setOpennedModal("caution1")
                                  setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1 : null);
                                }}
                              ></ReportProblemIcon>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td> 2 </td>
                          <td>Bank statement for the last 3 years</td>
                          <td>
                            {/* <input type="file" name="upload" placeholder="" class="employee-card-input" /> */}
                            <div className="row">
                              {/* <button className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </button>
                                  <button className="btn btn-sm col-md-6">
                                    <FileDownloadIcon color="primary" />
                                  </button> */}
                              {
                                item?.agreementDoc &&
                                <Fragment>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                  </div>
                                </Fragment>
                              }
                            </div>
                          </td>
                          <td align="center" size="large">
                            <div>
                              <ReportProblemIcon
                                style={{
                                  color: fieldIconColors.agreementDoc
                                }}
                                onClick={() => {
                                  setOpennedModal("caution2")
                                  setLabelValue("Bank statement for the last 3 years"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.agreementDoc : null);
                                }}
                              ></ReportProblemIcon>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}




            {addInfo?.showDevTypeFields === "Company" && (
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-sm-12">
                    <table className="table table-bordered" size="sm">
                      <thead>
                        <tr>
                          <th class="fw-normal">S.No.</th>
                          <th class="fw-normal">Particulars of document</th>
                          <th class="fw-normal">Details </th>
                          <th class="fw-normal">Annexure </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td> 1 </td>
                          <td>Balance sheet of last 3 years </td>
                          <td>
                            {/* <input type="file" name="upload" placeholder="" class="employee-card-input" /> */}
                            <div className="row">
                              {/* <button className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </button>
                                  <button className="btn btn-sm col-md-6">
                                    <FileDownloadIcon color="primary" />
                                  </button> */}
                              {
                                capacityScrutinyInfo?.documents?.companyBalanceSheet &&
                                <Fragment>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(capacityScrutinyInfo?.documents?.companyBalanceSheet)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                  </div>

                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(capacityScrutinyInfo?.documents?.companyBalanceSheet)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                  </div>
                                </Fragment>
                              }
                            </div>
                          </td>
                          <td align="center" size="large">
                            <div>
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution3
                                }}
                                onClick={() => {
                                  setOpennedModal("caution3")
                                  setLabelValue("Balance sheet of last 3 years"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.documents?.companyBalanceSheet : null);
                                }}
                              ></ReportProblemIcon>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td> 2 </td>
                          <td>Ps-3(Representing Paid-UP capital)</td>
                          <td>
                            {/* <input type="file" name="upload" placeholder="" class="employee-card-input" /> */}
                            <div className="row">
                              {/* <button className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </button>
                                  <button className="btn btn-sm col-md-6">
                                    <FileDownloadIcon color="primary" />
                                  </button> */}
                              {
                                capacityScrutinyInfo?.documents?.paidUpCapital &&
                                <Fragment>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(capacityScrutinyInfo?.documents?.paidUpCapital)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(capacityScrutinyInfo?.documents?.paidUpCapital)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                  </div>
                                </Fragment>
                              }
                            </div>
                          </td>
                          <td align="center" size="large">
                            <div>
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution4
                                }}
                                onClick={() => {
                                  setOpennedModal("caution4")
                                  setLabelValue("Ps-3(Representing Paid-UP capital)"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.documents?.paidUpCapital : null);
                                }}
                              ></ReportProblemIcon>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td> 3 </td>
                          <td>Reserves and surpluses</td>
                          <td>
                            {/* <input type="file" name="upload" placeholder="" class="employee-card-input" /> */}
                            <div className="row">
                              {/* <button className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </button>
                                  <button className="btn btn-sm col-md-6">
                                    <FileDownloadIcon color="primary" />
                                  </button> */}
                              {
                                capacityScrutinyInfo?.documents?.reservesAndSurplus &&
                                <Fragment>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(capacityScrutinyInfo?.documents?.reservesAndSurplus)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(capacityScrutinyInfo?.documents?.reservesAndSurplus)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                  </div>
                                </Fragment>
                              }
                            </div>
                          </td>
                          <td align="center" size="large">
                            <div>
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution5
                                }}
                                onClick={() => {
                                  setOpennedModal("caution5")
                                  setLabelValue("Reserves and surpluses"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.documents?.reservesAndSurplus : null);
                                }}
                              ></ReportProblemIcon>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td> 4 </td>
                          <td>Any other documents (in the case of the company)</td>
                          <td>
                            {/* <input type="file" name="upload" placeholder="" class="employee-card-input" /> */}
                            <div className="row">
                              {/* <button className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </button>
                                  <button className="btn btn-sm col-md-6">
                                    <FileDownloadIcon color="primary" />
                                  </button> */}
                              {
                                capacityScrutinyInfo?.documents?.anyOtherDoc &&
                                <Fragment>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(capacityScrutinyInfo?.documents?.anyOtherDoc)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={() => getDocShareholding(capacityScrutinyInfo?.documents?.anyOtherDoc)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                  </div>
                                </Fragment>
                              }
                            </div>
                          </td>
                          <td align="center" size="large">
                            <div>
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution6
                                }}
                                onClick={() => {
                                  setOpennedModal("caution6")
                                  setLabelValue("Any other documents (in the case of the company)"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.documents?.anyOtherDoc : null);
                                }}
                              ></ReportProblemIcon>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}


            <div className="card-body">
              <p>1. I/ We hereby submit the following information/ enclose the relevant documents:-</p>
              <p className="ml-3">
                (i) Whether the Developer has earlier been granted permission to set up a colony under HDRU Act, 1975: *{" "}
              </p>
              <div className="d-flex flex-row align-items-center ml-4">
                <input type="radio" value="Yes" checked={capacityScrutinyInfo?.permissionGrantedHRDU === "Y" ? true : false} disabled />
                <label className="m-0  mx-1" for="Yes">Yes</label>
                <input type="radio" value="No" checked={capacityScrutinyInfo?.permissionGrantedHRDU === "N" ? true : false} disabled />
                <label className="m-0 mx-2" for="No">No</label>
                <ReportProblemIcon
                  style={{
                    display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution7
                  }}
                  onClick={() => {
                    setOpennedModal("caution7")
                    setLabelValue("Whether the Developer has earlier been granted permission to set up a colony under HDRU Act,1975:"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.permissionGrantedHRDU : null);
                  }}
                ></ReportProblemIcon>

              </div>
              <div>
                {capacityScrutinyInfo?.permissionGrantedHRDU === "Y" && (
                  <div className="card-body">
                    {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
                    <div className="table-bd">
                      <Table className="table table-bordered">
                        <thead>
                          <tr>
                            <th class="fw-normal">S. no</th>
                            <th class="fw-normal"> Licence No. </th>
                            <th class="fw-normal">Date of grant of license</th>
                            <th class="fw-normal">Purpose of colony</th>
                            <th class="fw-normal">Validity of Licence</th>
                            {/* <th class="fw-normal">Technical Expert Engaged</th>
                                                    <th class="fw-normal">Degrees of Engineer</th>
                                                    <th class="fw-normal">Degrees of Architect</th>
                                                    <th class="fw-normal">Degrees of Town Planner</th> */}
                            <th class="fw-normal">Actions</th>
                            {/* <th>Remove</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {/* {capacityDevelopColonyHdruAct.length > 0
                          ? capacityDevelopColonyHdruAct.map((elementInArray, input) => {
                              return ( */}

                          {
                            capacityScrutinyInfo?.capacityDevelopColonyHdruAct?.map((item, index) => (

                              <tr>
                                <td>{index + 1}</td>
                                <td>
                                  <input
                                    type="text"
                                    // value={item?.licenceNumber}
                                    placeholder={item?.licenceNumber}
                                    class="employee-card-input"
                                    disabled
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    // value={item?.nameOfDeveloper}
                                    placeholder={item?.grantLicence}
                                    class="employee-card-input"
                                    disabled
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    // value={item?.purposeOfColony}
                                    placeholder={item?.purposeOfColony}
                                    class="employee-card-input"
                                    disabled
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    // Validity of Licence
                                    placeholder={item?.validatingLicence}
                                    class="employee-card-input"
                                    disabled
                                  />
                                </td>
                                {/* <td>
                              <input
                                type="text"
                               
                                placeholder={item?.purposeOfColony}
                                class="employee-card-input"
                                disabled
                              />
                            </td> */}
                                {/* <td>
                              <div className="row">
                              
                                 <div className="btn btn-sm col-md-6">
                                 <IconButton onClick={()=>getDocShareholding(item?.sectorAndDevelopmentPlan)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                 </div>
                                 <div className="btn btn-sm col-md-6">
                           
                                 <IconButton onClick={()=>getDocShareholding(item?.sectorAndDevelopmentPlan)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                              </div>
                            </td> */}
                                {/* <td>
                              <div className="row">
                                
                               
                                 <div className="btn btn-sm col-md-6">
                                <IconButton onClick={()=>getDocShareholding(item?.validatingLicence)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                      </div>
                                 <div className="btn btn-sm col-md-6">
                                
                                 <IconButton onClick={()=>getDocShareholding(item?.validatingLicence)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                 
                              </div>
                            </td> */}
                                {/* <td>
                              <div className="row">
                                
                               
                                 <div className="btn btn-sm col-md-6">
                                <IconButton onClick={()=>getDocShareholding(item?.validatingLicence)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                      </div>
                                 <div className="btn btn-sm col-md-6">
                               
                                 <IconButton onClick={()=>getDocShareholding(item?.validatingLicence)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                 
                              </div>
                            </td> */}
                                {/* <td>
                            <div className="btn btn-sm col-md-6">
                            <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution8")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
                </div>
                            

                            </td> */}
                              </tr>

                            ))
                          }


                        </tbody>
                      </Table>
                      <div>
                        {/* <div>
                        <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
                          <ModalHeader toggle={() => setmodal(!modal)}></ModalHeader>

                          <ModalBody>
                            <div className="card2">
                              <div className="popupcard">
                                <form className="text1">
                                  <Row>
                                    <Col md={4} xxl lg="4">
                                      <label htmlFor="name" className="text">
                                        Licence No / year of licence
                                      </label>
                                      <input type="text" onChange={(e) => setModalLcNo(e.target.value)} placeholder="" class="employee-card-input" />
                                    </Col>
                                    <Col md={4} xxl lg="4">
                                      <label htmlFor="name" className="text">
                                        Name of developer *
                                      </label>
                                      <input
                                        type="text"
                                        onChange={(e) => setModalDevName(e.target.value)}
                                        placeholder=""
                                        class="employee-card-input"
                                      />
                                    </Col>
                                    <Col md={4} xxl lg="4">
                                      <label htmlFor="name" className="text">
                                        Purpose of colony
                                      </label>
                                      <input
                                        type="text"
                                        onChange={(e) => setModalPurposeCol(e.target.value)}
                                        placeholder=""
                                        class="employee-card-input"
                                      />
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col md={4} xxl lg="4">
                                      <label htmlFor="name" className="text">
                                        Sector and development plan
                                      </label>
                                      <input
                                        type="file"
                                        onChange={(e) => setModalDevPlan(e.target.value)}
                                        placeholder=""
                                        class="employee-card-input"
                                      />
                                    </Col>
                                    <Col md={4} xxl lg="4">
                                      <label htmlFor="name" className="text">
                                        Validity of licence{" "}
                                      </label>
                                      <input
                                        type="file"
                                        onChange={(e) => setModalDevValidity(e.target.value)}
                                        placeholder=""
                                        class="employee-card-input"
                                      />
                                    </Col>
                                  </Row>
                                </form>
                              </div>
                              <div className="submit-btn">
                                <div className="form-group col-md6 mt-6">
                                  <button type="button" onClick={handleArrayValues} style={{ float: "right" }} className="btn btn-success">
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </ModalBody>
                          <ModalFooter toggle={() => setmodal(!modal)}></ModalFooter>
                        </Modal>
                      </div> */}
                      </div>

                      {/* <br></br> */}
                      {/* <br></br> */}
                    </div>
                  </div>
                )}
              </div>

              <br></br>
              {capacityScrutinyInfo?.permissionGrantedHRDU === "N" && (
                <div>
                  <div className="hl"></div>
                  <p className="ml-3">
                    (ii) Have you developed projects outside Haryana:-

                  </p>
                  <div className="ml-3" >
                    <input
                      type="radio"
                      value="Yes"

                      className="mx-2 mt-1"
                      checked={capacityScrutinyInfo?.technicalCapacityOutsideHaryana === "Y" ? true : false}

                      disabled
                    />
                    <label className="m-0  mx-1" for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="No"

                      className="mx-2 mt-1"
                      checked={capacityScrutinyInfo?.technicalCapacityOutsideHaryana === "N" ? true : false}

                      disabled
                    />
                    <label className="m-0 mx-2" for="No">No</label>
                    <ReportProblemIcon
                      style={{
                        display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                        color: fieldIconColors.caution10
                      }}
                      onClick={() => {
                        setOpennedModal("caution10")
                        setLabelValue("(ii) Have you developed projects outside Haryana:-"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.technicalCapacityOutsideHaryana : null);
                      }}
                    ></ReportProblemIcon>
                  </div>


                  <br></br>



                  {capacityScrutinyInfo?.technicalCapacityOutsideHaryana === "Y" && (
                    <div className="row ">
                      {/* <div className="form-group row"> */}
                      <div className="col-sm-12">
                        {/* <Col xs="12" md="12" sm="12">
                        <Table className="table table-bordered" size="sm">
                          <thead>
                            <tr>
                              <th class="fw-normal">S.No.</th>
                              <th class="fw-normal">Professional </th>
                              <th class="fw-normal"> Annexure</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td> 1 &nbsp;&nbsp;</td>
                              <td> Agreement between the entities to provide technical assistance</td>
                              <td align="center" size="large">
                                <div className="row">
                                
                                 <div className="btn btn-sm col-md-6">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                      </div>
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td> 2&nbsp;&nbsp; </td>
                              <td>Board resolutions of authorized signatory of firm/company provided technical assistance</td>
                              <td align="center" size="large">
                                <div className="row">
                               
                                 <div className="btn btn-sm col-md-6">
                                <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                      </div>
                                 <div className="btn btn-sm col-md-6">
                                  
                                  <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col> */}
                        <Row>
                          <Col md={4} xxl lg="4">
                            <label htmlFor="project" className="text"> Name of Project </label>

                            <div className={classes.fieldContainer}>
                              <Form.Control
                                placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.project}
                                disabled></Form.Control>
                              &nbsp;&nbsp;
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution8
                                }}
                                onClick={() => {
                                  setOpennedModal("caution8")
                                  setLabelValue("Name of Project"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.project : null);
                                }}
                              ></ReportProblemIcon>
                            </div>

                          </Col>

                          <Col md={4} xxl lg="4">
                            <label htmlFor="authority" className="text">Name of Authority</label>
                            <div className={classes.fieldContainer}>
                              <Form.Control
                                placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.authority}
                                disabled></Form.Control>
                              &nbsp;&nbsp;
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution9
                                }}
                                onClick={() => {
                                  setOpennedModal("caution9")
                                  setLabelValue("Name of Authority"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.authority : null);
                                }}
                              ></ReportProblemIcon>
                            </div>

                          </Col>

                          <Col md={4} xxl lg="4">
                            <label htmlFor="statusOfDevelopment" className="text"> Status of Development </label>

                            <div className={classes.fieldContainer}>
                              <Form.Control
                                placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.statusOfDevelopment}
                                disabled></Form.Control>
                              &nbsp;&nbsp;
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution11
                                }}
                                onClick={() => {
                                  setOpennedModal("caution11")
                                  setLabelValue("Status of Development"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.statusOfDevelopment : null);
                                }}
                              ></ReportProblemIcon>
                            </div>

                          </Col>
                        </Row>
                        <Row>
                          {/* <Col md={4} xxl lg="4">
                                        <label htmlFor="statusOfDevelopment" className="text"> Permission letter  </label>
                                        
                                           <div className={classes.fieldContainer}>
                              <Form.Control
                               placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.statusOfDevelopment} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution12
                  }}
                  onClick={() => {
                    setOpennedModal("caution12")
                    setLabelValue("Permission letter"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.statusOfDevelopment: null);
                  }}
                ></ReportProblemIcon>
            </div>

                                    </Col> */}
                          <Col md={4} xxl lg="4">
                            <label htmlFor="statusOfDevelopment" className="text">Area of the project in acres </label>

                            <div className={classes.fieldContainer}>
                              <Form.Control
                                placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.projectArea}
                                disabled></Form.Control>
                              &nbsp;&nbsp;
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution13
                                }}
                                onClick={() => {
                                  setOpennedModal("caution13")
                                  setLabelValue("Area of the project in acres "),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.projectArea : null);
                                }}
                              ></ReportProblemIcon>
                            </div>

                          </Col>
                          <Col md={4} xxl lg="4">
                            <label htmlFor="statusOfDevelopment" className="text">Location </label>

                            <div className={classes.fieldContainer}>
                              <Form.Control
                                placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.location}
                                disabled></Form.Control>
                              &nbsp;&nbsp;
                              <ReportProblemIcon
                                style={{
                                  display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                                  color: fieldIconColors.caution14
                                }}
                                onClick={() => {
                                  setOpennedModal("caution14")
                                  setLabelValue("Location"),
                                    setSmShow(true),
                                    console.log("modal open"),
                                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.location : null);
                                }}
                              ></ReportProblemIcon>
                            </div>

                          </Col>
                        </Row>
                        <Row>
                          {/* <Col md={4} xxl lg="4">
                                        <label htmlFor="statusOfDevelopment" className="text">Any other document/ Photo</label>
                                        
                                           <div className={classes.fieldContainer}>
                              <Form.Control 
                               placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.anyOtherDoc} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution15
                  }}
                  onClick={() => {
                    setOpennedModal("caution15")
                    setLabelValue("Any other document/ Photo"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.anyOtherDoc: null);
                  }}
                ></ReportProblemIcon>
            </div>

                                    </Col> */}
                        </Row>
                      </div>
                      {/* </div> */}
                    </div>
                  )}

                </div>
              )}


              <br></br>
              <div className="hl"></div>
              {/* <p >
                            (iii) In case of technical capacity of company/firm developed projects outside Haryana:-
                        </p> */}

              <div >

                {/* <div >
                            <input
                                type="radio"
                                value="Y"
                                checked={capacityScrutinyInfo?.technicalCapacityOutsideHaryana === "Y" ? true : false}
                                id="technicalCapacityOutsideHaryana"
                                className="mx-2 mt-1"
                               
                                name="technicalCapacityOutsideHaryana"
                                disabled
                            />
                            <label for="Yes">Yes</label>

                            <input
                                type="radio"
                                value="N"
                                checked={capacityScrutinyInfo?.technicalCapacityOutsideHaryana=== "N" ? true : false}
                                id="technicalCapacityOutsideHaryanaN"
                                className="mx-2 mt-1"
                                
                                name="technicalCapacityOutsideHaryana"
                                disabled
                            />
                            <label for="No">No</label>

                            <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
                            </div> */}
                {/* {capacityScrutinyInfo?.technicalCapacityOutsideHaryana === "Y" && ( */}
                {/* <Row>
                                    <Col md={4} xxl lg="4">
                                        <label htmlFor="project" className="text"> Project </label>
                                      
                                         <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.project} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>

                                    </Col>

                                    <Col md={4} xxl lg="4">
                                        <label htmlFor="authority" className="text"> Authority </label>
                                           <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.authority} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>

                                    </Col>

                                    <Col md={4} xxl lg="4">
                                        <label htmlFor="statusOfDevelopment" className="text"> (iii) Status of Development </label>
                                        
                                           <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={capacityScrutinyInfo?.technicalCapacityOutsideHaryanaDetails?.statusOfDevelopment} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>

                                    </Col>
                                </Row> */}
                {/* )}  */}
              </div>



              <br></br>
              {/* <div className="hl"></div>
                        <p>
                            (iv). In case of technical capacity sought from another
                            company/firm who has already obtained license(s) under act of
                            1975 or outside Haryana:
                        </p>
                        <div >
                          <div >
                            <input
                                type="radio"
                                value="Y"
                                id="alreadtObtainedLic"
                                className="mx-2 mt-1"
                                checked={capacityScrutinyInfo?.alreadtObtainedLic === "Y" ? true : false}
                             
                                name="alreadtObtainedLic"
                                disabled
                            />
                            <label for="Yes">Yes</label>

                            <input
                                type="radio"
                                value="N"
                                id="alreadtObtainedLicN"
                                className="mx-2 mt-1"
                               
                                checked={capacityScrutinyInfo?.alreadtObtainedLic === "N" ? true : false}
                                name="alreadtObtainedLic"
                                onClick={handleshow6}
                                disabled
                            />
                            <label for="No">No</label>
                            </div>
                            <br></br>
                            {capacityScrutinyInfo?.alreadtObtainedLic === "Y" && (
                              <div>
                                <div>
                                <div className="row">
                    <div className="col-sm-12">
                      <div className="table-bd">
                        
                                  
                                                    <div>
                                                        <Table className="table table-bordered" >
                                                            <thead>
                                                                <tr>
                                                                    <th>S.No.</th>
                                                                    <th>Agreement*</th>
                                                                    <th>Upload Document </th>
                                                                    <th>Annexure </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td> 1 </td>

                                                                    <td>
                                                                        Agreement between the proposed developer and existing colonizer
                                                                    </td>
                                                                    <td align="center" size="large">
                                                                      
                                                                        <div className="row">
                               
                               <div className="btn btn-sm col-md-6">
                              <IconButton onClick={()=>getDocShareholding(capacityScrutinyInfo?.obtainedLicense?.boardDoc)}>
                                    <VisibilityIcon color="info" className="icon" /></IconButton>
                                    </div>
                               <div className="btn btn-sm col-md-6">
                             
                                <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                    <FileDownloadIcon color="info" className="icon" /></IconButton>
                                    </div>
                              </div>

                                                                    </td>
                                                                    <td>
                                                                   
                                                          <div className={classes.fieldContainer}>
                             
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td> 2 </td>

                                                                    <td>
                                                                        Board resolution of authorised signatory of the existing colonizer
                                                                    </td>
                                                                    <td align="center" size="large">
                                                                       
                                                                        <div className="row">
                               
                               <div className="btn btn-sm col-md-6">
                              <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                    <VisibilityIcon color="info" className="icon" /></IconButton>
                                    </div>
                               <div className="btn btn-sm col-md-6">
                               
                                <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                    <FileDownloadIcon color="info" className="icon" /></IconButton>
                                    </div>
                              </div>
                                                                    </td>
                                                                    <td>
                                                                      
                                                                        <div className={classes.fieldContainer}>
                              
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td> 3 </td>
                                                                    <td> Registered and Irrevocable Agreement</td>
                                                                    <td align="center" size="large">
                                                                      
                                                                        <div className="row">
                               
                               <div className="btn btn-sm col-md-6">
                              <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                    <VisibilityIcon color="info" className="icon" /></IconButton>
                                    </div>
                               <div className="btn btn-sm col-md-6">
                              
                                <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                    <FileDownloadIcon color="info" className="icon" /></IconButton>
                                    </div>
                              </div>
                                                                    </td>
                                                                    <td>
                                                                       
                                                                        <div className={classes.fieldContainer}>
                             
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td> 4 </td>
                                                                    <td>
                                                                        Board resolutions of authorized signatory of
                                                                        firm/company provided technical assistance
                                                                    </td>
                                                                    <td align="center" size="large">
                                                                      
                                                                        <div className="row">
                               
                               <div className="btn btn-sm col-md-6">
                              <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                    <VisibilityIcon color="info" className="icon" /></IconButton>
                                    </div>
                               <div className="btn btn-sm col-md-6">
                                
                                <IconButton onClick={()=>getDocShareholding(item?.boardDoc)}>
                                    <FileDownloadIcon color="info" className="icon" /></IconButton>
                                    </div>
                              </div>
                                                                    </td>
                                                                    <td>
                                                                      
                                                                           <div className={classes.fieldContainer}>
                             
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>{" "}
                                                        </Table>
                                                    </div>
                                          
                                               
                                            </div>
                                        </div>
                                    </div>
                                    </div>
<br></br>
                                    <div className="row">
                                        <div className="col col-4">
                                            <div >
                                                <label htmlFor="licNo">License No.</label>
                                                
                                                   <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={capacityScrutinyInfo?.obtainedLicense?.[0]?.licNo} 
                           
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>
                                            </div>
                                        </div>

                                        <div className="col col-4">
                                            <div >
                                                <label htmlFor="licDate">Date</label>
                                             
                                                   <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={capacityScrutinyInfo?.obtainedLicense?.[0]?.dateOfGrantingLic} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>
                                            </div>
                                        </div>

                                        <div className="col col-4">
                                            <div >
                                                <label htmlFor="licValidity">Validity</label>
                                               
                                                   <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={capacityScrutinyInfo?.obtainedLicense?.[0]?.licValidity} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>
                                            </div>
                                        </div>

                                        <div className="col col-4">
                                            <div c>
                                                <label htmlFor="licValidity">Purpose</label>
                                             
                                                   <div className={classes.fieldContainer}>
                              <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                               placeholder={capacityScrutinyInfo?.obtainedLicense?.[0]?.purpose} 
                               disabled></Form.Control>
                               &nbsp;&nbsp;
                               <ReportProblemIcon
                  style={{
                     display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                    color: fieldIconColors.caution1
                  }}
                  onClick={() => {
                    setOpennedModal("caution1")
                    setLabelValue("Whether the Developer/ group company has earlier been granted permission to set up a colony under HDRU Act, 1975"),
                      setSmShow(true),
                      console.log("modal open"),
                      setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution1: null);
                  }}
                ></ReportProblemIcon>
            </div>

                                            </div>
                                        </div>
                                    </div>
</div>
                            )}

                        </div> */}


              {/* <div className="hl"></div>
              <p>(v) Whether any technical expert(s) engaged   &nbsp;&nbsp;&nbsp;
                <div className="d-flex flex-row align-items-center ml-2">
                  <input type="radio" value="Yes"  className="mx-2 mt-1" checked={capacityScrutinyInfo?.technicalExpert === "Y" ? true : false} disabled />
                  <label className="m-0  mx-1" for="Yes">Yes</label>
                  <input type="radio" value="No"  className="mx-2 mt-1" checked={capacityScrutinyInfo?.technicalExpert === "N" ? true : false} disabled />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                    style={{
                       display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                      color: fieldIconColors.caution3
                    }}
                    onClick={() => {
                      setOpennedModal("caution3")
                    setLabelValue("Whether any technical expert(s) engaged"),
                    setSmShow(true),
                    console.log("modal open"),
                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution3: null);
                    }}
                  ></ReportProblemIcon>
                </div>
              </p>
              <br></br>
              <div>
           

                {capacityScrutinyInfo?.technicalExpert === "Y" && (
                <div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="table-bd">
                        <Table className="table table-bordered">
                          <thead>
                            <tr>
                              <th class="fw-normal">S.No</th>
                              <th class="fw-normal">Professional </th>
                              <th class="fw-normal">Qualification</th>
                              <th class="fw-normal">Signature</th>
                              <th class="fw-normal">Annexure</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>
                                <input
                                  type="text"
                                  
                                  placeholder={capacityScrutinyInfo?.technicalExpertEngaged[0]?.engineerName}
                                  class="employee-card-input"
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  
                                  placeholder={capacityScrutinyInfo?.technicalExpertEngaged[0]?.engineerQualification}
                                  class="employee-card-input"
                                  disabled
                                />
                              </td>

                              <td>
                                <div className="row">
                                
                                
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.engineerSign)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                              
                                    </div>
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.engineerSign)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </div>
                              </td>
                              <td align="center" size="large">
                              <ReportProblemIcon
                    style={{
                       display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                      color: fieldIconColors.caution3
                    }}
                    onClick={() => {
                      setOpennedModal("caution3")
                    setLabelValue("Whether any technical expert(s) engaged"),
                    setSmShow(true),
                    console.log("modal open"),
                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution3: null);
                    }}
                  ></ReportProblemIcon>
                              </td>
                            </tr>

                            <tr>
                              <td>2</td>
                              <td>
                                <input
                                  type="text"
                                 
                                  placeholder={capacityScrutinyInfo?.technicalExpertEngaged[0]?.architectName}
                                  class="employee-card-input"
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                               
                                  placeholder={capacityScrutinyInfo?.technicalExpertEngaged[0]?.architectQualification}
                                  class="employee-card-input"
                                  disabled
                                />
                              </td>

                              <td>
                                <div className="row">
                                 
                                   
                                 <div className="btn btn-sm col-md-6">
                                   <IconButton onClick={()=>getDocShareholding(item?.architectSign)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                      </div>
                                 <div className="btn btn-sm col-md-6">
                                
                                  <IconButton onClick={()=>getDocShareholding(item?.architectSign)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </div>
                              </td>
                              <td align="center" size="large">
                              <ReportProblemIcon
                    style={{
                       display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                      color: fieldIconColors.caution3
                    }}
                    onClick={() => {
                      setOpennedModal("caution3")
                    setLabelValue("Whether any technical expert(s) engaged"),
                    setSmShow(true),
                    console.log("modal open"),
                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution3: null);
                    }}
                  ></ReportProblemIcon>
                              </td>
                            </tr>

                            <tr>
                              <td>3</td>
                              <td>
                                <input
                                  type="text"
                                 
                                  placeholder={capacityScrutinyInfo?.technicalExpertEngaged[0]?.townPlannerName}
                                  class="employee-card-input"
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                 
                                  placeholder={capacityScrutinyInfo?.technicalExpertEngaged[0]?.townPlannerQualification}
                                  class="employee-card-input"
                                  disabled
                                />
                              </td>
                        
                              <td>
                                <div className="row">
                                
                                   
                                 <div className="btn btn-sm col-md-6">
                                      <IconButton onClick={()=>getDocShareholding(item?.townPlannerSign)}>
                                      <VisibilityIcon color="info" className="icon" /></IconButton>
                                      </div>
                                 
                                  
                                 
                                 
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.townPlannerSign)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </div>
                              </td>
                              <td align="center" size="large">
                              <ReportProblemIcon
                    style={{
                       display: hideRemarks && hideRemarksPatwari && showReportProblemIcon("X:Longitude") ? "block" : "none",
                      color: fieldIconColors.caution3
                    }}
                    onClick={() => {
                      setOpennedModal("caution3")
                    setLabelValue("Whether any technical expert(s) engaged"),
                    setSmShow(true),
                    console.log("modal open"),
                    setFieldValue(capacityScrutinyInfo !== null ? capacityScrutinyInfo?.caution3: null);
                    }}
                  ></ReportProblemIcon>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
               )} 
                {showhide1 === "No" && (
                  <div className="row ">
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <div className="table-bd">
                          <Table className="table table-bordered" size="sm">
                            <thead>
                              <tr>
                                <th>S.No.</th>
                                <th>Professional </th>
                                <th> Annexure</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td> 1 &nbsp;&nbsp;</td>
                                <td>Agreement with existing colonizer/developer who has already developed a colony</td>
                                <td align="center" size="large">
                             
                                 <div className="btn btn-sm col-md-6"></div>
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.existingDeveloperAgreementDoc)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </td>
                              </tr>
                              <tr>
                                <td> 2&nbsp;&nbsp; </td>
                                <td>
                                  <input
                                    type="text"
                                    onChange={(e) => setTechnicalCapacity(e.target.value)}
                                    placeholder="Technical Capacity"
                                    class="employee-card-input"
                                  />
                                </td>
                                <td align="center" size="large">
                             
                                 <div className="btn btn-sm col-md-6"></div>
                                    
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.technicalCapacityDoc)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </td>
                              </tr>
                              <tr>
                                <td> 3 &nbsp;&nbsp;</td>
                              
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Name of Engineer"
                                    onChange={(e) => setengineerNameN(e.target.value)}
                                    class="employee-card-input"
                                  />
                                </td>
                                <td align="center" size="large">
                                 
                                 <div className="btn btn-sm col-md-6">
                                  </div>
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.engineerDocN)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </td>
                              </tr>
                              <tr>
                                <td> 4&nbsp;&nbsp; </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Name of Architect"
                                    onChange={(e) => setArchitectNameN(e.target.value)}
                                    class="employee-card-input"
                                  />
                                </td>
                                <td align="center" size="large">
                              
                                 <div className="btn btn-sm col-md-6">
                                  </div>
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.architectDocN)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </td>
                              </tr>
                              <tr>
                                <td> 5&nbsp;&nbsp; </td>
                                <td>Upload SPA/GPA/ Board Resolution to sign collaboration agreement on behalf of land owner(s)</td>
                                <td align="center" size="large">
                                  <div className="btn btn-sm col-md-6">
                                  </div>
                                 <div className="btn btn-sm col-md-6">
                                  <IconButton onClick={()=>getDocShareholding(item?.architectNameN)}>
                                      <FileDownloadIcon color="info" className="icon" /></IconButton>
                                      </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div> */}


            </div>
          </FormStep>
        </div>
      </Collapse>
    </div>
  );
};
export default CapacityScrutiny;