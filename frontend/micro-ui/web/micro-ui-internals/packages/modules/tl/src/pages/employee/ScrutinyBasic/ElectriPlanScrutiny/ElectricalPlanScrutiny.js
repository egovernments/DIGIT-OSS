
import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
// import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import FileDownload from "@mui/icons-material/FileDownload";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
import ModalChild from "../Remarks/ModalChild/"
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import '../css/personalInfoChild.style.js'
import { useStyles } from "../css/personalInfoChild.style.js"
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Collapse from "react-bootstrap/Collapse";
import { IconButton } from "@mui/material";
import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";

const ElectricalPlanScrutiny = (props) => {
  

  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);
  const {remarksData,iconStates} = useContext(ScrutinyRemarksContext);

 const dataIcons = props.dataForIcons;
 const apiResponse = props.apiResponse
//  apiResponse,refreshScrutinyData, applicationNumber,iconStates
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const servicePlan = (data) => console.log(data);

  const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602",
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    }
    setOpennedModal("");
    setLabelValue("");
  };
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");
  const [fieldIconColors, setFieldIconColors] = useState({
    loiNumber: Colors.info,
    electricalInfra: Colors.info,
    elecricDistribution: Colors.info,
    electricalCapacity: Colors.info,
    switchingStation: Colors.info,
    loadSancation: Colors.info,
    selfCenteredDrawings: Colors.info,
    autoCad: Colors.info,
    pdfFormat: Colors.info,
    environmentalClearance: Colors.info,
    verifiedPlan: Colors.info,
    state: Colors.info,
    type: Colors.info,
    lciSignedBy: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info,
  });

  const fieldIdList = [
    { label: "LOI Number", key: "loiNumber" },
    { label: "Electrical infrastructure sufficient to cater for the electrical need of the project area", key: "electricalInfra" },
    { label: "Provision of the electricity distribution in the project area by the instructions of the DHBVN", key: "elecricDistribution" },
    { label: "The capacity of the proposed electrical substation as per the requirement", key: "electricalCapacity" },
    { label: "Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan", key: "switchingStation" },
    { label: "Load sanction approval as per the requirement", key: "loadSancation" },
    { label: "Self-certified drawings from empanelled/certified architects that conform to the standard approved template.", key: "selfCenteredDrawings" },
    { label: "Environmental Clearance", key: "environmentalClearance" },
    { label: "PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website).", key: "pdfFormat" },
    { label: "AutoCAD (DXF) file.", key: "autoCad" },
    { label: "Certified copy of the plan verified by a third party.", key: "verifiedPlan" }
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




  console.log("Digit123", apiResponse );

  return (
    <form 
    
    >
    <div
  className="collapse-header"
  onClick={() => setOpen2(!open2)}
  aria-controls="example-collapse-text"
  aria-expanded={open2}
  style={{
    background: "#f1f1f1",
    padding: "0.25rem 1.25rem",
    borderRadius: "0.25rem",
    fontWeight: "600",
    display: "flex",
    cursor: "pointer",
    color: "#817f7f",
    justifyContent: "space-between",
    alignContent: "center",
  }}
>
  <span style={{ color: "#817f7f" }} className="">
  Electrical Plan Service
  </span>
  {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
</div>
<Collapse in={open2}>
  <div id="example-collapse-text">
      <Card 
      // style={{ width: "126%", border: "5px solid #1266af" }}
      >
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Electrical Plan </h4>
        <Card  
        style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}
        >
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
          
            <Col className="col-4">
              {/* <Form.Group as={Col} controlId="formGridLicence"> */}
               <div>
                <Form.Label>
              <h5 className={classes.formLabel}>LOI Number &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={apiResponse?.loiNumber}
              disabled
            ></Form.Control>

                <ReportProblemIcon
              style={{
                color:fieldIconColors.loiNumber }}
              onClick={() => {
                  setOpennedModal("loiNumber")
                  setLabelValue("LOI Number"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse?.loiNumber : null);
              }}
            ></ReportProblemIcon>
             <ModalChild
              labelmodal={labelValue}
              passmodalData={handlemodaldData}
              displaymodal={smShow}
              onClose={()=>setSmShow(false)}
              selectedFieldData={selectedFieldData}
              fieldValue={fieldValue}
              remarksUpdate={currentRemarks}
            ></ModalChild>
             </div>
              {/* </Form.Group> */}
            </Col>
            <Col md={4} xxl lg="4">

              <p className="ml-3">
              Electrical infrastructure sufficient to cater for the electrical need of the project area <span style={{ color: "red" }}>*</span>{" "}
              </p>
              <div className="ml-3" >
                  <input
                    type="radio"
                    value="Yes"

                    className="mx-2 mt-1"
                    checked={apiResponse?.electricalInfra  === "Y" ?true:false}
                    // onChange={(e) => handleChange(e.target.value)}
                    // 
                    // onClick={handleshow}
                    disabled
                  />
                  <label className="m-0  mx-1" for="Yes">Yes</label>

                  <input
                    type="radio"
                    value="No"

                    className="mx-2 mt-1"
                    checked={apiResponse?.electricalInfra  === "N" ?true:false}
                  
                    disabled
                  />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
              style={{
                color:fieldIconColors.electricalInfra }}
              onClick={() => {
                  setOpennedModal("electricalInfra")
                  setLabelValue("Electrical infrastructure sufficient to cater for the electrical need of the project area"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse.electricalInfra : null);
              }}
            ></ReportProblemIcon>
                </div>
              
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
            <p className="ml-3">
            Provision of the electricity distribution in the project area by the instructions of the DHBVN{" "}
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </p>
              <div className="ml-3" >
                  <input
                    type="radio"
                    value="Yes"

                    className="mx-2 mt-1"
                    checked={apiResponse?.elecricDistribution  === "true" ?true:false}
                    // checked={capacityScrutinyInfo?.designatedDirectors === "Y" ?true:false}
                    // onChange={(e) => handleChange(e.target.value)}
                    // 
                    // onClick={handleshow}
                    disabled
                  />
                  <label className="m-0  mx-1" for="Yes">Yes</label>

                  <input
                    type="radio"
                    value="No"

                    className="mx-2 mt-1"
                    checked={apiResponse?.elecricDistribution  === "false" ?true:false}
                    // checked={capacityScrutinyInfo?.designatedDirectors === "N" ?true:false}
                    // onChange={(e) => handleChange(e.target.value)}
                    // 
                    // onClick={handleshow}
                    disabled
                  />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
              style={{
                color:fieldIconColors.elecricDistribution }}
              onClick={() => {
                  setOpennedModal("elecricDistribution")
                  setLabelValue("Provision of the electricity distribution in the project area by the instructions of the DHBVN"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse?.elecricDistributionr : null);
              }}
            ></ReportProblemIcon>
                </div>
              {/* <div>
                <Form.Label>
                  Provision of the electricity distribution in the project area by the instructions of the DHBVN{" "}
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="true"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                {...register("electricDistribution")}
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="false"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                {...register("electricDistribution")}
                inline
              ></Form.Check> */}
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
            <p className="ml-3">
            The capacity of the proposed electrical substation as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;{" "}

              </p>
              <div className="ml-3" >
                  <input
                    type="radio"
                    value="Yes"

                    className="mx-2 mt-1"
                    checked={apiResponse?.electricalCapacity  === "true" ?true:false}
                    // checked={capacityScrutinyInfo?.designatedDirectors === "Y" ?true:false}
                    // onChange={(e) => handleChange(e.target.value)}
                    // 
                    // onClick={handleshow}
                    disabled
                  />
                  <label className="m-0  mx-1" for="Yes">Yes</label>

                  <input
                    type="radio"
                    value="No"

                    className="mx-2 mt-1"
                    checked={apiResponse?.electricalCapacity  === "flase" ?true:false}
                    
                    disabled
                  />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
              style={{
                color:fieldIconColors.electricalCapacity }}
              onClick={() => {
                  setOpennedModal("electricalCapacity")
                  setLabelValue("The capacity of the proposed electrical substation as per the requirement"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse.electricalCapacity : null);
              }}
            ></ReportProblemIcon>
                </div>

              
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              
                <p className="ml-3">
                Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;{" "}

              </p>
              <div className="ml-3" >
                  <input
                    type="radio"
                    value="Yes"

                    className="mx-2 mt-1"
                    checked={apiResponse?.switchingStation  === "true" ?true:false}
                    // checked={capacityScrutinyInfo?.designatedDirectors === "Y" ?true:false}
                    // onChange={(e) => handleChange(e.target.value)}
                    // 
                    // onClick={handleshow}
                    disabled
                  />
                  <label className="m-0  mx-1" for="Yes">Yes</label>

                  <input
                    type="radio"
                    value="No"

                    className="mx-2 mt-1"
                    checked={apiResponse?.switchingStation  === "false" ?true:false}
                    // checked={capacityScrutinyInfo?.designatedDirectors === "N" ?true:false}
                    // onChange={(e) => handleChange(e.target.value)}
                    // 
                    // onClick={handleshow}
                    disabled
                  />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
              style={{
                color:fieldIconColors.switchingStation }}
              onClick={() => {
                  setOpennedModal("switchingStation")
                  setLabelValue("Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse.switchingStation : null);
              }}
            ></ReportProblemIcon>
                </div>
            </Col>
            <Col className="ms-auto" md={4} xxl lg="4">
              
                <p className="ml-3">
                Load sanction approval as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;

              </p>
              <div className="ml-3" >
                  <input
                    type="radio"
                    value="Yes"

                    className="mx-2 mt-1"
                    checked={apiResponse?.loadSancation  === "true" ?true:false}
                    // checked={capacityScrutinyInfo?.designatedDirectors === "Y" ?true:false}
                    // onChange={(e) => handleChange(e.target.value)}
                    // 
                    // onClick={handleshow}
                    disabled
                  />
                  <label className="m-0  mx-1" for="Yes">Yes</label>

                  <input
                    type="radio"
                    value="No"

                    className="mx-2 mt-1"
                    checked={apiResponse?.loadSancation  === "false" ?true:false}
                    // checked={capacityScrutinyInfo?.designatedDirectors === "N" ?true:false}
                    // onChange={(e) => handleChange(e.target.value)}
                    // 
                    // onClick={handleshow}
                    disabled
                  />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
              style={{
                color:fieldIconColors.loadSancation }}
              onClick={() => {
                  setOpennedModal("loadSancation")
                  setLabelValue("Load sanction approval as per the requirement"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse.loadSancation : null);
              }}
            ></ReportProblemIcon>
                </div>
            </Col>
            {/* <Col className="ms-auto" md={4} xxl lg="4"></Col> */}
          </Row>
<br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <td style={{ textAlign: "center" }}> Sr.No.</td>
                <td style={{ textAlign: "center" }}>Type Of Map/Plan</td>
                <td style={{ textAlign: "center" }}>Annexure</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">1.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Self-certified drawings from empanelled/certified architects that conform to the standard approved template.</h2>
                </td>
                <td component="th" scope="row">
                  {/* <input type="file" className="form-control" {...register("selfCenteredDrawings")} /> */}
                  <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.selfCenteredDrawings)}>
                        <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.selfCenteredDrawings)}>
                        <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                  <ReportProblemIcon
              style={{
                color:fieldIconColors.selfCenteredDrawings }}
              onClick={() => {
                  setOpennedModal("Selfcertified")
                  setLabelValue("Self-certified drawings from empanelled/certified architects that conform to the standard approved template."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse.selfCenteredDrawings : null);
              }}
            ></ReportProblemIcon>
      </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">2.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Environmental Clearance.</h2>
                </td>
                <td component="th" scope="row">
                  {/* <input type="file" className="form-control" {...register("environmentalClearance")} /> */}
                  <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.environmentalClearance)}>
                        <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.environmentalClearance)}>
                        <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                  <ReportProblemIcon
              style={{
                color:fieldIconColors.environmentalClearance }}
              onClick={() => {
                  setOpennedModal("environmentalClearance")
                  setLabelValue("Environmental Clearance."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse?.environmentalClearance : null);
              }}
            ></ReportProblemIcon>
            </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">3.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website).</h2>

                 </td>
                <td component="th" scope="row">
                  {/* <input type="file" className="form-control" {...register("pdfFormat")} /> */}
                  <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.pdfFormat)}>
                        <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.pdfFormat)}>
                        <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                  <ReportProblemIcon
              style={{
                color:fieldIconColors.pdfFormat }}
              onClick={() => {
                  setOpennedModal("pdfFormat")
                  setLabelValue("PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website)."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse?.pdfFormat : null);
              }}
            ></ReportProblemIcon>
      </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">4.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>AutoCAD (DXF) file.</h2>
                </td>
                <td component="th" scope="row">
                  {/* <input type="file" className="form-control" {...register("autoCad")} /> */}
                  <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.autoCad)}>
                        <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.autoCad)}>
                        <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">

                  <ReportProblemIcon
              style={{
                color:fieldIconColors.autoCad }}
              onClick={() => {
                  setOpennedModal("autoCad")
                  setLabelValue("AutoCAD (DXF) file."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse?.autoCad : null);
              }}
            ></ReportProblemIcon>
              </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">5.</p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <h2>Certified copy of the plan verified by a third party.</h2>
                </td>
                <td component="th" scope="row">
                  {/* <input type="file" className="form-control" {...register("verifiedPlan")} /> */}
                  <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.verifiedPlan)}>
                        <Visibility color="info" className="icon" />
                        </IconButton>
                      </div>

                      <div className="btn btn-sm col-md-4">
                        <IconButton onClick={()=>getDocShareholding(apiResponse?.verifiedPlan)}>
                        <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                      </div>
                      <div className="btn btn-sm col-md-4">
                 <ReportProblemIcon
              style={{
                color:fieldIconColors.verifiedPlan }}
              onClick={() => {
                  setOpennedModal("verifiedPlan")
                  setLabelValue("Certified copy of the plan verified by a third party"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(apiResponse !== null ? apiResponse?.verifiedPlan : null);
              }}
            ></ReportProblemIcon>
            </div>
                </td>
              </tr>
            </tbody>
          </div>

          {/* <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
          </div> */}
        </Card>
      </Card>
      </div>
      </Collapse>
    </form>
  );
};

export default ElectricalPlanScrutiny;