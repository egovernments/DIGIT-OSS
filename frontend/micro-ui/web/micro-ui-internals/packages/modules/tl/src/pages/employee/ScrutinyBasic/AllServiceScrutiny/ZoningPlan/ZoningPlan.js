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
function ZoningPlan() {
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
    <form onSubmit={handleSubmit(ZoningPlan)}>
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
          Approval of demarcation cum zoning plan in CLU
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card
          //  style={{ width: "126%", border: "5px solid #1266af" }}
          >
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of demarcation cum zoning plan in CLU</h4>
            <div className="card">
              <br></br>
              <Row>
                <Col className="col-4">
                  <label>
                    {" "}
                    License No . <span style={{ color: "red" }}>*</span>
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

                  {/* <input type="number" className="form-control" {...register("LicenseNo")} /> */}
                </Col>

                <Col className="col-4">
                  <label>
                    {" "}
                    Case Number . <span style={{ color: "red" }}>*</span>
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
                  {/* <input type="number" name="Case Number" className="form-control" {...register("Case Number")} /> */}
                </Col>
                <Col className="col-4">
                  <label>
                    Layout Plan <span style={{ color: "red" }}>*</span>
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
                  {/* <input type="text" className="form-control" {...register("Layout Plan")} /> */}
                </Col>
                <br></br>

                <Col className="col-4">
                  <label>
                    {" "}
                    Any other Document <span style={{ color: "red" }}>*</span>
                  </label>{" "}
                  <div className="row">
                    <div className="btn btn-sm col-md-2">
                      <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                        <VisibilityIcon color="info" className="icon" />
                      </IconButton>
                    </div>
                    <div className="btn btn-sm col-md-2">
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
                  {/* <input type="file" className="form-control" {...register("Any other Document")} /> */}
                </Col>

                <Col className="col-4">
                  <label>
                    {" "}
                    Amount <span style={{ color: "red" }}>*</span>
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
                  {/* <input type="number" name="Amount" className="form-control" {...register("Amount")} /> */}
                </Col>
                <Col className="col-4">
                  <div className="col-4">
                    <Button variant="success" className="col my-5" type="submit" aria-label="right-end">
                      Pay{" "}
                    </Button>
                  </div>
                </Col>
              </Row>
              <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Submit
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Collapse>
    </form>
  );
}
export default ZoningPlan;
