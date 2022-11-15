import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";

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

  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <form onSubmit={handleSubmit(extensionCom)}>
            <h4 className="text-center">Extension (construction in community sites)</h4>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridCase">
                <Form.Label>
                  <h2> License No.</h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" className="form-control" placeholder="" {...register("licenseNumber")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Applied by </h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <select className="form-control" placeholder="" {...register("appliedBy")} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">Licensee</option>
                  <option value="2">Other than Licensee/Developer</option>
                </select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Outstanding dues if any </h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("outstandingDues")} />
              </Form.Group>
            </Row>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Type of community site </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("typesCommunitySites")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Area in Acres </h2>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("areainAcres")} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Community site valid up to </h2> <span style={{ color: "red" }}>*</span>
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
                  <h2> Extension of time </h2>&nbsp;
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("extensionTime")} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2> Amount (Rs.) </h2> <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="text" className="form-control" placeholder="" {...register("amount")} />
              </Form.Group>
            </Row>
          </form>
        </div>

        <div>
          {showhide === "2" && (
            <div className="card">
              <div className="col-md-12 form-group">
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
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          {showhide === "1" && (
            <div className="card">
              <div className="col-md-12 form-group">
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
                        <tr>
                          <th scope="row">3</th>
                          <td>
                            {" "}
                            Proof of ownership of community site (in case of the extension is sought by an applicant other than the licensee) .{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" className="form-control" placeholder="" {...register("ownershipCommunitySite")}></input>
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
                            <input type="file" className="form-control" placeholder="" {...register("onlinePaymentExtensionFee")}></input>
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
                            <input type="file" className="form-control" placeholder="" {...register("indicatingProgress")}></input>
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
                            <input type="file" className="form-control" placeholder="" {...register("uploadRenewd")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">7</th>
                          <td>
                            {" "}
                            Any other document as demanded by Director at any time.<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" className="form-control" placeholder="" {...register("demandedDirector")}></input>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Row className="justify-content-end">
          <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
            Save as Draft
          </Button>
          <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
            Submit
          </Button>
        </Row>
        {/* </Form> */}
      </div>
    </div>
  );
}

export default ExtensionCom;
