import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ModalChild from "../../Remarks/ModalChild";
import Collapse from "react-bootstrap/Collapse";
import { useStyles } from "../../css/personalInfoChild.style";
import "../../css/personalInfoChild.style.js";

function Beneficialscrutiny() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const beneficialNew = (data) => console.log(data);

  const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602",
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    }
    setOpennedModal("");
    setLabelValue("");
  };
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");
  const [fieldIconColors, setFieldIconColors] = useState({
    developer: Colors.info,
    authPersonName: Colors.info,
    authMobileNo1: Colors.info,
    authMobileNo2: Colors.info,
    emailId: Colors.info,
    pan: Colors.info,
    address: Colors.info,
    city: Colors.info,
    pin: Colors.info,
    tehsil: Colors.info,
    district: Colors.info,
    state: Colors.info,
    type: Colors.info,
    lciSignedBy: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info,
  });

  const fieldIdList = [
    { label: "Developer", key: "developer" },
    { label: "Authorized Person Name", key: "authPersonName" },
    { label: "Autrhoized Mobile No", key: "authMobileNo1" },
    { label: "Authorized MobileNo. 2 ", key: "authMobileNo2" },
    { label: "Email ID", key: "emailId" },
    { label: "PAN No.", key: "pan" },
    { label: "Address  1", key: "address" },
    { label: "Village/City", key: "city" },
    { label: "Pincode", key: "pin" },
    { label: "Tehsil", key: "tehsil" },
    { label: "District", key: "district" },
    { label: "State", key: "state" },
    { label: "Status (Individual/ Company/ Firm/ LLP etc.)", key: "type" },
    { label: "LC-I signed by", key: "lciSignedBy" },
    { label: "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)", key: "lciNotSigned" },
    { label: "Permanent address in case of individual/ registered office address in case other than individual", key: "parmanentAddress" },
    { label: "Address for communication", key: "addressForCommunication" },
    { label: "Name of the authorized person to sign the application", key: "authPerson" },
    { label: "Email ID for communication", key: "emailForCommunication" },
  ];

  return (
    <form onSubmit={handleSubmit(beneficialNew)}>
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
          CHANGE IN BENEFICIAL INTEREST
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>CHANGE IN BENEFICIAL INTEREST</h4>
            <div className="card">
              <Row className="col-12">
                <Col className="col-4">
                  {/* <Form.Group as={Col} controlId="formGridLicence"> */}
                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>Licence No &nbsp;</h5>
                    </Form.Label>
                    <span className={classes.required}>*</span> &nbsp;&nbsp;
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder="" disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    ></ReportProblemIcon>
                    <ModalChild
                      labelmodal={labelValue}
                      passmodalData={handlemodaldData}
                      displaymodal={smShow}
                      onClose={() => setSmShow(false)}
                      selectedFieldData={selectedFieldData}
                      fieldValue={fieldValue}
                      remarksUpdate={currentRemarks}
                    ></ModalChild>
                  </div>
                  {/* </Form.Group> */}
                </Col>
                <Col className="col-4">
                  {/* <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2>Select Service</h2>
                </Form.Label>
                <select className="form-control" {...register("selectService")} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">(a)Change of Developer</option>
                  <option value="2">(b) Joint Development and/or Marketing rights</option>
                  <option value="3">(c)Change in Share Holding Pattern</option>
                </select>
              </Form.Group> */}
                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>Select Service &nbsp;</h5>
                    </Form.Label>
                    <span className={classes.required}>*</span> &nbsp;&nbsp;
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder="" disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Select Service");
                        setLabelValue("Select Service"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </Col>
                <Col className="col-4">
                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>Amount &nbsp;</h5>
                    </Form.Label>
                    <span className={classes.required}>*</span> &nbsp;&nbsp;
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder="" disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Amount");
                        setLabelValue("Amount"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                      }}
                    ></ReportProblemIcon>
                  </div>

                  {/* <Col className="col-4">
                  <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                    Pay
                  </Button>
                </Col> */}
                </Col>
                <Col className="col-4">
                  <Form.Group as={Col} controlId="formGridArea">
                    <div>
                      {showhide === "2" && (
                        <div>
                          <Form.Label>
                            <h2> Area in Acres</h2>
                          </Form.Label>
                          <input type="number" className="form-control" placeholder="" {...register("areaInAcres")} />
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>
                <div>
                  {showhide === "1" && (
                    // <div className="card">
                    <div className="table table-bordered table-responsive">
                      {/* <caption>List of users</caption> */}
                      <thead>
                        <tr>
                          <th class="fw-normal">Sr.No</th>
                          <th class="fw-normal">Field Name</th>
                          <th class="fw-normal">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th class="fw-normal">1</th>
                          <td>
                            No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for
                            the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                            change/assignmen
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("objectionCertificate")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">2</th>
                          <td> A consent letter from the ‘new entity for the proposed change </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("consentLetter")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">3</th>
                          <td> Justification for such request. </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("justification")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">4</th>
                          <td>
                            {" "}
                            The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                            been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("thirdPartyRights")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">5</th>
                          <td>
                            {" "}
                            Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                            ‘shareholder(s)’ as per prescribed policy parameters for grant of license.
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("fiancialCapacity")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">6</th>
                          <td> An undertaking to pay the balance administrative charges before final approval.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("administrativeCharges")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">7</th>
                          <td> Status of RERA registration of project of non registered,then affidavit to this effect.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("reraRegistration")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">8</th>
                          <td> Board resolution of authorised signatory of “existing developer </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolution")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">9</th>
                          <td>
                            {" "}
                            Board resolution of authorised signatory of “new entity ”<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionNewEntity")}></input>
                          </td>
                        </tr>
                      </tbody>
                    </div>
                    // </div>
                  )}
                </div>
                <div>
                  {showhide === "2" && (
                    // <div className="card">
                    <div className="table table-bordered table-responsive">
                      {/* <caption>List of users</caption> */}
                      <thead>
                        <tr>
                          <th class="fw-normal">Sr.No</th>
                          <th class="fw-normal">Field Name</th>
                          <th class="fw-normal">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th class="fw-normal">1</th>
                          <td>
                            No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for
                            the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                            change/assignment
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("noObjectionCertificate")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">2</th>
                          <td> A consent letter from the ‘new entity for the proposed change. </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("consentLetterProposedChanges")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">3</th>
                          <td> Justification for such request.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("justificationRequest")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">4</th>
                          <td>
                            {" "}
                            The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                            been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("thirdPartyclaimed")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">5</th>
                          <td> Details of the applied area where joint development and /or marketing rights are to be assigned</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("jointDevelopment")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">6</th>
                          <td> An undertaking to pay the balance administrative charges before final approval.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("balanceAministrative")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">7</th>
                          <td> Board resolution of authorised signatory of “existing developer”.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionDeveloper")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">8</th>
                          <td> Board resolution of authorised signatory of “new entity ”</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionEntity")}></input>
                          </td>
                        </tr>
                      </tbody>
                    </div>
                    // </div>
                  )}
                </div>
                <div>
                  {showhide === "3" && (
                    // <div className="card">

                    <div className="table table-bordered table-responsive">
                      {/* <caption>List of users</caption> */}
                      <thead>
                        <tr>
                          <th class="fw-normal">Sr.No</th>
                          <th class="fw-normal">Field Name</th>
                          <th class="fw-normal">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th class="fw-normal">1</th>
                          <td>
                            No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically designated for
                            the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees), to the proposed
                            change/assignment
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("proposedAssigment")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">2</th>
                          <td> Justification for such request </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("justificationRequest")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">3</th>
                          <td>
                            {" "}
                            The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed to have
                            been created in the colony, an affidavit to the said effect be also submitted by the existing developer{" "}
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("creationThirdParty")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">4</th>
                          <td>
                            {" "}
                            Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’ or
                            ‘shareholder(s)’ as per prescribed policy parameters for grant of license
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("technicalAndFinancial")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">5</th>
                          <td> An undertaking to pay the balance administrative charges before final approval </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("administrativeChargesApproval")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">6</th>
                          <td> Proposed Shareholding Pattern of the developer company.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("shareholdingPattern")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">7</th>
                          <td> Status of RERA registration of project of non registered,then affidavit to this effect.</td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("statusOfRera")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">8</th>
                          <td> Board resolution of authorised signatory of “existing developer” </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionAuthorized")}></input>
                          </td>
                        </tr>
                        <tr>
                          <th class="fw-normal">9</th>
                          <td>
                            {" "}
                            Board resolution of authorised signatory of “new entity ”<span style={{ color: "red" }}>*</span>
                          </td>
                          <td>
                            <input type="file" className="fom-control" placeholder="" {...register("boardResolutionSignatory")}></input>
                          </td>
                        </tr>
                      </tbody>
                    </div>

                    // </div>
                  )}
                </div>
              </Row>

              <Row className="justify-content-end">
                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="save" aria-label="right-end">
                  Save as Draft
                </Button>
                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                  Submit
                </Button>
              </Row>
            </div>
          </Card>
        </div>
      </Collapse>
    </form>
  );
}

export default Beneficialscrutiny;
