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
} from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import { useForm } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "react-bootstrap";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CusToaster from "../../../../../../components/Toaster";
import Spinner from "../../../../../../components/Loader";
import { useTranslation } from "react-i18next";
// import TextareaAutosize from "@mui/base/TextareaAutosize";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import axios from "axios";

function LayoutPlanClu() {
  const { t } = useTranslation();

  const userInfo = Digit.UserService.getUser()?.info || {};
  const [loader, setLoader] = useState(false);
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [toastError, setToastError] = useState("");
  const [modalValue, setModalValue] = useState([]);
  const [licenseNoModal, setLicenseNoModal] = useState("");
  const [areaModal, setAreaModal] = useState("");
  const [Documents, setDocumentsData] = useState();
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };

  const layoutPlan = async (data) => {
    const token = window?.localStorage?.getItem("token");
    console.log(data);

    const postLayoutPlan = {
      RevisedPlan: [{ ...data, existingAreaDetails: modalValue, documents: Documents }],
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: token,
        userInfo: userInfo,
      },
    };
    console.log("LAY", postLayoutPlan);
    try {
      const Resp = await axios.post("/tl-services/revisedPlan/_create", postLayoutPlan);
      setLoader(false);
      const useData = Resp?.data?.RevisedPlan?.[0];
    } catch (error) {
      setLoader(false);
      setToastError(error?.response?.data?.Errors?.[0]?.code);
      setTimeout(() => {
        setToastError(null);
      }, 2000);
      return error.message;
    }
  };
  const [showAuthuser, setModalShow] = useState(false);
  const handleShowAuthuser = () => {
    setModalShow(true);
  };
  const handleCloseAuthuser = () => {
    setValue("modalFiles", []);
    setModalShow(false);
  };

  const handleSubmitExistingArea = () => {
    if (licenseNoModal !== "" && areaModal !== "") {
      let values = {
        licenseNoPop: licenseNoModal,
        areaModalPop: areaModal,
      };

      // console.log("DATFRM", values);
      setModalValue((prev) => [...prev, values]);
      // getDocDirector();
      setModalShow(false);
    }
  };

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
      // setDocumentsData({ ...Documents, ...getValues() });
      setLoader(false);
      setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
    } catch (error) {
      setLoader(false);

      return error.message;
    }
  };

  return (
    <div className="w-100">
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(layoutPlan)}>
        <div className="card">
          <h4 className="my-2">
            <b>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</b>
          </h4>
          <div className="row">
            <Col md={4} lg={4} mb={3}>
              <FormControl>
                <FormLabel id="lic_no" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_LICENSE_NO")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <OutlinedInput aria-labelledby="lic_no" type="number" placeholder="" className="Inputcontrol" {...register("licenseNo")} />
              </FormControl>
            </Col>
            <Col md={4} lg={4} mb={3}>
              <FormControl>
                <FormLabel id="existing_area" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_EXISTING_AREA")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <OutlinedInput aria-labelledby="existing_area" type="text" placeholder="" className="Inputcontrol" {...register("existingArea")} />
              </FormControl>
            </Col>
            <Col md={12} lg={12} mb={3} sx={{ marginY: 2 }}>
              <Paper sx={{ width: "100%", overflow: "hidden", marginY: 2 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sr No.</StyledTableCell>
                        <StyledTableCell>License No.</StyledTableCell>
                        <StyledTableCell>Area</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
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
                              <StyledTableCell>{elementInArray.licenseNoPop}</StyledTableCell>
                              <StyledTableCell>{elementInArray.areaModalPop}</StyledTableCell>

                              <StyledTableCell align="center">
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
                  Add More
                </button>
              </Col>
            </Col>
            <Col md={4} lg={4} mb={3}>
              <FormControl>
                <FormLabel id="propesed_revision" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_AREA_PROPOSED_REVISION")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <OutlinedInput
                  type="text"
                  aria-labelledby="propesed_revision"
                  placeholder=""
                  className="Inputcontrol"
                  {...register("areaProposedRevision")}
                />
              </FormControl>
            </Col>
            <Col md={4} lg={4} mb={3}>
              <FormControl>
                <FormLabel id="commercial_area" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_AREA_COMMERCIAL")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <OutlinedInput
                  type="text"
                  aria-aria-labelledby="commercial_area"
                  placeholder=""
                  className="Inputcontrol"
                  {...register("areaCommercial")}
                />
              </FormControl>
            </Col>
            <Col md={4} lg={4} mb={3}>
              <FormControl>
                <FormLabel id="residential_area" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_AREA_RESIDENTIAL")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <OutlinedInput
                  type="text"
                  aria-aria-labelledby="residential_area"
                  placeholder=""
                  className="Inputcontrol"
                  {...register("areaResidential")}
                />
              </FormControl>
            </Col>
          </div>
          <br></br>
          <div className="row-12">
            <Col md={4} lg={4}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_ANY_OTHER_REMARK")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel value="Y" control={<Radio />} {...register("anyOtherFeature")} label="Yes" />
                  <FormControlLabel value="N" control={<Radio />} {...register("anyOtherFeature")} label="No" />
                </RadioGroup>
              </FormControl>
            </Col>
            {watch("anyOtherFeature") == "Y" ? (
              <Col md={4} lg={4}>
                <FormControl>
                  {/* <FormLabel id="any_remarks">Any other remark</FormLabel> */}
                  <textarea className="form-control" aria-labelledby="any_remarks" {...register("anyOtherRemarks")}></textarea>
                </FormControl>
              </Col>
            ) : (
              <p></p>
            )}
          </div>
          <div className=" col-12 m-auto">
            <div className="card">
              <div className="table table-bordered table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>Sr.No</th>
                      <th style={{ textAlign: "center" }}>Field Name</th>
                      <th style={{ textAlign: "center" }}>Upload Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row">1</td>
                      <td>
                        Reasons for revision in the layout plan <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input
                          type="file"
                          placeholder=""
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "reasonRevisionLayoutPlanDoc")}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">2</td>
                      <td>
                        {" "}
                        Copy of earlier approved layout plan <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input
                          type="file"
                          placeholder=""
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "earlierApprovedlayoutPlan")}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">3</td>
                      <td>
                        {" "}
                        Status of creation of 3rd party rights and affidavit regarding non-creation of 3rd party rights if the same are not created{" "}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input
                          type="file"
                          placeholder=""
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "statusCreationAffidavitDoc")}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">4</td>
                      <td>
                        {" "}
                        Board resolution of authorised signatory of the applicant <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input
                          type="file"
                          placeholder=""
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionAuthSignatoryDoc")}
                        ></input>
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">5</td>
                      <td>
                        {" "}
                        Any Other <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <input
                          type="file"
                          placeholder=""
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "anyOther")}
                        ></input>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="col-sm-12 text-right">
              <Button variant="contained" class="btn btn-primary btn-md center-block" aria-label="right-end">
                Save as Draft{" "}
              </Button>
              &nbsp;
              <Button variant="contained" class="btn btn-primary btn-md center-block" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>

      <Modal show={showAuthuser} onHide={handleCloseAuthuser} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add Authorised User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="text1">
            <Row>
              <Col md={3} xxl lg="3">
                <FormControl>
                  <label htmlFor="licenseNoModal" className="text">
                    License No. <span className="text-danger font-weight-bold">*</span>
                  </label>
                  <OutlinedInput
                    type="number"
                    placeholder=""
                    className="Inputcontrol"
                    name="licenseNoModal"
                    onChange={(e) => setLicenseNoModal(e.target.value)}
                  />
                </FormControl>
              </Col>
              <Col md={3} xxl lg="3">
                <FormControl>
                  <label htmlFor="areaModal" className="text">
                    Area <span className="text-danger font-weight-bold">*</span>
                  </label>
                  <OutlinedInput
                    type="text"
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
          <Button variant="primary" onClick={handleSubmitExistingArea}>
            Submit
          </Button>
          <Button variant="danger" onClick={handleCloseAuthuser}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
}

export default LayoutPlanClu;
