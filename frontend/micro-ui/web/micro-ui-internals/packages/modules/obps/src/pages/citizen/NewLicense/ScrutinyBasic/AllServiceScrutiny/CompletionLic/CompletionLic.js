import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Collapse from "react-bootstrap/Collapse";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ModalChild from "../../Remarks/ModalChild";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { useStyles } from "../../css/personalInfoChild.style";
import '../../css/personalInfoChild.style.js'

function Completionscrutiny() {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);

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
  } = useForm({});

  const completionLic = (data) => console.log(data);

  const classes = useStyles();

  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  
  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved:"#09cb3d",
    disapproved:"#ff0000",
    info:"#FFB602"
  }

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here",openedModal,data);
    if(openedModal && data){
      setFieldIconColors({...fieldIconColors,[openedModal]:data.data.isApproved?Colors.approved:Colors.disapproved})
    }
      setOpennedModal("");
      setLabelValue("");
  };
  const [selectedFieldData,setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    developer: Colors.info,
    authPersonName: Colors.info,
    authMobileNo1: Colors.info,
    authMobileNo2: Colors.info,
    emailId: Colors.info,
    pan: Colors.info,
    address: Colors.info,
    city: Colors.info,
    pin: Colors.info,
    tehsil: Colors.info,
    district: Colors.info,
    state: Colors.info,
    type: Colors.info,
    lciSignedBy: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info
  })

  const fieldIdList = [{label:"Developer",key:"developer"},{label:"Authorized Person Name",key:"authPersonName"},{label:"Autrhoized Mobile No",key:"authMobileNo1"},{label:"Authorized MobileNo. 2 ",key:"authMobileNo2"},{label:"Email ID",key:"emailId"},{label:"PAN No.",key:"pan"},{label:"Address  1",key:"address"},{label:"Village/City",key:"city"},{label:"Pincode",key:"pin"},{label:"Tehsil",key:"tehsil"},{label:"District",key:"district"},{label:"State",key:"state"},{label:"Status (Individual/ Company/ Firm/ LLP etc.)",key:"type"},{label:"LC-I signed by",key:"lciSignedBy"},{label:"If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)",key:"lciNotSigned"},{label: "Permanent address in case of individual/ registered office address in case other than individual", key:"parmanentAddress"},{label:"Address for communication",key:"addressForCommunication"},{label:"Name of the authorized person to sign the application",key:"authPerson"},{label:"Email ID for communication",key:"emailForCommunication"}]

  return (
  
        
          <form onSubmit={handleSubmit(completionLic)}>
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
        Completion Certificate In Licence Colony
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
        
            <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Completion Certificate In Licence Colony</h4>
            <div className="card">
       
            <Row>
              <Col className="col-4">
                {/* <Form.Group controlId="formGridCase"> */}
                  <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Licence No &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
            <input type="number" className={classes.formControl} placeholder="" {...register("licNo")} disabled />
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Licence No")
                  setLabelValue("Licence No"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
             <ModalChild
              labelmodal={labelValue}
              passmodalData={handlemodaldData}
              displaymodal={smShow}
              onClose={()=>setSmShow(false)}
              selectedFieldData={selectedFieldData}
              fieldValue={fieldValue}
              remarksUpdate={currentRemarks}
            ></ModalChild>
             </div>
                {/* </Form.Group> */}
              </Col>
              <Col className="col-4">
                  <div>
                <Form.Label data-toggle="tooltip" data-placement="top" title="The license is valid at the time of completion certificate">
              <h5 className={classes.formLabel}>completion certificate&nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
             <input type="text" className={classes.formControl} placeholder="" {...register("completionCertificate")}  disabled/>
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("The license is valid at the time of completion certificate")
                  setLabelValue("The license is valid at the time of completion certificate"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Col>
              <Col className="col-4">
                
                 
                  {/* <input type="text" className="form-control" placeholder="" {...register("edcFullypaid")} /> */}
                  <div>
                <Form.Label data-toggle="tooltip"
                    data-placement="top"
                    title=" EDC and IDC be fully paid and bank guarantees on account of
                    IDW are valid.">
              <h5 className={classes.formLabel}>EDC and IDC be fully paid &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
                <input type="text" className={classes.formControl} placeholder="" {...register("edcFullypaid")} disabled />
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("EDC and IDC be fully paid and bank guarantees on account of IDW are valid"),
                  setLabelValue("EDC and IDC be fully paid and bank guarantees on account of IDW are valid"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
                
              </Col>
              <Col className="col-4">
                {/* <Form.Group controlId="formGridState">
                  <Form.Label>
                    <h2> Status of complaint if any. </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("statusOfComplaint")} />
                </Form.Group> */}
                <div>
                <Form.Label >
              <h5 className={classes.formLabel}>Status of complaint if any. &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
                <input type="text" className={classes.formControl} placeholder="" {...register("statusOfComplaint")} disabled />
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Status of complaint if any"),
                  setLabelValue("Status of complaint if any"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Col>
              <Col className="col-4">
                {/* <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Status of total community sites/approval of zoning/building
                    plans and occupation certificate granted."
                  >
                    <h2> Occupation Certificate </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("occupationCertificate")} />
                </Form.Group> */}
                <div>
                <Form.Label data-toggle="tooltip"
                    data-placement="top"
                    title="Status of total community sites/approval of zoning/building
                    plans and occupation certificate granted." >
              <h5 className={classes.formLabel}>Occupation Certificate  &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
                <input type="text" className={classes.formControl} placeholder="" {...register("occupationCertificate")} disabled />
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Status of total community sites/approval of zoning/building plans and occupation certificate granted."),
                  setLabelValue("Status of total community sites/approval of zoning/building plans and occupation certificate granted."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Col>
              <Col className="col-4">
                {/* <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Status of NPNL plots. (detail of NPNL plots and rates
                    approval for NPNL)"
                  >
                    <h2>Status of NPNL plots.</h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("statusNpnlPlot")} />
                </Form.Group> */}
                  <div>
                <Form.Label data-toggle="tooltip"
                    data-placement="top"
                    title=" Status of NPNL plots. (detail of NPNL plots and rates approval for NPNL)" >
              <h5 className={classes.formLabel}>Status of NPNL plots.  &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
                 <input type="text" className={classes.formControl} placeholder="" {...register("statusNpnlPlot")}  disabled/>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal(" Status of NPNL plots. (detail of NPNL plots and rates approval for NPNL)"),
                  setLabelValue(" Status of NPNL plots. (detail of NPNL plots and rates approval for NPNL)"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Col>
              <Col className="col-4">
                {/* <Form.Group controlId="formGridState">
                  <Form.Label data-toggle="tooltip" data-placement="top" title="Status of handing over EWS plots to housing board/allottees">
                    <h2> Housing board/allottees </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("housingBoard")} />
                </Form.Group> */}
                 <div>
                <Form.Label data-toggle="tooltip" data-placement="top" title="Status of handing over EWS plots to housing board/allottees" >
              <h5 className={classes.formLabel}>Housing board/allottees  &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
                <input type="text"  className={classes.formControl} placeholder="" {...register("housingBoard")} disabled/>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Status of handing over EWS plots to housing board/allottees"),
                  setLabelValue("Status of handing over EWS plots to housing board/allottees"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Col>
              <Col className="col-4">
                {/* <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Status regarding handing over of park/internal road/public
                    utility to the concerned authority"
                  >
                    <h2> Concerned Authority </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("concernedAuthority")} />
                </Form.Group> */}
                 <div>
                <Form.Label data-toggle="tooltip"
                    data-placement="top"
                    title=" Status regarding handing over of park/internal road/public utility to the concerned authority" >
              <h5 className={classes.formLabel}>Concerned Authority  &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
                 <input type="text"   className={classes.formControl} placeholder="" {...register("concernedAuthority")}  disabled/>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal(" Status regarding handing over of park/internal road/public utility to the concerned authority"),
                  setLabelValue(" Status regarding handing over of park/internal road/public utility to the concerned authority"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Col>
              <Col className="col-4">
                {/* <Form.Group controlId="formGridState">
                  <Form.Label
                    data-toggle="tooltip"
                    data-placement="top"
                    title=" Handing over community sites to the Government agency and
                    constructed by the Government."
                  >
                    <h2>Handing over community sites </h2>
                  </Form.Label>
                  <input type="text" className="form-control" placeholder="" {...register("handleCommunitySites")} />
                </Form.Group> */}
                 <div>
                <Form.Label  data-toggle="tooltip"
                    data-placement="top"
                    title="Handing over community sites to the Government agency and constructed by the Government.">
              <h5 className={classes.formLabel}>Handing over community sites   &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            {/* <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control> */}
            <input type="text" className={classes.formControl} placeholder="" {...register("handleCommunitySites")} disabled />
                
                <ReportProblemIcon
              style={{
                color:fieldIconColors.developer}}
              onClick={() => {
                  setOpennedModal("Handing over community sites to the Government agency and constructed by the Government."),
                  setLabelValue("Handing over community sites to the Government agency and constructed by the Government."),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
           
             </div>
              </Col>
            </Row>
            <br>
            </br>
           
            <div className="table table-bordered table-responsive">
                  {/* <caption>List of users</caption> */}
                  <thead>
                    <tr>
                       <th class="fw-normal">Sr.No</th>
                       <th class="fw-normal">Field Name</th>
                       <th class="fw-normal">Documents download</th> 
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                       <th class="fw-normal">1</th>
                      <td>
                        <h2> The service plan/estimate copy of approved </h2>
                      </td>
                      <td>
                        {/* <input type="file" className="form-control" placeholder="" {...register("servicePlanApproved")}></input> */}
                        <DownloadForOfflineIcon color="primary" className="mx-1" />
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">2</th>
                      <td>
                        {" "}
                        <h2>The electrical Service plan is approved and verification of service is laid as per the approval.</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("electricalServicePlan")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">3</th>
                      <td>
                        {" "}
                        <h2>Transfer of licensed land to the Government agency falling under 18/24 mtr. Road/green belt/sector road.</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("transferLicensedLand")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">4</th>
                      <td>
                        {" "}
                        <h2>Occupation certificate In case of (Group Housing, Commercial, IT Colony)</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("occupationCertificateCommercial")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">5</th>
                      <td>
                        {" "}
                        <h2>Updated compliance with Rules 24, 26(2), 27 & 28.</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("updatedCompliance")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">6</th>
                      <td>
                        {" "}
                        <h2>Submit a report regarding infrastructure augmentation charges.</h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("reportInfrastructure")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">7</th>
                      <td>
                        {" "}
                        <h2>Third-party audit on 15% profitability and CA certificate regarding 15% profit.</h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("thirdPartyAudit")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">8</th>
                      <td>
                        {" "}
                        <h2>
                          Status of development work along with site photographs and CD/DVD regarding completion of public health services, and
                          internal roads{" "}
                        </h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("statusDevelopment")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">9</th>
                      <td>
                        {" "}
                        <h2>Report regarding functional of internal services and connection of external services of HUDA/MC. </h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("functionalServices")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">10</th>
                      <td>
                        {" "}
                        <h2>Affidavit of no unauthorized construction/addition/ alteration after the issuance of completion certificate.</h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("affidavitUnauthorized")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">11</th>
                      <td>
                        {" "}
                        <h2>NOC from MOEF required.</h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("nocRequired")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">12</th>
                      <td>
                        {" "}
                        <h2>NOC from fire safety and certificate from structural stability.</h2>
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("fireSafetyCertificate")}></input>
                      </td>
                    </tr>
                    <tr>
                       <th class="fw-normal">13</th>
                      <td>
                        {" "}
                        <h2>
                          Access permission from NHAI if the site abuts with NH/Scheduled Road and status regarding construction within green belt
                          along NH/Scheduled road.
                        </h2>{" "}
                      </td>
                      <td>
                        <input type="file" className="form-control" placeholder="" {...register("accessPermission")}></input>
                      </td>
                    </tr>
                  </tbody>
              
              </div>
           

            <Row className="justify-content-end">
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="save" aria-label="right-end">
                Save as Draft
              </Button>
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                Submit
              </Button>
            </Row>
            </div>
            </Card>
            </div>
            </Collapse>
          </form>
      
    
  );
}

export default Completionscrutiny;
