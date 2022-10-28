import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step1";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";


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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [developerData, setDeveloperData] = useState([]);
  const aurthorizedUserData = JSON.parse(localStorage.getItem("data_user"));

  const ApplicantFormSubmitHandlerForm = async (e) => {
    props.Step1Continue({"data": true});
    
  };

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
    setValue(
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
      );
  }, [getDeveloperData()]);

  useEffect(() => {
    if (aurthorizedUserData !== undefined && aurthorizedUserData !== null) {
      console.log("authorized user data", aurthorizedUserData.aurthorizedUserInfoArray[0].name);
    }
  }, [aurthorizedUserData]);

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
              <input type="text" className="form-control"  placeholder="N/A"
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

              <input type="text" className="form-control" placeholder="N/A" disabled {...register("authorizedPerson")} />
              <h3 className="error-message">{errors?.authorizedPerson && errors?.authorizedPerson?.message}</h3>
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Authorized Mobile No</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" className="form-control" placeholder="N/A" {...register("authorizedmobile")} disabled />
              {errors.mobile && <p>Please check the First Name</p>}
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
              <input type="tel" className="form-control" placeholder="Authorized Mobile No 2" {...register("authorizedmobile")} />
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>Email ID</b> <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("authorizedEmail")} disabled />
              {errors.email && <p>Please check the First Name</p>}
            </Col>
            <Col md={4} xxl lg="4">
              <div>
                <Form.Label>
                  <b>PAN No </b>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
              </div>
              <Form.Control type="text" placeholder="N/A" {...register("authorizedPan")} disabled />
              {errors.pan && <p>Please check the First Name</p>}
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
              <Form.Control type="text" placeholder="Address 1" {...register("authorizedAddress")} />
              {errors.address && <p>Please check the First Name</p>}
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
              <Form.Control type="text" placeholder="Pincode" {...register("authorizedPinCode")} />
              {errors.pincode && <p>Please check the First Name</p>}
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
              <Form.Control type="text" 
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
              <Form.Control type="text"
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
              <Form.Control type="text" disabled readOnly />
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
              <Form.Control type="text" 
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
               placeholder="N/A"
               {...register("authorized")}
              disabled readOnly />
            </div>
          </Row>
        </Form.Group>
        <div class="row">
    <div class="col-sm-12 text-right">
        <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block"  >Continue</button>
        </div>
        </div>
      </Card>
    </form>
  );
};

export default ApllicantFormStep1;
