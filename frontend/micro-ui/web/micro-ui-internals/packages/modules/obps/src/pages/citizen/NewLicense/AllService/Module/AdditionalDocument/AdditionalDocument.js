import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getDocShareholding } from "../../../docView/docView.help";
import ReactMultiSelect from "../../../../../../../../../react-components/src/atoms/ReactMultiSelect";
import FileUpload from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CusToaster from "../../../../../../components/Toaster";
import Spinner from "../../../../../../components/Loader";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "react-bootstrap";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Button } from "@material-ui/core";
import SearchLicenceComp from "../../../../../../components/SearchLicence";

const selectTypeData = [{ label: "test", value: "test" }];

const AdditionalDocument = () => {
  const [loader, setLoader] = useState(false);
  const [modalValue, setModalValue] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const additionalDoc = (data) => {
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
    if (licenseNoModal !== "" && areaModal !== "") {
      const values = {
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
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const deleteTableRows = (i) => {
    const rows = [...modalValue];
    let tempRows = rows.splice(i, 1);
    // }
    rows;
  };

  return (
    <div>
      {loader && <Spinner />}
      <form onSubmit={handleSubmit(additionalDoc)}>
        <div className="card" style={{ width: "126%", border: "5px solid #1266af" }}>
          <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
            Additional Documents
          </h4>
          <div className="card">
            <div className="row gy-3">
              <div className="col col-5">
                <h2 className="FormLable">
                  Select Application No, LOI No, Licence No <span style={{ color: "red" }}>*</span>
                </h2>
                <ReactMultiSelect control={control} name="numberType" placeholder="Select Type" data={selectTypeData} labels="" />
              </div>

              <SearchLicenceComp watch={watch} register={register} control={control} setLoader={setLoader} errors={errors} setValue={setValue} />

              <div className="col col-4">
                <h2 className="FormLable">
                  List all services <span style={{ color: "red" }}>*</span>
                </h2>
                <ReactMultiSelect control={control} name="allservices" placeholder="Select Service" data={selectTypeData} labels="" />
              </div>
            </div>
            <Col md={12} lg={12} mb={3} sx={{ marginY: 2 }}>
              <Paper sx={{ width: "100%", overflow: "hidden", marginY: 2 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sr No.</StyledTableCell>
                        <StyledTableCell>Document Description</StyledTableCell>
                        <StyledTableCell>Upload Document</StyledTableCell>
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
            <div style={{ display: "flex", justifyContent: "right", marginTop: "20px" }}>
              <button
                style={{
                  background: "#024f9d",
                  color: "white",
                  borderRadius: "5px",
                  padding: " 5px 15px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  width: "200px",
                }}
                type="submit"
                id="btnSearch"
                class=""
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
      <Modal show={showAuthuser} onHide={handleCloseAuthuser} animation={false}>
        <Modal.Header closeButton>{/* <Modal.Title>Add Authorised User</Modal.Title> */}</Modal.Header>
        <Modal.Body>
          <form className="text1">
            <Row>
              <Col md={3} xxl lg="3">
                <FormControl>
                  <label htmlFor="licenseNoModal" className="text">
                    Document Description <span className="text-danger font-weight-bold">*</span>
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
                    Upload Document <span className="text-danger font-weight-bold">*</span>
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
    </div>
  );
};
export default AdditionalDocument;
