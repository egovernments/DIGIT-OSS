import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { TextInput } from "@egovernments/digit-ui-react-components";

const ElectricalPlan = () => {
  const [LOCNumber, setLOCNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data===", LOCNumber);
  };
  return (
    <div style={{ marginTop: 50 }}>
      <div>
        <form onSubmit={handleSubmit}>
          <span className="surveyformfield">
            <label>LOC Number</label>
            <TextInput name="LOINumber" onChange={(e) => setLOCNumber(e.target.value)} type="text" value={LOCNumber} />
          </span>
          <div>
            <div>
              <Form.Label>
                <b>Electrical infrastructure sufficient to cater for the electrical need of the project area</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="electricalInfrastructure"
              type="radio"
              id="default-radio"
              label="Yes"
              name="electricalInfrastructure"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="electricalInfrastructure"
              type="radio"
              id="default-radio"
              label="No"
              name="electricalInfrastructure"
              inline
            ></Form.Check>
          </div>
          <div>
            <div>
              <Form.Label>
                <b>Provision of the electricity distribution in the project area by the instructions of the DHBVN</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="electricityDistribution"
              type="radio"
              id="default-radio"
              label="Yes"
              name="electricityDistribution"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="electricityDistribution"
              type="radio"
              id="default-radio"
              label="No"
              name="electricityDistribution"
              inline
            ></Form.Check>
          </div>
          <div>
            <div>
              <Form.Label>
                <b>The capacity of the proposed electrical substation as per the requirement</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="proposedElectricalSubstation"
              type="radio"
              id="default-radio"
              label="Yes"
              name="proposedElectricalSubstation"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="proposedElectricalSubstation"
              type="radio"
              id="default-radio"
              label="No"
              name="proposedElectricalSubstation"
              inline
            ></Form.Check>
          </div>
          <div>
            <div>
              <Form.Label>
                <b>Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="switchingStation"
              type="radio"
              id="default-radio"
              label="Yes"
              name="switchingStation"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="switchingStation"
              type="radio"
              id="default-radio"
              label="No"
              name="switchingStation"
              inline
            ></Form.Check>
          </div>
          <div>
            <div>
              <Form.Label>
                <b>Load sanction approval as per the requirement</b>
              </Form.Label>
              <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
            </div>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="LoadSanctionApproval"
              type="radio"
              id="default-radio"
              label="Yes"
              name="LoadSanctionApproval"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => console.log(e)}
              value="LoadSanctionApproval"
              type="radio"
              id="default-radio"
              label="No"
              name="LoadSanctionApproval"
              inline
            ></Form.Check>
          </div>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
};

export default ElectricalPlan;
