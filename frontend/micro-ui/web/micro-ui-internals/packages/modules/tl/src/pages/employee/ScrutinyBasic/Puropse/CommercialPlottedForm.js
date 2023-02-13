import React,{ useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "../css/personalInfoChild.style";
import ModalChild from "../Remarks/ModalChild";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";



const CommercialPlottedForm  = (props) => {



  const CommercialPlottedFormSubmitHandler = (e) => {
    e.preventDefault();
    SetCommercialPlottedFormSubmitted(true);
  }

  const CommercialPlotted = props.data;
  const dataIcons = props.dataForIcons;
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  const hideRemarks = userRoles.some((item)=>item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
  const hideRemarksPatwari = userRoles.some((item)=>item ==="Patwari_HQ")
  
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
      frozenPlotNo: Colors.info,
      frozenPlotArea: Colors.info,
      layoutPlan: Colors.info,
      areaOfPocket: Colors.info
  })

  const fieldIdList = [{ label: "Details of frozen plots (50%) No.", key: "frozenPlotNo" },{ label: "Details of frozen plots (50%) Area", key: "frozenPlotArea" },{ label: "Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan", key: "layoutPlan" },{ label: "Area of such Pocket (in acres)", key: "areaOfPocket" }];


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
    <Form onSubmit={CommercialPlottedFormSubmitHandler} style={{ display: props.displayCommercialPlottedData }}>
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
        <h6 className="text-black">
          <b>
            Commercial Plotted <span style={{ color: "red" }}>*</span>
          </b>
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
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.totalAreaScheme}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
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
                    const percentage = (e?.target?.value * 10) / 100;
                    const TAS = (watch("totalAreaScheme") * 10) / 100;
                    const findMin = Math.min(TAS, percentage);
                    setValue("totalSiteArea", findMin);
                    setValue("balanceAreaAfterDeduction", (watch("totalAreaScheme") - e?.target?.value)?.toFixed(3));
                    setValue("areaUnderSectorAndGreenBelt", (e?.target?.value * 50) / 100);
                  } else {
                    setValue("balanceAreaAfterDeduction", "");
                    setValue("balanceArea", "");
                    setValue("areaUnderSectorAndGreenBelt", "");
                    setValue("netPlannedArea", "");
                    setValue("areaUnderUndetermined", "");
                    setValue("totalAreaScheme", "");
                  }
                }}
              /> */}
               <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.areaUnderSectorRoad}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
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
              
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.balanceAreaAfterDeduction}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
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
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.areaUnderUndetermined}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
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
                    Balance area
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input disabled type="number" className="form-control" {...register("balanceArea")} /> */}
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.balanceArea}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                        </div>
            </Col>

            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    10% of the total site area or the area falling under the sector green belt whichever is less
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              {/* <input disabled type="number" className="form-control" {...register("totalSiteArea")} /> */}
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.totalSiteArea}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
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
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.netPlannedArea}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                        </div>
            </Col>
          </Row>
        </Col>

        <h6 className="text-black mt-4">
          <b>Detail of SCO’s/plots</b>
        </h6>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Ground Coverage (in Square Meters)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input
              type="text"
              className="form-control"
              {...register("groundCoverage")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (e?.target?.value > (watch("netPlannedArea") * 35) / 100) {
                  setError({ ...error, ["groundCoverage"]: "Maximum 35% of Net planned area is allowed" });
                } else setError({ ...error, ["groundCoverage"]: "" });
              }}
            />
            {error?.groundCoverage && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.groundCoverage}</h6>} */}
            <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.groundCoverage}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                        </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  FAR (in Square Meters)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input
              type="text"
              className="form-control"
              {...register("FAR")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (e?.target?.value > (watch("netPlannedArea") * 150) / 100) {
                  setError({ ...error, ["FAR"]: "Cannot be above 150% of Net planned area" });
                } else setError({ ...error, ["FAR"]: "" });
              }}
            />
            {error?.FAR && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.FAR}</h6>} */}
            <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.FAR}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                        </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Parking/Open Space/Services (in Square Meters)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input
              type="text"
              className="form-control"
              {...register("parkingSpace")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (e?.target?.value < (watch("netPlannedArea") * 65) / 100) {
                  setError({ ...error, ["parkingSpace"]: "Cannot be less than 65 % of Net planned area" });
                } else setError({ ...error, ["parkingSpace"]: "" });
              }}
            />
            {error?.parkingSpace && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.parkingSpace}</h6>} */}
            <div className="d-flex flex-row align-items-center my-1 ">
              <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.parkingSpace}/>
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                        </div>
          </Col>
        </Row>
                          
        <h5 className="text-black" style={{ marginBottom: "2%" }}>
   Documents
