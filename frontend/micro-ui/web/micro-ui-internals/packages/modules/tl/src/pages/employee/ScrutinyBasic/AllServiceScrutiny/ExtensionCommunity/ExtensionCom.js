import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ModalChild from "../../Remarks/ModalChild";
import Collapse from "react-bootstrap/Collapse";
import { useStyles } from "../../css/personalInfoChild.style";
import '../../css/personalInfoChild.style.js'
import FormControl from "@mui/material/FormControl";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

function ExtensionCom(props) {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);
   const apiData = props.apiResponse;
  const dataIcons = props.dataForIcons;
  const applicationStatus = props.applicationStatus;

  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };

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


  const extensionCom = (data) => console.log(data);
   
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
    licenseNo: Colors.info,

    selectLicence: Colors.info,
    validUpto: Colors.info,
    renewalRequiredUpto: Colors.info,
    periodOfRenewal: Colors.info,
    colonizerName: Colors.info,
    colonyType: Colors.info,
    areaAcres: Colors.info,
    sectorNo: Colors.info,
    revenueEstate: Colors.info,
    developmentPlan: Colors.info,
    tehsil: Colors.info,
    district: Colors.info,
    appliedBy: Colors.info,
    outstandingDues: Colors.info,
    typeOfCommunitySite: Colors.info,
    licenceRenewd: Colors.info,
    areaInAcers: Colors.info,
    validUpTo: Colors.info,
    applyedForExtentionPerioud: Colors.info,
    amount: Colors.info,
    copyOfBoardResolution: Colors.info,
    justificationForExtention: Colors.info,
    proofOfOwnershipOfCommunity: Colors.info,
    proofOfOnlinePaymentOfExtention: Colors.info,
    explonatoryNotForExtention: Colors.info,
    uploadRenewalLicenseCopy: Colors.info,
    locationOfApplied: Colors.info,
    anyOtherDocumentByDirector: Colors.info
  })

  const fieldIdList = [
   { label: "Licence No", key: "licenseNo" },
    { label: "selectLicence", key: "selectLicence" },
    {label:"Valid Upto",key:"validUpto"},
    {label:"Renewal required upto",key:"renewalRequiredUpto"},
    {label:"Period of renewal(In Months)",key:"periodOfRenewal"},
    {label:"Name of Colonizer",key:"colonizerName"},
    {label:"Type of Colony",key:"colonyType"},
    {label:"Area in Acres",key:"areaAcres"},
    {label:"Sector No",key:"sectorNo"},
    {label:"Revenue estate",key:"revenueEstate"},
    {label:"Development Plan",key:"developmentPlan"},
    {label:"Tehsil",key:"tehsil"},
    {label:"District",key:"district"},
    {label:"Applied by",key:"appliedBy"},
    {label:"Autrhoized Mobile No",key:"authMobileNo1"},
    {label:"Authorized MobileNo. 2 ",key:"authMobileNo2"},
    {label:"Email ID",key:"emailId"},
    {label:"PAN No.",key:"pan"},
    {label:"Address  1",key:"address"},
    {label:"Village/City",key:"city"},
    {label:"Pincode",key:"pin"},
    {label:"Tehsil",key:"tehsil"},
    {label:"District",key:"district"},
    {label:"State",key:"state"},
    {label:"Status (Individual/ Company/ Firm/ LLP etc.)",key:"type"},
    {label:"LC-I signed by",key:"lciSignedBy"},
    {label:"If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)",key:"lciNotSigned"},
    {label: "Permanent address in case of individual/ registered office address in case other than individual", key:"parmanentAddress"},
    {label:"Address for communication",key:"addressForCommunication"},
    {label:"Name of the authorized person to sign the application",key:"authPerson"},
    {label:"Email ID for communication",key:"emailForCommunication"}]

  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === item.label);
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = {
            ...tempFieldColorState,
            [item.key]:
              fieldPresent[0].isApproved === "In Order"
                ? Colors.approved
                : fieldPresent[0].isApproved === "Not In Order"
                ? Colors.disapproved
                : fieldPresent[0].isApproved === "Conditional"
                ? Colors.Conditional
                : Colors.info,
          };
        }
      }
    });

    setFieldIconColors(tempFieldColorState);
  };

  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...");
  }, [dataIcons]);

  return (
    <form onSubmit={handleSubmit(extensionCom)}>
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
        Extension (construction in community sites)
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card 
       style={{ width: "126%", border: "5px solid #1266af" }}
      >
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Extension (construction in community sites)</h4>
        <div className="card">
         <div>
      <div className="row gy-3">
        <div className="col col-3">
          <h2>
            Licence No.<span style={{ color: "red" }}>*</span>
          </h2>
          <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="LC_XXXXX" {...register("licenseNo")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.licenseNo,
                      }}
                      onClick={() => {
                        setOpennedModal("licenseNo");
                        setLabelValue("Licence No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.licenseNo : null);
                      }}
                    ></ReportProblemIcon>
                    <ModalChild
                      labelmodal={labelValue}
                      passmodalData={handlemodaldData}
                      displaymodal={smShow}
                      onClose={() => setSmShow(false)}
                      selectedFieldData={selectedFieldData}
                      fieldValue={fieldValue}
                      remarksUpdate={currentRemarks}
                      applicationStatus={applicationStatus}
                    ></ModalChild>
            </div>
          </div>
        
        </div>

          <div className="col col-3 ">
            <h2>
              Select Licence<span style={{ color: "red" }}>*</span>
            </h2>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="" {...register("selectLicence")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.selectLicence,
                      }}
                      onClick={() => {
                        setOpennedModal("selectLicence");
                        setLabelValue("Select Licence"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.selectLicence : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
            
            
          </div>
        {/* )} */}
      </div>

      {/* {showField.other && ( */}
        <div className="row gy-3 mt-3">
          <div className="col col-3 ">
            <FormControl>
              <h2>
                Valid Upto <span style={{ color: "red" }}>*</span>
              </h2>

             
            </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="date" className="form-control" placeholder="" {...register("validUpto")} disabled />
           <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.validUpto,
                      }}
                      onClick={() => {
                        setOpennedModal("validUpto");
                        setLabelValue("Valid Upto"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.selectLicence : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
            
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.validUpto && errors?.validUpto?.message}
            </h3>
          </div>
         
          <div className="col col-3 ">
            <FormControl>
              <h2>
                Name of Colonizer <span style={{ color: "red" }}>*</span>
              </h2>

            </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="" {...register("colonizerName")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.colonizerName,
                      }}
                      onClick={() => {
                        setOpennedModal("colonizerName");
                        setLabelValue("Name of Colonizer"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.colonizerName : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
            
            {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.colonizerName && errors?.colonizerName?.message}
            </h3> */}
          </div>
        </div>
      {/* )} */}

      {/* {showField.other && ( */}
        <div className="row gy-3 mt-3">
          <div className="col col-3 ">
            <FormControl>
              <h2>
                Type of Colony
                <span style={{ color: "red" }}>*</span>
              </h2>

              
            </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="" {...register("colonyType")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.colonyType,
                      }}
                      onClick={() => {
                        setOpennedModal("colonyType");
                        setLabelValue("Type of Colony"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.colonyType : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
            

           
            {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.colonyType && errors?.colonyType?.message}
            </h3> */}
          </div>

          <div className="col col-3 ">
            <FormControl>
              <h2>
                Area in Acres
                <span style={{ color: "red" }}>*</span>
              </h2>
            </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="" {...register("areaAcres")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.areaAcres,
                      }}
                      onClick={() => {
                        setOpennedModal("areaAcres");
                        setLabelValue("Area in Acres"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.areaAcres : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
          
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.areaAcres && errors?.areaAcres?.message}
            </h3>
          </div>

          <div className="col col-3 ">
            <FormControl>
              <h2>
                Sector No. <span style={{ color: "red" }}>*</span>
              </h2>

              
            </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="" {...register("sectorNo")} disabled/>
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.sectorNo,
                      }}
                      onClick={() => {
                        setOpennedModal("sectorNo");
                        setLabelValue("Sector No"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.sectorNo : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
           
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.sectorNo && errors?.sectorNo?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>Revenue estate</h2>

            </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="" {...register("revenueEstate")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.revenueEstate,
                      }}
                      onClick={() => {
                        setOpennedModal("selectLicence");
                        setLabelValue("Revenue estate"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.revenueEstate : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
           
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.revenueEstate && errors?.revenueEstate?.message}
            </h3>
          </div>
          <div className="col col-3 ">
            Development Plan
          
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="" {...register("developmentPlan")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developmentPlan,
                      }}
                      onClick={() => {
                        setOpennedModal("developmentPlan");
                        setLabelValue("Development Plan"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.developmentPlan : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
         
          </div>
          
        </div>
      {/* )} */}

      <div className="row gy-3 mt-3">
        <div className="col col-3 ">
          <FormControl>
            <h2>Tehsil</h2>
            
            
          </FormControl>
          <div style={{ display: "flex", placeItems: "center" }}>
          <input type="text" className="form-control" placeholder="" {...register("tehsil")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.tehsil,
                      }}
                      onClick={() => {
                        setOpennedModal("tehsil");
                        setLabelValue("Tehsil"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData?.newAdditionalDetails?.tehsil : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
         
        </div>
        <div className="col col-3 ">
          <FormControl>
            <h2>District</h2>
            
          </FormControl>
          <div style={{ display: "flex", placeItems: "center" }}>
          <input type="text" className="form-control" placeholder="" {...register("district")} disabled />
          <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.district,
                      }}
                      onClick={() => {
                        setOpennedModal("district");
                        setLabelValue("District"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData?.newAdditionalDetails?.district : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
        </div>
      </div>
    </div> 
       <div className="row gy-3 mt-3">
            <div className="col col-3 "><FormControl>
            <h2>Applied by <span style={{ color: "red" }}>*</span></h2>
          </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
                <input type="text" className="form-control" placeholder="" {...register("appliedBy")} disabled />
          <div>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.appliedBy}}
              onClick={() => {
                  setOpennedModal("appliedBy")
                  setLabelValue("Applied by"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
              }}
            ></ReportProblemIcon>
             </div>
             </div>
             </div>
            {/* <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Outstanding dues if any <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("outstandingDues")} />
            </Form.Group> */}
            <Col className="col-3">
                 <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Outstanding dues if any &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
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
             </div>
              </Col>
                <Col className="col-3">
                 <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Type of community site&nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
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
             
             </div>
              </Col>
              <Col className="col-3">
                 <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Area in Acres &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
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
             </div>
              </Col>
          </div>
          <Row className="col-12">
           
          

            {/* <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Area in Acres
                  <span style={{ color: "red" }}>*</span>
                </h2>
              </Form.Label>
              <input type="text" className="form-control" placeholder="" {...register("areainAcres")} />
            </Form.Group> */}
            
            {/* <Form.Group as={Col} controlId="formGridState">
              <Form.Label>
                <h2>
                  {" "}
                  Community site valid up to <span style={{ color: "red" }}>*</span>{" "}
                </h2>
              </Form.Label>
              <input type="Date" className="form-control" placeholder="" {...register("communitySite")} />
            </Form.Group> */}
            <Col className="col-3">
                 <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Community site valid up to &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
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
             </div>
              </Col>
                <Col className="col-3">
                 <div>
                <Form.Label
                 data-toggle="tooltip"
                data-placement="top"
                title="Apply for an Extension of time for construction of the
                  community site (in years)"
                >
              <h5 className={classes.formLabel}>Extension of time &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
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
             </div>
              </Col>
                 <Col className="col-3">
                 <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Amount (Rs.)  &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
            <Form.Control
              className={classes.formControl}
              placeholder=""
              disabled
            ></Form.Control>
                
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
             </div>
              </Col>
          </Row>
        <div>
        
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
                      Copy of Board resolution in favour of authorized signatory, applying for case (if applicable)
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("copyBoardResolution")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
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
                                       </div>
                                 </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>
                      {" "}
                      Justification for extension in time period for construction of community site <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("justificationExtension")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
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
                                       </div>
                                 </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>
                      {" "}
                      Proof of ownership of community site (in case of the extension is sought by an applicant other than the licensee) .{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("proofOwnership")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
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
                                       </div>
                                 </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>
                      {" "}
                      Proof of online payment of extension fees at the rates provided in Schedule-C to these Rules.{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("proofOnlinePayment")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
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
                                       </div>
                                 </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>
                      {" "}
                      An explanatory note indicating the details of progress made about the construction of such a community site{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("explanatoryNote")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
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
                                       </div>
                                 </div>
                   </td>
                  </tr>
                  <tr>
                    <th scope="row">6</th>
                    <td>
                      {" "}
                      In case of other than licensee/developer, upload renewed license copy.
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("uploadRenewalLicense")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
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
                                       </div>
                                 </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">7</th>
                    <td>
                      {" "}
                     Location of applied community site on the plan.<span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("directorDemanded")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
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
                                       </div>
                                 </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">8</th>
                    <td>
                      {" "}
                      Any other document which the director may require for the said purpose. <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("documentdirector")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.agreementDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
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
                                       </div>
                                 </div>
                    </td>
                  </tr>
                </tbody>
              </div>
            </div>
         
        </div>
</div>
      </Card>
      </div>
      </Collapse>
      </form>
  );
}

export default ExtensionCom;
