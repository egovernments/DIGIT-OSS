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
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";

const Release = (props) => {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);
  const apiResponse = props.apiResponse;

  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code);
  const showRemarks = userRoles.includes("AO_HQ");

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

  const Release = (data) => console.log(data);

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
    releaseBankGuarantee: Colors.info,
    bgNumber: Colors.info,
    typeOfBg: Colors.info,
    uploadBg: Colors.info,
    fullCertificate: Colors.info,
    tcpSubmissionReceived: Colors.info,
    partialCertificate: Colors.info,
  });

  const fieldIdList = [
    { label: " Do you want to Replace B.G.?", key: "releaseBankGuarantee" },
    { label: "Enter Bank Guarantee No.", key: "bgNumber" },
    { label: "Type of B.G.", key: "typeOfBg" },
    { label: " Upload New B.G. softcopy ", key: "uploadBg" },
    { label: "Full Completion Certificate.", key: "fullCertificate" },
    { label: " Amount", key: "tcpSubmissionReceived" },
    { label: "Partial Completion Certificate.", key: "partialCertificate" },
  ];
  const item = props.ApiResponseData;
  console.log("digit2...........", apiResponse);
  return (
    <form onSubmit={handleSubmit(Release)}>
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
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - Release
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card
          // style={{ width: "126%", border: "5px solid #1266af" }}
          >
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Release of Bank Guarantee</h4>
            <div className="card">
              <Row className="col-12">
                <Col md={4} xxl lg="4">
                  <div>
                    <h6>
                      Do you want to Replace B.G.?
                      <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="releaseBankGuarantee">
                        <input
                          {...register("releaseBankGuarantee")}
                          type="radio"
                          checked={apiResponse?.releaseBankGuarantee === "Y" ? true : false}
                          id="releaseBankGuarantee"
                          onClick={() => setmodal1(true)}
                          disabled
                        />
                        &nbsp; Yes &nbsp;&nbsp;
                      </label>
                      <label htmlFor="releaseBankGuarantee">
                        <input
                          {...register("releaseBankGuarantee")}
                          type="radio"
                          checked={apiResponse?.releaseBankGuarantee === "N" ? true : false}
                          disabled
                          id="releaseBankGuarantee"
                        />
                        &nbsp; No &nbsp;&nbsp;
                      </label>
                      <div className={classes.fieldContainer}>
                        {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.licenseApplied} disabled></Form.Control> */}

                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.releaseBankGuarantee,
                            display: showRemarks ? "block" : "none",
                          }}
                          onClick={() => {
                            setOpennedModal("releaseBankGuarantee");
                            setLabelValue(" Do you want to Replace B.G.?"),
                              setSmShow(true),
                              console.log("modal open"),
                              setFieldValue(releaseBankGuarantee);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </h6>
                  </div>
                </Col>
                <Col md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>Enter Bank Guarantee No. </h2>
                    </Form.Label>
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.bgNumber} disabled></Form.Control>
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.bgNumber,
                        display: showRemarks ? "block" : "none",
                      }}
                      onClick={() => {
                        setOpennedModal("bgNumber");
                        setLabelValue("Enter Bank Guarantee No."), setSmShow(true), console.log("modal open"), setFieldValue(bgNumber);
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
                  {/* <input type="text" className="form-control" placeholder="" {...register("bgNumber")} /> */}
                </Col>
                <Col md={4} xxl lg="4">
                  <div>
                    <Form.Label>
                      <h2>Type of B.G. </h2>
                    </Form.Label>
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.typeOfBg} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.typeOfBg,
                        display: showRemarks ? "block" : "none",
                      }}
                      onClick={() => {
                        setOpennedModal("typeOfBg");
                        setLabelValue("Type of B.G"), setSmShow(true), console.log("modal open"), setFieldValue(typeOfBg);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  {/* <select className="form-control" placeholder="" {...register("typeOfBg")}>
                    <option value="1"> IDW</option>
                    <option value="2">EDC</option>
                  </select> */}
                </Col>
                <div className="row">
                  <div className="col col-12 ">
                    {watch("releaseBankGuarantee") === "Y" && (
                      <div className="row ">
                        <div className="col col-4">
                          <label>
                            <h2>
                              Upload New B.G. softcopy
                              <span style={{ color: "red" }}>*</span>
                            </h2>
                          </label>
                          <div>
                            <div>
                              <IconButton onClick={() => getDocShareholding(apiResponse?.uploadBg)}>
                                <DownloadForOfflineIcon color="primary" className="mx-1" />
                              </IconButton>
                            </div>

                            <div className={classes.fieldContainer}>
                              {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.licenseApplied} disabled></Form.Control> */}

                              <ReportProblemIcon
                                style={{
                                  color: fieldIconColors.uploadBg,
                                  display: showRemarks ? "block" : "none",
                                }}
                                onClick={() => {
                                  setOpennedModal("uploadBg");
                                  setLabelValue(" Upload B.G. softcopy"), setSmShow(true), console.log("modal open"), setFieldValue(uploadBg);
                                }}
                              ></ReportProblemIcon>
                            </div>
                          </div>
                          {/* <div>
                            <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")} />
                          </div> */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col col-12 ">
                    {watch("releaseBankGuarantee") === "N" && (
                      <div className="row ">
                        {/* <Col md={4} xxl lg="3">
                        <div>
                          <Form.Label>
                            <h2>Enter B.G. No. </h2>
                          </Form.Label>
                        </div>
                        <input type="text" className="form-control" placeholder="" {...register("bgNo")} />
                      </Col> */}
                        {/* <Col md={4} xxl lg="3">
                      <div>
                        <Form.Label>
                          <h2>Type of B.G. </h2>
                        </Form.Label>
                      </div>
                      <select className="form-control" placeholder="" {...register("typesOfBg")}>
                        <option value="1"> IDW</option>
                        <option value="2">EDC</option>
                      </select>
                    </Col> */}
                        {watch("typeOfBg") === "1" && (
                          <div>
                            <div className="row">
                              <div className="col col-4">
                                <label>
                                  <h2>
                                    Full Completion Certificate.
                                    <span style={{ color: "red" }}>*</span>
                                  </h2>
                                </label>
                                <div>
                                  <div>
                                    <IconButton onClick={() => getDocShareholding(apiResponse?.fullCertificate)}>
                                      <DownloadForOfflineIcon color="primary" className="mx-1" />
                                    </IconButton>
                                  </div>

                                  <div className={classes.fieldContainer}>
                                    {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.licenseApplied} disabled></Form.Control> */}

                                    <ReportProblemIcon
                                      style={{
                                        color: fieldIconColors.fullCertificate,
                                        display: showRemarks ? "block" : "none",
                                      }}
                                      onClick={() => {
                                        setOpennedModal("fullCertificate");
                                        setLabelValue("Full Completion Certificate."),
                                          setSmShow(true),
                                          console.log("modal open"),
                                          setFieldValue(fullCertificate);
                                      }}
                                    ></ReportProblemIcon>
                                  </div>
                                </div>
                                {/* <div>
                                  <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => getDocumentData(e?.target?.files[0], "fullCertificate")}
                                  />
                                </div> */}
                              </div>
                            </div>
                          </div>
                        )}
                        {watch("typeOfBg") === "2" && (
                          <div>
                            <div className="row">
                              <div className="col col-4">
                                <label>
                                  <h2>
                                    Amount.
                                    <span style={{ color: "red" }}>*</span>
                                  </h2>
                                </label>
                                <div className={classes.fieldContainer}>
                                  <Form.Control
                                    className={classes.formControl}
                                    placeholder={apiResponse?.tcpSubmissionReceived}
                                    disabled
                                  ></Form.Control>

                                  <ReportProblemIcon
                                    style={{
                                      color: fieldIconColors.tcpSubmissionReceived,
                                      display: showRemarks ? "block" : "none",
                                    }}
                                    onClick={() => {
                                      setOpennedModal("tcpSubmissionReceived");
                                      setLabelValue(" Amount"), setSmShow(true), console.log("modal open"), setFieldValue(tcpSubmissionReceived);
                                    }}
                                  ></ReportProblemIcon>
                                </div>
                                {/* <div>
                                  <input type="text" className="form-control" placeholder="" {...register("tcpSubmissionReceived")} />
                                </div> */}

                                <h3 className="error-message" style={{ color: "red" }}>
                                  {errors?.tcpSubmissionReceived && errors?.tcpSubmissionReceived?.message}
                                </h3>
                              </div>
                              <div className="col col-4">
                                <label>
                                  <h2>
                                    Partial Completion Certificate.
                                    <span style={{ color: "red" }}>*</span>
                                  </h2>
                                </label>
                                <div>
                                  <div>
                                    <IconButton onClick={() => getDocShareholding(apiResponse?.partialCertificate)}>
                                      <DownloadForOfflineIcon color="primary" className="mx-1" />
                                    </IconButton>
                                  </div>

                                  <div className={classes.fieldContainer}>
                                    {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.licenseApplied} disabled></Form.Control> */}

                                    <ReportProblemIcon
                                      style={{
                                        color: fieldIconColors.partialCertificate,
                                        display: showRemarks ? "block" : "none",
                                      }}
                                      onClick={() => {
                                        setOpennedModal("partialCertificate");
                                        setLabelValue("Partial Completion Certificate."),
                                          setSmShow(true),
                                          console.log("modal open"),
                                          setFieldValue(partialCertificate);
                                      }}
                                    ></ReportProblemIcon>
                                  </div>
                                </div>
                                {/* <div>
                                  <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => getDocumentData(e?.target?.files[0], "partialCertificate")}
                                  />
                                </div> */}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Row>
            </div>
          </Card>
        </div>
      </Collapse>
    </form>
  );
};

export default Release;
