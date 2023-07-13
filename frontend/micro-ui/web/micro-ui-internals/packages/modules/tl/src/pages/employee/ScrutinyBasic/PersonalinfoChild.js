import React, { Fragment, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import './css/personalInfoChild.style.js'
import { useStyles } from "./css/personalInfoChild.style.js"
import AddIcon from "@mui/icons-material/Add";
import Table from '@mui/material/Table';

import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "./ScrutinyDevelopment/docview.helper";
import { useLocation } from "react-router-dom";
// import CusToaster from "../../../../components/Toaster";
import CusToaster from "../../../components/Toaster/index";


// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
// import { ArrowDownCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next";


const PersonalinfoChild = (props) => {
  // useTranslation

  const { t } = useTranslation();
  const { pathname: url } = useLocation();

  const classes = useStyles();
  const applicationStatus = props.applicationStatus;
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

  // mDMSData?.map((e) => e.role)||[]
  console.log("happyRole", userRoles);
  console.log("happyDate", mDMSData);
  console.log("happyROLE", mDMSDataRole);
  console.log("happyapplicationStatusMdms", applicationStatusMdms);
  console.log("happyDateHIDE", hideRemarksPatwari, showReportProblemIcon("Purpose of colony"), hideRemarks);
  const personalinfo = props.personalinfo;
  const iconStates = props.iconColorState;

  //   const [datailsShown , setDatailsShown] = useState([]);
  // const toggleshown = userID => {
  //   const  showState = datailsShown.slice();
  //   const index = showState.indexOf(userID);
  //   if(index >= 0 ){
  //     showState.splice(index, 1);
  //     setDatailsShown(showState);
  //   }
  //   else{
  //     showState.push(userID);
  //     setDatailsShown(showState);
  //   }
  // }

  // let users = Digit.UserService.getUser();
  // const userRole = users?.info?.roles?.map((e) => e.code) || [];

  //   const [handleChange,setHandleChange] =useState("");
  //   const handleClose = () => setShow(false);
  // const [handleshow ,setHandleShow] = () => setShow(true);

  const [smShow, setSmShow] = useState(false);
  const [docModal, setDocModal] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    Conditional: "#2874A6",
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    developer: Colors.info,
    authPersonName: Colors.info,
    authMobileNo1: Colors.info,
    authMobileNo2: Colors.info,
    developerEmail: Colors.info,
    developerMobileNo: Colors.info,
    developerdob: Colors.info,
    developeremail: Colors.info,
    pan: Colors.info,
    registeredAddress: Colors.info,
    city: Colors.info,
    pin: Colors.info,
    tehsil: Colors.info,
    district: Colors.info,
    state: Colors.info,
    type: Colors.info,
    lciSignedBy: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    authPan: Colors.info,
    emailForCommunication: Colors.info,
    authorized: Colors.info,
    developerType: Colors.info,
    Address: Colors.info,
    cin_Number: Colors.info,
    developeremail: Colors.info,
    developerName: Colors.info,
    developerPan: Colors.info,
    registeredAddress2: Colors.info,
    gst_Number: Colors.info,
    emailId: Colors.info,
    uploadDigitalSignaturePdf: Colors.info,
    uploadBoardResolution: Colors.info,
    shareholdingPatterns: Colors.info,
    DirectorsInformation: Colors.info,
    directorsInformationdeveloper: Colors.info

  })

  const fieldIdList = [
  { label: "Developer", key: "developer" } , 
  { label: "NWL_APPLICANT_AUTHORIZED_NAME", key: "authPersonName" },
  { label: "NWL_APPLICANT_AUTHORIZED_MOBILE_NO", key: "authMobileNo1" },
  { label: "Alternate MobileNo. 2 ", key: "authMobileNo2" },
  { label: "NWL_APPLICANT_DEVELOPER_EMAILID", key: "developerEmail" },
  { label: "PAN No.", key: "pan" },
  { label: "Village/City", key: "city" },
  { label: "Pincode", key: "pin" },
  { label: "Tehsil", key: "tehsil" },
  { label: "District", key: "district" },
  { label: "State", key: "state" },
  { label: "Status (Individual/ Company/ Firm/ LLP etc.)", key: "type" },
  { label: "LC-I signed by", key: "lciSignedBy" },  
  { label: "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)", key: "lciNotSigned" }, 
  { label: "Permanent address in case of individual/ registered office address in case other than individual", key: "parmanentAddress" }, 
  { label: "Address for communication", key: "addressForCommunication" },
  { label: "Name of the authorized person to sign the application", key: "authorized" },
  { label: "NWL_APPLICANT_EMAILID_FOR_AUTHORIZED_SINGNATORY", key: "emailForCommunication" }, 
  { label: "NWL_APPLICANT_DEVELOPER_TYPE", key: "developerType" }, 
  { label: "Address", key: "registeredAddress" }, 
  { label: "NWL_APPLICANT_CIN_NUMBER", key: "cin_Number" }, 
  { label: "Email Id", key: "developeremail" }, 
  { label: "NWL_APPLICANT_DEVELOPER_NAME", key: "developerName" }, 
  { label: "NWL_APPLICANT_PAN_NUMBER", key: "developerPan" }, 
  { label: "NWL_APPLICANT_DEVELOPER_ADDRESS", key: "registeredAddress2" }, 
  { label: "NWL_APPLICANT_GST_NUMBER", key: "gst_Number" }, 
  { label: "NWL_APPLICANT_BOARD_RESOLUTION", key: "uploadBoardResolution" }, 
  { label: "NWL_APPLICANT_DIGITAL_SIGNATURE", key: "uploadDigitalSignaturePdf" },
  { label: "NWL_APPLICANT_LLP_NUMBER", key: "developerMobileNo" },
  { label: "Developer's DOB", key: "developerdob" },
  { label: "NWL_APPLICANT_AUTHORIZED_PAN_NUMBER", key: "authPan" }, 
  { label: "NWL_APPLICANT_SHAREHOLDING_PATTERNS", key: "shareholdingPatterns" },
  { label: "NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_MCA", key: "DirectorsInformation" }, 
  { label: "NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_DEVELOPER", key: "directorsInformationdeveloper" }]







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
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved === "In Order" ? Colors.approved : fieldPresent[0].isApproved === "Not In Order" ? Colors.disapproved : fieldPresent[0].isApproved === "Order With Conditions" ? Colors.Conditional : Colors.info }

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
  //////////////////////////////////////////Old code 
  // const [uncheckedValue, setUncheckedVlue] = useState([]);
  // const [checkValue, setCheckedVAlue] = useState([]);

  // const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  //   const [isyesOrNochecked, setYesorNochecked] = useState(true);

  //   const handlemodaldData = (data) => {
  //     setmodaldData(data.data);
  //     setSmShow(false);
  //   };

  //   const handleYesOrNochecked = (data) => {
  //     setYesorNochecked(data.data);
  //   };
  //   const handlemodalsubmit = () => {
  //     console.log("here");
  //     const filteredObj = uncheckedValue.filter((obj) => {
  //       return obj.label == modaldData.label;
  //     });

  //     if (isyesOrNochecked === false) {
  //       if (modaldData.label !== "" || modaldData.Remarks !== "") {
  //         if (filteredObj.length === 0) {
  //           setUncheckedVlue((prev) => [...prev, modaldData]);
  //         }
  //       }
  //     }
  //   };
  //   useEffect(() => {
  //     console.log("called");
  //     handlemodalsubmit();
  //   }, [modaldData.Remarks]);
  //   useEffect(() => {
  //     props.passUncheckedList({ data: uncheckedValue });
  //   }, [uncheckedValue]);
  //   console.log("unchecked values", uncheckedValue);

  //   console.log(uncheckedValue.indexOf("developer"));
  const [loader, setLoader] = useState(false);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });


  return (
    <Form.Group style={{ display: props.displayPersonal }} t={t} className={classes.formGroup}>
      <ModalChild

        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        disPlayDoc={docModal}
        onClose={() => { setSmShow(false); setDocModal(false) }}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
        applicationStatus={applicationStatus}
      ></ModalChild>
      <label className="card-title fw-bold"  style={{ margin: 10 }} htmlFor="Developer Details">
        {`${t("NWL_APPLICANT_DEVELOPER_INFORMATION")}`}


        {/* <span class="text-danger font-weight-bold mx-2">*</span> */}
      </label>
      {/* <h5  style={{ margin: 10 }}> &nbsp; Developer Information</h5> */}
      {/* "Limited Liability Partnership"  && "Hindu Undivided Family" && "Partnership Firm" &&  "Proprietorship Firm" && */}
      {/* {personalinfo?.devDetail?.addInfo?.showDevTypeFields === "Individual" && */}

      <div>
        {/* <Card style={{ margin: 5 , padding: 4 }}> */}
        {/* <label htmlFor="PanNumber">
                            {`${t("NWL_APPLICANT_PAN_NO")}`}
                            <span class="text-danger font-weight-bold mx-2">*</span>
                          </label> */}


        <Row className={[classes.row, "ms-auto"]}>

          {/* <label htmlFor="Developer Details">
                            {`${t("NWL_APPLICANT_DEVELOPER_INFORMATION")}`}
                           
                          </label> */}
          {personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Individual" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Proprietorship Firm" &&
            <Col md={4} xxl lg="4">
              <div>
                <label htmlFor="Developer Details">
                  {`${t("NWL_APPLICANT_DEVELOPER_NAME")}`}
                  <span class="text-danger font-weight-bold mx-2">*</span>
                </label>
                {/* <Form.Label>

                    <h5 className={classes.formLabel}>Name &nbsp;</h5>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span> */}
              </div>

              <div style={{ display: "flex" }}>
                <Form.Control className={classes.formControl}
                  placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.companyName : null}
                  disabled></Form.Control>
                &nbsp;&nbsp;
                <ReportProblemIcon
                  style={{
                    display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DEVELOPER_NAME") ? "block" : "none",
                    color: fieldIconColors.developerName
                  }}
                  onClick={() => {
                    setOpennedModal("developerName")
                    setLabelValue("NWL_APPLICANT_DEVELOPER_NAME"),
                      setSmShow(true),
                      setDocModal(false),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.companyName : null);
                  }}
                ></ReportProblemIcon>



              </div>
            </Col>
          }
          <Col md={4} xxl lg="4">
            <div>
              <label htmlFor="Address">
                {`${t("NWL_APPLICANT_DEVELOPER_ADDRESS")}`}
                <span class="text-danger font-weight-bold mx-2">*</span>
              </label>
              {/* <Form.Label>

                    <h5 className={classes.formLabel}>Address &nbsp;</h5>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span> */}
            </div>

            <div style={{ display: "flex" }}>
              <Form.Control className={classes.formControl}
                placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.registeredAddress : null}
                disabled></Form.Control>
              &nbsp;&nbsp;
              {/* {showReportProblemIcon("Purpose of colony")}
                  {hideRemarksPatwari}
                  {hideRemarks} */}
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DEVELOPER_ADDRESS") ? "block" : "none",
                  color: fieldIconColors.registeredAddress2
                }}
                onClick={() => {
                  setOpennedModal("registeredAddress2")
                  setLabelValue("NWL_APPLICANT_DEVELOPER_ADDRESS"),
                    setSmShow(true),
                    setDocModal(false),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.registeredAddress : null);
                }}
              ></ReportProblemIcon>



            </div>
          </Col>
          {personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Company"  &&
          <Col md={4} xxl lg="4">
            <div>
              <label htmlFor="EmailId">
                {`${t("NWL_APPLICANT_DEVELOPER_EMAILID")}`}
                <span class="text-danger font-weight-bold mx-2">*</span>
              </label>
              
            </div>

            <div style={{ display: "flex" }}>
              <Form.Control className={classes.formControl}
                placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.email : null}
                disabled></Form.Control>
              &nbsp;&nbsp;
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DEVELOPER_EMAILID") ? "block" : "none",
                  color: fieldIconColors.developerEmail
                }}
                onClick={() => {
                  setOpennedModal("developerEmail")
                  setLabelValue("NWL_APPLICANT_DEVELOPER_EMAILID"),
                    setSmShow(true),
                    setDocModal(false),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.email : null);
                }}
              ></ReportProblemIcon>
            </div>
          </Col>
}
{personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Individual" &&
        personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Hindu Undivided Family" &&
        personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Partnership Firm" &&
        personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Limited Liability Partnership" &&
        personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Proprietorship Firm" &&
          <Col md={4} xxl lg="4">
            <div>
              <label htmlFor="EmailId">
                {`${t("NWL_APPLICANT_DEVELOPER_EMAILID")}`}
                <span class="text-danger font-weight-bold mx-2">*</span>
              </label>
              {/* <Form.Label>

                    <h5 className={classes.formLabel}>EmailId &nbsp;</h5>
                  </Form.Label> */}
              {/* <span style={{ color: "red" }}>*</span> */}
            </div>

            <div style={{ display: "flex" }}>
              <Form.Control className={classes.formControl}
                placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.emailId : null}
                disabled></Form.Control>
              &nbsp;&nbsp;
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DEVELOPER_EMAILID") ? "block" : "none",
                  color: fieldIconColors.developerEmail
                }}
                onClick={() => {
                  setOpennedModal("developerEmail")
                  setLabelValue("NWL_APPLICANT_DEVELOPER_EMAILID"),
                    setSmShow(true),
                    setDocModal(false),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.emailId : null);
                }}
              ></ReportProblemIcon>
            </div>
          </Col>
}
          <Col md={4} xxl lg="4">
            <div>
              <label htmlFor="DeveloperType">
                {`${t("NWL_APPLICANT_DEVELOPER_TYPE")}`}
                <span class="text-danger font-weight-bold mx-2">*</span>
              </label>
              {/* <Form.Label>
      <h5 className={classes.formLabel}>Developer Type &nbsp;</h5>
    </Form.Label>
    <span className={classes.required}>*</span> &nbsp;&nbsp; */}
            </div>
            <div className={classes.fieldContainer}>
              <Form.Control
                className={classes.formControl}
                placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.showDevTypeFields : null}
                disabled
              ></Form.Control>
              &nbsp;&nbsp;
              {/* {JSON.stringify(userRoles)} */}
              {/* {JSON.stringify(hideRemarksPatwari)}  */}
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DEVELOPER_TYPE") ? "block" : "none",

                  color: fieldIconColors.developerType
                }}
                onClick={() => {
                  setOpennedModal("developerType")
                  setLabelValue("NWL_APPLICANT_DEVELOPER_TYPE"),
                    setSmShow(true),
                    setDocModal(false),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.showDevTypeFields : null);
                }}
              ></ReportProblemIcon>

            </div>
          </Col>
          {personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Individual" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Hindu Undivided Family" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Partnership Firm" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Limited Liability Partnership" &&
            <Col md={4} xxl lg="4">
              <div>
                <label htmlFor="CIN Number">
                  {`${t("NWL_APPLICANT_CIN_NUMBER")}`}
                  <span class="text-danger font-weight-bold mx-2">*</span>
                </label>
             </div>
              <div className={classes.fieldContainer}>
                <Form.Control
                  className={classes.formControl}
                  placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.cin_Number : null}
                  disabled
                ></Form.Control>
                &nbsp;&nbsp;

                <ReportProblemIcon
                  style={{
                    display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_CIN_NUMBER") ? "block" : "none",

                    color: fieldIconColors.cin_Number
                  }}
                  onClick={() => {
                    setOpennedModal("cin_Number")
                    setLabelValue("NWL_APPLICANT_CIN_NUMBER"),
                      setSmShow(true),
                      setDocModal(false),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.cin_Number : null);
                  }}
                ></ReportProblemIcon>

              </div>
            </Col>
          }
          {personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Partnership Firm" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Company" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Limited Liability Partnership" &&
            <Col md={4} xxl lg="4">
              <div>
                <label htmlFor="PanNumber">
                  {`${t("NWL_APPLICANT_PAN_NUMBER")}`}
                  <span class="text-danger font-weight-bold mx-2">*</span>
                </label>

                {/*                   
                  <Form.Label>

                    <h5 className={classes.formLabel}>PAN Number &nbsp;</h5>
                  </Form.Label> */}
                <span style={{ color: "red" }}>*</span>
              </div>

              <div style={{ display: "flex" }}>
                <Form.Control className={classes.formControl}
                  placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.PanNumber : null}
                  disabled></Form.Control>
                &nbsp;&nbsp;
                <ReportProblemIcon
                  style={{
                    display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_PAN_NUMBER") ? "block" : "none",
                    color: fieldIconColors.developerPan
                  }}
                  onClick={() => {
                    setOpennedModal("developerPan")
                    setLabelValue("NWL_APPLICANT_PAN_NUMBER"),
                      setSmShow(true),
                      setDocModal(false),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.PanNumber : null);
                  }}
                ></ReportProblemIcon>



              </div>
            </Col>
          }
          {personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Company" &&
            <Col md={4} xxl lg="4">
              <div>

                <label htmlFor="PanNumber">
                  {`${t("NWL_APPLICANT_GST_NUMBER")}`}
                  <span class="text-danger font-weight-bold mx-2">*</span>
                </label>

                {/* <Form.Label>

                  <h5 className={classes.formLabel}>GST Number &nbsp;</h5>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> */}
              </div>

              <div style={{ display: "flex" }}>
                <Form.Control className={classes.formControl}
                  placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.gst_Number : null}
                  disabled></Form.Control>
                &nbsp;&nbsp;
                <ReportProblemIcon
                  style={{
                    display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_GST_NUMBER") ? "block" : "none",
                    color: fieldIconColors.gst_Number
                  }}
                  onClick={() => {
                    setOpennedModal("gst_Number")
                    setLabelValue("NWL_APPLICANT_GST_NUMBER"),
                      setSmShow(true),
                      setDocModal(false),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.gst_Number : null);
                  }}
                ></ReportProblemIcon>



              </div>
            </Col>
          }
          {personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Individual" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Hindu Undivided Family" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Partnership Firm" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Company" &&
            personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Proprietorship Firm" &&
            <Col md={4} xxl lg="4">
              <div>
                <label htmlFor="LLP NUMBER">
                  {`${t("NWL_APPLICANT_LLP_NUMBER")}`}
                  <span class="text-danger font-weight-bold mx-2">*</span>
                </label>

                {/* <Form.Label>

                    <h5 className={classes.formLabel}>LLP &nbsp;</h5>
                  </Form.Label> */}
                <span style={{ color: "red" }}>*</span>
              </div>

              <div style={{ display: "flex" }}>
                <Form.Control className={classes.formControl}
                  placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.mobileNumberUser : null}
                  disabled ></Form.Control>
                &nbsp;&nbsp;
                <ReportProblemIcon
                  style={{
                    display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_LLP_NUMBER") ? "block" : "none",
                    color: fieldIconColors.developerMobileNo
                  }}
                  onClick={() => {
                    setOpennedModal("developerMobileNo")
                    setLabelValue("NWL_APPLICANT_LLP_NUMBER"),
                      setSmShow(true),
                      setDocModal(false),
                      console.log("modal open"),
                      setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.mobileNumberUser : null);
                  }}
                ></ReportProblemIcon>
              </div>
            </Col>
          }
        </Row>

        {/* <Row>
         
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>

                    <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>

                <div style={{ display: "flex" }}>
                  <Form.Control className={classes.formControl}
                    placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.mobileNumberUser : null}
                    disabled ></Form.Control>
                  &nbsp;&nbsp;
                  <ReportProblemIcon
                    style={{
                     display: hideRemarksPatwari && showReportProblemIcon("Address") ? "block" : "none",
                      color: fieldIconColors.developerMobileNo
                    }}
                    onClick={() => {
                      setOpennedModal("developerMobileNo")
                      setLabelValue("Developer's Mobile No"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.mobileNumberUser : null);
                    }}
                  ></ReportProblemIcon>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>

                    <h5 className={classes.formLabel}>Date of Birth &nbsp;</h5>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>

                <div style={{ display: "flex" }}>
                  <Form.Control className={classes.formControl}
                    placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.dob : null}
                    disabled></Form.Control>
                  &nbsp;&nbsp;
                  <ReportProblemIcon
                    style={{
                     display: hideRemarksPatwari && showReportProblemIcon("Address") ? "block" : "none",
                      color: fieldIconColors.developerdob
                    }}
                    onClick={() => {
                      setOpennedModal("developerdob")
                      setLabelValue("Developer's DOB"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.dob : null);
                    }}
                  ></ReportProblemIcon>



                </div>
              </Col>
              
              
            </Row> */}

        {/* </Card> */}
      </div>

      <br></br>
      {personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Individual" &&
        personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Hindu Undivided Family" &&
        personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Partnership Firm" &&
        personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Limited Liability Partnership" &&
        personalinfo?.devDetail?.addInfo?.showDevTypeFields != "Proprietorship Firm" &&

        <div>

          <div style={{ display: "flex" }}>
            {/* <h5  > &nbsp;&nbsp; 1. Director Information as per MCA &nbsp;&nbsp;</h5> */}
            <label  className="card-title fw-bold" htmlFor="LLP NUMBER" >
            &nbsp; &nbsp;&nbsp;&nbsp; {`${t("NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_MCA")}`}
              <span class="text-danger font-weight-bold mx-2">*</span>
            </label>

            {/* <div className="btn btn-sm col-md-4"> */}
            <ReportProblemIcon
              style={{
                display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_MCA") ? "block" : "none",
                color: fieldIconColors.DirectorsInformation
              }}
              onClick={() => {
                setOpennedModal("DirectorsInformation")
                setLabelValue("NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_MCA"),
                  setSmShow(true),
                  setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution : null);
              }}
            ></ReportProblemIcon>
            {/* </div> */}
          </div>

          <div className="card-body">
            <div className="table-bd">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>
                      {/* Sr. No     */}
                      {`${t("NWL_APPLICANT_SR_NO")}`}
                    </th>
                    <th>
                      {/* DIN Number  */}
                      {`${t("NWL_APPLICANT_DIN_NUMBER")}`}</th>
                    <th>
                      {/* Name */}
                      {`${t("NWL_APPLICANT_NAME")}`}
                    </th>
                    <th>
                      {/* Contact Number */}
                      {`${t("NWL_APPLICANT_CONTACT_NUMBER")}`}
                    </th>
                    {/* <th>View PDF</th> */}
                  </tr>
                </thead>
                <tbody>
                  {personalinfo?.devDetail?.addInfo?.DirectorsInformationMCA?.map((item, index) => (

                    <tr
                    >
                      <td>{index + 1}</td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                      </td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                      </td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.contactNumber} disabled></Form.Control>
                      </td>
                      {/* <td>
                                <div className="row">
                                  
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                </div>
                              </td> */}
                    </tr>
                  ))
                  }
                  {/* );
                            })} */}
                </tbody>
              </table>
            </div>
          </div>
          <br></br>
          <div div style={{ display: "flex" }}>
            <h5 className="card-title fw-bold" > &nbsp; &nbsp;&nbsp; {`${t("NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_DEVELOPER")}`}
              {/* Directors Information &nbsp;&nbsp; */}
            </h5>
            {/* <label htmlFor="LLP NUMBER" >
                            {`${t("NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_MCA")}`}
                            <span class="text-danger font-weight-bold mx-2">*</span>
                          </label> */}

            {/* <div className="btn btn-sm col-md-4"> */}
            <ReportProblemIcon
              style={{
                display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_DEVELOPER") ? "block" : "none",

                color: fieldIconColors.directorsInformationdeveloper
              }}
              onClick={() => {
                setOpennedModal("directorsInformationdeveloper")
                setLabelValue("NWL_APPLICANT_1_DIRECTOR_INFOMATION_AS_PER_DEVELOPER"),
                  setSmShow(true),
                  setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution : null);
              }}
            ></ReportProblemIcon>
            {/* </div> */}
          </div>

          <div className="card-body">
            <div className="table-bd">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th> {`${t("NWL_APPLICANT_SR_NO")}`}</th>
                    <th> {`${t("NWL_APPLICANT_DIN_NUMBER")}`}</th>
                    <th>{`${t("NWL_APPLICANT_NAME")}`}</th>
                    <th> {`${t("NWL_APPLICANT_CONTACT_NUMBER")}`}</th>
                    <th>
                      {/* View PDF  */}
                      {`${t("NWL_APPLICANT_VIEW_PDF")}`}</th>
                  </tr>
                </thead>
                <tbody>
                  {personalinfo?.devDetail?.addInfo?.DirectorsInformation?.map((item, index) => (

                    <tr
                    >
                      <td>{index + 1}</td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                      </td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                      </td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.contactNumber} disabled></Form.Control>
                      </td>
                      <td>
                        <div className="row">

                          {
                            item?.uploadPdf &&
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
                                if (item?.uploadPdf) getDocShareholding(item?.uploadPdf, setLoader);
                                else setShowToastError({ label: "No Document here", error: true, success: false });
                              }}

                            // onClick={() => getDocShareholding(item?.uploadPdf)}
                            >
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
                                if (item?.uploadPdf) getDocShareholding(item?.uploadPdf, setLoader);
                                else setShowToastError({ label: "No Document here", error: true, success: false });
                              }}
                            // onClick={() => getDocShareholding(item?.uploadPdf)}
                            >
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                          </div>
                            </Fragment>
                          }
                        </div>
                      </td>
                    </tr>
                  ))
                  }
                  {/* );
                            })} */}
                </tbody>
              </table>
            </div>
          </div>
          <br></br>



          <div div style={{ display: "flex" }}>
            <h5 className="card-title fw-bold">
            &nbsp; &nbsp;&nbsp;&nbsp; {`${t("NWL_APPLICANT_SHAREHOLDING_PATTERNS")}`}
              {/* &nbsp;&nbsp;&nbsp; Shareholding Patterns &nbsp;&nbsp; */}
            </h5>


            {/* <div className="btn btn-sm col-md-4"> */}
            <ReportProblemIcon
              style={{
                display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_SHAREHOLDING_PATTERNS") ? "block" : "none",

                color: fieldIconColors.shareholdingPatterns
              }}
              onClick={() => {
                setOpennedModal("shareholdingPatterns")
                setLabelValue("NWL_APPLICANT_SHAREHOLDING_PATTERNS"),
                  setSmShow(true),
                  setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution : null);
              }}
            ></ReportProblemIcon>
            {/* </div> */}
          </div>
          <div className="card-body">
            <div className="table-bd">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th> {`${t("NWL_APPLICANT_SR_NO")}`}</th>

                    <th>{`${t("NWL_APPLICANT_NAME")}`}</th>
                    <th> {`${t("NWL_APPLICANT_DESIGNITION")}`}</th>
                    <th> {`${t("NWL_APPLICANT_PRECENTAGE")}`}</th>
                    <th>

                      {`${t("NWL_APPLICANT_VIEW_PDF")}`}</th>
                  </tr>
                  {/* <th>Sr. No</th>
                    <th>Name</th>
                    <th>Designition</th>
                    <th>Percentage</th>
                    <th>View PDF</th>
                  </tr> */}
                </thead>
                <tbody>
                  {personalinfo?.devDetail?.addInfo?.shareHoldingPatterens?.map((item, index) => (

                    <tr>
                      <td>{item?.serialNumber || index + 1}</td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                      </td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.designition} disabled></Form.Control>
                      </td>
                      <td>
                        <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.percentage} disabled></Form.Control>
                      </td>
                      <td>
                        <div className="row">
                          {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)} > */}

                          {/* {
                            item?.uploadPdf && 
                            <Fragment> */}
                          <div className="btn btn-sm col-md-4">
                            <IconButton
                              style={{
                                color: " #1266af",
                                fontSize: " 12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textDecorationLine: "underline",
                              }}
                              onClick={() => {
                                if (item?.uploadPdf) getDocShareholding(item?.uploadPdf, setLoader);
                                else setShowToastError({ label: "No Document here", error: true, success: false });
                              }}
                            // onClick={() => getDocShareholding(item?.uploadPdf)}
                            >
                              <Visibility color="info" className="icon" /></IconButton>
                          </div>
                          {/* </button> */}
                          {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <FileDownload color="primary" /> */}
                          <div className="btn btn-sm col-md-4">
                            <IconButton
                              style={{
                                color: " #1266af",
                                fontSize: " 12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textDecorationLine: "underline",
                              }}
                              onClick={() => {
                                if (item?.uploadPdf) getDocShareholding(item?.uploadPdf, setLoader);
                                else setShowToastError({ label: "No Document here", error: true, success: false });
                              }}
                            // onClick={() => getDocShareholding(item?.uploadPdf)}
                            >
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                          </div>
                            {/* </Fragment>
                          } */}

                        </div>
                      </td>
                    </tr>
                  ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }


      <h5  className="card-title fw-bold">
        {/* &nbsp; &nbsp;&nbsp; Authorized Person Information  &nbsp;&nbsp; */}
        &nbsp; &nbsp;&nbsp; {`${t("NWL_APPLICANT_AUTHORIZED_PERSON_INFORMATION")}`}
      </h5>
      {/* <ReportProblemIcon
              style={{
               display: hideRemarksPatwari && showReportProblemIcon("Authorized Person Information") ? "block" : "none",

                color: fieldIconColors.authPersonName
              }}
              onClick={() => {
                setOpennedModal("authPersonName")
                setLabelValue("Authorized Person Name"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.name : null);
              }}
            ></ReportProblemIcon> */}
      {/* </h5> */}
      <Row className={[classes.row, "ms-auto"]}>
        <Col className="ms-auto" md={4} xxl lg="4">
          {/* <Form.Label>
            
            <h5 className={classes.formLabel} >Name &nbsp;</h5>
          </Form.Label>
          <span className={classes.required}>*</span> &nbsp;&nbsp; */}
          <label htmlFor="NAME" >
            {`${t("NWL_APPLICANT_AUTHORIZED_NAME")}`}
            <span class="text-danger font-weight-bold mx-2">*</span>
          </label>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              // placeholder={personalinfo.authorizedPerson}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.name : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_AUTHORIZED_NAME") ? "block" : "none",

                color: fieldIconColors.authPersonName
              }}
              onClick={() => {
                setOpennedModal("authPersonName")
                setLabelValue("NWL_APPLICANT_AUTHORIZED_NAME"),
                  setSmShow(true),
                  setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.name : null);
              }}
            ></ReportProblemIcon>
          </div>

        </Col>
        <Col className="ms-auto" md={4} xxl lg="4">
          <div>
            {/* <Form.Label>
              
              <h5 className={classes.formLabel} >Mobile No.&nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp; */}
            {/* <ReportProblemIcon style={{ color: warningOrred }} onClick={() => setSmShow(true)}></ReportProblemIcon> */}

            <label htmlFor="NAME" >
              {`${t("NWL_APPLICANT_AUTHORIZED_MOBILE_NO")}`}
              <span class="text-danger font-weight-bold mx-2">*</span>
            </label>
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.mobileNumber : null}
              disabled
            ></Form.Control>
            {/* &nbsp;&nbsp;
            <Form.Check
                        value="Yes"
                        type="radio"
                        // onChange1={handleChange}
                        // onClick={handleshow}
                        id="default-radio"
                        label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                        name="group41"
                        inline
                      ></Form.Check>
                      <Form.Check
                        // onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="No"
                        type="radio"
                        id="default-radio"
                        // onChange1={handleChange}
                        // onClick={handleshow}
                        label={<CancelIcon color="error" />}
                        name="group41"
                        inline
                      ></Form.Check>  */}
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_AUTHORIZED_MOBILE_NO") ? "block" : "none",

                color: fieldIconColors.authMobileNo1
              }}
              onClick={() => {
                setOpennedModal("authMobileNo1")
                setLabelValue("NWL_APPLICANT_AUTHORIZED_MOBILE_NO"),
                  setSmShow(true),
                  setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.mobileNumber : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            {/* <Form.Label>
            
              <h5 className={classes.formLabel} >Emailid for Authorized signatory &nbsp;</h5>
            </Form.Label> */}
            <label htmlFor="EMAIL" >
              {`${t("NWL_APPLICANT_EMAILID_FOR_AUTHORIZED_SINGNATORY")}`}
              <span class="text-danger font-weight-bold mx-2">*</span>
            </label>
          </div>

          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.emailId : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_EMAILID_FOR_AUTHORIZED_SINGNATORY") ? "block" : "none",

                color: fieldIconColors.emailForCommunication
              }}
              onClick={() => {
                setOpennedModal("emailForCommunication")
                setLabelValue("NWL_APPLICANT_EMAILID_FOR_AUTHORIZED_SINGNATORY"),
                  setSmShow(true),
                  setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.emailId : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className={[classes.row, "ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            {/* <Form.Label>

              <h5 className={classes.formLabel} >Pan No. &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> */}

            <label htmlFor="PAN" >
              {`${t("NWL_APPLICANT_AUTHORIZED_PAN_NUMBER")}`}
              <span class="text-danger font-weight-bold mx-2">*</span>
            </label>
          </div>

          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.pan : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_AUTHORIZED_PAN_NUMBER") ? "block" : "none",

                color: fieldIconColors.authPan
              }}
              onClick={() => {
                setOpennedModal("authPan")
                setLabelValue("NWL_APPLICANT_AUTHORIZED_PAN_NUMBER"),
                  setSmShow(true),
                  setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.pan : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            {/* <Form.Label>

              <h5 className={classes.formLabel} >Digital Signature &nbsp;</h5>
            </Form.Label> */}

            <label htmlFor="PAN" >
              {`${t("NWL_APPLICANT_DIGITAL_SIGNATURE")}`}
              <span class="text-danger font-weight-bold mx-2">*</span>
            </label>

          </div>

          <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.village : null}
              disabled
            ></Form.Control> */}
            {/* <div className="row"> */}

            {/* {
              personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf &&
              <Fragment> */}
            <div className="btn btn-sm col-md-2">
              <IconButton
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf) getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}>
                <Visibility color="info" className="icon" /></IconButton>

            </div>
            <div className="btn btn-sm col-md-5">
              <IconButton
                // onClick={() => getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf)}
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf) getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <FileDownload color="primary" className="mx-1" />
              </IconButton>
            </div>
            <div className="btn btn-sm col-md-5" >
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DIGITAL_SIGNATURE") ? "block" : "none",

                  color: fieldIconColors.uploadDigitalSignaturePdf
                }}
                onClick={() => {
                  setOpennedModal("uploadDigitalSignaturePdf")
                  setLabelValue("NWL_APPLICANT_DIGITAL_SIGNATURE"),
                    setSmShow(true),
                    setDocModal(true),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf : null);
                }}
              ></ReportProblemIcon>
            </div>
              {/* </Fragment>
            } */}

          </div>


          {/* </div> */}
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            

            <label htmlFor="PAN" >
              {`${t("NWL_APPLICANT_BOARD_RESOLUTION")}`}
              <span class="text-danger font-weight-bold mx-2">*</span>
            </label>
          </div>

          <div className={classes.fieldContainer}>
         
         {/* {
          personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution && 
          <Fragment> */}
            <div className="btn btn-sm col-md-2">
              <IconButton
                // onClick={() => getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution)}
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution) getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <Visibility color="info" className="icon" /></IconButton>

            </div>
            <div className="btn btn-sm col-md-5">
              <IconButton
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution) getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <FileDownload color="primary" className="mx-1" />
              </IconButton>
            </div>
            <div className="btn btn-sm col-md-5">
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_BOARD_RESOLUTION") ? "block" : "none",

                  color: fieldIconColors.pin
                }}
                onClick={() => {
                  setOpennedModal("uploadBoardResolution")
                  setLabelValue("NWL_APPLICANT_BOARD_RESOLUTION"),
                    setSmShow(true),
                    setDocModal(true),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution : null);
                }}
              ></ReportProblemIcon>
            </div>
          {/* </Fragment>
         } */}

            {/* </div> */}

          </div>
        </Col>
        {/* <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
             
              <h5 className={classes.formLabel} >Address 1 &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
         
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorizedAddress : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.address}}
              onClick={() => {
                setOpennedModal("address")
                setLabelValue("Address  1"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedAddress : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col> */}
      </Row>


      <Row className={[classes.row, "ms-auto"]}>
            <div className="col col-4">
            <div>
             <h2 style={{ display: "flex" }}>
                {`${t("NWL_UPLOAD_BOARD_RESOLUTION")}`}
                {/* Upload Board resolution  */}
              </h2>
          </div>
          <div className={classes.fieldContainer}>
         
         {/* {
          personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution && 
          <Fragment> */}
            <div className="btn btn-sm col-md-2">
              <IconButton
             
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.uploadBoardResolution) getDocShareholding(personalinfo?.uploadBoardResolution, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <Visibility color="info" className="icon" /></IconButton>

            </div>
            <div className="btn btn-sm col-md-5">
              <IconButton
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.boardResolutionDoc) getDocShareholding(personalinfo?.boardResolutionDoc, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <FileDownload color="primary" className="mx-1" />
              </IconButton>
            </div>
            <div className="btn btn-sm col-md-5">
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_UPLOAD_BOARD_RESOLUTION") ? "block" : "none",

                  color: fieldIconColors.pin
                }}
                onClick={() => {
                  setOpennedModal("uploadBoardResolution")
                  setLabelValue("NWL_UPLOAD_BOARD_RESOLUTION"),
                    setSmShow(true),
                    setDocModal(true),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.boardResolutionDoc : null);
                }}
              ></ReportProblemIcon>
            </div>
          {/* </Fragment>
         } */}

            {/* </div> */}

          </div>

             
            </div>
            <div className="col col-4">
            <div>
             <h2 style={{ display: "flex" }}>
                {`${t("NWL_CONSENT_OF_ARCHITECT_ALONG")}`}
                {/* Upload Board resolution  */}
              </h2>
          </div>
          <div className={classes.fieldContainer}>
         
         {/* {
          personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution && 
          <Fragment> */}
            <div className="btn btn-sm col-md-2">
              <IconButton
             
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.architectDegreeCertificate) getDocShareholding(personalinfo?.architectDegreeCertificate, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <Visibility color="info" className="icon" /></IconButton>

            </div>
            <div className="btn btn-sm col-md-5">
              <IconButton
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.architectDegreeCertificate) getDocShareholding(personalinfo?.architectDegreeCertificate, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <FileDownload color="primary" className="mx-1" />
              </IconButton>
            </div>
            <div className="btn btn-sm col-md-5">
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_CONSENT_OF_ARCHITECT_ALONG") ? "block" : "none",

                  color: fieldIconColors.pin
                }}
                onClick={() => {
                  setOpennedModal("uploadBoardResolution")
                  setLabelValue("NWL_CONSENT_OF_ARCHITECT_ALONG"),
                    setSmShow(true),
                    setDocModal(true),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.architectDegreeCertificate : null);
                }}
              ></ReportProblemIcon>
            </div>
          {/* </Fragment>
         } */}

            {/* </div> */}

          </div>





              {/* <h2 style={{ display: "flex" }}>
                {`${t("NWL_CONSENT_OF_ARCHITECT_ALONG")}`}
            
              </h2>
              <label>
                <FileDownload style={{ cursor: "pointer" }} color="primary" />
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept="application/pdf/jpeg/png"
                  onChange={(e) => getDocumentData(e?.target?.files[0], "architectDegreeCertificate")}
                />
              </label>

              {watch("architectDegreeCertificate") && (
                <a onClick={() => getDocShareholding(watch("architectDegreeCertificate"), setLoader)} className="btn btn-sm ">
                  <Visibility color="info" className="icon" />
                </a>
              )} */}
            </div>
            <div className="col col-4">

            <div>
             <h2 style={{ display: "flex" }}>
             {`${t("NWL_CONSENT_OF_ENGINEER")}`}
                {/* Upload Board resolution  */}
              </h2>
          </div>
          <div className={classes.fieldContainer}>
         
         {/* {
          personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution && 
          <Fragment> */}
            <div className="btn btn-sm col-md-2">
              <IconButton
             
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.engineerDegreeCertificate) getDocShareholding(personalinfo?.engineerDegreeCertificate, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <Visibility color="info" className="icon" /></IconButton>

            </div>
            <div className="btn btn-sm col-md-5">
              <IconButton
                style={{
                  color: " #1266af",
                  fontSize: " 12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  if (personalinfo?.engineerDegreeCertificate) getDocShareholding(personalinfo?.engineerDegreeCertificate, setLoader);
                  else setShowToastError({ label: "No Document here", error: true, success: false });
                }}
              >
                <FileDownload color="primary" className="mx-1" />
              </IconButton>
            </div>
            <div className="btn btn-sm col-md-5">
              <ReportProblemIcon
                style={{
                  display: hideRemarksPatwari && showReportProblemIcon("NWL_CONSENT_OF_ENGINEER") ? "block" : "none",

                  color: fieldIconColors.pin
                }}
                onClick={() => {
                  setOpennedModal("uploadBoardResolution")
                  setLabelValue("NWL_CONSENT_OF_ENGINEER"),
                    setSmShow(true),
                    setDocModal(true),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.engineerDegreeCertificate : null);
                }}
              ></ReportProblemIcon>
            </div>
          {/* </Fragment>
         } */}

            {/* </div> */}

          </div>





              {/* New */}
              {/* <h2 style={{ display: "flex" }}>
                {`${t("NWL_CONSENT_OF_ENGINEER")}`}
               
              </h2>
              <label>
                <FileDownload style={{ cursor: "pointer" }} color="primary" />
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept="application/pdf/jpeg/png"
                  onChange={(e) => getDocumentData(e?.target?.files[0], "engineerDegreeCertificate")}
                />
              </label>

              {watch("engineerDegreeCertificate") && (
                <a onClick={() => getDocShareholding(watch("engineerDegreeCertificate"), setLoader)} className="btn btn-sm ">
                  <Visibility color="info" className="icon" />
                </a>
              )} */}
            </div>
          </Row>


      {/* <Row>
      <Col md={4} xxl lg="4">
          <div>
          
            
            <label htmlFor="PAN" >
                            {`${t("NWL_APPLICANT_BOARD_RESOLUTION")}`}
                            <span class="text-danger font-weight-bold mx-2">*</span>
                          </label>
          </div>

          <div className={classes.fieldContainer}>
           <div className="btn btn-sm col-md-2">
              <IconButton onClick={() => getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution)}>
                <Visibility color="info" className="icon" /></IconButton>

            </div>
            <div className="btn btn-sm col-md-5">
              <IconButton onClick={() => getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution)}>
                <FileDownload color="primary" className="mx-1" />
              </IconButton>
            </div>
            <div className="btn btn-sm col-md-5">
              <ReportProblemIcon
                style={{
                 display: hideRemarksPatwari && showReportProblemIcon("Board resolution of authorised signatory (Upload copy)") ? "block" : "none",

                  color: fieldIconColors.pin
                }}
                onClick={() => {
                  setOpennedModal("uploadBoardResolution")
                  setLabelValue("Board Resolution"),
                    setSmShow(true),
                    console.log("modal open"),
                    setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution : null);
                }}
              ></ReportProblemIcon>
            </div>

          </div>
        </Col>
      </Row> */}
      {/* <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              
              <h5 className={classes.formLabel} >Tehsil &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
         <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.tehsil : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.tehsil}}
              onClick={() => {
                setOpennedModal("tehsil")
                setLabelValue("Tehsil"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.tehsil : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              
              <h5 className={classes.formLabel} >District &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.district : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.district}}
              onClick={() => {
                setOpennedModal("district")
                setLabelValue("District"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.district : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
        
              <h5 className={classes.formLabel} >State &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
        
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.state : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.state}}
              onClick={() => {
                setOpennedModal("state")
                setLabelValue("State"), setSmShow(true), console.log("modal open"), setFieldValue(personalinfo !== null ? personalinfo.state : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row> */}
      {/* <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Status (Individual/ Company/ Firm/ LLP etc.)">
   
              <h5 className={classes.formLabel} >Individual/ Company/ LLP &nbsp;</h5>
            
            </Form.Label>
          </div>
          
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.status : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks?"none":"block",
                color: fieldIconColors.type }}
              onClick={() => {
                setOpennedModal("type")
                setLabelValue("Status (Individual/ Company/ Firm/ LLP etc.)"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.status : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
       
              <h5 className={classes.formLabel} >LC-I signed by &nbsp;</h5>
            </Form.Label>
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.LC : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.lciSignedBy }}
              onClick={() => {
                setOpennedModal("lciSignedBy")
                setLabelValue("LC-I signed by"), setSmShow(true), console.log("modal open");
               
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              
              <h5 className={classes.formLabel} >Address for communication &nbsp;</h5>
            </Form.Label>
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.address : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.addressForCommunication }}
              onClick={() => {
                setOpennedModal("addressForCommunication")
                setLabelValue("Address for communication"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.address : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
       <Col md={4} xxl lg="4">
          <div>
            <Form.Label
              data-toggle="tooltip"
              data-placement="top"
              title="Permanent address in case of individual/ registered office address in case other than individual"
            >
            
              <h5 className={classes.formLabel} >Permanent Address/registered</h5>
            
            </Form.Label>
          </div>
          
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.permanentAddress : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.parmanentAddress }}
              onClick={() => {
                setOpennedModal("parmanentAddress")
                setLabelValue("Permanent address in case of individual/ registered office address in case other than individual"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.address : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        
      
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Name of the authorized person to sign the application">
              <h5 className={classes.formLabel} >Name of Authorized person</h5>
            </Form.Label>
          </div>

          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorized : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.authorized }}
              onClick={() => {
                setOpennedModal("authPerson")
                setLabelValue("Name of the authorized person to sign the application"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorized : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      
      </Row> */}
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

    </Form.Group>
  );
};

export default PersonalinfoChild;
