import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function CompletionLic() {
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
              COMPLETION CERTIFICATE IN LICENSE COLONY
            </h4>
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    License No . <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="number" placeholder="Enter License No" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title="The license is valid at the time of completion certificate"
                  >
                    completion certificate
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" placeholder="Enter Case Number" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" EDC and IDC be fully paid and bank guarantees on account of
                    IDW are valid."
                  >
                    EDC and IDC be fully paid
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Status of complaint if any.
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Status of total community sites/approval of zoning/building
                    plans and occupation certificate granted."
                  >
                    occupation certificate
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Status of NPNL plots. (detail of NPNL plots and rates
                    approval for NPNL)"
                  >
                    Status of NPNL plots.
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Status of handing over EWS plots to housing board/allottees"
                  >
                    Housing board/allottees
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Status regarding handing over of park/internal road/public
                    utility to the concerned authority"
                  >
                    concerned authority
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Handing over community sites to the Government agency and
                    constructed by the Government."
                  >
                    Handing over community sites
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>

              {/* <Col className="col-4">
              <Form.Group  controlId="formGridState">
                <Form.Label>
                 Amount <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" required={true} disabled={true} />
              </Form.Group>
              </Col>
              <Col className="col-4">
              <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                Pay
                </Button></Col> */}
            </Row>
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
                        The service plan/estimate copy of approved
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
                        The electrical Service plan is approved and verification
                        of service is laid as per the approval.{" "}
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
                        Transfer of licensed land to the Government agency
                        falling under 18/24 mtr. Road/green belt/sector road.{" "}
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
                        occupation certificate In case of (Group Housing,
                        Commercial, IT Colony){" "}
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
                        updated compliance with Rules 24, 26(2), 27 & 28.{" "}
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
                        Submit a report regarding infrastructure augmentation
                        charges.<span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">7</th>
                      <td>
                        {" "}
                        Third-party audit on 15% profitability and CA
                        certificate regarding 15% profit.
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
                        Status of development work along with site photographs
                        and CD/DVD regarding completion of public health
                        services, and internal roads{" "}
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
                        Report regarding functional of internal services and
                        connection of external services of HUDA/MC
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">10</th>
                      <td>
                        {" "}
                        Affidavit of no unauthorized construction/addition/
                        alteration after the issuance of completion certificate.
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">11</th>
                      <td>
                        {" "}
                        NOC from MOEF required.{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">12</th>
                      <td>
                        {" "}
                        NOC from fire safety and certificate from structural
                        stability.<span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input type="file"></input>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">13</th>
                      <td>
                        {" "}
                        Access permission from NHAI if the site abuts with
                        NH/Scheduled Road and status regarding construction
                        within green belt along NH/Scheduled road.{" "}
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
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CompletionLic;
