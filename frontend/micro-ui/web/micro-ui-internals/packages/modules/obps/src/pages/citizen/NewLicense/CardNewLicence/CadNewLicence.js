import { CardActions } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";

const CardNewLicence = (props) => {
  return (
    <form>
      <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px", border: "5px solid #1266af" }}>
        <Row>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/tab">New Licence Application</a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/renewalClu">Renewal of Licence</a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              {" "}
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/ZoningPlan">Demarcation-cum-zoning plan</a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>Building Plan for Low/Medium/High risk category</h2>
            </Card>
          </div>
        </Row>
        <Row>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              {" "}
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/LayoutPlanClu">Revised layout Plan</a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>Revalidation of BPL</h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>Occupation Certficate</h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              {" "}
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/Beneficial">Change in Beneficial Interest</a>
              </h2>
            </Card>
          </div>
        </Row>
        <Row>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              {" "}
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/TransferLicense">Transfer Licence</a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              {" "}
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/SurrenderLic">Surreder Licence </a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>
                {" "}
                <a href="/digit-ui/citizen/obps/CompositionClu">Compositions of Urban Area Violation </a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              {" "}
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/Standard">Approval of standard designs</a>
              </h2>
            </Card>
          </div>
        </Row>
        <Row>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              {" "}
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/ExtensionCom"> Extension of time for construction of community sites </a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/bank"> Bank Guarantee</a>{" "}
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/servicePlan">Service Plan</a>
              </h2>
            </Card>
          </div>
          <div className="col col-3">
            <Card style={{ height: "85px", marginTop: "40px", borderLeft: "2px solid #1266af" }}>
              <h2 style={{ textAlign: "center" }}>
                <a href="/digit-ui/citizen/obps/electricalPlan">Electrical Plan</a>
              </h2>
            </Card>
          </div>
        </Row>
      </Card>
    </form>
  );
};

export default CardNewLicence;
