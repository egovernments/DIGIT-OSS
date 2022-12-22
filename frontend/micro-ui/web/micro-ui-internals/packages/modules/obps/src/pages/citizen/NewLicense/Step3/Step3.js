import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import { Checkbox } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import FileUpload from "@mui/icons-material/FileUpload";
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

const LandScheduleForm = (props) => {
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });
  const [getPotentialOptons, setPotentialOptions] = useState({ data: [], isLoading: true });
  const [typeOfLand, setYypeOfLand] = useState({ data: [], isLoading: true });
  const [loader, setLoader] = useState(false);

  const stateId = Digit.ULBService.getStateId();
  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);

  const { data: LandData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["LandType"]);

  const { data: PotentialType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["PotentialZone"]);

  useEffect(() => {
    const purpose = PurposeType?.["common-masters"]?.Purpose?.map(function (data) {
      return { value: data?.purposeCode, label: data?.name };
    });
    setPurposeOptions({ data: purpose, isLoading: false });
  }, [PurposeType]);

  useEffect(() => {
    const potential = PotentialType?.["common-masters"]?.PotentialZone?.map(function (data) {
      return { value: data?.code, label: data?.zone };
    });
    setPotentialOptions({ data: potential, isLoading: false });
  }, [PotentialType]);

  useEffect(() => {
    const landType = LandData?.["common-masters"]?.LandType?.map(function (data) {
      console.log("data===", data);
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
    watch,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });

  const [fileStoreId, setFileStoreId] = useState({});

  const Purpose = localStorage.getItem("purpose");

  const landScheduleFormSubmitHandler = async (data) => {
    const token = window?.localStorage?.getItem("token");
    setLoader(true);
    data["potential"] = data?.potential?.value;
    data["typeLand"] = data?.typeLand?.value;
    data["siteLoc"] = data?.siteLoc?.value;
    data["purposeParentLic"] = data?.purposeParentLic?.value;
    data["releaseStatus"] = data?.releaseStatus?.value;
    const postDistrict = {
      pageName: "LandSchedule",
      ApplicationStatus: "DRAFT",
      applicationNumber: props?.getId,
      createdBy: props?.userData?.id,
      updatedBy: props?.userData?.id,
      LicenseDetails: {
        LandSchedule: {
          ...data,
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
        userInfo: props?.userData,
      },
    };
    try {
      const Resp = await axios.post("/tl-services/new/_create", postDistrict);
      setLoader(false);
      props.Step3Continue(Resp?.data?.LicenseServiceResponseInfo?.[0]?.newServiceInfoData?.[0]);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  useEffect(() => {
    console.log("props?.getLicData?.ApplicantInfo", props?.getLicData?.LandSchedule);
    const valueData = props?.getLicData?.LandSchedule;
    if (valueData) {
      Object?.keys(valueData)?.map((item) => {
        if (item === "purpose" || item === "potential") return null;
        else setValue(item, valueData[item]);
      });
      const data = purposeOptions?.data?.filter((item) => item?.value === props?.getLicData?.ApplicantPurpose?.purpose);
      const potientialData = getPotentialOptons?.data?.filter((item) => item?.value === props?.getLicData?.ApplicantPurpose?.potential);
      const typeLandData = typeOfLand?.data?.filter((item) => item?.value === props?.getLicData?.ApplicantPurpose?.typeLand);

      setValue("purpose", { label: data?.[0]?.label, value: data?.[0]?.value });
      setValue("potential", { label: potientialData?.[0]?.label, value: potientialData?.[0]?.value });
      setValue("typeLand", { label: typeLandData?.[0]?.label, value: typeLandData?.[0]?.value });
    }
  }, [props?.getLicData, purposeOptions, getPotentialOptons, typeOfLand]);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:80/land-services/new/licenses/_get?id=${props.getId}`);
      const userData = Resp?.data?.newServiceInfoData?.[0]?.LandSchedule;
    } catch (error) {
      return error.message;
    }
  };
  useEffect(() => {
    getSubmitDataLabel();
  }, []);

  const getDocumentData = async (file, fieldName) => {
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
      setLoader(false);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(landScheduleFormSubmitHandler)}>
        <Card style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New Licence </h4>
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
                                required
                                maxLength={20}
                                pattern="(/^[^\s][a-zA-Z0-9\s]+$"
                              />
                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.licenseNumber && errors?.licenseNumber?.message}
                              </h3>
                            </div>
                            <div className="col col-4">
                              <label>
                                <h2>
                                  Potential Zone <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <ReactMultiSelect
                                control={control}
                                name="potential"
                                placeholder="Potential Zone"
                                data={getPotentialOptons?.data}
                                labels="Potential"
                                required
                                loading={getPotentialOptons?.isLoading}
                              />
                            </div>
                            <div className="col col-4">
                              <label>
                                <h2>
                                  Site Location Purpose <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <ReactMultiSelect
                                control={control}
                                name="siteLoc"
                                placeholder="Purpose"
                                data={purposeOptions?.data}
                                required
                                loading={purposeOptions?.isLoading}
                                labels="siteLoc"
                              />
                            </div>
                            <div className="col col-12">
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

                              {/* <ReactMultiSelect
                              control={control}
                              name="approachType"
                              placeholder="Approach"
                              data={potentialOptons}
                              labels="Potential"
                            /> */}
                              {/* <select className="form-control" id="approachType" {...register("approachType")}>
                                <option>{Purpose === "DDJAY_APHP" && <CommercialColonyInResidential watch={watch} register={register} />}</option> */}
                              {/* <option value="potential 2">(a) Existing ser-vice road along with sector di-viding road.</option> */}
                              {/* <option value="potential 2">(c) Constructed sector road or internal circula-tion road of min. 18m/24m (licenced) part of the approved sectoral plan and further leadup up to at least 4 karam wide public ras-ta.</option> */}
                              {/* </select> */}
                            </div>
                          </div>
                          <br></br>
                          <div className="row">
                            <div className="col col-3">
                              <label>
                                <h2>
                                  Approach Road Width <span style={{ color: "red" }}>*</span>
                                  <CalculateIcon color="primary" />
                                </h2>{" "}
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                {...register("approachRoadWidth")}
                                required
                                minLength={10}
                                maxLength={20}
                              ></input>
                            </div>
                            <div className="col col-3">
                              <label>
                                <h2>Specify Others</h2>
                              </label>
                              <input type="text" {...register("specify")} className="form-control" />
                            </div>
                            <div className="col col-3">
                              <label>
                                <h2>
                                  Type of land<span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <ReactMultiSelect
                                control={control}
                                name="typeLand"
                                placeholder="Type of Land"
                                data={typeOfLand?.data}
                                labels="typeland"
                                required
                              />

                              {/* <select className="form-control" id="typeLand" {...register("typeLand")}>
                            <option value="">Type of Land</option>
                            <option value="">Chahi/nehri</option>
                            <option>Gair Mumkins</option>
                            <option>Others</option>
                          </select> */}
                            </div>
                            <div className="col col-3 ">
                              <h2>
                                Third-party right created<span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                              </h2>

                              <label htmlFor="thirdParty">
                                <input {...register("thirdParty")} type="radio" value="Y" id="thirdParty" required />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="thirdParty">
                                <input {...register("thirdParty")} type="radio" value="N" id="thirdParty" required />
                                &nbsp; No &nbsp;&nbsp;
                              </label>
                              {watch("thirdParty") === "Y" && (
                                <div className="row ">
                                  <div className="col col-12">
                                    <label>
                                      {" "}
                                      <h2>
                                        Remark<span style={{ color: "red" }}>*</span>
                                      </h2>{" "}
                                    </label>
                                    <input type="text" className="form-control" {...register("thirdPartyRemark")} />
                                  </div>
                                  <div className="col col-12">
                                    <label>
                                      {" "}
                                      <h2>
                                        Document Upload <span style={{ color: "red" }}>*</span>
                                        {fileStoreId?.thirdPartyDoc ? (
                                          <a onClick={() => getDocShareholding(fileStoreId?.thirdPartyDoc)} className="btn btn-sm col-md-6">
                                            <VisibilityIcon color="info" className="icon" />
                                          </a>
                                        ) : (
                                          <p></p>
                                        )}
                                      </h2>
                                    </label>
                                    <div>
                                      <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyDoc")}
                                      />
                                    </div>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.thirdPartyDoc && errors?.thirdPartyDoc?.message}
                                    </h3>
                                  </div>
                                </div>
                              )}
                              {watch("thirdParty") === "N" && (
                                <div className="row ">
                                  <div className="col col-12">
                                    <label>
                                      {" "}
                                      <h2>
                                        Document Upload <span style={{ color: "red" }}>*</span>
                                        {fileStoreId?.thirdPartyDoc ? (
                                          <a onClick={() => getDocShareholding(fileStoreId?.thirdPartyDoc)} className="btn btn-sm col-md-6">
                                            <VisibilityIcon color="info" className="icon" />
                                          </a>
                                        ) : (
                                          <p></p>
                                        )}
                                      </h2>
                                    </label>
                                    <div>
                                      <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyDoc")}
                                      />
                                    </div>

                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.thirdPartyDoc && errors?.thirdPartyDoc?.message}
                                    </h3>
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
                            <input {...register("migrationLic")} type="radio" value="Y" id="migrationLic" />
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
                          <div className="row">
                            <div className="col col-3">
                              <label>
                                <h2>
                                  Area Applied under Migration <span style={{ color: "red" }}>*</span>
                                </h2>{" "}
                              </label>
                              <input type="text" className="form-control" {...register("areaUnderMigration")} required />
                            </div>
                            <div className="col col-3">
                              <label>
                                <h2>
                                  Purpose of Parent Licence <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <ReactMultiSelect
                                control={control}
                                name="purposeParentLic"
                                placeholder="Purpose"
                                data={purposeOptions?.data}
                                loading={purposeOptions?.isLoading}
                                labels="purposeParentLic"
                              />
                            </div>
                            <div className="col col-3">
                              <label>
                                <h2>
                                  Licence No. <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <input type="text" className="form-control" {...register("licNo")} required minLength={10} maxLength={20} />
                            </div>
                            <div className="col col-3">
                              <label>
                                <h2>
                                  Area of Parent Licence <span style={{ color: "red" }}>*</span>
                                </h2>
                              </label>
                              <input type="text" className="form-control" {...register("areaofParentLic")} required minLength={1} maxLength={20} />
                            </div>
                          </div>
                          <br></br>
                          <div className="row">
                            <div className="col col-3">
                              <label>
                                <h2>
                                  Validity of Parent Licence.<span style={{ color: "red" }}>*</span>
                                </h2>{" "}
                              </label>
                              &nbsp;&nbsp;<br></br>
                              <label htmlFor="validityOfParentLic">
                                <input {...register("validityOfParentLic")} type="radio" value="Y" id="validityOfParentLic" required />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="validityOfParentLic">
                                <input {...register("validityOfParentLic")} type="radio" value="N" id="validityOfParentLic" required />
                                &nbsp; No &nbsp;&nbsp;
                              </label>
                            </div>
                            {watch("validityOfParentLic") === "N" && (
                              <div className="row ">
                                <div className="col col-6">
                                  <label>
                                    <h2>
                                      <span className="text-primary"> (Kindly avail for renewal of Licence)</span>{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </h2>
                                  </label>
                                  <input type="text" className="form-control" {...register("renewalFee")} required />
                                </div>
                                {/* <div className="col col-6">
                                  <label>
                                    <h2>
                                      Freshly applied area,other than migration <span style={{ color: "red" }}>*</span>
                                    </h2>{" "}
                                  </label>
                                  <input type="text" className="form-control" {...register("freshlyApplied")} required minLength={2} maxLength={20} />
                                </div> */}
                              </div>
                            )}
                            <br></br>
                            <div className="col col-6">
                              <label>
                                <h2>
                                  Freshly applied area,other than migration <span style={{ color: "red" }}>*</span>
                                </h2>{" "}
                              </label>
                              <input type="text" className="form-control" {...register("freshlyApplied")} required minLength={2} maxLength={20} />
                            </div>
                            <div className="col col-3">
                              <h2
                                data-toggle="tooltip"
                                data-placement="top"
                                title=" Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration."
                              >
                                Approved Layout of Plan.<span style={{ color: "red" }}>*</span>
                                {fileStoreId?.approvedLayoutPlan ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.approvedLayoutPlan)} className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                              </h2>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "approvedLayoutPlan")}
                                />
                              </div>

                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.approvedLayoutPlan && errors?.approvedLayoutPlan?.message}
                              </h3>
                            </div>
                            <div className="col col-3">
                              <h2
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Proposed Layout of Plan /site plan for area applied for migration."
                              >
                                Proposed Layout of Plan.<span style={{ color: "red" }}>*</span>
                                {fileStoreId?.proposedLayoutPlan ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.proposedLayoutPlan)} className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                              </h2>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "proposedLayoutPlan")}
                                />
                              </div>

                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.proposedLayoutPlan && errors?.proposedLayoutPlan?.message}
                              </h3>
                            </div>
                            <div className="col col-3">
                              <h2 data-toggle="tooltip" data-placement="top" title="Upload Previously approved Layout Plan.">
                                Upload Previously approved.<span style={{ color: "red" }}>*</span>
                                {fileStoreId?.uploadPreviouslyLayoutPlan ? (
                                  <a onClick={() => getDocShareholding(fileStoreId?.uploadPreviouslyLayoutPlan)} className="btn btn-sm col-md-6">
                                    <VisibilityIcon color="info" className="icon" />
                                  </a>
                                ) : (
                                  <p></p>
                                )}
                              </h2>
                              <div>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(e) => getDocumentData(e?.target?.files[0], "uploadPreviouslyLayoutPlan")}
                                />
                              </div>

                              <h3 className="error-message" style={{ color: "red" }}>
                                {errors?.uploadPreviouslyLayoutPlan && errors?.uploadPreviouslyLayoutPlan?.message}
                              </h3>
                            </div>
                          </div>
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
                      <input {...register("encumburance")} type="radio" value="rehan/mortgage" id="encumburance" />
                      &nbsp;&nbsp; Rehan / Mortgage &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="patta/lease" id="encumburance" />
                      &nbsp;&nbsp; Patta/Lease &nbsp;&nbsp;
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="gair/marusi" id="encumburance" />
                      &nbsp;&nbsp; Gair/Marusi &nbsp;&nbsp;
                    </label>
                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.encumburance && errors?.encumburance?.message}
                    </h3>
                  </div>
                  <div className="row">
                    <div className="col col-4">
                      <label>
                        <h2>Any other, please specify:</h2>
                      </label>
                      <input type="text" className="form-control" {...register("encumburanceOther")} required minLength={2} maxLength={100} />
                    </div>
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
                  <div className="row">
                    <div className="col col-12 ">
                      {watch("litigation") === "Y" && (
                        <div className="row ">
                          <div className="col col-6">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("litigationRemark")} />
                          </div>
                          <div className="col col-6">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Document Upload <span style={{ color: "red" }}>*</span>{" "}
                              {fileStoreId?.litigationDoc ? (
                                <a onClick={() => getDocShareholding(fileStoreId?.litigationDoc)} className="btn btn-sm col-md-6">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              ) : (
                                <p></p>
                              )}
                            </h2>
                            <div>
                              <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "litigationDoc")} />
                            </div>

                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.litigationDoc && errors?.litigationDoc?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <hr />
                  <br></br>
                  <div>
                    <h6>
                      (iii) Court orders, if any, affecting applied land. <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
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
                          </div>
                          <div className="col col-6">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Document Upload <span style={{ color: "red" }}>*</span>
                              {fileStoreId?.courtDoc ? (
                                <a onClick={() => getDocShareholding(fileStoreId?.courtDoc)} className="btn btn-sm col-md-6">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              ) : (
                                <p></p>
                              )}
                            </h2>
                            <div>
                              <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "courtDoc")} />
                            </div>

                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.courtDoc && errors?.courtDoc?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <hr />
                  <br></br>
                  <div>
                    <h6>
                      (iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed.
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
                          </div>
                          <div className="col col-6">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              {" "}
                              Document Upload <span style={{ color: "red" }}>*</span>
                              {fileStoreId?.insolvencyDoc ? (
                                <a onClick={() => getDocShareholding(fileStoreId?.insolvencyDoc)} className="btn btn-sm col-md-6">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              ) : (
                                <p></p>
                              )}
                            </h2>
                            <div>
                              <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "insolvencyDoc")} />
                            </div>

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
                      {watch("appliedLand") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Document Upload <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                              {fileStoreId?.docUpload ? (
                                <a onClick={() => getDocShareholding(fileStoreId?.docUpload)} className="btn btn-sm col-md-6">
                                  <VisibilityIcon color="info" className="icon" />
                                </a>
                              ) : (
                                <p></p>
                              )}
                            </h6>
                            <div>
                              <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "docUpload")} />
                            </div>

                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.docUpload && errors?.docUpload?.message}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3 ">
                      <h2 data-toggle="tooltip" data-placement="top" title="If any revenue rasta abuts to the applied site ?">
                        (b)&nbsp;Revenue rasta <span style={{ color: "red" }}>*</span> &nbsp;&nbsp; &nbsp;&nbsp;
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
                                Width of revenue rasta (in sqm)<span style={{ color: "red" }}>*</span>&nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="number" className="form-control" {...register("revenueRastaWidth")} required minLength={10} maxLength={99} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3 ">
                      <h2 data-toggle="tooltip" data-placement="top" title="Watercourse running along boundary through the applied site ?">
                        (c)&nbsp;Watercourse running <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
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
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col col-3 ">
                      <h2 data-toggle="tooltip" data-placement="top" title="If any other owners' land is sandwiched within applied land.">
                        (e)&nbsp;Land Sandwiched <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
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
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("landSandwichedRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3 ">
                      <h2>
                        (f)&nbsp;Acquisition status (Yes/No) <span style={{ color: "red" }}>*</span>
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
                              Remark <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" {...register("acquistionRemark")} required minLength={10} maxLength={99} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3">
                      <label>
                        <h2>
                          Date of section 4 notification <span style={{ color: "red" }}>*</span>{" "}
                        </h2>{" "}
                      </label>
                      <input type="date" {...register("sectionFour")} className="form-control" required />
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.sectionFour && errors?.sectionFour?.message}
                      </h3>
                    </div>
                    <div className="col col-3">
                      <label>
                        <h2>
                          Date of section 6 notification <span style={{ color: "red" }}>*</span>{" "}
                        </h2>
                      </label>
                      <input type="date" className="form-control" {...register("sectionSix")} required />
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.sectionSix && errors?.sectionSix?.message}
                      </h3>
                    </div>
                  </div>{" "}
                  <br></br>
                  <div className="row">
                    <div className="col col-12">
                      <label>
                        <h2>
                          (g)&nbsp;&nbsp;Whether details/orders of release/exclusion of land uploaded.<span style={{ color: "red" }}>*</span>{" "}
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
                              Whether land compensation received <span style={{ color: "red" }}>*</span>{" "}
                            </h2>

                            <label htmlFor="landCompensation">
                              <input {...register("landCompensation")} type="radio" value="Y" id="landCompensation" required />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="landCompensation">
                              <input {...register("landCompensation")} type="radio" value="N" id="landCompensation" required />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>
                                Status of release <span style={{ color: "red" }}>*</span>{" "}
                              </h2>
                            </label>

                            <ReactMultiSelect
                              control={control}
                              name="releaseStatus"
                              required
                              placeholder="Status of release"
                              data={releaseStatus}
                              labels="Potential"
                            />
                            <div className="invalid-feedback">{errors?.releaseStatus?.message}</div>
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>
                                Date of Award <span style={{ color: "red" }}>*</span>{" "}
                              </h2>
                            </label>
                            <input type="date" {...register("awardDate")} className="form-control" required />
                            <div className="invalid-feedback">{errors?.awardDate?.message}</div>
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>
                                Date of Release <span style={{ color: "red" }}>*</span>{" "}
                              </h2>{" "}
                            </label>
                            <input type="date" {...register("releaseDate")} className="form-control" required />
                            <div className="invalid-feedback">{errors?.releaseDate?.message}</div>
                          </div>
                          <div className="col col-3">
                            <label htmlFor="siteDetail">
                              <h2>
                                Site Details <span style={{ color: "red" }}>*</span>{" "}
                              </h2>
                            </label>
                            <input type="text" {...register("siteDetail")} className="form-control" required minLength={2} maxLength={99} />
                            <div className="invalid-feedback">{errors?.siteDetail?.message}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col col-12">
                      <h2>
                        (h)&nbsp;&nbsp;whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing
                        road (yes/no).<span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                        <label htmlFor="siteApproachable">
                          <input {...register("siteApproachable")} type="radio" value="Y" id="siteApproachable" />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="siteApproachable">
                          <input {...register("siteApproachable")} type="radio" value="N" id="siteApproachable" />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.siteApproachable && errors?.siteApproachable?.message}
                        </h3>
                      </h2>
                    </div>
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
                          </div>
                        </div>
                      )}
                      {watch("vacant") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Vacant Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("vacantRemark")} required />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>
                        (b) &nbsp;Construction: (Yes/No) <span style={{ color: "red" }}>*</span>
                      </h2>{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <label htmlFor="construction">
                        <input {...register("construction")} type="radio" value="Y" id="construction" />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="construction">
                        <input {...register("construction")} type="radio" value="N" id="construction" />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.construction && errors?.construction?.message}
                      </h3>
                      {watch("construction") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              Type of Construction <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" {...register("typeOfConstruction")} required />
                          </div>
                        </div>
                      )}
                      {watch("construction") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("constructionRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>
                        (c) &nbsp;HT line:(Yes/No) <span style={{ color: "red" }}>*</span>
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
                            <input type="text" className="form-control" {...register("htRemark")} required />
                          </div>
                        </div>
                      )}
                      {watch("ht") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                HT Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("htRemark")} required />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3">
                      <h2>
                        (d)&nbsp;IOC Gas Pipeline:(Yes/No) <span style={{ color: "red" }}>*</span>
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
                            <input type="text" className="form-control" {...register("gasRemark")} required />
                          </div>
                        </div>
                      )}
                      {watch("gas") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              IOC Remark <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" {...register("gasRemark")} required />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <br></br>
                  <div className="row ">
                    <div className="col col-3">
                      <h2>
                        (e) &nbsp;Nallah:(Yes/No) <span style={{ color: "red" }}>*</span>
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
                            <input type="text" className="form-control" {...register("nallahRemark")} required />
                          </div>
                        </div>
                      )}
                      {watch("nallah") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              Nallah Remark <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" {...register("nallahRemark")} required />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>
                        (f) &nbsp;Any revenue rasta/road:(Yes/No) <span style={{ color: "red" }}>*</span>
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
                                Width of Revenue rasta/road (in sqm)<span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("roadWidth")} required minLength={2} maxLength={20} />
                          </div>
                          <div className="col col-12">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("roadRemark")} />
                          </div>
                        </div>
                      )}
                      {watch("road") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("roadRemark")} required />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>
                        (g) &nbsp;Any marginal land:(Yes/No) <span style={{ color: "red" }}>*</span>
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
                            <input type="text" className="form-control" {...register("marginalLandRemark")} required />
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
                    </div>
                    <div className="col col-3">
                      <h2
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Whether any utility line passing through the site is incorporated/adjusted in the layout plan (Yes/No)"
                      >
                        (h)&nbsp;Utility Line <span style={{ color: "red" }}>*</span>
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
                                Width of row (in sqm) <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("utilityWidth")} required minLength={2} maxLength={99} />
                          </div>
                          <div className="col col-12">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("utilityRemark")} />
                          </div>
                        </div>
                      )}
                      {watch("utilityLine") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Remark <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("utilityRemark")} required />
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
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Land schedule <span style={{ color: "red" }}>*</span>
                        {fileStoreId?.landSchedule ? (
                          <a onClick={() => getDocShareholding(fileStoreId?.landSchedule)} className="btn btn-sm col-md-6">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </h2>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "landSchedule")} />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.landSchedule && errors?.landSchedule?.message}
                      </h3>
                    </div>

                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Copy of Mutation <span style={{ color: "red" }}>*</span>{" "}
                        {fileStoreId?.mutation ? (
                          <a onClick={() => getDocShareholding(fileStoreId?.mutation)} className="btn btn-sm col-md-6">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </h2>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "mutation")} />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.mutation && errors?.mutation?.message}
                      </h3>
                    </div>

                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Copy of Jamabandi <span style={{ color: "red" }}>*</span>
                        {fileStoreId?.jambandhi ? (
                          <a onClick={() => getDocShareholding(fileStoreId?.jambandhi)} className="btn btn-sm col-md-6">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </h2>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "jambandhi")} />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.jambandhi && errors?.jambandhi?.message}
                      </h3>
                    </div>
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Details of lease / patta <span style={{ color: "red" }}>*</span>
                        {fileStoreId?.detailsOfLease ? (
                          <a onClick={() => getDocShareholding(fileStoreId?.detailsOfLease)} className="btn btn-sm col-md-6">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </h2>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "detailsOfLease")} />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.detailsOfLease && errors?.detailsOfLease?.message}
                      </h3>
                    </div>
                  </div>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h2
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title=" Add sales/Deed/exchange/gift deed, mutation, lease/Patta"
                      >
                        Add sales/Deed/exchange <span style={{ color: "red" }}>*</span>
                        {fileStoreId?.addSalesDeed ? (
                          <a onClick={() => getDocShareholding(fileStoreId?.addSalesDeed)} className="btn btn-sm col-md-6">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </h2>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "addSalesDeed")} />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.addSalesDeed && errors?.addSalesDeed?.message}
                      </h3>
                    </div>
                    <div className="col col-3">
                      <h2
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Copy of spa/GPA/board resolution to sign collaboration agrrement"
                      >
                        Copy of spa/GPA/board. <span style={{ color: "red" }}>*</span>
                        {fileStoreId?.copyofSpaBoard ? (
                          <a onClick={() => getDocShareholding(fileStoreId?.copyofSpaBoard)} className="btn btn-sm col-md-6">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </h2>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "copyofSpaBoard")} />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.copyofSpaBoard && errors?.copyofSpaBoard?.message}
                      </h3>
                    </div>
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Revised Land Schedule <span style={{ color: "red" }}>*</span>
                        {fileStoreId?.revisedLanSchedule ? (
                          <a onClick={() => getDocShareholding(fileStoreId?.revisedLanSchedule)} className="btn btn-sm col-md-6">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </h2>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "revisedLanSchedule")} />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.revisedLanSchedule && errors?.revisedLanSchedule?.message}
                      </h3>
                    </div>

                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Copy of Shajra Plan <span style={{ color: "red" }}>*</span>
                        {fileStoreId?.copyOfShajraPlan ? (
                          <a onClick={() => getDocShareholding(fileStoreId?.copyOfShajraPlan)} className="btn btn-sm col-md-6">
                            <VisibilityIcon color="info" className="icon" />
                          </a>
                        ) : (
                          <p></p>
                        )}
                      </h2>
                      <div>
                        <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "copyOfShajraPlan")} />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.copyOfShajraPlan && errors?.copyOfShajraPlan?.message}
                      </h3>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 text-left">
                      <div id="btnClear" class="btn btn-primary btn-md center-block" onClick={() => props?.Step3Back()}>
                        Back
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-12 text-right">
                        <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                          {" "}
                          Save and Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form.Group>
          </Card>
        </Card>
      </form>
    </div>
  );
};
export default LandScheduleForm;
