import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Card, Container, Button } from "react-bootstrap";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
// import Table from "react-bootstrap/Table";
// import Table from '@mui/material/Table';
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
import { useTranslation } from "react-i18next";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";



const DocumentScrutiny = ({ developerType, iconColorState, getRemarkData, addInfo, devDetail, applicationStatus }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();

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
  console.log("developerType24354456", devDetail);




  const [rowsPerPageStack, setRowsPerPageStack] = React.useState(10);
  const handleChangePageStack = (event, newPageStack) => {
    setPageStack(newPageStack);
  };
  const [pageStack, setPageStack] = React.useState(0);
  const handleChangeRowsPerPageStack = (event) => {
    setRowsPerPageStack(+event.target.value);
    setPageStack(0);
  };
  //-------------------//

  const [rowsPerPageMca, setRowsPerPageMca] = React.useState(10);

  const handleChangePageMca = (event, newPageMca) => {
    setPageMca(newPageMca);
  };
  const [pageMca, setPageMca] = React.useState(0);
  const handleChangeRowsPerPageMca = (event) => {
    setRowsPerPageMca(+event.target.value);
    setPageMca(0);
  };
  //--------------------//


  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));


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
        <div id="example-collapse-text"  style={{ marginTop: 5, paddingLeft: 5, paddingRight: 5 }}>
          {/* <FormControl >
            <div> */}
          <Card style={{padding:  "40px" }}>
            <Row>
              <FormControl>
                {(devDetail?.addInfo?.showDevTypeFields === "Individual" ||
                devDetail?.addInfo?.showDevTypeFields === "Proprietorship Firm" ||
                devDetail?.addInfo?.showDevTypeFields === "Partnership Firm" ) && (
                  <div className="row ">
                    <div className="form-group row">
                      <div className="col-sm-12">
                      <div className="card-body">
                  <div className="form-group row">
                    {/* <label className="col-sm-3 col-form-label">Company</label> */}
                    <div className="col-sm-12">
                      <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_SR_NO")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_PARTICULARS_DOC")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_ANNEXURE")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_ACTION")}`}</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  1
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`} <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="row">
                                   <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <FileDownloadIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                        <div className="btn btn-sm col-md-4"></div>
                               
                                  </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                  
                                </StyledTableCell>
                              </StyledTableRow>
                          
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={capacityDevelopColonyHdruAct?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          /> */}
                      </Paper>
                    </div>
                  </div>
                </div>
                        {/* <div>
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
                                
                                    {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                    
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <FileDownloadIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                    
                                  </div>
                                </td>
                              </tr>

                            </tbody>
                          </Table>
                        </div> */}
                      </div>
                    </div>
                  </div>
                )} 
                {/* {devDetail?.addInfo?.showDevTypeFields === "Proprietorship Firm" && (
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
                                  {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                 
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
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
                )} */}
                {/* {devDetail?.addInfo?.showDevTypeFields === "Partnership Firm" && (
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
                                
                                    {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                    
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
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
                )} */}
                {/* || "Trust" || "Hindu Undivided Family" || "Limited Liability Partnership"  Partnership Firm */}
                {(devDetail?.addInfo?.showDevTypeFields === "Company" ||
                devDetail?.addInfo?.showDevTypeFields === "Trust" ||
                devDetail?.addInfo?.showDevTypeFields === "Institution") && (
                  <div className="row ">
                    <div className="form-group row">
                      <div className="col-sm-12">
                      <div className="form-group row">
                    {/* <label className="col-sm-3 col-form-label">Company</label> */}
                    <div className="col-sm-12">
                      <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_SR_NO")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_PARTICULARS_DOC")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_ANNEXURE")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_ACTION")}`}</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  1
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_ARTICLES_OF_ASSOCIATION")}`} <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                                 
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                     <VisibilityIcon color="info" className="icon" />
                                   </IconButton>
                                 </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                     <FileDownloadIcon color="info" className="icon" />
                                   </IconButton>
                                 </div>
                                 <div className="btn btn-sm col-md-4"></div>
                              
                           </div>
                                </StyledTableCell>
                                <StyledTableCell> </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  2
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_MEMORANDUM_OF_ASSOCIATION")}`}<span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                                    
                                     <div className="btn btn-sm col-md-4">
                                      <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                        <VisibilityIcon color="info" className="icon" />
                                      </IconButton>
                                    </div>
                                     <div className="btn btn-sm col-md-4">
                                      <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                        <FileDownloadIcon color="info" className="icon" />
                                      </IconButton>
                                    </div>
                                    <div className="btn btn-sm col-md-4"></div>
                                
                              </div>
                                </StyledTableCell>
                                <StyledTableCell> </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  3
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}<span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                                    
                                     <div className="btn btn-sm col-md-4">
                                      <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                        <VisibilityIcon color="info" className="icon" />
                                      </IconButton>
                                    </div>
                                     <div className="btn btn-sm col-md-4">
                                      <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                        <FileDownloadIcon color="info" className="icon" />
                                      </IconButton>
                                    </div>
                                    <div className="btn btn-sm col-md-4"></div>
                               
                              </div>
                                </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                              </StyledTableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={capacityDevelopColonyHdruAct?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          /> */}
                      </Paper>
                    </div>
                  </div>
                        {/* <div>
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
                                   
                                    {`${t("DEV_APPLICANT_ARTICLES_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                 
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
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
                                  
                                    {`${t("DEV_APPLICANT_MEMORANDUM_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                    
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
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
                           
                                    {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                  </p>

                                </td>
                                <td>

                                  <div className="row">
                                    
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <FileDownloadIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                   
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div> */}
                      </div>
                    </div>
                  </div>
                )}
                {/* {devDetail?.addInfo?.showDevTypeFields === "Trust" && (
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
                                   
                                    {`${t("DEV_APPLICANT_ARTICLES_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                    
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
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
                             
                                    {`${t("DEV_APPLICANT_MEMORANDUM_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                 
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
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
                                 
                                    {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                          
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
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
                )} */}
                {/* {devDetail?.addInfo?.showDevTypeFields === "Institution" && (
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
                                
                                    {`${t("DEV_APPLICANT_ARTICLES_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                  
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
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
                                
                                    {`${t("DEV_APPLICANT_MEMORANDUM_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                               
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
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
                                
                                    {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                    
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
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
                )} */}
                {devDetail?.addInfo?.showDevTypeFields === "Hindu Undivided Family" && (
                  <div className="row ">
                    <div className="form-group row">
                      <div className="col-sm-12">
                        {/* <div>
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
                                   
                                    {`${t("DEV_APPLICANT_AFFIDAVIT_AND_PANCARD")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                 
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.affidavitAndPancard)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.affidavitAndPancard)}>
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
                                  
                                    {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                              
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <FileDownloadIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div> */}
                        <div className="form-group row">
                    {/* <label className="col-sm-3 col-form-label">Company</label> */}
                    <div className="col-sm-12">
                      <Paper sx={{ width: "100%", overflow: "hidden", }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_SR_NO")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_PARTICULARS_DOC")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_ANNEXURE")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_ACTION")}`}</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  1
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_AFFIDAVIT_AND_PANCARD")}`} <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                                 
                                 <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.affidavitAndPancard)}>
                                     <VisibilityIcon color="info" className="icon" />
                                   </IconButton>
                                 </div>
                                 <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.affidavitAndPancard)}>
                                     <FileDownloadIcon color="info" className="icon" />
                                   </IconButton>
                                 </div>
                                 <div className="btn btn-sm col-md-4"></div>
                           
                           </div>
                                </StyledTableCell>
                                <StyledTableCell> </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  2
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}<span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                              
                               <div className="btn btn-sm col-md-4">
                                <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                  <VisibilityIcon color="info" className="icon" />
                                </IconButton>
                              </div>
                               <div className="btn btn-sm col-md-4">
                                <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                  <FileDownloadIcon color="info" className="icon" />
                                </IconButton>
                              </div>
                              <div className="btn btn-sm col-md-4"></div>
                      
                        </div>
                                </StyledTableCell>
                                <StyledTableCell> </StyledTableCell>
                              </StyledTableRow>
                             
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={capacityDevelopColonyHdruAct?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          /> */}
                      </Paper>
                    </div>
                  </div>
                      </div>
                    </div>
                  </div>
                )}

                {(devDetail?.addInfo?.showDevTypeFields === "Limited Liability Partnership" ||
                devDetail?.addInfo?.showDevTypeFields === "Firm")&& (
                  <div className="row ">
                    <div className="form-group row">
                      <div className="col-sm-12">
                        {/* <div>
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
                                 
                                    {`${t("DEV_APPLICANT_ARTICLES_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                 
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
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
                                   
                                    {`${t("DEV_APPLICANT_MEMORANDUM_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                 
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
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
                             
                                    {`${t("DEV_APPLICANT_COPY_OF_REGISTERED")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                    
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.registeredIrrevocablePaternshipDeed)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.registeredIrrevocablePaternshipDeed)}>
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
                                   
                                    {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                  
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <FileDownloadIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                     
                                  </div>
                                </td>
                              </tr>

                            </tbody>
                          </Table>
                        </div> */}

<div className="form-group row">
                  
                    <div className="col-sm-12">
                      <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_SR_NO")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_PARTICULARS_DOC")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_ANNEXURE")}`}</StyledTableCell>
                                <StyledTableCell> {`${t("BPA_DEV_CAPACITY_ACTION")}`}</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  1
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_ARTICLES_OF_ASSOCIATION")}`} <span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                                 
                                 <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                     <VisibilityIcon color="info" className="icon" />
                                   </IconButton>
                                 </div>
                                 <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                     <FileDownloadIcon color="info" className="icon" />
                                   </IconButton>
                                 </div>
                                 <div className="btn btn-sm col-md-4"></div>
                               
                           </div>
                                </StyledTableCell>
                                <StyledTableCell> </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  2
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_MEMORANDUM_OF_ASSOCIATION")}`}<span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                                 
                                        <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                        <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                            <FileDownloadIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                        <div className="btn btn-sm col-md-4"></div>
                                
                                  </div>
                                </StyledTableCell>
                                <StyledTableCell> </StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  3
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_COPY_OF_REGISTERED")}`}<span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                                    
                                        <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.registeredIrrevocablePaternshipDeed)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                        <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.registeredIrrevocablePaternshipDeed)}>
                                            <FileDownloadIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                        <div className="btn btn-sm col-md-4"></div>
                                     
                                  </div>
                                </StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                              </StyledTableRow>
                              <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <StyledTableCell component="th" scope="row">
                                  4
                                </StyledTableCell>
                                <StyledTableCell>
                                {`${t("DEV_APPLICANT_COPY_OF_REGISTERED")}`}<span className="text-danger font-weight-bold">*</span>
                                </StyledTableCell>
                                <StyledTableCell>
                                <div className="row">
                                  
                                   <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                      <VisibilityIcon color="info" className="icon" />
                                    </IconButton>
                                  </div>
                                   <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                      <FileDownloadIcon color="info" className="icon" />
                                    </IconButton>
                                  </div>
                                  <div className="btn btn-sm col-md-4"></div>
                            </div>
                                </StyledTableCell>
                                <StyledTableCell> </StyledTableCell>
                              </StyledTableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {/* <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={capacityDevelopColonyHdruAct?.length}
                            rowsPerPage={rowsPerPageStack}
                            page={pageStack}
                            onPageChange={handleChangePageStack}
                            onRowsPerPageChange={handleChangeRowsPerPageStack}
                          /> */}
                      </Paper>
                    </div>
                  </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* {devDetail?.addInfo?.showDevTypeFields === "Firm" && (
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
                                
                                    {`${t("DEV_APPLICANT_ARTICLES_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                  
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.articlesOfAssociation)}>
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
                                 
                                    {`${t("DEV_APPLICANT_MEMORANDUM_OF_ASSOCIATION")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                   
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.memorandumOfArticles)}>
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
                        
                                    {`${t("DEV_APPLICANT_COPY_OF_REGISTERED")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                                 
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.boardDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.boardDoc)}>
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
                                 
                                    {`${t("DEV_APPLICANT_ANY_OTHER_RELEVANT_DOCUMENTS")}`}
                                  </p>

                                </td>
                                <td>
                                  <div className="row">
                           
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
                                            <VisibilityIcon color="info" className="icon" />
                                          </IconButton>
                                        </div>
                                         <div className="btn btn-sm col-md-4">
                                          <IconButton onClick={() => getDocShareholding(devDetail?.licensesDoc?.[0]?.anyOtherDoc)}>
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
                )} */}


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
