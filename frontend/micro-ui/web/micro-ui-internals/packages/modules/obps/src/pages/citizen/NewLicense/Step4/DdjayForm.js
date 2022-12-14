import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

const DDJAYForm = ({ register, watch }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h5 className="text-black">
          <b>Deen Dayal Jan Awas Yojna (DDJAY)</b>
        </h5>

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
                    Details of frozen plots (50%) <span style={{ color: "red" }}>*</span>
                  </p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("frozenNo")} />
              </td>
              <td component="th" scope="row">
                <input type="number" className="form-control" {...register("frozenArea")} />
              </td>
            </tr>
          </tbody>
        </div>

        <br></br>
        <div className="row">
          <div className="col col-12">
            <h6>
              {" "}
              Whether one organizes open space/pocket of min area 0.3 acre proposed in the layout plan (Yes/No){" "}
              <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
              <input type="radio" value="Y" id="Yes" {...register("organize")} name="Yes" />
              &nbsp;&nbsp;
              <label className="m-0  mx-2" for="Yes">
                Yes
              </label>
              &nbsp;&nbsp;
              <input type="radio" value="N" id="No" {...register("organize")} name="Yes" />
              &nbsp;&nbsp;
              <label className="m-0 mx-2" for="No">
                No
              </label>
            </h6>
            {watch("organizeSpace") === "Y" && (
              <div className="row ">
                <div className="col col-6">
                  <label>Area of such Pocket (in acres)</label>
                  <input type="text" className="form-control" {...register("organizeArea")} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default DDJAYForm;
