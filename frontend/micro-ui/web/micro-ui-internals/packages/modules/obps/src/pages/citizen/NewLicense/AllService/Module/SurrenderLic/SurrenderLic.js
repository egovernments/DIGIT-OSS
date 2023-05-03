import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, MenuItem, Select } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import { FormHelperText, TextField } from "@mui/material";
import Spinner from "../../../../../../components/Loader";
import axios from "axios";
import CusToaster from "../../../../../../components/Toaster";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import SearchLicenceComp from "../../../../../../components/SearchLicence";
import Visibility from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import { getDocShareholding } from "../../../docView/docView.help";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function SurrenderLic() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [loader, setLoading] = useState(false);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const { t } = useTranslation();
  const { pathname: url } = useLocation();
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [licenseData, setLicenseData] = useState();
  const [successDialog, setSuccessDialog] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const handleselects = (event) => {
    const getu = event.target.value;
    setSelects(getu);
  };

  const handleClose = () => {
    setSuccessDialog(false);
    window.location.href = `/digit-ui/citizen`;
  };

  const getLicenseData = async () => {
    console.log("Request Id1 ====> ", params, params?.get("id"));
    // return;
    try {
      let id = params.get("id");
      setLoading(true);

      const requestData = {
        RequestInfo: {
          apiId: "Rainmaker",
          authToken: authToken,
          msgId: "1672136660039|en_IN",
          userInfo: userInfo,
        },
      };
      const response = await axios.post(`/tl-services/SurrendOfLicenseRequest/_search?applicationNumber=${id}`, requestData);
      console.log("Response ====> ", response);
      setLicenseData(response?.data?.surrendOfLicense?.[0]);
      const details = response?.data?.surrendOfLicense?.[0];
      setValue("licenceNo", details?.licenseNo);
      setValue("selectType", details?.selectType);
      setValue("areaFallingUnder", details?.areaFallingUnder);
      setValue("thirdPartyRights", details?.thirdPartyRights);
      setValue("reraRegistration", details?.areraRegistration);
      setValue("zoningLayoutPlanfileUrl", details?.zoningLayoutPlanfileUrl);
      setValue("licenseCopyfileUrl", details?.licenseCopyfileUrl);
      setValue("edcaVailedfileUrl", details?.edcaVailedfileUrl);
      setValue("detailedRelocationSchemefileUrl", details?.detailedRelocationSchemefileUrl);
      setValue("giftDeedfileUrl", details?.giftDeedfileUrl);
      setValue("mutationfileUrl", details?.mutationfileUrl);
      setValue("jamabandhifileUrl", details?.jamabandhifileUrl);
      setValue("thirdPartyRightsDeclarationfileUrl", details?.thirdPartyRightsDeclarationfileUrl);
      setValue("areaInAcres", details?.areaInAcres);
      setValue("declarationIDWWorksfileUrl", details?.declarationIDWWorksfileUrl);
      setValue("revisedLayoutPlanfileUrl", details?.revisedLayoutPlanfileUrl);
      setValue("availedEdcfileUrl", details?.availedEdcfileUrl);
      setValue("areaFallingUnderfileUrl", details?.areaFallingUnderfileUrl);
      setValue("areaFallingDividing", details?.areaFallingDividing);
      setLoading(false);
    } catch (error) {
      console.log("Get Error ====> ", error.message);
      setLoading(false);
      setShowToastError({ label: error.message, error: true, success: false });
    }
  };

  const uploadFile = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoading(false);
    try {
      setLoading(true);
      const Resp = await axios.post("/filestore/v1/files", formData, {}).then((response) => {
        return response;
      });
      setLoading(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });

      setValue(fieldName + "fileUrl", Resp?.data?.files?.[0]?.fileStoreId);
      // setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error?.response?.data?.Errors?.[0]?.description);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues,
    resetField,
  } = useForm({ reValidateMode: "onChange", mode: "onChange" });

  const SurrenderLic = async (data) => {
    console.log("REQUEST LOG1 ====> ", data, JSON.stringify(data));
    try {
      setLoading(true);
      const body = {
        RequestInfo: {
          apiId: "Rainmaker",
          ver: ".01",
          ts: null,
          action: "_update",
          did: "1",
          key: "",
          msgId: "20170310130900|en_IN",
          authToken: authToken,
          userInfo: userInfo,
        },
        SurrendOfLicense:
        {
          tenantId: "hr",
          action: "",
          licenseNo: data?.licenceNo,
          selectType: data?.selectType,
          areaFallingUnder: data?.areaFallingUnder,
          thirdPartyRights: data?.thirdPartyRights,
          areraRegistration: data?.reraRegistration,
          zoningLayoutPlanfileUrl: data?.zoningLayoutPlanfileUrl,
          licenseCopyfileUrl: data?.licenseCopyfileUrl,
          edcaVailedfileUrl: data?.edcaVailedfileUrl,
          detailedRelocationSchemefileUrl: data?.detailedRelocationSchemefileUrl,
          giftDeedfileUrl: data?.giftDeedfileUrl,
          mutationfileUrl: data?.mutationfileUrl,
          jamabandhifileUrl: data?.jamabandhifileUrl,
          thirdPartyRightsDeclarationfileUrl: data?.thirdPartyRightsDeclarationfileUrl,
          areaInAcres: data?.areaInAcres,
          declarationIDWWorksfileUrl: data?.declarationIDWWorksfileUrl,
          revisedLayoutPlanfileUrl: data?.revisedLayoutPlanfileUrl,
          availedEdcfileUrl: data?.availedEdcfileUrl,
          areaFallingUnderfileUrl: data?.areaFallingUnderfileUrl,
          areaFallingDividing: data?.areaFallingDividing,
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
        },
      };

      const response = await axios.post("/tl-services/SurrendOfLicenseRequest/_create", body);

      console.log("Submit Response ====> ", response);

      setLoading(false);

      if (response?.data?.surrendOfLicense?.length) {
        setShowToastError({ label: "Surrender of License submitted successfully", error: false, success: true });
        setSuccessDialog(true);
        setApplicationNumber(response?.data?.surrendOfLicense?.[0]?.applicationNumber || "");
      } else {
        setShowToastError({ label: response?.data?.message, error: true, success: false });
      }
    } catch (err) {
      console.log("Submit Error ====> ", err.message);
      setLoading(false);
      setShowToastError({ label: err.message, error: true, success: false });
    }
  };

  const UpdateSurrenderLic = async (data) => {
    console.log("REQUEST LOG1 ====> ", data, JSON.stringify(data));
    try {
      setLoading(true);
      const body = {
        RequestInfo: {
          apiId: "Rainmaker",
          ver: ".01",
          ts: null,
          action: "_update",
          did: "1",
          key: "",
          msgId: "20170310130900|en_IN",
          authToken: authToken,
          userInfo: userInfo,
        },
        SurrendOfLicense: [
          {
            ...licenseData,
            tenantId: "hr",
            action: "",
            licenseNo: data?.licenceNo,
            selectType: data?.selectType,
            areaFallingUnder: data?.areaFallingUnder,
            thirdPartyRights: data?.thirdPartyRights,
            areraRegistration: data?.reraRegistration,
            zoningLayoutPlanfileUrl: data?.zoningLayoutPlanfileUrl,
            licenseCopyfileUrl: data?.licenseCopyfileUrl,
            edcaVailedfileUrl: data?.edcaVailedfileUrl,
            detailedRelocationSchemefileUrl: data?.detailedRelocationSchemefileUrl,
            giftDeedfileUrl: data?.giftDeedfileUrl,
            mutationfileUrl: data?.mutationfileUrl,
            jamabandhifileUrl: data?.jamabandhifileUrl,
            thirdPartyRightsDeclarationfileUrl: data?.thirdPartyRightsDeclarationfileUrl,
            areaInAcres: data?.areaInAcres,
            declarationIDWWorksfileUrl: data?.declarationIDWWorksfileUrl,
            revisedLayoutPlanfileUrl: data?.revisedLayoutPlanfileUrl,
            availedEdcfileUrl: data?.availedEdcfileUrl,
            areaFallingUnderfileUrl: data?.areaFallingUnderfileUrl,
            areaFallingDividing: data?.areaFallingDividing,
          },
        ],
      };

      const response = await axios.post("/tl-services/SurrendOfLicenseRequest/_update", body);

      console.log("Update Response ====> ", response);

      setLoading(false);
      setShowToastError({ label: "Surrender of License updated successfully", error: false, success: true });
      handleClose();
    } catch (err) {
      console.log("Update Error ====> ", err.message);
      setLoading(false);
      setShowToastError({ label: err.message, error: true, success: false });
    }
  };

  const submitForm = (data) => {
    if (params.get("id")) {
      UpdateSurrenderLic(data);
    } else {
      SurrenderLic(data);
    }
  };

  useEffect(() => {
    // if(id){
    getLicenseData();
    // }
  }, []);

  return (
    <form onSubmit={handleSubmit(submitForm)}>
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
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
          {`${t("SURRENDER_OF_LICENSE")}`}
        </h4>
        <div className="card">
          <br></br>
          <div className="col-12 p-3">
            <SearchLicenceComp
              watch={watch}
              register={register}
              control={control}
              setLoader={setLoading}
              errors={errors}
              setValue={setValue}
              resetField={resetField}
            />
          </div>
          <div className="row-12 gy-3">

            <div className="col col-3 ">
              <h2>
                {`${t("SELECT_TYPE_COMPLETE_OR_PARTIAL")}`} <span style={{ color: "red" }}>*</span>
              </h2>
              <select className="form-control"
                name="selectType"
                labelId="select-label"
                id="select-field"
                {...register("selectType", {
                  required: "At least one should be selected",
                })}
                value={watch("selectType") || ""}>
                <option value=" ">----Select value-----</option>
                <option value="COMPLETE" >COMPLETE</option>
                <option value="PARTIAL" >PARTIAL</option>
              </select>
              <FormHelperText error={Boolean(errors?.selectType)}>{errors?.selectType?.message}</FormHelperText>
            </div>

            <div className="col md={4} xxl lg-4">

              {/* <FormControl>
                <InputLabel id="select-label">
                  {`${t("SELECT_TYPE_COMPLETE_OR_PARTIAL")}`} <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Select
                  // variant="outlined"
                  name="selectType"
                  labelId="select-label"
                  id="select-field"
                  {...register("selectType", {
                    required: "At least one should be selected",
                  })}
                  value={watch("selectType") || ""}
                  // onChange={(e) => handleshowhide(e)}
                  error={errors.selectType !== undefined}
                // input ={<TextField label="Select Type (Complete or Partial) *" variant="standard" value={"COMPLETE"} />}
                >
                  <MenuItem style={{ padding: "12px" }} value="COMPLETE">{`${t("COMPLETE")}`}</MenuItem>
                  <MenuItem style={{ padding: "12px" }} value="PARTIAL">{`${t("PARTIAL")}`}</MenuItem>
                </Select>
                <FormHelperText error={Boolean(errors?.selectType)}>{errors?.selectType?.message}</FormHelperText>
              </FormControl> */}
              {/* <FormControl>
                <h2 className="FormLable">
                  {" "}
                  Select Type (Complete or Partial) <span style={{ color: "red" }}>*</span>
                </h2>

                <select className="Inputcontrol error" class="form-control" {...register("selectType", {
                  required: "At least one should be selected"
                })} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">(a)Complete</option>
                  <option value="2">(b) Partial</option>
                </select>

                <FormHelperText error={Boolean(errors?.selectType)}>
                  {errors?.selectType?.message}
                </FormHelperText>

              </FormControl> */}
            </div>
            <div>
              {watch("selectType") === "PARTIAL" && (
                <div className="row-12">
                  <div className="col col-4 ">
                    <FormControl>
                      <InputLabel id="select-label">
                        {`${t("AREA_IN_ACRES")}`} <span style={{ color: "red" }}>*</span>
                      </InputLabel>

                      <TextField
                        variant="standard"
                        placeholder=""
                        className="Inputcontrol"
                        {...register("areaInAcres", {
                          required: "This field cannot be blank",
                          validate: {
                            min: (value) => Number(value) > 0 || "Area in Acres should be minimum 1",
                            max: (value) => Number(value) <= 10 || "Area in Acres should be maximum 10",
                          },
                        })}
                        error={Boolean(errors?.areaInAcres)}
                      />
                      <FormHelperText error={Boolean(errors?.areaInAcres)}>{errors?.areaInAcres?.message}</FormHelperText>
                    </FormControl>
                  </div>
                </div>
              )}
            </div>
            <div className="row-12">
              <div className="col col-12 ">
                <h6>
                  {`${t("AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD")}`} <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  <label htmlFor="areaFallingUnder">
                    <input
                      type="radio"
                      value="yes"
                      label="Yes"
                      name="areaFallingUnder"
                      id="areaFallingUnder"
                      {...register("areaFallingUnder", {
                        required: "Please Select (Yes/No)",
                      })}
                      onChange={(e) => handleselects(e)}
                    />
                    &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                  </label>
                  <label htmlFor="areaFallingUnder">
                    <input
                      type="radio"
                      value="no"
                      label="No"
                      name="areaFallingUnder"
                      id="areaFallingUnder"
                      {...register("areaFallingUnder", {
                        required: "Please Select (Yes/No)",
                      })}
                      onChange={(e) => handleselects(e)}
                    />
                    &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.areaFallingUnder && errors?.areaFallingUnder?.message}
                  </h3>
                </h6>
              </div>
            </div>

            <div className="row-12">
              <div className="col col-12 ">
                <h6>
                  {`${t("THIRD_PARTY_RIGHTS_CREATED")}`} <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  <label htmlFor="thirdPartyRights">
                    <input
                      type="radio"
                      value="yes"
                      label="Yes"
                      name="thirdPartyRights"
                      id="thirdPartyRights"
                      {...register("thirdPartyRights", {
                        required: "Please Select (Yes/No)",
                      })}
                    />
                    &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                  </label>
                  <label htmlFor="thirdPartyRights">
                    <input
                      type="radio"
                      value="no"
                      label="No"
                      name="thirdPartyRights"
                      id="thirdPartyRights"
                      {...register("thirdPartyRights", {
                        required: "Please Select (Yes/No)",
                      })}
                    />
                    &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.thirdPartyRights && errors?.thirdPartyRights?.message}
                  </h3>
                </h6>
              </div>
            </div>

            <div className="row-12">
              <div className="col col-12 ">
                <h6>
                  {`${t("RERA_REGISTRATION_OF_PROJECT")}`} <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                  <label htmlFor="reraRegistration">
                    <input
                      type="radio"
                      label="Yes"
                      name="reraRegistration"
                      id="reraRegistration"
                      value="yes"
                      {...register("reraRegistration", {
                        required: "Please Select (Yes/No)",
                      })}
                      onChange={(e) => handleselects(e)}
                    />
                    &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                  </label>
                  <label htmlFor="reraRegistration">
                    <input
                      type="radio"
                      label="No"
                      name="reraRegistration"
                      id="reraRegistration"
                      value="no"
                      {...register("reraRegistration", {
                        required: "Please Select (Yes/No)",
                      })}
                      onChange={(e) => handleselects(e)}
                    />
                    &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                  </label>
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.reraRegistration && errors?.reraRegistration?.message}
                  </h3>
                </h6>
              </div>
            </div>

            <div className="row-12">
              <div>
                {watch("selectType") === "COMPLETE" && (
                  //  <div className="card">
                  <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          {`${t("SR_NO")}`}
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          {`${t("FIELD_NAME")}`}
                        </th>
                        <th className="fw-normal" style={{ textAlign: "center" }}>
                          {`${t("UPLOAD_DOCUMENTS")}`}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="fw-normal">1</th>
                        <td>
                          {" "}
                          {`${t("APPROVED_COPY_OF_ZONING_PLAN")}`} <span style={{ color: "red" }}>*</span>
                          {watch("zoningLayoutPlanfileUrl") && (
                            <div>
                              <small>File Uploaded</small>
                            </div>
                          )}
                        </td>


                        <td>
                          {
                            watch("zoningLayoutPlan") ?
                              (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'zoningLayoutPlan'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'zoningLayoutPlan'} />
                                  </label>

                                  <input id="zoningLayoutPlan" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "zoningLayoutPlan")} ></input>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.zoningLayoutPlan && errors?.zoningLayoutPlan?.message}
                                  </h3>

                                  {watch('zoningLayoutPlanfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('zoningLayoutPlanfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                </div>
                              ) : (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'zoningLayoutPlan'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'zoningLayoutPlan'} />
                                  </label>

                                  <input id="zoningLayoutPlan" type="file" placeholder="" className="form-control d-none" {...register("zoningLayoutPlan", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "zoningLayoutPlan")} ></input>
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.zoningLayoutPlan && errors?.zoningLayoutPlan?.message}
                                  </h3>

                                  {watch('zoningLayoutPlanfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('zoningLayoutPlanfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}
                                </div>
                              )
                          }
                        </td>

                      </tr>
                      <tr>
                        <th className="fw-normal">2</th>
                        <td>
                          {" "}
                          {`${t("LICENSE_COPY")}`} <span style={{ color: "red" }}>*</span>
                          {watch("licenseCopyfileUrl") && (
                            <div>
                              <small>File Uploaded</small>
                            </div>
                          )}
                        </td>


                        <td>
                          {
                            watch("licenseCopy") ?
                              (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'licenseCopy'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'licenseCopy'} />
                                  </label>

                                  <input id="licenseCopy" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "licenseCopy")} ></input>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.licenseCopy && errors?.licenseCopy?.message}
                                  </h3>

                                  {watch('licenseCopyfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('licenseCopyfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                </div>
                              ) : (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'licenseCopy'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'licenseCopy'} />
                                  </label>

                                  <input id="licenseCopy" type="file" placeholder="" className="form-control d-none" {...register("licenseCopy", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "licenseCopy")} ></input>
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.licenseCopy && errors?.licenseCopy?.message}
                                  </h3>

                                  {watch('licenseCopyfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('licenseCopyfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}
                                </div>
                              )
                          }
                        </td>

                      </tr>
                      <tr>
                        <th className="fw-normal">3</th>
                        <td>
                          {" "}
                          {`${t("EDC_AVAILED")}`}
                          <span style={{ color: "red" }}>*</span>
                          {watch("edcaVailedfileUrl") && (
                            <div>
                              <small>File Uploaded</small>
                            </div>
                          )}
                        </td>


                        <td>
                          {
                            watch("edcaVailed") ?
                              (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'edcaVailed'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'edcaVailed'} />
                                  </label>

                                  <input id="edcaVailed" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "edcaVailed")} ></input>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.edcaVailed && errors?.edcaVailed?.message}
                                  </h3>

                                  {watch('edcaVailedfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('edcaVailedfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                </div>
                              ) : (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'edcaVailed'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'edcaVailed'} />
                                  </label>

                                  <input id="edcaVailed" type="file" placeholder="" className="form-control d-none" {...register("edcaVailed", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "edcaVailed")} ></input>
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.edcaVailed && errors?.edcaVailed?.message}
                                  </h3>

                                  {watch('edcaVailedfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('edcaVailedfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}
                                </div>
                              )
                          }
                        </td>


                      </tr>

                      {watch("thirdPartyRights") === "no" && (
                        <tr>
                          <th className="fw-normal">4</th>
                          <td>
                            {`${t("DECLARATION_OF_THIRD_PARTY_RIGHTS")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("thirdPartyRightsDeclarationfileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>


                          <td>
                            {
                              watch("thirdPartyRightsDeclaration") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'thirdPartyRightsDeclaration'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'thirdPartyRightsDeclaration'} />
                                    </label>

                                    <input id="thirdPartyRightsDeclaration" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "thirdPartyRightsDeclaration")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.thirdPartyRightsDeclaration && errors?.thirdPartyRightsDeclaration?.message}
                                    </h3>

                                    {watch('thirdPartyRightsDeclarationfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('thirdPartyRightsDeclarationfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'thirdPartyRightsDeclaration'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'thirdPartyRightsDeclaration'} />
                                    </label>

                                    <input id="thirdPartyRightsDeclaration" type="file" placeholder="" className="form-control d-none" {...register("thirdPartyRightsDeclaration", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "thirdPartyRightsDeclaration")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.thirdPartyRightsDeclaration && errors?.thirdPartyRightsDeclaration?.message}
                                    </h3>

                                    {watch('thirdPartyRightsDeclarationfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('thirdPartyRightsDeclarationfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>

                        </tr>
                      )}

                      {watch("thirdPartyRights") === "yes" && (
                        <tr>
                          <th className="fw-normal">4</th>
                          <td>
                            {`${t("DETAILED_SCHEME_OF_RELOCATION")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("detailedRelocationSchemefileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>



                          <td>
                            {
                              watch("detailedRelocationScheme") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'detailedRelocationScheme'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'detailedRelocationScheme'} />
                                    </label>

                                    <input id="detailedRelocationScheme" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "detailedRelocationScheme")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.detailedRelocationScheme && errors?.detailedRelocationScheme?.message}
                                    </h3>

                                    {watch('detailedRelocationSchemefileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('detailedRelocationSchemefileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'detailedRelocationScheme'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'detailedRelocationScheme'} />
                                    </label>

                                    <input id="detailedRelocationScheme" type="file" placeholder="" className="form-control d-none" {...register("detailedRelocationScheme", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "detailedRelocationScheme")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.thirdPartyRightsDeclaration && errors?.detailedRelocationScheme?.message}
                                    </h3>

                                    {watch('detailedRelocationSchemefileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('detailedRelocationSchemefileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>



                        </tr>
                      )}

                      <tr>
                        <th className="fw-normal">{watch("thirdPartyRights") ? "5" : "4"}</th>
                        <td>
                          {" "}
                          {`${t("AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT")}`} <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <fieldset>
                            <div className="row-12">
                              <div className="col col-12 ">
                                <label htmlFor="areaFalling">
                                  <input
                                    type="radio"
                                    label="Yes"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                    value="yes"
                                    onChange={(e) => handleselects(e)}
                                    {...register("areaFallingDividing", { required: "Please Select (Yes/No)" })}
                                  />
                                  &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                                </label>
                                <label htmlFor="areaFalling">
                                  <input
                                    type="radio"
                                    label="No"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                    value="no"
                                    onChange={(e) => handleselects(e)}
                                    {...register("areaFallingDividing", { required: "Please Select (Yes/No)" })}
                                  />
                                  &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                                </label>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.areaFallingDividing && errors?.areaFallingDividing?.message}
                                </h3>
                              </div>
                            </div>
                          </fieldset>
                        </td>
                      </tr>
                    </tbody>
                    {/* {selects}efewfwefwef */}
                    {watch("areaFallingDividing") === "yes" && (
                      // <table class="table">
                      <tbody>
                        <tr>
                          <th className="fw-normal">{watch("thirdPartyRights") ? "6" : "5"}</th>
                          <td>
                            {" "}
                            {`${t("GIFT_DEED")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("giftDeedfileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>



                          <td>
                            {
                              watch("giftDeed") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'giftDeed'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'giftDeed'} />
                                    </label>

                                    <input id="giftDeed" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "giftDeed")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.giftDeed && errors?.giftDeed?.message}
                                    </h3>

                                    {watch('giftDeedfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('giftDeedfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'giftDeed'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'giftDeed'} />
                                    </label>

                                    <input id="giftDeed" type="file" placeholder="" className="form-control d-none" {...register("giftDeed", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "giftDeed")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.giftDeed && errors?.giftDeed?.message}
                                    </h3>

                                    {watch('giftDeedfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('giftDeedfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>



                        </tr>
                        <tr>
                          <th className="fw-normal">{watch("thirdPartyRights") ? "7" : "6"}</th>
                          <td>
                            {" "}
                            {`${t("MUTATION")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("mutationfileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>



                          <td>
                            {
                              watch("mutation") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'mutation'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'mutation'} />
                                    </label>

                                    <input id="mutation" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "mutation")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.mutation && errors?.mutation?.message}
                                    </h3>

                                    {watch('mutationfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('mutationfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'mutation'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'mutation'} />
                                    </label>

                                    <input id="mutation" type="file" placeholder="" className="form-control d-none" {...register("mutation", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "mutation")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.mutation && errors?.mutation?.message}
                                    </h3>

                                    {watch('mutationfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('mutationfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>

                        </tr>
                        <tr>
                          <th className="fw-normal">{watch("thirdPartyRights") ? "8" : "7"}</th>
                          <td>
                            {" "}
                            {`${t("JAMABANDHI")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("jamabandhifileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>



                          <td>
                            {
                              watch("jamabandhi") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'jamabandhi'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'jamabandhi'} />
                                    </label>

                                    <input id="jamabandhi" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "jamabandhi")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.jamabandhi && errors?.jamabandhi?.message}
                                    </h3>

                                    {watch('jamabandhifileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('jamabandhifileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'jamabandhi'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'jamabandhi'} />
                                    </label>

                                    <input id="jamabandhi" type="file" placeholder="" className="form-control d-none" {...register("jamabandhi", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "jamabandhi")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.jamabandhi && errors?.jamabandhi?.message}
                                    </h3>

                                    {watch('jamabandhifileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('jamabandhifileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>


                        </tr>
                      </tbody>
                      // </table>
                    )}
                  </div>
                  // </div>
                )}
              </div>

              <div>
                {watch("selectType") === "PARTIAL" && (
                  // <div className="card">
                  <div className="table table-bordered table-responsive">
                    {/* <caption>List of users</caption> */}
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }}>{`${t("SR_NO")}`}</th>
                        <th style={{ textAlign: "center" }}> {`${t("FIELD_NAME")}`}</th>
                        <th style={{ textAlign: "center" }}> {`${t("UPLOAD_DOCUMENTS")}`}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="fw-normal">1</th>
                        <td>
                          {" "}
                          {`${t("DECLARATION_IDW_WORKS")}`}
                          <span style={{ color: "red" }}>*</span>
                          {watch("declarationIDWWorksfileUrl") && (
                            <div>
                              <small>File Uploaded</small>
                            </div>
                          )}
                        </td>


                        <td>
                          {
                            watch("declarationIDWWorks") ?
                              (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'declarationIDWWorks'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'declarationIDWWorks'} />
                                  </label>

                                  <input id="declarationIDWWorks" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "declarationIDWWorks")} ></input>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.declarationIDWWorks && errors?.declarationIDWWorks?.message}
                                  </h3>

                                  {watch('declarationIDWWorksfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('declarationIDWWorksfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                </div>
                              ) : (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'declarationIDWWorks'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'declarationIDWWorks'} />
                                  </label>

                                  <input id="declarationIDWWorks" type="file" placeholder="" className="form-control d-none" {...register("declarationIDWWorks", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "declarationIDWWorks")} ></input>
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.declarationIDWWorks && errors?.declarationIDWWorks?.message}
                                  </h3>

                                  {watch('declarationIDWWorksfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('declarationIDWWorksfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}
                                </div>
                              )
                          }
                        </td>


                      </tr>
                      <tr>
                        <th className="fw-normal">2</th>
                        <td>
                          {" "}
                          {`${t("REVISED_LAYOUT_PLAN")}`}
                          <span style={{ color: "red" }}>*</span>
                          {watch("revisedLayoutPlanfileUrl") && (
                            <div>
                              <small>File Uploaded</small>
                            </div>
                          )}
                        </td>



                        <td>
                          {
                            watch("revisedLayoutPlan") ?
                              (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'revisedLayoutPlan'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'revisedLayoutPlan'} />
                                  </label>

                                  <input id="revisedLayoutPlan" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "revisedLayoutPlan")} ></input>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.revisedLayoutPlan && errors?.revisedLayoutPlan?.message}
                                  </h3>

                                  {watch('revisedLayoutPlanfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('revisedLayoutPlanfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                </div>
                              ) : (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'revisedLayoutPlan'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'revisedLayoutPlan'} />
                                  </label>

                                  <input id="revisedLayoutPlan" type="file" placeholder="" className="form-control d-none" {...register("revisedLayoutPlan", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "revisedLayoutPlan")} ></input>
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.revisedLayoutPlan && errors?.revisedLayoutPlan?.message}
                                  </h3>

                                  {watch('revisedLayoutPlanfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('revisedLayoutPlanfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}
                                </div>
                              )
                          }
                        </td>


                      </tr>
                      <tr>
                        <th className="fw-normal">3</th>
                        <td>
                          {" "}
                          {`${t("EDC_AVAILED")}`}
                          <span style={{ color: "red" }}>*</span>
                          {watch("availedEdcfileUrl") && (
                            <div>
                              <small>File Uploaded</small>
                            </div>
                          )}
                        </td>


                        <td>
                          {
                            watch("availedEdc") ?
                              (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'availedEdc'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'availedEdc'} />
                                  </label>

                                  <input id="availedEdc" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "availedEdc")} ></input>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.availedEdc && errors?.availedEdc?.message}
                                  </h3>

                                  {watch('availedEdcfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('availedEdcfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                </div>
                              ) : (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'availedEdc'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'availedEdc'} />
                                  </label>

                                  <input id="availedEdc" type="file" placeholder="" className="form-control d-none" {...register("availedEdc", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "availedEdc")} ></input>
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.availedEdc && errors?.availedEdc?.message}
                                  </h3>

                                  {watch('availedEdcfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('availedEdcfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}
                                </div>
                              )
                          }
                        </td>



                      </tr>
                      <tr>
                        <th className="fw-normal">4</th>
                        <td>
                          {" "}
                          {`${t("AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD")}`} <span style={{ color: "red" }}>*</span>
                          {watch("areaFallingUnderfileUrl") && (
                            <div>
                              <small>File Uploaded</small>
                            </div>
                          )}
                        </td>


                        <td>
                          {
                            watch("areaFallingUnder") ?
                              (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'areaFallingUnder'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'areaFallingUnder'} />
                                  </label>

                                  <input id="areaFallingUnder" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "areaFallingUnder")} ></input>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.areaFallingUnder && errors?.areaFallingUnder?.message}
                                  </h3>

                                  {watch('areaFallingUnderfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('areaFallingUnderfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                </div>
                              ) : (
                                <div className="d-flex justify-content-center">

                                  <label title="Upload Document" for={'areaFallingUnder'}>
                                    {" "}
                                    <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'areaFallingUnder'} />
                                  </label>

                                  <input id="areaFallingUnder" type="file" placeholder="" className="form-control d-none" {...register("areaFallingUnder", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "areaFallingUnder")} ></input>
                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.areaFallingUnder && errors?.areaFallingUnder?.message}
                                  </h3>

                                  {watch('areaFallingUnderfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('areaFallingUnderfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}
                                </div>
                              )
                          }
                        </td>

                      </tr>

                      {watch("thirdPartyRights") === "no" && (
                        <tr>
                          <th className="fw-normal">5</th>
                          <td>
                            {`${t("DECLARATION_OF_THIRD_PARTY_RIGHTS")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("thirdPartyRightsDeclarationfileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>




                          <td>
                            {
                              watch("thirdPartyRightsDeclaration") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'thirdPartyRightsDeclaration'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'thirdPartyRightsDeclaration'} />
                                    </label>

                                    <input id="areaFallingUnder" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "thirdPartyRightsDeclaration")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.thirdPartyRightsDeclaration && errors?.thirdPartyRightsDeclaration?.message}
                                    </h3>

                                    {watch('thirdPartyRightsDeclarationfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('thirdPartyRightsDeclarationfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'thirdPartyRightsDeclaration'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'thirdPartyRightsDeclaration'} />
                                    </label>

                                    <input id="thirdPartyRightsDeclaration" type="file" placeholder="" className="form-control d-none" {...register("thirdPartyRightsDeclaration", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "thirdPartyRightsDeclaration")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.thirdPartyRightsDeclaration && errors?.thirdPartyRightsDeclaration?.message}
                                    </h3>

                                    {watch('thirdPartyRightsDeclarationfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('thirdPartyRightsDeclarationfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>


                        </tr>
                      )}

                      {watch("thirdPartyRights") === "yes" && (
                        <tr>
                          <th className="fw-normal">5</th>
                          <td>
                            {`${t("DETAILED_SCHEME_OF_RELOCATION")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("detailedRelocationSchemefileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>



                          <td>
                            {
                              watch("detailedRelocationScheme") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'detailedRelocationScheme'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'detailedRelocationScheme'} />
                                    </label>

                                    <input id="areaFallingUnder" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "detailedRelocationScheme")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.detailedRelocationScheme && errors?.detailedRelocationScheme?.message}
                                    </h3>

                                    {watch('detailedRelocationSchemefileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('detailedRelocationSchemefileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'detailedRelocationScheme'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'detailedRelocationScheme'} />
                                    </label>

                                    <input id="detailedRelocationScheme" type="file" placeholder="" className="form-control d-none" {...register("detailedRelocationScheme", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "detailedRelocationScheme")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.detailedRelocationScheme && errors?.detailedRelocationScheme?.message}
                                    </h3>

                                    {watch('detailedRelocationSchemefileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('detailedRelocationSchemefileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>

                        </tr>
                      )}

                      <tr>
                        <th className="fw-normal">{watch("thirdPartyRights") ? "6" : "5"}</th>
                        <td>
                          {" "}
                          {`${t("AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT")}`} <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <fieldset>
                            <div className="row-12">
                              <div className="col col-12 ">
                                <label htmlFor="areaFalling">
                                  <input
                                    type="radio"
                                    label="Yes"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                    value="yes"
                                    onChange={(e) => handleselects(e)}
                                    {...register("areaFallingDividing", { required: "Please Select (Yes/No)" })}
                                  />
                                  &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                                </label>
                                <label htmlFor="areaFalling">
                                  <input
                                    type="radio"
                                    label="No"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                    value="no"
                                    onChange={(e) => handleselects(e)}
                                    {...register("areaFallingDividing", { required: "Please Select (Yes/No)" })}
                                  />
                                  &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                                </label>
                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.areaFallingDividing && errors?.areaFallingDividing?.message}
                                </h3>
                              </div>
                            </div>
                          </fieldset>
                        </td>
                      </tr>
                    </tbody>

                    {watch("areaFallingDividing") === "yes" && (
                      <tbody>
                        <tr>
                          <th className="fw-normal">{watch("thirdPartyRights") ? "7" : "6"}</th>
                          <td>
                            {" "}
                            {`${t("GIFT_DEED")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("giftDeedfileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>


                          <td>
                            {
                              watch("giftDeed") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'giftDeed'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'giftDeed'} />
                                    </label>

                                    <input id="areaFallingUnder" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "giftDeed")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.giftDeed && errors?.giftDeed?.message}
                                    </h3>

                                    {watch('giftDeedfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('giftDeedfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'giftDeed'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'giftDeed'} />
                                    </label>

                                    <input id="giftDeed" type="file" placeholder="" className="form-control d-none" {...register("giftDeed", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "giftDeed")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.giftDeed && errors?.giftDeed?.message}
                                    </h3>

                                    {watch('giftDeedfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('giftDeedfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>

                        </tr>
                        <tr>
                          <th className="fw-normal">{watch("thirdPartyRights") ? "8" : "7"}</th>
                          <td>
                            {" "}
                            {`${t("MUTATION")}`}
                            <span style={{ color: "red" }}>*</span>
                            {watch("mutationfileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>


                          <td>
                            {
                              watch("mutation") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'mutation'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'mutation'} />
                                    </label>

                                    <input id="areaFallingUnder" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "mutation")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.mutation && errors?.mutation?.message}
                                    </h3>

                                    {watch('mutationfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('mutationfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'mutation'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'mutation'} />
                                    </label>

                                    <input id="mutation" type="file" placeholder="" className="form-control d-none" {...register("mutation", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "mutation")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.mutation && errors?.mutation?.message}
                                    </h3>

                                    {watch('mutationfileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('mutationfileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>

                        </tr>
                        <tr>
                          <th className="fw-normal">{watch("thirdPartyRights") ? "9" : "8"}</th>
                          <td>
                            {" "}
                            {`${t("JAMABANDHI")}`} <span style={{ color: "red" }}>*</span>
                            {watch("jamabandhifileUrl") && (
                              <div>
                                <small>File Uploaded</small>
                              </div>
                            )}
                          </td>


                          <td>
                            {
                              watch("jamabandhi") ?
                                (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'jamabandhi'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'jamabandhi'} />
                                    </label>

                                    <input id="areaFallingUnder" type="file" placeholder="" className="form-control d-none" onChange={(e) => uploadFile(e.target.files[0], "jamabandhi")} ></input>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.jamabandhi && errors?.jamabandhi?.message}
                                    </h3>

                                    {watch('jamabandhifileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('jamabandhifileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}

                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center">

                                    <label title="Upload Document" for={'jamabandhi'}>
                                      {" "}
                                      <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={'jamabandhi'} />
                                    </label>

                                    <input id="jamabandhi" type="file" placeholder="" className="form-control d-none" {...register("jamabandhi", { required: "This Document is required" })} onChange={(e) => uploadFile(e.target.files[0], "jamabandhi")} ></input>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.jamabandhi && errors?.jamabandhi?.message}
                                    </h3>

                                    {watch('jamabandhifileUrl') && (
                                      <a onClick={() => getDocShareholding(watch('jamabandhifileUrl'), setLoading)} className="btn btn-sm ">
                                        <Visibility color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                                )
                            }
                          </td>

                        </tr>
                      </tbody>
                    )}
                  </div>
                  //   </div>
                  // </div>
                )}
              </div>
            </div>

            <div class="row">
              <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Submit
                </button>
              </div>
              {/* <div class="col-sm-12 text-right">
                <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                  Save as Draft
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={successDialog} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Surrender of License Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Your Surrender of License is submitted successfully{" "}
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
    </form>
  );
}

export default SurrenderLic;
