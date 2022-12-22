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

function StandardDesign() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});


  const standardDesign = (data) => console.log(data);
   
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
/////////////////////////////////////////////////////









// function Standard() {
//   const [selects, setSelects] = useState();
//   const [showhide, setShowhide] = useState("");

//   const handleshowhide = (event) => {
//     const getuser = event.target.value;

//     setShowhide(getuser);
//   };
  // const { register, handleSubmit } = useForm();
  
  // const [open2, setOpen2] = useState(false);

  return (
    <form onSubmit={handleSubmit(standardDesign)}>
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
        Approval of Standard Design
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card 
      // style={{ width: "126%", border: "5px solid #1266af" }}
      >
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of Standard Design</h4>
        <div className="card">
          <Row>
            {/* <Col className="col-4">
              <Form.Group controlId="formGridCase">
                <Form.Label>
                  License No . <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" placeholder="" className="form-control" {...register("licenseNo")} />
              </Form.Group>
            </Col> */}
            <Col className="col-4">
                 <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Licence No &nbsp;</h5>
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
              {/* <Form.Group controlId="formGridState">
                <Form.Label>
                  Plan <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="file" placeholder="" className="form-control" {...register("plan")} />
              </Form.Group> */}
                  <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Plan  &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
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
                                 </div>
            </Col>
            <Col className="col-4">
              {/* <Form.Group controlId="formGridState">
                <Form.Label>
                  Any other Document <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="file" placeholder="" className="form-control" {...register("otherDocument")} />
              </Form.Group> */}
              <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Any other Document  &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
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
                                 </div>
            </Col>
            <Col className="col-4">
              {/* <Form.Group controlId="formGridState">
                <Form.Label>
                  Amount <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" required={true} disabled={true} placeholder="" className="form-control" {...register("amount")} />
              </Form.Group> */}
                    <div>
                <Form.Label>
              <h5 className={classes.formLabel}> Amount  &nbsp;</h5>
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
            
             </div>
            </Col>
            {/* <Col className="col-4">
              <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                Pay
              </Button>
            </Col> */}
          </Row>

          {/* <Row className="justify-content-end">
            <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
              Save as Draft
            </Button>
            <Button type="submit" variant="outline-primary" className="col-md-2 my-2 mx-2" aria-label="right-end">
              Submit
            </Button>
          </Row> */}
        </div>
      </Card>
      </div>
      </Collapse>
    </form>
  );
}

export default StandardDesign;
