import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";

function ExtensionClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const extensionClu = (data) => console.log(data);
  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <form onSubmit={handleSubmit(extensionClu)}>
            <h4 className="text-center">Extension of CLU permission</h4>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridCase">
                <Form.Label>
                  <h2>Case No.</h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" className="form-control" placeholder="" {...register("caseNo")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Application Number </h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" className="form-control" placeholder="" {...register("applicationNo")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Nature (land Use) Purpose </h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("naturePurpose")} />
              </Form.Group>
            </Row>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Total Area in Sq. meter.</h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" className="form-control" placeholder="" {...register("totalAreaSq")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Date Of CLU </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="Date" className="form-control" placeholder="" {...register("cluDate")} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Date of Expiry of CLU </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="Date" className="form-control" placeholder="" {...register("expiryClu")} />
              </Form.Group>
            </Row>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Stage of construction </h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("stageConstruction")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Name of applicant </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("applicantName")} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Mobile </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" className="form-control" placeholder="" {...register("mobile")} />
              </Form.Group>
            </Row>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Email-Address <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="email" className="form-control" placeholder="" {...register("emailAddress")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Address </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("address")} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Village </h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("village")} />
              </Form.Group>
            </Row>
            <Row className="col-8">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Tehsil </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("tehsil")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Pin code </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" className="form-control" placeholder="" {...register("pinCode")} />
              </Form.Group>
            </Row>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2> Reason for Delay </h2>
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <input type="textarea" className="form-control" placeholder="" {...register("reasonDelay")} />
            </Form.Group>

            <div class="bordere">
              <div class="table-responsive">
                <table class="table">
                  {/* <caption>List of users</caption> */}
                  <thead>
                    <tr>
                      <th scope="col">Sr.No</th>
                      <th scope="col">Field Name</th>
                      <th scope="col">Upload Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>
                        Upload BR-III<span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>
                        {" "}
                        Upload photographs of building under construction showing the status of construction at the site{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("uploadPhotographs")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>
                        {" "}
                        Receipt of application if any submitted for taking occupation certificate <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("receiptApplication")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">4</th>
                      <td>
                        {" "}
                        Upload approved Building Plan <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("uploadBuildingPlan")}></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">5</th>
                      <td>
                        {" "}
                        Indemnity Bond <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Row className="justify-content-end">
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                Save as Draft
              </Button>
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                Submit
              </Button>
            </Row>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExtensionClu;
