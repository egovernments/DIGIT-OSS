import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { convertEpochToDate } from "../../../../../../tl/src/utils";
import CalculateIcon from "@mui/icons-material/Calculate";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import axios from "axios";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";
import Spinner from "../../../../components/Loader";
import CommercialColonyInResidential from "./CommercialColonyResidential";
import CommercialLicense from "./CommercialLicense";
import LowDensityEco from "./LowDensityEco";
import CyberPark from "./CyberPark";
import RetirementHousing from "./RetirementHousing";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../docView/docView.help";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step3";
import FileUpload from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import { useLocation } from "react-router-dom";
import { Toast } from "@egovernments/digit-ui-react-components";
import WorkingTable from "../../../../components/Table";
import CusToaster from "../../../../components/Toaster";

const test = {
  area: null,
  code: "RPL",
  far: null,
  name: "Residential Plotted Colony",
  purposeDetail: [
    {
      area: null,
      code: "RPL",
      far: null,
      name: "Residential Plotted Colony",
    },
    {
      area: null,
      code: "RPL",
      far: null,
      name: "Residential Plotted Colony",
      purposeDetail: [
        {
          area: "811.100",
          code: "RPL",
          far: null,
          name: "Residential Plotted Colony",
        },
      ],
    },
  ],
};

const potentialOptons = [
  {
    label: "Hyper",
    value: "K.Mishra",
  },
  {
    label: "High I",
    value: "potential 2",
  },
  {
    label: "High II",
    value: "potential 2",
  },
  {
    label: "Medium",
    value: "potential 2",
  },
  {
    label: "Low I",
    value: "potential 2",
  },
  {
    label: "Low II",
    value: "potential 2",
  },
];

