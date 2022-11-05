import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { TextInput } from "@egovernments/digit-ui-react-components";
import { Upload } from "react-bootstrap-icons";

// const data = [];

const ServicePlan = () => {
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
            <div>
              <span className="surveyformfield">
                <label>LOI Number</label>
                <TextInput name="LOINumber" onChange={(e) => setLOCNumber(e.target.value)} type="text" value={LOCNumber} />
              </span>
            </div>
          </Col>
          <Col className="ms-auto" md={4} xxl lg="4">
            <div>
              <div>
                <Form.Label>
                  Is the uploaded Service Plan in accordance to the Standard designs? <span style={{ color: "red" }}>*</span>{" "}
                </Form.Label>
                {/* &nbsp;&nbsp; */}
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="standarDesigns"
                type="radio"
                id="default-radio"
                label="Yes"
                name="standarDesigns"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="standarDesigns"
                type="radio"
                id="default-radio"
                label="No"
                name="standarDesigns"
                inline
              ></Form.Check>
            </div>
          </Col>
          <Col className="ms-auto" md={4} xxl lg="4">
            <div>
              <div>
                <Form.Label>Undertaking</Form.Label>
                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="undertaking"
                type="radio"
                id="default-radio"
                label="Yes"
                name="undertaking"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="undertaking"
                type="radio"
                id="default-radio"
                label="No"
                name="undertaking"
                inline
              ></Form.Check>
            </div>
          </Col>
        </Row>

        <div style={{ magrin: 7 }}>
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
        {/* <input type="file" /> */}
        <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }}>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default ServicePlan;
