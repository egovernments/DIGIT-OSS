import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import Table from "react-bootstrap/Table";
// import CancelIcon from "@mui/icons-material/Cancel";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import AddIcon from "@mui/icons-material/Add";
import ModalChild from "../Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyles } from "../css/personalInfoChild.style";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "../ScrutinyDevelopment/docview.helper";
// const windowHeight = window !== undefined ? window.innerHeight : null;
// const [open, setOpen] = useState(false);
const DocumentScrutiny = (props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);

  const [smShow, setSmShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602",
  };
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");

  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");
  const [color, setColor] = useState({ yes: false, no: false });
  const [labelValue, setLabelValue] = useState("");
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);

  const [fieldIconColors, setFieldIconColors] = useState({
    IdentityProof: Colors.info,
    // developerName: Colors.info,
    // developerEmail: Colors.info,
    // developerMobileNo: Colors.info,
    // cinNo: Colors.info,
    // companyName: Colors.info,
    // dateOfIncorporation: Colors.info,
    // regAddress: Colors.info,
    // email: Colors.info,
    // mobileNo: Colors.info,
    // gstNo: Colors.info
  });

  const fieldIdList = [
    { label: "Identity Proof", key: "IdentityProof" },
    // ,{ label: "Developer's Name", key: "developerName" }, { label: "Developer's Email", key: "developerEmail" }, { label: "Developer's Mobile No.", key: "developerMobileNo" }, { label: "CIN No.", key: "cinNo" }, { label: "Company's Name", key: "companyName" }, { label: "Date of Incorporation", key: "dateOfIncorporation" }, { label: "Registered Address", key: "regAddress" }, { label: "Email", key: "email" }, { label: "Mobile No.", key: "mobileNo" }, { label: "GST No.", key: "gstNo" }
  ];

  const addInfo = props.addInfo;
  const iconStates = props.iconColorState;

  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (iconStates !== null && iconStates !== undefined) {
        console.log("color method called");
        const fieldPresent = iconStates.egScrutiny.filter((ele) => ele.fieldIdL === item.label);
        console.log("filteration value", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value1", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved ? Colors.approved : Colors.disapproved };
        }
      }
    });

    setFieldIconColors(tempFieldColorState);
  };

  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...");
  }, [iconStates]);

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = iconStates.egScrutiny.filter((ele) => ele.fieldIdL === labelValue);
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue]);

  const handlemodaldData = (data) => {
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
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
        <span style={{ color: "#817f7f", fontSize: 14 }} className="">
          - Licence Documents Details
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text" style={{ marginTop: 5, paddingLeft: 5, paddingRight: 5 }}>
          <Form.Group style={{ margin: 5 }}>
            <div>
              <Card style={{ margin: 2 }}>
                <Row>
                  <Form>
                    {/* <div className="table-bd">
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
                                <td>
                                  {item?.serialNumber || index + 1}
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                                   placeholder={item?.name} 
                                   disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                                  placeholder={item?.designition} 
                                  disabled></Form.Control>
                                </td>
                                <td>
                                  <Form.Control style={{ maxWidth: 200, marginRight: 5, height: 30 }}
                                   placeholder={item?.percentage}
                                    disabled></Form.Control>
                                </td>
                                <td>
                                  <div className="row">
                                    <button className="btn btn-sm col-md-6" 
                                    onClick={() => window.open(item?.uploadPdf)}
                                     >
                                      <Visibility color="info" className="icon" />
                                    </button>
                                    <button className="btn btn-sm col-md-6" 
                                    onClick={() => window.open(item?.uploadPdf)} 
                                    >
                                      <FileDownload color="primary" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                          ))
                           } 
                        </tbody>
                      </table>
                    </div> */}
                    <div className="row ">
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <div>
                            <Table className="table table-bordered ml-2" size="sm">
                              <thead>
                                <tr>
                                  <th class="fw-normal">S.No.</th>
                                  <th class="fw-normal">Licence Document Details</th>
                                  <th class="fw-normal">Annexure </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td> 1 </td>
                                  <td>
                                    Identity Proof
                                    <p>
                                      (Copy of Govt approved Identity card with photo attested by a gazetted officer within one month from the data of
                                      application .)
                                    </p>
                                    {/* <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developerType
                      }}
                      onClick={() => {
                        setOpennedModal("IdentityProof")
                        setLabelValue("Identity Proof"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(item?.boardDoc || null);
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
                    ></ModalChild> */}
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton onClick={() => getDocShareholding(item?.boardDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton onClick={() => getDocShareholding(item?.boardDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                                  </td>
                                </tr>

                                <tr>
                                  <td> 2 </td>
                                  <td>Educational Certifiates *</td>
                                  <td>
                                    <div className="row">
                                      {/* <button className="btn btn-sm col-md-6">
                                      <VisibilityIcon color="info" className="icon" />
                                    </button>
                                    <button className="btn btn-sm col-md-6">
                                      <FileDownloadIcon color="primary" />
                                    </button> */}
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        //  onClick={()=>getDocShareholding(item?.boardDocN)}
                                        >
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        // onClick={()=>getDocShareholding(item?.boardDocN)}
                                        >
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td> 3 </td>

                                  <td>Experience Certifiates *</td>
                                  <td>
                                    <div className="row">
                                      {/* <button className="btn btn-sm col-md-6">
                                      <VisibilityIcon color="info" className="icon" />
                                    </button>
                                    <button className="btn btn-sm col-md-6">
                                      <FileDownloadIcon color="primary" />
                                    </button> */}
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        //  onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        // onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td> 4 </td>

                                  <td>
                                    Recent PassPosrt Size photograph of the applicant *
                                    <p>
                                      (Recent passport size photo - Take within six months prior to the date of application shall be uploaded please
                                      ensure that the photo uploaded is of passport and gives a front and clear view of the face.)
                                    </p>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        //  onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        // onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td> 5 </td>

                                  <td>
                                    Showcause notice *<p>(Details of show cause notice received/cancellations of licence if any )</p>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        //  onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        // onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td> 6 </td>

                                  <td>
                                    Income tax statement *<p>(Income Tax Statement of Last Three Consecutive Financial Year)</p>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        //  onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        // onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td> 7 </td>

                                  <td>other</td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        //  onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        // onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td> 8 </td>

                                  <td>
                                    Registration Certificate of licence
                                    <p>
                                      (Registration certifiate of the licence copy attested by a gazette officer attested within one month prior to
                                      the date of be scanned and uploaded.(including renewal certifiate if any ))
                                    </p>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        //  onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-6">
                                        <IconButton
                                        // onClick={()=>getDocShareholding(item?.permissionGrantedLawAct)}
                                        >
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </Row>
              </Card>
            </div>
          </Form.Group>
        </div>
      </Collapse>
    </div>
  );
};

export default DocumentScrutiny;
