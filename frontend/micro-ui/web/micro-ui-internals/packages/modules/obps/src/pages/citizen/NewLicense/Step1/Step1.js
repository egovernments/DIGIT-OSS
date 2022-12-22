import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step1";
import { useHistory, useLocation } from "react-router-dom";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";

const LcNotSigned = [
  {
    label: "GPA",
    value: "GPA",
  },
  {
    label: "SPA",
    value: "SPA",
  },
];

const ApllicantFormStep1 = (props) => {
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

  const ApplicantFormSubmitHandlerForm = async (data) => {
    // props.Step1Continue("6", "userInfo", "licData");

    const token = window?.localStorage?.getItem("token");
    data["notSigned"] = data?.notSigned?.value;
    const postDistrict = {
      pageName: "ApplicantInfo",
      ApplicationStatus: "DRAFT",
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
      const licData = Resp?.data?.LicenseServiceResponseInfo?.[0]?.newServiceInfoData?.[0];
      console.log("gg", Resp?.data);
      props.Step1Continue(Resp?.data?.LicenseServiceResponseInfo?.[0]?.applicationNumber, userInfo, licData);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (props?.getLicData?.ApplicantInfo) {
      setValue("notSigned", { label: props?.getLicData?.ApplicantInfo?.notSigned, value: props?.getLicData?.ApplicantInfo?.notSigned });
      setValue("LC", props?.getLicData?.ApplicantInfo?.LC);
    }
  }, [props?.getLicData]);

  const getUserInfo = async () => {
    const uuid = userInfo?.uuid;
    if (uuid) {
      try {
        const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
        const userData = usersResponse?.user[0];
        setValue("authorized", userData?.name);
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

  const getApplicantUserData = async (id) => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:80/tl-services/new/licenses/_get?id=${id}`);
      const userData = Resp?.data?.newServiceInfoData[0]?.ApplicantInfo;
      setValue("notSigned", userData?.notSigned);
      setValue("LC", userData?.LC);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    const search = location?.search;
    const params = new URLSearchParams(search);
    const id = params.get("id");
    setApplicantId(id?.toString());
    if (id) getApplicantUserData(id);
  }, []);

  return (
    <form onSubmit={handleSubmit(ApplicantFormSubmitHandlerForm)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New Licence </h4>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Form.Group className="justify-content-center" controlId="formBasicEmail">
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Developer <span style={{ color: "red" }}>*</span>
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
                      Authorized Person Name <span style={{ color: "red" }}>*</span>
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
                      Authorized Mobile No<span style={{ color: "red" }}>*</span>
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
                    <h2>Alternate Mobile No.</h2>
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
                      EmailId<span style={{ color: "red" }}>*</span>
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
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      PAN No <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="authorizedPan"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorizedPan" />
                  )}
                />
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
                    <h2>
                      Address 1<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="authorizedAddress"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorizedAddress" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.authorizedAddress && errors?.authorizedAddress?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Village/City <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="village"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="village" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.village && errors?.village?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Pincode<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="authorizedPinCode"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorizedPinCode" />
                  )}
                />
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
                    <h2>
                      Tehshil<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="tehsil"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="tehsil" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.tehsil && errors?.tehsil?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      District<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="district"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="district" />
                  )}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.district && errors?.district?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      State<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="state"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="state" />
                  )}
                />
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
                    <h2>
                      Status (Individual/ Company/ Firm/ LLP etc.)<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="status" />
                  )}
                />
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      LC-I signed by <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Form.Control type="text" placeholder="" {...register("LC")} />

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.LC && errors?.LC?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      Address for communication <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="address" />
                  )}
                />
              </Col>
            </Row>
            <br></br>
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Permanent address in case of individual/ registered office address in case other than individual"
                    >
                      Permanent address/ registered office address<span style={{ color: "red" }}>*</span>
                      &nbsp;{" "}
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="permanentAddress"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="permanentAddress" />
                  )}
                />
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2
                      data-toggle="tooltip"
                      data-placement="top"
                      title="If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)"
                    >
                      If LC-I is not signed by self <span style={{ color: "red" }}>*</span>
                      &nbsp;{" "}
                    </h2>
                  </Form.Label>
                </div>
                <ReactMultiSelect control={control} name="notSigned" placeholder="LC Not Signed" data={LcNotSigned} labels="LcNotSigned" />
                {/* <Form.Control type="text" placeholder="" {...register("notSigned")} /> */}

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.notSigned?.value && errors?.notSigned?.value?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="4">
                <div>
                  <Form.Label>
                    <h2>
                      EmailId for communication <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="email" />
                  )}
                />
              </Col>
            </Row>
            <br></br>
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <div className="col col-4">
                <div>
                  <Form.Label>
                    <h2>
                      Name of the authorized person to sign the application <span style={{ color: "red" }}>*</span>
                    </h2>
                    <i className="fa fa-info-circle-fill" />
                  </Form.Label>
                </div>
                <Controller
                  control={control}
                  name="authorized"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorized" />
                  )}
                />
              </div>
            </Row>
          </Form.Group>
          <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Save and Continue
              </button>
            </div>
          </div>
        </Card>
      </Card>
    </form>
  );
};

export default ApllicantFormStep1;
