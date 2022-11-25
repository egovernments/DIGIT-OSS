import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import { Checkbox } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import axios from "axios";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";
import Spinner from "../../../../components/Loader";

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
      return { value: data?.code, label: data?.zone };
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
  } = useForm();

  const landScheduleFormSubmitHandler = async (data) => {
    const token = window?.localStorage?.getItem("token");
    // setLoader(true);
    data["potential"] = data?.potential?.value;
    data["approachType"] = data?.approachType?.value;
    data["typeLand"] = data?.typeLand?.value;
    data["purposeParentLic"] = data?.purposeParentLic?.value;
    data["releaseStatus"] = data?.releaseStatus?.value;
    const postDistrict = {
      pageName: "LandSchedule",
      ApplicationStatus: "DRAFT",
      id: props.getId,
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
      // setLoader(false);
      props.Step3Continue();
    } catch (error) {
      // setLoader(false);
      console.log(error.message);
    }
  };

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
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error.message);
    }
  };

  const [applicantId, setApplicantId] = useState("");
  const getApplicantDetailsUserData = async (id) => {
    console.log("here");
    try {
      const Resp = await axios.get(`http://103.166.62.118:8443/tl-services/new/licenses/_get?id=${id}`);
      const userData = Resp?.data?.newServiceInfoData[0]?.LandSchedule;
      console.log("dd", Resp?.data?.newServiceInfoData[0]?.LandSchedule);
      setValue("licenseApplied", userData?.licenseApplied);
      setValue("licenseNumber", userData?.licenseNumber);
      setValue("siteLoc", userData?.siteLoc);
      setValue("approachType", userData?.approachType);
      setValue("approachRoadWidth", userData?.approachRoadWidth);
      setValue("specify", userData?.specify);
      setValue("typeLand", userData?.typeLand);
      setValue("thirdParty", userData?.thirdParty);
      setValue("thirdPartyRemark", userData?.thirdPartyRemark);
      setValue("thirdPartyDoc", userData?.thirdPartyDoc);
      setValue("migrationLic", userData?.migrationLic);
      setValue("areaUnderMigration", userData?.areaUnderMigration);
      setValue("purposeParentLic", userData?.purposeParentLic);
      setValue("licNo", userData?.licNo);
      setValue("areaofParentLic", userData?.areaofParentLic);
      setValue("validityOfParentLic", userData?.validityOfParentLic);
      setValue("renewalFee", userData?.renewalFee);
      setValue("freshlyApplied", userData?.freshlyApplied);
      setValue("encumburance", userData?.encumburance);
      setValue("encumburanceOther", userData?.encumburanceOther);
      setValue("litigation", userData?.litigation);
      setValue("litigationRemark", userData?.litigationRemark);
      setValue("litigationDoc", userData?.litigationDoc);
      setValue("court", userData?.court);
      setValue("courtyCaseNo", userData?.courtyCaseNo);
      setValue("courtDoc", userData?.courtDoc);
      setValue("insolvency", userData?.insolvency);
      setValue("insolvencyRemark", userData?.insolvencyRemark);
      setValue("insolvencyDoc", userData?.insolvencyDoc);
      setValue("appliedLand", userData?.appliedLand);
      setValue("revenueRasta", userData?.revenueRasta);
      setValue("revenueRastaWidth", userData?.revenueRastaWidth);
      setValue("waterCourse", userData?.waterCourse);
      setValue("waterCourseRemark", userData?.waterCourseRemark);
      setValue("compactBlock", userData?.compactBlock);
      setValue("compactBlockRemark", userData?.compactBlockRemark);
      setValue("landSandwiched", userData?.landSandwiched);
      setValue("landSandwichedRemark", userData?.landSandwichedRemark);
      setValue("acquistion", userData?.acquistion);
      setValue("acquistionRemark", userData?.acquistionRemark);
      setValue("sectionFour", userData?.sectionFour);
      setValue("sectionSix", userData?.sectionSix);
      setValue("orderUpload", userData?.orderUpload);
      setValue("landCompensation", userData?.landCompensation);
      setValue("releaseStatus", userData?.releaseStatus);
      setValue("awardDate", userData?.awardDate);
      setValue("releaseDate", userData?.releaseDate);
      setValue("siteDetail", userData?.siteDetail);
      setValue("siteApproachable", userData?.siteApproachable);
      setValue("vacant", userData?.vacant);
      setValue("vacantRemark", userData?.vacantRemark);
      setValue("construction", userData?.construction);
      setValue("typeOfConstruction", userData?.typeOfConstruction);
      setValue("constructionRemark", userData?.constructionRemark);
      setValue("ht", userData?.ht);
      setValue("htRemark", userData?.htRemark);
      setValue("gas", userData?.gas);
      setValue("gasRemark", userData?.gasRemark);
      setValue("nallah", userData?.nallah);
      setValue("nallahRemark", userData?.nallahRemark);
      setValue("road", userData?.road);
      setValue("roadWidth", userData?.roadWidth);
      setValue("roadRemark", userData?.roadRemark);
      setValue("marginalLand", userData?.marginalLand);
      setValue("marginalLandRemark", userData?.marginalLandRemark);
      setValue("utilityLine", userData?.utilityLine);
      setValue("utilityWidth", userData?.utilityWidth);
      setValue("utilityRemark", userData?.utilityRemark);
      setValue("landSchedule", userData?.landSchedule);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    const search = location?.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");

    setApplicantId(id?.toString());
    if (id) getApplicantDetailsUserData(id);
  }, []);

  return (
<<<<<<< HEAD
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(landScheduleFormSubmitHandler)}>
        <Card style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New License </h4>
          <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
            <Form.Group className="justify-content-center" controlId="formBasicEmail">
              <Row className="ml-auto" style={{ marginBottom: 5 }}>
                <Col col-12>
                  <div className="row">
                    <div className="col col-12 ">
                      <div>
                        <h2>
                          1.&nbsp;(i)Whether licence applied for additional area ?<span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                        </h2>

                        <label htmlFor="licenseApplied">
                          <input {...register("licenseApplied")} type="radio" value="Y" id="licenseApplied" />
                          Yes
                        </label>
                        <label htmlFor="licenseApplied">
                          <input {...register("licenseApplied")} type="radio" value="N" id="licenseApplied" />
                          No
                        </label>
                      </div>

                      {watch("licenseApplied") === "Y" && (
                        <div className="row">
                          <div className="col col-3">
                            <label>
                              <h2>
                                License No. of Parent License <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="number" className="form-control" {...register("licenseNumber")} />
                          </div>
                          <div className="col col-3">
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
                              loading={getPotentialOptons?.isLoading}
                            />
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>
                                Site Location Purpose <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("siteLoc")} />
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>
                                Approach Type (Type of Policy) <span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <ReactMultiSelect
                              control={control}
                              name="approachType"
                              placeholder="Approach"
                              data={potentialOptons}
                              labels="Potential"
                            />
                            {/* <select className="form-control" id="approachType" {...register("approachType")}>
=======
    <form onSubmit={handleSubmit(landScheduleFormSubmitHandler)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h1>New License</h1>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Form.Group className="justify-content-center" controlId="formBasicEmail">
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col col-12>
                <div className="row">
                  <div className="col col-12 ">
                    <h2>
                      1.&nbsp;(i)Whether licence applied for additional area ?<span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                      <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow} />
                      &nbsp;&nbsp;
                      <label for="Yes">
                        <h6>Yes</h6>
                      </label>
                      &nbsp;&nbsp;
                      <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow} />
                      &nbsp;&nbsp;
                      <label for="No">
                        <h6>No</h6>
                      </label>
                    </h2>
                    {showhide === "Yes" && (
                      <div className="row">
                        <div className="col col-3">
                          <label>
                            <h2>
                              License No. of Parent License <span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <input type="number" className="form-control" {...register("licNo")} />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>
                              Potential Zone <span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <select className="form-control" id="potential" {...register("potential")}>
                            <option value="">--Potential Zone--</option>
                            <option value="K.Mishra">Hyper</option>
                            <option value="potential 1">High I</option>
                            <option value="potential 2">High II</option>
                            <option value="potential 2">Medium</option>
                            <option value="potential 2">Low I</option>
                            <option value="potential 2">Low II</option>
                          </select>
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>
                              Site Location Purpose <span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <input type="text" className="form-control" {...register("siteLoc")} />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>
                              Approach Type (Type of Policy) <span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <select className="form-control" id="approach" {...register("approach")}>
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                            <option value="K.Mishra"></option>
                            <option value="potential 1"></option>
                            <option value="potential 2"></option>
                          </select> */}
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>
                                Approach Road Width <span style={{ color: "red" }}>*</span>
                                <CalculateIcon color="primary" />
                              </h2>{" "}
                            </label>
                            <input type="number" className="form-control" {...register("approachRoadWidth")}></input>
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>
                                Specify Others<span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <input type="text" {...register("specify")} className="form-control" />
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>
                                Type of land<span style={{ color: "red" }}>*</span>
                              </h2>
                            </label>
                            <ReactMultiSelect control={control} name="typeLand" placeholder="Type of Land" data={potentialOptons} labels="typeLand" />

                            {/* <select className="form-control" id="typeLand" {...register("typeLand")}>
                            <option value="">Type of Land</option>
                            <option value="">Chahi/nehri</option>
                            <option>Gair Mumkins</option>
                            <option>Others</option>
                          </select> */}
                          </div>
                          <div className="col col-3 ">
                            <h2>
                              Third-party right created<span style={{ color: "red" }}>*</span>
                            </h2>

                            <label htmlFor="thirdParty">
                              <input {...register("thirdParty")} type="radio" value="Y" id="thirdParty" />
                              Yes
                            </label>
                            <label htmlFor="thirdParty">
                              <input {...register("thirdParty")} type="radio" value="N" id="thirdParty" />
                              No
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
                                    </h2>
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    // {...register("thirdPartyDoc")}
                                    onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyDoc")}
                                  />
                                </div>
                              </div>
                            )}
                            {watch("thirdParty") === "N" && (
                              <div className="row ">
                                <div className="col col">
                                  <label>
                                    <h2>
                                      Document Upload <span style={{ color: "red" }}>*</span>
                                    </h2>
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    // {...register("thirdPartyDoc")}
                                    onChange={(e) => getDocumentData(e?.target?.files[0], "thirdPartyDoc")}
                                  />
                                </div>
                              </div>
                            )}
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
                          &nbsp;&nbsp;(ii)Whether licence applied under Migration Policy ?&nbsp;&nbsp;
                          <label htmlFor="migrationLic">
                            <input {...register("migrationLic")} type="radio" value="Y" id="migrationLic" />
                            Yes
                          </label>
