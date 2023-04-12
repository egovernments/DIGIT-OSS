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

import React, { useState, useEffect, useTransition } from "react";
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
function ServicePlanExternal(props) {
  const userRoles = Digit.UserService.getUser()?.info?.roles.map((item) => item.code) || [];
  const showActionButton = userRoles.includes("FMDA" || "HSVP" || "GMDA" || "DTP_HQ");
  // console.log("logg123" ,userRoles, showActionButton );
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const apiResponse = props.apiResponse;
  const idwDataTreade = props.idwDataTreade;
  const edcDataTreade = props.edcDataTreade;
  const classes = useStyles();

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
  const { t } = useTranslation();
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
      setValue("electricInfra", apiResponse?.externalAgency?.electricInfra);
      setValue("waterSupply", apiResponse?.externalAgency?.waterSupply);
      setValue("sewerage", apiResponse?.externalAgency?.sewerage);
      setValue("stormWaterDrainage", apiResponse?.externalAgency?.stormWaterDrainage);
      setValue("roads", apiResponse?.externalAgency?.roads);
      setValue("horticulture", apiResponse?.externalAgency?.horticulture);
      setValue("anyApplicable", apiResponse?.externalAgency?.anyApplicable);
      setValue("maintenanceServices", apiResponse?.externalAgency?.maintenanceServices);
      setValue("totalDevelopmentCost", apiResponse?.externalAgency?.totalDevelopmentCost);
      setValue("developmentCost", apiResponse?.externalAgency?.developmentCost);
      setValue("netDevelopmentCost", apiResponse?.externalAgency?.netDevelopmentCost);
      setValue("bGRequired", apiResponse?.externalAgency?.bGRequired);
      setValue("bGRequiredSPE", apiResponse?.externalAgency?.bGRequiredSPE);
      setValue("anyApplicable", apiResponse?.externalAgency?.anyApplicable);
      setValue("streetLights", apiResponse?.externalAgency?.streetLights);
    }
  }, [apiResponse]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log("logger12321", value);
      props.setExternalAgencies(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const totalArea = apiResponse?.totalArea;

  useEffect(() => {
    const val = watch("maintenanceServices") - watch("totalDevelopmentCost");
    console.log("val==", val);
    setValue("netDevelopmentCost", isNaN(val) ? "N/A" : val?.toFixed(2));
  }, [watch("maintenanceServices"), watch("totalDevelopmentCost")]);

  useEffect(() => {
    const value = watch("netDevelopmentCost") * 0.25;
    console.log("val==", value);
    setValue("bGRequired", isNaN(value) ? "N/A" : value?.toFixed(2));
  }, [watch("netDevelopmentCost")]);

  useEffect(() => {
    const value = watch("bGRequired") - idwDataTreade;
    console.log("val==", value);
    setValue("bGRequiredSPE", isNaN(value) ? "N/A" : value?.toFixed(2));
  }, [watch("bGRequired")]);

  useEffect(() => {
    const value = watch("totalDevelopmentCost") / totalArea;
    console.log("val==", value);
    setValue("developmentCost", isNaN(value) ? "N/A" : value?.toFixed(2));
  }, [watch("totalDevelopmentCost")]);

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
            Evaluation by External Agencies
          </span>
          {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
        </div>
        <Collapse in={open2}>
          <div id="example-collapse-text">
            <Card>
              <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Evaluation by External Agencies </h4>
              {/* <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Electrical Plan </h4> */}
              {/* <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}> */}

              <div className="card">
                <Form>
                  <TableContainer>
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            {`${t("SP_EXTERNAL_SCRUTINY_SR_NO")}`}
                            {/* // Sr.No */}
                          </TableCell>
                          <TableCell align="left">
                            {`${t("SP_EXTERNAL_SCRUTINY_DESCRIPTION")}`}
                            {/* // Description */}
                          </TableCell>
                          <TableCell align="left">
                            {`${t("SP_EXTERNAL_SCRUTINY_AMOUNT_IN_LAKHS")}`}
                            {/* Amount in lacs. */}
                          </TableCell>
                          {/* <TableCell align="right">
						Remarks
						</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>1</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_WATER_SUPPLY")}`}
                                  {/* Water Supply  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={!showActionButton}
                                  placeholder=""
                                  {...register("waterSupply")}
                                />
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              placeholder="Enter your Remarks"
              autoFocus
          
              rows="3"
           
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>2</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_SEWARAGE")}`}
                                  {/* Sewerage  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input type="number" className="form-control" disabled={!showActionButton} placeholder="" {...register("sewerage")} />
                              </div>
                              {/* </div> */}
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea2"
              placeholder="Enter your Remarks"
              autoFocus
           
              rows="3"
           
            />
                                        </TableCell> */}
                        </TableRow>

                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>3</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_STORM_WATER_DRAINAGE")}`}
                                  {/* Storm water Drainage  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={!showActionButton}
                                  placeholder=""
                                  {...register("stormWaterDrainage")}
                                />
                              </div>
                              {/* </div> */}
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea3"
              placeholder="Enter your Remarks"
              autoFocus
          
              rows="3"
  
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>4</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_ROADS")}`}
                                  {/* Roads */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input type="number" className="form-control" disabled={!showActionButton} placeholder="" {...register("roads")} />
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea4"
              placeholder="Enter your Remarks"
              autoFocus
           
              rows="3"
           
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>5</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_STREET_LIGHTS")}`}
                                  {/* Street Lights  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={!showActionButton}
                                  placeholder=""
                                  {...register("streetLights")}
                                />
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea5"
              placeholder="Enter your Remarks"
              autoFocus
            rows="3"
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>6</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_HORTICULTURE")}`}
                                  {/* Horticulture  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={!showActionButton}
                                  placeholder=""
                                  {...register("horticulture")}
                                />
                              </div>
                            </FormControl>
                          </TableCell>

                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea6"
              placeholder="Enter your Remarks"
              autoFocus
            
              rows="3"
           
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>7</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_ANY_OTHER")}`}
                                  {/* Any other, if applicable  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={!showActionButton}
                                  placeholder=""
                                  {...register("anyApplicable")}
                                />
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7a"
              placeholder="Enter your Remarks"
              autoFocus
            
              rows="3"
      
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>8</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_MAINTENANCE_SERVICE_10YEARS")}`}
                                  {/* Maintenance of services for 10 years */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={!showActionButton}
                                  placeholder=""
                                  {...register("maintenanceServices")}
                                  id="maintenanceServices"
                                />
                                {/* <label htmlFor="sum">Total: {(watch("maintenanceServices"))?.toFixed(2)}</label>&nbsp;&nbsp; */}
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7b"
              placeholder="Enter your Remarks"
              autoFocus
              onChange={(e) => {
                setDeveloperRemarks({ data: e.target.value });
                setRemarksEntered(e.target.value);
              }}
              rows="3"
              value={RemarksDeveloper.data}
            />
                                        </TableCell>
                             */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>9</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_TOTAL_DEVELOPMENT_COST")}`}
                                  {/* Total Development Cost  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  disabled={!showActionButton}
                                  placeholder=""
                                  {...register("totalDevelopmentCost")}
                                  id="totalDevelopmentCost"
                                />
                                {/* <label htmlFor="sum">Total: {(watch("totalDevelopmentCost"))?.toFixed(2)}</label>&nbsp;&nbsp; */}
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7c"
              placeholder="Enter your Remarks"
              autoFocus
            
              rows="3"
          
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>10</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_DEVELOPMENT_COST_PER_ACRE")}`}
                                  {/* Development Cost of per acre  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input type="number" className="form-control" disabled placeholder="" {...register("developmentCost")} />
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7d"
              placeholder="Enter your Remarks"
              autoFocus
            
              rows="3"
            
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>11</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_NET_DEVELOPMENT_COST")}`}
                                  {/* Net Development Cost  */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input type="number" className="form-control" disabled placeholder="" {...register("netDevelopmentCost")} />
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7e"
              placeholder="Enter your Remarks"
              autoFocus
             rows="3"
          />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>12</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_25%_BG_REQUIRED")}`}
                                  {/* 25% BG required */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input type="number" className="form-control" disabled placeholder="" {...register("bGRequired")} />
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7gi"
              placeholder="Enter your Remarks"
              autoFocus
           
              rows="3"
       
            />
                                        </TableCell> */}
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell>13</TableCell>
                          <TableCell align="left">
                            <div>
                              <Form.Label className={classes.formLabel}>
                                <h2>
                                  {`${t("SP_EXTERNAL_SCRUTINY_BG_REQUIRED_DEMANDED")}`}
                                  {/* BG required to be demanded for SPE */}
                                  <span style={{ color: "red" }}>*</span>
                                </h2>
                              </Form.Label>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <FormControl>
                              <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                                <input type="number" className="form-control" disabled placeholder="" {...register("bGRequiredSPE")} />
                              </div>
                            </FormControl>
                          </TableCell>
                          {/* <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7gii"
              placeholder="Enter your Remarks"
              autoFocus
            
              rows="3"
         
            />
                                        </TableCell> */}
                        </TableRow>
                        {/* <TableRow
						
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell >
							
							</TableCell>
							<TableCell  align="left">
                            <h2>
                            iii. Area under Green belt -
                    &nbsp;&nbsp;
                  </h2>
							</TableCell>
							<TableCell align="left">
                            <FormControl>
                            <div className="row">  
                       
                        <div className="d-flex flex-row align-items-center my-1">
                         
                          <label htmlFor="areaUnderGreenBelt">
                          <input {...register("areaUnderGreenBelt")} type="radio" value="Y" id="areaUnderGreenBelt" />
                          &nbsp; &nbsp; Yes &nbsp;&nbsp;
                        </label>
                        <label htmlFor="areaUnderGreenBelt">
                          <input {...register("areaUnderGreenBelt")} type="radio" value="N" id="areaUnderGreenBelt" />
                          &nbsp;&nbsp;  No &nbsp;&nbsp;
                        </label>
                        </div></div>
           
    
                </FormControl>
							</TableCell>
                            <TableCell align="left">
                                        <textarea
              class="form-control"
              id="exampleFormControlTextarea7giii"
              placeholder="Enter your Remarks"
              autoFocus
           
              rows="3"
          
            />
                                        </TableCell>
                            
							
						</TableRow> */}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Form>
              </div>

              {/*           
          <br></br>
        </Card> */}
            </Card>
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

export default ServicePlanExternal;
