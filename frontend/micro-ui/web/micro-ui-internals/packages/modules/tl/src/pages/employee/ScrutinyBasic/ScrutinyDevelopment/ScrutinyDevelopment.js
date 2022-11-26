import React, { useState } from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";

const windowHeight = window !== undefined ? window.innerHeight : null;
const ScrutinyDevelopment = (props) => {
  const [approval, setDisapproval] = useState(false);
  const remarkDataResp = props.remarkData;
  // const sumdataTime = props.remarksum;
  // const [applicationId, setApplicationId] = useState("");
  return (
    <Container
      className="justify-content-center"
      style={{
        top: windowHeight * 0.3,
        minWidth: "90%",
        maxWidth: "98%",
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
      <Row>
        <div class="WhatsNewCard" style={{ backgroundColor: "#ddf2cf" }}>
          <Row>
            {/* {sumdataTime !== null ? (
              sumdataTime.map((el) => {
                return ( */}

            <Col>
              <b>Application Id.</b>
              {/* {el.applicationId} */}
            </Col>
            <Col>
              <b>Service Id.</b>

              {/* {el.serviceId} */}
            </Col>
            <Col>
              <b> Diary No.</b>

              {/* {el.documentId} */}
            </Col>

            {/* );
              })
            ) : (
              <p></p>
            )} */}
          </Row>
          <hr style={{ marginTop: 5, marginBottom: 5 }}></hr>
          {remarkDataResp !== null ? (
            remarkDataResp.map((el, i) => {
              return (
                <div>
                  <Row style={{ marginBottom: 5 }}>
                    <Col>
                      <b>{el.fieldIdL}</b>
                    </Col>
                    <Col>
                      {" "}
                      <b>{el.fieldValue}</b>
                    </Col>
                    <Col>
                      <b>{el.isApproved ? "Approved" : "Disapproved"}</b>
                    </Col>
                  </Row>

                  <Row>
                    <p>
                      <i>{el.comment}</i>
                    </p>
                  </Row>

                  <Row style={{ margin: 4 }}>
                    <b style={{ textAlign: "right" }}>{el.userid}</b>
                  </Row>

                  <Row style={{ margin: 4 }}>
                    <b style={{ textAlign: "right" }}>{new Date(el.ts).toLocaleDateString('en-GB')} {new Date(el.ts).toLocaleTimeString('en-US')}</b>
                  </Row>
                </div>
              );
            })
          ) : (
            <p></p>
          )}
        </div>
      </Row>
    </Container>
  );
};

export default ScrutinyDevelopment;
