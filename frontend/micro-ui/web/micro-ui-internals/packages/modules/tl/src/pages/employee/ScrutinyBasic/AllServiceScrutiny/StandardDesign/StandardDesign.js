import React, { useEffect, useState} from "react";
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

import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FormControl from "@mui/material/FormControl";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";

function StandardDesign(props) {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);
  const dataIcons = props.dataForIcons;
  const apiData =props.apiResponse;
  const applicationStatus =props.applicationStatus;

  // const handleshowhide = (event) => {
  //   const getuser = event.target.value;

  //   setShowhide(getuser);
  // };
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


  useEffect(() => {
    if (apiData) {
      setValue("licenseNo", apiData?.licenseNo);
      setValue("anyOtherDoc", apiData?.anyOtherDoc);
      
    }
  }, [apiData]);



  const standardDesign = (data) => console.log(data);
   
  const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  
  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    Conditional: "#2874A6",
    approved: "#09cb3d",
    disapproved: "#ff0000",
      info: "#FFB602"
  }

  // const handlemodaldData = (data) => {
   
  //   setSmShow(false);
  //   console.log("here",openedModal,data);
  //   if(openedModal && data){
  //     setFieldIconColors({...fieldIconColors,[openedModal]:data.data.isApproved?Colors.approved:Colors.disapproved})
  //   }
  //     setOpennedModal("");
  //     setLabelValue("");
  // };
  const [selectedFieldData,setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({

    developer: Colors.info,
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
    agreementDoc: Colors.info,
    anyOtherDoc: Colors.info,
    lciNotSigned: Colors.info,
    parmanentAddress: Colors.info,
    addressForCommunication: Colors.info,
    authPerson: Colors.info,
    emailForCommunication: Colors.info
  })

  const fieldIdList = [{label:"Developer",key:"developer"},
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
   {label:"Standard drawing designs",key:"agreementDoc"},
   {label:"Any other Document",key:"anyOtherDoc"},
   {label:"If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)",key:"lciNotSigned"},{label: "Permanent address in case of individual/ registered office address in case other than individual", key:"parmanentAddress"},{label:"Address for communication",key:"addressForCommunication"},{label:"Name of the authorized person to sign the application",key:"authPerson"},{label:"Email ID for communication",key:"emailForCommunication"}]
/////////////////////////////////////////////////////

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

useEffect(() => {
  if (labelValue) {
    const fieldPresent = dataIcons.egScrutiny.filter((ele) => ele.fieldIdL === labelValue);
    setSelectedFieldData(fieldPresent[0]);
  } else {
    setSelectedFieldData(null);
  }
}, [labelValue]);


const handlemodaldData = (data) => {

  setSmShow(false);
  console.log("here",openedModal,data);
  if(openedModal && data){
    setFieldIconColors({...fieldIconColors,[openedModal]:data.data.isApproved?Colors.approved:Colors.disapproved})

  }
    setOpennedModal("");
    setLabelValue("");
};





// function Standard() {
//   const [selects, setSelects] = useState();
//   const [showhide, setShowhide] = useState("");

//   const handleshowhide = (event) => {
//     const getuser = event.target.value;

//     setShowhide(getuser);
//   };
  // const { register, handleSubmit } = useForm();
  
  // const [open2, setOpen2] = useState(false);

  return (
    <form onSubmit={handleSubmit(standardDesign)}>
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
        Approval of Standard Design
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
      <Card 
      // style={{ width: "126%", border: "5px solid #1266af" }}
      >
        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Approval of Standard Design</h4>
        <div className="card">
          <Row>
            {/* <Col className="col-4">
              <Form.Group controlId="formGridCase">
                <Form.Label>
                  License No . <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <input type="number" placeholder="" className="form-control" {...register("licenseNo")} />
              </Form.Group>
            </Col> */}

<div>
      <div className="row gy-3">
        <div className="col col-3">
          <h2>
            Licence No.<span style={{ color: "red" }}>*</span>
          </h2>
          <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder={apiData?.licenseNo}  disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.developer,
                      }}
                      onClick={() => {
                        setOpennedModal("Licence No");
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
                      applicationStatus = {applicationStatus} 
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

      </div>


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
            
            {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.validUpto && errors?.validUpto?.message}
            </h3> */}
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>
                Renewal required upto <span style={{ color: "red" }}>*</span>
              </h2>
            
            </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" className="form-control" placeholder="" {...register("renewalRequiredUpto")} disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.renewalRequiredUpto,
                      }}
                      onClick={() => {
                        setOpennedModal("renewalRequiredUpto");
                        setLabelValue("Renewal required upto"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.selectLicence : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
            {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.renewalRequiredUpto && errors?.renewalRequiredUpto?.message}
            </h3> */}
          </div>
          <div className="col col-3 ">
            <FormControl>
              <h2>Period of renewal(In Months)</h2>
            </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
            <input type="text" {...register("periodOfRenewal")} className="form-control" disabled />
            <div>
              <ReportProblemIcon
                      style={{
                        color: fieldIconColors.periodOfRenewal,
                      }}
                      onClick={() => {
                        setOpennedModal("periodOfRenewal");
                        setLabelValue("Period of renewal(In Months)"),
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.periodOfRenewal : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>

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
          
            {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.areaAcres && errors?.areaAcres?.message}
            </h3> */}
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
           
            {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.sectorNo && errors?.sectorNo?.message}
            </h3> */}
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
           
            {/* <h3 className="error-message" style={{ color: "red" }}>
              {errors?.revenueEstate && errors?.revenueEstate?.message}
            </h3> */}
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
                          setFieldValue(apiData !== null ? apiData.tehsil : null);
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
                          setFieldValue(apiData !== null ? apiData.district : null);
                      }}
                    ></ReportProblemIcon>
                    
            </div>
            </div>
        </div>
      </div>
    </div>



            <Col className="col-4">
            
                  <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Standard drawing designs  &nbsp;</h5>
            </Form.Label>
            <span className={classes.required}>*</span> &nbsp;&nbsp;
          </div>
            <div className={classes.fieldContainer}>
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
                color:fieldIconColors.agreementDoc}}
              onClick={() => {
                  setOpennedModal("agreementDoc")
                  setLabelValue("Standard drawing designs"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.agreementDoc : null);
              }}
            ></ReportProblemIcon>
                                       </div>
                                 </div>
                                 </div>
            </Col>
            <Col className="col-4">
             
              <div>
                <Form.Label>
              <h5 className={classes.formLabel}>Any other Document  &nbsp;</h5>
            </Form.Label>
      
          </div>
            <div className={classes.fieldContainer}>
            <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(apiData?.anyOtherDoc)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(apiData?.anyOtherDoc)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.anyOtherDoc}}
              onClick={() => {
                  setOpennedModal("anyOtherDoc")
                  setLabelValue("Any other Document"),
                  setSmShow(true),
                  console.log("modal open"),
                  setFieldValue(personalinfo !== null ? personalinfo.anyOtherDoc : null);
              }}
            ></ReportProblemIcon>
                                       </div>
                                 </div>
                                 </div>
            </Col>
            {/* <Col className="col-4">
         
                    <div>
                <Form.Label>
              <h5 className={classes.formLabel}> Amount  &nbsp;</h5>
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
            </Col> */}
         
          </Row>

      
        </div>
      </Card>
      </div>
      </Collapse>
    </form>
  );
}

export default StandardDesign;
