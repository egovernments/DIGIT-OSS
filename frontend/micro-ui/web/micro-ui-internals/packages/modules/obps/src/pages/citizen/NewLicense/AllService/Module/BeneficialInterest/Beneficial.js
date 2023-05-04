import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import FileUpload from "@mui/icons-material/FileUpload";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../../../docView/docView.help";
import axios from "axios";
import CusToaster from "../../../../../../components/Toaster";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import { FormHelperText } from "@mui/material";
import FileDownload from "@mui/icons-material/FileDownload";
import { useLocation } from "react-router-dom";
import Spinner from "../../../../../../components/Loader";
import Visibility from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function Beneficial() {
  const [applicantId, setApplicantId] = useState("");
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [beneficialInterestLabel, setBeneficialInterestLabel] = useState([]);
  const [loader, setLoader] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const { t } = useTranslation();
  const { pathname: url } = useLocation();
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };

  const handleClose = () => {
    setSuccessDialog(false);
    window.location.href = `/digit-ui/citizen`;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const changeOfDeveloperForm = [
    {
      label: t("NO_OBJECTION_CERTIFICATE_LABEL"),
      fileName: "noObjectionCertificate",
      selectorKey: "noObjectionCertificateFile",
    },
    {
      label: t("CONSENT_LETTER_FROM_NEW_ENTITY_LABEL"),
      fileName: "consentLetter",
      selectorKey: "consentLetterFile",
    },
    {
      label: t("JUSTIFICATION_FOR_SUCH_REQUEST_LABEL"),
      fileName: "justificationCertificate",
      selectorKey: "justificationCertificateFile",
    },
    {
      label: t("THIRD_PARTY_RIGHTS_CERTIFICATE_LABEL"),
      fileName: "thirdPartyRightsCertificate",
      selectorKey: "thirdPartyRightsCertificateFile",
    },
    {
      label: t("FINANCIAL_CAPACITY_CERTIFICATE_LABEL"),
      fileName: "fiancialCapacityCertificate",
      selectorKey: "fiancialCapacityCertificateFile",
    },
    {
      label: t("ADMINISTRATIVE_CHARGE_CERTIFICATE_LABEL"),
      fileName: "aministrativeChargeCertificate",
      selectorKey: "aministrativeChargeCertificateFile",
    },
    {
      label: t("RERA_REGISTRATION_CERTIFICATION_LABEL"),
      fileName: "reraRegistrationCertificate",
      selectorKey: "reraRegistrationCertificateFile",
    },
    {
      label: t("BOARD_RESOLUTION_EXISTING_LABEL"),
      fileName: "boardResolutionExisting",
      selectorKey: "boardResolutionExistingFile",
    },
    {
      label: t("BOARD_RESOLUTION_NEW_LABEL"),
      fileName: "boardResolutionNewEntity",
      selectorKey: "boardResolutionNewEntityFile",
    },
  ];

  const joinDevForm = [
    {
      label: t("NO_OBJECTION_CERTIFICATE_LABEL"),
      fileName: "noObjectionCertificate",
      selectorKey: "noObjectionCertificateFile",
    },
    {
      label: t("CONSENT_LETTER_FROM_NEW_ENTITY_LABEL"),
      fileName: "consentLetter",
      selectorKey: "consentLetterFile",
    },
    {
      label: t("JUSTIFICATION_FOR_SUCH_REQUEST_LABEL"),
      fileName: "justificationCertificate",
      selectorKey: "justificationCertificateFile",
    },
    {
      label: t("THIRD_PARTY_RIGHTS_CERTIFICATE_LABEL"),
      fileName: "thirdPartyRightsCertificate",
      selectorKey: "thirdPartyRightsCertificateFile",
    },
    {
      label: t("ADMINISTRATIVE_CHARGE_CERTIFICATE_LABEL"),
      fileName: "aministrativeChargeCertificate",
      selectorKey: "aministrativeChargeCertificateFile",
    },
    {
      label: t("JOINT_DEVELOPMENT_CERTIFICATE_LABEL"),
      fileName: "jointDevelopmentCertificate",
      selectorKey: "jointDevelopmentCertificateFile",
    },
    {
      label: t("BOARD_RESOLUTION_EXISTING_LABEL"),
      fileName: "boardResolutionExisting",
      selectorKey: "boardResolutionExistingFile",
    },
    {
      label: t("BOARD_RESOLUTION_NEW_LABEL"),
      fileName: "boardResolutionNewEntity",
      selectorKey: "boardResolutionNewEntityFile",
    },
  ];

  const changeInShareholding = [
    {
      label: t("CONSENT_LETTER_FROM_NEW_ENTITY_LABEL"),
      fileName: "consentLetter",
      selectorKey: "consentLetterFile",
    },
    {
      label: t("JUSTIFICATION_FOR_SUCH_REQUEST_LABEL"),
      fileName: "justificationCertificate",
      selectorKey: "justificationCertificateFile",
    },
    {
      label: t("THIRD_PARTY_RIGHTS_CERTIFICATE_LABEL"),
      fileName: "thirdPartyRightsCertificate",
      selectorKey: "thirdPartyRightsCertificateFile",
    },
    {
      label: t("ADMINISTRATIVE_CHARGE_CERTIFICATE_LABEL"),
      fileName: "aministrativeChargeCertificate",
      selectorKey: "aministrativeChargeCertificateFile",
    },
    {
      label: t("SHAREHOLDING_PATTERN_CERTIFICATE_LABEL"),
      fileName: "shareholdingPatternCertificate",
      selectorKey: "shareholdingPatternCertificateFile",
    },
    {
      label: t("RERA_REGISTRATION_CERTIFICATION_LABEL"),
      fileName: "reraRegistrationCertificate",
      selectorKey: "reraRegistrationCertificateFile",
    },
    {
      label: t("BOARD_RESOLUTION_EXISTING_LABEL"),
      fileName: "boardResolutionExisting",
      selectorKey: "boardResolutionExistingFile",
    },
    {
      label: t("BOARD_RESOLUTION_NEW_LABEL"),
      fileName: "boardResolutionNewEntity",
      selectorKey: "boardResolutionNewEntityFile",
    },
  ];
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [loader, setLoader] = useState(false);
  const token = window?.localStorage?.getItem("token");
  const userInfo = Digit.UserService.getUser()?.info || {};
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [beneficialDetails, setBeneficialDetails] = useState();
  const [developerServices, setDeveloperServices] = useState([]);

  const getDeveloperServices = async () => {
    setLoader(false);
    try {
      const body = {
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
                  name: "ChangeBeneficial",
                },
              ],
            },
          ],
        },
      };
      const Resp = await axios.post("/egov-mdms-service/v1/_search", body);
      setDeveloperServices(Resp.data?.MdmsRes?.["common-masters"]?.ChangeBeneficial || []);

      setLoader(false);
    } catch (err) {
      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
    }
  };

  // const beneficialNew = (data) => console.log(data);
  const beneficialNew = async (data) => {
    setLoader(true);
    try {
      const postDistrict = {
        changeBeneficial:
          [{
            licenseNumber: data?.licenceNo || "",
            developerServiceCode: data?.developerServiceCode || "",
            paidAmount: data?.paidAmount || "",
            areaInAcres: data?.areaInAcres || "",
            noObjectionCertificate: data?.noObjectionCertificate || "",
            consentLetter: data?.consentLetter || "",
            justificationCertificate: data?.justificationCertificate || "",
            thirdPartyRightsCertificate: data?.thirdPartyRightsCertificate || "",
            jointDevelopmentCertificate: data?.jointDevelopmentCertificate || "",
            aministrativeChargeCertificate: data?.aministrativeChargeCertificate || "",
            boardResolutionExisting: data?.boardResolutionExisting || "",
            boardResolutionNewEntity: data?.boardResolutionNewEntity || "",
            shareholdingPatternCertificate: data?.shareholdingPatternCertificate || "",
            reraRegistrationCertificate: data?.reraRegistrationCertificate || "",
            fiancialCapacityCertificate: data?.fiancialCapacityCertificate || "",
            newAdditionalDetails: {
              selectLicence: data?.selectLicence,
              validUpto: data?.validUpto,
              renewalRequiredUpto: data?.renewalRequiredUpto,
              colonizerName: data?.colonizerName,
              periodOfRenewal: data?.periodOfRenewal,
              colonyType: data?.colonyType,
              areaAcres: data?.areaAcres,
              sectorNo: data?.sectorNo,
              revenueEstate: data?.revenueEstate,
              developmentPlan: data?.developmentPlan,
              tehsil: data?.tehsil,
              district: data?.district
          }
          }],
        RequestInfo: {
          apiId: "Rainmaker",
          msgId: "1669293303096|en_IN",
          authToken: token,
          userInfo: userInfo,
        },
      };
      const Resp = await axios.post("/tl-services/beneficial/_create", postDistrict);
      setBeneficialInterestLabel(Resp.data);
      setLoader(false);

      if (Resp?.data?.changeBeneficial?.length) {
        setShowToastError({ label: "Beneficial Created Successfully", error: false, success: true });

        setSuccessDialog(true);
        setApplicationNumber(Resp?.data?.changeBeneficial?.[0]?.applicationNumber || "");
      } else {
        setShowToastError({ label: Resp?.data?.message, error: true, success: false });
      }

      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
    } catch (error) {
      console.log("Submit Error ====> ", err.message);
      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
      return error.message;
    }
  };

  const updateBeneficial = async (data) => {
    setLoader(true);
    try {
      const postDistrict = {
        changeBeneficial: [
          {
            ...beneficialDetails,
            licenseNumber: data?.licenceNo || "",
            developerServiceCode: data?.developerServiceCode || "",
            paidAmount: data?.paidAmount || "",
            areaInAcres: data?.areaInAcres || "",
            noObjectionCertificate: data?.noObjectionCertificate || "",
            consentLetter: data?.consentLetter || "",
            justificationCertificate: data?.justificationCertificate || "",
            thirdPartyRightsCertificate: data?.thirdPartyRightsCertificate || "",
            jointDevelopmentCertificate: data?.jointDevelopmentCertificate || "",
            aministrativeChargeCertificate: data?.aministrativeChargeCertificate || "",
            boardResolutionExisting: data?.boardResolutionExisting || "",
            boardResolutionNewEntity: data?.boardResolutionNewEntity || "",
            shareholdingPatternCertificate: data?.shareholdingPatternCertificate || "",
            reraRegistrationCertificate: data?.reraRegistrationCertificate || "",
            fiancialCapacityCertificate: data?.fiancialCapacityCertificate || "",
          },
        ],
        RequestInfo: {
          apiId: "Rainmaker",
          msgId: "1669293303096|en_IN",
          authToken: token,
          userInfo: userInfo,
        },
      };
      const Resp = await axios.post("/tl-services/beneficial/_update", postDistrict);
      setBeneficialInterestLabel(Resp.data);
      setLoader(false);
      setShowToastError({ label: "Beneficial Interest Updated Successfully", error: false, success: true });
      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
      handleClose();
    } catch (error) {
      console.log("Submit Error ====> ", err.message);
      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
      return error.message;
    }
  };

  const getBeneficiaryDetails = async () => {
    setLoader(true);
    try {
      const reqBody = {
        RequestInfo: {
          apiId: "Rainmaker",
          action: "",
          did: 1,
          key: "",
          msgId: "1662181431469|en_IN",
          requesterId: "",
          ts: "",
          ver: ".01",
          authToken: token,
        },
      };

      const Resp = await axios.post(`/tl-services/beneficial/_get?licenseNumber=${params.get("id")}`, reqBody);
      console.log("BeneficiaryDetails ====> ", Resp, Resp?.data?.changeBeneficial?.[0], Resp?.data?.changeBeneficial?.[0]?.licenseNumber);
      setBeneficialDetails(Resp?.data?.changeBeneficial?.[0]);
      setValue("licenceNo", Resp?.data?.changeBeneficial?.[0]?.licenseNumber);
      setValue("noObjectionCertificate", Resp?.data?.changeBeneficial?.[0]?.noObjectionCertificate);
      setValue("justificationCertificate", Resp?.data?.changeBeneficial?.[0]?.justificationCertificate);
      setValue("consentLetter", Resp?.data?.changeBeneficial?.[0]?.consentLetter);
      setValue("thirdPartyRightsCertificate", Resp?.data?.changeBeneficial?.[0]?.thirdPartyRightsCertificate);
      setValue("jointDevelopmentCertificate", Resp?.data?.changeBeneficial?.[0]?.jointDevelopmentCertificate);
      setValue("aministrativeChargeCertificate", Resp?.data?.changeBeneficial?.[0]?.aministrativeChargeCertificate);
      setValue("boardResolutionExisting", Resp?.data?.changeBeneficial?.[0]?.boardResolutionExisting);
      setValue("boardResolutionNewEntity", Resp?.data?.changeBeneficial?.[0]?.boardResolutionNewEntity);
      setValue("shareholdingPatternCertificate", Resp?.data?.changeBeneficial?.[0]?.shareholdingPatternCertificate);
      setValue("fiancialCapacityCertificate", Resp?.data?.changeBeneficial?.[0]?.fiancialCapacityCertificate);
      setValue("developerServiceCode", Resp?.data?.changeBeneficial?.[0]?.developerServiceCode);
      setValue("reraRegistrationCertificate", Resp?.data?.changeBeneficial?.[0]?.reraRegistrationCertificate);
      setValue("paidAmount", Resp?.data?.changeBeneficial?.[0]?.paidAmount);
      setValue("areaInAcres", Resp?.data?.changeBeneficial?.[0]?.areaInAcres);
      console.log("scene", Resp?.data?.changeBeneficial?.[0]?.areaInAcres);

      setLoader(false);
      setShowhide(Resp?.data?.changeBeneficial?.[0]?.developerServiceCode);
    } catch (err) {
      console.log("Submit Error ====> ", err.message);
      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
      return error.message;
    }
  };

  useEffect(() => {
    getDeveloperServices();
    if (params.get("id")) {
      getBeneficiaryDetails();
    }
  }, []);

  const uploadFile = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ label: "Duplicate File", error: true, success: false });
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
      // if (fieldName === "uploadBg") {
      //   setValue("uploadBgFileName", file.name);
      // }
      // if (fieldName === "tcpSubmissionReceived") {
      //   setValue("tcpSubmissionReceivedFileName", file.name);
      // }
      setSelectedFiles([...selectedFiles, file.name]);
      // console.log("Submit Error ====> ", err.message);

      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
    } catch (error) {
      console.log("Submit Error ====> ", err.message);
      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
    }
  };

  const formSubmitHandler = async (data) => {
    if (params.get("id")) {
      updateBeneficial(data);
    } else {
      beneficialNew(data);
    }
  };


  const pay = async () => {
  
    try{
      const body = {
        "RequestInfo":{
          "apiId": "Rainmaker",
          "ver": ".01",
          "ts": 0,
          "action": "_update",
          "did": "1",
          "key": "",
          "msgId": "20170310130900|en_IN",
          "authToken": token,
          "correlationId": null,
           "userInfo": userInfo
        }
      }
  
      const response = await axios.post(`/tl-services/beneficial/_pay?licenseNumber=${watch('licenceNo')}`,body);

      console.log("log...",response);

      if (response?.data?.changeBeneficial?.length) {
        if(response?.data?.changeBeneficial?.redirectUrl){
          window.open(response?.data?.changeBeneficial?.redirectUrl);
        }
      } else {
        setShowToastError({ label: response?.data?.message, error: true, success: false });
      }

      // setLoader(false);
      // setShowToastError({ label: "Beneficial Interest Updated Successfully", error: false, success: true });

    } catch (err) {
      console.log("Submit Error ====> ", err.message);
      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
    }

  }

  return (
    <div>
      <form onSubmit={handleSubmit(formSubmitHandler)}>
        {loader && <Spinner />}

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

        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>{t("CHANGE_IN_BENEFICIAL_INTEREST")}</h4>
          <div className="card">
            <div className="">
              <div className="row">
                <div className="col-12 p-3">
                  <SearchLicenceComp watch={watch} register={register} control={control} setLoader={setLoader} errors={errors} setValue={setValue} />
                </div>

                {/* <FormControl>
                  <h2 className="FormLable"> Licence No </h2>

                  <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("licenceNo",{
                    required:"This field cannot be blank",
                    minLength: {
                      value: 4,
                      message: "Invalid Licence No."
                    }, maxLength: {
                      value: 19,
                      message: "Invalid Licence No."
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]*$/,
                      message: "Invalid Licence No."
                    }
                  })} />

                  <FormHelperText error={Boolean(errors?.licenceNo)}>
                  {errors?.licenceNo?.message}
                </FormHelperText>
                </FormControl> */}
                {/* &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; */}
                <FormControl className="col col-md-6 col-lg-4 p-3">
                  <h2 className="FormLable">{t("SELECT_SERVICE")}</h2>

                  <select
                    className="Inputcontrol form-control h-auto"
                    style={{ height: "auto", padding: "9px" }}
                    {...register("developerServiceCode", {
                      required: "At least one should be selected",
                    })}
                    onChange={(e) => handleshowhide(e)}
                  >
                    <option value="">----Select value-----</option>
                    {developerServices.map((item, index) => (
                      <option key={index} value={item.developerServiceCode}>
                        {item?.developerServiceName}
                      </option>
                    ))}
                  </select>
                  <FormHelperText error={Boolean(errors?.developerServiceCode)}>{errors?.developerServiceCode?.message}</FormHelperText>
                </FormControl>
                {/* &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; */}
                <FormControl className="col col-md-6 col-lg-4 p-3">
                  <h2 className="FormLable">{t("Amount")}</h2>
                  <OutlinedInput type="text" className="Inputcontrol" disabled {...register("paidAmount")} />
                </FormControl>
                {/* <div className="col md={4} xxl lg-4">
                  <div> */}

                {showhide === "JDAMR" && (
                  <FormControl className="col col-md:6 col-lg-4 p-3">
                    <h2 className="FormLable"> {t("AREA_IN_ACRES")}</h2>

                    <OutlinedInput
                      type="number"
                      className="Inputcontrol"
                      placeholder=""
                      {...register("areaInAcres", {
                        required: "This field cannot be blank",
                        validate: {
                          min: (value) => Number(value) > 0 || "Area in Acres should be minimum 1",
                          max: (value) => Number(value) <= 10 || "Area in Acres should be maximum 10",
                        },
                      })}
                      // error={Boolean(errors?.areaInAcres)}
                    />
                    <FormHelperText error={Boolean(errors?.areaInAcres)}>{errors?.areaInAcres?.message}</FormHelperText>
                  </FormControl>
                )}
                {/* </div>
                </div> */}
                <br />
                <div className="row-12 mt-3">
                  <div>
                    {showhide === "COD" && (
                      // <div className="card">
                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">{t("SR_NO")}</th>
                            <th class="fw-normal">{t("FIELD_NAME")}</th>
                            <th class="fw-normal">{t("UPLOAD_DOCUMENTS")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {changeOfDeveloperForm.map((item, index) => (
                            <tr key={index}>
                              <th class="fw-normal">{index + 1}</th>
                              <td>{item.label}</td>

                              {watch(item.fileName) ? (
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <label title="Upload Document" for={item.selectorKey}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                                    </label>
                                    <input
                                      id={item.selectorKey}
                                      type="file"
                                      placeholder=""
                                      className="form-control d-none"
                                      onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                                    ></input>

                                    {watch(item.fileName) && (
                                      <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              ) : (
                                <td>
                                  <div>
                                    <label title="Upload Document" for={item.selectorKey}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                                    </label>
                                    <input
                                      id={item.selectorKey}
                                      type="file"
                                      placeholder=""
                                      className="form-control d-none"
                                      {...register(item.selectorKey, { required: "This Document is required" })}
                                      onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                                    ></input>

                                    {watch(item.fileName) && (
                                      <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm "></a>
                                    )}
                                  </div>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.[item.selectorKey] && errors?.[item.selectorKey]?.message}
                                  </h3>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </div>
                      // </div>
                    )}
                  </div>
                  <div>
                    {showhide === "JDAMR" && (
                      // <div className="card">
                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">{t("SR_NO")}</th>
                            <th class="fw-normal">{t("FIELD_NAME")}</th>
                            <th class="fw-normal">{t("UPLOAD_DOCUMENTS")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {joinDevForm.map((item, index) => (
                            <tr key={index + "b"}>
                              <th class="fw-normal">{index + 1}</th>
                              <td>{item.label}</td>

                              {watch(item.fileName) ? (
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <label title="Upload Document" for={item.selectorKey}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                                    </label>
                                    <input
                                      id={item.selectorKey}
                                      type="file"
                                      placeholder=""
                                      className="form-control d-none"
                                      onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                                    ></input>

                                    {watch(item.fileName) && (
                                      <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              ) : (
                                <td>
                                  <div>
                                    <label title="Upload Document" for={item.selectorKey}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                                    </label>
                                    <input
                                      id={item.selectorKey}
                                      type="file"
                                      placeholder=""
                                      className="form-control d-none"
                                      {...register(item.selectorKey, { required: "This Document is required" })}
                                      onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                                    ></input>

                                    {watch(item.fileName) && (
                                      <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm "></a>
                                    )}
                                  </div>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.[item.selectorKey] && errors?.[item.selectorKey]?.message}
                                  </h3>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </div>
                      // </div>
                    )}
                  </div>
                  <div>
                    {showhide === "CISP" && (
                      // <div className="card">

                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">{t("SR_NO")}</th>
                            <th class="fw-normal">{t("FIELD_NAME")}</th>
                            <th class="fw-normal">{t("UPLOAD_DOCUMENTS")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {changeInShareholding.map((item, index) => (
                            <tr key={index + "c"}>
                              <th class="fw-normal">{index + 1}</th>
                              <td>{item.label}</td>

                              {watch(item.fileName) ? (
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <label title="Upload Document" for={item.selectorKey}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                                    </label>
                                    <input
                                      id={item.selectorKey}
                                      type="file"
                                      placeholder=""
                                      className="form-control d-none"
                                      onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                                    ></input>

                                    {watch(item.fileName) && (
                                      <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              ) : (
                                <td>
                                  <div>
                                    <label title="Upload Document" for={item.selectorKey}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                                    </label>
                                    <input
                                      id={item.selectorKey}
                                      type="file"
                                      placeholder=""
                                      className="form-control d-none"
                                      {...register(item.selectorKey, { required: "This Document is required" })}
                                      onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                                    ></input>

                                    {watch(item.fileName) && (
                                      <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm "></a>
                                    )}
                                  </div>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.[item.selectorKey] && errors?.[item.selectorKey]?.message}
                                  </h3>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </div>

                      // </div>
                    )}
                  </div>
                </div>
                <div class="col-sm-12 text-right mt-3">
                  <button onClick={pay} id="btnSearch" type="button" class="btn btn-primary btn-md center-block" style={{ marginRight: "5px" }}>
                    Pay
                  </button>{" "}
                  &nbsp;
                  {/* <button id="btnSearch" type="save" class="btn btn-primary btn-md center-block" style={{ marginRight: "5px" }}>
                    Save as Draft
                  </button>{" "}
                  &nbsp; */}
                  <button id="btnSearch" type="submit" class="btn btn-primary btn-md center-block" style={{}}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* {showToastError && (
        <CusToaster
          label={showToastError?.label}
          success={showToastError?.success}
          error={showToastError?.error}
          onClose={() => {
            setShowToastError({ label: "", success: false, error: false });
          }}
        />
      )} */}

      <Dialog open={successDialog} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Change In Beneficial Interest Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Your change in beneficial interest is submitted successfully{" "}
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
    </div>
  );
}

export default Beneficial;
