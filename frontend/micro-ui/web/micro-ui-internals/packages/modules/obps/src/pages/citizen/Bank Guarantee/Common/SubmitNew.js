import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
const SubmitNew = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const bankSubmitNew = (data) => console.log(data);
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  return (
    <form on submit={handleSubmit(bankSubmitNew)}>
      <Card style={{ width: "126%", marginLeft: "19px", paddingRight: "10px" }}>
        <Form.Group className="justify-content-center" controlId="formBasicEmail">
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter LOI No.</h2>{" "}
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("enterLoiNumber")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Enter Memo No. </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("enterMemoNumber")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Type of B.G</h2>
                </Form.Label>
              </div>
              <select className="form-control" {...register("typeOfBg")}>
                <option> IDW</option>
                <option>EDC</option>
              </select>
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Upload B.G. </h2>
                </Form.Label>
              </div>
              <input type="file" className="form-control" placeholder="" {...register("uploadBg")} />
            </Col>
          </Row>

          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Bank Name </h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("bankName")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Amount (in fig)</h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" placeholder="" {...register("amountInFig")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Amount (in words)</h2>
                </Form.Label>
              </div>
              <input type="text" className="form-control" disabled placeholder="" {...register("amountInWords")} />
            </Col>
            <Col md={4} xxl lg="3">
              <div>
                <Form.Label>
                  <h2>Valid Upto </h2>
                </Form.Label>
              </div>
              <input type="date" className="form-control" placeholder="" {...register("validity")} />
            </Col>
          </Row>
          <div className="row">
            <div className="col col-12 ">
              <div>
                <div className="form-check">
                  <input className="form-check-input" formControlName="agreeCheck" type="checkbox" value="" id="flexCheckDefault" required />
                  <label className="checkbox" for="flexCheckDefault">
                    Hardcopy Submitted at TCP office.{" "}
                    <label htmlFor="licenseApplied">
                      <input {...register("licenseApplied")} type="radio" value="Y" id="licenseApplied" />
                      &nbsp; Yes &nbsp;&nbsp;
                    </label>
                    <label htmlFor="licenseApplied">
                      <input
                        {...register("licenseApplied")}
                        type="radio"
                        value="N"
                        id="licenseApplied"
                        className="btn btn-primary"
                        onClick={() => setmodal1(true)}
                      />
                      &nbsp; No &nbsp;&nbsp;
                    </label>
                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.licenseApplied && errors?.licenseApplied?.message}
                    </h3>
                  </label>
                </div>
              </div>

              {watch("licenseApplied") === "Y" && (
                <div>
                  <div className="row">
                    <div className="col col-4">
                      <label>
                        <h2>
                          Upload Receipt of Submission.
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </label>
                      <div>
                        <input
                          type="file"
                          className="form-control"
                          required
                          onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetter")}
                        />
                      </div>

                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.consentLetter && errors?.consentLetter?.message}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              {watch("licenseApplied") === "N" && (
                <div>
                  <Modal
                    size="lg"
                    isOpen={modal1}
                    toggle={() => setmodal(!modal1)}
                    style={{ width: "500px", height: "200px" }}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <ModalHeader toggle={() => setmodal1(!modal1)}></ModalHeader>
                    <ModalBody style={{ fontSize: 20 }}>
                      <h2> Submit Hardcopy of B.G. at TCP office.</h2>
                    </ModalBody>
                    <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
                  </Modal>
                </div>
              )}
            </div>
          </div>
        </Form.Group>
        <div class="row">
          <div class="col-sm-12 text-right">
            <button type="submit" id="btnClear" class="btn btn-primary btn-md center-block" style={{ marginBottom: "-44px" }}>
              Submit
            </button>
          </div>
          <div class="row">
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-danger btn-md center-block" style={{ marginRight: "66px", marginTop: "-6px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default SubmitNew;
