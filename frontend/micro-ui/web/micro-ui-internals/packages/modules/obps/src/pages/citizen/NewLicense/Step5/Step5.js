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

const FeesChargesForm = (props) => {
  const location = useLocation();
  const history = useHistory();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [loader, setLoader] = useState(false);
  const [stepData, setStepData] = useState(null);
  const [applicantId, setApplicantId] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
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
      props.Step5Continue(Resp?.data?.LicenseServiceResponseInfo?.[0]?.newServiceInfoData?.[0]);
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
      CalulationCriteria: [
        {
          tenantId: "hr",
        },
      ],
      CalculatorRequest: {
        totalLandSize: 1,
        potenialZone: stepData?.ApplicantPurpose?.potential,
        purposeCode: stepData?.ApplicantPurpose?.purpose,
        applicationNumber: applicantId,
      },
    };
    try {
      const Resp = await axios.post("/tl-calculator/v1/_calculator", payload);
      const charges = Resp.data?.Calculations?.[0]?.tradeTypeBillingIds;
      setValue("scrutinyFee", charges?.scrutinyFeeCharges);
      setValue("licenseFee", charges?.licenseFeeCharges);
      setValue("conversionCharges", charges?.conversionCharges);
      setValue("payableNow", charges?.scrutinyFeeCharges + (charges?.licenseFeeCharges * 25) / 100);
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    CalculateApiCall();
  }, [applicantId, stepData]);

  const showPdf = async () => {
    setLoader(true);
    try {
      const Resp = await axios
        .get(`http://103.166.62.118:80/tl-services/new/license/report?id=${props.getId}`, {
          responseType: "blob",
        })
        .then((response) => {
          setLoader(false);
          //Create a Blob from the PDF Stream
          const file = new Blob([response?.data], { type: "application/pdf" });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);
        });
    } catch (error) {
      setLoader(false);
      return error;
    }
  };

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:80/land-services/new/licenses/_get?id=${props.getId}`).then((response) => {
        return response;
      });
    } catch (error) {
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

  useEffect(() => {
    getSubmitDataLabel();
  }, []);

  const [fileStoreId, setFileStoreId] = useState({});
  const getDocumentData = async (file, fieldName) => {
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
      // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

  const dataArea = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.kanal;
  const dataAreaMarla = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.marla;
  const dataAreaSarai = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.sarsai;
  const dataAreaBigha = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.bigha;
  const dataAreaBiswa = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.biswa;
  const dataAreaBiswansi = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.biswansi;
  const totalAreaAcre =
    dataArea * 0.125 + dataAreaMarla * 0.0062 + dataAreaSarai * 0.00069 + dataAreaBigha * 0.33 + dataAreaBiswa * 0.0309 + dataAreaBiswansi * 0.619;

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
      setValue("purpose", userData?.ApplicantPurpose?.purpose);
      setValue("potential", userData?.ApplicantPurpose?.potential);
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

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(FeesChrgesFormSubmitHandler)}>
        <Card style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New Licence </h4>
          <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
            <Form.Group className="justify-content-center" controlId="formBasicEmail">
              <Row className="ml-auto" style={{ marginBottom: 5 }}>
                <Col col-12>
                  <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))", width: "629px", marginLeft: "273px" }}>
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
                          <input type="text" className="form-control" placeholder="potential" disabled {...register("potential")} />
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
                          Conversion Charges <span style={{ color: "red" }}>*</span>
                        </th>
                        <td>
                          <input type="text" className="form-control" disabled {...register("conversionCharges")} />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="row">
                    <div className="col col-4">
                      <h6 data-toggle="tooltip" data-placement="top" title="Total Fees (License fee 25% + Scrutiny Fees)">
                        (i)&nbsp;Amount Payable <span style={{ color: "red" }}>*</span>&nbsp;&nbsp;
                      </h6>
                      <input type="text" className="form-control" disabled {...register("payableNow")} />
                      {/* <input
                        type="text"
                        className="form-control"
                        disabled
                        minLength={1}
                        maxLength={20}
                        pattern="[0-9]*"
                        onChange1={handleTotalFeesChange}
                        onChange={(e) => setPayableNow(e.target.value)}
                        value={payableNow}
                      /> */}
                    </div>

                    <div className="col col-4">
                      <h6>(ii)Remark (If any)</h6>
                      <input type="text" className="form-control" minLength={2} maxLength={100} {...register("remark")} />
                    </div>

                    <div className="col col-4">
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
                                      <label>
                                        <h2>
                                          Consent letter in case of Another Developer (verified by the Department)
                                          <span style={{ color: "red" }}>*</span>
                                          {fileStoreId?.consentLetter ? (
                                            <a onClick={() => getDocShareholding(fileStoreId?.consentLetter)} className="btn btn-sm col-md-6">
                                              <VisibilityIcon color="info" className="icon" />
                                            </a>
                                          ) : (
                                            <p></p>
                                          )}
                                        </h2>
                                      </label>
                                      <div>
                                        <input
                                          type="file"
                                          className="form-control"
                                          required
                                          onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetter")}
                                        />
                                      </div>

                                      <h3 className="error-message" style={{ color: "red" }}>
                                        {errors?.consentLetter && errors?.consentLetter?.message}
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
                    </div>
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
                      <li>I hereby declare that the details furnished above are true and correct to the best of my knowledge</li>.
                      <button className="btn btn-primary" onClick={() => setmodal1(true)}>
                        Read More
                      </button>
                    </ul>
                  </div>
                  <Modal
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
                  </Modal>
                  <div className="">
                    <div className="form-check">
                      <input className="form-check-input" formControlName="agreeCheck" type="checkbox" value="" id="flexCheckDefault" required />
                      <label className="checkbox" for="flexCheckDefault">
                        I agree and accept the terms and conditions.
                        <span className="text-danger">
                          <b>*</b>
                        </span>
                      </label>
                    </div>

                    {/* <div>
                    <Modal
                      size="lg"
                      isOpen={modal}
                      toggle={() => setmodal(!modal)}
                      style={{ width: "500px", height: "200px" }}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <ModalHeader toggle={() => setmodal(!modal)}></ModalHeader>
                      <ModalBody style={{ fontWeight: "bold", fontSize: 20 }}>
                        <p class="text-success font-weight-bold">Congratulations, Payment Successful!!</p>
                        <p class="font-weight-bold">
                          Your Application No. : <strong>2547893</strong>
                        </p>
                        <p class="font-weight-bold">
                          Your Diary No. : <strong>5984785</strong>
                        </p>
                        <p class="font-weight-bold">The same has been sent to your mobile and email as well.</p>
                      </ModalBody>
                      <ModalFooter toggle={() => setmodal(!modal)}></ModalFooter>
                    </Modal>
                  </div> */}
                  </div>
                  <div class="row">
                    {/* <button id="btnSearch" class="btn btn-primary btn-md ">
                      {" "} */}
                    {/* <a href="http://103.166.62.118:80/tl-services/new/license/report?id=875" target="_blank"> */}
                    <div class="col-sm-12 text-right">
                      {/* <div onClick={() => showPdf()} id="btnSearch" class="btn btn-primary btn-md">
                        View as PDF &nbsp;&nbsp; <VisibilityIcon color="white" />
                      </div> */}
                      {/* </a> */}
                      {/* &nbsp;&nbsp; */}
                      <button type="submit" id="btnClear" class="btn btn-primary btn-md ">
                        Submit
                      </button>
                      <div class="my-2">
                        .
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
