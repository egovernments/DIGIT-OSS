import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
// import TextField from '@mui/material/TextField';
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
import * as Icon from "react-bootstrap-icons";
import { XCircleFill } from "react-bootstrap-icons";

import { CheckCircleFill } from "react-bootstrap-icons";

const Genarelinfo = (props) => {
  const [showhide1, setShowhide1] = useState("No");
  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  const [form, setForm] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [showhide, setShowhide] = useState("No");

  const [purpose, setPurpose] = useState("");
  const handleChangesetPurpose = (e) => {
    setPurpose(e.target.value);
    localStorage.setItem("Purpose", e.target.value);
  };

  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  console.log(uncheckedValue);
  return (
    <Form ref={props.generalInfoRef}>
      <Form.Group className="justify-content-center" controlId="formBasicEmail">
        <Row className="ml-auto" style={{ marginBottom: 5 }}>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>Puropse Of License</b> <span style={{ color: "red" }}>*</span>
              </Form.Label>
              &nbsp;&nbsp;
              <Form.Check
                value="Puropse Of License"
                type="radio"
                id="default-radio"
                label={<CheckCircleFill class="text-success" />}
                // onChange={(e) => {setPurpose(e.target.value),localStorage.setItem("Purpose",e.target.value)}}
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                name="group19"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="Puropse Of License"
                type="radio"
                id="default-radio"
                label={<XCircleFill class="text-danger" />}
                name="group19"
                inline
              ></Form.Check>
            </div>
            {/* <Form.Select type="text" placeholder="Puropse"  readOnly> */}
            <select className="form-control" id="Puropse" name="potential" readOnly onChange={(e) => handleChangesetPurpose(e)}>
              <option value="">--Puropse--</option>
              <option value="01">Plotted Commercial</option>
              <option value="02">Group Housing Commercial</option>
              <option value="03">AGH </option>
              <option value="04">Commercial Integrated </option>
              <option value="05">Commercial Plotted</option>
              <option value="06">Industrial Colony Commercial</option>
              <option value="07">IT Colony Commercial</option>
              <option value="08">DDJAY</option>
              <option value="12">TOD Group housing</option>
            </select>
            {/* </Form.Select> */}
          </Col>
          <div className="col col-3">
            <label htmlFor="potential">
              <h6>
                <b>Potential Zone:</b>
              </h6>
            </label>
            &nbsp;&nbsp;
            <Form.Check
              value="Potential Zone"
              type="radio"
              id="default-radio"
              label={<CheckCircleFill class="text-success" />}
              name="group20"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Potential Zone"
              type="radio"
              id="default-radio"
              label={<XCircleFill class="text-danger" />}
              name="group20"
              inline
            ></Form.Check>
            <select className="form-control" id="potential" name="potential" readOnly>
              <option value="">--Potential Zone--</option>
              <option value="K.Mishra">Hyper</option>
              <option value="potential 1">High I</option>
              <option value="potential 2">High II</option>
              <option value="potential 2">Medium</option>
              <option value="potential 2">Low I</option>
              <option value="potential 2">Low II</option>
            </select>
          </div>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>District</b> <span style={{ color: "red" }}>*</span>
              </Form.Label>
              &nbsp;&nbsp;
              <Form.Check
                value="District"
                type="radio"
                id="default-radio"
                label={<CheckCircleFill class="text-success" />}
                name="group21"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="District"
                type="radio"
                id="default-radio"
                label={<XCircleFill class="text-danger" />}
                name="group21"
                inline
              ></Form.Check>
            </div>
            <Form.Select type="text" defaultValue="Select" placeholder="District" readOnly>
              <option value="1">no district</option>
            </Form.Select>
          </Col>
          <Col md={4} xxl lg="3">
            <div>
              <Form.Label>
                <b>State </b>
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              &nbsp;&nbsp;
              <Form.Check
                value="State"
                type="radio"
                id="default-radio"
                label={<CheckCircleFill class="text-success" />}
                name="group22"
                inline
              ></Form.Check>
              <Form.Check
                onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                value="State"
                type="radio"
                id="default-radio"
                label={<XCircleFill class="text-danger" />}
                name="group22"
                inline
              ></Form.Check>
            </div>
            <Form.Control type="text" defaultValue="Haryana" disabled></Form.Control>
          </Col>
        </Row>

        <div className="ml-auto" style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 24 }}>2. Details of applied land:</h2>
          <p>
            Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development agreements/
            Memorandum of Understanding etc. and similar agreements registered with competent authority.
          </p>
          <p>
            <b>(i) Khasra-wise information to be provided in the following format:</b>&nbsp;&nbsp;
            {/* <Form.Check
              value="Name of the authorized person to sign the application"
              type="radio"
              id="default-radio"
              label={<CheckCircleFill class="text-success" />}
              name="group23"
              inline
            ></Form.Check>
            <Form.Check
              onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
              value="Name of the authorized person to sign the application"
              type="radio"
              id="default-radio"
              label={<XCircleFill class="text-danger" />}
              name="group23"
              inline
            ></Form.Check> */}
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="primary" onClick={handleShow}>
            Enter Details
          </Button>
          <div>
            <Modal {...props} size="xl" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
              <Modal.Header closeButton></Modal.Header>

              <Modal.Body>
                <Row className="ml-auto mb-3">
                  <Col md={4} xxl lg="4">
                    <div>
                      <Form.Label>
                        <h6>
                          <b>Tehsil</b>
                        </h6>
                      </Form.Label>
                      &nbsp;&nbsp;
                      <Form.Check
                        value="Tehsil"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleFill class="text-success" />}
                        name="group24"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Tehsil"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
                        name="group24"
                        inline
                      ></Form.Check>
                    </div>
                    <Form.Select type="text" defaultValue="Select" readOnly>
                      <option value="1">--Select Tehsil--</option>
                    </Form.Select>
                  </Col>
                  <Col md={4} xxl lg="4">
                    <div>
                      <Form.Label>
                        <h6>
                          <b>Name of Revenue estate</b>
                        </h6>
                      </Form.Label>
                      &nbsp;&nbsp;
                      <Form.Check
                        value="Name of Revenue estate"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleFill class="text-success" />}
                        name="group25"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Name of Revenue estate"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
                        name="group25"
                        inline
                      ></Form.Check>
                    </div>
                    <Form.Select type="text" defaultValue="Select" readOnly>
                      <option value="1">--Select Revenue State--</option>
                    </Form.Select>
                  </Col>
                  <Col md={4} xxl lg="4">
                    <div>
                      <Form.Label>
                        <h6>
                          <b>Rectangle No./Mustil</b>
                        </h6>
                        <i class=" fa fa-calculator"></i>
                      </Form.Label>
                      &nbsp;&nbsp;
                      <Form.Check
                        value="Rectangle No./Mustil"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleFill class="text-success" />}
                        name="group26"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Rectangle No./Mustil"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
                        name="group26"
                        inline
                      ></Form.Check>
                    </div>
                    <Form.Select type="text" defaultValue="Select">
                      <option value="1">--Select Mustil--</option>
                    </Form.Select>
                  </Col>
                </Row>
                <br></br>
                <Row className="ml-auto mb-3">
                  <Col md={4} xxl lg="4">
                    <div>
                      <label>
                        <h6>
                          <b>Sector</b>
                        </h6>{" "}
                      </label>
                      &nbsp;&nbsp;
                      <Form.Check
                        value="Sector"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleFill class="text-success" />}
                        name="group27"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Sector"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
                        name="group27"
                        inline
                      ></Form.Check>
                      <input type="number" className="form-control" />
                    </div>
                  </Col>

                  <Col md={4} xxl lg="4">
                    <div>
                      <label>
                        <h6>
                          <b>Consolidation Type</b>
                        </h6>{" "}
                      </label>
                      &nbsp;&nbsp;
                      <Form.Check
                        value="Consolidation Type"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleFill class="text-success" />}
                        name="group28"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Consolidation Type"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
                        name="group28"
                        inline
                      ></Form.Check>
                      <Form.Select type="select" defaultValue="Select">
                        <option>Consolidated</option>
                        <option>Non Consolidated</option>
                      </Form.Select>
                    </div>
                  </Col>
                </Row>
                <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                  <thead>
                    <tr>
                      <th>
                        <b>
                          Killa&nbsp;&nbsp;
                          <Form.Check
                            value="Killa"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group29"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Killa"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group29"
                            inline
                          ></Form.Check>
                        </b>
                      </th>
                      <th>
                        <b>
                          Khewat &nbsp;&nbsp;
                          <Form.Check
                            value="Khewat"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group30"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Khewat"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group30"
                            inline
                          ></Form.Check>
                        </b>
                      </th>
                      <th>
                        <b>
                          Area in Kanal &nbsp;&nbsp;
                          <Form.Check
                            value=" Area in Kanal "
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group31"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value=" Area in Kanal "
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group31"
                            inline
                          ></Form.Check>
                        </b>
                        &nbsp;&nbsp;
                      </th>
                      <th>
                        <b>
                          Area in Marla &nbsp;&nbsp;
                          <Form.Check
                            value="Area in Marla"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group32"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Area in Marla"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group32"
                            inline
                          ></Form.Check>
                        </b>
                        &nbsp;&nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input id="standard-basic" variant="standard" />
                      </td>
                      <td>
                        <input id="standard-basic" variant="standard" />
                      </td>
                      <td>
                        <input id="standard-basic" variant="standard" />
                      </td>
                      <td>
                        <input id="standard-basic" variant="standard" />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <Row className="ml-auto mb-3">
                  <Col md={4} xxl lg="6">
                    <div>
                      <label>
                        <h6>
                          <b>Name of Land Owner</b>
                        </h6>{" "}
                      </label>
                      &nbsp;&nbsp;
                      <Form.Check
                        value="Name of Land Owner"
                        type="radio"
                        id="default-radio"
                        label={<CheckCircleFill class="text-success" />}
                        name="group33"
                        inline
                      ></Form.Check>
                      <Form.Check
                        onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                        value="Name of Land Owner"
                        type="radio"
                        id="default-radio"
                        label={<XCircleFill class="text-danger" />}
                        name="group33"
                        inline
                      ></Form.Check>
                    </div>
                  </Col>
                  <Col md={4} xxl lg="6">
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row className="ml-auto mb-3">
                  <div className="col col-12">
                    <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)">
                      <b>(h)&nbsp;Collaboration agreement&nbsp; </b>&nbsp;&nbsp;
                      <input type="radio" value="Yes" id="Yes" onChange={handleChange} name="Yes" onClick={handleshow1} />
                      &nbsp;&nbsp;
                      <label for="Yes">
                        <h6>
                          <b>Yes</b>
                        </h6>
                      </label>
                      &nbsp;&nbsp;
                      <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow1} />
                      &nbsp;&nbsp;
                      <label for="No">
                        <h6>
                          <b>No</b>
                        </h6>
                      </label>
                    </h6>

                    <Form.Check
                      value="Collaboration agreement"
                      type="radio"
                      id="default-radio"
                      label={<CheckCircleFill class="text-success" />}
                      name="group34"
                      inline
                    ></Form.Check>
                    <Form.Check
                      onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                      value="Collaboration agreement"
                      type="radio"
                      id="default-radio"
                      label={<XCircleFill class="text-danger" />}
                      name="group34"
                      inline
                    ></Form.Check>
                    {showhide1 === "Yes" && (
                      <div className="row ">
                        <div className="col col-4">
                          <label for="parentLicense" className="font-weight-bold">
                            <h6>
                              <b>Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered</b>
                            </h6>
                          </label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group35"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group35"
                            inline
                          ></Form.Check>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="col col-4" style={{ marginTop: 15 }}>
                          <label for="parentLicense" className="font-weight-bold">
                            <h6>
                              <b>Date of registering collaboration agreement</b>
                            </h6>
                          </label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Date of registering collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group36"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Date of registering collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group36"
                            inline
                          ></Form.Check>
                          <input type="date" className="form-control" />
                        </div>
                        <div className="col col-4" style={{ marginTop: 15 }}>
                          <label for="parentLicense" className="font-weight-bold">
                            <h6>
                              <b>Date of validity of collaboration agreement</b>
                            </h6>
                          </label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Date of validity of collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group37"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Date of validity of collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group37"
                            inline
                          ></Form.Check>
                          <input type="date" className="form-control" />
                        </div>
                        <div className="col col-4" style={{ marginTop: 35 }}>
                          <label for="parentLicense" className="font-weight-bold">
                            <h6>
                              <b>Whether collaboration agreement irrevocable (Yes/No)</b>
                            </h6>
                          </label>
                          <br></br>
                          <input type="radio" value="Yes" id="Yes1" onChange={handleChange} name="Yes" />
                          &nbsp;&nbsp;
                          <label for="Yes">
                            <h6>Yes</h6>
                          </label>
                          &nbsp;&nbsp;
                          <input type="radio" value="No" id="No1" onChange={handleChange} name="Yes" />
                          &nbsp;&nbsp;
                          <label for="No">
                            <h6>No</h6>
                          </label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Whether collaboration agreement irrevocable"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group38"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Whether collaboration agreement irrevocable"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group38"
                            inline
                          ></Form.Check>
                        </div>

                        <div className="col col-4" style={{ marginTop: 35 }}>
                          <label for="parentLicense" className="font-weight-bold">
                            <h6>
                              <b>Name of authorized signatory on behalf of land owner(s)</b>
                            </h6>
                          </label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Name of authorized signatory on behalf of land owner(s)"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group39"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Name of authorized signatory on behalf of land owner(s)"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group39"
                            inline
                          ></Form.Check>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="col col-4" style={{ marginTop: 15 }}>
                          <label for="parentLicense" className="font-weight-bold">
                            <h6>
                              <b>Name of authorized signatory on behalf of developer to sign Collaboration agreement</b>
                            </h6>
                          </label>
                          &nbsp;&nbsp;
                          <Form.Check
                            value="Name of authorized signatory on behalf of developer to sign Collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group40"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Name of authorized signatory on behalf of developer to sign Collaboration agreement"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group40"
                            inline
                          ></Form.Check>
                          <input type="date" className="form-control" />
                        </div>
                        <div className="col col-4" style={{ marginTop: 20 }}>
                          <label for="parentLicense" className="font-weight-bold">
                            <h6>
                              <b>Registring Authority</b>
                            </h6>
                          </label>
                          <br></br>&nbsp;&nbsp;
                          <Form.Check
                            value="Registring Authority"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group41"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Registring Authority"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group41"
                            inline
                          ></Form.Check>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="col col-4" style={{ marginTop: 15 }}>
                          <label for="parentLicense" className="font-weight-bold">
                            <h6>
                              <b>Registring Authority document</b>
                            </h6>
                          </label>
                          <br></br>&nbsp;&nbsp;
                          <Form.Check
                            value="Registring Authority document"
                            type="radio"
                            id="default-radio"
                            label={<CheckCircleFill class="text-success" />}
                            name="group42"
                            inline
                          ></Form.Check>
                          <Form.Check
                            onChange={(e) => setUncheckedVlue((prev) => [...prev, e.target.value])}
                            value="Registring Authority document"
                            type="radio"
                            id="default-radio"
                            label={<XCircleFill class="text-danger" />}
                            name="group42"
                            inline
                          ></Form.Check>
                          <input type="file" className="form-control" />
                        </div>
                      </div>
                    )}
                  </div>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary">Submit</Button>
              </Modal.Footer>
            </Modal>
          </div>

          {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div> */}
        </div>
        <br></br>

        <div className="applt" style={{ overflow: "auto" }}>
          <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))", overflow: "auto" }}>
            <thead>
              <tr>
                <th>Tehsil</th>
                <th>Revenue estate</th>
                <th>Rectangle No.</th>
                <th>Killa</th>
                <th>Land owner</th>
                <th>Consolidation Type</th>
                <th>Kanal</th>
                <th>Marla</th>
                <th>Sarsai</th>
                <th>Bigha</th>
                <th>Biswa</th>
                <th>Biswansi</th>
                <th>Area &nbsp;&nbsp;</th>
                <th>
                  {" "}
                  <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)">
                    <b>
                      Collaboration agreement&nbsp;&nbsp;
                      {/* <InfoIcon style={{color:"blue"}}/>  */}
                    </b>
                    &nbsp;&nbsp;
                  </h6>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" className="form-control" disabled />
                </td>
                <td>
                  <input type="text" className="form-control" disabled />
                </td>
                <td>
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  {" "}
                  <input type="text" className="form-control" disabled />{" "}
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  <input type="text" className="form-control" disabled />
                </td>
                <td class="text-center">
                  {" "}
                  <input type="text" className="form-control" disabled />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Form.Group>
      <br></br>
      <div style={{ position: "relative", marginBottom: 40 }}>
        <Button
          onClick={() => {
            props.passUncheckedList({ data: uncheckedValue, purpose: purpose });
          }}
        >
          Submit
        </Button>
      </div>
      <hr></hr>
    </Form>
  );
};

export default Genarelinfo;
