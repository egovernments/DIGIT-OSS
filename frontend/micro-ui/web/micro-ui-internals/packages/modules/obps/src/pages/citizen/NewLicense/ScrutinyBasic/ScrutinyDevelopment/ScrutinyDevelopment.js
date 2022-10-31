import React from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";

const windowHeight = window !== undefined ? window.innerHeight : null;
const ScrutinyDevelopment = (props) => {
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
        <Card>
          <Card.Header>
            <Card.Title style={{ fontFamily: "Roboto", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>Remarks</Card.Title>
          </Card.Header>
          <Card.Body style={{ overflowY: "auto", backgroundColor: "#C6C6C6" }}>
            <Form>
              <div>
                {/* <h2 style={{ fontSize: 18, fontFamily: "Roboto", fontWeight: "lighter" }}>No History list to show right now</h2> */}
                <div style={{ position: "relative", float: "left", margin: 5 }}>
                  <Button>Attach Document</Button>
                </div>
                <div style={{ position: "relative", float: "right", margin: 5 }}>
                  <Button>Noting Reference </Button>
                </div>
                {/* <div style={{ position: "relative", float: "right", margin: 5 , height: 35 }}>
                  <Button>Previw Current Noting</Button>
                </div> */}
                <Card style={{ marginTop: 5 }}>
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
                </Card>
                <Card style={{ marginTop: 5 }}>
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
                </Card>
              </div>
            </Form>
          </Card.Body>
          <Card.Footer>
            <div style={{ position: "relative", float: "right", margin: 5, height: 35 }}>
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
            </div>
          </Card.Footer>
        </Card>
      </Row>
    </Container>
  );
};

export default ScrutinyDevelopment;
