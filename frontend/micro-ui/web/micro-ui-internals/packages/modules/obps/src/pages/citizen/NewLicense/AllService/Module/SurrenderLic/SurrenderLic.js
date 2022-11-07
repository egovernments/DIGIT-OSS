import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function SurrenderLic() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };

  return (
    <div className="container my-5">
      <div className=" col-12 m-auto">
        <div className="card">
          <Form>
            <h4 className="text-center">Surrender of License</h4>
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
                    Select Type (Complete or Partial){" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select onChange={(e) => handleshowhide(e)}>
                    <option value=" ">----Select value-----</option>
                    <option value="1">(a)Complete</option>
                    <option value="2">(b) Partial</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="col-4">
              <Form.Group as={Row} className="mb-12">
              <Form.Label>
              Area falling under 24m road /service road or sector dividing road (Yes/no)
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                                <Row>
                                  <Col className="col-3">
                                    <Form.Check
                                      type="radio"
                                      label="Yes"
                                      name="formHorizontalRadios"
                                      id="formHorizontalRadios1"
                                      value="8"
                                      onChange={(e) => handleselects(e)}
                                    />
                                  </Col>
                                  <Col className="col-3">
                                    <Form.Check
                                      type="radio"
                                      label="No"
                                      name="formHorizontalRadios"
                                      id="formHorizontalRadios2"
                                    />
                                  </Col>
                                </Row>
                              </Form.Group>
              </Col>
              <Col className="col-4">
              <Form.Group as={Row} className="mb-12">
              <Form.Label>
              RERA registration of project
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                                <Row>
                                  <Col className="col-3">
                                    <Form.Check
                                      type="radio"
                                      label="Yes"
                                      name="formHorizontalRadios"
                                      id="formHorizontalRadios1"
                                      value="9"
                                      onChange={(e) => handleselects(e)}
                                    />
                                  </Col>
                                  <Col className="col-3">
                                    <Form.Check
                                      type="radio"
                                      label="No"
                                      name="formHorizontalRadios"
                                      id="formHorizontalRadios2"
                                    />
                                  </Col>
                                </Row>
                              </Form.Group>
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
          <div>
            {showhide === "1" && (
              <div className="card">
                <div class="bordere">
                  <div class="table-responsive">
                    <table class="table">
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
                            Declaration of Third-Party Rights
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
                            Declaration IDW Works Approved Scanned Copy of
                            Zoning/Layout Plan{" "}
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
                            License Copy <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">4</th>
                          <td>
                            {" "}
                            EDC availed or not e.g. surrounding roads are
                            constructed or not{" "}
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
                            Area falling under 24m road /service road or sector
                            dividing road and green belt If yes{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <fieldset>
                              <Form.Group as={Row} className="mb-12">
                                <Row>
                                  <Col className="col-3">
                                    <Form.Check
                                      type="radio"
                                      label="Yes"
                                      name="formHorizontalRadios"
                                      id="formHorizontalRadios1"
                                      value="4"
                                      onChange={(e) => handleselects(e)}
                                    />
                                  </Col>
                                  <Col className="col-3">
                                    <Form.Check
                                      type="radio"
                                      label="No"
                                      name="formHorizontalRadios"
                                      id="formHorizontalRadios2"
                                      value="9"
                                      onChange={(e) => handleselects(e)}
                                    />
                                  </Col>
                                </Row>
                              </Form.Group>
                            </fieldset>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {selects === "4" && (
                      <table class="table">
                        <tbody>
                          <tr>
                            <th scope="row">6</th>
                            <td>
                              {" "}
                              Gift Deed
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
                              Mutation
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
                              Jamabandhi <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <input type="file"></input>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {showhide === "2" && (
              <div className="card">
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
                          Declaration of Third-Party Rights 
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
                            Declaration IDW Works{" "}
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
                            Revised Layout Plan (same format as uploaded at the time of license application
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
                            EDC availed or not e.g. surrounding roads are constructed or not {" "}
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
                            Area falling under 24m road /service road or sector dividing road{" "}
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
                            Area falling under 24m road /service road or sector dividing road and green belt If yes{" "}
                            <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <fieldset>
                              <Form.Group as={Row} className="mb-12">
                                <Row>
                                  <Col className="col-3">
                                    <Form.Check
                                      type="radio"
                                      label="Yes"
                                      name="formHorizontalRadios"
                                      id="formHorizontalRadios1"
                                      value="3"
                                      onChange={(e) => handleselects(e)}
                                    />
                                  </Col>
                                  <Col className="col-3">
                                    <Form.Check
                                      type="radio"
                                      label="No"
                                      name="formHorizontalRadios"
                                      id="formHorizontalRadios2"
                                      value="10"
                                      onChange={(e) => handleselects(e)}
                                    />
                                  </Col>
                                </Row>
                              </Form.Group>
                            </fieldset>
                          </td>
                        </tr>
                        </tbody>
                    </table>

                    {selects === "3" && (
                      <table class="table">
                        <tbody>
                        <tr>
                          <th scope="row">7</th>
                          <td>
                            {" "}
                            Gift Deed 
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
                            Mutation.
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
                            Jamabandhi  <span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file"></input>
                          </td>
                        </tr>
                        
                        
                      </tbody>
                    </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* <div>
            {showhide === "3" && (
              <div className="card">
                <div class="bordere">
                  <div class="table-responsive">
                    <table class="table">
                     
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
                            ‘Developer, filed through its authorized signatory,
                            specifically designated for the purpose; as well as
                            from the ‘land owner licensees’, in person (not
                            through GPA/SPA assignees), to the proposed
                            change/assignment
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
                            rights in the colony. In case no third-party rights
                            are claimed to have been created in the colony, an
                            affidavit to the said effect be also submitted by
                            the existing developer{" "}
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
                            Documents about the Technical and Financial Capacity
                            of the ‘new entity’ proposed to be inducted as a
                            ‘Developer’ or ‘shareholder(s)’ as per prescribed
                            policy parameters for grant of license{" "}
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
          </div> */}
        </Row>
        {/* <Row>
            <div>
                { selects === "4" && (
                    <div  className="card">
                  <div class="bordere">
                    <div class="table-responsive">
                      <table class="table">
                    
                        <thead>
                          <tr>
                            <th scope="col">Sr.No</th>
                            <th scope="col">Field Name</th>
                            <th scope="col">Upload Documents</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th scope="row">6</th>
                            <td>
                              {" "}
                              Gift Deed
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
                              Mutation
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
                              Jamabandhi <span style={{ color: "red" }}>*</span>
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
            </Row> */}

        <Form>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default SurrenderLic;
