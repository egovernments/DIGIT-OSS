import React, { useState, useEffect, Fragment } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";

import MigrationAppliedTrue from "./MigrationAplliedTrue";
import Visibility from "@mui/icons-material/Visibility";
import DDJAYForm from "../ScrutinyBasic/Puropse/DdjayForm";
import ResidentialPlottedForm from "../ScrutinyBasic/Puropse/ResidentialPlotted";
import IndustrialPlottedForm from "../ScrutinyBasic/Puropse/IndustrialPlotted";
import DDJAY from "./Puropse/CommercialPlottedForm";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyles } from "./css/personalInfoChild.style";
import { IconButton } from "@mui/material";
import { getDocShareholding } from "./ScrutinyDevelopment/docview.helper";
import CommercialPlottedForm from "../ScrutinyBasic/Puropse/CommercialPlottedForm";
import RetirementHousingForm from "./Puropse/RetirementHousing";
import ResidentialGroupHousingForm from "./Puropse/ResidentialGroupHousingForm";
import NilpForm from "./Puropse/Nilp";
import AffordableGroupHousingForm from "./Puropse/AffordableGroupHousing";
import CommercialIntegratedForm from "./Puropse/CommercialIntegrated";
import DemarcationPlanForm from "./Puropse/DemarcationPlan";
import IILPForm from "./Puropse/IILPForm";
import LayoutPlanForm from "./Puropse/LayoutPlanForm";
import MixedLandUseForm from "./Puropse/MixedLandUse";
import ITCyberCityForm from "./Puropse/ITCyberCityForm";
import { array } from "yup";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import DetailsOfAppliedlandDoc from "../AdditionalDocument/DetailsOfAppliedlandDoc";


