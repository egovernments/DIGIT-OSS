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
      {/* <Row>
      <Col>
        {el.applicationId}
      </Col>
      <Col>
        {el.serviceId}
      </Col>
      <Col>
        {el.documentId}
      </Col>
        </Row> */}
      {remarkDataResp !== null ? (
        remarkDataResp.map((el, i) => {
          return (
            <div class="WhatsNewCard" style={{ backgroundColor: "#D9FECF" }}>
              {/* <h2> &amp; Redressal</h2> */}
              <Row>
                <Col>
                  <b>{el.fieldIdL}</b>
                </Col>
                <Col>{el.fieldValue}</Col>
                <Col>{el.isApproved ? "Approved" : "Disapproved"}</Col>
              </Row>

              <Row>
                <p>{el.comment}</p>
              </Row>

              <Row>
                <h6 style={{ textAlign: "right" }}>{el.userid}</h6>
              </Row>

              <Row>
                <p style={{ textAlign: "right" }}>{new Date(el.ts).toLocaleDateString()}</p>
              </Row>
            </div>
          );
        })
      ) : (
        <p></p>
      )}
    </Container>
  );
};

export default ScrutinyDevelopment;
