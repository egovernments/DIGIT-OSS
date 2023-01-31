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
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <h2>
                  Max area of plots ( in square meters)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
            <input type="number" className="form-control" {...register("maxAreaPlots")} />
          </Col>
        </Row>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <h2>
                Size of plot ( in square meters)
                <span style={{ color: "red" }}>*</span>
              </h2>
            </div>
            <div>
              <label>Minimum</label>
              <input type="number" className="form-control" {...register("minPlotSize")} />
            </div>
            <div>
              <label>Maximum</label>
              <input type="number" className="form-control" {...register("maxPlotSize")} />
            </div>
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
            <input type="number" className="form-control" {...register("totalNoOfPlots")} />
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
            <input type="number" className="form-control" {...register("permissibleDensityDDJAY")} />
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
            <input type="number" className="form-control" {...register("residentialAndCommercialPlots")} />
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
            <input type="number" className="form-control" {...register("areaUnderResidentialUse")} />
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
            <input type="number" className="form-control" {...register("areaUnderCommercialUse")} />
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
            <input type="number" className="form-control" {...register("widthOfInternalRoads")} />
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
            <input type="number" className="form-control" {...register("AreaUnderOrganizedSpace")} />
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
            <input type="number" className="form-control" {...register("transferredArea")} />
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
