import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
// import InfoIcon from "@mui/icons-material/Info";

import Collapse from "react-bootstrap/Collapse";

import ModalChild from "../Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyles } from "../css/personalInfoChild.style";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";

const LicenseDetailsScrutiny = (props) => {
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  const [open, setOpen] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")

  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");
  const [color, setColor] = useState({ yes: false, no: false });
  const [labelValue, setLabelValue] = useState("");
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);

  const [fieldIconColors, setFieldIconColors] = useState({
    developerType: Colors.info,
    developerName: Colors.info,
    developerEmail: Colors.info,
    developerMobileNo: Colors.info,
    cinNo: Colors.info,
    companyName: Colors.info,
    dateOfIncorporation: Colors.info,
    regAddress: Colors.info,
    email: Colors.info,
    mobileNo: Colors.info,
    gstNo: Colors.info
  })

  const fieldIdList = [{ label: "Developer's Type", key: "developerType" }, { label: "Developer's Name", key: "developerName" }, { label: "Developer's Email", key: "developerEmail" }, { label: "Developer's Mobile No.", key: "developerMobileNo" }, { label: "CIN No.", key: "cinNo" }, { label: "Company's Name", key: "companyName" }, { label: "Date of Incorporation", key: "dateOfIncorporation" }, { label: "Registered Address", key: "regAddress" }, { label: "Email", key: "email" }, { label: "Mobile No.", key: "mobileNo" }, { label: "GST No.", key: "gstNo" }]

  const addInfo = props.addInfo;
  const iconStates = props.iconColorState;

  const classes = useStyles();

  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (iconStates !== null && iconStates !== undefined) {
        console.log("color method called");
        const fieldPresent = iconStates.egScrutiny.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value1", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved ? Colors.approved : Colors.disapproved }

        }
      }
    })

    setFieldIconColors(tempFieldColorState);

  };


  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...",)
  }, [iconStates])

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = iconStates.egScrutiny.filter(ele => (ele.fieldIdL === labelValue));
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue])


  const handlemodaldData = (data) => {
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved })
    }
    setOpennedModal("");
    setLabelValue("");
  };


  const [showhide9, setShowhide9] = useState("0");
  const handleshow9 = (e) => {
    const getshow = e.target.value;
    setShowhide9(getshow);
  };

  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  // console.log("color for the deeloper", developerInputFiledColor);

  return (
    <Form
      ref={props.licenseDetailsInfoRef}
    // style={{
    //   width: "100%",
    //   height: props.heightPersonal,
    //   overflow: "hidden",
    //   marginBottom: 20,
    //   borderColor: "#C3C3C3",
    //   borderStyle: "solid",
    //   borderWidth: 2,
    // }}
    >
      {/* <Alert variant="warning">{messege}</Alert> */}

      <div
        className="collapse-header"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
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
          - Add Info
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text" style={{ marginTop: 5, paddingLeft: 5, paddingRight: 5 }}>
          <Form.Group style={{ display: props.displayLicenseDetails, margin: 5 }}>
            <div>
              <Card style={{ margin: 2 }}>
                <div className="card-body">
                  <h5 className={[classes.formLabel, "d-flex flex-row align-items-center"]}>Developer's type <div className="d-flex flex-row align-items-center ml-2">
                    <Form.Control
                      className={classes.formControl}
                      placeholder={addInfo?.showDevTypeFields === "01" ? "Individual" : addInfo?.showDevTypeFields === "Company" ? "Company" : addInfo?.showDevTypeFields === "03" ? "LLP" : addInfo?.showDevTypeFields === "04" ? "Society" : ""}
                      disabled
                    ></Form.Control>
                    &nbsp;&nbsp;
                    <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developerType
                      }}
                      onClick={() => {
                        setOpennedModal("developerType")
                        setLabelValue("Developer's type"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(addInfo?.showDevTypeFields || null);
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

                  </div></h5>
                  <div className="row">
                    <div className="col-sm-12">
                      {/* <div className="form-group row"> */}
                      <div className="col-sm-4 p-0 pt-1">
                        {/* <Form.Select
                          type="text"
                          placeholder=""

                          onClick={handleshow9}
                          style={{ maxWidth: 200, marginRight: 5, height: 40 }}

                        >
                          <option value="">--Purpose--</option>
                          <option value="01">Individual</option>
                          <option value="02">Company</option>
                          <option value="03">LLP</option>
                          <option value="04">Society</option>
                        </Form.Select> */}

                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {addInfo?.showDevTypeFields === "01" &&
                <div>
                  <Card style={{ margin: 5 }}>
                    <h5>Developer Details</h5>
                    <Row>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Name &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.developerName : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.developerName
                            }}
                            onClick={() => {
                              setOpennedModal("developerName")
                              setLabelValue("Developer's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.developerName : null);
                            }}
                          ></ReportProblemIcon>



                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.developerEmail : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.developerEmail
                            }}
                            onClick={() => {
                              setOpennedModal("developerEmail")
                              setLabelValue("Developer's Email"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.developerEmail : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.developerMobileNo : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.developerMobileNo
                            }}
                            onClick={() => {
                              setOpennedModal("developerMobileNo")
                              setLabelValue("Developer's Mobile No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.developerMobileNo : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              }

              {addInfo?.showDevTypeFields === "Company" &&
                <div>
                  <Card style={{ margin: 5 }}>
                    <h5>Developer Details</h5>
                    <Row>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5>CIN Number &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.cin_Number : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.cinNo
                            }}
                            onClick={() => {
                              setOpennedModal("cinNo")
                              setLabelValue("CIN No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.cin_Number : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Company Name &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.companyName : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.companyName
                            }}
                            onClick={() => {
                              setOpennedModal("companyName")
                              setLabelValue("Company's Name"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.companyName : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Date of Incorporation &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.incorporationDate : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.dateOfIncorporation
                            }}
                            onClick={() => {
                              setOpennedModal("dateOfIncorporation")
                              setLabelValue("Date of Incorporation"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.incorporationDate : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Registered Address &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.registeredAddress : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.regAddress
                            }}
                            onClick={() => {
                              setOpennedModal("regAddress")
                              setLabelValue("Registered Address"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.registeredAddress : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Email &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.email : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.email
                            }}
                            onClick={() => {
                              setOpennedModal("email")
                              setLabelValue("Email"),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.email : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>Mobile No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.registeredContactNo : null}
                            disabled></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.mobileNo
                            }}
                            onClick={() => {
                              setOpennedModal("mobileNo")
                              setLabelValue("Mobile No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.registeredContactNo : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                      <Col md={4} xxl lg="4">
                        <div>
                          <Form.Label>
                            {/* <b>individual Land owner</b> */}
                            <h5 className={classes.formLabel}>GST No. &nbsp;</h5>
                          </Form.Label>
                          <span style={{ color: "red" }}>*</span>
                        </div>

                        <div style={{ display: "flex" }}>
                          <Form.Control className={classes.formControl}
                            placeholder={addInfo !== null ? addInfo?.gst_Number : null}
                            disabled ></Form.Control>
                          &nbsp;&nbsp;
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.gstNo
                            }}
                            onClick={() => {
                              setOpennedModal("gstNo")
                              setLabelValue("GST No."),
                                setSmShow(true),
                                console.log("modal open"),
                                setFieldValue(addInfo !== null ? addInfo?.gst_Number : null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </Col>
                    </Row>
                  </Card>



                  <Card style={{ margin: 5 }}>
                    <div className="table-bd">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Designition</th>
                            <th>Percentage</th>
                            <th>View PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            addInfo?.shareHoldingPatterens?.map((item, index) => (

                              <tr>
                                <td>{item?.serialNumber || index + 1}</td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.designition} disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.percentage} disabled></Form.Control>
                                </td>
                                <td>
                                  <div className="row">
                                    <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <Visibility color="info" className="icon" />
                                    </button>
                                    <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <FileDownload color="primary" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  {/* {showDevTypeFields === "02" && (
                  <div className="card mb-3">
                    <h5 className="card-title fw-bold">Directors Information</h5>
                    <div className="card-body"> */}
                  <div className="table-bd">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>DIN Number</th>
                          <th>Name</th>
                          <th>PAN Number</th>
                          <th>Upload PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          addInfo?.directorsInformation?.map((item, index) => (

                            <tr
                            >
                              <td>{index + 1}</td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.din} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.name} disabled></Form.Control>
                              </td>
                              <td>
                                <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }} placeholder={item?.pan} disabled></Form.Control>
                              </td>
                              <td>
                                <div className="row">
                                  <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                    <Visibility color="info" className="icon" />
                                  </button>
                                  <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                    <FileDownload color="primary" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                        {/* );
                            })} */}
                      </tbody>
                    </table>
                  </div>
                  {/* </div>
                  </div>
                )} */}
                  {/* <Card style={{ margin: 5 }}></Card> */}
                </div>
              }
            </div>
            {/* </Row> */}

            {/* <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 40 }}>
              <Button
                style={{ textAlign: "right" }}
                onClick={() => {
                  console.log("here");
                  props.passUncheckedList({ data: uncheckedValue });
                }}
              >
                Submit
              </Button>
            </div> */}
          </Form.Group>

          {/* <hr></hr> */}
          {/* </Card> */}
        </div>
      </Collapse>
      {/* <LicenseDetailsScrutiny />
          <CapacityScrutiny /> */}
      {/* </div>
      </Collapse> */}
    </Form>
  );
};
export default LicenseDetailsScrutiny;
