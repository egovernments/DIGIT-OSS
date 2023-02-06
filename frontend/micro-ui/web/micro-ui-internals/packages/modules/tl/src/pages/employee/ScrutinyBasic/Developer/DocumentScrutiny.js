import React, { useEffect, useState } from "react";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
// import Table from "react-bootstrap/Table";
import Table from '@mui/material/Table';
// import Row from '@mui/material/Row';
// import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';

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
const DocumentScrutiny = ({developerType , iconColorState , getRemarkData, addInfo}) => {
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

  // const addInfo = props.addInfo;
  const iconStates = iconColorState;

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

  console.log("developerType", addInfo);
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
          {/* <FormControl >
            <div> */}
              <Card >
                <Row>
                  <FormControl>
                  {addInfo?.showDevTypeFields === "Individual" && (
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
                                   <p>
                                    Any Other Relevant Documents
                                    </p>
                                 
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

                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {addInfo?.showDevTypeFields === "Proprietorship Firm" && (
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
                                   <p>
                                    Any Other Relevant Documents
                                    </p>
                                 
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

                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                   {addInfo?.showDevTypeFields === "Partnership Firm" && (
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
                                   <p>
                                    Any Other Relevant Documents
                                    </p>
                                 
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

                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                   {/* || "Trust" || "Hindu Undivided Family" || "Limited Liability Partnership"  Partnership Firm */}
                  {addInfo?.showDevTypeFields === "Company"  && (
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
                                <p>
                                   Copy of memorandum/Articles of Association/ any other document of developer
                                   </p>
                                
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
                                 <td> 2</td>
                                 <td>
                                <p>
                                Memorandum Of Association
                                   </p>
                                
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
                                 <td> 3</td>
                                 <td>
                                <p>
                                Any Other Relevant Documents
                                   </p>
                                
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
                             </tbody>
                           </Table>
                         </div>
                       </div>
                     </div>
                   </div>
                  )}
                  {addInfo?.showDevTypeFields === "Trust"  && (
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
                                <p>
                                   Copy of memorandum/Articles of Association/ any other document of developer
                                   </p>
                                
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
                                 <td> 2</td>
                                 <td>
                                <p>
                                Memorandum Of Association
                                   </p>
                                
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
                                 <td> 3</td>
                                 <td>
                                <p>
                                Any Other Relevant Documents
                                   </p>
                                
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
                             </tbody>
                           </Table>
                         </div>
                       </div>
                     </div>
                   </div>
                  )}
                  {addInfo?.showDevTypeFields === "Institution"  && (
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
                                <p>
                                   Copy of memorandum/Articles of Association/ any other document of developer
                                   </p>
                                
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
                                 <td> 2</td>
                                 <td>
                                <p>
                                Memorandum Of Association
                                   </p>
                                
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
                                 <td> 3</td>
                                 <td>
                                <p>
                                Any Other Relevant Documents
                                   </p>
                                
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
                             </tbody>
                           </Table>
                         </div>
                       </div>
                     </div>
                   </div>
                  )}
                 {addInfo?.showDevTypeFields === "Hindu Undivided Family"  && (
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
                                <p>
                                affidavit and PAN Card
                                   </p>
                                
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
                                 <td> 2</td>
                                 <td>
                                <p>
                                Any Other Relevant Documents
                                   </p>
                                
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
                             </tbody>
                           </Table>
                         </div>
                       </div>
                     </div>
                   </div>
                  )}
                   {addInfo?.showDevTypeFields === "Limited Liability Partnership"  && (
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
                                <p>
                                   Copy of memorandum/Articles of Association/ any other document of developer
                                   </p>
                                
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
                                 <td> 2</td>
                                 <td>
                                <p>
                                Memorandum Of Association
                                   </p>
                                
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
                                 <td> 3 </td>
                                 <td>
                                <p>
                                copy of registered irrevocable partnership deed
                                   </p>
                                
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
                                 <td> 4</td>
                                 <td>
                                <p>
                                Any Other Relevant Documents
                                   </p>
                                
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
                               
                             </tbody>
                           </Table>
                         </div>
                       </div>
                     </div>
                   </div>
                  )}
                   {addInfo?.showDevTypeFields === "Firm"  && (
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
                                <p>
                                   Copy of memorandum/Articles of Association/ any other document of developer
                                   </p>
                                
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
                                 <td> 2</td>
                                 <td>
                                <p>
                                Memorandum Of Association
                                   </p>
                                
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
                                 <td> 3 </td>
                                 <td>
                                <p>
                                copy of registered irrevocable partnership deed
                                   </p>
                                
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
                                 <td> 4</td>
                                 <td>
                                <p>
                                Any Other Relevant Documents
                                   </p>
                                
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
                               
                             </tbody>
                           </Table>
                         </div>
                       </div>
                     </div>
                   </div>
                  )}

                  
                  </FormControl>
                </Row>
              </Card>
            </div>
          {/* </FormControl>
        </div> */}
      </Collapse>
    </div>
  );
};

export default DocumentScrutiny;
