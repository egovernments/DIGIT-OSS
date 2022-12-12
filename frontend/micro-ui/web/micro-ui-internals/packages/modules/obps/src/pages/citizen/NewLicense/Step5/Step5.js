import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useForm } from "react-hook-form";
// import Box from '@material-ui/core//Box';
import { Button, Form } from "react-bootstrap";
// import Typography from '@material-ui/core/Typography'
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Card, Row, Col } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { round } from "lodash";
import { useHistory } from "react-router-dom";

// import InfoIcon from '@mui/icons-material/Info';
// import TextField from '@mui/material/TextField';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};



const FeesChargesForm = (props) => {
  const history = useHistory();
  const [purpose, setPurpose] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [remark, setRemark] = useState("");
  const [payableNow, setPayableNow] = useState("");
  const [calculateData, setCalculateData] = useState({});
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const [submitDataLabel, setSubmitDataLabel] = useState([]);

  const [FeesChargesFormSubmitted, SetFeesChargesFormSubmitted] = useState(false);

  console.log("securedData", props?.securedData);

  const FeesChrgesFormSubmitHandler = async (data) => {
    try {
      const postDistrict = {
        NewServiceInfo: {
          pageName: "FeesAndCharges",
          id: props.getId,
          newServiceInfoData: {
            FeesAndCharges: {
              totalArea: data.totalArea,
              purpose: data.purpose,
              devPlan: data.potential,
              scrutinyFee: data.scrutinyFee,
              licenseFee: data.licenseFee,
              conversionCharges: data.conversionCharges,
              remark: data.remark,
              adjustFee: data.licNumber,
            },
          },
        },
      };

      const Resp = await axios.post("/land-services/new/_create", postDistrict).then((Resp) => {
        return Resp;
      });

      props.Step5Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
      SetFeesChargesFormSubmitted(Resp.data);
    } catch (error) {
      return error?.message;
    }
  };

  const [showhide0, setShowhide0] = useState("No");
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  };

  const handleTotalFeesChange = (event) => {
    setTotalFee(event.target.value);
  };
  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  const Purpose = localStorage.getItem("purpose");
  const potential = JSON.parse(localStorage.getItem("potential"));

  const CalculateApiCall = async () => {
    const token = window?.localStorage?.getItem("token");
    const payload = {
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: "8428d41b-01ff-4e90-a125-9af324bbf409",
        userInfo: {
          id: 330,
          uuid: "36ea2b0e-52f5-4d16-96b2-4b3963eee30a",
          userName: "9050784591",
          name: "renuka",
          mobileNumber: "9050784591",
          emailId: "",
          locale: null,
          type: "CITIZEN",
          roles: [
            {
              code: "DEVELOPER",
              name: "Developer ",
              tenantId: "hr",
            },
            {
              name: "Citizen",
              code: "CITIZEN",
              tenantId: "hr",
            },
          ],
          active: true,
          tenantId: "hr",
          permanentCity: null,
        },
      },
      CalulationCriteria: [
        {
          tenantId: "hr",
        },
      ],
      CalculatorRequest: {
        totalLandSize: 1,
        potenialZone: potential,
        purposeCode: Purpose,
        applicationNumber: props?.securedData?.applicationNumber,
      },
    };

    try {
      const Resp = await axios.post("/tl-calculator/v1/_calculator", payload);
      const charges = Resp.data?.Calculations?.[0]?.tradeTypeBillingIds;
      setValue("scrutinyFee", charges?.scrutinyFeeCharges);
      setValue("licenseFee", charges?.licenseFeeCharges);
      setValue("conversionCharges", charges?.conversionCharges);
      // setCalculateData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    CalculateApiCall();
  }, []);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:8443/land-services/new/licenses/_get?id=${props.getId}`).then((response) => {
        return response;
      });
      console.log("RESP+++", Resp?.data);
      setSubmitDataLabel(Resp?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getWholeData = async () => {
    try {
      const Resp = await axios.get(`http://103.166.62.118:8443/tl-services/new/licenses/object/_get?id=${props.getId}`);
      console.log("Resp====", Resp?.data);
      // let temp = {};
      // Object.keys(Resp?.data).forEach((el) => {
      //   const newKey = el?.replace(/"/g, "");
      //   temp[newKey] = Resp?.data[el];
      // });
      console.log("temp==", temp);
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

  const handleChangePurpose = (data) => {
    const purposeSelected = data.data;
    setSelectPurpose(purposeSelected);
  };

  const handleChangePotential = (data) => {
    const purposeSelected = data.data;
    setSelectPurpose(purposeSelected);
  };

  const handleScrutiny = (event) => {
    setCalculateData(event.target.value);
  };
  const handleLicense = (event) => {
    setCalculateData(event.target.value);
  };
  const handleConversion = (event) => {
    setCalculateData(event.target.value);
  };
  const dataArea = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.kanal;
  const dataAreaMarla = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.marla;
  const dataAreaSarai = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.sarsai;
  const dataAreaBigha = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.bigha;
  const dataAreaBiswa = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.biswa;
  const dataAreaBiswansi = props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.biswansi;
  const totalAreaAcre =
    dataArea * 0.125 + dataAreaMarla * 0.0062 + dataAreaSarai * 0.00069 + dataAreaBigha * 0.33 + dataAreaBiswa * 0.0309 + dataAreaBiswansi * 0.619;
  console.log("abc", totalAreaAcre);

  useEffect(() => {
    console.log("dd", props?.getLicData?.ApplicantPurpose?.AppliedLandDetails?.[0]?.kanal);
  }, [props?.getLicData]);

  const dataScrutiny = props?.getLicData?.FeesAndCharges?.scrutinyFee;
  const dataLicence = props?.getLicData?.FeesAndCharges?.licenseFee;
  const data = dataLicence + (25 % dataScrutiny);
  console.log("lic", data);

  useEffect(() => {
    console.log("ddtt", props?.getLicData);
  }, [props?.getLicData]);

  return (
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
                      <th>Total Area (In acres)</th>
                      <td>
                        <input type="text" className="form-control" disabled {...register("totalArea")} placeholder={totalAreaAcre} />
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Purpose</th>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={Purpose}
                          onChange1={handleChangePurpose}
                          value={purpose}
                          disabled
                          {...register("purpose")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Dev Plan</th>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={potential}
                          onChange1={handleChangePotential}
                          value={potential}
                          disabled
                          {...register("potential")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Scrutiny Fees</th>
                      <td>
                        <input type="text" className="form-control" disabled {...register("scrutinyFee")} />
                      </td>
                    </tr>
                    <tr>
                      <th>Licence Fees</th>
                      <td>
                        <input type="text" className="form-control" disabled {...register("licenseFee")} />
                      </td>
                    </tr>
                    <tr>
                      <th>Conversion Charges</th>
                      <td>
                        <input type="text" className="form-control" disabled {...register("conversionCharges")} />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="row">
                  <div className="col col-4">
                    <h6 data-toggle="tooltip" data-placement="top" title="Total Fees (License fee 25% + Scrutiny Fees)">
                      (i)&nbsp;Amount Payable &nbsp;&nbsp;
                    </h6>

                    <input
                      type="text"
                      className="form-control"
                      disabled
                      minLength={1}
                      maxLength={20}
                      pattern="[0-9]*"
                      onChange1={handleTotalFeesChange}
                      onChange={(e) => setPayableNow(e.target.value)}
                      value={payableNow}
                    />
                    {errors.totalFee && <p></p>}
                  </div>

                  <div className="col col-4">
                    <h6>(ii)Remark (If any)</h6>
                    <input
                      type="text"
                      className="form-control"
                      minLength={2}
                      maxLength={100}
                      {...register("remark")}
                      onChange1={handleRemarkChange}
                    />
                    {errors.remark && <p></p>}
                  </div>

                  <div className="col col-4">
                    <h6 data-toggle="tooltip" data-placement="top" title="Do you want to adjust the fee from any previous licence (Yes/No)">
                      (iii)&nbsp;Adjust Fees &nbsp;&nbsp;
                    </h6>
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow0} />
                    <label for="No">No</label>
                    {showhide0 === "Yes" && (
                      <div className="row ">
                        <div className="col col-12">
                          <label>Enter Licence Number/LOI number</label>
                          <input type="text" className="form-control" {...register("licNumber")} />
                          <label>
                            Click Yes,if Lic No/LOI number belongs to other developers.
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
                                      </h2>
                                    </label>
                                    <input type="file" className="form-control" {...register("consentLetter")} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </label>
                          <label>Amount (previous)</label>
                          <input type="text" className="form-control" disabled {...register("amount")} />
                          <label>Amount to be paid after adjustment</label>
                          <input type="text" className="form-control" {...register("amountAdjusted")} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <br></br>
                <hr />
                <br></br>
                <h5 className="text-black">Undertakings</h5>
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
                      I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief and I undertake to
                      inform you of any changes therein, immediately. In case any of the above information is found to be false or untrue or
                      misleading or misrepresenting, I am aware that I may be held liable for it.
                    </h2>
                  </ModalBody>
                  <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
                </Modal>
                <div className="">
                  <div className="form-check">
                    <input className="form-check-input" formControlName="agreeCheck" type="checkbox" value="" id="flexCheckDefault" />
                    <label className="checkbox" for="flexCheckDefault">
                      I agree and accept the terms and conditions.
                      <span className="text-danger">
                        <b>*</b>
                      </span>
                    </label>
                  </div>
                  <div class="my-2">
                    .
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        // `/digit-ui/citizen/payment/collect/${mutation2.data.Licenses[0].businessService}/${mutation2.data.Licenses[0].applicationNumber}`
                        history.push(`/digit-ui/citizen/payment/collect/tl/${props?.securedData?.applicationNumber}`, {
                          // paymentAmount: paymentAmt,
                        });
                        setmodal(true);
                      }}
                    >
                      Pay Now
                    </button>
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
                  <div class="col-sm-12 text-right">
                    {/* <button id="btnSearch" class="btn btn-primary btn-md ">
                      {" "}
                      View as PDF &nbsp;&nbsp; <VisibilityIcon color="white" />
                    </button>{" "} */}
                    {/* <div>
    <ReactToPdf targetRef={ref} filename="div-blue.pdf">
        {({toPdf}) => (
            <button onClick={toPdf}>Generate pdf</button>
        )}
    </ReactToPdf>
    <div style={{width: 500, height: 500, background: 'blue'}} ref={ref}/>
</div> */}


                    &nbsp;&nbsp;
                    <button id="btnClear" class="btn btn-primary btn-md ">
                      Submit
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          </Form.Group>
        </Card>
      </Card>
    </form>
  );
};
export default FeesChargesForm;