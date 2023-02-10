
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownload from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import Spinner from "../../../components/Loader";
import { Toast } from "@egovernments/digit-ui-react-components";
//import { getDocShareholding } from 'packages/modules/tl/src/pages/employee/ScrutinyBasic/ScrutinyDevelopment/docview.helper.js'



const ServicePlanService = () => {
  const [file, setFile] = useState(null);
  const [LOINumber, setLOINumber] = useState("");
  const [loiPatternErr, setLoiPatternErr] = useState(false)
  const [selfCertifiedDrawing, setSelfCertifiedDrawing] = useState("")
  const [applicationId, setApplicationId] = useState('')
  const [environmental, setEnviromental] = useState('')
  const [gisFormat, setGisFormat] = useState('')
  const [autocad, setAutoCad] = useState('')
  const [certifiedCopy, setCertifiedCopy] = useState('')
  const [drawingErr, setDrawingErr] = useState({
    'selfCertifiedDrawingFromEmpaneledDoc': false,
    'environmentalClearance': false,
    'shapeFileAsPerTemplate': false,
    'autoCadFile': false,
    'certifieadCopyOfThePlan': false
  })
  const [servicePlanRes, setServicePlanRes] = useState('')
  const [submitDataLabel, setSubmitDataLabel] = useState([]);
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
  const [docUpload, setDocuploadData] = useState([]);
  const [open, setOpen] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState()
  const [valid, setValid] = useState([])
  const [devName, setDevName] = useState("")
  const [purpose, setPurpose] = useState("")
  const [developmentPlan, setDevelopmentPlan] = useState("")
  const [gstnumber, setGSTNumber] = useState("")
  const [totalArea, setTotalArea] = useState("")
  // const [stepData, setStepData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [fileStoreId, setFileStoreId] = useState({});
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
  }

  const checkUploadedImages = (data) => {
    const keys = Object.keys(data)
    const arr = ['selfCertifiedDrawingFromEmpaneledDoc','environmentalClearance', 'shapeFileAsPerTemplate', 'autoCadFile', 'certifieadCopyOfThePlan']
    for(let i=0; i<arr.length; i++){
      if(!keys.includes(arr[i])){
        drawingErr[arr[i]] = true
        setDrawingErr({...drawingErr, [arr[i]]: true})
      }
    }
    return true
  }

  const checkValid = (data) => {
    let isvalid = false
    if(getLoiPattern(data?.loiNumber)){
        isvalid = true
    }
    else{
      isvalid = false
      setLoiPatternErr(true)
      return isvalid
    }
    
    if(
      data.hasOwnProperty('selfCertifiedDrawingFromEmpaneledDoc') && 
      data.hasOwnProperty('environmentalClearance') &&
      data.hasOwnProperty('shapeFileAsPerTemplate') &&
      data.hasOwnProperty('autoCadFile') &&
      data.hasOwnProperty('certifieadCopyOfThePlan')
      ){
        isvalid = true
    }
    else{
      checkUploadedImages(data)
      isvalid = false
      return isvalid
    } 
    return isvalid
  }
  const servicePlan = async (data) => {
    const token = window?.localStorage?.getItem("token");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    console.log(data, "service-service");
    try {
      if(!applicationId){
        data.devName = devName
        data.developmentPlan = developmentPlan
        data.purpose = purpose
        data.totalArea = totalArea
        const isValid = checkValid(data)
        if(!isValid){
          console.log("Dont call create")
          return null
        }
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
            "userInfo": userInfo.info
          },
  
          ServicePlanRequest: [{
            ...data,
            "action": "APPLY",
            "tenantId":  tenantId,
            "businessService": "SERVICE_PLAN",
            "workflowCode": "SERVICE_PLAN",
            "comment": "",
            "assignee": null
          }],
        };
        const Resp = await axios.post("/tl-services/serviceplan/_create", postDistrict);
        setServicePlanDataLabel(Resp.data);
        setOpen(true)
        setApplicationNumber(Resp.data.servicePlanResponse[0].applicationNumber)
      }
      else{
        
        servicePlanRes.loiNumber = data?.loiNumber ? data?.loiNumber : servicePlanRes.loiNumber
        servicePlanRes.selfCertifiedDrawingFromEmpaneledDoc = data?.selfCertifiedDrawingFromEmpaneledDoc ? data?.selfCertifiedDrawingFromEmpaneledDoc : servicePlanRes.selfCertifiedDrawingFromEmpaneledDoc
        servicePlanRes.environmentalClearance = data?.environmentalClearance ? data?.environmentalClearance : servicePlanRes.environmentalClearance
        servicePlanRes.shapeFileAsPerTemplate = data?.shapeFileAsPerTemplate ? data?.shapeFileAsPerTemplate : servicePlanRes.shapeFileAsPerTemplate
        servicePlanRes.autoCadFile = data?.autoCadFile ? data?.autoCadFile : servicePlanRes.autoCadFile
        servicePlanRes.certifieadCopyOfThePlan = data?.certifieadCopyOfThePlan ? data?.certifieadCopyOfThePlan : servicePlanRes.certifieadCopyOfThePlan
        const isvalidUpdate = checkValid(servicePlanRes)
        console.log({servicePlanRes, data, isvalidUpdate}, "jjjjjjjjjjjjjj");
        // if(!isvalidUpdate){
        //   console.log("Dont call update")
        //   return null
        // }
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
            authToken: token
          },
          ServicePlanRequest: [{
            ...servicePlanRes,
            // "action": "FORWARD",
            // "tenantId":  tenantId,
            // "businessService": "SERVICE_PLAN",
            "workflowCode": "SERVICE_PLAN",
            // "comment": "",
            // "assignee": null
          }],
        }
        const Resp = await axios.post("/tl-services/serviceplan/_update", updateRequest);
        setOpen(true)
        setApplicationNumber(Resp.data.servicePlanResponse[0].applicationNumber)
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
  }

  const downloadDocument = async (documentId) => {
    try {
      const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${documentId}`, {});
      const url = response.data?.fileStoreIds[0]?.url;
      const res = await fetch(url)
      if(!res.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await res.blob()
      const link = document.createElement("a")
      link.style.display = 'none'
      document.body.appendChild(link)
      link.href = URL.createObjectURL(blob)
      link.download = `${documentId}.jpg`
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  }

  const getDocumentData = async (file, fieldName) => {
    console.log("documentData", fieldName);
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ key: "error" });
      return;
    }
    setDrawingErr({...drawingErr, [fieldName]: false})
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
    setOpen(false)
    window.location.href = `/digit-ui/citizen`
  }
  const getApplicationId = (url) => {
    const urlParams = new URLSearchParams(url.split('?')[1])
    return urlParams.get('id')
 }

 const id = getApplicationId(window.location.href)

  useEffect(() => {
    if(id){
      getApplicationData()
    }
  }, [id])

  const handleLoiNumber = async (e) => {
    e.preventDefault()
    const isValidPattern = getLoiPattern(LOINumber)
    if(!isValidPattern){
      setLoiPatternErr(true)
      return null
    }
    const token = window?.localStorage?.getItem("token");
    setLoiPatternErr(false)
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
        "userInfo": userInfo.info
      },
    }
    const Resp = await axios.post(`/tl-services/v1/_search?loiNumber=${LOINumber}`, loiRequest);
    console.log(Resp, "RRRRRRRRRRR");
    setDevName(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.addInfo?.name)
    setDevelopmentPlan(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.AppliedLandDetails?.[0]?.developmentPlan)
    setPurpose(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.purpose)
    setTotalArea(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.totalArea)
    
  console.log({ devName, developmentPlan, purpose, totalArea });

   } catch (error) {
    console.log(error)
   }
    

    console.log("loiloiloi")
  }

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
        }
        const response = await axios.post(`/tl-services/serviceplan/_get?applicationNumber=${id}`, postDistrict)
        console.log(response, "rrrrrrrrrr")
        setLOINumber(response?.data?.servicePlanResponse[0].loiNumber)
        setSelfCertifiedDrawing(response?.data?.servicePlanResponse[0].selfCertifiedDrawingFromEmpaneledDoc)
        setApplicationId(id)
        setEnviromental(response?.data?.servicePlanResponse[0].environmentalClearance)
        setGisFormat(response?.data?.servicePlanResponse[0].shapeFileAsPerTemplate)
        setAutoCad(response?.data?.servicePlanResponse[0].autoCadFile)
        setCertifiedCopy(response?.data?.servicePlanResponse[0].certifieadCopyOfThePlan)
        setServicePlanRes(response?.data?.servicePlanResponse[0])

      } catch (error) {
        console.log(error)
      } 
   }

  return (
  <div>
   <React.Fragment>
       <ScrollToTop />
      {loader && <Spinner />}
    <form onSubmit={handleSubmit(servicePlan)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Service Plan </h4>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Row>
            <Col className="col-4">
              <div>
                <label>
                  <h2>
                    LOI Number <span style={{ color: "red" }}>*</span>
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
              {loiPatternErr ? <p style={{color: 'red'}}>Please enter the valid LOI Number*</p> : " "}
            </Col>
            <Col className="col-4">
                <button style={{transform: "translateY(35px)"}} type="submit" onClick={handleLoiNumber} id="btnSearch" class="btn btn-primary btn-md center-block">
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
                    Name
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
                  Development Plan
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
                  Purpose Of Licence 
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
                  Total Area
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
          <Row>
            {/* <Col className="col-3">
              <div>
                <label>
                  <h2>
                    Field4
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
            </Col> */}
            {/* <Col className="col-3">
              <div>
                <label>
                  <h2>
                    field5
                  </h2>
                </label>
              </div>
              <input
                type="string"
                className="form-control"
                {...register("panNumber")}
                onChange={(e) => setPanNumber(e.target.value)}
                value={panNumber}
                disabled
              />
            </Col>
            <Col className="col-3">
              <div>
                <label>
                  <h2>
                    filed6
                  </h2>
                </label>
              </div>
              <input
                type="string"
                className="form-control"
                {...register("gstNumber")}
                onChange={(e) => setGSTNumber(e.target.value)}
                value={gstnumber}
                disabled
              />
            </Col>
            <Col className="col-3">
              <div>
                <label>
                  <h2>
                    field7
                  </h2>
                </label>
              </div>
              <input
                type="string"
                className="form-control"
                {...register("mobileNumber")}
                onChange={(e) => setMobileNumber(e.target.value)}
                value={mobileNmber}
                disabled
              />
            </Col> */}
          </Row>
          <br></br>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <td style={{ textAlign: "center" }}> Sr.No.</td>
                <td style={{ textAlign: "center" }}>Type Of Map/Plan</td>
                <td style={{ textAlign: "center" }}>Annexure</td>
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
                  <h2>Self-certified drawings from empanelled/certified architects that conform to the standard approved template as per the TCP layout plan / Site plan.</h2>
                  {drawingErr.selfCertifiedDrawingFromEmpaneledDoc ? <p style={{color: 'red'}}>Please upload self-certified drawings from empanelled/certified architects*</p> : " "}
                </td>
                <td component="th" scope="row">
                  <label for='file-input-1'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-1"
                    onChange={(e) => getDocumentData(e?.target?.files[0], "selfCertifiedDrawingFromEmpaneledDoc")}
                    style={{display: "none"}}
                  />
                    
                  {fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc)}>
                    {" "}
                  </VisibilityIcon>
                  : "" }
                  {applicationId && (!fileStoreId?.selfCertifiedDrawingFromEmpaneledDoc) &&
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(selfCertifiedDrawing)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(selfCertifiedDrawing)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td>
              </tr>
              <tr>
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
                    // {...register("environmentalClearance")}
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
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">3.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Service plan in PDF (OCR Compatible) + GIS format.</h2>
                  {drawingErr.shapeFileAsPerTemplate ? <p style={{color: 'red'}}>Please upload service plan pdf and gis format*</p> : " "}

                </td>
                <td component="th" scope="row">
                <label for='file-input-3'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    // {...register("shapeFileAsPerTemplate")}
                    id="file-input-3"
                    onChange={(e) => getDocumentData(e?.target?.files[0], "shapeFileAsPerTemplate")}
                    style={{display: "none"}}
                  />
                  {fileStoreId?.shapeFileAsPerTemplate ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.shapeFileAsPerTemplate)}>
                    {" "}
                  </VisibilityIcon>
                    : ""}
                   {applicationId && (!fileStoreId?.shapeFileAsPerTemplate) && 
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(gisFormat)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(gisFormat)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">4.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Service plan in AutoCAD (DXF) file.</h2>
                  {drawingErr.autoCadFile ? <p style={{color: 'red'}}>Please upload autocad file*</p> : " "}
                </td>
                <td component="th" scope="row">
                <label for='file-input-4'>
                    <FileUploadIcon 
                    color="primary"
                    />
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="file-input-4"
                    // {...register("autoCadFile")}
                    onChange={(e) => getDocumentData(e?.target?.files[0], "autoCadFile")}
                    style={{display: "none"}}
                  />
                  {fileStoreId?.autoCadFile ? 
                  <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.autoCadFile)}>
                    {" "}
                  </VisibilityIcon>
                  : "" }
                   {applicationId && (!fileStoreId?.autoCadFile) &&
                  <div className="btn btn-sm col-md-4">
                    <IconButton onClick={()=>downloadDocument(autocad)}>
                        <FileDownload color="primary" className="mx-1" />
                    </IconButton>
                      <IconButton onClick={()=>viewDocument(autocad)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                  </div> 
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">5.</p>
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
                    // {...register("certifieadCopyOfThePlan")}
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
              </tr>
            </tbody>
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
    <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
        Service Plan Submission
    </DialogTitle>
    <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>Your Service Plan is submitted successfully <span><CheckCircleOutlineIcon style={{color: 'blue', variant: 'filled'}}/></span></p>
            <p>Please Note down your Application Number <span style={{padding: '5px', color: 'blue'}}>{applicationNumber}</span> for further assistance</p>
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

