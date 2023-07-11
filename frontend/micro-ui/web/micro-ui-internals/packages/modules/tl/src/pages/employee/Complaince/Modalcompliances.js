import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useStyles } from "../ScrutinyBasic/Remarks/styles/modalChild.style";
import AddPost from "../Material/TextEditor";
import { useForm } from "react-hook-form";
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import { ComplicesRemarksContext } from "../../../../context/Complices-remarks-context";

import { Dialog, stepIconClasses } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



function Modalcompliances(props) {

    const {compliceGetRemarkssValues}=useContext(ComplicesRemarksContext)
  const classes = useStyles();
  const smShow = props.displaymodal;
  const [RemarksDeveloper, setDeveloperRemarks] = useState("");
  const [RemarksEntered, setRemarksEntered] = useState("");
  const [yesOrNoClicked, setIsYesorNoClicked] = useState();
  const [status, setStatus] = useState("");
  const inputFieldValue = props.fieldValue;
  const inputFieldLabel = props.labelValue;
  const dateTime = new Date();
  const [loader, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const  applicationimp = props.applicationdata;
  console.log("akash124256", applicationimp);
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
 const Compliance = async (data) => {
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
            
                        isPartOfLoi: isChecked,
            
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
            //   setShowToastError({ label: "Surrender of License submitted successfully", error: false, success: true });
              compliceGetRemarkssValues(tcpApplicationNumber);
              props.onClose();
             
            } catch (err) {
              console.log("Submit Error ====> ", err.message);
              setLoading(false);
            //   setShowToastError({ label: err.message, error: true, success: false });
              props.onClose();
            }
            setOpen(true);
            
          };
          useEffect(() => {
            if (props.selectedFieldData) {
            
              setDeveloperRemarks({ data: props.selectedFieldData?.comment ? props.selectedFieldData?.comment : "" });
            
             } else {
          

              setDeveloperRemarks({ data: "" });
             }
           }, [props.selectedFieldData]);
        
        


  const submitForm = (data) => {
   
    Compliance(data);
    
  };
  const handalfinal = () => {
    setOpen(false);
  }



    const [isOpened, setIsOpened] = useState(false);
  
  return (
    <div>
    <React.Fragment>
    <Modal
      size="lg"
      className="modal-lg modal-center"
      show={smShow}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ position: "fixed", left: "50%", top: "50%", transform: "translate(-50% , -50%)", zIndex:"10000" }}
      onHide={props.onClose}
    >
       <form onSubmit={handleSubmit(submitForm)}>
      <Modal.Header closeButton style={{ textAlign: "center" ,backgroundColor: "#FFD954" , maxWidth:"100%", fontSize: "x-large",paddingLeft: "16%" }}>
        <Modal.Title id="example-modal-sizes-title-sm">
          Add Compliance
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{height:"300px", overflow:"auto"}}>
        <h4>Proposed Condition Of LOI</h4>
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
        
            
      </Modal.Body>
      <Modal.Footer>
        <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Submit
                </button>
              </div>
      </Modal.Footer>
      </form>
    </Modal>
   <Dialog open={open} onClose={Compliance} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" style={{
    textAlign: "center",
    color: "#ffff",
    backgroundColor: "#000000b0"}}>
          <DialogTitle id="alert-dialog-title" style={{ fontSize: "xx-large", background: "#000000b0" , color: "#ffff"}}>Compliance Remarks Submission</DialogTitle>
          <DialogContent style={{ background: "#000000b0"}}>
            <DialogContentText id="alert-dialog-description" style={{textAlign: "center", color: "#ffff" , fontSize: "x-large"}}>
              <p ><CheckCircleIcon style={{fontSize: "-webkit-xxx-large;"}}></CheckCircleIcon></p>
              <p>
                Thank You {" "}
                {/* <span>
                  <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
                </span> */}
              </p>
              <p>
                The  Compliance Remarks was submitted successfully !!<span style={{ padding: "5px", color: "blue" }}></span> 
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handalfinal} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        </React.Fragment>
        </div>
  );
}

export default Modalcompliances;