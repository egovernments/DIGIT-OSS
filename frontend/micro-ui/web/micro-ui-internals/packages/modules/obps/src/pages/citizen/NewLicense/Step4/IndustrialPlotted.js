import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NumberInput from "../../../../components/NumberInput";
import TextField from "@mui/material/TextField";

const IndustrialPlottedForm = ({
  register,
  getDocumentData,
  watch,
  getDocShareholding,
  setLoader,
  setValue,
  control,
  handleWheel,
  setError,
  error,
}) => {
  const calculateAreaRes = (e, per) => {
    const totalVal = watch("areaUnderResidentialPlots") + watch("areaUnderAffordableIndustrial") + watch("areaUnderCommercialUse");
    if (totalVal > (watch("netPlannedArea") * per) / 100) {
      setError({
        ...error,
        ["areaUnderAffordableIndustrial"]:
          "Total of Area under Residential plots,Area under Affordable Industrial Housing, Area under Commercial Cannot be more than 20% of net planned area",
      });
    } else setError({ ...error, ["areaUnderAffordableIndustrial"]: "" });

    if (watch("areaUnderCommercialUse") > (watch("netPlannedArea") * 5) / 100) {
      setError({
        ...error,
        ["areaUnderCommercialUse"]: "Area under Commercial cannot be more than 5% of Net planned area",
      });
    } else setError({ ...error, ["areaUnderCommercialUse"]: "" });

    const totalSealable = watch("areaUnderIndustrialUse") + totalVal;

    // totalSaleableArea

    if (totalSealable > (watch("netPlannedArea") * 65) / 100) {
      setError({
        ...error,
        ["totalSaleableArea"]: "Cannot be more than 65% of Net planned area",
      });
    } else {
      setValue("totalSaleableArea", totalSealable);
      setError({ ...error, ["totalSaleableArea"]: "" });
    }
  };

  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h6 className="text-black">
          <b>Industrial Plotted</b>
        </h6>
        <h6 className="text-black mt-4">
          <b>Detail of land use</b>
        </h6>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2>
                  Total area of the Scheme
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <NumberInput disabled control={control} name="totalAreaScheme" customInput={TextField} />
          </Col>
        </Row>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2 data-toggle="tooltip" data-placement="top" title="Area under Sector Road & Green Belt">
                  Area under Sector Road
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input
              type="number"
              className="form-control"
              {...register("areaUnderSectorRoad")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (e?.target?.value?.length) {
                  setValue("balanceAreaAfterDeduction", (watch("totalAreaScheme") - e?.target?.value)?.toFixed(3));
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
          </Col>
        </Row>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2 data-toggle="tooltip" data-placement="top" title=" Balance area after deducting area under sector road and Green Belt">
                  Balance area
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input disabled type="number" className="form-control" {...register("balanceAreaAfterDeduction")} />
          </Col>
        </Row>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2>
                  Area under undetermined use
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input
              type="number"
              className="form-control"
              {...register("areaUnderUndetermined")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (e?.target?.value?.length) {
                  setValue("balanceArea", (watch("balanceAreaAfterDeduction") - e?.target?.value)?.toFixed(3));
                  setValue(
                    "netPlannedArea",
                    (watch("balanceAreaAfterDeduction") - e?.target?.value + watch("areaUnderSectorAndGreenBelt"))?.toFixed(3)
                  );
                } else {
                  setValue("balanceArea", "");
                  setValue("netPlannedArea", "");
                }
              }}
            />
          </Col>
        </Row>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2>
                  Balance area
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input disabled type="number" className="form-control" {...register("balanceArea")} />
          </Col>
        </Row>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2 data-toggle="tooltip" data-placement="top" title="  50% of the Area under Sector Road & Green Belt">
                  50% of the Area
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input disabled type="number" className="form-control" {...register("areaUnderSectorAndGreenBelt")} />
          </Col>
        </Row>
        <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2>
                  Net planned area (A+B)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input disabled type="number" className="form-control" {...register("netPlannedArea")} />
          </Col>
        </Row>

        {watch("totalAreaScheme") < 50 && (
          <div>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Area under Industrial use
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input
                  type="text"
                  className="form-control"
                  {...register("areaUnderIndustrialUse")}
                  onWheel={handleWheel}
                  onChange={(e) => {
                    if (e?.target?.value < (watch("netPlannedArea") * 45) / 100 || e?.target?.value > (watch("totalAreaScheme") * 65) / 100) {
                      setError({ ...error, ["areaUnderIndustrialUse"]: "Cannot be less than 45%  NPA and Cannot be more than 65%  NPA" });
                    } else setError({ ...error, ["areaUnderIndustrialUse"]: "" });
                  }}
                />
              </Col>
              <Col md={4} xxl lg="4">
                {error?.areaUnderIndustrialUse && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.areaUnderIndustrialUse}</h6>}
              </Col>
            </Row>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Area under Residential plots
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input
                  type="text"
                  className="form-control"
                  {...register("areaUnderResidentialPlots")}
                  onWheel={handleWheel}
                  onChange={(e) => calculateAreaRes(e?.target?.value, 20)}
                />
              </Col>
            </Row>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2 data-toggle="tooltip" data-placement="top" title="  Area under Affordable Industrial Housing">
                      Area under Affordable Housing
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input
                  type="text"
                  className="form-control"
                  {...register("areaUnderAffordableIndustrial")}
                  onWheel={handleWheel}
                  onChange={(e) => calculateAreaRes(e?.target?.value, 20)}
                />
              </Col>
              <Col md={4} xxl lg="4">
                {error?.areaUnderCommercialUse && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.areaUnderCommercialUse}</h6>}
              </Col>
            </Row>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Area under Commercial
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input
                  type="text"
                  className="form-control"
                  {...register("areaUnderCommercialUse")}
                  onWheel={handleWheel}
                  onChange={(e) => calculateAreaRes(e?.target?.value, 20)}
                />
              </Col>
            </Row>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Total Saleable Area
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input disabled type="text" className="form-control" {...register("totalSaleableArea")} onWheel={handleWheel} />
              </Col>
              <Col md={4} xxl lg="4">
                {error?.totalSaleableArea && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.totalSaleableArea}</h6>}
              </Col>
            </Row>
          </div>
        )}

        {watch("totalAreaScheme") === 50 ||
          (watch("totalAreaScheme") < 200 && (
            <div>
              <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
                <Col md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        Area under Industrial use
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                </Col>
                <Col md={4} xxl lg="4">
                  <input
                    type="text"
                    className="form-control"
                    {...register("areaUnderIndustrialUse")}
                    onWheel={handleWheel}
                    onChange={(e) => {
                      if (e?.target?.value < (watch("netPlannedArea") * 40) / 100 || e?.target?.value > (watch("totalAreaScheme") * 65) / 100) {
                        setError({ ...error, ["areaUnderIndustrialUse"]: "Cannot be less than 45%  NPA and Cannot be more than 65%  NPA" });
                      } else setError({ ...error, ["areaUnderIndustrialUse"]: "" });
                    }}
                  />
                </Col>
                <Col md={4} xxl lg="4">
                  {error?.areaUnderIndustrialUse && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.areaUnderIndustrialUse}</h6>}
                </Col>
              </Row>
              <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
                <Col md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        Area under Residential plots
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                </Col>
                <Col md={4} xxl lg="4">
                  <input
                    type="text"
                    className="form-control"
                    {...register("areaUnderResidentialPlots")}
                    onWheel={handleWheel}
                    onChange={(e) => calculateAreaRes(e?.target?.value, 25)}
                  />
                </Col>
              </Row>
              <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
                <Col md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        Area under Affordable Industrial Housing
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                </Col>
                <Col md={4} xxl lg="4">
                  <input
                    type="text"
                    className="form-control"
                    {...register("areaUnderAffordableIndustrial")}
                    onWheel={handleWheel}
                    onChange={(e) => calculateAreaRes(e?.target?.value, 25)}
                  />
                </Col>
                <Col md={4} xxl lg="4">
                  {error?.areaUnderCommercialUse && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.areaUnderCommercialUse}</h6>}
                </Col>
              </Row>
              <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
                <Col md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        Area under Commercial
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                </Col>
                <Col md={4} xxl lg="4">
                  <input
                    type="text"
                    className="form-control"
                    {...register("areaUnderCommercialUse")}
                    onWheel={handleWheel}
                    onChange={(e) => calculateAreaRes(e?.target?.value, 25)}
                  />
                </Col>
              </Row>
              <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
                <Col md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>
                        Total Saleable Area
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </Form.Label>
                  </div>
                </Col>
                <Col md={4} xxl lg="4">
                  <input disabled type="text" className="form-control" {...register("totalSaleableArea")} onWheel={handleWheel} />
                </Col>
              </Row>
            </div>
          ))}

        {watch("totalAreaScheme") > 200 && (
          <div>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Area under Industrial use
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input
                  type="text"
                  className="form-control"
                  {...register("areaUnderIndustrialUse")}
                  onWheel={handleWheel}
                  onChange={(e) => {
                    if (e?.target?.value < (watch("netPlannedArea") * 35) / 100 || e?.target?.value > (watch("totalAreaScheme") * 65) / 100) {
                      setError({ ...error, ["areaUnderIndustrialUse"]: "Cannot be less than 45%  NPA and Cannot be more than 65%  NPA" });
                    } else setError({ ...error, ["areaUnderIndustrialUse"]: "" });
                  }}
                />
              </Col>
              <Col md={4} xxl lg="4">
                {error?.areaUnderIndustrialUse && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.areaUnderIndustrialUse}</h6>}
              </Col>
            </Row>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Area under Residential plots
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input
                  type="text"
                  className="form-control"
                  {...register("areaUnderResidentialPlots")}
                  onWheel={handleWheel}
                  onChange={(e) => calculateAreaRes(e?.target?.value, 35)}
                />
              </Col>
            </Row>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Area under Affordable Industrial Housing
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input
                  type="text"
                  className="form-control"
                  {...register("areaUnderAffordableIndustrial")}
                  onWheel={handleWheel}
                  onChange={(e) => calculateAreaRes(e?.target?.value, 35)}
                />
              </Col>
              <Col md={4} xxl lg="4">
                {error?.areaUnderCommercialUse && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.areaUnderCommercialUse}</h6>}
              </Col>
            </Row>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Area under Commercial
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input
                  type="text"
                  className="form-control"
                  {...register("areaUnderCommercialUse")}
                  onWheel={handleWheel}
                  onChange={(e) => calculateAreaRes(e?.target?.value, 35)}
                />
              </Col>
            </Row>
            <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Total Saleable Area
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <input disabled type="text" className="form-control" {...register("totalSaleableArea")} onWheel={handleWheel} />
              </Col>
            </Row>
          </div>
        )}

        {/* common area */}
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2>
                  Total Residential Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <NumberInput
              control={control}
              name="totalResidentialPlots"
              customInput={TextField}
              thousandSeparator={false}
              allowNegative={false}
              decimalScale={0}
            />
          </Col>
        </Row>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2>
                  Required EWS Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <NumberInput
              control={control}
              name="requiredEWSPlots"
              customInput={TextField}
              thousandSeparator={false}
              allowNegative={false}
              decimalScale={0}
              onChange={(e) => {
                if (e?.target?.value < (watch("totalResidentialPlots") * 25) / 100)
                  setError({ ...error, ["requiredEWSPlots"]: "EWS Plots should be minimum 25% of Total residential plots" });
                else {
                  setError({ ...error, ["requiredEWSPlots"]: "" });
                }
              }}
            />
          </Col>
          <Col md={4} xxl lg="4">
            {error?.requiredEWSPlots && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.requiredEWSPlots}</h6>}
          </Col>
        </Row>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2>
                  Total Industrial Plots
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <NumberInput
              control={control}
              name="totalIndustrialPlots"
              customInput={TextField}
              thousandSeparator={false}
              allowNegative={false}
              decimalScale={0}
            />
          </Col>
        </Row>

        <h6 className="text-black mt-4">
          <b>Documents</b>
        </h6>
        <div className="row ">
          <div className="col col-3">
            <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
              Layout Plan in pdf<span style={{ color: "red" }}>*</span>
            </h6>
            <label>
              <FileUpload style={{ cursor: "pointer" }} color="primary" />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanPdf")}
                accept="application/pdf/jpeg/png"
              />
            </label>
            {watch("layoutPlanPdf") && (
              <div>
                <a onClick={() => getDocShareholding(watch("layoutPlanPdf"), setLoader)} className="btn btn-sm ">
                  <VisibilityIcon color="info" className="icon" />
                </a>
                {/* <h3>{watch("layoutPlanPdf")}</h3> */}
              </div>
            )}
          </div>
          <div className="col col-3">
            <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
              Layout Plan in dxf<span style={{ color: "red" }}>*</span>
            </h6>
            <label>
              <FileUpload style={{ cursor: "pointer" }} color="primary" />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => getDocumentData(e?.target?.files[0], "layoutPlanDxf")}
                accept="application/pdf/jpeg/png"
              />
            </label>
            {watch("layoutPlanDxf") && (
              <a onClick={() => getDocShareholding(watch("layoutPlanDxf"), setLoader)} className="btn btn-sm ">
                <VisibilityIcon color="info" className="icon" />
              </a>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default IndustrialPlottedForm;