<<<<<<< HEAD
                          <label htmlFor="migrationLic">
                            <input {...register("migrationLic")} type="radio" value="N" id="migrationLic" />
                            No
=======
                          <br></br>
                          <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow13} />
                          &nbsp;&nbsp;
                          <label for="Yes">
                            <h6>Yes</h6>
                          </label>
                          &nbsp;&nbsp;
                          <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow13} />
                          &nbsp;&nbsp;
                          <label for="No">
                            <h6>No</h6>
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                          </label>
                        </h2>
                      </div>
                      {watch("migrationLic") === "Y" && (
                        <div className="row">
                          <div className="col col-3">
                            <label>
                              <h2>Area Applied under Migration</h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("areaUnderMigration")} />
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>Purpose of Parent License</h2>
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
                              <h2>License No.</h2>
                            </label>
                            <input type="text" className="form-control" {...register("licNo")} />
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>Area of Parent License</h2>
                            </label>
                            <input type="text" className="form-control" {...register("areaofParentLic")} />
                          </div>
                          <div className="col col-3">
                            <label>
                              <h2>Validity of Parent License </h2>{" "}
                            </label>
                            <label htmlFor="validityOfParentLic">
                              <input {...register("validityOfParentLic")} type="radio" value="Y" id="validityOfParentLic" />
                              Yes
                            </label>
                            <label htmlFor="validityOfParentLic">
                              <input {...register("validityOfParentLic")} type="radio" value="N" id="validityOfParentLic" />
                              No
                            </label>
                          </div>
                          {watch("validityOfParentLic") === "Y" && (
                            <div className="row ">
                              <div className="col col-6">
                                <label>
                                  <h2>Number of Renewal Fees to be deposited </h2>
                                </label>
                                <input type="text" className="form-control" {...register("renewalFee")} />
                              </div>
                              <div className="col col-6">
                                <label>
                                  <h2>Freshly applied area,other than migration</h2>{" "}
                                </label>
                                <input type="text" className="form-control" {...register("freshlyApplied")} />
                              </div>
                            </div>
                          )}
                          <div className="col col-3">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration &nbsp;&nbsp;
                              <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                            </h2>
                            <input
                              type="file"
                              className="form-control"
                              // {...register("approvedLayoutPlan")}
                              onChange={(e) => getDocumentData(e?.target?.files[0], "approvedLayoutPlan")}
                            />
                          </div>
                          <div className="col col-3">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Proposed Layout of Plan /site plan for area applied for migration. &nbsp;&nbsp;
                              <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                            </h2>
                            <input
                              type="file"
                              className="form-control"
                              // {...register("proposedLayoutPlan")}
                              onChange={(e) => getDocumentData(e?.target?.files[0], "proposedLayoutPlan")}
                            />
                          </div>
                          <div className="col col-3">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Upload Previously approved Layout Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                            </h2>
                            <input
                              type="file"
                              className="form-control"
                              // {...register("uploadPreviouslyLayoutPlan")}
                              onChange={(e) => getDocumentData(e?.target?.files[0], "uploadPreviouslyLayoutPlan")}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
<<<<<<< HEAD
                  <hr></hr>
                  <br></br>
                  <div>
                    <h4>2. Any encumbrance with respect to following </h4>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="rehan/mortgage" id="encumburance" />
                      Rehan / Mortgage
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="patta/lease" id="encumburance" />
                      Patta/Lease
                    </label>
                    <label htmlFor="encumburance">
                      <input {...register("encumburance")} type="radio" value="gair/marusi" id="encumburance" />
                      Gair/Marusi
                    </label>
                  </div>
                  <div className="row">
                    <div className="col col-4">
                      <label>
                        <h2>Any other, please specify:</h2>
                      </label>
                      <input type="text" className="form-control" {...register("encumburanceOther")} />
                    </div>
=======
                </div>
                &nbsp;&nbsp;
                <div className="row">
                  <div className="col col-12 ">
                    <h2>
                      &nbsp;&nbsp;(ii)Whether licence applied under Migration Policy ?&nbsp;&nbsp;
                      <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow19} />
                      &nbsp;&nbsp;
                      <label for="Yes">
                        <h6>Yes</h6>
                      </label>
                      &nbsp;&nbsp;
                      <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow19} />
                      &nbsp;&nbsp;
                      <label for="No">
                        <h6>No</h6>
                      </label>
                    </h2>
                    {showhide19 === "Yes" && (
                      <div className="row">
                        <div className="col col-3">
                          <label>
                            <h2>Area Applied under Migration</h2>{" "}
                          </label>
                          <input type="text" className="form-control" {...register("areamigration")} />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>Purpose of Parent License</h2>
                          </label>
                          <select className="form-control" id="potential" {...register("purpose")}>
                            <option value="">Purpose</option>
                            <option>AGH</option>
                            <option> DDJAY</option>
                            <option>Commercial Plotted</option>
                            <option>Residential Plotted Colony</option>
                            <option>TOD Commercial</option>
                          </select>
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>License No.</h2>
                          </label>
                          <input type="text" className="form-control" {...register("licenseNo")} />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>Area of Parent License</h2>
                          </label>
                          <input type="text" className="form-control" {...register("areaLic")} />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>Validity of Parent License </h2>{" "}
                          </label>
                          <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow21} />
                          &nbsp;&nbsp;
                          <label for="Yes">
                            <h6>Yes</h6>
                          </label>
                          &nbsp;&nbsp;
                          <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow21} />
                          &nbsp;&nbsp;
                          <label for="No">
                            <h6>No</h6>
                          </label>
                        </div>
                        {showhide21 === "Yes" && (
                          <div className="row ">
                            <div className="col col-6">
                              <label>
                                <h2>Number of Renewal Fees to be deposited </h2>
                              </label>
                              <input type="text" className="form-control" {...register("renewalFee")} />
                            </div>
                            <div className="col col-6">
                              <label>
                                <h2>Freshly applied area,other than migration</h2>{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                {...register("freshlyApplied")}
                                onChange={(e) => setFile({ file: e.target.files[0] })}
                              />
                            </div>
                          </div>
                        )}
                        <div className="col col-3">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration &nbsp;&nbsp;
                            <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>

                          <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                        </div>
                        <div className="col col-3">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            {" "}
                            Proposed Layout of Plan /site plan for area applied for migration. &nbsp;&nbsp;
                            <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>

                          <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                        </div>
                        <div className="col col-3">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Upload Previously approved Layout Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>

                          <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                        </div>
                      </div>
                    )}
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                  </div>
                  <br></br>