const AppliedLandinfo = (props) => {


  // useTranslation

  const { t } = useTranslation();
  const { pathname: url } = useLocation();

  const additionalDocResponData = props.additionalDocRespon;
  const dataIcons = props.dataForIcons;
  const DetailsofAppliedLand = props.ApiResponseData;
  const applicationStatus = props.applicationStatus;
  // console.log("personal info applicant data4", DetailsofAppliedLand);
  // let user = Digit.UserService.getUser();
  // const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  // const hideRemarks = userRoles.some((item) => item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
  // const hideRemarksPatwari = userRoles.some((item) => item === "Patwari_HQ")

  // const applicationStatus = props.applicationStatus ;
  let user = Digit.UserService.getUser();
  const userInfo = Digit.UserService.getUser()?.info || {};
  const userRolesArray = userInfo?.roles.filter((user) => user.code !== "EMPLOYEE");
  const filterDataRole = userRolesArray?.[0]?.code;
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];

  console.log("rolelogintime", userRoles);
  console.log("afterfilter12", filterDataRole)

  const mDMSData = props.mDMSData;
  const mDMSDataRole = mDMSData?.map((e) => e.role) || [];
  const hideRemarks = mDMSDataRole.includes(filterDataRole);
  const applicationStatusMdms = mDMSData?.map((e) => e.applicationStatus) || [];
  const hideRemarksPatwari = applicationStatusMdms.some((item) => item === applicationStatus) || [];
  const [fileddataName, setFiledDataName] = useState();

  useEffect(() => {
    if (mDMSData && mDMSData?.length) {
      console.log("filedDataMdms", mDMSData, mDMSData?.[0]?.field, mDMSData?.[0]?.field.map((item, index) => item.fields));
      setFiledDataName(mDMSData?.[0]?.field.map((item, index) => item.fields))

    }

  }, [mDMSData]
  )
  const showReportProblemIcon = (filedName) => {
    if (fileddataName && fileddataName.length) {
      let show = fileddataName.includes(filedName)
      return show;
    } else {
      return false;
    }
  }

  // mDMSData?.map((e) => e.role)||[]
  console.log("happyRole", userRoles);
  console.log("happyDate", mDMSData);
  console.log("happyROLE", mDMSDataRole);
  console.log("happyapplicationStatusMdms", applicationStatusMdms);
  console.log("happyDateHIDE", hideRemarksPatwari, showReportProblemIcon("Purpose of colony"), hideRemarks);


  const [uncheckedValue, setUncheckedVlue] = useState([]);
  console.log("abcd1", uncheckedValue);
  const [migrationApllied, setMigrationApplied] = useState(true);
  // const DdjayFormDisplay = useSelector(selectDdjayFormShowDisplay);
  const [resplotno, setResPlotno] = useState("");
  // const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  const [showhide18, setShowhide18] = useState("2");
  const handleshow18 = (e) => {
    const getshow = e.target.value;
    setShowhide18(getshow);
  };
  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");
  const [color, setColor] = useState({ yes: false, no: false });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [noOfRows, setNoOfRows] = useState(1);
  const [noOfRow, setNoOfRow] = useState(1);
  const [noOfRow1, setNoOfRow1] = useState(1);
  const Purpose = props.purpose;
  const totalArea = props.totalArea;
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [urlGetShareHoldingDoc, setDocShareHoldingUrl] = useState("")


  const handleYesOrNochecked = (data) => {
    setYesorNochecked(data.data);
  };
  const handlemodalsubmit = () => {
    console.log("here");
    const filteredObj = uncheckedValue.filter((obj) => {
      return obj.label == modaldData.label;
    });
    const filteredObjCheked = checkValue.filter((obj) => {
      return obj.label == modaldData.label;
    });
    if (filteredObj.length !== 0) {
      const removedList = uncheckedValue.filter((obj) => {
        return obj.label !== modaldData.label;
      });
      setUncheckedVlue(removedList);
    }
    if (filteredObjCheked.length !== 0) {
      const removedList = checkValue.filter((obj) => {
        return obj.label !== modaldData.label;
      });
      setCheckedVAlue(removedList);
    }

    if (isyesOrNochecked === false) {
      if (modaldData.label !== "" || modaldData.Remarks !== "") {
        if (filteredObj.length === 0) {
          setUncheckedVlue((prev) => [...prev, modaldData]);
        }
      }
    } else {
      if (modaldData.label !== "" || modaldData.Remarks !== "") {
        if (filteredObjCheked.length === 0) {
          setCheckedVAlue((prev) => [...prev, modaldData]);
        }
      }
    }
  };
  useEffect(() => {
    console.log("called");
    handlemodalsubmit();
  }, [modaldData.Remarks]);
  useEffect(() => {
    props.passUncheckedList({ data: uncheckedValue });
  }, [uncheckedValue]);

  useEffect(() => {
    props.passCheckedList({ data: checkValue });
  }, [checkValue]);
  console.log("unchecked values", uncheckedValue);

  console.log(uncheckedValue.indexOf("developer"));

  const developerInputFiledColor = uncheckedValue.filter((obj) => {
    return obj.label === "Click here for instructions to capture DGPS points)";
  });
  const developerInputCheckedFiledColor = checkValue.filter((obj) => {
    return obj.label === "Click here for instructions to capture DGPS points)";
  });
  // console.log("color from array", developerInputFiledColor);

  const developerInputFiledColor1 = uncheckedValue.filter((obj) => {
    return obj.label === "2.Details of Plots";
  });
  const developerInputCheckedFiledColor1 = checkValue.filter((obj) => {
    return obj.label === "2.Details of Plots";
  });
  const developerInputFiledColor2 = uncheckedValue.filter((obj) => {
    return obj.label === "NILP";
  });
  const developerInputCheckedFiledColor2 = checkValue.filter((obj) => {
    return obj.label === "NILP";
  });
  const developerInputFiledColor3 = uncheckedValue.filter((obj) => {
    return obj.label === "Area Under";
  });
  const developerInputCheckedFiledColor3 = checkValue.filter((obj) => {
    return obj.label === "Area Under";
  });
  const developerInputFiledColor4 = uncheckedValue.filter((obj) => {
    return obj.label === "Site plan.";
  });
  const developerInputCheckedFiledColor4 = checkValue.filter((obj) => {
    return obj.label === "Site plan.";
  });
  const developerInputFiledColor5 = uncheckedValue.filter((obj) => {
    return obj.label === "Sectoral Plan/Layout Plan.";
  });
  const developerInputCheckedFiledColor5 = checkValue.filter((obj) => {
    return obj.label === "Sectoral Plan/Layout Plan.";
  });
  const developerInputFiledColor6 = uncheckedValue.filter((obj) => {
    return obj.label === "Development Plan. ";
  });
  const developerInputCheckedFiledColor6 = checkValue.filter((obj) => {
    return obj.label === "Development Plan. ";
  });
  const developerInputFiledColor7 = uncheckedValue.filter((obj) => {
    return obj.label === "(Click here for instructions to capture DGPS points)";
  });
  const developerInputCheckedFiledColor7 = checkValue.filter((obj) => {
    return obj.label === "(Click here for instructions to capture DGPS points)";
  });
  const developerInputFiledColor8 = uncheckedValue.filter((obj) => {
    return obj.label === "Democratic Plan.";
  });
  const developerInputCheckedFiledColor8 = checkValue.filter((obj) => {
    return obj.label === "Democratic Plan.";
  });
  // const developerInputFiledColor9 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Tehsil";
  // });
  // const developerInputCheckedFiledColor9 = checkValue.filter((obj) => {
  //   return obj.label === "Tehsil";
  // });
  // const developerInputFiledColor10 = uncheckedValue.filter((obj) => {
  //   return obj.label === "District";
  // });
  // const developerInputCheckedFiledColor10 = checkValue.filter((obj) => {
  //   return obj.label === "District";
  // });
  // const developerInputFiledColor11 = uncheckedValue.filter((obj) => {
  //   return obj.label === "State";
  // });
  // const developerInputCheckedFiledColor11 = checkValue.filter((obj) => {
  //   return obj.label === "State";
  // });
  // const developerInputFiledColor12 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Status (Individual/ Company/ Firm/ LLP etc.)";
  // });
  // const developerInputCheckedFiledColor12 = checkValue.filter((obj) => {
  //   return obj.label === "Status (Individual/ Company/ Firm/ LLP etc.)";
  // });
  // const developerInputFiledColor13 = uncheckedValue.filter((obj) => {
  //   return obj.label === "LC-I signed by";
  // });
  // const developerInputCheckedFiledColor13 = checkValue.filter((obj) => {
  //   return obj.label === "LC-I signed by";
  // });
  // const developerInputFiledColor14 = uncheckedValue.filter((obj) => {
  //   return obj.label === "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)";
  // });
  // const developerInputCheckedFiledColor14 = checkValue.filter((obj) => {
  //   return obj.label === "If LC-I is not signed by self (in case of an individual) nature of authorization (GPA/SPA)";
  // });
  // const developerInputFiledColor15 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Permanent address in case of individual/ registered office address in case other than individual";
  // });
  // const developerInputCheckedFiledColor15 = checkValue.filter((obj) => {
  //   return obj.label === "Permanent address in case of individual/ registered office address in case other than individual";
  // });
  // const developerInputFiledColor16 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Address for communication";
  // });
  // const developerInputCheckedFiledColor16 = checkValue.filter((obj) => {
  //   return obj.label === "Address for communication";
  // });
  // const developerInputFiledColor17 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Name of the authorized person to sign the application";
  // });
  // const developerInputCheckedFiledColor17 = checkValue.filter((obj) => {
  //   return obj.label === "Name of the authorized person to sign the application";
  // });
  // const developerInputFiledColor18 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Email ID for communication";
  // });
  // const developerInputCheckedFiledColor18 = checkValue.filter((obj) => {
  //   return obj.label === "Email ID for communication";
  // });
  // const developerInputFiledColor19 = uncheckedValue.filter((obj) => {
  //   return obj.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc.";
  // });
  // const developerInputCheckedFiledColor19 = checkValue.filter((obj) => {
  //   return obj.label === "Name of individual Land owner/ land-owning company/ firm/ LLP etc.";
  // });
  // console.log("Akash", Purpose);

  console.log("AccessInfortech", Purpose);
  console.log("AccessInfortech1", totalArea);
  const classes = useStyles();

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    Conditional: "#2874A6",
    approved: "#09cb3d",
    disapproved: "#ff0000",

    info: "#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    dgpsPoint: Colors.info,
    detailsOfPlots: Colors.info,
    areaUnder: Colors.info,
    nilp: Colors.info,

    demarcationPlan: Colors.info,
    democraticPlan: Colors.info,
    sectoralPlan: Colors.info,
    uploadLayoutPlan: Colors.info,
    planCrossSection: Colors.info,
    publicHealthServices: Colors.info,
    designRoad: Colors.info,
    designSewarage: Colors.info,
    designDisposal: Colors.info,
    undertakingChange: Colors.info,
    hostedLayoutPlan: Colors.info,
    reportObjection: Colors.info,
    consentRera: Colors.info,
    undertaking: Colors.info,
    designForElectricSupply: Colors.info,
    proposedColony: Colors.info
  })

  const fieldIdList = [{ label: "DGPS Point", key: "dgpsPoint" }, { label: "Details of Plots", key: "detailsOfPlots" }, { label: "Area Under", key: "areaUnder" }, { label: "NILP", key: "nilp" }, { label: "Demarcation plan", key: "demarcationPlan" }, { label: "Democratic Plan", key: "democraticPlan" }, { label: "Sectoral Plan/Layout Plan", key: "sectoralPlan" }, { label: "Upload Layout Plan", key: "uploadLayoutPlan" }, { label: "Plan showing cross sections", key: "planCrossSection" }, { label: "Plan indicating positions of public health services", key: "publicHealthServices" }, { label: "Specifications and designs of road works", key: "designRoad" }, { label: "Designs and Sewerage, storm and water supply", key: "designSewarage" }, { label: "Designs of disposal and treatment of storm", key: "designDisposal" }, { label: "Upload Layout Undertaking that no change", key: "undertakingChange" }, { label: "Whether you hosted the existing approved layout plan", key: "hostedLayoutPlan" }, { label: "Report any objection from any of the alottees", key: "reportObjection" }, { label: "Consent of RERA", key: "consentRera" }, { label: "Undertaking", key: "undertaking" }, { label: "Detailed specification and design for electric supply", key: "designForElectricSupply" }, { label: "Salient feature of the proposed colony", key: "proposedColony" }];


  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved === "In Order" ? Colors.approved : fieldPresent[0].isApproved === "Not In Order" ? Colors.disapproved : fieldPresent[0].isApproved === "conditional" ? Colors.Conditional : Colors.info }

        }
      }
    })

    setFieldIconColors(tempFieldColorState);

  };


  useEffect(() => {
    getColorofFieldIcon();
    console.log("repeating1...",)
  }, [dataIcons])

  useEffect(() => {
    if (labelValue) {
      const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === labelValue));
      setSelectedFieldData(fieldPresent[0]);
    } else {
      setSelectedFieldData(null);
    }
  }, [labelValue])



  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved })
    }
    setOpennedModal("");
    setLabelValue("");
  };

  const [showhide19, setShowhide19] = useState("true");
  const handleshow19 = (e) => {
    // const getshow = e.target.value;
    // setShowhide19(getshow);
    console.log("Datapoint", DetailsofAppliedLand?.dgpsDetails)
    DetailsofAppliedLand?.dgpsDetails.map((array) => array.map((object) => `${object.latitude},${object.longitude}`).join(":")).join("|")
    let query = DetailsofAppliedLand?.dgpsDetails.map((array) => array.map((object) => `${object.latitude},${object.longitude}`).join(":")).join("|")
    console.log("Qurey", query);
    window.open(`/digit-ui/WNS/wmsmap.html?latlngs=${query}`, "popup")
  };


  // const getDocShareholding = async () => {
  //   if ((Documents?.uploadPdf !== null || Documents?.uploadPdf !== undefined) && (uploadPdf!==null || uploadPdf!=="")) {

  //       try {
  //           const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${DetailsofAppliedLand?.DetailsAppliedLand?.democraticPlan}`, {

  //           });
  //           const FILDATA = response.data?.fileStoreIds[0]?.url;
  //           setDocShareHoldingUrl(FILDATA)
  //       } catch (error) {
  //           console.log(error.message);
  //       }

  // }

  // useEffect(() => {
  //   getDocShareholding();
  // }, [DetailsofAppliedLand?.DetailsAppliedLand?.democraticPlan]);

  // const students = [DetailsofAppliedLand?.dgpsDetails]
  // const dgps = [DetailsofAppliedLand?.dgpsDetails?.index]
  const cart = [DetailsofAppliedLand?.dgpsDetails]
  /////////////////////////////////////////////////////////////////
  let Tree = ({ data }) => {
    return (
      <div>
        <form>
          {data?.length &&
            data?.map((x, i) => {
              const farsArr = [];
              const testData = x?.fars?.forEach((i) => farsArr?.push({ label: i, value: i }));
              setValue(x?.id, x?.area);

              return (
                <div key={i}>
                  <h6 style={{ marginTop: "10px" }}>
                    <span>
                      {/* <b>Purpose Name: </b> */}
                      <b>
                        {`${t("NWL_APPLICANT_DGPS_POINTS_PURPOSE_NAME")}`}:{/* Purpose Name: */}
                      </b>
                    </span>
                    {x?.name}
                  </h6>
                  <div className="row">
                    <div className="col col-4 mt-3">
                      <h6>
                        {`${t("NWL_APPLICANT_DETAIL_POINTS_AREA")}`}
                        {/* Area(in acres): */}
                        <input
                          type="number"
                          className="form-control"
                          placeholder="enter Area"
                          defaultValue={x?.area}
                        />
                        <span style={{ fontSize: "13px", fontWeight: "bold" }}>Max Percentage:</span> {x?.maxPercentage},{" "}
                        <span style={{ fontSize: "13px", fontWeight: "bold" }}>Min Percentage:</span> {x?.minPercentage}
                      </h6>
                    </div>
                    {farsArr?.length > 0 && (
                      <div className="col col-4 mt-3">
                        <h6>
                          {`${t("NWL_APPLICANT_DGPS_POINTS_FAR")}`}:
                          {/* FAR:{" "} */}
                          <input
                            type="number"
                            className="form-control"
                            placeholder="enter Area"
                            defaultValue={x?.area}
                          />
                        </h6>
                      </div>
                    )}
                    {!!x?.purposeDetail?.length && <div className="ml-4 mt-4">{Tree({ data: x?.purposeDetail })}</div>}
                  </div>
                </div>
              );
            })}
        </form>
      </div>
    );
  };



  return (

    <Form
      ref={props.appliedLandInfoRef}
    // style={{
    //   width: "100%",
    //   height: props.heightApplied,
    //   overflow: "hidden",
    //   marginBottom: 20,
    //   borderColor: "#C3C3C3",
    //   borderStyle: "solid",
    //   borderWidth: 2,
    // }}
    >
      {/* <Button
           style={{  margin: 20}}
    onClick={() => setOpen(!open)}
    aria-controls="example-collapse-text"
    aria-expanded={open}
  >
  Step-4
      </Button> */}
      {/* <Card
        style={{
          width: "100%",
          height: props.heightApplied,
          overflow: "hidden",
          marginBottom: 20,
          borderColor: "#C3C3C3",
          borderStyle: "solid",
          borderWidth: 2,
          padding: 2,
        }}
      > */}

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

      <div>
        <div
          className="collapse-header"
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
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
            Details of Applied Land
          </span>
          {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
        </div>
      </div>
      <Collapse in={open}>
        <div id="example-collapse-text">

          {/* {!additionalDocResponData?.AdditionalDocumentReport?.[0]?.applicantInfo == null && */}
          <div>
            <DetailsOfAppliedlandDoc
              additionalDocRespon={additionalDocResponData}

            />

          </div>

          {/* }  */}

          <Form.Group
            style={{ display: props.displayPurpose, border: "2px solid #e9ecef", margin: 10, padding: 10 }}
            className="justify-content-center"
          >




            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              {/* {JSON.stringify(userRoles)}
                    {JSON.stringify(hideRemarks)} */}
              <Col col-10>
                <div style={{ display: "flex" }}>

                  {`${t("NWL_APPLICANT_DGPS_POINTS_DOCUMENT")}`}
                  {/* 1. DGPS points */}


                  <ReportProblemIcon
                    style={{
                      display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_POINTS_DOCUMENT") ? "block" : "none",
                      color: fieldIconColors.detailsOfPlots
                    }}
                    onClick={() => {
                      setLabelValue("Details of Plots"),
                        setOpennedModal("detailsOfPlots")
                      setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "regular" ? "Regular" : DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "Irregular" ? "Irregular" : null);
                    }}
                  ></ReportProblemIcon>
                </div>
                {/* </h5> */}
                {/* {Purpose} */}

                <div >


                  {DetailsofAppliedLand?.dgpsDetails?.map((item, index) => (

                    <div className="row" key={index}>


                      <Row>

                        <Col className="col col-4" style={{ marginLeft: 60 }}>
                          <label>
                            {/* Latitude */}
                            {`${t("NWL_APPLICANT_DGPS_LATITUDE_DOCUMENT")}`}
                          </label>


                        </Col >
                        <Col className="col col-4">
                          <label>
                            {/* Longitude */}
                            {`${t("NWL_APPLICANT_DGPS_LONGITUDE_DOCUMENT")}`}
                          </label>


                        </Col >
                      </Row>

                      {item?.map((item, index) => (



                        <div style={{ marginLeft: 52 }}>

                          <Row >
                            <Col className="col col-4">
                              <input type="text" className="form-control" placeholder={item?.latitude} disabled />
                            </Col>
                            <Col className="col col-4" >
                              <input type="text" className="form-control" placeholder={item?.longitude} disabled />
                            </Col>

                          </Row>



                        </div>
                      ))
                      }


                      {/* 
                      {DetailsofAppliedLand?.dgpsDetails?.[index]?.map((item, index) => (

                 
                       
                        <div style={{ marginLeft:52 }}>
                  
                          <Row >
                            <Col className="col col-4">
                              <input type="text" className="form-control" placeholder={item?.latitude}  disabled />
                            </Col>
                            <Col className="col col-4" >
                              <input type="text" className="form-control" placeholder={item?.longitude}  disabled />
                            </Col>
                            
                          </Row>

                          
                        
                        </div>
                      ))
                      } */}

                    </div>

                  ))

                  }

                </div>
                {/* <div>
                  {JSON.stringify(DetailsofAppliedLand?.dgpsDetails?.[0]?.[0]?.latitude)}
                </div> */}

                <Button style={{ textAlign: "right" }} value="Submit" id="Submit" name="Submit" onClick={handleshow19}>
                  {/* Map View */}
                  {`${t("NWL_APPLICANT_DGPS_POINTS_MAP_VIEW_DOCUMENT")}`}
                </Button>






                {/* {JSON.stringify(DetailsofAppliedLand?.dgpsDetails)} */}
















                {/* 
                <Button style={{ textAlign: "right" }}>      <a href={`/digit-ui/WNS/wmsmap.html?latlngs=${DetailsofAppliedLand?.dgpsDetails?.index?.[index]?.map((element)=>(`${element.latitude},${element.longitude}`)).join(":")}`} 
  target="popup" 
  onclick="window.open({`/digit-ui/WNS/wmsmap.html?latlngs=${DetailsofAppliedLand?.dgpsDetails?.map((element)=>(`${element.latitude},${element.longitude}`,'popup','width:600,height:600'); return false;"
  >
  Map View</a></Button> */}

                {/* <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChange} name="Submit" onClick={handleshow19}><a href="http://localhost:3000/digit-ui/WNS/wmsmap.html?latlngs=29.385044,76.48667120:2029.506174,2076.64801520:2029.686816,2076.21848220:2029.406816,2076.85848220|30.385044,2078.48667120:2030.506174,2078.64801520:30.686816,78.218482" >Graphic design</a></Button> */}







                <hr className="my-3" />

                {/* <hr className="my-3" />
               
                <h5 className={`text-black d-flex flex-row align-items-center ${classes.formLabel}`} style={{ marginTop: "3%" }}>
                  2.Details of Plots
                  <div className="ml-3 d-flex flex-row align-items-center">
                    <input type="radio" id="Yes" value="1" name="Yes" disabled checked={DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "regular" ? true : false} />
                  
                    <label className={`${classes.formLabel}  m-0  mx-1`} htmlFor="gen">Regular</label>&nbsp;&nbsp;
                    <input type="radio" id="Yes" value="2" name="Yes" checked={DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "Irregular" ? true : false} disabled />
     
                    <label className={`${classes.formLabel}  m-0  mx-1`} htmlFor="npnl">Irregular</label>
                  </div>
                  <div style={{ margin: 5 }}>
                    {" "}
                    <ReportProblemIcon
                      style={{
                        display: hideRemarks || hideRemarksPatwari ?"none":"block",
                        color: fieldIconColors.detailsOfPlots
                      }}
                      onClick={() => {
                        setLabelValue("Details of Plots"),
                          setOpennedModal("detailsOfPlots")
                        setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "regular" ? "Regular" : DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "Irregular" ? "Irregular" : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h5>
                <br></br>
                {DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "regular" && (
                  <div className="table table-bordered table-responsive">
                    <thead>
                      <tr>
                        <td>Type of plots</td>
                        <td>Plot No.</td>
                        <td>Length in mtr</td>
                        <td>Width in mtr</td>
                        <td>Area in sqmtr</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2" onChange={(e) => setResPlotno(e.target.value)} value={resplotno}>
                              Residential
                            </p>
                          </div>
                          </td>
                        
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Gen</p>
                          </div>
                          </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.resplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.reslengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.reswidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.resareasq} />
                        </td>

                        
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">NPNL</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.npnlplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.npnllengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.npnlwidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.npnlareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">EWS</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.ewsplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.ewslengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.ewswidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.ewsareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p
                              className="mb-2"
               
                            >
                              Commercial
                            </p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.complotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.comlengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.comwidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.comareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p
                              className="mb-2"
                          
                            >
                              Community Sites
                            </p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.siteplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.sitelengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.sitewidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.siteareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p
                              className="mb-2"
              
                            >
                              Parks
                            </p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.parkplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.parklengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.parkwidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.parkareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p
                              className="mb-2"
                          
                            >
                              Public Utilities
                            </p>
                          </div>
                        </td>
                        
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">STP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.publicplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.publiclengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.publicwidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.publicareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">ETP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.etpplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.etplengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.etpwidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.etpareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">WTP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.wtpplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.wtplengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.wtpwidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.wtpareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">UGT</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.ugtplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.ugtlengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.ugtwidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.ugtareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Milk Booth</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.milkboothplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.milkboothlengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.milkboothwidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.milkboothareasq} />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">GSS</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.gssplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.gsslengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.gssWidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.gssareasq} />
                        </td>
                      </tr>
                    </tbody>
                  </div>
                )}
                {DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "Irregular" && (
                  <div>
                    <div className="table table-bordered table-responsive ">
                      <thead>
                        <tr>
                          <td>Details of Plot</td>
                          <td>Dimensions (in mtr)</td>
                          <td>Entered Area</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p
                                className="mb-2"
                       
                              >
                                Residential
                              </p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.resDimension} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.resEnteredArea} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p
                                className="mb-2"
                          
                              >
                                Commercial
                              </p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.comDimension} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.comEnteredArea} />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                    <h5 className="text-black mb-3 mt-4">
                      <div style={{ display: "flex" }}>
                       
                        Area Under
                        <ReportProblemIcon
                          style={{
                            display: hideRemarks || hideRemarksPatwari ?"none":"block",
                            color: fieldIconColors.areaUnder
                          }}
                          onClick={() => {
                            setLabelValue("Area Under"),
                              setOpennedModal("areaUnder")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue();
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </h5>
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <td>Detail of plots</td>
                          <td>Plot No.</td>
                          <td>Length (in mtr)</td>
                          <td>Dimension (in mtr)</td>
                          <td>Entered Area</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p
                                className="mb-2"
                             
                              >
                                Sectoral Plan Road
                              </p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.secPlanPlot} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.secPlanLength} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.secPlanDim} />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.secPlanEntered} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p
                                className="mb-2"
                       
                              >
                                Green Belt
                              </p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.greenBeltPlot} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.greenBeltLength} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.greenBeltDim} />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.greenBeltEntered} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p
                                className="mb-2"
                          
                              >
                                24/18 mtr wide internal circulation Plan road
                              </p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.internalPlot} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.internalLength} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.internalDim} />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.internalEntered} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p
                                className="mb-2"
                  
                              >
                                Other Roads
                              </p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.otherPlot} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.otherLength} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.otherDim} />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.otherEntered} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="px-2">
                              <p
                                className="mb-2"
                          
                              >
                                Undetermined use(UD)
                              </p>
                            </div>
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.undeterminedPlot} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.undeterminedLength} />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.undeterminedDim} />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.undeterminedEntered} />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                )} */}
                <br></br>
                <div>
                  <div className="mt-3 mb-3">
                    <h4>
                      <b>
                        {/* Bifurcation Of Purpose */}
                        {`${t("NWL_APPLICANT_BIFURCATION_OF_PURPOSE")}`}
                      </b>
                    </h4>
                    <h4 className="mt-3">
                      <b>
                        {/* Total Applied Area: */}
                        {`${t("NWL_APPLICANT_DGPS_TOTAL_APPLIED_AREA")}`}
                      </b>

                      {DetailsofAppliedLand?.DetailsAppliedLandPlot?.totalAreaScheme}
                    </h4>
                    {/* <h4 className="mt-3">
                      <b>Purpose Name: </b>
                      {DetailsofAppliedLand?.PurposeDetails?.name}
                    </h4>
                    <h4 className="mt-3">
                      Area:
                      {DetailsofAppliedLand?.PurposeDetails?.area}
                    </h4> */}
                    {DetailsofAppliedLand?.PurposeDetails?.map((item, index) => (
                      <div style={{ marginLeft: 52 }}>

                        <Row >
                          <h4 className="mt-3">
                            <b>
                              {/* Purpose Name: */}
                              {`${t("NWL_APPLICANT_DGPS_POINTS_PURPOSE_NAME")}`}
                            </b>
                            {item?.name}
                          </h4>

                          <h4 className="mt-3">
                            {/* Area: */}
                            {`${t("NWL_APPLICANT_DGPS_POINTS_AREA")}`}
                            <Col className="col col-4" >
                              <input type="text" className="form-control" placeholder={item?.area} disabled />
                            </Col>
                          </h4>
                          {/* <h4 className="mt-3">
                      FAR:
                      <Col className="col col-4" >
                            <input type="text" className="form-control" placeholder={item?.fars} disabled />
                          </Col> 
                    </h4> */}


                        </Row>
                        {item?.purposeDetail?.map((item, index) => (



                          <div style={{ marginLeft: 52 }}>

                            <Row >

                              <h4 className="mt-3">
                                <b>
                                  {/* SubPurpose Name:  */}
                                  {`${t("NWL_APPLICANT_DGPS_POINTS_SUBPURPOSE_NAME")}`}
                                </b>
                                {item?.name}
                              </h4>

                              <h4 className="mt-3">
                                {/* Area: */}
                                {`${t("NWL_APPLICANT_DGPS_POINTS_AREA")}`}
                                <Col className="col col-4" >
                                  <input type="text" className="form-control" placeholder={item?.area} disabled />
                                </Col>
                              </h4>
                              <h4 className="mt-3">
                                {/* FAR: */}
                                {`${t("NWL_APPLICANT_DGPS_POINTS_FAR")}`}
                                <Col className="col col-4" >
                                  <input type="text" className="form-control" placeholder={item?.fars} disabled />
                                </Col>
                              </h4>


                            </Row>
                            {item?.purposeDetail?.map((item, index) => (



                              <div style={{ marginLeft: 52 }}>

                                <Row >

                                  <h4 className="mt-3">
                                    <b>
                                      {/* SubPurpose Name: */}
                                      {`${t("NWL_APPLICANT_DGPS_POINTS_SUBPURPOSE_NAME")}`}
                                    </b>
                                    {item?.name}
                                  </h4>

                                  <h4 className="mt-3">
                                    {/* Area: */}
                                    {`${t("NWL_APPLICANT_DGPS_POINTS_AREA")}`}
                                    <Col className="col col-4" >
                                      <input type="text" className="form-control" placeholder={item?.area} disabled />
                                    </Col>
                                  </h4>
                                  <h4 className="mt-3">
                                    {/* FAR: */}
                                    {`${t("NWL_APPLICANT_DGPS_POINTS_FAR")}`}
                                    <Col className="col col-4" >
                                      <input type="text" className="form-control" placeholder={item?.fars} disabled />
                                    </Col>
                                  </h4>

                                </Row>



                              </div>
                            ))
                            }



                          </div>
                        ))
                        }



                      </div>
                    ))
                    }

                  </div>
                </div>














                {/* ///last time  */}
                {/* <div>
                  <DDJAYForm displayDdjay={Purpose === "DDJAY_APHP" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons}></DDJAYForm>
                </div>
                <div>
                  <ResidentialPlottedForm displayResidential={Purpose === "RPL" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></ResidentialPlottedForm>
                </div>
                <div>
                  <IndustrialPlottedForm displayIndustrial={Purpose === "IPL" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></IndustrialPlottedForm>
                </div>
                <div>
                  <CommercialPlottedForm displayCommercialPlottedData={Purpose === "CPCS"  ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></CommercialPlottedForm>
                </div>
                <div>
                  <CommercialPlottedForm displayCommercialPlottedData={Purpose === "CPRS" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></CommercialPlottedForm>
                </div>
               
                <div>
                  <RetirementHousingForm displayRetrementPlottedData={Purpose === "RHP" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></RetirementHousingForm>
                </div>
                <div>
                  <ResidentialGroupHousingForm displayResidentialGroupData={Purpose === "RGP" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></ResidentialGroupHousingForm>
                </div>
                <div>
                  <NilpForm displayNilpFormData={Purpose === "NILPC"   ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></NilpForm>
                </div>
                <div>
                  <NilpForm displayNilpFormData={Purpose === "NILP"  ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></NilpForm>
                </div>
                <div>
                  <AffordableGroupHousingForm displayAffordableData={Purpose === "AGH" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></AffordableGroupHousingForm>
                </div>
              
                <div>
                  <CommercialIntegratedForm displayCommericalIntegratedForm={Purpose === "CICS" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></CommercialIntegratedForm>
                </div>
                <div>
                  <CommercialIntegratedForm displayCommericalIntegratedForm={Purpose === "CIRS" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></CommercialIntegratedForm>
                </div>
                <div>
                  <ITCyberCityForm displayITCyberCityForm={Purpose === "ITC"  ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></ITCyberCityForm>
                </div>
                <div>
                  <ITCyberCityForm displayITCyberCityForm={Purpose ===  "ITP" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></ITCyberCityForm>
                </div>
                <div>
                  <MixedLandUseForm displayMixedLandUseForm={Purpose === "MLU-CZ" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></MixedLandUseForm>
                </div>
              
                <div>
                  <IILPForm displayIILPForm={Purpose === "IPULP"  ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandPlot} dataForIcons={dataIcons} ></IILPForm>
                </div>
                 */}

                {/* <NilpForm></NilpForm> */}
                {/* CPCS */}


                {/* <h5 className="text-black mt-4">
                  <div style={{ display: "flex" }}>
                    NILP :-
                   
                    <ReportProblemIcon
                      style={{
                        display: hideRemarks || hideRemarksPatwari ?"none":"block",
                        color: fieldIconColors.nilp
                      }}
                      onClick={() => {
                        setLabelValue("NILP"),
                          setOpennedModal("nilp")
                        setSmShow(true),
                          console.log("modal open"),
                          setFieldValue();
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h5> */}

                {/* 
                <div class="w-full px-3 my-3">
                  <div class="row">
                    <div class="col-1 border p-2 d-flex flex-row justify-content-center align-items-center ">S.No.</div>
                    <div class="col-9 border p-2 d-flex flex-row justify-content-center align-items-center ">NLP Details</div>
                    <div class="col-2 border p-2 d-flex flex-row justify-content-center align-items-center ">Yes/No</div>
                  </div>
                  <div class="row">
                    <div class="col-1 border p-1 d-flex flex-row justify-content-center align-items-center">
                      <p>1. </p>
                    </div>
                    <div class="col-9 border p-2 d-flex flex-row justify-content-start align-items-center ">
                      <p>
                        {" "}
                        Whether you want to surrender the 10% area of license colony to Govt. the instead of providing 10% under EWS and NPNL plots{" "}
                      </p>
                    </div>
                    <div className="col-2 border p-1">

                      <div class="d-flex flex-row justify-content-center align-items-center ">
                        <input
                          type="radio"
                          value="Yes"
                          
                          disabled
                          checked={DetailsofAppliedLand?.DetailsAppliedLandNILP?.surrender === "Y" ? true : false}
                        />
                        <label className={`${classes.formLabel}  m-0  mx-2`} for="Yes">Yes</label>

                        <input
                          type="radio"
                          value="No"
                          
                          disabled
                          checked={DetailsofAppliedLand?.DetailsAppliedLandNILP?.surrender === "N" ? true : false}
                        />
                        <label className={`${classes.formLabel}  m-0  mx-2`} for="No">No</label></div>

                      {DetailsofAppliedLand?.DetailsAppliedLandNILP?.surrender === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label className="m-0">Area in Acres</label>
                            <input type="text" className="form-control" placeholder={DetailsofAppliedLand?.DetailsAppliedLandNILP?.surrenderArea} />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                  <div class="row">
                    <div class="col-1 border p-1 d-flex flex-row justify-content-center align-items-center">
                      <p>2. </p>
                    </div>
                    <div class="col-9 border p-2 d-flex flex-row justify-content-start align-items-center ">
                      <p>
                        {" "}
                        Whether any pocket proposed to be transferred less than 1 acre{" "}
                      </p>
                    </div>
                    <div className="col-2 border p-1">

                      <div class="d-flex flex-row justify-content-center align-items-center ">
                        <input
                          type="radio"
                          value="Yes"
                          
                          disabled
                          checked={DetailsofAppliedLand?.DetailsAppliedLandNILP?.pocketProposed === "Y" ? true : false}
                        />
                        <label className={`${classes.formLabel}  m-0  mx-2`} for="Yes">Yes</label>

                        <input
                          type="radio"
                          value="No"
                          
                          disabled
                          checked={DetailsofAppliedLand?.DetailsAppliedLandNILP?.pocketProposed === "N" ? true : false}
                        />
                        <label className={`${classes.formLabel}  m-0  mx-2`} for="No">No</label></div>

                      {DetailsofAppliedLand?.DetailsAppliedLandNILP?.pocketProposed === "Y" && (
                        <div className="row ">
                          <div className="col-12">
                            <label className="m-0">Dimension(in mtr)</label>
                            <input type="text" className="form-control" placeholder={DetailsofAppliedLand?.DetailsAppliedLandNILP?.pocketDim} />
                          </div>
                          <div className="col-12">
                            <label className="m-0">Area</label>
                            <input type="text" className="form-control" placeholder={DetailsofAppliedLand?.DetailsAppliedLandNILP?.pocketAreaEnter} />
                          </div>
                        </div>

                      )}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-1 border p-1 d-flex flex-row justify-content-center align-items-center">
                      <p>3. </p>
                    </div>
                    <div class="col-9 border p-2 d-flex flex-row justify-content-start align-items-center ">
                      <p>
                        {" "}
                        Whether you want to deposit an amount @ of 3 times of collector rate instead of the surrender 10% land to Govt.{" "}
                      </p>
                    </div>
                    <div className="col-2 border p-1">

                      <div class="d-flex flex-row justify-content-center align-items-center ">
                        <input
                          type="radio"
                          value="Yes"
                          
                          disabled
                          checked={DetailsofAppliedLand?.DetailsAppliedLandNILP?.deposit === "Y" ? true : false}
                        />
                        <label className={`${classes.formLabel}  m-0  mx-2`} for="Yes">Yes</label>

                        <input
                          type="radio"
                          value="No"
                          
                          disabled
                          checked={DetailsofAppliedLand?.DetailsAppliedLandNILP?.deposit === "N" ? true : false}
                        />
                        <label className={`${classes.formLabel}  m-0  mx-2`} for="No">No</label></div>

                      {DetailsofAppliedLand?.DetailsAppliedLandNILP?.deposit === "Y" && (
                        <div className="row ">
                          <div className="col col">
                            <label className="m-0">Area in acres</label>
                            <input type="text" className="form-control" placeholder={DetailsofAppliedLand?.DetailsAppliedLandNILP?.depositArea} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-1 border p-1 d-flex flex-row justify-content-center align-items-center">
                      <p>4. </p>
                    </div>
                    <div class="col-9 border p-2 d-flex flex-row justify-content-start align-items-center ">
                      <p>
                        {" "}
                        Whether the surrendered area is having a minimum of 18 mtr independent access{" "}
                      </p>
                    </div>
                    <div className="col-2 border p-1">

                      <div class="d-flex flex-row justify-content-center align-items-center ">
                        <input
                          type="radio"
                          value="Yes"
                          
                          disabled
                          checked={DetailsofAppliedLand?.DetailsAppliedLandNILP?.surrendered=== "Y" ? true : false}
                        />
                        <label className={`${classes.formLabel}  m-0  mx-2`} for="Yes">Yes</label>

                        <input
                          type="radio"
                          value="No"
                          
                          disabled
                          checked={DetailsofAppliedLand?.DetailsAppliedLandNILP?.surrendered === "N" ? true : false}
                        />
                        <label className={`${classes.formLabel}  m-0  mx-2`} for="No">No</label></div>

                      {DetailsofAppliedLand?.DetailsAppliedLandNILP?.surrendered === "Y" && (
                        <div className="row ">
                          <div className="col-12">
                            <label className="m-0">Dimension(in mtr)</label>
                            <input type="text" className="form-control" placeholder={DetailsofAppliedLand?.DetailsAppliedLandNILP?.surrenderedDim} />
                          </div>
                          <div className="col-12">
                            <label className="m-0">Area</label>
                            <input type="text" className="form-control" placeholder={DetailsofAppliedLand?.DetailsAppliedLandNILP?.area} />
                          </div>
                        </div>

                      )}
                    </div>
                  </div>
                </div> */}




                <hr className="mb-4" />

                <h5 className="text-black" style={{ marginBottom: "2%" }}>
                  {/* Mandatory Documents */}
                  {`${t("NWL_APPLICANT_DGPS_MANDATORY_DOCUMENTS")}`}
                </h5>
                <div className={`${classes.formLabel} row`}>
                  <div className="col col-3">
                    <h5 className="d-flex flex-column mb-2">
                      {/* Layout Plan DXF */}
                      {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_LAYOUT_PLAN_DXF")}`}
                      <div style={{ display: "flex" }}>

                        {
                          DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanDxf &&
                          <Fragment>
                            <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanDxf)}>
                              <DownloadForOfflineIcon color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanDxf)}>
                              <Visibility color="primary" className="mx-1" />
                            </IconButton>
                          </Fragment>
                        }
                        <ReportProblemIcon
                          style={{
                            display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_POINTS_DOCUMENT") ? "block" : "none",
                            color: fieldIconColors.demarcationPlan
                          }}
                          onClick={() => {
                            setLabelValue("Demarcation plan"),
                              setOpennedModal("demarcationPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue();
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </h5>

                  </div>
                  <div className="col col-3">
                    <h5 className="d-flex flex-column mb-2">
                      {/* Layout Plan PDF */}
                      {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_LAYOUT_PLAN_PDF")}`}
                      <div style={{ display: "flex" }}>
                        {
                          DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanPdf &&
                          <Fragment>
                            <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanPdf)}>
                              <DownloadForOfflineIcon color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanPdf)}>
                              <Visibility color="primary" className="mx-1" />
                            </IconButton>
                          </Fragment>
                        }
                        <ReportProblemIcon
                          style={{

                            display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_DOCUMENTS_LAYOUT_PLAN_PDF") ? "block" : "none",
                            color: fieldIconColors.democraticPlan
                          }}
                          onClick={() => {
                            setLabelValue("Democratic Plan"),
                              setOpennedModal("democraticPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue();
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </h5>

                  </div>
                  <div className="col col-3">
                    <h5 className="d-flex flex-column mb-2" >
                      {/* Undertaking */}
                      {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_UNDERTAKING")}`}

                      <div style={{ display: "flex" }}>
                        {
                          DetailsofAppliedLand?.DetailsAppliedLandPlot?.undertaking &&
                          <Fragment>
                            <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLandPlot?.undertaking)}>
                              <DownloadForOfflineIcon color="primary" className="mx-1" />
                            </IconButton>
                            <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLandPlot?.undertaking)}>
                              <Visibility color="primary" className="mx-1" />
                            </IconButton>
                          </Fragment>
                        }

                        <ReportProblemIcon
                          style={{
                            display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_DOCUMENTS_UNDERTAKING") ? "block" : "none",

                            color: fieldIconColors.sectoralPlan
                          }}
                          onClick={() => {
                            setLabelValue("Sectoral Plan/Layout Plan"),
                              setOpennedModal("sectoralPlan")
                            setSmShow(true),
                              console.log("modal open"),
                              setFieldValue();
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </h5>


                  </div>
                  <div className="col col-3">
                    <div className="form-group">
                      <h5 className="d-flex flex-column mb-2">


                        {/* Any other relevant documen */}
                        {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_DEVELOPMENT_PLAN")}`}
                        <div style={{ display: "flex" }}>
                          {
                            DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanPdf &&
                            <Fragment>
                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanPdf)}>
                                <DownloadForOfflineIcon color="primary" className="mx-1" />
                              </IconButton>

                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLandPlot?.layoutPlanPdf)}>
                                <Visibility color="primary" className="mx-1" />
                              </IconButton>
                            </Fragment>
                          }
                          <ReportProblemIcon
                            style={{
                              display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_DOCUMENTS_DEVELOPMENT_PLAN") ? "block" : "none",
                              color: fieldIconColors.uploadLayoutPlan
                            }}
                            onClick={() => {
                              setLabelValue("Upload Layout Plan"),
                                setOpennedModal("uploadLayoutPlan")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>

                    </div>
                  </div>

                  <div className="row">
                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">
                        {/* Sectoral Plan */}
                        {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_SECTORAL_PLAN")}`}


                        <div style={{ display: "flex" }}>
                          {
                            DetailsofAppliedLand?.DetailsAppliedLand?.planCrossSection &&
                            <Fragment>
                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.planCrossSection)}>
                                <DownloadForOfflineIcon color="primary" className="mx-1" />
                              </IconButton>
                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.planCrossSection)}>
                                <Visibility color="primary" className="mx-1" />
                              </IconButton>
                            </Fragment>
                          }
                          <ReportProblemIcon
                            style={{
                              display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_DOCUMENTS_SECTORAL_PLAN") ? "block" : "none",
                              color: fieldIconColors.planCrossSection
                            }}
                            onClick={() => {
                              setLabelValue("Plan showing cross sections"),
                                setOpennedModal("planCrossSection")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">
                        {/* EXPLANATORY NOTE */}
                        {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_EXPLANATORY_NOTE")}`}

                        <div style={{ display: "flex" }}>
                          {
                            DetailsofAppliedLand?.DetailsAppliedLand?.publicHealthServices &&
                            <Fragment>
                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.publicHealthServices)}>
                                <DownloadForOfflineIcon color="primary" className="mx-1" />
                              </IconButton>

                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.publicHealthServices)}>
                                <Visibility color="primary" className="mx-1" />
                              </IconButton>
                            </Fragment>
                          }
                          <ReportProblemIcon
                            style={{
                              display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_DOCUMENTS_EXPLANATORY_NOTE") ? "block" : "none",
                              color: fieldIconColors.publicHealthServices
                            }}
                            onClick={() => {
                              setLabelValue("Plan indicating positions of public health services"),
                                setOpennedModal("publicHealthServices")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">

                        {/* GUIDE MAP */}
                        {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_GUIDE_MAP")}`}


                        <div style={{ display: "flex" }}>

                          {
                            DetailsofAppliedLand?.DetailsAppliedLand?.designRoad &&
                            <Fragment>
                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.designRoad)}>
                                <DownloadForOfflineIcon color="primary" className="mx-1" />
                              </IconButton>

                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.designRoad)}>
                                <Visibility color="primary" className="mx-1" />
                              </IconButton>
                            </Fragment>
                          }


                          <ReportProblemIcon
                            style={{
                              display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_DOCUMENTS_GUIDE_MAP") ? "block" : "none",
                              color: fieldIconColors.designRoad
                            }}
                            onClick={() => {
                              setLabelValue("Specifications and designs of road works"),
                                setOpennedModal("designRoad")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">
                        {/* INDEMNITY BOND */}
                        {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_INDEMNITY_BOND")}`}

                        <div style={{ display: "flex" }}>
                          {
                            DetailsofAppliedLand?.DetailsAppliedLand?.designSewarage &&
                            <Fragment>
                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.designSewarage)}>
                                <DownloadForOfflineIcon color="primary" className="mx-1" />
                              </IconButton>

                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.designSewarage)}>
                                <Visibility color="primary" className="mx-1" />
                              </IconButton>
                            </Fragment>
                          }

                          <ReportProblemIcon
                            style={{
                              display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_DOCUMENTS_INDEMNITY_BOND") ? "block" : "none",
                              color: fieldIconColors.designSewarage
                            }}
                            onClick={() => {
                              setLabelValue("Designs and Sewerage, storm and water supply"),
                                setOpennedModal("designSewarage")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">
                        {/* ANY Other Relevant Document */}
                        {`${t("NWL_APPLICANT_DGPS_DOCUMENTS_ANY_OTHER_RELEVANT_DOCUMENT")}`}

                        <div style={{ display: "flex" }}>
                          {
                            DetailsofAppliedLand?.DetailsAppliedLand?.designDisposal &&
                            <Fragment>
                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.designDisposal)}>
                                <DownloadForOfflineIcon color="primary" className="mx-1" />
                              </IconButton>

                              <IconButton onClick={() => getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.designDisposal)}>
                                <Visibility color="primary" className="mx-1" />
                              </IconButton>
                            </Fragment>
                          }

                          <ReportProblemIcon
                            style={{
                              display: hideRemarksPatwari && showReportProblemIcon("NWL_APPLICANT_DGPS_DOCUMENTS_ANY_OTHER_RELEVANT_DOCUMENT") ? "block" : "none",
                              color: fieldIconColors.designDisposal
                            }}
                            onClick={() => {
                              setLabelValue("Designs of disposal and treatment of storm"),
                                setOpennedModal("designDisposal")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    {/* <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Upload Layout Undertaking that no change

                        <div style={{ display: "flex" }}>
                  
                        <IconButton onClick={()=>getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.undertakingChange)}>
                          <DownloadForOfflineIcon color="primary" className="mx-1"  />
                        </IconButton>
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.undertakingChange
                            }}
                            onClick={() => {
                              setLabelValue("Upload Layout Undertaking that no change"),
                                setOpennedModal("undertakingChange")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Whether you hosted the existing approved layout plan
                     
                        <div style={{ display: "flex" }}>
         
                        <IconButton onClick={()=>getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.hostedLayoutPlan)}>
                          <DownloadForOfflineIcon color="primary" className="mx-1"  />
                        </IconButton>
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.hostedLayoutPlan
                            }}
                            onClick={() => {
                              setLabelValue("Whether you hosted the existing approved layout plan"),
                                setOpennedModal("hostedLayoutPlan")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Report any objection from any of the alottees

                
                        <div style={{ display: "flex" }}>
                  
                        <IconButton onClick={()=>getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.reportObjection)}>
                          <DownloadForOfflineIcon color="primary" className="mx-1"  />
                        </IconButton>
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.reportObjection
                            }}
                            onClick={() => {
                              setLabelValue("Report any objection from any of the alottees"),
                                setOpennedModal("reportObjection")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div> */}

                  </div>

                  {/* <div className="row">
                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Consent of RERA

                        <div style={{ display: "flex" }}>
                       
                        <IconButton onClick={()=>getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.consentRera)}>
                          <DownloadForOfflineIcon color="primary" className="mx-1"  />
                        </IconButton>
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.consentRera
                            }}
                            onClick={() => {
                              setLabelValue("Consent of RERA"),
                                setOpennedModal("consentRera")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Undertaking

                        <div style={{ display: "flex" }}>
                     
                        <IconButton onClick={()=>getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.undertaking)}>
                          <DownloadForOfflineIcon color="primary" className="mx-1"  />
                        </IconButton>
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.undertaking
                            }}
                            onClick={() => {
                              setLabelValue("Undertaking"),
                                setOpennedModal("undertaking")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Detailed specification and design for electric supply

                        <div style={{ display: "flex" }}>
                        
                        <IconButton onClick={()=>getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.detailedElectricSupply)}>
                          <DownloadForOfflineIcon color="primary" className="mx-1"  />
                        </IconButton>
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.designForElectricSupply
                            }}
                            onClick={() => {
                              setLabelValue("Detailed specification and design for electric supply"),
                                setOpennedModal("designForElectricSupply")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Salient feature of the proposed colony

                      
                        <div style={{ display: "flex" }}>
                      
                        <IconButton onClick={()=>getDocShareholding(DetailsofAppliedLand?.DetailsAppliedLand?.proposedColony)}>
                          <DownloadForOfflineIcon color="primary" className="mx-1"  />
                        </IconButton>
                          <ReportProblemIcon
                            style={{
                              display: hideRemarks || hideRemarksPatwari ?"none":"block",
                              color: fieldIconColors.proposedColony
                            }}
                            onClick={() => {
                              setLabelValue("Salient feature of the proposed colony"),
                                setOpennedModal("proposedColony")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                  </div> */}

                </div>


              </Col>
            </Row>

          </Form.Group>

        </div>
      </Collapse>

    </Form>
  );
};

export default AppliedLandinfo;
