import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
import MigrationAppliedTrue from "./MigrationAplliedTrue";
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
// import { tr, thead, TableContainer, td, tbody, Table, Paper } from '@material-ui/core';
// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@material-ui/icons/Delete";
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
// import { PlusSquareFill } from "react-bootstrap-icons";
// import { DashSquareFill } from "react-bootstrap-icons";
// import { ArrowDownCircleFill } from "react-bootstrap-icons";
import DDJAYForm from "../ScrutinyBasic/Puropse/DdjayForm";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import Collapse from "react-bootstrap/Collapse";

const AppliedLandinfo = (props) => {
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  console.log(uncheckedValue);
  const [migrationApllied, setMigrationApplied] = useState(true);
  // const DdjayFormDisplay = useSelector(selectDdjayFormShowDisplay);
  const [resplotno, setResPlotno] = useState("");

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  const [showhide18, setShowhide18] = useState("2");
  const handleshow18 = (e) => {
    const getshow = e.target.value;
    setShowhide18(getshow);
  };
  const [open, setOpen] = useState(false);
  const [noOfRows, setNoOfRows] = useState(1);
  const [noOfRow, setNoOfRow] = useState(1);
  const [noOfRow1, setNoOfRow1] = useState(1);
  const Purpose = props.purpose;
  console.log("Akash", Purpose);
  return (
    <Form
      ref={props.appliedLandInfoRef}
      style={{
        width: "100%",
        height: props.heightApplied,
        overflow: "hidden",
        marginBottom: 20,
        borderColor: "#C3C3C3",
        borderStyle: "solid",
        borderWidth: 2,
      }}
    >
      {/* <Button
           style={{  margin: 20}}
    onClick={() => setOpen(!open)}
    aria-controls="example-collapse-text"
    aria-expanded={open}
  >
  Step-4
      </Button> */}
      <Form.Group style={{ display: props.displayPurpose }} className="justify-content-center">
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col col-12>
            <h5 className="text-black">
              1. DGPS points <span className="text-primary"> (Click here for instructions to capture DGPS points)</span>
              &nbsp;&nbsp;
              <Form.Check
                value="Name of the authorized person to sign the application"
                type="radio"
                id="default-radio"
                label={<CheckCircleIcon color="success"></CheckCircleIcon>}
                name="group39"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="Name of the authorized person to sign the application"
                type="radio"
                id="default-radio"
                label={<CancelIcon color="error" />}
                name="group39"
                inline
              ></Form.Check>
            </h5>

            <div className="px-2">
              <div className="text-black">
                (i)Add point 1 &nbsp;
                <div className="row ">
                  <div className="col col-4">
                    <label htmlFor="pitentialZone" className="font-weight-bold">
                      X:Longitude
                    </label>
                    <input type="number" name="XLongitude" className="form-control" readOnly />
                  </div>
                  <div className="col col-4">
                    <label htmlFor="pitentialZone" className="font-weight-bold">
                      Y:Latitude
                    </label>
                    <input type="number" name="YLatitude" className="form-control" readOnly />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-2">
              <div className="text-black">
                (ii)Add point 2 &nbsp;
                <div className="row ">
                  <div className="col col-4">
                    <label htmlFor="pitentialZone" className="font-weight-bold">
                      X:Longitude
                    </label>
                    <input type="number" name="XLongitude" className="form-control" readOnly />
                  </div>
                  <div className="col col-4">
                    <label htmlFor="pitentialZone" className="font-weight-bold">
                      Y:Latitude
                    </label>
                    <input type="number" name="YLatitude" className="form-control" readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-2">
              <div className="text-black">
                (iii)Add point 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="row ">
                  <div className="col col-4">
                    <label htmlFor="pitentialZone" className="font-weight-bold">
                      X:Longitude
                    </label>
                    <input type="number" name="XLongitude" className="form-control" readOnly />
                  </div>
                  <div className="col col-4">
                    <label htmlFor="pitentialZone" className="font-weight-bold">
                      Y:Latitude
                    </label>
                    <input type="number" name="YLatitude" className="form-control" readOnly />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-2">
              <div className="text-black">
                (iv)Add point 4 &nbsp;
                <div className="row ">
                  <div className="col col-4">
                    <label htmlFor="pitentialZone" className="font-weight-bold">
                      X:Longitude
                    </label>
                    <input type="number" name="XLongitude" className="form-control" readOnly />
                  </div>
                  <div className="col col-4">
                    <label htmlFor="pitentialZone" className="font-weight-bold">
                      Y:Latitude
                    </label>
                    <input type="number" name="YLatitude" className="form-control" readOnly />
                  </div>
                </div>
                {/* <DashSquareFill style={{ float: "right" }} class="text-primary" onClick={() => setNoOfRows(noOfRows - 1)} /> */}
                &nbsp;&nbsp;&nbsp;
                {/* <PlusSquareFill style={{ float: "right", marginRight: 15 }} class="text-primary" onClick={() => setNoOfRows(noOfRows + 1)} /> */}
              </div>

              {[...Array(noOfRows)].map((elementInArray, index) => {
                return (
                  <div className="row ">
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">
                        X:Longiude
                      </label>
                      <input type="number" name="XLongitude" className="form-control" readOnly />
                    </div>
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">
                        Y:Latitude
                      </label>
                      <input type="number" name="YLatitude" className="form-control" readOnly />
                    </div>
                  </div>
                );
              })}
            </div>

            <hr />
            {/* <Collapse in={open}>
        <div id="example-collapse-text"> */}
            <h5 className="text-black">
              <b>2.Details of Plots</b>&nbsp;&nbsp;
              <input type="radio" id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow18} readOnly />
              &nbsp;&nbsp;
              <label for="Yes"></label>
              <label htmlFor="gen">Regular</label>&nbsp;&nbsp;
              <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} readOnly />
              &nbsp;&nbsp;
              <label for="Yes"></label>
              <label htmlFor="npnl">Irregular</label>
            </h5>
            {showhide18 === "1" && (
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <td>
                      <b>Type of plots</b>
                    </td>
                    <td>
                      <b>Plot No.</b>
                    </td>
                    <td>
                      <b>Length in mtr</b>
                    </td>
                    <td>
                      <b>Width in mtr</b>
                    </td>
                    <td>
                      <b>Area in sqmtr</b>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2" onChange={(e) => setResPlotno(e.target.value)} value={resplotno}>
                          <b>Residential</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="text" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>Gen</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="text" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>NPNL</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="text" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>EWS</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="text" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p
                          className="mb-2"
                          // onChange={(e)=>setComPlotno(e.target.value)} value={complotno}
                        >
                          <b>Commercial</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="text" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p
                          className="mb-2"
                          // onChange={(e)=>setSitePlotno(e.target.value)} value={siteplotno}
                        >
                          <b>Community Sites</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="text" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p
                          className="mb-2"
                          // onChange={(e)=>setParkPlotno(e.target.value)} value={parkplotno}
                        >
                          <b>Parks</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="text" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p
                          className="mb-2"
                          // onChange={(e)=>setPublicPlotno(e.target.value)} value={publicplotno}
                        >
                          <b>Public Utilities</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="text" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>STP</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="number" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>ETP</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="number" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>WTP</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="number" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>UGT</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="number" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>Milk Booth</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="number" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="px-2">
                        <p className="mb-2">
                          <b>GSS</b>
                        </p>
                      </div>
                    </td>
                    <td component="th" scope="row">
                      <input type="number" className="form-control" readOnly />
                    </td>

                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                    <td align="right">
                      {" "}
                      <input type="number" className="form-control" readOnly />
                    </td>
                  </tr>
                </tbody>
              </div>
            )}
            {showhide18 === "2" && (
              <div>
                <div className="table table-bordered table-responsive ">
                  <thead>
                    <tr>
                      <td>
                        <b>Details of Plot</b>
                      </td>
                      <td>
                        <b>Dimensions (in mtr)</b>
                      </td>
                      <td>
                        <b>Entered Area</b>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p
                            className="mb-2"
                            //  onChange={(e)=>setIrPlotDimen(e.target.value)} value={irPlotDimen}
                          >
                            <b>Residential</b>
                          </p>
                        </div>
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p
                            className="mb-2"
                            // onChange={(e)=>setIrSizeDimen(e.target.value)} value={irSizeDimen}
                          >
                            <b>Commercial</b>
                          </p>
                        </div>
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                    </tr>
                  </tbody>
                </div>
                <h5 className="text-black">
                  <b>Area Under</b>
                </h5>
                <div className="table table-bordered table-responsive">
                  <thead>
                    <tr>
                      <td>
                        <b>Detail of plots</b>
                      </td>
                      <td>
                        <b> Plot No.</b>
                      </td>
                      <td>
                        <b>Length (in mtr)</b>
                      </td>
                      <td>
                        <b>Dimension (in mtr)</b>
                      </td>
                      <td>
                        <b>Entered Area</b>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p
                            className="mb-2"
                            // onChange={(e)=>setNpnlNo(e.target.value)} value={npnlNo}
                          >
                            <b>Sectoral Plan Road</b>
                          </p>
                        </div>
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td component="th" scope="row">
                        <input type="number" className="form-control" readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p
                            className="mb-2"
                            // onChange={(e)=>setEwsNo(e.target.value)} value={ewsNo}
                          >
                            <b>Green Belt</b>
                          </p>
                        </div>
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td component="th" scope="row">
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p
                            className="mb-2"
                            // onChange={(e)=>setEwsNo(e.target.value)} value={ewsNo}
                          >
                            <b>24/18 mtr wide internal circulation Plan road</b>
                          </p>
                        </div>
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td component="th" scope="row">
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p
                            className="mb-2"
                            //  onChange={(e)=>setEwsNo(e.target.value)} value={ewsNo}
                          >
                            <b>Other Roads</b>
                          </p>
                        </div>
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td component="th" scope="row">
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="px-2">
                          <p
                            className="mb-2"
                            // onChange={(e)=>setEwsNo(e.target.value)} value={ewsNo}
                          >
                            <b>Undetermined use(UD)</b>
                          </p>
                        </div>
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td component="th" scope="row">
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                      <td align="right">
                        {" "}
                        <input type="number" className="form-control" readOnly />
                      </td>
                    </tr>
                  </tbody>
                </div>
              </div>
            )}

            <div>
              <DDJAYForm displayDdjay={Purpose === "06" ? "block" : "none"}></DDJAYForm>
            </div>

            <h5 className="text-black">
              <b>NILP :-</b>
            </h5>

            <div className="table table-bordered table-responsive">
              <thead>
                <tr>
                  <td>
                    <b>S.No.</b>
                  </td>
                  <td>
                    <b>NLP Details</b>
                  </td>
                  <td>
                    <b>Yes/No</b>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. </td>
                  <td>
                    {" "}
                    Whether you want to surrender the 10% area of license colony to Govt. the instead of providing 10% under EWS and NPNL plots{" "}
                  </td>
                  <td component="th" scope="row">
                    <input
                      type="radio"
                      value="Yes"
                      id="Yes"
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                    />
                    <label for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="No"
                      id="No"
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                    />
                    <label for="No">No</label>
                    {/* {
                                            showhide0==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col-12">
                                                            <label for="areaAcre" className="font-weight-bold">Area in Acres </label>
                                                            
                                                            <input type="number" className="form-control"  readOnly  />
                                                        </div>
                                                    </div> 
                                            )
                                        }  */}
                  </td>
                </tr>
                <tr>
                  <td>2. </td>
                  <td>Whether any pocket proposed to be transferred less than 1 acre </td>
                  <td component="th" scope="row">
                    <input
                      type="radio"
                      value="Yes"
                      id="Yes"
                      // onChange={handleChange} name="Yes" onClick={handleshow13}
                    />
                    <label for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="No"
                      id="No"
                      // onChange={handleChange} name="Yes" onClick={handleshow13}
                    />
                    <label for="No">No</label>
                    {/* {
                                            showhide13==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col-6">
                                                            <label for="areaAcre" className="font-weight-bold"> Dimension (in mtr) </label>
                                                            
                                                            <input type="number" className="form-control"  readOnly  />
                                                        </div>
                                                        <div className="col col-6">
                                                            <label for="areaAcre" className="font-weight-bold"> Entered Area </label>
                                                            
                                                            <input type="number" className="form-control"  readOnly  />
                                                        </div>
                                                    </div> 
                                            )
                                        }  */}
                  </td>
                </tr>
                <tr>
                  <td>3. </td>
                  <td>Whether you want to deposit an amount @ of 3 times of collector rate instead of the surrender 10% land to Govt. </td>
                  <td component="th" scope="row">
                    <input
                      type="radio"
                      value="Yes"
                      id="Yes"
                      // onChange={handleChange} name="Yes" onClick={handleshow1}
                    />
                    <label for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="No"
                      id="No"
                      // onChange={handleChange} name="Yes"onClick={handleshow1}
                    />
                    <label for="No">No</label>
                    {/* {
                                            showhide1==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col-12">
                                                            <label for="areaAcre" className="font-weight-bold">Area in Acres </label>
                                                            
                                                            <input type="number" className="form-control"  readOnly  />
                                                        </div>
                                                    </div> 
                                            )
                                        }  */}
                  </td>
                </tr>
                <tr>
                  <td>4. </td>
                  <td>Whether the surrendered area is having a minimum of 18 mtr independent access </td>
                  <td component="th" scope="row">
                    <input
                      type="radio"
                      value="Yes"
                      id="Yes"
                      // onChange={handleChange} name="Yes" onClick={handleshow14}
                    />
                    <label for="Yes">Yes</label>

                    <input
                      type="radio"
                      value="No"
                      id="No"
                      // onChange={handleChange} name="Yes"onClick={handleshow14}
                    />
                    <label for="No">No</label>
                    {/* {
                                            showhide14==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col-12">
                                                            <label for="areaAcre" className="font-weight-bold">Dimension(in mtr)</label>
                                                            
                                                            <input type="number" className="form-control"  readOnly  />
                                                        </div>
                                                        <div className="col col-12">
                                                            <label for="areaAcre" className="font-weight-bold">Entered Area</label>
                                                            
                                                            <input type="number" className="form-control"  readOnly  />
                                                        </div>
                                                    </div> 
                                            )
                                        }  */}
                  </td>
                </tr>
              </tbody>
            </div>

            <hr />
            <div className="row">
              <div className="col col-12">
                <div className="form-group">
                  <h6>
                    <b>
                      Upload Layout Plan <span className="text-primary"> (Click here for instructions to capture DGPS points)</span>
                    </b>
                    <input type="file" className="form-control" readOnly />
                  </h6>
                </div>
              </div>
            </div>
            <hr />
            <h5 className="text-black">
              <b>Mandatory Documents</b>
            </h5>
            <div className="row">
              <div className="col col-3">
                <h6>
                  <b>Site plan.</b>
                </h6>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
              <div className="col col-3">
                <h6>
                  <b>Democratic Plan.</b>
                </h6>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
              <div className="col col-3">
                <h6>
                  <b>Sectoral Plan/Layout Plan.</b>
                </h6>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
              <div className="col col-3">
                <h6>
                  <b>Development Plan. </b>
                </h6>
                <input type="file" className="form-control" readOnly />
                {<DownloadForOfflineIcon color="primary" />}
              </div>
            </div>

            <Button style={{ alignSelf: "center", marginTop: 20, marginright: 867 }} variant="primary" type="submit">
              Save as Draft
            </Button>
            <Button style={{ alignSelf: "center", marginTop: 8, marginLeft: 1025 }} variant="primary" type="submit">
              Continue
            </Button>
            {/* </div>
      </Collapse> */}
          </Col>
        </Row>
      </Form.Group>
      <div style={{ position: "relative", marginBottom: 40 }}>
        <Button onClick={() => props.passUncheckedList({ data: uncheckedValue })}>Submit</Button>
      </div>
      <hr></hr>
    </Form>
  );
};

export default AppliedLandinfo;
