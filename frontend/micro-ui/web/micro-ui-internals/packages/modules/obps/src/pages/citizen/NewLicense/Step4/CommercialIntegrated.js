import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import NumberInput from "../../../../components/NumberInput";

const CommercialIntegratedForm = ({
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
          <b>Commercial Integrated</b>
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
                    setValue("totalAreaScheme", "");
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
          <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <h2>
                    Ground Coverage (in Acres)
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
            </Col>
            <Col md={4} xxl lg="4">
              <input
                type="number"
                className="form-control"
                {...register("permissableGroundCoverage")}
                onWheel={handleWheel}
                onChange={(e) => {
                  if (e?.target?.value > (watch("netPlannedArea") * 60) / 100) {
                    setError({ ...error, ["permissableGroundCoverage"]: "Ground Coverage cannot be more than 60% of NPA" });
                  } else setError({ ...error, ["permissableGroundCoverage"]: "" });
                }}
              />
            </Col>
            <Col md={4} xxl lg="4">
              {error?.permissableGroundCoverage && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.permissableGroundCoverage}</h6>}
            </Col>
          </Row>
        </Col>
        <Col col-12>
          <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <h2>
                    FAR (in Acres)
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
            </Col>
            <Col md={4} xxl lg="4">
              <input
                type="number"
                className="form-control"
                {...register("permissableFAR")}
                onWheel={handleWheel}
                onChange={(e) => {
                  if (e?.target?.value > (watch("netPlannedArea") * 1.75) / 100) {
                    setError({ ...error, ["permissableFAR"]: "FAR(In acres) cannot be more than 1.75% of NPA" });
                  } else setError({ ...error, ["permissableFAR"]: "" });
                }}
              />
            </Col>
            <Col md={4} xxl lg="4">
              {error?.permissableFAR && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.permissableFAR}</h6>}
            </Col>
          </Row>
        </Col>
        <h6 className="text-black mt-4">
          <b>Documents</b>
        </h6>
        <br></br>
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

export default CommercialIntegratedForm;
