import React, { Fragment, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";


import Collapse from "react-bootstrap/Collapse";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "./css/personalInfoChild.style";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "./ScrutinyDevelopment/docview.helper";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import CusToaster from "../../../components/Toaster";
import ApplicationPurpose from "../AdditionalDocument/ApplicationPurpose";
import ApplicantInfo from "../AdditionalDocument/ApplicantInfo";
import Developerinfo from "./Developerinfo";

const Genarelinfo = (props) => {
  // useTranslation
  // const developerInfoRef = useRef();
  const { t } = useTranslation();
  const { pathname: url } = useLocation();
  const [showhide1, setShowhide1] = useState("No");
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  const [docModal, setDocModal] = useState(false);


  const [loader, setLoader] = useState(false);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  // const [fieldValue, setFieldValue] = useState("");
  // let user = Digit.UserService.getUser();
  // const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  // const hideRemarks = userRoles.some((item)=>item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
  // const hideRemarksPatwari = userRoles.some((item)=>item ==="Patwari_HQ")
  // const hideRemarksJE = userRoles.some((item)=>item ==="JE_HQ" || item === "JE_HR")
  const applicationStatus = props.applicationStatus;
  const additionalDocResponData = props.additionalDocRespon;
  let user = Digit.UserService.getUser();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const userRolesArray = userInfo?.roles.filter((user) => user.code !== "EMPLOYEE");
  const filterDataRole = userRolesArray?.[0]?.code;
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];


  console.log("rolelogintime", userRoles);
  console.log("afterfilter12", filterDataRole)

  const mDMSData = props.mDMSData;
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
  console.log("happyDateHIDE2", hideRemarksPatwari, showReportProblemIcon("Purpose of colony"), hideRemarks);
  const genarelinfo = props.genarelinfo;
  // const applicationStatus = props.applicationStatus;
  const dataIcons = props.dataForIcons;


  const applicantInfoPersonal = props.ApiResponseData;
  console.log("personal info applicant data1", applicantInfoPersonal);

  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  const [showhide2, setShowhide2] = useState("No");
  const [open, setOpen] = useState(false);

  const handleshow2 = (e) => {
    const getshow = e.target.value;
    setShowhide2(getshow);
  };
  const [purpose, setPurpose] = useState("");
  const handleChangesetPurpose = (e) => {
    setPurpose(e.target.value);
    localStorage.setItem("Purpose", e.target.value);
    props.passUncheckedList({ data: uncheckedValue, purpose: e?.target?.value });
  };
  const [totalArea, setTotalArea] = useState("");
  const handleChangesetTotalArea = (e) => {
    setTotalArea(e.target.value);
    localStorage.setItem("TotalArea", e.target.value);
    props.passUncheckedList({ data: uncheckedValue, totalArea: e?.target?.value });
  };

  const [form, setForm] = useState([]);
  const [open2, setOpen2] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [showhide, setShowhide] = useState("No");

  // const [purpose, setPurpose] = useState("");
  // const handleChangesetPurpose = (e) => {
  //   setPurpose(e.target.value);
  //   localStorage.setItem("Purpose", e.target.value);
  // };

  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");

  const [smShow2, setSmShow2] = useState(false);
  const [smShow3, setSmShow3] = useState(false);

  const [color, setColor] = useState({ yes: false, no: false });

  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);



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

  // const developerInputFiledColor = uncheckedValue.filter((obj) => {
  //   return obj.label === "Purpose Of License";
  // });
  // const developerInputCheckedFiledColor = checkValue.filter((obj) => {
  //   return obj.label === "Purpose Of License";
  // });
  // console.log("color from array", developerInputFiledColor);

  // const developerInputFiledColor1 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Potential Zone";
  // });
  // const developerInputCheckedFiledColor1 = checkValue.filter((obj) => {
  //   return obj.label === "Potential Zone";
  // });
  // const developerInputFiledColor2 = uncheckedValue.filter((obj) => {
  //   return obj.label === "district";
  // });
  // const developerInputCheckedFiledColor2 = checkValue.filter((obj) => {
  //   return obj.label === "district";
  // });
  // const developerInputFiledColor3 = uncheckedValue.filter((obj) => {
  //   return obj.label === "State";
  // });
  // const developerInputCheckedFiledColor3 = checkValue.filter((obj) => {
  //   return obj.label === "State";
  // });
  // const developerInputFiledColor4 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Tehsil";
  // });
  // const developerInputCheckedFiledColor4 = checkValue.filter((obj) => {
  //   return obj.label === "Tehsil";
  // });
  // const developerInputFiledColor5 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Revenue estate";
  // });
  // const developerInputCheckedFiledColor5 = checkValue.filter((obj) => {
  //   return obj.label === "Revenue estate";
  // });
  // const developerInputFiledColor6 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Rectangle No.";
  // });
  // const developerInputCheckedFiledColor6 = checkValue.filter((obj) => {
  //   return obj.label === "Rectangle No.";
  // });
  // const developerInputFiledColor7 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Killa";
  // });
  // const developerInputCheckedFiledColor7 = checkValue.filter((obj) => {
  //   return obj.label === "Killa";
  // });
  // const developerInputFiledColor8 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Land owner";
  // });
  // const developerInputCheckedFiledColor8 = checkValue.filter((obj) => {
  //   return obj.label === "Land owner";
  // });

  // const developerInputFiledColor10 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Consolidation Type";
  // });
  // const developerInputCheckedFiledColor10 = checkValue.filter((obj) => {
  //   return obj.label === "Consolidation Type";
  // });
  // const developerInputFiledColor11 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Kanal/Bigha";
  // });
  // const developerInputCheckedFiledColor11 = checkValue.filter((obj) => {
  //   return obj.label === "Kanal/Bigha";
  // });
  // const developerInputFiledColor12 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Marla/Biswa";
  // });
  // const developerInputCheckedFiledColor12 = checkValue.filter((obj) => {
  //   return obj.label === "Marla/Biswa";
  // });
  // const developerInputFiledColor13 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Khewat";
  // });
  // const developerInputCheckedFiledColor13 = checkValue.filter((obj) => {
  //   return obj.label === "Khewat";
  // });

  // console.log("color for the deeloper", developerInputFiledColor);
  console.log("AccessInfortech1", purpose);
  console.log("AccessInfortech12", totalArea);


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
    purpose: Colors.info,
    potential: Colors.info,
    district: Colors.info,
    developmentPlan: Colors.info,
    state: Colors.info,
    tehsil: Colors.info,
    revenue: Colors.info,
    rectangle: Colors.info,
    rectangleNo: Colors.info,
    rectaNo: Colors.info,
    killa: Colors.info,
    landOwner: Colors.info,
    typeLand: Colors.info,
    isChange: Colors.info,
    consolidationType: Colors.info,
    kanal: Colors.info,
    marla: Colors.info,
    sarsai: Colors.info,
    bigha: Colors.info,
    biswa: Colors.info,
    biswansi: Colors.info,
    collabrationAgreement: Colors.info,
    developerCompany: Colors.info,
    dateOfRegistering: Colors.info,
    dateOfValidity: Colors.info,
    agreementIrrevocialble: Colors.info,
    nameOfAuthSignatory: Colors.info,
    nameOfAuthSignatoryDeveloper: Colors.info,
    registeringAuthority: Colors.info,
    hadbastNo: Colors.info,
    sector: Colors.info,
    editRectangleNo: Colors.info,
    editKhewats: Colors.info,
    landOwnerRegistry: Colors.info,
    collaboration: Colors.info,
    agreementValidFrom: Colors.info,
    authSignature: Colors.info,
    nameAuthSign: Colors.info,
    registeringAuthorityDoc: Colors.info,
    consolidatedTotal: color.info,
    nonConsolidatedTotal: color.info,

  })

  const fieldIdList = [
    { label: "NWL_APPLICANT_PURPOSE_OF_LICENCE", key: "purpose" },
    { label: "NWL_APPLICANT_DISTRICT_LAND_SCHEDULE", key: "district" },
    { label: "State", key: "state" },
    { label: "Development Plan", key: "developmentPlan" },
    { label: "NWL_APPLICANT_ZONE_LAND_SCHEDULE", key: "potential" },
    { label: "NWL_APPLICANT_SECTOR_LAND_SCHEDULE", key: "sector" },
    { label: "NWL_APPLICANT_TEHSIL_LAND_SCHEDULE", key: "tehsil" },
    { label: "NWL_APPLICANT_REVENUE_ESTATE_LAND_SCHEDULE", key: "revenue" },
    { label: "NWL_APPLICANT_RECTANGLE_NUMBER_LAND_SCHEDULE", key: "rectangleNo" },
    { label: "Killa", key: "killa" },
    { label: "NWL_APPLICANT_TOTAL_AREA_LAND_SCHEDULE", key: "consolidatedTotal" },
    { label: "NWL_APPLICANT_TOTAL_AREA_NON_LAND_SCHEDULE", key: "nonConsolidatedTotal" },
    { label: "NWL_APPLICANT_NAME_OF_LAND_OWNER_LAND_SCHEDULE", key: "landOwner" },
    { label: "NWL_APPLICANT_CONSLIDATION_TYPE_LAND_SCHEDULE", key: "consolidationType" },
    { label: "NWL_APPLICANT_TYPE_OF_LAND_SCHEDULE", key: "typeLand" },
    { label: "NWL_APPLICANT_RECTANGLE_NO_MUSTIL_LAND_SCHEDULE", key: "editRectangleNo" },
    { label: "NWL_APPLICANT_KHEWATS_NUMBER_CHANGED_LAND_SCHEDULE", key: "editKhewats" },
    { label: "NWL_APPLICANT_NAME_OF_THE_LAND_OWNER_AS_PER_MUTATION_LAND_SCHEDULE", key: "landOwnerRegistry" },
    { label: "NWL_APPLICANT_DEVELOPED_IN_COLLABORATION_LAND_SCHEDULE", key: "collaboration" },
    { label: "NWL_APPLICANT_CHANGE_IN_INFORMATION_LAND_SCHEDULE", key: "isChange" },
    { label: "NWL_APPLICANT_KANAL_LAND_SCHEDULE", key: "kanal" },
    { label: "NWL_APPLICANT_KHEWATS_NUMBER_LAND_SCHEDULE", key: "rectaNo" },
    { label: "NWL_APPLICANT_MARLA_LAND_SCHEDULE", key: "marla" },
    { label: "NWL_APPLICANT_SARSAI_LAND_SCHEDULE", key: "sarsai" },
    { label: "NWL_APPLICANT_BIGHA_LAND_SCHEDULE", key: "bigha" },
    { label: "NWL_APPLICANT_BISWA_LAND_SCHEDULE", key: "biswa" },
    { label: "NWL_APPLICANT_BISWANSI_LAND_SCHEDULE", key: "biswansi" },
    { label: "Collaboration Agreement", key: "collabrationAgreement" },
    { label: "NWL_APPLICANT_NAME_OF_THE_DEVELOPER_COMPANY_LAND_SCHEDULE", key: "developerCompany" },
    { label: "NWL_APPLICANT_DATA_OF_REGISTERING_COLLOABORATION_AGREEMENT_LAND_SCHEDULE", key: "agreementValidFrom" },
    { label: "Date of Registering", key: "dateOfRegistering" },
    { label: "NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_LAND_OWNER", key: "authSignature" },
    { label: "NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_DEVELOPER", key: "nameAuthSign" },
    { label: "Date of Validity", key: "dateOfValidity" },
    { label: "NWL_APPLICANT_REGISTERING_AUTHORITY_DOCUMENT_LAND_SCHEDULE", key: "registeringAuthorityDoc" },
    { label: "NWL_APPLICANT_WHETER_COLLABORATION_AGREEMENT_IRREVOCABLE_LAND_SCHEDULE", key: "agreementIrrevocialble" },
    { label: "Name of Authorized Signatory Developer", key: "nameOfAuthSignatory" },
    { label: "Name of Authorized Signatory Developer", key: "nameOfAuthSignatoryDeveloper" },
    { label: "NWL_APPLICANT_REGISTERING_AUTHORITY_LAND_SCHEDULE", key: "registeringAuthority" },
    { label: "NWL_APPLICANT_HADBAST_NUMBER_LAND_SCHEDULE", key: "hadbastNo" }];


  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons?.egScrutiny?.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved === "In Order" ? Colors.approved : fieldPresent[0].isApproved === "Not In Order" ? Colors.disapproved : fieldPresent[0].isApproved === "conditional" ? Colors.conditional : Colors.info }

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
      const fieldPresent = dataIcons?.egScrutiny?.filter(ele => (ele.fieldIdL === labelValue));
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
    <Form ref={props.generalInfoRef} t={t}>
      <ModalChild
        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        disPlayDoc={docModal}
        onClose={() => setSmShow(false)}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
        applicationStatus={applicationStatus}
      ></ModalChild>
      {/* <div
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
        <span style={{ color: "#817f7f" }} className="">
          Application Purpose
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text"> */}



      <div>
        <ApplicationPurpose
          additionalDocRespon={additionalDocResponData}

        />

      </div>

      {/* } */}





      <Form.Group className="justify-content-center" controlId="formBasicEmail" style={{ border: "2px solid #e9ecef", margin: 10, padding: 20 }}>





        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3" className={classes.formLabel}>
            {/* <Form.Label>
               
                  <h5 >
                    Purpose Of Licence  <span style={{ color: "red" }}>*</span>
                  </h5>
                </Form.Label> */}
            <label className="card-title fw-bold" style={{ margin: 10 }} htmlFor="Developer Details">
              {`${t("NWL_APPLICANT_PURPOSE_OF_LICENCE")}`}
              <span class="text-danger font-weight-bold mx-2">*</span>
            </label>

            <div className="d-flex flex-row  align-items-center">
              <Form.Control
                type="text"
                placeholder={applicantInfoPersonal !== null ? applicantInfoPersonal?.purpose : null}

                // height={30}
                // style={{ maxWidth: 200, marginRight: 5 }}
                disabled
              >

              </Form.Control>
              {/* {JSON.stringify(userRoles)}
                    {JSON.stringify(hideRemarks)} */}
              {/*  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none", */}
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",

                  color: fieldIconColors.purpose
                }}
                onClick={() => {
                  setOpennedModal("purpose")
                  setLabelValue("NWL_APPLICANT_PURPOSE_OF_LICENCE"),
                    setSmShow(true),
                    setDocModal(false),
                    console.log("modal open"),
                    setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.purpose : null);
                }}
              ></ReportProblemIcon>
              {/* <ModalChild
                    labelmodal={labelValue}
                    passmodalData={handlemodaldData}
                    isYesorNoChecked={handleYesOrNochecked}
                    displaymodal={smShow}
                  ></ModalChild> */}
              {/* <ModalChild
                    labelmodal={labelValue}
                    passmodalData={handlemodaldData}
                    isYesorNoChecked={handleYesOrNochecked}
                    displaymodal={smShow}
                    setColor={setColor}
                    // fieldValue={labelValue}
                    fieldValue={fieldValue}
                  // remarksUpdate={currentRemarks}
                  ></ModalChild> */}
            </div>
          </Col>
          {/* <div className="col col-3">
                <label htmlFor="potential">
                  <h5 className={classes.formLabel}>
                    Potential Zone:<span style={{ color: "red" }}>*</span>
                  </h5>
                </label>
                  
                <div className="d-flex flex-row  align-items-center">
                  <Form.Control
                    height={30}
                    style={{ maxWidth: 200, marginRight: 5 }}
                    placeholder={applicantInfoPersonal !== null ? applicantInfoPersonal?.potential : null}
                    className="form-control"
                    id="potential"
                    name="potential"
                    disabled
                  >
                    
                  </Form.Control>
                
                  <ReportProblemIcon
                    style={{
                       display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",
                
                      color: fieldIconColors.potential
                    }}
                    onClick={() => {
                      setLabelValue("Potential Zone"),
                      setOpennedModal("potential")
                        setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.potential : null);
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <h5 className={classes.formLabel}>
                      District:  <span style={{ color: "red" }}>*</span>
                    </h5>
                   
                  </Form.Label>
                  
                </div>
                <div>
                  <div className="d-flex flex-row  align-items-center">
                    <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      placeholder={applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null}
                      disabled
                    >
                 
                    </Form.Control>
                    <ReportProblemIcon
                      style={{
                         display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",

                        color: fieldIconColors.district
                      }}
                      onClick={() => {
                        setLabelValue("District"),
                        setOpennedModal("district")
                          setSmShow(true),
                        setDocModal(false),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <h5 className={classes.formLabel}>
                      State  <span style={{ color: "red" }}>*</span>
                    </h5>
                  
                  </Form.Label>
                      
                </div>
                <div>
                  <div className="d-flex flex-row  align-items-center">
                    <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      placeholder={applicantInfoPersonal !== null ? applicantInfoPersonal?.state : null}
                      disabled
                    ></Form.Control>
                    <ReportProblemIcon
                      style={{
                         display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",
                      
                        color: fieldIconColors.state
                      }}
                      onClick={() => {
                        setLabelValue("State"),
                        setOpennedModal("state")
                          setSmShow(true),
                        setDocModal(false),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.state : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>
               
              </Col> */}
        </Row>

        <div className="ml-auto" style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 24 }}> Land schedule</h2>
          <p className="ml-3 mt-1">


            Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development agreements/ Memorandum of Understanding etc. and similar agreements registered with competent authority.
          </p>
          <p className="ml-3 mt-1">
            <b>(i) Khasra-wise information to be provided in the following format</b>
          </p>
        </div>
        <br></br>

        <div style={{ overflow: "scroll" }}>
          <table className="table table-bordered">
            <thead>

              <tr className="border-bottom-0">
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* <label  className="card-title fw-bold" style={{ margin: 10 }} htmlFor="Developer Details">
                            {`${t("NWL_APPLICANT_PURPOSE_OF_LICENCE")}`}
                            <span class="text-danger font-weight-bold mx-2">*</span>
                          </label> */}
                  {/* &nsp; &nsp; &nsp; */}
                  {`${t("NWL_APPLICANT_DISTRICT_LAND_SCHEDULE")}`}
                  {/* District    */}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Development Plan    */}
                  {`${t("NWL_APPLICANT_DEVELOPMENT_PLAN_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Zone     */}
                  {/* &nsp; &nsp; &nsp;&nsp; &nsp; &nsp; */}
                  {`${t("NWL_APPLICANT_ZONE_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Sector    */}
                  {`${t("NWL_APPLICANT_SECTOR_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Tehsil     */}
                  {/* &nsp; &nsp; &nsp;&nsp; &nsp; &nsp; */}
                  {`${t("NWL_APPLICANT_TEHSIL_LAND_SCHEDULE")}`}

                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Revenue Estate    */}
                  {/* &nsp; &nsp; &nsp;&nsp; &nsp; &nsp;&nsp; &nsp; &nsp; */}
                  {`${t("NWL_APPLICANT_REVENUE_ESTATE_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Hadbast No.  */}
                  {`${t("NWL_APPLICANT_HADBAST_NUMBER_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Rectangle No.   */}
                  {`${t("NWL_APPLICANT_RECTANGLE_NUMBER_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Khasra No. */}
                  {/* khewats No */}
                  {`${t("NWL_APPLICANT_KHASRA_NUMBER_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Name of Land Owner */}
                  {`${t("NWL_APPLICANT_NAME_OF_LAND_OWNER_LAND_SCHEDULE")}`}

                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Type of land */}
                  {`${t("NWL_APPLICANT_TYPE_OF_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* change in information */}
                  {`${t("NWL_APPLICANT_CHANGE_IN_INFORMATION_LAND_SCHEDULE")}`}
                </th>

                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Rectangle No./Mustil(Changed) */}
                  {`${t("NWL_APPLICANT_RECTANGLE_NO_MUSTIL_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* khewats No(Changed) */}
                  {`${t("NWL_APPLICANT_KHEWATS_NUMBER_CHANGED_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Name of the Land Ower as per Mutation/Jamabandi */}
                  {`${t("NWL_APPLICANT_NAME_OF_THE_LAND_OWNER_AS_PER_MUTATION_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Whether Khasra been developed in collaboration   */}
                  {`${t("NWL_APPLICANT_DEVELOPED_IN_COLLABORATION_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Name of the developer company */}
                  {`${t("NWL_APPLICANT_NAME_OF_THE_DEVELOPER_COMPANY_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Date of registering collaboration agreement  */}
                  {`${t("NWL_APPLICANT_DATA_OF_REGISTERING_COLLOABORATION_AGREEMENT_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Whether collaboration agreement irrevocable (Yes/No) */}
                  {`${t("NWL_APPLICANT_WHETER_COLLABORATION_AGREEMENT_IRREVOCABLE_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Name of authorized signatory on behalf of land owner(s) */}
                  {`${t("NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_LAND_OWNER")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Name of authorized signatory on behalf of developer */}
                  {`${t("NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_DEVELOPER")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Registering Authority */}
                  {`${t("NWL_APPLICANT_REGISTERING_AUTHORITY_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Registering Authority document */}
                  {`${t("NWL_APPLICANT_REGISTERING_AUTHORITY_DOCUMENT_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Consolidation Type   */}
                  {`${t("NWL_APPLICANT_CONSLIDATION_TYPE_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Kanal  */}
                  {`${t("NWL_APPLICANT_KANAL_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Marla   */}
                  {`${t("NWL_APPLICANT_MARLA_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Sarsai */}
                  {`${t("NWL_APPLICANT_SARSAI_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Bigha  */}
                  {`${t("NWL_APPLICANT_BIGHA_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Biswa  */}
                  {`${t("NWL_APPLICANT_BISWA_LAND_SCHEDULE")}`}
                </th>

                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Biswansi  */}
                  {`${t("NWL_APPLICANT_BISWANSI_LAND_SCHEDULE")}`}
                </th>
                <th class="fw-normal pb-0 border-bottom-0 align-top">
                  {/* Total Area */}
                  {`${t("NWL_APPLICANT_TOTAL_AREA_LAND_SCHEDULE")}`}
                </th>
                {/* <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Action Remarks

                    </th> */}

              </tr>
              <tr className="border-top-0">
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DISTRICT_LAND_SCHEDULE") ? "block" : "none",

                      color: fieldIconColors.district
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_DISTRICT_LAND_SCHEDULE"),
                        setOpennedModal("district")
                      setSmShow(true),
                        setDocModal(false),

                        console.log("modal open"),
                        // setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null);
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.district?.label : null);
                    }}
                  // {item?.district?.label} 
                  ></ReportProblemIcon></th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DEVELOPMENT_PLAN_LAND_SCHEDULE") ? "block" : "none",

                      color: fieldIconColors.developmentPlan
                    }}
                    onClick={() => {
                      setLabelValue("Development Plan"),
                        setOpennedModal("developmentPlan")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        // setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null);
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.developmentPlan?.label : null);
                    }}
                  ></ReportProblemIcon></th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_ZONE_LAND_SCHEDULE") ? "block" : "none",

                      color: fieldIconColors.potential
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_ZONE_LAND_SCHEDULE"),
                        setOpennedModal("potential")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        // setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.potential : null);
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.potential : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{

                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_SECTOR_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.sector
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_SECTOR_LAND_SCHEDULE"),
                        setOpennedModal("sector")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.sector : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{

                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_TEHSIL_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.tehsil
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_TEHSIL_LAND_SCHEDULE"),
                        setOpennedModal("tehsil")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.tehsil?.label : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_REVENUE_ESTATE_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.revenue
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_REVENUE_ESTATE_LAND_SCHEDULE"),
                        setOpennedModal("revenue")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.revenueEstate?.label : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_HADBAST_NUMBER_LAND_SCHEDULE") ? "block" : "none",

                      color: fieldIconColors.hadbastNo
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_HADBAST_NUMBER_LAND_SCHEDULE"),
                        setOpennedModal("hadbastNo")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.hadbastNo : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      //  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_RECTANGLE_NUMBER_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.rectangleNo
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_RECTANGLE_NUMBER_LAND_SCHEDULE"),
                        setOpennedModal("rectangleNo")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.rectangleNo : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_KHEWATS_NUMBER_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.rectaNo
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_KHEWATS_NUMBER_LAND_SCHEDULE"),
                        setOpennedModal("rectaNo")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.khewats : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_NAME_OF_LAND_OWNER_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.landOwner
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_NAME_OF_LAND_OWNER_LAND_SCHEDULE"),
                        setOpennedModal("landOwner")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.landOwner : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      //  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",
                      // display: hideRemarksPatwari?"none":"block",
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_TYPE_OF_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.typeLand
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_TYPE_OF_LAND_SCHEDULE"),
                        setOpennedModal("typeLand")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.typeLand?.label : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      //  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",
                      // display: hideRemarksPatwari?"none":"block",
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_CHANGE_IN_INFORMATION_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.isChange
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_CHANGE_IN_INFORMATION_LAND_SCHEDULE"),
                        setOpennedModal("isChange")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.isChange : null);
                    }}
                  ></ReportProblemIcon>
                </th>

                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      //  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",
                      // display: hideRemarksPatwari?"none":"block",
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_RECTANGLE_NO_MUSTIL_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.editRectangleNo
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_RECTANGLE_NO_MUSTIL_LAND_SCHEDULE"),
                        setOpennedModal("editRectangleNo")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.editRectangleNo : null);
                    }}
                  ></ReportProblemIcon>
                </th>



                <th class="fw-normal py-0 border-top-0">
                  {" "}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_KHEWATS_NUMBER_CHANGED_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.editKhewats
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_KHEWATS_NUMBER_CHANGED_LAND_SCHEDULE"),
                        setOpennedModal("editKhewats")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.editKhewats : null);
                    }}
                  ></ReportProblemIcon>
                </th>

                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{

                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_NAME_OF_THE_LAND_OWNER_AS_PER_MUTATION_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.landOwnerRegistry
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_NAME_OF_THE_LAND_OWNER_AS_PER_MUTATION_LAND_SCHEDULE"),
                        setOpennedModal("landOwnerRegistry")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.landOwnerRegistry : null);
                    }}
                  ></ReportProblemIcon>
                </th>


                <th class="fw-normal py-0 border-top-0">
                  {" "}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DEVELOPED_IN_COLLABORATION_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.collaboration
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_DEVELOPED_IN_COLLABORATION_LAND_SCHEDULE"),
                        setOpennedModal("collaboration")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.collaboration : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  {" "}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_NAME_OF_THE_DEVELOPER_COMPANY_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.developerCompany
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_NAME_OF_THE_DEVELOPER_COMPANY_LAND_SCHEDULE"),
                        setOpennedModal("developerCompany")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.developerCompany : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  {" "}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DATA_OF_REGISTERING_COLLOABORATION_AGREEMENT_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.agreementValidFrom
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_DATA_OF_REGISTERING_COLLOABORATION_AGREEMENT_LAND_SCHEDULE"),
                        setOpennedModal("agreementValidFrom")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.agreementValidFrom : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  {" "}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_WHETER_COLLABORATION_AGREEMENT_IRREVOCABLE_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.agreementIrrevocialble
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_WHETER_COLLABORATION_AGREEMENT_IRREVOCABLE_LAND_SCHEDULE"),
                        setOpennedModal("agreementIrrevocialble")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.agreementIrrevocialble : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  {" "}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_LAND_OWNER") ? "block" : "none",
                      color: fieldIconColors.authSignature
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_LAND_OWNER"),
                        setOpennedModal("authSignature")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.authSignature : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  {" "}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_DEVELOPER") ? "block" : "none",
                      color: fieldIconColors.nameAuthSign
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_NAME_OF_AUTHORIZED_SIGNATORY_ON_BEHALF_OF_DEVELOPERr"),
                        setOpennedModal("nameAuthSign")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.nameAuthSign : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  {" "}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_REGISTERING_AUTHORITY_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.registeringAuthority
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_REGISTERING_AUTHORITY_LAND_SCHEDULE"),
                        setOpennedModal("registeringAuthority")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.registeringAuthority : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      //  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PURPOSE_OF_LICENCE") ? "block" : "none",
                      // display: hideRemarksPatwari?"none":"block",
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_REGISTERING_AUTHORITY_DOCUMENT_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.registeringAuthorityDoc
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_REGISTERING_AUTHORITY_DOCUMENT_LAND_SCHEDULE"),
                        setOpennedModal("registeringAuthorityDoc")
                      setSmShow(true),
                        setDocModal(true),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.registeringAuthorityDoc : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_CONSLIDATION_TYPE_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.consolidationType
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_CONSLIDATION_TYPE_LAND_SCHEDULE"),
                        setOpennedModal("consolidationType")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.consolidationType : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_KANAL_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.kanal
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_KANAL_LAND_SCHEDULE"),
                        setOpennedModal("kanal")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.kanal : null);
                    }}
                  ></ReportProblemIcon>

                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_MARLA_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.marla
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_MARLA_LAND_SCHEDULE"),
                        setOpennedModal("marla")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.marla : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_SARSAI_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.sarsai
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_SARSAI_LAND_SCHEDULE"),
                        setOpennedModal("sarsai")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.sarsai : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_BIGHA_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.bigha
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_BIGHA_LAND_SCHEDULE"),
                        setOpennedModal("bigha")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.bigha : null);
                    }}
                  ></ReportProblemIcon>

                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_BISWA_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.biswa
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_BISWA_LAND_SCHEDULE"),
                        setOpennedModal("biswa")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.biswa : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                <th class="fw-normal py-0 border-top-0">
                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_BISWANSI_LAND_SCHEDULE") ? "block" : "none",
                      color: fieldIconColors.biswansi
                    }}
                    onClick={() => {
                      setLabelValue("NWL_APPLICANT_BISWANSI_LAND_SCHEDULE"),
                        setOpennedModal("biswansi")
                      setSmShow(true),
                        setDocModal(false),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.biswansi : null);
                    }}
                  ></ReportProblemIcon>
                </th>
                {applicantInfoPersonal?.AppliedLandDetails[0]?.consolidationType == "consolidated" &&
                  <th class="fw-normal py-0 border-top-0">
                    <ReportProblemIcon
                      style={{

                        display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_TOTAL_AREA_LAND_SCHEDULE") ? "block" : "none",
                        color: fieldIconColors.consolidatedTotal
                      }}
                      onClick={() => {
                        setLabelValue("NWL_APPLICANT_TOTAL_AREA_LAND_SCHEDULE"),
                          setOpennedModal("consolidatedTotal")
                        setSmShow(true),
                          setDocModal(false),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.consolidatedTotal : null);
                      }}
                    ></ReportProblemIcon>
                  </th>
                }
                {applicantInfoPersonal?.AppliedLandDetails[0]?.consolidationType == "non-consolidated" &&
                  <th class="fw-normal py-0 border-top-0">
                    <ReportProblemIcon
                      style={{

                        display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_TOTAL_AREA_NON_LAND_SCHEDULE") ? "block" : "none",
                        color: fieldIconColors.nonConsolidatedTotal
                      }}
                      onClick={() => {
                        setLabelValue("NWL_APPLICANT_TOTAL_AREA_NON_LAND_SCHEDULE"),
                          setOpennedModal("nonConsolidatedTotal")
                        setSmShow(true),
                          setDocModal(false),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.nonConsolidatedTotal : null);
                      }}
                    ></ReportProblemIcon>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              {
                applicantInfoPersonal?.AppliedLandDetails?.map((item, index) => (

                  <tr key={index}>
                    <td>
                      <p className="table-value">
                      {item?.district?.label}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.district?.label} placeholder={item?.district?.label} disabled /> */}
                    </td>
                    <td>
                    <p className="table-value">
                      {item?.developmentPlan?.label}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.developmentPlan?.label} placeholder={item?.developmentPlan?.label} disabled /> */}
                    </td>
                    <td>
                    <p className="table-value">
                      {item?.potential}
                      </p>
                      {/* <input type="text" className="form-control" placeholder={item?.potential} disabled /> */}
                    </td>
                    <td>
                    <p className="table-value">
                      {item?.sector}
                      </p>
                      {/* <input type="text" className="form-control" placeholder={item?.sector} disabled /> */}
                    </td>
                    <td>
                    <p className="table-value">
                      {item?.tehsil?.label}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.tehsil?.label} placeholder={item?.tehsil?.label} disabled /> */}
                    </td>
                    <td>
                    <p className="table-value">
                      {item?.revenueEstate?.label}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.revenueEstate?.label} placeholder={item?.revenueEstate?.label} disabled /> */}
                    </td>
                    <td>
                    <p className="table-value">
                      {item?.hadbastNo}
                      </p>
                      {/* <input type="text" className="form-control" placeholder={item?.hadbastNo} disabled /> */}
                    </td>
                    <td>
                    <p className="table-value">
                      {item?.rectangleNo}
                      </p>
                      {/* <input type="text" className="form-control" placeholder={item?.rectangleNo} disabled /> */}
                    </td>
                    <td>
                    <p className="table-value">
                      {item?.khewats}
                      </p>
                      {/* <input type="text" className="form-control" placeholder={item?.khewats} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.landOwner}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.landOwner} placeholder={item?.landOwner} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.typeLand?.label}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.typeLand?.label} placeholder={item?.typeLand?.label} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.isChange}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.isChange} placeholder="N/A" value={item?.isChange} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.editRectangleNo}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.editRectangleNo} placeholder="N/A" value={item?.editRectangleNo} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.editKhewats}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.editKhewats} placeholder={item?.editKhewats} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.landOwnerRegistry}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.landOwnerRegistry} placeholder={item?.landOwnerRegistry} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.collaboration}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.collaboration} placeholder={item?.collaboration} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.developerCompany}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.developerCompany} placeholder={item?.developerCompany} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.agreementValidFrom}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.agreementValidFrom} placeholder={item?.agreementValidFrom} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.agreementIrrevocialble}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.agreementIrrevocialble} placeholder={item?.agreementIrrevocialble} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.authSignature}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.authSignature} placeholder={item?.authSignature} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.nameAuthSign}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.nameAuthSign} placeholder={item?.nameAuthSign} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.registeringAuthority}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.registeringAuthority} placeholder={item?.registeringAuthority} disabled /> */}
                    </td>
                    <td class="text-center">

                      {
                        item?.registeringAuthorityDoc &&
                        <Fragment>
                          <div className="btn btn-sm col-md-6">

                            <IconButton
                              style={{
                                color: " #1266af",
                                fontSize: " 12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textDecorationLine: "underline",
                              }}
                              onClick={() => {
                                if (item?.registeringAuthorityDoc) getDocShareholding(item?.registeringAuthorityDoc, setLoader);
                                else setShowToastError({ label: "No Document here", error: true, success: false });
                              }}>

                              {/* onClick={()=>getDocShareholding(item?.registeringAuthorityDoc)} */}

                              <Visibility color="info" className="icon" /></IconButton>

                          </div>
                          <div className="btn btn-sm col-md-6">
                            <IconButton
                              style={{
                                color: " #1266af",
                                fontSize: " 12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textDecorationLine: "underline",
                              }}
                              onClick={() => {
                                if (item?.registeringAuthorityDoc) getDocShareholding(item?.registeringAuthorityDoc, setLoader);
                                else setShowToastError({ label: "No Document here", error: true, success: false });
                              }}>
                              {/* <IconButton onClick={()=>getDocShareholding(item?.registeringAuthorityDoc)}> */}
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                          </div>

                        </Fragment>
                      }
                      {/* <input type="text" className="form-control" title={item?.registeringAuthorityDoc} placeholder={item?.registeringAuthorityDoc} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.consolidationType}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.consolidationType} placeholder={item?.consolidationType} disabled /> */}
                    </td>
                    <td class="text-center">
                      {" "}
                      <p className="table-value">
                      {item?.kanal}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.kanal} placeholder={item?.kanal} disabled />{" "} */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.marla}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.marla} placeholder={item?.marla} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.sarsai}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.sarsai} placeholder={item?.sarsai} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.bigha}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.bigha} placeholder={item?.bigha} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.biswa}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.biswa} placeholder={item?.biswa} disabled /> */}
                    </td>
                    <td class="text-center">
                    <p className="table-value">
                      {item?.biswansi}
                      </p>
                      {/* <input type="text" className="form-control" title={item?.biswansi} placeholder={item?.biswansi} disabled /> */}
                    </td>
                    {item?.consolidationType == "non-consolidated" &&
                      <td class="text-center">
                        <p className="table-value">
                        {item?.nonConsolidatedTotal}
                      </p>
                        {/* <input type="text" className="form-control" title={item?.nonConsolidatedTotal} placeholder={item?.nonConsolidatedTotal} disabled /> */}
                      </td>
                    }
                    {item?.consolidationType == "consolidated" &&
                      <td class="text-center">
                        <p className="table-value">
                        {item?.consolidatedTotal}
                      </p>
                        {/* <input type="text" className="form-control" title={item?.consolidatedTotal} placeholder={item?.consolidatedTotal} disabled /> */}
                      </td>
                    }
                    <td class="text-center">
                      {/* <th class="fw-normal py-0 border-top-0"> */}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarksPatwari && showReportProblemIcon("Total Area (in acres)") ? "block" : "none",

                          color: fieldIconColors.district
                        }}
                        onClick={() => {
                          setLabelValue("Land schedule Table"),
                            setOpennedModal("district")
                          setSmShow(true),
                            setDocModal(false),
                            console.log("modal open"),
                            setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null);
                          // setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails : null);
                        }}
                      ></ReportProblemIcon>
                      {/* </th> */}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </div>
        {/* </div>
      </Collapse> */}
        {/* <div style={{ position: "relative", marginBottom: 40 }}>
              <Button onClick={() => props.passUncheckedList({ data: uncheckedValue, purpose: purpose })}>Submit</Button>
            </div> */}

        <div class="row">
          <div class="col-sm-6 text-left">

          </div>
          <div class="col-sm-6 text-right">
            {`${t("NWL_APPLICANT_TOTAL_AREA_LAND_SCHEDULE")}`}  : {applicantInfoPersonal?.totalArea}
          </div>
        </div>
        {/* <div className="row" style={{ margin: 10 , textAlign:""}}>
            {`${t("NWL_APPLICANT_TOTAL_AREA_LAND_SCHEDULE")}`}  : {applicantInfoPersonal?.totalArea}
            </div> */}

      </Form.Group>


      {/* <div>
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
          
          </div> */}

      {/* </div>
      </Collapse> */}
      {showToastError && (
        <CusToaster
          label={showToastError?.label}
          success={showToastError?.success}
          error={showToastError?.error}
          onClose={() => {
            setShowToastError({ label: "", success: false, error: false });
          }}
        />
      )}
    </Form>
  );
};

export default Genarelinfo;
