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

const LandScheduleForm = (props) => {
  const [file, setFile] = useState(null);
  const [docUpload, setDocuploadData] = useState([]);
  const [LandFormSubmitted, SetLandFormSubmitted] = useState(false);
  const [submitDataLabel, setSubmitDataLabel] = useState([]);

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
    console.log("data------", data);
    return;
    try {
      const postDistrict = {
        NewServiceInfo: {
          pageName: "LandSchedule",
          id: props.getId,
          newServiceInfoData: {
            LandSchedule: {
              licenseApplied: "",
              LicNo: data.licNo,
              potential: data.potential,
              siteLoc: data.siteLoc,
              approach: data.approach,
              approachRoadWidth: data.roadwidth,
              specify: data.specify,
              typeLand: data.typeland,
              thirdParty: data.thirdParty,
              migrationLic: data.areamigration,
              purpose: data.purpose,
              LicenseNo: data.licenseNo,
              AreaLic: data.araeLic,
              renewalFees: data.renewalFee,
              freshlyApplied: data.freshlyApplied,
              encumburance: data.pleaseSpecify,
              litigation: data.remark,
              court: data.caseNo,
              insolvency: data.insolvencyRemark,
              appliedLand: "",
              revenuerasta: data.widthRevenue,
              watercourse: data.watercouseRemark,
              compactBlock: data.compactRemark,
              sandwiched: data.sandwichedRemark,
              acquistion: data.acquistionRemark,
              section4: data.sectionfour,
              section6: data.sectionsix,
              statusRelease: data.releasestatus,
              awardDate: data.awarddate,
              dateRelease: data.releasedate,
              siteDetails: data.sitedetails,
              orderUpload: "",
              approachable: "",
              vacant: data.vacantRemark,
              construction: data.ConstType,
              ht: data.htRemark,
              gas: data.iocRemark,
              nallah: data.nallahRemark,
              road: data.roadRemark,
              land: data.marginalRemark,
              utilityLine: data.utilityRemark,
            },
          },
        },
      };

      const Resp = await axios.post("/land-services/new/_create", postDistrict).then((Resp) => {
        return Resp;
      });

      console.log("MMM", Resp?.data?.NewServiceInfo?.[0]?.id);
      props.Step3Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
      SetLandFormSubmitted(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };

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
          headers: {
            "content-type": "multipart/form-data",
          },
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
                        <label htmlFor="licenceApplied">
                          <input {...register("licenceApplied")} type="radio" value="yes" id="licenceApplied" />
                          Yes
                        </label>
                        <label htmlFor="licenceApplied">
                          <input {...register("licenceApplied")} type="radio" value="no" id="licenceApplied" />
                          No
                        </label>
                      </h2>
                    </div>

                    {watch("licenceApplied") === "yes" && (
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
                          <ReactMultiSelect
                            control={control}
                            name="potential"
                            placeholder="Potential Zone"
                            data={potentialOptons}
                            labels="Potential"
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
                          <ReactMultiSelect control={control} name="approach" placeholder="Approach" data={potentialOptons} labels="Potential" />
                          {/* <select className="form-control" id="approach" {...register("approach")}>
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
                          <input type="number" className="form-control" {...register("roadwidth")}></input>
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>
                              Specify Others<span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <input type="number" {...register("specify")} className="form-control" />
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>
                              Type of land<span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <ReactMultiSelect control={control} name="typeland" placeholder="Type of Land" data={potentialOptons} labels="typeland" />

                          {/* <select className="form-control" id="typeland" {...register("typeland")}>
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

                          <label htmlFor="thirdPartyRightCreated">
                            <input {...register("thirdPartyRightCreated")} type="radio" value="yes" id="thirdPartyRightCreated" />
                            Yes
                          </label>
                          <label htmlFor="thirdPartyRightCreated">
                            <input {...register("thirdPartyRightCreated")} type="radio" value="no" id="thirdPartyRightCreated" />
                            No
                          </label>
                          {watch("thirdPartyRightCreated") === "yes" && (
                            <div className="row ">
                              <div className="col col-12">
                                <label>
                                  {" "}
                                  <h2>
                                    Remark<span style={{ color: "red" }}>*</span>
                                  </h2>{" "}
                                </label>
                                <input type="text" className="form-control" {...register("remark")} />
                              </div>
                              <div className="col col-12">
                                <label>
                                  {" "}
                                  <h2>
                                    Document Upload <span style={{ color: "red" }}>*</span>
                                  </h2>
                                </label>
                                <input type="file" className="form-control" {...register("documentUpload")} />
                              </div>
                            </div>
                          )}
                          {watch("thirdPartyRightCreated") === "no" && (
                            <div className="row ">
                              <div className="col col">
                                <label>
                                  <h2>
                                    Document Upload <span style={{ color: "red" }}>*</span>
                                  </h2>
                                </label>
                                <input type="file" className="form-control" {...register("documentUpload")} />
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
                        <label htmlFor="licenceAppliedUnderMigration">
                          <input {...register("licenceAppliedUnderMigration")} type="radio" value="yes" id="licenceAppliedUnderMigration" />
                          Yes
                        </label>
                        <label htmlFor="licenceAppliedUnderMigration">
                          <input {...register("licenceAppliedUnderMigration")} type="radio" value="no" id="licenceAppliedUnderMigration" />
                          No
                        </label>
                      </h2>
                    </div>
                    {watch("licenceAppliedUnderMigration") === "yes" && (
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
                          <ReactMultiSelect control={control} name="purpose" placeholder="Purpose" data={potentialOptons} labels="purpose" />

                          {/* <select className="form-control" id="potential" {...register("purpose")}>
                            <option value="">Purpose</option>
                            <option>AGH</option>
                            <option> DDJAY</option>
                            <option>Commercial Plotted</option>
                            <option>Residential Plotted Colony</option>
                            <option>TOD Commercial</option>
                          </select> */}
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
                          <label htmlFor="ValidityOfParentLicense">
                            <input {...register("ValidityOfParentLicense")} type="radio" value="yes" id="ValidityOfParentLicense" />
                            Yes
                          </label>
                          <label htmlFor="ValidityOfParentLicense">
                            <input {...register("ValidityOfParentLicense")} type="radio" value="no" id="ValidityOfParentLicense" />
                            No
                          </label>
                        </div>
                        {watch("ValidityOfParentLicense") === "yes" && (
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
                          <input type="file" className="form-control" {...register("approvedLayoutOfPlan")} />
                        </div>
                        <div className="col col-3">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Proposed Layout of Plan /site plan for area applied for migration. &nbsp;&nbsp;
                            <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" {...register("proposedLayoutOfPlan")} />
                        </div>
                        <div className="col col-3">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Upload Previously approved Layout Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" {...register("uploadPreviouslyApprovedLayoutPlan")} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <hr></hr>
                <br></br>
                <div>
                  <h4>2. Any encumbrance with respect to following </h4>
                  <label htmlFor="encumbranceWithRespect">
                    <input {...register("encumbranceWithRespect")} type="radio" value="rehan/mortgage" id="encumbranceWithRespect" />
                    Rehan / Mortgage
                  </label>
                  <label htmlFor="encumbranceWithRespect">
                    <input {...register("encumbranceWithRespect")} type="radio" value="patta/lease" id="encumbranceWithRespect" />
                    Patta/Lease
                  </label>
                  <label htmlFor="encumbranceWithRespect">
                    <input {...register("encumbranceWithRespect")} type="radio" value="gair/marusi" id="encumbranceWithRespect" />
                    Gair/Marusi
                  </label>
                </div>
                <div className="row">
                  <div className="col col-4">
                    <label>
                      <h2>Any other, please specify:</h2>
                    </label>
                    <input type="text" className="form-control" {...register("pleaseSpecify")} />
                  </div>
                </div>
                <br></br>
                <hr />
                <br></br>
                <div>
                  <h6>(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator. </h6>
                  <label htmlFor="existingLitigation">
                    <input {...register("existingLitigation")} type="radio" value="yes" id="existingLitigation" />
                    Yes
                  </label>
                  <label htmlFor="existingLitigation">
                    <input {...register("existingLitigation")} type="radio" value="no" id="existingLitigation" />
                    No
                  </label>
                </div>
                <div className="row">
                  <div className="col col-12 ">
                    {watch("existingLitigation") === "yes" && (
                      <div className="row ">
                        <div className="col col-6">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("remark")} />
                        </div>
                        <div className="col col-6">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" {...register("docUpload")} />
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
                  <label htmlFor="courtOrders">
                    <input {...register("courtOrders")} type="radio" value="yes" id="courtOrders" />
                    Yes
                  </label>
                  <label htmlFor="courtOrders">
                    <input {...register("courtOrders")} type="radio" value="no" id="courtOrders" />
                    No
                  </label>
                </div>
                <div className="row">
                  <div className="col col-12 ">
                    {watch("courtOrders") === "yes" && (
                      <div className="row ">
                        <div className="col col-6">
                          <label>
                            <h2>Remark/Case No.</h2>{" "}
                          </label>
                          <input type="text" className="form-control" {...register("caseNo")} />
                        </div>
                        <div className="col col-6">
                          <h2 data-toggle="tooltip" data-placement="top" title="Upload Document">
                            Document Upload &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                          </h2>
                          <input type="file" className="form-control" {...register("docUpload")} />
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
                  <label htmlFor="liquidationProceedings">
                    <input {...register("liquidationProceedings")} type="radio" value="yes" id="liquidationProceedings" />
                    Yes
                  </label>
                  <label htmlFor="liquidationProceedings">
                    <input {...register("liquidationProceedings")} type="radio" value="no" id="liquidationProceedings" />
                    No
                  </label>
                </div>
                <div className="row">
                  <div className="col col-12 ">
                    {watch("liquidationProceedings") === "yes" && (
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
                          <input type="file" className="form-control" {...register("docUpload")} />
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
                          <input type="file" className="form-control" {...register("docUpload")} />
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
                          <input type="number" className="form-control" {...register("widthRevenue")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3 ">
                    <h2 data-toggle="tooltip" data-placement="top" title="Watercourse running along boundary through the applied site ?">
                      (c)&nbsp;Watercourse running&nbsp;&nbsp;
                    </h2>
                    <label htmlFor="watercourseRunning">
                      <input {...register("watercourseRunning")} type="radio" value="yes" id="watercourseRunning" />
                      Yes
                    </label>
                    <label htmlFor="watercourseRunning">
                      <input {...register("watercourseRunning")} type="radio" value="no" id="watercourseRunning" />
                      No
                    </label>
                    {watch("watercourseRunning") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            {" "}
                            <h2>Remark</h2>{" "}
                          </label>
                          <input type="text" className="form-control" {...register("watercouseRemark")} />
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
                          <input type="number" className="form-control" {...register("compactRemark")} />
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
                          <input type="text" className="form-control" {...register("sandwichedRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3 ">
                    <h2>(f)&nbsp;Acquisition status (Yes/No)</h2>
                    <label htmlFor="acquisitionStatus">
                      <input {...register("acquisitionStatus")} type="radio" value="yes" id="acquisitionStatus" />
                      Yes
                    </label>
                    <label htmlFor="acquisitionStatus">
                      <input {...register("acquisitionStatus")} type="radio" value="no" id="acquisitionStatus" />
                      No
                    </label>
                    {watch("acquisitionStatus") === "yes" && (
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
                    <input type="date" {...register("sectionfour")} className="form-control" />
                    <div className="invalid-feedback">{errors?.sectionfour?.message}</div>
                  </div>
                  <div className="col col-3">
                    <label>
                      <h2>Date of section 6 notification</h2>
                    </label>
                    <input type="date" className="form-control" {...register("sectionsix")} />
                    <div className="invalid-feedback">{errors?.sectionsix?.message}</div>
                  </div>
                </div>{" "}
                <br></br>
                <div className="row">
                  <div className="col col-12">
                    <label>
                      <h2>(g)&nbsp;&nbsp;Whether details/orders of release/exclusion of land uploaded.&nbsp;&nbsp;</h2>
                    </label>
                    <label htmlFor="exclusionOfLandUploaded">
                      <input {...register("exclusionOfLandUploaded")} type="radio" value="yes" id="exclusionOfLandUploaded" />
                      Yes
                    </label>
                    <label htmlFor="exclusionOfLandUploaded">
                      <input {...register("exclusionOfLandUploaded")} type="radio" value="no" id="exclusionOfLandUploaded" />
                      No
                    </label>
                    {watch("exclusionOfLandUploaded") === "yes" && (
                      <div className="row ">
                        <div className="col col-3 ">
                          <h2>Whether land compensation received&nbsp;&nbsp;</h2>
                          <label htmlFor="whetherLandCompensation">
                            <input {...register("whetherLandCompensation")} type="radio" value="yes" id="whetherLandCompensation" />
                            Yes
                          </label>
                          <label htmlFor="whetherLandCompensation">
                            <input {...register("whetherLandCompensation")} type="radio" value="no" id="whetherLandCompensation" />
                            No
                          </label>
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>Status of release</h2>
                          </label>
                          {/* <select className="form-control" id="releasestatus" {...register("releasestatus")}>
                            <option value=""></option>
                            <option></option>
                            <option></option>
                            <option></option>
                          </select> */}
                          <ReactMultiSelect
                            control={control}
                            name="releasestatus"
                            placeholder="Status of release"
                            data={potentialOptons}
                            labels="Potential"
                          />
                          <div className="invalid-feedback">{errors?.releasestatus?.message}</div>
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>Date of Award</h2>
                          </label>
                          <input type="date" {...register("awarddate")} className="form-control" />
                          <div className="invalid-feedback">{errors?.awarddate?.message}</div>
                        </div>
                        <div className="col col-3">
                          <label>
                            <h2>Date of Release</h2>{" "}
                          </label>
                          <input type="date" {...register("releasedate")} className="form-control" />
                          <div className="invalid-feedback">{errors?.releasedate?.message}</div>
                        </div>
                        <div className="col col-3">
                          <label htmlFor="sitedetails">
                            <h2>Site Details</h2>
                          </label>
                          <input type="text" {...register("sitedetails")} className="form-control" />
                          <div className="invalid-feedback">{errors?.sitedetails?.message}</div>
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
                    <label htmlFor="appliedSiteIsApproachable">
                      <input {...register("appliedSiteIsApproachable")} type="radio" value="yes" id="appliedSiteIsApproachable" />
                      Yes
                    </label>
                    <label htmlFor="appliedSiteIsApproachable">
                      <input {...register("appliedSiteIsApproachable")} type="radio" value="no" id="appliedSiteIsApproachable" />
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
                          <input type="text" className="form-control" />
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
                          <input type="text" className="form-control" {...register("constType")} />
                        </div>
                      </div>
                    )}
                    {watch("construction") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("constRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(c) &nbsp;HT line:(Yes/No)</h2>
                    <label htmlFor="HTLine">
                      <input {...register("HTLine")} type="radio" value="yes" id="HTLine" />
                      Yes
                    </label>
                    <label htmlFor="HTLine">
                      <input {...register("HTLine")} type="radio" value="no" id="HTLine" />
                      No
                    </label>
                    {watch("HTLine") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>HT Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("htRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("HTLine") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(d)&nbsp;IOC Gas Pipeline:(Yes/No)</h2>
                    <label htmlFor="IOCGasPipeline">
                      <input {...register("IOCGasPipelinee")} type="radio" value="yes" id="IOCGasPipeline" />
                      Yes
                    </label>
                    <label htmlFor="IOCGasPipeline">
                      <input {...register("IOCGasPipeline")} type="radio" value="no" id="IOCGasPipeline" />
                      No
                    </label>
                    {watch("IOCGasPipeline") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>IOC Remark</label>
                          <input type="text" className="form-control" {...register("iocRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("IOCGasPipeline") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Remark</label>
                          <input type="text" className="form-control" />
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
                          <label>Remark</label>
                          <input type="text" className="form-control" {...register("nallahRemarkA")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(f) &nbsp;Any revenue rasta/road:(Yes/No)</h2>
                    <label htmlFor="anyRevenueRasta">
                      <input {...register("anyRevenueRasta")} type="radio" value="yes" id="anyRevenueRasta" />
                      Yes
                    </label>
                    <label htmlFor="anyRevenueRasta">
                      <input {...register("anyRevenueRasta")} type="radio" value="no" id="anyRevenueRasta" />
                      No
                    </label>
                    {watch("anyRevenueRasta") === "yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>
                              Width of Revenue rasta/road &nbsp;&nbsp;
                              <CalculateIcon color="primary" />
                            </h2>
                          </label>
                          <input type="text" className="form-control" {...register("roadRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("anyRevenueRasta") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("roadRemarkA")} />
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
                          <input type="text" className="form-control" {...register("marginalRemark")} />
                        </div>
                      </div>
                    )}
                    {watch("marginalLand") === "no" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark </h2>
                          </label>
                          <input type="text" className="form-control" {...register("marginalRemarkA")} />
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
                          <input type="text" className="form-control" {...register("utilityRemarkA")} />
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

                    <input type="file" className="form-control" {...register("landScheduleFile")} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Mutation &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" {...register("copyOfMutationFile")} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Jamabandi &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" {...register("copyOfJamabandiFile")} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Details of lease / patta, if any &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>
                    <input type="file" className="form-control" {...register("detailsOfLease")} />
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
                    <input type="file" className="form-control" {...register("addSalesFile")} />
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
                    <input type="file" className="form-control" {...register("copyOfSpaFile")} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Revised Land Schedule &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>
                    <input type="file" className="form-control" {...register("revisedLandSchedule")} />
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Shajra Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>
                    <input type="file" className="form-control" {...register("copyOfShajraPlan")} />
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
