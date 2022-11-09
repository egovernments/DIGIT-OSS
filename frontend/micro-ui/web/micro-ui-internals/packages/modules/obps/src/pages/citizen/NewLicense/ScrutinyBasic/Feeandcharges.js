import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
// import Box from '@material-ui/core//Box';
import { useForm } from "react-hook-form";
// import Typography from '@material-ui/core/Typography'
import Modal from "react-bootstrap/Modal";
// import InfoIcon from '@mui/icons-material/Info';
import * as Icon from "react-bootstrap-icons";
import { XCircleFill } from "react-bootstrap-icons";
import { CheckCircleFill } from "react-bootstrap-icons";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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

const Feeandcharges = (props) => {
  const [form, setForm] = useState([]);
  const [feeDetail, setFeeDetail] = useState("");
  const [licenseFee, setLicenseFee] = useState("");
  const [ScrutinyFee, setScrutinyFee] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [remark, setRemark] = useState("");
  const [aggregator, setAggregator] = useState("");
  const [previousLic, setPreviousLic] = useState("");
  const [amount, setAmount] = useState("");
  const [open2, setOpen2] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm([{ XLongitude: "", YLatitude: "" }]);
  const [showhide0, setShowhide0] = useState("No");
  const handleshow0 = (e) => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const [uncheckedValue, setUncheckedVlue] = useState([]);
  console.log(uncheckedValue);
  return (
    <Form
      ref={props.feeandchargesInfoRef}
      // style={{width:"100%",
      // height:props.heightFee,
      // overflow:"hidden",
      // marginBottom:20,
      // borderColor:"#C3C3C3",
      // borderStyle:"solid",
      // borderWidth:2
      // }}
    >
      {/* <Card
        style={{
          width: "100%",
          height: props.heightFee,
          overflow: "hidden",
          marginBottom: 20,
          borderColor: "#C3C3C3",
          borderStyle: "solid",
          borderWidth: 2,
          padding: 2,
        }}
      > */}

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
          Fee and Charges
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Form.Group
            style={{ display: props.displayFeeandCharges, border: "2px solid #e9ecef", margin: 10, padding: 10 }}
            className="justify-content-center"
          >
            <h1>New License</h1>
            <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
              <Form.Group className="justify-content-center" controlId="formBasicEmail">
                <Row className="ml-auto" style={{ marginBottom: 5 }}>
                  <Col col-12>
                    <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))", width: "629px", marginLeft: "273px" }}>
                      <thead>
                        <tr>
                          <th>Total Area</th>
                          <td>
                            <input type="text" className="form-control" disabled />
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Purpose</th>
                          <td>
                            <input type="text" className="form-control" />
                          </td>
                        </tr>
                        <tr>
                          <th>Dev Plan</th>
                          <td>
                            <input type="text" className="form-control" />
                          </td>
                        </tr>
                        <tr>
                          <th>Scrutiny Fees</th>
                          <td>
                            <input type="text" className="form-control" disabled />
                          </td>
                        </tr>
                        <tr>
                          <th>License Fees</th>
                          <td>
                            <input type="text" className="form-control" disabled />
                          </td>
                        </tr>
                        <tr>
                          <th>Conversion Charges</th>
                          <td>
                            <input type="text" className="form-control" disabled />
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="row">
                      <div className="col col-4">
                        <h6 data-toggle="tooltip" data-placement="top" title="Total Fees (License fee 25% + Scrutiny Fees)">
                          (i)&nbsp;Amount Payable at the time of Application &nbsp;&nbsp;
                        </h6>

                        <input type="text" className="form-control" minLength={1} maxLength={20} pattern="[0-9]*" />
                        {errors.totalFee && <p></p>}
                      </div>

                      <div className="col col-4">
                        <h6>(ii)Remark (If any)</h6>
                        <input type="text" className="form-control" minLength={2} maxLength={100} />
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
                              <input type="text" className="form-control" />
                              <label>Amount (previous)</label>
                              <input type="text" className="form-control" disabled />
                              <label>Amount to be paid after adjustment</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <br></br>
                    <hr />
                    <br></br>

                    <div class="row">
                      <div class="col-sm-12 text-right">
                        <button id="btnSearch" class="btn btn-primary btn-md ">
                          {" "}
                          View as PDF &nbsp;&nbsp;
                        </button>{" "}
                        &nbsp;&nbsp;
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form.Group>
            </Card>

            {/* <div style={{ position: "relative", marginBottom: 40 }}>
              <Button onClick={() => props.passUncheckedList({ data: uncheckedValue })}>Submit</Button>
            </div> */}
          </Form.Group>
        </div>
      </Collapse>
    </Form>
  );
};

export default Feeandcharges;
