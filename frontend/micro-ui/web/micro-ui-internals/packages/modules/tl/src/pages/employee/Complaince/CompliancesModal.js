import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { useStyles } from "../ScrutinyBasic/Remarks/styles/modalChild.style";
// import { useParams } from "react-router-dom";
// import { ScrutinyRemarksContext } from "../../../../../context/remarks-data-context";
import AddPost from "../Material/TextEditor";
import { useForm } from "react-hook-form";
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';


function CompliancesModal(props) {
    // const {handleRoles, handleGetFiledsStatesById, handleGetRemarkssValues , bussinessService} = useContext(ScrutinyRemarksContext,);
//   const applicationStatus = props.applicationStatus ;
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
  const [loader, setLoading] = useState(false);

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
// const Compliance = async (data,isChecked) => {
    
//     console.log("REQUEST LOG1 ====> ", data, JSON.stringify(data));
//     try {
//       setLoading(true);
//       const body = {
//         RequestInfo: {
//           apiId: "Rainmaker",
//           ver: ".01",
//           ts: null,
//           action: "_update",
//           did: "1",
//           key: "",
//           msgId: "20170310130900|en_IN",
//           authToken: authToken,
//           userInfo: userInfo,
//         },
//         ComplianceRequest:[{

//             tcpApplicationNumber: tcpApplicationNumber,
    
//             businessService: businessService,
    
//             Compliance:{
    
//                 compliance:RemarksDeveloper.data,
    
//                 isPartOfLoi:isChecked,
    
//                 userName:userInfo?.name || null,
    
//                 userid:userInfo?.id || null,

//                 created_On:dateTime.toUTCString(),
    
//                 designation:designation
    
//       }
    
     
    
//         }]
//       };

//       const response = await axios.post("/tl-services/_compliance/_create", body);

//       console.log("Submit Response ====> ", response);
    
//       }  
//       catch (error) {
//         console.log(error);
//       }
//       handleGetFiledsStatesById(id);
//       handleGetRemarkssValues(id);
//       handleRoles(id)
//       console.log("response from API", Resp);
//       props?.remarksUpdate({ data: RemarksDeveloper.data });
//     }  else {
//         props?.passmodalData();
//       }
//     };
//     console.log("smshow", smShow);
//     console.log("applicationStatus", applicationStatus);
  
//     useEffect(() => {
//       if (props.selectedFieldData) {
//         setStatus(props.selectedFieldData.isApproved);
//         setDeveloperRemarks({ data: props.selectedFieldData?.comment ? props.selectedFieldData?.comment : "" });
       
//       } else {
//         setStatus(null);
//         setDeveloperRemarks({ data: "" });
//       }
//     }, [props.selectedFieldData]);
  
//     console.log("Isdata" , status,RemarksDeveloper )
  

    const Compliance = async (data,isChecked ) => {
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
            
              setDeveloperRemarks({ data: props.selectedFieldData?.comment ? props.selectedFieldData?.comment : "" });
            
             } else {
          
              setDeveloperRemarks({ data: "" });
             }
           }, [props.selectedFieldData]);
        
        


  const submitForm = (data) => {
   
    Compliance(data);
    
  };



    const [isOpened, setIsOpened] = useState(false);
  
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
       <form onSubmit={handleSubmit(submitForm)}>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">
          {/* <div>
            <h3>{props.labelmodal}</h3>
            <p className={classes.subHead}>{inputFieldValue}</p>
          </div> */}
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
        
        <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Submit
                </button>
              </div>
              {/* <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }} onClick={handlemodalsubmit}>
            Submit
          </Button>
        </div> */}
      </Modal.Body>
      </form>
    </Modal>
   
  );
}

export default CompliancesModal;