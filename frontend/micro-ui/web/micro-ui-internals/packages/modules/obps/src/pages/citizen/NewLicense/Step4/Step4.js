import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm, useFieldArray } from "react-hook-form";
import DDJAYForm from "../Step4/DdjayForm";
import ResidentialPlottedForm from "./ResidentialPlotted";
import IndustrialPlottedForm from "./IndustrialPlotted";
import CommercialPlottedForm from "./CommercialPlotted";
import LayoutPlan from "./LayoutPlan";
import DemarcationPlan from "./DemarcationPlan";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CalculateIcon from "@mui/icons-material/Calculate";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import FileUpload from "@mui/icons-material/FileUpload";
import axios from "axios";
import Spinner from "../../../../components/Loader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../docView/docView.help";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step4";
import { useLocation } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import { CardLabelError } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-react-components";
import _ from "lodash";

const AppliedDetailForm = (props) => {
  const location = useLocation();
  const Purpose = localStorage.getItem("purpose");
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [stepData, setStepData] = useState(null);
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showError, setShowError] = useState({});
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [applicantId, setApplicantId] = useState("");
  const {
    watch,
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(VALIDATION_SCHEMA),
    // validationSchema: VALIDATION_SCHEMA,
    shouldFocusError: true,
    defaultValues: {
      dgpsDetails: [
        {
          longitude: "",
          latitude: "",
        },
        {
          longitude: "",
          latitude: "",
        },
        {
          longitude: "",
          latitude: "",
        },
        {
          longitude: "",
          latitude: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dgpsDetails",
  });

  // const validateDgpsPoint = () => {
  //   const data = getValues("dgpsDetails");
  //   let temp = {};
  //   data.forEach((ele, index) => {
  //     temp = { ...temp, [`dgpsPointLatitude${index}`]: true, [`dgpsPointLongitude${index}`]: true };
  //   });
  //   setShowError({ ...showError, ...temp });
  //   if (
  //     data.every((item) => {
  //       return validateXvalue(item.longitude) && validateYvalue(item.latitude);
  //     })
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const AppliedDetailFormSubmitHandler = async (data) => {
    // if (!validateDgpsPoint()) {
    //   return;
    // }
    setLoader(true);
    const token = window?.localStorage?.getItem("token");
    const postDistrict = {
      pageName: "DetailsofAppliedLand",
      action: "LANDDETAILS",
      applicationNumber: applicantId,
      createdBy: userInfo?.id,
      updatedBy: userInfo?.id,
      LicenseDetails: {
        DetailsofAppliedLand: {
          dgpsDetails: data?.dgpsDetails,
          DetailsAppliedLandPlot: {
            regularOption: data?.regularOption,
            resplotno: data?.resplotno,
            reslengthmtr: data?.reslengthmtr,
            reswidthmtr: data?.reswidthmtr,
            resareasq: data?.resareasq,
            npnlplotno: data?.npnlplotno,
            npnllengthmtr: data?.npnllengthmtr,
            npnlwidthmtr: data?.npnlwidthmtr,
            npnlareasq: data?.npnlareasq,
            ewsplotno: data?.ewsplotno,
            ewslengthmtr: data?.ewslengthmtr,
            ewswidthmtr: data?.ewswidthmtr,
            ewsareasq: data?.ewsareasq,
            complotno: data?.complotno,
            comlengthmtr: data?.comlengthmtr,
            comwidthmtr: data?.comwidthmtr,
            comareasq: data?.comareasq,
            siteplotno: data?.siteplotno,
            sitelengthmtr: data?.sitelengthmtr,
            sitewidthmtr: data?.sitewidthmtr,
            siteareasq: data?.siteareasq,

            parkplotno: data?.parkplotno,
            parklengthmtr: data?.parklengthmtr,
            parkwidthmtr: data?.parkwidthmtr,
            parkareasq: data?.parkareasq,
            publicplotno: data?.publicplotno,
            publiclengthmtr: data?.publiclengthmtr,
            publicwidthmtr: data?.publicwidthmtr,
            publicareasq: data?.publicareasq,

            etpplotno: data?.etpplotno,
            etplengthmtr: data?.etplengthmtr,
            etpwidthmtr: data?.etpwidthmtr,
            etpareasq: data?.etpareasq,
            wtpplotno: data?.wtpplotno,
            wtplengthmtr: data?.wtplengthmtr,
            wtpwidthmtr: data?.wtpwidthmtr,
            wtpareasq: data?.wtpareasq,
            ugtplotno: data?.ugtplotno,
            ugtlengthmtr: data?.ugtlengthmtr,
            ugtwidthmtr: data?.ugtwidthmtr,
            ugtareasq: data?.ugtareasq,
            milkboothplotno: data?.milkboothplotno,
            milkboothlengthmtr: data?.milkboothlengthmtr,
            milkboothwidthmtr: data?.milkboothwidthmtr,
            milkboothareasq: data?.milkboothareasq,
            gssplotno: data?.gssplotno,
            gsslengthmtr: data?.gsslengthmtr,
            gssWidthmtr: data?.gssWidthmtr,
            gssareasq: data?.gssareasq,
            resDimension: data?.resDimension,
            resEnteredArea: data?.resEnteredArea,
            comDimension: data?.comDimension,
            comEnteredArea: data?.comEnteredArea,
            secPlanPlot: data?.secPlanPlot,
            secPlanLength: data?.secPlanLength,
            secPlanDim: data?.secPlanDim,
            secPlanEntered: data?.secPlanEntered,
            greenBeltPlot: data?.greenBeltPlot,
            greenBeltLength: data?.greenBeltLength,
            greenBeltDim: data?.greenBeltDim,
            greenBeltEntered: data?.greenBeltEntered,
            internalPlot: data?.internalPlot,
            internalLength: data?.internalLength,
            internalDim: data?.internalDim,
            internalEntered: data?.internalEntered,
            otherPlot: data?.otherPlot,
            otherLength: data?.otherLength,
            otherDim: data?.otherDim,
            otherEntered: data?.otherEntered,
            undeterminedPlot: data?.undeterminedPlot,
            undeterminedLength: data?.undeterminedLength,
            undeterminedDim: data?.undeterminedDim,
            undeterminedEntered: data?.undeterminedEntered,
          },
          DetailsAppliedLandDdjay: {
            frozenNo: data?.frozenNo,
            frozenArea: data?.frozenArea,
            organize: data?.organize,
            organizeArea: data?.organizeArea,
          },
          DetailsAppliedLandIndustrial: {
            colonyfiftyNo: data?.colonyfiftyNo,
            colonyfiftyArea: data?.colonyfiftyArea,
            fiftyToTwoNo: data?.fiftyToTwoNo,
            fiftyToTwoArea: data?.fiftyToTwoArea,
            twoHundredNo: data?.twoHundredNo,
            twoHundredArea: data?.twoHundredArea,
            resiNo: data?.resiNo,
            resiArea: data?.resiArea,
            commerNo: data?.commerNo,
            commerArea: data?.commerArea,
            labourNo: data?.labourNo,
            labourArea: data?.labourArea,
          },
          DetailsAppliedLandResidential: {
            npnlNo: data?.npnlNo,
            npnlArea: data?.npnlArea,
            ewsNo: data?.ewsNo,
            ewsArea: data?.ewsArea,
          },
          DetailsAppliedLandCommercial: {
            noOfPlotsSealableOneFifty: data?.noOfPlotsSealableOneFifty,
            noOfPlotsSealableOneSeventyfive: data?.noOfPlotsSealableOneSeventyfive,
            scoPlotno: data?.scoPlotno,
            scoLength: data?.scoLength,
            scoWidth: data?.scoWidth,
            scoArea: data?.scoArea,
            scoSimilarShape: data?.scoSimilarShape,
            boothPlotno: data?.boothPlotno,
            boothLength: data?.boothLength,
            boothWidth: data?.boothWidth,
            boothArea: data?.boothArea,
            boothSimilarShape: data?.boothSimilarShape,
            stpPlotno: data?.stpPlotno,
            stpLength: data?.stpLength,
            stpWidth: data?.stpWidth,
            stpArea: data?.stpArea,
            stpSimilarShape: data?.stpSimilarShape,
            wtpPlotno: data?.wtpPlotno,
            wtpLength: data?.wtpLength,
            wtpWidth: data?.wtpWidth,
            wtpArea: data?.wtpArea,
            wtpSimilarShape: data?.wtpSimilarShape,
            ugtPlotno: data?.ugtPlotno,
            ugtLength: data?.ugtLength,
            ugtWidth: data?.ugtWidth,
            ugtArea: data?.ugtArea,
            ugtSimilarShape: data?.ugtSimilarShape,
            milkPlotno: data?.milkPlotno,
            milkLength: data?.milkLength,
            milkWidth: data?.milkWidth,
            milkArea: data?.milkArea,
            milkSimilarShape: data?.milkSimilarShape,
            gssPlotno: data?.gssPlotno,
            gssLength: data?.gssLength,
            gssWidth: data?.gssWidth,
            gssArea: data?.gssArea,
            gssSimilarShape: data?.gssSimilarShape,
            etcDim: data?.etcDim,
            etcArea: data?.etcArea,
          },
          DetailsAppliedLandNILP: {
            surrenderArea: data?.surrenderArea,
            surrender: data?.surrender,
            pocketAreaEnter: data?.pocketAreaEnter,
            pocketProposed: data?.pocketProposed,
            pocketDim: data?.pocketDim,
            deposit: data?.deposit,
            depositArea: data?.depositArea,
            surrendered: data?.surrendered,
            surrenderedDim: data?.surrenderedDim,
          },
          DetailsAppliedLayoutPlan: {
            uploadLayoutPlan: data?.uploadLayoutPlan,
          },
          DetailsAppliedDemarcationPlan: {
            demarcationPlan: data?.demarcationPlan,
          },
          DetailsAppliedLand: {
            demarcationPlan: data?.demarcationPlan,
            democraticPlan: data?.democraticPlan,
            sectoralPlan: data?.sectoralPlan,
            planCrossSection: data?.planCrossSection,
            uploadLayoutPlan: data?.uploadLayoutPlan,
            publicHealthServices: data?.publicHealthServices,
            designRoad: data?.designRoad,
            designSewarage: data?.designSewarage,
            designDisposal: data?.designDisposal,
            undertakingChange: data?.undertakingChange,
            hostedLayoutPlan: data?.hostedLayoutPlan,
            reportObjection: data?.reportObjection,
            consentRera: data?.consentRera,
            undertaking: data?.undertaking,
            detailedElectricSupply: data?.detailedElectricSupply,
            proposedColony: data?.proposedColony,
          },
        },
      },
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: token,
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios.post("/tl-services/new/_create", postDistrict);
      const useData = Resp?.data?.LicenseServiceResponseInfo?.[0]?.LicenseDetails?.[0];
      setLoader(false);
      props.Step4Continue(useData, Resp?.data?.LicenseServiceResponseInfo?.[0]);
    } catch (error) {
      setLoader(false);
      return error?.message;
    }
  };

  useEffect(() => {
    const valueData = stepData?.DetailsofAppliedLand;
    if (valueData) {
      Object?.keys(valueData?.DetailsAppliedLandPlot)?.map((item) => setValue(item, valueData?.DetailsAppliedLandPlot[item]));
      Object?.keys(valueData?.DetailsAppliedLandNILP)?.map((item) => setValue(item, valueData?.DetailsAppliedLandNILP[item]));
      valueData?.dgpsDetails.map((item, index) => {
        setValue(`dgpsDetails.${index}.longitude`, item?.longitude), setValue(`dgpsDetails.${index}.latitude`, item?.latitude);
      });
    }
  }, [stepData]);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:80/land-services/new/licenses/_get?id=${props.getId}`).then((response) => {
        return response;
      });
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    getSubmitDataLabel();
  }, []);

  const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ key: "error" });
      setToastMessage("Duplicate file Selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      if (fieldName === "hostedLayoutPlan") {
        setValue("hostedLayoutPlanFileName", file.name);
      }
      if (fieldName === "consentRera") {
        setValue("consentReraFileName", file.name);
      }
      if (fieldName === "sectoralPlan") {
        setValue("sectoralPlanFileName", file.name);
      }
      if (fieldName === "detailedElectricSupply") {
        setValue("detailedElectricSupplyFileName", file.name);
      }
      if (fieldName === "planCrossSection") {
        setValue("planCrossSectionFileName", file.name);
      }
      if (fieldName === "publicHealthServices") {
        setValue("publicHealthServicesFileName", file.name);
      }
      if (fieldName === "designRoad") {
        setValue("designRoadFileName", file.name);
      }
      if (fieldName === "designSewarage") {
        setValue("designSewarageFileName", file.name);
      }
      if (fieldName === "designDisposal") {
        setValue("designDisposalFileName", file.name);
      }
      if (fieldName === "undertakingChange") {
        setValue("undertakingChangeFileName", file.name);
      }
      if (fieldName === "proposedColony") {
        setValue("proposedColonyFileName", file.name);
      }
      if (fieldName === "reportObjection") {
        setValue("reportObjectionFileName", file.name);
      }
      if (fieldName === "undertaking") {
        setValue("undertakingFileName", file.name);
      }
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToast({ key: "success" });
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  const handleWorkflow = async () => {
    const token = window?.localStorage?.getItem("token");
    setLoader(true);
    const payload = {
      ProcessInstances: [
        {
          businessService: "NewTL",
          documents: null,
          businessId: applicantId,
          tenantId: "hr",
          moduleName: "TL",
          action: "LANDDETAILS",
          previousStatus: "LANDSCHEDULE",
          comment: null,
        },
      ],
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: token,
      },
    };
    try {
      await axios.post("/egov-workflow-v2/egov-wf/process/_transition", payload);
      setLoader(false);
      props?.step4Back();
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  const getApplicantUserData = async (id) => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      apiId: "Rainmaker",
      msgId: "1669293303096|en_IN",
      authToken: token,
    };
    try {
      const Resp = await axios.post(`/tl-services/new/licenses/object/_getByApplicationNumber?applicationNumber=${id}`, payload);
      const userData = Resp?.data?.LicenseDetails?.[0];
      setStepData(userData);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const search = location?.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");
    setApplicantId(id?.toString());
    if (id) getApplicantUserData(id);
  }, []);
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);

  // const validateXvalue = (value) => {
  //   if (value >= 432100.0 && value <= 751900.0 && value.toString().includes(".")) {
  //     const decimalPlaces = value.toString().split(".")[1];
  //     if (decimalPlaces.length === 3) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  // const validateYvalue = (value) => {
  //   if (value >= 3054400.0 && value <= 3425500.0 && value.toString().includes(".")) {
  //     const decimalPlaces = value.toString().split(".")[1];
  //     if (decimalPlaces.length === 3) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  return (
    <div>
      <ScrollToTop />
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(AppliedDetailFormSubmitHandler)}>
        <Card style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New Licence Application </h4>
          <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
            <Form.Group className="justify-content-center" controlId="formBasicEmail">
              <Row className="ml-auto" style={{ marginBottom: 5 }}>
                <Col col-12>
                  <h4>
                    1. DGPS points{" "}
                    <span className="text-primary">
                      {" "}
                      <a onClick={() => setmodal1(true)}>
                        (Click here for instructions to receive DGPS-based coordinate points of the colony boundary)
                      </a>
                    </span>
                    <span style={{ color: "red" }}>*</span>
                    <div>
                      <Modal
                        size="lg"
                        isOpen={modal1}
                        toggle={() => setmodal(!modal1)}
                        style={{ width: "500px", height: "200px" }}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <ModalHeader toggle={() => setmodal1(!modal1)}></ModalHeader>
                        <ModalBody style={{ fontSize: 20 }}>
                          <h2>
                            {" "}
                            <b> A.</b> Applicant level Information: DGPS-based survey to be executed at the applicant level to collect coordinate
                            points of the colony boundary. <br></br>• DGPS Coordinate points to be collected for each divergent/edge of the colony
                            boundary.<br></br> • DGPS Coordinate Points to be entered by the applicant in e-License application in Web Form.<br></br>
                            <b> B.</b> Web Form Fields at applicant level: Input Fields to be added in the web-form for entering the DGPS points.
                            <br></br> • Input Fields for entering number of DGPS Points <br></br>• Input Fields for each DGPS Point: <br></br>o Add
                            Point 1 as Point 1: (X: Longitude, Y: Latitude) <br></br>o Add Point 2 as Point 2: (X: Longitude, Y: Latitude) <br></br>o
                            Add Point XX as Point XX: (X: Longitude, Y: Latitude)
                          </h2>
                        </ModalBody>
                        <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
                      </Modal>
                    </div>
                  </h4>
                  <br></br>
                  <div className="px-2">
                    {fields?.map((item, index) => (
                      <div key={item?.id}>
                        <span>Add point {index + 1} &nbsp;</span>
                        <div className="row ">
                          <div className="col col-4">
                            <label>X:Longitude</label>
                            <input
                              type="number"
                              className="form-control"
                              {...register(`dgpsDetails.${index}.longitude`)}
                              // onBlur={() => setShowError({ ...showError, [`dgpsPointLongitude${index}`]: true })}
                            />
                            {/* {showError?.[`dgpsPointLongitude${index}`] && !validateXvalue(watch("dgpsDetails")[index].longitude) ? (
                              <CardLabelError style={{ color: "red" }}>
                                X:Longitude{index + 1} is not valid. It should be in between 432100.0 and 751900.0
                              </CardLabelError>
                            ) : null} */}
                          </div>
                          <div className="col col-4">
                            <label>Y:Latitude</label>
                            <input
                              type="number"
                              className="form-control"
                              {...register(`dgpsDetails.${index}.latitude`)}
                              // onBlur={() => setShowError({ ...showError, [`dgpsPointLatitude${index}`]: true })}
                            />
                            {/* {showError?.[`dgpsPointLatitude${index}`] && !validateYvalue(watch("dgpsDetails")[index].latitude) ? (
                              <CardLabelError style={{ color: "red" }}>
                                Y:Latitude{index + 1} is not valid. It should be in between 3054400.0 and 3425500.0
                              </CardLabelError>
                            ) : null} */}
                          </div>
                        </div>
                        {index > 3 && (
                          <button type="button" style={{ float: "right" }} className="btn btn-primary" onClick={() => remove(index)}>
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      style={{ float: "right", marginRight: 15 }}
                      className="btn btn-primary"
                      onClick={() => append({ longitude: "", latitude: "" })}
                      // onClick={() => {
                      //   validateDgpsPoint();
                      // }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      style={{ float: "right", marginRight: 15 }}
                      className="btn btn-primary"
                      onClick={() => {
                        console.log("showError", showError);
                        if (!_.isEmpty(showError)) {
                          // const status = Object.keys(showError).every((k) => showError[k]);
                          // console.log(status);
                          setShowToastError({ key: "error" });
                          setToastMessage("Please fill enter all DGPS Points");
                        } else
                          window.open(
                            `/digit-ui/WNS/wmsmap.html?latlngs=${watch("dgpsDetails")
                              ?.map((element) => `${element.latitude},${element.longitude}`)
                              .join(":")}`
                          );
                      }}
                    >
                      View On Map
                    </button>
                  </div>

                  <br></br>

                  <br></br>
                  <div>
                    <h5>
                      2.Details of Plots <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                      <label htmlFor="regularOption">
                        &nbsp;&nbsp;
                        <input {...register("regularOption")} type="radio" value="regular" id="regularOption" />
                        &nbsp;&nbsp; Regular &nbsp;&nbsp;
                      </label>
                      <label htmlFor="regularOption">
                        <input {...register("regularOption")} type="radio" value="Irregular" id="regularOption" />
                        &nbsp;&nbsp; Irregular &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.regularOption && errors?.regularOption?.message}
                      </h3>
                    </h5>
                  </div>
                  {watch("regularOption") === "regular" && (
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <td>Type of plots</td>
                          <td>Plot No.</td>
                          <td>
                            Length in mtr <CalculateIcon color="primary" />
                          </td>
                          <td>
                            Width in mtr <CalculateIcon color="primary" />
                          </td>
                          <td>
                            Area (in sqm) <CalculateIcon color="primary" />
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">Residential</p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                Gen <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.resplotno && errors?.resplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("resplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("reslengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("reswidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("resareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                NPNL <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.npnlplotno && errors?.npnlplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("npnlplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("npnllengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("npnlwidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("npnlareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                EWS <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.ewsplotno && errors?.ewsplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("ewsplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("ewslengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("ewswidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("ewsareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                Commercial <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.complotno && errors?.complotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("complotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("comlengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("comwidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("comareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                Community Sites <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.siteplotno && errors?.siteplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("siteplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("sitelengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("sitewidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("siteareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                Parks <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.parkplotno && errors?.parkplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("parkplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("parklengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("parkwidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("parkareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2" x>
                                Public Utilities
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                STP <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.publicplotno && errors?.publicplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("publicplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("publiclengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("publicwidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("publicareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                ETP <span style={{ color: "red" }}>*</span>
                              </p>

                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.etpplotno && errors?.etpplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("etpplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("etplengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("etpwidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("etpareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                WTP <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.wtpplotno && errors?.wtpplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("wtpplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("wtplengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("wtpwidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("wtpareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                UGT <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.ugtplotno && errors?.ugtplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("ugtplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("ugtlengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("ugtwidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("ugtareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                Milk Booth <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.milkboothplotno && errors?.milkboothplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("milkboothplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("milkboothlengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("milkboothwidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("milkboothareasq")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">
                                GSS <span style={{ color: "red" }}>*</span>
                              </p>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.gssplotno && errors?.gssplotno?.message}
                              </h3>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("gssplotno")} />
                          </td>

                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("gsslengthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("gssWidthmtr")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("gssareasq")} />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  )}
                  {watch("regularOption") === "Irregular" && (
                    <div>
                      <div className="table table-bordered table-responsive ">
                        <thead>
                          <tr>
                            <td>Details of Plot</td>
                            <td>
                              Dimensions (in mtrs) <CalculateIcon color="primary" />
                            </td>
                            <td>Enter Area (in sqm)</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="px-2">
                                <p className="mb-2">
                                  Residential <span style={{ color: "red" }}>*</span>
                                </p>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.resDimension && errors?.resDimension?.message}
                                </h3>
                              </div>
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("resDimension")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("resEnteredArea")} />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="px-2">
                                <p className="mb-2">
                                  Commercial <span style={{ color: "red" }}>*</span>{" "}
                                </p>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.comDimension && errors?.comDimension?.message}
                                </h3>
                              </div>
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("comDimension")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("comEnteredArea")} />
                            </td>
                          </tr>
                        </tbody>
                      </div>
                      <h5>Area Under</h5>
                      <div className="table table-bordered table-responsive">
                        <thead>
                          <tr>
                            <td>Detail of plots</td>
                            <td> Plot No.</td>
                            <td>
                              Length (in mtrs) <CalculateIcon color="primary" />
                            </td>
                            <td>
                              Dimension (in mtrs) <CalculateIcon color="primary" />
                            </td>
                            <td>Enter Area (in sqm)</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="px-2">
                                <p className="mb-2">
                                  Sectoral Plan Road <span style={{ color: "red" }}>*</span>
                                </p>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.secPlanPlot && errors?.secPlanPlot?.message}
                                </h3>
                              </div>
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("secPlanPlot")} />{" "}
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("secPlanLength")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("secPlanDim")} />{" "}
                            </td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" {...register("secPlanEntered")} />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="px-2">
                                <p className="mb-2">
                                  Green Belt <span style={{ color: "red" }}>*</span>
                                </p>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.greenBeltPlot && errors?.greenBeltPlot?.message}
                                </h3>
                              </div>
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("greenBeltPlot")} />
                            </td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" {...register("greenBeltLength")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("greenBeltDim")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("greenBeltEntered")} />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="px-2">
                                <p className="mb-2">
                                  24/18 mtr wide internal circulation Plan road <span style={{ color: "red" }}>*</span>
                                </p>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.internalPlot && errors?.internalPlot?.message}
                                </h3>
                              </div>
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("internalPlot")} />
                            </td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" {...register("internalLength")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("internalDim")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("internalEntered")} />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="px-2">
                                <p className="mb-2">
                                  Other Roads <span style={{ color: "red" }}>*</span>
                                </p>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.otherPlot && errors?.otherPlot?.message}
                                </h3>
                              </div>
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("otherPlot")} />
                            </td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" {...register("otherLength")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("otherDim")} />
                            </td>
                            <td align="right">
                              {" "}
                              <input type="number" className="form-control" {...register("otherEntered")} />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="px-2">
                                <p className="mb-2">
                                  Undetermined use(UD) <span style={{ color: "red" }}>*</span>
                                </p>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.undeterminedPlot && errors?.undeterminedPlot?.message}
                                </h3>
                              </div>
                            </td>
                            <td align="right">
                              <input type="number" className="form-control" {...register("undeterminedPlot")} />
                            </td>
                            <td component="th" scope="row">
                              <input type="number" className="form-control" {...register("undeterminedLength")} />
                            </td>
                            <td align="right">
                              <input type="number" className="form-control" {...register("undeterminedDim")} />
                            </td>
                            <td align="right">
                              <input type="number" className="form-control" {...register("undeterminedEntered")} />
                            </td>
                          </tr>
                        </tbody>
                      </div>
                    </div>
                  )}
                  <div>{Purpose === "DDJAY_APHP" && <DDJAYForm watch={watch} register={register} />}</div>
                  <div>{Purpose === "RPL" && <ResidentialPlottedForm register={register} />}</div>
                  <div>{Purpose === "IPL" && <IndustrialPlottedForm register={register} />}</div>
                  <div>{Purpose === "CPL" && <CommercialPlottedForm register={register} />}</div>
                  <h5 className="text-black">NILP </h5>
                  <br></br>
                  <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <td>S.No.</td>
                        <td>NLP Details</td>
                        <td>Yes/No</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1. </td>
                        <td>
                          {" "}
                          Whether you want to surrender the 10% area of licence colony to Govt. the instead of providing 10% under EWS and NPNL plots
                          <span style={{ color: "red" }}>*</span>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.surrender && errors?.surrender?.message}
                          </h3>
                        </td>
                        <td style={{ display: "flex", gap: "8px" }} component="th" scope="row">
                          <label htmlFor="surrender">
                            <input {...register("surrender")} type="radio" value="Y" id="surrender" />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="surrender">
                            <input {...register("surrender")} type="radio" value="N" id="surrender" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>

                          {watch("surrender") === "Y" && (
                            <div className="row ">
                              <div className="col col-12">
                                <label>Area in Acres </label>

                                <input type="text" className="form-control" {...register("surrenderArea")} />
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>2. </td>
                        <td>
                          Whether any pocket proposed to be transferred less than 1 acre <span style={{ color: "red" }}>*</span>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.pocketProposed && errors?.pocketProposed?.message}
                          </h3>
                        </td>
                        <td style={{ display: "flex", gap: "8px" }} component="th" scope="row">
                          <label htmlFor="pocketProposed">
                            <input {...register("pocketProposed")} type="radio" value="Y" id="pocketProposed" />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="pocketProposed">
                            <input {...register("pocketProposed")} type="radio" value="N" id="pocketProposed" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>

                          {watch("pocketProposed") === "Y" && (
                            <div className="row ">
                              <div className="col col-6">
                                <label>
                                  Dimension (in mtr)&nbsp;&nbsp;
                                  <CalculateIcon color="primary" />
                                </label>
                                <input type="text" className="form-control" {...register("pocketDim")} />
                              </div>
                              <div className="col col-6">
                                <label> Enter Area </label>
                                <input type="text" className="form-control" {...register("pocketAreaEnter")} />
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>3. </td>
                        <td>
                          Whether you want to deposit an amount @ of 3 times of collector rate instead of the surrender 10% land to Govt.
                          <span style={{ color: "red" }}>*</span>{" "}
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.deposit && errors?.deposit?.message}
                          </h3>
                        </td>
                        <td style={{ display: "flex", gap: "8px" }} component="th" scope="row">
                          <label htmlFor="deposit">
                            <input {...register("deposit")} type="radio" value="Y" id="deposit" />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="deposit">
                            <input {...register("deposit")} type="radio" value="N" id="deposit" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>

                          {watch("deposit") === "Y" && (
                            <div className="row ">
                              <div className="col col-12">
                                <label>
                                  Area in Acres &nbsp;&nbsp;
                                  <CalculateIcon color="primary" />
                                </label>
                                <input type="text" className="form-control" {...register("depositArea")} />
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>4. </td>
                        <td>
                          Whether the surrendered area is having a minimum of 18 mtr independent access <span style={{ color: "red" }}>*</span>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.surrendered && errors?.surrendered?.message}
                          </h3>
                        </td>
                        <td style={{ display: "flex", gap: "8px" }} component="th" scope="row">
                          <label htmlFor="surrendered">
                            <input {...register("surrendered")} type="radio" value="Y" id="surrendered" />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="surrendered">
                            <input {...register("surrendered")} type="radio" value="N" id="surrendered" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>

                          {watch("surrendered") === "Y" && (
                            <div className="row ">
                              <div className="col col-12">
                                <label>
                                  Dimension(in mtr) &nbsp;&nbsp;
                                  <CalculateIcon color="primary" />
                                </label>

                                <input type="text" className="form-control" {...register("surrenderedDim")} />
                              </div>
                              <div className="col col-12">
                                <label>Enter Area</label>
                                <input type="text" className="form-control" {...register("area")} />
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </div>
                  <hr />
                  <br></br>
                  <h5>Mandatory Documents</h5>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Whether you hosted the existing approved layout plan & in-principle approved layout on the website of your company/organization Yes/No if yes upload"
                      >
                        Hosted layout plan.<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "hostedLayoutPlan")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.hostedLayoutPlan ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.hostedLayoutPlan)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("hostedLayoutPlanFileName") ? watch("hostedLayoutPlanFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.hostedLayoutPlan && errors?.hostedLayoutPlan?.message}
                      </h3>
                    </div>

                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Consent of RERA if there is any change in the phasing ."
                      >
                        Consent of RERA. <span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "consentRera")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.consentRera ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.consentRera)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("consentReraFileName") ? watch("consentReraFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.consentRera && errors?.consentRera?.message}
                      </h3>
                    </div>
                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Sectoral Plan.<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "sectoralPlan")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.sectoralPlan ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.sectoralPlan)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("sectoralPlanFileName") ? watch("sectoralPlanFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.sectoralPlan && errors?.sectoralPlan?.message}
                      </h3>
                    </div>
                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Copy of detailed specifications and designs for electric supply including street lighting"
                      >
                        Designs for electric supply.<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "detailedElectricSupply")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.detailedElectricSupply ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.detailedElectricSupply)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("detailedElectricSupplyFileName") ? watch("detailedElectricSupplyFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.detailedElectricSupply && errors?.detailedElectricSupply?.message}
                      </h3>
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Copy of plans showing cross sections of proposed roads indicating, in particular, the width of proposed carriage ways cycle tracks and footpaths etc"
                      >
                        Plans showing cross sections.<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "planCrossSection")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.planCrossSection ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.planCrossSection)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("planCrossSectionFileName") ? watch("planCrossSectionFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.planCrossSection && errors?.planCrossSection?.message}
                      </h3>
                    </div>

                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Copy of plans indicating, in addition, the position of sewers, stormwater channels, water supply and any other public health services."
                      >
                        Plans indicating position of public.<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "publicHealthServices")}
                        />
                      </label>
                      {fileStoreId?.publicHealthServices ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.publicHealthServices)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("publicHealthServicesFileName") ? watch("publicHealthServicesFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.publicHealthServices && errors?.publicHealthServices?.message}
                      </h3>
                    </div>
                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Copy of detailed specifications and designs of road works and estimated costs thereof"
                      >
                        Specifications and designs.<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "designRoad")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.designRoad ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.designRoad)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("designRoadFileName") ? watch("designRoadFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.designRoad && errors?.designRoad?.message}
                      </h3>
                    </div>
                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Copy of detailed specifications and designs of sewerage, storm, water and water supply works and estimated costs thereof"
                      >
                        Designs of sewerage and storm. <span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "designSewarage")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.designSewarage ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.designSewarage)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("designSewarageFileName") ? watch("designSewarageFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.designSewarage && errors?.designSewarage?.message}
                      </h3>
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Copy of detailed specifications and designs for disposal and treatment of storm and sullage water and estimated costs of works."
                      >
                        Disposal treatment.<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "designDisposal")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.designDisposal ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.designDisposal)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("designDisposalFileName") ? watch("designDisposalFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.designDisposal && errors?.designDisposal?.message}
                      </h3>
                    </div>

                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Whether intimated each of the allottees through registered post regarding the proposed changes in the layout plan: - If yes selected upload"
                      >
                        Undertaking that no change. <span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "undertakingChange")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.undertakingChange ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.undertakingChange)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("undertakingChangeFileName") ? watch("undertakingChangeFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.undertakingChange && errors?.undertakingChange?.message}
                      </h3>
                    </div>

                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Explanatory note regarding the salient feature of the proposed colony."
                      >
                        Salient feature of the colony. <span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "proposedColony")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.proposedColony ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.proposedColony)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("proposedColonyFileName") ? watch("proposedColonyFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.proposedColony && errors?.proposedColony?.message}
                      </h3>
                    </div>

                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Report any objection. <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;&nbsp;
                      </h6>{" "}
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "reportObjection")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.reportObjection ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.reportObjection)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("reportObjectionFileName") ? watch("reportObjectionFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.reportObjection && errors?.reportObjection?.message}
                      </h3>
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h6
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Undertaking that no change has been made in the phasing "
                      >
                        Undertaking.<span style={{ color: "red" }}>*</span>
                      </h6>{" "}
                      <label>
                        <FileUpload color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "undertaking")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {fileStoreId?.undertaking ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.undertaking)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("undertakingFileName") ? watch("undertakingFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.undertaking && errors?.undertaking?.message}
                      </h3>
                    </div>
                    <div className="col col-9">
                      {Purpose === "RPL" && <LayoutPlan watch={watch} register={register} />}
                      {Purpose === "IPL" && <LayoutPlan watch={watch} register={register} />}
                      {Purpose === "IPA" && <LayoutPlan watch={watch} register={register} />}
                      {Purpose === "CPL" && <LayoutPlan watch={watch} register={register} />}
                      {Purpose === "CIC" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "ITP" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "ITC" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "CIR" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "RGP" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "AHP" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "SGC" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "CIS" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "DDJAY_APHP" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "MLU-CZ" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "MLU-RZ" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "NILP" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "LDEF" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "NILPC" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "TODGH" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "TODCOMM" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "TODIT" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "TODMUD" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "SPRPRGH" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "DRH" && <DemarcationPlan watch={watch} register={register} />}
                      {Purpose === "RHP" && <DemarcationPlan watch={watch} register={register} />}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 text-left">
                      <div id="btnClear" class="btn btn-primary btn-md center-block" onClick={() => handleWorkflow()}>
                        Back
                      </div>
                    </div>
                    <div class="col-sm-12 text-right">
                      <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                        Save and Continue
                      </button>
                    </div>
                  </div>
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
                      label={toastMessage}
                      isDleteBtn={true}
                      onClose={() => {
                        setShowToastError(null);
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Form.Group>
          </Card>
        </Card>
      </form>
    </div>
  );
};

export default AppliedDetailForm;
