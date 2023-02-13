import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "../css/personalInfoChild.style";
import ModalChild from "../Remarks/ModalChild";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

const DDJAYForm = (props) => {


  const DDJAYFormSubmitHandler = (e) => {
    e.preventDefault();
    SetDdjayFormSubmitted(true);
  }

  const ddjayData = props.data;
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
    <Form onSubmit={DDJAYFormSubmitHandler} style={{ display: props.displayDdjay }}>
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
          <b>Deen Dayal Jan Awas Yojna (DDJAY)</b>
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
          
          <input type="text" className="form-control" placeholder={ddjayData?.totalAreaScheme}  disabled />
          &nbsp;
            <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.layoutPlan
                        }}
                        onClick={() => {
                          setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                            setOpennedModal("layoutPlan")
                          setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
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
               <div className="d-flex flex-row align-items-center my-1 ">
          
          <input type="text" className="form-control" placeholder={ddjayData?.areaUnderSectorRoad}  disabled />
          &nbsp;
            <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.layoutPlan
                        }}
                        onClick={() => {
                          setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                            setOpennedModal("layoutPlan")
                          setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
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
          
          <input type="text" className="form-control" placeholder={ddjayData?.balanceAreaAfterDeduction}  disabled />
          &nbsp;
            <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.layoutPlan
                        }}
                        onClick={() => {
                          setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                            setOpennedModal("layoutPlan")
                          setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
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
          
          <input type="text" className="form-control" placeholder={ddjayData?.areaUnderSectorAndGreenBelt}  disabled />
          &nbsp;
            <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.layoutPlan
                        }}
                        onClick={() => {
                          setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                            setOpennedModal("layoutPlan")
                          setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
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
          
          <input type="text" className="form-control" placeholder={ddjayData?.balanceArea}  disabled />
          &nbsp;
            <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.layoutPlan
                        }}
                        onClick={() => {
                          setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                            setOpennedModal("layoutPlan")
                          setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
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
              <div className="d-flex flex-row align-items-center my-1 ">
          
          <input type="text" className="form-control" placeholder={ddjayData?.areaUnderSectorAndGreenBelt}  disabled />
          &nbsp;
            <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.layoutPlan
                        }}
                        onClick={() => {
                          setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                            setOpennedModal("layoutPlan")
                          setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
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
          
          <input type="text" className="form-control" placeholder={ddjayData?.netPlannedArea}  disabled />
          &nbsp;
            <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.layoutPlan
                        }}
                        onClick={() => {
                          setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                            setOpennedModal("layoutPlan")
                          setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                        }}
                      ></ReportProblemIcon>
                      </div>
            </Col>
          </Row>
        </Col>


        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
          <div>
              <Form.Label>
                <h2>
                  Max area of plots ( in square meters)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
             
            </div>
            <div className="d-flex flex-row align-items-center my-1 ">
          
            <input type="text" className="form-control" placeholder={ddjayData?.maxAreaPlots}  disabled />
            &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
        <div>
              <h2>
                Size of plot ( in square meters)
                <span style={{ color: "red" }}>*</span>
              </h2>
            </div>
          <Col md={4} xxl lg="3">
           <div>
              <label>Minimum</label>
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.minPlotSize}  disabled />
              {/* <input type="number" className="form-control" {...register("minPlotSize")} /> */}
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
            </div>
            <div>
              <label>Maximum</label>
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.maxPlotSize}  disabled />
              {/* <input type="number" className="form-control" {...register("maxPlotSize")} /> */}
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
            </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total Nos. of Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.totalNoOfPlots}  disabled />
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
            </div>
            
            {/* <input type="number" className="form-control" {...register("totalNoOfPlots")} /> */}
            </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Permissible density
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.permissibleDensityDDJAY}  disabled />
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
            </div>
          
            </div>
            {/* <input type="number" className="form-control" {...register("permissibleDensityDDJAY")} /> */}
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Residential Plots & Commercial Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.residentialAndCommercialPlots}  disabled />
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
            </div>
            
            {/* <input type="number" className="form-control" {...register("residentialAndCommercialPlots")} /> */}
          </Col>
        </Row>
        <br></br>
     <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Residential Use
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.areaUnderResidentialUse}  disabled />
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
            {/* <input type="number" className="form-control" {...register("areaUnderResidentialUse")} /> */}
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Commercial Use
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.areaUnderCommercialUse}  disabled />
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
            {/* <input type="number" className="form-control" {...register("areaUnderCommercialUse")} /> */}
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Width of Internal roads in the colony (in meters)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.widthOfInternalRoads}  disabled />
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
            {/* <input type="number" className="form-control" {...register("widthOfInternalRoads")} /> */}
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under organized Open Space (in acres)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.AreaUnderOrganizedSpace}  disabled />
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
            {/* <input type="number" className="form-control" {...register("AreaUnderOrganizedSpace")} /> */}
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <label>
                <h2
                  data-toggle="tooltip"
                  data-placement="top"
                  title="The owner will transfer 10% area of the licenced colony free of cost to the Government for provision of community facilities. "
                >
                  Area Transferred to Government for community facilities.
                </h2>
              </label>
            </div>
            <div className="d-flex flex-row align-items-center my-1 ">
              <input type="text" className="form-control" placeholder={ddjayData?.transferredArea}  disabled />
              &nbsp;
              <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>
                        </div>
          
          </Col>
        </Row>
            {/* <div className="table table-bordered table-responsive">
              <thead>
                <tr>
                  <td><h5>Detail of plots</h5></td>
                  <td ><h5>No.</h5></td>
                  <td ><h5>Area</h5></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2" ><h5>Details of frozen plots (50%)
                      </h5></p>
                    </div>
                  </td>
                  <td align="right">
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={ddjayData?.frozenNo}/>
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
                              setFieldValue(ddjayData?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                    </td>
                  <td component="th" scope="row">
                    <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={ddjayData?.frozenArea}/>
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.frozenPlotArea
                          }}
                          onClick={() => {
                            setLabelValue("Details of frozen plots (50%) Area"),
                              setOpennedModal("frozenPlotArea")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.frozenPlot?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                    
                  </td>
                </tr>
              </tbody>
            </div>

            <br></br>
            <div className="row">
              <div className="col col-12">
                <h6><h5> Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan (Yes/No)</h5>&nbsp;&nbsp;


                  <input type="radio" value="Yes"   checked={ddjayData?.organize==="Y"?true:false} disabled />&nbsp;&nbsp;
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;

                  <input type="radio" value="No"   checked={ddjayData?.organize==="N"?true:false} disabled />&nbsp;&nbsp;
                  <label className="m-0 mx-2" for="No">No</label>
                          
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.layoutPlan
                          }}
                          onClick={() => {
                            setLabelValue("Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan"),
                              setOpennedModal("layoutPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(ddjayData?.minArea==="Y"?"Yes":ddjayData?.organize==="N"?"No":null);
                          }}
                        ></ReportProblemIcon>


                  </h6>
                {
                  ddjayData?.organize==="Y" && (
                    <div className="row " >
                      <div className="col col-6">
                        <label for="parentLicense" className="font-weight-bold">Area of such Pocket (in acres)</label>
                        <div>
                        <input type="text" className="form-control" placeholder={data?.organizeArea}  disabled />
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.areaOfPocket
                          }}
                          onClick={() => {
                            setLabelValue("Area of such Pocket (in acres)"),
                              setOpennedModal("areaOfPocket")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(data?.organizeArea);
                          }}
                        ></ReportProblemIcon>
                        </div>
                      </div>

                    </div>

                  )
                }
              </div>
            </div> */}
            <br></br>
            {/* <hr className="mb-4" /> */}

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
            color: fieldIconColors.areaOfPocket
          }}
          onClick={() => {
            setLabelValue("Demarcation plan"),
              setOpennedModal("demarcationPlan")
            setSmShow(true),
              console.log("modal open"),
              setFieldValue();
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
            color: fieldIconColors.areaOfPocket
          }}
          onClick={() => {
            setLabelValue("Demarcation plan"),
              setOpennedModal("demarcationPlan")
            setSmShow(true),
              console.log("modal open"),
              setFieldValue();
          }}
        ></ReportProblemIcon>
      </div>
    </h5>
   
  </div>
  </div>



          </Col>
        </Row>
      </Form.Group>
    </Form>)
};
export default DDJAYForm;
