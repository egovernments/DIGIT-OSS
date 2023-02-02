import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Col } from "react-bootstrap";
import { Form } from "react-bootstrap";
import NumberInput from "../../../../components/NumberInput";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import FileUpload from "@mui/icons-material/FileUpload";

const ResidentialGroupHousingForm = ({ register, watch, setValue, control, handleWheel, setError, error }) => {
  return (
    <Row className="ml-auto" style={{ marginBottom: 5 }}>
      <Col col-12>
        <h6 className="text-black">
          <b>Residential Group Housing</b>
        </h6>
        <h6 className="text-black mt-4">
          <b>Detail of land use</b>
        </h6>
        <h6 className="text-black mt-4">
          <b>Detail of land use</b>
        </h6>
        <Col col-12>
          <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Total area of the Scheme
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <NumberInput disabled control={control} name="totalAreaScheme" customInput={TextField} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Area under Sector Road & Green Belt
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
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
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Balance area after deducting area under sector road and Green Belt
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input disabled type="number" className="form-control" {...register("balanceAreaAfterDeduction")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Area under undetermined use
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
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
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Balance area
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input disabled type="number" className="form-control" {...register("balanceArea")} />
            </Col>

            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    50% of the Area under Sector Road & Green Belt
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input disabled type="number" className="form-control" {...register("areaUnderSectorAndGreenBelt")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Net planned area (A+B)
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input disabled type="number" className="form-control" {...register("netPlannedArea")} />
            </Col>
          </Row>
        </Col>
        <Col col-12>
          <Row className="ml-auto mt-4" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Permissable Ground Coverage
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input
                type="number"
                className="form-control"
                {...register("permissableGroundCoverage")}
                onWheel={handleWheel}
                onChange={(e) => {
                  if (e?.target?.value > (watch("netPlannedArea") * 0.35) / 100) {
                    setError({ ...error, ["permissableGroundCoverage"]: "Maximum 0.35% of Net planned area is allowed" });
                  } else setError({ ...error, ["permissableGroundCoverage"]: "" });
                }}
              />
              {error?.permissableGroundCoverage && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.permissableGroundCoverage}</h6>}
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Permissable Commercial
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input
                type="number"
                className="form-control"
                {...register("permissableCommercial")}
                onWheel={handleWheel}
                onChange={(e) => {
                  if (e?.target?.value > (watch("netPlannedArea") * 0.5) / 100) {
                    setError({ ...error, ["permissableCommercial"]: "Maximum 0.5% of Net planned area is allowed" });
                  } else setError({ ...error, ["permissableCommercial"]: "" });
                }}
              />
              {error?.permissableCommercial && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.permissableCommercial}</h6>}
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>
                    Permissable FAR
                    <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <input
                type="number"
                className="form-control"
                {...register("permissableFAR")}
                onWheel={handleWheel}
                onChange={(e) => {
                  if (e?.target?.value > (watch("netPlannedArea") * 175) / 100) {
                    setError({ ...error, ["permissableFAR"]: "Maximum 175% of Net planned area is allowed" });
                  } else setError({ ...error, ["permissableFAR"]: "" });
                }}
              />
              {error?.permissableFAR && <h6 style={{ fontSize: "12px", color: "red" }}>{error?.permissableFAR}</h6>}
            </Col>
          </Row>
        </Col>
      </Col>
    </Row>
  );
};

export default ResidentialGroupHousingForm;
