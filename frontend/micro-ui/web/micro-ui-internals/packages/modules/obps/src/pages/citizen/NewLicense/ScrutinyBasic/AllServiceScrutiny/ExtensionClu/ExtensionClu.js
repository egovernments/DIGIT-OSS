import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import Collapse from "react-bootstrap/Collapse";
import axios from "axios";
import { FormHelperText } from "@mui/material";

function ExtensionClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm({});

  const extensionClu = (data) => console.log(data);
  const [open2, setOpen2] = useState(false);

  const getData = async () => {
    try {
      let body = {
        "requestInfo": {
          "api_id": "Rainmaker",
          "ver": "1",
          "ts": 0,
          "action": "_search",
          "did": "",
          "key": "",
          "msg_id": "090909",
          "requesterId": "",
          "authToken": "ad562593-1960-4b91-8e1a-40eb0005b299",
          "userInfo":
          {
            "id": 460,
            "uuid": "f9b7acaf-c1fb-4df2-ac10-83b55238a724",
            "userName": "EMP1013000030",
            "name": "CTP HR",
            "mobileNumber": "7015590762",
            "emailId": "ab@gmail.com",
            "locale": "en_IN",
            "type": "EMPLOYEE",
            "roles": [{
              "name": "Employee",
              "code": "EMPLOYEE",
              "tenantId": "hr"
            },
            {
              "name": "Chief Town Planner Haryana",
              "code": "CTP_HR",
              "tenantId": "hr"
            },
            {
              "name": "Super User",
              "code": "SUPERUSER",
              "tenantId": "hr"
            }],
            "active": true,
            "tenantId": "hr",
            "permanentCity": "jind"
          }
        }
      };
      const response = await axios.post(`/tl-services/v1/_search?tcpCaseNumber=${getValues('caseNo')}`,body)
      const details = response?.data?.Licenses?.[0];
      console.log("CLU response ====> ",response,details);
      setValue('applicationNo',details?.applicationNumber);
      setValue('naturePurpose',details?.applicationNumber);
      setValue('totalAreaSq',details?.applicationNumber);
      // setValue('cluDate',details?.applicationNumber);
      // setValue('expiryClu',details?.applicationNumber);
      setValue('applicantName',details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.companyName || details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.applicantName);
      setValue('mobile',details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.devDetail?.mobileNumberUser);
      setValue('emailAddress',details?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantInfo?.email);
    } catch (err) {

    }
  }

  return (
    <form onSubmit={handleSubmit(extensionClu)}>
      <div
        className="collapse-header"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f" }} className="">
          Extension of CLU permission
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension of CLU permission</h4>
            <div className="card">
              <Row className="col-12">
                <Form.Group className="col-4" as={Col} controlId="formGridCase">
                  <Form.Label>
                    <h2>
                      Case No.<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input className="form-control" placeholder="" {...register("caseNo",{
                    required: "This field can not be blank",
                    minLength:{
                      value: 7,
                      message: "Invalid Case No."
                    },
                    maxLength:{
                      value: 12,
                      message: "Invalid Case No."
                    }
                  })} onBlur={getData} />
                  <FormHelperText error={Boolean(errors?.caseNo)}>
                  {errors?.caseNo?.message}
                </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Application Number <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="number" className="form-control" placeholder="" {...register("applicationNo",{
                    minLength:{
                      value:2,
                      message:"Invalid Application Number"
                    },
                    maxLength:{
                      value:20, 
                      message:"Invalid Application Number"
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.applicationNo)}>
                  {errors?.applicationNo?.message}
                </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Nature (land Use) Purpose <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("naturePurpose",{
                    required: "This field cannot be blank",
                    minLength: {
                      value: 2,
                      message: "Invalid Nature (land Use) Purpose."
                    }, maxLength: {
                      value: 50,
                      message: "Invalid Nature (land Use) Purpose."
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]*$/,
                      message: "Invalid Nature (land Use) Purpose."
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.naturePurpose)}>
                  {errors?.naturePurpose?.message}
                </FormHelperText>
                </Form.Group>
              {/* </Row>
              <Row className="col-12"> */}
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Total Area in Sq. meter. <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="number" className="form-control" placeholder="" {...register("totalAreaSq",{
                    required: "This field cannot be blank",
                    minLength: {
                      value: 2,
                      message: "Invalid Nature (land Use) Purpose."
                    }, maxLength: {
                      value: 20,
                      message: "Invalid Nature (land Use) Purpose."
                    },
                    pattern: {
                      value: /^[0-9\b]+$/,
                      message: "Invalid Nature (land Use) Purpose."
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.totalAreaSq)}>
                  {errors?.totalAreaSq?.message}
                </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Date Of CLU
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="Date" className="form-control" placeholder="" {...register("cluDate",{
                    required: "This field cannot be blank"
                  })} />
                  <FormHelperText error={Boolean(errors?.cluDate)}>
                  {errors?.cluDate?.message}
                </FormHelperText>
                </Form.Group>
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Date of Expiry of CLU
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="Date" className="form-control" placeholder="" {...register("expiryClu",{
                    required: "This field cannot be blank"
                  })} />
                  <FormHelperText error={Boolean(errors?.expiryClu)}>
                  {errors?.expiryClu?.message}
                </FormHelperText>
                </Form.Group>
              {/* </Row> */}

              {/* <Row className="col-12"> */}
                <Form.Group className="col-6" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      Status of Approval of Building plan <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("buildingPlanApprovalStatus",{
                    required: "This field cannot be blank",
                    minLength:{
                      value:2,
                      message: "Invalid Approval of Building plan."
                    },
                    maxLength:{
                      value:99,
                      message: "Invalid Approval of Building plan."
                    },
                    pattern: {
                      value: /^[a-zA-Z]*$/,
                      message: "Invalid Approval of Building plan."
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.buildingPlanApprovalStatus)}>
                  {errors?.buildingPlanApprovalStatus?.message}
                </FormHelperText>
                </Form.Group>

                <Form.Group className="col-6" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Reason for Delay
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="textarea" className="form-control" placeholder="" {...register("reasonDelay",{
                    required:"This field cannot be blank",
                    minLength:{
                      value:2,
                      message:"Invalid Reason for Delay"
                    },
                    maxLength:{
                      value:9,
                      message:"Invalid Reason for Delay"
                    },
                    pattern:{
                      value:/^[a-zA-Z0-9]*$/,
                      message:"Invalid Reason for Delay"
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.reasonDelay)}>
                  {errors?.reasonDelay?.message}
                </FormHelperText>
                </Form.Group>

                  {/* </Row>

              <Row className="col-12"> */}
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Stage of construction <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("stageConstruction",{
                    required: "This field cannot be blank",
                    minLength:{
                      value:2,
                      message: "Invalid Stage of Construction."
                    },
                    maxLength:{
                      value:99,
                      message: "Invalid Stage of Construction."
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]*$/,
                      message: "Invalid Stage of Construction."
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.stageConstruction)}>
                  {errors?.stageConstruction?.message}
                </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Name of applicantName
                      <span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("applicantName",{
                    required: "This field cannot be blank",
                    minLength:{
                      value:1,
                      message: "Invalid Application Name."
                    },
                    maxLength:{
                      value:50,
                      message: "Invalid Application Name."
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]*$/,
                      message: "Invalid Application Name."
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.applicantName)}>
                  {errors?.applicantName?.message}
                </FormHelperText>
                </Form.Group>
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Mobile
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="tel" className="form-control" placeholder="" {...register("mobile",{
                    required: "This field cannot be blank",
                    minLength:{
                      value:10,
                      message: "Invalid Mobile No."
                    },
                    maxLength:{
                      value:10,
                      message: "Invalid Mobile No."
                    },
                    pattern: {
                      value: /^[0-9\b]+$/,
                      message: "Invalid Mobile No."
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.mobile)}>
                  {errors?.mobile?.message}
                </FormHelperText>
                </Form.Group>
              {/* </Row>
              <Row className="col-12"> */}
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Email-Address <span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                  </Form.Label>
                  <input type="email" className="form-control" placeholder="" {...register("emailAddress",{
                    required:"This field cannot be blank",
                    minLength:{
                      value:1,
                      message:"Invalid Email Address"
                    },
                    maxLength:{
                      value:50,
                      message:"Invalid Email Address"
                    },
                    pattern:{
                      value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message:"Invalid Email Address"
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.emailAddress)}>
                  {errors?.emailAddress?.message}
                </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Address
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("address",{
                    required:"This field cannot be blank",
                    minLength:{
                      value:1,
                      message:"Invalid Address"
                    },
                    maxLength:{
                      value:50,
                      message:"Invalid Address"
                    },
                    pattern:{
                      value:/^[a-zA-Z0-9]*$/,
                      message:"Invalid Address"
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.address)}>
                  {errors?.address?.message}
                </FormHelperText>
                </Form.Group>
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Village <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("village",{
                    minLength:{
                      value:1,
                      message:"Invalid Village"
                    },
                    maxLength:{
                      value:50,
                      message:"Invalid Village"
                    },
                    pattern:{
                      value:/^[a-zA-Z0-9]*$/,
                      message:"Invalid Village"
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.village)}>
                  {errors?.village?.message}
                </FormHelperText>
                </Form.Group>
              {/* </Row>
              <Row className="col-12"> */}
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Tehsil
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("tehsil",{
                    minLength:{
                      value:1,
                      message:"Invalid Tehsil"
                    },
                    maxLength:{
                      value:50,
                      message:"Invalid Tehsil"
                    },
                    pattern:{
                      value:/^[a-zA-Z0-9]*$/,
                      message:"Invalid Tehsil"
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.tehsil)}>
                  {errors?.tehsil?.message}
                </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Pin code
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <input type="number" className="form-control" placeholder="" {...register("pinCode",{
                    minLength:{
                      value:6,
                      message:"Invalid Pincode"
                    },
                    maxLength:{
                      value:6,
                      message:"Invalid Pincode"
                    },
                    pattern:{
                      value:/^[a-zA-Z0-9]*$/,
                      message:"Invalid Pincode"
                    }
                  })} />
                  <FormHelperText error={Boolean(errors?.pinCode)}>
                  {errors?.pinCode?.message}
                </FormHelperText>
                </Form.Group>

                
              </Row>
              <br></br>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Sr.No</th>
                    <th style={{ textAlign: "center" }}>Field Name</th>
                    <th style={{ textAlign: "center" }}>Upload Documents</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>
                      Upload BR-III<span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>
                      {" "}
                      Upload photographs of building under construction showing the status of construction at the site{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("uploadPhotographs")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>
                      {" "}
                      Receipt of application if any submitted for taking occupation certificate <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("receiptApplication")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>
                      {" "}
                      Upload approved Building Plan <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("uploadBuildingPlan")}></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>
                      {" "}
                      Indemnity Bond <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input>
                    </td>
                  </tr>
                </tbody>
              </div>
              <div class="row">
                <div class="col-sm-12 text-right">
                  <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                    Submit
                  </button>
                </div>
                <div class="col-sm-12 text-right">
                  <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Collapse>
    </form>
  );
}

export default ExtensionClu;
