import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Col, Row } from "react-bootstrap";

function ModalChild(props) {
  const smShow = props.displaymodal;
  const setSmShow = useState(false);
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [iscrosschecked, setCrosschecked] = useState("");
  const [warningorred, setwarningOrred] = useState("#DAA520");

  const handlemodalsubmit = () => {
    props.passmodalData({ data: { label: iscrosschecked, Remarks: RemarksDeveloper, color: warningorred } });
  };
  console.log("smshow", smShow);
  return (
    <Modal size="sm" show={smShow} aria-labelledby="example-modal-sizes-title-sm" onHide={() => setSmShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">{props.labelmodal}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Form.Check
          value={props.labelmodal}
          onChange={(e) => {
            props.setColor({ yes: true, no: false });
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
        <Col xs={8} md={4}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Remarks</Form.Label>
            <Form.Control type="text" placeholder="" autoFocus onChange={(e) => setDeveloperRemarks({ data: e.target.value })} />
          </Form.Group>
        </Col>
        <div class="col-md-4 bg-light text-right" style={{ position: "relative", marginBottom: 40 }}>
          <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
            Submit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalChild;
