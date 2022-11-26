import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";

function ExtensionClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const extensionClu = (data) => console.log(data);
  const [open2, setOpen2] = useState(false);

  return (
    <form onSubmit={handleSubmit(extensionClu)}>
         <div
        className="collapse-header"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f" }} className="">
        Extension of CLU permission
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension of CLU permission</h4>
        <div className="card">
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridCase">
              <Form.Label>
                <h2>
                  Case No.<span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("caseNo")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Application Number <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("applicationNo")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Nature (land Use) Purpose <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("naturePurpose")} />
            </Form.Group>
          </Row>
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Total Area in Sq. meter. <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("totalAreaSq")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Date Of CLU
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="Date" className="form-control" placeholder="" {...register("cluDate")} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Date of Expiry of CLU
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="Date" className="form-control" placeholder="" {...register("expiryClu")} />
            </Form.Group>
          </Row>
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Stage of construction <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("stageConstruction")} />
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
      </div>
      </Collapse>
    </form>
  );
}

export default ExtensionClu;
