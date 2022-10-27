import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
// import Alert from "react-bootstrap/Alert";
import ToggleButton from "react-toggle-button";

import Collapse from "react-bootstrap/Collapse";

const AddInfoScrutiny = (props) => {
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [open, setOpen] = useState(false);
  const [messege, setMessege] = useState("");
  const [developerLabel, setDeveloperLabel] = useState(true);
  console.log(uncheckedValue);
  return (
    <Form
      ref={props.personalInfoRef}
      // style={{
      //   width: "100%",
      //   height: props.heightPersonal,
      //   overflow: "hidden",
      //   marginBottom: 20,
      //   borderColor: "#C3C3C3",
      //   borderStyle: "solid",
      //   borderWidth: 2,
      // }}
    >
      {/* <Alert variant="warning">{messege}</Alert> */}
      <div>
        <Col class="col-12">
          <Button
            style={{
              marginBottom: 3,
              width: "100%",
              textAlign: "inherit",
              padding: "0.25rem 1rem",
              fontWeight: "Bold",
              backgroundColor: "#c2c4c7",
              border: "none",
              color: "unset",
            }}
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            Add Info
            <AddIcon style={{ width: "70.8em" }}></AddIcon>
          </Button>
        </Col>
      </div>

      {/* <div style={{ width:"100%" , height:40, padding:2,}}>
    <Button onClick={() =>props.Personalinfo({data:true})} style={{ width:"100%" , height:"100%"}}>Step-1</Button>
    </div> */}
      {/* <Card
        style={{
          width: "100%",
          height: props.heightPersonal,
          overflow: "hidden",
          marginBottom: 20,
          borderColor: "#C3C3C3",
          borderStyle: "solid",
          borderWidth: 2,
          padding: 2,
        }}
      > */}
      <Collapse in={open}>
        <div id="example-collapse-text">
          <Form.Group style={{ display: props.displayPersonal }} className="justify-content-center">
            <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col className="ms-auto" md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Applicant Nane</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </div>
                <div
                // style={{ display: "flex" }}
                >
                  <Form.Control height={25} style={{ maxWidth: 120, marginRight: 5 }} readOnly></Form.Control>
                  <BootstrapSwitchButton
                    checked={true}
                    onlabel="Yes"
                    offlabel="No"
                    onstyle="success"
                    offstyle="danger"
                    width={30}
                    padding={5}
                    height={10}
                    onChange={(e) => {
                      console.log(e);
                      !e && uncheckedValue.indexOf("Developer") === -1
                        ? setUncheckedVlue((prev) => [...prev, "Developer"])
                        : setUncheckedVlue((prev) => prev.filter((elm) => elm !== "Developer"));
                    }}
                  />
                  {/* <ToggleButton type="radio"></ToggleButton> */}
                </div>

                {/* <Form.Check
                  value="Developer"
                  type="radio"
                  id="default-radio"
                  
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group0"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Developer"
                  type="radio"
                  id="default-radio"
                 
                  label={<CancelIcon color="error" />}
                  name="group0"
                  inline
                ></Form.Check> */}

                {/* <div class="custom-control custom-switch">
                  <input type="checkbox" class="custom-control-input" id="customSwitches" />
                  <label class="custom-control-label" for="customSwitches"></label>
                </div>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider"></span>
                </label>
                <div class="checkbox">
                  <label>
                    <input type="checkbox" data-toggle="toggle" />
                    Option one is enabled
                  </label>
                </div> */}
              </Col>
              <Col className="ms-auto" md={4} xxl lg="3">
                <Form.Label>
                  <b>Gender</b>
                </Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                <Form.Check
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
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col className="ms-auto" md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Mobile Number</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </div>
                <Form.Check
                  value="Authorized Mobile No"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group2"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Authorized Mobile No"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group2"
                  inline
                ></Form.Check>

                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>

              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Enter Date of Birth</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
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
                ></Form.Check>

                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
            </Row>
            {/* <Collapse in={open}>
          <div id="example-collapse-text"> */}
            <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Email</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
                  value="Email ID"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle  class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group4"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Email ID"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group4"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>PAN Number</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
                  value="PAN No."
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group5"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="PAN No."
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group5"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Door/House No. </b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
                  value="Address 1"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle  class="fa fa-check text-success"size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group6"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Address 1"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger"size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group6"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Building/Colony Name</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
                  value="Village/City."
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group7"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Village/City."
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group7"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
            </Row>
            <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Street Name</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
                  value="Pincode"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group8"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Pincode"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group8"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Tehsil</b>{" "}
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
                  value="Tehsil"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group9"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Tehsil"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group9"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>District</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
                  value="District"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group10"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="District"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group10"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>State</b>
                  </Form.Label>
                  <span style={{ color: "red" }}>*</span>
                </div>
                <Form.Check
                  value="State"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group11"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="State"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group11"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
            </Row>
            <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Status (Individual/ Company/ Firm/ LLP etc.)</b>
                  </Form.Label>
                </div>
                <Form.Check
                  value="Status (Individual/ Company/ Firm/ LLP etc.)"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group12"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Status (Individual/ Company/ Firm/ LLP etc.)"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group12"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>LC-I signed by</b>{" "}
                  </Form.Label>
                </div>
                <Form.Check
                  value="LC-I signed by"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group13"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="LC-I signed by"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group13"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)</b>
                  </Form.Label>
                </div>
                <Form.Check
                  value="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group14"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group14"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Permanent address in case of individual/ registered office address in case other than individual</b>
                  </Form.Label>
                </div>
                <Form.Check
                  value="Permanent address in case of individual/ registered office address in case other than individual"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group15"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Permanent address in case of individual/ registered office address in case other than individual"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group15"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
            </Row>
            <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Address for communication</b>
                  </Form.Label>
                </div>
                <Form.Check
                  value="Address for communication"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group16"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Address for communication"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group16"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Name of the authorized person to sign the application</b>{" "}
                  </Form.Label>
                </div>
                <Form.Check
                  value="Name of the authorized person to sign the application"
                  type="radio"
                  id="default-radio"
                  // label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group17"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Name of the authorized person to sign the application"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group17"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Email ID for communication</b>
                  </Form.Label>
                </div>
                <Form.Check
                  value="Email ID for communication"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCheckCircle class="fa fa-check text-success" size={18}></AiFillCheckCircle>}
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group18"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Email ID for communication"
                  type="radio"
                  id="default-radio"
                  //  label={<AiFillCloseCircle class="fa fa-times text-danger" size={18}></AiFillCloseCircle>}
                  label={<CancelIcon color="error" />}
                  name="group18"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Name of individual Land owner/ land-owning company/ firm/ LLP etc.</b>
                  </Form.Label>
                </div>
                <Form.Check
                  value="Name of individual Land owner/ land-owning company/ firm/ LLP etc."
                  type="radio"
                  id="default-radio"
                  label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                  name="group19"
                  inline
                ></Form.Check>
                <Form.Check
                  onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                  value="Name of individual Land owner/ land-owning company/ firm/ LLP etc."
                  type="radio"
                  id="default-radio"
                  label={<CancelIcon color="error" />}
                  name="group19"
                  inline
                ></Form.Check>
                <Form.Control style={{ maxWidth: 200, marginTop: 10 }} readOnly></Form.Control>
              </Col>
            </Row>
            {/* </div>
        </Collapse> */}
          </Form.Group>
          <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 40 }}>
            <Button
              style={{ textAlign: "right" }}
              onClick={() => {
                console.log("here");
                props.passUncheckedList({ data: uncheckedValue });
              }}
            >
              Submit
            </Button>
          </div>
          <hr></hr>
          {/* </Card> */}
        </div>
      </Collapse>
    </Form>
  );
};

export default AddInfoScrutiny;
