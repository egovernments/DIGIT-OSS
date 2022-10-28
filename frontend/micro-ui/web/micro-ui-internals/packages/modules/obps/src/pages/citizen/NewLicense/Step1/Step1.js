import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step1";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";

const optionsArrList = [
  {
    name: "test",
    label: "K.Mishra",
    value: "01",
    id: "1",
  },
  { name: "test", label: "Developer 1", value: "02", id: "2" },
  { name: "test", label: "Developer 2", value: "03", id: "3" },
];
const optionsVillageList = [
  {
    label: "Balabgarh",
    value: "01",
    id: "1",
  },
  {
    label: "Village",
    value: "02",
    id: "2",
  },
  {
    label: "City",
    value: "03",
    id: "3",
  },
];
const optionsTehsilList = [
  {
    label: "Tehsil 1",
    value: "01",
    id: "1",
  },
  {
    label: "Tehsil 2",
    value: "02",
    id: "2",
  },
  {
    label: "Tehsil 3",
    value: "03",
    id: "3",
  },
];
const optionsDistrictList = [
  {
    label: "District 1",
    value: "01",
    id: "1",
  },
  {
    label: "District 2",
    value: "02",
    id: "2",
  },
  {
    label: "District 3",
    value: "03",
    id: "3",
  },
];
const optionsStateList = [
  {
    label: "State 1",
    value: "01",
    id: "1",
  },
  {
    label: "State 2",
    value: "02",
    id: "2",
  },
  {
    label: "State 3",
    value: "03",
    id: "3",
  },
];
const ApllicantFormStep1 = (props) => {
  const [post, setPost] = useState([]);
  const [form, setForm] = useState([]);
  const [developer, setDeveloper] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobile2, setMobile2] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [village1, setvillage1] = useState("");
  const [pincode, setPincode] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [nameOwner, setnameOwner] = useState("");
  const [FormSubmitted, SetFormSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
    // defaultValues,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [developerData, setDeveloperData] = useState([]);
  const aurthorizedUserData = JSON.parse(localStorage.getItem("data_user"));

  
  const handleDeveloperChange = event => {
    setDeveloper(event.target.value);

};

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMobileChange = (event) => {
    setMobile(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePanChange = (event) => {
    setPan(event.target.value);
  };
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  const handleVillageChange = (event) => {
    setvillage1(event.target.value);
  };
  const handlePinChange = (event) => {
    setPincode(event.target.value);
  };
  const handleNameOwnerChange = (event) => {
    setnameOwner(event.target.value);
  };

  const [employeeName, employeedata] = useState([]);

  const ApplicantFormSubmitHandlerForm = async (e) => {
    
    SetFormSubmitted(true);
    props.Step1Continue({ data: true });
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
      nameOwner: nameOwner,
    };
    localStorage.setItem("key", JSON.stringify(forms));

  };
  useEffect(() => {
    if (FormSubmitted) {
      props.ApplicantFormSubmit(true);
    }
  }, [FormSubmitted]);

    const getDeveloperData = async () => {

        try {
            const Resp = await axios.get("http://10.1.1.18:8086/user/developer/_getAuthorizedUser?mobileNumber=1111111111").then((response) => {
                return response
            });
            setDeveloperData(Resp.data)

        } catch (error) {
            console.log(error.message);
        }

    }
    useEffect(() => {
        setValue("authorizedDeveloper",(developerData!==null && developerData!==undefined)?
        developerData?.developerRegistration?.developerDetail[0].devDetail?.addInfo?.companyName:"N/A"),
        setValue("authorizedPerson", (developerData!==null && developerData!==undefined)?
        developerData?.developerRegistration?.developerDetail[0].devDetail?.addRemoveAuthoizedUsers[0].userName:"N/A"),
        setValue("authorizedmobile",(developerData!==null && developerData!==undefined)?
        developerData?.developerRegistration?.developerDetail[0].devDetail?.addRemoveAuthoizedUsers[0].mobileNumber:"N/A"),
        setValue("authorizedEmail",(developerData!==null && developerData!==undefined)?
        developerData?.developerRegistration?.developerDetail[0].devDetail?.addRemoveAuthoizedUsers[0].emailId:"N/A"),
        setValue("authorizedPan",(developerData!==null && developerData!==undefined)?
        developerData?.developerRegistration?.developerDetail[0].devDetail?.addRemoveAuthoizedUsers[0].pan:"N/A")
    }, [getDeveloperData()]);


    // const getUserDevData = async () => {

    //     try {
    //         const Resp = await axios.post("http://10.1.1.18:8086/user/developer/_getAuthorizedUser?mobileNumber=1111111111").then((response) => {
    //             return response
    //         });
    //         setDeveloperData(Resp.data)

    //     } catch (error) {
    //         console.log(error.message);
    //     }

    // }
    // useEffect(() => {
    //     getUserDevData();
    // }, []);

    useEffect(() => {
        if (developerData !== undefined && developerData !== null) {
            console.log("authorized user data", developerData?.developerRegistration?.developerDetail[0].devDetail?.addInfo?.companyName)
        }
    }, [developerData]);
    console.log("data", developerData)

  return (
    <form onSubmit={handleSubmit(ApplicantFormSubmitHandlerForm)}>
      <Card style={{ width: "126%", marginLeft: "19px", paddingRight: "10px" }}>
        <Form.Group className="justify-content-center" controlId="formBasicEmail">
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Developer</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div><input type="text" className="form-control" name="authorizedDeveloper" placeholder="N/A"
              disabled
                   {...register("authorizedDeveloper")}/>
                      <h3 className="error-message"style={{color:"red"}}>{errors?.authorizedDeveloper && errors?.authorizedDeveloper?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Authorized Person Name </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>

              <input
                type="text"
                className="form-control"
                name="authorizedPerson"
                placeholder="N/A" disabled {...register("authorizedPerson")} 
              />
              <h3 className="error-message"style={{color:"red"}}>{errors?.authorizedPerson && errors?.authorizedPerson?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Authorized Mobile No</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                className="form-control"
                name="authorizedmobile"
                placeholder="N/A"
                {...register("authorizedmobile")}
                disabled
              />
               <h3 className="error-message"style={{color:"red"}}>{errors?.authorizedmobile && errors?.authorizedmobile?.message}</h3>
            </Col>
          </Row>
          <br></br>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Alternate Mobile No  </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                className="form-control"
                name="alternatemobile"
                placeholder="N/A"
                {...register("alternatemobile")}
                disabled
              />
               <h3 className="error-message"style={{color:"red"}}>{errors?.alternatemobile && errors?.alternatemobile?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Email ID</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                name="authorizedEmail"
                placeholder="N/A"
                {...register("authorizedEmail")}
                disabled 
              />
               <h3 className="error-message" style={{color:"red"}}>{errors?.authorizedEmail && errors?.authorizedEmail?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>PAN No </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                name="authorizedPan"
                placeholder="N/A"
                {...register("authorizedPan")}
                disabled
              />
              <h3 className="error-message" style={{color:"red"}}>{errors?.authorizedPan && errors?.authorizedPan?.message}</h3>
            </Col>
          </Row>
          <br></br>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Address 1</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                placeholder="N/A"
                name="authorizedAddress"
                {...register("authorizedAddress")}
              />
              <h3 className="error-message" style={{color:"red"}}>{errors?.authorizedAddress && errors?.authorizedAddress?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Village/City </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
               <Form.Control
                type="text"
                name="village"
                placeholder="N/A"
                {...register("village")}
                disabled
              />
              <h3 className="error-message" style={{color:"red"}}>{errors?.village && errors?.village?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Pincode</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                name="authorizedPinCode"
                placeholder="N/A"
                {...register("authorizedPinCode")}
                disabled
               
              />
              <h3 className="error-message" style={{color:"red"}}>{errors?.authorizedPinCode && errors?.authorizedPinCode?.message}</h3>
            </Col>
          </Row>
          <br></br>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Tehshil </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                name="tehsil"
                placeholder="N/A"
                {...register("tehsil")}
                disabled
              />
              <h3 className="error-message" style={{color:"red"}}>{errors?.tehsil && errors?.tehsil?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>District</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                name="district"
                placeholder="N/A"
                {...register("district")}
                disabled
              />
              <h3 className="error-message" style={{color:"red"}}>{errors?.district && errors?.district?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>State</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                name="state"
                placeholder="N/A"
                {...register("state")}
                disabled
              />
              <h3 className="error-message" style={{color:"red"}}>{errors?.state && errors?.state?.message}</h3>
            </Col>
          </Row>
          <br></br>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Status (Individual/ Company/ Firm/ LLP etc.)</b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" name="status"
              placeholder="N/A"
              {...register("status")}
              disabled readOnly />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label style={{ marginTop: "15" }}>
                  <b>LC-I signed by </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" name="LC-1"
              placeholder="N/A"
              {...register("LC-1")}
              />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Address for communication</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" name="address"
              placeholder="N/A"
              {...register("address")}
              />
            </Col>
          </Row>
          <br></br>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Permanent address in case of individual/ registered office address in case other than individual</b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" name="permanentAddress"
              placeholder="N/A"
              {...register("permanentAddress")}
              disabled readOnly
              />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)</b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" 
              name="notSigned"
              placeholder="N/A"
              {...register("notSigned")}
              />
            </Col>
            <Col md={4} xxl lg="4" style={{ marginTop: 23 }}>
              <div>
                <Form.Label>
                  <b>Email ID for communication</b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" 
               name="email"
               placeholder="N/A"
               {...register("email")}
              disabled readOnly />
            </Col>
          </Row>
          <br></br>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <div className="col col-4">
              <div>
                <Form.Label>
                  <b>Name of the authorized person to sign the application</b>
                  <span style={{ color: "red" }}>*</span>
                  <i className="fa fa-info-circle-fill" />
                </Form.Label>
              </div>
              <Form.Control type="text"
               name="authorized"
               placeholder="N/A"
               {...register("authorized")}
              disabled readOnly />
            </div>
          </Row>
        </Form.Group>
        <div class="row">
    <div class="col-sm-12 text-right">
        <button id="btnSearch" class="btn btn-primary btn-md center-block"  >Continue</button>
        </div>
        </div>
      </Card>
    </form>
  );
};

export default ApllicantFormStep1;
