import React, { useState } from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";

const windowHeight = window !== undefined ? window.innerHeight : null;
const ScrutinyDevelopment = (props) => {
  const [approval, setDisapproval] = useState(false);
  const remarkDataResp = props.remarkData;
  return (
    <Container
      className="justify-content-center"
      style={{
        top: windowHeight * 0.3,
        minWidth: "90%",
        maxWidth: "100%",
        maxHeight: "100%",
        minHeight: "40%",
      }}
    >
      <Row>
        {/* <Card>
          <Card.Header>
            <Card.Title>
              <div style={{ display: "flex" }}>
                <h5 style={{ margin: 5 }}>Application Number </h5>
                <input class="form-control" id="exampleFormControlT"></input>
              </div>
            </Card.Title>
          </Card.Header>
          <Card.Body style={{ overflowY: "auto", backgroundColor: "#cefad0" }}>
            <Form>
              <div>
                <div style={{ position: "relative", float: "left", margin: 5 }}>
                  <Button>Attach Document</Button>
                </div>
                <div style={{ position: "relative", float: "right", margin: 5 }}>
                  <Button>Noting Reference </Button>
                </div> */}

        {/* <Card style={{ marginTop: 5 }}>
                  <Row className="ml-auto" style={{ marginBottom: 5 }}>
                    <Col md={4} xxl lg="3">
                      <Form.Label>
                        <b>Select Activity</b> <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Select type="text" placeholder="Activity">
                        <option value="">--Select Option--</option>
                        <option value="01">Approved by Competent Authority</option>
                        <option value="02">CLU Approved</option>
                        <option value="03">CLU Rejected</option>
                        <option value="04">CLU Returned</option>
                        <option value="05">Dispatch Letter</option>
                        <option value="06">DTP Report Forwarded to Directorate</option>
                        <option value="07">External Agency</option>
                        <option value="08">ForPSTCP/GOVT Approval</option>
                        <option value="12">LOI Approved</option>
                      </Form.Select>
                    </Col>
                    <Col md={4} xxl lg="3">
                      <Form.Label>
                        <b>Select Designation</b> <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Select type="text" placeholder="Activity">
                        <option value="">--Select Option--</option>
                        <option value="01">Accounts Field</option>
                        <option value="02">Assistant Field</option>
                        <option value="03">ATP Field</option>
                        <option value="04">Clerk</option>
                        <option value="05">Clerk Field</option>
                        <option value="06">Deputy Superintendert</option>
                        <option value="07">Deputy Superintendert Field</option>
                        <option value="08">Diarist Field</option>
                        <option value="09">Draftman Field</option>
                        <option value="10">DTP Field</option>
                        <option value="11">Field Investigator</option>
                        <option value="12">Junior Engineer Field</option>
                        <option value="13">Patwari Field</option>
                        <option value="14">Planning Assistant Field</option>
                        <option value="15">Steno Typist Field</option>
                        <option value="16">Tracer Field</option>
                      </Form.Select>
                    </Col>
                    <Col md={4} xxl lg="3">
                      <Form.Label>
                        <b>Select User</b> <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Select type="text" placeholder="Activity">
                        <option value="">--Select Option--</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <div style={{ position: "relative", float: "right" }}>
                        <Button>Send File</Button>
                      </div>
                    </Col>
                  </Row>
                </Card> */}
        {/* <Card style={{ marginTop: 5 }}>
                  <Card.Header>
                    <Card.Title style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
                      Previw Current Noting
                    </Card.Title>
                  </Card.Header>
                  <Form>
                    <div class="form-group">
                      <label for="exampleFormControlTextarea1"></label>
                      <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                  </Form>
                </Card> */}
        {/* <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Feild Name</th>
                      <th scope="col">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {remarkDataResp !== null ? (
                      remarkDataResp.map((el, i) => {
                        return (
                          <tr>
                            <th scope="row">{i + 1}</th>
                            <td>{el.fieldValue}</td>
                            <td>
                              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder={el.comment}></textarea>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <th scope="row">1</th>
                        <td>Null</td>
                        <td>
                          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Null"></textarea>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Form>
          </Card.Body>
          <Card.Footer> */}
        {/* <div style={{ position: "relative", float: "right", margin: 5, height: 35 }}>
              <Button>Lett: Created/Approve/Send</Button>
            </div>
            <div style={{ position: "relative", float: "right", margin: 5, height: 35 }}>
              <Button>Send Obs to application</Button>
            </div>
            <div style={{ position: "relative", float: "right", margin: 5, height: 35 }}>
              <Button>PUC</Button>
            </div>
            <div style={{ position: "relative", float: "right", margin: 5, height: 35 }}>
              <Button>Correspodence Page</Button>
            </div>
            <div style={{ position: "relative", float: "right", margin: 5, height: 35 }}>
              <Button>Field report</Button>
            </div>
            <div style={{ position: "relative", float: "left", margin: 5, height: 35 }}>
              <Button>History Logs</Button>
            </div>
            <div style={{ position: "relative", float: "left", margin: 5, height: 35 }}>
              <Button>Payment Details</Button>
            </div>
            <div style={{ position: "relative", float: "right" }}>
              <Button>Submit</Button>
            </div> */}
        {/* <Row className="ms-auto" style={{ marginBottom: 20 }}>
              <Col md={4} xxl lg="4">
                <div style={{ display: "flex" }}>
                  <h5 style={{ margin: 5 }}>User Name</h5>
                  <input class="form-control" id="exampleFormControlT"></input>
                </div>

                <input type="text" id="appt" name="appt"></input>
              </Col>
              <Col md={4} xxl lg="4">
                <div style={{ display: "flex" }}>
                  <h5>Date</h5>
                  <input style={{ margin: 5 }} class="form-control" type="date" id="birthday" name="birthday"></input>
                </div>
              </Col>
              <Col md={4} xxl lg="4">
                <div style={{ display: "flex" }}>
                  <h5>Time</h5>
                  <input style={{ margin: 5 }} class="form-control" type="time" id="appt" name="appt" min="09:00" max="18:00" required></input>
                </div>
              </Col>
            </Row>
          </Card.Footer>
        </Card> */}
        <Row>
          <Col className="ms-auto" md={4} xxl lg="12">
            <b>Application NO: </b>
          </Col>
        </Row>
        {remarkDataResp !== null ? (
          remarkDataResp.map((el, i) => {
            return (
              <div class="WhatsNewCard" style={{ backgroundColor: "#d0f0c0" }}>
                <Row>
                  {/* <Col className="ms-auto" md={4} xxl lg="4">
                    <b> S.No</b>
                  </Col> */}
                  {/* <Col className="ms-auto" md={4} xxl lg="4">
                    <b>Use Name</b>
                  </Col>
                  <Col className="ms-auto" md={4} xxl lg="4">
                    <b>Remarks</b>
                  </Col> */}
                </Row>
                {/* <h2> &amp; Redressal</h2> */}
                <Row>
                  {/* <Col className="ms-auto" md={4} xxl lg="12"></Col>

                  <Col className="ms-auto" md={4} xxl lg="12"></Col>

                  <Col className="ms-auto" md={4} xxl lg="12"></Col> */}
                  <Row>
                    <div className="col-md-6">
                      <b>{el.fieldIdL}</b> <b>{el.fieldValue}</b>
                    </div>
                    <div className="col-md-6">
                      <b>{el.isApproved ? "Approved" : "Disapproved"}</b>
                    </div>
                  </Row>
                  <Row>
                    <b>Remarks</b>
                  </Row>

                  <p>
                    {el.comment}
                    {/* <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Null"></textarea> */}
                  </p>
                </Row>

                <b style={{ textAlign: "left" }}>User ID :</b>
                <b style={{ align: "right" }}>Date : 01-11-2022 </b>
              </div>
            );
          })
        ) : (
          <p></p>
        )}
      </Row>
    </Container>
  );
};

export default ScrutinyDevelopment;
