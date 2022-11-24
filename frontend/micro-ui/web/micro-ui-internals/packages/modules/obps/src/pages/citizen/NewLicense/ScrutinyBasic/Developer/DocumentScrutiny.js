import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import Visibility from "@mui/icons-material/Visibility";

// import ModalChild from "../Remarks/ModalChild";
// import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";
import FileDownload from "@mui/icons-material/FileDownload";

const windowHeight = window !== undefined ? window.innerHeight : null;
const [open, setOpen] = useState(false);
const DocumentScrutiny = (props) => {

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




  return (
    <div>
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
        <span style={{ color: "#817f7f" }} className="">
          Developer Capacity
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      {/* <div>
        <Col class="col-12">
          <Button
            style={{
              marginBottom: 3,
              width: "100%",
              textAlign: "inherit",
              padding: "0.25rem 1rem",
              fontWeight: "Bold",
              backgroundColor: "#c2c4c7",
              border: "none",
              color: "unset",
            }}
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            DeveloperCapacity
            <AddIcon style={{ width: "64em" }}></AddIcon>
          </Button>
        </Col>
      </div> */}
      <Collapse in={open}>
        <div id="example-collapse-text">
          {/* <Container className="justify-content-center"  style={{

                            top:windowHeight*0.3,
                            minWidth:"40%",
                            maxWidth:"45%"}}> */}
          <Row>
            <Card>
              <Card.Header>
                <Card.Title style={{ fontFamily: "Roboto", fontSize: 30, fontWeight: "bold" }}>Licensee Document Details</Card.Title>
              </Card.Header>
              <Card.Body style={{ overflowY: "auto", height: 250, backgroundColor: "#C6C6C6" }}>
                <Form>
                  <div>
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          
                          <th scope="col">First</th>
                          <th scope="col">Last</th>
                          <th scope="col">Handle</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Identity Proof </td>
                          <td>Otto</td>
                          
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Educational certificates *</td>
                          <td>
                            <div className="row">
                                    <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <Visibility color="info" className="icon" />
                                    </button>
                                    <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <FileDownload color="primary" />
                                    </button>
                                  </div></td>
                      
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td >Experience certificates</td>
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
                        <tr>
                          <th scope="row">4</th>
                          <td >Recent Passport size photograph of the applicant </td>
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
                        <tr>
                          <th scope="row">5</th>
                          <td >Showcause notice</td>
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
                        <tr>
                          <th scope="row">6</th>
                          <td >Income tax statement</td>
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
                        <tr>
                          <th scope="row">7</th>
                          <td >Others</td>
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
                        <tr>
                          <th scope="row">8</th>
                          <td >Registration certificate of license</td>
                          <td>
                            <div className="row">
                                    <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <Visibility color="info" className="icon" />
                                    </button>
                                    <button className="btn btn-sm col-md-6" onClick={() => window.open(item?.uploadPdf)} >
                                      <FileDownload color="primary" />
                                    </button>
                                  </div></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer>
                <div style={{ position: "relative", float: "right" }}>
                  <Button>Submit</Button>
                </div>
              </Card.Footer>
            </Card>
          </Row>

          {/* </Container> */}
        </div>
      </Collapse>
    </div>
  );
};

export default DocumentScrutiny;
