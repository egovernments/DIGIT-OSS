import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useHistory } from "react-router-dom";
import { Toast } from "@egovernments/digit-ui-react-components";
import Spinner from "../../../../components/Loader";
import { getDocShareholding } from "../docView/docView.help";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step1";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ApllicantFormStep1 = (props) => {
  const history = useHistory();
  const location = useLocation();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const tenant = Digit.ULBService.getCurrentTenantId();
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showToastError, setShowToastError] = useState(null);
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

    delete data?.developerName;
    delete data?.developerAddress;
    delete data?.developerEmail;
    delete data?.developerType;
    delete data?.developerCinNo;
    delete data?.directorDinNo;
    delete data?.directorName;
    delete data?.directorContactNumber;
    delete data?.directorDoc;
    delete data?.shareholdingName;
    delete data?.shareholdingDesignition;
    delete data?.shareholdingPercentage;
    delete data?.shareholdingDoc;
    delete data?.authorizedName;
    delete data?.authorizedMobile;
    delete data?.authorizedEmail;
    delete data?.authorizedPan;
    delete data?.authorizedAddress;

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
      console.log("developerDataLabel", developerDataLabel);
      setValue("developerName", developerDataLabel?.addInfo?.companyName);
      setValue("developerAddress", developerDataLabel?.addInfo?.registeredAddress);
      setValue("developerEmail", developerDataLabel?.addInfo?.email);
      setValue("developerType", developerDataLabel?.addInfo?.showDevTypeFields);
      setValue("developerCinNo", developerDataLabel?.addInfo?.cin_Number);
      // setValue("directorDinNo", developerDataLabel?.addInfo?.DirectorsInformation?.[0]?.din);
      // setValue("directorName", developerDataLabel?.addInfo?.DirectorsInformation?.[0]?.name);
      // setValue("directorContactNumber", developerDataLabel?.addInfo?.DirectorsInformation?.[0]?.contactNumber);
      // setValue("directorDoc", developerDataLabel?.licenceDetails?.pincode);
      // setValue("shareholdingName", developerDataLabel?.addInfo?.shareHoldingPatterens?.[0]?.name);
      // setValue("shareholdingDesignition", developerDataLabel?.addInfo?.shareHoldingPatterens?.[0]?.designition);
      // setValue("shareholdingPercentage", developerDataLabel?.addInfo?.shareHoldingPatterens?.[0]?.percentage);
      // setValue("shareholdingDoc", developerDataLabel?.addInfo?.showDevTypeFields);
      setValue("authorizedName", developerDataLabel?.aurthorizedUserInfoArray?.[0]?.name);
      setValue("authorizedMobile", developerDataLabel?.aurthorizedUserInfoArray?.[0]?.mobileNumber);
      setValue("authorizedEmail", developerDataLabel?.aurthorizedUserInfoArray?.[0]?.emailId);
      setValue("authorizedPan", developerDataLabel?.aurthorizedUserInfoArray?.[0]?.pan);
      setValue("authorizedAddress", developerDataLabel?.aurthorizedUserInfoArray?.[0]?.permaneneAddress);
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
    <div>
      {loader && <Spinner />}
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
                      <input type="text" value={value} className="form-control" disabled name="developerEmail" />
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
                      <h2>Developer Type</h2>
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
                        CIN Number<span style={{ color: "red" }}>*</span>
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
                      </tr>
                    </thead>
                    <tbody>
                      {developerDataLabel?.addInfo?.DirectorsInformation?.map((item, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item?.din}</td>
                            <td>{item?.name}</td>
                            <td>{item?.contactNumber}</td>
                            <td
                              style={{ color: " #1266af", fontSize: " 12px", fontWeight: "bold", cursor: "pointer", textDecorationLine: "underline" }}
                              onClick={() => {
                                if (item?.uploadPdf) getDocShareholding(item?.uploadPdf, setLoader);
                                else setShowToastError({ key: "error" });
                              }}
                            >
                              <VisibilityIcon color="info" className="icon" />
                            </td>
                          </tr>
                        );
                      })}
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
                      </tr>
                    </thead>
                    <tbody>
                      {developerDataLabel?.addInfo?.shareHoldingPatterens?.map((it, ind) => {
                        return (
                          <tr>
                            <td>{ind}</td>
                            <td>{it?.name}</td>
                            <td>{it?.designition}</td>

                            <td>{it?.percentage}</td>
                            <td
                              style={{ color: " #1266af", fontSize: " 12px", fontWeight: "bold", cursor: "pointer", textDecorationLine: "underline" }}
                              onClick={() => {
                                if (it?.uploadPdf) getDocShareholding(it?.uploadPdf, setLoader);
                                else setShowToastError({ key: "error" });
                              }}
                            >
                              <VisibilityIcon color="info" className="icon" />
                            </td>
                          </tr>
                        );
                      })}
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
                  <input type="text" className="form-control" placeholder="N/A" disabled {...register("authorizedName")} />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.authorizedName && errors?.authorizedName?.message}
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
                      <input type="text" value={value} className="form-control" placeholder="N/A" disabled {...register("authorizedMobile")} />
                    )}
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.authorizedMobile && errors?.authorizedMobile?.message}
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
                    name="authorizedPan"
                    render={({ field: { onChange, value } }) => (
                      <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorizedPan" />
                    )}
                  />
                  <h3 className="error-message" style={{ color: "red" }}>
                    {errors?.authorizedPan && errors?.authorizedPan?.message}
                  </h3>
                </Col>
                <Col md={4} xxl lg="4">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (developerDataLabel?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf)
                        getDocShareholding(developerDataLabel?.aurthorizedUserInfoArray?.[0]?.uploadDigitalSignaturePdf, setLoader);
                      else setShowToastError({ key: "error" });
                    }}
                    id="btnSearch"
                    class=""
                  >
                    Upload Digital Signature <VisibilityIcon color="info" className="icon" />
                  </div>
                </Col>
                <Col md={4} xxl lg="4">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (developerDataLabel?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution)
                        getDocShareholding(developerDataLabel?.aurthorizedUserInfoArray?.[0]?.uploadBoardResolution, setLoader);
                      else setShowToastError({ key: "error" });
                    }}
                    id="btnSearch"
                    class=""
                  >
                    Upload Board Resolution <VisibilityIcon color="info" className="icon" />
                  </div>
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
      {showToastError && (
        <Toast
          error={showToastError?.key === "error" ? true : false}
          label="No Pdf here"
          isDleteBtn={true}
          onClose={() => {
            setShowToastError(null);
            setError(null);
          }}
        />
      )}
    </div>
  );
};

export default ApllicantFormStep1;
