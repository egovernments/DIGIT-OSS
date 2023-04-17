import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { IconButton } from "@mui/material";
import FileDownload from "@mui/icons-material/FileDownload";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import Spinner from "../../../components/Loader";
import { Toast } from "@egovernments/digit-ui-react-components";
import ErrorIcon from "@mui/icons-material/Error";
import { useTranslation } from "react-i18next";

const electricalPlanService = () => {
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
  const [open, setOpen] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState();
  const [applicationId, setApplicationId] = useState("");
  const [loiNumber, setLoiNumber] = useState("");
  const [loiPatternErr, setLoiPatternErr] = useState(false);
  const [electricInfra, setElectricInfra] = useState("");
  const [electricDistribution, setElectricDistribution] = useState("");
  const [electricalCapacity, setElectricalCapacity] = useState("");
  const [switchingStation, setSwitchingStation] = useState("");
  const [loadSancation, setLoadSancation] = useState("");
  const [selfCenteredDrawing, setSelfCertifiedDrawing] = useState("");
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const [environmental, setEnviromental] = useState("");
  const [pdfFormat, setPdfFormat] = useState("");
  const [autoCad, setAutoCad] = useState("");
  const [verifiedPlan, setVerifiedPlan] = useState("");
  const [electricPlanRes, setElectricPlanRes] = useState([]);
  const [valid, setValid] = useState([]);
  const [fileStoreId, setFileStoreId] = useState({});
  const [devName, setDevName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [developmentPlan, setDevelopmentPlan] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const { t } = useTranslation();
  const [drawingErr, setDrawingErr] = useState({
    selfCenteredDrawings: false,
    environmentalClearance: false,
    pdfFormat: false,
    autoCad: false,
    verifiedPlan: false,
  });
  const [booleanErr, setBooleanErr] = useState({
    electricInfra: false,
    electricDistribution: false,
    electricalCapacity: false,
    switchingStation: false,
    LoadSancation: false,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [epaction, setEPAction] = useState("");
  const [comment, setComment] = useState("");
  const [epopen, setEPOpen] = useState(false);

  const userInfo = Digit.UserService.getUser();
  const getLoiPattern = (loiNumber) => {
    const pattern = /^(?=\D*\d)(?=.*[/])(?=.*[-])[a-zA-Z0-9\/-]{15,30}$/;
    return pattern.test(loiNumber);
  };

  const checkUploadedImages = (data) => {
    const keys = Object.keys(data);
    const arr = ["selfCenteredDrawings", "environmentalClearance", "pdfFormat", "autoCad", "verifiedPlan"];
    for (let i = 0; i < arr.length; i++) {
      if (!keys.includes(arr[i])) {
        drawingErr[arr[i]] = true;
        setDrawingErr({ ...drawingErr, [arr[i]]: true });
      }
    }
    return true;
  };

  const checkBoolean = (data) => {
    const { electricInfra, electricDistribution, electricalCapacity, switchingStation, LoadSancation } = data;
    if (electricInfra === null) {
      setBooleanErr({ ...booleanErr, ["electricInfra"]: true });
    } else if (electricDistribution === null) {
      setBooleanErr({ ...booleanErr, ["electricDistribution"]: true });
    } else if (electricalCapacity === null) {
      setBooleanErr({ ...booleanErr, ["electricalCapacity"]: true });
    } else if (switchingStation === null) {
      setBooleanErr({ ...booleanErr, ["switchingStation"]: true });
    } else if (LoadSancation === null) {
      setBooleanErr({ ...booleanErr, ["LoadSancation"]: true });
    }
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
      data?.LoadSancation !== null &&
      data?.electricDistribution !== null &&
      data?.electricInfra !== null &&
      data?.electricalCapacity !== null &&
      data?.switchingStation !== null
    ) {
      isvalid = true;
    } else {
      isvalid = false;
      checkBoolean(data);
      alert("Please select all boolean points");
      return isvalid;
    }
    if (
      data.hasOwnProperty("selfCenteredDrawings") &&
      data.hasOwnProperty("environmentalClearance") &&
      data.hasOwnProperty("pdfFormat") &&
      data.hasOwnProperty("autoCad") &&
      data.hasOwnProperty("verifiedPlan")
    ) {
      isvalid = true;
    } else {
      isvalid = false;
      checkUploadedImages(data);
      return isvalid;
    }
    return isvalid;
  };

  const electricPlan = async (data) => {
    const token = window?.localStorage?.getItem("token");
    console.log(data, "ddddddddd");
    const tenantId = Digit.ULBService.getCurrentTenantId();

    try {
      if (!applicationId) {
        data.devName = devName;
        data.developmentPlan = developmentPlan;
        data.purpose = purpose;
        data.totalArea = totalArea;
        const isValid = checkValid(data);
        if (!isValid) {
          console.log("Dont call create");
          return null;
        }
        const postDistrict = {
          requestInfo: {
            api_id: "1",
            ver: "1",
            ts: null,
            action: "create",
            did: "",
            key: "",
            msg_id: "",
            requester_id: "",
            authToken: token,
          },

          ElectricPlanRequest: [
            {
              ...data,
              action: "APPLY",
              tenantId: tenantId,
              businessService: "ELECTRICAL_PLAN",
              workflowCode: "ELECTRICAL_PLAN",
              comment: "",
              assignee: null,
            },
          ],
        };
        const Resp = await axios.post("/tl-services/electric/plan/_create", postDistrict);
        setDeveloperDataLabel(Resp.data);
        setApplicationNumber(Resp.data.electricPlanResponse[0].applicationNumber);
        setOpen(true);
      } else {
        electricPlanRes.loiNumber = data?.loiNumber ? data?.loiNumber : electricPlanRes.loiNumber;
        electricPlanRes.electricInfra = data?.electricInfra ? data?.electricInfra : electricPlanRes.electricInfra;
        electricPlanRes.electricDistribution = data?.electricDistribution ? data?.electricDistribution : electricPlanRes.electricDistribution;
        electricPlanRes.electricalCapacity = data?.electricalCapacity ? data?.electricalCapacity : electricPlanRes.electricalCapacity;
        electricPlanRes.switchingStation = data?.switchingStation ? data?.switchingStation : electricPlanRes.switchingStation;
        electricPlanRes.LoadSancation = data?.LoadSancation ? data?.LoadSancation : electricPlanRes.LoadSancation;
        electricPlanRes.selfCenteredDrawings = data?.selfCenteredDrawings ? data?.selfCenteredDrawings : electricPlanRes.selfCenteredDrawings;
        electricPlanRes.environmentalClearance = data?.environmentalClearance ? data?.environmentalClearance : electricPlanRes.environmentalClearance;
        electricPlanRes.pdfFormat = data?.pdfFormat ? data?.pdfFormat : electricPlanRes.pdfFormat;
        electricPlanRes.autoCad = data?.autoCad ? data?.autoCad : electricPlanRes.autoCad;
        electricPlanRes.verifiedPlan = data?.verifiedPlan ? data?.verifiedPlan : electricPlanRes.verifiedPlan;
        electricPlanRes.devName = devName;
        electricPlanRes.developmentPlan = developmentPlan;
        electricPlanRes.purpose = purpose;
        electricPlanRes.totalArea = totalArea;
        const isvalidUpdate = checkValid(electricPlanRes);
        console.log({ electricPlanRes, data, isvalidUpdate }, "jjjjjjjjjjjjjj");
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
          ElectricPlanRequest: [
            {
              ...electricPlanRes,

              // "action": "FORWARD",
              // "tenantId":  tenantId,
              // "businessService": "SERVICE_PLAN",
              workflowCode: "ELECTRICAL_PLAN",
              // "comment": "",
              // "assignee": null
            },
          ],
        };
        const Resp = await axios.post("/tl-services/electric/plan/_update", updateRequest);
        setOpen(true);
        setApplicationNumber(Resp.data.electricPlanResponse[0].applicationNumber);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleClose = () => {
    setOpen(false);
    window.location.href = `/digit-ui/citizen`;
  };
  const handleModal = () => {
    setEPOpen(false);
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

  const handleLoiNumber = async (e) => {
    e.preventDefault();
    const isValidPattern = getLoiPattern(loiNumber);
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
      const Resp = await axios.post(`/tl-services/v1/_search?loiNumber=${loiNumber}`, loiRequest);
      console.log(Resp, "RRRRRRRRRRR");
      // setDevName(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.addInfo?.name)
      // setPanNumber(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.addInfo?.PanNumber)
      // setGSTNumber(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.addInfo?.gst_Number)
      // setMobileNumber(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.addInfo?.mobileNumberUser)

      setDevName(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.addInfo?.name);
      setDevelopmentPlan(
        Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.AppliedLandDetails?.[0]?.developmentPlan
      );
      setPurpose(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.purpose);
      setTotalArea(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.totalArea);
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
      const response = await axios.post(`/tl-services/electric/plan/_get?applicationNumber=${id}`, postDistrict);
      console.log(response, "eeee");
      setApplicationId(id);
      setLoiNumber(response?.data?.electricPlanResponse[0].loiNumber);
      setElectricInfra(response?.data?.electricPlanResponse[0].electricInfra);
      setElectricDistribution(response?.data?.electricPlanResponse[0].electricDistribution);
      setElectricalCapacity(response?.data?.electricPlanResponse[0].electricalCapacity);
      setSwitchingStation(response?.data?.electricPlanResponse[0].switchingStation);
      setLoadSancation(response?.data?.electricPlanResponse[0].LoadSancation);
      setSelfCertifiedDrawing(response?.data?.electricPlanResponse[0].selfCenteredDrawings);
      setEnviromental(response?.data?.electricPlanResponse[0].environmentalClearance);
      setPdfFormat(response?.data?.electricPlanResponse[0].pdfFormat);
      setAutoCad(response?.data?.electricPlanResponse[0].autoCad);
      setVerifiedPlan(response?.data?.electricPlanResponse[0].verifiedPlan);
      setElectricPlanRes(response?.data?.electricPlanResponse[0]);
      setEPAction(response?.data?.electricPlanResponse[0].action);
      setComment(response?.data?.electricPlanResponse[0].comment);
      setEPOpen(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <React.Fragment>
        <ScrollToTop />
        {loader && <Spinner />}
        {epaction === "SENDBACK_TO_AUTH_USER" ? (
          <Dialog
            open={epopen}
            // onClose={handleModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ style: { width: "800px", height: "300px" } }}
          >
            <DialogTitle id="alert-dialog-title">Electrical Plan Rejection Status</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <h1>
                  Your Electric Plan Application is rejected{" "}
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
        <form onSubmit={handleSubmit(electricPlan)}>
          <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Electrical Plan </h4>
            <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
              <Row>
                <Col className="col-4">
                  <div>
                    <Form.Label>
                      <h2>
                        {`${t("EP_APPLICANT_LOI_NUMBER")}`}
                        {/* LOI Number */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                  <input
                    type="string"
                    className="form-control"
                    placeholder=""
                    {...register("loiNumber")}
                    onChange={(e) => setLoiNumber(e.target.value)}
                    value={loiNumber}
                  />
                  {loiPatternErr ? <p style={{ color: "red" }}>Please Enter the valid LOI Number*</p> : " "}
                </Col>
                <Col className="col-2">
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
                        {`${t("EP_APPLICANT_NAME")}`}
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
                        {`${t("EP_APPLICANT_DEVELOPMENT_PLAN")}`}
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
                        {`${t("EP_APPLICANT_PURPOSE_OF_LICENCE")}`}
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
                        {`${t("EP_APPLICANT_TOTAL_AREA")}`}
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
              <Row>
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
                    filed6
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
                    field7
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
                    Filed8
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
              <Row>
                <br></br>
                <Col className="ms-auto" md={12} xxl lg="12">
                  <br></br>
                  <div>
                    <Form.Label>
                      <h2>
                        {`${t("EP_APPLICANT_ELECTRICAL_INFRASTRUCTURE_FOR_ELECTRICAL_NEED")}`}
                        {/* Electrical infrastructure sufficient to cater for the electrical need of the project area{" "} */}
                        <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      </h2>
                    </Form.Label>
                    {/* {booleanErr?.electricInfra ? <p style={{color: 'red'}}>Please select electrical infrastructure*</p> : " "} */}
                    <Form.Check
                      onChange={(e) => setBooleanErr({ ...booleanErr, ["electricInfra"]: false })}
                      value="Y"
                      checked={electricInfra === "Y" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="Yes"
                      name="true"
                      {...register("electricInfra")}
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => setBooleanErr({ ...booleanErr, ["electricInfra"]: false })}
                      value="N"
                      checked={electricInfra === "N" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="No"
                      name="false"
                      {...register("electricInfra")}
                      inline
                    ></Form.Check>
                  </div>
                </Col>
                <br></br>
                <Col className="ms-auto" md={12} xxl lg="12">
                  <br></br>
                  <div>
                    <Form.Label>
                      {`${t("EP_APPLICANT_PROVISION_ELECTRICITY_DISTRIBUTION")}`}
                      {/* Provision of the electricity distribution in the project area by the instructions of the DHBVN{" "} */}
                      <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                    </Form.Label>
                    {/* {booleanErr?.electricDistribution ? <p style={{color: 'red'}}>Please select electrical distribution*</p> : " "} */}
                    <Form.Check
                      onChange={(e) => console.log(e)}
                      value="Y"
                      checked={electricDistribution === "Y" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="Yes"
                      name="true"
                      {...register("electricDistribution")}
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => console.log(e)}
                      value="N"
                      checked={electricDistribution === "N" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="No"
                      name="false"
                      {...register("electricDistribution")}
                      inline
                    ></Form.Check>
                  </div>
                </Col>
                <br></br>
                <Col className="ms-auto" md={12} xxl lg="12">
                  <br></br>
                  <div>
                    <Form.Label>
                      {`${t("EP_APPLICANT_CAPACITY_OF_PROPOSED_ELECTRICAL_SUBSTATION")}`}
                      {/* The capacity of the proposed electrical substation as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp; */}
                    </Form.Label>
                    {/* {booleanErr?.electricalCapacity ? <p style={{color: 'red'}}>Please select electrical capacity*</p> : " "} */}
                    <Form.Check
                      onChange={(e) => console.log(e)}
                      value="Y"
                      checked={electricalCapacity === "Y" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="Yes"
                      name="true"
                      {...register("electricalCapacity")}
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => console.log(e)}
                      value="N"
                      checked={electricalCapacity === "N" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="No"
                      name="false"
                      {...register("electricalCapacity")}
                      inline
                    ></Form.Check>
                  </div>
                </Col>
                <br></br>
                <Col className="ms-auto" md={12} xxl lg="12">
                  <div>
                    <Form.Label>
                      {`${t("EP_APPLICANT_PROVISION_OF_33KV_SWITCHING_STATION")}`}
                      {/* Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan */}
                      <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                    </Form.Label>
                    {/* {booleanErr?.LoadSancation ? <p style={{color: 'red'}}>Please select layout plan*</p> : " "} */}
                    <Form.Check
                      onChange={(e) => console.log(e)}
                      value="Y"
                      checked={switchingStation === "Y" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="Yes"
                      name="true"
                      {...register("switchingStation")}
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => console.log(e)}
                      value="N"
                      checked={switchingStation === "N" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="No"
                      name="false"
                      {...register("switchingStation")}
                      inline
                    ></Form.Check>
                  </div>
                </Col>
                <br></br>
                <Col className="ms-auto" md={12} xxl lg="12">
                  <div>
                    <Form.Label>
                      {`${t("EP_APPLICANT_LAND_SANCTION_APPROVAL")}`}
                      {/* Load sanction approval as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp; */}
                    </Form.Label>
                    {/* {booleanErr?.LoadSancation ? <p style={{color: 'red'}}>Please select load sanction*</p> : " "} */}
                    <Form.Check
                      onChange={(e) => console.log(e)}
                      value="Y"
                      checked={loadSancation === "Y" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="Yes"
                      name="true"
                      {...register("LoadSancation")}
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => console.log(e)}
                      value="N"
                      checked={loadSancation === "N" ? true : null}
                      type="radio"
                      id="default-radio"
                      label="No"
                      name="false"
                      {...register("LoadSancation")}
                      inline
                    ></Form.Check>
                  </div>
                </Col>
                <br></br>
                {/* <Col className="ms-auto" md={4} xxl lg="4"></Col> */}
              </Row>
              <br></br>

              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {`${t("EP_APPLICANT_SR_NO")}`}
                      {/* Sr.No. */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {`${t("EP_APPLICANT_DOCUMENT_TYPE")}`}
                      {/* Document's Type/Name */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {" "}
                      {`${t("EP_APPLICANT_ACTIONS")}`}
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
                        {`${t("EP_APPLICANT_SELF_CERTIFIED_DRAWING-TEMPLATE_AS_PER_TCP")}`}
                        {/* Self-certified drawings from empanelled/certified architects that conform to the standard approved template as per the TCP
                        layout plan / Site plan. */}
                      </h2>
                      {drawingErr.selfCenteredDrawings ? (
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
                        className="form-control mb-4"
                        onChange={(e) => getDocumentData(e?.target?.files[0], "selfCenteredDrawings")}
                        id="file-input-1"
                        style={{ display: "none" }}
                      />
                      {fileStoreId?.selfCenteredDrawings ? (
                        <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.selfCenteredDrawings)}>
                          {" "}
                        </VisibilityIcon>
                      ) : (
                        ""
                      )}
                      {applicationId && !fileStoreId?.selfCenteredDrawings && (
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => downloadDocument(selfCenteredDrawing)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                          <IconButton onClick={() => viewDocument(selfCenteredDrawing)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">2.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>
                        {" "}
                        {`${t("EP_APPLICANT_ENVIRONMENT_CLEARANCE")}`}
                        {/* Environmental Clearance. */}
                      </h2>
                      {drawingErr.environmentalClearance ? <p style={{ color: "red" }}>Please upload environmental clearance drawings*</p> : " "}
                    </td>
                    <td component="th" scope="row">
                      <label for="file-input-2">
                        <FileUploadIcon color="primary" />
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => getDocumentData(e?.target?.files[0], "environmentalClearance")}
                        style={{ display: "none" }}
                        id="file-input-2"
                      />
                      {fileStoreId?.environmentalClearance ? (
                        <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.environmentalClearance)}>
                          {" "}
                        </VisibilityIcon>
                      ) : (
                        ""
                      )}
                      {applicationId && !fileStoreId?.environmentalClearance && (
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => downloadDocument(environmental)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                          <IconButton onClick={() => viewDocument(environmental)}>
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
                      <h2>
                        {" "}
                        {`${t("EP_APPLICANT_ELECTRICAL_PLAN_PDF")}`}
                        {/* Electrical plan PDF (OCR Compatible) + GIS format. */}
                      </h2>
                      {drawingErr.pdfFormat ? <p style={{ color: "red" }}>Please upload electrical plan pdf and gis format*</p> : " "}
                    </td>
                    <td component="th" scope="row">
                      <label for="file-input-3">
                        <FileUploadIcon color="primary" />
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => getDocumentData(e?.target?.files[0], "pdfFormat")}
                        style={{ display: "none" }}
                        id="file-input-3"
                      />
                      {fileStoreId?.pdfFormat ? (
                        <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.pdfFormat)}>
                          {" "}
                        </VisibilityIcon>
                      ) : (
                        ""
                      )}
                      {applicationId && !fileStoreId?.pdfFormat && (
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => downloadDocument(pdfFormat)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                          <IconButton onClick={() => viewDocument(pdfFormat)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">4.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>
                        {" "}
                        {`${t("EP_APPLICANT_AUTOCAD_FILE")}`}
                        {/* Electrical plan in AutoCAD (DXF) file. */}
                      </h2>
                      {drawingErr.autoCad ? <p style={{ color: "red" }}>Please upload electrical plan in autocad file*</p> : " "}
                    </td>
                    <td component="th" scope="row">
                      <label for="file-input-4">
                        <FileUploadIcon color="primary" />
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => getDocumentData(e?.target?.files[0], "autoCad")}
                        style={{ display: "none" }}
                        id="file-input-4"
                      />
                      {fileStoreId?.autoCad ? (
                        <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.autoCad)}>
                          {" "}
                        </VisibilityIcon>
                      ) : (
                        ""
                      )}
                      {applicationId && !fileStoreId?.autoCad && (
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => downloadDocument(autoCad)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                          <IconButton onClick={() => viewDocument(autoCad)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">5.</p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <h2>
                        {" "}
                        {`${t("EP_APPLICANT_CERTIFIED_COPY_VERIFIED_THIRD_PARTY")}`}
                        {/* Certified copy of the Electrical plan verified by a third party. */}
                      </h2>
                      {drawingErr.verifiedPlan ? <p style={{ color: "red" }}>Please upload certified copy of the electrical plan*</p> : " "}
                    </td>
                    <td component="th" scope="row">
                      <label for="file-input-5">
                        <FileUploadIcon color="primary" />
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => getDocumentData(e?.target?.files[0], "verifiedPlan")}
                        style={{ display: "none" }}
                        id="file-input-5"
                      />
                      {fileStoreId?.verifiedPlan ? (
                        <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.verifiedPlan)}>
                          {" "}
                        </VisibilityIcon>
                      ) : (
                        ""
                      )}
                      {applicationId && !fileStoreId?.verifiedPlan && (
                        <div className="btn btn-sm col-md-4">
                          <IconButton onClick={() => downloadDocument(verifiedPlan)}>
                            <FileDownload color="primary" className="mx-1" />
                          </IconButton>
                          <IconButton onClick={() => viewDocument(verifiedPlan)}>
                            <VisibilityIcon color="info" className="icon" />
                          </IconButton>
                        </div>
                      )}
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
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Electric Plan Submission</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>
                Your Electric Plan is submitted successfully{" "}
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
          }}
        />
      )}
    </div>
  );
};

export default electricalPlanService;
