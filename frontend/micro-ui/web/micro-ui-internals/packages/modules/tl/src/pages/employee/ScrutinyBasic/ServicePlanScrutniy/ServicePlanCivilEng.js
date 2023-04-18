// import React, { useState, useEffect, useContext } from "react";
// import { Card, Row, Col, Form, Button } from "react-bootstrap";
// const ServicePlanCivil = () =>
// {
//     const userRoles = Digit.UserService.getUser()?.info?.roles.map((item) => item.code)  || [];
//     const showActionButton = userRoles.includes("CE_HQ")
//     console.log("logg123" ,userRoles, showActionButton );
//     return (
//     <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
//               <Row>
//                     <Col className="col-4">
//                   <Form.Label>
//                     <div>
//                       <label>
//                         <h2 data-toggle="tooltip" data-placement="top" title=" Is the uploaded Service Plan in accordance to the Standard designs?">
//                           Uploaded Service Plan <span style={{ color: "red" }}>*</span>
//                         </h2>
//                       </label>
//                     </div>

//                     <div className="d-flex flex-row">
//                       <input
//                         type="radio"
//                         disabled={!showActionButton}
//                         value="Yes"
//                         //  checked={apiResponse?.selfCertifiedDrawingsFromCharetedEng === "Y" ? true : false}
//                       />
//                       <label className="m-0  mx-2" for="Yes">
//                         Yes
//                       </label>
//                       <input
//                         type="radio"
//                         disabled={!showActionButton}
//                         value="No"
//                         //  checked={apiResponse?.selfCertifiedDrawingsFromCharetedEng === "N" ? true : false}
//                       />
//                       <label className="m-0 mx-2" for="No">
//                         No
//                       </label>
//                       {/* <ReportProblemIcon
//                         style={{
//                           color: fieldIconColors.selfCertifiedDrawingsFromCharetedEng,
//                         }}
//                         onClick={() => {
//                           setOpennedModal("selfCertifiedDrawingsFromCharetedEng");
//                           setLabelValue("Uploaded Service Plan"),
//                             setSmShow(true),
//                             console.log("modal open"),
//                             setFieldValue(apiResponse !== null ? apiResponse.selfCertifiedDrawingsFromCharetedEng : null);
//                         }}
//                       ></ReportProblemIcon> */}
//                     </div>
//                   </Form.Label>
//                 </Col>
//               </Row>
// </Card>
//     );
// };
// export default ServicePlanCivil;

///////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
// import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import Tooltip from '@mui/material/Tooltip';
// import IconButton from '@mui/material/IconButton';
import "../css/personalInfoChild.style.js";
import { useStyles } from "../css/personalInfoChild.style.js";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useTranslation } from "react-i18next";

