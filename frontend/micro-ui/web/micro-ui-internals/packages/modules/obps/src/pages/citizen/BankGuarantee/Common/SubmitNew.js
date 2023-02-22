import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useForm } from "react-hook-form";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [ServicePlanDataLabel, setServicePlanDataLabel] = useState([]);
  const [existingBgNumber, setExistingBgNumber] = useState("");

  // const [getShow, setShow] = useState({ submit: false });
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [typeOfBg, setTypeOfBg] = useState("");
  const [SubmissionSearch, setSubmissionSearch] = useState({});
  const [searchExistingBg, setSearchExistingBg] = useState({});
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
  const [noOfRows, setNoOfRows] = useState(1);
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
            tenantId: tenantId,
            additionalDetails: null,
            additionalDocuments: null,
            action: null,
            comment: "test comment",
            assignee: null,
            // validity: data?.validity,
            ...data,
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
    } catch (error) {
      console.log(error.message);
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
        `/tl-services/bank/guarantee/_search?typeOfBg=${getValues("typeOfBg")}&loiNumber=${getValues("loiNumber")}`,
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

  return (
    <form onSubmit={handleSubmit(bankSubmitNew)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}> Bank Guarantee/Mortgage Submission </h4>
        <div className="card">
          <div className="row-12">
            <div className="Col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">
                  Enter LOI Number<span style={{ color: "red" }}>*</span>
                </h2>

                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  {...register("loiNumber")}
                  disabled={existingBgNumber?.length > 0 ? true : false}
                />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">
                  Type of fee<span style={{ color: "red" }}>*</span>
                </h2>

                <select
                  className="Inputcontrol"
                  class="form-control"
                  placeholder=""
                  {...register("typeOfBg")}
                  disabled={existingBgNumber?.length > 0 ? true : false}
                >
                  <option value="IDW"> IDW</option>
                  <option value="EDC">EDC</option>
                  <option value="SPE">SPE</option>
                </select>
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <button
                // id="btnClear"
                type="button"
                class="btn btn-primary btn-md center-block"
                onClick={existingBgFormSubmitHandler}
              >
                Search
              </button>
            </div>
          </div>
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <label htmlFor="bankGuarantee">
            <input
              {...register("bankGuarantee")}
              type="radio"
              name="bankGuarantee"
              id="bankGuarantee1"
              value="1"
              onChange={(e) => handleshowhide(e)}
            />
            &nbsp; Bank Gurantee &nbsp;&nbsp;
          </label>
          <label htmlFor="bankGuarantee">
            <input
              {...register("bankGuarantee")}
              type="radio"
              name="bankGuarantee"
              id="bankGuarantee2"
              value="2"
              onChange={(e) => handleshowhide(e)}
            />
            &nbsp; Mortgage &nbsp;&nbsp;
          </label>
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          {showhide === "1" && (
            <div>
              <div className="col-12">
                {watch("typeOfBg") === "SPE" && (
                  <div className="row-12">
                    <div className="col md={4} xxl lg-4">
                      <FormControl>
                        <h2 className="FormLable">
                          Amount (in fig)<span style={{ color: "red" }}>*</span>
                        </h2>

                        <input type="text" className="form-control" placeholder="" {...register("amountInFig")} />
                      </FormControl>
                      &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                      <FormControl>
                        <h2 className="FormLable">
                          Amount (in words)<span style={{ color: "red" }}>*</span>
                        </h2>

                        <input type="text" className="form-control" placeholder="" {...register("amountInWords")} />
                      </FormControl>
                    </div>
                  </div>
                )}
                <br></br>
                {watch("typeOfBg") === "IDW" && (
                  <div className="row-12">
                    <div className="col-12">
                      <FormControl>
                        <h2 className="FormLable">
                          Amount (in fig)<span style={{ color: "red" }}>*</span>
                        </h2>

                        <input
                          type="text"
                          className="form-control"
                          id="standard-disabled"
                          label="Disabled"
                          {...register("amountInFig")}
                          readOnly
                          disabled={existingBgNumber?.length > 0 ? true : false}
                        />
                      </FormControl>
                      &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                      <FormControl>
                        <h2 className="FormLable">
                          Amount (in words)<span style={{ color: "red" }}>*</span>
                        </h2>

                        <input
                          type="text"
                          className="form-control"
                          placeholder=""
                          {...register("amountInWords")}
                          disabled={existingBgNumber?.length > 0 ? true : false}
                        />
                      </FormControl>
                    </div>
                  </div>
                )}
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                {watch("typeOfBg") === "EDC" && (
                  <div className="row-12">
                    <div className="col-12">
                      <FormControl>
                        <h2 className="FormLable">
                          Amount (in fig)<span style={{ color: "red" }}>*</span>
                        </h2>

                        <input
                          type="text"
                          className="form-control"
                          id="standard-disabled"
                          label="Disabled"
                          {...register("amountInFig")}
                          readOnly
                          disabled={existingBgNumber?.length > 0 ? true : false}
                        />
                      </FormControl>
                      &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                      <FormControl>
                        <h2 className="FormLable">
                          Amount (in words)<span style={{ color: "red" }}>*</span>
                        </h2>

                        <input
                          type="text"
                          className="form-control"
                          placeholder=""
                          {...register("amountInWords")}
                          disabled={existingBgNumber?.length > 0 ? true : false}
                        />
                      </FormControl>
                    </div>
                  </div>
                )}
              </div>
              <br></br>
              <div className="col-12">
                <FormControl>
                  <h2 className="FormLable">
                    Enter Bank Guarantee No.<span style={{ color: "red" }}>*</span>
                  </h2>

                  <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bgNumber")} />
                </FormControl>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2 className="FormLable">
                    Enter Bank Name<span style={{ color: "red" }}>*</span>
                  </h2>

                  <OutlinedInput type="text" className="Inputcontrol" placeholder="" {...register("bankName")} />
                </FormControl>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2 className="FormLable">
                    Expiry Date<span style={{ color: "red" }}>*</span>
                  </h2>

                  <OutlinedInput type="datepicker" className="Inputcontrol" placeholder="" {...register("validity")} format="yyyy-MM-dd" />
                </FormControl>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <FormControl>
                  <h2 className="FormLable">
                    Claim Period<span style={{ color: "red" }}>*</span>
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
                  <h2 className="FormLable">
                    Country of origin<span style={{ color: "red" }}>*</span>
                  </h2>

                  <select className="Inputcontrol" class="form-control" placeholder="" {...register("originCountry")}>
                    <option>------</option>
                    <option value="1"> Indian</option>
                    <option value="2">Foreign</option>
                  </select>
                </FormControl>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <label>
                  <h2>Upload B.G. softcopy </h2>
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
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <label>
                  <h2>Hardcopy Submitted at TCP office. </h2>

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
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.licenseApplied && errors?.licenseApplied?.message}
                  </h3>
                </label>
                {watch("licenseApplied") === "Y" && (
                  <div>
                    <div className="row">
                      <div className="col col-12">
                        <label>
                          <h2>
                            Upload Receipt of Submission.
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
                        <Typography gutterBottom>Submit Hardcopy of B.G. at TCP office.</Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                          Close
                        </Button>
                      </DialogActions>
                    </BootstrapDialog>
                  </div>
                )}
                {watch("originCountry") === "2" && (
                  <div>
                    <div className="row">
                      <div className="col col-4">
                        <p>In case of B.G. from other country, you need to upload Indian Bank Advice Certificate.</p>

                        <label>
                          <h2>
                            Upload Bank Advice Certificate.
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
              </div>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <div className="col-3">
                <FormControl>
                  <h2>Existing B.G. No. (In case of replacement, extension, renewal enter bank guarantee number)</h2>
                  <OutlinedInput
                    type="text"
                    className="Inputcontrol"
                    placeholder=""
                    {...register("existingBgNumber")}
                    onChange={(e) => setExistingBgNumber(e.target.value)}
                    onClick={existingBgFormSubmitHandler}
                  />
                </FormControl>
                {/* &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <button
                // id="btnClear"
                type="button"
                class="btn btn-primary btn-md center-block"
                onClick={existingBgFormSubmitHandler}
              >
                Search
              </button>{" "} */}
              </div>
            </div>
          )}
          {showhide === "2" && (
            <div>
              <div className="table table-bordered table-responsive " style={{ backgroundColor: "rgb(251 251 253))", width: "629px" }}>
                <thead>
                  <tr>
                    <th scope="col">Khasra No</th>
                    <th scope="col">Area to be Mortgaged (in sq meters)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <NumberInput disabled control={control} name="totalAreaScheme" customInput={TextField} />
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input type="number" className="form-control" placeholder="" />
                    </th>
                  </tr>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input type="text" className="form-control" placeholder="" disabled />
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input type="number" className="form-control" placeholder="" />
                    </th>
                  </tr>
                  <tr>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <h2>Area Total</h2>
                    </th>
                    <th className="fw-normal" style={{ textAlign: "center" }}>
                      <input type="number" className="form-control" placeholder="" />
                    </th>
                  </tr>
                </tbody>
              </div>
              <h5 className="card-title fw-bold">Enter Plot</h5>
              <div className="table table-bordered table-responsive" style={{ backgroundColor: "rgb(251 251 253))", width: "629px" }}>
                <thead>
                  <tr>
                    <th scope="col">Plot No</th>
                    <th scope="col">Area (in sq meters)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(noOfRows)].map((elementInArray, index) => {
                    return (
                      <tr>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          <input type="text" className="form-control" placeholder="" />
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          <input type="number" className="form-control" placeholder="" />
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </div>
              <div class="row-12" className="align-right">
                <button type="button" class="btn btn-primary me-3" onClick={() => setNoOfRows(noOfRows + 1)}>
                  Add
                </button>
                <button type="button" class="btn btn-danger" onClick={() => setNoOfRows(noOfRows - 1)}>
                  Delete
                </button>
              </div>

              <br></br>
              <h5>Upload Documents</h5>
              <br></br>
              <div className="row">
                <div className="col col-3">
                  <h2 style={{ display: "flex" }}>Upload layout plan earmarking land to be mortgaged</h2>
                  <label>
                    <FileUpload style={{ cursor: "pointer" }} color="primary" />
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanEarmarking")}
                      accept="application/pdf/jpeg/png"
                    />
                  </label>
                  {watch("layoutPlanEarmarking") && (
                    <a onClick={() => getDocShareholding(watch("layoutPlanEarmarking"), setLoader)} className="btn btn-sm ">
                      <VisibilityIcon color="info" className="icon" />
                    </a>
                  )}

                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.layoutPlanEarmarking && errors?.layoutPlanEarmarking?.message}
                  </h3>
                </div>

                <div className="col col-3">
                  <h2 style={{ display: "flex" }}>
                    Mortgage Deed <span style={{ color: "red" }}>*</span>{" "}
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

                <div className="col col-3">
                  <h2 style={{ display: "flex" }}>
                    Land schedule and Plot numbers <span style={{ color: "red" }}>*</span>
                  </h2>
                  <label>
                    <FileUpload style={{ cursor: "pointer" }} color="primary" />
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => getDocumentData(e?.target?.files[0], "landSchedulePlotnumber")}
                      accept="application/pdf/jpeg/png"
                    />
                  </label>
                  {watch("landSchedulePlotnumber") && (
                    <a onClick={() => getDocShareholding(watch("landSchedulePlotnumber"), setLoader)} className="btn btn-sm ">
                      <VisibilityIcon color="info" className="icon" />
                    </a>
                  )}

                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.landSchedulePlotnumber && errors?.landSchedulePlotnumber?.message}
                  </h3>
                </div>
              </div>
              <div className="row">
                <div className="col col-12">
                  <h2 style={{ display: "flex" }}>
                    Undertaking Amended/supplementary/addendum mortage deed specifying plots/flats/shops and appropriate licenced land to be mortgaged
                    upon approval of building plans
                  </h2>
                  <label>
                    <FileUpload style={{ cursor: "pointer" }} color="primary" />
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => getDocumentData(e?.target?.files[0], "undertakingAmmended")}
                      accept="application/pdf/jpeg/png"
                    />
                  </label>
                  {watch("undertakingAmmended") && (
                    <a onClick={() => getDocShareholding(watch("undertakingAmmended"), setLoader)} className="btn btn-sm ">
                      <VisibilityIcon color="info" className="icon" />
                    </a>
                  )}

                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.undertakingAmmended && errors?.undertakingAmmended?.message}
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
              <Button variant="contained" type="submit" class="btn btn-primary btn-md center-block">
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
  );
}

export default SubmitNew;
