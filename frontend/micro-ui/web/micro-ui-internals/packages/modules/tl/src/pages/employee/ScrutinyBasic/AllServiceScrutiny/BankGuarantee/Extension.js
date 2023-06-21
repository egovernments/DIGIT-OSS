import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyles } from "../../css/personalInfoChild.style";
import Collapse from "react-bootstrap/Collapse";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import { useTranslation } from "react-i18next";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";
import ModalChild from "../../Remarks/ModalChild";

function Extension ({ apiResponse, refreshScrutinyData, applicationNumber, passUncheckedList, passCheckedList, dataForIcons,applicationStatus }) {
  const userRoles = Digit.UserService.getUser()?.info?.roles.map((item) => item.code) || [];
  const showActionButton = userRoles.includes("AO_HQ");
  const showActionButton1 = userRoles.includes("CAO");
 const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [licenseData, setLicenseData] = useState();
  const { id } = useParams();
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const { t } = useTranslation();
  const { pathname: url } = useLocation();
  const [open, setOpen] = useState(false);
   const [open4, setOpen4] = useState(false);
   const [open3, setOpen3] = useState(false);
  const [open2, setOpen2] = useState(false);
  // const applicationStatus = props.applicationStatus;
  // const [applicationNumber, setApplicationNumber] = useState();
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
 const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };
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
 const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
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
    // if (openedModal && data) {
    //   setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    // }
    setOpennedModal("");
    setLabelValue("");
  };
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");
useEffect(() => {
    console.log("logger123...",dataForIcons)
  }, [dataForIcons])

   const [loader, setLoading] = useState(false);
  

  const setExtensionData = (details) => {
    setValue("bgNumber", details?.bgNumber);
    setValue("issuingBank", details?.issuingBank);
    setValue("validity", details?.validity);
    setValue("claimPeriod", details?.claimPeriod);
    setValue("amountInFig", details?.amountInFig);
    setValue("originCountry", details?.originCountry);
    setValue("amountInWords", details?.amountInWords);
    setValue("dateOfAmendment", details?.dateOfAmendment);
    setValue("amendmentExpiryDate", details?.amendmentExpiryDate);
    setValue("amendmentClaimExpiryDate", details?.amendmentClaimExpiryDate);
    setValue("originCountry", details?.originCountry);
    setValue("licenseApplied", details?.licenseApplied);
    setValue("bankGurenteeCertificateDescription", details?.bankGurenteeCertificateDescription);
    setValue("bankGurenteeCertificate", details?.bankGurenteeCertificate);
    setValue("anyOtherDocumentDescription", details?.anyOtherDocumentDescription);
    setValue("anyOtherDocument", details?.anyOtherDocument);
  }

   useEffect(() => {
    if (apiResponse) {
      setExtensionData(apiResponse)
    }
  }, [apiResponse])
 const findfisrtObj = (list = [], label) => {
    return list?.filter((item, index) => item.fieldIdL === label)?.[0] || {}
  }

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

  useEffect(()=>{
    if(labelValue){
      setSelectedFieldData(findfisrtObj(dataForIcons?.egScrutiny,labelValue))
    } else {
      setSelectedFieldData(null)
    }
    console.log("regergerg",labelValue,selectedFieldData)
  },[labelValue])
  

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
                    <input  className="form-control" disabled placeholder="" {...register("bgNumber")} />

                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_NO')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('MY_APPLICATION_BG_GUARANTEE_NO'));
                                setLabelValue(t('MY_APPLICATION_BG_GUARANTEE_NO'));
                                setSmShow(true),
                               setFieldValue(watch('bgNumber') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input  className="form-control" disabled placeholder="" {...register("issuingBank")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t("MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE")),
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal(t('MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE'));
                                setLabelValue(t('MY_APPLICATION_BG_GUARANTEE_ISSUE_DATE'));
                                setSmShow(true),
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
                    <input  className="form-control" disabled placeholder="" {...register("validity")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('BG_SUBMIT_EXPIRY_DATE')),
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal(t('BG_SUBMIT_EXPIRY_DATE'));
                                setLabelValue(t('BG_SUBMIT_EXPIRY_DATE'));
                                 setSmShow(true),
                                 console.log("modal open")
                                 setFieldValue(watch('validity') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE")}`}</h2>
                            </Form.Label>
                          </div>
                           <div className=" d-flex align-items-center">
                    <input  className="form-control" disabled placeholder="" {...register("claimPeriod")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE'));
                                setLabelValue(t('MY_APPLICATION_BG_GUARANTEE_CLAIM_EXPIRY_DATE')); setSmShow(true), console.log("modal open"),  setFieldValue(watch('claimPeriod') || null);
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
                    <input className="form-control" disabled placeholder="" {...register("amountInFig")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_AMOUNT')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('MY_APPLICATION_BG_GUARANTEE_AMOUNT'));
                                setLabelValue(t('MY_APPLICATION_BG_GUARANTEE_AMOUNT')); setSmShow(true), console.log("modal open"), setFieldValue(watch('amountInFig') || null);;
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
                    <input  className="form-control" disabled placeholder="" {...register("issuingBank")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_ISSUING_BANK')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('EXTENSION_ISSUING_BANK'));
                                setLabelValue(t('EXTENSION_ISSUING_BANK')), setSmShow(true), console.log("modal open"),  setFieldValue(watch('issuingBank') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("BG_SUBMIT_COUNTRY_ORIGIN")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input className="form-control" disabled placeholder="" {...register("originCountry")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('BG_SUBMIT_COUNTRY_ORIGIN')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('BG_SUBMIT_COUNTRY_ORIGIN'));
                                setLabelValue(t('BG_SUBMIT_COUNTRY_ORIGIN')), setSmShow(true), console.log("modal open"), setFieldValue(watch('originCountry') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input  className="form-control" disabled placeholder="" {...register("amountInWords")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('BG_SUBMIT_AMOUNT_IN_WORDS')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('BG_SUBMIT_AMOUNT_IN_WORDS'));
                                setLabelValue(t('BG_SUBMIT_AMOUNT_IN_WORDS')), setSmShow(true), console.log("modal open"), setFieldValue(watch('amountInWords') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
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
        {open3 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
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
                    <input className="form-control" disabled placeholder="" {...register("bgNumber")} />
                            <ReportProblemIcon
                              style={{
                                 color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_NO')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('MY_APPLICATION_BG_GUARANTEE_NO'));
                                setLabelValue(t('MY_APPLICATION_BG_GUARANTEE_NO')); setSmShow(true), console.log("modal open"), setFieldValue(watch('bgNumber') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
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
                                setOpennedModal(t('EXTENSION_DATE_OF_AMENDMENT'));
                                setLabelValue(t('EXTENSION_DATE_OF_AMENDMENT')); setSmShow(true), console.log("modal open"), setFieldValue(watch('dateOfAmendment') || null);
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
                    <input className="form-control" disabled placeholder="" {...register("amendmentExpiryDate")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_AMENDMENT_EXPIRY_DATE')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('EXTENSION_AMENDMENT_EXPIRY_DATE'));
                                setLabelValue(t('EXTENSION_AMENDMENT_EXPIRY_DATE')); setSmShow(true), console.log("modal open"), setFieldValue(watch('amendmentExpiryDate') || null);
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
                    <input  className="form-control" disabled placeholder="" {...register("amendmentClaimExpiryDate")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_AMENDMENT_CLAIM_EXPIRY_DATE')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('EXTENSION_AMENDMENT_CLAIM_EXPIRY_DATE'));
                                setLabelValue(t('EXTENSION_AMENDMENT_CLAIM_EXPIRY_DATE')); setSmShow(true), console.log("modal open"), setFieldValue(watch('amendmentClaimExpiryDate') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
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
                    <input className="form-control" disabled placeholder="" {...register("amountInFig")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('MY_APPLICATION_BG_GUARANTEE_AMOUNT')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('MY_APPLICATION_BG_GUARANTEE_AMOUNT'));
                                setLabelValue(t('MY_APPLICATION_BG_GUARANTEE_AMOUNT')); setSmShow(true), console.log("modal open"), setFieldValue(watch('amountInFig') || null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_ISSUING_BANK")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className=" d-flex align-items-center">
                    <input className="form-control" disabled placeholder="" {...register("issuingBank")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_ISSUING_BANK')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('EXTENSION_ISSUING_BANK'));
                                setLabelValue(t('EXTENSION_ISSUING_BANK')); setSmShow(true), console.log("modal open"), setFieldValue(watch('issuingBank') || null);
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
                                setOpennedModal(t('BG_SUBMIT_COUNTRY_ORIGIN'));
                                setLabelValue(t('BG_SUBMIT_COUNTRY_ORIGIN')); setSmShow(true), console.log("modal open"), setFieldValue(watch('originCountry') || null);
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
                                setOpennedModal(t('BG_SUBMIT_AMOUNT_IN_WORDS'));
                                setLabelValue(t('BG_SUBMIT_AMOUNT_IN_WORDS')); setSmShow(true), console.log("modal open"), setFieldValue(watch('amountInWords') || null);
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
                    <input  className="form-control" disabled placeholder="" {...register("licenseApplied")} />

                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('BG_SUBMIT_HARDCOPY_SUBMITTED_TCP')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('BG_SUBMIT_HARDCOPY_SUBMITTED_TCP'));
                                setLabelValue(t('BG_SUBMIT_HARDCOPY_SUBMITTED_TCP')); setSmShow(true), console.log("modal open"), setFieldValue(watch('licenseApplied') || null);
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
                                setOpennedModal(t('EXTENSION_BANK_GUARANTEE_PDF'));
                                setLabelValue(t('EXTENSION_BANK_GUARANTEE_PDF')); setSmShow(true), console.log("modal open"), setFieldValue(watch('bankGurenteeCertificateDescription') || null);
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
                    <input  className="form-control" disabled placeholder="" {...register("bankGurenteeCertificateDescription")} />
                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('EXTENSION_BANK_GUARANTEE_PDF')),
                              }}
                              onClick={() => {
                                setOpennedModal(t('EXTENSION_BANK_GUARANTEE_PDF'));
                                setLabelValue(t('EXTENSION_BANK_GUARANTEE_PDF')); setSmShow(true), console.log("modal open"), setFieldValue(watch('bankGurenteeCertificateDescription') || null);
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
                                setOpennedModal(t('EXTENSION_ANY_OTHER_DOC_PDF'));
                                setLabelValue(t('EXTENSION_ANY_OTHER_DOC_PDF')); setSmShow(true), console.log("modal open"), setFieldValue(watch('bankGurenteeCertificateDescription') || null);
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
                                setOpennedModal(t('EXTENSION_BANK_GUARANTEE_PDF'));
                                setLabelValue(t('EXTENSION_BANK_GUARANTEE_PDF')); setSmShow(true), console.log("modal open"), setFieldValue(watch('anyOtherDocumentDescription') || null);
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
