import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";

const DDJAYForm = ({ register, watch }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h6 className="text-black">
          <b>Deen Dayal Jan Awas Yojna (DDJAY)</b>
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
                  Total area of the Scheme
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
                  Area under Sector Road & Green Belt
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
                  Area under undetermined use=
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
                  Balance area
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
                  50% of the Area under Sector Road & Green Belt
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
                  Net planned area (A+B)
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
                  Max area of plots ( in square meters)
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
                  Size of plot ( in square meters)
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
                  Total Nos. of Plots
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
                  Permissible density
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
                  Residential Plots & Commercial Plots
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
                  Area under Residential Use
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
                  Area under Commercial Use
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
                  Width of Internal roads in the colony (in meters)
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
                  Area under organized Open Space (in acres)
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
              <label>
                <h2
                  data-toggle="tooltip"
                  data-placement="top"
                  title="The owner will transfer 10% area of the licenced colony free of cost to the Government for provision of community facilities. "
                >
                  Area Transferred to Government for community facilities.
                </h2>
              </label>
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

export default DDJAYForm;
