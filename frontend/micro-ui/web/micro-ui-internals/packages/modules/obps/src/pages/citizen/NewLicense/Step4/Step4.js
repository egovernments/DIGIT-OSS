import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ResidentialPlottedForm from "./ResidentialPlotted";
import DDJAYForm from "../Step4/DdjayForm";
import IndustrialPlottedForm from "./IndustrialPlotted";
import CommercialPlottedForm from "./CommercialPlotted";
import NilpForm from "./Nilp";
import ResidentialGroupHousingForm from "./ResidentialGroupHousing";
import AffordableGroupHousingForm from "./AffordableGroupHousing";
import CommercialIntegratedForm from "./CommercialIntegrated";
import IILPForm from "./IILPForm";
import ITCyberCityForm from "./ITCyberCity";
import MixedLandUseForm from "./MixedLandUse";
import RetirementHousingForm from "./RetirementHousing";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";
import LayoutPlan from "./LayoutPlan";
import DemarcationPlan from "./DemarcationPlan";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import axios from "axios";
import Spinner from "../../../../components/Loader";
import { getDocShareholding } from "../docView/docView.help";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step4";
import { useLocation } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import { CardLabelError } from "@egovernments/digit-ui-react-components";
import { Toast } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import NumberInput from "../../../../components/NumberInput";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CusToaster from "../../../../components/Toaster";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

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
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [toastMessage, setToastMessage] = useState(null);
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [applicantId, setApplicantId] = useState("");
  const [modalData, setModalData] = useState([]);
  const [error, setError] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [getData, setData] = useState({ caseNumber: "", dairyNumber: "" });
  const [newDataA, setNewDataA] = useState({});
  const [getFarArr, setFarArr] = useState([]);
  const [getUpdatedData, setUpdatedData] = useState(null);

  const {
    watch,
    register,
    handleSubmit,
    resetField,
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
      detailOfCommunitySites: [
        {
          communitySiteName: "",
          provided: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dgpsDetails",
  });

  const { fields: detailsArray, append: detailsAppend, remove: detailsRemoce } = useFieldArray({
    control,
    name: "detailOfCommunitySites",
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
    // console.log("data", newDataA);
    // return;
    setLoader(true);
    delete data["dgpsDetails"];
    const token = window?.localStorage?.getItem("token");
    const postDistrict = {
      pageName: "DetailsofAppliedLand",
      action: "LANDDETAILS",
      applicationNumber: applicantId,
      createdBy: userInfo?.id,
      updatedBy: userInfo?.id,
      LicenseDetails: {
        DetailsofAppliedLand: {
          dgpsDetails: modalData,
          PurposeDetails: newDataA,
          DetailsAppliedLandPlot: {
            ...data,
            // regularOption: data?.regularOption,
            // resplotno: data?.resplotno,
            // reslengthmtr: data?.reslengthmtr,
            // reswidthmtr: data?.reswidthmtr,
            // resareasq: data?.resareasq,
            // npnlplotno: data?.npnlplotno,
            // npnllengthmtr: data?.npnllengthmtr,
            // npnlwidthmtr: data?.npnlwidthmtr,
            // npnlareasq: data?.npnlareasq,
            // ewsplotno: data?.ewsplotno,
            // ewslengthmtr: data?.ewslengthmtr,
            // ewswidthmtr: data?.ewswidthmtr,
            // ewsareasq: data?.ewsareasq,
            // complotno: data?.complotno,
            // comlengthmtr: data?.comlengthmtr,
            // comwidthmtr: data?.comwidthmtr,
            // comareasq: data?.comareasq,
            // siteplotno: data?.siteplotno,
            // sitelengthmtr: data?.sitelengthmtr,
            // sitewidthmtr: data?.sitewidthmtr,
            // siteareasq: data?.siteareasq,
            // parkplotno: data?.parkplotno,
            // parklengthmtr: data?.parklengthmtr,
            // parkwidthmtr: data?.parkwidthmtr,
            // parkareasq: data?.parkareasq,
            // publicplotno: data?.publicplotno,
            // publiclengthmtr: data?.publiclengthmtr,
            // publicwidthmtr: data?.publicwidthmtr,
            // publicareasq: data?.publicareasq,
            // etpplotno: data?.etpplotno,
            // etplengthmtr: data?.etplengthmtr,
            // etpwidthmtr: data?.etpwidthmtr,
            // etpareasq: data?.etpareasq,
            // wtpplotno: data?.wtpplotno,
            // wtplengthmtr: data?.wtplengthmtr,
            // wtpwidthmtr: data?.wtpwidthmtr,
            // wtpareasq: data?.wtpareasq,
            // ugtplotno: data?.ugtplotno,
            // ugtlengthmtr: data?.ugtlengthmtr,
            // ugtwidthmtr: data?.ugtwidthmtr,
            // ugtareasq: data?.ugtareasq,
            // milkboothplotno: data?.milkboothplotno,
            // milkboothlengthmtr: data?.milkboothlengthmtr,
            // milkboothwidthmtr: data?.milkboothwidthmtr,
            // milkboothareasq: data?.milkboothareasq,
            // gssplotno: data?.gssplotno,
            // gsslengthmtr: data?.gsslengthmtr,
            // gssWidthmtr: data?.gssWidthmtr,
            // gssareasq: data?.gssareasq,
            // resDimension: data?.resDimension,
            // resEnteredArea: data?.resEnteredArea,
            // comDimension: data?.comDimension,
            // comEnteredArea: data?.comEnteredArea,
            // secPlanPlot: data?.secPlanPlot,
            // secPlanLength: data?.secPlanLength,
            // secPlanDim: data?.secPlanDim,
            // secPlanEntered: data?.secPlanEntered,
            // greenBeltPlot: data?.greenBeltPlot,
            // greenBeltLength: data?.greenBeltLength,
            // greenBeltDim: data?.greenBeltDim,
            // greenBeltEntered: data?.greenBeltEntered,
            // internalPlot: data?.internalPlot,
            // internalLength: data?.internalLength,
            // internalDim: data?.internalDim,
            // internalEntered: data?.internalEntered,
            // otherPlot: data?.otherPlot,
            // otherLength: data?.otherLength,
            // otherDim: data?.otherDim,
            // otherEntered: data?.otherEntered,
            // undeterminedPlot: data?.undeterminedPlot,
            // undeterminedLength: data?.undeterminedLength,
            // undeterminedDim: data?.undeterminedDim,
            // undeterminedEntered: data?.undeterminedEntered,
          },
          // DetailsAppliedLandDdjay: {
          //   frozenNo: data?.frozenNo,
          //   frozenArea: data?.frozenArea,
          //   organize: data?.organize,
          //   organizeArea: data?.organizeArea,
          // },
          // DetailsAppliedLandIndustrial: {
          //   colonyfiftyNo: data?.colonyfiftyNo,
          //   colonyfiftyArea: data?.colonyfiftyArea,
          //   fiftyToTwoNo: data?.fiftyToTwoNo,
          //   fiftyToTwoArea: data?.fiftyToTwoArea,
          //   twoHundredNo: data?.twoHundredNo,
          //   twoHundredArea: data?.twoHundredArea,
          //   resiNo: data?.resiNo,
          //   resiArea: data?.resiArea,
          //   commerNo: data?.commerNo,
          //   commerArea: data?.commerArea,
          //   labourNo: data?.labourNo,
          //   labourArea: data?.labourArea,
          // },
          // DetailsAppliedLandResidential: {
          //   npnlNo: data?.npnlNo,
          //   npnlArea: data?.npnlArea,
          //   ewsNo: data?.ewsNo,
          //   ewsArea: data?.ewsArea,
          // },
          // DetailsAppliedLandCommercial: {
          //   noOfPlotsSealableOneFifty: data?.noOfPlotsSealableOneFifty,
          //   noOfPlotsSealableOneSeventyfive: data?.noOfPlotsSealableOneSeventyfive,
          //   scoPlotno: data?.scoPlotno,
          //   scoLength: data?.scoLength,
          //   scoWidth: data?.scoWidth,
          //   scoArea: data?.scoArea,
          //   scoSimilarShape: data?.scoSimilarShape,
          //   boothPlotno: data?.boothPlotno,
          //   boothLength: data?.boothLength,
          //   boothWidth: data?.boothWidth,
          //   boothArea: data?.boothArea,
          //   boothSimilarShape: data?.boothSimilarShape,
          //   stpPlotno: data?.stpPlotno,
          //   stpLength: data?.stpLength,
          //   stpWidth: data?.stpWidth,
          //   stpArea: data?.stpArea,
          //   stpSimilarShape: data?.stpSimilarShape,
          //   wtpPlotno: data?.wtpPlotno,
          //   wtpLength: data?.wtpLength,
          //   wtpWidth: data?.wtpWidth,
          //   wtpArea: data?.wtpArea,
          //   wtpSimilarShape: data?.wtpSimilarShape,
          //   ugtPlotno: data?.ugtPlotno,
          //   ugtLength: data?.ugtLength,
          //   ugtWidth: data?.ugtWidth,
          //   ugtArea: data?.ugtArea,
          //   ugtSimilarShape: data?.ugtSimilarShape,
          //   milkPlotno: data?.milkPlotno,
          //   milkLength: data?.milkLength,
          //   milkWidth: data?.milkWidth,
          //   milkArea: data?.milkArea,
          //   milkSimilarShape: data?.milkSimilarShape,
          //   gssPlotno: data?.gssPlotno,
          //   gssLength: data?.gssLength,
          //   gssWidth: data?.gssWidth,
          //   gssArea: data?.gssArea,
          //   gssSimilarShape: data?.gssSimilarShape,
          //   etcDim: data?.etcDim,
          //   etcArea: data?.etcArea,
          // },
          // DetailsAppliedLandNILP: {
          //   surrenderArea: data?.surrenderArea,
          //   surrender: data?.surrender,
          //   pocketAreaEnter: data?.pocketAreaEnter,
          //   pocketProposed: data?.pocketProposed,
          //   pocketDim: data?.pocketDim,
          //   deposit: data?.deposit,
          //   depositArea: data?.depositArea,
          //   surrendered: data?.surrendered,
          //   surrenderedDim: data?.surrenderedDim,
          // },
          // DetailsAppliedLayoutPlan: {
          //   uploadLayoutPlan: data?.uploadLayoutPlan,
          // },
          // DetailsAppliedDemarcationPlan: {
          //   demarcationPlan: data?.demarcationPlan,
          // },
          // DetailsAppliedLand: {
          //   demarcationPlan: data?.demarcationPlan,
          //   democraticPlan: data?.democraticPlan,
          //   sectoralPlan: data?.sectoralPlan,
          //   planCrossSection: data?.planCrossSection,
          //   uploadLayoutPlan: data?.uploadLayoutPlan,
          //   publicHealthServices: data?.publicHealthServices,
          //   designRoad: data?.designRoad,
          //   designSewarage: data?.designSewarage,
          //   designDisposal: data?.designDisposal,
          //   undertakingChange: data?.undertakingChange,
          //   hostedLayoutPlan: data?.hostedLayoutPlan,
          //   reportObjection: data?.reportObjection,
          //   consentRera: data?.consentRera,
          //   undertaking: data?.undertaking,
          //   detailedElectricSupply: data?.detailedElectricSupply,
          //   proposedColony: data?.proposedColony,
          // },
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
      console.log(error?.message);
      return error?.message;
    }
  };

  useEffect(() => {
    const valueData = stepData?.DetailsofAppliedLand;
    if (valueData) {
      valueData?.DetailsAppliedLandPlot &&
        Object?.keys(valueData?.DetailsAppliedLandPlot)?.map((item) => setValue(item, valueData?.DetailsAppliedLandPlot[item]));
      // Object?.keys(valueData?.DetailsAppliedLandNILP)?.map((item) => setValue(item, valueData?.DetailsAppliedLandNILP[item]));
      // valueData?.dgpsDetails.map((item, index) => {
      //   setValue(`dgpsDetails.${index}.longitude`, item?.longitude), setValue(`dgpsDetails.${index}.latitude`, item?.latitude);
      // });
    }
    if (valueData) {
      const test = valueData?.PurposeDetails;
      setNewDataA(valueData?.PurposeDetails);
    }
  }, [stepData]);

  // const getSubmitDataLabel = async () => {
  //   try {
  //     const Resp = await axios.get(`http://103.166.62.118:80/land-services/new/licenses/_get?id=${props.getId}`).then((response) => {
  //       return response;
  //     });
  //   } catch (error) {
  //     return error;
  //   }
  // };

  const handleWheel = (e) => e.target.blur();

  // useEffect(() => {
  //   getSubmitDataLabel();
  // }, []);

  const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
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
      // setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      // if (fieldName === "hostedLayoutPlan") {
      //   setValue("hostedLayoutPlanFileName", file.name);
      // }
      // if (fieldName === "consentRera") {
      //   setValue("consentReraFileName", file.name);
      // }
      // if (fieldName === "sectoralPlan") {
      //   setValue("sectoralPlanFileName", file.name);
      // }
      // if (fieldName === "detailedElectricSupply") {
      //   setValue("detailedElectricSupplyFileName", file.name);
      // }
      // if (fieldName === "planCrossSection") {
      //   setValue("planCrossSectionFileName", file.name);
      // }
      // if (fieldName === "publicHealthServices") {
      //   setValue("publicHealthServicesFileName", file.name);
      // }
      // if (fieldName === "designRoad") {
      //   setValue("designRoadFileName", file.name);
      // }
      // if (fieldName === "designSewarage") {
      //   setValue("designSewarageFileName", file.name);
      // }
      // if (fieldName === "designDisposal") {
      //   setValue("designDisposalFileName", file.name);
      // }
      // if (fieldName === "undertakingChange") {
      //   setValue("undertakingChangeFileName", file.name);
      // }
      // if (fieldName === "proposedColony") {
      //   setValue("proposedColonyFileName", file.name);
      // }
      // if (fieldName === "reportObjection") {
      //   setValue("reportObjectionFileName", file.name);
      // }
      // if (fieldName === "undertaking") {
      //   setValue("undertakingFileName", file.name);
      // }
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
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
      setData({ caseNumber: Resp?.data?.caseNumber, dairyNumber: Resp?.data?.dairyNumber });
      setValue("totalAreaScheme", userData?.ApplicantPurpose?.totalArea);
      getFarList(userData?.ApplicantPurpose?.purpose);
      setStepData(userData);
    } catch (error) {
      return error;
    }
  };

  const getFarList = async (purpose) => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        authToken: "",
        correlationId: null,
      },
      MdmsCriteria: {
        tenantId: "hr",
        moduleDetails: [
          {
            tenantId: "hr",
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "Purpose",
                filter: `[?(@.purposeCode=="${purpose}")]`,
              },
            ],
          },
        ],
      },
    };
    try {
      const Resp = await axios.post("/egov-mdms-service/v1/_search", payload);
      const fars = Resp?.data?.MdmsRes?.["common-masters"]?.Purpose?.[0]?.far;
      const farsArr = [];
      const testData = fars?.forEach((i) => farsArr?.push({ label: i[Object.keys(i)[0]], value: i[Object.keys(i)[0]] }));
      setFarArr(farsArr);
      return farsArr;
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
  const [dgpsModal, setDGPSModal] = useState(false);

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

  const dgpsModalData = (data) => {
    setModalData((prev) => [...prev, data?.dgpsDetails]);
    setDGPSModal(!dgpsModal);
  };

  const updateAreaById = (it, id, newArea) => {
    const updatedData = it?.map((obj) => {
      if (obj?.id === id) {
        return { ...obj, area: newArea };
      } else if (obj?.purposeDetail?.length > 0) {
        return { ...obj, purposeDetail: updateAreaById(obj?.purposeDetail, id, newArea) };
      } else {
        return obj;
      }
    });
    setNewDataA(updatedData);
    return updatedData;
  };

  const updateFARById = (it, id, farValue) => {
    const updatedDataA = it?.map((obj) => {
      if (obj?.id === id) {
        return { ...obj, far: farValue };
      } else if (obj?.purposeDetail?.length > 0) {
        return { ...obj, purposeDetail: updateFARById(obj?.purposeDetail, id, farValue) };
      } else {
        return obj;
      }
    });
    setNewDataA(updatedDataA);
    return updatedDataA;
  };

  const getFarAllData = () => {
    // const id = newDataA
    const checkData = newDataA?.map((obj) => {
      if (obj?.purposeDetail?.length > 0) {
        return { ...obj, purposeDetail: getFarAllData(obj?.purposeDetail, id, newArea) };
      } else {
        return obj?.code;
      }
    });
    // Promise.all(drinksPromises).then((data) => {
    //   console.log("data", data);
    // });
  };

  useEffect(() => {
    const check = Object?.values(error)?.every((value) => value === null || (typeof value == "string" && !(value || false)));
    setIsValid(check);
  }, [error]);

  let Tree = ({ data }) => {
    return (
      <div>
        <form>
          {data?.length &&
            data?.map((x, i) => {
              const farsArr = [];
              const testData = x?.fars?.forEach((i) => farsArr?.push({ label: i, value: i }));
              setValue(x?.id, x?.area);
              return (
                <div key={i}>
                  <h6 style={{ marginTop: "10px" }}>
                    <span>
                      <b>Purpose Name: </b>
                    </span>
                    {x?.name}
                  </h6>
                  <div className="row">
                    <div className="col col-4 mt-3">
                      <h6>
                        Area(in acres):
                        <input
                          type="number"
                          className="form-control"
                          placeholder="enter Area"
                          defaultValue={x?.area}
                          {...register(`${x?.id}`)}
                          onChange={(e) => {
                            updateAreaById(newDataA, x?.id, e?.target?.value);
                            // let delay;
                            // delay = setTimeout(() => {
                            // updateAreaById(newDataA, x?.id, e?.target?.value);
                            // }, 700);
                            // return () => clearTimeout(delay);
                            // const updatedData = updateAreaById(newDataA, x?.id, e?.target?.value);
                          }}
                        />
                        <span style={{ fontSize: "13px", fontWeight: "bold" }}>Max Percentage:</span> {x?.maxPercentage},{" "}
                        <span style={{ fontSize: "13px", fontWeight: "bold" }}>Min Percentage:</span> {x?.minPercentage}
                      </h6>
                    </div>
                    {farsArr?.length > 0 && (
                      <div className="col col-4 mt-3">
                        <h6>
                          FAR:{" "}
                          <ReactMultiSelect
                            control={control}
                            name={x?.code + x?.id}
                            placeholder="Far"
                            onChange={(e) => {
                              updateFARById(newDataA, x?.id, e?.value);
                            }}
                            data={farsArr}
                            labels="Far"
                          />
                        </h6>
                      </div>
                    )}
                    {!!x?.purposeDetail?.length && <div className="ml-4 mt-4">{Tree({ data: x?.purposeDetail })}</div>}
                  </div>
                </div>
              );
            })}
        </form>
      </div>
    );
  };

  return (
    <div>
      <ScrollToTop />
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(AppliedDetailFormSubmitHandler)}>
        <Card style={{ width: "126%", border: "5px solid #1266af" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New Licence Application </h4>
            <h6 style={{ display: "flex", alignItems: "center" }}>Application No: {applicantId}</h6>
          </div>
          {getData?.caseNumber && (
            <div>
              <h6 className="mt-1" style={{ marginLeft: "21px" }}>
                Case No: {getData?.caseNumber}
              </h6>
              <h6 className="mt-1" style={{ marginLeft: "21px" }}>
                Dairy No: {getData?.dairyNumber}
              </h6>
            </div>
          )}
          <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
            <Form.Group className="justify-content-center" controlId="formBasicEmail">
              <Row className="ml-auto" style={{ marginBottom: 5 }}>
                <div className="ml-auto">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      resetField("dgpsDetails");
                      setDGPSModal(true);
                    }}
                  >
                    Enter DGPS points
                  </Button>
                </div>

                <div className="mt-5">
                  {modalData?.map((item, index) => {
                    const test = item?.map((element) => `${element.latitude},${element.longitude}`).join(":");
                    return (
                      <div>
                        <label>DGPS detais</label>
                        <h6 className="mt-3" key={index}>
                          <span style={{ marginRight: "41px", fontWeight: "bold" }}>{index + 1}:</span> {test}
                        </h6>
                        <button
                          type="button"
                          style={{ float: "right", marginRight: 15 }}
                          className="btn btn-primary"
                          onClick={() => {
                            window.open(
                              `/digit-ui/WNS/wmsmap.html?latlngs=${item?.map((element) => `${element.latitude},${element.longitude}`).join(":")}`
                            );
                          }}
                        >
                          View On Map
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <div className="mt-3 mb-3">
                    <h4>
                      <b>Bifurcation Of Purpose</b>
                    </h4>
                    <h4 className="mt-3">
                      <b>Total Applied Area: </b> {stepData?.ApplicantPurpose?.totalArea}
                    </h4>
                  </div>
                </div>

                {newDataA && <div>{Tree({ data: newDataA })}</div>}

                <Col className="mt-4" col-12>
                  <h4>
                    <b>Layout Plan</b>
                  </h4>
                  {/* 
                  <div>
                    {stepData?.ApplicantPurpose?.purpose === "RPL" && (
                      <ResidentialPlottedForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setValue={setValue}
                        setLoader={setLoader}
                        control={control}
                        fields={detailsArray}
                        add={detailsAppend}
                        remove={detailsRemoce}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {stepData?.ApplicantPurpose?.purpose === "DDJAY_APHP" && (
                      <DDJAYForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        fields={detailsArray}
                        add={detailsAppend}
                        remove={detailsRemoce}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {(stepData?.ApplicantPurpose?.purpose === "CPCS" || stepData?.ApplicantPurpose?.purpose === "CPRS") && (
                      <CommercialPlottedForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                        getFarArr={getFarArr}
                      />
                    )}
                  </div>
                  <div>
                    {stepData?.ApplicantPurpose?.purpose === "IPL" && (
                      <IndustrialPlottedForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {(stepData?.ApplicantPurpose?.purpose === "NILPC" || stepData?.ApplicantPurpose?.purpose === "NILP") && (
                      <NilpForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {stepData?.ApplicantPurpose?.purpose === "RGP" && (
                      <ResidentialGroupHousingForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {stepData?.ApplicantPurpose?.purpose === "AGH" && (
                      <AffordableGroupHousingForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {(stepData?.ApplicantPurpose?.purpose === "CICS" || stepData?.ApplicantPurpose?.purpose === "CIRS") && (
                      <CommercialIntegratedForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {(stepData?.ApplicantPurpose?.purpose === "ITC" || stepData?.ApplicantPurpose?.purpose === "ITP") && (
                      <ITCyberCityForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {stepData?.ApplicantPurpose?.purpose === "IPULP" && (
                      <IILPForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {stepData?.ApplicantPurpose?.purpose === "MLU-CZ" && (
                      <MixedLandUseForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div>
                  <div>
                    {stepData?.ApplicantPurpose?.purpose === "RHP" && (
                      <RetirementHousingForm
                        register={register}
                        getDocumentData={getDocumentData}
                        watch={watch}
                        getDocShareholding={getDocShareholding}
                        setLoader={setLoader}
                        setValue={setValue}
                        control={control}
                        handleWheel={handleWheel}
                        setError={setError}
                        error={error}
                      />
                    )}
                  </div> */}

                  <h6 className="text-black mt-4">
                    <b>Documents</b>
                  </h6>
                  <div className="row mt-3 ">
                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Layout Plan in pdf<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanPdf")}
                          accept="application/pdf"
                        />
                      </label>
                      {watch("layoutPlanPdf") && (
                        <a onClick={() => getDocShareholding(watch("layoutPlanPdf"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      )}
                    </div>
                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Layout Plan in dxf<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanDxf")}
                          accept=".dxf"
                        />
                      </label>
                      {watch("layoutPlanDxf") && (
                        <a onClick={() => getDocShareholding(watch("layoutPlanDxf"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      )}
                    </div>

                    <div className="col col-3">
                      <label>
                        <h6 style={{ display: "flex" }}>
                          Undertaking<span style={{ color: "red" }}>*</span>
                          <Tooltip title="Undertaking that no change has been made in the phasing ">
                            <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                          </Tooltip>
                        </h6>

                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "undertaking")}
                          accept="application/pdf/jpeg/png"
                        />

                        {watch("undertaking") && (
                          <a onClick={() => getDocShareholding(watch("undertaking"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        )}
                      </label>
                    </div>

                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Development Plan<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "developmentPlan")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("developmentPlan") && (
                        <a onClick={() => getDocShareholding(watch("developmentPlan"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      )}
                    </div>

                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Sectoral Plan<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "sectoralPlan")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("sectoralPlan") && (
                        <a onClick={() => getDocShareholding(watch("sectoralPlan"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      )}
                    </div>

                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Explanatory note<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "explanatoryNote")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("explanatoryNote") && (
                        <a onClick={() => getDocShareholding(watch("explanatoryNote"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      )}
                    </div>

                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Guide Map<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "guideMap")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("guideMap") && (
                        <a onClick={() => getDocShareholding(watch("guideMap"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      )}
                    </div>

                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>
                        Indemnity Bond<span style={{ color: "red" }}>*</span>
                      </h6>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "idemnityBondDoc")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("idemnityBondDoc") && (
                        <a onClick={() => getDocShareholding(watch("idemnityBondDoc"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      )}
                    </div>

                    <div className="col col-3">
                      <h6 style={{ display: "flex" }}>Any other relevant document</h6>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherDoc")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("anyOtherDoc") && (
                        <a onClick={() => getDocShareholding(watch("anyOtherDoc"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-6 text-left">
                      <div id="btnClear" class="btn btn-primary btn-md center-block" onClick={() => handleWorkflow()}>
                        Back
                      </div>
                    </div>
                    <div class="col-sm-6 text-right">
                      <button disabled={isValid ? false : true} type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                        Save and Continue
                      </button>
                    </div>
                  </div>
                  {/* {showToast && (
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
                  )} */}
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
                </Col>
              </Row>
            </Form.Group>
          </Card>
        </Card>
      </form>
      <Modal style={{ width: "517px" }} size="sm" isOpen={dgpsModal} toggle={() => setDGPSModal(!dgpsModal)}>
        <div style={{ padding: "4px", textAlign: "right" }}>
          <span onClick={() => setDGPSModal(!dgpsModal)} style={{ cursor: "pointer" }}>
            X
          </span>
        </div>
        <ModalBody className="p-0">
          <form onSubmit={handleSubmit(dgpsModalData)}>
            <Row className="ml-auto">
              <Col>
                <h4>
                  1. DGPS points
                  {/* <span className="text-primary">
                    
                    <a onClick={() => setmodal1(true)}>
                      (Click here for instructions to receive DGPS-based coordinate points of the colony boundary)
                    </a>
                  </span> */}
                  <span style={{ color: "red" }}>*</span>
                  {/* <div>
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
                          
                          <b> A.</b> Applicant level Information: DGPS-based survey to be executed at the applicant level to collect coordinate points
                          of the colony boundary. <br></br>• DGPS Coordinate points to be collected for each divergent/edge of the colony boundary.
                          <br></br> • DGPS Coordinate Points to be entered by the applicant in e-License application in Web Form.<br></br>
                          <b> B.</b> Web Form Fields at applicant level: Input Fields to be added in the web-form for entering the DGPS points.
                          <br></br> • Input Fields for entering number of DGPS Points <br></br>• Input Fields for each DGPS Point: <br></br>o Add
                          Point 1 as Point 1: (X: Longitude, Y: Latitude) <br></br>o Add Point 2 as Point 2: (X: Longitude, Y: Latitude) <br></br>o
                          Add Point XX as Point XX: (X: Longitude, Y: Latitude)
                        </h2>
                      </ModalBody>
                      <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
                    </Modal>
                  </div> */}
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
                  {/* <button
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
                  </button> */}
                </div>
              </Col>
            </Row>
            <div className="row m-0" style={{ width: "100%", justifyContent: "center" }}>
              <button type="submit" style={{ width: "190px" }} class="btn btn-primary btn-md center-block mt-3">
                Submit
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AppliedDetailForm;
