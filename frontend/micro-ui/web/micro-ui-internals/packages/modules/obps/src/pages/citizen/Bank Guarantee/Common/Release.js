import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
function ReleaseNew() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
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
        <Row className="justify-content-end">
          <Button variant="outline-primary" className="col-md-2 my-2 mx-2" aria-label="right-end">
            Cancel
          </Button>
          <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
            Submit
          </Button>
        </Row>
      </Card>
    </form>
  );
}

export default ReleaseNew;
