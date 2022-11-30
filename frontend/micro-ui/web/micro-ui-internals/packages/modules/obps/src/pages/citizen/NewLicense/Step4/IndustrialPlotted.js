import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

const IndustrialPlottedForm = ({ register }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h5 className="text-black">
          <b>Industrial Plotted</b>
        </h5>

        <div className="table table-bordered table-responsive">
          <thead>
            <tr>
              <td>Detail of plots</td>
              <td>No.</td>
              <td>Area in Acres</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Area of the colony, Up to 50 acres</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("colonyfiftyNo")} />
              </td>
              <td component="th" scope="row">
                <input type="number" className="form-control" {...register("colonyfiftyArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">More than 50 to 200 acres </p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("fiftyToTwoNo")} />
              </td>
              <td component="th" scope="row">
                <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">More than 200 acres </p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("twoHundredNo")} />
              </td>
              <td component="th" scope="row">
                <input type="number" className="form-control" {...register("twoHundredArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Proposed plots under residential component DDJAY </p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("resiNo")} />
              </td>
              <td component="th" scope="row">
                <input type="number" className="form-control" {...register("resiArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Proposed plots under community facilities in DDJAY Area </p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("commerNo")} />
              </td>
              <td component="th" scope="row">
                <input type="number" className="form-control" {...register("commerArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Details of plots for Labour dormitories from affordable Industries Housing component </p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("labourNo")} />
              </td>
              <td component="th" scope="row">
                <input type="number" className="form-control" {...register("labourArea")} />
              </td>
            </tr>
          </tbody>
        </div>
      </Col>
    </Row>
  );
};
export default IndustrialPlottedForm;
