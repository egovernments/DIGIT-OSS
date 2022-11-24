import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useStyles } from "./styles/modalChild.style";

function ModalChild(props) {
  const classes = useStyles();
  const smShow = props.displaymodal;
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [RemarksEntered, setRemarksEntered] = useState("");
  const [yesOrNoClicked, setIsYesorNoClicked] = useState();
  const [status,setStatus] = useState("");
  const inputFieldValue = props.fieldValue;
  const inputFieldLabel = props.labelValue;
  const dateTime = new Date();

  const handlemodalsubmit = async () => {
    if(status){
      console.log("log",props.labelmodal)
      props.passmodalData({ data: { label: props.labelmodal, Remarks: RemarksDeveloper.data, isApproved:status==="approved"?true:false } });
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
          fieldIdL: props.labelmodal,
          isApproved: status==="approved"?true:false,
          userid: "123",
          serviceId: "123",
          documentId: null,
          ts: dateTime.toUTCString(),
        },
      };
  
      try {
        const Resp = await axios.post("/land-services/egscrutiny/_create?status=submit", postData, {}).then((response) => {
          return response.data;
        });
      } catch (error) {
        console.log(error);
      }
      props.remarksUpdate({ data: RemarksDeveloper.data });
      console.log("response from API", Resp);
    } else {
      props.passmodalData();
    }
  };
  console.log("smshow", smShow);

  useEffect(()=>{
    console.log("loggg",props.selectedFieldData)
    if(props.selectedFieldData){
      console.log("loggg changing123...",props.selectedFieldData);
      setStatus(props.selectedFieldData.isApproved?"approved":"disapproved");
      setDeveloperRemarks({data:props.selectedFieldData.comment?props.selectedFieldData.comment:""});
      // setDeveloperRemarks({data:props.selectedFieldData.isApproved?"approved":"disapproved"});
    }else {
      console.log("loggg setting null...",props.selectedFieldData)
      setStatus(null);
      setDeveloperRemarks({data:""})
    }
  },[props.selectedFieldData])

  return (
    <Modal
      size="lg"
      className="modal-lg modal-center"
      show={smShow}
      // aria-labelledby="example-modal-sizes-title-sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50% , -50%)" }}
      onHide={props.onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">
            <div>
              <h3>{props.labelmodal}</h3>
              <p className={classes.subHead}>{inputFieldValue}</p>
            </div>

          {/* <Row>
            <Col xs={4} md={4}>
              {" "}
              {props.labelmodal}
            </Col>
            <Col xs={4} md={4}>
              <h5 style={{ fontSize: "15", borderColor: "#C3C3C3", fontStyle: "none" }}>
                <i>{inputFieldValue}</i>
              </h5>
            </Col>
          </Row> */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Form.Check
          checked={status === "approved"}
          onChange={() => {
            setStatus("approved")
          }}
          type="radio"
          id="default-radio"
          // label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          label="Approved"
          name="group0"
          inline
        ></Form.Check>
        <Form.Check
         checked={status === "disapproved"}
          onChange={(e) => {
            setStatus("disapproved")
          }}
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
              value={RemarksDeveloper.data}
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
