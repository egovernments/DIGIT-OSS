import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useStyles } from "./styles/modalChild.style";
import { useParams } from "react-router-dom";
// import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";
import AddPost from "../../Material/TextEditor";


function CompliancesModal(props) {
    // const {handleRoles, handleGetFiledsStatesById, handleGetRemarkssValues , bussinessService} = useContext(ScrutinyRemarksContext,);
  const applicationStatus = props.applicationStatus ;
//   const userInfo = Digit.UserService.getUser()?.info || {};
  const classes = useStyles();
  const smShow = props.displaymodal;
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [RemarksEntered, setRemarksEntered] = useState("");
  const [yesOrNoClicked, setIsYesorNoClicked] = useState();
  const [status, setStatus] = useState("");
  const inputFieldValue = props.fieldValue;
  const inputFieldLabel = props.labelValue;
  const dateTime = new Date();
//   const authToken = Digit.UserService.getUser()?.access_token || null;
//   const { id } = useParams();
//   const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
//   const filterDataRole = userRolesArray?.[0]?.code;
//   const designation = userRolesArray?.[0]?.name;
  const  applicationimp = props.applicationimp;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues,
    resetField,
  } = useForm({ reValidateMode: "onChange", mode: "onChange" });
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const userRolesArray = userInfo?.roles.filter((user) => user.code !=="EMPLOYEE" );
  const filterDataRole = userRolesArray?.[0]?.code;
  const designation = userRolesArray?.[0]?.name;
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = event => {
    setIsChecked(event.target.checked);

    // 👇️ this is the checkbox itself
    console.log("falsenon" , event.target);

    // 👇️ this is the checked value of the field
    console.log("truecheck" ,event.target.checked);
  };

const tcpApplicationNumber = applicationimp?.tcpApplicationNumber
const businessService = applicationimp?.businessService
const handlemodalsubmit = async (data , index, value) => {
    console.log("REQUEST LOG1 ====> ", data, JSON.stringify(data));
    try {
      setLoading(true);
      const body = {
        RequestInfo: {
          apiId: "Rainmaker",
          ver: ".01",
          ts: null,
          action: "_update",
          did: "1",
          key: "",
          msgId: "20170310130900|en_IN",
          authToken: authToken,
          userInfo: userInfo,
        },
        ComplianceRequest:[{

            tcpApplicationNumber: tcpApplicationNumber,
    
            businessService: businessService,
    
            Compliance:{
    
                compliance:RemarksDeveloper.data,
    
                isPartOfLoi:isChecked,
    
                userName:userInfo?.name || null,
    
                userid:userInfo?.id || null,

                created_On:dateTime.toUTCString(),
    
                designation:designation
    
      }
    
     
    
        }]
      };

      const response = await axios.post("/tl-services/_compliance/_create", body);

      console.log("Submit Response ====> ", response);
      

      setLoading(false);
      setShowToastError({ label: "Surrender of License submitted successfully", error: false, success: true });
    } catch (err) {
      console.log("Submit Error ====> ", err.message);
      setLoading(false);
      setShowToastError({ label: err.message, error: true, success: false });
    }
  };
  useEffect(() => {
    if (props.selectedFieldData) {
    //   setStatus(props.selectedFieldData.isApproved);
      setDeveloperRemarks({ data: props.selectedFieldData?.comment ? props.selectedFieldData?.comment : "" });
    
    } else {
    //   setStatus(null);
      setDeveloperRemarks({ data: "" });
    }
  }, [props.selectedFieldData]);





  const submitForm = (data) => {
   
      Compliance(data);
    
  };


    const [isOpened, setIsOpened] = useState(false);
  
    function toggle() {
      setIsOpened(wasOpened => !wasOpened);
    }
    

  return (
    <Modal
      size="lg"
      className="modal-lg modal-center"
      show={smShow}
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
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Checkbox
        type="checkbox"
        id="checkbox-id"
        name="checkbox-name"
        onChange={handleChange}
        checked={isChecked}
        defaultChecked
      />
     
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Col xs={12} md={12}>
            <Form.Label style={{ margin: 5 }}>Remarks</Form.Label>
           
            <AddPost
                       modal={true}
                       setState={(e) => {
                        setDeveloperRemarks({ data: e });
                        
                      }}
                      state={RemarksDeveloper?.data}
                       ></AddPost>
          </Col>
        </Form.Group>
        <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
            Submit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CompliancesModal;