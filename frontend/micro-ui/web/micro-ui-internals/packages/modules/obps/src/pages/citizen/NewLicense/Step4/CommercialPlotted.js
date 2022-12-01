import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

const CommercialPlottedForm = ({ register }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h5 className="text-black">
          <b>Commercial Plotted</b>
        </h5>
        <br></br>
        <div className="col col-12">
          <h6>
            Number of Plots/SCOs (saleable area) &nbsp;&nbsp;
            <input type="radio" value="Y" id="Yes" {...register("farAvailed")} name="Yes" />
            &nbsp;&nbsp;
            <label className="m-0  mx-2" for="Yes">
              150%
            </label>
            &nbsp;&nbsp;
            <input type="radio" value="N" id="No" {...register("farAvailed")} name="Yes" />
            &nbsp;&nbsp;
            <label className="m-0 mx-2" for="No">
              175%
            </label>
          </h6>
        </div>
        <br></br>
        <div>
          <h6> Total FAR has been availed &nbsp;&nbsp;</h6>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <td>Type of plots</td>
                <td>Plot No.</td>
                <td>Length in mtr</td>
                <td>Width in mtr</td>
                <td>Area in sqm</td>
                <td>Similar shape/size plots</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">SCOs</p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("colonyfiftyNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("colonyfiftyArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("colonyfiftyArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("colonyfiftyArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("colonyfiftyArea")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">Booths </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("fiftyToTwoNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">Public Utilities </p>
                  </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">STP </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("resiNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("resiArea")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("resiNo")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("resiNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">WTP </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("commerNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("commerArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("commerArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("commerArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">UGT </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("labourArea")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">Milk booth </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("labourArea")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">GSS</p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("labourArea")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("labourNo")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <div className="px-2">
                    <p className="mb-2">Irregular size SCOs</p>
                  </div>
                </td>
                <td align="right">
                  <div className="px-2">
                    <p className="mb-2">Dimensions in mtr </p>
                  </div>
                </td>
                <td align="right">
                  <div className="px-2">
                    <p className="mb-2">Area manually entered </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={4}>
                  <div className="px-2">
                    <p className="mb-2">SCOs, booths etc </p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("fiftyToTwoArea")} />
                </td>
              </tr>
            </tbody>
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default CommercialPlottedForm;
