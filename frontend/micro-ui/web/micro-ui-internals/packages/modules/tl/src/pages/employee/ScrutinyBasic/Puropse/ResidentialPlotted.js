import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "../css/personalInfoChild.style";
import ModalChild from "../Remarks/ModalChild";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

const ResidentialPlottedForm = (props) => {

  const residentialData = props.data;
  const dataIcons = props.dataForIcons;
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  const hideRemarks = userRoles.some((item)=>item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
  const hideRemarksPatwari = userRoles.some((item)=>item ==="Patwari_HQ")

  const { register, handleSubmit, formState: { errors } } = useForm([{ XLongitude: '', YLatitude: '' }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [ResidentialPlottedFormSubmitted, SetResidentialPlottedFormSubmitted] = useState(false);
  const ResidentialPlottedFormSubmitHandler = (e) => {
    e.preventDefault();
    SetResidentialPlottedFormSubmitted(true);
  }

  const classes = useStyles();

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    npnlNo: Colors.info,
    npnlArea: Colors.info,
    ewsNo: Colors.info,
    ewsArea: Colors.info
  })

  const fieldIdList = [{ label: "NPNL No", key: "npnlNo" },{ label: "NPNL Area", key: "npnlArea" },{ label: "EWS No", key: "ewsNo" },{ label: "EWS Area", key: "ewsArea" },];


  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved ? Colors.approved : Colors.disapproved }

        }
      }
    })

    setFieldIconColors(tempFieldColorState);

  };


  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...",)
  }, [dataIcons])

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === labelValue));
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue])



  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved })
    }
    setOpennedModal("");
    setLabelValue("");
  };

  return (
    <Form onSubmit={ResidentialPlottedFormSubmitHandler} style={{ display: props.displayResidential }}>
      <ModalChild
        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        onClose={() => setSmShow(false)}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
      ></ModalChild>
      <Form.Group className="justify-content-center" controlId="formBasicEmail">
        
   <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h6 className="text-black mt-4">
          <b>Residential Plotted</b>
        </h6>
        <h6 className="text-black mt-4">
          <b>Detail of land use</b>
        </h6>
        <Col col-12>
          <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Total area of the Scheme
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <NumberInput disabled control={control} name="totalAreaScheme" customInput={TextField} /> */}
              <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.totalAreaScheme} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Area under Sector Road & Green Belt
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input
                type="number"
                className="form-control"
                {...register("areaUnderSectorRoad")}
                onWheel={handleWheel}
                onChange={(e) => {
                  if (e?.target?.value?.length) {
                    setValue("balanceAreaAfterDeduction", (watch("totalAreaScheme") - e?.target?.value)?.toFixed(3));
                    setValue("areaUnderSectorAndGreenBelt", (e?.target?.value * 50) / 100);
                  } else {
                    setValue("balanceAreaAfterDeduction", "");
                    setValue("balanceArea", "");
                    setValue("areaUnderSectorAndGreenBelt", "");
                    setValue("netPlannedArea", "");
                    setValue("areaUnderUndetermined", "");
                  }
                }}
              /> */}
              <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.areaUnderSectorRoad} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Balance area after deducting area under sector road and Green Belt
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input disabled type="number" className="form-control" {...register("balanceAreaAfterDeduction")} /> */}
              <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.balanceAreaAfterDeduction} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Area under undetermined use
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input
                type="number"
                className="form-control"
                {...register("areaUnderUndetermined")}
                onWheel={handleWheel}
                onChange={(e) => {
                  if (e?.target?.value?.length) {
                    setValue("balanceArea", (watch("balanceAreaAfterDeduction") - e?.target?.value)?.toFixed(3));
                    setValue(
                      "netPlannedArea",
                      (watch("balanceAreaAfterDeduction") - e?.target?.value + watch("areaUnderSectorAndGreenBelt"))?.toFixed(3)
                    );
                  } else {
                    setValue("balanceArea", "");
                    setValue("netPlannedArea", "");
                  }
                }}
              /> */}
              <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.areaUnderUndetermined} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
            </Col>
          </Row>
          <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Area under G.H. = 10% of the total area of the scheme
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input
                type="number"
                className="form-control"
                {...register("areaUnderGH")}
                onWheel={handleWheel}
                onChange={(e) => {
                  if (e?.target?.value > (watch("totalAreaScheme") * 10) / 100)
                    setError({ ...error, ["areaUnderGH"]: "Area Under GH cannot exceed 10% of Total Area of scheme" });
                  else setError({ ...error, ["areaUnderGH"]: "" });
                }}
              /> */}
              <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.areaUnderGH} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Balance area
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input disabled type="number" className="form-control" {...register("balanceArea")} /> */}
              <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.balanceArea} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    50% of the Area under Sector Road & Green Belt
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input disabled type="number" className="form-control" {...register("areaUnderSectorAndGreenBelt")} /> */}
              <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.areaUnderSectorAndGreenBelt} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
            </Col>

            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Net planned area (A+B)
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input disabled type="number" className="form-control" {...register("netPlannedArea")} /> */}
              <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.netPlannedArea} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 

            </Col>
          </Row>
       
        </Col>
        <h6 className="text-black mt-4">
          <b>Detail of the Plots</b>
        </h6>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total no’s of plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <NumberInput
              control={control}
              name="totalNumberOfPlots"
              customInput={TextField}
              thousandSeparator={false}
              allowNegative={false}
              decimalScale={0}
              onChange={(e) => {
                if (!e?.target?.value?.length) {
                  setValue("generalPlots", "");
                  setValue("requiredNPNLPlots", "");
                  setValue("requiredEWSPlots", "");
                }
              }}
            /> */}

                    <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.totalNumberOfPlots} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  General Plots (55%)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <NumberInput
              control={control}
              name="generalPlots"
              customInput={TextField}
              thousandSeparator={false}
              allowNegative={false}
              decimalScale={0}
              onChange={(e) => {
                if (e?.target?.value > (watch("totalNumberOfPlots") * 55) / 100)
                  setError({ ...error, ["generalPlots"]: " Cannot exceed 55% of total number of plots" });
                else setError({ ...error, ["generalPlots"]: "" });
              }}
            />
            {error?.generalPlots && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.generalPlots}</h6>} */}
             <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.generalPlots} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Required NPNL plots (25 %)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <NumberInput
              control={control}
              name="requiredNPNLPlots"
              customInput={TextField}
              thousandSeparator={false}
              allowNegative={false}
              decimalScale={0}
              onChange={(e) => {
                if (e?.target?.value > (watch("totalNumberOfPlots") * 25) / 100)
                  setError({ ...error, ["requiredNPNLPlots"]: " Cannot exceed 25% of total number of plots" });
                else setError({ ...error, ["requiredNPNLPlots"]: "" });
              }}
            />
            {error?.requiredNPNLPlots && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.requiredNPNLPlots}</h6>} */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.requiredNPNLPlots} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Required EWS plots (20%)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <NumberInput
              control={control}
              name="requiredEWSPlots"
              customInput={TextField}
              thousandSeparator={false}
              allowNegative={false}
              decimalScale={0}
              onChange={(e) => {
                const val = (parseInt(watch("generalPlots")) + parseInt(watch("requiredNPNLPlots"))) * 18;
                const valA = e?.target?.value * 12;
                setABValue(val + valA);
                console.log("val++", (val + valA) / watch("netPlannedArea"));
                console.log("calc", watch("netPlannedArea"), typeof watch("netPlannedArea"));
                if (e?.target?.value > (watch("totalNumberOfPlots") * 20) / 100)
                  setError({ ...error, ["requiredEWSPlots"]: " Cannot exceed 20% of total number of plots" });
                else {
                  setValue("permissibleDensity", ((val + valA) / watch("netPlannedArea"))?.toFixed(3));
                  setError({ ...error, ["requiredEWSPlots"]: "" });
                }
              }}
            />
            {error?.requiredEWSPlots && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.requiredEWSPlots}</h6>} */}

             <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.requiredEWSPlots} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Permissible density
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input disabled type="number" className="form-control" {...register("permissibleDensity")} /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.permissibleDensity} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Permissible Commercial Area
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input
              type="number"
              className="form-control"
              {...register("permissibleCommercialArea")}
              onChange={(e) => {
                if (e?.target?.value > (watch("netPlannedArea") * 4) / 100)
                  setError({ ...error, ["permissibleCommercialArea"]: "Permissible Commercial Area  Maximum 4 % of Net planned Area is allowed" });
                else setError({ ...error, ["permissibleCommercialArea"]: "" });
              }}
              onWheel={handleWheel}
            />
            {error?.permissibleCommercialArea && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.permissibleCommercialArea}</h6>} */}
            
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.permissibleCommercialArea} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Under Plot
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="number" className="form-control" {...register("underPlot")} onWheel={handleWheel} /> */}
            
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.underPlot} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Commercial
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input
              type="number"
              className="form-control"
              {...register("commercial")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (watch("underPlot") + e?.target?.value > (watch("netPlannedArea") * 55) / 100)
                  setError({ ...error, ["permissibleSaleableArea"]: "Cannot exceed 55% of Net planned Area" });
                else {
                  setValue("permissibleSaleableArea", watch("underPlot") + e?.target?.value);
                  setError({ ...error, ["permissibleSaleableArea"]: "" });
                }
              }}
            /> */}
             <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.commercial} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Permissible saleable area
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="number" className="form-control" {...register("permissibleSaleableArea")} onWheel={handleWheel} />
            {error?.permissibleSaleableArea && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.permissibleSaleableArea}</h6>} */}
             <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.permissibleSaleableArea} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Required green area on applied land
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input
              type="number"
              className="form-control"
              {...register("requiredGreenArea")}
              onChange={(e) => {
                const checkVal = (getABValue * 2.5) / 4047;
                if (e?.target?.value > checkVal) setError({ ...error, ["requiredGreenArea"]: "2.5 Square meter per person is allowed" });
                else setError({ ...error, ["requiredGreenArea"]: "" });
              }}
              onWheel={handleWheel}
            />
            {error?.requiredGreenArea && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.requiredGreenArea}</h6>} */}

                <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.requiredGreenArea} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
          </Col>
        </Row>

        <br></br>
        <h6 className="text-black">
          <b>Detail of Community sites.</b>
        </h6>
        <br></br>
        {/* //////   Add   after Data///// */}
        {/* {residentialData?.fields?.map((item, index) => {
          return ( */}
            <Row 
            // key={item?.id}
             className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <h2>
                      Name of Community sites
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
               
                 <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.detailOfCommunitySites?.[0]?.communitySiteName} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <h2>
                      Provided
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
           
                <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={residentialData?.detailOfCommunitySites?.[0]?.provided} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
                    </div>
              </Col>
              {/* <Col style={{ alignSelf: "center" }} md={2} lg="2">
                <button
                  type="button"
                  style={{ float: "right", marginRight: 15 }}
                  className="btn btn-primary"
                  onClick={() => add({ communitySiteName: "", provided: "" })}
                >
                  Add
                </button>
              </Col> */}
              {/* {index > 0 && (
                <Col style={{ alignSelf: "center" }} md={2} lg="2">
                  <button type="button" className="btn btn-primary" onClick={() => remove(index)}>
                    Delete
                  </button>
                </Col>
              )} */}
            </Row>
          {/* );
        })} */}

        <br></br>
        <h6 className="text-black">
          <b>Documents</b>
        </h6>
        <div className="row ">
          {/* <div className="col col-3">
            <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
              Layout Plan in pdf<span style={{ color: "red" }}>*</span>
            </h6>
            <label>
              <FileUpload style={{ cursor: "pointer" }} color="primary" />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanPdf")}
                accept="application/pdf/jpeg/png"
              />
            </label>
            {watch("layoutPlanPdf") && (
              <div>
                <a onClick={() => getDocShareholding(watch("layoutPlanPdf"), setLoader)} className="btn btn-sm ">
                  <VisibilityIcon color="info" className="icon" />
                </a>
              
              </div>
            )}
          </div> */}
          <div className="col col-3">
          <h5 className="d-flex flex-column mb-2">
           Layout Plan in pdf
            </h5>
          <div style={{ display: "flex" }}>
         <IconButton onClick={()=>getDocShareholding(residentialData?.layoutPlanPdf)}>
          <DownloadForOfflineIcon color="primary" className="mx-1"  />
          </IconButton>
          <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
       </div>
        </div>
        <div className="col col-3">
          <h5 className="d-flex flex-column mb-2">
          Layout Plan in dxf
            </h5>
          <div style={{ display: "flex" }}>
         <IconButton onClick={()=>getDocShareholding(residentialData?.layoutPlanDxf)}>
          <DownloadForOfflineIcon color="primary" className="mx-1"  />
          </IconButton>
          <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
       </div>
        </div>
        <div className="col col-3" >
          <h5 className="d-flex flex-column mb-2" 
              data-toggle="tooltip"
              data-placement="top"
              title="Undertaking that no change has been made in the phasing ">
          Undertaking.
            </h5>
          <div style={{ display: "flex" }}>
         <IconButton onClick={()=>getDocShareholding(residentialData?.undertaking)}>
          <DownloadForOfflineIcon color="primary" className="mx-1"  />
          </IconButton>
          <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.npnlNo
                          }}
                          onClick={() => {
                            setLabelValue("NPNL No"),
                              setOpennedModal("npnlNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(residentialData?.npnlNo);
                          }}
                        ></ReportProblemIcon>
       </div>
        </div>
        </div>
      </Col>
    </Row>
      </Form.Group>
    </Form>
    )
};
export default ResidentialPlottedForm;