</h5>
<div className={`${classes.formLabel} row`}>
  <div className="col col-3">
    <h5 className="d-flex flex-column mb-2">
    Layout Plan in pdf
      <div style={{ display: "flex" }}>
        
        <IconButton onClick={()=>getDocShareholding(ddjayData?.layoutPlanPdf)}>
          <DownloadForOfflineIcon color="primary" className="mx-1"  />
        </IconButton>
        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
      </div>
    </h5>
   
  </div>
  <div className="col col-3">
    <h5 className="d-flex flex-column mb-2">
    Layout Plan in dxf
      <div style={{ display: "flex" }}>
        
        <IconButton onClick={()=>getDocShareholding(ddjayData?.layoutPlanDxf)}>
          <DownloadForOfflineIcon color="primary" className="mx-1"  />
        </IconButton>
        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
      </div>
    </h5>
   
  </div>
  </div>

      </Col>
    </Row>
      {/* <Row className="ml-auto" style={{ marginBottom: 5 }}>

      <Col col-12>
        <h5 className="text-black">Commercial Plotted:-</h5>
        <br></br>
        <div className="col col-12">
          <h6>
            Number of Plots/SCOs (saleable area) &nbsp;&nbsp;
            <input type="radio" value="Y" id="Yes" name="Yes" placeholder={CommercialPlotted?.noOfPlotsSealableOneFifty} />
            &nbsp;&nbsp;
            <label className="m-0  mx-2" for="Yes">
              150%
            </label>
            &nbsp;&nbsp;
            <input type="radio" value="N" id="No"  name="Yes" placeholder={CommercialPlotted?.noOfPlotsSealableOneSeventyfive} />
            &nbsp;&nbsp;
            <label className="m-0 mx-2" for="No">
              175%
            </label>
          </h6>
        </div>
        <br></br>
        <div>
          <h6> Total FAR has been availed &nbsp;&nbsp;</h6>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <td>Type of plots</td>
                <td>Plot No.</td>
                <td>Length in mtr</td>
                <td>Width in mtr</td>
                <td>Area in sqm</td>
                <td>Similar shape/size plots</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">SCOs</p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.scoPlotno}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.scoLength}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.scoWidth}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.scoArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.scoSimilarShape}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">Booths </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.boothPlotno}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.boothLength}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.boothWidth}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.boothArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.boothSimilarShape}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">Public Utilities </p>
                  </div>
                </td>
               
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">STP </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.stpPlotno}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.stpLength}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td align="right">
                  {" "}
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.stpWidth}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td align="right">
                  {" "}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.stpArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.stpSimilarShape}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">WTP </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.wtpPlotno}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.wtpLength}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.wtpWidth}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.wtpArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.wtpSimilarShape}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">UGT </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.ugtPlotno}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.ugtLength}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td align="right">
                  {" "}
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.ugtWidth}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td align="right">
                  {" "}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.ugtArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.ugtSimilarShape}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">Milk booth </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.milkPlotno}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.milkLength}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td align="right">
                  {" "}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.milkWidth}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td align="right">
                  {" "}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.milkArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.milkSimilarShape}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">GSS</p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.gssPlotno}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.gssLength}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td align="right">
                  {" "}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.gssWidth}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td align="right">
                  {" "}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.gssArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                   <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.gssSimilarShape}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <div className="px-2">
                    <p className="mb-2">Irregular size SCOs</p>
                  </div>
                </td>
                <td align="right">
                  <div className="px-2">
                    <p className="mb-2">Dimensions in mtr </p>
                  </div>
                </td>
                <td align="right">
                  <div className="px-2">
                    <p className="mb-2">Area manually entered </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <div className="px-2">
                    <p className="mb-2">SCOs, booths etc </p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.etcDim}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
                <td component="th" scope="row">
                <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.etcArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) No."),
                              setOpennedModal("frozenPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(CommercialPlotted?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                </td>
              </tr>
            </tbody>
          </div>
        </div>
      </Col>
    </Row> */}
    </Form.Group>
    </Form>
  );
};
export default CommercialPlottedForm;