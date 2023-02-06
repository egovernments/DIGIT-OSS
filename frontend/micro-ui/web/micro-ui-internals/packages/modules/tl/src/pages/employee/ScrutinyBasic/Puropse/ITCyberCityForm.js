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

const ITCyberCityForm = (props) => {


  const DDJAYFormSubmitHandler = (e) => {
    e.preventDefault();
    SetDdjayFormSubmitted(true);
  }
//   displayResidentialGroupHousingForm

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
    <Form onSubmit={DDJAYFormSubmitHandler} style={{ display: props.displayITCyberCityForm}}>
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
       <b>IT Cyber </b>
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
              Balance area after deducting area under sector road and Green Belt
              <span style={{ color: "red" }}>*</span>
            </h2>
          </Form.Label>
        </div>
        {/* <input disabled type="number" className="form-control" {...register("balanceAreaAfterDeduction")} /> */}
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
              50% of the Area under Sector Road & Green Belt
              <span style={{ color: "red" }}>*</span>
            </h2>
          </Form.Label>
        </div>
        {/* <input disabled type="number" className="form-control" {...register("areaUnderSectorAndGreenBelt")} /> */}
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
              Net planned area (A+B)
              <span style={{ color: "red" }}>*</span>
            </h2>
          </Form.Label>
        </div>
        {/* <input disabled type="number" className="form-control" {...register("netPlannedArea")} /> */}
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
    </Row>
  </Col>
  <Col md={4} xxl lg="3">
    <div>
      <Form.Label>
        <h2>
          Area to be provided free of cost to the Government for EWS/AH
          <span style={{ color: "red" }}>*</span>
        </h2>
      </Form.Label>
    </div>
    {/* <input
      type="number"
      className="form-control"
      {...register("providedArea")}
      onWheel={handleWheel}
      onChange={(e) => {
        if (e?.target?.value < (watch("netPlannedArea") * 10) / 100)
          setError({
            ...error,
            ["providedArea"]:
              "Minimum 10% area to be provided free of cost to the Government for EWS/Affordable Housing as per amended policy dated 11.05.2022. ",
          });
        else setError({ ...error, ["providedArea"]: "" });
      }}
    />
    {error?.providedArea && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.providedArea}</h6>} */}
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

  <h6 className="text-black mt-4">
    <b>Documents</b>
  </h6>
  <br></br>
  <div className="row mt-4">
    {/* <div className="col col-3">
      <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
        Layout Plan in pdf<span style={{ color: "red" }}>*</span>
      </h6>
      <div className="d-flex">
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
      </div>
    </div> */}
    <div className="col col-3">
          <h5 className="d-flex flex-column mb-2">
          Layout Plan in pdf
            </h5>
          <div style={{ display: "flex" }}>
         <IconButton onClick={()=>getDocShareholding(ddjayData?.layoutPlanDxf)}>
          <DownloadForOfflineIcon color="primary" className="mx-1"  />
          </IconButton>
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

        <div className="col col-3">
          <h5 className="d-flex flex-column mb-2">
          Layout Plan in dxf
            </h5>
          <div style={{ display: "flex" }}>
         <IconButton onClick={()=>getDocShareholding(ddjayData?.layoutPlanDxf)}>
          <DownloadForOfflineIcon color="primary" className="mx-1"  />
          </IconButton>
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
    {/* <div className="col col-3">
      <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
        Layout Plan in dxf<span style={{ color: "red" }}>*</span>
      </h6>
      <div className="d-flex">
        <label>
          <FileUpload style={{ cursor: "pointer" }} color="primary" />
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanDxf")}
            accept="application/pdf/jpeg/png"
          />
        </label>
        {watch("layoutPlanDxf") && (
          <a onClick={() => getDocShareholding(watch("layoutPlanDxf"), setLoader)} className="btn btn-sm ">
            <VisibilityIcon color="info" className="icon" />
          </a>
        )}
      </div>
    </div> */}
  </div>
</Col>
</Row> 
    
      </Form.Group>
    </Form>)
};
export default ITCyberCityForm;