const releaseStatus = [
  {
    label: "yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

const unconsolidated = [
  {
    label: "Karam",
    value: "karam",
  },
  {
    label: "Gatta",
    value: "gatta",
  },
];

const LandScheduleForm = (props) => {
  const location = useLocation();
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });
  const [getPotentialOptons, setPotentialOptions] = useState({ data: [], isLoading: true });
  const [typeOfLand, setYypeOfLand] = useState({ data: [], isLoading: true });
  const [loader, setLoader] = useState(false);
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const stateId = Digit.ULBService.getStateId();
  const [stepData, setStepData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [applicantId, setApplicantId] = useState("");
  const [litigationRemark, setLitigationRemark] = useState("");
  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);
  const [modalData, setModalData] = useState([]);
  const { data: LandData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["LandType"]);
  const [getData, setData] = useState({ caseNumber: "", dairyNumber: "" });
  const [success, setError] = useState(null);
  const [toastError, setToastError] = useState("");
  const { data: PotentialType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DevPlan"]);
  const columns = [
    {
      key: "previousLicensenumber",
      title: "Previous Licence Number",
      dataIndex: "previousLicensenumber",
    },
    {
      key: "areaOfParentLicence",
      title: "Area of parent licence",
      dataIndex: "areaOfParentLicence",
    },
    {
      key: "purposeOfParentLicence",
      title: "Purpose of parent licence",
      dataIndex: "purposeOfParentLicence",
    },
    {
      key: "validity",
      title: "Validity of parent licence ",
      dataIndex: "validity",
    },
    {
      title: "Date ",
      render: (data) => (data?.date ? data?.date : "N/A"),
    },
    {
      key: "areaAppliedmigration",
      title: "Area applied under migration in acres",
      dataIndex: "areaAppliedmigration",
    },
    {
      key: "khasraNumber",
      title: "Applied Khasra number ",
      dataIndex: "khasraNumber",
    },
    {
      key: "area",
      title: "Area ",
      dataIndex: "area",
    },
    {
      key: "balanceOfParentLicence",
      title: "Balance of Parent Licence ",
      dataIndex: "balanceOfParentLicence",
    },
    {
      title: "Action",
      dataIndex: "",
      render: (data) => (
        <div>
          <EditIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSpecificTableData(data);
              setmodal(true);
              setEdit(true);
            }}
            color="primary"
          />

          <DeleteIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              const filteredData = modalData?.filter((item) => item?.rowid !== data?.rowid);
              setModalData(filteredData);
            }}
            color="error"
          />
        </div>
      ),
    },
  ];
  useEffect(() => {
    const purpose = PurposeType?.["common-masters"]?.Purpose?.map(function (data) {
      return { value: data?.purposeCode, label: data?.name };
    });
    setPurposeOptions({ data: purpose, isLoading: false });
  }, [PurposeType]);

  useEffect(() => {
    const devPlan = PotentialType?.["common-masters"]?.DevPlan?.map(function (data) {
      return { value: data?.devPlanCode, label: data?.devPlan };
    });
    setPotentialOptions({ data: devPlan, isLoading: false });
  }, [PotentialType]);

  useEffect(() => {
    const landType = LandData?.["common-masters"]?.LandType?.map(function (data) {
      return { value: data?.landId, label: data?.land };
    });
    setYypeOfLand({ data: landType, isLoading: false });
  }, [LandData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    getValues,
    watch,
    resetField,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(VALIDATION_SCHEMA),
    // resolver: yupResolver(modal ? MODAL_VALIDATION_SCHEMA : VALIDATION_SCHEMA),
    shouldFocusError: true,
  });

  const [fileStoreId, setFileStoreId] = useState({});
  const [specificTableData, setSpecificTableData] = useState(null);
  const Purpose = localStorage.getItem("purpose");
  const userInfo = Digit.UserService.getUser()?.info || {};

  const landScheduleFormSubmitHandler = async (data) => {
    const token = window?.localStorage?.getItem("token");
    // setLoader(true);
    data["potential"] = data?.potential?.value;
    data["typeLand"] = data?.typeLand?.value;
    data["siteLoc"] = data?.siteLoc?.value;
    data["purposeParentLic"] = data?.purposeParentLic?.value;
    data["releaseStatus"] = data?.releaseStatus?.value;
    data["unconsolidated"] = data?.unconsolidated?.value;
    const postDistrict = {
      pageName: "LandSchedule",
      action: "LANDSCHEDULE",
      applicationNumber: applicantId,
      createdBy: userInfo?.id,
      updatedBy: userInfo?.id,
      LicenseDetails: {
        LandSchedule: {
          ...data,
          LandScheduleDetails: modalData,
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
      setLoader(false);
      const useData = Resp?.data?.LicenseServiceResponseInfo?.[0]?.LicenseDetails?.[0];
      props.Step3Continue(useData);
    } catch (error) {
      setLoader(false);
      setToastError(error?.response?.data?.Errors?.[0]?.code);
      setTimeout(() => {
        setToastError(null);
      }, 2000);
      return error.message;
    }
  };
  useEffect(() => {
    const valueData = stepData?.LandSchedule;
    if (valueData) {
      Object?.keys(valueData)?.map((item) => {
        if (item === "purpose" || item === "potential") return null;
        else setValue(item, valueData[item]);
      });
      const data = purposeOptions?.data?.filter((item) => item?.value === stepData?.ApplicantPurpose?.purpose);
      const potientialData = getPotentialOptons?.data?.filter((item) => item?.value === stepData?.ApplicantPurpose?.potential);
      const typeLandData = typeOfLand?.data?.filter((item) => item?.value === stepData?.ApplicantPurpose?.typeLand);

      setValue("purpose", { label: data?.[0]?.label, value: data?.[0]?.value });
      setValue("potential", { label: potientialData?.[0]?.label, value: potientialData?.[0]?.value });
      setValue("typeLand", { label: typeLandData?.[0]?.label, value: typeLandData?.[0]?.value });
    }
  }, [stepData, purposeOptions, getPotentialOptons, typeOfLand]);

  // const getSubmitDataLabel = async () => {
  //   try {
  //     const Resp = await axios.get(`http://103.166.62.118:80/land-services/new/licenses/_get?id=${props.getId}`);
  //     const userData = Resp?.data?.newServiceInfoData?.[0]?.LandSchedule;
  //   } catch (error) {
  //     return error.message;
  //   }
  // };

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
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
    } catch (error) {
      setLoader(false);

      return error.message;
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
      setStepData(userData);
    } catch (error) {
      return error;
    }
  };
  const resetValues = () => {
    resetField("previousLicensenumber");
    resetField("areaOfParentLicence");
    resetField("purposeOfParentLicence");
    resetField("validity");
    resetField("date");
    resetField("areaAppliedmigration");
    resetField("khasraNumber");
    resetField("area");
  };
  useEffect(() => {
    if (specificTableData) {
      setValue("previousLicensenumber", specificTableData?.previousLicensenumber);
      setValue("areaOfParentLicence", specificTableData?.areaOfParentLicence);
      setValue("purposeOfParentLicence", specificTableData?.purposeOfParentLicence);
      setValue("validity", specificTableData?.validity);
      setValue("date", specificTableData?.date);
      setValue("areaAppliedmigration", specificTableData?.areaAppliedmigration);
      setValue("khasraNumber", specificTableData?.khasraNumber);
      setValue("area", specificTableData?.area);
    }
  }, [specificTableData]);

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
          action: "SENDBACK",
          previousStatus: "INITIATED",
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
      props?.Step3Back();
    } catch (error) {
      setLoader(false);
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

  const LandScheduleModalData = (modaldata) => {
    setModalData((prev) => [...prev, modaldata]);
    // resetValues();
    setmodal(false);
  };

  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  return (
    <div>
      <ScrollToTop />
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(landScheduleFormSubmitHandler)}>
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
                <Col col-12>
                  <div className="row">
                    <div className="col col-12 ">
                      <div>
                        <h2>
                          1.&nbsp;(i)Whether licence applied for additional area ?<span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                          <label htmlFor="licenseApplied">
                            <input {...register("licenseApplied")} type="radio" value="Y" id="licenseApplied" />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="licenseApplied">
                            <input {...register("licenseApplied")} type="radio" value="N" id="licenseApplied" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.licenseApplied && errors?.licenseApplied?.message}
                          </h3>
                        </h2>
                      </div>

                      {watch("licenseApplied") === "Y" && (
                        <div>
                          <div className="row">
                            <div className="col col-4">
                              <label>
                                <h2>
                                  Licence No. of Parent Licence <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                {...register("licenseNumber")}
                                // maxLength={20}
                                // pattern="(/^[^\s][a-zA-Z0-9\s]+$"
                              />
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.licenseNumber && errors?.licenseNumber?.message}
                              </h3>
                            </div>
                            <div className="col col-4">
                              <label>
                                <h2>
                                  Development Plan <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <ReactMultiSelect
                                control={control}
                                name="potential"
                                placeholder="Potential Zone"
                                data={getPotentialOptons?.data}
                                labels="Potential"
                                loading={getPotentialOptons?.isLoading}
                              />
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.potential && errors?.potential?.message}
                              </h3>
                            </div>
                            <div className="col col-4">
                              <label>
                                <h2>
                                  Type of colony <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <ReactMultiSelect
                                control={control}
                                name="siteLoc"
                                placeholder="Purpose"
                                data={purposeOptions?.data}
                                loading={purposeOptions?.isLoading}
                                labels="siteLoc"
                              />
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.siteLoc && errors?.siteLoc?.message}
                              </h3>
                            </div>
                            {/* <div className="col col-12">
                              {Purpose === "DDJAY_APHP" && <CommercialColonyInResidential watch={watch} register={register} />}
                              {Purpose === "RPL" && <CommercialColonyInResidential watch={watch} register={register} />}
                              {Purpose === "NILPC" && <CommercialColonyInResidential watch={watch} register={register} />}
                              {Purpose === "AHP" && <CommercialColonyInResidential watch={watch} register={register} />}
                              {Purpose === "CIC" && <CommercialLicense watch={watch} register={register} />}
                              {Purpose === "LDEF" && <LowDensityEco watch={watch} register={register} />}
                              {Purpose === "IPL" && <CyberPark watch={watch} register={register} />}
                              {Purpose === "ITP" && <CyberPark watch={watch} register={register} />}
                              {Purpose === "ITC" && <CyberPark watch={watch} register={register} />}
                              {Purpose === "RHP" && <RetirementHousing watch={watch} register={register} />}

                            </div> */}
                          </div>
                          <br></br>
                          <div className="row">
                            <div className="col col-4">
                              <label>
                                <h2>
                                  Area of parent licence in acres <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <input type="number" className="form-control" {...register("areaOfParentLicenceAcres")} minLength={1} maxLength={20} />
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.areaOfParentLicenceAcres && errors?.areaOfParentLicenceAcres?.message}
                              </h3>
                            </div>

                            <div className="col col-4">
                              <h2>
                                Validity of parent licence <span style={{ color: "red" }}>*</span>
                                &nbsp;&nbsp;
                                <label htmlFor="validity">
                                  <input {...register("validity")} type="radio" value="Y" id="yes" />
                                  &nbsp;&nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="validity">
                                  <input {...register("validity")} type="radio" value="N" id="no" />
                                  &nbsp;&nbsp; No &nbsp;&nbsp;
                                </label>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.validity && errors?.validity?.message}
                                </h3>
                              </h2>

                              {watch("validity") === "N" && (
                                <div>
                                  <div className="row ">
                                    <h2>
                                      Whether renewal licence fee submitted <span style={{ color: "red" }}>*</span>
                                      &nbsp;&nbsp;
                                      <label htmlFor="yess">
                                        <input {...register("renewalLicenceFee")} type="radio" value="Y" id="yess" />
                                        &nbsp;&nbsp; Yes &nbsp;&nbsp;
                                      </label>
                                      <label htmlFor="noo">
                                        <input {...register("renewalLicenceFee")} type="radio" value="N" id="noo" />
                                        &nbsp;&nbsp; No &nbsp;&nbsp;
                                      </label>
                                      <h3 className="error-message" style={{ color: "red" }}>
                                        {errors?.renewalLicenceFee && errors?.renewalLicenceFee?.message}
                                      </h3>
                                    </h2>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="col col-4">
                              <label>
                                <h2>Any Other Remark </h2>
                              </label>
                              <input type="text" {...register("specify")} className="form-control" pattern="[A-Za-z]+" />
                            </div>

                            <div className="col col-4 mt-2">
                              <h2>
                                Third-party right created<span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                              </h2>
                              <br></br>
                              <label htmlFor="thirdParty">
                                <input {...register("thirdParty")} type="radio" value="Y" id="thirdParty" />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="thirdParty">
                                <input {...register("thirdParty")} type="radio" value="N" id="thirdParty" />
                                &nbsp; No &nbsp;&nbsp;
                              </label>
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.thirdParty && errors?.thirdParty?.message}
                              </h3>

                              {watch("thirdParty") === "N" && (
                                <div className="row ">
                                  <div className="col col-12">
                                    <label>
                                      {" "}
                                      <h2>
                                        Upload affidavit <span style={{ color: "red" }}>*</span>
                                        <Tooltip title="Upload affidavit related to non-creation.">
                                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                                        </Tooltip>
                                      </h2>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyDoc")}
                                      />
                                      {watch("thirdPartyDoc") && (
                                        <a onClick={() => getDocShareholding(watch("thirdPartyDoc"), setLoader)} className="btn btn-sm ">
                                          <VisibilityIcon color="info" className="icon" />
                                        </a>
                                      )}
                                      {/* <h3>{watch("thirdPartyDoc")}</h3> */}
                                    </label>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.thirdPartyDoc && errors?.thirdPartyDoc?.message}
                                    </h3>
                                  </div>
                                  <div className="col col-12">
                                    <h2>
                                      Whether Project is RERA registered<span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                                    </h2>

                                    <label htmlFor="reraRegistered">
                                      <input {...register("reraRegistered")} type="radio" value="Y" id="reraRegistered" />
                                      &nbsp; Yes &nbsp;&nbsp;
                                    </label>
                                    <label htmlFor="reraRegistered">
                                      <input {...register("reraRegistered")} type="radio" value="N" id="reraRegistered" />
                                      &nbsp; No &nbsp;&nbsp;
                                    </label>
                                    {watch("reraRegistered") === "Y" && (
                                      <div className="row ">
                                        <div className="col col-12">
                                          <label>
                                            <h6>
                                              Upload RERA registration <span style={{ color: "red" }}>*</span>
                                              <Tooltip title="Upload copy of RERA registration">
                                                <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                                              </Tooltip>
                                            </h6>

                                            <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                            <input
                                              type="file"
                                              style={{ display: "none" }}
                                              onChange={(e) => getDocumentData(e?.target?.files[0], "reraDocUpload")}
                                              accept="application/pdf/jpeg/png"
                                            />

                                            {watch("reraDocUpload") && (
                                              <a onClick={() => getDocShareholding(watch("reraDocUpload"), setLoader)} className="btn btn-sm ">
                                                <VisibilityIcon color="info" className="icon" />
                                              </a>
                                            )}
                                          </label>
                                          {/* <h3>{watch("reraDocUpload")}</h3> */}
                                          <h3 className="error-message" style={{ color: "red" }}>
                                            {errors?.reraDocUpload && errors?.reraDocUpload?.message}
                                          </h3>
                                        </div>
                                      </div>
                                    )}
                                    {watch("reraRegistered") === "N" && (
                                      <div className="row ">
                                        <div className="col col-12">
                                          <label>
                                            <h6>
                                              Affidavit <span style={{ color: "red" }}>*</span>
                                              <Tooltip title=" Upload Copy of non-registration of RERA">
                                                <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                                              </Tooltip>
                                            </h6>

                                            <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                            <input
                                              type="file"
                                              style={{ display: "none" }}
                                              onChange={(e) => getDocumentData(e?.target?.files[0], "reraNonRegistrationDoc")}
                                              accept="application/pdf/jpeg/png"
                                            />

                                            {watch("reraNonRegistrationDoc") && (
                                              <a
                                                onClick={() => getDocShareholding(watch("reraNonRegistrationDoc"), setLoader)}
                                                className="btn btn-sm "
                                              >
                                                <VisibilityIcon color="info" className="icon" />
                                              </a>
                                            )}
                                          </label>
                                          {/* <h3>{watch("reraNonRegistrationDoc")}</h3> */}
                                          <h3 className="error-message" style={{ color: "red" }}>
                                            {errors?.reraNonRegistrationDoc && errors?.reraNonRegistrationDoc?.message}
                                          </h3>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  &nbsp;&nbsp;
                  <div className="row">
                    <div className="col col-12 ">
                      <div>
                        <h2>
                          &nbsp;&nbsp;(ii)Whether licence applied under Migration Policy ? <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                          <label htmlFor="migrationLic">
                            <input
                              {...register("migrationLic")}
                              type="radio"
                              value="Y"
                              id="migrationLic"
                              onClick={() => {
                                resetValues();
                                setSpecificTableData(null);
                                setmodal(true);
                              }}
                            />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="migrationLic">
                            <input {...register("migrationLic")} type="radio" value="N" id="migrationLic" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.migrationLic && errors?.migrationLic?.message}
                          </h3>
                        </h2>
                      </div>
                      {watch("migrationLic") === "Y" && (
                        <div>
                          {modalData.length > 0 && (
                            <div className="applt" style={{ overflow: "auto" }}>
                              <WorkingTable columns={columns} data={modalData} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <hr></hr>
                  <br></br>
                  <div>
                    <h4>
                      2. Any encumbrance with respect to following <span style={{ color: "red" }}>*</span>
                    </h4>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="rehan" id="encumburance" />
                      &nbsp;&nbsp; Rehan / Mortgage &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="patta" id="encumburance" />
                      &nbsp;&nbsp; Patta/Lease &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="gair" id="encumburance" />
                      &nbsp;&nbsp; Gair/Marusi &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="loan" id="encumburance" />
                      &nbsp;&nbsp; Loan &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="anyOther" id="encumburance" />
                      &nbsp;&nbsp; Any Other &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="none" id="encumburance" />
                      &nbsp;&nbsp; None &nbsp;&nbsp;
                    </label>
                    <div className="row ">
                      {watch("encumburance") === "rehan" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("rehanRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.rehanRemark && errors?.rehanRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6">
                            <h2></h2> Document Upload <span style={{ color: "red" }}>*</span>
                            <label>
                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                accept="application/pdf/jpeg/png"
                                onChange={(e) => getDocumentData(e?.target?.files[0], "encumburanceDoc")}
                              />
                            </label>
                            {watch("encumburanceDoc") && (
                              <a onClick={() => getDocShareholding(watch("encumburanceDoc"), setLoader)} className="btn btn-sm ">
                                <VisibilityIcon color="info" className="icon" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {watch("encumburance") === "patta" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("pattaRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.pattaRemark && errors?.pattaRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6">
                            <h2></h2> Document Upload <span style={{ color: "red" }}>*</span>
                            <label>
                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                accept="application/pdf/jpeg/png"
                                onChange={(e) => getDocumentData(e?.target?.files[0], "encumburanceDoc")}
                              />
                            </label>
                            {watch("encumburanceDoc") && (
                              <a onClick={() => getDocShareholding(watch("encumburanceDoc"), setLoader)} className="btn btn-sm ">
                                <VisibilityIcon color="info" className="icon" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {watch("encumburance") === "gair" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("gairRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.gairRemark && errors?.gairRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6">
                            <h2></h2> Document Upload <span style={{ color: "red" }}>*</span>
                            <label>
                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                accept="application/pdf/jpeg/png"
                                onChange={(e) => getDocumentData(e?.target?.files[0], "encumburanceDoc")}
                              />
                            </label>
                            {watch("encumburanceDoc") && (
                              <a onClick={() => getDocShareholding(watch("encumburanceDoc"), setLoader)} className="btn btn-sm ">
                                <VisibilityIcon color="info" className="icon" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {watch("encumburance") === "loan" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("loanRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.loanRemark && errors?.loanRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6">
                            <h2></h2> Document Upload <span style={{ color: "red" }}>*</span>
                            <label>
                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                accept="application/pdf/jpeg/png"
                                onChange={(e) => getDocumentData(e?.target?.files[0], "encumburanceDoc")}
                              />
                            </label>
                            {watch("encumburanceDoc") && (
                              <a onClick={() => getDocShareholding(watch("encumburanceDoc"), setLoader)} className="btn btn-sm ">
                                <VisibilityIcon color="info" className="icon" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {watch("encumburance") === "anyOther" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("anyOtherRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.anyOtherRemark && errors?.anyOtherRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6">
                            <h2></h2> Document Upload <span style={{ color: "red" }}>*</span>
                            <label>
                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                accept="application/pdf/jpeg/png"
                                onChange={(e) => getDocumentData(e?.target?.files[0], "encumburanceDoc")}
                              />
                            </label>
                            {watch("encumburanceDoc") && (
                              <a onClick={() => getDocShareholding(watch("encumburanceDoc"), setLoader)} className="btn btn-sm ">
                                <VisibilityIcon color="info" className="icon" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {/* {watch("encumburance") !== "none" && (
                        <div className="col col-6">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document"></h2> Document Upload{" "}
                          <span style={{ color: "red" }}>*</span>
                          <label>
                            <FileUpload style={{ cursor: "pointer" }} color="primary" />
                            <input
                              type="file"
                              style={{ display: "none" }}
                              accept="application/pdf/jpeg/png"
                              onChange={(e) => getDocumentData(e?.target?.files[0], "encumburanceDoc")}
                            />
                          </label>
                          {watch("encumburanceDoc") && (
                            <a onClick={() => getDocShareholding(watch("encumburanceDoc"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )}
                        </div>
                      )} */}
                    </div>

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.encumburance && errors?.encumburance?.message}
                    </h3>
                  </div>
                  <br></br>
                  <hr />
                  <br></br>
                  <div>
                    <h6>
                      (ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator.
                      <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="litigation">
                        <input {...register("litigation")} type="radio" value="Y" id="litigation" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="litigation">
                        <input {...register("litigation")} type="radio" value="N" id="litigation" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.litigation && errors?.litigation?.message}
                      </h3>
                    </h6>
                  </div>
                  {watch("litigation") === "Y" && (
                    <div>
                      <br></br>
                      <hr />
                      <br></br>
                      <div className="row ">
                        <div className="col col-12 ">
                          <h6>
                            Court orders, if any, affecting applied land. <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                            <label htmlFor="court">
                              <input {...register("court")} type="radio" value="Y" id="court" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="court">
                              <input {...register("court")} type="radio" value="N" id="court" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.court && errors?.court?.message}
                            </h3>
                          </h6>
                        </div>
                        <div className="row">
                          <div className="col col-12 ">
                            {watch("court") === "Y" && (
                              <div className="row ">
                                <div className="col col-6">
                                  <label>
                                    <h2>
                                      Remark/Case No.<span style={{ color: "red" }}>*</span>
                                    </h2>{" "}
                                  </label>
                                  <input type="text" className="form-control" {...register("courtyCaseNo")} />
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.courtyCaseNo && errors?.courtyCaseNo?.message}
                                  </h3>
                                </div>
                                <div className="col col-6">
                                  <h2></h2>
                                  Document Upload <span style={{ color: "red" }}>*</span>
                                  <label>
                                    <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                    <input
                                      type="file"
                                      style={{ display: "none" }}
                                      onChange={(e) => getDocumentData(e?.target?.files[0], "courtDoc")}
                                      accept="application/pdf/jpeg/png"
                                    />
                                  </label>
                                  {watch("courtDoc") && (
                                    <a onClick={() => getDocShareholding(watch("courtDoc"), setLoader)} className="btn btn-sm ">
                                      <VisibilityIcon color="info" className="icon" />
                                    </a>
                                  )}
                                  {/* <h3 >{watch("courtDoc")}</h3> */}
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.courtDoc && errors?.courtDoc?.message}
                                  </h3>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <br></br>
                  <hr />
                  <br></br>
                  <div>
                    <h6>
                      (iii) Any insolvency/liquidation proceedings against the Land Owing Company/Developer Company.
                      <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="insolvency">
                        <input {...register("insolvency")} type="radio" value="Y" id="insolvency" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="insolvency">
                        <input {...register("insolvency")} type="radio" value="N" id="insolvency" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.insolvency && errors?.insolvency?.message}
                      </h3>
                    </h6>
                  </div>
                  <div className="row">
                    <div className="col col-12 ">
                      {watch("insolvency") === "Y" && (
                        <div className="row ">
                          <div className="col col-6">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("insolvencyRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.insolvencyRemark && errors?.insolvencyRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6">
                            <h2></h2> Document Upload <span style={{ color: "red" }}>*</span>
                            <label>
                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                accept="application/pdf/jpeg/png"
                                onChange={(e) => getDocumentData(e?.target?.files[0], "insolvencyDoc")}
                              />
                            </label>
                            {watch("insolvencyDoc") && (
                              <a onClick={() => getDocShareholding(watch("insolvencyDoc"), setLoader)} className="btn btn-sm ">
                                <VisibilityIcon color="info" className="icon" />
                              </a>
                            )}
                            {/* <h3>{watch("insolvencyDoc")}</h3> */}
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.insolvencyDoc && errors?.insolvencyDoc?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <hr />
                  <br></br>
                  <h5>3.Shajra Plan</h5>
                  <br></br>
                  <div className="row">
                    <div className="col col-3 ">
                      <h2>
                        (a)&nbsp;As per applied land (Yes/No)<span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="appliedLand">
                        <input {...register("appliedLand")} type="radio" value="Y" id="appliedLand" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="appliedLand">
                        <input {...register("appliedLand")} type="radio" value="N" id="appliedLand" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.appliedLand && errors?.appliedLand?.message}
                      </h3>
                      {watch("appliedLand") === "N" && (
                        <div className="row ">
                          <div className="col col-12">
                            <h6></h6>
                            Document Upload <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                            <label>
                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => getDocumentData(e?.target?.files[0], "docUpload")}
                                accept="application/pdf/jpeg/png"
                              />
                            </label>
                            {watch("docUpload") && (
                              <a onClick={() => getDocShareholding(watch("docUpload"), setLoader)} className="btn btn-sm ">
                                <VisibilityIcon color="info" className="icon" />
                              </a>
                            )}
                            {/* <h3>{watch("docUpload")}</h3> */}
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.docUpload && errors?.docUpload?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3 ">
                      <h2>
                        (b)&nbsp;Revenue rasta <span style={{ color: "red" }}>*</span>
                        <Tooltip title="If any revenue rasta abuts to the applied site ?">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="revenueRasta">
                        <input {...register("revenueRasta")} type="radio" value="Y" id="revenueRasta" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="revenueRasta">
                        <input {...register("revenueRasta")} type="radio" value="N" id="revenueRasta" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.revenueRasta && errors?.revenueRasta?.message}
                      </h3>
                      {watch("revenueRasta") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                {" "}
                                Unconsolidated<span style={{ color: "red" }}>*</span>&nbsp;
                              </h2>
                            </label>
                            <ReactMultiSelect
                              control={control}
                              name="unconsolidated"
                              placeholder="Unconsolidated"
                              data={unconsolidated}
                              labels="Potential"
                            />
                          </div>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.waterCourse && errors?.waterCourse?.message}
                          </h3>
                        </div>
                      )}
                    </div>
                    <div className="col col-3 ">
                      <h2>
                        (c)&nbsp;Watercourse <span style={{ color: "red" }}>*</span>
                        <Tooltip title="Watercourse running along boundary through the applied site ?">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="waterCourse">
                        <input {...register("waterCourse")} type="radio" value="Y" id="waterCourse" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="waterCourse">
                        <input {...register("waterCourse")} type="radio" value="N" id="waterCourse" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.waterCourse && errors?.waterCourse?.message}
                      </h3>
                      {watch("waterCourse") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              {" "}
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("waterCourseRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.waterCourseRemark && errors?.waterCourseRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3 ">
                      <h2>
                        (d) &nbsp;Whether in Compact Block.<span style={{ color: "red" }}>*</span>
                      </h2>{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="compactBlock">
                        <input {...register("compactBlock")} type="radio" value="Y" id="compactBlock" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="compactBlock">
                        <input {...register("compactBlock")} type="radio" value="N" id="compactBlock" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.compactBlock && errors?.compactBlock?.message}
                      </h3>
                      {watch("compactBlock") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("compactBlockRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.compactBlockRemark && errors?.compactBlockRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col col-3 ">
                      <h2>
                        (e)&nbsp;Whether Others Land fall <span style={{ color: "red" }}>*</span>
                        <Tooltip title="Whether Others Land fall within Applied Land">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="landSandwiched">
                        <input {...register("landSandwiched")} type="radio" value="Y" id="landSandwiched" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="landSandwiched">
                        <input {...register("landSandwiched")} type="radio" value="N" id="landSandwiched" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.landSandwiched && errors?.landSandwiched?.message}
                      </h3>
                      {watch("landSandwiched") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>
                                Enter Kharsa No. <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("landSandwichedRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.landSandwichedRemark && errors?.landSandwichedRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3 ">
                      <h2>
                        (f)&nbsp;Acquisition status <span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="acquistion">
                        <input {...register("acquistion")} type="radio" value="Y" id="acquistion" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="acquistion">
                        <input {...register("acquistion")} type="radio" value="N" id="acquistion" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.acquistion && errors?.acquistion?.message}
                      </h3>
                      {watch("acquistion") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>Date of section 4 notification</h2>{" "}
                            </label>
                            <input
                              type="date"
                              {...register("sectionFour")}
                              className="form-control"
                              max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                            />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.sectionFour && errors?.sectionFour?.message}
                            </h3>
                          </div>
                          <div className="col col-12">
                            <label>
                              <h2>Date of section 6 notification</h2>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              {...register("sectionSix")}
                              max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                            />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.sectionSix && errors?.sectionSix?.message}
                            </h3>
                          </div>
                          <div className="col col-12">
                            <label>
                              <h2>Date of Award</h2>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              {...register("rewardDate")}
                              max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                            />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.rewardDate && errors?.rewardDate?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  {watch("acquistion") === "Y" && (
                    <div className="row">
                      <div className="col col-12">
                        <label>
                          <h2>
                            (g)&nbsp;&nbsp;Whether Land Released/Excluded from aqusition proceeding.<span style={{ color: "red" }}>*</span>{" "}
                            &nbsp;&nbsp;
                          </h2>
                        </label>
                        <label htmlFor="orderUpload">
                          <input {...register("orderUpload")} type="radio" value="Y" id="orderUpload" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="orderUpload">
                          <input {...register("orderUpload")} type="radio" value="N" id="orderUpload" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.orderUpload && errors?.orderUpload?.message}
                        </h3>
                        {watch("orderUpload") === "Y" && (
                          <div className="row ">
                            <div className="col col-3 ">
                              <h2>
                                Whether land compensation
                                <Tooltip title="Whether land compensation received ">
                                  <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                                </Tooltip>
                              </h2>

                              <label htmlFor="landCompensation">
                                <input {...register("landCompensation")} type="radio" value="Y" id="landCompensation" />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="landCompensation">
                                <input {...register("landCompensation")} type="radio" value="N" id="landCompensation" />
                                &nbsp; No &nbsp;&nbsp;
                              </label>
                            </div>
                            <div className="col col-3">
                              <label>
                                <h2>Status of release</h2>
                              </label>

                              <ReactMultiSelect
                                control={control}
                                name="releaseStatus"
                                placeholder="Status of release"
                                data={releaseStatus}
                                labels="Potential"
                              />
                              <div className="invalid-feedback">{errors?.releaseStatus?.message}</div>
                            </div>
                            <div className="col col-3">
                              <label>
                                <h2>Date of Release</h2>{" "}
                              </label>
                              <input type="date" {...register("releaseDate")} className="form-control" />
                              <div className="invalid-feedback">{errors?.releaseDate?.message}</div>
                            </div>
                            <div className="col col-3">
                              <label htmlFor="siteDetail">
                                <h2>Site Details</h2>
                              </label>
                              <input type="text" {...register("siteDetail")} className="form-control" minLength={2} maxLength={99} />
                              <div className="invalid-feedback">{errors?.siteDetail?.message}</div>
                            </div>

                            <div className="col col-3">
                              <h6 style={{ display: "flex" }}>
                                Copy of release order <span style={{ color: "red" }}>*</span>
                              </h6>
                              <label>
                                <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                <input
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "releaseOrderCopyDoc")}
                                  accept="application/pdf/jpeg/png"
                                />
                              </label>
                              {watch("releaseOrderCopyDoc") && (
                                <a onClick={() => getDocShareholding(watch("releaseOrderCopyDoc"), setLoader)} className="btn btn-sm ">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              )}
                            </div>

                            <div className="col col-3 mt-2">
                              <h2>whether litigation regarding release of Land</h2>
                              <label htmlFor="litigationRegardingLandRelease">
                                <input {...register("litigationRegardingLandRelease")} type="radio" value="Y" id="litigationRegardingLandRelease" />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="litigationRegardingLandRelease">
                                <input {...register("litigationRegardingLandRelease")} type="radio" value="N" id="litigationRegardingLandRelease" />
                                &nbsp; No &nbsp;&nbsp;
                              </label>
                            </div>
                            {watch("litigationRegardingLandRelease") === "Y" && (
                              // should be alpha numeric with 15 characters
                              <div className="col col-3 mt-2">
                                <div>
                                  <label>
                                    <h2>CWP/SLP Number</h2>
                                  </label>
                                </div>
                                <input
                                  autoComplete="off"
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter CWP/SLP Number"
                                  {...register("CWPSLPNumber")}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <br></br>
                  <div className="row">
                    <div className="col col-12">
                      <h2>
                        (h)&nbsp;&nbsp;Details of existing approach as per policy dated 20-10-20.<span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                        <label htmlFor="siteApproachable">
                          <input {...register("siteApproachable")} type="radio" value="Y" id="siteApproachable" />
                          &nbsp; Category-I approach &nbsp;&nbsp;
                        </label>
                        <label htmlFor="siteApproachable">
                          <input {...register("siteApproachable")} type="radio" value="N" id="siteApproachable" />
                          &nbsp; Category-II approach &nbsp;&nbsp;
                        </label>
                      </h2>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.siteApproachable && errors?.siteApproachable?.message}
                      </h3>
                    </div>
                    {watch("siteApproachable") === "Y" && (
                      <div>
                        <div class="row">
                          <div class="col-sm-6 text-left">
                            <h2>
                              (a)&nbsp;Approach available from minimum 4 karam (22 ft) wide revenue rasta.
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label>
                              <input {...register("minimumApproachFour")} type="radio" value="Y" id="minimumApproachFour" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label>
                              <input {...register("minimumApproachFour")} type="radio" value="N" id="minimumApproachFour" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>

                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.minimumApproachFour && errors?.minimumApproachFour?.message}
                            </h3>
                          </div>
                        </div>
                        <div className="row">
                          <div class="col-sm-6 text-left">
                            <h2>
                              (b)&nbsp;&nbsp;Approach available from minimum 11 feet wide revenue rasta and applied site abuts acquired alignment of
                              the sector road and there is no stay regarding construction on the land falling under the abutting sector road.
                              <span style={{ color: "red" }}>*</span>{" "}
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="minimumApproachEleven">
                              <input {...register("minimumApproachEleven")} type="radio" value="Y" id="minimumApproachEleven" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="minimumApproachEleven">
                              <input {...register("minimumApproachEleven")} type="radio" value="N" id="minimumApproachEleven" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>

                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.minimumApproachEleven && errors?.minimumApproachEleven?.message}
                            </h3>
                          </div>
                        </div>
                        &nbsp;&nbsp;
                        <div className="row">
                          <div class="col-sm-6 text-left">
                            <h2>
                              (c)&nbsp;&nbsp;Applied site abouts already constructed sector road or internal circulation road of approved sectoral
                              plan (of min. 18m/24m width as the case may be) provided its entire stretch required for approach is licenced and is
                              further leading upto atleast 4 karam wide revenue rasta.<span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label>
                              <input {...register("alreadyConstructedSector")} type="radio" value="Y" id="alreadyConstructedSector" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="alreadyConstructedSector">
                              <input {...register("alreadyConstructedSector")} type="radio" value="N" id="alreadyConstructedSector" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>

                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.alreadyConstructedSector && errors?.alreadyConstructedSector?.message}
                            </h3>
                          </div>
                        </div>
                        &nbsp;&nbsp;
                        <div className="row">
                          <div class="col-sm-6 text-left">
                            <h2>
                              (d)&nbsp;&nbsp;Applied land is accessible from a minimum 4 karam wide rasta through adjoining own land of the applicant
                              (but not applied for licence).<span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="adjoiningOwnLand">
                              <input {...register("adjoiningOwnLand")} type="radio" value="Y" id="adjoiningOwnLand" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="adjoiningOwnLand">
                              <input {...register("adjoiningOwnLand")} type="radio" value="N" id="adjoiningOwnLand" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                        </div>
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.adjoiningOwnLand && errors?.adjoiningOwnLand?.message}
                        </h3>
                        &nbsp;&nbsp;
                        {watch("adjoiningOwnLand") === "Y" && (
                          <div>
                            <div className="row">
                              <div class="col-sm-6 text-left">
                                <h2>
                                  (d1)&nbsp;&nbsp;If applicable, whether the applicant has donated at least 4 karam wide strip from its adjoining own
                                  land in favour of the Gram Panchayat/Municipality, in order to connect the applied site to existing 4 karam rasta?.
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </div>
                              <div class="col-sm-6 text-right">
                                <label htmlFor="applicantHasDonated">
                                  <input {...register("applicantHasDonated")} type="radio" value="Y" id="applicantHasDonated" />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="applicantHasDonated">
                                  <input {...register("applicantHasDonated")} type="radio" value="N" id="applicantHasDonated" />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.applicantHasDonated && errors?.applicantHasDonated?.message}
                            </h3>
                            &nbsp;&nbsp;
                            {watch("applicantHasDonated") === "Y" && (
                              <div>
                                <div className="row">
                                  <div class="col-sm-6 text-left">
                                    <h2 style={{ display: "flex" }}>
                                      Upload copy of Gift Deed/ Hibbanama <span style={{ color: "red" }}>*</span>
                                    </h2>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "giftDeedHibbanama")}
                                        accept="application/pdf/jpeg/png"
                                      />
                                    </label>
                                    {watch("giftDeedHibbanama") && (
                                      <a onClick={() => getDocShareholding(watch("giftDeedHibbanama"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        &nbsp;&nbsp;
                        <div className="row">
                          <div class="col-sm-6 text-left">
                            <h2>
                              (e)&nbsp;&nbsp;Applied land is accessible from a minimum 4 karam wide rasta through adjoining other’s land
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="adjoiningOthersLand">
                              <input {...register("adjoiningOthersLand")} type="radio" value="Y" id="adjoiningOthersLand" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="adjoiningOthersLand">
                              <input {...register("adjoiningOthersLand")} type="radio" value="N" id="adjoiningOthersLand" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                        </div>
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.adjoiningOthersLand && errors?.adjoiningOthersLand?.message}
                        </h3>
                        &nbsp;&nbsp;
                        {watch("adjoiningOthersLand") === "Y" && (
                          <div>
                            <div className="row">
                              <div class="col-sm-6 text-left">
                                <h2>
                                  (e1)&nbsp;&nbsp;whether the land-owner of the adjoining land has donated at least 4 karam wide strip of land to the
                                  Gram Panchayat/Municipality, in a manner that the applied site gets connected to existing public rasta of atleast 4
                                  karam width?.
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </div>
                              <div class="col-sm-6 text-right">
                                <label htmlFor="landOwnerDonated">
                                  <input {...register("landOwnerDonated")} type="radio" value="Y" id="landOwnerDonated" />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="landOwnerDonated">
                                  <input {...register("landOwnerDonated")} type="radio" value="N" id="landOwnerDonated" />
                                  &nbsp; No &nbsp;&nbsp;
                                </label>
                              </div>
                            </div>
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.landOwnerDonated && errors?.landOwnerDonated?.message}
                            </h3>
                            &nbsp;&nbsp;
                            {watch("landOwnerDonated") === "Y" && (
                              <div>
                                <div className="row">
                                  <div class="col-sm-6 text-left">
                                    <h2 style={{ display: "flex" }}>
                                      Upload copy of Gift Deed/ Hibbanama <span style={{ color: "red" }}>*</span>
                                    </h2>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "giftDeedHibbanama")}
                                        accept="application/pdf/jpeg/png"
                                      />
                                    </label>
                                    {watch("giftDeedHibbanama") && (
                                      <a onClick={() => getDocShareholding(watch("giftDeedHibbanama"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {watch("siteApproachable") === "N" && (
                      <div>
                        <div className="row">
                          <div class="col-sm-9 text-left">
                            <label>
                              <h2>(a)&nbsp;&nbsp;Enter Width in Meters</h2>{" "}
                            </label>
                          </div>
                          <div class="col-sm-3 text-right">
                            <input type="number" {...register("constructedRowWidth")} className="form-control" />
                          </div>
                        </div>
                        &nbsp;&nbsp;
                        <div className="row">
                          <div class="col-sm-6 text-left">
                            <h2>
                              (b)&nbsp;&nbsp;Whether irrevocable consent from such developer/ colonizer for uninterrupted usage of such internal road
                              for the purpose of development of the colony by the applicant or by its agencies and for usage by its allottees
                              submitted
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="irrevocableConsent">
                              <input {...register("irrevocableConsent")} type="radio" value="Y" id="irrevocableConsent" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="irrevocableConsent">
                              <input {...register("irrevocableConsent")} type="radio" value="N" id="irrevocableConsent" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.irrevocableConsent && errors?.irrevocableConsent?.message}
                          </h3>
                          {watch("irrevocableConsent") === "Y" && (
                            <div className="col col-3 mt-3">
                              <h2 style={{ display: "flex" }}>
                                Upload irrevocable consent <span style={{ color: "red" }}>*</span>
                              </h2>
                              <label>
                                <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                <input
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "uploadRrrevocableConsent")}
                                  accept="application/pdf/jpeg/png"
                                />
                              </label>
                              {watch("uploadRrrevocableConsent") && (
                                <a onClick={() => getDocShareholding(watch("uploadRrrevocableConsent"), setLoader)} className="btn btn-sm ">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="row">
                          <div class="col-sm-6 text-left">
                            <h2>(c)&nbsp;&nbsp;Access from NH/SR</h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="NHSRAccess">
                              <input {...register("NHSRAccess")} type="radio" value="Y" id="NHSRAccess" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="NHSRAccess">
                              <input {...register("NHSRAccess")} type="radio" value="N" id="NHSRAccess" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                          {watch("NHSRAccess") === "Y" && (
                            <div className="col col-3 mt-3">
                              <h2 style={{ display: "flex" }}>'Upload access permission from competent authority</h2>
                              <label>
                                <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                <input
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "accessPermissionAuthority")}
                                  accept="application/pdf/jpeg/png"
                                />
                              </label>
                              {watch("accessPermissionAuthority") && (
                                <a onClick={() => getDocShareholding(watch("accessPermissionAuthority"), setLoader)} className="btn btn-sm ">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <br></br>
                  <br></br>
                  <div className="row">
                    <div className="col col-12 mb-4">
                      <h2>(i)&nbsp;&nbsp;Details of proposed approach.</h2>
                    </div>
                    <div className="ml-4">
                      <h2>
                        (1)&nbsp;&nbsp; Site approachable from proposed sector road/ Development Plan Road. &nbsp;&nbsp;
                        <label htmlFor="approachFromProposedSector">
                          <input {...register("approachFromProposedSector")} type="radio" value="Y" id="approachFromProposedSector" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="approachFromProposedSector">
                          <input {...register("approachFromProposedSector")} type="radio" value="N" id="approachFromProposedSector" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                      </h2>
                      {watch("approachFromProposedSector") === "Y" && (
                        <div>
                          <div className="col col-5">
                            <label>(a)&nbsp;&nbsp;Enter Width in Meters</label>
                            <input type="number" {...register("sectorAndDevelopmentWidth")} className="form-control" />
                          </div>
                          <h2>
                            (b)&nbsp;&nbsp;Whether acquired? &nbsp;&nbsp;
                            <label htmlFor="whetherAcquired">
                              <input {...register("whetherAcquired")} type="radio" value="Y" id="whetherAcquired" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="whetherAcquired">
                              <input {...register("whetherAcquired")} type="radio" value="N" id="whetherAcquired" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                          <h2>
                            (c)&nbsp;&nbsp;Whether constructed? &nbsp;&nbsp;
                            <label htmlFor="whetherConstructed">
                              <input {...register("whetherConstructed")} type="radio" value="Y" id="whetherConstructed" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="whetherConstructed">
                              <input {...register("whetherConstructed")} type="radio" value="N" id="whetherConstructed" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                          <h2>
                            (d)&nbsp;&nbsp;Whether Service road along sector road acquired? &nbsp;&nbsp;
                            <label htmlFor="serviceSectorRoadAcquired">
                              <input {...register("serviceSectorRoadAcquired")} type="radio" value="Y" id="serviceSectorRoadAcquired" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="serviceSectorRoadAcquired">
                              <input {...register("serviceSectorRoadAcquired")} type="radio" value="N" id="serviceSectorRoadAcquired" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                          <h2>
                            (e)&nbsp;&nbsp;Whether Service road along sector road constructed? &nbsp;&nbsp;
                            <label htmlFor="serviceSectorRoadConstructed">
                              <input {...register("serviceSectorRoadConstructed")} type="radio" value="Y" id="serviceSectorRoadConstructed" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="serviceSectorRoadConstructed">
                              <input {...register("serviceSectorRoadConstructed")} type="radio" value="N" id="serviceSectorRoadConstructed" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 ml-4">
                      <h2>
                        (2)&nbsp;&nbsp;Site approachable from internal circulation / sectoral plan road. &nbsp;&nbsp;
                        <label htmlFor="approachFromInternalCirculation">
                          <input {...register("approachFromInternalCirculation")} type="radio" value="Y" id="approachFromInternalCirculation" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="approachFromInternalCirculation">
                          <input {...register("approachFromInternalCirculation")} type="radio" value="N" id="approachFromInternalCirculation" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                      </h2>
                      {watch("approachFromInternalCirculation") === "Y" && (
                        <div>
                          <div className="col col-3">
                            <label>(a)&nbsp;&nbsp;Enter Width in Meters</label>
                            <input type="number" {...register("internalAndSectoralWidth")} className="form-control" />
                          </div>
                          <h2>
                            (b)&nbsp;&nbsp;Whether acquired? &nbsp;&nbsp;
                            <label htmlFor="whetherAcquiredForInternalCirculation">
                              <input
                                {...register("whetherAcquiredForInternalCirculation")}
                                type="radio"
                                value="Y"
                                id="whetherAcquiredForInternalCirculation"
                              />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="whetherAcquiredForInternalCirculation">
                              <input
                                {...register("whetherAcquiredForInternalCirculation")}
                                type="radio"
                                value="N"
                                id="whetherAcquiredForInternalCirculation"
                              />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                          <h2>
                            (c)&nbsp;&nbsp;Whether constructed? &nbsp;&nbsp;
                            <label htmlFor="whetherConstructedForInternalCirculation">
                              <input
                                {...register("whetherConstructedForInternalCirculation")}
                                type="radio"
                                value="Y"
                                id="whetherConstructedForInternalCirculation"
                              />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="whetherConstructedForInternalCirculation">
                              <input
                                {...register("whetherConstructedForInternalCirculation")}
                                type="radio"
                                value="N"
                                id="whetherConstructedForInternalCirculation"
                              />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <br></br>
                  {watch("licenseApplied") === "Y" && (
                    <div className="row">
                      <div className="col col-12">
                        <h2>
                          (j)&nbsp;&nbsp;Whether approach from parent licence.<span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                          <label htmlFor="parentLicenceApproach">
                            <input {...register("parentLicenceApproach")} type="radio" value="Y" id="parentLicenceApproach" />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="parentLicenceApproach">
                            <input {...register("parentLicenceApproach")} type="radio" value="N" id="parentLicenceApproach" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>
                        </h2>
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.parentLicenceApproach && errors?.parentLicenceApproach?.message}
                        </h3>
                      </div>
                    </div>
                  )}
                  <br></br>
                  <br></br>
                  <div className="row">
                    <div className="col col-12">
                      <h2>
                        (k)&nbsp;&nbsp;Any other type of existing approach available.<span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                        <label htmlFor="availableExistingApproach">
                          <input {...register("availableExistingApproach")} type="radio" value="Y" id="availableExistingApproach" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="availableExistingApproach">
                          <input {...register("availableExistingApproach")} type="radio" value="N" id="availableExistingApproach" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                      </h2>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.availableExistingApproach && errors?.availableExistingApproach?.message}
                      </h3>
                    </div>
                    {watch("availableExistingApproach") === "Y" && (
                      <div className="row">
                        {/* <div className="col col-4">
                          <label>
                            <h2>
                              Remark <span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <input type="text" className="form-control" {...register("availableExistingApproachRemark")} />
                        </div> */}
                        <div className="col col-3">
                          <h2 style={{ display: "flex" }}>Upload document.</h2>
                          <label>
                            <FileUpload style={{ cursor: "pointer" }} color="primary" />
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => getDocumentData(e?.target?.files[0], "availableExistingApproachDoc")}
                              accept="application/pdf/jpeg/png"
                            />
                          </label>
                          {watch("availableExistingApproachDoc") && (
                            <a onClick={() => getDocShareholding(watch("availableExistingApproachDoc"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <br></br>
                  <hr />
                  <br></br>
                  <h4>4.Site condition</h4>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h2>
                        (a) &nbsp;Vacant: (Yes/No) <span style={{ color: "red" }}>*</span>{" "}
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="vacant">
                        <input {...register("vacant")} type="radio" value="Y" id="vacant" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="vacant">
                        <input {...register("vacant")} type="radio" value="N" id="vacant" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.vacant && errors?.vacant?.message}
                      </h3>
                      {watch("vacant") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Vacant Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("vacantRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.vacantRemark && errors?.vacantRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {watch("vacant") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Construction Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("typeOfConstruction")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.construction && errors?.construction?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3">
                      <h2>
                        (b) &nbsp;HT line:(Yes/No) <span style={{ color: "red" }}>*</span>
                      </h2>{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="HTLine">
                        <input {...register("ht")} type="radio" value="Y" id="HTLine" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="HTLine">
                        <input {...register("ht")} type="radio" value="N" id="HTLine" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.ht && errors?.ht?.message}
                      </h3>
                      {watch("ht") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                HT Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("htRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.htRemark && errors?.htRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {watch("ht") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>HT Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("htRemark")} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3">
                      <h2>
                        (c)&nbsp;IOC Gas Pipeline:(Yes/No) <span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="IOCGasPipeline">
                        <input {...register("gas")} type="radio" value="Y" id="IOCGasPipeline" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="IOCGasPipeline">
                        <input {...register("gas")} type="radio" value="N" id="IOCGasPipeline" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.gas && errors?.gas?.message}
                      </h3>
                      {watch("gas") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              IOC Remark <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" {...register("gasRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.gasRemark && errors?.gasRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {watch("gas") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>IOC Remark</label>
                            <input type="text" className="form-control" {...register("gasRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>
                        (d) &nbsp;Nallah:(Yes/No) <span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="nallah">
                        <input {...register("nallah")} type="radio" value="Y" id="nallah" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="nallah">
                        <input {...register("nallah")} type="radio" value="N" id="nallah" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.nallah && errors?.nallah?.message}
                      </h3>
                      {watch("nallah") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              Nallah Remark <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" {...register("nallahRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.nallahRemark && errors?.nallahRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {watch("nallah") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>Nallah Remark</label>
                            <input type="text" className="form-control" {...register("nallahRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <div className="row ">
                    <div className="col col-3">
                      <h2>
                        (e) &nbsp;Any revenue rasta <span style={{ color: "red" }}>*</span>
                        <Tooltip title="Any revenue rasta/road/bundh passing through proposed site (Yes/No)">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="road">
                        <input {...register("road")} type="radio" value="Y" id="road" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="road">
                        <input {...register("road")} type="radio" value="N" id="road" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.road && errors?.road?.message}
                      </h3>
                      {watch("road") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>
                                Width of Revenue rasta(in ft.)<span style={{ color: "red" }}>*</span>
                                <Tooltip title=" Width of Revenue rasta/road (in ft.)">
                                  <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                                </Tooltip>
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="number" className="form-control" {...register("roadWidth")} minLength={2} maxLength={20} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.roadWidth && errors?.roadWidth?.message}
                            </h3>
                          </div>
                          <div className="col col-12">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("roadRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.roadRemark && errors?.roadRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {watch("road") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("roadRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* <div className="col col-3">
                      <h2>
                        (f) &nbsp;Any marginal land:(Yes/No) <span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="marginalLand">
                        <input {...register("marginalLand")} type="radio" value="Y" id="marginalLand" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="marginalLand">
                        <input {...register("marginalLand")} type="radio" value="N" id="marginalLand" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.marginalLand && errors?.marginalLand?.message}
                      </h3>
                      {watch("marginalLand") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Remark of Marginal Land <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("marginalLandRemark")} />
                          </div>
                        </div>
                      )}
                      {watch("marginalLand") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Remark of Marginal Land <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("marginalLandRemark")} />
                          </div>
                        </div>
                      )}
                    </div> */}
                    <div className="col col-3">
                      <h2>
                        (f)&nbsp;Utility/Permit Line <span style={{ color: "red" }}>*</span>
                        <Tooltip title="Whether any utility line passing through the site is incorporated/adjusted in the layout plan (Yes/No)">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="utilityLine">
                        <input {...register("utilityLine")} type="radio" value="Y" id="utilityLine" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="utilityLine">
                        <input {...register("utilityLine")} type="radio" value="N" id="utilityLine" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.utilityLine && errors?.utilityLine?.message}
                      </h3>
                      {watch("utilityLine") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>
                                Width of Row (in ft.) <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="number" className="form-control" {...register("utilityWidth")} minLength={2} maxLength={99} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.utilityWidth && errors?.utilityWidth?.message}
                            </h3>
                          </div>
                          <div className="col col-12">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("utilityRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.utilityRemark && errors?.utilityRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {watch("utilityLine") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("utilityRemark")} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3">
                      <h2>(g)&nbsp;Compact Block</h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="compactBlock">
                        <input {...register("compactBlock")} type="radio" value="Y" id="compactBlock" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="compactBlock">
                        <input {...register("compactBlock")} type="radio" value="N" id="compactBlock" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      {watch("compactBlock") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("compactBlockRemark")} />
                          </div>
                        </div>
                      )}
                      {watch("compactBlock") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("compactBlockRemark")} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3">
                      <h2>(h)&nbsp;Whether Others Land fall</h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="othersLandFall">
                        <input {...register("othersLandFall")} type="radio" value="Y" id="othersLandFall" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="othersLandFall">
                        <input {...register("othersLandFall")} type="radio" value="N" id="othersLandFall" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      {watch("othersLandFall") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("othersLandFallRemark")} />
                          </div>
                        </div>
                      )}
                      {watch("othersLandFall") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("othersLandFallRemark")} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-6 mt-3">
                      <h2>(i)&nbsp;Surroundings</h2>

                      <div className="row ">
                        <div className="col col-3">
                          <label>
                            <h2>North</h2>
                          </label>
                          <input type="text" className="form-control" {...register("northSurroundings")} />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>South</h2>
                          </label>
                          <input type="text" className="form-control" {...register("southSurroundings")} />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>East</h2>
                          </label>
                          <input type="text" className="form-control" {...register("eastSurroundings")} />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>West</h2>
                          </label>
                          <input type="text" className="form-control" {...register("westSurroundings")} />
                        </div>
                      </div>
                    </div>

                    <div className="col col-3">
                      <h2>(j)&nbsp;Any other feature passing through site</h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="passingOtherFeature">
                        <input {...register("passingOtherFeature")} type="radio" value="Y" id="passingOtherFeature" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="passingOtherFeature">
                        <input {...register("passingOtherFeature")} type="radio" value="N" id="passingOtherFeature" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      {watch("passingOtherFeature") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>Details thereof</h2>
                            </label>
                            <input type="text" className="form-control" {...register("detailsThereof")} />
                          </div>
                        </div>
                      )}
                      {watch("passingOtherFeature") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Details thereof</h2>
                            </label>
                            <input type="text" className="form-control" {...register("detailsThereof")} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <hr></hr>
                  <br></br>
                  <h5>5. Enclose the following documents as Annexures</h5>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }}>
                        Land schedule <span style={{ color: "red" }}>*</span>
                      </h2>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "landSchedule")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("landSchedule") ? (
                        <a onClick={() => getDocShareholding(watch("landSchedule"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.landSchedule && errors?.landSchedule?.message}
                        </h3>
                      )}
                    </div>

                    <div className="col col-3">
                      <h2 style={{ display: "flex" }}>
                        Copy of Mutation <span style={{ color: "red" }}>*</span>{" "}
                      </h2>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "mutation")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("mutation") ? (
                        <a onClick={() => getDocShareholding(watch("mutation"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.mutation && errors?.mutation?.message}
                        </h3>
                      )}
                    </div>

                    <div className="col col-3">
                      <h2 style={{ display: "flex" }}>
                        Copy of Jamabandi <span style={{ color: "red" }}>*</span>
                      </h2>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "jambandhi")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("jambandhi") ? (
                        <a onClick={() => getDocShareholding(watch("jambandhi"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.jambandhi && errors?.jambandhi?.message}
                        </h3>
                      )}
                    </div>
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }}>Details of lease / patta</h2>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "detailsOfLease")}
                          accept="application/pdf/jpeg/png"
                        />
                      </label>
                      {watch("detailsOfLease") ? (
                        <a onClick={() => getDocShareholding(watch("detailsOfLease"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.detailsOfLease && errors?.detailsOfLease?.message}
                        </h3>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <label>
                        <h2 style={{ display: "flex" }}>
                          Sale Deed/Exchange Deed
                          <Tooltip title=" Add sales/Deed/exchange/gift deed, mutation, lease/Patta">
                            <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                          </Tooltip>
                        </h2>

                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "addSalesDeed")}
                          accept="application/pdf/jpeg/png"
                        />

                        {watch("addSalesDeed") ? (
                          <a onClick={() => getDocShareholding(watch("addSalesDeed"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.addSalesDeed && errors?.addSalesDeed?.message}
                          </h3>
                        )}
                      </label>
                    </div>
                    <div className="col col-3">
                      <label>
                        <h2 style={{ display: "flex" }}>
                          Copy of spa/GPA/board. <span style={{ color: "red" }}>*</span>
                          <Tooltip title="Copy of spa/GPA/board resolution to sign collaboration agrrement">
                            <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                          </Tooltip>
                        </h2>

                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "copyofSpaBoard")}
                          accept="application/pdf/jpeg/png"
                        />

                        {watch("copyofSpaBoard") ? (
                          <a onClick={() => getDocShareholding(watch("copyofSpaBoard"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.copyofSpaBoard && errors?.copyofSpaBoard?.message}
                          </h3>
                        )}
                      </label>
                    </div>
                    {/* <div className="col col-3">
                      <h2 style={{ display: "flex" }}>
                        Revised Land Schedule <span style={{ color: "red" }}>*</span>
                      </h2>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }}  color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "revisedLanSchedule")}
                        />
                      </label>
                      {fileStoreId?.revisedLanSchedule ? (
                        <a onClick={() => getDocShareholding(fileStoreId?.revisedLanSchedule)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <p></p>
                      )}
                      <h3 style={{}}>{watch("revisedLanScheduleFileName") ? watch("revisedLanScheduleFileName") : null}</h3>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.revisedLanSchedule && errors?.revisedLanSchedule?.message}
                      </h3>
                    </div> */}

                    <div className="col col-3">
                      <h2 style={{ display: "flex" }}>
                        Shajra Plan <span style={{ color: "red" }}>*</span>
                        {/* <Tooltip title=" Click here for instructions to Upload Copy of Shajra Plan.">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip> */}
                      </h2>
                      <span>
                        {" "}
                        <a onClick={() => setmodal1(true)}>(Click here )</a>
                      </span>

                      <div>
                        <Modal size="lg" isOpen={modal1} toggle={() => setmodal(!modal1)} aria-labelledby="contained-modal-title-vcenter" centered>
                          <ModalHeader toggle={() => setmodal1(!modal1)}></ModalHeader>
                          <ModalBody style={{ fontSize: 20 }}>
                            <h2>
                              {" "}
                              <b>1.</b> Standard Formats for preparation of GIS-based layout plans: <br></br>• GIS Format: Plans to be prepared in GIS
                              Format (each layer of the plan in shapefile format) and submitted along with base GIS data used, i.e. Shajra Plan
                              (Shajra plan layers in shapefile format).
                              <br></br>- GIS-based Vector Data Format: Shapefile <br></br>- Projection (Coordinate) system: Universal Transverse
                              Mercator (UTM) <br></br>- Datum: WGS 84<br></br> - Zone: 43 Northern <br></br>
                              <br></br>
                              <b>2.</b> Type of colonies: <br></br>• Plotted Colonies: Layout-cum-Demarcation Plan to be submitted with site plan{" "}
                              <br></br>• Other than plotted colonies: Demarcation Plan to be submitted with site plan <br></br>
                              <br></br>
                              <b>3.</b> GIS Format data to be used: <br></br>- The Department will provide the bundle of predefined blank layers
                              (Layout plan's operational GIS layers), including attribute structure (in shapefile format) through the e-licensing
                              Portal. <br></br>- The applicant has to download the bundle of predefined blank layers and may use it in any GIS
                              software for the preparation of the layout/demarcation plan. <br></br>
                              <br></br>
                              <b>4.</b> Preparation of GIS-based Layout plan- <br></br>- The applicant must prepare the layout/Demarcation plans in
                              predefined opera-tional GIS layers.<br></br> - All attribute fields of GIS layers are to be updated by the applicant.{" "}
                              <br></br>
                              <br></br>
                              <b>5.</b> Submission of Layout Plan on e-License Portal: <br></br>
                              <b>5.1 </b>Submission of plans in GIS Format: <br></br>- Prepare the zip file of each layer and put it in the main
                              folder. <br></br>- Convert the folder to a zip file and upload it online.<br></br> <b>5.2 </b>Submission of Print Layout
                              in pdf format: <br></br>- PDF of the print layout of the plan is essentially to be submitted along with the GIS format.{" "}
                              <br></br>- Components of the print layout (A1/A0 size) should be the same as finalized by the Department including
                              Title, Map, Legend, Scale, Direction, Detail of Plots, Labels, etc.
                            </h2>
                          </ModalBody>
                          <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
                        </Modal>
                      </div>
                      <label>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => getDocumentData(e?.target?.files[0], "copyOfShajraPlan")}
                          accept="application/pdf/jpeg/png"
                          // accept=".dxf/.zip"
                        />
                      </label>
                      {watch("copyOfShajraPlan") ? (
                        <a onClick={() => getDocShareholding(watch("copyOfShajraPlan"), setLoader)} className="btn btn-sm ">
                          <VisibilityIcon color="info" className="icon" />
                        </a>
                      ) : (
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.copyOfShajraPlan && errors?.copyOfShajraPlan?.message}
                        </h3>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Form.Group>
            <div class="row">
              <div class="col-sm-6 text-left">
                <button type="submit" id="btnClear" class="btn btn-primary btn-md center-block" onClick={() => handleWorkflow()}>
                  Back
                </button>
              </div>
              <div class="col-sm-6 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Save and Continue
                </button>
              </div>
            </div>
          </Card>
        </Card>
      </form>
      <Modal size="xl" isOpen={modal} toggle={() => setmodal(!modal)}>
        <div style={{ padding: "4px", textAlign: "right" }}>
          <span
            onClick={() => {
              // if (!getEdit) resetValues();
              setmodal(!modal);
            }}
            style={{ cursor: "pointer" }}
          >
            X
          </span>
        </div>
        <ModalBody>
          <form onSubmit={handleSubmit(LandScheduleModalData)}>
            {" "}
            <Row className="ml-auto mb-3">
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Previous Licence Number <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <input type="text" className="form-control" {...register("previousLicensenumber")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.previousLicensenumber?.value && errors?.previousLicensenumber?.value?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Area of parent licence <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <input type="number" className="form-control" {...register("areaOfParentLicence")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.areaOfParentLicence?.value && errors?.areaOfParentLicence?.value?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Purpose of parent licence <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <input type="text" className="form-control" {...register("purposeOfParentLicence")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.purposeOfParentLicence && errors?.purposeOfParentLicence?.message}
                </h3>
              </Col>
            </Row>
            <Row className="ml-auto mb-3">
              <div className="col col-12">
                <h2>
                  <b>
                    Validity of parent licence <span style={{ color: "red" }}>*</span>
                  </b>
                  &nbsp;&nbsp;
                  <label htmlFor="validity">
                    <input {...register("validity")} type="radio" value="Y" id="yes" />
                    &nbsp;&nbsp; Yes &nbsp;&nbsp;
                  </label>
                  <label htmlFor="validity">
                    <input {...register("validity")} type="radio" value="N" id="no" />
                    &nbsp;&nbsp; No &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.validity && errors?.validity?.message}
                  </h3>
                </h2>
                {watch("validity") === "Y" && (
                  <div>
                    <div className="row ">
                      <div className="col col-4">
                        <label>
                          <h2>
                            Date <span style={{ color: "red" }}>*</span>
                          </h2>
                        </label>
                        <Form.Control type="date" className="form-control" {...register("date")} />
                      </div>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.date && errors?.date?.message}
                      </h3>
                    </div>
                  </div>
                )}
                {watch("validity") === "N" && (
                  <div>
                    <div className="row ">
                      <h2>
                        <b>
                          Whether renewal licence fee submitted <span style={{ color: "red" }}>*</span>
                        </b>
                        &nbsp;&nbsp;
                        <label htmlFor="yess">
                          <input {...register("renewalLicenceFee")} type="radio" value="Y" id="yess" />
                          &nbsp;&nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="noo">
                          <input {...register("renewalLicenceFee")} type="radio" value="N" id="noo" />
                          &nbsp;&nbsp; No &nbsp;&nbsp;
                        </label>
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.renewalLicenceFee && errors?.renewalLicenceFee?.message}
                        </h3>
                      </h2>

                      {/* <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.date && errors?.date?.message}
                      </h3> */}
                    </div>
                  </div>
                )}
              </div>

              <Col md={4} xxl lg="4">
                <div>
                  <label>
                    <h2>
                      Area applied under migration in acres <span style={{ color: "red" }}>*</span>
                    </h2>
                  </label>
                </div>
                <input type="number" className="form-control" {...register("areaAppliedmigration")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.areaAppliedmigration && errors?.areaAppliedmigration?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <label>
                    <h2>
                      Applied Khasra number <span style={{ color: "red" }}>*</span>
                    </h2>
                  </label>
                </div>
                <input type="number" className="form-control" {...register("khasraNumber")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.khasraNumber && errors?.khasraNumber?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <label>
                  <h2>
                    Area <span style={{ color: "red" }}>*</span>
                  </h2>
                </label>
                <input type="number" className="form-control" {...register("area")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.area && errors?.area?.message}
                </h3>
              </Col>
              <div className="col col-4">
                <h2>
                  Third-party right created<span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                </h2>
                <br></br>
                <label htmlFor="thirdParty">
                  <input {...register("thirdParty")} type="radio" value="Y" id="thirdParty" />
                  &nbsp; Yes &nbsp;&nbsp;
                </label>
                <label htmlFor="thirdParty">
                  <input {...register("thirdParty")} type="radio" value="N" id="thirdParty" />
                  &nbsp; No &nbsp;&nbsp;
                </label>
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.thirdParty && errors?.thirdParty?.message}
                </h3>

                {watch("thirdParty") === "N" && (
                  <div className="row ">
                    <div className="col col-12">
                      <label>
                        {" "}
                        <h2>
                          Upload affidavit <span style={{ color: "red" }}>*</span>
                          <Tooltip title="Upload affidavit related to non-creation.">
                            <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                          </Tooltip>
                        </h2>
                        <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        <input
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyDoc")}
                        />
                        {watch("thirdPartyDoc") && (
                          <a onClick={() => getDocShareholding(watch("thirdPartyDoc"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        )}
                        {/* <h3>{watch("thirdPartyDoc")}</h3> */}
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.thirdPartyDoc && errors?.thirdPartyDoc?.message}
                      </h3>
                    </div>
                    <div className="col col-12">
                      <h2>
                        Whether Project is RERA registered<span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                      </h2>

                      <label htmlFor="reraRegistered">
                        <input {...register("reraRegistered")} type="radio" value="Y" id="reraRegistered" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="reraRegistered">
                        <input {...register("reraRegistered")} type="radio" value="N" id="reraRegistered" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      {watch("reraRegistered") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h6>
                                Upload RERA registration <span style={{ color: "red" }}>*</span>
                                <Tooltip title="Upload copy of RERA registration">
                                  <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                                </Tooltip>
                              </h6>

                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => getDocumentData(e?.target?.files[0], "reraDocUpload")}
                                accept="application/pdf/jpeg/png"
                              />

                              {watch("reraDocUpload") && (
                                <a onClick={() => getDocShareholding(watch("reraDocUpload"), setLoader)} className="btn btn-sm ">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              )}
                            </label>
                            {/* <h3>{watch("reraDocUpload")}</h3> */}
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.reraDocUpload && errors?.reraDocUpload?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {watch("reraRegistered") === "N" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h6>
                                Affidavit <span style={{ color: "red" }}>*</span>
                                <Tooltip title=" Upload Copy of non-registration of RERA">
                                  <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                                </Tooltip>
                              </h6>

                              <FileUpload style={{ cursor: "pointer" }} color="primary" />
                              <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => getDocumentData(e?.target?.files[0], "reraNonRegistrationDoc")}
                                accept="application/pdf/jpeg/png"
                              />

                              {watch("reraNonRegistrationDoc") && (
                                <a onClick={() => getDocShareholding(watch("reraNonRegistrationDoc"), setLoader)} className="btn btn-sm ">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              )}
                            </label>
                            {/* <h3>{watch("reraNonRegistrationDoc")}</h3> */}
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.reraNonRegistrationDoc && errors?.reraNonRegistrationDoc?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Row>
            <button type="submit" style={{ float: "right" }} class="btn btn-primary btn-md center-block">
              Submit
            </button>
          </form>
        </ModalBody>
        <ModalFooter toggle={() => setmodal(!modal)}></ModalFooter>
      </Modal>
      {/* {toastError && (
        <Toast
          error={"error" ? true : false}
          label={toastError}
          isDleteBtn={true}
          onClose={() => {
            setToastError(null);
          }}
        />
      )} */}
      {/* {showToast && (
        <Toast
          success={showToast?.key === "success" ? true : false}
          label="Document Uploaded Successfully"
          isDleteBtn={true}
          onClose={() => {
            setShowToast(null);
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
    </div>
  );
};
export default LandScheduleForm;
