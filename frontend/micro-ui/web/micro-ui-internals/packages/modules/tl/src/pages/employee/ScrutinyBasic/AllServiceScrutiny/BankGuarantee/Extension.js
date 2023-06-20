import React, { useState, useEffect, useTransition } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import { IconButton } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Visibility from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
// import ModalChild from "../../Remarks/ModalChild";
import Collapse from "react-bootstrap/Collapse";
import { useStyles } from "../../css/personalInfoChild.style";
import "../../css/personalInfoChild.style.js";
import { FormHelperText,IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useTranslation } from "react-i18next";
import ModalChild from "../../Remarks/ModalChild";



function Extension (props) {
  const userRoles = Digit.UserService.getUser()?.info?.roles.map((item) => item.code) || [];
  const showActionButton = userRoles.includes("AO_HQ");
  const showActionButton1 = userRoles.includes("CAO");
  const {t}=useTranslation();
  console.log("Externaldata", userRoles);
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
 const apiData = props.apiResponse;
  const [open, setOpen] = useState(false);
   const [open4, setOpen4] = useState(false);
   const [open3, setOpen3] = useState(false);
  const [open2, setOpen2] = useState(false);
  const classes = useStyles();
  const applicationStatus = props.applicationStatus;
  // const [applicationNumber, setApplicationNumber] = useState();
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
// const dataIcons = props.dataForIcons;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useForm({});

  const Extension = (data) => {
    console.log(data);
  };
 

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
 const Colors = {
    Conditional: "#2874A6",
    approved: "#09cb3d",
    disapproved: "#ff0000",
      info: "#FFB602"
  }
 
  const handleClose = () => {
    setOpen(false);
    window.location.href = `/digit-ui/employee`;
  };
  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    }
    setOpennedModal("");
    setLabelValue("");
  };
  
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
   const [loader, setLoading] = useState(false);
  const [openedModal, setOpennedModal] = useState("");
  const [fieldIconColors, setFieldIconColors] = useState({
    bgNumber: Colors.info,
    issuingBank: Colors.info,
    validity: Colors.info,
    claimPeriod: Colors.info,
    issuingBank: Colors.info,
    amountInFig: Colors.info,
    originCountry: Colors.info,
    amountInWords: Colors.info,
    dateOfAmendment: Colors.info,
    amendmentExpiryDate: Colors.info,
    amendmentClaimExpiryDate: Colors.info,
    licenseApplied: Colors.info,
    anyOtherDocumentDescription: Colors.info,
    bankGurenteeCertificateDescription: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info,
  });
    const getIconColor = (label) => {
    if (findfisrtObj(dataForIcons?.egScrutiny, label)?.isApproved === 'In Order') {
      return Colors.approved;
    }
    if (findfisrtObj(dataForIcons?.egScrutiny, label)?.isApproved === 'Not In Order') {
      return Colors.disapproved;
    }
    if (findfisrtObj(dataForIcons?.egScrutiny, label)?.isApproved === "Conditional") {
      return Colors.conditional;
    }
    return Colors.info
  }

  const findfisrtObj = (list = [], label) => {
    return list?.filter((item, index) => item.fieldIdL === label)?.[0] || {}
  }

  const fieldIdList = [
    { label: "Bank Guarantee Number", key: "bgNumber" },
    // { label: "Authorized Person Name", key: "issuingBank" },
    // { label: "Autrhoized Mobile No", key: "validity" },
    // { label: "Authorized MobileNo. 2 ", key: "claimPeriod" },
    // { label: "Email ID", key: "amountInFig" },
    // { label: "PAN No.", key: "issuingBank" },
    // { label: "Address  1", key: "originCountry" },
    // { label: "Village/City", key: "amountInWords" },
    // { label: "Pincode", key: "dateOfAmendment" },
    // { label: "Tehsil", key: "amendmentExpiryDate" },
    // { label: "District", key: "amendmentClaimExpiryDate" },
    // { label: "State", key: "licenseApplied" },
    // { label: "Status (Individual/ Company/ Firm/ LLP etc.)", key: "anyOtherDocumentDescription" },
    // { label: "LC-I signed by", key: "bankGurenteeCertificateDescription" },
    // { label: "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)", key: "lciNotSigned" },
    // { label: "Permanent address in case of individual/ registered office address in case other than individual", key: "parmanentAddress" },
    // { label: "Address for communication", key: "addressForCommunication" },
    // { label: "Name of the authorized person to sign the application", key: "authPerson" },
    // { label: "Email ID for communication", key: "emailForCommunication" },
  ];
  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };
  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons?.egScrutiny.filter((ele) => ele.fieldIdL === item.label);
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = {
            ...tempFieldColorState,
            [item.key]:
              fieldPresent[0].isApproved === "approved"
                ? Colors.approved
                : fieldPresent[0].isApproved === "disapproved"
                ? Colors.disapproved
                : fieldPresent[0].isApproved === "conditional"
                ? Colors.conditional
                : Colors.info,
          };
        }
      }
    });

    setFieldIconColors(tempFieldColorState);
  };
   useEffect(() => {
    if (apiResponse) {
      setExtensionData(apiResponse)
    }
  }, [apiResponse])

 useEffect(() => {
    if (apiData) {
    setValue("bgNumber", apiData?.bgNumber);
    // setValue("caseNo", details?.caseNo);
    // setValue("naturePurpose", details?.naturePurpose);
    // setValue("totalAreaSq", details?.totalAreaSq);
    // setValue("cluDate", details?.cluDate);
    // setValue("applicantName", details?.applicantName);
    // setValue("expiryClu", details?.expiryClu);
    // setValue("stageConstruction", details?.stageConstruction);
    // setValue("mobile", details?.mobile);
    // setValue("emailAddress", details?.emailAddress);
    // setValue("address", details?.address);
    // setValue("village", details?.village);
    // setValue("pinCode", details?.pinCode);
    // setValue("tehsil", details?.tehsil);
    // setValue("reasonDelay", details?.reasonDelay);
    // setValue("buildingPlanApprovalStatus", details?.buildingPlanApprovalStatus);
    // setValue("zoningPlanApprovalDate", details?.zoningPlanApprovalDate);
    // setValue("dateOfSanctionBuildingPlan", details?.dateOfSanctionBuildingPlan);
    // setValue("appliedFirstTime", details?.appliedFirstTime);
    // setValue("uploadbrIIIfileUrl", details?.uploadbrIIIfileUrl);
    // setValue("cluPermissionLetterfileUrl", details?.cluPermissionLetterfileUrl);
    // setValue("uploadPhotographsfileUrl", details?.uploadPhotographsfileUrl);
    // setValue("receiptApplicationfileUrl", details?.receiptApplicationfileUrl);
    // setValue("uploadBuildingPlanfileUrl", details?.uploadBuildingPlanfileUrl);
    // setValue("indemnityBondfileUrl", details?.indemnityBondfileUrl);
  }
}, [apiData]);

  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...");
  }, [dataIcons]);

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons?.egScrutiny.filter((ele) => ele.fieldIdL === labelValue);
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue]);

  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };


  return (
    <form onSubmit={handleSubmit(Extension)}>
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
          - Extension
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
       <ModalChild
                labelmodal={labelValue}
                passmodalData={handlemodaldData}
                displaymodal={smShow}
                onClose={() => setSmShow(false)}
                selectedFieldData={selectedFieldData}
                fieldValue={fieldValue}
                remarksUpdate={currentRemarks}
                applicationStatus={applicationStatus}
              ></ModalChild>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card
          //   style={{ width: "126%", border: "5px solid #1266af" }}
          >
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension of Bank Guarantee</h4>
            <br></br>
<div
        className="collapse-header"
        onClick={() => setOpen4(!open4)}
        aria-controls="example-collapse-text"
        aria-expanded={open4}
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
          - BG Detail
        </span>
        {open4 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open4}>
        <div className="card">
                      <Row className="col-12">
                       <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("MY_APPLICATION_BG_GUARANTEE_NO")}`}</h2>
                            </Form.Label>
                          </div>
                           <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("bgNumber")} />
                          {/* <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.bgNumber} disabled></Form.Control> */}

                            <ReportProblemIcon
                              style={{
                                // color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_NO')),
                                color: fieldIconColors.bgNumber,
                                // display: showRemarks ? "none" : "block", 
                              }}
                              onClick={() => {
                                setOpennedModal("bgNumber")
                                setLabelValue(t('MY_APPLICATION_BG_GUARANTEE_NO'))
                                setSmShow(true)
                                setFieldValue(apiData !== null ? apiData.bgNumber : null);
                              //  setFieldValue(watch('bgNumber') || null);
                                // setFieldValue(apiResponse?.bgNumber);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("issuingBank")} />
                          {/* <div className={classes.fieldContainer}> */}
                            {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.issuingBank} disabled></Form.Control> */}

                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t("MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE")),
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("issuingBank")
                                setLabelValue("Amount (in fig)")
                                setSmShow(true)
                                 console.log("modal open")
                                 setFieldValue(watch('issuingBank') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("BG_SUBMIT_EXPIRY_DATE")}`}</h2>
                            </Form.Label>
                          </div>
                           <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("validity")} />
                          {/* <div className={classes.fieldContainer}> */}
                            {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.validity} disabled></Form.Control> */}

                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('BG_SUBMIT_EXPIRY_DATE')),
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("validity")
                                setLabelValue("Amount (in fig)")
                                 setSmShow(true)
                                 console.log("modal open")
                                 setFieldValue(watch('validity') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE")}`}</h2>
                            </Form.Label>
                          </div>
                           <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("claimPeriod")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE')),
                              }}
                              onClick={() => {
                                setOpennedModal("claimPeriod");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"),  setFieldValue(watch('claimPeriod') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                        </Row>
                         <Row className="col-12">
                           <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("MY_APPLICATION_BG_GUARANTEE_AMOUNT")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("amountInFig")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_AMOUNT')),
                              }}
                              onClick={() => {
                                setOpennedModal("amountInFig");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('amountInFig') || null);;
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_ISSUING_BANK")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("issuingBank")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_ISSUING_BANK')),
                              }}
                              onClick={() => {
                                setOpennedModal("issuingBank");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"),  setFieldValue(watch('issuingBank') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("BG_SUBMIT_COUNTRY_ORIGIN")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("originCountry")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('BG_SUBMIT_COUNTRY_ORIGIN')),
                              }}
                              onClick={() => {
                                setOpennedModal("originCountry");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('originCountry') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("amountInWords")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('BG_SUBMIT_AMOUNT_IN_WORDS')),
                              }}
                              onClick={() => {
                                setOpennedModal("amountInWords");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('amountInWords') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                        </Row>
            <br></br>
            </div>
            </Collapse>

            <div
        className="collapse-header"
        onClick={() => setOpen3(!open3)}
        aria-controls="example-collapse-text"
        aria-expanded={open3}
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
          - BG Detail
        </span>
        {open4 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open3}>
        <div className="card">
                      <Row className="col-12">
                       <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("MY_APPLICATION_BG_GUARANTEE_NO")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("bgNumber")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_NO')),
                              }}
                              onClick={() => {
                                setOpennedModal("bgNumber");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('bgNumber') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_DATE_OF_AMENDMENT")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("dateOfAmendment")} />

                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_DATE_OF_AMENDMENT')),
                              }}
                              onClick={() => {
                                setOpennedModal("dateOfAmendment");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('dateOfAmendment') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_AMENDMENT_EXPIRY_DATE")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("amendmentExpiryDate")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_AMENDMENT_EXPIRY_DATE')),
                              }}
                              onClick={() => {
                                setOpennedModal("amendmentExpiryDate");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('amendmentExpiryDate') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_AMENDMENT_CLAIM_EXPIRY_DATE")}`}</h2>
                            </Form.Label>
                          </div>
                           <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("amendmentClaimExpiryDate")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_AMENDMENT_CLAIM_EXPIRY_DATE')),
                              }}
                              onClick={() => {
                                setOpennedModal("amendmentClaimExpiryDate");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('amendmentClaimExpiryDate') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                        </Row>
                         <Row className="col-12">
                           <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("MY_APPLICATION_BG_GUARANTEE_AMOUNT")}`}</h2>
                            </Form.Label>
                          </div>
                           <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("amountInFig")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_AMOUNT')),
                              }}
                              onClick={() => {
                                setOpennedModal("amountInFig");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('amountInFig') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_ISSUING_BANK")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("issuingBank")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_ISSUING_BANK')),
                              }}
                              onClick={() => {
                                setOpennedModal("issuingBank");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('issuingBank') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("BG_SUBMIT_COUNTRY_ORIGIN")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("originCountry")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('BG_SUBMIT_COUNTRY_ORIGIN')),
                              }}
                              onClick={() => {
                                setOpennedModal("originCountry");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('originCountry') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("amountInWords")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('BG_SUBMIT_AMOUNT_IN_WORDS')),
                              }}
                              onClick={() => {
                                setOpennedModal("amountInWords");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('amountInWords') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                        </Row>
            <br></br>
            </div>
            </Collapse>

            <br></br>
               <Row className="col-12">
                       <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("BG_SUBMIT_HARDCOPY_SUBMITTED_TCP")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("licenseApplied")} />

                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('BG_SUBMIT_HARDCOPY_SUBMITTED_TCP')),
                              }}
                              onClick={() => {
                                setOpennedModal("licenseApplied");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('licenseApplied') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </Form.Group>
                       
                        </Row>
             <br></br>
      <div className="table table-bordered table-responsive">
                        
                        <thead>
                          <tr>
                            <th class="fw-normal">{`${t("EXTENSION_SR_NO")}`}
                            {/* Sr. No. */}
                            </th>
                            <th class="fw-normal">{`${t("EXTENSION_TYPE")}`}</th>
                            <th class="fw-normal">{`${t("EXTENSION_ATTACHMENT_DESCRIPTION")}`}
                            {/* Attachment description */}
                            </th>
                             <th class="fw-normal">Document
                             {/* Upload document */}
                             </th>
                              {/* <th class="fw-normal">{`${t("EXTENSION_ACTION")}`}</th> */}
                          </tr>
                        </thead>
                        <tbody>
                           <tr>
                            <td>1</td>
                              <td>
                                 <Row className="col-12">
                       <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_BANK_GUARANTEE_PDF")}`}</h2>
                               <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_BANK_GUARANTEE_PDF')),
                              }}
                              onClick={() => {
                                setOpennedModal("bankGurenteeCertificateDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('bankGurenteeCertificateDescription') || null);
                              }}
                            ></ReportProblemIcon>
                            </Form.Label>
                          </div>
                        </Form.Group>
                        </Row>
                                </td>
                               <td> 
                                 <Row className="col-12">
                       <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            {/* <Form.Label>
                              <h2>{`${t("EXTENSION_BANK_GUARANTEE_PDF")}`}</h2>
                            </Form.Label> */}
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("bankGurenteeCertificateDescription")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_BANK_GUARANTEE_PDF')),
                              }}
                              onClick={() => {
                                setOpennedModal("bankGurenteeCertificateDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('bankGurenteeCertificateDescription') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </Form.Group>
                       
                        </Row>
                                 </td>
                                 <td></td>
                          </tr>
                           <tr>
                            <td>2</td>
                             <td>
                                 <Row className="col-12">
                       <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_ANY_OTHER_DOC_PDF")}`}</h2>
                               <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_ANY_OTHER_DOC_PDF')),
                              }}
                              onClick={() => {
                                setOpennedModal("bankGurenteeCertificateDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('bankGurenteeCertificateDescription') || null);
                              }}
                            ></ReportProblemIcon>
                            </Form.Label>
                          </div>
                        </Form.Group>
                        </Row>
                                </td>
                                 <td> 
                                 <Row className="col-12">
                       <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            {/* <Form.Label>
                              <h2>{`${t("EXTENSION_BANK_GUARANTEE_PDF")}`}</h2>
                            </Form.Label> */}
                          </div>
                          <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("anyOtherDocumentDescription")} />
                            <ReportProblemIcon
                              style={{
                               color: getIconColor(t('EXTENSION_BANK_GUARANTEE_PDF')),
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("anyOtherDocumentDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(watch('anyOtherDocumentDescription') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </Form.Group>
                       
                        </Row>
                                 </td>
                                {/* <input type="text" className="form-control" {...register("anyOtherDocumentDescription")}></input> */}
                               <td></td>
                          </tr>
                        </tbody>
                        </div>
             
            </Card>
            </div>
            </Collapse>
            </form>
        
  );
};

export default Extension;
