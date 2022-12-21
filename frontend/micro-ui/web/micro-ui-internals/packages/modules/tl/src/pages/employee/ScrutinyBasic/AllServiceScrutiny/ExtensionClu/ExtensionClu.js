import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Collapse from "react-bootstrap/Collapse";
import ModalChild from "../../Remarks/ModalChild";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Colors = {
  approved: "#09cb3d",
  disapproved: "#ff0000",
  info: "#FFB602",
};

function ExtensionClu() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({});

  const extensionClu = (data) => console.log(data);
  const [open2, setOpen2] = useState(false);
  const [openedModal, setOpennedModal] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [fieldValue, setFieldValue] = useState("");
  const [selectedFieldData, setSelectedFieldData] = useState();
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

  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
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

  return (
    <form onSubmit={handleSubmit(extensionClu)}>
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
          Extension of CLU permission
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension of CLU permission</h4>
            <div className="card">
              <Row className="col-12">
                <Form.Group as={Col} controlId="formGridCase">
                  <Form.Label>
                    <h2>
                      Case No.<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="number" className="form-control" placeholder="" {...register("caseNo")} disabled />
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
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Application Number <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="number" className="form-control" placeholder="" {...register("applicationNo")} disabled />
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
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Nature (land Use) Purpose <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="text" className="form-control" placeholder="" {...register("naturePurpose")} disabled />
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
                    />
                  </div>
                </Form.Group>
              </Row>
              <Row className="col-12">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Total Area in Sq. meter. <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="number" className="form-control" placeholder="" {...register("totalAreaSq")} disabled />
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
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Date Of CLU
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="Date" className="form-control" placeholder="" {...register("cluDate")} disabled />
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
                    />
                  </div>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Date of Expiry of CLU
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="Date" className="form-control" placeholder="" {...register("expiryClu")} disabled />
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
                    />
                  </div>
                </Form.Group>
              </Row>
              <Row className="col-12">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Stage of construction <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="text" className="form-control" placeholder="" {...register("stageConstruction")} disabled />
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
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Name of applicantName
                      <span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="text" className="form-control" placeholder="" {...register("applicantName")} disabled />
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
                    />
                  </div>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Mobile
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="number" className="form-control" placeholder="" {...register("mobile")} disabled />
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
                    />
                  </div>
                </Form.Group>
              </Row>
              <Row className="col-12">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Email-Address <span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="email" className="form-control" placeholder="" {...register("emailAddress")} disabled />
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
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Address
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="text" className="form-control" placeholder="" {...register("address")} disabled />
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
                    />
                  </div>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Village <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="text" className="form-control" placeholder="" {...register("village")} disabled />
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
                    />
                  </div>
                </Form.Group>
              </Row>
              <Row className="col-12">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Tehsil
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="text" className="form-control" placeholder="" {...register("tehsil")} disabled />
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
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Pin code
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="number" className="form-control" placeholder="" {...register("pinCode")} disabled />
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
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      Reason for Delay
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div style={{ display: "flex" }}>
                    <input type="textarea" className="form-control" placeholder="" {...register("reasonDelay")} disabled />
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
                    />
                  </div>
                </Form.Group>
              </Row>
              <br></br>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Sr.No</th>
                    <th style={{ textAlign: "center" }}>Field Name</th>
                    <th style={{ textAlign: "center" }}>Upload Documents</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>
                      Upload BR-III<span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" placeholder="" className="form-control" {...register("reasonRevision")}></input> */}
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
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>
                      {" "}
                      Upload photographs of building under construction showing the status of construction at the site{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("uploadPhotographs")}></input> */}
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
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>
                      {" "}
                      Receipt of application if any submitted for taking occupation certificate <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("receiptApplication")}></input> */}
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
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>
                      {" "}
                      Upload approved Building Plan <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("uploadBuildingPlan")}></input> */}
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
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>
                      {" "}
                      Indemnity Bond <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("indemnityBond")}></input> */}
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
                              setOpennedModal("Licence No");
                              setLabelValue("Licence No"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                            }}
                          ></ReportProblemIcon>
                          {/* <input type="file" className="form-control" placeholder="" {...register("uploadbrIII")}></input> */}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </div>
              <div class="row">
                <div class="col-sm-12 text-right">
                  <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                    Submit
                  </button>
                </div>
                <div class="col-sm-12 text-right">
                  <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Collapse>
      <ModalChild
        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        onClose={() => setSmShow(false)}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
      />
    </form>
  );
}

export default ExtensionClu;
