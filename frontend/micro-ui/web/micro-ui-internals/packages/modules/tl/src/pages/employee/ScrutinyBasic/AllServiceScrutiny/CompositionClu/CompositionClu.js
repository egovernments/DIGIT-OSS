import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ModalChild from "../../Remarks/ModalChild";
import Collapse from "react-bootstrap/Collapse";
import { useStyles } from "../../css/personalInfoChild.style";
import '../../css/personalInfoChild.style.js'

import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

function CompositionClu() {

  const {
    register,
    handleSubmit,
    formState: { error },
  } = useForm([{ Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [showhide, setShowhide] = useState("No");
  const [open2, setOpen2] = useState(false);
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };

//   const compositionClu = (data) => console.log(data);
  const [noofRows, setNoOfRows] = useState(1);









  const [selects, setSelects] = useState();
  // const [showhide, setShowhide] = useState("");
  // const [open2, setOpen2] = useState(false);

   

  // const handleshowhide = (event) => {
  //   const getuser = event.target.value;

  //   setShowhide(getuser);
  // };
  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   control,
  //   setValue,
  // } = useForm({});


  const compositionClu = (data) => console.log(data);
   
  const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  
  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved:"#09cb3d",
    disapproved:"#ff0000",
    info:"#FFB602"
  }

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here",openedModal,data);
    if(openedModal && data){
      setFieldIconColors({...fieldIconColors,[openedModal]:data.data.isApproved?Colors.approved:Colors.disapproved})
    }
      setOpennedModal("");
      setLabelValue("");
  };
  const [selectedFieldData,setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    developer: Colors.info,
    authPersonName: Colors.info,
    authMobileNo1: Colors.info,
    authMobileNo2: Colors.info,
    emailId: Colors.info,
    pan: Colors.info,
    address: Colors.info,
    city: Colors.info,
    pin: Colors.info,
    tehsil: Colors.info,
    district: Colors.info,
    state: Colors.info,
    type: Colors.info,
    lciSignedBy: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info
  })

  const fieldIdList = [{label:"Developer",key:"developer"},{label:"Authorized Person Name",key:"authPersonName"},{label:"Autrhoized Mobile No",key:"authMobileNo1"},{label:"Authorized MobileNo. 2 ",key:"authMobileNo2"},{label:"Email ID",key:"emailId"},{label:"PAN No.",key:"pan"},{label:"Address  1",key:"address"},{label:"Village/City",key:"city"},{label:"Pincode",key:"pin"},{label:"Tehsil",key:"tehsil"},{label:"District",key:"district"},{label:"State",key:"state"},{label:"Status (Individual/ Company/ Firm/ LLP etc.)",key:"type"},{label:"LC-I signed by",key:"lciSignedBy"},{label:"If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)",key:"lciNotSigned"},{label: "Permanent address in case of individual/ registered office address in case other than individual", key:"parmanentAddress"},{label:"Address for communication",key:"addressForCommunication"},{label:"Name of the authorized person to sign the application",key:"authPerson"},{label:"Email ID for communication",key:"emailForCommunication"}]










/////////////////////////////////////////////////////////////////////////////////


// function CompositionClu() {
  
  return (
    <form onSubmit={handleSubmit(compositionClu)}>
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
        Composition of urban Area Violation in CLU
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card
      //  style={{ width: "126%", border: "5px solid #1266af" }}
       >
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Composition of urban Area Violation in CLU</h4>
        <div className="card">
          <Row>
            {/* <Col className="col-4">
              <Form.Group controlId="formGridCase">
                <Form.Label>
                  <h2>Name of original land owner </h2>{" "}
                </Form.Label>
                <input type="number" placeholder="" className="form-control" {...register("originalLand")} />
              </Form.Group>
            </Col> */}
             <Col className="col-4">
               <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Name of original land owner &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
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
              </Col>
            <Col className="col-4">
              <Form.Group controlId="formGridCase">
                <Form.Label>
                  <h2> Land holding of above </h2>{" "}
                </Form.Label>
                {/* <input type="text" placeholder="" className="form-control" {...register("landHolding")} /> */}
                <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <Row>
            <div class="bordere">
              <p>
                <h2>
                  <b> Total land sold in parts</b>{" "}
                </h2>{" "}
              </p>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th colSpan="3" className="fw-normal" style={{ textAlign: "center" }}>
                      {" "}
                      Area of parts in sq. meters
                    </th>
                  </tr>
                  <tr>
                    <th className="fw-normal">Sr.No</th>
                    <th className="fw-normal">Khasra No</th>
                    <th className="fw-normal">Area </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="fw-normal">1</th>
                    <td>
                      {/* <input type="text" placeholder="" className="form-control" {...register("areaParts")} /> */}
                      <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
                    </td>
                    <td>
                      {/* <input type="text" placeholder="" className="form-control" {...register("srNo")} /> */}
                      <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-normal">2</th>
                    <td>
                      {/* <input type="text" placeholder="" className="form-control" {...register("khasraNo")} /> */}
                      <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
                    </td>
                    <td>
                      {/* <input type="text" placeholder="" className="form-control" {...register("area")} /> */}
                      <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
                    </td>
                  </tr>
                  {[...Array(noofRows)].map((elementInArray, input) => {
                    return (
                      <tr>
                        <th className="fw-normal">{input + 1}</th>
                        <td>
                          {/* <input type="text" placeholder="" /> */}
                          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
                        </td>
                        <td>
                          {/* <input type="text" placeholder="" /> */}
                          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
                         </td>
                      </tr>
                    );
                  })}
                </tbody>
              </div>
            </div>
            {/* <div>
              <button type="button" style={{ float: "left" }} className="btn btn-primary" onClick={() => setNoOfRows(noofRows + 1)}>
                Add more
              </button>
              <button type="button" style={{ float: "right" }} className="btn btn-danger" onClick={() => setNoOfRows(noofRows - 1)}>
                Delete
              </button>
            </div> */}
          </Row>
          <br></br>
          <Row>
            <Col className="col-4">
              <Form.Group controlId="formGridState">
                <Form.Label>
                  <h2> Total Area in Sq. meter</h2>{" "}
                </Form.Label>
                {/* <input type="number" className="form-control" placeholder="" {...register("totalArea")} /> */}
                <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Form.Group>
            </Col>

            <Col className="col-4">
              <Form.Group controlId="formGridState">
                <Form.Label>
                  <h2> Explain the reason for the violation</h2>{" "}
                </Form.Label>
                {/* <input type="number" className="form-control" placeholder="" rows="3" {...register("violationReason")} /> */}
                <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Form.Group>
            </Col>
          </Row>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th className="fw-normal">Sr.No</th>
                <th className="fw-normal">Field Name</th>
                <th className="fw-normal">Upload Documents</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="fw-normal">1</th>
                <td>Date of sale deeds.</td>
                <td>
                  {/* <input type="file" className="form-control" placeholder="" {...register("dateOfSaleDeed")} /> */}
                  <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
                                       </div>
                                 </div>
                </td>
              </tr>

              <tr>
                <th className="fw-normal">2</th>
                <td>
                  Any other.<span style={{ color: "red" }}>*</span>
                </td>
                <td>
                  {/* <input type="file" className="form-control" placeholder="" {...register("anyOther")} /> */}
                  <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
                                       </div>
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
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div> */}
        </div>
      </Card>
      </div>
      </Collapse>
    </form>
  );
}

export default CompositionClu;
