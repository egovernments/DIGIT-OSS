import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import NumberInput from "../../../../components/NumberInput";

const ResidentialPlottedForm = ({ register, getDocumentData, watch, getDocShareholding, setValue, control }) => {
  const [error, setError] = useState({});

  useEffect(() => {
    console.log("error", error);
  }, [error]);

  const handleWheel = (e) => e.target.blur();

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

        {/* <NumberFormat customInput={TextField} thousandSeparator={false} allowNegative={false} decimalScale={0}  /> */}

        <div className="table table-bordered table-responsive">
          <thead>
            <tr>
              <td>Total area of the Scheme</td>
              <td>
                <NumberInput disabled control={control} name="totalAreaScheme" customInput={TextField} />
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
                <input
                  type="number"
                  className="form-control"
                  {...register("areaUnderSectorRoad")}
                  onWheel={handleWheel}
                  onChange={(e) => {
                    if (e?.target?.value?.length) {
                      setValue("balanceAreaAfterDeduction", watch("totalAreaScheme") - e?.target?.value)?.toFixed(3);
                      setValue("areaUnderSectorAndGreenBelt", (e?.target?.value * 50) / 100);
                    } else {
                      setValue("balanceAreaAfterDeduction", "");
                      setValue("balanceArea", "");
                      setValue("areaUnderSectorAndGreenBelt", "");
                      setValue("netPlannedArea", "");
                      setValue("areaUnderUndetermined", "");
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Balance area after deducting area under sector road and Green Belt</p>
                </div>
              </td>
              <td align="right">
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
                <input
                  type="number"
                  className="form-control"
                  {...register("areaUnderUndetermined")}
                  onWheel={handleWheel}
                  onChange={(e) => {
                    if (e?.target?.value?.length) {
                      setValue("balanceArea", watch("balanceAreaAfterDeduction") - e?.target?.value)?.toFixed(3);
                      setValue("netPlannedArea", watch("balanceAreaAfterDeduction") - e?.target?.value + watch("areaUnderSectorAndGreenBelt"));
                    } else {
                      setValue("balanceArea", "");
                      setValue("netPlannedArea", "");
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Area under G.H. = 10% of the total area of the scheme</p>
                </div>
              </td>
              <td align="right">
                <input
                  type="number"
                  className="form-control"
                  {...register("areaUnderGH")}
                  onWheel={handleWheel}
                  onChange={(e) => {
                    if (e?.target?.value > (watch("totalAreaScheme") * 10) / 100)
                      setError({ ...error, ["areaUnderGH"]: "Area Under GH cannot exceed 10% of Total Area of scheme" });
                    else setError({ ...error, ["areaUnderGH"]: "" });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Balance area</p>
                </div>
              </td>
              <td align="right">
                <input disabled type="number" className="form-control" {...register("balanceArea")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">50% of the Area under Sector Road & Green Belt</p>
                </div>
              </td>
              <td align="right">
                <input disabled type="number" className="form-control" {...register("areaUnderSectorAndGreenBelt")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Net planned area (A+B)</p>
                </div>
              </td>
              <td align="right">
                <input disabled type="number" className="form-control" {...register("netPlannedArea")} />
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
                <NumberInput
                  control={control}
                  name="totalNumberOfPlots"
                  customInput={TextField}
                  thousandSeparator={false}
                  allowNegative={false}
                  decimalScale={0}
                  onChange={(e) => {
                    if (!e?.target?.value?.length) {
                      setValue("generalPlots", "");
                      setValue("requiredNPNLPlots", "");
                      setValue("requiredEWSPlots", "");
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">General Plots (55%)</p>
                </div>
              </td>
              <td align="right">
                <NumberInput
                  control={control}
                  name="generalPlots"
                  customInput={TextField}
                  thousandSeparator={false}
                  allowNegative={false}
                  decimalScale={0}
                  onChange={(e) => {
                    if (e?.target?.value > (watch("totalNumberOfPlots") * 55) / 100)
                      setError({ ...error, ["generalPlots"]: " Cannot exceed 55% of total number of plots" });
                    else setError({ ...error, ["generalPlots"]: "" });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Required NPNL plots (25 %)</p>
                </div>
              </td>
              <td align="right">
                <NumberInput
                  control={control}
                  name="requiredNPNLPlots"
                  customInput={TextField}
                  thousandSeparator={false}
                  allowNegative={false}
                  decimalScale={0}
                  onChange={(e) => {
                    if (e?.target?.value > (watch("totalNumberOfPlots") * 25) / 100)
                      setError({ ...error, ["requiredNPNLPlots"]: " Cannot exceed 25% of total number of plots" });
                    else setError({ ...error, ["requiredNPNLPlots"]: "" });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Required EWS plots (20%)</p>
                </div>
              </td>
              <td align="right">
                <NumberInput
                  control={control}
                  name="requiredEWSPlots"
                  customInput={TextField}
                  thousandSeparator={false}
                  allowNegative={false}
                  decimalScale={0}
                  onChange={(e) => {
                    const val = (parseInt(watch("generalPlots")) + parseInt(watch("requiredNPNLPlots"))) * 18;
                    const valA = e?.target?.value * 12;
                    console.log("val++", (val + valA) / watch("netPlannedArea"));
                    console.log("calc", watch("netPlannedArea"), typeof watch("netPlannedArea"));
                    if (e?.target?.value > (watch("totalNumberOfPlots") * 20) / 100)
                      setError({ ...error, ["requiredEWSPlots"]: " Cannot exceed 20% of total number of plots" });
                    else {
                      setValue("permissibleDensity", ((val + valA) / watch("netPlannedArea"))?.toFixed(3));
                      setError({ ...error, ["requiredEWSPlots"]: "" });
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Permissible density</p>
                </div>
              </td>
              <td align="right">
                <input disabled type="number" className="form-control" {...register("permissibleDensity")} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Permissible Commercial Area</p>
                </div>
              </td>
              <td align="right">
                <input type="number" className="form-control" {...register("permissibleCommercialArea")} onWheel={handleWheel} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Under Plot</p>
                </div>
              </td>
              <td align="right">
                <input type="number" className="form-control" {...register("underPlot")} onWheel={handleWheel} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Commercial</p>
                </div>
              </td>
              <td align="right">
                <input type="number" className="form-control" {...register("commercial")} onWheel={handleWheel} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Permissible saleable area</p>
                </div>
              </td>
              <td align="right">
                <input type="number" className="form-control" {...register("permissibleSaleableArea")} onWheel={handleWheel} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Required green area on applied land</p>
                </div>
              </td>
              <td align="right">
                <input type="number" className="form-control" {...register("requiredGreenArea")} onWheel={handleWheel} />
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
                <input type="number" className="form-control" {...register("communitySites")} onWheel={handleWheel} />
              </td>
            </tr>
            <tr>
              <td>
                <div className="px-2">
                  <p className="mb-2">Provided</p>
                </div>
              </td>
              <td align="right">
                <input type="number" className="form-control" {...register("provided")} onWheel={handleWheel} />
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
            <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
              Layout Plan in pdf<span style={{ color: "red" }}>*</span>
            </h6>
            <label>
              <FileUpload color="primary" />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanPdf")}
                accept="application/pdf/jpeg/png"
              />
            </label>
            {watch("layoutPlanPdf") && (
              <div>
                <a onClick={() => getDocShareholding(watch("layoutPlanPdf"))} className="btn btn-sm ">
                  <VisibilityIcon color="info" className="icon" />
                </a>
                <h3>{watch("layoutPlanPdf")}</h3>
              </div>
            )}
          </div>
          <div className="col col-3">
            <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
              Layout Plan in dxf<span style={{ color: "red" }}>*</span>
            </h6>
            <label>
              <FileUpload color="primary" />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanDxf")}
                accept="application/pdf/jpeg/png"
              />
            </label>
            {/* {fileStoreId?.undertaking ? (
              <a onClick={() => getDocShareholding(fileStoreId?.undertaking)} className="btn btn-sm ">
                <VisibilityIcon color="info" className="icon" />
              </a>
            ) : (
              <p></p>
            )} */}
          </div>
          <div className="col col-3">
            <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
              Layout Plan in zip<span style={{ color: "red" }}>*</span>
            </h6>
            <label>
              <FileUpload color="primary" />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanZip")}
                accept="application/pdf/jpeg/png"
              />
            </label>
            {/* {fileStoreId?.undertaking ? (
              <a onClick={() => getDocShareholding(fileStoreId?.undertaking)} className="btn btn-sm ">
                <VisibilityIcon color="info" className="icon" />
              </a>
            ) : (
              <p></p>
            )} */}
          </div>
          <div className="col col-3">
            <h6
              style={{ display: "flex" }}
              data-toggle="tooltip"
              data-placement="top"
              title="Undertaking that no change has been made in the phasing "
            >
              Undertaking.<span style={{ color: "red" }}>*</span>
            </h6>
            <label>
              <FileUpload color="primary" />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => getDocumentData(e?.target?.files[0], "undertaking")}
                accept="application/pdf/jpeg/png"
              />
            </label>
            {/* {fileStoreId?.undertaking ? (
              <a onClick={() => getDocShareholding(fileStoreId?.undertaking)} className="btn btn-sm ">
                <VisibilityIcon color="info" className="icon" />
              </a>
            ) : (
              <p></p>
            )} */}
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default ResidentialPlottedForm;