<<<<<<< HEAD
                  <hr />
                  <br></br>
                  <div>
                    <h6>(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator. </h6>
                    <label htmlFor="litigation">
                      <input {...register("litigation")} type="radio" value="Y" id="litigation" />
                      Yes
                    </label>
                    <label htmlFor="litigation">
                      <input {...register("litigation")} type="radio" value="N" id="litigation" />
                      No
=======
                  <label>
                    <h2>Rehan / Mortgage</h2>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio"  value="1" onChange={handleChange}  onClick={handleshow18} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
                  <label>
                    <h2>Patta/Lease</h2>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio"  value="2" onChange={handleChange}  onClick={handleshow18} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
                  <label>
                    <h2>Gair/Marusi</h2>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio"  value="2" onChange={handleChange}  onClick={handleshow18} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>
                </h4>
                <div className="row">
                  <div className="col col-4">
                    <label>
                      <h2>Any other, please specify</h2>
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                    </label>
                  </div>
<<<<<<< HEAD
                  <div className="row">
                    <div className="col col-12 ">
                      {watch("litigation") === "Y" && (
                        <div className="row ">
                          <div className="col col-6">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("litigationRemark")} />
                          </div>
                          <div className="col col-6">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                            </h2>
                            <input
                              type="file"
                              className="form-control"
                              // {...register("litigationDoc")}
                              onChange={(e) => getDocumentData(e?.target?.files[0], "litigationDoc")}
                            />
                          </div>
=======
                </div>
                <br></br>
                <hr />
                <br></br>
                <h6>
                  (ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator &nbsp;&nbsp;
                  <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow10} />
                  &nbsp;&nbsp;
                  <label for="Yes">
                    <h6>Yes</h6>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow10} />
                  &nbsp;&nbsp;
                  <label for="No">
                    <h6>No</h6>
                  </label>
                </h6>
                <div className="row">
                  <div className="col col-12 ">
                    {showhide10 === "Yes" && (
                      <div className="row ">
                        <div className="col col-6">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("remark")} />
                        </div>
                        <div className="col col-6">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            {" "}
                            Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                    </div>
                  </div>
<<<<<<< HEAD
                  <br></br>
                  <hr />
                  <br></br>
                  <div>
                    <h6>(iii) Court orders, if any, affecting applied land. &nbsp;&nbsp;</h6>
                    <label htmlFor="court">
                      <input {...register("court")} type="radio" value="Y" id="court" />
                      Yes
                    </label>
                    <label htmlFor="court">
                      <input {...register("court")} type="radio" value="N" id="court" />
                      No
                    </label>
                  </div>
                  <div className="row">
                    <div className="col col-12 ">
                      {watch("court") === "Y" && (
                        <div className="row ">
                          <div className="col col-6">
                            <label>
                              <h2>Remark/Case No.</h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("courtyCaseNo")} />
                          </div>
                          <div className="col col-6">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                            </h2>
                            <input
                              type="file"
                              className="form-control"
                              // {...register("courtDoc")}
                              onChange={(e) => getDocumentData(e?.target?.files[0], "courtDoc")}
                            />
                          </div>
=======
                </div>
                <br></br>
                <hr />
                <br></br>
                <h6>
                  (iii) Court orders, if any, affecting applied land &nbsp;&nbsp;
                  <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow11} />
                  &nbsp;&nbsp;
                  <label for="Yes">
                    <h6>Yes</h6>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow11} />
                  &nbsp;&nbsp;
                  <label for="No">
                    <h6>No</h6>
                  </label>
                </h6>
                <div className="row">
                  <div className="col col-12 ">
                    {showhide11 === "Yes" && (
                      <div className="row ">
                        <div className="col col-6">
                          <label>
                            {" "}
                            <h2>Remark/Case No.</h2>{" "}
                          </label>
                          <input type="text" className="form-control" {...register("caseNo")} />
                        </div>
                        <div className="col col-6">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            {" "}
                            Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <br></br>
                <hr />
                <br></br>
                <h6>
                  (iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed &nbsp;&nbsp;
                  <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow12} />
                  &nbsp;&nbsp;
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow12} />
                  &nbsp;&nbsp;
                  <label className="m-0 mx-2" for="No">No</label>
                </h6>
                <div className="row">
                  <div className="col col-12 ">
                    {showhide12 === "Yes" && (
                      <div className="row ">
                        <div className="col col-6">
                          <label>
                            <h2>Remark</h2>{" "}
                          </label>
                          <input type="text" className="form-control" {...register("insolvencyRemark")} />
                        </div>
                        <div className="col col-6">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            {" "}
                            Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                    </div>
                  </div>
<<<<<<< HEAD
                  <br></br>
                  <hr />
                  <br></br>
                  <div>
                    <h6>(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed.&nbsp;&nbsp;</h6>
                    <label htmlFor="insolvency">
                      <input {...register("insolvency")} type="radio" value="Y" id="insolvency" />
                      Yes
                    </label>
                    <label htmlFor="insolvency">
                      <input {...register("insolvency")} type="radio" value="N" id="insolvency" />
                      No
=======
                </div>
                <hr />
                <br></br>
                <h5>3.Shajra Plan</h5>
                <br></br>
                <div className="row">
                  <div className="col col-3 ">
                    <h2>(a)As per applied land (Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow14} />
                    &nbsp;&nbsp;
                    <label for="Yes">
                      <h6>Yes</h6>
                    </label>
                    &nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow14} />
                    &nbsp;&nbsp;
                    <label for="No">
                      <h6>No</h6>
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                    </label>
                  </div>
<<<<<<< HEAD
                  <div className="row">
                    <div className="col col-12 ">
                      {watch("insolvency") === "Y" && (
                        <div className="row ">
                          <div className="col col-6">
                            <label>
                              <h2>Remark</h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("insolvencyRemark")} />
                          </div>
                          <div className="col col-6">
                            <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
=======

                  <div className="col col-3 ">
                    <h2 data-toggle="tooltip" data-placement="top" title="If any revenue rasta abuts to the applied site ?">
                      (b)&nbsp;Revenue rasta&nbsp;&nbsp; &nbsp;&nbsp;
                    </h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow1} />
                    &nbsp;&nbsp;
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow1} />
                    &nbsp;&nbsp;
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide1 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                              {" "}
                              Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                            </h2>
                            <input
                              type="file"
                              className="form-control"
                              // {...register("insolvencyDoc")}
                              onChange={(e) => getDocumentData(e?.target?.files[0], "insolvencyDoc")}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
<<<<<<< HEAD
                  <hr />
                  <br></br>
                  <h5>3.Shajra Plan</h5>
                  <br></br>
                  <div className="row">
                    <div className="col col-3 ">
                      <h2>(a)&nbsp;As per applied land (Yes/No)</h2>
                      <label htmlFor="appliedLand">
                        <input {...register("appliedLand")} type="radio" value="Y" id="appliedLand" />
                        Yes
                      </label>
                      <label htmlFor="appliedLand">
                        <input {...register("appliedLand")} type="radio" value="N" id="appliedLand" />
                        No
                      </label>
                      {watch("appliedLand") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">
                              Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                            </h6>
                            <input
                              type="file"
                              className="form-control"
                              // {...register("docUpload")}
                              onChange={(e) => getDocumentData(e?.target?.files[0], "docUpload")}
                            />
                          </div>
=======
                  <div className="col col-3 ">
                    <h2 data-toggle="tooltip" data-placement="top" title="Watercourse running along boundary through the applied site ?">
                      (c)&nbsp;Watercourse running&nbsp;&nbsp;
                    </h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow2} />
                    &nbsp;&nbsp;
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow2} />
                    &nbsp;&nbsp;
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide2 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            {" "}
                            <h2>Remark</h2>{" "}
                          </label>
                          <input type="text" className="form-control" {...register("watercouseRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                    </div>

<<<<<<< HEAD
                    <div className="col col-3 ">
                      <h2 data-toggle="tooltip" data-placement="top" title="If any revenue rasta abuts to the applied site ?">
                        (b)&nbsp;Revenue rasta&nbsp;&nbsp; &nbsp;&nbsp;
                      </h2>
                      <label htmlFor="revenueRasta">
                        <input {...register("revenueRasta")} type="radio" value="Y" id="revenueRasta" />
                        Yes
                      </label>
                      <label htmlFor="revenueRasta">
                        <input {...register("revenueRasta")} type="radio" value="N" id="revenueRasta" />
                        No
                      </label>
                      {watch("revenueRasta") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                {" "}
                                Width of revenue rasta &nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="number" className="form-control" {...register("revenueRastaWidth")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3 ">
                      <h2 data-toggle="tooltip" data-placement="top" title="Watercourse running along boundary through the applied site ?">
                        (c)&nbsp;Watercourse running&nbsp;&nbsp;
                      </h2>
                      <label htmlFor="waterCourse">
                        <input {...register("waterCourse")} type="radio" value="Y" id="waterCourse" />
                        Yes
                      </label>
                      <label htmlFor="waterCourse">
                        <input {...register("waterCourse")} type="radio" value="N" id="waterCourse" />
                        No
                      </label>
                      {watch("waterCourse") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              {" "}
                              <h2>Remark</h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("waterCourseRemark")} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col col-3 ">
                      <h2>(d) &nbsp;Whether in Compact Block (Yes/No)</h2>
                      <label htmlFor="compactBlock">
                        <input {...register("compactBlock")} type="radio" value="Y" id="compactBlock" />
                        Yes
                      </label>
                      <label htmlFor="compactBlock">
                        <input {...register("compactBlock")} type="radio" value="N" id="compactBlock" />
                        No
                      </label>
                      {watch("compactBlock") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Remark</h2>{" "}
                            </label>
                            <input type="text" className="form-control" {...register("compactBlockRemark")} />
                          </div>
=======
                  <div className="col col-3 ">
                    <h2>(d)Whether in Compact Block (Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow15} />
                    &nbsp;&nbsp;
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow15} />
                    &nbsp;&nbsp;
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide15 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark</h2>{" "}
                          </label>
                          <input type="number" className="form-control" {...register("compactRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>{" "}
                <br></br>
                <div className="row">
                  <div className="col col-3 ">
                    <h2 data-toggle="tooltip" data-placement="top" title="If any other owners' land is sandwiched within applied land.">
                      (e)&nbsp;Land Sandwiched&nbsp;&nbsp;
                    </h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow20} />
                    &nbsp;&nbsp;
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow20} />
                    &nbsp;&nbsp;
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide20 === "Yes" && (
                      <div className="row ">
                        <div className="col col-12">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("sandwichedRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3 ">
                    <h2>(f)Acquisition status (Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow3} />
                    &nbsp;&nbsp;
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow3} />
                    &nbsp;&nbsp;
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide3 === "Yes" && (
                      <div className="row ">
                        <div className="col col-12">
                          <label>Remark</label>
                          <input type="text" className="form-control" {...register("acquistionRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                    </div>
                  </div>
<<<<<<< HEAD
                  <br></br>
                  <div className="row">
                    <div className="col col-3 ">
                      <h2 data-toggle="tooltip" data-placement="top" title="If any other owners' land is sandwiched within applied land.">
                        (e)&nbsp;Land Sandwiched&nbsp;&nbsp;
                      </h2>
                      <label htmlFor="landSandwiched">
                        <input {...register("landSandwiched")} type="radio" value="Y" id="landSandwiched" />
                        Yes
                      </label>
                      <label htmlFor="landSandwiched">
                        <input {...register("landSandwiched")} type="radio" value="N" id="landSandwiched" />
                        No
                      </label>
                      {watch("landSandwiched") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("landSandwichedRemark")} />
                          </div>
=======
                </div>{" "}
                <br></br>
                <div className="row">
                  <div className="col col-12">
                    <label>
                      <h2>(g)&nbsp;&nbsp;Whether details/orders of release/exclusion of land uploaded.</h2>
                    </label>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow16} />
                    &nbsp;&nbsp;
                    <label for="Yes">
                      <h6>Yes</h6>
                    </label>
                    &nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow16} />
                    &nbsp;&nbsp;
                    <label for="No">
                      <h6>No</h6>
                    </label>
                    {showhide16 === "Yes" && (
                      <div className="row ">
                        <div className="col col-3 ">
                          <h2>
                            (h) Whether land compensation received&nbsp;&nbsp;
                            <input type="radio" value="Yes"  onChange1={handleChange}  />
                            &nbsp;&nbsp;
                            <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                            <input type="radio" value="No"  onChange1={handleChange}  />
                            &nbsp;&nbsp;
                            <label className="m-0 mx-2" for="No">No</label>
                          </h2>
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>Status of release</h2>
                          </label>
                          <select className="form-control" id="releasestatus" {...register("releasestatus")}>
                            <option value=""></option>
                            <option></option>
                            <option></option>
                            <option></option>
                          </select>
                          <div className="invalid-feedback">{errors?.releasestatus?.message}</div>
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>Date of Award</h2>
                          </label>
                          <input type="date" {...register("awarddate")} className="form-control" />
                          <div className="invalid-feedback">{errors?.awarddate?.message}</div>
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                    </div>
                    <div className="col col-3 ">
                      <h2>(f)&nbsp;Acquisition status (Yes/No)</h2>
                      <label htmlFor="acquistion">
                        <input {...register("acquistion")} type="radio" value="Y" id="acquistion" />
                        Yes
                      </label>
                      <label htmlFor="acquistion">
                        <input {...register("acquistion")} type="radio" value="N" id="acquistion" />
                        No
                      </label>
                      {watch("acquistion") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>Remark</label>
                            <input type="text" className="form-control" {...register("acquistionRemark")} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col col-3">
                      <label>
                        <h2>Date of section 4 notification</h2>{" "}
                      </label>
                      <input type="date" {...register("sectionFour")} className="form-control" />
                      <div className="invalid-feedback">{errors?.sectionFour?.message}</div>
                    </div>
                    <div className="col col-3">
                      <label>
                        <h2>Date of section 6 notification</h2>
                      </label>
                      <input type="date" className="form-control" {...register("sectionSix")} />
                      <div className="invalid-feedback">{errors?.sectionSix?.message}</div>
                    </div>
                  </div>{" "}
                  <br></br>
                  <div className="row">
                    <div className="col col-12">
                      <label>
                        <h2>(g)&nbsp;&nbsp;Whether details/orders of release/exclusion of land uploaded.&nbsp;&nbsp;</h2>
                      </label>
                      <label htmlFor="orderUpload">
                        <input {...register("orderUpload")} type="radio" value="Y" id="orderUpload" />
                        Yes
                      </label>
                      <label htmlFor="orderUpload">
                        <input {...register("orderUpload")} type="radio" value="N" id="orderUpload" />
                        No
                      </label>
                      {watch("orderUpload") === "Y" && (
                        <div className="row ">
                          <div className="col col-3 ">
                            <h2>(h) Whether land compensation received&nbsp;&nbsp;</h2>
                            <label htmlFor="landCompensation">
                              <input {...register("landCompensation")} type="radio" value="Y" id="landCompensation" />
                              Yes
                            </label>
                            <label htmlFor="landCompensation">
                              <input {...register("landCompensation")} type="radio" value="N" id="landCompensation" />
                              No
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
                              <h2>Date of Award</h2>
                            </label>
                            <input type="date" {...register("awardDate")} className="form-control" />
                            <div className="invalid-feedback">{errors?.awardDate?.message}</div>
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
                            <input type="text" {...register("siteDetail")} className="form-control" />
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
                        road. (yes/no)
                      </h2>
<<<<<<< HEAD
                      <label htmlFor="siteApproachable">
                        <input {...register("siteApproachable")} type="radio" value="Y" id="siteApproachable" />
                        Yes
                      </label>
                      <label htmlFor="siteApproachable">
                        <input {...register("siteApproachable")} type="radio" value="N" id="siteApproachable" />
                        No
                      </label>
                    </div>
                  </div>
                  <br></br>
                  <hr />
                  <br></br>
                  <h4>4.Site condition</h4>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h2>(a) &nbsp;Vacant: (Yes/No)</h2>
                      <label htmlFor="vacant">
                        <input {...register("vacant")} type="radio" value="Y" id="vacant" />
                        Yes
                      </label>
                      <label htmlFor="vacant">
                        <input {...register("vacant")} type="radio" value="N" id="vacant" />
                        No
                      </label>
                      {watch("vacant") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Vacant Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("vacantRemark")} />
                          </div>
=======
                    </label>{" "}
                    &nbsp;&nbsp;
                    <input type="radio" value="Yes"  onChange1={handleChange}  />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  />
                    <label className="m-0 mx-2" for="No">No</label>
                  </div>
                </div>
                <br></br>
                <hr />
                <br></br>
                <h4>4.Site condition</h4>
                <br></br>
                <div className="row">
                  <div className="col col-3">
                    <h2>(a)vacant(Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow17} />
                    &nbsp;&nbsp;
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow17} />
                    &nbsp;&nbsp;
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide17 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Vacant Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("vacantRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                      {watch("vacant") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Vacant Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("vacantRemark")} />
                          </div>
                        </div>
<<<<<<< HEAD
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>(b) &nbsp;Construction: (Yes/No)</h2>
                      <label htmlFor="construction">
                        <input {...register("construction")} type="radio" value="Y" id="construction" />
                        Yes
                      </label>
                      <label htmlFor="construction">
                        <input {...register("construction")} type="radio" value="N" id="construction" />
                        No
                      </label>
                      {watch("construction") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>Type of Construction</label>
                            <input type="text" className="form-control" {...register("typeOfConstruction")} />
                          </div>
=======
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(b)Construction: (Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow4} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow4} />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide4 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Type of Construction</label>
                          <input type="text" className="form-control" {...register("ConstType")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                      {watch("construction") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("constructionRemark")} />
                          </div>
                        </div>
<<<<<<< HEAD
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>(c) &nbsp;HT line:(Yes/No)</h2>
                      <label htmlFor="HTLine">
                        <input {...register("ht")} type="radio" value="Y" id="HTLine" />
                        Yes
                      </label>
                      <label htmlFor="HTLine">
                        <input {...register("ht")} type="radio" value="N" id="HTLine" />
                        No
                      </label>
                      {watch("ht") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>HT Remark</h2>
                            </label>
                            <input type="text" className="form-control" {...register("htRemark")} />
                          </div>
=======
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(c)HT line:(Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow5} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow5} />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide5 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>HT Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("htRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
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
<<<<<<< HEAD
                      )}
                    </div>

                    <div className="col col-3">
                      <h2>(d)&nbsp;IOC Gas Pipeline:(Yes/No)</h2>
                      <label htmlFor="IOCGasPipeline">
                        <input {...register("gas")} type="radio" value="Y" id="IOCGasPipeline" />
                        Yes
                      </label>
                      <label htmlFor="IOCGasPipeline">
                        <input {...register("gas")} type="radio" value="N" id="IOCGasPipeline" />
                        No
                      </label>
                      {watch("gas") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>IOC Remark</label>
                            <input type="text" className="form-control" {...register("gasRemark")} />
                          </div>
=======
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(d) IOC Gas Pipeline:(Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow6} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow6} />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide6 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>IOC Remark</label>
                          <input type="text" className="form-control" {...register("iocRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
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
                  </div>
<<<<<<< HEAD
                  <br></br>
                  <div className="row ">
                    <div className="col col-3">
                      <h2>(e) &nbsp;Nallah:(Yes/No)</h2>
                      <label htmlFor="nallah">
                        <input {...register("nallah")} type="radio" value="Y" id="nallah" />
                        Yes
                      </label>
                      <label htmlFor="nallah">
                        <input {...register("nallah")} type="radio" value="N" id="nallah" />
                        No
                      </label>
                      {watch("nallah") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>Nallah Remark</label>
                            <input type="text" className="form-control" {...register("nallahRemark")} />
                          </div>
=======
                </div>
                <br></br>
                <div className="row ">
                  <div className="col col-3">
                    <h2>(e)Nallah:(Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow7} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow7} />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide7 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Nallah Remark</label>
                          <input type="text" className="form-control" {...register("nallahRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                      {watch("nallah") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>Nallah Remark</label>
                            <input type="text" className="form-control" {...register("nallahRemark")} />
                          </div>
                        </div>
<<<<<<< HEAD
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>(f) &nbsp;Any revenue rasta/road:(Yes/No)</h2>
                      <label htmlFor="road">
                        <input {...register("road")} type="radio" value="Y" id="road" />
                        Yes
                      </label>
                      <label htmlFor="road">
                        <input {...register("road")} type="radio" value="N" id="road" />
                        No
                      </label>
                      {watch("road") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Width of Revenue rasta/road &nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("roadWidth")} />
                          </div>
                          <div className="col col">
                            <label>
                              <h2>
                                Remark &nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("roadRemark")} />
                          </div>
=======
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(f)Any revenue rasta/road:(Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow8} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow8} />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide8 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>
                              Width of Revenue rasta/road &nbsp;&nbsp;
                              <CalculateIcon color="primary" />
                            </h2>
                          </label>
                          <input type="text" className="form-control" {...register("roadRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
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
<<<<<<< HEAD
                      )}
                    </div>
                    <div className="col col-3">
                      <h2>(g) &nbsp;Any marginal land:(Yes/No)</h2>
                      <label htmlFor="marginalLand">
                        <input {...register("marginalLand")} type="radio" value="Y" id="marginalLand" />
                        Yes
                      </label>
                      <label htmlFor="marginalLand">
                        <input {...register("marginalLand")} type="radio" value="N" id="marginalLand" />
                        No
                      </label>
                      {watch("marginalLand") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Remark of Marginal Land </h2>
                            </label>
                            <input type="text" className="form-control" {...register("marginalLandRemark")} />
                          </div>
=======
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(g)Any marginal land:(Yes/No)</h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow9} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow9} />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide9 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark of Marginal Land </h2>
                          </label>
                          <input type="text" className="form-control" {...register("marginalRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
                        </div>
                      )}
                      {watch("marginalLand") === "N" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>Remark of Marginal Land </h2>
                            </label>
                            <input type="text" className="form-control" {...register("marginalLandRemark")} />
                          </div>
                        </div>
<<<<<<< HEAD
                      )}
                    </div>
                    <div className="col col-3">
                      <h2
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Whether any utility line passing through the site is incorporated/adjusted in the layout plan (Yes/No)"
                      >
                        (h)&nbsp;Utility Line &nbsp; &nbsp;
                      </h2>
                      <label htmlFor="utilityLine">
                        <input {...register("utilityLine")} type="radio" value="Y" id="utilityLine" />
                        Yes
                      </label>
                      <label htmlFor="utilityLine">
                        <input {...register("utilityLine")} type="radio" value="N" id="utilityLine" />
                        No
                      </label>
                      {watch("utilityLine") === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label>
                              <h2>
                                Width of row &nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("utilityWidth")} />
                          </div>
                          <div className="col col">
                            <label>
                              <h2>
                                Remark &nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </h2>
                            </label>
                            <input type="text" className="form-control" {...register("utilityRemark")} />
                          </div>
=======
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Whether any utility line passing through the site is incorporated/adjusted in the layout plan (Yes/No)
"
                    >
                      (h)&nbsp;Utility Line &nbsp; &nbsp;
                    </h2>
                    <input type="radio" value="Yes"  onChange1={handleChange}  onClick={handleshow0} />
                    <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No"  onChange1={handleChange}  onClick={handleshow0} />
                    <label className="m-0 mx-2" for="No">No</label>
                    {showhide0 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>
                              Width of row &nbsp;&nbsp;
                              <CalculateIcon color="primary" />
                            </h2>
                          </label>
                          <input type="text" className="form-control" {...register("utilityRemark")} />
>>>>>>> 93da77b04a20c82de027a0bf46eca81ac8893898
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
                  </div>
                  <br></br>
                  <hr></hr>
                  <br></br>
                  <h5>5. Enclose the following documents as Annexures</h5>
                  <br></br>
                  <div className="row">
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Land schedule &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </h2>

                      <input
                        type="file"
                        className="form-control"
                        // {...register("landSchedule")}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "landSchedule")}
                      />
                    </div>
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Copy of Mutation &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </h2>

                      <input
                        type="file"
                        className="form-control"
                        // {...register("mutation")}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "mutation")}
                      />
                    </div>
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Copy of Jamabandi &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </h2>

                      <input
                        type="file"
                        className="form-control"
                        // {...register("jambandhi")}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "jambandhi")}
                      />
                    </div>
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Details of lease / patta, if any &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </h2>
                      <input
                        type="file"
                        className="form-control"
                        // {...register("detailsOfLease")}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "detailsOfLease")}
                      />
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
                        Add sales/Deed/exchange &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </h2>
                      <input
                        type="file"
                        className="form-control"
                        // {...register("addSalesDeed")}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "addSalesDeed")}
                      />
                    </div>
                    <div className="col col-3">
                      <h2
                        style={{ display: "flex" }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title="    Copy of spa/GPA/board resolution to sign collaboration agrrement"
                      >
                        Copy of spa/GPA/board resolution &nbsp;&nbsp;
                        <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </h2>
                      <input
                        type="file"
                        className="form-control"
                        // {...register("copyofSpaBoard")}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "copyofSpaBoard")}
                      />
                    </div>
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Revised Land Schedule &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </h2>
                      <input
                        type="file"
                        className="form-control"
                        // {...register("revisedLansSchedule")}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "revisedLansSchedule")}
                      />
                    </div>
                    <div className="col col-3">
                      <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                        Copy of Shajra Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                      </h2>
                      <input
                        type="file"
                        className="form-control"
                        // {...register("copyOfShajraPlan")}
                        onChange={(e) => getDocumentData(e?.target?.files[0], "copyOfShajraPlan")}
                      />
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
