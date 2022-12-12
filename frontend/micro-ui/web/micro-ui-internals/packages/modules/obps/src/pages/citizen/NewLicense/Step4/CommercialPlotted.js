import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";

const CommercialPlottedForm = ({ register }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h5 className="text-black">
          <b>
            Commercial Plotted <span style={{ color: "red" }}>*</span>
          </b>
        </h5>
        <br></br>
        <div className="col col-12">
          <h6>
            Number of Plots/SCOs (saleable area) &nbsp;&nbsp;
            <input type="radio" value="Y" id="Yes" {...register("noOfPlotsSealableOneFifty")} name="Yes" />
            &nbsp;&nbsp;
            <label className="m-0  mx-2" for="Yes">
              150%
            </label>
            &nbsp;&nbsp;
            <input type="radio" value="N" id="No" {...register("noOfPlotsSealableOneSeventyfive")} name="Yes" />
            &nbsp;&nbsp;
            <label className="m-0 mx-2" for="No">
              175%
            </label>
          </h6>
        </div>
        <br></br>
        <div>
          <h6>
            {" "}
            Total FAR has been availed <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
          </h6>
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
                    <p className="mb-2">
                      SCOs <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("scoPlotno")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("scoLength")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("scoWidth")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("scoArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("scoSimilarShape")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">
                      Booths <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("boothPlotno")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("boothLength")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("boothWidth")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("boothArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("boothSimilarShape")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">
                      Public Utilities <span style={{ color: "red" }}>*</span>
                    </p>
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
                    <p className="mb-2">
                      STP <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("stpPlotno")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("stpLength")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("stpWidth")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("stpArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("stpSimilarShape")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">
                      WTP <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("wtpPlotno")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("wtpLength")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("wtpWidth")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("wtpArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("wtpSimilarShape")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">
                      UGT <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("ugtPlotno")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("ugtLength")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("ugtWidth")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("ugtArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("ugtSimilarShape")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">
                      Milk booth <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("milkPlotno")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("milkLength")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("milkWidth")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("milkArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("milkSimilarShape")} />
                </td>
              </tr>
              <tr>
                <td>
                  <div className="px-2">
                    <p className="mb-2">
                      GSS <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("gssPlotno")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("gssLength")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("gssWidth")} />
                </td>
                <td align="right">
                  {" "}
                  <input type="number" className="form-control" {...register("gssArea")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("gssSimilarShape")} />
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
                    <p className="mb-2">
                      SCOs, booths etc <span style={{ color: "red" }}>*</span>
                    </p>
                  </div>
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("etcDim")} />
                </td>
                <td component="th" scope="row">
                  <input type="number" className="form-control" {...register("etcArea")} />
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
