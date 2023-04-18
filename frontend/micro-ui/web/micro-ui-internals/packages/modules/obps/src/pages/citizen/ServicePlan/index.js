import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Dialog, stepIconClasses } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownload from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import Spinner from "../../../components/Loader";
import { Toast } from "@egovernments/digit-ui-react-components";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
// import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

//import { getDocShareholding } from 'packages/modules/tl/src/pages/employee/ScrutinyBasic/ScrutinyDevelopment/docview.helper.js'

const ServicePlanService = () => {
  useTranslation;
  const { t } = useTranslation();
  // const { pathname: url } = useLocation();

  const [file, setFile] = useState(null);
  const [LOINumber, setLOINumber] = useState("");
  const [loiPatternErr, setLoiPatternErr] = useState(false);
  const [selfCertifiedDrawing, setSelfCertifiedDrawing] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [environmental, setEnviromental] = useState("");
  const [gisFormat, setGisFormat] = useState("");
  const [autocad, setAutoCad] = useState("");
  const [certifiedCopy, setCertifiedCopy] = useState("");
  const [drawingErr, setDrawingErr] = useState({
    selfCertifiedDrawingFromEmpaneledDoc: false,
    environmentalClearance: false,
    shapeFileAsPerTemplate: false,
    autoCadFile: false,
    certifieadCopyOfThePlan: false,
    layoutPlan: false,
    revisedLayout: false,
    demarcation: false,
    demarcationgis: false,
    layoutExcel: false,
    anyOtherdoc: false,
  });
  const [layoutPlan, setLayoutplan] = useState("");
  const [revisedLayout, setRevisedLayout] = useState("");
  const [demarcation, setDemarcation] = useState("");
  const [demarcationgis, setDemarcationgis] = useState("");
  const [layoutExcel, setLayoutExcel] = useState("");
  const [anyOtherdoc, setAnyotherDoc] = useState("");
  const [servicePlanRes, setServicePlanRes] = useState("");
  const [submitDataLabel, setSubmitDataLabel] = useState([]);
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
  const [docUpload, setDocuploadData] = useState([]);
  const [open, setOpen] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState();
  const [valid, setValid] = useState([]);
  const [devName, setDevName] = useState("");

  const [purpose, setPurpose] = useState("");
  const [developmentPlan, setDevelopmentPlan] = useState("");
  const [gstnumber, setGSTNumber] = useState("");
  const [totalArea, setTotalArea] = useState("");
  // const [stepData, setStepData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [fileStoreId, setFileStoreId] = useState({});
  const [spaction, setSPAction] = useState("");
  const [comment, setComment] = useState("");
  const [spopen, setSPOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",

    shouldFocusError: true,
  });
  const userInfo = Digit.UserService.getUser();

  const getLoiPattern = (loiNumber) => {
    const pattern = /^(?=\D*\d)(?=.*[/])(?=.*[-])[a-zA-Z0-9\/-]{15,30}$/;
    return pattern.test(loiNumber);
  };

  const checkUploadedImages = (data) => {
    const keys = Object.keys(data);
    const arr = [
      "selfCertifiedDrawingFromEmpaneledDoc",
      "environmentalClearance",
      "shapeFileAsPerTemplate",
      "autoCadFile",
      "certifieadCopyOfThePlan",
    ];
    for (let i = 0; i < arr.length; i++) {
      if (!keys.includes(arr[i])) {
        drawingErr[arr[i]] = true;
        setDrawingErr({ ...drawingErr, [arr[i]]: true });
      }
    }
    return true;
  };

  const checkValid = (data) => {
    let isvalid = false;
    if (getLoiPattern(data?.loiNumber)) {
      isvalid = true;
    } else {
      isvalid = false;
      setLoiPatternErr(true);
      return isvalid;
    }

    if (
      data.hasOwnProperty("selfCertifiedDrawingFromEmpaneledDoc") &&
      data.hasOwnProperty("environmentalClearance") &&
      data.hasOwnProperty("shapeFileAsPerTemplate") &&
      data.hasOwnProperty("autoCadFile") &&
      data.hasOwnProperty("certifieadCopyOfThePlan")
    ) {
      isvalid = true;
    } else {
      checkUploadedImages(data);
      isvalid = false;
      return isvalid;
    }
    return isvalid;
  };
  const servicePlan = async (data) => {
    const token = window?.localStorage?.getItem("token");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    console.log(data, "service-service");
    try {
      if (!applicationId) {
        data.devName = devName;
        data.developmentPlan = developmentPlan;
        data.purpose = purpose;
        data.totalArea = totalArea;
        const isValid = checkValid(data);
        // if(!isValid){
        //   console.log("Dont call create")
        //   return null
        // }
        const postDistrict = {
          requestInfo: {
            api_id: "Rainmaker",
            ver: "1",
            ts: null,
            action: "create",
            did: "",
            key: "",
            msg_id: "",
            requester_id: "",
            authToken: token,
            userInfo: userInfo.info,
          },

          ServicePlanRequest: [
            {
              ...data,
              action: "APPLY",
              tenantId: tenantId,
              businessService: "SERVICE_PLAN",
              workflowCode: "SERVICE_PLAN",
              comment: "",
              assignee: null,
            },
          ],
        };
        const Resp = await axios.post("/tl-services/serviceplan/_create", postDistrict);
        setServicePlanDataLabel(Resp.data);
        setOpen(true);
        setApplicationNumber(Resp.data.servicePlanResponse[0].applicationNumber);
      } else {
        servicePlanRes.loiNumber = data?.loiNumber ? data?.loiNumber : servicePlanRes.loiNumber;
        servicePlanRes.selfCertifiedDrawingFromEmpaneledDoc = data?.selfCertifiedDrawingFromEmpaneledDoc
          ? data?.selfCertifiedDrawingFromEmpaneledDoc
          : servicePlanRes.selfCertifiedDrawingFromEmpaneledDoc;
        servicePlanRes.environmentalClearance = data?.environmentalClearance ? data?.environmentalClearance : servicePlanRes.environmentalClearance;
        servicePlanRes.shapeFileAsPerTemplate = data?.shapeFileAsPerTemplate ? data?.shapeFileAsPerTemplate : servicePlanRes.shapeFileAsPerTemplate;
        servicePlanRes.autoCadFile = data?.autoCadFile ? data?.autoCadFile : servicePlanRes.autoCadFile;
        servicePlanRes.certifieadCopyOfThePlan = data?.certifieadCopyOfThePlan
          ? data?.certifieadCopyOfThePlan
          : servicePlanRes.certifieadCopyOfThePlan;
        servicePlanRes.devName = devName;
        servicePlanRes.developmentPlan = developmentPlan;
        servicePlanRes.purpose = purpose;
        servicePlanRes.totalArea = totalArea;
        const isvalidUpdate = checkValid(servicePlanRes);
        console.log({ servicePlanRes, data, isvalidUpdate }, "jjjjjjjjjjjjjj");
        if (!isvalidUpdate) {
          console.log("Dont call update");
          return null;
        }
        const updateRequest = {
          requestInfo: {
            api_id: "Rainmaker",
            ver: "1",
            ts: null,
            action: "create",
            did: "",
            key: "",
            msg_id: "",
            requester_id: "",
            authToken: token,
          },
          ServicePlanRequest: [
            {
              ...servicePlanRes,
              // "action": "FORWARD",
              // "tenantId":  tenantId,
              // "businessService": "SERVICE_PLAN",
              workflowCode: "SERVICE_PLAN",
              // "comment": "",
              // "assignee": null
            },
          ],
        };
        const Resp = await axios.post("/tl-services/serviceplan/_update", updateRequest);
        setOpen(true);
        setApplicationNumber(Resp.data.servicePlanResponse[0].applicationNumber);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const viewDocument = async (documentId) => {
    try {
      const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
      const FILDATA = response.data?.fileStoreIds[0]?.url;
      window.open(FILDATA);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadDocument = async (documentId) => {
    try {
      const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
      const url = response.data?.fileStoreIds[0]?.url;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);
      link.href = URL.createObjectURL(blob);
      link.download = `${documentId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  };

  const getDocumentData = async (file, fieldName) => {
    console.log("documentData", fieldName);
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ key: "error" });
      return;
    }
    setDrawingErr({ ...drawingErr, [fieldName]: false });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      console.log("documentData", Resp?.data?.files);
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });

      setSelectedFiles([...selectedFiles, file.name]);

      setLoader(false);
      setShowToast({ key: "success" });
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.location.href = `/digit-ui/citizen`;
  };
  const handleModal = () => {
    setSPOpen(false);
  };
  const getApplicationId = (url) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("id");
  };

  const id = getApplicationId(window.location.href);

  useEffect(() => {
    if (id) {
      getApplicationData();
    }
  }, [id]);

  const handleLoiNumber = async (e) => {
    e.preventDefault();
    const isValidPattern = getLoiPattern(LOINumber);
    if (!isValidPattern) {
      setLoiPatternErr(true);
      return null;
    }
    const token = window?.localStorage?.getItem("token");
    setLoiPatternErr(false);
    try {
      const loiRequest = {
        requestInfo: {
          api_id: "Rainmaker",
          ver: "1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msg_id: "090909",
          requesterId: "",
          authToken: token,
          userInfo: userInfo.info,
        },
      };
      const Resp = await axios.post(`/tl-services/v1/_search?loiNumber=${LOINumber}`, loiRequest);
      console.log(Resp, "RRRRRRRRRRR");
      setDevName(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.addInfo?.name);
      setDevelopmentPlan(
        Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.AppliedLandDetails?.[0]?.developmentPlan
      );
      setPurpose(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.purpose);
      setTotalArea(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.totalArea);

      console.log({ devName, developmentPlan, purpose, totalArea, purpose });
    } catch (error) {
      console.log(error);
    }

    console.log("loiloiloi");
  };

  const getApplicationData = async () => {
    const token = window?.localStorage?.getItem("token");
    try {
      const postDistrict = {
        requestInfo: {
          api_id: "Rainmaker",
          ver: "1",
          ts: null,
          action: "create",
          did: "",
          key: "",
          msg_id: "",
          requester_id: "",
          authToken: token,
        },
      };
      const response = await axios.post(`/tl-services/serviceplan/_get?applicationNumber=${id}`, postDistrict);
      console.log(response, "rrrrrrrrrr");
      setLOINumber(response?.data?.servicePlanResponse[0].loiNumber);
      setSelfCertifiedDrawing(response?.data?.servicePlanResponse[0].selfCertifiedDrawingFromEmpaneledDoc);
      setApplicationId(id);
      setEnviromental(response?.data?.servicePlanResponse[0].environmentalClearance);
      setGisFormat(response?.data?.servicePlanResponse[0].shapeFileAsPerTemplate);
      setAutoCad(response?.data?.servicePlanResponse[0].autoCadFile);
      setCertifiedCopy(response?.data?.servicePlanResponse[0].certifieadCopyOfThePlan);
      setServicePlanRes(response?.data?.servicePlanResponse[0]);
      setLayoutplan(response?.data?.servicePlanResponse[0].layoutPlan);
      setRevisedLayout(response?.data?.servicePlanResponse[0].revisedLayout);
      setDemarcation(response?.data?.servicePlanResponse[0].demarcation);
      setDemarcationgis(response?.data?.servicePlanResponse[0].demarcationgis);
      setLayoutExcel(response?.data?.servicePlanResponse[0].layoutExcel);
      setAnyotherDoc(response?.data?.servicePlanResponse[0].anyOtherdoc);
      setSPAction(response?.data?.servicePlanResponse[0].action);
      setComment(response?.data?.servicePlanResponse[0].comment);
      setSPOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  //  const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  // const hideRemarks = purpose.some((item)=>item === "DDJAY_APHP" || item === "RPL" || item === "DTP_HR" || item === "DTP_HQ" )

  return (
    <div>
      <React.Fragment>
        <ScrollToTop />
        {loader && <Spinner />}
        {spaction === "SENDBACK_TO_AUTH_USER" ? (
          <Dialog
            open={spopen}
            // onClose={handleModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ style: { width: "800px", height: "300px" } }}
          >
            <DialogTitle id="alert-dialog-title">Service Plan Rejection Status</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <h1>
                  Your Service Plan Application is rejected{" "}
                  <span>
                    <ErrorIcon style={{ color: "#FF7276", variant: "filled" }} />
                  </span>
                </h1>
                <br></br>
                <h1>
                  Please act on this: <span>{comment}</span>
                </h1>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModal} autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          ""
        )}
        <form onSubmit={handleSubmit(servicePlan)}>
          <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Service Plan </h4>
            <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
              <Row>
                <Col className="col-4">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_APPLICANT_LOI_NUMBER")}`}
                        {/* LOI Number */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </label>
                  </div>
                  <input
                    type="string"
                    className="form-control"
                    {...register("loiNumber")}
                    onChange={(e) => setLOINumber(e.target.value)}
                    value={LOINumber}
                  />
                  {loiPatternErr ? <p style={{ color: "red" }}>Please enter the valid LOI Number*</p> : " "}
                </Col>
                <Col className="col-4">
                  <button
                    style={{ transform: "translateY(35px)" }}
                    type="submit"
                    onClick={handleLoiNumber}
                    id="btnSearch"
                    class="btn btn-primary btn-md center-block"
                  >
                    Verify
                  </button>
                </Col>
              </Row>
              <br></br>
              <Row>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_APPLICANT_NAME")}`}
                        {/* Name */}
                      </h2>
                    </label>
                  </div>
                  <input
                    type="string"
                    className="form-control"
                    {...register("devName")}
                    onChange={(e) => setDevName(e.target.value)}
                    value={devName}
                    disabled
                  />
                </Col>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_APPLICANT_DEVELOPMENT_PLAN")}`}
                        {/* Development Plan */}
                      </h2>
                    </label>
                  </div>
                  <input
                    type="string"
                    className="form-control"
                    {...register("developmentPlan")}
                    onChange={(e) => setDevelopmentPlan(e.target.value)}
                    value={developmentPlan}
                    disabled
                  />
                </Col>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_APPLICANT_PURPOSE_OF_LICENCE")}`}
                        {/* Purpose Of Licence */}
                      </h2>
                    </label>
                  </div>
                  <input
                    type="string"
                    className="form-control"
                    {...register("purpose")}
                    onChange={(e) => setPurpose(e.target.value)}
                    value={purpose}
                    disabled
                  />
                </Col>
                <Col className="col-3">
                  <div>
                    <label>
                      <h2>
                        {`${t("SP_APPLICANT_TOTAL_AREA")}`}
                        {/* Total Area */}
                      </h2>
                    </label>
                  </div>
                  <input
                    type="string"
                    className="form-control"
                    {...register("totalArea")}
                    onChange={(e) => setTotalArea(e.target.value)}
                    value={totalArea}
                    disabled
                  />
                </Col>
              </Row>
              <br></br>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Col xs={6} md={6}>
                  <Form.Label style={{ margin: 2 }}>
                    {`${t("SP_APPLICANT_PROPOSED_SOURCE_WATER_SUPPLY")}`}
                    {/* Proposed Source of Water Supply */}
                  </Form.Label>
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    // placeholder="Enter your Remarks"
                    autoFocus
                    // onChange={(e) => {
                    //   setDeveloperRemarks({ data: e.target.value });

                    // }}

                    {...register("environmentalClearance")}
                    onChange={(e) => setEnviromental(e.target.value)}
                    value={environmental}
                    rows="3"
                  />
                  {/* <Form.Control type="text" /> */}
                </Col>
              </Form.Group>
              <br></br>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {`${t("SP_APPLICANT_SR_NO")}`}
                      {/* Sr.No. */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {`${t("SP_APPLICANT_DOCUMENT_TYPE")}`}
                      {/* Document's Type/Name */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {`${t("SP_APPLICANT_ACTION")}`}
                      {/* Actions */}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">1.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>
                        {`${t("SP_APPLICANT_SELF_CERTIFIED_DRAWING_APPROVED_TEMPLATE")}`}
                        {/* Self-certified drawings from empanelled/certified architects that conform to the standard approved template as per the TCP
                        layout plan / Site plan. */}
                      </h2>
                      {drawingErr.selfCertifiedDrawingFromEmpaneledDoc ? (
                        <p style={{ color: "red" }}>Please upload self-certified drawings from empanelled/certified architects*</p>
                      ) : (
                        " "
                      )}
                    </td>
                    <td component="th" scope="row">
                      <label for="file-input-1">
                        <FileUploadIcon color="primary" />
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="file-input-1"
                        onChange={(e) => getDocumentData(e?.target?.files[0], "selfCertifiedDrawingFromEmpaneledDoc")}
                        style={{ display: "none" }}
                      />

                      {fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc ? (
                        <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc)}>
                          {" "}
                        </VisibilityIcon>
                      ) : (
                        ""
                      )}
                      {applicationId && !fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc && (
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => downloadDocument(selfCertifiedDrawing)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                          <IconButton onClick={() => viewDocument(selfCertifiedDrawing)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                      )}
                    </td>
                  </tr>
                  {/* <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">2.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Environmental Clearance.</h2>
                  {drawingErr.environmentalClearance ? <p style={{color: 'red'}}>Please upload environmental clearance drawings*</p> : " "}
                </td>
                <td component="th" scope="row">
                <label for='file-input-2'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-2"
                   
                    onChange={(e) => getDocumentData(e?.target?.files[0], "environmentalClearance")}
                    style={{display: "none"}}
                  />
                  {fileStoreId?.environmentalClearance ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.environmentalClearance)}>
                    {" "}
                  </VisibilityIcon>
                  : ""}
                   {applicationId && (!fileStoreId?.environmentalClearance) && 
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(environmental)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(environmental)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td>
              </tr> */}
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">2.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>
                        {`${t("SP_APPLICANT_SERVICE_PLAN_IN-PDF_FORMAT")}`}
                        {/* Service plan in PDF (OCR Compatible) + GIS format. */}
                      </h2>
                      {drawingErr.shapeFileAsPerTemplate ? <p style={{ color: "red" }}>Please upload service plan pdf and gis format*</p> : " "}
                    </td>
                    <td component="th" scope="row">
                      <label for="file-input-3">
                        <FileUploadIcon color="primary" />
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        // {...register("shapeFileAsPerTemplate")}
                        id="file-input-3"
                        onChange={(e) => getDocumentData(e?.target?.files[0], "shapeFileAsPerTemplate")}
                        style={{ display: "none" }}
                      />
                      {fileStoreId?.shapeFileAsPerTemplate ? (
                        <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.shapeFileAsPerTemplate)}>
                          {" "}
                        </VisibilityIcon>
                      ) : (
                        ""
                      )}
                      {applicationId && !fileStoreId?.shapeFileAsPerTemplate && (
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => downloadDocument(gisFormat)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                          <IconButton onClick={() => viewDocument(gisFormat)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">3.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      {/* <h2>Service plan in AutoCAD (DXF) file.</h2> */}
                      <h6>
                        {`${t("SP_APPLICANT_SERVICE_pLAN_AUTOCAD")}`}
                        {/* Service plan in AutoCAD (DXF) file. */}
                        <Tooltip title="Any amendment suggested by HSVP may be incorporated in the drawing accordingly">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h6>
                      {drawingErr.autoCadFile ? <p style={{ color: "red" }}>Please upload autocad file*</p> : " "}
                    </td>
                    <td component="th" scope="row">
                      <label for="file-input-4">
                        <FileUploadIcon color="primary" />
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="file-input-4"
                        onChange={(e) => getDocumentData(e?.target?.files[0], "autoCadFile")}
                        style={{ display: "none" }}
                      />
                      {fileStoreId?.autoCadFile ? (
                        <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.autoCadFile)}>
                          {" "}
                        </VisibilityIcon>
                      ) : (
                        ""
                      )}
                      {applicationId && !fileStoreId?.autoCadFile && (
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => downloadDocument(autocad)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                          <IconButton onClick={() => viewDocument(autocad)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                      )}
                    </td>
                  </tr>
                  {/* <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">4.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Certified copy of the Service plan verified by a third party.</h2>
                  {drawingErr.certifieadCopyOfThePlan ? <p style={{color: 'red'}}>Please upload certified copy of the plan*</p> : " "}

                </td>
                <td component="th" scope="row">
                <label for='file-input-5'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-5"
                    onChange={(e) => getDocumentData(e?.target?.files[0], "certifieadCopyOfThePlan")}
                    style={{display: "none"}}
                  />
                  {fileStoreId?.certifieadCopyOfThePlan ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.certifieadCopyOfThePlan)}>
                    {" "}
                  </VisibilityIcon>
                  : "" }
                   {applicationId && (!fileStoreId?.certifieadCopyOfThePlan) &&
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(certifiedCopy)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(certifiedCopy)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td>
              </tr> */}
                </tbody>
                {(purpose === "DDJAY_APHP" ||
                  purpose === "RPL" ||
                  purpose === "NILP" ||
                  purpose === "NILPC" ||
                  purpose === "IPA" ||
                  purpose === "CPRS" ||
                  purpose === "CICS") && (
                  <tbody>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">6.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>Previously Uploaded layout plan (call)</h2>
                        {drawingErr.layoutPlan ? <p style={{ color: "red" }}>Please upload layout plan call*</p> : " "}
                      </td>
                      <td component="th" scope="row">
                        <label for="file-input-6">
                          <FileUploadIcon color="primary" />
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="file-input-6"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlan")}
                          style={{ display: "none" }}
                        />

                        {fileStoreId?.layoutPlan ? (
                          <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.layoutPlan)}>
                            {" "}
                          </VisibilityIcon>
                        ) : (
                          ""
                        )}
                        {applicationId && !fileStoreId?.layoutPlan && (
                          <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => downloadDocument(layoutPlan)}>
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => viewDocument(layoutPlan)}>
                              <VisibilityIcon color="info" className="icon" />
                            </IconButton>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">7.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>Upload the Revised layout plan</h2>
                        {drawingErr.revisedLayout ? <p style={{ color: "red" }}>Please upload revised layout plan*</p> : " "}
                      </td>
                      <td component="th" scope="row">
                        <label for="file-input-7">
                          <FileUploadIcon color="primary" />
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="file-input-7"
                          // {...register("environmentalClearance")}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "revisedLayout")}
                          style={{ display: "none" }}
                        />
                        {fileStoreId?.revisedLayout ? (
                          <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.revisedLayout)}>
                            {" "}
                          </VisibilityIcon>
                        ) : (
                          ""
                        )}
                        {applicationId && !fileStoreId?.revisedLayout && (
                          <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => downloadDocument(revisedLayout)}>
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => viewDocument(revisedLayout)}>
                              <VisibilityIcon color="info" className="icon" />
                            </IconButton>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">8.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>Upload Demarcation Plan in AutoCAD (DXF) file</h2>
                        {drawingErr.demarcation ? <p style={{ color: "red" }}>Please upload demarcation plan*</p> : " "}
                      </td>
                      <td component="th" scope="row">
                        <label for="file-input-8">
                          <FileUploadIcon color="primary" />
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          // {...register("shapeFileAsPerTemplate")}
                          id="file-input-8"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "demarcation")}
                          style={{ display: "none" }}
                        />
                        {fileStoreId?.demarcation ? (
                          <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.demarcation)}>
                            {" "}
                          </VisibilityIcon>
                        ) : (
                          ""
                        )}
                        {applicationId && !fileStoreId?.demarcation && (
                          <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => downloadDocument(demarcation)}>
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => viewDocument(demarcation)}>
                              <VisibilityIcon color="info" className="icon" />
                            </IconButton>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">9.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>Upload Demarcation Plan in PDF (OCR Compatible) + GIS format.</h2>
                        {drawingErr.demarcationgis ? <p style={{ color: "red" }}>Please upload demarcation plan in PDF and GIS format*</p> : " "}
                      </td>
                      <td component="th" scope="row">
                        <label for="file-input-9">
                          <FileUploadIcon color="primary" />
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="file-input-9"
                          // {...register("autoCadFile")}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "demarcationgis")}
                          style={{ display: "none" }}
                        />
                        {fileStoreId?.demarcationgis ? (
                          <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.demarcationgis)}>
                            {" "}
                          </VisibilityIcon>
                        ) : (
                          ""
                        )}
                        {applicationId && !fileStoreId?.demarcationgis && (
                          <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => downloadDocument(demarcationgis)}>
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => viewDocument(demarcationgis)}>
                              <VisibilityIcon color="info" className="icon" />
                            </IconButton>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">10.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>Upload Excel of detailed layout structure</h2>
                        {drawingErr.layoutExcel ? <p style={{ color: "red" }}>Please upload excel of detailed layout structure*</p> : " "}
                      </td>
                      <td component="th" scope="row">
                        <label for="file-input-10">
                          <FileUploadIcon color="primary" />
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          // {...register("certifieadCopyOfThePlan")}
                          id="file-input-10"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "layoutExcel")}
                          style={{ display: "none" }}
                        />
                        {fileStoreId?.layoutExcel ? (
                          <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.layoutExcel)}>
                            {" "}
                          </VisibilityIcon>
                        ) : (
                          ""
                        )}
                        {applicationId && !fileStoreId?.layoutExcel && (
                          <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => downloadDocument(layoutExcel)}>
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => viewDocument(layoutExcel)}>
                              <VisibilityIcon color="info" className="icon" />
                            </IconButton>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p className="mb-2">11.</p>
                        </div>
                      </td>
                      <td component="th" scope="row">
                        <h2>Any other relevant document</h2>
                        {drawingErr.anyOtherdoc ? <p style={{ color: "red" }}>Please upload anyother relevant document*</p> : " "}
                      </td>
                      <td component="th" scope="row">
                        <label for="file-input-11">
                          <FileUploadIcon color="primary" />
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          // {...register("certifieadCopyOfThePlan")}
                          id="file-input-11"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherdoc")}
                          style={{ display: "none" }}
                        />
                        {fileStoreId?.anyOtherdoc ? (
                          <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.anyOtherdoc)}>
                            {" "}
                          </VisibilityIcon>
                        ) : (
                          ""
                        )}
                        {applicationId && !fileStoreId?.anyOtherdoc && (
                          <div className="btn btn-sm col-md-4">
                            <IconButton onClick={() => downloadDocument(anyOtherdoc)}>
                              <FileDownload color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => viewDocument(anyOtherdoc)}>
                              <VisibilityIcon color="info" className="icon" />
                            </IconButton>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                )}
              </div>

              <div class="row">
                <div class="col-sm-12 text-right">
                  <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                    Submit
                  </button>
                </div>
              </div>
            </Card>
          </Card>
        </form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Service Plan Submission</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>
                Your Service Plan is submitted successfully{" "}
                <span>
                  <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
                </span>
              </p>
              <p>
                Please Note down your Application Number <span style={{ padding: "5px", color: "blue" }}>{applicationNumber}</span> for further
                assistance
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      {showToast && (
        <Toast
          success={showToast?.key === "success" ? true : false}
          label="Document Uploaded Successfully"
          isDleteBtn={true}
          onClose={() => {
            setShowToast(null);
            // setError(null);
          }}
        />
      )}
      {showToastError && (
        <Toast
          error={showToastError?.key === "error" ? true : false}
          label="Duplicate file Selected"
          isDleteBtn={true}
          onClose={() => {
            setShowToastError(null);
            // setError(null);
          }}
        />
      )}
    </div>
  );
};

export default ServicePlanService;
