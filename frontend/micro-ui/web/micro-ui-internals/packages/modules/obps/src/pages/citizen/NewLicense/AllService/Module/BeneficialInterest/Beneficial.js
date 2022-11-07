import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function Beneficial() {
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
            <h4 className="text-center">CHANGE IN BENEFICIAL INTEREST</h4>
            <br></br>
            <Row className="col-12">
            <Col className="col-4">
              <Form.Group as={Col} controlId="formGridLicence">
                <Form.Label>
                  Licence No . <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="number" placeholder="Enter Licence" />
              </Form.Group>
              </Col>
              <Col className="col-4">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  Select Service <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Select onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">(a)Change of Developer</option>
                  <option value="2">
                    (b) Joint Development and/or Marketing rights
                  </option>
                  <option value="3">(c)Change in Share Holding Pattern</option>
                </Form.Select>
              </Form.Group>
              </Col>
              <Col className="col-4">
                <Row>
                  <Col className="col-10">
                    <Form.Group controlId="formGridState">
                      <Form.Label>
                        Amount <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        required={true}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="col-2">
                    <Button
                      variant="success"
                      className="col my-4"
                      type="submit"
                      aria-label="right-end"
                    >
                      Pay
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col className="col-4">
              <Form.Group as={Col} controlId="formGridArea">
                {/* <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" /> */}
                <div>
                  {showhide === "2" && (
                    <div className="col-md-12 form-group">
                      <Form.Label>
                        Area in Acres <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control type="number" placeholder="Enter Area" />
                    </div>
                  )}
                </div>
              </Form.Group>
              </Col>
            </Row>
            </Form>
            </div>
            
            <Row>
              <div >
                {showhide === "1" && (
                   <div  className="card">
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
                              No objection certificate from the existing
                              ‘Developer, filed through its authorized
                              signatory, specifically designated for the
                              purpose; as well as from the ‘land owner
                              licensees’, in person (not through GPA/SPA
                              assignees), to the proposed change/assignmen
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
                              A consent letter from the ‘new entity for the
                              proposed change{" "}
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
                              Justification for such request.{" "}
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">4</th>
                            <td>
                              {" "}
                              The status regarding the creation of third-party
                              rights in the colony. In case no third-party
                              rights are claimed to have been created in the
                              colony, an affidavit to the said effect be also
                              submitted by the existing developer{" "}
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
                              Documents about the Technical and Financial
                              Capacity of the ‘new entity’ proposed to be
                              inducted as a ‘Developer’ or ‘shareholder(s)’ as
                              per prescribed policy parameters for grant of
                              license. <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">6</th>
                            <td>
                              {" "}
                              An undertaking to pay the balance administrative
                              charges before final approval.
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
                              Status of RERA registration of project of non
                              registered,then affidavit to this effect.
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">8</th>
                            <td>
                              {" "}
                              Board resolution of authorised signatory of
                              “existing developer{" "}
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">9</th>
                            <td>
                              {" "}
                              Board resolution of authorised signatory of “new
                              entity ”<span style={{ color: "red" }}>*</span>
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
                )}
              </div>
              <div>
                {showhide === "2" && (
                    <div  className="card">
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
                              No objection certificate from the existing
                              ‘Developer, filed through its authorized
                              signatory, specifically designated for the
                              purpose; as well as from the ‘land owner
                              licensees’, in person (not through GPA/SPA
                              assignees), to the proposed change/assignment
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
                              A consent letter from the ‘new entity for the
                              proposed change.{" "}
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
                              Justification for such request.
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">4</th>
                            <td>
                              {" "}
                              The status regarding the creation of third-party
                              rights in the colony. In case no third-party
                              rights are claimed to have been created in the
                              colony, an affidavit to the said effect be also
                              submitted by the existing developer{" "}
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
                              Details of the applied area where joint
                              development and /or marketing rights are to be
                              assigned <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">6</th>
                            <td>
                              {" "}
                              An undertaking to pay the balance administrative
                              charges before final approval.
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
                              Board resolution of authorised signatory of
                              “existing developer”.
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">8</th>
                            <td>
                              {" "}
                              Board resolution of authorised signatory of “new
                              entity ” <span style={{ color: "red" }}>*</span>
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
                )}
              </div>
              <div>
                {showhide === "3" && (
                    <div  className="card">
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
                              No objection certificate from the existing
                              ‘Developer, filed through its authorized
                              signatory, specifically designated for the
                              purpose; as well as from the ‘land owner
                              licensees’, in person (not through GPA/SPA
                              assignees), to the proposed change/assignment
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
                              Justification for such request{" "}
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
                              The status regarding the creation of third-party
                              rights in the colony. In case no third-party
                              rights are claimed to have been created in the
                              colony, an affidavit to the said effect be also
                              submitted by the existing developer{" "}
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">4</th>
                            <td>
                              {" "}
                              Documents about the Technical and Financial
                              Capacity of the ‘new entity’ proposed to be
                              inducted as a ‘Developer’ or ‘shareholder(s)’ as
                              per prescribed policy parameters for grant of
                              license <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">5</th>
                            <td>
                              {" "}
                              An undertaking to pay the balance administrative
                              charges before final approval{" "}
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
                              Proposed Shareholding Pattern of the developer
                              company.
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
                              Status of RERA registration of project of non
                              registered,then affidavit to this effect.
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">8</th>
                            <td>
                              {" "}
                              Board resolution of authorised signatory of
                              “existing developer”{" "}
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">9</th>
                            <td>
                              {" "}
                              Board resolution of authorised signatory of “new
                              entity ”<span style={{ color: "red" }}>*</span>
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
                )}
              </div>
            </Row>
               
        
        <Form>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            </Form>
      </div>
    </div>
  );
}

export default Beneficial;
