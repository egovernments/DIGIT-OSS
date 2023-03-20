import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useStyles } from "./styles/modalChild.style";
import { useParams } from "react-router-dom";
import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";


function ModalChild(props) {
  const {handleRoles, handleGetFiledsStatesById, handleGetRemarkssValues , bussinessService} = useContext(ScrutinyRemarksContext,);
  const applicationStatus = props.applicationStatus ;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const classes = useStyles();
  const smShow = props.displaymodal;
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [RemarksEntered, setRemarksEntered] = useState("");
  const [yesOrNoClicked, setIsYesorNoClicked] = useState();
  const [status, setStatus] = useState("");
  const inputFieldValue = props.fieldValue;
  const inputFieldLabel = props.labelValue;
  const dateTime = new Date();
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const { id } = useParams();
  const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
  const filterDataRole = userRolesArray?.[0]?.code;
  const designation = userRolesArray?.[0]?.name;

  console.log("usern23233" , userRolesArray );
  console.log("usern23" , filterDataRole );
  console.log("usern23434" , designation );


  const handlemodalsubmit = async () => {
    if (status) {
      console.log("log", props.labelmodal);
      props.passmodalData({ data: { label: props.labelmodal, Remarks: RemarksDeveloper.data, isApproved: status === "In Order" ? true : false } });
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
          authToken: authToken,
        },
        egScrutiny: {
          applicationId: id,
          comment: RemarksDeveloper.data,
          fieldValue: inputFieldValue,
          fieldIdL: props.labelmodal,
          isApproved: status,
          isLOIPart: status === "Conditional" ?  true : null ,
          userid: userInfo?.id || null,
          serviceId: "123",
          documentId: null,
          ts: dateTime.toUTCString(),
          bussinessServiceName : bussinessService,
          designation : designation,
          name : userInfo?.name || null,
          employeeName : userInfo?.name || null,
         role : filterDataRole,
         applicationStatus : applicationStatus
        },
      };

      try {
        const Resp = await axios.post("/land-services/egscrutiny/_create?status=submit", postData, {}).then((response) => {
          return response.data;
        });
      } catch (error) {
        console.log(error);
      }
      handleGetFiledsStatesById(id);
      handleGetRemarkssValues(id);
      handleRoles(id)
      console.log("response from API", Resp);
      props?.remarksUpdate({ data: RemarksDeveloper.data });
    } else {
      props?.passmodalData();
    }
  };
  console.log("smshow", smShow);
  console.log("applicationStatus", applicationStatus);

  useEffect(() => {
    if (props.selectedFieldData) {
      setStatus(props.selectedFieldData.isApproved ? "In Order" : "Not In Order");
      setDeveloperRemarks({ data: props.selectedFieldData.comment ? props.selectedFieldData.comment : "" });
      // setDeveloperRemarks({data:props.selectedFieldData.isApproved?"In Order":"Not In Order"});
    } else {
      setStatus(null);
      setDeveloperRemarks({ data: "" });
    }
  }, [props.selectedFieldData]);

  console.log("Isdata" , status )

  // let empCode = "EMPLOYEE";
  

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
          checked={status === "In Order"}
          onChange={() => {
            setStatus("In Order");
          }}
          type="radio"
          id="default-radio"
          // label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          label="In Order"
          name="group0"
          inline
        ></Form.Check>
        <Form.Check
          checked={status === "Not In Order"}
          onChange={(e) => {
            setStatus("Not In Order");
          }}
          type="radio"
          id="default-radio"
          // label={<CancelIcon color="error" />}
          label="Not In Order"
          name="group0"
          inline
        ></Form.Check>
        <Form.Check
          checked={status === "Conditional"}
          onChange={() => {
            setStatus("Conditional");
          }}
          type="radio"
          id="default-radio"
          // label={<CheckCircleIcon color="success"></CheckCircleIcon>}
          label="Conditional"
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
