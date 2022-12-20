// import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
// import Col from "react-bootstrap/Col";
// import Form from "react-bootstrap/Form";
// import Row from "react-bootstrap/Row";
// import { useForm } from "react-hook-form";
// import { Card } from "react-bootstrap";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";

// import Collapse from "react-bootstrap/Collapse";

/////////////////////////////////////////////////////////////////////////////////

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

function LayoutPlanClu() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);

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

  const layoutPlan = (data) => console.log(data);

   
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















// function LayoutPlanClu() {
  // const [selects, setSelects] = useState();
  // const [showhide, setShowhide] = useState("");
  // const { register, handleSubmit } = useForm();


  // const handleshowhide = (event) => {
  //   const getuser = event.target.value;

  //   setShowhide(getuser);
  // };
  // const [open2, setOpen2] = useState(false);

  return (
    <form onSubmit={handleSubmit(layoutPlan)}>
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
        APPROVAL OF REVISED LAYOUT PLAN OF LICENSE
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card 
      // style={{ width: "126%", border: "5px solid #1266af" }}
      >
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</h4>
        <div className="card">
          <Form>
            <Row>
              <Col className="col-4">
                {/* <Form.Group controlId="formGridCase">
                  <Form.Label>
                    License No . <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="number" placeholder="" className="form-control" {...register("licenseNo")} />
                </Form.Group> */}
              
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
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Existing Area <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  {/* <input type="text" placeholder="" className="form-control" {...register("existingArea")} /> */}
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
                    Area of which planning is being changed <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  {/* <input type="text" placeholder="" className="form-control" {...register("areaPlanning")} /> */}
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
                <fieldset>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label>
                      Any other feature
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Row>
                    <Col className="col-3">
                      <Form.Check
                        type="radio"
                        value="true"
                        label="Yes"
                      name="Anyotherfeature"
                      id="Anyotherfeature"
                     
                      {...register(" Anyotherfeature")}
                        onChange={(e) => handleselects(e)}
                      />
                 
                      <Form.Check 
                      type="radio" 
                     
                      value="false"
                      label="No"
                    name="Anyotherfeature"
                    id="Anyotherfeature"
                    {...register("Anyotherfeature")}
                        onChange={(e) => handleselects(e)}
                        />
                    </Col>
                  </Row>
                 
                     
                  </Form.Group>
                 
                </fieldset>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Amount <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  {/* <input type="text" required={true} disabled={true} placeholder="" className="form-control" {...register("amount")} /> */}
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
              {/* <Col className="col-4">
                <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                  Pay
                </Button>
              </Col> */}
            </Row>
          </Form>
          <div className=" col-12 m-auto">
            <div className="card">
            <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }}>Sr.No</th>
                        <th style={{ textAlign: "center" }}>Field Name</th>
                        <th style={{ textAlign: "center" }}>Upload Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>
                          Reasons for revision in the layout plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          {/* <input type="file" placeholder="" className="form-control" {...register("reasonRevision")}></input> */}
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
                        <th scope="row">2</th>
                        <td>
                          {" "}
                          Copy of earlier approved layout plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          {/* <input type="file" placeholder="" className="form-control" {...register("earlierApprovedlayoutPlan")}></input> */}
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
                        <th scope="row">3</th>
                        <td>
                          {" "}
                          Any Other <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          {/* <input type="file" placeholder="" className="form-control" {...register("anyOther")}></input> */}
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
              </div>

              {/* <Row className="justify-content-end">
                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                  Save as Draft
                </Button>
                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                  Submit
                </Button>
              </Row> */}
            </div>
          </div>
        
      </Card>
      </div>
      </Collapse>
    </form>
  );
}

export default LayoutPlanClu;
