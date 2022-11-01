import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Col, Row } from "react-bootstrap";
import axios from "axios";

function ModalChild(props) {
  const smShow = props.displaymodal;
  const setSmShow = useState(false);
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [iscrosschecked, setCrosschecked] = useState("");
  const [warningorred, setwarningOrred] = useState("#DAA520");
  const [yesOrNoClicked, setIsYesorNoClicked] = useState(true);

  const handlemodalsubmit = async () => {
    props.passmodalData({ data: { label: iscrosschecked, Remarks: RemarksDeveloper, color: warningorred } });
    const postData = {
      RequestInfo: {
        apiId: "Rainmaker",
        action: "_create",
        did: 1,
        key: "",
        msgId: "20170310130900|en_IN",
        ts: 0,
        ver: ".01",
        authToken: "80458c19-3b48-4aa8-b86e-e2e195e6753a",
        userInfo: {
          uuid: "5fe074f2-c12d-4a27-bd7b-92d15f9ab19c",
          name: "rahul7",
          userName: "rahul7",
          tenantId: "hr",
          id: 97,
          mobileNumber: "7895877833",
        },
      },
      EgScrutiny: {
        id: 97,
        applicationId: 123,
        comment: RemarksDeveloper.data,
        createdOn: 10,
        fieldValue: "avc",
        field_d: 12,
        isApproved: yesOrNoClicked,
        userid: 12,
      },
    };

    const Resp = await axios.post("", postData, {}).then((response) => {
      return response.data;
    });
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
        <Modal.Title id="example-modal-sizes-title-sm">{props.labelmodal}</Modal.Title>
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
          label="Yes"
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
          label="No"
          name="group0"
          inline
        ></Form.Check>
        <Col xs={12} md={4}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Remarks</Form.Label>
            <Form.Control type="text" placeholder="" autoFocus onChange={(e) => setDeveloperRemarks({ data: e.target.value })} />
          </Form.Group>
          <div class="col-md-4 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
            <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
              Submit
            </Button>
          </div>
        </Col>
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
