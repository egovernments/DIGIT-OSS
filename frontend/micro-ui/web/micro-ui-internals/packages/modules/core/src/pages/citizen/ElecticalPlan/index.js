import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { TextInput } from "@egovernments/digit-ui-react-components";
import { Upload } from "react-bootstrap-icons";

const ElectricalPlan = () => {
  const [LOCNumber, setLOCNumber] = useState("");
  const [getData, setData] = useState([
    { name: "Self-certified drawings from empanelled/certified architects that conform to the standard approved template", image: null },
    { name: "Environmental Clearance", image: null },
    { name: "PDF (OCR Compatible) + GIS format (shapefile as per the template uploaded on the department website)", image: null },
    { name: "AutoCAD (DXF) file", image: null },
    { name: "Environmental Clearance", image: null },
    { name: "Certified copy of the plan verified by a third party", image: null },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data===", LOCNumber);
  };
  return (
    <div className="card" style={{ marginTop: 50 }}>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col className="ms-auto" md={4} xxl lg="4">
            <span className="surveyformfield">
              <label>LOI Number</label>
              <TextInput name="LOINumber" onChange={(e) => setLOCNumber(e.target.value)} type="text" value={LOCNumber} />
            </span>
          </Col>
          <Col className="ms-auto" md={4} xxl lg="4">
            <div>
              <Form.Label>
                Electrical infrastructure sufficient to cater for the electrical need of the project area <span style={{ color: "red" }}>*</span>{" "}
                &nbsp;&nbsp;
              </Form.Label>

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
          </Col>
          <Col className="ms-auto" md={4} xxl lg="4">
            <div>
              <Form.Label>
                Provision of the electricity distribution in the project area by the instructions of the DHBVN <span style={{ color: "red" }}>*</span>{" "}
                &nbsp;&nbsp;
              </Form.Label>
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
          </Col>
          <Col className="ms-auto" md={4} xxl lg="4">
            <div>
              <Form.Label>
                The capacity of the proposed electrical substation as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </Form.Label>
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
          </Col>
          <Col className="ms-auto" md={4} xxl lg="4">
            <div>
              <Form.Label>
                Provision of 33 Kv switching station for the electrical infrastructure as per the approved layout plan
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </Form.Label>
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
          </Col>
          <Col className="ms-auto" md={4} xxl lg="4">
            <div>
              <Form.Label>
                Load sanction approval as per the requirement <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </Form.Label>
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
          </Col>
          <Col className="ms-auto" md={4} xxl lg="4"></Col>
        </Row>
        {/* <div>
           
            
          </div>
          <div>
           
          </div>
          <div>
           
          </div>
          <div>
           
          </div>
          <div>
           
          </div> */}
        <div>
          <table>
            <tr>
              <th class="fw-normal" style={{ magrin: 5, textAlign: "center" }}>
                Sr. No.
              </th>
              <th class="fw-normal" style={{ magrin: 5, textAlign: "center" }}>
                Type Of Map/Plan
              </th>
              <th class="fw-normal" style={{ magrin: 5, textAlign: "center" }}>
                Annexure
              </th>
            </tr>
            {getData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.name}</td>
                  <td style={{ magrin: 5, textAlign: "center" }}>
                    <div class="mainWrapper">
                      <div class="btnimg">
                        <Upload class="text-success" />
                      </div>
                      <input
                        type="file"
                        name="file"
                        onChange={(e) => {
                          setData(
                            getData?.map((tag, indi) => {
                              return indi === index ? { ...tag, image: e.target.files[0] } : { ...tag };
                            })
                          );
                        }}
                      />
                      {item?.image?.name}
                    </div>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
        <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }}>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default ElectricalPlan;
