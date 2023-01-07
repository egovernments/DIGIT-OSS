import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step1";
import { useLocation, useHistory } from "react-router-dom";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";

const ApllicantFormStep1 = (props) => {
  const history = useHistory();
  const location = useLocation();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const tenant = Digit.ULBService.getCurrentTenantId();
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  // const [getAppliantInfoData, setAppliantInfoData] = useState(null);
  const [applicantId, setApplicantId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    trigger,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const token = window?.localStorage?.getItem("token");
  const ApplicantFormSubmitHandlerForm = async (data) => {
    // props.Step1Continue("6", "userInfo", "licData");

    // data["notSigned"] = data?.notSigned?.value;
    const postDistrict = {
      pageName: "ApplicantInfo",
      action: "INITIATE",
      applicationNumber: applicantId,
      createdBy: userInfo?.id,
      updatedBy: userInfo?.id,

      LicenseDetails: {
        ApplicantInfo: {
          ...data,
          devDetail: developerDataLabel,
        },
      },
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: token,
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios.post("/tl-services/new/_create", postDistrict);
      const licData = Resp?.data?.LicenseServiceResponseInfo?.[0]?.LicenseDetails?.[0];
      history.push({
        pathname: window.location.pathname,
        search: `?id=${Resp?.data?.LicenseServiceResponseInfo?.[0]?.applicationNumber}`,
      });
      props.Step1Continue(Resp?.data?.LicenseServiceResponseInfo?.[0]?.applicationNumber, userInfo, licData);
    } catch (error) {
      return error;
    }
  };

  const getUserInfo = async () => {
    const uuid = userInfo?.uuid;
    if (uuid) {
      try {
        const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
        const userData = usersResponse?.user[0];
        setValue("authorized", userData?.name);
        setValue("LC", userData?.name);
        getDeveloperDataLabel(userData?.parentId);
      } catch (error) {
        return error;
      }
    }
  };

  const getDeveloperDataLabel = async (id) => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:80/user/developer/_getDeveloperById?id=${id}&isAllData=false`);
      setDeveloperDataLabel(Resp?.data?.devDetail?.[0]);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (developerDataLabel) {
      setValue("authorizedDeveloper", developerDataLabel?.licenceDetails?.name);
      setValue("authorizedPerson", developerDataLabel?.aurthorizedUserInfoArray?.[0]?.name);
      setValue("authorizedmobile", developerDataLabel?.aurthorizedUserInfoArray?.[0]?.mobileNumber);
      setValue("alternatemobile", developerDataLabel?.licenceDetails?.mobileNumber);
      setValue("authorizedEmail", developerDataLabel?.licenceDetails?.email);
      setValue("authorizedPan", developerDataLabel?.licenceDetails?.panNumber);
      setValue("authorizedAddress", developerDataLabel?.licenceDetails?.addressLineOne);
      setValue("village", developerDataLabel?.licenceDetails?.village);
      setValue("authorizedPinCode", developerDataLabel?.licenceDetails?.pincode);
      setValue("tehsil", developerDataLabel?.licenceDetails?.tehsil);
      setValue("district", developerDataLabel?.licenceDetails?.district);
      setValue("state", developerDataLabel?.licenceDetails?.state);
      setValue("status", developerDataLabel?.addInfo?.showDevTypeFields);
      setValue("address", developerDataLabel?.addInfo?.registeredAddress);
      setValue(
        "permanentAddress",
        `${developerDataLabel?.licenceDetails?.addressLineOne} ${developerDataLabel?.licenceDetails?.addressLineTwo} ${developerDataLabel?.licenceDetails?.addressLineThree}`
      );
      setValue("email", developerDataLabel?.addInfo?.email);
    }
  }, [developerDataLabel]);

  useEffect(() => {
    const search = location?.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");
    setApplicantId(id?.toString());
    // if (id) getApplicantUserData(id);
  }, []);

  return (
    <form onSubmit={handleSubmit(ApplicantFormSubmitHandlerForm)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New Licence </h4>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "10px" }}>
          <Form.Group className="justify-content-center" controlId="formBasicEmail">
            <h5 className="card-title fw-bold">Developer Information</h5>
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Name <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <input type="text" className="form-control" placeholder="N/A" disabled {...register("developerName")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.developerName && errors?.developerName?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Address<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="developerAddress"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="developerAddress" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.developerAddress && errors?.developerAddress?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      EmailId<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="developerEmail"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="developerEmail" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.developerEmail && errors?.developerEmail?.message}
                </h3>
              </Col>
            </Row>
            <br></br>
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>Developer type</h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="developerType"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="developerType" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.developerType && errors?.developerType?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      CIN no.<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="developerCinNo"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="developerCinNo" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.developerCinNo && errors?.developerCinNo?.message}
                </h3>
              </Col>
            </Row>
            <br></br>

            <h5 className="card-title fw-bold">Directors Information</h5>
            <div className="card-body">
              <div className="table-bd">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>DIN Number</th>
                      <th>Name</th>
                      <th>Contact Number</th>
                      <th>View Document</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1.</td>
                      <td>
                        <input type="text" disabled="disabled" class="employee-card-input" {...register("directorDinNo")} />
                      </td>
                      <td>
                        <input type="text" disabled="disabled" class="employee-card-input" {...register("directorName")} />
                      </td>
                      <td>
                        <input type="text" disabled="disabled" class="employee-card-input" {...register("directorContactNumber")} />
                      </td>
                      <td>
                        <input type="text" disabled="disabled" class="employee-card-input" {...register("directorDoc")} />
                      </td>
                      <td>
                        <input type="text" disabled="disabled" class="employee-card-input" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h5 className="card-title fw-bold">Shareholding Patterns</h5>
            <div className="card-body">
              <div className="table-bd">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr. No</th>
                      <th>Name</th>
                      <th>Designition</th>
                      <th>Percentage</th>
                      <th>View Document</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1.</td>
                      <td>
                        <input type="text" readOnly disabled="disabled" class="employee-card-input" {...register("kanal")} />
                      </td>
                      <td>
                        <input type="text" readOnly disabled="disabled" class="employee-card-input" {...register("kanal")} />
                      </td>
                      <td>
                        <input type="text" readOnly disabled="disabled" class="employee-card-input" {...register("kanal")} />
                      </td>
                      <td>
                        <input type="text" readOnly disabled="disabled" class="employee-card-input" {...register("kanal")} />
                      </td>
                      <td>
                        <input type="text" readOnly disabled="disabled" class="employee-card-input" {...register("kanal")} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Form.Group>
        </Card>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "5px", marginBottom: "52px" }}>
          <Form.Group className="justify-content-center" controlId="formBasicEmail">
            <h5 className="card-title fw-bold">Authorized Person Information </h5>
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Name <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <input type="text" className="form-control" placeholder="N/A" disabled {...register("authorizedDeveloper")} />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.authorizedDeveloper && errors?.authorizedDeveloper?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Mobile No.<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="authorizedPerson"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorizedPerson" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.authorizedPerson && errors?.authorizedPerson?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Emailid for Authorized Signatory<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="authorizedmobile"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorizedmobile" />
                  )}
                />
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
                    <h2>Pan No.</h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="alternatemobile"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="alternatemobile" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.alternatemobile && errors?.alternatemobile?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Address of Authorized Signatory<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="authorizedEmail"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorizedEmail" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.authorizedEmail && errors?.authorizedEmail?.message}
                </h3>
              </Col>
            </Row>
          </Form.Group>
        </Card>
        <div class="row">
          <div class="col-sm-12 text-right">
            <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
              Save and Continue
            </button>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default ApllicantFormStep1;
