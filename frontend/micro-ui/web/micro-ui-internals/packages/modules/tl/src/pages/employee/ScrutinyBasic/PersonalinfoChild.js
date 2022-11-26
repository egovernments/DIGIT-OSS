import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import './css/personalInfoChild.style.js'
import { useStyles } from "./css/personalInfoChild.style.js"




const PersonalinfoChild = (props) => {


  const classes = useStyles();

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved:"#09cb3d",
    disapproved:"#ff0000",
    info:"#FFB602"
  }
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





  const personalinfo = props.personalinfo;
  const iconStates = props.iconColorState;


  const getColorofFieldIcon=()=>{
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item)=>{
      if (iconStates!==null && iconStates!==undefined) {
        console.log("color method called");
        const fieldPresent = iconStates.egScrutiny.filter(ele => (ele.fieldIdL===item.label));
        console.log("filteration value", fieldPresent,fieldPresent[0]?.isApproved);
        if(fieldPresent && fieldPresent.length){
          console.log("filteration value1", fieldPresent,fieldPresent[0]?.isApproved);
          tempFieldColorState = {...tempFieldColorState,[item.key]:fieldPresent[0].isApproved?Colors.approved:Colors.disapproved}
         
        }
      }
    })

    setFieldIconColors(tempFieldColorState);

  };


  useEffect(()=>{
    getColorofFieldIcon();
    console.log("repeating1...",)
  },[iconStates])

  useEffect(()=>{
    if(labelValue){
      const fieldPresent = iconStates.egScrutiny.filter(ele => (ele.fieldIdL===labelValue));
      setSelectedFieldData(fieldPresent[0]);
    }else{
      setSelectedFieldData(null);
    }
  },[labelValue])
 
  
  
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

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


  return (
    <Form.Group style={{ display: props.displayPersonal}} className={classes.formGroup}>
      <Row className={[classes.row,"ms-auto"]} >
        <Col className="ms-auto" md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h5 className={classes.formLabel}>Developer &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorizedDeveloper : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("developer")
                  setLabelValue("Developer"),
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
        <Col className="ms-auto" md={4} xxl lg="4">
          <Form.Label>
            {/* <b>Authorized Person Name</b> */}
            <h5 className={classes.formLabel} >Authorized Person Name &nbsp;</h5>
          </Form.Label>
          <span className={classes.required}>*</span> &nbsp;&nbsp;
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              // placeholder={personalinfo.authorizedPerson}
              placeholder={personalinfo !== null ? personalinfo.authorizedPerson : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.authPersonName
              }}
              onClick={() => {
                setOpennedModal("authPersonName")
                setLabelValue("Authorized Person Name"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedPerson : null);
              }}
            ></ReportProblemIcon>
          </div>
          {/* <Form.Check
          value="Authorized Person Name"
          type="radio"
          id="default-radio"
          // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group1"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Authorized Person Name"
          type="radio"
          id="default-radio"
          // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group1"
          inline
        ></Form.Check> */}
        </Col>
        <Col className="ms-auto" md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Authorized Mobile No</b> */}
              <h5 className={classes.formLabel} >Authorized Mobile No &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
            {/* <ReportProblemIcon style={{ color: warningOrred }} onClick={() => setSmShow(true)}></ReportProblemIcon> */}
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorizedmobile : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.authMobileNo1
              }}
              onClick={() => {
                setOpennedModal("authMobileNo1")
                setLabelValue("Autrhoized Mobile No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedmobile : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>

      {/* <Collapse in={open}>
<div id="example-collapse-text"> */}
      <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Authorized MobileNo. 2 </b> */}
              <h5 className={classes.formLabel} >Authorized Mobile No. 2 &nbsp;</h5>
            </Form.Label>

            <span className={classes.required}>*</span>
          </div>
          {/* <Modal size="sm" show={smShow2} onHide={() => setSmShow2(false)} aria-labelledby="example-modal-sizes-title-sm">
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">Authorized MobileNo. 2</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Form.Check
              value="Developer"
              onChange={(e) => {
                setCrosschecked(""), setNochecked(false), setwarningOrred("#09cb3d");
              }}
              type="radio"
              id="default-radio"
              // label={<CheckCircleIcon color="success"></CheckCircleIcon>}
              label="Yes"
              name="group0"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => {
                setCrosschecked(e.target.value), setNochecked(true), setwarningOrred("#ff0000");
              }}
              value="Developer"
              type="radio"
              id="default-radio"
              // label={<CancelIcon color="error" />}
              label="No"
              name="group0"
              inline
            ></Form.Check>
            <Col xs={8} md={4}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Remarks</Form.Label>
                <Form.Control type="text" placeholder="" autoFocus onChange={(e) => setDeveloperRemarks(e.target.value)} />
              </Form.Group>
            </Col>
            <div class="col-md-4 bg-light text-right" style={{ position: "relative", marginBottom: 40 }}>
              <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
                Submit
              </Button>
            </div>
          </Modal.Body>
        </Modal> */}
          {/* <Form.Check
          value="Authorized Mobile No. 2"
          type="radio"
          id="default-radio"
          // label={<AiFillCheckCircle  class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group3"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Authorized Mobile No. 2"
          type="radio"
          id="default-radio"
          // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group3"
          inline
        ></Form.Check> */}

          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.alternatemobile : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.authMobileNo2  
              }}
              onClick={() => {
                setOpennedModal("authMobileNo2")
                setLabelValue("Authorized MobileNo. 2 "),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.alternatemobile : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>

        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Email ID</b> */}
              <h5 className={classes.formLabel} >Email ID &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          {/* <Form.Check
          value="Email ID"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle  class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group4"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Email ID"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group4"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorizedEmail : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.emailId}}
              onClick={() => {
                setOpennedModal("emailId")
                setLabelValue("Email ID"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedEmail : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>PAN No.</b> */}
              <h5 className={classes.formLabel} >PAN No. &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          {/* <Form.Check
          value="PAN No."
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group5"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="PAN No."
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group5"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorizedPan : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.pan
              }}
              onClick={() => {
                setOpennedModal("pan")
                setLabelValue("PAN No."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedPan : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Address 1</b> */}
              <h5 className={classes.formLabel} >Address 1 &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          {/* <Form.Check
          value="Address 1"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle  class="fa fa-check text-success"size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group6"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Address 1"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger"size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group6"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorizedAddress : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.address}}
              onClick={() => {
                setOpennedModal("address")
                setLabelValue("Address  1"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedAddress : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Village/City</b> */}
              <h5 className={classes.formLabel} >Village/City &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          {/* <Form.Check
          value="Village/City."
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group7"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Village/City."
          type="radio"
          id="default-radio"
           label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group7"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.village : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.city}}
              onClick={() => {
                setOpennedModal("city")
                setLabelValue("Village/City"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.village : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Pincode</b> */}
              <h5 className={classes.formLabel} >Pincode &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          {/* <Form.Check
          value="Pincode"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group8"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Pincode"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group8"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorizedPinCode : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.pin}}
              onClick={() => {
                setOpennedModal("pin")
                setLabelValue("Pincode"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedPinCode : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Tehsil</b>{" "} */}
              <h5 className={classes.formLabel} >Tehsil &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          {/* <Form.Check
          value="Tehsil"
          type="radio"
          id="default-radio"
           label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group9"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Tehsil"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group9"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.tehsil : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.tehsil}}
              onClick={() => {
                setOpennedModal("tehsil")
                setLabelValue("Tehsil"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.tehsil : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>District</b> */}
              <h5 className={classes.formLabel} >District &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          {/* <Form.Check
          value="District"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group10"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="District"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group10"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.district : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.district}}
              onClick={() => {
                setOpennedModal("district")
                setLabelValue("District"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.district : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>State</b> */}
              <h5 className={classes.formLabel} >State &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          {/* <Form.Check
          value="State"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group11"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="State"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group11"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.state : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.state}}
              onClick={() => {
                setOpennedModal("state")
                setLabelValue("State"), setSmShow(true), console.log("modal open"), setFieldValue(personalinfo !== null ? personalinfo.state : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Status (Individual/ Company/ Firm/ LLP etc.)">
              {/* <b>Individual/ Company/ LLP</b> */}
              <h5 className={classes.formLabel} >Individual/ Company/ LLP &nbsp;</h5>
              {/* <InfoIcon /> */}
            </Form.Label>
          </div>
          {/* <Form.Check
          value="Status (Individual/ Company/ Firm/ LLP etc.)"
          type="radio"
          id="default-radio"
          
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group12"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Status (Individual/ Company/ Firm/ LLP etc.)"
          type="radio"
          id="default-radio"
         
          label={<CancelIcon color="error" />}
          name="group12"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.status : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.type }}
              onClick={() => {
                setOpennedModal("type")
                setLabelValue("Status (Individual/ Company/ Firm/ LLP etc.)"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.status : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>LC-I signed by</b>{" "} */}
              <h5 className={classes.formLabel} >LC-I signed by &nbsp;</h5>
            </Form.Label>
          </div>
          {/* <Form.Check
          value="LC-I signed by"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group13"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="LC-I signed by"
          type="radio"
          id="default-radio"
           label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group13"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              // placeholder={personalinfo !== null ? personalinfo.status : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.lciSignedBy }}
              onClick={() => {
                setOpennedModal("lciSignedBy")
                setLabelValue("LC-I signed by"), setSmShow(true), console.log("modal open");
                // setFieldValue(personalinfo !== null ? personalinfo.status : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label
              data-toggle="tooltip"
              data-placement="top"
              title="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
            >
              {/* <b> LC-I is not signed</b> */}
              <h5 className={classes.formLabel} >LC-I is not signed &nbsp;</h5>
              {/* <InfoIcon /> */}
            </Form.Label>
          </div>
          {/* <Form.Check
          value="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
          type="radio"
          id="default-radio"
          label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group14"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
          type="radio"
          id="default-radio"
           label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group14"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.LC : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.lciNotSigned }}
              onClick={() => {
                setOpennedModal("lciNotSigned")
                setLabelValue("If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.LC : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label
              data-toggle="tooltip"
              data-placement="top"
              title="Permanent address in case of individual/ registered office address in case other than individual"
            >
              {/* <b>Permanent Address </b> */}
              <h5 className={classes.formLabel} >Permanent Address &nbsp;</h5>
              {/* <InfoIcon /> */}
            </Form.Label>
          </div>
          {/* <Form.Check
          value="Permanent address in case of individual/ registered office address in case other than individual"
          type="radio"
          id="default-radio"
           label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
          label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          name="group15"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
          value="Permanent address in case of individual/ registered office address in case other than individual"
          type="radio"
          id="default-radio"
          label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
          label={<CancelIcon color="error" />}
          name="group15"
          inline
        ></Form.Check> */}
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.address : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.parmanentAddress }}
              onClick={() => {
                setOpennedModal("parmanentAddress")
                setLabelValue("Permanent address in case of individual/ registered office address in case other than individual"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.address : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Address for communication</b> */}
              <h5 className={classes.formLabel} >Address for communication &nbsp;</h5>
            </Form.Label>
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.permanentAddress : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.addressForCommunication }}
              onClick={() => {
                setOpennedModal("addressForCommunication")
                setLabelValue("Address for communication"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.permanentAddress : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Name of the authorized person to sign the application">
              <h5 className={classes.formLabel} >Authorized person &nbsp;</h5>
            </Form.Label>
          </div>

          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.notSigned : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.authPerson }}
              onClick={() => {
                setOpennedModal("authPerson")
                setLabelValue("Name of the authorized person to sign the application"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.notSigned : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row>
      <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Email ID for communication</b> */}
              <h5 className={classes.formLabel} >Email ID for communication &nbsp;</h5>
            </Form.Label>
          </div>

          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.email : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color: fieldIconColors.emailForCommunication  }}
              onClick={() => {
                setOpennedModal("emailForCommunication")
                setLabelValue("Email ID for communication"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.email : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        {/* <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Name of individual Land owner/ land-owning company/ firm/ LLP etc.">
              
              <h5>individual Land owner &nbsp;</h5>
              
            </Form.Label>
          </div>
         
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorized : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                color:
                  developerInputFiledColor19.length > 0
                    ? developerInputFiledColor19[0].color.data
                    : developerInputCheckedFiledColor19.length > 0
                    ? developerInputCheckedFiledColor19[0].color.data
                    : "#FFB602",
              }}
              onClick={() => {
                setLabelValue("Name of individual Land owner/ land-owning company/ firm/ LLP etc."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorized : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col> */}
      </Row>
    </Form.Group>
  );
};

export default PersonalinfoChild;
