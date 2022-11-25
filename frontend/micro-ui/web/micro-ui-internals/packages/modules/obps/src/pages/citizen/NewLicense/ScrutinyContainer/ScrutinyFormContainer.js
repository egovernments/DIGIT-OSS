import { size } from "lodash";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
// import { commoncolor, primarycolor } from "../../constants";
import ScrutitnyForms from "../ScrutinyBasic/ScutinyBasic";

const ScrutinyFormcontainer = (props) => {
  const [ApplicantFormshow, SetApplicantForm] = useState(true);
  const [PurposeFormshow, SetPurposeForm] = useState(false);
  const [LandScheduleFormshow, SetLandScheduleForm] = useState(false);
  const [AppliedDetailsFormshow, SetAppliedDetailsForm] = useState(false);
  const [FeesChargesFormshow, SetFeesChargesForm] = useState(false);

  const PuposeformHandler = (data) => {
    SetLandScheduleForm(data);
    SetPurposeForm(false);
  };

  const ApllicantFormHandler = (data) => {
    SetPurposeForm(data);
    SetApplicantForm(false);
  };
  const LandFormHandler = (data) => {
    SetAppliedDetailsForm(data);
    SetLandScheduleForm(false);
  };
  const AppliedDetailFormHandler = (data) => {
    SetFeesChargesForm(data);
    SetAppliedDetailsForm(false);
  };
  const FeesChargesFormHandler = (data) => {
    SetFeesChargesForm(false);
  };
  const [showhide19, setShowhide19] = useState("true");
  const handleshow19 = (e) => {
    const getshow = e.target.value;
    setShowhide19(getshow);
  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
 

  return (
    <Card>
      <Row style={{ top: 25, padding: 5 }}>
        <div className="ml-auto">
          <h2>Application : 181</h2>
        </div>
      </Row>
      <Row style={{ top: 30, padding: 10 }}>
        <ScrutitnyForms></ScrutitnyForms>
      </Row>
      <Row style={{ top: 30, padding: "10px 22px" }}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Card>
            <Card.Header style={{ fontSize: "17px", lineHeight: "18px", margin: "0px 15px" }}>
              <Card.Title className="m-0" style={{ fontFamily: "Roboto", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Summary</Card.Title>
            </Card.Header>
            <Col xs={12} md={12}>
              <Form.Label style={{ margin: 5 }}></Form.Label>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                placeholder="Enter the Final Comments"
                autoFocus
                // onChange={(e) => {
                //   setDeveloperRemarks({ data: e.target.value });

                // }}
                rows="3"
              />
            </Col>
          </Card>
          {/* <div class="card">
            <h5 class="card-header">Featured</h5>
            <div class="card-body">
              <h5 class="card-title">Special title treatment</h5>
              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
              <a href="#" class="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div> */}
        </Form.Group>
        {/* <div class="col-md-6 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }}>Submit</Button>
        </div> */}
        <Row>
          <div class="col-md-2 bg-light text-left" style={{ position: "relative", marginBottom: 30 }}>
            <Button style={{ textAlign: "right" }}>Attach Documents</Button>
           
          </div>
          <div class="col-md-10 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChange} name="Submit" onClick={handleshow19}>Submit</Button>
            </div>
          
        </Row>
        <Row>
          
          <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          {/* <Button style={{ textAlign: "right" }}> <a href="http://localhost:3000/digit-ui/citizen/obps/Loi" >Generate LOI</a></Button> */}
          {/* <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow19} /> */}
          </div>
          {showhide19 === "Submit" && (
                     <div>
                       <Button style={{ textAlign: "right" }}> <a href="http://localhost:3000/digit-ui/citizen/obps/Loi" >Generate LOI</a></Button>
                     </div>
                        )}
                        
                    
        </Row>
      </Row>
    </Card>
  );
};

export default ScrutinyFormcontainer;
