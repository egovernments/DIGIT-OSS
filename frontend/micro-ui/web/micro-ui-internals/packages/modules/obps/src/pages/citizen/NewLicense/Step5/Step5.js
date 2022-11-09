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
  // const [show, setShow] = useState(false);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const setPayShow = () => setShow(true);

  const [form, setForm] = useState([]);
  const [totalArea, setTotalArea] = useState("");

  const [purpose, setPurpose] = useState("");
  const [devPlan, setDevPlan] = useState("");
  const [scrutinyFee, setScrutinyFee] = useState("");
  const [licenseFee, setLicenseFee] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [remark, setRemark] = useState("");
  const [conversionCharges, setConversionCharges] = useState("");
  const [payableNow, setPayableNow] = useState("");
  const [previousLic, setPreviousLic] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [calculateData, setCalculateData] = useState({});
  const [finalSubmitData, setFinalSubmitData] = useState([]);
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const [submitDataLabel, setSubmitDataLabel] = useState([]);
  let frmData = JSON.parse(localStorage.getItem("key") || "[]");
  console.log("data1", frmData);
  let step2 = JSON.parse(localStorage.getItem("step2") || "[]");
  let step3 = JSON.parse(localStorage.getItem("step3") || "[]");
  let step4 = JSON.parse(localStorage.getItem("step4") || "[]");
  const [FeesChargesFormSubmitted, SetFeesChargesFormSubmitted] = useState(false);
  const FeesChrgesFormSubmitHandler = async (data) => {
    console.log("data------", data);
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

      console.log("MMM", Resp?.data?.NewServiceInfo?.[0]?.id);
      props.Step5Continue(data, Resp?.data?.NewServiceInfo?.[0]?.id);
      SetFeesChargesFormSubmitted(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (FeesChargesFormSubmitted) {
    }
  }, [FeesChargesFormSubmitted]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [showhide0, setShowhide0] = useState("No");
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  };
  const handleOpen = () => setOpen(true);

  const [showhide, setShowhide] = useState("No");
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const handleFeesChange = (event) => {
    setFeeDetail(event.target.value);
  };
  const handleLicFeesChange = (event) => {
    setLicenseFee(event.target.value);
  };
  const handleScrutinyFeesChange = (event) => {
    setScrutinyFee(event.target.value);
  };
  const handleTotalFeesChange = (event) => {
    setTotalFee(event.target.value);
  };
  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };
  const handleAggregatorChange = (event) => {
    setAggregator(event.target.value);
  };
  const handlePrevLicChange = (event) => {
    setPreviousLic(event.target.value);
  };
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  const [noOfRows, setNoOfRows] = useState(1);
  const [noOfRow, setNoOfRow] = useState(1);
  const [noOfRow1, setNoOfRow1] = useState(1);

  const Purpose = localStorage.getItem("purpose");
  console.log("adf", Purpose);
  const potential = JSON.parse(localStorage.getItem("potential"));
  console.log("potential", potential);
  const CalculateApiCall = async () => {
    try {
      const Resp = await axios
        .get(
          "http://10.1.1.18:8443/land-services/_calculate?feeType=scrutinyFeeCharges&purposename=residentialPlottedColony&arce=1" +
            "&potenialZone=" +
            potential +
            "&colonyType=" +
            Purpose,
          {}
        )
        .then((Resp) => {
          return Resp;
        });
      setCalculateData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    CalculateApiCall();
  }, []);

  const getSubmitDataLabel = async () => {
    try {
      const Resp = await axios.get(`http://10.1.1.18:8443/land-services/new/licenses/_get?id=${props.getId}`).then((response) => {
        return response;
      });
      console.log("RESP+++", Resp?.data);
      setSubmitDataLabel(Resp?.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getSubmitDataLabel();
  }, []);

  useEffect(() => {
    if (calculateData !== undefined && calculateData !== null) {
    }
  }, [calculateData]);

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

  return (
    <form onSubmit={handleSubmit(FeesChrgesFormSubmitHandler)}>
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>New License </h4>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Form.Group className="justify-content-center" controlId="formBasicEmail">
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col col-12>
                <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))", width: "629px", marginLeft: "273px" }}>
                  <thead>
                    <tr>
                      <th>Total Area</th>
                      <td>
                        <input type="text" className="form-control" disabled {...register("totalArea")} />
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
                        <input
                          type="text"
                          className="form-control"
                          placeholder={
                            calculateData !== null && calculateData !== undefined
                              ? calculateData?.feeTypeCalculationDto?.scrutinyFeeChargesCal
                              : "N/A"
                          }
                          onChange1={handleScrutiny}
                          value={
                            calculateData !== null && calculateData !== undefined
                              ? calculateData?.feeTypeCalculationDto?.scrutinyFeeChargesCal
                              : "N/A"
                          }
                          disabled
                          {...register("scrutinyFee")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>License Fees</th>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={
                            calculateData !== null && calculateData !== undefined ? calculateData?.feeTypeCalculationDto?.licenseFeeChargesCal : "N/A"
                          }
                          onChange1={handleLicense}
                          value={
                            calculateData !== null && calculateData !== undefined ? calculateData?.feeTypeCalculationDto?.licenseFeeChargesCal : "N/A"
                          }
                          disabled
                          {...register("licenseFee")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Conversion Charges</th>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={
                            calculateData !== null && calculateData !== undefined ? calculateData?.feeTypeCalculationDto?.conversionChargesCal : "N/A"
                          }
                          onChange1={handleConversion}
                          value={
                            calculateData !== null && calculateData !== undefined ? calculateData?.feeTypeCalculationDto?.conversionChargesCal : "N/A"
                          }
                          disabled
                          {...register("conversionCharges")}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="row">
                  <div className="col col-4">
                    <h6 data-toggle="tooltip" data-placement="top" title="Total Fees (License fee 25% + Scrutiny Fees)">
                      (i)&nbsp;Amount Payable at the time of Application &nbsp;&nbsp;
                    </h6>

                    <input
                      type="text"
                      className="form-control"
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
                    <h6 data-toggle="tooltip" data-placement="top" title="Do you want to adjust the fee from any previous license (Yes/No)">
                      (iii)&nbsp;Adjust Fees &nbsp;&nbsp;
                    </h6>
                    <input type="radio" value="Yes" id="Yes" onChange1={handleChange} name="Yes" onClick={handleshow0} />
                    <label for="Yes">Yes</label>&nbsp;&nbsp;
                    <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow0} />
                    <label for="No">No</label>
                    {showhide0 === "Yes" && (
                      <div className="row ">
                        <div className="col col-12">
                          <label>Enter License Number/LOI number</label>
                          <input type="text" className="form-control" {...register("licNumber")} />
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
                    <button className="btn btn-primary" onClick={() => setmodal(true)}>
                      Pay Now
                    </button>
                  </div>
                  <div>
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
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 text-right">
                    <button id="btnSearch" class="btn btn-primary btn-md ">
                      {" "}
                      View as PDF &nbsp;&nbsp; <VisibilityIcon color="white" />
                    </button>{" "}
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
