import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import NumberInput from "../../../../components/NumberInput";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import FileUpload from "@mui/icons-material/FileUpload";

const CommercialPlottedForm = ({
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
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h6 className="text-black">
          <b>
            Commercial Plotted <span style={{ color: "red" }}>*</span>
          </b>
        </h6>
        <h6 className="text-black mt-4">
          <b>Detail of land use</b>
        </h6>
        <Col col-12>
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
                    const percentage = (e?.target?.value * 10) / 100;
                    const TAS = (watch("totalAreaScheme") * 10) / 100;
                    const findMin = Math.min(TAS, percentage);
                    setValue("totalSiteArea", findMin);
                    setValue("balanceAreaAfterDeduction", (watch("totalAreaScheme") - e?.target?.value)?.toFixed(3));
                    setValue("areaUnderSectorAndGreenBelt", (e?.target?.value * 50) / 100);
                  } else {
                    setValue("balanceAreaAfterDeduction", "");
                    setValue("balanceArea", "");
                    setValue("areaUnderSectorAndGreenBelt", "");
                    setValue("netPlannedArea", "");
                    setValue("areaUnderUndetermined", "");
                    // setValue("totalAreaScheme", "");
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
                  <h2
                    data-toggle="tooltip"
                    data-placement="top"
                    title="  10% of the total site area or the area falling under the sector green belt whichever is less"
                  >
                    10% of the total site area
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
            </Col>
            <Col md={4} xxl lg="4">
              <input disabled type="number" className="form-control" {...register("totalSiteArea")} />
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
        </Col>

        <h6 className="text-black mt-4">
          <b>Detail of SCO’s/plots</b>
        </h6>
        <br></br>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2 data-toggle="tooltip" data-placement="top" title="   Ground Coverage (in Square Meters)">
                  Ground Coverage (in Sqm)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input
              type="text"
              className="form-control"
              {...register("groundCoverage")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (e?.target?.value > (watch("netPlannedArea") * 35) / 100) {
                  setError({ ...error, ["groundCoverage"]: "Maximum 35% of Net planned area is allowed" });
                } else setError({ ...error, ["groundCoverage"]: "" });
              }}
            />
          </Col>
          <Col md={4} xxl lg="4">
            {error?.groundCoverage && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.groundCoverage}</h6>}
          </Col>
        </Row>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2>
                  FAR (in Sqm)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input
              type="text"
              className="form-control"
              {...register("FAR")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (e?.target?.value > (watch("netPlannedArea") * 150) / 100) {
                  setError({ ...error, ["FAR"]: "Cannot be above 150% of Net planned area" });
                } else setError({ ...error, ["FAR"]: "" });
              }}
            />
          </Col>
          <Col md={4} xxl lg="4">
            {error?.FAR && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.FAR}</h6>}
          </Col>
        </Row>
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="4">
            <div>
              <Form.Label>
                <h2 data-toggle="tooltip" data-placement="top" title="Parking/Open Space/Services (in Square Meters)">
                  Parking/Open Space (in Sqm)
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
            </div>
          </Col>
          <Col md={4} xxl lg="4">
            <input
              type="text"
              className="form-control"
              {...register("parkingSpace")}
              onWheel={handleWheel}
              onChange={(e) => {
                if (e?.target?.value < (watch("netPlannedArea") * 65) / 100) {
                  setError({ ...error, ["parkingSpace"]: "Cannot be less than 65 % of Net planned area" });
                } else setError({ ...error, ["parkingSpace"]: "" });
              }}
            />
            {error?.parkingSpace && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.parkingSpace}</h6>}
          </Col>
        </Row>

        <h6 className="text-black mt-4">
          <b>Documents</b>
        </h6>
        <div className="row mt-4">
          <div className="col col-3">
            <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
              Layout Plan in pdf<span style={{ color: "red" }}>*</span>
            </h6>
            <div className="d-flex">
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
                </div>
              )}
            </div>
          </div>
          <div className="col col-3">
            <h6 style={{ display: "flex" }} data-toggle="tooltip" data-placement="top">
              Layout Plan in dxf<span style={{ color: "red" }}>*</span>
            </h6>
            <div className="d-flex">
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
        </div>
      </Col>
    </Row>
  );
};
export default CommercialPlottedForm;
