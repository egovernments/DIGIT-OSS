import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import { useTranslation } from "react-i18next";
import Spinner from "../../../../components/Loader";
import CusToaster from "../../../../components/Toaster";
import "bootstrap/dist/css/bootstrap.css";

const FeesChargesForm = (props) => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [loader, setLoader] = useState(false);
  const [stepData, setStepData] = useState(null);
  const [applicantId, setApplicantId] = useState("");
  const [getShow, setShow] = useState({ submit: false, payNow: false });
  const [consentButton, setConsentButton] = useState(false);
  const [getData, setData] = useState({ caseNumber: "", dairyNumber: "", status: "" });
  const [getCalculatedData, setCalculatedData] = useState(null);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });

  const { register, handleSubmit, setValue } = useForm({
    mode: "onChange",

    reValidateMode: "onChange",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
    defaultValues: { termsAndConditions: false },
  });

  const FeesChrgesFormSubmitHandler = async (data) => {
    const token = window?.localStorage?.getItem("token");

    if (data?.payableNow == 0 || data?.totalScrutinyFee == 0 || data?.totalLicenseFee == 0) {
      setShowToastError({ label: "Fees has been not generated", error: true, success: false });
    } else {
      setLoader(true);
      const postDistrict = {
        pageName: "FeesAndCharges",
        action: "FEESANDCHARGES",
        applicationNumber: applicantId,
        createdBy: userInfo?.id,
        updatedBy: userInfo?.id,
        LicenseDetails: {
          FeesAndCharges: {
            feesTypeCalculationDto: getCalculatedData?.feesTypeCalculationDto,
            ...data,
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
        setLoader(false);
        setShow({ payNow: true, submit: false });
      } catch (error) {
        setLoader(false);
        return error.message;
      }
    }
  };

  const CalculateApiCall = async () => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: token,
        userInfo: userInfo,
      },
      applicationNo: applicantId,
    };
    try {
      const Resp = await axios.post(`/tl-calculator/v1/_getPaymentEstimate`, payload);
      CalculationApi(Resp?.data?.feesTypeCalculationDto);
      setCalculatedData(Resp.data);
      setValue("payableNow", Resp.data?.totalFee?.toLocaleString());
      setValue("totalScrutinyFee", Resp.data?.totalScruitnyFee?.toLocaleString());
      setValue("totalLicenseFee", Resp.data?.totalLicenceFee?.toLocaleString());
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    CalculateApiCall();
  }, [applicantId, stepData]);

  const showPdf = async () => {
    const token = window?.localStorage?.getItem("token");
    setLoader(true);
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: ".01",
        ts: null,
        action: "_update",
        did: "1",
        key: "",
        msgId: "20170310130900|en_IN",
        authToken: token,
        userInfo: userInfo,
      },
    };
    try {
      const Resp = await axios.post(`/tl-services/new/license/pdf?applicationNumber=${props.getId}`, payload, { responseType: "arraybuffer" });
      setLoader(false);
      setConsentButton(true);
      const pdfBlob = new Blob([Resp.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  const getWholeData = async () => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:80/tl-services/new/licenses/object/_get?id=${props.getId}`);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getWholeData();
  }, []);

  const CalculationApi = async (data) => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",

        authToken: token,
        userInfo: userInfo,

        msgId: "1675336317896|en_IN",
      },

      CalulationCriteria: [
        {
          tenantId: "hr",
        },
      ],

      CalculatorRequest: {
        totalLandSize: stepData?.ApplicantPurpose?.totalArea,

        potenialZone: stepData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.potential,

        purposeCode: stepData?.ApplicantPurpose?.purpose,

        far: "1",

        applicationNumber: applicantId,
      },
    };
    try {
      const Resp = await axios.post(`/tl-calculator/v1/_calculator`, payload);
    } catch (error) {
      return error;
    }
  };

  const getApplicantUserData = async (id) => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: token,
      },
    };
    try {
      const Resp = await axios.post(`/tl-services/new/licenses/object/_getByApplicationNumber?applicationNumber=${id}`, payload);
      const userData = Resp?.data?.LicenseDetails?.[0];
      if (Resp?.data?.applicationStatus === "FEESANDCHARGES") setValue("termsAndConditions", true);
      setData({ caseNumber: Resp?.data?.caseNumber, dairyNumber: Resp?.data?.dairyNumber, status: Resp?.data?.applicationStatus });
      setValue("purpose", userData?.ApplicantPurpose?.purpose);
      setValue("developmentPlan", userData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.developmentPlan);
      setStepData(userData);
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

  const Tree = ({ data }) => {
    return (
      <div>
        {data?.map((item, index) => {
          return (
            <div>
              <table key={index} className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))", width: "629px" }}>
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <td style={{ textAlign: "right" }}>{item?.purpose}</td>
                  </tr>
                  <tr>
                    <th>Conversion Charges (In Rs.)</th>
                    <td style={{ textAlign: "right" }}> {item?.conversionChargesCal?.toLocaleString()}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>External Development Charges (In Rs.)</th>
                    <td style={{ textAlign: "right" }}>{item?.externalDevelopmentChargesCal?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>License Fee Charges (In Rs.)</th>
                    <td style={{ textAlign: "right" }}>{item?.licenseFeeChargesCal?.toLocaleString()}</td>
                  </tr>

                  <tr>
                    <th>Scrutiny Fee Charges (In Rs.)</th>
                    <td style={{ textAlign: "right" }}>{item?.scrutinyFeeChargesCal?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>State Infrastructure Development Charges (In Rs.)</th>
                    <td style={{ textAlign: "right" }}>{item?.stateInfrastructureDevelopmentChargesCal?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              {!!item?.feesTypeCalculationDto?.length && (
                <div className="ml-4 mt-4">
                  <Tree data={item?.feesTypeCalculationDto} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <ScrollToTop />
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(FeesChrgesFormSubmitHandler)}>
        <Card style={{ width: "126%", border: "5px solid #1266af" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New Licence Application </h4>
            <h6 style={{ display: "flex", alignItems: "center" }}>Application No: {applicantId}</h6>
          </div>
          {getData?.caseNumber && (
            <div>
              <h6 className="mt-1" style={{ marginLeft: "21px" }}>
                Case No: {getData?.caseNumber}
              </h6>
              <h6 className="mt-1" style={{ marginLeft: "21px" }}>
                Dairy No: {getData?.dairyNumber}
              </h6>
            </div>
          )}
          <Card style={{ width: "126%", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
            <h4 className="mb-2 mt-1">
              <b>Component wise Fee/Charges</b>
            </h4>
            <Form.Group className="justify-content-center" controlId="formBasicEmail">
              <Row className="ml-auto" style={{ marginBottom: 5 }}>
                <Col className="p-0" col-12>
                  {getCalculatedData?.feesTypeCalculationDto && (
                    <div>
                      <Tree data={getCalculatedData?.feesTypeCalculationDto} />
                    </div>
                  )}
                  <div className="row">
                    <div className="col col-4">
                      <h6>
                        {`${t("NWL_APPLICANT_FEE_TOTAL_SCRUITNY_FEE")}`}
                        {/* Total Scrutiny Fee */}
                      </h6>
                      <input type="text" className="form-control" disabled {...register("totalScrutinyFee")} />
                    </div>
                    <div className="col col-4">
                      <h6>
                        {`${t("NWL_APPLICANT_FEE_TOTAL_LICENCE_FEE")}`}
                        {/* Total License Fee (25%) */}
                      </h6>
                      <input type="text" className="form-control" disabled {...register("totalLicenseFee")} />
                    </div>
                    <div className="col col-4">
                      <h6 data-toggle="tooltip" data-placement="top" title="Total Fees (License fee 25% + Scrutiny Fees)">
                        {`${t("NWL_APPLICANT_FEE_TOTAL_FEE")}`}
                        {/* Amount Payable */}
                      </h6>
                      <input type="text" className="form-control" disabled {...register("payableNow")} />
                    </div>
                  </div>
                  <br></br>
                  <hr />
                  <br></br>
                  <h5 className="text-black">
                    {`${t("NWL_UNDERTAKINGS")}`}
                    {/* Undertakings */}
                    <span style={{ color: "red" }}>*</span>
                  </h5>
                  <div className="px-2">
                    <p className="text-black">The following is undertaken: </p>
                    <ul className="Undertakings">
                      <li>I hereby declare that the details furnished above are true and correct to the best of my knowledge.</li>
                      <div
                        style={{
                          color: "#fff",
                          backgroundColor: " #0069d9",
                          borderColor: "#0062cc",
                          cursor: "pointer",
                          width: "16%",
                          padding: "8px 0",
                          borderRadius: "5px",
                          textAlign: "center",
                        }}
                        onClick={() => showPdf()}
                      >
                        {`${t("NWL_REVIEW_APPLICATION")}`}
                        {/* Review Application */}
                      </div>
                    </ul>
                  </div>

                  {(consentButton || getData?.status === "FEESANDCHARGES") && (
                    <div className="">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          {...register("termsAndConditions")}
                          className="mx-3"
                          id="flexCheckDefault"
                          onClick={(e) => {
                            if (e.target.checked) {
                              setShow({ payNow: false, submit: true });
                            } else setShow({ payNow: false, submit: false });
                          }}
                        />
                        <label className="checkbox" for="flexCheckDefault">
                          I agree and accept the terms and conditions.
                          <span className="text-danger">
                            <b>*</b>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div class="row">
                    <div class="col-sm-12 text-right">
                      {getShow?.submit && getData?.status !== "FEESANDCHARGES" && (
                        <button type="submit" id="btnClear" class="btn btn-primary btn-md ">
                          Submit
                        </button>
                      )}
                      {(getShow?.payNow || getData?.status === "FEESANDCHARGES") && (
                        <div class="my-2">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              history.push(`/digit-ui/citizen/payment/collect/TL/${applicantId}`, {});
                            }}
                          >
                            Pay Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Form.Group>
          </Card>
        </Card>
      </form>
      {showToastError && (
        <CusToaster
          label={showToastError?.label}
          success={showToastError?.success}
          error={showToastError?.error}
          onClose={() => {
            setShowToastError({ label: "", success: false, error: false });
          }}
        />
      )}
    </div>
  );
};
export default FeesChargesForm;
