import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
import DDJAYForm from "../Step4/DdjayForm";
import ResidentialPlottedForm from "./ResidentialPlotted";
import IndustrialPlottedForm from "./IndustrialPlotted";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CalculateIcon from "@mui/icons-material/Calculate";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import InfoIcon from "@mui/icons-material/Info";
import axios from "axios";
const AppliedDetailForm = (props) => {
  const [finalSubmitData, setFinalSubmitData] = useState([]);
  const [form, setForm] = useState([]);
  const [dgps, setDgps] = useState("");
  const [resplotno, setResPlotno] = useState("");
  const [reslengthmtr, setResLengthmtr] = useState("");
  const [reswidthmtr, setResWidthmtr] = useState("");
  const [resareasq, setResAreasq] = useState("");
  const [genplotno, setGenPlotno] = useState("");
  const [genlengthmtr, setGenLengthmtr] = useState("");
  const [genwidthmtr, setGenWidthmtr] = useState("");
  const [genareasq, setGenAreasq] = useState("");
  const [complotno, setComPlotno] = useState("");
  const [comlengthmtr, setComLengthmtr] = useState("");
  const [comwidthmtr, setComWidthmtr] = useState("");
  const [comareasq, setComAreasq] = useState("");
  const [siteplotno, setSitePlotno] = useState("");
  const [sitelengthmtr, setSiteLengthmtr] = useState("");
  const [sitewidthmtr, setSiteWidthmtr] = useState("");
  const [siteareasq, setSiteAreasq] = useState("");
  const [parkplotno, setParkPlotno] = useState("");
  const [parklengthmtr, setParkLengthmtr] = useState("");
  const [parkwidthmtr, setParkWidthmtr] = useState("");
  const [parkareasq, setParkAreasq] = useState("");
  const [publicplotno, setPublicPlotno] = useState("");
  const [publiclengthmtr, setPublicLengthmtr] = useState("");
  const [publicwidthmtr, setPublicWidthmtr] = useState("");
  const [publicareasq, setPublicAreasq] = useState("");
  const [irPlotDimen, setIrPlotDimen] = useState("");
  const [npnlplotno, setNpnlPlotNo] = useState("");
  const [irSizeDimen, setIrSizeDimen] = useState("");
  const [npnllengthmtr, setNpnlLengthMtr] = useState("");
  const [npnlwidthmtr, setNpnlWidthMtr] = useState("");
  const [npnlareasq, setNpnlareasq] = useState("");
  const [ewsplotno, setEwsplotno] = useState("");
  const [ewslengthmtr, setEwslengthmtr] = useState("");
  const [npnlNo, setNpnlNo] = useState("");
  const [npnlArea, setNpnlArea] = useState("");
  const [ewsNo, setEwsNo] = useState("");
  const [ewsArea, setEwsArea] = useState("");
  const [frozenNo, setFrozenNo] = useState("");
  const [frozenArea, setFrozenArea] = useState("");
  const [ewswidthmtr, setEwswidthmtr] = useState("");
  const [ewsareasq, setEwsareasq] = useState("");
  const [stpplotno, setStpplotno] = useState("");
  const [stplengthmtr, setStplengthmtr] = useState("");
  const [stpwidthmtr, setStpwidthmtr] = useState("");
  const [stpareasq, setStpareasq] = useState("");
  const [etpplotno, setEtpplotno] = useState("");
  const [etplengthmtr, setEtplengthmtr] = useState("");
  const [resiNo, setResiNo] = useState("");
  const [resiArea, setResiArea] = useState("");
  const [commerNo, setCommerNo] = useState("");
  const [commerArea, setCommerArea] = useState("");
  const [labourNo, setLabourNo] = useState("");
  const [labourArea, setLabourArea] = useState("");
  const [etpwidthmtr, setEtpwidthmtr] = useState("");
  const [etpareasq, setEtpareasq] = useState("");
  const [wtpplotno, setWtpplotno] = useState("");
  const [wtplengthmtr, setWtplengthmtr] = useState("");
  const [wtpwidthmtr, setWtpwidthmtr] = useState("");
  const [wtpareasq, setWtpareasq] = useState("");
  const [ugtplotno, setUgtplotno] = useState("");
  const [ugtlengthmtr, setUgtlengthmtr] = useState("");
  const [ugtwidthmtr, setUgtwidthmtr] = useState("");
  const [ugtareasq, setUgtareasq] = useState("");
  const [milkboothplotno, setMilkboothplotno] = useState("");
  const [milkboothlengthmtr, setMilkboothlengthmtr] = useState("");
  const [milkboothwidthmtr, setMilkboothwidthmtr] = useState("");
  const [milkboothareasq, setMilkboothareasq] = useState("");
  const [gssplotno, setGssplotno] = useState("");
  const [gsslengthmtr, setGsslengthmtr] = useState("");
  const [gsswidthmtr, setGsswidthmtr] = useState("");
  const [gssareasq, setGssareasq] = useState("");
  const [resDimension, setResDimension] = useState("");
  const [resEnteredArea, setResEnteredArea] = useState("");
  const [comDimension, setComDimension] = useState("");
  const [comEnteredArea, setComEnteredArea] = useState("");
  const [secPlanPlot, setSecPlanPlot] = useState("");
  const [secPlanDim, setSecPlanDim] = useState("");
  const [secPlanLength, setSecPlanLength] = useState("");
  const [secPlanEntered, setSecPlanEntered] = useState("");
  const [greenBeltPlot, setGreenBeltPlot] = useState("");
  const [greenBeltLength, setGreenBeltLength] = useState("");
  const [greenBeltDim, setgGreenBeltDim] = useState("");
  const [greenBeltEntered, setGreenBeltEntered] = useState("");
  const [internalPlot, setInternalPlot] = useState("");
  const [internalLength, setInternalLength] = useState("");
  const [internalDim, setInternalDim] = useState("");
  const [internalEntered, setInternalEntered] = useState("");
  const [otherPlot, setOtherPlot] = useState("");
  const [otherDim, setOtherDim] = useState("");
  const [otherLength, setOtherLength] = useState("");
  const [otherEntered, setOtherEntered] = useState("");
  const [undeterminedPlot, setUndeterminedPlot] = useState("");
  const [undeterminedLength, setUndeterminedLength] = useState("");
  const [undeterminedDim, setUndeterminedDim] = useState("");
  const [undeterminedEntered, setUndeterminedEntered] = useState("");
  const [organize, setOrganize] = useState("");
  const [colonyfiftyNo, setColonyfiftyNo] = useState("");
  const [colonyfiftyArea, setColonyfiftyArea] = useState("");
  const [fiftyToTwoNo, setFiftyToTwoNo] = useState("");
  const [fiftyToTwoArea, setFiftyToTwoArea] = useState("");
  const [twoHundredNo, setTwoHundredNo] = useState("");
  const [twoHundredArea, setTwoHundredArea] = useState("");
  const [surrender, setSurrender] = useState("");
  const [pocketProposed, setPocketProposed] = useState("");
  const [surrendered, setSurrendered] = useState("");
  const [deposit, setDeposit] = useState("");
  const [sitePlan, setSitePlan] = useState("");
  const [democraticPlan, setDemocraticPlan] = useState("");
  const [developmentPlan, setDevelopmentPlan] = useState("");
  const [sectoralPlan, setSectoralPlan] = useState("");
  const [uploadLayoutPlan, setUploadLayoutPlan] = useState("");
  const Purpose = localStorage.getItem("purpose");
  console.log("adf", Purpose);
  const [file, setFile] = useState(null);
  const [docUpload, setDocuploadData] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm([{ XLongitude: "", YLatitude: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [submitDataLabel, setSubmitDataLabel] = useState([]);
  const [AppliedDetailFormSubmitted, SetAppliedDetailFormSubmitted] = useState(false);
  const AppliedDetailFormSubmitHandler = async (data) => {
    console.log("data------", data);
    try {
      const postDistrict = {
        NewServiceInfo: {
          pageName: "DetailsofAppliedLand",
          id: props.getId,
          newServiceInfoData: {
            DetailsofAppliedLand: {
              dgps: data.dgpsLongitude,
              dgps: data.dgpsLatitude,
              DetailsAppliedLandData1: {
                npnlplotno: data.npnlPlot,
                npnllengthmtr: data.npnlLength,
                npnlwidthmtr: data.npnlWidth,
                npnlareasq: data.npnlArea,
                ewsplotno: data.ewsPlot,
                ewslengthmtr: data.ewsLength,
                ewswidthmtr: data.ewsWidth,
                ewsareasq: data.ewsArea,
                complotno: data.comPlot,
                comlengthmtr: data.comLength,
                comwidthmtr: data.comWidth,
                comareasq: data.comArea,
                siteplotno: data.sitePlot,
                sitelengthmtr: data.siteLength,
                sitewidthmtr: data.siteWidth,
                siteareasq: data.siteArea,
                parkplotno: data.parkPlot,
                parklengthmtr: data.parkLength,
                parkwidthmtr: data.parkWidth,
                parkareasq: data.parkArea,
                publicplotno: data.publicPlot,
                publiclengthmtr: data.publicLength,
                publicwidthmtr: data.publicWidth,
                publicareasq: data.publicArea,
                stpplotno: data.stpPlot,
                stplengthmtr: data.stpLength,
                stpwidthmtr: data.stpWidth,
                stpareasq: data.stpArea,
                etpplotno: data.etpPlot,
                etplengthmtr: data.etpLength,
                etpwidthmtr: data.etpWidth,
                etpareasq: data.etpArea,
                wtpplotno: data.wtpPlot,
                wtplengthmtr: data.wtpLength,
                wtpwidthmtr: data.wtpWidth,
                wtpareasq: data.wtpArea,
                ugtplotno: data.ugtPlot,
                ugtlengthmtr: data.ugtLength,
                ugtwidthmtr: data.ugtWidth,
                ugtareasq: data.ugtArea,
                milkboothplotno: data.milkboothPlot,
                milkboothlengthmtr: data.milkBoothLength,
                milkboothwidthmtr: data.milkBoothWidth,
                milkboothareasq: data.milkBoothArea,
                gssplotno: data.gssPlot,
                gsslengthmtr: data.gssLength,
                gssareasq: data.gssArea,
                resDimension: data.resdimension,
                resEnteredArea: data.resAreaenter,
                comDimension: data.comDimension,
                comEnteredArea: data.comAreaEnter,
                secPlanPlot: data.planPlot,
                secPlanLength: data.planLength,
                secPlanDim: data.planDim,
                secPlanEntered: data.planAreaenter,
                greenBeltPlot: data.greenBeltPlot,
                greenBeltLength: data.greenBeltLength,
                greenBeltDim: data.greenBeltDim,
                greenBeltEntered: data.greenBeltAreaenter,
                internalPlot: data.internazlplanPlot,
                internalLength: data.internalPlanLLength,
                internalDim: data.internalplanWidth,
                internalEntered: data.internalPlanAreaenter,
                otherPlot: data.roadPlot,
                otherLength: data.roadLength,
                otherDim: data.roadWidth,
                otherEntered: data.roadAreaenter,
                undeterminedPlot: data.undeterminedPlot,
                undeterminedLength: data.undeterminedLength,
                undeterminedDim: data.undeterminedWidth,
                undeterminedEntered: data.undeterminedAreaenter,
              },
              DetailsAppliedLandDdjay2: {
                frozenNo: data.frozenNo,
                frozenArea: data.frozenArea,
                organize: data.organizeArea,
              },
              DetailsAppliedLandIndustrial3: {
                colonyfiftyNo: "qwq",
                colonyfiftyArea: "",
                fiftyToTwoNo: "",
                fiftyToTwoArea: "",
                twoHundredNo: "",
                twoHundredArea: "",
                resiNo: "",
                resiArea: "",
                commerNo: "",
                commerArea: "",
                labourNo: "",
                labourArea: "",
              },
              DetailsAppliedLandResidential4: {
                npnlNo: "wew",
                npnlArea: "",
                ewsNo: "",
                ewsArea: "",
              },
              DetailsAppliedLandNpnl5: {
                surrender: "sds",
                pocketProposed: "",
                deposit: "",
                surrendered: "",
              },
              DetailsAppliedLand6: {
                sitePlan: "sdsd",
                democraticPlan: "",
                sectoralPlan: "",
                developmentPlan: "",
                uploadLayoutPlan: "",
              },
            },
          },
        },
      };

      const Resp = await axios.post("/land-services/new/_create", postDistrict).then((Resp) => {
        return Resp;
      });

      console.log("MMM", Resp?.data?.NewServiceInfo?.[0]?.id);
      props.Step4Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
      SetAppliedDetailFormSubmitted(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const [showhide, setShowhide] = useState("No");
  const [showhide1, setShowhide1] = useState("No");
  const [showhide0, setShowhide0] = useState("No");
  const [showhide2, setShowhide2] = useState("No");
  const [showhide3, setShowhide3] = useState("No");
  const [showhide4, setShowhide4] = useState("No");
  const [showhide5, setShowhide5] = useState("No");
  const [showhide6, setShowhide6] = useState("No");
  const [showhide7, setShowhide7] = useState("No");
  const [showhide8, setShowhide8] = useState("No");
  const [showhide9, setShowhide9] = useState("No");
  const [showhide10, setShowhide10] = useState("No");
  const [showhide11, setShowhide11] = useState("No");
  const [showhide12, setShowhide12] = useState("No");
  const [showhide13, setShowhide13] = useState("No");
  const [showhide14, setShowhide14] = useState("No");
  const [showhide18, setShowhide18] = useState("2");

  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
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
  const handleshow18 = (e) => {
    const getshow = e.target.value;
    setShowhide18(getshow);
  };
  onchange = (e) => {
    this.setState({ value: e.target.value });
  };

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  const [noOfRows, setNoOfRows] = useState(1);
  const [noOfRow, setNoOfRow] = useState(1);
  const [noOfRow1, setNoOfRow1] = useState(1);
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
        .post("http://10.1.1.18:8083/filestore/v1/files", formData, {
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

  return (
    <form onSubmit={handleSubmit(AppliedDetailFormSubmitHandler)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New License </h4>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Form.Group className="justify-content-center" controlId="formBasicEmail">
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col col-12>
                <h4>
                  1. DGPS points <span className="text-primary"> (Click here for instructions to capture DGPS points)</span>
                </h4>
                <br></br>
                <div className="px-2">
                  <div>
                    (i)Add point 1 &nbsp;
                    <div className="row ">
                      <div className="col col-4">
                        <label>X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" {...register("dgpsLongitude")} />
                      </div>
                      <div className="col col-4">
                        <label>Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" {...register("dgpsLatitude")} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div>
                    (ii)Add point 2 &nbsp;
                    <div className="row ">
                      <div className="col col-4">
                        <label>X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" {...register("dgLongitude")} />
                      </div>
                      <div className="col col-4">
                        <label>Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" {...register("dgLatitude")} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div>
                    (iii)Add point 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="row ">
                      <div className="col col-4">
                        <label>X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" {...register("dgpLongitude")} />
                      </div>
                      <div className="col col-4">
                        <label>Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" {...register("dgpLatitude")} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div>
                    (iv)Add point 4 &nbsp;
                    <div className="row ">
                      <div className="col col-4">
                        <label>X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" {...register("dsLongitude")} />
                      </div>
                      <div className="col col-4">
                        <label>Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" {...register("dgLatitude")} />
                      </div>
                    </div>
                    <button type="button" style={{ float: "right" }} className="btn btn-primary" onClick={() => setNoOfRows(noOfRows - 1)}>
                      Delete
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button
                      type="button"
                      style={{ float: "right", marginRight: 15 }}
                      className="btn btn-primary"
                      onClick={() => setNoOfRows(noOfRows + 1)}
                    >
                      Add
                    </button>
                  </div>
                  {[...Array(noOfRows)].map((elementInArray, index) => {
                    return (
                      <div className="row ">
                        <div className="col col-4">
                          <label>{index + 1}</label>
                        </div>
                        <div className="col col-4">
                          <label>X:Longiude</label>
                          <input type="number" name="XLongitude" className="form-control" />
                        </div>
                        <div className="col col-4">
                          <label>Y:Latitude</label>
                          <input type="number" name="YLatitude" className="form-control" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <br></br>
                <hr />
                <br></br>
                <h5>
                  2.Details of Plots&nbsp;&nbsp;
                  <input type="radio" id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow18} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>
                  <label htmlFor="gen">Regular</label>&nbsp;&nbsp;
                  <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} />
                  &nbsp;&nbsp;
                  <label for="Yes"></label>
                  <label htmlFor="npnl">Irregular</label>
                </h5>{" "}
                {showhide18 === "1" && (
                  <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <td>Type of plots</td>
                        <td>Plot No.</td>
                        <td>
                          Length in mtr <CalculateIcon color="primary" />
                        </td>
                        <td>
                          Width in mtr <CalculateIcon color="primary" />
                        </td>
                        <td>
                          Area in sqmtr <CalculateIcon color="primary" />
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Residential</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Gen</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("genPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("genLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("genWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("genArea")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">NPNL</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("npnlPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("npnlLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("npnlWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("npnlArea")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">EWS</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("ewsPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("ewsLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("ewsWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("ewsArea")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Commercial</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("comPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("comLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("comWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("comArea")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Community Sites</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("sitePlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("siteLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("siteWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("siteArea")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Parks</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("parkPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("parkLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("parkWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("parkArea")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2" x>
                              Public Utilities
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">STP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("publicPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("publicLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("publicWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("publicAreasq")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">ETP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("etpPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("etpLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("etpWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("etpAreasq")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">WTP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("wtpPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("wtpLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("wtpWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("wtpAreasq")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">UGT</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("ugtPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("ugtLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("ugtWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("ugtAreasq")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Milk Booth</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("milkBoothPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("milkBoothLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("milkBoothWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("milkBoothAreasq")} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">GSS</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" {...register("gssPlot")} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("gssLength")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("gssWidth")} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" {...register("gssAreasq")} />
                        </td>
                      </tr>
                    </tbody>
                  </div>
                )}
                {showhide18 === "2" && (
                  <div>
                    <div className="table table-bordered table-responsive ">
                      <thead>
                        <tr>
                          <td>Details of Plot</td>
                          <td>
                            Dimensions (in mtr) <CalculateIcon color="primary" />
                          </td>
                          <td>Enter Area</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">Residential</p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("resDimension")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("resAreaenter")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">Commercial</p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("comDimension")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("comAreaenter")} />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                    <h5>Area Under</h5>
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <td>Detail of plots</td>
                          <td> Plot No.</td>
                          <td>
                            Length (in mtr) <CalculateIcon color="primary" />
                          </td>
                          <td>
                            Dimension (in mtr) <CalculateIcon color="primary" />
                          </td>
                          <td>Enter Area</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">Sectoral Plan Road</p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("planPlot")} />{" "}
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("planLength")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("planDim")} />{" "}
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("planAreaenter")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">Green Belt</p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("greenBeltPlot")} />
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("greenBeltLength")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("greenBeltDim")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("greenBeltAreaenter")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">24/18 mtr wide internal circulation Plan road</p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("internalPlanPlot")} />
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("internalPlanLength")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("internalPlanDim")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("internalPlanAreaenter")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">Other Roads</p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("roadPlot")} />
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("roadLength")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("roadDim")} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" {...register("roadAreaenter")} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p className="mb-2">Undetermined use(UD)</p>
                            </div>
                          </td>
                          <td align="right">
                            <input type="number" {...register("undeterminedPlot")} />
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" {...register("undeterminedLength")} />
                          </td>
                          <td align="right">
                            <input type="number" className="form-control" {...register("undeterminedDim")} />
                          </td>
                          <td align="right">
                            <input type="number" className="form-control" {...register("undeterminedAreaenter")} />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                )}
                <div>{Purpose === "DDJAY" && <DDJAYForm></DDJAYForm>}</div>
                <div>{Purpose === "03" && <ResidentialPlottedForm></ResidentialPlottedForm>}</div>
                <div>{Purpose === "06" && <IndustrialPlottedForm></IndustrialPlottedForm>}</div>
                <h5 className="text-black">NILP </h5>
                <br></br>
                <div className="table table-bordered table-responsive">
                  <thead>
                    <tr>
                      <td>S.No.</td>
                      <td>NLP Details</td>
                      <td>Yes/No</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1. </td>
                      <td>
                        {" "}
                        Whether you want to surrender the 10% area of license colony to Govt. the instead of providing 10% under EWS and NPNL plots{" "}
                      </td>
                      <td style={{ display: "flex", gap: "8px" }} component="th" scope="row">
                        <input type="radio" value="Yes" id="Yes" onChange={handleChange} name="Yes" onClick={handleshow0} />
                        <label style={{ margin: "0" }} for="Yes">
                          Yes
                        </label>

                        <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow0} />
                        <label style={{ margin: "0" }} for="No">
                          No
                        </label>
                        {showhide0 === "Yes" && (
                          <div className="row ">
                            <div className="col col-12">
                              <label>Area in Acres </label>

                              <input type="text" className="form-control" {...register("surrenderArea")} />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>2. </td>
                      <td>Whether any pocket proposed to be transferred less than 1 acre </td>
                      <td style={{ display: "flex", gap: "8px" }} component="th" scope="row">
                        <input type="radio" value="Yes" id="Yes" onChange={handleChange} name="Yes" onClick={handleshow13} />
                        <label style={{ margin: "0" }} for="Yes">
                          Yes
                        </label>

                        <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow13} />
                        <label style={{ margin: "0" }} for="No">
                          No
                        </label>
                        {showhide13 === "Yes" && (
                          <div className="row ">
                            <div className="col col-6">
                              <label>
                                Dimension (in mtr)&nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </label>
                              <input type="text" className="form-control" {...register("pocketDim")} />
                            </div>
                            <div className="col col-6">
                              <label> Enter Area </label>
                              <input type="text" className="form-control" {...register("pocketAreaenter")} />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>3. </td>
                      <td>Whether you want to deposit an amount @ of 3 times of collector rate instead of the surrender 10% land to Govt. </td>
                      <td style={{ display: "flex", gap: "8px" }} component="th" scope="row">
                        <input type="radio" value="Yes" id="Yes" onChange={handleChange} name="Yes" onClick={handleshow1} />
                        <label style={{ margin: "0" }} for="Yes">
                          Yes
                        </label>
                        <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow1} />
                        <label style={{ margin: "0" }} for="No">
                          No
                        </label>
                        {showhide1 === "Yes" && (
                          <div className="row ">
                            <div className="col col-12">
                              <label>
                                Area in Acres &nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </label>
                              <input type="text" className="form-control" {...register("depositArea")} />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>4. </td>
                      <td>Whether the surrendered area is having a minimum of 18 mtr independent access </td>
                      <td style={{ display: "flex", gap: "8px" }} component="th" scope="row">
                        <input type="radio" value="Yes" id="Yes" onChange={handleChange} name="Yes" onClick={handleshow14} />
                        <label style={{ margin: "0" }} for="Yes">
                          Yes
                        </label>

                        <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow14} />
                        <label style={{ margin: "0" }} for="No">
                          No
                        </label>
                        {showhide14 === "Yes" && (
                          <div className="row ">
                            <div className="col col-12">
                              <label>
                                Dimension(in mtr) &nbsp;&nbsp;
                                <CalculateIcon color="primary" />
                              </label>

                              <input type="text" className="form-control" {...register("surrenderedDim")} />
                            </div>
                            <div className="col col-12">
                              <label>Enter Area</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </div>
                <hr />
                <br></br>
                <h5>Mandatory Documents</h5>
                <br></br>
                <div className="row">
                  <div className="col col-3">
                    <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Demarcation plan. &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>
                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Democratic Plan. &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>
                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Sectoral Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>
                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Upload Layout Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>
                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Copy of plans showing cross sections of proposed roads indicating, in particular, the width of proposed carriage ways cycle tracks and footpaths etc"
                    >
                      Plans showing cross sections &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>
                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Copy of plans indicating, in addition, the position of sewers, stormwater channels, water supply and any other public health services."
                    >
                      Plans indicating position of public health services. &nbsp;&nbsp;
                      <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Copy of detailed specifications and designs of road works and estimated costs thereof"
                    >
                      Specifications and designs of road works &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>
                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Copy of detailed specifications and designs of sewerage, storm, water and water supply works and estimated costs thereof"
                    >
                      Designs of sewerage, storm and water supply &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Copy of detailed specifications and designs for disposal and treatment of storm and sullage water and estimated costs of works."
                    >
                      Designs for disposal and treatment of storm &nbsp;&nbsp;
                      <ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Whether intimated each of the allottees through registered post regarding the proposed changes in the layout plan: - If yes selected upload"
                    >
                      Undertaking that no change &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Whether you hosted the existing approved layout plan & in-principle approved layout on the website of your company/organization Yes/No if yes upload"
                    >
                      Whether you hosted the existing approved layout plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top" title="Upload Document">
                      Report any objection from any of the allottees &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Consent of RERA if there is any change in the phasing ."
                    >
                      Consent of RERA &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Undertaking that no change has been made in the phasing "
                    >
                      Undertaking &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Copy of detailed specifications and designs for electric supply including street lighting"
                    >
                      Detailed specifications and designs for electric supply &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                  <div className="col col-3">
                    <h6
                      style={{ display: "flex" }}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Explanatory note regarding the salient feature of the proposed colony."
                    >
                      Salient feature of the proposed colony &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })}></input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 text-left">
                    <div id="btnClear" class="btn btn-primary btn-md center-block" onClick={() => props?.step4Back()}>
                      Back
                    </div>
                  </div>
                  <div class="col-sm-12 text-right">
                    <button id="btnSearch" class="btn btn-primary btn-md center-block">
                      Save and Continue
                    </button>
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
export default AppliedDetailForm;
