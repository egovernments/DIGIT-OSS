import React, { useState, useEffect, useTransition } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ModalChild from "../../Remarks/ModalChild";
import Collapse from "react-bootstrap/Collapse";
import { useStyles } from "../../css/personalInfoChild.style";
import "../../css/personalInfoChild.style.js";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";
import { useTranslation } from "react-i18next";
import OutlinedInput from "@mui/material/OutlinedInput";

function Release (props) {
   const userRoles = Digit.UserService.getUser()?.info?.roles.map((item) => item.code) || [];
  const showActionButton = userRoles.includes("AO_HQ");
  const showActionButton1 = userRoles.includes("CAO");
  const {t}=useTranslation();
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
   const [open, setOpen] = useState(false);
   const [open4, setOpen4] = useState(false);
   const [open3, setOpen3] = useState(false);
  const [open2, setOpen2] = useState(false);
  const apiResponse = props.apiResponse;
const classes = useStyles();
  const [applicationNumber, setApplicationNumber] = useState();
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  // let user = Digit.UserService.getUser();
  // const userRoles = user?.info?.roles?.map((e) => e.code);
  // const showRemarks = userRoles.includes("AO_HQ");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
const dataIcons = props.dataForIcons;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useForm({
    mode: "onChange",

    shouldFocusError: true,
  });

  const Release = (data) => console.log(data);

 
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602",
  };
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
  const [openedModal, setOpennedModal] = useState("");
  const [fieldIconColors, setFieldIconColors] = useState({
    issuingBank: Colors.info,
    bgNumber: Colors.info,
    validity: Colors.info,
    claimPeriod: Colors.info,
    amountInFig: Colors.info,
    amountInWords: Colors.info,
    typeOfBg: Colors.info,
    bankGuaranteeReplacedWith: Colors.info,
    reasonForReplacement: Colors.info,
    applicationCerficifate: Colors.info,
    applicationCerficifateDescription: Colors.info,
    anyOtherDocumentDescription: Colors.info,
    releaseCertificate: Colors.info,
  });

  const fieldIdList = [
    { label: " Do you want to Replace B.G.?", key: "issuingBank" },
    { label: "Enter Bank Guarantee No.", key: "bgNumber" },
    { label: "Type of B.G.", key: "validity" },
    { label: " Upload New B.G. softcopy ", key: "claimPeriod" },
    { label: "Full Completion Certificate.", key: "amountInFig" },
    { label: " Amount", key: "amountInWords" },
    { label: "Partial Completion Certificate.", key: "typeOfBg" },
    { label: "Partial Completion Certificate.", key: "bankGuaranteeReplacedWith" },
    { label: "Partial Completion Certificate.", key: "reasonForReplacement" },
    { label: "Partial Completion Certificate.", key: "applicationCerficifate" },
    { label: "Partial Completion Certificate.", key: "applicationCerficifateDescription" },
    { label: "Partial Completion Certificate.", key: "anyOtherDocumentDescription" },
    { label: "Partial Completion Certificate.", key: "releaseCertificate" },
  ];
  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === item.label);
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
    getColorofFieldIcon();
    console.log("repeating1...");
  }, [dataIcons]);

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === labelValue);
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue]);


  const item = props.ApiResponseData;
  console.log("digit2...........", apiResponse);


  return (
    <form onSubmit={handleSubmit(Release)}>
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
          - Release
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card
          // style={{ width: "126%", border: "5px solid #1266af" }}
          >
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Release of Bank Guarantee</h4>
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.bgNumber} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.bgNumber,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("bgNumber");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(bgNumber);
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.issuingBank} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.issuingBank,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("issuingBank");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(issuingBank);
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.validity} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.validity,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("validity");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(validity);
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.claimPeriod} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.claimPeriod,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("claimPeriod");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(claimPeriod);
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.amountInFig} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.amountInFig,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("amountInFig");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(amountInFig);
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.amountInWords} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.amountInWords,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("amountInWords");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(amountInWords);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                           <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("RELEASE_BG")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.releaseCertificate} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.releaseCertificate,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("releaseCertificate");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(releaseCertificate);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                        </Form.Group>
                         <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>Bank Guarantee replaced with</h2>
                            </Form.Label>
                          </div>
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.bankGuaranteeReplacedWith} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.bankGuaranteeReplacedWith,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("bankGuaranteeReplacedWith");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(bankGuaranteeReplacedWith);
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
                              <h2>{`${t("RELEASE_BG_REASON_FOR_REPLACEMENT")}`}</h2>
                            </Form.Label>
                          </div>
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.reasonForReplacement} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.reasonForReplacement,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("reasonForReplacement");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(reasonForReplacement);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("reasonForReplacement")} /> */}
                        </Form.Group>
                        </Row>
            <br></br>
            </div>
            </Collapse>
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
                              <h2>{`${t("RELEASE_APPLICATION_PDF")}`}</h2>
                               <ReportProblemIcon
                              style={{
                                color: fieldIconColors.bankGurenteeCertificateDescription,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("bankGurenteeCertificateDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(bankGurenteeCertificateDescription);
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.bankGurenteeCertificateDescription} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.bankGurenteeCertificateDescription,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("bankGurenteeCertificateDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(bankGurenteeCertificateDescription);
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
                              <h2>{`${t("RELEASE_COMPLETION_CERTIFICATE_PDF")}`}</h2>
                               <ReportProblemIcon
                              style={{
                                color: fieldIconColors.bankGurenteeCertificateDescription,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("bankGurenteeCertificateDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(bankGurenteeCertificateDescription);
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.bankGurenteeCertificateDescription} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.bankGurenteeCertificateDescription,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("bankGurenteeCertificateDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(bankGurenteeCertificateDescription);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </Form.Group>
                       
                        </Row>
                                 </td>
                                 <td></td>
                          </tr>
                           <tr>
                            <td>3</td>
                             <td>
                                 <Row className="col-12">
                       <Form.Group as={Col} controlId="formGridLicence">
                          <div>
                            <Form.Label>
                              <h2>{`${t("EXTENSION_ANY_OTHER_DOC_PDF")}`}</h2>
                               <ReportProblemIcon
                              style={{
                                color: fieldIconColors.anyOtherDocumentDescription,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("anyOtherDocumentDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(anyOtherDocumentDescription);
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
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.anyOtherDocumentDescription} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.anyOtherDocumentDescription,
                                // display: showRemarks ? "none" : "block",
                              }}
                              onClick={() => {
                                setOpennedModal("anyOtherDocumentDescription");
                                setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(anyOtherDocumentDescription);
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

export default Release;
