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
        <br></br>
        <h6 className="text-black">
          <b>Detail of land use</b>
        </h6>
        <div className="table table-bordered table-responsive">
          <thead>
            <tr>
              <td>Total area of the Scheme</td>
              <td>
                <input type="number" className="form-control" {...register("totalAreaScheme")} />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Area under Sector Road & Green Belt</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("areaUnderSectorRoad")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Balance area after deducting area under sector road and Green Belt</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input disabled type="number" className="form-control" {...register("balanceAreaAfterDeduction")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Area under undetermined use</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("areaUnderUndetermined")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Area under G.H. = 10% of the total area of the scheme</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("areaUnderGH")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Balance area</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("balanceArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">50% of the Area under Sector Road & Green Belt</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("areaUnderSectorAndGreenBelt")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Net planned area (A+B)</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("netPlannedArea")} />
              </td>
            </tr>
          </tbody>
        </div>

        <br></br>
        <h6 className="text-black">
          <b>Detail of the Plots</b>
        </h6>
        <div className="table table-bordered table-responsive">
          <tbody>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Total no’s of plots</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("totalNumberOfPlots")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">General Plots (55%)</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("generalPlots")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Required NPNL plots (25 %)</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("requiredNPNLPlots")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Required EWS plots (20%)</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("requiredEWSPlots")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Permissible density</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("permissibleDensity")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Permissible Commercial Area</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("permissibleCommercialArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Under Plot</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("underPlot")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Commercial</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("commercial")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Permissible saleable area</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("permissibleSaleableArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Required green area on applied land</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("requiredGreenArea")} />
              </td>
            </tr>
          </tbody>
        </div>

        <br></br>
        <h6 className="text-black">
          <b>Detail of Community sites.</b>
        </h6>
        <div className="table table-bordered table-responsive">
          <tbody>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Name of Community sites</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("communitySites")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Provided</p>
                </div>
              </td>
              <td align="right">
                {" "}
                <input type="number" className="form-control" {...register("provided")} />
              </td>
            </tr>
          </tbody>
        </div>

        <br></br>
        <h6 className="text-black">
          <b>Documents</b>
        </h6>
        <div className="row ">
          <div className="col col-3">
            <label>
              <h2>Layout Plan</h2>
            </label>
            <input type="file" className="form-control" {...register("layoutPlan")} />
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default ResidentialPlottedForm;
