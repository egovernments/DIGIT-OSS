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
        <Row>
          <Col className="ms-auto" md={4} xxl lg="12">
            <b>Application NO: </b>
          </Col>
        </Row>
        {remarkDataResp !== null ? (
          remarkDataResp.map((el, i) => {
            return (
              <div class="WhatsNewCard" style={{ backgroundColor: "#D9FECF" }}>
                {/* <h2> &amp; Redressal</h2> */}
                <Row>
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

                  <p>{el.comment}</p>
                </Row>

                <b style={{ textAlign: "left" }}>User ID :{el.userid}</b>
                <b style={{ textAlign: "right" }}>Date : 01-11-2022 </b>
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
