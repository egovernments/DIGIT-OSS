import React,{ useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";


import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "../css/personalInfoChild.style";
import ModalChild from "../Remarks/ModalChild";


const CommercialPlottedForm  = (props) => {



  const CommercialPlottedFormSubmitHandler = (e) => {
    e.preventDefault();
    SetCommercialPlottedFormSubmitted(true);
  }

  const CommercialPlotted = props.data;
  const dataIcons = props.dataForIcons;

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
    {/* <Row className="ml-auto" style={{ marginBottom: 5 }}> */}
      <Col col-12>
        <h5 className="text-black">Commercial Plotted:-</h5>
        <br></br>
        <div className="col col-12">
          <h6>
            Number of Plots/SCOs (saleable area) &nbsp;&nbsp;
            <input type="radio" value="Y" id="Yes" name="Yes" />
            &nbsp;&nbsp;
            <label className="m-0  mx-2" for="Yes">
              150%
            </label>
            &nbsp;&nbsp;
            <input type="radio" value="N" id="No"  name="Yes" />
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
                  {/*  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    </div> */}
                  <div className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
                    <input type="number" className="form-control" disabled placeholder={CommercialPlotted?.frozenNo}/>
                    <ReportProblemIcon
                          style={{
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
    </Row>
    </Form.Group>
    </Form>
  );
};
export default CommercialPlottedForm;