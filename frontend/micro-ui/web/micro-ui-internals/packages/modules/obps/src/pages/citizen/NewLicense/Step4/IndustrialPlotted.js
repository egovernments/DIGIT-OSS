import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

const IndustrialPlottedForm = ({ register }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h6 className="text-black">
          <b>Industrial Plotted</b>
        </h6>
        <br></br>
        <h6 className="text-black">
          <b>Detail of land use</b>
        </h6>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total area of the Scheme(in acres)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Sector Road & Green Belt(in acres)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Balance area after deducting area under sector road and Green Belt
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under undetermined use (in acres)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Balance area (in acres)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  50% of the Area under Sector Road & Green Belt (in acres)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Net planned area (A+B)(in acres)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Industrial use
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Residential plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Affordable Industrial Housing
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Area under Commercial
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total Saleable Area
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total Residential Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Required EWS Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Total Industrial Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="text" className="form-control" />
          </Col>
        </Row>

        <br></br>
        <h6 className="text-black">
          <b>Documents</b>
        </h6>
        <br></br>
        <div className="row ">
          <div className="col col-3">
            <h6>
              Layout Plan <span style={{ color: "red" }}>*</span>
            </h6>

            <input type="file" className="form-control" accept="application/pdf/jpeg/png" />
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default IndustrialPlottedForm;
