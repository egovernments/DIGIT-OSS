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
import "../../css/personalInfoChild.style.js";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FormControl from "@mui/material/FormControl";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";

function TransferLicense(props) {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);
  const apiData = props.apiResponse;
  const dataIcons = props.dataForIcons;
  const applicationStatus = props.applicationStatus;

  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const transferLic = (data) => console.log(data);

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
  useEffect(() => {
    if (apiData) {
      setValue("licenseNo", apiData?.licenseNo);
      setValue("selectType", apiData?.additionalDetails?.selectType);
      setValue("affidavitFixedChargesForAdm", apiData?.additionalDetails?.affidavitFixedChargesForAdm);
      setValue("affidavitForLicencedArea", apiData?.additionalDetails?.affidavitForLicencedArea);
      setValue("affidavitForLicencedArea", apiData?.additionalDetails?.affidavitOfAdmCharges);
      setValue("amount", apiData?.additionalDetails?.amount);
      setValue("anyOtherDoc", apiData?.additionalDetails?.anyOtherDoc);
      setValue("areaInAcres", apiData?.additionalDetails?.areaInAcres);
      setValue("boardResolutionDoc", apiData?.additionalDetails?.boardResolutionDoc);
      setValue("changeOfDeveloper", apiData?.additionalDetails?.changeOfDeveloper);
      setValue("colonizerSeekingTransferLicence", apiData?.additionalDetails?.colonizerSeekingTransferLicence);
      setValue("consentLetterDoc", apiData?.additionalDetails?.consentLetterDoc);
      setValue("justificationForRequest", apiData?.additionalDetails?.justificationForRequest);
      setValue("licenceTransferredFromLandOwn", apiData?.additionalDetails?.licenceTransferredFromLandOwn);
    }
  }, [apiData]);

  const handlemodaldData = (data) => {
    
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    }
    setOpennedModal("");
    setLabelValue("");
  };
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");
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
    emailForCommunication: Colors.info,
  });

  const fieldIdList = [
    { label: "Developer", key: "developer" },
   
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
    
    { label: "Status (Individual/ Company/ Firm/ LLP etc.)", key: "type" },
    { label: "LC-I signed by", key: "lciSignedBy" },
    { label: "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)", key: "lciNotSigned" },
    { label: "Permanent address in case of individual/ registered office address in case other than individual", key: "parmanentAddress" },
    { label: "Address for communication", key: "addressForCommunication" },
    { label: "Name of the authorized person to sign the application", key: "authPerson" },
    { label: "Email ID for communication", key: "emailForCommunication" },
  ];

  ///////////////////////////////////////////////

  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };
  console.log("apiResponse", apiData);
  ///////////////////////////////////////////////
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

  // console.log("Digit123", apiResponse);
  // let user = Digit.UserService.getUser();
  // const userInfo = Digit.UserService.getUser()?.info || {};
  // const userRolesArray = userInfo?.roles.filter((user) => user.code !== "EMPLOYEE");
  // const filterDataRole = userRolesArray?.[0]?.code;
  // const userRoles = user?.info?.roles?.map((e) => e.code) || [];

  // console.log("rolelogintime", userRoles);
  // console.log("afterfilter12", filterDataRole);
  // const mDMSData = props.mDMSData;
  // const mDMSDataRole = mDMSData?.map((e) => e.role) || [];
  // const hideRemarks = mDMSDataRole.includes(filterDataRole);
  // const applicationStatusMdms = mDMSData?.map((e) => e.applicationStatus) || [];
  // const hideRemarksPatwari = applicationStatusMdms.some((item) => item === applicationStatus) || [];
  // const [fileddataName, setFiledDataName] = useState();

  // useEffect(() => {
  //   if (mDMSData && mDMSData?.length) {
  //     console.log(
  //       "filedDataMdms",
  //       mDMSData,
  //       mDMSData?.[0]?.field,
  //       mDMSData?.[0]?.field.map((item, index) => item.fields)
  //     );
  //     setFiledDataName(mDMSData?.[0]?.field.map((item, index) => item.fields));
  //   }
  // }, [mDMSData]);
  // const showReportProblemIcon = (filedName) => {
  //   if (fileddataName && fileddataName.length) {
  //     let show = fileddataName.includes(filedName);
  //     return show;
  //   } else {
  //     return false;
  //   }
  // };


  // console.log("happyRole", userRoles);
  // console.log("happyDate", mDMSData);
  // console.log("happyROLE", mDMSDataRole);
  // console.log("happyapplicationStatusMdms", applicationStatusMdms);
  // console.log("happyDateHIDE", hideRemarksPatwari, showReportProblemIcon("Purpose of colony"), hideRemarks);

  return (
    <form onSubmit={handleSubmit(TransferLicense)}>
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
          Transfer of License
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card style={{ width: "126%" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
              Transfer of License
            </h4>
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
            <h3 className="error-message" style={{ color: "red" }}>
              {errors?.renewalRequiredUpto && errors?.renewalRequiredUpto?.message}
            </h3>
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
        <div className="col col-3 ">
          <FormControl>
            <h2>District</h2>
            
          </FormControl>
          <div style={{ display: "flex", placeItems: "center" }}>
          <input type="text" className="form-control" placeholder="" {...register("district")} disabled />
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
      </div>
    </div>
          
              <Row className="col-12">
                <Col className="col-4">
               <Form.Label>
                  Select Type (Complete or Partial)  <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <div className={classes.fieldContainer}>
             <input type="type" placeholder="" className="form-control" disabled {...register("selectType")} />
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
      
                </Col>
                { apiData?.additionalDetails?.selectType == "partial" &&
              <Col className="col-4">
           
                  {/* <div>
                    {showhide === "Partial" ||
                      (showhide === "Partial" && ( */}
                        <div className="col-md-12 ">
                          <Form.Label className="fw-normal">
                            Area in Acres <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          
                          <div className={classes.fieldContainer}>
                       
                            <input type="number" placeholder="" className="form-control" disabled {...register("araeInAcres")} />
                            <ReportProblemIcon
                              style={{
                                color: fieldIconColors.developer,
                              }}
                              onClick={() => {
                                setOpennedModal("Licence No");
                                setLabelValue("Licence No"),
                                  setSmShow(true),
                                  console.log("modal open"),
                                  setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                              }}
                            ></ReportProblemIcon>

                          </div>
                        </div>
                      {/* ))}
                  </div> */}
           
                </Col>
}
              </Row>

              <fieldset>
              <Row className="col-12">
                
                <Col className="col-6">
                
               
                <Form.Label>
                  Have you transferred licence from licencee land owner in favor of collaborator without prior approval of competent authority
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>

                <div className="d-flex flex-row align-items-center my-1 ">

                  <input type="radio" disabled value="Yes" checked={apiData?.additionalDetails?.licenceTransferredFromLandOwn === "yes" ? true : false} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" checked={apiData?.additionalDetails?.licenceTransferredFromLandOwn === "no" ? true : false} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.licenceTransferredFromLandOwn : null);
                        }}
                      ></ReportProblemIcon>
                </div>


                
               
                  
                </Col>
                <Col className="col-6">
                
                 <Form.Label>
                  Have you transferred title of land requiring amendment in land schedule without prior approval of competent authority
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>

                <div className="d-flex flex-row align-items-center my-1 ">

                  <input type="radio" disabled value="Yes" checked={apiData?.additionalDetails?.transferredTitleOfLand === "yes" ? true : false} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" checked={apiData?.additionalDetails?.transferredTitleOfLand === "no" ? true : false} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                        }}
                      ></ReportProblemIcon>
                </div>
                 </Col>
                 <Col className="col-6">
                
               
                <Form.Label>
                Do you want to apply for Change of Developer
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>

                <div className="d-flex flex-row align-items-center my-1 ">

                  <input type="radio" disabled value="Yes" checked={apiData?.additionalDetails?.changeOfDeveloper === "yes" ? true : false} />
                  <label className="m-0  mx-2" for="Yes">Yes</label>&nbsp;&nbsp;
                  <input type="radio" disabled value="No" checked={apiData?.additionalDetails?.changeOfDeveloper === "no" ? true : false} />
                  <label className="m-0 mx-2" for="No">No</label>
                  <ReportProblemIcon
                        style={{
                          color: fieldIconColors.developer,
                        }}
                        onClick={() => {
                          setOpennedModal("Licence No");
                          setLabelValue("Licence No"),
                            setSmShow(true),
                            console.log("modal open"),
                            setFieldValue(personalinfo !== null ? personalinfo.licenceTransferredFromLandOwn : null);
                        }}
                      ></ReportProblemIcon>
                </div>


                
               
                  
                </Col>

                </Row>
              </fieldset>
              <Row>
                {/* <div>
                {(watch("selectType")?.value == "partial" || watch("selectType")?.value == "complete" || watch("changeOfDeveloper") == "yes") && (
                      <div className="card">
                        <div class="bordere">
                          <div class="table-responsive">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th scope="col">Sr.No</th>
                                  <th scope="col">Field Name</th>
                                  <th scope="col">Upload Documents</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th class="fw-normal">1</th>
                                  <td>
                                    Undertaking regarding the creation of 3rd party right on the licensed area
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">2</th>
                                  <td>
                                    {" "}
                                    The colonizer seeking transfer of whole license/part license shall submit self-certification along with a
                                    certificate of the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time
                                    of submission of application for transfer of license <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">3</th>
                                  <td>
                                    {" "}
                                    A consent letter from the ‘new entity for the proposed change along with justification
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">4</th>
                                  <td>
                                    {" "}
                                    Board resolution of authorized signatory <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">5</th>
                                  <td>
                                    No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically
                                    designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees),
                                    to the proposed change/assignment.
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">6</th>
                                  <td>
                                    Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’
                                    or ‘shareholder(s)’ as per prescribed policy parameters for grant of a license l
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">7</th>
                                  <td>
                                    An undertaking to pay the balance administrative charges before final approval{" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">8</th>
                                  <td>
                                    Justification for request
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">9</th>
                                  <td>
                                    An undertaking to the effect that in case the administrative charges for such cases are fixed in act and rules at
                                    a rate higher than that been recovered, the applicant shall be liable to pay the difference as and when demanded
                                    by TCP
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">10</th>
                                  <td>
                                    The status regarding the creation of third-party rights in the colony. In case no third-party rights are claimed
                                    to have been created in the colony, an affidavit to the said effect be also submitted by the existing developer
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">11</th>
                                  <td>
                                    {" "}
                                    Status regarding registration of project in RERA
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">12</th>
                                  <td>
                                    {" "}
                                    Any Other Document <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                </div> */}

                {/* <div>
                {apiData?.additionalDetails?.selectType == "partial" &&
                    (apiData?.additionalDetails?.changeOfDeveloper == "no" && (
                      <div className="card">
                        <div class="bordere">
                          <div class="table-responsive">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th scope="col">Sr.No</th>
                                  <th scope="col">Field Name</th>
                                  <th scope="col">Upload Documents</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th class="fw-normal">1</th>
                                  <td>
                                    Undertaking regarding the creation of 3rd party right on the licensed area
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">2</th>
                                  <td>
                                    {" "}
                                    The colonizer seeking transfer of whole license/part license shall submit self-certification along with a
                                    certificate of the Chartered Accountant that a 15% profit margin is not exceeded from the project cost at the time
                                    of submission of application for transfer of license <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">3</th>
                                  <td>
                                    A consent letter from the ‘new entity for the proposed change along with justification
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">4</th>
                                  <td>
                                    Board resolution of authorized signatory
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">5</th>
                                  <td>
                                    Status regarding registration of project in RERA
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">6</th>
                                  <td>
                                    Any Other Document
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                </div> */}

                <div>
                  {showhide === "2" ||
                    (showhide === "4" && (
                      <div className="card">
                        <div class="bordere">
                          <div class="table-responsive">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th scope="col">Sr.No</th>
                                  <th scope="col">Field Name</th>
                                  <th scope="col">Upload Documents</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th class="fw-normal">1</th>
                                  <td>
                                    Undertaking regarding the creation of 3rd party right on the licensed area
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("thirdPartyLicensedArea")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">2</th>
                                  <td>
                                    A consent letter from the ‘new entity for the proposed change along with justification
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("newEntityChange")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">3</th>
                                  <td>
                                    {" "}
                                    Board resolution of authorized signatory<span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("authorizedSignatory")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">4</th>
                                  <td>
                                    No objection certificate from the existing ‘Developer, filed through its authorized signatory, specifically
                                    designated for the purpose; as well as from the ‘land owner licensees’, in person (not through GPA/SPA assignees),
                                    to the proposed change/assignment.
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("noObjection")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">5</th>
                                  <td>
                                    Documents about the Technical and Financial Capacity of the ‘new entity’ proposed to be inducted as a ‘Developer’
                                    or ‘shareholder(s)’ as per prescribed policy parameters for grant of a license
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("documentsTechnicalFianncial")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">6</th>
                                  <td>
                                    An undertaking to pay the balance administrative charges before final approval
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("undertakingPay")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">7</th>
                                  <td>
                                    A consent letter from the ‘new entity for the proposed change along with justification
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("justificationChange")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">8</th>
                                  <td>
                                    Justification for request
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("requestJustification")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">9</th>
                                  <td>
                                    An undertaking to the effect that in case the administrative charges for such cases are fixed in act and rules at
                                    a rate higher than that been recovered, the applicant shall be liable to pay the difference as and when demanded
                                    by TCP
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("administrativeChargesCases")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">10</th>
                                  <td>
                                    {" "}
                                    Status regarding registration of project in RERA
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("registrationRera")}></input> */}
                                  </td>
                                </tr>
                                <tr>
                                  <th class="fw-normal">11</th>
                                  <td>
                                    {" "}
                                    Any Other Document <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("document")}></input> */}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div>
                {(watch("selectType")?.value == "partial" || watch("selectType")?.value == "complete" || watch("changeOfDeveloper") == "no") && (
                    
                      <div className="card">
                        <div class="bordere">
                          <div class="table-responsive">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th scope="col">Sr.No</th>
                                  <th scope="col">Field Name</th>
                                  <th scope="col">Upload Documents</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th class="fw-normal">1</th>
                                  <td>
                                    Undertaking regarding the creation of 3rd party right on the licensed area
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">2</th>
                                  <td>
                                    A consent letter from the ‘new entity for the proposed change along with justification
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">3</th>
                                  <td>
                                    Board resolution of authorized signatory
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">4</th>
                                  <td>
                                    Status regarding registration of project in RERA
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
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
                                  <th class="fw-normal">5</th>
                                  <td>
                                    Any Other Document
                                    <span style={{ color: "red" }}>*</span>
                                  </td>
                                  <td>
                                    <div className="row">
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <VisibilityIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <IconButton onClick={() => getDocShareholding(item?.agreementDoc)}>
                                          <FileDownloadIcon color="info" className="icon" />
                                        </IconButton>
                                      </div>
                                      <div className="btn btn-sm col-md-4">
                                        <ReportProblemIcon
                                          style={{
                                            color: fieldIconColors.developer,
                                          }}
                                          onClick={() => {
                                            setOpennedModal("Amount");
                                            setLabelValue("Amount"),
                                              setSmShow(true),
                                              console.log("modal open"),
                                              setFieldValue(personalinfo !== null ? personalinfo.authorizedDeveloper : null);
                                          }}
                                        ></ReportProblemIcon>
                                      </div>
                                    </div>
                                    {/* <input type="file" placeholder="" className="form-control" {...register("anyOtherDoc")}></input> */}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                
              </Row>
              

              {/* <div class="row">
                <div class="col-sm-12 text-right">
                  <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                    Submit
                  </button>
                </div>
                <div class="col-sm-12 text-right">
                  <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
                    Save as Draft
                  </button>
                </div>
              </div> */}
            </div>
          </Card>
        </div>
      </Collapse>
    </form>
  );
}

export default TransferLicense;
