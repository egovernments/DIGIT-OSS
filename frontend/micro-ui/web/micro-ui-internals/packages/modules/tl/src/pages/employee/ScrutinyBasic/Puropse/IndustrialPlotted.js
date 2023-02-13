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

const IndustrialPlottedForm = (props) => {

  const industrialData = props.data;
  const dataIcons = props.dataForIcons;
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  const hideRemarks = userRoles.some((item)=>item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
  const hideRemarksPatwari = userRoles.some((item)=>item ==="Patwari_HQ")

  const { register, handleSubmit, formState: { errors } } = useForm([{ XLongitude: '', YLatitude: '' }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [IndustrialPlottedFormSubmitted, SetIndustrialPlottedFormSubmitted] = useState(false);
  const IndustrialPlottedFormSubmitHandler = (e) => {
    e.preventDefault();
    SetIndustrialPlottedFormSubmitted(true);
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
    upTo50PlotNo: Colors.info,
    upTo200PlotNo: Colors.info,
    moreThan200PlotNo: Colors.info,
    underResidentialDDJAYPlotNo: Colors.info,
    underCommunityDDJAYPlotNo: Colors.info,
    affordableHousingPlotNo: Colors.info,
    upTo50Area: Colors.info,
    upTo200Area: Colors.info,
    moreThan200Area: Colors.info,
    underResidentialDDJAYArea: Colors.info,
    underCommunityDDJAYArea: Colors.info,
    affordableHousingArea: Colors.info,
  })

  const fieldIdList = [
    {label:"Area of the colony, Up to 50 acres No.", key:"upTo50PlotNo"}, {label:"Area of the colony, Up to 50 acres Area", key:"upTo50Area"},{label:"More than 50 to 200 acres No.", key:"upTo200PlotNo"}, {label:"More than 50 to 200 acres Area", key:"upTo200Area"},{label:"More than 200 acres No.", key:"moreThan200PlotNo"}, {label:"More than 200 acres Area", key:"moreThan200Area"},{label:"Proposed plots under residential component DDJAY No.", key:"underResidentialDDJAYPlotNo"}, {label:"Proposed plots under residential component DDJAY Area", key:"underResidentialDDJAYArea"},{label:"Proposed plots under community facilities in DDJAY No.", key:"underCommunityDDJAYPlotNo"}, {label:"Proposed plots under community facilities in DDJAY Area", key:"underCommunityDDJAYArea"}, {label:"Details of plots for Labour dormitories from affordable Industries Housing component No.", key:"affordableHousingPlotNo"}, {label:"Details of plots for Labour dormitories from affordable Industries Housing component Area", key:"affordableHousingArea"}
  ];


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
    <Form onSubmit={IndustrialPlottedFormSubmitHandler} style={{ display: props.displayIndustrial }}>
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
        {/* <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col col-12>
            <h5 className="text-black"><h5>Industrial Plotted:-</h5></h5>

            <div className="table table-bordered table-responsive">
              <thead>
                <tr>
                  <td><h5>Detail of plots</h5></td>
                  <td ><h5>No.</h5></td>
                  <td ><h5>Area in Acres</h5></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2"><h5>Area of the colony, Up to 50 acres
                      </h5></p>
                    </div>
                  </td>
                  <td align="right">  
                  <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
                  </td>
                  <td component="th" scope="row">
                  <div  className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.area} />
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50Area
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres Area"),
                              setOpennedModal("upTo50Area")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.area);
                          }}
                        ></ReportProblemIcon>
                  </div>
                  </td>
                </tr>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2"><h5>More than 50 to 200 acres </h5></p>

                    </div>
                  </td>
                  <td align="right"> 
                  <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo200?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo200PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("More than 50 to 200 acres No."),
                              setOpennedModal("upTo200PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo200?.plotNo);
                          }}
                        ></ReportProblemIcon>
                    </div> 
                  </td>
                  <td component="th" scope="row">
                  <div  className="d-flex flex-row align-items-center"> 
                    <input type="number" className="form-control" disabled placeholder={industrialData?.upTo200?.area} />
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo200Area
                          }}
                          onClick={() => {
                            setLabelValue("More than 50 to 200 acres Area"),
                              setOpennedModal("upTo200Area")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo200?.area);
                          }}
                        ></ReportProblemIcon>
                  </div>
                  </td>
                </tr>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2" ><h5>More than 200 acres </h5></p>

                    </div>
                  </td>
                  <td align="right">  
                  <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.moreThan200?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.moreThan200PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("More than 200 acres No."),
                              setOpennedModal("moreThan200PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.moreThan200?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
                  </td>
                  <td component="th" scope="row">
                  <div  className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={industrialData?.moreThan200?.area} />
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.moreThan200Area
                          }}
                          onClick={() => {
                            setLabelValue("More than 200 acres Area"),
                              setOpennedModal("moreThan200Area")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.moreThan200?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2"><h5>Proposed plots under residential component DDJAY  </h5></p>

                    </div>
                  </td>
                  <td align="right">  
                  <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.residentialDDJAY?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.underResidentialDDJAYPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Proposed plots under residential component DDJAY No."),
                              setOpennedModal("underResidentialDDJAYPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.residentialDDJAY?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
                  </td>
                  <td component="th" scope="row">
                  <div  className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={industrialData?.residentialDDJAY?.area} />
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.underResidentialDDJAYArea
                          }}
                          onClick={() => {
                            setLabelValue("Proposed plots under residential component DDJAY Area"),
                              setOpennedModal("underResidentialDDJAYArea")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.residentialDDJAY?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2"><h5>Proposed plots under community facilities in DDJAY Area  </h5></p>

                    </div>
                  </td>
                  <td align="right">  
                  <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.facilitiesDDJAY?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.underCommunityDDJAYPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Proposed plots under community facilities in DDJAY No."),
                              setOpennedModal("underCommunityDDJAYPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.facilitiesDDJAY?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
                  </td>
                  <td component="th" scope="row">
                  <div  className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={industrialData?.facilitiesDDJAY?.area} />
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.underCommunityDDJAYArea
                          }}
                          onClick={() => {
                            setLabelValue("Proposed plots under community facilities in DDJAY Area"),
                              setOpennedModal("underCommunityDDJAYArea")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.facilitiesDDJAY?.area);
                          }}
                        ></ReportProblemIcon>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td >
                    <div className="px-2">
                      <p className="mb-2" ><h5>Details of plots for Labour dormitories from affordable Industries Housing component  </h5></p>

                    </div>
                  </td>
                  <td align="right">  
                  <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.affordableHousing?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.affordableHousingPlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Details of plots for Labour dormitories from affordable Industries Housing component No."),
                              setOpennedModal("affordableHousingPlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.affordableHousing?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
                  </td>
                  <td component="th" scope="row">
                  <div  className="d-flex flex-row align-items-center">
                    <input type="number" className="form-control" disabled placeholder={industrialData?.affordableHousing?.area} />
                    <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.affordableHousingArea
                          }}
                          onClick={() => {
                            setLabelValue("Details of plots for Labour dormitories from affordable Industries Housing component Area"),
                              setOpennedModal("affordableHousingArea")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.affordableHousing?.area);
                          }}
                        ></ReportProblemIcon>
                        </div>
                  </td>
                </tr>
              </tbody>
            </div>

          </Col>
        </Row> */}
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h6 className="text-black">
          <b>Industrial Plotted</b>
        </h6>
        {/* <br></br>
        <br></br> */}
       
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
         <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Industrial use
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Residential plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Affordable Industrial Housing
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Commercial
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total Saleable Area
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total Residential Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Required EWS Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total Industrial Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            {/* <input type="text" className="form-control" /> */}
            <div  className="d-flex flex-row align-items-center">
                  <input type="number" className="form-control" disabled placeholder={industrialData?.upTo50?.plotNo} />
                  <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
                  </div>
          </Col>
        </Row>

        <br></br>
        <h6 className="text-black">
          <b>Documents</b>
        </h6>
        <br></br>
        <div className="row ">
          {/* <div className="col col-3">
            <h6>
              Layout Plan <span style={{ color: "red" }}>*</span>
            </h6>

            <input type="file" className="form-control" accept="application/pdf/jpeg/png" />
          </div>
        </div> */}
        <div className="col col-3">
          <h5 className="d-flex flex-column mb-2">
          Layout Plan 
            </h5>
          <div style={{ display: "flex" }}>
         <IconButton onClick={()=>getDocShareholding(industrialData?.layoutPlanDxf)}>
          <DownloadForOfflineIcon color="primary" className="mx-1"  />
          </IconButton>
          <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.upTo50PlotNo
                          }}
                          onClick={() => {
                            setLabelValue("Area of the colony, Up to 50 acres No."),
                              setOpennedModal("upTo50PlotNo")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(industrialData?.upTo50?.plotNo);
                          }}
                        ></ReportProblemIcon>
       </div>
        </div>
        </div>
      </Col>
    </Row>
      </Form.Group>
    </Form>)
};
export default IndustrialPlottedForm;
