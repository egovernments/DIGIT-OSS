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
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";

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

  // const handleshowhide = (event) => {
  //   const getuser = event.target.value;

  //   setShowhide(getuser);
  // };
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
      setValue("licenseNo", apiData?.licenseNo);
      setValue("selectType", apiData?.additionalDetails?.selectType);
      setValue("affidavitFixedChargesForAdm", apiData?.additionalDetails?.affidavitFixedChargesForAdm);
      setValue("affidavitForLicencedArea", apiData?.additionalDetails?.affidavitForLicencedArea);
      setValue("affidavitForLicencedArea", apiData?.additionalDetails?.affidavitOfAdmCharges);
      setValue("amount", apiData?.newAdditionalDetails?.amount);
      setValue("validUpto", apiData?.newAdditionalDetails?.validUpto);
      setValue("renewalRequiredUpto", apiData?.newAdditionalDetails?.renewalRequiredUpto);
      setValue("renewalRequiredUpto", apiData?.newAdditionalDetails?.renewalRequiredUpto);
      setValue("colonizerName", apiData?.newAdditionalDetails?.colonizerName);
      setValue("sectorNo", apiData?.newAdditionalDetails?.sectorNo);
      setValue("colonyType", apiData?.newAdditionalDetails?.colonyType);
      setValue("tehsil", apiData?.newAdditionalDetails?.tehsil);
      setValue("district", apiData?.newAdditionalDetails?.district);
      setValue("selectLicence", apiData?.newAdditionalDetails?.selectLicence);
      setValue("revenueEstate", apiData?.newAdditionalDetails?.revenueEstate);
      setValue("developmentPlan", apiData?.newAdditionalDetails?.developmentPlan);
      // setValue("anyOtherDoc", apiData?.anyOtherDoc);
      // setValue("licenseNo", apiData?.licenseNo);
      // setValue("selectType", apiData?.additionalDetails?.selectType);
      // setValue("affidavitFixedChargesForAdm", apiData?.additionalDetails?.affidavitFixedChargesForAdm);
      // setValue("affidavitForLicencedArea", apiData?.additionalDetails?.affidavitForLicencedArea);
      // setValue("affidavitForLicencedArea", apiData?.additionalDetails?.affidavitOfAdmCharges);
      // setValue("amount", apiData?.newAdditionalDetails?.amount);
      // setValue("validUpto", apiData?.newAdditionalDetails?.validUpto);
      // setValue("renewalRequiredUpto", apiData?.newAdditionalDetails?.renewalRequiredUpto);
      // setValue("renewalRequiredUpto", apiData?.newAdditionalDetails?.renewalRequiredUpto);
      // setValue("colonizerName", apiData?.newAdditionalDetails?.colonizerName);
      // setValue("sectorNo", apiData?.newAdditionalDetails?.sectorNo);
      // setValue("colonyType", apiData?.newAdditionalDetails?.colonyType);
      // setValue("tehsil", apiData?.newAdditionalDetails?.tehsil);
      // setValue("district", apiData?.newAdditionalDetails?.district);
      // setValue("selectLicence", apiData?.newAdditionalDetails?.selectLicence);
      // setValue("revenueEstate", apiData?.newAdditionalDetails?.revenueEstate);
      // setValue("developmentPlan", apiData?.newAdditionalDetails?.developmentPlan);
      // setValue("anyOtherDoc", apiData?.additionalDetails?.anyOtherDoc);
      // setValue("areaInAcres", apiData?.additionalDetails?.areaInAcres);
      // setValue("areaAcres", apiData?.newAdditionalDetails?.areaAcres);
      // setValue("boardResolutionDoc", apiData?.additionalDetails?.boardResolutionDoc);
      // setValue("changeOfDeveloper", apiData?.additionalDetails?.changeOfDeveloper);
      // setValue("colonizerSeekingTransferLicence", apiData?.additionalDetails?.colonizerSeekingTransferLicence);
      // setValue("consentLetterDoc", apiData?.additionalDetails?.consentLetterDoc);
      // setValue("justificationForRequest", apiData?.additionalDetails?.justificationForRequest);
      // setValue("licenceTransferredFromLandOwn", apiData?.additionalDetails?.licenceTransferredFromLandOwn);
      
    }
  }, [apiData]);
  const extensionCom = (data) => console.log(data);
   
  const classes = useStyles();
  const [docModal, setDocModal] = useState(false);
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
  //   // setmodaldData(data.data);
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
    {label:"Outstanding dues if any",key:"outstandingDues"},
    {label:"Type of community site",key:"typeOfCommunitySite"},
    {label:"Licence Renewed",key:"licenceRenewd"},
    {label:"Area in Acres",key:"areaInAcers"},
    {label:"Community site valid up to",key:"validUpTo"},
    {label:"Extension of time",key:"applyedForExtentionPerioud"},
    {label:"Amount (Rs.)",key:"amount"},
    {label:"Copy of Board resolution in favour of authorized signatory, applying for case (if applicable).",key:"copyOfBoardResolution"},
    {label:"Justification for extension in time period for construction of community site",key:"justificationForExtention."},
    {label:"Proof of ownership of community site (in case of the extension is sought by an applicant other than the licensee).",key:"proofOfOwnershipOfCommunity"},
    {label:"Proof of online payment of extension fees at the rates provided in Schedule-C to these Rules.",key:"proofOfOnlinePaymentOfExtention"},
    {label:"An explanatory note indicating the details of progress made about the construction of such a community site.",key:"explonatoryNotForExtention"},
    {label: "In case of other than licensee/developer, upload renewed license copy.", key:"uploadRenewalLicenseCopy"},
    {label:"Location of applied community site on the plan.",key:"locationOfApplied"},
    {label:"Any other document which the director may require for the said purpose.",key:"anyOtherDocumentByDirector"}]

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


  return (
    <form onSubmit={handleSubmit(extensionCom)}>
       <ModalChild
                      labelmodal={labelValue}
                      passmodalData={handlemodaldData}
                      displaymodal={smShow}
                       disPlayDoc={docModal}
                      onClose={() => setSmShow(false)}
                      selectedFieldData={selectedFieldData}
                      fieldValue={fieldValue}
                      remarksUpdate={currentRemarks}
                      applicationStatus={applicationStatus}
                    ></ModalChild>
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
                          setDocModal(false),
                          console.log("modal open"),
                          setFieldValue(apiData !== null ? apiData.licenseNo : null);
                      }}
                    ></ReportProblemIcon>
                   
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
                          setDocModal(false),
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
                          setDocModal(false),
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
                            setDocModal(false),
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
                            setDocModal(false),
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
                            setDocModal(false),
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
                            setDocModal(false),
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
                            setDocModal(false),
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
                            setDocModal(false),
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
                            setDocModal(false),
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
                            setDocModal(false),
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
                  setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.appliedBy : null);
              }}
            ></ReportProblemIcon>
             </div>
             </div>
             </div>
            <div className="col col-3 "><FormControl>
            <h2>Outstanding dues if any<span style={{ color: "red" }}>*</span></h2>
          </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
                <input type="text" className="form-control" placeholder="" {...register("outstandingDues")} disabled />
          <div>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.outstandingDues}}
              onClick={() => {
                  setOpennedModal("outstandingDues")
                  setLabelValue("Outstanding dues if any"),
                  setSmShow(true),
                    setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.outstandingDues : null);
              }}
            ></ReportProblemIcon>
             </div>
             </div>
             </div>
             <div className="col col-3 "><FormControl>
            <h2>Type of community site<span style={{ color: "red" }}>*</span></h2>
          </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
                <input type="text" className="form-control" placeholder="" {...register("typeOfCommunitySite")} disabled />
          <div>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.typeOfCommunitySite}}
              onClick={() => {
                  setOpennedModal("typeOfCommunitySite")
                  setLabelValue("Type of community site"),
                  setSmShow(true),
                    setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.typeOfCommunitySite : null);
              }}
            ></ReportProblemIcon>
             </div>
             </div>
             </div>
                <div className="col col-3 "><FormControl>
            <h2>Area in Acres<span style={{ color: "red" }}>*</span></h2>
          </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
                <input type="text" className="form-control" placeholder="" {...register("areaInAcers")} disabled />
          <div>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.areaInAcers}}
              onClick={() => {
                  setOpennedModal("areaInAcers")
                  setLabelValue("Area in Acres"),
                  setSmShow(true),
                    setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.areaInAcers : null);
              }}
            ></ReportProblemIcon>
             </div>
             </div>
             </div>
          </div>
         <div className="row gy-3 mt-3">
          <div className="col col-3 "><FormControl>
            <h2>Community site valid up to<span style={{ color: "red" }}>*</span></h2>
          </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
                <input type="text" className="form-control" placeholder="" {...register("validUpTo")} disabled />
          <div>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.validUpTo}}
              onClick={() => {
                  setOpennedModal("validUpTo")
                  setLabelValue("Community site valid up to"),
                  setSmShow(true),
                    setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.validUpTo : null);
              }}
            ></ReportProblemIcon>
             </div>
             </div>
             </div>
           <div className="col col-3 "><FormControl>
            <h2>Extension of time<span style={{ color: "red" }}>*</span></h2>
          </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
                <input type="text" className="form-control" placeholder="" {...register("applyedForExtentionPerioud")} disabled />
          <div>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.applyedForExtentionPerioud}}
              onClick={() => {
                  setOpennedModal("applyedForExtentionPerioud")
                  setLabelValue("Extension of time"),
                  setSmShow(true),
                    setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.applyedForExtentionPerioud : null);
              }}
            ></ReportProblemIcon>
             </div>
             </div>
             </div>
                <div className="col col-3 "><FormControl>
            <h2>Amount (Rs.)<span style={{ color: "red" }}>*</span></h2>
          </FormControl>
            <div style={{ display: "flex", placeItems: "center" }}>
                <input type="text" className="form-control" placeholder="" {...register("amount")} disabled />
          <div>
                <ReportProblemIcon
              style={{
                color:fieldIconColors.amount}}
              onClick={() => {
                  setOpennedModal("amount")
                  setLabelValue("Amount (Rs.)"),
                  setSmShow(true),
                    setDocModal(false),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.amount : null);
              }}
            ></ReportProblemIcon>
             </div>
             </div>
             </div>
          </div>
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
                                    <IconButton onClick={()=>getDocShareholding(item?.copyOfBoardResolution)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.copyOfBoardResolution)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.copyOfBoardResolution}}
              onClick={() => {
                  setOpennedModal("copyOfBoardResolution")
                  setLabelValue("Copy of Board resolution in favour of authorized signatory, applying for case (if applicable)."),
                  setSmShow(true),
                    setDocModal(true),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.copyOfBoardResolution : null);
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
                      Justification for extension in time period for construction of community site. <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("justificationExtension")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.justificationForExtention)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.justificationForExtention)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.justificationForExtention}}
              onClick={() => {
                  setOpennedModal("justificationForExtention")
                  setLabelValue("Justification for extension in time period for construction of community site."),
                  setSmShow(true),
                  setDocModal(true),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.justificationForExtention : null);
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
                      Proof of ownership of community site (in case of the extension is sought by an applicant other than the licensee).{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("proofOwnership")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.proofOfOwnershipOfCommunity)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.proofOfOwnershipOfCommunity)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.proofOfOwnershipOfCommunity}}
              onClick={() => {
                  setOpennedModal("proofOfOwnershipOfCommunity")
                  setLabelValue("Proof of ownership of community site (in case of the extension is sought by an applicant other than the licensee)."),
                  setSmShow(true),
                  setDocModal(true),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.proofOfOwnershipOfCommunity : null);
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
                                    <IconButton onClick={()=>getDocShareholding(item?.proofOfOnlinePaymentOfExtention)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.proofOfOnlinePaymentOfExtention)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.proofOfOnlinePaymentOfExtention}}
              onClick={() => {
                  setOpennedModal("proofOfOnlinePaymentOfExtention")
                  setLabelValue("Proof of online payment of extension fees at the rates provided in Schedule-C to these Rules."),
                  setSmShow(true),
                  setDocModal(true),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.proofOfOnlinePaymentOfExtention : null);
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
                      An explanatory note indicating the details of progress made about the construction of such a community site.{" "}
                      <span style={{ color: "red" }}>*</span>
                    </td>
                    <td>
                      {/* <input type="file" className="form-control" placeholder="" {...register("explanatoryNote")}></input> */}
                      <div className="row">
                                  
                                  
                                  <div className="btn btn-sm col-md-4">
                                    <IconButton onClick={()=>getDocShareholding(item?.explonatoryNotForExtention)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.explonatoryNotForExtention)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.explonatoryNotForExtention}}
              onClick={() => {
                  setOpennedModal("explonatoryNotForExtention")
                  setLabelValue("An explanatory note indicating the details of progress made about the construction of such a community site."),
                  setSmShow(true),
                  setDocModal(true),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.explonatoryNotForExtention : null);
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
                                    <IconButton onClick={()=>getDocShareholding(item?.uploadRenewalLicenseCopy)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.uploadRenewalLicenseCopy)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.uploadRenewalLicenseCopy}}
              onClick={() => {
                  setOpennedModal("uploadRenewalLicenseCopy")
                  setLabelValue("In case of other than licensee/developer, upload renewed license copy."),
                  setSmShow(true),
                  setDocModal(true),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.uploadRenewalLicenseCopy : null);
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
                                    <IconButton onClick={()=>getDocShareholding(item?.locationOfApplied)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.locationOfApplied)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.locationOfApplied}}
              onClick={() => {
                  setOpennedModal("locationOfApplied")
                  setLabelValue("Location of applied community site on the plan."),
                  setSmShow(true),
                  setDocModal(true),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.locationOfApplied : null);
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
                                    <IconButton onClick={()=>getDocShareholding(item?.anyOtherDocumentByDirector)}>
                                       <VisibilityIcon color="info" className="icon" /></IconButton>
                                       </div>
                                  <div className="btn btn-sm col-md-4">
                                   <IconButton onClick={()=>getDocShareholding(item?.anyOtherDocumentByDirector)}>
                                       <FileDownloadIcon color="info" className="icon" /></IconButton>
                                       </div>
                                       <div className="btn btn-sm col-md-4">
                                       <ReportProblemIcon
              style={{
                color:fieldIconColors.anyOtherDocumentByDirector}}
              onClick={() => {
                  setOpennedModal("anyOtherDocumentByDirector")
                  setLabelValue(" Any other document which the director may require for the said purpose."),
                  setSmShow(true),
                  setDocModal(true),
                  console.log("modal open"),
                  setFieldValue(constructionOfCommunity !== null ? constructionOfCommunity.anyOtherDocumentByDirector : null);
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
