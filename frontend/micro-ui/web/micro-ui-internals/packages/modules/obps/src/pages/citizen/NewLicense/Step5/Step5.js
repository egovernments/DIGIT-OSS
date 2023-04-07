import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Card, Row, Col } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../docView/docView.help";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import Spinner from "../../../../components/Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step5";
import ScrollToTop from "@egovernments/digit-ui-react-components/src/atoms/ScrollToTop";
import FileUpload from "@mui/icons-material/FileUpload";
import { Toast } from "@egovernments/digit-ui-react-components";
import AddBoxSharp from "@mui/icons-material/AddBoxSharp";

const FeesChargesForm = (props) => {
  const location = useLocation();
  const history = useHistory();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [loader, setLoader] = useState(false);
  const [stepData, setStepData] = useState(null);
  const [applicantId, setApplicantId] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [showToastError, setShowToastError] = useState(null);
  const [getShow, setShow] = useState({ submit: false, payNow: false });
  const [consentButton, setConsentButton] = useState(false);
  const [getData, setData] = useState({ caseNumber: "", dairyNumber: "", status: "" });
  const [getCalculatedData, setCalculatedData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onChange",

    reValidateMode: "onChange",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
    defaultValues: { termsAndConditions: false },
  });

  const FeesChrgesFormSubmitHandler = async (data) => {
    const token = window?.localStorage?.getItem("token");
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
    console.log("postDistrict", postDistrict);
    return;
    try {
      const Resp = await axios.post("/tl-services/new/_create", postDistrict);
      setLoader(false);
      setShow({ payNow: true, submit: false });
    } catch (error) {
      setLoader(false);
      return error.message;
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
      // CalulationCriteria: [
      //   {
      //     tenantId: "hr",
      //   },
      // ],
      // CalculatorRequest: {
      //   totalLandSize: 1,
      //   // potenialZone: stepData?.ApplicantPurpose?.potential,
      //   potenialZone: "HYP",
      //   // purposeCode: stepData?.ApplicantPurpose?.purpose,
      //   purposeCode: "DDJAY_APHP",
      //   applicationNumber: applicantId,
      // },
    };
    try {
      // const Resp = await axios.post("/tl-calculator/v1/_calculator", payload);
      const Resp = await axios.post(`/tl-calculator/v1/_getPaymentEstimate`, payload);
      const charges = Resp.data?.Calculations?.[0]?.tradeTypeBillingIds;
      CalculationApi(Resp?.data?.feesTypeCalculationDto);
      setCalculatedData(Resp.data);
      // setValue("scrutinyFee", charges?.scrutinyFeeCharges);
      // setValue("licenseFee", charges?.licenseFeeCharges);
      // setValue("conversionCharges", charges?.conversionCharges);
      setValue("payableNow", Resp.data?.totalFee);
      setValue("totalScrutinyFee", Resp.data?.totalScruitnyFee);
      setValue("totalLicenseFee", Resp.data?.totalLicenceFee);
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

  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ key: "error" });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      // if (fieldName === "consentLetter") {
      //   setValue("consentLetterFileName", file.name);
      // }
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToast({ key: "success" });
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  // const dataArea = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.kanal;
  // const dataAreaMarla = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.marla;
  // const dataAreaSarai = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.sarsai;
  // const dataAreaBigha = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.bigha;
  // const dataAreaBiswa = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.biswa;
  // const dataAreaBiswansi = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.biswansi;
  // const totalAreaAcre =
  //   dataArea * 0.125 + dataAreaMarla * 0.0062 + dataAreaSarai * 0.00069 + dataAreaBigha * 0.33 + dataAreaBiswa * 0.0309 + dataAreaBiswansi * 0.619;

  // const handleWorkflow = async () => {
  //   const token = window?.localStorage?.getItem("token");
  //   setLoader(true);
  //   const payload = {
  //     ProcessInstances: [
  //       {
  //         businessService: "NewTL",
  //         documents: null,
  //         businessId: applicantId,
  //         tenantId: "hr",
  //         moduleName: "TL",
  //         action: "FEESANDCHARGES",
  //         previousStatus: "LANDDETAILS",
  //         comment: null,
  //       },
  //     ],
  //     RequestInfo: {
  //       apiId: "Rainmaker",
  //       msgId: "1669293303096|en_IN",
  //       authToken: token,
  //     },
  //   };
  //   try {
  //     await axios.post("/egov-workflow-v2/egov-wf/process/_transition", payload);
  //     setLoader(false);
  //     props?.step4Back();
  //   } catch (error) {
  //     setLoader(false);
  //     return error;
  //   }
  // };

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
      apiId: "Rainmaker",
      msgId: "1669293303096|en_IN",
      authToken: token,
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
                    <th>Conversion Charges (In Rs.)</th>
                    <td> {item?.conversionChargesCal}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>External Development Charges (In Rs.)</th>
                    <td>{item?.externalDevelopmentChargesCal}</td>
                  </tr>
                  <tr>
                    <th>License Fee Charges (In Rs.)</th>
                    <td>{item?.licenseFeeChargesCal}</td>
                  </tr>
                  <tr>
                    <th>Purpose</th>
                    <td>{item?.purpose}</td>
                  </tr>
                  <tr>
                    <th>Scrutiny Fee Charges (In Rs.)</th>
                    <td>{item?.scrutinyFeeChargesCal}</td>
                  </tr>
                  <tr>
                    <th>State Infrastructure Development Charges (In Rs.)</th>
                    <td>{item?.stateInfrastructureDevelopmentChargesCal}</td>
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
          <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
            <Form.Group className="justify-content-center" controlId="formBasicEmail">
              <Row className="ml-auto" style={{ marginBottom: 5 }}>
                <Col col-12>
                  {/* <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))", width: "629px" }}>
                    <thead>
                      <tr>
                        <th>
                          Total Area (In acres) <span style={{ color: "red" }}>*</span>
                        </th>
                        <td>
                          <input type="text" className="form-control" disabled {...register("totalArea")} placeholder={totalAreaAcre} />
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>
                          Purpose <span style={{ color: "red" }}>*</span>
                        </th>
                        <td>
                          <input type="text" className="form-control" placeholder="purpose" disabled {...register("purpose")} />
                        </td>
                      </tr>
                      <tr>
                        <th>
                          Dev Plan <span style={{ color: "red" }}>*</span>
                        </th>
                        <td>
                          <input type="text" className="form-control" placeholder="Development Plan" disabled {...register("developmentPlan")} />
                        </td>
                      </tr>
                      <tr>
                        <th>
                          Scrutiny Fees <span style={{ color: "red" }}>*</span>
                        </th>
                        <td>
                          <input type="text" className="form-control" disabled {...register("scrutinyFee")} />
                        </td>
                      </tr>
                      <tr>
                        <th>
                          Licence Fees <span style={{ color: "red" }}>*</span>
                        </th>
                        <td>
                          <input type="text" className="form-control" disabled {...register("licenseFee")} />
                        </td>
                      </tr>
                      <tr>
                        <th>
                          Payable Licence Fees <span style={{ color: "red" }}>*</span>
                        </th>
                        <td>
                          <input type="text" className="form-control" disabled {...register("payLicenseFee")} />
                        </td>
                      </tr>
                     
                    </tbody>
                  </table> */}
                  {getCalculatedData?.feesTypeCalculationDto && (
                    <div>
                      <Tree data={getCalculatedData?.feesTypeCalculationDto} />
                    </div>
                  )}
                  <div className="row">
                    <div className="col col-4">
                      <h6>Total Scrutiny Fee</h6>
                      <input type="text" className="form-control" disabled {...register("totalScrutinyFee")} />
                    </div>
                    <div className="col col-4">
                      <h6>Total License Fee (25%)</h6>
                      <input type="text" className="form-control" disabled {...register("totalLicenseFee")} />
                    </div>
                    <div className="col col-4">
                      <h6 data-toggle="tooltip" data-placement="top" title="Total Fees (License fee 25% + Scrutiny Fees)">
                        Amount Payable
                      </h6>
                      <input type="text" className="form-control" disabled {...register("payableNow")} />
                    </div>

                    {/* <div className="col col-4">
                      <h6>(ii)Remark (If any)</h6>
                      <input type="text" className="form-control" minLength={2} maxLength={100} {...register("remark")} />
                    </div> */}

                    {/* <div className="col col-4">
                      <h6 data-toggle="tooltip" data-placement="top" title="Do you want to adjust the fee from any previous licence (Yes/No)">
                        (iii)&nbsp;Adjust Fees <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                      </h6>
                      <input {...register("adjustFee")} type="radio" value="Y" id="adjustFee" />
                      <label for="Yes">Yes</label>&nbsp;&nbsp;
                      <input {...register("adjustFee")} type="radio" value="N" id="adjustFee" />
                      <label for="No">No</label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.adjustFee && errors?.adjustFee?.message}
                      </h3>
                      {watch("adjustFee") === "Y" && (
                        <div className="row ">
                          <div className="col col-12">
                            <label>
                              Enter Licence Number/LOI number <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" {...register("licNumber")} />
                            <label>
                              Click Yes,if Lic No/LOI number belongs to other developers.<span style={{ color: "red" }}>*</span>
                              <label htmlFor="belongsDeveloper">
                                <input {...register("belongsDeveloper")} type="radio" value="Y" id="belongsDeveloper" />
                                &nbsp; Yes &nbsp;&nbsp;
                              </label>
                              <label htmlFor="belongsDeveloper">
                                <input {...register("belongsDeveloper")} type="radio" value="N" id="belongsDeveloper" />
                                &nbsp; No &nbsp;&nbsp;
                              </label>
                              {watch("belongsDeveloper") === "Y" && (
                                <div>
                                  <div className="row">
                                    <div className="col col-12">
                                      <h2>
                                        Consent letter in case of Another Developer (verified by the Department)
                                        <span style={{ color: "red" }}>*</span>
                                      </h2>
                                      <label>
                                        <FileUpload color="primary" />
                                        <input
                                          type="file"
                                          style={{ display: "none" }}
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetterFileName")}
                                          accept="application/pdf/jpeg/png"
                                        />
                                      </label>
                                      {watch("consentLetterFileName") && (
                                        <a onClick={() => getDocShareholding(watch("consentLetterFileName"))} className="btn btn-sm ">
                                          <VisibilityIcon color="info" className="icon" />
                                        </a>
                                      )}

                                      <h3 className="error-message" style={{ color: "red" }}>
                                        {errors?.consentLetterFileName && errors?.consentLetterFileName?.message}
                                      </h3>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </label>
                            <label>
                              Amount (previous) <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" disabled {...register("amount")} />
                            <label>
                              Amount to be paid after adjustment <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" {...register("amountAdjusted")} />
                          </div>
                        </div>
                      )}
                    </div> */}
                  </div>
                  <br></br>
                  <hr />
                  <br></br>
                  <h5 className="text-black">
                    Undertakings <span style={{ color: "red" }}>*</span>
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
                        Review Application
                      </div>
                    </ul>
                  </div>
                  {/* <Modal
                    size="lg"
                    isOpen={modal1}
                    toggle={() => setmodal(!modal1)}
                    style={{ width: "500px", height: "200px" }}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <ModalHeader toggle={() => setmodal1(!modal1)}></ModalHeader>
                    <ModalBody style={{ fontSize: 20 }}>
                      <h2>
                        {" "}
                        I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief and I undertake
                        to inform you of any changes therein, immediately. In case any of the above information is found to be false or untrue or
                        misleading or misrepresenting, I am aware that I may be held liable for it.
                      </h2>
                    </ModalBody>
                    <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
                  </Modal> */}
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
                              setmodal(true);
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
    </div>
  );
};
export default FeesChargesForm;