// const ServicePlanCivil = () => {
function ServicePlanCivil(props) {
  const userRoles = Digit.UserService.getUser()?.info?.roles.map((item) => item.code) || [];
  const showActionButton = userRoles.includes("CE_HQ");

  // console.log("logg123" ,userRoles, showActionButton );
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const apiResponse = props.apiResponse;
  const classes = useStyles();
  const { t } = useTranslation();

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    getValues,
  } = useForm({
    mode: "onChange",

    shouldFocusError: true,
  });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState();

  const [developerDataLabel, setDeveloperDataLabel] = useState([]);

  const servicePlan = (data) => {
    console.log("tcp18", data);
  };

  const handleClose = () => {
    setOpen(false);
    window.location.href = `/digit-ui/employee`;
  };
  useEffect(() => {
    if (developerDataLabel) {
      setValue("electricInfra", apiResponse?.additionalDetails?.electricInfra);
      setValue("electricInfraRaemarks", apiResponse?.additionalDetails?.electricInfraRaemarks);
      setValue("electricDistribution", apiResponse?.additionalDetails?.electricDistribution);
      setValue("electricDistributionRemarks", apiResponse?.additionalDetails?.electricDistributionRemarks);
      setValue("sourceWater", apiResponse?.additionalDetails?.sourceWater);
      setValue("sourceWaterRemarks", apiResponse?.additionalDetails?.sourceWaterRemarks);
      setValue("stormwater", apiResponse?.additionalDetails?.stormwater);
      setValue("stormwaterRemarks", apiResponse?.additionalDetails?.stormwaterRemarks);
      setValue("capacityUgt", apiResponse?.additionalDetails?.capacityUgt);
      setValue("capacityUgtRemarks", apiResponse?.additionalDetails?.capacityUgtRemarks);
      setValue("capacityStp", apiResponse?.additionalDetails?.capacityStp);
      setValue("capacityStpRemarks", apiResponse?.additionalDetails?.capacityStpRemarks);
      setValue("specifications", apiResponse?.additionalDetails?.specifications);
      setValue("waterSupply", apiResponse?.additionalDetails?.waterSupply);
      setValue("waterSupplyRemarks", apiResponse?.additionalDetails?.waterSupplyRemarks);
      setValue("sewerNetwork", apiResponse?.additionalDetails?.sewerNetwork);
      setValue("sewerNetworkRemarks", apiResponse?.additionalDetails?.sewerNetworkRemarks);
      setValue("stormwaterDrainage", apiResponse?.additionalDetails?.stormwaterDrainage);
      setValue("stormwaterDrainageRemarks", apiResponse?.additionalDetails?.stormwaterDrainageRemarks);
      setValue("roadNetwork", apiResponse?.additionalDetails?.roadNetwork);
      setValue("horticlture", apiResponse?.additionalDetails?.horticlture);
      setValue("ugtRemarks", apiResponse?.additionalDetails?.ugtRemarks);
      setValue("ugt", apiResponse?.additionalDetails?.ugt);
      setValue("selfCertified", apiResponse?.additionalDetails?.selfCertified);
      setValue("streetLightening", apiResponse?.additionalDetails?.streetLightening);
    }
  }, [apiResponse]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log("logger12321", value);
      props.setAdditionalDetails(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(servicePlan)}>
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
            Evaluation by Civil Engineer
          </span>
          {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
        </div>
        <Collapse in={open2}>
          <div id="example-collapse-text">
            <Card>
              <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Evaluation by Civil Engineer </h4>
              {/* <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Electrical Plan </h4> */}
              {/* <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}> */}

              {/* {JSON.stringify(apiResponse?.additionalDetails?.electricDistribution)} */}
              {/* <h4 className="text-center">Evaluation by Civil Engineer</h4> */}

              <div className="card">
                <Form>
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {`${t("SP_CIVIL_SCRUTINY_SR_NO")}`}
                            {/* Sr.No */}
                          </TableCell>
                          <TableCell align="left">
                            {`${t("SP_CIVIL_SCRUTINY_DESCRIPTIONS")}`}
                            {/* Description */}
                          </TableCell>
                          <TableCell align="left">
                            {`${t("SP_CIVIL_SCRUTINY_CONDITION")}`}
                            {/* Conditional */}
                          </TableCell>
                          <TableCell align="Left">
                            {`${t("SP_CIVIL_SCRUTINY_REMARK")}`}
                            {/* Remarks */}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.formLabel}>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell style={{ width: "50px" }}>1</TableCell>
                          <TableCell align="left" style={{ width: "350px" }}>
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_CIVIL_SCRUTINY_LOCATION_PORTABLE_WATER_CONNECT_SUPPLY_NETWORK")}`}
                                  {/* Showing the location of the potable water, sewer line, treated water line and storm water line to connect the trunk water supply network. */}
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left" style={{ width: "200px" }}>
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                //   disabled={!}
                                disabled={!showActionButton}
                                {...register("electricInfra")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("electricInfra")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea1"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("electricInfraRaemarks")}
                              inline
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>2</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                {`${t("SP_CIVIL_SCRUTINY_PROPOSED_SOURCE_WATER_SUPPLY_INFORMED")}`}
                                {/* Proposed source of water supply as informed by the applicant  */}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("electricDistribution")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("electricDistribution")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>

                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea2"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("electricDistributionRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>

                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>3</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                {`${t("SP_CIVIL_SCRUTINY_CAPACITY_OF_STP_POPULATION_NORMS")}`}
                                {/* The capacity of STP as per population norms. */}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("stormwater")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("stormwater")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea3"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("stormwaterRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>4</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                {`${t("SP_CIVIL_SCRUTINY_LEVEL_OF_STORM_WATER_CONFIRMITY_WORKS")}`}
                                {/* Level of storm water and sewer line in conformity with approved EDC infrastructure works. yes 110 <span style={{ color: "red" }}>*</span>  */}
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("sourceWater")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("sourceWater")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea4"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("sourceWaterRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>5</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                {`${t("SP_CIVIL_SCRUTINY_CAPACITY_UGT_POPULATION_HEALTH_NORMS")}`}
                                {/* The capacity of UGT as per population health norms. */}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("capacityUgt")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("capacityUgt")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea5"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("capacityUgtRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>6</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label>
                                {`${t("SP_CIVIL_SCRUTINY_SPECIFICATION_PUBLIC_HEALTH_DEPARTMENT")}`}
                                {/* Specifications of the Public Health Department. yes  */}
                                <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("capacityStp")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("capacityStp")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>

                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea6"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("capacityStpRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>7</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_CIVIL_SCRUTINY_SEWER_NETWORKS")}`}
                                  {/* Sewer network.  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("ugt")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("ugt")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea7a"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("ugtRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>8</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                {`${t("SP_CIVIL_SCRUTINY_ROAD_NETWORKS")}`}
                                {/* Road network. */}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("waterSupply")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("waterSupply")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea8"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("waterSupplyRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>9</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                {`${t("SP_CIVIL_SCRUTINY_STREET_LIGHTENINGS")}`}
                                {/* Street lightening. */}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("sewerNetwork")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("sewerNetwork")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea7c"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("sewerNetworkRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>10</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                {`${t("SP_CIVIL_SCRUTINY_HORTICULTURES")}`}
                                {/* Horticulture. */}
                                <span style={{ color: "red" }}>*</span>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="Y"
                                type="radio"
                                id="default-radio"
                                label="Yes"
                                name="true"
                                disabled={!showActionButton}
                                {...register("stormwaterDrainage")}
                                inline
                              ></Form.Check>
                              <Form.Check
                                onChange={(e) => console.log(e)}
                                value="N"
                                type="radio"
                                id="default-radio"
                                label="No"
                                name="false"
                                disabled={!showActionButton}
                                {...register("stormwaterDrainage")}
                                inline
                              ></Form.Check>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea7d"
                              placeholder="Enter your Remarks"
                              autoFocus
                              disabled={!showActionButton}
                              onChange={(e) => console.log(e)}
                              {...register("stormwaterDrainageRemarks")}
                              rows="3"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Form>
              </div>

              {/* <div class="row">
            <div class="col-sm-12 text-right">
              <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                Submit
              </button>
            </div>
          </div> */}
              {/* <Row className="justify-content-end">
            <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="save" aria-label="right-end">
              Save as Draft
            </Button>
            <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
              Submit
            </Button>
          </Row> */}
            </Card>
            {/* </Card> */}
          </div>
        </Collapse>
      </form>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Electric Plan Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Your Electric Plan is submitted successfully{" "}
              <span>
                <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
              </span>
            </p>
            <p>
              Please Note down your Application Number <span style={{ padding: "5px", color: "blue" }}>{/* {applicationNumber} */}</span> for further
              assistance
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ServicePlanCivil;
