import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm, useFieldArray } from "react-hook-form";
import DDJAYForm from "../Step4/DdjayForm";
import ResidentialPlottedForm from "./ResidentialPlotted";
import IndustrialPlottedForm from "./IndustrialPlotted";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CalculateIcon from "@mui/icons-material/Calculate";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import axios from "axios";

const AppliedDetailForm = (props) => {
  const Purpose = localStorage.getItem("purpose");
  console.log("adf", Purpose);
  const [file, setFile] = useState(null);
  const [noOfRows, setNoOfRows] = useState(1);
  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dgpsPoints: [
        {
          XLongitude: "",
          YLatitude: "",
        },
        {
          XLongitude: "",
          YLatitude: "",
        },
        {
          XLongitude: "",
          YLatitude: "",
        },
        {
          XLongitude: "",
          YLatitude: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dgpsPoints",
  });

  const AppliedDetailFormSubmitHandler = async (data) => {
    console.log("data------", data);
    props.Step4Continue(data, "5");
    // return;
    const token = window?.localStorage?.getItem("token");
    const postDistrict = {
      NewServiceInfo: {
        pageName: "DetailsofAppliedLand",
        id: props.getId,
        createdBy: props?.userInfo?.id,
        updatedBy: props?.userInfo?.id,
        LicenseDetails: {
          DetailsofAppliedLand: {
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
      },
    };

    try {
      const Resp = await axios.post("/tl-services/new/_create", postDistrict);
      console.log("MMM", Resp?.data?.NewServiceInfo?.[0]?.id);
      props.Step4Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
    } catch (error) {
      console.log(error.message);
    }
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
        .post("http://10.1.1.18:8083/filestore/v1/files", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          return response;
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getDocumentData();
  }, [file]);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:8443/land-services/new/licenses/_get?id=${props.getId}`).then((response) => {
        return response;
      });
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
                  {/* {fields?.map((item, index) => (
                    <div key={item?.id}>
                      <span>Add point {index + 1} &nbsp;</span>
                      <div className="row ">
                        <div className="col col-4">
                          <label>X:Longitude</label>
                          <input type="number" className="form-control" {...register(`dgpsPoints.${index}.XLongitude`)} />
                        </div>
                        <div className="col col-4">
                          <label>Y:Latitude</label>
                          <input type="number" className="form-control" {...register(`dgpsPoints.${index}.YLatitude`)} />
                        </div>
                      </div>
                      <button type="button" style={{ float: "right" }} className="btn btn-primary" onClick={() => remove(index)}>
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    style={{ float: "right", marginRight: 15 }}
                    className="btn btn-primary"
                    onClick={() => append({ XLongitude: "", YLatitude: "" })}
                  >
                    Add
                  </button> */}
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
                      <div>
                        <div>Add point {index + 1} &nbsp;</div>
                        <div className="row ">
                          <div className="col col-4">
                            <label>X:Longiude</label>
                            <input type="number" name="XLongitude" className="form-control" />
                          </div>
                          <div className="col col-4">
                            <label>Y:Latitude</label>
                            <input type="number" name="YLatitude" className="form-control" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <br></br>
                <hr />
                <br></br>
                <div>
                  <h5>
                    2.Details of Plots&nbsp;&nbsp;
                    <label htmlFor="detailsOfPlots">
                      &nbsp;&nbsp;
                      <input {...register("detailsOfPlots")} type="radio" value="yes" id="detailsOfPlots" />
                      &nbsp;&nbsp; Regular &nbsp;&nbsp;
                    </label>
                    <label htmlFor="detailsOfPlots">
                      <input {...register("detailsOfPlots")} type="radio" value="no" id="detailsOfPlots" />
                      &nbsp;&nbsp; Irregular &nbsp;&nbsp;
                    </label>
                  </h5>
                </div>
                {watch("detailsOfPlots") === "yes" && (
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
                {watch("detailsOfPlots") === "no" && (
                  <div>
                    <div className="table table-bordered table-responsive ">
                      <thead>
                        <tr>
                          <td>Details of Plot</td>
                          <td>
                            Dimensions (in mtrs) <CalculateIcon color="primary" />
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
                            Length (in mtrs) <CalculateIcon color="primary" />
                          </td>
                          <td>
                            Dimension (in mtrs) <CalculateIcon color="primary" />
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
                            <input type="number" className="form-control" {...register("undeterminedPlot")} />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" {...register("undeterminedLength")} />
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
                <div>{Purpose === "Deen Dayal Jan Awas Yojna-Affordable Plotted 2016" && <DDJAYForm></DDJAYForm>}</div>
                <div>{Purpose === "Residential Plotted Colony" && <ResidentialPlottedForm></ResidentialPlottedForm>}</div>
                <div>{Purpose === "Industrial Plotted colony in Industrial Zone" && <IndustrialPlottedForm></IndustrialPlottedForm>}</div>
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
                        <label htmlFor="wantToSurrender">
                          <input {...register("wantToSurrender")} type="radio" value="yes" id="wantToSurrender" />
                          Yes
                        </label>
                        <label htmlFor="wantToSurrender">
                          <input {...register("wantToSurrender")} type="radio" value="no" id="wantToSurrender" />
                          No
                        </label>
                        {watch("wantToSurrender") === "yes" && (
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
                        <label htmlFor="pocketProposed">
                          <input {...register("pocketProposed")} type="radio" value="yes" id="pocketProposed" />
                          Yes
                        </label>
                        <label htmlFor="pocketProposed">
                          <input {...register("pocketProposed")} type="radio" value="no" id="pocketProposed" />
                          No
                        </label>
                        {watch("pocketProposed") === "yes" && (
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
                        <label htmlFor="deposit">
                          <input {...register("deposit")} type="radio" value="yes" id="deposit" />
                          Yes
                        </label>
                        <label htmlFor="deposit">
                          <input {...register("deposit")} type="radio" value="no" id="deposit" />
                          No
                        </label>
                        {watch("deposit") === "yes" && (
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
                        <label htmlFor="surrenderedArea">
                          <input {...register("surrenderedArea")} type="radio" value="yes" id="surrenderedArea" />
                          Yes
                        </label>
                        <label htmlFor="surrenderedArea">
                          <input {...register("surrenderedArea")} type="radio" value="no" id="surrenderedArea" />
                          No
                        </label>
                        {watch("surrenderedArea") === "yes" && (
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
