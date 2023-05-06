import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import { getDocShareholding } from "../../../docView/docView.help";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CusToaster from "../../../../../../components/Toaster";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTranslation } from "react-i18next";
import { Dialog } from "@mui/material";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "react-bootstrap";
import {
  FormStep,
  TextInput,
  MobileNumber,
  CardLabel,
  CardLabelError,
  Dropdown,
  Toast,
  RemoveIcon,
  DeleteIcon,
  MuiTables,
  typeOf,
} from "@egovernments/digit-ui-react-components";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function CompositionClu() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    resetField,
    formState: { error },
  } = useForm([{ Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
   const [showAuthuser, setModalShow] = useState(false);
    const handleShowAuthuser = () => {
    setModalShow(true);
  };
    const handleCloseAuthuser = () => {
    // setValue("modalFiles", []);
    setModalShow(false);
  };
    const handleSubmitExistingArea = () => {
    if (khasraModal !== "" && areaModal !== "") {
      const values = {
        kashraNo: khasraModal,
        area: areaModal,
      };

      // console.log("DATFRM", values);
      setModalValue((prev) => [...prev, values]);
      // getDocDirector();
      setModalShow(false);
    }
  };
   const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
   const [modalValue, setModalValue] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [showhide, setShowhide] = useState("No");
  const [applicationNumber, setApplicationNumber] = useState();
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [khasraModal, setKhasraModal] = useState("");
  const [areaModal, setAreaModal] = useState("");
  const [getTotalArea, setTotlArea] = useState();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
    
  };
  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const {t}=useTranslation();
 const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [page, setPage] = React.useState(0);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  const deleteTableRows = (i) => {
    const rows = [...modalValue];
    let tempRows = rows.splice(i, 1);
    // }
    setModalValue(rows);
  };
  const [noofRows, setNoOfRows] = useState(1);
    const getDocumentData = async (file, fieldName) => {
    if (selectedFiles.includes(file.name)) {
      setShowToastError({ label: "Duplicate file Selected", error: true, success: false });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");
    setLoader(true);
    try {
      const Resp = await axios.post("/filestore/v1/files", formData, {});
      setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
      setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
      setSelectedFiles([...selectedFiles, file.name]);
      setLoader(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
    } catch (error) {
      setLoader(false);
      return error.message;
    }
  };

   const compositionClu = async (data) => {
    console.log("data", data);
    setLoader(true);
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};
    const postDistrict = {
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: "1669293303096|en_IN",
        authToken: token,
        userInfo: userInfo,
      },
      compositionOfUrban: [
        {
          ...data,
          totalLandSoldInPartDetails:{
            totalLandSoldInPart:modalValue
        }}
      ]
    };

    try {
      const Resp = await axios.post("/tl-services/composition/_create", postDistrict);
      setLoader(false);
      setApplicationNumber(Resp?.data?.compositionOfUrban?.[0]?.applicationNumber);
      console.log("Resp=====", Resp?.data?.compositionOfUrban?.[0]?.applicationNumber);
      setOpen(true);
      // history.push("/digit-ui/citizen");
      // setApplicationNumber(Resp.data.changeBeneficial.applicationNumber);
    } catch (error) {
      setError(error?.response?.data?.Errors[0]?.message);
      setLoader(false);
    }
  };
   useEffect(()=>{
    console.log("totalarea1")
    if(modalValue?.length){
      let totalArea1 = 0
      modalValue.forEach((item,index)=>{
         totalArea1 += Number(item?.area)
      }
      )
       setValue("totalAreaInSqMetter",totalArea1)
       console.log("totalarea1",totalArea1)
    }
  },[modalValue]
  )

  return (
    <div>
    <form onSubmit={handleSubmit(compositionClu)}>
      <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>{`${t("URBAN_VIOLATION_HEADING")}`}
          {/* Composition of urban Area Violation in CLU */}
          </h4>
        <div className="card">
          <div className="row-12">
            <div className="col md={4} xxl lg-4">
              <FormControl>
                <h2 className="FormLable">{`${t("URBAN_VIOLATION_NAME_OF_LAND_OWNER")}`}
                {/* Name of original land owner  */}
                </h2>{" "}
                <OutlinedInput type="text" placeholder="" className="Inputcontrol" {...register("nameOfOrginalLandOner")} />
              </FormControl>
              &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
              <FormControl>
                <h2 className="FormLable">{`${t("URBAN_VIOLATION_LAND_HOLDING")}`}
                 {/* Land holding of above  */}
                 </h2>{" "}
                <OutlinedInput type="text" placeholder="" className="Inputcontrol" {...register("landHoldingOfAbove")} />
              </FormControl>
            </div>
          </div>
          <br></br>
       <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="existing_area" sx={{ fontWeight: "bold" }}>
                    {`${t("URBAN_VIOLATION_LAND_SOLD_IN_PARTS")}`} <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                </FormControl>
              </Col>
                <Col md={12} lg={12} mb={3} sx={{ marginY: 2 }}>
              <Paper sx={{ width: "100%", overflow: "hidden", marginY: 2 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                         <StyledTableCell colSpan="4" style={{ textAlign: "center" }}> {`${t("URBAN_VIOLATION_AREA_OF_PARTS")}`}
                        {/* Sr No. */}
                        </StyledTableCell>
                         </TableRow>
                           <TableRow>
                        <StyledTableCell> {`${t("URBAN_VIOLATION_SR_NO")}`}
                        {/* Sr No. */}
                        </StyledTableCell>
                        <StyledTableCell>{`${t("URBAN_VIOLATION_KHASRA_NO")}`}
                        {/* License No. */}
                        </StyledTableCell>
                        <StyledTableCell>{`${t("URBAN_VIOLATION_AREA")}`}
                        {/* Area */}
                        </StyledTableCell>
                        <StyledTableCell>{`${t("URBAN_VIOLATION_ACTION")}`}
                         {/* Action */}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      
                      {modalValue?.length > 0 ? (
                        modalValue.map((elementInArray, input) => {
                          return (
                            <StyledTableRow key={input} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <StyledTableCell component="th" scope="row">
                                {input + 1}
                              </StyledTableCell>
                              <StyledTableCell>{elementInArray.kashraNo}</StyledTableCell>
                              <StyledTableCell>{elementInArray.area}</StyledTableCell>
                              
                              

                              <StyledTableCell >
                                <a href="javascript:void(0)" title="Delete record" onClick={() => deleteTableRows(-1)}>
                                  <DeleteIcon style={{ fill: "#ff1a1a" }} />
                                </a>
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })
                      ) : (
                        <div className="d-none">Click on Add </div>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={modalValue?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              <div className="row">
              <Col sx={{ marginY: 2 }}>
                <button
                  type="button"
                  style={{
                    margin: "1rem 0rem",
                    backgroundColor: "#0b3629",
                    color: "white",
                  }}
                  className="btn"
                  // onClick={() => setNoOfRows(noofRows + 1)}
                  onClick={handleShowAuthuser}
                >
                  {`${t("REV_LAYOUT_ADD_MORES")}`}
                  {/* Add More */}
                </button>
              </Col>
               <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="existing_area" sx={{ fontWeight: "bold" }}>{`${t("URBAN_VIOLATION_TOTAL_AREA_SQ_M")}`}
                    {/* Total Area:{getTotalArea}  */}
                    <span style={{ color: "red" }}>*</span>
                    
                
                  <OutlinedInput
                    aria-labelledby="existing_area"
                    type="text"
                    placeholder=""
                    className="Inputcontrol"
                   {...register("totalAreaInSqMetter")} 
                  disabled
                  />
                    </FormLabel>
                </FormControl>
              </Col>
               
                </div>
            </Col>
          <br></br>
          <div className="row-12">
            <div className="col col-12">
              <FormControl>
                <h2 className="FormLable">{`${t("URBAN_VIOLATION_REASON_FOR_VIOLATION")}`}
                 {/* Explain the reason for the violation */}
                 </h2>{" "}
                <OutlinedInput type="text" className="Inputcontrol" placeholder="" rows="3" {...register("explainTheReasonForVoilation")} />
              </FormControl>
            </div>
          </div>
          <br></br>
          <div className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th className="fw-normal">{`${t("URBAN_VIOLATION_SR_NO")}`}</th>
                <th className="fw-normal">{`${t("URBAN_VIOLATION_FIELD_NAME")}`}
                {/* Field Name */}
                </th>
                <th className="fw-normal">{`${t("URBAN_VIOLATION_UPLOAD_DOC")}`}
                {/* Upload Documents */}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="fw-normal">1</th>
                <td>{`${t("URBAN_VIOLATION_DATE_OF_SALES_DEED")}`}
                {/* Date of sale deeds. */}
                </td>
                <td>
                   <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "dateOfSaleDeeds")}
                                      />
                                    </label>
                                    {watch("dateOfSaleDeeds") && (
                                      <a onClick={() => getDocShareholding(watch("dateOfSaleDeeds"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                </td>
              </tr>

              <tr>
                <th className="fw-normal">2</th>
                <td>{`${t("URBAN_VIOLATION_ANY_OTHER")}`}
                  {/* Any other. */}
                  <span style={{ color: "red" }}>*</span>
                </td>
                <td>
                   <div>
                                    <label>
                                      <FileUpload style={{ cursor: "pointer" }} color="primary" />
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        accept="application/pdf/jpeg/png"
                                        onChange={(e) => getDocumentData(e?.target?.files[0], "anyOtherDoc")}
                                      />
                                    </label>
                                    {watch("anyOtherDoc") && (
                                      <a onClick={() => getDocShareholding(watch("anyOtherDoc"), setLoader)} className="btn btn-sm ">
                                        <VisibilityIcon color="info" className="icon" />
                                      </a>
                                    )}
                                  </div>
                </td>
              </tr>
            </tbody>
          </div>

          <div class="col-sm-12 text-right">
            <Button variant="contained" class="btn btn-primary btn-md center-block" aria-label="right-end">
              Cancel{" "}
            </Button>
            &nbsp;
            <Button variant="contained" onClick={handleClickOpen1} class="btn btn-primary btn-md center-block" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </form>

     <Modal show={showAuthuser} onHide={handleCloseAuthuser} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="text1">
            <Row>
              <Col md={3} xxl lg="3">
                <FormControl>
                  <label htmlFor="khasraModal" className="text">{`${t("URBAN_VIOLATION_KHASRA_NO")}`}
                    <span className="text-danger font-weight-bold">*</span>
                  </label>
                  <OutlinedInput
                    type="number"
                    placeholder=""
                    className="Inputcontrol"
                    name="khasraModal"
                    onChange={(e) => setKhasraModal(e.target.value)}
                  />
                </FormControl>
              </Col>
              <Col md={3} xxl lg="3">
                <FormControl>
                  <label htmlFor="areaModal" className="text">
                   {`${t("URBAN_VIOLATION_AREA")}`} <span className="text-danger font-weight-bold">*</span>
                  </label>
                  <OutlinedInput
                    type="number"
                    placeholder=""
                    className="Inputcontrol"
                    name="areaModal"
                    onChange={(e) => setAreaModal(e.target.value)}
                  />
                </FormControl>
              </Col>
            </Row>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button class="btn btn-primary btn-md center-block" onClick={handleSubmitExistingArea}>
            Submit
          </Button>
          <Button class="btn btn-primary btn-md center-block" onClick={handleCloseAuthuser}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
       <Dialog open={open1} onClose={handleClose1} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Approval of Revised Layout Plan Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Your Composition of Urban Area Violation in CLU is submitted successfully{" "}
              <span>
                <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
              </span>
            </p>
            <p>
              Please Note down your Application Number <span style={{ padding: "5px", color: "blue" }}>{applicationNumber}</span> for further
              assistance
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
     {showToastError && (
        <CusToaster
          label={showToastError?.label}
          success={showToastError?.success}
          error={showToastError?.error}
          onClose={() => {
            setShowToastError({ label: "", success: false, error: false });
          }}
        />
      )}
 </div>
  );
};
export default CompositionClu;
