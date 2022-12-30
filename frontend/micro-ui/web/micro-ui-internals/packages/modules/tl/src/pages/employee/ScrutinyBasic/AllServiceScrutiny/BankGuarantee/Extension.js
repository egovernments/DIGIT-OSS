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
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

function Extension() {
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
    watch,
    setValue,
  } = useForm({});

  const Extension = (data) => console.log(data);

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
    <form onSubmit={handleSubmit(Extension)}>
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
          Extension
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension </h4>
            <div className="card">
              <Row className="col-12">
                <Form.Group as={Col} controlId="formGridLicence">
                  <Form.Label>
                    <h2>Enter Licence No.</h2>{" "}
                  </Form.Label>

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
                  {/* <input type="text" className="form-control" placeholder="" {...register("enterLoiNumber")} /> */}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Amount (in fig)</h2>
                    </Form.Label>
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
                  {/* <input type="text" className="form-control" placeholder="" {...register("amountInFig")} /> */}
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Amount (in words)</h2>
                    </Form.Label>
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
                  {/* <input type="text" className="form-control" placeholder="" {...register("amountInWords")} /> */}
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Validity Date </h2>
                    </Form.Label>
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
                  {/* <input type="date" className="form-control" placeholder="" {...register("validity")} /> */}
                </Form.Group>
              </Row>
              <Row className="col-12">
                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Extended time</h2>
                    </Form.Label>
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
                  {/* <select className="form-control" {...register("typeOfBg")}>
                    <option> IDW</option>
                    <option>EDC</option>
                  </select> */}
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Bank Name </h2>
                    </Form.Label>
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
                  {/* <input type="text" className="form-control" placeholder="" {...register("bankName")} /> */}
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Enter Memo No. </h2>
                    </Form.Label>
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
                  {/* <input type="text" className="form-control" placeholder="" {...register("enterMemoNumber")} /> */}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Upload B.G. </h2>
                    </Form.Label>
                  </div>
                  <div className="row">
                    <div className="btn btn-sm col-md-3">
                      <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                    </div>
                    <div className="btn btn-sm col-md-3">
                      <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                        <FileDownloadIcon color="info" className="icon" />
                      </IconButton>
                    </div>
                    <div className="btn btn-sm col-md-4">
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
                  </div>
                  {/* <input type="file" className="form-control" placeholder="" {...register("uploadBg")} /> */}
                </Form.Group>
              </Row>
              <div className="row">
                <div className="col col-12 ">
                  <div>
                    <div className="form-check">
                      <label>
                        Hardcopy Submitted at TCP office.{" "}
                        <label htmlFor="licenseApplied">
                          <input {...register("licenseApplied")} type="radio" value="Y" id="licenseApplied" disabled />
                          &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="licenseApplied">
                          <input
                            {...register("licenseApplied")}
                            type="radio"
                            value="N"
                            id="licenseApplied"
                            className="btn btn-primary"
                            onClick={() => setmodal1(true)}
                            disabled
                          />
                          &nbsp; No &nbsp;&nbsp;
                        </label>
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
                        <h3 className="error-message" style={{ color: "red" }}>
                          {errors?.licenseApplied && errors?.licenseApplied?.message}
                        </h3>
                      </label>
                    </div>
                  </div>

                  {watch("licenseApplied") === "Y" && (
                    <div>
                      <div className="row">
                        <div className="col col-4">
                          <label>
                            <h2>
                              Upload Receipt of Submission.
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <div>
                            <div className="row">
                              <div className="btn btn-sm col-md-4">
                                <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                  <VisibilityIcon color="info" className="icon" />
                                </IconButton>
                              </div>
                              <div className="btn btn-sm col-md-4">
                                <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                  <FileDownloadIcon color="info" className="icon" />
                                </IconButton>
                              </div>
                              <div className="btn btn-sm col-md-4">
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
                            </div>
                            {/* <input
                              type="file"
                              className="form-control"
                              required
                              onChange={(e) => getDocumentData(e?.target?.files[0], "consentLetter")}
                            /> */}
                          </div>

                          <h3 className="error-message" style={{ color: "red" }}>
                            {errors?.consentLetter && errors?.consentLetter?.message}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                  {watch("licenseApplied") === "N" && (
                    <div>
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
                          <h2> Submit Hardcopy of B.G. at TCP office.</h2>
                        </ModalBody>
                        <ModalFooter toggle={() => setmodal(!modal1)}></ModalFooter>
                      </Modal>
                    </div>
                  )}
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12 text-right">
                  <button type="submit" id="btnClear" class="btn btn-primary btn-md center-block" style={{ marginBottom: "-44px" }}>
                    Submit
                  </button>
                </div>
                <div class="row">
                  <div class="col-sm-12 text-right">
                    <button id="btnSearch" class="btn btn-danger btn-md center-block" style={{ marginRight: "66px", marginTop: "-6px" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Collapse>
    </form>
  );
}

export default Extension;
