import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function ExtensionCom() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };

  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <Form>
            <h4 className="text-center">
              Extension (construction in community sites)
            </h4>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridCase">
                <Form.Label>
                  License No . <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="number" placeholder="Enter License No" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Applied by <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Select onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">Licensee</option>
                  <option value="2">Other than Licensee/Developer</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Outstanding dues if any{" "}
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Row>
            <Row className="col-12">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Type of community site <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Area in Acres <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Community site valid up to{" "}
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="Date" />
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
                  Extension of time &nbsp;
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Amount (Rs.) <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Row>
          </Form>
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
                            Copy of Board resolution in favour of authorized
                            signatory, applying for case (if applicable)
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>
                            {" "}
                            Justification for extension in time period for
                            construction of community site{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>
                            {" "}
                            Proof of ownership of community site (in case of the
                            extension is sought by an applicant other than the
                            licensee) . <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>
                            {" "}
                            Proof of online payment of extension fees at the
                            rates provided in Schedule-C to these Rules.{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>
                            {" "}
                            An explanatory note indicating the details of
                            progress made about the construction of such a
                            community site{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">6</th>
                          <td>
                            {" "}
                            In case of other than licensee/developer, upload
                            renewed license copy.
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">7</th>
                          <td>
                            {" "}
                            Any other document as demanded by Director at any
                            time.<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">8</th>
                          <td>
                            {" "}
                            Any other document which the director may require
                            for the said purpose.{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
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
                            Copy of Board resolution in favour of authorized
                            signatory, applying for case (if applicable)
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>
                            {" "}
                            Justification for extension in time period for
                            construction of community site{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td>
                            {" "}
                            Proof of ownership of community site (in case of the
                            extension is sought by an applicant other than the
                            licensee) . <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>
                            {" "}
                            Proof of online payment of extension fees at the
                            rates provided in Schedule-C to these Rules.{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">5</th>
                          <td>
                            {" "}
                            An explanatory note indicating the details of
                            progress made about the construction of such a
                            community site{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">6</th>
                          <td>
                            {" "}
                            In case of other than licensee/developer, upload
                            renewed license copy.
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">7</th>
                          <td>
                            {" "}
                            Any other document as demanded by Director at any
                            time.<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
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
          <Button
            variant="outline-primary"
            className="col-md-2 my-2 mx-2"
            type="submit"
            aria-label="right-end"
          >
            Save as Draft
          </Button>
          <Button
            variant="outline-primary"
            className="col-md-2 my-2 mx-2"
            type="submit"
            aria-label="right-end"
          >
            Submit
          </Button>
        </Row>
        {/* </Form> */}
      </div>
    </div>
  );
}

export default ExtensionCom;
