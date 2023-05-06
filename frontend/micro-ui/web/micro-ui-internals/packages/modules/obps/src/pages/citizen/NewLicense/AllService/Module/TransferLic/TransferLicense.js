import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getDocShareholding } from "../../../docView/docView.help";
import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CusToaster from "../../../../../../components/Toaster";
import Spinner from "../../../../../../components/Loader";
import { useHistory } from "react-router-dom";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import { useTranslation } from "react-i18next";

const selectTypeData = [
  { label: "Complete", value: "complete" },
  { label: "Partial", value: "partial" },
];

const Transferlicence = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [showField, setShowField] = useState(false);
  const [getError, setError] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [open, setOpen] = useState(false);
  const [getId, setId] = useState("");
  const [getData, setData] = useState(null);
  const userInfo = Digit.UserService.getUser()?.info || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    resetField,
  } = useForm({});

  const getApplicationId = (url) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("id");
  };

  const id = getApplicationId(window.location.href);

  const transferLic = async (data) => {
    // data["selectLicence"] = data?.selectLicence?.label;
    data["selectType"] = data?.selectType?.value;
    const numberLic = data?.licenceNo;
    delete data?.licenceNo;
    setLoader(true);
    const token = window?.localStorage?.getItem("token");
    const postDistrict = {
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
      Transfer: {
        licenseNo: numberLic,
        action: "APPLY",
        tenantId: "hr",
        status: "apply",
        applicationNumber: id,
        id: getId,
        newAdditionalDetails: {
          selectLicence: data?.selectLicence?.label,
          validUpto: data?.validUpto,
          colonizerName: data?.colonizerName,
          // periodOfRenewal: "",
          colonyType: data?.colonyType,
          areaAcres: data?.areaAcres,
          sectorNo: data?.sectorNo,
          revenueEstate: data?.revenueEstate,
          developmentPlan: data?.developmentPlan,
          tehsil: data?.tehsil,
          district: data?.district,
        },
        TransferOfLicence: {
          ...data,
        },
      },
    };

    if (id) {
      try {
        const Resp = await axios.post("/tl-services/_TransferOfLicenseRequest/_update", postDistrict);
        setLoader(false);
        setApplicationNumber(Resp?.data?.transfer?.[0]?.applicationNumber);
        setOpen(true);
      } catch (error) {
        setError(error?.response?.data?.Errors[0]?.message);
        setLoader(false);
      }
    } else {
      try {
        const Resp = await axios.post("/tl-services/_TransferOfLicenseRequest/_create", postDistrict);
        setLoader(false);
        setApplicationNumber(Resp?.data?.transfer?.[0]?.applicationNumber);
        setOpen(true);
      } catch (error) {
        setError(error?.response?.data?.Errors[0]?.message);
        setLoader(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    history.push("/digit-ui/citizen");
  };

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

  const getTransferLicenceDetails = async (id) => {
    setLoader(true);
    const token = window?.localStorage?.getItem("token");
    const data = {
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
      const Resp = await axios.post(`/tl-services/_TransferOfLicenseRequest/_search?applicationNumber=${id}`, data);
      setLoader(false);
      const allData = Resp?.data?.transfer[0];
      setData(allData);
      const resData = Resp?.data?.transfer[0]?.additionalDetails;
      console.log(Resp?.data?.transfer[0]);
      setId(Resp?.data?.transfer[0]?.id);
      Object?.keys(resData)?.map((item) => {
        setValue(item, resData[item]);
      });
      setValue("selectType", { label: resData?.selectType, value: resData?.selectType });
      setValue("licenceNo", allData?.licenseNo);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  useEffect(() => {
    if (id) {
      getTransferLicenceDetails(id);
    }
  }, [id]);

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(transferLic)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
            {`${t("TL_TRANSFER_OF_LICENCE")}`}
            {/* Transfer of Licence */}
          </h4>
          <div className="card">
            <div className="row gy-3">
              <SearchLicenceComp
                watch={watch}
                register={register}
                control={control}
                setLoader={setLoader}
                errors={errors}
                setValue={setValue}
                resetField={resetField}
                getData={getData}
              />
              {/* <div className="col col-3">
                <h2 className="FormLable">
                  Licence No. <span style={{ color: "red" }}>*</span>
                </h2>
                <div style={{ display: "flex", placeItems: "center" }}>
                  <input type="text" className="form-control" placeholder="" {...register("licenceNo")} />
                  <div
                    style={{
                      background: "#024f9d",
                      color: "white",
                      borderRadius: "5px",
                      padding: " 5px 15px",
                      marginLeft: "10px",
                      cursor: "pointer",
                    }}
                    onClick={checkLicenceNumber}
                  >
                    Go
                  </div>
                </div>
              </div> */}
              <div className="col col-4">
                <h2 className="FormLable">
                  {`${t("TL_SELECT_TYPE")}`}
                  {/* Select Type (Complete or Partial) */}
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <ReactMultiSelect control={control} name="selectType" placeholder="Select Type" data={selectTypeData} labels="" />
              </div>
              {watch("selectType")?.value == "partial" && (
                <div className="col col-3">
                  <div className="">
                    <h2 className="FormLable">
                      {`${t("TL_AREA_IN_ACRES")}`}
                      {/* Area in Acres */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                    <input type="number" placeholder="" className="form-control" {...register("areaInAcres")} />
                  </div>
                </div>
              )}
              <div className="col col-7">
                <h2>
                  {`${t("TL_LICENCE_TRANSFERRED_FROM_LAND_OWN")}`}
                  {/* Have you transferred licence from licencee land owner in favor of collaborator without prior approval of competent authority */}
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <label htmlFor="licenceTransferredFromLandOwnyes">
                  &nbsp;&nbsp;
                  <input {...register("licenceTransferredFromLandOwn")} type="radio" value="yes" id="licenceTransferredFromLandOwnyes" /> &nbsp; Yes
                </label>
                <label htmlFor="licenceTransferredFromLandOwnno">
                  &nbsp;&nbsp;
                  <input {...register("licenceTransferredFromLandOwn")} type="radio" value="no" id="licenceTransferredFromLandOwnno" /> &nbsp; No
                </label>
              </div>
              <div className="col col-5">
                <h2>
                  {`${t("TL_TRANSFERRED_TITLE_OF_LAND")}`}
                  {/* Have you transferred title of land requiring amendment in land schedule without prior approval of competent authority */}
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <label htmlFor="transferredTitleOfLandyes">
                  &nbsp;&nbsp;
                  <input {...register("transferredTitleOfLand")} type="radio" value="yes" id="transferredTitleOfLandyes" /> &nbsp; Yes
                </label>
                <label htmlFor="transferredTitleOfLandno">
                  &nbsp;&nbsp;
                  <input {...register("transferredTitleOfLand")} type="radio" value="no" id="transferredTitleOfLandno" /> &nbsp; No
                </label>
              </div>

              <div className="col col-5">
                <h2>
                  {`${t("TL_CHANGE_OF_DEVELOPER")}`}
                  {/* Do you want to apply for Change of Developer */}
                  <span style={{ color: "red" }}>*</span>
                </h2>
                <label htmlFor="changeOfDeveloperyes">
                  &nbsp;&nbsp;
                  <input {...register("changeOfDeveloper")} type="radio" value="yes" id="changeOfDeveloperyes" /> &nbsp; Yes
                </label>
                <label htmlFor="changeOfDeveloperno">
                  &nbsp;&nbsp;
                  <input {...register("changeOfDeveloper")} type="radio" value="no" id="changeOfDeveloperno" /> &nbsp; No
                </label>
              </div>

              {showField && (
                <div className="col col-3">
                  <h2 className="FormLable">
                    {`${t("TL_AMOUNT")}`}
                    {/* Amount */}
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                  <input type="text" className="Inputcontrol" {...register("amount")} disabled />
                </div>
              )}
            </div>

            {(watch("selectType")?.value == "partial" || watch("selectType")?.value == "complete" || watch("changeOfDeveloper") == "yes") && (
              <div className="row-12">
                <div>
                  <div className="card">
                    <div class="bordere">
                      <div class="table-responsive">
                        <table class="table">
                          <thead>
                            <tr>
                              {/* <th scope="col">Sr.No</th> */}
                              <th scope="col">
                                {`${t("TL_FIELD_NAME")}`}
                                {/* Field Name */}
                              </th>
                              <th scope="col">
                                {`${t("TL_UPLOAD_DOCUMENTS")}`}
                                {/* Upload Documents */}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* for a,b */}
                            {(watch("selectType")?.value == "partial" || watch("selectType")?.value == "complete") && (
                              <tr>
                                {/* <th class="fw-normal">1</th> */}
                                <td>
                                  {`${t("TL_AFFIDAVIT_FOR_LICENCED_AREA")}`}
                                  {/* Affidavit regarding the creation of 3rd party right on the licenced area */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "affidavitForLicencedArea")}
                                      />
                                    </label>
                                    {watch("affidavitForLicencedArea") && (
                                      <a onClick={() => getDocShareholding(watch("affidavitForLicencedArea"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for a,b */}
                            {(watch("selectType")?.value == "partial" || watch("selectType")?.value == "complete") && (
                              <tr>
                                {/* <th class="fw-normal">2</th> */}
                                <td>
                                  {`${t("TL_COLONIZER_SEEKING_TRANSFER_LICENCE")}`}
                                  {/* The colonizer seeking transfer of whole licence/part licence shall submit self-certification along with a
                                  certificate of the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time
                                  of submission of application for transfer of licence */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "colonizerSeekingTransferLicence")}
                                      />
                                    </label>
                                    {watch("colonizerSeekingTransferLicence") && (
                                      <a
                                        onClick={() => getDocShareholding(watch("colonizerSeekingTransferLicence"), setLoader)}
                                        className="btn btn-sm "
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for c */}
                            {watch("changeOfDeveloper") == "yes" && (
                              <tr>
                                {/* <th class="fw-normal">3</th> */}
                                <td>
                                  {`${t("TL_CONSENT_LETTER_DOC")}`}
                                  {/* A consent letter from the ‘new entity for the proposed change along with a
                                  justification */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetterDoc")}
                                      />
                                    </label>
                                    {watch("consentLetterDoc") && (
                                      <a onClick={() => getDocShareholding(watch("consentLetterDoc"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for a,b,c */}
                            {(watch("selectType")?.value == "partial" ||
                              watch("selectType")?.value == "complete" ||
                              watch("changeOfDeveloper") == "yes") && (
                              <tr>
                                {/* <th class="fw-normal">4</th> */}
                                <td>
                                  {`${t("TL_BOARD_RESOLUTION_DOC")}`}
                                  {/* Board resolution of authorized signatory */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionDoc")}
                                      />
                                    </label>
                                    {watch("boardResolutionDoc") && (
                                      <a onClick={() => getDocShareholding(watch("boardResolutionDoc"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for a,b,c */}
                            {(watch("selectType")?.value == "partial" ||
                              watch("selectType")?.value == "complete" ||
                              watch("changeOfDeveloper") == "yes") && (
                              <tr>
                                {/* <th class="fw-normal">5</th> */}
                                <td>
                                  {`${t("TL_NO_OBJECTION_CERTIFICATE_FROM_THE_EXISTING")}`}
                                  {/* No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically
                                  designated for the purpose; as well as from the ‘land owner licencees’, in person (not through GPA/SPA assignees),
                                  to the proposed change/assignment. */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "noObjectionCertificate")}
                                      />
                                    </label>
                                    {watch("noObjectionCertificate") && (
                                      <a onClick={() => getDocShareholding(watch("noObjectionCertificate"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for c */}
                            {watch("changeOfDeveloper") == "yes" && (
                              <tr>
                                {/* <th class="fw-normal">6</th> */}
                                <td>
                                  {`${t("TL_TECHNICAL_AND_FINANCIAL_CAPACITY_DOC")}`}
                                  {/* Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                                  ‘shareholder(s)’ as per prescribed policy parameters for grant of a licence */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "technicalAndFinancialCapacityDoc")}
                                      />
                                    </label>
                                    {watch("technicalAndFinancialCapacityDoc") && (
                                      <a
                                        onClick={() => getDocShareholding(watch("technicalAndFinancialCapacityDoc"), setLoader)}
                                        className="btn btn-sm "
                                      >
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for c */}
                            {watch("changeOfDeveloper") == "yes" && (
                              <tr>
                                {/* <th class="fw-normal">7</th> */}
                                <td>
                                  {`${t("TL_AFFIDAVIT_OF_ADM_CHARGES")}`}
                                  {/* An affidavit to pay the balance of administrative charges before final approval */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "affidavitOfAdmCharges")}
                                      />
                                    </label>
                                    {watch("affidavitOfAdmCharges") && (
                                      <a onClick={() => getDocShareholding(watch("affidavitOfAdmCharges"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for c */}
                            {watch("changeOfDeveloper") == "yes" && (
                              <tr>
                                {/* <th class="fw-normal">8</th> */}
                                <td>
                                  {`${t("TL_JUSTIFICATION_FOR_REQUEST")}`}
                                  {/* Justification for request */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "justificationForRequest")}
                                      />
                                    </label>
                                    {watch("justificationForRequest") && (
                                      <a onClick={() => getDocShareholding(watch("justificationForRequest"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for c */}
                            {watch("changeOfDeveloper") == "yes" && (
                              <tr>
                                {/* <th class="fw-normal">9</th> */}
                                <td>
                                  {`${t("TL_AFFIDAVIT_FIXED_CHARGES_FOR_ADMINISTRATIVE")}`}
                                  {/* An affidavit to the effect that in case the administrative charges for such cases are fixed in act and rules at a
                                  rate higher than that been recovered, the applicant shall be liable to pay the difference as and when demanded by
                                  TCP */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "affidavitFixedChargesForAdm")}
                                      />
                                    </label>
                                    {watch("affidavitFixedChargesForAdm") && (
                                      <a onClick={() => getDocShareholding(watch("affidavitFixedChargesForAdm"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for a,b,c */}
                            {(watch("selectType")?.value == "partial" ||
                              watch("selectType")?.value == "complete" ||
                              watch("changeOfDeveloper") == "yes") && (
                              <tr>
                                {/* <th class="fw-normal">10</th> */}
                                <td>
                                  {`${t("TL_THIRD_PARTY_CREATION_STATUS")}`}
                                  {/* The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to
                                  have been created in the colony, an affidavit to the said effect be also submitted by the existing developer */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyCreationStatus")}
                                      />
                                    </label>
                                    {watch("thirdPartyCreationStatus") && (
                                      <a onClick={() => getDocShareholding(watch("thirdPartyCreationStatus"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for a,b,c */}
                            {(watch("selectType")?.value == "partial" ||
                              watch("selectType")?.value == "complete" ||
                              watch("changeOfDeveloper") == "yes") && (
                              <tr>
                                {/* <th class="fw-normal">11</th> */}
                                <td>
                                  {`${t("TL_STATUS_REGARDING_REGISTRATION")}`}
                                  {/* Status regarding registration of project in RERA */}
                                  <span style={{ color: "red" }}>*</span>
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "registrationProjectRera")}
                                      />
                                    </label>
                                    {watch("registrationProjectRera") && (
                                      <a onClick={() => getDocShareholding(watch("registrationProjectRera"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            {/* for a,bc, */}
                            {(watch("selectType")?.value == "partial" ||
                              watch("selectType")?.value == "complete" ||
                              watch("changeOfDeveloper") == "yes") && (
                              <tr>
                                {/* <th class="fw-normal">12</th> */}
                                <td>
                                  {`${t("TL_ANY_OTHER_DOCUMENT")}`}
                                  {/* Any Other document */}
                                </td>
                                <td>
                                  <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherDoc")}
                                      />
                                    </label>
                                    {watch("anyOtherDoc") && (
                                      <a onClick={() => getDocShareholding(watch("anyOtherDoc"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "right", marginTop: "20px" }}>
              <button
                style={{
                  background: "#024f9d",
                  color: "white",
                  borderRadius: "5px",
                  padding: " 5px 15px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  width: "200px",
                }}
                type="submit"
                id="btnSearch"
                class=""
              >
                {`${t("TL_SUBMIT")}`}
                {/* Submit */}
              </button>
            </div>
            <span style={{ color: "red" }}>{getError}</span>
          </div>
        </div>
      </form>
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
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Service Plan Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              {`${t("TL_YOUR_TRANSFER_OF_LICENSE_IS_SUBMITTED_SUCCESSFULLY")}`}
              {/* Your Transfer of License is submitted successfully */}
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
            {`${t("TL_OK")}`}
            {/* Ok */}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Transferlicence;
