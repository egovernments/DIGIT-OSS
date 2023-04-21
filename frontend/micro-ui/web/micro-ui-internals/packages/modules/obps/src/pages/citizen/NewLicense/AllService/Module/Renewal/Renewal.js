import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import AddBoxSharpIcon from "@mui/icons-material/AddBoxSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Button } from "@material-ui/core";
import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../../../docView/docView.help";
import axios from "axios";
import Spinner from "../../../../../../components/Loader";
import CusToaster from "../../../../../../components/Toaster";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import { VALIDATION_SCHEMA } from "../../../../../../utils/schema/renewal";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, TextField } from "@mui/material";

const RenewalFor = [
  { label: "Year", value: "year" },
  { label: "Month", value: "month" },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function renewalClu() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
    getValues,
    trigger,
    resetField,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });

  const renewal = (data) => console.log(data);
  const [modal, setmodal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [fileStoreId, setFileStoreId] = useState({});
  const [licenceData, setLicenceData] = useState([]);
  const [showField, setShowField] = useState({ select: false, other: false });

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

  useEffect(() => {
    const date_1 = new Date(watch("validUpto"));
    const date_2 = new Date();
    const difference = date_1.getTime() - date_2.getTime();
    const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    setValue("delayInDays", TotalDays);
  }, [watch("renewalApplied")]);

  const getLicenceDetails = async () => {
    setLoader(true);
    const data = {
      Flag: 1,
      SearchParam: watch("licenceNo"),
    };
    try {
      const Resp = await axios.post("/api/cis/GetLicenceDetails", data);
      const filteredData = Resp?.data
        .filter((item) => item.Text.includes(" of "))
        .map((item) => {
          return { label: item.Text.split(" |")[0], value: item };
        });
      console.log("lllll====", filteredData);
      setShowField({ select: true, other: false });
      const setLicData = filteredData?.map(function (data) {
        return { value: data?.value?.Text, label: data?.label };
      });
      setLicenceData(setLicData);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  const setTextValues = (val) => {
    setShowField({ select: true, other: true });
    setValue("district", val.value?.split("|")?.[3]);
    setValue("colonyType", val.value?.split("|")?.[4]);
    setValue("colonizerName", val.value?.split("|")?.[5]);
    setValue("developmentPlan", val.value?.split("|")?.[6]);
    setValue("sectorNo", val.value?.split("|")?.[7]);
    setValue("areaAcres", val.value?.split("|")?.[9]);
  };

  // http://103.166.62.118:3001/digit-ui/citizen/obps/edcrscrutiny/apply/home
  // 66666666666

  useEffect(() => {
    console.log("er", errors);
  }, [errors]);

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(renewal)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Renewal</h4>
          <div className="card">
            <div className="row-12">
              <SearchLicenceComp
                watch={watch}
                register={register}
                control={control}
                setLoader={setLoader}
                errors={errors}
                setValue={setValue}
                resetField={resetField}
              />
              <div className="row gy-3 mt-3">
                <div className="col col-6 ">
                  <FormControl>
                    <h2>Whether renewal applied within the stipulated period.</h2>
                    <label htmlFor=" Whether renewal applied within the stipulated period.">
                      &nbsp;&nbsp;
                      <input {...register("renewalApplied")} type="radio" value="yes" id="yes" /> &nbsp; Yes
                    </label>
                    <label htmlFor="Whether renewal applied within the stipulated period.">
                      &nbsp;&nbsp;
                      <input {...register("renewalApplied")} type="radio" value="no" id="no" />
                      &nbsp; No
                    </label>
                    {watch("renewalApplied") === "yes" && (
                      <div>
                        <h2>
                          Whether renewal applied under section 7(B) as special category project
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                        <label htmlFor=" Whether renewal applied under section 7(B) as special">
                          &nbsp;&nbsp;
                          <input {...register("renewalAppliedUnderSection")} type="radio" value="yes" id="yes" />
                          &nbsp; Yes
                        </label>
                        <label htmlFor="Whether renewal applied under section 7(B) as special">
                          &nbsp;&nbsp;
                          <input {...register("renewalAppliedUnderSection")} type="radio" value="no" id="no" /> &nbsp; No
                        </label>
                      </div>
                    )}
                    {watch("renewalApplied") === "no" && (
                      <div>
                        <h2>Delay in days</h2>
                        <input type="number" className="form-control" placeholder="" {...register("delayInDays")} disabled />
                        {/* auto calculate days from valid upto to current date */}
                      </div>
                    )}
                  </FormControl>
                </div>
              </div>
              <div className="mt-3">
                <h2> Reason for not completing the project within the initial validity period of the licence.</h2>
                <textarea className="form-control" placeholder="" {...register("completingProject")} rows="3" />
              </div>

              <div className="row-12">
                <div className="col md={4} xxl lg-4">
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <h2>
                    Whether colonizer has transferred portion of sector/master plans roads forming part of the licenced area free of cost to the Govt.
                    of not in compilance of condition of licence.
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                  <label htmlFor=" transferredPortion">
                    &nbsp;&nbsp;
                    <input {...register("transferredPortion")} type="radio" value="yes" id="yes" /> &nbsp; Yes
                  </label>
                  <label htmlFor="transferredPortion">
                    &nbsp;&nbsp;
                    <input {...register("transferredPortion")} type="radio" value="no" id="no" /> &nbsp; No
                  </label>
                  <label htmlFor="transferredPortion">
                    &nbsp;&nbsp;
                    <input {...register("transferredPortion")} type="radio" value="NA" id="no" /> &nbsp; NA
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.transferredPortion && errors?.transferredPortion?.message}
                  </h3>
                  <h2>
                    Whether any specific condition was imposed in the licence
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                  <label htmlFor="imposedSpecificCondition">
                    &nbsp;&nbsp;
                    <input {...register("imposedSpecificCondition")} type="radio" value="yes" id="yes" /> &nbsp; Yes
                  </label>
                  <label htmlFor="imposedSpecificCondition">
                    &nbsp;&nbsp;
                    <input {...register("imposedSpecificCondition")} type="radio" value="no" id="no" /> &nbsp; No
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.imposedSpecificCondition && errors?.imposedSpecificCondition?.message}
                  </h3>
                  {watch("imposedSpecificCondition") === "yes" && (
                    <div className="row gy-3">
                      <div className="col col-3 ">
                        <FormControl>
                          <h2>Condition</h2>
                          <input type="text" className="form-control" placeholder="" {...register("imposedCondition")} />
                        </FormControl>
                      </div>
                      <div className="col col-3 ">
                        <FormControl>
                          <h2>Compliance</h2>
                          <input type="text" className="form-control" placeholder="" {...register("imposedCompliance")} />
                        </FormControl>
                      </div>
                      <div className="col col-3 ">
                        <h2>Completed</h2>
                        <label htmlFor="imposedCompletedYes">
                          &nbsp;&nbsp;
                          <input {...register("imposedCompleted")} type="radio" value="yes" id="imposedCompletedYes" /> &nbsp; Yes
                        </label>
                        <label htmlFor="imposedCompletedNo">
                          &nbsp;&nbsp;
                          <input {...register("imposedCompleted")} type="radio" value="no" id="imposedCompletedNo" /> &nbsp; No
                        </label>
                      </div>
                    </div>
                  )}
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <h2>
                    Complaints/court cases pending if any.
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                  <label htmlFor=" courtCases">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input {...register("courtCases")} type="radio" value="yes" id="yes" /> &nbsp; Yes
                  </label>
                  <label htmlFor="courtCases">
                    &nbsp;&nbsp;
                    <input {...register("courtCases")} type="radio" value="no" id="no" /> &nbsp; No
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.courtCases && errors?.courtCases?.message}
                  </h3>
                  {/* {watch("courtCases") === "yes" && (
                    <div className="col md={4} xxl lg-4">
                      <FormControl>
                        <h2></h2>
                        <input type="text" className="form-control" placeholder="" />
                      </FormControl>
                    </div>
                  )} */}
                </div>
              </div>
              <div>
                <h2> Compliance of Rule 24, 26(2), 27 & 28 of Rules 1976 has been made </h2>
                <label htmlFor="complianceOfRule26">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input {...register("complianceOfRule26")} type="radio" value="yes" id="yes" /> &nbsp; Yes
                </label>
                <label htmlFor="complianceOfRule26">
                  &nbsp;&nbsp;
                  <input {...register("complianceOfRule26")} type="radio" value="no" id="no" /> &nbsp; No
                </label>
              </div>
              <div>
                <h2> Complied within time period </h2>
                <label htmlFor="compliedInTimePeriod">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input {...register("compliedInTimePeriod")} type="radio" value="yes" id="yes" /> &nbsp; Yes
                </label>
                <label htmlFor="compliedInTimePeriod">
                  &nbsp;&nbsp;
                  <input {...register("compliedInTimePeriod")} type="radio" value="no" id="no" /> &nbsp; No
                </label>
              </div>
              <div className="row mt-3">
                <div className="col col-6">
                  <h2>Whether DOD for OC Granted Area Filed</h2>
                  <label htmlFor="DODforOCAreayes">
                    &nbsp;&nbsp;
                    <input {...register("DODforOCArea")} type="radio" value="yes" id="DODforOCAreayes" /> &nbsp; Yes
                  </label>
                  <label htmlFor="DODforOCAreano">
                    &nbsp;&nbsp;
                    <input {...register("DODforOCArea")} type="radio" value="no" id="DODforOCAreano" /> &nbsp; No
                  </label>
                </div>
                {watch("DODforOCArea") == "yes" && (
                  <div className="row mt-2">
                    <div className="col col-5">
                      <h2>Within the prescribed time limit</h2>
                      <label htmlFor="withinTimeLimityes">
                        &nbsp;&nbsp;
                        <input {...register("withinTimeLimit")} type="radio" value="yes" id="withinTimeLimityes" /> &nbsp; Yes
                      </label>
                      <label htmlFor="withinTimeLimitno">
                        &nbsp;&nbsp;
                        <input {...register("withinTimeLimit")} type="radio" value="no" id="withinTimeLimitno" /> &nbsp; No
                      </label>
                    </div>
                    {watch("withinTimeLimit") == "yes" && (
                      <div className="col col-3">
                        <h2>
                          Upload Document <span style={{ color: "red" }}>*</span>
                        </h2>
                        <label>
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                          <input
                            type="file"
                            style={{ display: "none" }}
                            accept="application/pdf/jpeg/png"
                            onChange={(e) => getDocumentData(e?.target?.files[0], "prescribedTimeLimitDocument")}
                          />
                        </label>
                        {watch("prescribedTimeLimitDocument") && (
                          <a onClick={() => getDocShareholding(watch("prescribedTimeLimitDocument"), setLoader)} className="btn btn-sm ">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        )}
                      </div>
                    )}
                    {watch("withinTimeLimit") == "no" && (
                      <div className="col col-4">
                        <h2>Composition fee paid or not</h2>
                        <label htmlFor="compositionFeeyes">
                          &nbsp;&nbsp;
                          <input {...register("compositionFee")} type="radio" value="yes" id="compositionFeeyes" /> &nbsp; Yes
                        </label>
                        <label htmlFor="compositionFeeno">
                          &nbsp;&nbsp;
                          <input {...register("compositionFee")} type="radio" value="no" id="compositionFeeno" /> &nbsp; No
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="row mt-4">
                <div className="col md={4} xxl lg-4">
                  <h2 style={{ marginleft: "20px" }}>
                    <b> Status of OC with A or B depending type of purpose</b>
                  </h2>

                  <div className="row gy-3 mt-3">
                    <div className="col col-6">
                      <h2>
                        Whether OC/Part OC has been obtained
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                      <label htmlFor="renewalAppliedUnderSectionyes">
                        &nbsp;&nbsp;
                        <input {...register("obtainedOCPart")} type="radio" value="yes" id="renewalAppliedUnderSectionyes" /> &nbsp; Yes
                      </label>
                      <label htmlFor="renewalAppliedUnderSectionno">
                        &nbsp;&nbsp;
                        <input {...register("obtainedOCPart")} type="radio" value="no" id="renewalAppliedUnderSectionno" /> &nbsp; No
                      </label>
                    </div>
                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.obtainedOCPart && errors?.obtainedOCPart?.message}
                    </h3>
                    {watch("obtainedOCPart") == "yes" && (
                      <div className="row gy-3">
                        <div className="col col-5">
                          <div>
                            <h2>Covered Area (In sq meters)</h2>
                            <input
                              type="number"
                              className="form-control"
                              placeholder=""
                              {...register("coveredArea")}
                              required
                              minLength={1}
                              maxLength={8}
                            />
                          </div>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.coveredArea && errors?.coveredArea?.message}
                          </h3>
                        </div>
                        <div className="col col-4">
                          <div>
                            <h2>Proportionate Site Area in Acres</h2>
                            <input
                              type="number"
                              className="form-control"
                              placeholder=""
                              required
                              {...register("proportionateSiteArea")}
                              onChange={(e) => {
                                const val = watch("areaAcres") - e?.target?.value;
                                setValue("balanceSiteArea", val);
                              }}
                              minLength={1}
                              maxLength={8}
                            />
                          </div>
                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.proportionateSiteArea && errors?.proportionateSiteArea?.message}
                          </h3>
                        </div>
                        <div className="col col-4">
                          <div>
                            <h2>Balance Site Area(in acres)</h2>
                            <input type="number" className="form-control" placeholder="" required {...register("balanceSiteArea")} disabled />
                          </div>
                        </div>
                        <div className="col col-3">
                          <h2>
                            Upload OC Document <span style={{ color: "red" }}>*</span>
                          </h2>
                          <label>
                            <FileUpload style={{ cursor: "pointer" }} color="primary" />
                            <input
                              type="file"
                              style={{ display: "none" }}
                              accept="application/pdf/jpeg/png"
                              onChange={(e) => getDocumentData(e?.target?.files[0], "OCdocument")}
                            />
                          </label>
                          {watch("OCdocument") && (
                            <a onClick={() => getDocShareholding(watch("OCdocument"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="row gy-3 mt-3">
                    <div className="col col-6">
                      <h2>
                        Whether Part CC has been Obtained (Yes/No)
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                      <label htmlFor="obtainedCCPartyes">
                        &nbsp;&nbsp;
                        <input {...register("obtainedCCPart")} type="radio" value="yes" id="obtainedCCPartyes" /> &nbsp; Yes
                      </label>
                      <label htmlFor="obtainedCCPartno">
                        &nbsp;&nbsp;
                        <input {...register("obtainedCCPart")} type="radio" value="no" id="obtainedCCPartno" /> &nbsp; No
                      </label>
                    </div>
                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.obtainedCCPart && errors?.obtainedCCPart?.message}
                    </h3>
                    {watch("obtainedCCPart") == "yes" && (
                      <div className="row gy-3">
                        <div className="col col-5">
                          <div>
                            <h2>Site Area(in Acres)</h2>
                            <input
                              type="number"
                              className="form-control"
                              placeholder=""
                              {...register("siteArea")}
                              minLength={1}
                              maxLength={8}
                              onChange={(e) => {
                                const val = watch("areaAcres") - e?.target?.value;
                                setValue("balanceSiteArea", val);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col col-4">
                          <div>
                            <h2>Balance Site Area(in acres)</h2>
                            <input type="number" className="form-control" placeholder="" required {...register("balanceSiteArea")} disabled />
                          </div>
                        </div>
                        <div className="col col-3">
                          <h2>
                            Upload Part CC Document <span style={{ color: "red" }}>*</span>
                          </h2>
                          <label>
                            <FileUpload style={{ cursor: "pointer" }} color="primary" />
                            <input
                              type="file"
                              style={{ display: "none" }}
                              accept="application/pdf/jpeg/png"
                              onChange={(e) => getDocumentData(e?.target?.files[0], "CCdocument")}
                            />
                          </label>
                          {watch("CCdocument") && (
                            <a onClick={() => getDocShareholding(watch("CCdocument"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <h2 style={{ marginleft: "20px" }}>
                      
                      (2) Status of Part Completion
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Sr.No.
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Date of approval of Layout Plan
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Area in Acre
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }} colspan="2">
                            Part completion (entered granted area )
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Percent of total area
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>1</h2>
                            </label>
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input type="date" className="form-control" placeholder="" {...register("statusDate")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("areaInAcre")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("partCompletion")} />
                          </td>
                          <td>
                            <label>
                              <h2>Upload part Completion certificate</h2>
                              <ArrowCircleUpIcon style={{ textAlign: "center" }} color="primary" />
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("percentArea")} />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                </div> */}
              <br></br>
              {/* <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <h2 style={{ marginleft: "20px" }}>
                      
                      (3) Status of Community Sites
                      <span style={{ color: "red" }}>*</span>
                    </h2>

                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Sr.No.
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Type
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Area
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            Building Plan
                          </th>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            OC granized
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>1</h2>
                            </label>
                          </th>
                          <td style={{ textAlign: "center" }}>
                            <input type="date" className="form-control" placeholder="" {...register("type")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="text" className="form-control" placeholder="" {...register("area")} />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <label htmlFor=" buildingPlan">
                              
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <input {...register("buildingPlan")} type="radio" value="1" id="yes" /> &nbsp; Yes
                            </label>
                            <label htmlFor="buildingPlan">
                              &nbsp;&nbsp;
                              <input {...register("buildingPlan")} type="radio" value="2" id="no" /> &nbsp; No
                            </label>
                            {watch("buildingPlan") === "1" && (
                              <div className="row-12">
                                <div className="col md={4} xxl lg-12">
                                  <h2>Date</h2>

                                  <input type="date" className="form-control" placeholder="" {...register("date")} />
                                </div>
                              </div>
                            )}
                            {watch("buildingPlan") === "2" && (
                              <div className="row-12">
                                <div className="col md={4} xxl lg-12">
                                  <h2>Remark</h2>

                                  <input type="text" className="form-control" placeholder="" {...register("buildingRemark")} />
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            <label htmlFor=" ocGranized">
                              
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <input {...register("ocGranized")} type="radio" value="1" id="yes" /> &nbsp; Yes
                            </label>
                            <label htmlFor="ocGranized">
                              &nbsp;&nbsp;
                              <input {...register("ocGranized")} type="radio" value="2" id="no" onClick={handleClickOpen} /> &nbsp; No
                            </label>
                            {watch("ocGranized") === "1" && (
                              <div className="row-12">
                                <div className="col md={4} xxl lg-6">
                                  <FormControl>
                                    <h2>Remark</h2>

                                    <input type="date" className="form-control" placeholder="" {...register("ocRemark")} />
                                  </FormControl>
                                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                                  <FormControl>
                                    <h2>Till Date</h2>

                                    <input type="date" className="form-control" placeholder="" {...register("tillDate")} />
                                  </FormControl>
                                </div>
                              </div>
                            )}
                            {watch("ocGranized") === "2" && (
                              <div>
                                <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                                
                                  <DialogContent dividers>
                                    <Typography gutterBottom>
                                      <label>
                                        <h2>Valid upto</h2>
                                      </label>
                                      <input type="date" placeholder="" className="form-control" {...register("validUpto")} />
                                      <div>
                                        <h2>If out of date then redirect to extension of Cs.</h2>
                                      </div>
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
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                </div> */}
              <hr></hr>
              <br></br>
              {/* <div className="row-12">
                  <div className="col md={4} xxl lg-4">
                    <h2> Total number of EWS Plots/flats approved in the Layout Plan/Building Plan. </h2>
                    <br></br>
                    <FormControl>
                      <h2>No. of Plots/flats.</h2>
                      <input type="text" className="form-control" placeholder="" {...register("noOfFlats")} />
                    </FormControl>
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                    <FormControl>
                      <h2> Status of allotment and possession of Plot/Flats of EWS category. </h2>
                      <label htmlFor=" allotmentStatus">
                        
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("allotmentStatus")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>
                      <label htmlFor="allotmentStatus">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("allotmentStatus")} type="radio" value="2" id="no" /> &nbsp; No
                      </label>
                    </FormControl>
                  </div>
                </div> */}
              {/* {watch("allotmentStatus") === "1" && (
                  <div className="col md={4} xxl lg-12">
                    <FormControl>
                      <h2>Plot/Flats for which possession given. </h2>

                      <select className="form-control" {...register("flatPossession")}>
                        <option value=" ">Select value</option>
                        <option value="1">Within time</option>
                        <option value="2">Delayed</option>
                        <option value="2">NA</option>
                      </select>
                    </FormControl>
                  </div>
                )} */}
              <br></br>
              {/* {watch("flatPossession") === "2" && (
                  <div className="col md={4} xxl lg-12">
                    <h2>
                      Whether composition fee paid.
                      <label htmlFor=" compositionPaid">
                        
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("compositionPaid")} type="radio" value="1" id="yes" /> &nbsp; Yes
                      </label>
                      <label htmlFor="compositionPaid">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input {...register("compositionPaid")} type="radio" value="2" id="no" /> &nbsp; No
                      </label>
                    </h2>
                  </div>
                )} */}
              {/* {watch("compositionPaid") === "1" && (
                  <div className="col md={4} xxl lg-4">
                    <h2>Amount</h2>

                    <input type="text" placeholder="" className="form-control" {...register("compositionAmount")} />
                  </div>
                )} */}
              <div>
                <h2> Status of allotment of EWS Plots/Flats </h2>
                <label htmlFor="partiallyAllotted">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input {...register("plotAllotmentStatus")} type="radio" value="partiallyAllotted" id="partiallyAllotted" /> &nbsp; Partially
                  Allotted
                </label>
                <label htmlFor="alloted/transferred">
                  &nbsp;&nbsp;
                  <input {...register("plotAllotmentStatus")} type="radio" value="alloted/transferred" id="alloted/transferred" /> &nbsp;
                  Alloted/Transferred
                </label>
                <label htmlFor="yetToBeTransferred">
                  &nbsp;&nbsp;
                  <input {...register("plotAllotmentStatus")} type="radio" value="yetToBeTransferred" id="yetToBeTransferred" /> &nbsp; Yet to be
                  transferred
                </label>
                <label htmlFor="notApplicable">
                  &nbsp;&nbsp;
                  <input {...register("plotAllotmentStatus")} type="radio" value="notApplicable" id="notApplicable" /> &nbsp; Not applicable
                </label>
              </div>
              <br></br>
              <div className="row-12">
                <div className="col md={4} xxl lg-12">
                  <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          Sr.No.
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          Field Name
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          Upload Documents
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>1.</h2>
                            </label>
                          </th>
                          <td>
                            <label>
                              <h2>Upload the income tax clearance certifiate issued by the income tax officer.</h2>
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="file" className="form-control" placeholder="" {...register("uploadIncomeTax")} />
                          </td>
                        </tr> */}
                      {/* <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>2.</h2>
                            </label>
                          </th>
                          <td>
                            <label>
                              <h2>
                                Upload an explanatory note indicating the details of development works:which have been completed or are in progress or
                                are yet to be undertaken.
                              </h2>
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="file" className="form-control" placeholder="" {...register("uploadExplanatoryNote")} />
                          </td>
                        </tr> */}
                      <tr>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          <label>
                            <h2>1.</h2>
                          </label>
                        </th>
                        <td>
                          <label>
                            <h2>Status of development works completed at Site.</h2>
                          </label>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <label>
                            <FileUpload style={{ cursor: "pointer" }} color="primary" />
                            <input
                              type="file"
                              style={{ display: "none" }}
                              accept="application/pdf/jpeg/png"
                              onChange={(e) => getDocumentData(e?.target?.files[0], "uploadStatusDevelopment")}
                            />
                          </label>
                          {watch("uploadStatusDevelopment") && (
                            <a onClick={() => getDocShareholding(watch("uploadStatusDevelopment"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )}
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadStatusDevelopment")} /> */}
                        </td>
                      </tr>
                      {/* <tr>
                          <th className="fw-normal" style={{ textAlign: "center" }}>
                            <label>
                              <h2>4.</h2>
                            </label>
                          </th>
                          <td>
                            <label>
                              <h2>Old Licence for verification.</h2>
                            </label>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input type="file" className="form-control" placeholder="" {...register("uploadOldLicence")} />
                          </td>
                        </tr> */}
                    </tbody>
                  </div>
                </div>
              </div>
              <br></br>
              <div className="row-12">
                <div className="col md={4} xxl lg-4">
                  <FormControl>
                    <h2>
                      Amount <span style={{ color: "red" }}>*</span>
                    </h2>

                    <input type="text" className="form-control" placeholder="" readOnly {...register("oldAmount")} />
                  </FormControl>
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                  <FormControl>
                    <button type="submit" id="btnSearch" class="btn btn-success btn-md center-block" style={{ marginTop: "25px" }}>
                      Pay
                    </button>
                  </FormControl>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 text-right">
                  <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                    Submit
                  </button>
                </div>
                <div class="col-sm-12 text-right">
                  <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
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
    </div>
  );
}

export default renewalClu;
