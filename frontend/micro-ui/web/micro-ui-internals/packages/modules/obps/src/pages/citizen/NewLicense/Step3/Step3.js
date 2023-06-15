import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { convertEpochToDate } from "../../../../../../tl/src/utils";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import axios from "axios";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";
import Spinner from "../../../../components/Loader";
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
import WorkingTable from "../../../../components/Table";
import CusToaster from "../../../../components/Toaster";
import { useTranslation } from "react-i18next";

const compactBlockA = [
  { label: "Private Road", value: "privateRoad" },
  { label: "Street", value: "street" },
  { label: "Lane footway/footpath", value: "laneFootpath" },
  { label: "Passage/Drain (Natural/Artificial)", value: "passage/drain/natural/atrificial" },
];

const compactBlockB = [
  { label: "Private Land", value: "privateLand" },
  { label: "Any other", value: "anyOther" },
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
  const { t } = useTranslation();
  const location = useLocation();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const stateId = Digit.ULBService.getStateId();
  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);
  const { data: LandData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["LandType"]);
  const { data: PotentialType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DevPlan"]);
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });
  const [getPotentialOptons, setPotentialOptions] = useState({ data: [], isLoading: true });
  const [typeOfLand, setYypeOfLand] = useState({ data: [], isLoading: true });
  const [loader, setLoader] = useState(false);
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [stepData, setStepData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [applicantId, setApplicantId] = useState("");
  const [modalData, setModalData] = useState([]);
  const [getData, setData] = useState({ caseNumber: "", dairyNumber: "" });
  const [fileStoreId, setFileStoreId] = useState({});
  const [specificTableData, setSpecificTableData] = useState(null);

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
    defaultValues: {
      surroundingsObj: [
        {
          pocketName: "",
          north: "",
          south: "",
          east: "",
          west: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "surroundingsObj",
  });

  const handleFunction = (val) => {
    for (let i = 0; i < val - 1; i++) {
      append({ pocketName: "", north: "", south: "", east: "", west: "" });
    }
  };

  const landScheduleFormSubmitHandler = async (data) => {
    const token = window?.localStorage?.getItem("token");

    setLoader(true);
    data["potential"] = data?.potential?.value;
    data["typeLand"] = data?.typeLand?.value;
    data["siteLoc"] = data?.siteLoc?.value;
    data["purposeParentLic"] = data?.purposeParentLic?.value;
    data["releaseStatus"] = data?.releaseStatus?.value;
    data["unconsolidated"] = data?.unconsolidated?.value;
    data["separatedBy"] = data?.separatedBy?.value;

    const filteredData = Object.keys(data)
      .filter((key) => key.includes("north") || key.includes("south") || key.includes("east") || key.includes("west"))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    if (data?.pocket) data["surroundings"] = filteredData;

    const postDistrict = {
      pageName: "LandSchedule",
      action: "LANDSCHEDULE",
      applicationNumber: applicantId,
      createdBy: userInfo?.id,
      updatedBy: userInfo?.id,
      LicenseDetails: {
        LandSchedule: {
          ...data,
          // LandScheduleDetails: modalData,
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

      const filterSurrounding = compactBlockB.filter((item) => item?.value == valueData?.separatedBy);

      setValue("separatedBy", { label: filterSurrounding?.[0]?.label, value: filterSurrounding?.[0]?.value });

      const data = purposeOptions?.data?.filter((item) => item?.value === stepData?.ApplicantPurpose?.purpose);
      const potientialData = getPotentialOptons?.data?.filter((item) => item?.value === stepData?.ApplicantPurpose?.potential);
      const typeLandData = typeOfLand?.data?.filter((item) => item?.value === stepData?.ApplicantPurpose?.typeLand);

      setValue("purpose", { label: data?.[0]?.label, value: data?.[0]?.value });
      setValue("potential", { label: potientialData?.[0]?.label, value: potientialData?.[0]?.value });
      setValue("typeLand", { label: typeLandData?.[0]?.label, value: typeLandData?.[0]?.value });
    }
  }, [stepData, purposeOptions, getPotentialOptons, typeOfLand]);

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
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, { headers });
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
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: token,
      },
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
          previousStatus: "PURPOSE",
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

  const handleKeepOnlyOne = () => {
    const keepIndex = 0; // Index of the array field you want to keep

    // Remove all fields except the one at keepIndex
    for (let i = fields.length - 1; i >= 0; i--) {
      if (i !== keepIndex) {
        remove(i);
      }
    }
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
                <Col>
                  <div className="row">
                    <div className="col col-12 ">
                      {/* <div>
                        <h2>
                          1.&nbsp; */}
                      {/* {`${t("NWL_APPLICANT_WHETHER_LICENCE_APPLIED_FOR_ADDITIONAL_AREA")}`} */}
                      {/* Whether licence applied for additional area ? */}
                      {/* <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                          <label htmlFor="licenseAppliedYes">
                            <input {...register("licenseApplied")} type="radio" value="Y" id="licenseAppliedYes" />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="licenseAppliedNo">
                            <input {...register("licenseApplied")} type="radio" value="N" id="licenseAppliedNo" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.licenseApplied && errors?.licenseApplied?.message}
                          </h3>
                        </h2>
                      </div> */}

                      {watch("licenseApplied") === "Y" && (
                        <div>
                          <div className="row">
                            <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                              <label>
                                <h2>
                                  {`${t("NWL_APPLICANT_LICENCE_NUMBER_OF_PARENT_LICENCE")}`}

                                  {/* Licence No. of Parent Licence  */}
                                  <span style={{ color: "red" }}>*</span>
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
                            <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                              <label>
                                <h2>
                                  {`${t("NWL_APPLICANT_DEVELOMENT_PLAN_ADDICATION_PLAN")}`}
                                  {/* Development Plan */}
                                  <span style={{ color: "red" }}>*</span>
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
                            <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                              <label>
                                <h2>
                                  {`${t("NWL_APPLICANT_TYPE_OF_COLONY_ADDICATION_PLAN")}`}
                                  {/* Type of colony  */}
                                  <span style={{ color: "red" }}>*</span>
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
                          </div>

                          <div className="row mt-4">
                            <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                              <label>
                                <h2>
                                  {`${t("NWL_APPLICANT_AREA_OF_PARENT_LICENCE_IN_ACRES_ADDICATION_PLAN")}`}
                                  {/* Area of parent licence in acres  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <input type="number" className="form-control" {...register("areaOfParentLicenceAcres")} minLength={1} maxLength={20} />
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.areaOfParentLicenceAcres && errors?.areaOfParentLicenceAcres?.message}
                              </h3>
                            </div>
                            <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                              <h2>
                                {`${t("NWL_APPLICANT_VALIDITY_OF_PARENT_LICENCES_ADDICATION_PLAN")}`}
                                {/* Validity of parent licence  */}
                                <span style={{ color: "red" }}>*</span>
                                &nbsp;&nbsp;
                                <label htmlFor="validityYes">
                                  <input {...register("validity")} type="radio" value="Y" id="validityYes" />
                                  &nbsp;&nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="validityNo">
                                  <input {...register("validity")} type="radio" value="N" id="validityNo" />
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
                                      {`${t("NWL_APPLICANT_WHETHER_RENEWAL_LICENCES_FEE_SUBMITTED_ADDICATION_PLAN")}`}
                                      {/* Whether renewal licence fee submitted  */}
                                      <span style={{ color: "red" }}>*</span>
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
                            <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                              <label>
                                <h2>
                                  {`${t("NWL_APPLICANT_WHETHER_ANY_OTHER_REMARKS_ADDICATION_PLAN")}`}
                                  {/* Any Other Remark  */}
                                </h2>
                              </label>
                              <input type="text" {...register("specify")} className="form-control" pattern="[A-Za-z]+" />
                            </div>
                            <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                              <h2>
                                {`${t("NWL_APPLICANT_THIRD_PARTY_RIGHT_CREATED_ADDICATION_PLAN")}`}
                                {/* Third-party right created */}
                                <span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                              </h2>
                              <label htmlFor="thirdPartyYes">
                                <input {...register("thirdParty")} type="radio" value="Y" id="thirdPartyYes" />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="thirdPartyNo">
                                <input {...register("thirdParty")} type="radio" value="N" id="thirdPartyNo" />
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
                                        {`${t("NWL_UPLOAD_AFFIDAVIT_MGINATIONLIC")}`}
                                        {/* Upload affidavit  */}
                                        <span style={{ color: "red" }}>*</span>
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
                                      {`${t("NWL_WHETHER_PROJECT_IS_RERA_MGINATIONLIC")}`}
                                      {/* Whether Project is RERA registered */}
                                      <span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                                    </h2>

                                    <label htmlFor="reraRegisteredYes">
                                      <input {...register("reraRegistered")} type="radio" value="Y" id="reraRegisteredYes" />
                                      &nbsp; Yes &nbsp;&nbsp;
                                    </label>
                                    <label htmlFor="reraRegisteredNo">
                                      <input {...register("reraRegistered")} type="radio" value="N" id="reraRegisteredNo" />
                                      &nbsp; No &nbsp;&nbsp;
                                    </label>
                                    {watch("reraRegistered") === "Y" && (
                                      <div className="row ">
                                        <div className="col col-12">
                                          <label>
                                            <h6>
                                              {`${t("NWL_UPLOAD_RERA_REGISTRATION_MGINATIONLIC")}`}
                                              {/* Upload RERA registration */}
                                              <span style={{ color: "red" }}>*</span>
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
                                              {`${t("NWL_APPLICANT_AFFIDAVIT_MGINATIONLIC")}`}
                                              {/* Affidavit */}
                                              <span style={{ color: "red" }}>*</span>
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
                  <div className="row mt-2 mb-4">
                    <div className="col col-12 ">
                      {/* <div>
                        <h2>
                          {`${t("NWL_APPLICANT_WHETHER_LICENCE_APPLIED_UNDER_MIGRATION_POLICY")}`} */}
                      {/* Whether licence applied under Migration Policy ? */}
                      {/* <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                          <label htmlFor="migrationLicYes">
                            <input
                              {...register("migrationLic")}
                              type="radio"
                              value="Y"
                              id="migrationLicYes"
                              onClick={() => {
                                resetValues();
                                setSpecificTableData(null);
                                setmodal(true);
                              }}
                            />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="migrationLicNo">
                            <input {...register("migrationLic")} type="radio" value="N" id="migrationLicNo" />
                            &nbsp; No &nbsp;&nbsp;
                          </label>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.migrationLic && errors?.migrationLic?.message}
                          </h3>
                        </h2>
                      </div> */}
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
                  {/* <hr></hr> */}
                  <div className="mt-4">
                    <h4 className="mb-2">
                      {`${t("NWL_APPLICANT_ANY_ENCUMBRANCE_WITH_RESPECT_TO_FOLLOWING")}`}
                      {/* Any encumbrance with respect to following  */}
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                    <label htmlFor="encumburancer">
                      <input {...register("encumburance")} type="radio" value="rehan" id="encumburancer" />
                      &nbsp;&nbsp; Rehan / Mortgage &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburancep">
                      <input {...register("encumburance")} type="radio" value="patta" id="encumburancep" />
                      &nbsp;&nbsp; Patta/Lease &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburanceg">
                      <input {...register("encumburance")} type="radio" value="gair" id="encumburanceg" />
                      &nbsp;&nbsp; Gairmarusi &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburancel">
                      <input {...register("encumburance")} type="radio" value="loan" id="encumburancel" />
                      &nbsp;&nbsp; Loan &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburancea">
                      <input {...register("encumburance")} type="radio" value="anyOther" id="encumburancea" />
                      &nbsp;&nbsp; Any Other &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburancen">
                      <input {...register("encumburance")} type="radio" value="none" id="encumburancen" />
                      &nbsp;&nbsp; None &nbsp;&nbsp;
                    </label>
                    <div className="row ">
                      {watch("encumburance") === "rehan" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark  */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("rehanRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.rehanRemark && errors?.rehanRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6" style={{ display: "flex", alignSelf: "end" }}>
                            {`${t("NWL_APPLICANT_DOCUMENT_UPLOAD")}`}
                            {/* Document Upload */}
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
                        </div>
                      )}
                      {watch("encumburance") === "patta" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("pattaRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.pattaRemark && errors?.pattaRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6" style={{ display: "flex", alignSelf: "end" }}>
                            {`${t("NWL_APPLICANT_DOCUMENT_UPLOAD")}`}
                            {/* Document Upload  */}
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
                        </div>
                      )}
                      {watch("encumburance") === "gair" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark  */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("gairRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.gairRemark && errors?.gairRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6" style={{ display: "flex", alignSelf: "end" }}>
                            {`${t("NWL_APPLICANT_DOCUMENT_UPLOAD")}`}
                            {/* Document Upload  */}
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
                        </div>
                      )}
                      {watch("encumburance") === "loan" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark  */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("loanRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.loanRemark && errors?.loanRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6" style={{ display: "flex", alignSelf: "end" }}>
                            {`${t("NWL_APPLICANT_DOCUMENT_UPLOAD")}`}
                            {/* Document Upload  */}
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
                        </div>
                      )}
                      {watch("encumburance") === "anyOther" && (
                        <div className="row ">
                          <div className="col col-4">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark  */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("anyOtherRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.anyOtherRemark && errors?.anyOtherRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6" style={{ display: "flex", alignSelf: "end" }}>
                            {`${t("NWL_APPLICANT_DOCUMENT_UPLOAD")}`}
                            {/* Document Upload  */}
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
                        </div>
                      )}
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
                      {`${t("NWL_APPLICANT_EXISTING_LITIGATION_IF_ANY_CONCERNING_APPLIED_LAND")}`}
                      {/* Existing litigation, if any, concerning applied land including co-sharers and collaborator. */}
                      <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="litigationYes">
                        <input {...register("litigation")} type="radio" value="Y" id="litigationYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="litigationNo">
                        <input {...register("litigation")} type="radio" value="N" id="litigationNo" />
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
                            {`${t("NWL_APPLICANT_COURT_ORDERS_IF_ANY_AFFECTING_APPLIED_LAND")}`}
                            {/* Court orders, if any, affecting applied land. */}
                            <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                            <label htmlFor="courtYes">
                              <input {...register("court")} type="radio" value="Y" id="courtYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="courtNo">
                              <input {...register("court")} type="radio" value="N" id="courtNo" />
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
                                      {`${t("NWL_APPLICANT_REMARKCASE_NO")}`}
                                      {/* Remark/Case No. */}
                                      <span style={{ color: "red" }}>*</span>
                                    </h2>{" "}
                                  </label>
                                  <input type="text" className="form-control" {...register("courtyCaseNo")} />
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.courtyCaseNo && errors?.courtyCaseNo?.message}
                                  </h3>
                                </div>
                                <div className="col col-6">
                                  <h2></h2>
                                  {`${t("NWL_APPLICANT_DOCUMENT_UPLOAD")}`}
                                  {/* Document Upload  */}
                                  <span style={{ color: "red" }}>*</span>
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
                      {`${t("NWL_APPLICANT_ANY_INSOLVENCY_LIQUIDATION_PROCEESSDING_AGAINST_THE_LAND_OWING")}`}
                      {/* Any insolvency/liquidation proceedings against the Land Owing Company/Developer Company. */}
                      <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="insolvencyYes">
                        <input {...register("insolvency")} type="radio" value="Y" id="insolvencyYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="insolvencyNo">
                        <input {...register("insolvency")} type="radio" value="N" id="insolvencyNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.insolvency && errors?.insolvency?.message}
                      </h3>
                    </h6>
                  </div>
                  <div className="row mb-5">
                    <div className="col col-12 ">
                      {watch("insolvency") === "Y" && (
                        <div className="row ">
                          <div className="col col-6">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_ANY_INSOLVENCY_Y_REMARKS_LAND_OWING")}`}
                                {/* Remark  */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("insolvencyRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.insolvencyRemark && errors?.insolvencyRemark?.message}
                            </h3>
                          </div>
                          <div className="col col-6">
                            <h2></h2>
                            {`${t("NWL_APPLICANT_ANY_INSOLVENCY_Y_DOWNLOAD_DOCUMENT_LAND_OWING")}`}
                            {/* Document Upload */}
                            <span style={{ color: "red" }}>*</span>
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
                  <hr />
                  <h5 className="mt-4">3. Shajra Plan</h5>
                  <div className="row mt-5">
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-4">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_AS_PER_APPLIED_LAND_SHAJRA_PLAN")}`}
                        {/* As per applied land (Yes/No) */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="appliedLandYes">
                        <input {...register("appliedLand")} type="radio" value="Y" id="appliedLandYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="appliedLandNo">
                        <input {...register("appliedLand")} type="radio" value="N" id="appliedLandNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.appliedLand && errors?.appliedLand?.message}
                      </h3>
                      {watch("appliedLand") === "Y" && (
                        <div className="row ">
                          <div className="col col-12 mb-3 mt-3">
                            <h2>
                              &nbsp;
                              {`${t("NWL_ORIGINAL_SHAJRA_PLAN")}`}
                              {/* Original Shajra Plan by Patwari */}
                            </h2>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <label htmlFor="patwariOriginalShajraPlanyes">
                              <input {...register("patwariOriginalShajraPlan")} type="radio" value="Y" id="patwariOriginalShajraPlanyes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="patwariOriginalShajraPlanno">
                              <input {...register("patwariOriginalShajraPlan")} type="radio" value="N" id="patwariOriginalShajraPlanno" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                          <div className="col col-12 mb-3">
                            <h2>
                              &nbsp;
                              {`${t("NWL_SHAJRA_PLAN_OUTER_BOUNDARY")}`}
                              {/* Shajra Plan Outer Boundary Marked for Applied Land */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <label htmlFor="shajraPlanOuterBoundaryYes">
                              <input {...register("shajraPlanOuterBoundary")} type="radio" value="Y" id="shajraPlanOuterBoundaryYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="shajraPlanOuterBoundaryNo">
                              <input {...register("shajraPlanOuterBoundary")} type="radio" value="N" id="shajraPlanOuterBoundaryNo" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                        </div>
                      )}
                      {watch("appliedLand") === "N" && (
                        <div className="row ">
                          <div className="col col-12 mb-3">
                            {`${t("NWL_APPLICANT_AS_PER_APPLIED_LAND_N_DOWNLOAD_DOCUMENT_SHAJRA_PLAN")}`}
                            {/* Document Upload  */}
                            <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
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
                          <div className="col col-12 mb-3">
                            <h2>
                              &nbsp;
                              {`${t("NWL_ORIGINAL_SHAJRA_PLAN")}`}
                              {/* Original Shajra Plan by Patwari */}
                            </h2>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <label htmlFor="patwariOriginalShajraPlanyes">
                              <input {...register("patwariOriginalShajraPlan")} type="radio" value="Y" id="patwariOriginalShajraPlanyes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="patwariOriginalShajraPlanno">
                              <input {...register("patwariOriginalShajraPlan")} type="radio" value="N" id="patwariOriginalShajraPlanno" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                          <div className="col col-12 mb-3">
                            <h2>
                              &nbsp;
                              {`${t("NWL_SHAJRA_PLAN_OUTER_BOUNDARY")}`}
                              {/* Shajra Plan Outer Boundary Marked for Applied Land */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <label htmlFor="shajraPlanOuterBoundaryYes">
                              <input {...register("shajraPlanOuterBoundary")} type="radio" value="Y" id="shajraPlanOuterBoundaryYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="shajraPlanOuterBoundaryNo">
                              <input {...register("shajraPlanOuterBoundary")} type="radio" value="N" id="shajraPlanOuterBoundaryNo" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.appliedLand && errors?.appliedLand?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_REVENUE_RASTA_SHAJRA_PLAN")}`}
                        {/* Revenue rasta */}
                        <span style={{ color: "red" }}>*</span>
                        <Tooltip title="If any revenue rasta abuts to the applied site ?">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="revenueRastaYes">
                        <input {...register("revenueRasta")} type="radio" value="Y" id="revenueRastaYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="revenueRastaNo">
                        <input {...register("revenueRasta")} type="radio" value="N" id="revenueRastaNo" />
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
                                {`${t("NWL_APPLICANT_REVENUE_RASTA_Y_UNCONSOLIDATED_SHAJRA_PLAN")}`}
                                {/* Unconsolidated */}
                                <span style={{ color: "red" }}>*</span>&nbsp;
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
                          {/* <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.waterCourse && errors?.waterCourse?.message}
                          </h3> */}
                        </div>
                      )}
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp; (c) {`${t("NWL_APPLICANT_WATERCOURSE_SHAJRA_PLAN")}`}
                        {/* Watercourse */}
                        <span style={{ color: "red" }}>*</span>
                        <Tooltip title="Watercourse running along boundary through the applied site ?">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="waterCourseYes">
                        <input {...register("waterCourse")} type="radio" value="Y" id="waterCourseYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="waterCourseNo">
                        <input {...register("waterCourse")} type="radio" value="N" id="waterCourseNo" />
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
                                {`${t("NWL_APPLICANT_WATERCOURSE_Y_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark */}
                                <span style={{ color: "red" }}>*</span>
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
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <label>
                        <h2>
                          {`${t("NWL_APPLICANT_WHETHER_IN_COMPACT_BLOCK_SHAJRA_PLAN")}`}
                          {/* Whether in Compact Block */}
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>

                      <label htmlFor="whetherCompactBlockYes">
                        <input {...register("whetherCompactBlock")} type="radio" value="Y" id="whetherCompactBlockYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="whetherCompactBlockNo">
                        <input {...register("whetherCompactBlock")} type="radio" value="N" id="whetherCompactBlockNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>

                      {watch("whetherCompactBlock") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                {/* {`${t("NWL_APPLICANT_REVENUE_RASTA_Y_UNCONSOLIDATED_SHAJRA_PLAN")}`} */}
                                Separated by
                                <span style={{ color: "red" }}>*</span>&nbsp;
                              </h2>
                            </label>
                            <ReactMultiSelect
                              control={control}
                              name="separatedBy"
                              placeholder="separated by"
                              data={compactBlockA}
                              labels="Separated by"
                            />
                          </div>
                        </div>
                      )}
                      {watch("whetherCompactBlock") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                {/* {`${t("NWL_APPLICANT_REVENUE_RASTA_Y_UNCONSOLIDATED_SHAJRA_PLAN")}`} */}
                                Separated by
                                <span style={{ color: "red" }}>*</span>&nbsp;
                              </h2>
                            </label>
                            <ReactMultiSelect
                              control={control}
                              name="separatedBy"
                              placeholder="separated by"
                              data={compactBlockB}
                              labels="Separated by"
                            />
                          </div>
                          {watch("separatedBy")?.value && (
                            <div className="col col-4">
                              <label>
                                <h2>Pocket</h2>
                              </label>
                              <Form.Control
                                type="number"
                                className="form-control"
                                placeholder=""
                                {...register("pocket")}
                                onChange={(e) => {
                                  console.log(e?.target?.value);
                                  if (!e?.target?.value) {
                                    handleKeepOnlyOne();
                                  }
                                  let delay;
                                  delay = setTimeout(() => {
                                    handleFunction(e?.target?.value);
                                  }, 500);
                                  return () => clearTimeout(delay);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_ACQUISITION_STATUS_SHAJRA_PLAN")}`}
                        {/* Acquisition status */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="acquistionYes">
                        <input {...register("acquistion")} type="radio" value="Y" id="acquistionYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="acquistionNo">
                        <input {...register("acquistion")} type="radio" value="N" id="acquistionNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.acquistion && errors?.acquistion?.message}
                      </h3>
                      {watch("acquistion") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_ACQUISITION_STATUS_Y_DATE_SECTION4_SHAJRA_PLAN")}`}
                                {/* Date of section 4 notification */}
                              </h2>
                            </label>
                            <input
                              type="date"
                              {...register("sectionFour")}
                              className="form-control"
                              min="1900-01-01"
                              max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                            />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.sectionFour && errors?.sectionFour?.message}
                            </h3>
                          </div>
                          <div className="col col-12">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_ACQUISITION_STATUS_Y_DATE_SECTION6_SHAJRA_PLAN")}`}
                                {/* Date of section 6 notification */}
                              </h2>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              {...register("sectionSix")}
                              min="1900-01-01"
                              max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear()))}
                            />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.sectionSix && errors?.sectionSix?.message}
                            </h3>
                          </div>
                          <div className="col col-12">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_ACQUISITION_STATUS_Y_DATE_AWAED_SHAJRA_PLAN")}`}
                                {/* Date of Award */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              {...register("rewardDate")}
                              min="1900-01-01"
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
                  {watch("acquistion") === "Y" && (
                    <div className="row mt-5">
                      <div className="col col-12">
                        <label>
                          <h2>
                            &nbsp;&nbsp;
                            {`${t("NWL_APPLICANT_WHETER_LAND_RELEASED_EXCLUDED_FROM_AQUSITION_DATE_AWAED_SHAJRA_PLAN")}`}
                            {/* Whether Land Released/Excluded from aqusition proceeding. */}
                            <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                          </h2>
                        </label>
                        <label htmlFor="orderUploadYes">
                          <input {...register("orderUpload")} type="radio" value="Y" id="orderUploadYes" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="orderUploadNo">
                          <input {...register("orderUpload")} type="radio" value="N" id="orderUploadNo" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.orderUpload && errors?.orderUpload?.message}
                        </h3>
                        {watch("orderUpload") === "Y" && (
                          <div className="row ">
                            <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                              <h2>
                                {`${t("NWL_APPLICANT_AQUSITION_Y_WHETER_LAND_COMPENSATION_SHAJRA_PLAN")}`}
                                {/* Whether land compensation */}
                                <Tooltip title="Whether land compensation received ">
                                  <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                                </Tooltip>
                              </h2>

                              <label htmlFor="landCompensationYes">
                                <input {...register("landCompensation")} type="radio" value="Y" id="landCompensationYes" />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="landCompensationNo">
                                <input {...register("landCompensation")} type="radio" value="N" id="landCompensationNo" />
                                &nbsp; No &nbsp;&nbsp;
                              </label>
                            </div>
                            <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                              <label>
                                <h2>
                                  {`${t("NWL_APPLICANT_AQUSITION_Y_STATUS_OF_RELEASE_SHAJRA_PLAN")}`}
                                  {/* Status of release */}
                                </h2>
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
                            <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                              <label>
                                <h2>
                                  {`${t("NWL_APPLICANT_AQUSITION_Y_DATE_OF_RELEASE_SHAJRA_PLAN")}`}
                                  {/* Date of Release */}
                                </h2>{" "}
                              </label>
                              <input type="date" {...register("releaseDate")} className="form-control" min="1900-01-01" />
                              <div className="invalid-feedback">{errors?.releaseDate?.message}</div>
                            </div>
                            <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                              <label htmlFor="siteDetail">
                                <h2>
                                  {`${t("NWL_APPLICANT_AQUSITION_Y_SITE_DETAILS_SHAJRA_PLAN")}`}
                                  {/* Site Details */}
                                </h2>
                              </label>
                              <input type="text" {...register("siteDetail")} className="form-control" minLength={2} maxLength={99} />
                              <div className="invalid-feedback">{errors?.siteDetail?.message}</div>
                            </div>
                            <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                              <h6 style={{ display: "flex" }}>
                                {`${t("NWL_APPLICANT_AQUSITION_Y_COPY_OF_RELEASE_ORDER_SHAJRA_PLAN")}`}
                                {/* Copy of release order  */}
                                <span style={{ color: "red" }}>*</span>
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
                            <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                              <h2>
                                {`${t("NWL_APPLICANT_WHETHER_Y_WHETER_LITIGATION_REGARDING_RELEASE_OF_LAND_SHAJRA_PLAN")}`}
                                {/* whether litigation regarding release of Land */}
                              </h2>
                              <label htmlFor="litigationRegardingLandReleaseYes">
                                <input
                                  {...register("litigationRegardingLandRelease")}
                                  type="radio"
                                  value="Y"
                                  id="litigationRegardingLandReleaseYes"
                                />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="litigationRegardingLandReleaseNo">
                                <input {...register("litigationRegardingLandRelease")} type="radio" value="N" id="litigationRegardingLandReleaseNo" />
                                &nbsp; No &nbsp;&nbsp;
                              </label>
                            </div>
                            {watch("litigationRegardingLandRelease") === "Y" && (
                              // should be alpha numeric with 15 characters
                              <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                                <div>
                                  <label>
                                    <h2>
                                      {`${t("NWL_APPLICANT_AQUSITION_Y_CWP_SLP_NUMBER_SHAJRA_PLAN")}`}
                                      {/* CWP/SLP Number */}
                                    </h2>
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
                  <div className="row mt-5">
                    <div className="col col-12">
                      <h2>
                        {`${t("NWL_APPLICANT_DETAILS_OF_EXISTING_APPROACH_AS_PER_POLICY_SHAJRA_PLAN")}`}
                        {/* Details of existing approach as per policy dated 20-10-20. */}
                        <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                        <label className="mt-2" htmlFor="siteApproachableC">
                          <input {...register("siteApproachable")} type="radio" value="Y" id="siteApproachableC" />
                          &nbsp; Category-I approach &nbsp;&nbsp;
                        </label>
                        <label className="mt-2" htmlFor="siteApproachableD">
                          <input {...register("siteApproachable")} type="radio" value="N" id="siteApproachableD" />
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
                              {`${t("NWL_APPLICANT_APPROACH_AVAILABLE_FROM_MINIMUN_KARAM_SHAJRA_PLAN")}`}
                              {/* Approach available from minimum 4 karam (22 ft) wide revenue rasta. */}
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
                        &nbsp;&nbsp;
                        <div className="row">
                          <div class="col-sm-6 text-left">
                            <h2>
                              {`${t("NWL_APPLICANT_APPROACH_AVAILABLE_FROM_MINIMUN_FEET_WIDE_REVENUE_SHAJRA_PLAN")}`}
                              {/* Approach available from minimum 11 feet wide revenue rasta and applied site abuts acquired alignment of
                              the sector road and there is no stay regarding construction on the land falling under the abutting sector road. */}
                              <span style={{ color: "red" }}>*</span>{" "}
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="minimumApproachElevenYes">
                              <input {...register("minimumApproachEleven")} type="radio" value="Y" id="minimumApproachElevenYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="minimumApproachElevenNo">
                              <input {...register("minimumApproachEleven")} type="radio" value="N" id="minimumApproachElevenNo" />
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
                              {`${t("NWL_APPLICANT_APPLIED_SITE__ABOUTS_ALREADY_CONSTRUCTED_SECTOR_ROAD_SHAJRA_PLAN")}`}
                              {/* Applied site Abuts already constructed sector road or internal circulation road of approved sectoral plan
                              (of min. 18m/24m width as the case may be) provided its entire stretch required for approach is licenced and is further
                              leading upto atleast 4 karam wide revenue rasta. */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="alreadyConstructedSectoryes">
                              <input {...register("alreadyConstructedSector")} type="radio" value="Y" id="alreadyConstructedSectoryes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="alreadyConstructedSectorno">
                              <input {...register("alreadyConstructedSector")} type="radio" value="N" id="alreadyConstructedSectorno" />
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
                              {`${t("NWL_APPLICANT_APPLIED_LAND_IS_ACCESSIBLE_FROM_A_MINIMUN_THROUGH_ADJOINING_SHAJRA_PLAN")}`}
                              {/* Applied land is accessible from a minimum 4 karam wide rasta through adjoining own land of the applicant
                              (but not applied for licence). */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="adjoiningOwnLandYes">
                              <input {...register("adjoiningOwnLand")} type="radio" value="Y" id="adjoiningOwnLandYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="adjoiningOwnLandNo">
                              <input {...register("adjoiningOwnLand")} type="radio" value="N" id="adjoiningOwnLandNo" />
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
                                  {`${t("NWL_APPLICANT_D_D1_IF_APPLICABLE_WHETHER_THE_APPLICATION_HAS_DONATED_SHAJRA_PLAN")}`}
                                  {/* If applicable, whether the applicant has donated at least 4 karam wide strip from its adjoining own
                                  land in favour of the Gram Panchayat/Municipality, in order to connect the applied site to existing 4 karam rasta?. */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </div>
                              <div class="col-sm-6 text-right">
                                <label htmlFor="applicantHasDonatedYes">
                                  <input {...register("applicantHasDonated")} type="radio" value="Y" id="applicantHasDonatedYes" />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="applicantHasDonatedNo">
                                  <input {...register("applicantHasDonated")} type="radio" value="N" id="applicantHasDonatedNo" />
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
                                      {`${t("NWL_APPLICANT_D_D1_IF_Y_COPY_OF_GIFT_DEED_SHAJRA_PLAN")}`}
                                      {/* Upload copy of Gift Deed/ Hibbanama */}
                                      <span style={{ color: "red" }}>*</span>
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
                              &nbsp;&nbsp;
                              {`${t("NWL_APPLICANT_E_APPLIED_LAND_IS_ACCESSIBLE_FROM_MINIMUN_KARAM_SHAJRA_PLAN")}`}
                              {/* Applied land is accessible from a minimum 4 karam wide rasta through adjoining other’s land */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="adjoiningOthersLandYes">
                              <input {...register("adjoiningOthersLand")} type="radio" value="Y" id="adjoiningOthersLandYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="adjoiningOthersLandNo">
                              <input {...register("adjoiningOthersLand")} type="radio" value="N" id="adjoiningOthersLandNo" />
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
                                  &nbsp;&nbsp;
                                  {`${t("NWL_APPLICANT_E_Y_E1_WHETHER_THE_LAND-OWNER_OF_THE_ADJOINING_DONATED_KARAM_SHAJRA_PLAN")}`}
                                  {/* whether the land-owner of the adjoining land has donated at least 4 karam wide strip of land to the
                                  Gram Panchayat/Municipality, in a manner that the applied site gets connected to existing public rasta of atleast 4
                                  karam width?. */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </div>
                              <div class="col-sm-6 text-right">
                                <label htmlFor="landOwnerDonatedYes">
                                  <input {...register("landOwnerDonated")} type="radio" value="Y" id="landOwnerDonatedYes" />
                                  &nbsp; Yes &nbsp;&nbsp;
                                </label>
                                <label htmlFor="landOwnerDonatedNo">
                                  <input {...register("landOwnerDonated")} type="radio" value="N" id="landOwnerDonatedNo" />
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
                                      {`${t("NWL_APPLICANT_E_E1_IF_Y_COPY_OF_GIFT_DEED_SHAJRA_PLAN")}`}
                                      {/* Upload copy of Gift Deed/ Hibbanama  */}
                                      <span style={{ color: "red" }}>*</span>
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
                              <h2>
                                &nbsp;&nbsp;
                                {`${t("NWL_APPLICANT_N_A_ENTER_WIDTH_IN_METERS_SHAJRA_PLAN")}`}
                                {/* Enter Width in Meters */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                          </div>
                          <div class="col-sm-3 text-right">
                            <input type="number" {...register("constructedRowWidth")} className="form-control" />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.constructedRowWidth && errors?.constructedRowWidth?.message}
                            </h3>
                          </div>
                        </div>
                        &nbsp;&nbsp;
                        <div className="row">
                          <div class="col-sm-6 text-left">
                            <h2>
                              &nbsp;&nbsp;
                              {`${t("NWL_APPLICANT_N_B_WHETHER_IRREVOCABLE_CONSENT_FROM_SUCH_DEVELOPER_COLONIZER_SHAJRA_PLAN")}`}
                              {/* Whether irrevocable consent from such developer/ colonizer for uninterrupted usage of such internal road
                              for the purpose of development of the colony by the applicant or by its agencies and for usage by its allottees
                              submitted */}
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="irrevocableConsentYes">
                              <input {...register("irrevocableConsent")} type="radio" value="Y" id="irrevocableConsentYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="irrevocableConsentNo">
                              <input {...register("irrevocableConsent")} type="radio" value="N" id="irrevocableConsentNo" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.irrevocableConsent && errors?.irrevocableConsent?.message}
                          </h3>
                          {watch("irrevocableConsent") === "Y" && (
                            <div className="col col-3 mt-3">
                              <h2 style={{ display: "flex" }}>
                                {`${t("NWL_APPLICANT_UPLOAD_IRREVOCABLE_CONSENT")}`}
                                {/* Upload irrevocable consent  */}
                                <span style={{ color: "red" }}>*</span>
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
                            <h2>
                              &nbsp;&nbsp;
                              {`${t("NWL_APPLICANT_N_C_ACCESS_FROM_NH_SR_SHAJRA_PLAN")}`}
                              {/* Access from NH/SR */}
                            </h2>
                          </div>
                          <div class="col-sm-6 text-right">
                            <label htmlFor="NHSRAccessYes">
                              <input {...register("NHSRAccess")} type="radio" value="Y" id="NHSRAccessYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="NHSRAccessNo">
                              <input {...register("NHSRAccess")} type="radio" value="N" id="NHSRAccessNo" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                          {watch("NHSRAccess") === "Y" && (
                            <div className="col col-3 mt-3">
                              <h2 style={{ display: "flex" }}>
                                {`${t("NWL_APPLICANT_UPLOAD_ACCESS_PERMISSION")}`}
                                {/* Upload access permission from competent authority */}
                              </h2>
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
                      <h2>(i)&nbsp;&nbsp; Details of proposed approach.</h2>
                    </div>
                    <div className="ml-4">
                      <h2>
                        (1)&nbsp;&nbsp;
                        {`${t("NWL_APPLICANT_N_I_SITE_APPROACHABLE_FROM_PROPOSED_SECTOR_ROAD_SHAJRA_PLAN")}`}
                        {/*  Site approachable from proposed sector road/ Development Plan Road. */}
                        &nbsp;&nbsp;
                        <label htmlFor="approachFromProposedSectorYes">
                          <input {...register("approachFromProposedSector")} type="radio" value="Y" id="approachFromProposedSectorYes" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="approachFromProposedSectorNo">
                          <input {...register("approachFromProposedSector")} type="radio" value="N" id="approachFromProposedSectorNo" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                      </h2>
                      {watch("approachFromProposedSector") === "Y" && (
                        <div>
                          <div className="col col-5">
                            <label>
                              &nbsp;&nbsp;
                              {`${t("NWL_APPLICANT_N_ENTER_WIDTH_IN_METERS_SHAJRA_PLAN")}`}
                              {/* Enter Width in Meters */}
                            </label>
                            <input type="number" {...register("sectorAndDevelopmentWidth")} className="form-control" />
                          </div>
                          <h2>
                            &nbsp;&nbsp;
                            {`${t("NWL_APPLICANT_N_B_WHETHER_ACQUIRED_SHAJRA_PLAN")}`}
                            {/* Whether acquired? */}
                            &nbsp;&nbsp;
                            <label htmlFor="whetherAcquiredYes">
                              <input {...register("whetherAcquired")} type="radio" value="Y" id="whetherAcquiredYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="whetherAcquiredNo">
                              <input {...register("whetherAcquired")} type="radio" value="N" id="whetherAcquiredNo" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                          <h2>
                            &nbsp;&nbsp;
                            {`${t("NWL_APPLICANT_N_C_WHETHER_CONSTRUCTED_SHAJRA_PLAN")}`}
                            {/* Whether constructed?  */}
                            &nbsp;&nbsp;
                            <label htmlFor="whetherConstructedYes">
                              <input {...register("whetherConstructed")} type="radio" value="Y" id="whetherConstructedYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="whetherConstructedNo">
                              <input {...register("whetherConstructed")} type="radio" value="N" id="whetherConstructedNo" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                          <h2>
                            &nbsp;&nbsp;
                            {`${t("NWL_APPLICANT_N_D_WHETHER_SERVICE_ROAD_ALONG_SECTOR_ROAD_ACQURIED_SHAJRA_PLAN")}`}
                            {/* Whether Service road along sector road acquired?  */}
                            &nbsp;&nbsp;
                            <label htmlFor="serviceSectorRoadAcquiredYes">
                              <input {...register("serviceSectorRoadAcquired")} type="radio" value="Y" id="serviceSectorRoadAcquiredYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="serviceSectorRoadAcquiredNo">
                              <input {...register("serviceSectorRoadAcquired")} type="radio" value="N" id="serviceSectorRoadAcquiredNo" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                          <h2>
                            &nbsp;&nbsp;
                            {`${t("NWL_APPLICANT_N_D_WHETHER_SERVICE_ROAD_ALONG_E_SECTOR_ROAD_CONSTRUCTED_SHAJRA_PLAN")}`}
                            {/* Whether Service road along sector road constructed? */}
                            &nbsp;&nbsp;
                            <label htmlFor="serviceSectorRoadConstructedYes">
                              <input {...register("serviceSectorRoadConstructed")} type="radio" value="Y" id="serviceSectorRoadConstructedYes" />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="serviceSectorRoadConstructedNo">
                              <input {...register("serviceSectorRoadConstructed")} type="radio" value="N" id="serviceSectorRoadConstructedNo" />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 ml-4">
                      <h2>
                        &nbsp;&nbsp;
                        {`${t("NWL_APPLICANT_N_2_SITE_APPROACHABLE_FROM_INTERNAL_CIRCULATION_SECTORAL_ROAD_SHAJRA_PLAN")}`}
                        {/* Site approachable from internal circulation / sectoral plan road. */}
                        &nbsp;&nbsp;
                        <label htmlFor="approachFromInternalCirculationYes">
                          <input {...register("approachFromInternalCirculation")} type="radio" value="Y" id="approachFromInternalCirculationYes" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="approachFromInternalCirculationNo">
                          <input {...register("approachFromInternalCirculation")} type="radio" value="N" id="approachFromInternalCirculationNo" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                      </h2>
                      {watch("approachFromInternalCirculation") === "Y" && (
                        <div>
                          <div className="col col-3">
                            <label>
                              &nbsp;&nbsp;
                              {`${t("NWL_APPLICANT_N_2_SITE_APPROACHABLE_A_ENTER_WIDTH_IN_METERS_SHAJRA_PLAN")}`}
                              {/* Enter Width in Meters */}
                            </label>
                            <input type="number" {...register("internalAndSectoralWidth")} className="form-control" />
                          </div>
                          <h2>
                            &nbsp;&nbsp;
                            {`${t("NWL_APPLICANT_N_2_B_WHETHER_ACQUIRED_SHAJRA_PLAN")}`}
                            {/* Whether acquired?  */}
                            &nbsp;&nbsp;
                            <label htmlFor="whetherAcquiredForInternalCirculationYes">
                              <input
                                {...register("whetherAcquiredForInternalCirculation")}
                                type="radio"
                                value="Y"
                                id="whetherAcquiredForInternalCirculationYes"
                              />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="whetherAcquiredForInternalCirculationNo">
                              <input
                                {...register("whetherAcquiredForInternalCirculation")}
                                type="radio"
                                value="N"
                                id="whetherAcquiredForInternalCirculationNo"
                              />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
                          <h2>
                            &nbsp;&nbsp;
                            {`${t("NWL_APPLICANT_N_2_C_WHETHER_CONSTRUCTED_SHAJRA_PLAN")}`}
                            {/* Whether constructed? */}
                            &nbsp;&nbsp;
                            <label htmlFor="whetherConstructedForInternalCirculationYes">
                              <input
                                {...register("whetherConstructedForInternalCirculation")}
                                type="radio"
                                value="Y"
                                id="whetherConstructedForInternalCirculationYes"
                              />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="whetherConstructedForInternalCirculationNo">
                              <input
                                {...register("whetherConstructedForInternalCirculation")}
                                type="radio"
                                value="N"
                                id="whetherConstructedForInternalCirculationNo"
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
                          (j)&nbsp;&nbsp;
                          {`${t("NWL_APPLICANT_N_2_J_WHETHER_APPROACH_FROM_PARENT_LICENCE_SHAJRA_PLAN")}`}
                          {/* Whether approach from parent licence. */}
                          <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                          <label htmlFor="parentLicenceApproachYes">
                            <input {...register("parentLicenceApproach")} type="radio" value="Y" id="parentLicenceApproachYes" />
                            &nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="parentLicenceApproachNo">
                            <input {...register("parentLicenceApproach")} type="radio" value="N" id="parentLicenceApproachNo" />
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
                        &nbsp;&nbsp;
                        {`${t("NWL_APPLICANT_N_2_K_ANY_OTHER_TYPE_OF_EXISITING_APPROACH_AVAILABLE_SHAJRA_PLAN")}`}
                        {/* Any other type of existing approach available. */}
                        <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                        <label htmlFor="availableExistingApproachYes">
                          <input {...register("availableExistingApproach")} type="radio" value="Y" id="availableExistingApproachYes" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="availableExistingApproachNo">
                          <input {...register("availableExistingApproach")} type="radio" value="N" id="availableExistingApproachNo" />
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
                          <h2 style={{ display: "flex" }}>
                            {`${t("NWL_APPLICANT_DOCUMENT_UPLOAD")}`}
                            {/* Upload document */}
                          </h2>
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
                  <h4>
                    {`${t("NWL_APPLICANT_4_SITE_CONDITION_SHAJRA_PLAN")}`}
                    {/* Site condition */}
                  </h4>
                  <br></br>
                  <div className="row">
                    <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_4_A_VACANT_SHAJRA_PLAN")}`}
                        {/* Vacant */}
                        <span style={{ color: "red" }}>*</span>{" "}
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="vacantYes">
                        <input {...register("vacant")} type="radio" value="Y" id="vacantYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="vacantNo">
                        <input {...register("vacant")} type="radio" value="N" id="vacantNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.vacant && errors?.vacant?.message}
                      </h3>
                      {(watch("vacant") === "Y" || watch("vacant") === "N") && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_4_A_VACANT_REMARK_SHAJRA_PLAN")}`}
                                {/* Vacant Remark  */}
                                {watch("vacant") === "Y" && <span style={{ color: "red" }}>*</span>}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("vacantRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.vacantRemark && errors?.vacantRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_4_B_HT_LINE_SHAJRA_PLAN")}`}
                        {/* HT line  */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="HTLineYes">
                        <input {...register("ht")} type="radio" value="Y" id="HTLineYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="HTLineNo">
                        <input {...register("ht")} type="radio" value="N" id="HTLineNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.ht && errors?.ht?.message}
                      </h3>
                      {(watch("ht") === "Y" || watch("ht") === "N") && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_4_B_HT_REMARKS_SHAJRA_PLAN")}`}
                                {/* HT Line Remark  */}
                                {watch("ht") === "Y" && <span style={{ color: "red" }}>*</span>}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("htRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.htRemark && errors?.htRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_4_C_IOC_GAS_PIPELINE_SHAJRA_PLAN")}`}
                        {/* IOC Gas Pipeline  */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="IOCGasPipelineYes">
                        <input {...register("gas")} type="radio" value="Y" id="IOCGasPipelineYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="IOCGasPipelineNo">
                        <input {...register("gas")} type="radio" value="N" id="IOCGasPipelineNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.gas && errors?.gas?.message}
                      </h3>
                      {(watch("gas") === "Y" || watch("gas") === "N") && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              {`${t("NWL_APPLICANT_4_Y_IOC_REMARKS_SHAJRA_PLAN")}`}
                              {/* IOC Gas Pipeline Remark  */}
                              {watch("gas") === "Y" && <span style={{ color: "red" }}>*</span>}
                            </label>
                            <input type="text" className="form-control" {...register("gasRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.gasRemark && errors?.gasRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_4_D_NALLAH_SHAJRA_PLAN")}`}
                        {/* Nallah/drain */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="nallahYes">
                        <input {...register("nallah")} type="radio" value="Y" id="nallahYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="nallahNo">
                        <input {...register("nallah")} type="radio" value="N" id="nallahNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.nallah && errors?.nallah?.message}
                      </h3>
                      {(watch("nallah") === "Y" || watch("nallah") === "N") && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              {`${t("NWL_APPLICANT_4_D_Y_NALLAH_REMARKS_SHAJRA_PLAN")}`}
                              {/* Nallah Remark  */}
                              {watch("nallah") === "Y" && <span style={{ color: "red" }}>*</span>}
                            </label>
                            <input type="text" className="form-control" {...register("nallahRemark")} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.nallahRemark && errors?.nallahRemark?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_4_E_ANY_REVENUE_REVENUE_RASTA_ROAD_PASSING_THROUGH_PROPOSED_SITE_SHAJRA_PLAN")}`}
                        {/* Any revenue rasta  */}
                        <span style={{ color: "red" }}>*</span>
                        <Tooltip title="Any revenue rasta/road/bundh passing through proposed site (Yes/No)">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="roadYes">
                        <input {...register("road")} type="radio" value="Y" id="roadYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="roadNo">
                        <input {...register("road")} type="radio" value="N" id="roadNo" />
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
                                {`${t("NWL_APPLICANT_4_WIDTH_OF_REVENUE_RASTA_ROAD_SHAJRA_PLAN")}`}
                                {/* Width of Revenue rasta(in ft.) */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="number" className="form-control" {...register("roadWidth")} minLength={2} maxLength={20} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.roadWidth && errors?.roadWidth?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {(watch("road") === "Y" || watch("road") === "N") && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark */}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("roadRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_F_UTILITY_PERMIT_LINE_SHAJRA_PLAN")}`}
                        {/* Utility/Permit Line */}
                        <span style={{ color: "red" }}>*</span>
                        <Tooltip title="Whether any utility line passing through the site is incorporated/adjusted in the layout plan (Yes/No)">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="utilityLineYes">
                        <input {...register("utilityLine")} type="radio" value="Y" id="utilityLineYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="utilityLineNo">
                        <input {...register("utilityLine")} type="radio" value="N" id="utilityLineNo" />
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
                                {`${t("NWL_APPLICANT_F_Y_WIDTH_OF_ROW_SHAJRA_PLAN")}`}
                                {/* Width of Row (in ft.) */}
                                <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                              </h2>
                            </label>
                            <input type="number" className="form-control" {...register("utilityWidth")} minLength={2} maxLength={99} />
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.utilityWidth && errors?.utilityWidth?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                      {(watch("utilityLine") === "Y" || watch("utilityLine") === "N") && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark */}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("utilityRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-lg-4 col-md-6 col-sm-6 mb-2">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_G_COMPACT_BLOCK_SHAJRA_PLAN")}`}
                        {/* Compact Block */}
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="compactBlockYes">
                        <input {...register("compactBlock")} type="radio" value="Y" id="compactBlockYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="compactBlockNo">
                        <input {...register("compactBlock")} type="radio" value="N" id="compactBlockNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      {(watch("compactBlock") === "Y" || watch("compactBlock") === "N") && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark */}
                                {watch("compactBlock") === "Y" && <span style={{ color: "red" }}>*</span>}
                              </h2>
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
                  <div className="row">
                    <div className="col col-lg-5 col-md-6 col-sm-6 mb-2 mt-3">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_H_WHETHER_OTHERS_LAND_FALL_SHAJRA_PLAN")}`}
                        {/* Whether other land falls within the applied land */}
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="othersLandFallYes">
                        <input {...register("othersLandFall")} type="radio" value="Y" id="othersLandFallYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="othersLandFallNo">
                        <input {...register("othersLandFall")} type="radio" value="N" id="othersLandFallNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      {(watch("othersLandFall") === "Y" || watch("othersLandFall") === "N") && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_REMARKS_SHAJRA_PLAN")}`}
                                {/* Remark */}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("othersLandFallRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-12 mt-3">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_SURROUNDINGS_SHAJRA_PLAN")}`}
                        {/* Surroundings  */}
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </div>

                    {fields?.map((item, index) => (
                      <div key={item?.id}>
                        <div key={index} className="row mt-3">
                          <div className="col col-3">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_SURROUNDINGS_POCKET_NAME_SHAJRA_PLAN")}`}
                                {/* Pocket Name */}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register(`surroundingsObj.${index}.pocketName`)} />
                          </div>
                          <div className="col col-2">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_SURROUNDINGS_NORTH_SHAJRA_PLAN")}`}
                                {/* North */}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register(`surroundingsObj.${index}.north`)} />
                          </div>
                          <div className="col col-2">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_SURROUNDINGS_SOUTH_SHAJRA_PLAN")}`}
                                {/* South */}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register(`surroundingsObj.${index}.south`)} />
                          </div>
                          <div className="col col-2">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_SURROUNDINGS_EAST_SHAJRA_PLAN")}`}
                                {/* East */}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register(`surroundingsObj.${index}.east`)} />
                          </div>
                          <div className="col col-2">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_SURROUNDINGS_WEST_SHAJRA_PLAN")}`}
                                {/* West */}
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register(`surroundingsObj.${index}.west`)} />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="col col-lg-4 col-md-12 col-sm-12 mb-2 mt-4">
                      <h2>
                        &nbsp;
                        {`${t("NWL_APPLICANT_J_ANY_OTHERS_PASSING_THROUGH_SITE_SHAJRA_PLAN")}`}
                        {/* Any other feature passing through site */}
                      </h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="passingOtherFeatureYes">
                        <input {...register("passingOtherFeature")} type="radio" value="Y" id="passingOtherFeatureYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="passingOtherFeatureNo">
                        <input {...register("passingOtherFeature")} type="radio" value="N" id="passingOtherFeatureNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      {watch("passingOtherFeature") === "Y" && (
                        <div className="row ">
                          <div className="col col-lg-12 col-sm-6">
                            <label>
                              <h2>
                                {`${t("NWL_APPLICANT_DETAILS_THEREOF_SHAJRA_PLAN")}`}
                                {/* Remarks */}
                              </h2>
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
                  <h5>
                    5.
                    {`${t("NWL_APPLICANT_5_ENCLOSE_THE_FOLLOWING_DOCUMENTS_AS_ANNEXURES")}`}
                    {/* Enclose the following documents as Annexures */}
                    <span style={{ color: "#e47878", paddingLeft: "5px" }}>(Documents should be less than 25mb)</span>
                  </h5>
                  <br></br>
                  <div className="row">
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2 style={{ display: "flex" }}>
                        {`${t("NWL_APPLICANT_LAND_SCHEDULE")}`}
                        {/* Land schedule  */}
                        <span style={{ color: "red" }}>*</span>
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
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2 style={{ display: "flex" }}>
                        {`${t("NWL_APPLICANT_COPY_OF_MUTATIION")}`}
                        {/* Copy of Mutation  */}
                        <span style={{ color: "red" }}>*</span>{" "}
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
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2 style={{ display: "flex" }}>
                        {`${t("NWL_APPLICANT_COPY_OF_JAMABANDI")}`}
                        {/* Copy of Jamabandi  */}
                        <span style={{ color: "red" }}>*</span>
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
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2 style={{ display: "flex" }}>
                        {`${t("NWL_APPLICANT_DETAILS_OF_LEASE_PATTA")}`}
                        {/* Details of lease / patta */}
                      </h2>
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
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <label>
                        <h2 style={{ display: "flex" }}>
                          {`${t("NWL_APPLICANT_SALES_DEED_EXCHANGE_DEED")}`}
                          {/* Sale Deed/Exchange Deed */}
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
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <label>
                        <h2 style={{ display: "flex" }}>
                          {`${t("NWL_APPLICANT_COPY_OF_SPA_GPA_BOARD")}`}
                          {/* Copy of SPA/GPA/BR  */}
                          <span style={{ color: "red" }}>*</span>
                          <Tooltip title="Copy of SPA/GPA/Board Resolution to sign collaboration agreement">
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
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2 style={{ display: "flex" }}>
                        {`${t("NWL_APPLICANT_SHAJRA_PLAN_DOCUMENT")}`}
                        {/* Shajra Plan  */}
                        <span style={{ color: "red" }}>*</span>
                        <Tooltip title="Please select the file in .kml and pdf format">
                          <InfoIcon style={{ cursor: "pointer" }} color="primary"></InfoIcon>
                        </Tooltip>
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
                          // accept=".kml"
                          accept=".pdf, .kml"
                          onChange={(e) => {
                            var fileName = e?.target?.files[0]?.name;
                            var fileExtension = fileName?.split(".")?.pop();
                            if (fileExtension?.toLowerCase() == "kml" || fileExtension?.toLowerCase() == "pdf") {
                              getDocumentData(e?.target?.files[0], "copyOfShajraPlan");
                            } else {
                              setShowToastError({ label: "Please select given file format", error: true, success: false });
                            }
                          }}
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
                    <div className="col col-lg-3 col-md-6 col-sm-6 mb-2">
                      <h2 style={{ display: "flex" }}>
                        {`${t("NWL_ANY_OTHER_DOCUMENT")}`}
                        {/* Any other document  */}
                      </h2>
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
                      {`${t("NWL_APPLICANT_PREVIOUS_LICENCE_MGINATIONLIC")}`}
                      {/* Previous Licence Number  */}
                      <span style={{ color: "red" }}>*</span>
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
                      {`${t("NWL_APPLICANT_AREA_OF_PARENT_LICENCE_MGINATIONLIC")}`}
                      {/* Area of parent licence */}
                      <span style={{ color: "red" }}>*</span>
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
                      {`${t("NWL_APPLICANT_PURPOSE_OF_PAREMENT_LICENCE_MGINATIONLIC")}`}
                      {/* Purpose of parent licence  */}
                      <span style={{ color: "red" }}>*</span>
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
                    {`${t("NWL_APPLICANT_VALIDITY_OF_PARENT_LICENCE_MGINATIONLIC")}`}
                    {/* Validity of parent licence */}
                    <span style={{ color: "red" }}>*</span>
                  </b>
                  &nbsp;&nbsp;
                  <label htmlFor="validityYes">
                    <input {...register("validity")} type="radio" value="Y" id="validityYes" />
                    &nbsp;&nbsp; Yes &nbsp;&nbsp;
                  </label>
                  <label htmlFor="validityNo">
                    <input {...register("validity")} type="radio" value="N" id="validityNo" />
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
                            {`${t("NWL_APPLICANT_DATE_MGINATIONLIC")}`}
                            {/* Date */}
                            <span style={{ color: "red" }}>*</span>
                          </h2>
                        </label>
                        <Form.Control type="date" className="form-control" {...register("date")} min="1900-01-01" />
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
                          {`${t("NWL_WHETHER_RENEWAL_LICENCE_FEE_SUBMITTED_MGINATIONLIC")}`}
                          {/* Whether renewal licence fee submitted  */}
                          <span style={{ color: "red" }}>*</span>
                        </b>
                        &nbsp;&nbsp;
                        <label htmlFor="renewalLicenceFeeYes">
                          <input {...register("renewalLicenceFee")} type="radio" value="Y" id="renewalLicenceFeeYes" />
                          &nbsp;&nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="renewalLicenceFeeNo">
                          <input {...register("renewalLicenceFee")} type="radio" value="N" id="renewalLicenceFeeNo" />
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
                      {`${t("NWL_APPLICANT_AREA_APPLIED_UNDER_MGINATIONLIC")}`}
                      {/* Area applied under migration in acres */}
                      <span style={{ color: "red" }}>*</span>
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
                      {`${t("NWL_APPLICANT_APPLIED_KHASRS_NUMBER_GINATIONLIC")}`}
                      {/* Applied Khasra number */}
                      <span style={{ color: "red" }}>*</span>
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
                    {`${t("NWL_APPLICANT_AREA_LICENCE_MGINATIONLIC")}`}
                    {/* Area  */}
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </label>
                <input type="number" className="form-control" {...register("area")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.area && errors?.area?.message}
                </h3>
              </Col>
              <div className="col col-4">
                <h2>
                  {`${t("NWL_THIRD_PARTY_RIGHT_CREATED_MGINATIONLIC")}`}
                  {/* Third-party right created */}
                  <span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                </h2>
                <br></br>
                <label htmlFor="thirdPartyYes">
                  <input {...register("thirdParty")} type="radio" value="Y" id="thirdPartyYes" />
                  &nbsp; Yes &nbsp;&nbsp;
                </label>
                <label htmlFor="thirdPartyNo">
                  <input {...register("thirdParty")} type="radio" value="N" id="thirdPartyNo" />
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
                          {`${t("NWL_UPLOAD_AFFIDAVIT_MGINATIONLIC")}`}
                          {/* Upload affidavit  */}
                          <span style={{ color: "red" }}>*</span>
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
                        {`${t("NWL_WHETHER_PROJECT_IS_RERA_MGINATIONLIC")}`}
                        {/* Whether Project is RERA registered */}
                        <span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                      </h2>

                      <label htmlFor="reraRegisteredYes">
                        <input {...register("reraRegistered")} type="radio" value="Y" id="reraRegisteredYes" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="reraRegisteredNo">
                        <input {...register("reraRegistered")} type="radio" value="N" id="reraRegisteredNo" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      {watch("reraRegistered") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h6>
                                {`${t("NWL_UPLOAD_RERA_REGISTRATION_MGINATIONLIC")}`}
                                {/* Upload RERA registration  */}
                                <span style={{ color: "red" }}>*</span>
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
                                {`${t("NWL_APPLICANT_AFFIDAVIT_MGINATIONLIC")}`}
                                {/* Affidavit */}
                                <span style={{ color: "red" }}>*</span>
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
