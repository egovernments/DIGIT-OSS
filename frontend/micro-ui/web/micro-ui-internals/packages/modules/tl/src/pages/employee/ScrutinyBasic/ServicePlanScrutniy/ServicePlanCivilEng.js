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
      setValue("electricDistribution", apiResponse?.additionalDetails?.electricDistribution);
      setValue("sewerLine", apiResponse?.additionalDetails?.sewerLine);
      setValue("stormwater", apiResponse?.additionalDetails?.stormwater);
      setValue("capacityUgt", apiResponse?.additionalDetails?.capacityUgt);
      setValue("capacityStp", apiResponse?.additionalDetails?.capacityStp);
      setValue("specifications", apiResponse?.additionalDetails?.specifications);
      setValue("waterSupply", apiResponse?.additionalDetails?.waterSupply);
      setValue("sewerNetwork", apiResponse?.additionalDetails?.sewerNetwork);
      setValue("stormwaterDrainage", apiResponse?.additionalDetails?.stormwaterDrainage);
      setValue("roadNetwork", apiResponse?.additionalDetails?.roadNetwork);
      setValue("horticlture", apiResponse?.additionalDetails?.horticlture);
      setValue("acreCost", apiResponse?.additionalDetails?.acreCost);
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
              <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "20px", marginBottom: "52px" }}>
                <Row style={{ marginTop: 4, marginBottom: 4 }}>
                  {/* {JSON.stringify(apiResponse?.additionalDetails?.electricDistribution)} */}
                  {/* <h4 className="text-center">Evaluation by Civil Engineer</h4> */}

                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        <h2>
                          {`${t("SP_CIVIL_SCRUTINY_LOCATION_PORTABLE_WATER_CONNECT_WATER-SUPPLY_NETWORK")}`}
                          {/* 1. Showing the location of the potable water, sewer line, treated water line and storm water line to connect the trunk water supply network. */}
                          &nbsp;&nbsp;
                        </h2>
                        {/* <Tooltip title="As per the approved layout plan/building plans">
                  
                     <h2> plan/building plans 
                         </h2> 
                         
                         </Tooltip> */}
                      </Form.Label>
                      <br></br>
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
                  </Col>
                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        {`${t("SP_CIVIL_SCRUTINY_PROPOSED_SOURCE_WATER_SUPPLY_INFORMED_APPLICANT")}`}
                        {/* 2. Proposed source of water supply as informed by the applicant  */}
                        <span style={{ color: "red" }}>*</span>
                        {/* <Tooltip title="Level of stormwater and sewer line in conformity with approved EDC infrastructure works">
                     <h2>approved EDC infrastructure works</h2> </Tooltip> */}
                      </Form.Label>
                    </div>
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
                  </Col>
                  <br></br>
                  {/* <Col  md={6} xxl lg="6">
              <div>
                <Form.Label className={classes.formLabel}>
                Showing the location of the sewer line, and stormwater line to connect the trunk water supply network <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;

                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                disabled={!showActionButton}
                {...register("sewerLine")}
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
                {...register("sewerLine")}
                inline
              ></Form.Check>
            </Col> */}

                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        {`${t("SP_CIVIL_SCRUTINY_CAPACITY_STP_POPULATION_NORMS")}`}
                        {/* 3. The capacity of STP as per population norms. */}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                    </div>
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
                  </Col>
                  <br></br>
                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        {`${t("SP_CIVIL_SCRUTINY_LEVEL_OF_STORM_WATER_CONFIRMITY")}`}
                        {/* 4. Level of storm water and sewer line in conformity with approved EDC infrastructure works. yes 110 <span style={{ color: "red" }}>*</span>  */}
                      </Form.Label>
                    </div>
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
                  </Col>
                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        {`${t("SP_CIVIL_SCRUTINY_CAPACITY_OF_UGT_POPULATION_HEALTH_NORMS")}`}
                        {/* 5. The capacity of UGT as per population health norms. <span style={{ color: "red" }}>*</span>  */}
                      </Form.Label>
                    </div>
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
                  </Col>
                  <br></br>
                  <Col md={6} xxl lg="6" className={classes.formLabel}>
                    <div>
                      <Form.Label>
                        {`${t("SP_CIVIL_SCRUTINY_SPECIFICATION_OF_PUBLIC_HEALTH_DEPARTMENT")}`}
                        {/* 6. Specifications of the Public Health Department. yes <span style={{ color: "red" }}>*</span> &nbsp;&nbsp; */}
                      </Form.Label>
                    </div>
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
                  </Col>
                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        <h2>
                          {`${t("SP_CIVIL_SCRUTINY_SEWER_NETWORK")}`}
                          {/* 7. Sewer network.  */}
                          <span style={{ color: "red" }}>*</span>
                        </h2>
                      </Form.Label>
                    </div>
                    {/* <Col md={8} xxl lg="8"> */}
                    <div height={30} style={{ maxWidth: 320, marginRight: 5 }}>
                      <textarea type="text" className="form-control" disabled={!showActionButton} placeholder="" {...register("specifications")} />
                    </div>
                    {/* </Col> */}
                  </Col>
                  <br></br>
                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        {`${t("SP_CIVIL_SCRUTINY_ROAD_NETWORK")}`}
                        {/* 8. Road network. */}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                    </div>
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
                  </Col>

                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        {`${t("SP_CIVIL_SCRUTINY_STREET_LIGHTENING")}`}
                        {/* 9. Street lightening.  */}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                    </div>
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
                  </Col>
                  <br></br>
                  <Col md={6} xxl lg="6">
                    <div>
                      <Form.Label className={classes.formLabel}>
                        {`${t("SP_CIVIL_SCRUTINY_HORTICULTURE")}`}
                        {/* 10. Horticulture. */}
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                    </div>
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
                  </Col>
                  {/* ///////////////////////////////////////////////// */}
                  {/* <Col  md={6} xxl lg="6">
              <div>
                <Form.Label className={classes.formLabel}>
                Roads network <span style={{ color: "red" }}>*</span> 
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                disabled={!showActionButton}
                {...register("roadNetwork")}
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
                {...register("roadNetwork")}
                inline
              ></Form.Check>
            </Col>
            <br></br>
            <Col  md={6} xxl lg="6">
              <div>
                <Form.Label className={classes.formLabel}>
                Horticulture <span style={{ color: "red" }}>*</span> 
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                disabled={!showActionButton}
                {...register("horticlture")}
                inline
              ></Form.Check>
              <Form.Check
                onCh
                ange={(e) => console.log(e)}
                value="N"
                type="radio"
                id="default-radio"
                label="No"
                name="false"
                disabled={!showActionButton}
                {...register("horticlture")}
                inline
              ></Form.Check>
            </Col>
           
            <Col  md={6} xxl lg="6">
              <div>
                <Form.Label className={classes.formLabel}>
                Street Lightening <span style={{ color: "red" }}>*</span> 
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                disabled={!showActionButton}
                {...register("streetLightening")}
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
                {...register("streetLightening")}
                inline
              ></Form.Check>
            </Col> */}
                  {/* ////////////////////////////////////////////////////////////// */}
                  {/* <Col  md={6} xxl lg="6">
              <div>
                <Form.Label>
                Per acre cost of internal development works <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
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
                {...register("ugt")}
                inline
              ></Form.Check>
            </Col> */}
                  {/* //////////////////////////////////////////////////////////////////////// */}
                  {/* <br></br>
            <Col md={6} xxl lg="6" >
              <div>
                <Form.Label className={classes.formLabel}>
                  <h2>
                  Per acre cost of internal development works <span style={{ color: "red" }}>*</span>
                  </h2>
                </Form.Label>
              </div>
              <div height={30}
                          style={{ maxWidth: 320, marginRight: 5 }}>
              <input type="number" className="form-control"  disabled={!showActionButton} placeholder="" {...register("acreCost")} />
              </div>
              
            </Col>
            <Col  md={6} xxl lg="6">
              <div>
                <Form.Label className={classes.formLabel}>
                Self-certified drawings from chartered engineers that it is by the standard approved template <span style={{ color: "red" }}>*</span> 
                </Form.Label>
              </div>
              <Form.Check
                onChange={(e) => console.log(e)}
                value="Y"
                type="radio"
                id="default-radio"
                label="Yes"
                name="true"
                disabled={!showActionButton}
                {...register("selfCertified")}
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
                {...register("selfCertified")}
                inline
              ></Form.Check>
            </Col>
           
            <br></br> */}
                  {/* ////////////////////////////////////////////////////////////////// */}
                </Row>
                <br></br>

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

export default ServicePlanCivil;
