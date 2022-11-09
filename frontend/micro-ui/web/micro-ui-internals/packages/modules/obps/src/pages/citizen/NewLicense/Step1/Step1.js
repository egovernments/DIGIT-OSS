import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
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
  const userInfo = Digit.UserService.getUser()?.info || {};
  const tenant = Digit.ULBService.getCurrentTenantId();
  const [developerData, setDeveloperData] = useState([]);
  const [developerDataLabel, setDeveloperDataLabel] = useState([]);
  const [submitDataLabel, setSubmitDataLabel] = useState([]);
  const [finalSubmitData, setFinalSubmitData] = useState([]);
  const [applicationId, setApplicationId] = useState("");
  const ApplicantFormSubmitHandlerForm = async (data) => {
    console.log("data===+++++", data);

    try {
      const postDistrict = {
        NewServiceInfo: {
          pageName: "ApplicantInfo",

          newServiceInfoData: {
            ApplicantInfo: {
              authorizedPerson: data.authorizedPerson,
              authorizedmobile: data.authorizedmobile,
              alternatemobile: data.altContactNumber,
              authorizedEmail: data.authorizedEmail,
              authorizedPan: data.authorizedPan,
              authorizedAddress: data.permanentAddress,
              village: data.village,
              authorizedPinCode: data.authorizedPinCode,
              tehsil: data.tehsil,
              district: data.district,
              state: data.state,
              status: data.status,
              permanentAddress: data.permanentAddress,
              LC: data.LC,
              notSigned: data.notSigned,
              email: data.email,
              authorized: data.authorized,
            },
            ApplicantPurpose: {},
            LandSchedule: {
              licenseApplied: "yes for fdhf",
              LicNo: "",
              potential: "",
              siteLoc: "",
              approach: "",
              approachRoadWidth: "",
              specify: "",
              typeLand: "",
              thirdParty: "",
              migrationLic: "",
              encumburance: "",
              litigation: "",
              court: "",
              insolvency: "",
              appliedLand: "",
              revenuerasta: "",
              watercourse: "",
              compactBlock: "",
              sandwiched: "",
              acquistion: "",
              section4: "",
              section6: "",
              orderUpload: "",
              approachable: "",
              vacant: "",
              construction: "",
              ht: "",
              gas: "",
              nallah: "",
              road: "",
              land: "",
              utilityLine: "",
              landSchedule: "",
              mutation: "",
              jambandhi: "",
              LayoutPlan: "",
              proposedLayoutPlan: "",
              revisedLansSchedule: "",
            },
            DetailsofAppliedLand: {
              dgps: "675657",
              DetailsAppliedLandData1: {
                resplotno: "asa",
                reslengthmtr: "",
                reswidthmtr: "",
                resareasq: "",
                npnlplotno: "",
                npnllengthmtr: "",
                npnlwidthmtr: "",
                npnlareasq: "",
                ewsplotno: "",
                ewslengthmtr: "",
                ewswidthmtr: "",
                ewsareasq: "",
                complotno: "",
                comlengthmtr: "",
                comwidthmtr: "",
                comareasq: "",
                siteplotno: "",
                sitelengthmtr: "",
                sitewidthmtr: "",
                siteareasq: "",
                parkplotno: "",
                parklengthmtr: "",
                parkwidthmtr: "",
                parkareasq: "",
                publicplotno: "",
                publiclengthmtr: "",
                publicwidthmtr: "",
                publicareasq: "",
                stpplotno: "",
                stplengthmtr: "",
                stpwidthmtr: "",
                stpareasq: "",
                etpplotno: "",
                etplengthmtr: "",
                etpwidthmtr: "",
                etpareasq: "",
                wtpplotno: "",
                wtplengthmtr: "",
                wtpwidthmtr: "",
                wtpareasq: "",
                ugtplotno: "",
                ugtlengthmtr: "",
                ugtwidthmtr: "",
                ugtareasq: "",
                milkboothplotno: "",
                milkboothlengthmtr: "",
                milkboothwidthmtr: "",
                milkboothareasq: "",
                gssplotno: "",
                gsslengthmtr: "",
                gssareasq: "",
                resDimension: "",
                resEnteredArea: "",
                comDimension: "",
                comEnteredArea: "",
                secPlanPlot: "",
                secPlanLength: "",
                secPlanDim: "",
                secPlanEntered: "",
                greenBeltPlot: "",
                greenBeltLength: "",
                greenBeltDim: "",
                greenBeltEntered: "",
                internalPlot: "",
                internalLength: "",
                internalDim: "",
                internalEntered: "",
                otherPlot: "",
                otherLength: "",
                otherDim: "",
                otherEntered: "",
                undeterminedPlot: "",
                undeterminedLength: "",
                undeterminedDim: "",
                undeterminedEntered: "",
              },
              DetailsAppliedLandDdjay2: {
                frozenNo: "qw",
                frozenArea: "",
                organize: "",
              },
              DetailsAppliedLandIndustrial3: {
                colonyfiftyNo: "qwq",
                colonyfiftyArea: "",
                fiftyToTwoNo: "",
                fiftyToTwoArea: "",
                twoHundredNo: "",
                twoHundredArea: "",
                resiNo: "",
                resiArea: "",
                commerNo: "",
                commerArea: "",
                labourNo: "",
                labourArea: "",
              },
              DetailsAppliedLandResidential4: {
                npnlNo: "wew",
                npnlArea: "",
                ewsNo: "",
                ewsArea: "",
              },
              DetailsAppliedLandNpnl5: {
                surrender: "sds",
                pocketProposed: "",
                deposit: "",
                surrendered: "",
              },
              DetailsAppliedLand6: {
                sitePlan: "sdsd",
                democraticPlan: "",
                sectoralPlan: "",
                developmentPlan: "",
                uploadLayoutPlan: "",
              },
            },
            FeesAndCharges: {
              totalArea: "125.569",
              purpose: "",
              devPlan: "",
              scrutinyFee: "",
              licenseFee: "",
              conversionCharges: "",
              payableNow: "",
              remark: "",
              adjustFee: "",
            },
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
          authToken: "",
        },
      };
      const Resp = await axios.post("/land-services/new/_create", postDistrict).then((Resp) => {
        return Resp;
      });
      console.log("Resp", Resp?.data?.NewServiceInfo?.[0]?.id);
      props.Step1Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
      setFinalSubmitData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDeveloperData = async () => {
    try {
      const Resp = await axios.get("http://10.1.1.18:8443/user/developer/_getAuthorizedUser?mobileNumber=1111111111").then((response) => {
        return response;
      });
      setDeveloperData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getDeveloperData();
  }, []);

  const getUserInfo = async () => {
    const uuid = userInfo?.uuid;
    if (uuid) {
      const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [uuid] }, {});
      setValue("alternatemobile", usersResponse?.user?.[0]?.altContactNumber);
      setValue("authorizedAddress", usersResponse?.user?.[0]?.permanentAddress);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (developerData !== undefined && developerData !== null) {
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
    }
  }, [developerData]);

  const getDeveloperDataLabel = async () => {
    try {
      const Resp = await axios.get("http://10.1.1.18:8443/user/developer/_getDeveloperById?id=36&isAllData=true").then((response) => {
        return response;
      });
      setDeveloperDataLabel(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getDeveloperDataLabel();
  }, []);

  useEffect(() => {
    if (developerDataLabel !== undefined && developerDataLabel !== null) {
      setValue(
        "village",
        developerDataLabel !== null && developerDataLabel !== undefined ? developerDataLabel?.devDetail?.[0]?.devDetail?.licenceDetails?.city : "N/A"
      );
      setValue(
        "tehsil",
        developerDataLabel !== null && developerDataLabel !== undefined
          ? developerDataLabel?.devDetail?.[0]?.devDetail?.licenceDetails?.tehsil
          : "N/A"
      );
      setValue(
        "district",
        developerDataLabel !== null && developerDataLabel !== undefined
          ? developerDataLabel?.devDetail?.[0]?.devDetail?.licenceDetails?.district
          : "N/A"
      );
      setValue(
        "state",
        developerDataLabel !== null && developerDataLabel !== undefined ? developerDataLabel?.devDetail?.[0]?.devDetail?.licenceDetails?.state : "N/A"
      );
      setValue(
        "status",
        developerDataLabel !== null && developerDataLabel !== undefined
          ? developerDataLabel?.devDetail?.[0]?.devDetail?.addInfo?.showDevTypeFields
          : "N/A"
      );
      setValue(
        "address",
        developerDataLabel !== null && developerDataLabel !== undefined
          ? developerDataLabel?.devDetail?.[0]?.devDetail?.addInfo?.registeredAddress
          : "N/A"
      );
      setValue(
        "authorizedAddress",
        developerDataLabel !== null && developerDataLabel !== undefined
          ? developerDataLabel?.devDetail?.[0]?.devDetail?.licenceDetails?.addressLineOne
          : "N/A"
      );
      setValue(
        "authorizedPinCode",
        developerDataLabel !== null && developerDataLabel !== undefined
          ? developerDataLabel?.devDetail?.[0]?.devDetail?.licenceDetails?.pincode
          : "N/A"
      );

      setValue(
        "email",
        developerDataLabel !== null && developerDataLabel !== undefined ? developerDataLabel?.devDetail?.[0]?.devDetail?.addInfo?.email : "N/A"
      );
      setValue(
        "permanentAddress",
        developerDataLabel !== null && developerDataLabel !== undefined
          ? developerDataLabel?.devDetail?.[0]?.devDetail?.addInfo?.registeredAddress
          : "N/A"
      );
    }
  }, [developerDataLabel]);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get("http://10.1.1.18:8443/land-services/new/licenses/_get?id=1099696").then((response) => {
        return response;
      });
      console.log("RESP+++", Resp);
      setSubmitDataLabel(Resp?.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getSubmitDataLabel();
  }, []);

  return (
    <form onSubmit={handleSubmit(ApplicantFormSubmitHandlerForm)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New License </h4>
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
                    <h2>
                      Alternate Mobile No<span style={{ color: "red" }}>*</span>
                    </h2>
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
                <Form.Control type="text" placeholder="" {...register("notSigned")} />

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.notSigned && errors?.notSigned?.message}
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
          ``
        </Card>
      </Card>
    </form>
  );
};

export default ApllicantFormStep1;
