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
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

const LandScheduleForm = (props) => {
  const [file, setFile] = useState(null);
  const [docUpload, setDocuploadData] = useState([]);
  const [LandFormSubmitted, SetLandFormSubmitted] = useState(false);
  const [submitDataLabel, setSubmitDataLabel] = useState([]);
  const [purposeOptions, setPurposeOptions] = useState({ data: [], isLoading: true });
  const [getPotentialOptons, setPotentialOptions] = useState({ data: [], isLoading: true });
  const [typeOfLand, setYypeOfLand] = useState({ data: [], isLoading: true });

  const stateId = Digit.ULBService.getStateId();
  const { data: PurposeType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["Purpose"]);

  const { data: LandType } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["LandType"]);

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
    const landType = LandType?.["common-masters"]?.LandType?.map(function (data) {
      return { value: data?.code, label: data?.zone };
    });
    setYypeOfLand({ data: landType, isLoading: false });
  }, [LandType]);

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
    data["potential"] = data?.potential?.value;
    data["approachType"] = data?.approachType?.value;
    data["typeLand"] = data?.typeLand?.value;
    data["purposeParentLic"] = data?.purposeParentLic?.value;

    data[""];
    console.log("data------", data);
    props.Step3Continue(data, "5");
    // return;
    const token = window?.localStorage?.getItem("token");
    const postDistrict = {
      pageName: "LandSchedule",
      id: props.getId,

      createdBy: props?.userInfo?.id,
      updatedBy: props?.userInfo?.id,
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
        userInfo: props?.userInfo,
      },
    };
    try {
      const Resp = await axios.post("/tl-services/new/_create", postDistrict);
      console.log("MMM", Resp?.data);
      props.Step3Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
      // SetLandFormSubmitted(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log("props", props);
  // useEffect(() => {
  //   if (LandFormSubmitted) {
  //     props.landFormSubmit(true);
  //   }
  // }, [LandFormSubmitted]);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`/land-services/new/licenses/_get?id=${props.getId}`);
      const userData = Resp?.data?.newServiceInfoData?.[0]?.LandSchedule;
      setSubmitDataLabel(userData);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getSubmitDataLabel();
  }, []);

  const getDocumentData = async () => {
    if (file === null) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file.file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");

    try {
      const Resp = await axios
        .post("/filestore/v1/files", formData, {
          // headers: {
          //   "content-type": "multipart/form-data",
          // },
        })
        .then((response) => {
          return response;
        });
      setDocuploadData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getDocumentData();
  }, [file]);

  return (
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
                        <label htmlFor="licenseApplied">
                          <input {...register("licenseApplied")} type="radio" value="yes" id="licenseApplied" />
                          &nbsp;&nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="licenseApplied">
                          <input {...register("licenseApplied")} type="radio" value="no" id="licenseApplied" />
                          &nbsp;&nbsp; No
                        </label>{" "}
                      </h2>
                    </div>

                    {watch("licenseApplied") === "yes" && (
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
                          <ReactMultiSelect control={control} name="approachType" placeholder="Approach" data={potentialOptons} labels="Potential" />
                          {/* <select className="form-control" id="approachType" {...register("approachType")}>
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
                            <input {...register("thirdParty")} type="radio" value="yes" id="thirdParty" />
                            &nbsp;&nbsp; Yes &nbsp;&nbsp;
                          </label>
                          <label htmlFor="thirdParty">
                            <input {...register("thirdParty")} type="radio" value="no" id="thirdParty" />
                            &nbsp;&nbsp; No &nbsp;&nbsp;
                          </label>
                          {watch("thirdParty") === "yes" && (
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
                                <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                              </div>
                            </div>
                          )}
                          {watch("thirdParty") === "no" && (
                            <div className="row ">
                              <div className="col col">
                                <label>
                                  <h2>
                                    Document Upload <span style={{ color: "red" }}>*</span>
                                  </h2>
                                </label>
                                <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
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
                          <input {...register("migrationLic")} type="radio" value="yes" id="migrationLic" />
                          Yes
                        </label>
                        <label htmlFor="migrationLic">
                          <input {...register("migrationLic")} type="radio" value="no" id="migrationLic" />
                          No
                        </label>
                      </h2>
                    </div>
                    {watch("migrationLic") === "yes" && (
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
                          <input type="number" className="form-control" {...register("licNo")} />
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
                            <input {...register("validityOfParentLic")} type="radio" value="yes" id="validityOfParentLic" />
                            Yes
                          </label>
                          <label htmlFor="validityOfParentLic">
                            <input {...register("validityOfParentLic")} type="radio" value="no" id="validityOfParentLic" />
                            No
                          </label>
                        </div>
                        {watch("validityOfParentLic") === "yes" && (
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
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                        </div>
                        <div className="col col-3">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Proposed Layout of Plan /site plan for area applied for migration. &nbsp;&nbsp;
                            <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                        </div>
                        <div className="col col-3">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Upload Previously approved Layout Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                </div>
                <br></br>
                <hr />
                <br></br>
                <div>
                  <h6>(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator. </h6>
                  <label htmlFor="litigation">
                    <input {...register("litigation")} type="radio" value="yes" id="litigation" />
                    Yes
                  </label>
                  <label htmlFor="litigation">
                    <input {...register("litigation")} type="radio" value="no" id="litigation" />
                    No
                  </label>
                </div>
                <div className="row">
                  <div className="col col-12 ">
                    {watch("litigation") === "yes" && (
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
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <br></br>
                <hr />
                <br></br>
                <div>
                  <h6>(iii) Court orders, if any, affecting applied land. &nbsp;&nbsp;</h6>
                  <label htmlFor="court">
                    <input {...register("court")} type="radio" value="yes" id="court" />
                    Yes
                  </label>
                  <label htmlFor="court">
                    <input {...register("court")} type="radio" value="no" id="court" />
                    No
                  </label>
                </div>
                <div className="row">
                  <div className="col col-12 ">
                    {watch("court") === "yes" && (
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
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <br></br>
                <hr />
                <br></br>
                <div>
                  <h6>(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed.&nbsp;&nbsp;</h6>
                  <label htmlFor="insolvency">
                    <input {...register("insolvency")} type="radio" value="yes" id="insolvency" />
                    Yes
                  </label>
                  <label htmlFor="insolvency">
                    <input {...register("insolvency")} type="radio" value="no" id="insolvency" />
                    No
                  </label>
                </div>
                <div className="row">
                  <div className="col col-12 ">
                    {watch("insolvency") === "yes" && (
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <hr />
                <br></br>
                <h5>3.Shajra Plan</h5>
                <br></br>
                <div className="row">
                  <div className="col col-3 ">
                    <h2>(a)&nbsp;As per applied land (Yes/No)</h2>
                    <label htmlFor="appliedLand">
                      <input {...register("appliedLand")} type="radio" value="yes" id="appliedLand" />
                      Yes
                    </label>
                    <label htmlFor="appliedLand">
                      <input {...register("appliedLand")} type="radio" value="no" id="appliedLand" />
                      No
                    </label>
                    {watch("appliedLand") === "yes" && (
                      <div className="row ">
                        <div className="col col-12">
                          <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h6>
                          <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col col-3 ">
                    <h2 data-toggle="tooltip" data-placement="top" title="If any revenue rasta abuts to the applied site ?">
                      (b)&nbsp;Revenue rasta&nbsp;&nbsp; &nbsp;&nbsp;
                    </h2>
                    <label htmlFor="revenueRasta">
                      <input {...register("revenueRasta")} type="radio" value="yes" id="revenueRasta" />
                      Yes
                    </label>
                    <label htmlFor="revenueRasta">
                      <input {...register("revenueRasta")} type="radio" value="no" id="revenueRasta" />
                      No
                    </label>
                    {watch("revenueRasta") === "yes" && (
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
                      <input {...register("waterCourse")} type="radio" value="yes" id="waterCourse" />
                      Yes
                    </label>
                    <label htmlFor="waterCourse">
                      <input {...register("waterCourse")} type="radio" value="no" id="waterCourse" />
                      No
                    </label>
                    {watch("waterCourse") === "yes" && (
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
                      <input {...register("compactBlock")} type="radio" value="yes" id="compactBlock" />
                      Yes
                    </label>
                    <label htmlFor="compactBlock">
                      <input {...register("compactBlock")} type="radio" value="no" id="compactBlock" />
                      No
                    </label>
                    {watch("compactBlock") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark</h2>{" "}
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
                      (e)&nbsp;Land Sandwiched&nbsp;&nbsp;
                    </h2>
                    <label htmlFor="landSandwiched">
                      <input {...register("landSandwiched")} type="radio" value="yes" id="landSandwiched" />
                      Yes
                    </label>
                    <label htmlFor="landSandwiched">
                      <input {...register("landSandwiched")} type="radio" value="no" id="landSandwiched" />
                      No
                    </label>
                    {watch("landSandwiched") === "yes" && (
                      <div className="row ">
                        <div className="col col-12">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("landSandwichedRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3 ">
                    <h2>(f)&nbsp;Acquisition status (Yes/No)</h2>
                    <label htmlFor="acquistion">
                      <input {...register("acquistion")} type="radio" value="yes" id="acquistion" />
                      Yes
                    </label>
                    <label htmlFor="acquistion">
                      <input {...register("acquistion")} type="radio" value="no" id="acquistion" />
                      No
                    </label>
                    {watch("acquistion") === "yes" && (
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
                      &nbsp;&nbsp;
                      <input {...register("orderUpload")} type="radio" value="yes" id="orderUpload" />
                      &nbsp;&nbsp; Yes
                    </label>
                    <label htmlFor="orderUpload">
                      &nbsp;&nbsp;
                      <input {...register("orderUpload")} type="radio" value="no" id="orderUpload" />
                      &nbsp;&nbsp; No
                    </label>
                    {watch("orderUpload") === "yes" && (
                      <div className="row ">
                        <div className="col col-3 ">
                          <h2>
                            Whether land compensation received&nbsp;&nbsp;
                            <label htmlFor="landCompensation">
                              &nbsp;&nbsp;
                              <input {...register("landCompensation")} type="radio" value="yes" id="landCompensation" />
                              &nbsp;&nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="landCompensation">
                              &nbsp;&nbsp;
                              <input {...register("landCompensation")} type="radio" value="no" id="landCompensation" />
                              &nbsp;&nbsp; No &nbsp;&nbsp;
                            </label>
                          </h2>
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
                    <label htmlFor="siteApproachable">
                      &nbsp;&nbsp;
                      <input {...register("siteApproachable")} type="radio" value="yes" id="siteApproachable" />
                      &nbsp;&nbsp; Yes
                    </label>
                    <label htmlFor="siteApproachable">
                      &nbsp;&nbsp;
                      <input {...register("siteApproachable")} type="radio" value="no" id="siteApproachable" />
                      &nbsp;&nbsp; No
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
                      <input {...register("vacant")} type="radio" value="yes" id="vacant" />
                      Yes
                    </label>
                    <label htmlFor="vacant">
                      <input {...register("vacant")} type="radio" value="no" id="vacant" />
                      No
                    </label>
                    {watch("vacant") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Vacant Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("vacantRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("vacant") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Vacant Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("vacantRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(b) &nbsp;Construction: (Yes/No)</h2>
                    <label htmlFor="construction">
                      <input {...register("construction")} type="radio" value="yes" id="construction" />
                      Yes
                    </label>
                    <label htmlFor="construction">
                      <input {...register("construction")} type="radio" value="no" id="construction" />
                      No
                    </label>
                    {watch("construction") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Type of Construction</label>
                          <input type="text" className="form-control" {...register("typeOfConstruction")} />
                        </div>
                      </div>
                    )}
                    {watch("construction") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("constructionRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(c) &nbsp;HT line:(Yes/No)</h2>
                    <label htmlFor="HTLine">
                      <input {...register("ht")} type="radio" value="yes" id="HTLine" />
                      Yes
                    </label>
                    <label htmlFor="HTLine">
                      <input {...register("ht")} type="radio" value="no" id="HTLine" />
                      No
                    </label>
                    {watch("ht") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>HT Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("htRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("ht") === "no" && (
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
                    <h2>(d)&nbsp;IOC Gas Pipeline:(Yes/No)</h2>
                    <label htmlFor="IOCGasPipeline">
                      <input {...register("gas")} type="radio" value="yes" id="IOCGasPipeline" />
                      Yes
                    </label>
                    <label htmlFor="IOCGasPipeline">
                      <input {...register("gas")} type="radio" value="no" id="IOCGasPipeline" />
                      No
                    </label>
                    {watch("gas") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>IOC Remark</label>
                          <input type="text" className="form-control" {...register("gasRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("gas") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>IOC Remark</label>
                          <input type="text" className="form-control" {...register("gasRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <br></br>
                <div className="row ">
                  <div className="col col-3">
                    <h2>(e) &nbsp;Nallah:(Yes/No)</h2>
                    <label htmlFor="nallah">
                      <input {...register("nallah")} type="radio" value="yes" id="nallah" />
                      Yes
                    </label>
                    <label htmlFor="nallah">
                      <input {...register("nallah")} type="radio" value="no" id="nallah" />
                      No
                    </label>
                    {watch("nallah") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Nallah Remark</label>
                          <input type="text" className="form-control" {...register("nallahRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("nallah") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Nallah Remark</label>
                          <input type="text" className="form-control" {...register("nallahRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(f) &nbsp;Any revenue rasta/road:(Yes/No)</h2>
                    <label htmlFor="road">
                      <input {...register("road")} type="radio" value="yes" id="road" />
                      Yes
                    </label>
                    <label htmlFor="road">
                      <input {...register("road")} type="radio" value="no" id="road" />
                      No
                    </label>
                    {watch("road") === "yes" && (
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
                      </div>
                    )}
                    {watch("road") === "no" && (
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
                  <div className="col col-3">
                    <h2>(g) &nbsp;Any marginal land:(Yes/No)</h2>
                    <label htmlFor="marginalLand">
                      <input {...register("marginalLand")} type="radio" value="yes" id="marginalLand" />
                      Yes
                    </label>
                    <label htmlFor="marginalLand">
                      <input {...register("marginalLand")} type="radio" value="no" id="marginalLand" />
                      No
                    </label>
                    {watch("marginalLand") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark of Marginal Land </h2>
                          </label>
                          <input type="text" className="form-control" {...register("marginalLandRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("marginalLand") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark of Marginal Land </h2>
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
                      (h)&nbsp;Utility Line &nbsp; &nbsp;
                    </h2>
                    <label htmlFor="utilityLine">
                      <input {...register("utilityLine")} type="radio" value="yes" id="utilityLine" />
                      Yes
                    </label>
                    <label htmlFor="utilityLine">
                      <input {...register("utilityLine")} type="radio" value="no" id="utilityLine" />
                      No
                    </label>
                    {watch("utilityLine") === "yes" && (
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
                      </div>
                    )}
                    {watch("utilityLine") === "no" && (
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

                    <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Mutation &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Jamabandi &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Details of lease / patta, if any &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>
                    <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
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
                    <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
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
                    <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Revised Land Schedule &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>
                    <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Shajra Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>
                    <input type="file" className="form-control" onChange={(e) => setFile({ file: e.target.files[0] })} />
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
  );
};
export default LandScheduleForm;
