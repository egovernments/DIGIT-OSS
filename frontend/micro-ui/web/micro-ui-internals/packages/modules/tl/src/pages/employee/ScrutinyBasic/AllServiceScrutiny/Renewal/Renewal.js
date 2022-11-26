import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

function renewalClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const renewal = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(renewal)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Renewal</h4>
        <div className="card">
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridCase">
              <Form.Label>
                <h2>
                  License No.<span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("licenseNo")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Valid Upto <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="date" className="form-control" placeholder="" {...register("validUpto")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Renewal For <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("renewalFor")} />
            </Form.Group>
          </Row>
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Name of Colonizer <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("colonizerName")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Type of Colony
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("colonyType")} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Area in Acres
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("areaAcres")} />
            </Form.Group>
          </Row>
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Sector No. <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("sectorNo")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Name of applicantName
                  <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("applicantName")} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Mobile
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("mobile")} />
            </Form.Group>
          </Row>
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Email-Address <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="email" className="form-control" placeholder="" {...register("emailAddress")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Address
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("address")} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Village <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("village")} />
            </Form.Group>
          </Row>
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Tehsil
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("tehsil")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Pin code
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("pinCode")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Reason for Delay
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="textarea" className="form-control" placeholder="" {...register("reasonDelay")} />
            </Form.Group>
          </Row>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Sr.No</th>
                <th style={{ textAlign: "center" }}>Field Name</th>
                <th style={{ textAlign: "center" }}>Upload Documents</th>
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
          </div>
          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
            <div class="col-sm-12 text-right">
              <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </Card>
    </form>
  );
}

export default renewalClu;
