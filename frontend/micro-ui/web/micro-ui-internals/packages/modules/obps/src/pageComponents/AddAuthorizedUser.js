import { FormStep,TextInput, MobileNumber, CardLabel, CardLabelError, Dropdown, RemoveIcon  } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { useLocation } from "react-router-dom";
// import "../Developer/AddInfo.css";
// import DashboardScreen from "../../src/Screens/DashboardScreen/DashboardScreen";
import { useForm } from "react-hook-form";
import Timeline from "../components/Timeline";
import Popup from "reactjs-popup";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Row,
//   Col,
//   ModalFooter,
// } from "reactstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Modal, ModalHeader, ModalFooter, ModalBody } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { convertEpochToDate } from "../utils/index";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from "axios";
const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
// const tenantId = Digit.ULBService.getCurrentTenantId();

//for Redux use only
// import { setAurthorizedUserData } from "../Redux/Slicer/Slicer";
// import { useDispatch } from "react-redux";

const AddAuthorizeduser = ({ t, config, onSelect, formData, data, isUserRegistered = true }) => {

  const { pathname: url } = useLocation();
  const userInfo = Digit.UserService.getUser();
  const devRegId = localStorage.getItem('devRegId');
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  // console.log(userInfo?.info?.id);
  const getDeveloperData = async ()=>{
    try {
      const requestResp = {
        
        "RequestInfo": {
            "api_id": "1",
            "ver": "1",
            "ts": "",
            "action": "_getDeveloperById",
            "did": "",
            "key": "",
            "msg_id": "",
            "requester_id": "",
            "auth_token": ""
        },
    }
      const getDevDetails = await axios.get(`/user/developer/_getDeveloperById?id=${userInfo?.info?.id}&isAllData=true`,requestResp,{

      });
      const developerDataGet = getDevDetails?.data; 
      console.log("ADDAUTHUSER",getDevDetails?.data?.devDetail[0]?.aurthorizedUserInfoArray);
      // setAurthorizedUserInfoArray(getDevDetails?.data?.devDetail[0]?.aurthorizedUserInfoArray);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getDeveloperData()
  }, []);

  const authUserSearch = async ()=>{
    try {
      const requestResp = {
        
        "RequestInfo": {
          "api_id": "org.egov.pgr",
          "ver": "1.0",
          "ts": "",
          "res_msg_id": "uief87324",
          "msg_id": "654654",
          "status": "successful",
          "auth_token": ""
           },
           "parentid":userInfo?.info?.id,
            "tenantId": tenantId
    }
      const getAuthUserDetails = await axios.post(`/user/_search`,requestResp,{

      });
      const developerDataGet = getAuthUserDetails?.data; 
      console.log("U",developerDataGet);
      setAurthorizedUserInfoArray(developerDataGet?.user);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    authUserSearch()
  },[])
  let validation = {};
  let isOpenLinkFlow = window.location.href.includes("openlink");
  
  


  const getUserType = () => Digit.UserService.getType();
  const [params, setParmas] = useState(isUserRegistered?{}:location?.state?.data);
  const [modal, setmodal] = useState(false);
  const [aurthorizedUserName, setAurtorizedUserName] = useState(formData?.LicneseDetails?.aurthorizedUserName || formData?.LicneseDetails?.aurthorizedUserName || "");
  const [aurthorizedMobileNumber, setAurthorizedMobileNumber] = useState(formData?.LicneseDetails?.aurthorizedMobileNumber || formData?.LicneseDetails?.aurthorizedMobileNumber || "");
  const [aurthorizedEmail, setAurthorizedEmail] = useState(formData?.LicneseDetails?.aurthorizedEmail || formData?.LicneseDetails?.aurthorizedEmail || "");
  const [aurthorizedDob, setAurthorizedDob] = useState(formData?.LicneseDetails?.aurthorizedDob || formData?.LicneseDetails?.aurthorizedDob || "");
  const [gender, setGender] = useState(formData?.LicneseDetails?.gender || formData?.LicneseDetails?.gender);
  const [aurthorizedPan, setAurthorizedPan] = useState(formData?.LicneseDetails?.aurthorizedPan || formData?.LicneseDetails?.aurthorizedPan || "");
  const [aurthorizedUserInfoArray, setAurthorizedUserInfoArray] = useState([]);
  const [docUpload,setDocuploadData]=useState([])
  const [file,setFile]=useState(null);
  
  
  const [showAuthuser, setShowAuthuser] = useState(false);
  const handleShowAuthuser = () => {
    setShowAuthuser(true)
    setAurtorizedUserName("");
    setAurthorizedMobileNumber("");
    setAurthorizedEmail("");
    setAurthorizedDob("");
    setGender("");
    setAurthorizedPan("");
  };
  const handleCloseAuthuser = () => setShowAuthuser(false);


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
  function setGenderName(value) {
    setGender(value);
  }
  function selectPanNumber(e) {
    setAurthorizedPan(e.target.value.toUpperCase());
  }
  function selectAurthorizedMobileNumber(value){
    setAurthorizedMobileNumber(value);
  }
  // const handleMobileChange = async (event) => {
  //   const { value } = event.target;
  //   setParmas({ ...params, aurthorizedMobileNumber: value });
  //   const data = {
  //     ...aurthorizedMobileNumber,
  //     tenantId: "hr",
  //     userType: getUserType(),
  //   };
  //   if (isUserRegistered) {
  //     const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
  //     if (!err) {
  //       alert("please Enter Login",res)
  //       return;
  //     } 
  //   } else {
  //     const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
  //     alert("Please register yourself",res)
  //   }
  // };
  
  

  const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

  let menu = [];
  genderTypeData &&
    genderTypeData["common-masters"].GenderType.filter(data => data.active).map((genderDetails) => {
      menu.push({ i18nKey: `COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });
    const editScreen = false;

    

  
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
          "GENDER": gender.value
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

  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, stateCode);
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };

  const getDocumentData = async () => {
    if(file===null){
       return
    }
       const formData = new FormData();
       formData.append(
           "file",file.file      );
       formData.append(
           "tenantId", tenantId      );  
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
    if(aurthorizedMobileNumber!=="" && aurthorizedUserName!=="" && aurthorizedMobileNumber!=="" && aurthorizedEmail!==""){
      const user = {
          userName: aurthorizedMobileNumber,
          name: aurthorizedUserName,
          gender: gender.value,
          mobileNumber: aurthorizedMobileNumber,
          emailId: aurthorizedEmail,
          dob: aurthorizedDob,
          pan: aurthorizedPan,
          document: docUpload,
          "parentId":userInfo?.info?.id,
          "type": "CITIZEN",
          "password": "Password@123",
          
          "roles": [
              {
                  "code": "CITIZEN",
                  "name": "Citizen",
                  "tenantId": tenantId
              },
              {
                  "code": "BPA_BUILDER",
                  "name": "BPA BUILDER",
                  "tenantId": tenantId
              },
              // {
              //     "code": "BPA_ARCHITECT",
              //     "name": "BPA ARCHITECT",
              //     "tenantId": tenantId
              // }
          ],
          "tenantId": "hr",
      }

      setAurthorizedUserInfoArray((prev) => [...prev, user]);
 
    try {
      const requestResp = {          
            "requestInfo": {
              "apiId": "Rainmaker",
              "ver": ".01",
              "ts": null,
              "action": "_update",
              "did": "1",
              "key": "",
              "msgId": "20170310130900|en_IN",
              "authToken": "dce88a06-7e09-4923-97f9-f15af2deea66",
              
              userInfo:userInfo
            },
            user:user
          
      }
      const postDataAuthUser = axios.post(`/user/users/_createnovalidate`,requestResp,{headers:{
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':"*",
      }})
      // console.log(postDataAuthUser);
    }
    
    catch(error){
      console.log(error.message);
    }
    handleCloseAuthuser();
  }

  };

  const deleteTableRows = (i)=>{
    const rows = [...aurthorizedUserInfoArray];
    rows.splice(i, 1);
    setAurthorizedUserInfoArray(rows);
  }

  const goNext = async (e) => {
    //   e.preventDefault();
    if (!(formData?.result && formData?.result?.Licenses[0]?.id)) {
      const addAuthUserformData = {
        aurthorizedUserInfoArray:aurthorizedUserInfoArray
      }
      onSelect(config.key, formData);
      console.log(addAuthUserformData);
      localStorage.setItem("data_user", JSON.stringify(addAuthUserformData))
      
      const developerRegisterData = {
        "id":userInfo?.info?.id,
        "pageName":"aurthorizedUserInfoArray",
        "createdBy":userInfo?.info?.id,
        "updatedBy":userInfo?.info?.id,
        "devDetail": {
          
            "aurthorizedUserInfoArray": aurthorizedUserInfoArray
        }
      }
      Digit.OBPSService.CREATEDeveloper(developerRegisterData, tenantId)
      .then((result, err) => {
        console.log("DATA",result?.id);
        // localStorage.setItem('devRegId',JSON.stringify(result?.id));
        setIsDisableForNext(false);
        let data = { 
          result: result, 
          formData: formData, 
          Correspondenceaddress: Correspondenceaddress,
          addressLineOneCorrespondence: addressLineOneCorrespondence,
          addressLineTwoCorrespondence: addressLineTwoCorrespondence,

          isAddressSame: isAddressSame }
        //1, units
        onSelect("", data, "", true);

      })
      .catch((e) => {
        setIsDisableForNext(false);
        setShowToast({ key: "error" });
        setError(e?.response?.data?.Errors[0]?.message || null);
      });
    }else {
      let data = formData?.formData;
      // data.LicneseDetails.addAuthUserformData = addAuthUserformData;
      onSelect("", formData)
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
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
      >
        {/* <div>
                <h5 className="card-h"> Developer</h5>
            </div> */}
        {/* <div className="card shadow"> */}

        <div className="card-body px-0">
          {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
          <div className="table-bd">
            {/* { inputFields.map((data, index)=>{
                    const {}
                    })
                    } */}
            <Table className="table table-bordered table-responsive">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Email</th>
                  <th>Gender</th>
                  {/* <th>Date of Birth</th> */}
                  <th>PAN No.</th>
                  <th>View Aadhar PDF</th>
                  <th>View Digital Signature PDF</th>
                  {/* <th>Action</th> */}
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
                              disabled={"disabled"}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="gender[]"
                              placeholder={elementInArray.gender}
                              value={elementInArray.gender}
                              class="employee-card-input"
                            />
                          </td>
                          {/* <td>
                            <input
                              type="text"
                              name="dob[]"
                              placeholder={elementInArray.dob}
                              value={elementInArray.dob || DD-MM-YYYY}
                              class="employee-card-input"
                            />
                          </td> */}
                          <td>
                            <input
                              type="text"
                              name="pan[]"
                              placeholder={elementInArray.pan}
                              value={elementInArray.pan}
                              class="employee-card-input"
                            />
                          </td>
                          <td>
                            <div className="row">
                            {(!elementInArray.document == "")?
                              <a href="javascript:void(0)" className="btn btn-sm col-md-6">
                                <VisibilityIcon color="info" className="icon" />
                              </a>:<p></p>
                            }
                              {/* <button className="btn btn-sm col-md-6">
                                <FileDownloadIcon color="primary" />
                              </button> */}

                            </div>
                          </td>
                          <td>
                            <div className="row">
                            {(!elementInArray.document == "")?
                              <a href="javascript:void(0)" className="btn btn-sm col-md-6">
                                <VisibilityIcon color="info" className="icon" />
                              </a>:<p></p>
                            }
                              {/* <button className="btn btn-sm col-md-6">
                                <FileDownloadIcon color="primary" />
                              </button> */}

                            </div>
                          </td>
                          {/* <td>
                            <button
                              onClick={()=>(deleteTableRows(-1))}
                            >
                              <RemoveIcon />
                            </button>
                          </td> */}
                        </tr>
                      );
                    })
                    : <div className="d-none">
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
                onClick={handleShowAuthuser}
              >
                Add More
              </button>

              <Modal show={showAuthuser} onHide={handleCloseAuthuser} animation={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Add Authorised user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form className="text1">
                    <Row>
                      <Col md={3} xxl lg="3">
                        <label htmlFor="name" className="text">Name  <span className="text-danger font-weight-bold">*</span></label>
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
                          isMandatory={false}
                          optionKey="i18nKey"
                          name="aurthorizedUserName"
                          // value={aurthorizedUserName}
                          onChange={(e) => setAurtorizedUserName(e.target.value)}
                          {...(validation = {
                            isRequired: true,
                            type: "text",
                            title: "Please enter Name",
                          })}
                        />
                      </Col>
                      <Col md={3} xxl lg="3">
                        <label htmlFor="name" className="text">Mobile Number  <span className="text-danger font-weight-bold">*</span></label>
                        <MobileNumber
                          type="tel"
                          name="name[]"
                          placeholder=""
                          class="employee-card-input"
                          // value={aurthorizedMobileNumber}
                          onChange={selectAurthorizedMobileNumber}
                          maxlength={"10"}
                          isMandatory={false}
                          pattern={"[6-9]{1}[0-9]{9}"}
                          required={"required"}
                          {...(validation = {
                            isRequired: true,
                          })}
                        />
                        {aurthorizedMobileNumber && aurthorizedMobileNumber.length > 0 && !aurthorizedMobileNumber.match(Digit.Utils.getPattern('MobileNo')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")}</CardLabelError>}
                      </Col>
                      <Col md={3} xxl lg="3">
                        <label htmlFor="name" className="text">Email <span className="text-danger font-weight-bold">*</span></label>
                        {/* <input
                                type="email"
                                name="name[]"
                                placeholder=""
                                class="employee-card-input"
                                onChange={(e) => setAurthorizedEmail(e.target.value)}
                              /> */}
                        <TextInput
                          t={t}
                          type={"email"}
                          isMandatory={false}
                          optionKey="i18nKey"
                          name="aurthorizedEmail"
                          // value={aurthorizedEmail}
                          placeholder=""
                          // onChange={setEmail}
                          onChange={(e) => setAurthorizedEmail(e.target.value)}
                          //disable={editScreen}
                          {...(validation = {
                            isRequired: true,
                            title: "Please enter Email"
                          })}
                        />
                        {aurthorizedEmail && aurthorizedEmail.length > 0 && !aurthorizedEmail.match(Digit.Utils.getPattern('Email')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px', color: 'red' }}>{("Invalid Email Address")}</CardLabelError>}
                      </Col>
                      <Col md={3} xxl lg="3">
                        <label htmlFor="name" className="text">Gender <span className="text-danger font-weight-bold">*</span></label>
                        <Dropdown
                          style={{ width: "100%" }}
                          className="form-field"
                          selected={gender?.length === 1 ? gender[0] : gender}
                          disable={gender?.length === 1 || editScreen}
                          option={menu}
                          select={setGenderName}
                          // value={gender}
                          optionKey="code"
                          t={t}
                          name="gender"
                        />
                      </Col>
                      <Col md={3} xxl lg="3">
                        <label htmlFor="name" className="text">Date of Birth <span className="text-danger font-weight-bold">*</span></label>
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
                          isMandatory={false}
                          optionKey="i18nKey"
                          name="aurthorizedPan"
                          // value={aurthorizedPan}
                          placeholder=""
                          // onChange={(e) => setAurthorizedPan(e.target.value)}
                          onChange={selectPanNumber}
                          {...{ required: true, title: t("BPA_INVALID_PAN_NO") }}
                        />
                        {aurthorizedPan && aurthorizedPan.length > 0 && !aurthorizedPan.match(Digit.Utils.getPattern('PAN')) && <CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px' }}>{t("BPA_INVALID_PAN_NO")}</CardLabelError>}
                      </Col>
                      <Col md={3} xxl lg="3">
                        <label htmlFor="name" className="text">Upload Aadhar PDF</label>
                        <input
                          type="file"
                          name="name[]"
                          placeholder=""
                          class="employee-card-input"
                          onChange={(e) => setFile({ file: e.target.files[0] })}
                        />
                      </Col>
                      <Col md={3} xxl lg="3">
                        <label htmlFor="name" className="text">Upload Digital Signature PDF</label>
                        <input
                          type="file"
                          name="name[]"
                          placeholder=""
                          class="employee-card-input"
                          onChange={(e) => setFile({ file: e.target.files[0] })}
                        />
                      </Col>
                    </Row>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAuthuser}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSubmitFormdata}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
              
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
