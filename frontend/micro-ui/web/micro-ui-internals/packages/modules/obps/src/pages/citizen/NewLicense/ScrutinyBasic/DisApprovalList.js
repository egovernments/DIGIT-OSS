import React, { useState, useEffect } from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";

const windowHeight = window !== undefined ? window.innerHeight : null;
const DisApprovalList = (props) => {
  const [personalInfoList, setperonaldisapprovallist] = useState([]);
  const [personalCheckedLIst, setperonaldisapprovalCheckedlist] = useState([]);
  const [generalInfoList, setgeneraldisapprovallist] = useState([]);
  const [generalCheckedLIst, setgeneraldisapprovalCheckedlist] = useState([]);
  const [developerInfoList, setdeveloperdisapprovallist] = useState([]);
  const [developerCheckedLIst, setdeveloperdisapprovalCheckedlist] = useState([]);
  const [appliedLandInfoList, setappliedisapprovallist] = useState([]);
  const [appliedCheckedLIst, setappliedisapprovalCheckedlist] = useState([]);
  // const [licenseDetailsInfoList, setlicenseDetailsdisapprovallist] = useState([]);
  // const [licenseDetailsCheckedLIst, setlicenseDetailsdisapprovalCheckedlist] = useState([]);

  const persona = props.disapprovallistPersonal;
  const personalCheckedlist = props.disapprovalCheckedPersonal;
  const general = props.disapprovallistGeneral;
  const generalCheckedlist = props.disapprovalCheckedGeneral;
  const developer = props.disapprovallistDeveloper;
  const developerCheckedlist = props.disapprovaCheckedDeveloper;
  const appliedLand = props.disapprovallistAppliedLand;
  const appliedLandCheckedList = props.disapprovalCheckedAppliedLand;
  // const licenseDetails = props.disapprovallistlicenseDetails;
  // const licenseDetailsCheckedlist = props.disapprovalCheckedlicenseDetails;

  const dataStor = props.dataList;

  useEffect(() => {
    setperonaldisapprovallist(props.disapprovallistPersonal);
  }, [persona]);
  console.log("disaaproval side data =", persona);

  useEffect(() => {
    setperonaldisapprovalCheckedlist(props.disapprovalCheckedPersonal);
  }, [personalCheckedlist]);
  console.log("disaaproval side data Checkedlist=", personalCheckedlist);

  // useEffect(() => {
  //   setlicenseDetailsdisapprovallist(props.disapprovallistlicenseDetails);
  // }, [licenseDetails]);
  // console.log("disaaproval side data =", licenseDetails);

  // useEffect(() => {
  //   setlicenseDetailsdisapprovalCheckedlist(props.disapprovalCheckedlicenseDetails);
  // }, [licenseDetailsCheckedlist]);
  // console.log("disaaproval side data Checkedlist=", licenseDetailsCheckedlist);

  useEffect(() => {
    setgeneraldisapprovallist(props.disapprovallistGeneral);
  }, [general]);
  console.log("disaaproval side data =", general);

  useEffect(() => {
    setgeneraldisapprovalCheckedlist(props.disapprovalCheckedGeneral);
  }, [generalCheckedlist]);
  console.log("disaaproval side data Checkedlist=", generalCheckedlist);

  useEffect(() => {
    setdeveloperdisapprovallist(props.disapprovallistDeveloper);
  }, [developer]);
  console.log("disaaproval side data =", developer);

  useEffect(() => {
    setdeveloperdisapprovalCheckedlist(props.disapprovaCheckedDeveloper);
  }, [developerCheckedlist]);
  console.log("disaaproval side data Checkedlist=", developerCheckedlist);

  useEffect(() => {
    setappliedisapprovallist(props.disapprovallistAppliedLand);
  }, [appliedLand]);
  console.log("disaaproval side data =", appliedLand);

  useEffect(() => {
    setappliedisapprovalCheckedlist(props.disapprovalCheckedAppliedLand);
  }, [appliedLandCheckedList]);
  console.log("disaaproval side data Checkedlist=", appliedLandCheckedList);
  console.log("general data", generalCheckedlist);
  return (
    // <Container>
    //   <Row>
    <Card>
      <Card.Header>
        <Card.Title style={{ fontFamily: "Roboto", fontSize: 30, fontWeight: "bold" }}>{/* Disapproval List */}</Card.Title>
      </Card.Header>
      <Card.Body style={{ overflowY: "auto", height: 350, maxWidth: "100%", border: "soild" }}>
        <Form>
          <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginBottom: 2 }}></h2>
          <Row>
            <Col xxl lg="1">
              <h5 style={{ textAlign: "center" }} className="fw-bold">
                Sr. No.
              </h5>
            </Col>
            <Col xxl lg="3">
              <h5 style={{ textAlign: "center" }} className="fw-bold">
                Field Name
              </h5>
            </Col>
            <Col xxl lg="3">
              <h5 style={{ textAlign: "center" }} className="fw-bold">
                Status
              </h5>
            </Col>
            <Col xxl lg="5">
              <h5 style={{ textAlign: "center" }} className="fw-bold">
                Remark
              </h5>
            </Col>
          </Row>
          {dataStor.egScrutiny !== undefined && dataStor.egScrutiny !== null && dataStor.egScrutiny.length > 0 ? (
            dataStor.egScrutiny.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>

                <Col xxl lg="3">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.fieldIdL}</h4>
                </Col>

                <Col xxl lg="3">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.isApproved ? "Approved" : "Disapproved"} </h4>
                </Col>

                <Col xxl lg="5">
                  <Form.Control type="text" placeholder={el.comment}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>
                No Personal Information Disapproval list to show right now
              </h2>
            </div>
          )}
          {/* <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Personal Information approval</h2>
          {personalCheckedlist !== undefined && personalCheckedlist !== null && personalCheckedlist.length > 0 ? (
            personalCheckedlist.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>
                <Col xxl lg="3">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.fieldIdL}</h4>
                </Col>
                <Col xxl lg="3">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.isApproved} </h4>
                </Col>
                <Col xxl lg="5">
                  <Form.Control type="text" placeholder={el.comment}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>No Personal Information Approval list to show right now</h2>
            </div>
          )}
          <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>General Information Disaaproval</h2>
          {generalInfoList !== undefined && generalInfoList !== null && generalInfoList.length > 0 ? (
            generalInfoList.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h5>Sr. No</h5>
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>

                <Col xxl lg="3">
                  <h5>field Name</h5>
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.fieldIdL}</h4>
                </Col>
                <h5>Status</h5>
                <Col xxl lg="3">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.isApproved} </h4>
                </Col>
                <h5 style={{ textAlign: "center" }}>Remark</h5>
                <Col xxl lg="5">
                  <Form.Control type="text" placeholder={el.comment}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>No General Information Disapproval list to show right now</h2>
            </div>
          )}
          <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>General Information Aaproval</h2>
          {generalCheckedlist !== undefined && generalCheckedlist !== null && generalCheckedlist.length > 0 ? (
            generalCheckedlist.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>
                <Col xxl lg="5">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.label}</h4>
                </Col>
                <Col xxl lg="6">
                  <Form.Control type="text" placeholder={el.Remarks.data}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>No General Information Disapproval list to show right now</h2>
            </div>
          )}

          <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>Purpose Information Disaaproval</h2>
          {developerInfoList !== undefined && developerInfoList !== null && developerInfoList.length > 0 ? (
            developerInfoList.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>
                <Col xxl lg="5">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.label}</h4>
                </Col>
                <Col xxl lg="6">
                  <Form.Control type="text" placeholder={el.Remarks.data}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>No Purpose Information Disapproval list to show right now</h2>
            </div>
          )}
          <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>Purpose Information Aaproval</h2>
          {developerCheckedlist !== undefined && developerCheckedlist !== null && developerCheckedlist.length > 0 ? (
            developerCheckedlist.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>
                <Col xxl lg="5">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.label}</h4>
                </Col>
                <Col xxl lg="6">
                  <Form.Control type="text" placeholder={el.Remarks.data}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>No Purpose Information Disapproval list to show right now</h2>
            </div>
          )}
          <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>
            Applied Land Information Disaaproval
          </h2>
          {appliedLandInfoList !== undefined && appliedLandInfoList !== null && appliedLandInfoList.length > 0 ? (
            appliedLandInfoList.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>
                <Col xxl lg="5">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.label}</h4>
                </Col>
                <Col xxl lg="6">
                  <Form.Control type="text" placeholder={el.Remarks.data}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>
                No Applied Land Information Disapproval list to show right now
              </h2>
            </div>
          )}
          <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>
            Applied Land Information Aaproval
          </h2>
          {appliedCheckedLIst !== undefined && appliedCheckedLIst !== null && appliedCheckedLIst.length > 0 ? (
            appliedCheckedLIst.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>
                <Col xxl lg="5">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.label}</h4>
                </Col>
                <Col xxl lg="6">
                  <Form.Control type="text" placeholder={el.Remarks.data}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>
                No Applied Land Information Disapproval list to show right now
              </h2>
            </div>
          )} */}

          {/* <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Personal Information Disaaproval</h2>
          {licenseDetailsInfoList !== undefined && licenseDetailsInfoList !== null && licenseDetailsInfoList.length > 0 ? (
            licenseDetailsInfoList.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>
                <Col xxl lg="5">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.label}</h4>
                </Col>
                <Col xxl lg="6">
                  <Form.Control type="text" placeholder={el.Remarks.data}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>
                No Personal Information Disapproval list to show right now
              </h2>
            </div>
          )}
          <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Personal Information approval</h2>
          {licenseDetailsCheckedlist !== undefined && licenseDetailsCheckedlist !== null && licenseDetailsCheckedlist.length > 0 ? (
            licenseDetailsCheckedlist.map((el, i) => (
              <Row key={i} style={{ marginBottom: 10 }}>
                <Col xxl lg="1">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{i + 1}</h4>
                </Col>
                <Col xxl lg="5">
                  <h4 style={{ fontSize: 14, fontFamily: "Roboto", fontWeight: "lighter" }}>{el.label}</h4>
                </Col>
                <Col xxl lg="6">
                  <Form.Control type="text" placeholder={el.Remarks.data}></Form.Control>
                </Col>
              </Row>
            ))
          ) : (
            <div>
              <h2 style={{ fontSize: 12, fontFamily: "Roboto", fontWeight: "lighter" }}>No Personal Information Approval list to show right now</h2>
            </div>
          )} */}
        </Form>
      </Card.Body>
      <Card.Footer>{/* <div style={{ position: "relative", float: "right" }}>
          <Button>Submit</Button>
        </div> */}</Card.Footer>
    </Card>
    //   </Row>
    // </Container>
  );
};

export default DisApprovalList;
