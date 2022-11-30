import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";


function ExtensionCom() {
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
  } = useForm({});

  const extensionCom = (data) => console.log(data);
const [open2, setOpen2] = useState(false);
  return (
    <form onSubmit={handleSubmit(extensionCom)}>
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
        Extension (construction in community sites)
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension (construction in community sites)</h4>
        <div className="card">
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridCase">
              <Form.Label>
                <h2>
                  {" "}
                  License No.<span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="number" className="form-control" placeholder="" {...register("licenseNumber")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Applied by <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <select className="form-control" placeholder="" {...register("appliedBy")} onChange={(e) => handleshowhide(e)}>
                <option value=" ">----Select value-----</option>
                <option value="1">Licensee</option>
                <option value="2">Other than Licensee/Developer</option>
              </select>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Outstanding dues if any <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("outstandingDues")} />
            </Form.Group>
          </Row>
          <Row className="col-12">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Type of community site
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("typesCommunitySites")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Area in Acres
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("areainAcres")} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Community site valid up to <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="Date" className="form-control" placeholder="" {...register("communitySite")} />
            </Form.Group>
          </Row>
          <Row className="col-8">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label
                data-toggle="tooltip"
                data-placement="top"
                title="Apply for an Extension of time for construction of the
                  community site (in years)"
              >
                <h2>
                  {" "}
                  Extension of time
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("extensionTime")} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Amount (Rs.) <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("amount")} />
            </Form.Group>
          </Row>
        </div>

        <div>
          {showhide === "2" && (
            <div className="card">
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
                      Copy of Board resolution in favour of authorized signatory, applying for case (if applicable)
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("copyBoardResolution")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>
                      {" "}
                      Justification for extension in time period for construction of community site <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("justificationExtension")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>
                      {" "}
                      Proof of ownership of community site (in case of the extension is sought by an applicant other than the licensee) .{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("proofOwnership")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>
                      {" "}
                      Proof of online payment of extension fees at the rates provided in Schedule-C to these Rules.{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("proofOnlinePayment")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>
                      {" "}
                      An explanatory note indicating the details of progress made about the construction of such a community site{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("explanatoryNote")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">6</th>
                    <td>
                      {" "}
                      In case of other than licensee/developer, upload renewed license copy.
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("uploadRenewalLicense")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">7</th>
                    <td>
                      {" "}
                      Any other document as demanded by Director at any time.<span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("directorDemanded")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">8</th>
                    <td>
                      {" "}
                      Any other document which the director may require for the said purpose. <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("documentdirector")}></input>
                    </td>
                  </tr>
                </tbody>
              </div>
            </div>
          )}
        </div>

        <div>
          {showhide === "1" && (
            <div className="card">
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
                      Copy of Board resolution in favour of authorized signatory, applying for case (if applicable)
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("boardResolutionSignatory")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>
                      {" "}
                      Justification for extension in time period for construction of community site <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("extensionTimePeriod")}></input>
                    </td>
                  </tr>
                  {/* <tr>
                    <th scope="row">3</th>
                    <td>
                      {" "}
                      Proof of ownership of community site (in case of the extension is sought by an applicant other than the licensee) .{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("ownershipCommunitySite")}></input>
                    </td>
                  </tr> */}
                  <tr>
                    <th scope="row">3</th>
                    <td>
                      {" "}
                      Proof of online payment of extension fees at the rates provided in Schedule-C to these Rules.{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("onlinePaymentExtensionFee")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>
                      {" "}
                      An explanatory note indicating the details of progress made about the construction of such a community site{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("indicatingProgress")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>
                      {" "}
                      In case of other than licensee/developer, upload renewed license copy.
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("uploadRenewd")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">6</th>
                    <td>
                      {" "}
                      Any other document as demanded by Director at any time.<span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("demandedDirector")}></input>
                    </td>
                  </tr>
                  <tr>
                  <th scope="row">7</th>
                    <td>
                      {" "}
                      Any other document which the director may require for the said purpose. <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("documentdirector")}></input>
                    </td>
                  </tr>
                </tbody>
              </div>
            </div>
          )}
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
      </Card>
      </div>
      </Collapse>
    </form>
  );
}

export default ExtensionCom;
