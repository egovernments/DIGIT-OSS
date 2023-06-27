import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect"
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import FileUpload from "@mui/icons-material/FileUpload"; 
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReleaseNew from "./Release";
import { getDocShareholding } from "../../NewLicense/docView/docView.help";
import NumberInput from "../../../../components/NumberInput";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";

const selectTypeData = [
  { label: "IDW", value: "IDW" },
  { label: "EDC", value: "EDC" },
   { label: "SPE", value: "SPE" },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function SubmitNew() {
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
  const [existingBgNumber, setExistingBgNumber] = useState("");
  const [getDisable, setDisable] = useState(true);
  // const [getShow, setShow] = useState({ submit: false });
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [typeOfBg, setTypeOfBg] = useState("");
  const [SubmissionSearch, setSubmissionSearch] = useState({});
  const [searchExistingBg, setSearchExistingBg] = useState({});
  const [applicationNumber, setApplicationNumber] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
  } = useForm({});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const {t}=useTranslation();
//   const selectTypeData = [{ label: "IDW", value: "IDW" },
// {
//   label: "EDC", value: "EDC"
// },
// {
//   label: "SPE", value: "SPE"
// }];

  const bankSubmitNew = async (data) => {
    const token = window?.localStorage?.getItem("token");
    console.log("token", token);
    const userInfo = Digit.UserService.getUser()?.info || {};
    console.log("validity", data);
    console.log("SubmissionSearch", SubmissionSearch);
    try {
      const postDistrict = {
        NewBankGuaranteeRequest: [
          {
            loiNumber: "",
            
            businessService: "",
            tenantId: tenantId,

            additionalDetails: {
              mortgageKhasraDetails: [
                {
                  khasraNumber: khasraNumber,
                  areaToBeMortgagedInSqMtrs: data?.areaToBeMortgagedInSqMtrs,
                },
              ],
              totalKhasraAreaToMortgage: data?.areaToBeMortgagedInSqMtrs,
              mortgagePlotDetails: [
                {
                  plotNumber: data?.plotNumber,
                  areaInSqMtrs: data?.areaInSqMtrs,
                },
              ],
              totalPlotAreaToMortgage: data?.totalPlotAreaToMortgage,
            },
            additionalDocuments: {
              mortgageLayoutPlan: data?.mortgageLayoutPlan,
              mortgageDeed: data?.mortgageDeed,
              mortgageLandScheduleAndPlotNumbersDoc: data?.mortgageLandScheduleAndPlotNumbersDoc,
              mortgageDeedAfterBPApproval: data?.mortgageDeedAfterBPApproval,
            },
            action: null,
            comment: "test comment",
            assignee: null,

            ...data,
            typeOfBg: data?.typeOfBg?.label
          },
        ],
        RequestInfo: {
          apiId: "Rainmaker",
          action: "_create",
          did: 1,
          key: "",
          msgId: "20170310130900|en_IN",
          ts: 0,
          ver: ".01",
          authToken: token,
          userInfo: userInfo,
        },
      };
      const Resp = await axios.post("/tl-services/bank/guarantee/_create", postDistrict);
      setServicePlanDataLabel(Resp.data);
      setApplicationNumber(Resp.data.newBankGuaranteeList[0].applicationNumber);
    } catch (error) {
      console.log("helloriya", error.message);
    }
  };
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ key: "error" });
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
      setLoader(false);
      setShowToast({ key: "success" });
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };
  const [applicantId, setApplicantId] = useState("");
  const [showOption, setShowOption] = useState(false);

  const submitNewFormSubmitHandler = async () => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        action: "_create",
        did: 1,
        key: "",
        msgId: "20170310130900|en_IN",
        ts: 0,
        ver: ".01",
        authToken: token,
      },
    };
    try {
      const Resp = await axios.post(
        `/tl-services/bank/guarantee/_search?typeOfBg=${watch("typeOfBg").label}&loiNumber=${watch("loiNumber")}`,
        payload
      );
      const Submitform = Resp?.data?.newBankGuaranteeList[0];

      console.log("service", Submitform);
      setSubmissionSearch(Submitform);
      setValue("amountInFig", Resp.data.newBankGuaranteeList[0].amountInFig);
      const userData = Resp?.data?.LicenseDetails?.[0];
      setStepData(userData);
    } catch (error) {
      return error;
    }
  };

  const existingBgFormSubmitHandler = async () => {
    const token = window?.localStorage?.getItem("token");
    console.log("token........", token);
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        action: "_create",
        did: 1,
        key: "",
        msgId: "20170310130900|en_IN",
        ts: 0,
        ver: ".01",
        authToken: token,
      },
    };
    try {
      const Resp = await axios.post(
        `/tl-services/bank/guarantee/_search?bgNumber=${getValues("bgNumber")}&bankName=${getValues("bankName")}`,
        payload
      );

      console.log("serviceBG", Resp);
      setSearchExistingBg(Resp.data.newBankGuaranteeList[0]);
      setValue("loiNumber", Resp.data.newBankGuaranteeList[0].loiNumber);
      setValue("typeOfBg", Resp.data.newBankGuaranteeList[0].typeOfBg);
      setValue("amountInFig", Resp.data.newBankGuaranteeList[0].amountInFig);
      setValue("amountInWords", Resp.data.newBankGuaranteeList[0].amountInWords);
      console.log("data", Resp.data.newBankGuaranteeList[0]);
    } catch (error) {
      return error;
    }
  };

  const updateSubmitFormSubmitHandler = async () => {
    const token = window?.localStorage?.getItem("token");
    console.log("SubmissionSearch..........", searchExistingBg);
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        action: "_create",
        did: 1,
        key: "",
        msgId: "20170310130900|en_IN",
        ts: 0,
        ver: ".01",
        authToken: token,
      },
      NewBankGuaranteeRequest: [
        {
          action: "EXTEND",
          comment: "test comment",
          assignee: null,
          ...searchExistingBg,
        },
      ],
    };
    try {
      const Resp = await axios.post(`/tl-services/bank/guarantee/_update`, payload);
      setOpen(true);
      setApplicationNumber(Resp.data.newBankGuaranteeList[0].applicationNumber);
      console.log("service......", Submitform);
      // setSearchExistingBg(Submitform);
    } catch (error) {
      return error;
    }
  };
  const [showhide, setShowhide] = useState("");
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const [LOINumber, setLOINumber] = useState("");
  const [khasraNumber, setKhasraNumber] = useState("");
  const handleLoiNumber = async (e) => {
    const token = window?.localStorage?.getItem("token");

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
          userInfo: userInfo,
        },
      };
      const Resp = await axios.post(`/tl-services/v1/_search?loiNumber=${LOINumber}`, loiRequest);
      console.log(Resp, "RRRRRRRRRRR");
      setKhasraNumber(Resp?.data?.Licenses?.[1]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.AppliedLandDetails?.[0]?.khewats);
      // setDevelopmentPlan(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.AppliedLandDetails?.[0]?.developmentPlan)
      // setPurpose(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.purpose)
      // setTotalArea(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.totalArea)

      // console.log({ devName, developmentPlan, purpose, totalArea });
    } catch (error) {
      console.log(error);
    }

    console.log("loiloiloi");
  };

  const [noofRows, setNoOfRows] = useState(1);
  var date = new Date("Wed, 04 May 2022");
  var year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });

  // Generate yyyy-mm-dd date string
  var formattedDate = year + "-" + month + "-" + day;

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(bankSubmitNew)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>{`${t("BG_SUBMIT_MORTGAGE_SUBMISSION")}`}
             {/* Bank Guarantee/Mortgage Submission  */}
             </h4>
          <div className="card">
            <div className="row-12">
              <div className="Col md={4} xxl lg-4">
                <FormControl>
                  <h2 className="FormLable">{`${t("BG_SUBMIT_ENTER_LOI_NO")}`}
                    {/* Enter LOI Number */}
                    <span style={{ color: "red" }}>*</span>
                  </h2>

                  <OutlinedInput
                    type="text"
                    className="Inputcontrol"
                    placeholder=""
                    {...register("loiNumber")}
                    disabled={existingBgNumber?.length > 0 ? true : false}
                  />
                </FormControl>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2 className="FormLable">{`${t("BG_SUBMIT_TYPE_OF_FEE")}`}
                    {/* Type of fee */}
                    <span style={{ color: "red" }}>*</span>
                  </h2>
   <ReactMultiSelect control={control} name="typeOfBg" placeholder="" data={selectTypeData} onClick={submitNewFormSubmitHandler} labels=""  disabled={existingBgNumber?.length > 0 ? true : false}/>
                  {/* <select
                    className="Inputcontrol"
                    class="form-control"
                    placeholder=""
                    {...register("typeOfBg")}
                    disabled={existingBgNumber?.length > 0 ? true : false}
                  >
                    <option value="IDW"> IDW</option>
                    <option value="EDC">EDC</option>
                    <option value="SPE">SPE</option>
                  </select> */}
                </FormControl>
                {/* <button
               
                type="button"
                class="btn btn-primary btn-md center-block"
                onClick={submitNewFormSubmitHandler}
              >
                Search
              </button> */}
              </div>
            </div>
            &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
            <label htmlFor="businessService">
              <input
                {...register("businessService")}
                type="radio"
                name="businessService"
                id="businessService1"
                value="BG_NEW"
                 onClick={submitNewFormSubmitHandler}
                onChange={(e) => handleshowhide(e)}
              />
              &nbsp; {`${t("BG_SUBMIT_BANK_GUARANTEE")}`}
              {/* Bank Gurantee  */}
              &nbsp;&nbsp;
            </label>
            <label htmlFor="businessService">
              <input
                {...register("businessService")}
                type="radio"
                name="businessService"
                id="businessService2"
                value="BG_MORTGAGE"
               
                onChange={(e) => handleshowhide(e)}
              />
              &nbsp;{`${t("BG_SUBMIT_MORTGAGE")}`}
               {/* Mortgage */}
                &nbsp;&nbsp;
            </label>
            {/* &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; */}
            {showhide === "BG_NEW" && (
              <div>
                 {watch("typeOfBg")?.value == "SPE" && (
                   <div className="row-12">
 <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_AMOUNT_IN_FIG")}`}
                 {/* Amount (in fig) */}
                 <span style={{ color: "red" }}>*</span></h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")}  />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}
                 {/* Amount (in words) */}
                 <span style={{ color: "red" }}>*</span></h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")}  />
              </FormControl>
            
            </div>
            </div>
//                    <div className="row gy-3">
//                   <div className="col col-6">
                   
//                       <h2 className="FormLable">
//                         Amount (in fig)<span style={{ color: "red" }}>*</span>
//                       </h2>
//  <input type="text" className="form-control" placeholder="" {...register("amountInFig")} disabled></input>
//                       {/* <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")} /> */}
                   
//                     &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
//                     <div className="col col-6">
//                       <h2 className="FormLable">
//                         Amount (in words)<span style={{ color: "red" }}>*</span>
//                       </h2>
//  <input type="text" className="Inputcontrol" placeholder="" {...register("amountInWords")} disabled></input>
//                       {/* <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInWords")} /> */}
//                    </div>
//                   </div>
//                   </div>
                )}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                 {watch("typeOfBg")?.value == "IDW" && (
                  <div className="row-12">
 <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_AMOUNT_IN_FIG")}`}<span style={{ color: "red" }}>*</span></h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")} disabled />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}<span style={{ color: "red" }}>*</span></h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")} disabled />
              </FormControl>
            
            </div>
            </div>
                )}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                 {watch("typeOfBg")?.value == "EDC" && (
                    <div className="row-12">
 <div className="col md={4} xxl lg-3">
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_AMOUNT_IN_FIG")}`}<span style={{ color: "red" }}>*</span></h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")} disabled />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("BG_SUBMIT_AMOUNT_IN_WORDS")}`}<span style={{ color: "red" }}>*</span></h2>
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("amountInFig")} disabled />
              </FormControl>
            
            </div>
            </div>
                )}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <div className="col-12">
                  <FormControl>
                    <h2 className="FormLable">{`${t("BG_SUBMIT_BANK_GUARANTEE_NO")}`}
                      {/* Enter Bank Guarantee No. */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")} />
                  </FormControl>
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <FormControl>
                    <h2 className="FormLable">{`${t("BG_SUBMIT_BANK_NAME")}`}
                      {/* Enter Bank Name */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bankName")} />
                  </FormControl>
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <FormControl>
                    <h2 className="FormLable">{`${t("BG_SUBMIT_EXPIRY_DATE")}`}
                      {/* Expiry Date */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <OutlinedInput type="date" className="Inputcontrol" placeholder={formattedDate} {...register("validity")} />
                  </FormControl>
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <FormControl>
                    <h2 className="FormLable">{`${t("BG_SUBMIT_CLAIM_PERIOD")}`}
                      {/* Claim Period */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <select className="Inputcontrol" class="form-control" placeholder="" {...register("claimPeriod")}>
                      <option> 0</option>
                      <option>1</option>
                      <option> 2</option>
                      <option>3</option>
                      <option> 4</option>
                      <option>5</option>
                      <option> 6</option>
                      <option>7</option>
                      <option> 8</option>
                      <option>9</option>
                      <option> 10</option>
                      <option>11</option>
                      <option> 12</option>
                    </select>
                  </FormControl>
                </div>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <div className="col-12">
                  <FormControl>
                    <h2 className="FormLable">{`${t("BG_SUBMIT_COUNTRY_ORIGIN")}`}
                      {/* Country of origin */}
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <select className="Inputcontrol" class="form-control" placeholder="" {...register("originCountry")}>
                      <option>------</option>
                      <option value="1"> Indian</option>
                      <option value="2">Foreign</option>
                    </select>
                  </FormControl>
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <label>
                    <h2>{`${t("BG_SUBMIT_UPLOAD_BG_SOFTCOPY")}`}
                    {/* Upload B.G. softcopy  */}
                    </h2>
                    <FileUpload color="primary" />

                    <input
                      type="file"
                      accept="application/pdf/jpeg/png"
                      style={{ display: "none" }}
                      onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")}
                    />

                    {fileStoreId?.uploadBg ? (
                      <a onClick={() => getDocShareholding(fileStoreId?.uploadBg)} className="btn btn-sm ">
                        <VisibilityIcon color="info" className="icon" />
                      </a>
                    ) : (
                      <p></p>
                    )}
                    <h3 style={{}}>{watch("uploadBgFileName") ? watch("uploadBgFileName") : null}</h3>
                  </label>
                </div>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <div className="col-12">
                  <label>
                    <h2>{`${t("BG_SUBMIT_HARDCOPY_SUBMITTED_TCP")}`}
                    {/* Hardcopy Submitted at TCP office.  */}
                    </h2>
                    <label htmlFor="licenseApplied">
                      <input {...register("licenseApplied")} type="radio" value="Y" id="licenseApplied" />
                      &nbsp; Yes &nbsp;&nbsp;
                    </label>
                    <label htmlFor="licenseApplied">
                      <input
                        {...register("licenseApplied")}
                        type="radio"
                        value="N"
                        id="licenseApplied"
                        className="btn btn-primary"
                        onClick={handleClickOpen}
                      />
                      &nbsp; No &nbsp;&nbsp;
                    </label>
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    {watch("licenseApplied") === "Y" && (
                      <div>
                        <div className="row">
                          <div className="col col-12">
                            <label>
                              <h2>{`${t("BG_SUBMIT_UPLOAD_RECEIPT_SUBMISSION")}`}
                                {/* Upload Receipt of Submission. */}
                                <span style={{ color: "red" }}>*</span>
                              </h2>
                              <FileUpload color="primary" />

                              <input
                                type="file"
                                accept="application/pdf/jpeg/png"
                                style={{ display: "none" }}
                                onChange={(e) => getDocumentData(e?.target?.files[0], "tcpSubmissionReceived")}
                              />

                              {fileStoreId?.tcpSubmissionReceived ? (
                                <a onClick={() => getDocShareholding(fileStoreId?.tcpSubmissionReceived)} className="btn btn-sm ">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              ) : (
                                <p></p>
                              )}
                              <h3 style={{}}>{watch("tcpSubmissionReceivedFileName") ? watch("tcpSubmissionReceivedFileName") : null}</h3>
                            </label>
                            {/* <div>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "tcpSubmissionReceived")}
                        ></input>
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.tcpSubmissionReceived && errors?.tcpSubmissionReceived?.message}
                      </h3> */}
                          </div>
                        </div>
                      </div>
                    )}
                    {watch("licenseApplied") === "N" && (
                      <div>
                        <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                          {/* <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Modal title
        </BootstrapDialogTitle> */}
                          <DialogContent dividers>
                            <Typography gutterBottom>{`${t("BG_SUBMIT_HARDCOPY_AT_TCP_OFFICE")}`}
                            {/* Submit Hardcopy of B.G. at TCP office. */}
                            </Typography>
                          </DialogContent>
                          <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                              Close
                            </Button>
                          </DialogActions>
                        </BootstrapDialog>
                      </div>
                    )}
                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.licenseApplied && errors?.licenseApplied?.message}
                    </h3>
                  </label>
                </div>
                {watch("originCountry") === "2" && (
                  <div>
                    <div className="row">
                      <div className="col col-4">
                        <p>{`${t("BG_SUBMIT_FROM-OTHER_COUNTRY")}`}
                        {/* In case of B.G. from other country, you need to upload Indian Bank Advice Certificate. */}
                        </p>

                        <label>
                          <h2>{`${t("BG_SUBMIT_UPLOAD_ADVICE_CERTIFICATE")}`}
                            {/* Upload Bank Advice Certificate. */}
                            <span style={{ color: "red" }}>*</span>
                          </h2>
                        </label>
                        <div>
                          <input
                            type="file"
                            className="Inputcontrol"
                            class="form-control"
                            onChange={(e) => getDocumentData(e?.target?.files[0], "indianBankAdvisedCertificate")}
                          ></input>
                        </div>

                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.indianBankAdvisedCertificate && errors?.indianBankAdvisedCertificate?.message}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <div className="row-12">
                  <div className="col-6">
                    <div className="form-check">
                      <input
                        onClick={(e) => {
                          if (e.target.checked) {
                            setDisable(false);
                          } else {
                            setDisable(true);
                          }
                          // setDisable(e.target.checked);
                        }}
                        className="form-check-input"
                        formControlName="agreeCheck"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />

                      <label className="checkbox" for="flexCheckDefault">{`${t("BG_SUBMIT_EXISTING_BG_NO_IN_REPLACEMENT")}`}
                        {/* Existing B.G. No. (In case of replacement, extension, renewal enter bank guarantee number.{" "} */}
                      </label>
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        disabled={getDisable}
                        className="form-control"
                        placeholder=""
                        {...register("existingBgNumber")}
                        onChange={(e) => setExistingBgNumber(e.target.value)}
                        onClick={existingBgFormSubmitHandler}
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="">
                <div className="form-check">
                  <input className="form-check-input" formControlName="agreeCheck" type="checkbox" value="existingBgNumber" id="flexCheckDefault" />

                  <h2 className="checkbox" for="flexCheckDefault">
                    Existing B.G. No. (In case of replacement, extension, renewal enter bank guarantee number &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <OutlinedInput
                      type="text"
                      className="Inputcontrol"
                      placeholder=""
                      {...register("existingBgNumber")}
                      onChange={(e) => setExistingBgNumber(e.target.value)}
                      onClick={existingBgFormSubmitHandler}
                    />
                  </h2>
                </div>
              </div> */}
              </div>
            )}
            {showhide === "BG_MORTGAGE" && (
              <div>
                <div className="table table-bordered table-responsive " style={{ backgroundColor: "rgb(251 251 253))", width: "629px" }}>
                  <thead>
                    <tr>
                      <th scope="col">{`${t("BG_SUBMIT_KHASRA_NO")}`}
                      {/* Khasra No */}
                      </th>
                      <th scope="col">{`${t("BG_SUBMIT_AREA_MORTGAGED_SQ_M")}`}
                      {/* Area to be Mortgaged (in sq meters) */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="fw-normal" style={{ textAlign: "center" }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder=""
                          disabled
                          {...register("khasraNumber")}
                          onChange={(e) => setKhasraNumber(e.target.value)}
                          value={khasraNumber}
                        />
                      </th>
                      <th className="fw-normal" style={{ textAlign: "center" }}>
                        <input type="number" className="form-control" placeholder="" {...register("areaToBeMortgagedInSqMtrs")} />
                      </th>
                    </tr>
                  </tbody>
                </div>
                {/* <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input type="text" className="form-control" placeholder="" disabled />
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input type="number" className="form-control" placeholder="" />
                    </th>
                  </tr> */}
                <div class="row-12" className="align-right">
                  <div className="col col-3">
                    <h2>{`${t("BG_SUBMIT_TOTAL_AREA_IN_ACRES")}`}
                    {/* Total Area (in acres) */}
                    </h2>
                    <input
                      type="number"
                      placeholder={watch("areaToBeMortgagedInSqMtrs")}
                      {...register("totalKhasraAreaToMortgage")}
                      className="form-control"
                      disabled
                    />
                    &nbsp;&nbsp;
                  </div>
                </div>
                {/* <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <h2>Area Total</h2>
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input type="number" className="form-control" placeholder="" {...register("totalKhasraAreaToMortgage")} />
                    </th>
                  </tr> */}

                <h5 className="card-title fw-bold">{`${t("BG_SUBMIT_ENTER_PLOT")}`}
                {/* Enter Plot */}
                </h5>
                <div className="table table-bordered table-responsive" style={{ backgroundColor: "rgb(251 251 253))", width: "629px" }}>
                  <thead>
                    <tr>
                      <th scope="col">{`${t("BG_SUBMIT_PLOT_NO")}`}
                      {/* Plot No */}
                      </th>
                      <th scope="col">{`${t("BG_SUBMIT_AREA_IN_SQ_M")}`}
                      {/* Area (in sq meters) */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="fw-normal" style={{ textAlign: "center" }}>
                        <input type="text" className="form-control" placeholder="" {...register("plotNumber")} />
                      </th>
                      <th className="fw-normal" style={{ textAlign: "center" }}>
                        <input type="number" className="form-control" placeholder="" {...register("areaInSqMtrs")} />
                      </th>
                    </tr>
                    {[...Array(noofRows)].map((elementInArray, input) => {
                      return (
                        <tr>
                          <td>
                            <input type="text" className="form-control" placeholder="" />
                          </td>
                          <td>
                            <input type="text" className="form-control" placeholder="" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </div>
                <div>
                  <button type="button" style={{ float: "left" }} className="btn btn-primary" onClick={() => setNoOfRows(noofRows + 1)}>
                    Add more
                  </button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button type="button" style={{ float: "left" }} className="btn btn-danger" onClick={() => setNoOfRows(noofRows - 1)}>
                    Delete
                  </button>
                </div>

                <div class="row-12" className="align-right">
                  <div className="col col-3">
                    <h2>{`${t("BG_SUBMIT_TOTAL_AREA_IN_ACRES")}`}</h2>
                    <input
                      type="number"
                      placeholder={watch("areaInSqMtrs")}
                      {...register("totalPlotAreaToMortgage")}
                      className="form-control"
                      disabled
                    />
                    {/* <input type="number" className="form-control" placeholder="" {...register("totalPlotAreaToMortgage")} /> */}
                  </div>
                </div>

                <br></br>
                <h5>{`${t("BG_SUBMIT_UPLOAD_DOCUMENTS")}`}
                {/* Upload Documents */}
                </h5>
                <br></br>
                <div className="row">
                  <div className="col col-12">
                    <h2 style={{ display: "flex" }}>{`${t("BG_SUBMIT_UPLOAD_LAYOUT_PLAN_EARMAKING")}`}
                    {/* Upload layout plan earmarking land to be mortgaged */}
                    </h2>
                    <label>
                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "mortgageLayoutPlan")}
                        accept="application/pdf/jpeg/png"
                      />
                    </label>
                    {watch("mortgageLayoutPlan") && (
                      <a onClick={() => getDocShareholding(watch("mortgageLayoutPlan"), setLoader)} className="btn btn-sm ">
                        <VisibilityIcon color="info" className="icon" />
                      </a>
                    )}

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.mortgageLayoutPlan && errors?.mortgageLayoutPlan?.message}
                    </h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-4">
                    <h2 style={{ display: "flex" }}>{`${t("BG_SUBMIT_UPLOAD_MORTGAGE_DEED")}`}
                      {/* Mortgage Deed  */}
                      <span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                    <label>
                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "mortgageDeed")}
                        accept="application/pdf/jpeg/png"
                      />
                    </label>
                    {watch("mortgageDeed") && (
                      <a onClick={() => getDocShareholding(watch("mortgageDeed"), setLoader)} className="btn btn-sm ">
                        <VisibilityIcon color="info" className="icon" />
                      </a>
                    )}

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.mortgageDeed && errors?.mortgageDeed?.message}
                    </h3>
                  </div>

                  <div className="col col-4">
                    <h2 style={{ display: "flex" }}>{`${t("BG_SUBMIT_LAND_SCHEDULE_PLOT_NO")}`}
                      {/* Land schedule and Plot numbers */}
                       <span style={{ color: "red" }}>*</span>
                    </h2>
                    <label>
                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "mortgageLandScheduleAndPlotNumbersDoc")}
                        accept="application/pdf/jpeg/png"
                      />
                    </label>
                    {watch("mortgageLandScheduleAndPlotNumbersDoc") && (
                      <a onClick={() => getDocShareholding(watch("mortgageLandScheduleAndPlotNumbersDoc"), setLoader)} className="btn btn-sm ">
                        <VisibilityIcon color="info" className="icon" />
                      </a>
                    )}

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.mortgageLandScheduleAndPlotNumbersDoc && errors?.mortgageLandScheduleAndPlotNumbersDoc?.message}
                    </h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-12">
                    <h2 style={{ display: "flex" }}>{`${t("BG_SUBMIT_UNDERTAKING_AMEND_MORTGAGE_DEED")}`}
                      {/* Undertaking Amended/supplementary/addendum mortage deed specifying plots/flats/shops and appropriate licenced land to be
                      mortgaged upon approval of building plans */}
                    </h2>
                    <label>
                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "mortgageDeedAfterBPApproval")}
                        accept="application/pdf/jpeg/png"
                      />
                    </label>
                    {watch("mortgageDeedAfterBPApproval") && (
                      <a onClick={() => getDocShareholding(watch("mortgageDeedAfterBPApproval"), setLoader)} className="btn btn-sm ">
                        <VisibilityIcon color="info" className="icon" />
                      </a>
                    )}

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.mortgageDeedAfterBPApproval && errors?.mortgageDeedAfterBPApproval?.message}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            <br></br>
            <div class="row-12" className="align-right">
              <div className="col-4">
                <Button variant="contained" class="btn btn-primary btn-md center-block">
                  Cancel
                </Button>
                &nbsp;
                <Button type="submit" onClick={handleClickOpen1} class="btn btn-primary btn-md center-block">
                  Submit
                </Button>
                &nbsp;
                <Button variant="contained" class="btn btn-primary btn-md center-block" type="button" onClick={updateSubmitFormSubmitHandler}>
                  {" "}
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Dialog open={open1} onClose={handleClose1} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Bank Guarantee Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Your Bank Guarantee is submitted successfully{" "}
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
          <Button onClick={handleClose1} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SubmitNew;
