

import React, { useState, useEffect } from "react";
import { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import TextField from '@mui/material/TextField';

import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect"

const optionsArrList = [
    {
        label: "K.Mishra",
        value: "01",
        id: "1"
    },
    {
        label: "Developer 1",
        value: "02",
        id: "2"
    },
    {
        label: "Developer 2",
        value: "03",
        id: "3"
    },
]
const optionsVillageList = [
    {
        label: "Balabgarh",
        value: "01",
        id: "1"
    },
    {
        label: "Village",
        value: "02",
        id: "2"
    },
    {
        label: "City",
        value: "03",
        id: "3"
    },
]
const optionsTehsilList = [
    {
        label: "Tehsil 1",
        value: "01",
        id: "1"
    },
    {
        label: "Tehsil 2",
        value: "02",
        id: "2"
    },
    {
        label: "Tehsil 3",
        value: "03",
        id: "3"
    },
]
const optionsDistrictList = [
    {
        label: "District 1",
        value: "01",
        id: "1"
    },
    {
        label: "District 2",
        value: "02",
        id: "2"
    },
    {
        label: "District 3",
        value: "03",
        id: "3"
    },
]
const optionsStateList = [
    {
        label: "State 1",
        value: "01",
        id: "1"
    },
    {
        label: "State 2",
        value: "02",
        id: "2"
    },
    {
        label: "State 3",
        value: "03",
        id: "3"
    },
]
// import { selectAurthorizedUserValuesArray } from "../../Redux/Slicer/Slicer";
// import {setApplicantFormData} from "../../Redux/Slicer/Slicer";
// import { useDispatch } from "react-redux";
const ApllicantFormStep1 = (props) => {
    const [post, setPost] = useState([]);
    const [form, setForm] = useState([]);
    const [developer, setDeveloper] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [mobile2, setMobile2] = useState('');
    const [email, setEmail] = useState('');
    const [pan, setPan] = useState('');
    const [address, setAddress] = useState('');
    const [village1, setvillage1] = useState('');
    const [pincode, setPincode] = useState('');
    const [tehsil, setTehsil] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [nameOwner, setnameOwner] = useState('');
    const [FormSubmitted, SetFormSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const aurthorizedUserData = JSON.parse(localStorage.getItem("data_user"));
    // const dispatch = useDispatch();

    const handleNameChange = event => {
        setName(event.target.value);

    };

    const handleMobileChange = event => {

        setMobile(event.target.value);
    };
    const handleEmailChange = event => {

        setEmail(event.target.value);
    };
    const handlePanChange = event => {

        setPan(event.target.value);
    };
    const handleAddressChange = event => {

        setAddress(event.target.value);
    };
    const handleVillageChange = event => {

        setvillage1(event.target.value);
    };
    const handlePinChange = event => {

        setPincode(event.target.value);
    };
    const handleNameOwnerChange = event => {

        setnameOwner(event.target.value);
    };

    const[employeeName,employeedata]=useState([]);

    const ApplicantFormSubmitHandlerForm = async(e) => {
        e.preventDefault();
        SetFormSubmitted(true);
        props.Step1Continue({"data":true})
        const forms = {
            developer: developer,
            name: name,
            mobile: mobile,
            mobile2: mobile2,
            email: email,
            pan: pan,
            address: address,
            village1: village1,
            pincode: pincode,
            tehsil: tehsil,
            district: district,
            state: state,
            nameOwner: nameOwner

        };
        localStorage.setItem("key",JSON.stringify(forms))
       
        
        // console.log("FRMDATA",forms);
        // localStorage.setItem('step1', JSON.stringify(forms))
        // form.push(forms)
        // let frmData = JSON.parse(localStorage.getItem('step1') || "[]")
    };
    useEffect(() => {
        if (FormSubmitted) {
            props.ApplicantFormSubmit(true);
        }
       

    }, [FormSubmitted])
   
    useEffect(()=>{
        if (aurthorizedUserData!==undefined && aurthorizedUserData !== null) {
            console.log("authorized user data",aurthorizedUserData.aurthorizedUserInfoArray[0].name)
        }
    },[aurthorizedUserData]);

    return (
      
        <Form  autoComplete="off">
            <Card style={{width:"126%",marginLeft:"19px",paddingRight:"10px"}}>
                <Form.Group className="justify-content-center" controlId="formBasicEmail">
                    <Row className="ml-auto" style={{ marginBottom: 5 }}>
              
                <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Developer</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <ReactMultiSelect 
                        listOfData={optionsArrList}
                        labels="Developer"
                        getSelectedValue={setDeveloper} />
                       
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Authorized Person Name </b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                          
               
                            <input   type="text" className="form-control"  pattern="[A-Za-z]*" name="authorizedPerson" minLength={10} maxLength={99}

                                onChange={(e) => setName(e.target.value)} 
                                placeholder={(aurthorizedUserData!==null && aurthorizedUserData!==undefined)?
                                    aurthorizedUserData.aurthorizedUserInfoArray[0].name:"N/A"}
                                    onChange1={handleNameChange} value=
                                    {(aurthorizedUserData!==null && aurthorizedUserData!==undefined)?
                                        aurthorizedUserData.aurthorizedUserInfoArray[0].name:"N/A"} disabled/>
                            {errors.name && <p>Please check the First Name</p>}
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Authorized Mobile No1</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" className="form-control"  pattern="[0-9]*" name="authorizedmobile" maxLength={10}

                                onChange={(e) => setMobile(e.target.value)} 
                                placeholder={(aurthorizedUserData!==null && aurthorizedUserData!==undefined)?
                                    aurthorizedUserData.aurthorizedUserInfoArray[0].mobile:"N/A"}
                                onChange1={handleMobileChange} value={(aurthorizedUserData!==null && aurthorizedUserData!==undefined)?
                                    aurthorizedUserData.aurthorizedUserInfoArray[0].mobile:"N/A"}disabled />
                            {errors.mobile && <p>Please check the First Name</p>}


                        </Col>

                    </Row><br></br>
                    <Row className="ml-auto" style={{ marginBottom: 5 }}>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Authorized Mobile No 2 </b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <input  type="tel"  className="form-control"  pattern="[0-9]*" name="authorizedmobile" maxLength={10} placeholder="Authorized Mobile No 2" onChange={(e) => setMobile2(e.target.value)} value={mobile2} />
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Email ID</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" name="authorizedEmail" maxLength={25} pattern="[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]*"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={(aurthorizedUserData!==null && aurthorizedUserData!==undefined)?
                                    aurthorizedUserData.aurthorizedUserInfoArray[0].email:"N/A"}
                                onChange1={handleEmailChange} 
                                value={(aurthorizedUserData!==null && aurthorizedUserData!==undefined)?
                                    aurthorizedUserData.aurthorizedUserInfoArray[0].email:"N/A"} disabled/>
                            {errors.email && <p>Please check the First Name</p>}
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>PAN No </b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text"  name="authorizedPan" maxLength={10} pattern="[a-z]+[0-9]+[0-9]*"
                                onChange={(e) => setPan(e.target.value)} 
                                placeholder={(aurthorizedUserData!==null && aurthorizedUserData!==undefined)?
                                    aurthorizedUserData.aurthorizedUserInfoArray[0].pan:"N/A"}
                                onChange1={handlePanChange}
                                value={(aurthorizedUserData!==null && aurthorizedUserData!==undefined)?
                                    aurthorizedUserData.aurthorizedUserInfoArray[0].pan:"N/A"} disabled/> 
                            {errors.pan && <p>Please check the First Name</p>}
                        </Col>


                    </Row><br></br>
                    <Row className="ml-auto" style={{ marginBottom: 5 }}>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Address 1</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" placeholder="Address 1"  name="authorizedAddress" minLength={4} maxLength={30} pattern="[A-Za-z]+[0-9]*"
                                onChange={(e) => setAddress(e.target.value)} value={address} onChange1={handleAddressChange} />
                            {errors.address && <p>Please check the First Name</p>}
                        </Col>
                        <Col md={4} xxl lg="4">
                    
                                {/* <Form.Label><b>Village/City </b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <input type="text" className="form-control"list="data1"/>
                            <datalist id="data1">
                                {
                                    employeeName.map(result=>
                                        {
                                            <option>{result.employee_name}</option>
                                        })
                                }
                            </datalist> */}
                            <div>
                                <Form.Label><b>Village/City </b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <ReactMultiSelect 
                        listOfData={optionsVillageList}
                        labels="text"
                        getSelectedValue={setvillage1} />
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Pincode</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" placeholder="Pincode"pattern="[0-9]*" name="authorizedPinCode" maxLength={6}
                                onChange={(e) => setPincode(e.target.value)} value={pincode} onChange1={handlePinChange} />
                            {errors.pincode && <p>Please check the First Name</p>}
                        </Col>

                    </Row><br></br>
                    <Row className="ml-auto" style={{ marginBottom: 5 }}>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Tehshil </b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <ReactMultiSelect 
                        listOfData={optionsTehsilList}
                        labels="text" 
                        getSelectedValue={setTehsil}/>
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>District</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <ReactMultiSelect 
                        listOfData={optionsDistrictList}
                        labels="text"
                        getSelectedValue={setDistrict} />
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>State</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <ReactMultiSelect 
                        listOfData={optionsStateList}
                        labels="text" 
                        getSelectedValue={setState}/>
                        </Col>
                    </Row><br></br>
                    <Row className="ml-auto" style={{ marginBottom: 5 }}>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Status (Individual/ Company/ Firm/ LLP etc.)</b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" disabled readOnly />
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label style={{ marginTop: "15" }}><b>LC-I signed by </b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" disabled readOnly />
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Address for communication</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" disabled readOnly />
                        </Col>
                    

                    </Row><br></br>
                    <Row className="ml-auto" style={{ marginBottom: 5 }}>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Permanent address in case of individual/ registered office address in case other than individual</b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" disabled readOnly />
                        </Col>
                        <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)</b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" disabled readOnly />
                        </Col>
                        <Col md={4} xxl lg="4" style={{marginTop:23}}>
                            <div>
                                <Form.Label><b>Email ID for communication</b><span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text" disabled readOnly />
                        </Col>
                    

                    </Row><br></br>
                    <Row className="ml-auto" style={{ marginBottom: 5 }}>
                  <div className="col col-4">
                            <div>
                                <Form.Label><b>Name of the authorized person to sign the application</b><span style={{ color: "red" }}>*</span><i className="fa fa-info-circle-fill"/></Form.Label>
                            </div>
                            <Form.Control type="text" disabled readOnly />
                        </div>
                        {/* <Col md={4} xxl lg="4">
                            <div>
                                <Form.Label><b>Name of individual Land owner/ land-owning company/ firm/ LLP etc.</b> <span style={{ color: "red" }}>*</span></Form.Label>
                            </div>
                            <Form.Control type="text"  pattern="[A-Za-z]*" minLength={4}
                                onChange={(e) => setnameOwner(e.target.value)} value={nameOwner} onChange1={handleNameOwnerChange} />
                            {errors.nameOwner && <p></p>}
                        </Col> */}


                    </Row>

                </Form.Group>
                <Button 
                    style={{ alignSelf: "center", marginTop: "25px",marginLeft:"-1249px" }} 
                    variant="primary" type="submit" 
                    >
              Back
            </Button>
            <Button 
            style={{ alignSelf: "center", marginTop: "-35px", marginLeft: "1163px" }} 
            variant="primary"  
            onClick={ApplicantFormSubmitHandlerForm}>
                Continue
            </Button>
               
            </Card>
        </Form>
       
    )
}

export default ApllicantFormStep1;