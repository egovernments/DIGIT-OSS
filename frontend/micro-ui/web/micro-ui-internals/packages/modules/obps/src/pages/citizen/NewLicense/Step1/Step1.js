import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step1";

const ApllicantFormStep1 = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const [authorizedDeveloper, setAuthorizedDeveloper] = useState("");
  const [authorizedPerson, setAuthorizedPerson] = useState("");
  const [authorizedmobile, setAuthorizedmobile] = useState("");
  const [alternatemobile, setAlternatemobile] = useState("");
  const [authorizedEmail, setAuthorizedEmail] = useState("");
  const [authorizedPan, setAuthorizedPan] = useState("");
  const [authorizedAddress, setAuthorizedAddress] = useState("");
  const [village, setVillage] = useState("");
  const [authorizedPinCode, setAuthorizedPinCode] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [LC, setLC] = useState("");
  const [address, setAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [notSigned, setNotSigned] = useState("");
  const [email, setEmail] = useState("");
  const [authorized, setAuthorized] = useState("");

  const [developerData, setDeveloperData] = useState([]);
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const ApplicantFormSubmitHandlerForm = async (data) => {
    console.log("data===", data);
    props.Step1Continue(data);
  };

  const forms = {
    authorizedDeveloper: authorizedDeveloper,
    authorizedPerson: authorizedPerson,
    authorizedmobile: authorizedmobile,
    alternatemobile: alternatemobile,
    authorizedEmail: authorizedEmail,
    authorizedPan: authorizedPan,
    authorizedAddress: authorizedAddress,
    village: village,
    authorizedPinCode: authorizedPinCode,
    tehsil: tehsil,
    district: district,
    state: state,
    status: status,
    LC:LC,
    address :address ,
    permanentAddress :permanentAddress ,
    notSigned :notSigned ,
    email :email ,
    authorized:authorized

};
localStorage.setItem("Applicant Info",JSON.stringify(forms))

  const getDeveloperData = async () => {
    try {
      const Resp = await axios.get("http://10.1.1.18:8086/user/developer/_getAuthorizedUser?mobileNumber=1111111111").then((response) => {
        return response;
      });
      setDeveloperData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getDeveloperData()
    
  }, [ setValue(
    "authorizedDeveloper",
    developerData !== null && developerData !== undefined
      ? developerData?.developerRegistration?.developerDetail[0].devDetail?.addInfo?.companyName
      : "N/A"
  ),
    setValue(
      "authorizedPerson",
      developerData !== null && developerData !== undefined
        ? developerData?.developerRegistration?.developerDetail[0].devDetail?.addRemoveAuthoizedUsers[0].userName
        : "N/A"
    ),
    setValue(
      "authorizedmobile",
      developerData !== null && developerData !== undefined
        ? developerData?.developerRegistration?.developerDetail[0].devDetail?.addRemoveAuthoizedUsers[0].mobileNumber
        : "N/A"
    ),
    setValue(
      "authorizedEmail",
      developerData !== null && developerData !== undefined
        ? developerData?.developerRegistration?.developerDetail[0].devDetail?.addRemoveAuthoizedUsers[0].emailId
        : "N/A"
    ),
    setValue(
      "authorizedPan",
      developerData !== null && developerData !== undefined
        ? developerData?.developerRegistration?.developerDetail[0].devDetail?.addRemoveAuthoizedUsers[0].pan
        : "N/A"
    ),]);

  const getDeveloperDataLabel = async () => {
    try { 
       const postDistrict = {
        tenantId: "pb",
        uuid: [
            "b49784fb-59d9-4d37-b837-abc9919a26fe"
        ],
        "RequestInfo": {
            apiId: "Rainmaker",
            authToken: "cf3e6e7a-0fdf-4862-a55d-3ed07bbeb143",
           
            msgId: "1666945960102|en_IN"
        }
  }
      const Resp = await axios.post("http://localhost:3000/user/_search?_=1666935568224",postDistrict).then((response) => {
        return response;
      });
      setDeveloperDataLabel(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getDeveloperDataLabel()
  }, []);

  useEffect(() => {
    if (developerDataLabel !== undefined && developerDataLabel !== null) {
      console.log("authorized user data Label", developerDataLabel?.user?.altContactNumber);
    }
  }, [developerDataLabel]);
  console.log("data", developerDataLabel);
  useEffect(() => {
    if (developerData !== undefined && developerData !== null) {
      console.log("authorized user data", developerData?.developerRegistration?.developerDetail[0].devDetail?.addInfo?.companyName);
    }
  }, [developerData]);
  console.log("data", developerData);

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
              </div>
              <input type="text" className="form-control" placeholder="N/A" disabled {...register("authorizedDeveloper")} 
                onChange={(e) => setAuthorizedDeveloper(e.target.value)} value={ developerData !== null && developerData !== undefined
                  ? developerData?.developerRegistration?.developerDetail[0].devDetail?.addInfo?.companyName
                  : "N/A"} />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.authorizedDeveloper && errors?.authorizedDeveloper?.message}
              </h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Authorized Person Name </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>

              <input type="text" className="form-control" placeholder="N/A" disabled {...register("authorizedPerson")} />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.authorizedPerson && errors?.authorizedPerson?.message}
              </h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Authorized Mobile No</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" className="form-control" placeholder="N/A" {...register("authorizedmobile")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.authorizedmobile && errors?.authorizedmobile?.message}
              </h3>
            </Col>
          </Row>
          <br></br>
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Alternate Mobile No </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" className="form-control" placeholder="N/A" {...register("alternatemobile")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.alternatemobile && errors?.alternatemobile?.message}
              </h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Email ID</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("authorizedEmail")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.authorizedEmail && errors?.authorizedEmail?.message}
              </h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>PAN No </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("authorizedPan")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.authorizedPan && errors?.authorizedPan?.message}
              </h3>
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
              <Form.Control type="text" placeholder="N/A" {...register("authorizedAddress")} />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.authorizedAddress && errors?.authorizedAddress?.message}
              </h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Village/City </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("village")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.village && errors?.village?.message}
              </h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Pincode</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("authorizedPinCode")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.authorizedPinCode && errors?.authorizedPinCode?.message}
              </h3>
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
              <Form.Control type="text" placeholder="N/A" {...register("tehsil")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.tehsil && errors?.tehsil?.message}
              </h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>District</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("district")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.district && errors?.district?.message}
              </h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>State</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("state")} disabled />
              <h3 className="error-message" style={{ color: "red" }}>
                {errors?.state && errors?.state?.message}
              </h3>
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
              <Form.Control type="text" placeholder="N/A" {...register("status")} disabled readOnly />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label style={{ marginTop: "15" }}>
                  <b>LC-I signed by </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("LC")}   onChange={(e) => setLC(e.target.value)} value={LC}/>
              <h3 className="error-message"style={{color:"red"}}>{errors?.LC && errors?.LC?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Address for communication</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("address")} />
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
              <Form.Control type="text" placeholder="N/A" {...register("permanentAddress")} disabled readOnly />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)</b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("notSigned")} onChange={(e) => setNotSigned(e.target.value)} value={notSigned}/>
              <h3 className="error-message"style={{color:"red"}}>{errors?.notSigned && errors?.notSigned?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4" style={{ marginTop: 23 }}>
              <div>
                <Form.Label>
                  <b>Email ID for communication</b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("email")} disabled readOnly />
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
              <Form.Control type="text" placeholder="N/A" {...register("authorized")} disabled readOnly />
            </div>
          </Row>
        </Form.Group>
        <div class="row">
          <div class="col-sm-12 text-right">
            <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
              Continue
            </button>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default ApllicantFormStep1;
