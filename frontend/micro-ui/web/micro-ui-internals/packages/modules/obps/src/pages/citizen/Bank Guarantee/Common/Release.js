import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
function ReleaseNew() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({});

  const bankRelease = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(bankRelease)}>
      <Card style={{ width: "126%", marginLeft: "19px", paddingRight: "10px" }}>
        <Form.Group className="justify-content-center" controlId="formBasicEmail">
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter License No. </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("licenseNo")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Type of B.G. </h2>
                </Form.Label>
              </div>
              <select className="form-control" placeholder="" {...register("bgTypes")}>
                <option value="1"> IDW</option>
                <option value="2">EDC</option>
              </select>
            </Col>
            {watch("bgTypes") === "1" && (
              <div>
                <div className="row">
                  <div className="col col-3">
                    <label>
                      <h2>
                        Upload Full Completion Certificate.
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </label>
                    <div>
                      <input
                        type="file"
                        className="form-control"
                        required
                        onChange={(e) => getDocumentData(e?.target?.files[0], "fullCertificate")}
                      />
                    </div>

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.fullCertificate && errors?.fullCertificate?.message}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            {watch("bgTypes") === "2" && (
              <div>
                <div className="row">
                  <div className="col col-3">
                    <label>
                      <h2>
                        Amount.
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </label>
                    <div>
                      <input type="text" className="form-control" placeholder="" {...register("amount")} />
                    </div>

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.consentLetter && errors?.consentLetter?.message}
                    </h3>
                  </div>
                  <div className="col col-3 ">
                    <label>
                      <h2>
                        Upload Partial Completion Certificate.
                        <span style={{ color: "red" }}>*</span>
                      </h2>
                    </label>
                    <div>
                      <input
                        type="file"
                        className="form-control"
                        required
                        onChange={(e) => getDocumentData(e?.target?.files[0], "partialCertificate")}
                      />
                    </div>

                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.partialCertificate && errors?.partialCertificate?.message}
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </Row>
        </Form.Group>
        <Row className="col-sm-12 text-right">
          <Button variant="outline-primary" className="btn btn-primary btn-md center-block" type="submit" style={{ marginBottom: "-44px" }}>
            Submit
          </Button>
          <Button variant="outline-primary" className="btn btn-danger btn-md center-block" style={{ marginRight: "66px", marginTop: "-6px" }}>
            Cancel
          </Button>
        </Row>
      </Card>
    </form>
  );
}

export default ReleaseNew;
