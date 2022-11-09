import { FormStep,TextInput, MobileNumber, CardLabel, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { useLocation } from "react-router-dom";
// import "../Developer/AddInfo.css";
// import DashboardScreen from "../../src/Screens/DashboardScreen/DashboardScreen";
import { useForm } from "react-hook-form";
import Timeline from "../components/Timeline";
import Popup from "reactjs-popup";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  ModalFooter,
} from "reactstrap";

import { convertEpochToDate } from "../utils/index";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from "axios";

//for Redux use only
// import { setAurthorizedUserData } from "../Redux/Slicer/Slicer";
// import { useDispatch } from "react-redux";

const AddAuthorizeduser = ({ t, config, onSelect, formData, data }) => {

  const { pathname: url } = useLocation();
  const userInfo = Digit.UserService.getUser();
  let validation = {};
  let isOpenLinkFlow = window.location.href.includes("openlink");
  const [modal, setmodal] = useState(false);
  const [aurthorizedUserName, setAurtorizedUserName] = useState(formData?.AddAuthorizeduser?.aurthorizedUserName || formData?.AddAuthorizeduser?.aurthorizedUserName || "");
  const [aurthorizedMobileNumber, setAurthorizedMobileNumber] = useState(formData?.AddAuthorizeduser?.aurthorizedMobileNumber || formData?.AddAuthorizeduser?.aurthorizedMobileNumber || "");
  const [aurthorizedEmail, setAurthorizedEmail] = useState(formData?.AddAuthorizeduser?.aurthorizedEmail || formData?.AddAuthorizeduser?.aurthorizedEmail || "");
  const [aurthorizedDob, setAurthorizedDob] = useState(formData?.AddAuthorizeduser?.aurthorizedDob || formData?.AddAuthorizeduser?.aurthorizedDob || "");
  const [aurthorizedPan, setAurthorizedPan] = useState(formData?.AddAuthorizeduser?.aurthorizedPan || formData?.AddAuthorizeduser?.aurthorizedPan || "");
  const [aurthorizedUserInfoArray, setAurthorizedUserInfoArray] = useState([]);
  const [docUpload,setDocuploadData]=useState([])
  const [file,setFile]=useState(null);
  //   const dispatch=useDispatch();
  // const Modal = () => (
  //   <Popup trigger={<button className="button"> Open Modal </button>} modal>
  //     <span> Modal content </span>
  //   </Popup>
  // );

  // function UploadDocuments() {
  //   const [inputFields, setInputFields] = useState([{
  //     fullName:'',

  // } ]);

  // const addInputField = ()=>{

  //     setInputFields([...inputFields, {
  //         fullName:'',
  //     } ])

  // }
  // const removeInputFields = (index)=>{
  //     const rows = [...inputFields];
  //     rows.splice(index, 1);
  //     setInputFields(rows);
  // }
  // const handleChange = (index, evnt)=>{

  // const { name, value } = evnt.target;
  // const list = [...inputFields];
  // list[index][name] = value;
  // setInputFields(list);
  const {
    register,
    handleSumit,
    formState: { error },
  } = useForm([
    { Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" },
  ]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [showhide, setShowhide] = useState("No");
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  function selectPanNumber(e) {
    setAurthorizedPan(e.target.value.toUpperCase());
  }
  const panVerification = async () => {
    try {
      const panVal =  {
        "txnId": "f7f1469c-29b0-4325-9dfc-c567200a70f7",
        "format": "xml",
        "certificateParameters": {
          "panno": aurthorizedPan,
          "PANFullName": aurthorizedUserName,
          "FullName": aurthorizedUserName,
          "DOB": aurthorizedDob,
          "GENDER": "MALE"
          // "GENDER": gender.value
        },
        "consentArtifact": {
          "consent": {
            "consentId": "ea9c43aa-7f5a-4bf3-a0be-e1caa24737ba",
            "timestamp": "2022-10-08T06:21:51.321Z",
            "dataConsumer": {
              "id": "string"
            },
            "dataProvider": {
              "id": "string"
            },
            "purpose": {
              "description": "string"
            },
            "user": {
              "idType": "string",
              "idNumber": "string",
              "mobile": aurthorizedMobileNumber,
              "email": aurthorizedEmail
            },
            "data": {
              "id": "string"
            },
            "permission": {
              "access": "string",
              "dateRange": {
                "from": "2022-10-08T06:21:51.321Z",
                "to": "2022-10-08T06:21:51.321Z"
              },
              "frequency": {
                "unit": "string",
                "value": 0,
                "repeats": 0
              }
            }
          },
          "signature": {
            "signature": "string"
          }
        }
      }
      const panResp = await axios.post(`/certificate/v3/pan/pancr`,panVal, {headers:{
        'Content-Type': 'application/json',
        'X-APISETU-APIKEY':'PDSHazinoV47E18bhNuBVCSEm90pYjEF',
        'X-APISETU-CLIENTID':'in.gov.tcpharyana',
        'Access-Control-Allow-Origin':"*",
      }}) 
      console.log("",panResp.data);
    } catch(errdata){
      console.error("PANERROR",errdata);
    }
  }
  
  useEffect(() => {
    if(aurthorizedPan.length === 10){
      panVerification();
    }
  }, [aurthorizedPan])

  const getDocumentData = async () => {
    if(file===null){
       return
    }
       const formData = new FormData();
       formData.append(
           "file",file.file      );
       formData.append(
           "tenantId","hr"      );  
       formData.append(
           "module","property-upload"      );
        formData.append(
            "tag","tag-property"      );
   
        console.log("File",formData)

       try {
           const Resp = await axios.post("/filestore/v1/files",formData,
           {headers:{
               "content-type":"multipart/form-data"
           }}).then((response) => {
               return response
           });
           setDocuploadData(Resp.data)
           
       } catch (error) {
           console.log(error.message);
       }

      

  }
  useEffect(() => {
    getDocumentData();
  }, [file]);
  const [noofRows, setNoOfRows] = useState(1);
  const handleSubmitFormdata = () => {
    setmodal(false);
    console.log("submitted");
    const user = {
      userName: aurthorizedUserName,
      name: aurthorizedUserName,
      gender: "male",
      mobileNumber: aurthorizedMobileNumber,
      emailId: aurthorizedEmail,
      dob: aurthorizedDob,
      pan: aurthorizedPan,
      "active": true,
      "type": "EMPLOYEE",
      "password": "Password@123",
      "tenantId": "hr",
      "roles": [
          {
              "code": "EMPLOYEE",
              "name": "Employee",
              "tenantId": "default"
          }
      ]
    }

    setAurthorizedUserInfoArray((prev) => [...prev, user]);
  };

  const handleAurthorizedUserFormSubmit = async (e) => {
    //   e.preventDefault();

    const formData = {
      aurthorizedUserInfoArray
    }
    onSelect(config.key, formData);
    console.log(formData);
    localStorage.setItem("data_user", JSON.stringify(formData))
    
    
      try {
        const requestResp = {
          
            "RequestInfo": {
                "api_id": "1",
                "ver": "1",
                "ts": null,
                "action": "create",
                "did": "",
                "key": "",
                "msg_id": "",
                "requester_id": "",
                "auth_token": null
            },
        }
        const postDataAuthUser = await axios.post(`localhost:8086/user/users/_createnovalidate`,requestResp,formData,{headers:{
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':"*",
        }})
        console.log(postDataAuthUser);
      }
      
      catch(error){
        console.log(error.message);
      }
    

   
  }
  const onSkip = () => onSelect();
  return (

    <div className={isOpenLinkFlow ? "OpenlinkContainer" : ""}>
      <Timeline currentStep={3} flow="STAKEHOLDER" />
      <FormStep
        className="card"
        // onSubmit={handleAurthorizedUserFormSubmit}
        config={config}
        onSelect={handleAurthorizedUserFormSubmit}
        onSkip={onSkip}
        t={t}
      >
        {/* <div>
                <h5 className="card-h"> Developer</h5>
            </div> */}
        {/* <div className="card shadow"> */}

        <div className="card-body">
          {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
          <div className="table-bd">
            {/* { inputFields.map((data, index)=>{
                    const {}
                    })
                    } */}
            <Table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Email</th>
                  <th>Date of Birth</th>
                  <th>PAN No.</th>
                  <th>Upload Aadhar PDF</th>
                  <th>Upload Digital Signature PDF</th>
                </tr>
              </thead>
              <tbody>
                {
                  (aurthorizedUserInfoArray.length > 0) ?
                    aurthorizedUserInfoArray.map((elementInArray, input) => {
                      return (
                        <tr>
                          <td>{input + 1}</td>
                          <td>
                            <input
                              type="text"
                              name="name[]"
                              placeholder={elementInArray.name}
                              value={elementInArray.name}
                              class="employee-card-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="mobile[]"
                              placeholder={elementInArray.mobileNumber}
                              value={elementInArray.mobileNumber}
                              class="employee-card-input"
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              name="email[]"
                              placeholder={elementInArray.emailId}
                              value={elementInArray.emailId}
                              class="employee-card-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="dob[]"
                              placeholder={elementInArray.dob}
                              value={elementInArray.dob}
                              class="employee-card-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="pan[]"
                              placeholder="{elementInArray.pan}"
                              value={elementInArray.pan}
                              class="employee-card-input"
                            />
                          </td>
                          <td>
                            <div className="row">
                              <button className="btn btn-sm col-md-6">
                                <VisibilityIcon color="info" className="icon" />
                              </button>
                              <button className="btn btn-sm col-md-6">
                                <FileDownloadIcon color="primary" />
                              </button>

                            </div>
                          </td>
                          <td>
                            <div className="row">
                              <button className="btn btn-sm col-md-6">
                                <VisibilityIcon color="info" className="icon" />
                              </button>
                              <button className="btn btn-sm col-md-6">
                                <FileDownloadIcon color="primary" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })
                    : <div className="justify-content-center">
                      Click on Add to add a aurthorized user
                    </div>
                }
              </tbody>
            </Table>
            <div>
              <button
                type="button"
                style={{
                  float: "left",
                  backgroundColor: "#0b3629",
                  color: "white",
                }}
                className="btn mt-3"
                // onClick={() => setNoOfRows(noofRows + 1)}
                onClick={() => setmodal(true)}
              >
                Add More
              </button>

              <div>
                <Modal
                  size="lg"
                  isOpen={modal}
                  toggle={() => setmodal(!modal)}
                >
                  <ModalHeader
                    toggle={() => setmodal(!modal)}
                  ></ModalHeader>

                  <ModalBody>
                    <div className="card2">
                      <div className="popupcard">
                        <form className="text1">
                          <Row>
                            <Col md={3} xxl lg="3">
                              <label htmlFor="name" className="text">Name</label>
                              {/* <input
                                type="text"
                                name="name[]"
                                placeholder=""
                                class="employee-card-input"
                                onChange={(e) => setAurtorizedUserName(e.target.value)}
                              /> */}
                              <TextInput
                                t={t}
                                type={"text"}
                                isMandatory={true}
                                optionKey="i18nKey"
                                name="aurthorizedUserName"
                                value={aurthorizedUserName}
                                onChange={(e) => setAurtorizedUserName(e.target.value)}
                                {...(validation = {
                                  isRequired: true,
                                  pattern: "^[a-zA-Z-.`' ]*$",
                                  type: "text",
                                  title: t("PT_NAME_ERROR_MESSAGE"),
                                })}
                              />
                            </Col>
                            <Col md={3} xxl lg="3">
                              <label htmlFor="name" className="text">Mobile Number</label>
                              <input
                                type="tel"
                                name="name[]"
                                placeholder=""
                                class="employee-card-input"
                                onChange={(e) => setAurthorizedMobileNumber(e.target.value)}
                                maxlength={"10"}
                                pattern={"[6-9]{1}[0-9]{9}"}
                                required={true}
                              />
                             
                            </Col>
                            <Col md={3} xxl lg="3">
                              <label htmlFor="name" className="text">Email</label>
                              <input
                                type="email"
                                name="name[]"
                                placeholder=""
                                class="employee-card-input"
                                onChange={(e) => setAurthorizedEmail(e.target.value)}
                              />
                            </Col>
                            <Col md={3} xxl lg="3">
                              <label htmlFor="name" className="text">Date of Birth</label>
                              <input
                                type="date"
                                name="dob[]"
                                placeholder=""
                                class="employee-card-input"
                                onChange={(e) => setAurthorizedDob(e.target.value)}
                                max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
                              />
                            </Col>
                            <Col md={3} xxl lg="3">
                              <label htmlFor="name" className="text">PAN No.</label>
                              {/* <input
                                type="text"
                                name="name[]"
                                placeholder=""
                                class="employee-card-input"
                                onChange={(e) => setAurthorizedPan(e.target.value)}
                              /> */}
                              <TextInput
                                t={t}
                                type={"text"}
                                isMandatory={true}
                                optionKey="i18nKey"
                                name="aurthorizedPan"
                                value={aurthorizedPan}
                                placeholder={aurthorizedPan}
                                // onChange={(e) => setAurthorizedPan(e.target.value)}
                                onChange={selectPanNumber}
                                {...{ required: true, pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}", title: t("BPA_INVALID_PAN_NO") }}
                                />
                                {aurthorizedPan&&aurthorizedPan.length>0&&!aurthorizedPan.match(Digit.Utils.getPattern('PAN'))&&<CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px'}}>{t("BPA_INVALID_PAN_NO")}</CardLabelError>}
                            </Col>
                            <Col md={3} xxl lg="3">
                              <label htmlFor="name" className="text">Upload Aadhar PDF</label>
                              <input
                                type="file"
                                name="name[]"
                                placeholder=""
                                class="employee-card-input"
                                onChange={(e)=>setFile({file:e.target.files[0]})}
                              />
                            </Col>
                            <Col md={3} xxl lg="3">
                              <label htmlFor="name" className="text">Upload Digital Signature PDF</label>
                              <input
                                type="file"
                                name="name[]"
                                placeholder=""
                                class="employee-card-input"
                                onChange={(e)=>setFile({file:e.target.files[0]})}
                              />
                            </Col>
                          </Row>
                        </form>

                      </div>
                      <div className="submit-btn">
                        <div className="form-group col-md6 mt-6">
                          <button
                            type="button"
                            style={{ float: "right" }}
                            className="btn btn-success"
                            onClick={handleSubmitFormdata}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter
                    toggle={() => setmodal(!modal)}
                  ></ModalFooter>
                </Modal>
              </div>
            </div>
          </div>
          {/* <button
                type="button"
                style={{ float: "left" }}
                className="btn btn-primary"
                onClick={() => setNoOfRows(noofRows + 1)}
                >
                Add More
                </button> */}
          {/* <button
                type="button"
                style={{ float: "right" }}
                className="btn btn-danger"
                onClick={() => setNoOfRows(noofRows - 1)}
                >
                Remove
                </button> */}
        </div>
        {/* <div className="form-group col-md6 mt-6">
                <button
                type="submit"
                style={{ float: "right" }}
                className="btn btn-success"
                
                
                >
                Submit
                </button>
            </div> */}
      </FormStep>
    </div>
  );
}

export default AddAuthorizeduser;
