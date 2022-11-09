import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CalculateIcon from "@mui/icons-material/Calculate";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
const LandScheduleForm = (props) => {
  const [finalSubmitData, setFinalSubmitData] = useState([]);
  const [form, setForm] = useState([]);
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
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  const landScheduleFormSubmitHandler = async (data) => {
    console.log("data------", data);
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

  useEffect(() => {
    if (LandFormSubmitted) {
      props.landFormSubmit(true);
    }
  }, [LandFormSubmitted]);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://10.1.1.18:8443/land-services/new/licenses/_get?id=${props.getId}`).then((response) => {
        return response;
      });
      console.log("RESP+++", Resp?.data);
      setSubmitDataLabel(Resp?.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getSubmitDataLabel();
  }, []);
  const [showhide, setShowhide] = useState("No");
  const [showhide1, setShowhide1] = useState("No");
  const [showhide2, setShowhide2] = useState("No");
  const [showhide3, setShowhide3] = useState("No");
  const [showhide4, setShowhide4] = useState("No");
  const [showhide5, setShowhide5] = useState("No");
  const [showhide6, setShowhide6] = useState("No");
  const [showhide7, setShowhide7] = useState("No");
  const [showhide8, setShowhide8] = useState("No");
  const [showhide9, setShowhide9] = useState("No");
  const [showhide0, setShowhide0] = useState("No");
  const [showhide10, setShowhide10] = useState("No");
  const [showhide11, setShowhide11] = useState("No");
  const [showhide12, setShowhide12] = useState("No");
  const [showhide13, setShowhide13] = useState("No");
  const [showhide14, setShowhide14] = useState("No");
  const [showhide15, setShowhide15] = useState("No");
  const [showhide16, setShowhide16] = useState("No");
  const [showhide17, setShowhide17] = useState("No");
  const [showhide18, setShowhide18] = useState("No");
  const [showhide19, setShowhide19] = useState("No");
  const [showhide20, setShowhide20] = useState("No");
  const [showhide21, setShowhide21] = useState("No");
  const [showhide23, setShowhide23] = useState("No");
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleshow2 = (e) => {
    const getshow = e.target.value;
    setShowhide2(getshow);
  };
  const handleshow3 = (e) => {
    const getshow = e.target.value;
    setShowhide3(getshow);
  };
  const handleshow4 = (e) => {
    const getshow = e.target.value;
    setShowhide4(getshow);
  };
  const handleshow5 = (e) => {
    const getshow = e.target.value;
    setShowhide5(getshow);
  };
  const handleshow6 = (e) => {
    const getshow = e.target.value;
    setShowhide6(getshow);
  };
  const handleshow7 = (e) => {
    const getshow = e.target.value;
    setShowhide7(getshow);
  };
  const handleshow8 = (e) => {
    const getshow = e.target.value;
    setShowhide8(getshow);
  };
  const handleshow9 = (e) => {
    const getshow = e.target.value;
    setShowhide9(getshow);
  };
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  };
  const handleshow10 = (e) => {
    const getshow = e.target.value;
    setShowhide10(getshow);
  };
  const handleshow11 = (e) => {
    const getshow = e.target.value;
    setShowhide11(getshow);
  };
  const handleshow12 = (e) => {
    const getshow = e.target.value;
    setShowhide12(getshow);
  };
  const handleshow13 = (e) => {
    const getshow = e.target.value;
    setShowhide13(getshow);
  };
  const handleshow14 = (e) => {
    const getshow = e.target.value;
    setShowhide14(getshow);
  };
  const handleshow15 = (e) => {
    const getshow = e.target.value;
    setShowhide15(getshow);
  };
  const handleshow16 = (e) => {
    const getshow = e.target.value;
    setShowhide16(getshow);
  };
  const handleshow17 = (e) => {
    const getshow = e.target.value;
    setShowhide17(getshow);
  };
  const handleshow18 = (e) => {
    const getshow = e.target.value;
    setShowhide18(getshow);
  };
  const handleshow19 = (e) => {
    const getshow = e.target.value;
    setShowhide19(getshow);
  };
  const handleshow20 = (e) => {
    const getshow = e.target.value;
    setShowhide20(getshow);
  };
  const handleshow21 = (e) => {
    const getshow = e.target.value;
    setShowhide21(getshow);
  };
  const handleshow23 = (e) => {
    const getshow = e.target.value;
    setShowhide23(getshow);
  };

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
        .post("http://10.1.1.18:8443/filestore/v1/files", formData, {
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
                    <h2>
                      1.&nbsp;(i)Whether licence applied for additional area ?<span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                      <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow} />
                      &nbsp;&nbsp;
                      <label for="Yes">
                        <h6>Yes</h6>
                      </label>
                      &nbsp;&nbsp;
                      <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow} />
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
                            <option value="K.Mishra"></option>
                            <option value="potential 1"></option>
                            <option value="potential 2"></option>
                          </select>
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
                          <select className="form-control" id="typeland" {...register("typeland")}>
                            <option value="">Type of Land</option>
                            <option value="">Chahi/nehri</option>
                            <option>Gair Mumkins</option>
                            <option>Others</option>
                          </select>
                        </div>
                        <div className="col col-3 ">
                          <label>
                            <h2>
                              Third-party right created<span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <br></br>
                          <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow13} />
                          &nbsp;&nbsp;
                          <label for="Yes">
                            <h6>Yes</h6>
                          </label>
                          &nbsp;&nbsp;
                          <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow13} />
                          &nbsp;&nbsp;
                          <label for="No">
                            <h6>No</h6>
                          </label>
                          {showhide13 === "Yes" && (
                            <div className="row ">
                              <div className="col col-12">
                                <label>
                                  {" "}
                                  <h2>
                                    Remark<span style={{ color: "red" }}>*</span>
                                  </h2>{" "}
                                </label>
                                <input type="text" className="form-control" {...register("thirdParty")} />
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
                          {showhide13 === "No" && (
                            <div className="row ">
                              <div className="col col">
                                <label>
                                  {" "}
                                  <h2>
                                    Document Upload <span style={{ color: "red" }}>*</span>
                                  </h2>{" "}
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
                    <h2>
                      &nbsp;&nbsp;(ii)Whether licence applied under Migration Policy ?&nbsp;&nbsp;
                      <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow19} />
                      &nbsp;&nbsp;
                      <label for="Yes">
                        <h6>Yes</h6>
                      </label>
                      &nbsp;&nbsp;
                      <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow19} />
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
                          <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow21} />
                          &nbsp;&nbsp;
                          <label for="Yes">
                            <h6>Yes</h6>
                          </label>
                          &nbsp;&nbsp;
                          <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow21} />
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
                  </div>
                </div>
                <hr></hr>
                <br></br>
                <h4>
                  2. Any encumbrance with respect to following <br></br>
                  <br></br>
                  <label>
                    <h2>Rehan / Mortgage</h2>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow18} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
                  <label>
                    <h2>Patta/Lease</h2>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
                  <label>
                    <h2>Gair/Marusi</h2>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>
                </h4>
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
                <h6>
                  (ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator. &nbsp;&nbsp;
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow10} />
                  &nbsp;&nbsp;
                  <label for="Yes">
                    <h6>Yes</h6>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow10} />
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <br></br>
                <hr />
                <br></br>
                <h6>
                  (iii) Court orders, if any, affecting applied land. &nbsp;&nbsp;
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow11} />
                  &nbsp;&nbsp;
                  <label for="Yes">
                    <h6>Yes</h6>
                  </label>
                  &nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow11} />
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
                  (iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed.&nbsp;&nbsp;
                  <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow12} />
                  &nbsp;&nbsp;
                  <label for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow12} />
                  &nbsp;&nbsp;
                  <label for="No">No</label>
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow14} />
                    &nbsp;&nbsp;
                    <label for="Yes">
                      <h6>Yes</h6>
                    </label>
                    &nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow14} />
                    &nbsp;&nbsp;
                    <label for="No">
                      <h6>No</h6>
                    </label>
                    {showhide14 === "Yes" && (
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow1} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide1 === "Yes" && (
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow2} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide2 === "Yes" && (
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow15} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow15} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow20} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow20} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
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
                    <h2>(f)&nbsp;Acquisition status (Yes/No)</h2>
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow3} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow3} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide3 === "Yes" && (
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow16} />
                    &nbsp;&nbsp;
                    <label for="Yes">
                      <h6>Yes</h6>
                    </label>
                    &nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow16} />
                    &nbsp;&nbsp;
                    <label for="No">
                      <h6>No</h6>
                    </label>
                    {showhide16 === "Yes" && (
                      <div className="row ">
                        <div className="col col-3 ">
                          <h2>
                            (h) Whether land compensation received&nbsp;&nbsp;
                            <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                            &nbsp;&nbsp;
                            <label for="Yes">Yes</label>&nbsp;&nbsp;
                            <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                            &nbsp;&nbsp;
                            <label for="No">No</label>
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
                    <label>
                      <h2>
                        (h)&nbsp;&nbsp;whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing
                        road. (yes/no)
                      </h2>
                    </label>{" "}
                    &nbsp;&nbsp;
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow17} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow17} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide17 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Vacant Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("vacantRemark")} />
                        </div>
                      </div>
                    )}
                    {showhide17 === "No" && (
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow4} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow4} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide4 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Type of Construction</label>
                          <input type="text" className="form-control" {...register("ConstType")} />
                        </div>
                      </div>
                    )}
                    {showhide4 === "No" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("ConstRemark")} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(c) &nbsp;HT line:(Yes/No)</h2>
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow5} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow5} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide5 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>HT Remark</h2>
                          </label>
                          <input type="text" className="form-control" {...register("htRemark")} />
                        </div>
                      </div>
                    )}
                    {showhide5 === "No" && (
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
                    <h2>(d)  &nbsp;IOC Gas Pipeline:(Yes/No)</h2>
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow6} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide6 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>IOC Remark</label>
                          <input type="text" className="form-control" {...register("iocRemark")} />
                        </div>
                      </div>
                    )}
                    {showhide6 === "No" && (
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow7} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow7} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide7 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Nallah Remark</label>
                          <input type="text" className="form-control" {...register("nallahRemark")} />
                        </div>
                      </div>
                    )}
                    {showhide7 === "No" && (
                      <div className="row ">
                        <div className="col col">
                          <label>Remark</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-3">
                    <h2>(f) &nbsp;Any revenue rasta/road:(Yes/No)</h2>
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow8} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow8} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
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
                        </div>
                      </div>
                    )}
                    {showhide8 === "No" && (
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
                    <h2>(g) &nbsp;Any marginal land:(Yes/No)</h2>
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow9} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow9} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
                    {showhide9 === "Yes" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark of Marginal Land </h2>
                          </label>
                          <input type="text" className="form-control" {...register("marginalRemark")} />
                        </div>
                      </div>
                    )}
                    {showhide9 === "No" && (
                      <div className="row ">
                        <div className="col col">
                          <label>
                            <h2>Remark </h2>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
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
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                    &nbsp;&nbsp;
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                    &nbsp;&nbsp;
                    <label for="No">No</label>
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
                        </div>
                      </div>
                    )}
                    {showhide0 === "No" && (
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

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Mutation &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Jamabandi &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Details of lease / patta, if any &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                </div>
                <br></br>
                <div className="row">
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Add sales/Deed/exchange/gift deed, mutation, lease/Patta &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      {" "}
                      Copy of spa/GPA/board resolution to sign collaboration agrrement &nbsp;&nbsp;
                      <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Revised Land Schedule &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h2 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Copy of Shajra Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h2>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
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
