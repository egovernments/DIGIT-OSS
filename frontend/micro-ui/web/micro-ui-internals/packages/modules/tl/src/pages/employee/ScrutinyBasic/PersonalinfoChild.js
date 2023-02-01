import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";

import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import './css/personalInfoChild.style.js'
import { useStyles } from "./css/personalInfoChild.style.js"
import AddIcon from "@mui/icons-material/Add";
// import Table from "react-bootstrap/Table";
import Table from '@mui/material/Table';

import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "./ScrutinyDevelopment/docview.helper";



const PersonalinfoChild = (props) => {


  const classes = useStyles();
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  const hideRemarks = userRoles.some((item)=>item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ" )
  const hideRemarksPatwari = userRoles.some((item)=>item ==="Patwari_HQ")

  // let users = Digit.UserService.getUser();
  // const userRole = users?.info?.roles?.map((e) => e.code) || [];


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
    emailForCommunication: Colors.info,
    authorized : Colors.info,
    developerType: Colors.info,
    Address:Colors.info,
    cin_Number: Colors.info,
    developeremail: Colors.info
    })

  const fieldIdList = [{label:"Developer",key:"developer"},{label:"Authorized Person Name",key:"authPersonName"},{label:"Autrhoized Mobile No",key:"authMobileNo1"},{label:"Alternate MobileNo. 2 ",key:"authMobileNo2"},{label:"Email ID",key:"emailId"},{label:"PAN No.",key:"pan"},{label:"Address  1",key:"address"},{label:"Village/City",key:"city"},{label:"Pincode",key:"pin"},{label:"Tehsil",key:"tehsil"},{label:"District",key:"district"},{label:"State",key:"state"},{label:"Status (Individual/ Company/ Firm/ LLP etc.)",key:"type"},{label:"LC-I signed by",key:"lciSignedBy"},{label:"If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)",key:"lciNotSigned"},{label: "Permanent address in case of individual/ registered office address in case other than individual", key:"parmanentAddress"},{label:"Address for communication",key:"addressForCommunication"},{label:"Name of the authorized person to sign the application",key:"authorized"},{label:"Email ID for communication",key:"emailForCommunication"}, {label:"Developer Type",key:"developerType"},{label:"Address",key:"Address"},{label:"Developer",key:"cin_Number"}, {label:"Email Id",key:"developeremail"} ]





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
       <h5 className="card-title fw-bold" style={{ margin: 10 }}> &nbsp; Developer Information</h5>
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
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.companyName : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            {/* {JSON.stringify(userRoles)} */}
          {/* {JSON.stringify(hideRemarksPatwari)}  */}
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("developer")
                  setLabelValue("Developer"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.companyName : null);
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
          <div>
            <Form.Label>
              <h5 className={classes.formLabel}>Address &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.registeredAddress : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            {/* {JSON.stringify(userRoles)} */}
          {/* {JSON.stringify(hideRemarksPatwari)}  */}
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Address")
                  setLabelValue("Address"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.registeredAddress : null);
              }}
            ></ReportProblemIcon>
          
          </div>
        </Col>
        <Col className="ms-auto" md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h5 className={classes.formLabel}>EmailId &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.email : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            {/* {JSON.stringify(userRoles)} */}
          {/* {JSON.stringify(hideRemarksPatwari)}  */}
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color:fieldIconColors.developeremail}}
              onClick={() => {
                  setOpennedModal("developeremail")
                  setLabelValue("Email Id"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.email: null);
              }}
            ></ReportProblemIcon>
           
          </div>
        </Col>
        </Row>
       
        <Row className={[classes.row,"ms-auto"]} >
        <Col  md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h5 className={classes.formLabel}>Developer Type &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.showDevTypeFields : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            {/* {JSON.stringify(userRoles)} */}
          {/* {JSON.stringify(hideRemarksPatwari)}  */}
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color:fieldIconColors.developerType}}
              onClick={() => {
                  setOpennedModal("developerType")
                  setLabelValue("Developer Type"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.showDevTypeFields  : null);
              }}
            ></ReportProblemIcon>
           
          </div>
        </Col>
        {/* {personalinfo?.devDetail?.addInfo?.showDevTypeFields === "Trust" && 
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h5 className={classes.formLabel}>CSR Number &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.csr_Number : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
          
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color:fieldIconColors.cin_Number}}
              onClick={() => {
                  setOpennedModal("cin_Number")
                  setLabelValue("CIN Number"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.csr_Number : null);
              }}
            ></ReportProblemIcon>
           
          </div>
        </Col>
         } */}
         {personalinfo?.devDetail?.addInfo?.showDevTypeFields === "Company" && 
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h5 className={classes.formLabel}>CSR Number &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.cin_Number : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
          
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color:fieldIconColors.cin_Number}}
              onClick={() => {
                  setOpennedModal("cin_Number")
                  setLabelValue("CIN Number"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.cin_Number : null);
              }}
            ></ReportProblemIcon>
           
          </div>
        </Col>
         }
         {personalinfo?.devDetail?.addInfo?.showDevTypeFields === "Company" && 
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h5 className={classes.formLabel}>CSR Number &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.cin_Number : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
          
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color:fieldIconColors.cin_Number}}
              onClick={() => {
                  setOpennedModal("cin_Number")
                  setLabelValue("CIN Number"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.cin_Number : null);
              }}
            ></ReportProblemIcon>
           
          </div>
        </Col>
         }
       
      </Row>
      {personalinfo?.devDetail?.addInfo?.showDevTypeFields === "Individual"  && 
      // "Limited Liability Partnership"  && "Hindu Undivided Family" && "Partnership Firm" &&  "Proprietorship Firm" &&
                <div>
                  <Card style={{ margin: 5 }}>
                    <h5>Developer Details</h5>
                    <Row>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            
                            <h5 className={classes.formLabel}>Name &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.name : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.name
                            }}
                            onClick={() => {
                              setOpennedModal("developerName")
                              setLabelValue("Developer's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.name : null);
                            }}
                          ></ReportProblemIcon>



                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            
                            <h5 className={classes.formLabel}>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.emailId : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.emailId
                            }}
                            onClick={() => {
                              setOpennedModal("developerEmail")
                              setLabelValue("Developer's Email"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.emailId : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                     
                            <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.mobileNumberUser : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.mobileNumberUser
                            }}
                            onClick={() => {
                              setOpennedModal("developerMobileNo")
                              setLabelValue("Developer's Mobile No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.mobileNumberUser : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                    <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            
                            <h5 className={classes.formLabel}>Date of Birth &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.dob : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.name
                            }}
                            onClick={() => {
                              setOpennedModal("developerName")
                              setLabelValue("Developer's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.dob : null);
                            }}
                          ></ReportProblemIcon>



                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            
                            <h5 className={classes.formLabel}>PAN Number &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.pan : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.name
                            }}
                            onClick={() => {
                              setOpennedModal("developerName")
                              setLabelValue("Developer's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.pan : null);
                            }}
                          ></ReportProblemIcon>



                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            
                            <h5 className={classes.formLabel}>Registered Address &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.registeredAddress : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.name
                            }}
                            onClick={() => {
                              setOpennedModal("developerName")
                              setLabelValue("Developer's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.registeredAddress : null);
                            }}
                          ></ReportProblemIcon>



                        </div>
                      </Col>
                    </Row>
                    <Row>
                    <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            
                            <h5 className={classes.formLabel}>Registered Address &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={personalinfo !== null ? personalinfo?.devDetail?.addInfo?.gst : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.name
                            }}
                            onClick={() => {
                              setOpennedModal("developerName")
                              setLabelValue("Developer's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.addInfo?.gst : null);
                            }}
                          ></ReportProblemIcon>



                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              }
  <br></br>
      {personalinfo?.devDetail?.addInfo?.showDevTypeFields ===  "Company" && 
      <div>
                    <h5 className="card-title fw-bold" > &nbsp; &nbsp;&nbsp; Directors Information</h5>
                <div className="card-body">
                  <div className="table-bd">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>DIN Number</th>
                          <th>Name</th>
                          <th>Contact Number</th>
                          <th>View PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {   personalinfo?.devDetail?.addInfo?.DirectorsInformation?.map((item, index) => (

                            <tr
                            >
                              <td>{index + 1}</td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.contactNumber} disabled></Form.Control>
                              </td>
                              <td>
                                <div className="row">
                                  
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                        {/* );
                            })} */}
                      </tbody>
                    </table>
                  </div>
                  </div>
                  <br></br>

                  <h5 className="card-title fw-bold" > &nbsp; 1. Director Information as per MCA</h5>
                <div className="card-body">
                  <div className="table-bd">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>DIN Number</th>
                          <th>Name</th>
                          <th>Contact Number</th>
                          {/* <th>View PDF</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {   personalinfo?.devDetail?.addInfo?.DirectorsInformation?.map((item, index) => (

                            <tr
                            >
                              <td>{index + 1}</td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.contactNumber} disabled></Form.Control>
                              </td>
                              {/* <td>
                                <div className="row">
                                  
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                                </div>
                              </td> */}
                            </tr>
                          ))
                        }
                        {/* );
                            })} */}
                      </tbody>
                    </table>
                  </div>
                  </div>
                  
                  <h5 className="card-title fw-bold"> &nbsp;&nbsp;&nbsp; Shareholding Patterns</h5>
                  <div className="card-body">
                    <div className="table-bd">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Designition</th>
                            <th>Percentage</th>
                            <th>View PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          { personalinfo?.devDetail?.addInfo?.shareHoldingPatterens?.map((item, index) => (

                              <tr>
                                <td>{item?.serialNumber || index + 1}</td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.designition} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.percentage} disabled></Form.Control>
                                </td>
                                <td>
                                  <div className="row">
                                    {/* <button className="btn btn-sm col-md-6" onClick={()=>getDocShareholding(item?.uploadPdf)} > */}
                                    <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                      </div>
                                    {/* </button> */}
                                    {/* <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <FileDownload color="primary" /> */}
                                      <div className="btn btn-sm col-md-4">
                                      <IconButton onClick={()=>getDocShareholding(item?.uploadPdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-4">
                        <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.pin}}
              onClick={() => {
                setOpennedModal("pin")
                setLabelValue("Pincode"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution: null);
              }}
            ></ReportProblemIcon>
                        </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                    </div>
                    </div>
}
                  {/* </Card> */}

       <h5 className="card-title fw-bold" > &nbsp; &nbsp;&nbsp; Authorized Person Information</h5>
      <Row className={[classes.row,"ms-auto"]}>
         <Col className="ms-auto" md={4} xxl lg="4">
          <Form.Label>
            {/* <b>Authorized Person Name</b> */}
            <h5 className={classes.formLabel} >Name &nbsp;</h5>
          </Form.Label>
          <span className={classes.required}>*</span> &nbsp;&nbsp;
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              // placeholder={personalinfo.authorizedPerson}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.name : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
               
                color: fieldIconColors.authPersonName
              }}
              onClick={() => {
                setOpennedModal("authPersonName")
                setLabelValue("Authorized Person Name"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.name  : null);
              }}
            ></ReportProblemIcon>
          </div>
          
        </Col>
        <Col className="ms-auto" md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Authorized Mobile No</b> */}
              <h5 className={classes.formLabel} >Mobile No.&nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
            {/* <ReportProblemIcon style={{ color: warningOrred }} onClick={() => setSmShow(true)}></ReportProblemIcon> */}
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.mobileNumber : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.authMobileNo1
              }}
              onClick={() => {
                setOpennedModal("authMobileNo1")
                setLabelValue("Autrhoized Mobile No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.mobileNumber : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              {/* <b>Email ID for communication</b> */}
              <h5 className={classes.formLabel} >Emailid for Authorized signatory &nbsp;</h5>
            </Form.Label>
          </div>

          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.emailId : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.emailForCommunication  }}
              onClick={() => {
                setOpennedModal("emailForCommunication")
                setLabelValue("Emailid for Authorized signatory"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.emailId : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        </Row>
        <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
           
              <h5 className={classes.formLabel} >Pan No. &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.pan : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.pan
              }}
              onClick={() => {
                setOpennedModal("pan")
                setLabelValue("Pan No."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.pan : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
             
              <h5 className={classes.formLabel} >Digital Signature &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          
          <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.village : null}
              disabled
            ></Form.Control> */}
            {/* <div className="row"> */}
                                  
                                  <div className="btn btn-sm col-md-2">
                                    <IconButton onClick={()=>getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  
                                  </div>
                                  <div className="btn btn-sm col-md-5">
                                    <IconButton onClick={()=>getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-5" >
                        <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.city}}
              onClick={() => {
                setOpennedModal("city")
                setLabelValue("Village/City"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf : null);
              }}
            ></ReportProblemIcon>
                        </div>
                                </div>

            
          {/* </div> */}
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
           
              <h5 className={classes.formLabel} >Board Resolution &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
         
          <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf : null}
              disabled
            ></Form.Control> */}
            {/* <div className="row"> */}
                                  
                                  <div className="btn btn-sm col-md-2">
                                    <IconButton onClick={()=>getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  
                                  </div>
                                  <div className="btn btn-sm col-md-5">
                                    <IconButton onClick={()=>getDocShareholding(personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                        <div className="btn btn-sm col-md-5">
                        <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.pin}}
              onClick={() => {
                setOpennedModal("pin")
                setLabelValue("Pincode"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo?.devDetail?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution: null);
              }}
            ></ReportProblemIcon>
                        </div>
                                {/* </div> */}
      
          </div>
        </Col>
        {/* <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
             
              <h5 className={classes.formLabel} >Address 1 &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
         
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.authorizedAddress : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
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
        </Col> */}
      </Row>
      {/* <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              
              <h5 className={classes.formLabel} >Tehsil &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
         <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.tehsil : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
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
              
              <h5 className={classes.formLabel} >District &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.district : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
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
        
              <h5 className={classes.formLabel} >State &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span>
          </div>
        
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.state : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.state}}
              onClick={() => {
                setOpennedModal("state")
                setLabelValue("State"), setSmShow(true), console.log("modal open"), setFieldValue(personalinfo !== null ? personalinfo.state : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      </Row> */}
      {/* <Row className={[classes.row,"ms-auto"]}>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label data-toggle="tooltip" data-placement="top" title="Status (Individual/ Company/ Firm/ LLP etc.)">
   
              <h5 className={classes.formLabel} >Individual/ Company/ LLP &nbsp;</h5>
            
            </Form.Label>
          </div>
          
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.status : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks?"none":"block",
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
       
              <h5 className={classes.formLabel} >LC-I signed by &nbsp;</h5>
            </Form.Label>
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.LC : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.lciSignedBy }}
              onClick={() => {
                setOpennedModal("lciSignedBy")
                setLabelValue("LC-I signed by"), setSmShow(true), console.log("modal open");
               
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              
              <h5 className={classes.formLabel} >Address for communication &nbsp;</h5>
            </Form.Label>
          </div>
          <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder={personalinfo !== null ? personalinfo.address : null}
              disabled
            ></Form.Control>
            &nbsp;&nbsp;
            <ReportProblemIcon
              style={{
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.addressForCommunication }}
              onClick={() => {
                setOpennedModal("addressForCommunication")
                setLabelValue("Address for communication"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.address : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
       <Col md={4} xxl lg="4">
          <div>
            <Form.Label
              data-toggle="tooltip"
              data-placement="top"
              title="Permanent address in case of individual/ registered office address in case other than individual"
            >
            
              <h5 className={classes.formLabel} >Permanent Address/registered</h5>
            
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
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
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
            <Form.Label data-toggle="tooltip" data-placement="top" title="Name of the authorized person to sign the application">
              <h5 className={classes.formLabel} >Name of Authorized person</h5>
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
                display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                color: fieldIconColors.authorized }}
              onClick={() => {
                setOpennedModal("authPerson")
                setLabelValue("Name of the authorized person to sign the application"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorized : null);
              }}
            ></ReportProblemIcon>
          </div>
        </Col>
      
      </Row> */}
    </Form.Group>
  );
};

export default PersonalinfoChild;