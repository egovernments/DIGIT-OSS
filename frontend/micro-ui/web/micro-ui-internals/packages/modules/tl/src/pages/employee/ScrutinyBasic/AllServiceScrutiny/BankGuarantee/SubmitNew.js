import React, { useState, useEffect } from "react";
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

const SubmitNew = (props) => {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);
  const dataIcons = props.dataForIcons;
  const apiResponse = props.apiResponse;
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code);
  const showRemarks = userRoles.includes("AO_HQ");
  const landScheduleData = props.ApiResponseData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const SubmitNew = (data) => console.log(data);
  const item = props.ApiResponseData;
  const classes = useStyles();
  // const currentRemarks = (data) => {
  //   props.showTable({ data: data.data });
  // };

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    conditional: "#2874A6",
    info: "#FFB602",
  };

  // const handlemodaldData = (data) => {

  //   setSmShow(false);
  //   console.log("here", openedModal, data);
  //   if (openedModal && data) {
  //     setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
  //   }
  //   setOpennedModal("");
  //   setLabelValue("");
  // };
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");
  const [fieldIconColors, setFieldIconColors] = useState({
    loiNumber: Colors.info,
    typeOfBg: Colors.info,
    amountInFig: Colors.info,
    amountInWords: Colors.info,
    bgNumber: Colors.info,
    bankName: Colors.info,
    validity: Colors.info,
    claimPeriod: Colors.info,
    originCountry: Colors.info,
    indianBankAdvisedCertificate: Colors.info,
    uploadBg: Colors.info,
    licenseApplied: Colors.info,
    tcpSubmissionReceived: Colors.info,
    existingBgNumber: Colors.info,
  });

  const fieldIdList = [
    { label: "Enter LOI No", key: "loiNumber" },
    { label: "Type of B.G", key: "typeOfBg" },
    { label: "Amount (in fig)", key: "amountInFig" },
    { label: "Amount (in words) ", key: "amountInWords" },
    { label: "Enter Bank Guarantee No.", key: "bgNumber" },
    { label: "Enter Bank Name", key: "bankName" },
    { label: "Expiry Date", key: "validity" },
    { label: "Claim Period", key: "claimPeriod" },
    { label: "Country of origin", key: "originCountry" },
    { label: "Upload Bank Advice Certificate.", key: "indianBankAdvisedCertificate" },
    { label: "Upload B.G. softcopy", key: "uploadBg" },
    { label: "Hardcopy Submitted at TCP office.", key: "licenseApplied" },
    { label: "Upload Receipt of Submission.", key: "tcpSubmissionReceived" },
    { label: "Existing B.G. No.", key: "existingBgNumber" },
  ];

  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === item.label);
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = {
            ...tempFieldColorState,
            [item.key]:
              fieldPresent[0].isApproved === "approved"
                ? Colors.approved
                : fieldPresent[0].isApproved === "disapproved"
                ? Colors.disapproved
                : fieldPresent[0].isApproved === "conditional"
                ? Colors.conditional
                : Colors.info,
          };
        }
      }
    });

    setFieldIconColors(tempFieldColorState);
  };

  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...");
  }, [dataIcons]);

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === labelValue);
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue]);

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
  console.log("remarks", dataIcons);

  console.log("digit2", apiResponse);
  return (
    <form onSubmit={handleSubmit(SubmitNew)}>
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
          - Submission
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Bank Guarantee Submission </h4>
            <div className="card">
              <Row className="col-12">
                <Form.Group as={Col} controlId="formGridLicence">
                  <Form.Label>
                    <h2>Enter LOI No.</h2>{" "}
                  </Form.Label>

                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.loiNumber} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.loiNumber,
                        display: showRemarks ? "block" : "none",
                      }}
                      onClick={() => {
                        setOpennedModal("loiNumber");
                        setLabelValue("Enter LOI No"), setSmShow(true), console.log("modal open"), setFieldValue(loiNumber);
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
                  {/* <input type="text" className="form-control" placeholder="" {...register("enter")} /> */}
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Type of B.G</h2>
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
                  {/* <select className="form-control" {...register("typeOfBg")}>
                    <option> IDW</option>
                    <option>EDC</option>
                  </select> */}
                </Form.Group>
                <Form.Group as={Col} controlId="formGridLicence">
                  <div>
                    <Form.Label>
                      <h2>Amount (in fig)</h2>
                    </Form.Label>
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.amountInFig} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.amountInFig,
                        display: showRemarks ? "block" : "none",
                      }}
                      onClick={() => {
                        setOpennedModal("amountInFig");
                        setLabelValue("Amount (in fig)"), setSmShow(true), console.log("modal open"), setFieldValue(amountInFig);
                      }}
                    ></ReportProblemIcon>
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
                    <Form.Control className={classes.formControl} placeholder={apiResponse?.amountInWords} disabled></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.amountInWords,
                        display: showRemarks ? "block" : "none",
                      }}
                      onClick={() => {
                        setOpennedModal("amountInWords");
                        setLabelValue("Amount (in words)"), setSmShow(true), console.log("modal open"), setFieldValue(amountInWords);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  {/* <input type="text" className="form-control" placeholder="" {...register("amountInWords")} /> */}
                </Form.Group>
              </Row>
              <br></br>
              <Row className="col-12">
                <Col md={4} xxl lg="3">
                  <label htmlFor="bankGuarantee">
                    <input
                      {...register("bankGuarantee")}
                      type="radio"
                      name="bankGuarantee"
                      id="bankGuarantee1"
                      value="1"
                      onChange={(e) => handleshowhide(e)}
                    />
                    &nbsp; Bank Gurantee &nbsp;&nbsp;
                  </label>
                  <label htmlFor="bankGuarantee">
                    <input
                      {...register("bankGuarantee")}
                      type="radio"
                      name="bankGuarantee"
                      id="bankGuarantee2"
                      value="2"
                      onChange={(e) => handleshowhide(e)}
                    />
                    &nbsp; Mortgage &nbsp;&nbsp;
                  </label>
                  <div className={classes.fieldContainer}>
                    {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.bgNumber} disabled></Form.Control> */}

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
                  </div>
                </Col>
              </Row>
              <Row className="col-12">
                <Col md={4} xxl lg="12">
                  {landScheduleData?.bankGuarantee === "1" && (
                    <div>
                      <Row className="col-12">
                        <Col md={4} xxl lg="3">
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
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("bgNumber")} /> */}
                        </Col>
                        <Col md={4} xxl lg="3">
                          <div>
                            <Form.Label>
                              <h2>Enter Bank Name </h2>
                            </Form.Label>
                          </div>
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.bankName} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.bankName,
                                display: showRemarks ? "block" : "none",
                              }}
                              onClick={() => {
                                setOpennedModal("bankName");
                                setLabelValue("Enter Bank Name"), setSmShow(true), console.log("modal open"), setFieldValue(bankName);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("bankName")} /> */}
                        </Col>

                        <Col md={4} xxl lg="3">
                          <div>
                            <Form.Label>
                              <h2>Expiry Date </h2>
                            </Form.Label>
                          </div>
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.validity} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.validity,
                                display: showRemarks ? "block" : "none",
                              }}
                              onClick={() => {
                                setOpennedModal("validity");
                                setLabelValue("Expiry Date"), setSmShow(true), console.log("modal open"), setFieldValue(validity);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="datepicker" className="form-control" placeholder="" {...register("expiryDate")} format="yyyy-MM-dd" /> */}
                        </Col>
                        <Col md={4} xxl lg="3">
                          <div>
                            <Form.Label>
                              <h2>Claim Period</h2>
                            </Form.Label>
                          </div>
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.claimPeriod} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.claimPeriod,
                                display: showRemarks ? "block" : "none",
                              }}
                              onClick={() => {
                                setOpennedModal("claimPeriod");
                                setLabelValue("Claim Period"), setSmShow(true), console.log("modal open"), setFieldValue(claimPeriod);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <select className="form-control" placeholder="" {...register("claimPeriod")}>
                    <option> 0</option>
                    <option>1</option>
                    <option> 2</option>
                    <option>3</option>
                    <option> 4</option>
                    <option>5</option>
                    <option> 6</option>
                    <option>7</option>
                    <option> 8</option>
                    <option>9</option>
                    <option> 10</option>
                    <option>11</option>
                    <option> 12</option>
                  </select> */}
                        </Col>
                      </Row>
                      <Row className="col-12">
                        <Col md={4} xxl lg="3">
                          <div>
                            <Form.Label>
                              <h2>Country of origin</h2>
                            </Form.Label>
                          </div>
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.originCountry} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.originCountry,
                                display: showRemarks ? "block" : "none",
                              }}
                              onClick={() => {
                                setOpennedModal("originCountry");
                                setLabelValue("Country of origin"), setSmShow(true), console.log("modal open"), setFieldValue(originCountry);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <select className="form-control" placeholder="" {...register("countryOrigin")}>
                   <option>------</option>
                   <option value="1"> Indian</option>
                   <option value="2">Foreign</option>
                 </select> */}
                          {apiResponse?.originCountry === "2" && (
                            <div>
                              <div className="row">
                                <div className="col col-12">
                                  <p>In case of B.G. from other country, you need to upload Indian Bank Advice Certificate.</p>
                                </div>
                                <div className="col col-12">
                                  <label>
                                    <h2>
                                      Upload Bank Advice Certificate.
                                      <span style={{ color: "red" }}>*</span>
                                    </h2>
                                  </label>
                                  <div>
                                    <IconButton onClick={() => getDocShareholding(apiResponse?.indianBankAdvisedCertificate)}>
                                      <DownloadForOfflineIcon color="primary" className="mx-1" />
                                    </IconButton>
                                  </div>

                                  <div className={classes.fieldContainer}>
                                    {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.licenseApplied} disabled></Form.Control> */}

                                    <ReportProblemIcon
                                      style={{
                                        color: fieldIconColors.indianBankAdvisedCertificate,
                                        display: showRemarks ? "block" : "none",
                                      }}
                                      onClick={() => {
                                        setOpennedModal("indianBankAdvisedCertificate");
                                        setLabelValue(" Upload B.G. softcopy"),
                                          setSmShow(true),
                                          console.log("modal open"),
                                          setFieldValue(indianBankAdvisedCertificate);
                                      }}
                                    ></ReportProblemIcon>
                                  </div>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.indianBankAdvisedCertificate && errors?.indianBankAdvisedCertificate?.message}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          )}
                        </Col>
                        <Col md={4} xxl lg="3">
                          <div>
                            <Form.Label>
                              <h2>Upload B.G. softcopy</h2>
                            </Form.Label>
                          </div>
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
                          {/* <input type="file" className="form-control" onChange={(e) => getDocumentData(e?.target?.files[0], "uploadBg")} /> */}
                        </Col>
                        <Col md={4} xxl lg="3">
                          <div>
                            <label>Hardcopy Submitted at TCP office. </label>
                            <label htmlFor="licenseApplied">
                              <input
                                {...register("licenseApplied")}
                                type="radio"
                                checked={apiResponse?.licenseApplied === "Y" ? true : false}
                                id="licenseApplied"
                                onClick={() => setmodal1(true)}
                                disabled
                              />
                              &nbsp; Yes &nbsp;&nbsp;
                            </label>
                            <label htmlFor="licenseApplied">
                              <input
                                {...register("licenseApplied")}
                                type="radio"
                                checked={apiResponse?.licenseApplied === "N" ? true : false}
                                id="licenseApplied"
                                className="btn btn-primary"
                                disabled
                              />
                              &nbsp; No &nbsp;&nbsp;
                            </label>
                            {/* <div className={classes.fieldContainer}>
                    

                     <ReportProblemIcon
                       style={{
                         color: fieldIconColors.licenseApplied,
                         display: showRemarks ? "block" : "none",
                       }}
                       onClick={() => {
                         setOpennedModal("licenseApplied");
                         setLabelValue(" Hardcopy Submitted at TCP office."),
                           setSmShow(true),
                           console.log("modal open"),
                           setFieldValue(licenseApplied);
                       }}
                     ></ReportProblemIcon>
                   </div> */}
                            <h3 className="error-message" style={{ color: "red" }}>
                              {errors?.licenseApplied && errors?.licenseApplied?.message}
                            </h3>
                          </div>

                          {apiResponse?.licenseApplied === "Y" && (
                            <div>
                              <div className="row">
                                <div className="col col-12">
                                  <label>
                                    <h2>
                                      Upload Receipt of Submission.
                                      <span style={{ color: "red" }}>*</span>
                                    </h2>
                                  </label>
                                  <div>
                                    <IconButton onClick={() => getDocShareholding(apiResponse?.tcpSubmissionReceived)}>
                                      <DownloadForOfflineIcon color="primary" className="mx-1" />
                                    </IconButton>
                                  </div>
                                  <div className={classes.fieldContainer}>
                                    {/* <Form.Control className={classes.formControl} placeholder={apiResponse?.licenseApplied} disabled></Form.Control> */}

                                    <ReportProblemIcon
                                      style={{
                                        color: fieldIconColors.tcpSubmissionReceived,
                                        display: showRemarks ? "block" : "none",
                                      }}
                                      onClick={() => {
                                        setOpennedModal("tcpSubmissionReceived");
                                        setLabelValue(" Upload Receipt of Submission."),
                                          setSmShow(true),
                                          console.log("modal open"),
                                          setFieldValue(tcpSubmissionReceived);
                                      }}
                                    ></ReportProblemIcon>
                                  </div>

                                  <h3 className="error-message" style={{ color: "red" }}>
                                    {errors?.tcpSubmissionReceived && errors?.tcpSubmissionReceived?.message}
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
                        </Col>
                      </Row>
                      <Row className="col-12">
                        <Col md={4} xxl lg="3">
                          <div>
                            <Form.Label>
                              <h2>Existing B.G. No. (In case of Replace, Extend and Renew, Enter B.G. No.)</h2>
                            </Form.Label>
                          </div>
                          <div className={classes.fieldContainer}>
                            <Form.Control className={classes.formControl} placeholder={apiResponse?.existingBgNumber} disabled></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.existingBgNumber,
                                display: showRemarks ? "block" : "none",
                              }}
                              onClick={() => {
                                setOpennedModal("existingBgNumber");
                                setLabelValue("Existing B.G. No."), setSmShow(true), console.log("modal open"), setFieldValue(existingBgNumber);
                              }}
                            ></ReportProblemIcon>
                          </div>
                          {/* <input type="text" className="form-control" placeholder="" {...register("existingBgNumber")} /> */}
                        </Col>
                      </Row>
                    </div>
                  )}
                </Col>
              </Row>

              <Row className={classes.formLabel}>
                <Col md={4} xxl lg="12">
                  {landScheduleData?.bankGuarantee === "2" && (
                    <div>
                      <div className="table table-bordered table-responsive">
                        <thead>
                          <tr>
                            <th scope="col">Khasra No</th>
                            <th scope="col">Area to be Mortgaged (in sq meters)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              <NumberInput disabled control={control} name="totalAreaScheme" customInput={TextField} />
                            </th>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              <input type="number" className="form-control" placeholder="" />
                            </th>
                          </tr>
                          <tr>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              <input type="text" className="form-control" placeholder="" disabled />
                            </th>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              <input type="number" className="form-control" placeholder="" />
                            </th>
                          </tr>
                          <tr>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              <h2>Area Total</h2>
                            </th>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              <input type="number" className="form-control" placeholder="" />
                            </th>
                          </tr>
                        </tbody>
                      </div>
                      <h5 className="card-title fw-bold">Enter Plot</h5>
                      <div className="table table-bordered table-responsive">
                        <thead>
                          <tr>
                            <th scope="col">Plot No</th>
                            <th scope="col">Area (in sq meters)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...Array(noOfRows)].map((elementInArray, index) => {
                            return (
                              <tr>
                                <th className="fw-normal" style={{ textAlign: "center" }}>
                                  <input type="text" className="form-control" placeholder="" />
                                </th>
                                <th className="fw-normal" style={{ textAlign: "center" }}>
                                  <input type="number" className="form-control" placeholder="" />
                                </th>
                              </tr>
                            );
                          })}
                        </tbody>
                      </div>
                      <div className="row mx-1">
                        <div className="col col-3 p-1">
                          <h6>Upload layout plan earmarking land to be mortgaged</h6>
                          <div className="d-flex flex-row align-items-center my-1 ">
                            <IconButton onClick={() => getDocShareholding(landScheduleData?.copyOfShajraPlan)}>
                              <DownloadForOfflineIcon color="primary" className="mx-1" />
                            </IconButton>
                            <ReportProblemIcon
                              style={{
                                display: hideRemarks ? "none" : "block",
                                color: fieldIconColors.copyOfShajraPlan,
                              }}
                              onClick={() => {
                                setLabelValue("Copy of Shajra Plan"), setOpennedModal("copyOfShajraPlan");
                                setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(landScheduleData !== null ? landScheduleData?.copyOfShajraPlan : null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </div>
                        <div className="col col-3 p-1">
                          <h6> Mortgage Deed</h6>
                          <div className="d-flex flex-row align-items-center my-1 ">
                            <IconButton onClick={() => getDocShareholding(landScheduleData?.copyOfShajraPlan)}>
                              <DownloadForOfflineIcon color="primary" className="mx-1" />
                            </IconButton>
                            <ReportProblemIcon
                              style={{
                                display: hideRemarks ? "none" : "block",
                                color: fieldIconColors.copyOfShajraPlan,
                              }}
                              onClick={() => {
                                setLabelValue("Copy of Shajra Plan"), setOpennedModal("copyOfShajraPlan");
                                setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(landScheduleData !== null ? landScheduleData?.copyOfShajraPlan : null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </div>
                        <div className="col col-3 p-1">
                          <h6>Land schedule and Plot numbers</h6>
                          <div className="d-flex flex-row align-items-center my-1 ">
                            <IconButton onClick={() => getDocShareholding(landScheduleData?.copyOfShajraPlan)}>
                              <DownloadForOfflineIcon color="primary" className="mx-1" />
                            </IconButton>
                            <ReportProblemIcon
                              style={{
                                display: hideRemarks ? "none" : "block",
                                color: fieldIconColors.copyOfShajraPlan,
                              }}
                              onClick={() => {
                                setLabelValue("Copy of Shajra Plan"), setOpennedModal("copyOfShajraPlan");
                                setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(landScheduleData !== null ? landScheduleData?.copyOfShajraPlan : null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </div>
                      </div>
                      <div className="row mx-1">
                        <div className="col col-12 p-1">
                          <h6>
                            Undertaking Amended/supplementary/addendum mortage deed specifying plots/flats/shops and appropriate licenced land to be
                            mortgaged upon approval of building plans
                          </h6>
                          <div className="d-flex flex-row align-items-center my-1 ">
                            <IconButton onClick={() => getDocShareholding(landScheduleData?.copyOfShajraPlan)}>
                              <DownloadForOfflineIcon color="primary" className="mx-1" />
                            </IconButton>
                            <ReportProblemIcon
                              style={{
                                display: hideRemarks ? "none" : "block",
                                color: fieldIconColors.copyOfShajraPlan,
                              }}
                              onClick={() => {
                                setLabelValue("Copy of Shajra Plan"), setOpennedModal("copyOfShajraPlan");
                                setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(landScheduleData !== null ? landScheduleData?.copyOfShajraPlan : null);
                              }}
                            ></ReportProblemIcon>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      </Collapse>
    </form>
  );
};

export default SubmitNew;
