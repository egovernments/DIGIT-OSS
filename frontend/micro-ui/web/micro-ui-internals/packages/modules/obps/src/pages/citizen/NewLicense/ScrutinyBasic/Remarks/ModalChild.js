import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Col, Row } from "react-bootstrap";
import axios from "axios";

function ModalChild(props) {
  const smShow = props.displaymodal;
  const setSmShow = useState(false);
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [RemarksEntered, setRemarksEntered] = useState("");
  const [iscrosschecked, setCrosschecked] = useState("");
  const [warningorred, setwarningOrred] = useState("#DAA520");
  const [yesOrNoClicked, setIsYesorNoClicked] = useState(true);
  const inputFieldValue = props.fieldValue;
  const inputFieldLabel = props.labelValue;
  const dateTime = new Date();

  const handlemodalsubmit = async () => {
    props.passmodalData({ data: { label: iscrosschecked, Remarks: RemarksDeveloper.data, color: warningorred } });
    const postData = {
      requestInfo: {
        api_id: "1",
        ver: "1",
        ts: null,
        action: "create",
        did: "",
        key: "",
        msg_id: "",
        requester_id: "",
        auth_token: null,
      },
      egScrutiny: {
        applicationId: "123",
        comment: RemarksDeveloper.data,
        fieldValue: inputFieldValue,
        fieldIdL: iscrosschecked,
        isApproved: yesOrNoClicked,
        userid: "123",
        serviceId: "123",
        documentId: null,
        ts: dateTime.toUTCString(),
      },
    };

    try {
      const Resp = await axios.post("/land-services/egscrutiny/_create", postData, {}).then((response) => {
        return response.data;
      });
    } catch (error) {
      console.log(error);
    }
    props.remarksUpdate({ data: RemarksDeveloper.data });
    console.log("response from API", Resp);
  };
  console.log("smshow", smShow);
  return (
    <Modal
      size="lg"
      className="modal-lg modal-center"
      show={smShow}
      // aria-labelledby="example-modal-sizes-title-sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50% , -50%)" }}
      onHide={() => setSmShow(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">
          <Row style={{ display: "flex" }}>
            <Col xs={4} md={4} style={{ marginRight: "100px" }}>
              {" "}
              {props.labelmodal}
            </Col>
            <Col xs={4} md={4}>
              <h5 style={{ fontSize: "15", borderColor: "#C3C3C3", fontStyle: "none" }}>
                <i>{inputFieldValue}</i>
              </h5>
            </Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Form.Check
          value={props.labelmodal}
          onChange={(e) => {
            props.setColor({ yes: true, no: false });
            setIsYesorNoClicked(true);
            setCrosschecked(e.target.value), setwarningOrred({ data: "#09cb3d" }), props.isYesorNoChecked({ data: true });
          }}
          type="radio"
          id="default-radio"
          // label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          label="Approved"
          name="group0"
          inline
        ></Form.Check>
        <Form.Check
          onChange={(e) => {
            props.setColor({ yes: false, no: true });
            setIsYesorNoClicked(false);
            setCrosschecked(e.target.value), setwarningOrred({ data: "#ff0000" }), props.isYesorNoChecked({ data: false });
          }}
          value={props.labelmodal}
          type="radio"
          id="default-radio"
          // label={<CancelIcon color="error" />}
          label="Disapproved"
          name="group0"
          inline
        ></Form.Check>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Col xs={12} md={12}>
            <Form.Label style={{ margin: 5 }}>Remarks</Form.Label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              placeholder="Enter your Remarks"
              autoFocus
              onChange={(e) => {
                setDeveloperRemarks({ data: e.target.value });
                // setRemarksEntered(e.target.value);
              }}
              rows="3"
            />
            {/* <Form.Control type="text" /> */}
          </Col>
        </Form.Group>
        <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
            Submit
          </Button>
        </div>
        {/* <div class="col-md-4 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
            Submit
          </Button>
        </div> */}
      </Modal.Body>
    </Modal>
  );
}

export default ModalChild;
