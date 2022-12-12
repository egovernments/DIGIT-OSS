import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

const ResidentialPlottedForm = ({ register }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h6 className="text-black">
          <b>Residential Plotted</b>
        </h6>

        <div className="table table-bordered table-responsive">
          <thead>
            <tr>
              <td>Detail of plots</td>
              <td>No.</td>
              <td>Area</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">
                    NPNL <span style={{ color: "red" }}>*</span>
                  </p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("npnlNo")} />
              </td>
              <td component="th" scope="row">
                <input type="text" className="form-control" {...register("npnlArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">
                    EWS <span style={{ color: "red" }}>*</span>
                  </p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("ewsNo")} />
              </td>
              <td component="th" scope="row">
                <input type="text" className="form-control" {...register("ewsArea")} />
              </td>
            </tr>
          </tbody>
        </div>
      </Col>
    </Row>
  );
};
export default ResidentialPlottedForm;
