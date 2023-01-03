import axios from "axios";
import { size } from "lodash";
import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import FormBank from "../FormBankScrutniy/FormBank";
// import { useSearchParams } from "react-router-dom";
import SubmitNew from "../SubmitNew";

const ScrutinyForm = (props) => {
  return (
    <Card>
      <Row style={{ top: 30, padding: 10 }}>
        <SubmitNew />
      </Row>
      <Row>
        <FormBank />
      </Row>
      <Row style={{ top: 30, padding: "10px 22px" }}>
        <Row>
          <div class="col-md-10 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
            {/* <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChange} name="Submit" onClick={handleshow19}>Submit</Button> */}
          </div>
        </Row>
      </Row>
    </Card>
  );
};

export default ScrutinyForm;
