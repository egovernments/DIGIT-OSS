import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Collapse from "react-bootstrap/Collapse";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import { useTranslation } from "react-i18next";
import OutlinedInput from "@mui/material/OutlinedInput";

function LayoutPlanClu() {
  const { t } = useTranslation();
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const { register, handleSubmit } = useForm();
  const layoutPlan = (data) => console.log(data);

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const [open2, setOpen2] = useState(false);

  return (
    <form onSubmit={handleSubmit(layoutPlan)}>
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
        <span style={{ color: "#817f7f" }} className="">
        APPROVAL OF REVISED LAYOUT PLAN OF LICENSE
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</h4>
        <div className="card">
          <Form>
            <Row>
              <Col className="col-4">
                <Form.Group controlId="formGridCase">
                  <Form.Label>
                    License No . <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="number" placeholder="" className="form-control" {...register("licenseNo")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Existing Area <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="text" placeholder="" className="form-control" {...register("existingArea")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Area of which planning is being changed <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="text" placeholder="" className="form-control" {...register("areaPlanning")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <fieldset>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label>
                      Any other feature
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Row>
                    <Col className="col-3">
                      <Form.Check
                        type="radio"
                        value="true"
                        label="Yes"
                      name="Anyotherfeature"
                      id="Anyotherfeature"
                     
                      {...register(" Anyotherfeature")}
                        onChange={(e) => handleselects(e)}
                      />
                 
                      <Form.Check 
                      type="radio" 
                     
                      value="false"
                      label="No"
                    name="Anyotherfeature"
                    id="Anyotherfeature"
                    {...register("Anyotherfeature")}
                        onChange={(e) => handleselects(e)}
                        />
                    </Col>
                  </Row>
                 
                     
                  </Form.Group>
                 
                </fieldset>
              </Col>
              <Col className="col-4">
                <Form.Group controlId="formGridState">
                  <Form.Label>
                    Amount <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <input type="text" required={true} disabled={true} placeholder="" className="form-control" {...register("amount")} />
                </Form.Group>
              </Col>
              <Col className="col-4">
                <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                  Pay
                </Button>
              </Col>
            </Row>
          </Form>
          <div className=" col-12 m-auto">
            <div className="card">
            <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }}>Sr.No</th>
                        <th style={{ textAlign: "center" }}>Field Name</th>
                        <th style={{ textAlign: "center" }}>Upload Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>
                          Reasons for revision in the layout plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("reasonRevision")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>
                          {" "}
                          Copy of earlier approved layout plan <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("earlierApprovedlayoutPlan")}></input>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>
                          {" "}
                          Any Other <span style={{ color: "red" }}>*</span>
                        </td>
                        <td>
                          <input type="file" placeholder="" className="form-control" {...register("anyOther")}></input>
                        </td>
                      </tr>
                    </tbody>
                  
                </div>
              </div>

              <Row className="justify-content-end">
                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                  Save as Draft
                </Button>
                <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                  Submit
                </Button>
              </Row>
            </div>
          </div>
        
      </Card>
      <div className="card">
          <h4 className="my-2">
            <b>APPROVAL OF REVISED LAYOUT PLAN OF LICENSE</b>
          </h4>
          <div className="card">
            <div className="row gy-3">
              {/* <FormLabel id="lic_no" sx={{ fontWeight: "bold" }}>
                  {`${t("REV_LAYOUT_LICENSE_NO")}`} <span style={{ color: "red" }}>*</span>
                </FormLabel> */}
              {/* <SearchLicenceComp
                watch={watch}
                register={register}
                control={control}
                setLoader={setLoader}
                errors={errors}
                setValue={setValue}
                resetField={resetField}
              /> */}

              {/* <OutlinedInput
                  aria-labelledby="lic_no"
                  type="number"
                  placeholder=""
                  className="Inputcontrol"
                  {...register("licenseNo")}
                  onChange={(e) => setLicNumber(e.target.value)}
                  value={licenseNoVal}
                /> */}

              <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="existing_area" sx={{ fontWeight: "bold" }}>
                    {`${t("REV_LAYOUT_EXISTING_AREA")}`} <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  {/* <OutlinedInput
                    aria-labelledby="existing_area"
                    type="text"
                    placeholder=""
                    className="Inputcontrol"
                    {...register("existingArea")}
                    onChange={(e) => setExistingArea(e.target.value)}
                    value={existingAreaVal}
                  /> */}
                </FormControl>
              </Col>
            </div>
            <Col md={12} lg={12} mb={3} sx={{ marginY: 2 }}>
              <Paper sx={{ width: "100%", overflow: "hidden", marginY: 2 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {/* <StyledTableCell>Sr No.</StyledTableCell>
                        <StyledTableCell>License No.</StyledTableCell>
                        <StyledTableCell>Area</StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {modalValue?.length > 0 ? (
                        modalValue.map((elementInArray, input) => {
                          return ( */}
                            {/* <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <StyledTableCell component="th" scope="row">
                             
                              </StyledTableCell>
                              <StyledTableCell></StyledTableCell>
                              <StyledTableCell></StyledTableCell>

                              <StyledTableCell > */}
                                {/* <a href="javascript:void(0)" title="Delete record" onClick={() => deleteTableRows(-1)}>
                                  <DeleteIcon style={{ fill: "#ff1a1a" }} />
                                </a> */}
                              {/* </StyledTableCell>
                            </StyledTableRow> */}
                          {/* );
                        })
                      ) : ( */}
                        <div className="d-none">Click on Add </div>
                      {/* )} */}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  // rowsPerPageOptions={[10, 25, 100]}
                  // component="div"
                  // count={modalValue?.length}
                  // rowsPerPage={rowsPerPage}
                  // page={page}
                  // onPageChange={handleChangePage}
                  // onRowsPerPageChange={handleChangeRowsPerPage}
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
                  // onClick={handleShowAuthuser}
                >
                  Add More
                </button>
              </Col>
               <Col md={4} lg={4} mb={3}>
                <FormControl>
                  <FormLabel id="existing_area" sx={{ fontWeight: "bold" }}>
                    Total Area <span style={{ color: "red" }}>*</span>
                
                  <OutlinedInput
                    aria-labelledby="existing_area"
                    type="text"
                    placeholder=""
                    className="Inputcontrol"
                    {...register("existingArea")}
                  
                  />
                    </FormLabel>
                </FormControl>
              </Col>
               
                </div>
            </Col>
             <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                             <th class="fw-normal"></th>
                            <th class="fw-normal" style={{ textAlign: "center" }}>In Acres</th>
                            <th class="fw-normal"style={{ textAlign: "center" }}>In sq.m</th>
                           
                          </tr>
                        </thead>
                      <tbody>
                         <tr>
                            <td>Area proposed in revision</td>
                            <td><input type="number"className="form-control" {...register("areaProposedRevision")} id="areaProposedRevision" /></td>
                            {/* <td style={{ textAlign: "center" }}>{(watch("areaProposedRevision") * 4046.86)?.toFixed(3)}</td> */}
                            <td></td>
                          </tr>
                          <tr>
                            <td>Commercial area</td>
                            <td><input type="number"className="form-control"  {...register("areaCommercial")} id="areaCommercial"/></td>
                            {/* <td style={{ textAlign: "center" }}>{(watch("areaCommercial") * 4046.86)?.toFixed(3)}</td> */}
                            <td></td>
                          </tr>
                          <tr>
                            <td>Residential area</td>
                            <td><input type="number"className="form-control" {...register("areaResidential")} id="areaResidential"/></td>
                            {/* <td style={{ textAlign: "center" }}>{(watch("areaResidential") * 4046.86)?.toFixed(3)}</td> */}
                            <td></td>
                          </tr>
                       
                      </tbody>
                      </div>
           

            <br></br>
              <div className="col col-12">
                                    <h2>
                                      {`${t("REV_LAYOUT_ANY_OTHER_REMARK")}`}<span style={{ color: "red" }}>*</span>&nbsp; &nbsp;&nbsp;
                                    </h2>

                                    <label htmlFor="anyOtherFeature">
                                      <input {...register("anyOtherFeature")} type="radio" value="Y" id="anyOtherFeature" />
                                      &nbsp; Yes &nbsp;&nbsp;
                                    </label>
                                    <label htmlFor="anyOtherFeature">
                                      <input {...register("anyOtherFeature")} type="radio" value="N" id="anyOtherFeature" />
                                      &nbsp; No &nbsp;&nbsp;
                                    </label>
                                     {/* {watch("anyOtherFeature") === "Y" && ( */}
                                      <div className="row ">
                                        <Col md={4} lg={4}>
                  <FormControl>
                    {/* <FormLabel id="any_remarks">Any other remark</FormLabel> */}
                    <textarea
                      className="form-control"
                      aria-labelledby="any_remarks"
                      {...register("anyOtherRemarks")}
                      // onChange={(e) => setAnyOtherRemarkTextVal(e.target.value)}
                      // value={anyOtherRemarkTextVal}
                    ></textarea>
                  </FormControl>
                </Col>
                                      </div>
                                    {/* )} */}
                                    </div>
          
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
                        {`${t("REV_LAYOUT_REASON_REVISION_LAYOUT_PLAN")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="reasonRevisionLayoutPlanDoc" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="reasonRevisionLayoutPlanDoc"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          // onChange={(e) => getDocumentData(e?.target?.files[0], "reasonRevisionLayoutPlanDoc")}
                        />
                        {/* <span>
                          
                          {fileStoreId?.reasonRevisionLayoutPlanDoc ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.reasonRevisionLayoutPlanDoc)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.reasonRevisionLayoutPlanDoc && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(reasonRevisionLayoutDoc)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span> */}
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">2</td>
                      <td>
                        {`${t("REV_LAYOUT_COPY_EARLIER_LAYOUT_PLAN")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="earlierApprovedlayoutPlan" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="earlierApprovedlayoutPlan"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          // onChange={(e) => getDocumentData(e?.target?.files[0], "earlierApprovedlayoutPlan")}
                        />
                        {/* <span>
                       
                          {fileStoreId?.earlierApprovedlayoutPlan ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.earlierApprovedlayoutPlan)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.earlierApprovedlayoutPlan && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(earlierApprovedlayoutDoc)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span> */}
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">3</td>
                      <td>
                        {`${t("REV_LAYOUT_COPY_PROPOSED_LAYOUT_PLAN")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="copyProposedlayoutPlan" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="copyProposedlayoutPlan"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          // onChange={(e) => getDocumentData(e?.target?.files[0], "copyProposedlayoutPlan")}
                        ></input>
                        {/* <span>
                       
                          {fileStoreId?.copyProposedlayoutPlan ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.copyProposedlayoutPlan)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.copyProposedlayoutPlan && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(copyProposedlayoutDoc)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span> */}
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">4</td>
                      <td>
                        {`${t("REV_LAYOUT_STATUS_CREATION_THIRD_PARTY_AFFIDAVIT")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="statusCreationAffidavitDoc" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="statusCreationAffidavitDoc"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          // onChange={(e) => getDocumentData(e?.target?.files[0], "statusCreationAffidavitDoc")}
                        ></input>
                        {/* <span>
                        

                          {fileStoreId?.statusCreationAffidavitDoc ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.statusCreationAffidavitDoc)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.statusCreationAffidavitDoc && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(statusCreationAffidavitDocVal)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span> */}
                      </td>
                    </tr>
                    <tr>
                      <td scope="row">5</td>
                      <td>
                        {`${t("REV_LAYOUT_BOARD_RESOLUTION_AUTHORISED_SIGNATORY")}`} <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="boardResolutionAuthSignatoryDoc" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="boardResolutionAuthSignatoryDoc"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          // onChange={(e) => getDocumentData(e?.target?.files[0], "boardResolutionAuthSignatoryDoc")}
                        ></input>
                        {/* <span>
                       
                          {fileStoreId?.boardResolutionAuthSignatoryDoc ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.boardResolutionAuthSignatoryDoc)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.boardResolutionAuthSignatoryDoc && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(boardResolutionAuthSignatoryDocVal)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span> */}
                      </td>
                    </tr>
                    {/* <tr>
                      <td scope="row">6</td>
                      <td>
                        {`${t("REV_LAYOUT_ANY_OTHER")}`}
                        <span style={{ color: "red" }}>*</span>
                      </td>
                      <td>
                        <label for="anyOther" title="Upload Document">
                          <FileUpload style={{ cursor: "pointer" }} color="primary" />
                        </label>
                        <input
                          id="anyOther"
                          type="file"
                          style={{ display: "none" }}
                          accept="application/pdf/jpeg/png"
                          className="form-control"
                          onChange={(e) => getDocumentData(e?.target?.files[0], "anyOther")}
                        ></input>
                        <span>
                          {/* {watch("anyOther") && (
                            <a onClick={() => getDocShareholding(watch("anyOther"), setLoader)} className="btn btn-sm ">
                              <VisibilityIcon color="info" className="icon" />
                            </a>
                          )} */}
                    {/* {fileStoreId?.anyOther ? (
                            <VisibilityIcon color="primary" onClick={() => viewDocument(fileStoreId?.anyOther)}>
                              {" "}
                            </VisibilityIcon>
                          ) : (
                            ""
                          )}
                          {applicantId && !fileStoreId?.anyOther && (
                            <div className="btn btn-sm col-md-4">
                              <IconButton onClick={() => viewDocument(anyOtherDocVal)}>
                                <VisibilityIcon color="info" className="icon" />
                              </IconButton>
                            </div>
                          )}
                        </span>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <div className="col-sm-12 text-right">
              <Button variant="contained" className="btn btn-primary btn-md center-block text-white" type="submit">
                Submit
              </Button>
            </div> */}
          </div>
        </div>
      </div>
      </Collapse>
    </form>
  );
}

export default LayoutPlanClu;
