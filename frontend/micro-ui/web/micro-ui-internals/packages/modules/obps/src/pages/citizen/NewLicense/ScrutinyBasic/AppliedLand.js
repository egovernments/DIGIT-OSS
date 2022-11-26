import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
import MigrationAppliedTrue from "./MigrationAplliedTrue";
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
// import { tr, thead, TableContainer, td, tbody, Table, Paper } from '@material-ui/core';
// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@material-ui/icons/Delete";
// import * as Icon from "react-bootstrap-icons";
// import { XCircleFill } from "react-bootstrap-icons";
// import { CheckCircleFill } from "react-bootstrap-icons";
// import { PlusSquareFill } from "react-bootstrap-icons";
// import { DashSquareFill } from "react-bootstrap-icons";
// import { ArrowDownCircleFill } from "react-bootstrap-icons";
import DDJAYForm from "../ScrutinyBasic/Puropse/DdjayForm";
import ResidentialPlottedForm from "../ScrutinyBasic/Puropse/ResidentialPlotted";
import IndustrialPlottedForm from "../ScrutinyBasic/Puropse/IndustrialPlotted";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import Collapse from "react-bootstrap/Collapse";
import AddIcon from "@mui/icons-material/Add";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyles } from "./css/personalInfoChild.style";

const AppliedLandinfo = (props) => {

  const dataIcons = props.dataForIcons;
  const DetailsofAppliedLand = props.ApiResponseData;
  console.log("personal info applicant data4", DetailsofAppliedLand);


  const [uncheckedValue, setUncheckedVlue] = useState([]);
  console.log(uncheckedValue);
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
  const [modaldData, setmodaldData] = useState({ label: "", Remarks: "" });
  const [isyesOrNochecked, setYesorNochecked] = useState(true);

  const [urlGetShareHoldingDoc,setDocShareHoldingUrl] = useState("")


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
  console.log("Akash", Purpose);


  const classes = useStyles();

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
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
    crossSectionPlans: Colors.info,
    publicHealthServicePositionPlan: Colors.info,
    designsOfRoadWorks: Colors.info,
    designOfStormAndWaterSupply: Colors.info,
    designForDisposal: Colors.info,
    undertakingThatNoChange: Colors.info,
    existingApprovedLayoutPlan: Colors.info,
    anyObjection: Colors.info,
    consentOfRERA: Colors.info,
    undertaking: Colors.info,
    designForElectricSupply: Colors.info,
    salientFeatureColony: Colors.info
  })

  const fieldIdList = [{ label: "DGPS Point", key: "dgpsPoint" }, { label: "Details of Plots", key: "detailsOfPlots" }, { label: "Area Under", key: "areaUnder" }, { label: "NILP", key: "nilp" }, { label: "Demarcation plan", key: "demarcationPlan" }, { label: "Democratic Plan", key: "democraticPlan" }, { label: "Sectoral Plan/Layout Plan", key: "sectoralPlan" }, { label: "Upload Layout Plan", key: "uploadLayoutPlan" }, { label: "Plan showing cross sections", key: "crossSectionPlans" }, { label: "Plan indicating positions of public health services", key: "publicHealthServicePositionPlan" }, { label: "Specifications and designs of road works", key: "designsOfRoadWorks" }, { label: "Designs and Sewerage, storm and water supply", key: "designOfStormAndWaterSupply" }, { label: "Designs of disposal and treatment of storm", key: "designForDisposal" }, { label: "Upload Layout Undertaking that no change", key: "undertakingThatNoChange" }, { label: "Whether you hosted the existing approved layout plan", key: "existingApprovedLayoutPlan" }, { label: "Report any objection from any of the alottees", key: "anyObjection" }, { label: "Consent of RERA", key: "consentOfRERA" }, { label: "Undertaking", key: "undertaking" }, { label: "Detailed specification and design for electric supply", key: "designForElectricSupply" }, { label: "Salient feature of the proposed colony", key: "salientFeatureColony" }];


  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons.egScrutiny.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = { ...tempFieldColorState, [item.key]: fieldPresent[0].isApproved ? Colors.approved : Colors.disapproved }

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


  
  const getDocShareholding = async () => {
    // if ((Documents?.uploadPdf !== null || Documents?.uploadPdf !== undefined) && (uploadPdf!==null || uploadPdf!=="")) {
        
        try {
            const response = await axios.get(`/filestore/v1/files/url?tenantId=hr&fileStoreIds=${DetailsofAppliedLand?.DetailsAppliedLand?.democraticPlan}`, {

            });
            const FILDATA = response.data?.fileStoreIds[0]?.url;
            setDocShareHoldingUrl(FILDATA)
        } catch (error) {
            console.log(error.message);
        }
    // }
  }

  useEffect(() => {
    getDocShareholding();
  }, [DetailsofAppliedLand?.DetailsAppliedLand?.democraticPlan]);
  

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
          <Form.Group
            style={{ display: props.displayPurpose, border: "2px solid #e9ecef", margin: 10, padding: 10 }}
            className="justify-content-center"
          >
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col col-12>
                <div style={{ display: "flex" }}>
                  {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                  1. DGPS points <span className="text-primary"> (Click here for instructions to capture DGPS points)</span>
                  <ReportProblemIcon
                    style={{
                      color: fieldIconColors.dgpsPoint
                    }}
                    onClick={() => {
                      setLabelValue("DGPS points"),
                        setOpennedModal("dgpsPoint")
                      setSmShow(true),
                        console.log("modal open"),
                        setFieldValue("");
                    }}
                  ></ReportProblemIcon>
                </div>
                {/* </h5> */}

                <div className="px-2">
                  (i)Add point 1 &nbsp;
                  <div className="row ">
                    <br></br>
                    <div className="col col-6">
                      <label className={classes.formLabel} htmlFor="pitentialZone">X:Longitude</label>
                      <input type="number" name="XLongitude" className="form-control" disabled placeholder={DetailsofAppliedLand?.dgps?.point1?.longitude} />
                    </div>
                    <div className="col col-6">
                      <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                      <input type="number" name="YLatitude" className="form-control" disabled placeholder={DetailsofAppliedLand?.dgps?.point1?.latitude} />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  (ii)Add point 2 &nbsp;
                  <div className="row ">
                    <br></br>
                    <div className="col col-6">
                      <label className={classes.formLabel} htmlFor="pitentialZone">X:Longitude</label>
                      <input type="number" name="XLongitude" className="form-control" disabled placeholder={DetailsofAppliedLand?.dgps?.point2?.longitude} />
                    </div>
                    <div className="col col-6">
                      <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                      <input type="number" name="YLatitude" className="form-control" disabled placeholder={DetailsofAppliedLand?.dgps?.point2?.latitude} />
                    </div>
                  </div>
                </div>

                <div className="px-2">
                  <div className="text-black">
                    (iii)Add point 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br></br>
                    <div className="row ">
                      <div className="col col-6">
                        <label className={classes.formLabel} htmlFor="pitentialZone">X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" disabled placeholder={DetailsofAppliedLand?.dgps?.point3?.longitude} />
                      </div>
                      <div className="col col-6">
                        <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" disabled placeholder={DetailsofAppliedLand?.dgps?.point3?.latitude} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div className="text-black">
                    (iv)Add point 4 &nbsp;
                    <div className="row ">
                      <br></br>
                      <div className="col col-6">
                        <label className={classes.formLabel} htmlFor="pitentialZone">X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" disabled placeholder={DetailsofAppliedLand?.dgps?.point4?.longitude} />
                      </div>
                      <div className="col col-6">
                        <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" disabled placeholder={DetailsofAppliedLand?.dgps?.point4?.latitude} />
                      </div>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                  </div>

                  {[...Array(noOfRows)].map((elementInArray, index) => {
                    return (
                      <div className="row ">
                        <div className="col col-6">
                          <label className={classes.formLabel} htmlFor="pitentialZone">X:Longiude</label>
                          <input type="number" name="XLongitude" className="form-control" disabled placeholder={elementInArray?.longitude} />
                        </div>
                        <div className="col col-6">
                          <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                          <input type="number" name="YLatitude" className="form-control" disabled placeholder={elementInArray?.latitude} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <hr className="my-3" />
                {/* <Collapse in={open}>
        <div id="example-collapse-text"> */}
                <h5 className={`text-black d-flex flex-row align-items-center ${classes.formLabel}`} style={{ marginTop: "3%" }}>
                  2.Details of Plots
                  <div className="ml-3 d-flex flex-row align-items-center">
                    <input type="radio" id="Yes" value="1" name="Yes" disabled checked={DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "regular" ? true : false} />
                    <input type="radio"  value="1"  disabled checked={DetailsofAppliedLand?.detailsOfPlots === "1" ? true : false} />
                    <label className={`${classes.formLabel}  m-0  mx-1`} htmlFor="gen">Regular</label>&nbsp;&nbsp;
                    <input type="radio" id="Yes" value="2" name="Yes" checked={DetailsofAppliedLand?.DetailsAppliedLandPlot?.regularOption === "Irregular" ? true : false} disabled />
                    <input type="radio"  value="2"  checked={DetailsofAppliedLand?.detailsOfPlots === "2" ? true : false} disabled />
                    <label className={`${classes.formLabel}  m-0  mx-1`} htmlFor="npnl">Irregular</label>
                  </div>
                  <div style={{ margin: 5 }}>
                    {" "}
                    <ReportProblemIcon
                      style={{
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
                            <p className="mb-2">Gen</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.gen?.plotNo} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.gen?.length} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.gen?.width} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.gen?.area} />
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
                            // onChange={(e)=>setComPlotno(e.target.value)} value={complotno}
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
                            // onChange={(e)=>setSitePlotno(e.target.value)} value={siteplotno}
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
                            // onChange={(e)=>setParkPlotno(e.target.value)} value={parkplotno}
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
                            // onChange={(e)=>setPublicPlotno(e.target.value)} value={publicplotno}
                            >
                              Public Utilities
                            </p>
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
                            <p className="mb-2">STP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.stp?.plotNo} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.stp?.length} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.stp?.width} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.stp?.area} />
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
                          <input type="text" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.wssplotno} />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.wsslengthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.wsswidthmtr} />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled placeholder={DetailsofAppliedLand?.DetailsAppliedLandPlot?.wssareasq} />
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
                              //  onChange={(e)=>setIrPlotDimen(e.target.value)} value={irPlotDimen}
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
                              // onChange={(e)=>setIrSizeDimen(e.target.value)} value={irSizeDimen}
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
                        {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                        Area Under
                        <ReportProblemIcon
                          style={{
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
                              // onChange={(e)=>setNpnlNo(e.target.value)} value={npnlNo}
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
                              // onChange={(e)=>setEwsNo(e.target.value)} value={ewsNo}
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
                              // onChange={(e)=>setEwsNo(e.target.value)} value={ewsNo}
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
                              //  onChange={(e)=>setEwsNo(e.target.value)} value={ewsNo}
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
                              // onChange={(e)=>setEwsNo(e.target.value)} value={ewsNo}
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
                )}
                	 <div>
                  <DDJAYForm displayDdjay={Purpose === "DDJAY" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandDdjay} dataForIcons={dataIcons}></DDJAYForm>
                </div>
                <div>
                  <ResidentialPlottedForm displayResidential={Purpose === "Residential Plotted" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandResidential} dataForIcons={dataIcons} ></ResidentialPlottedForm>
                </div>
                <div>
                  <IndustrialPlottedForm displayIndustrial={Purpose === "Industrial Plotted" ? "block" : "none"} data={DetailsofAppliedLand?.DetailsAppliedLandIndustrial} dataForIcons={dataIcons} ></IndustrialPlottedForm>
                </div>
                
                {/* <div>
                  <DDJAYForm displayDdjay={Purpose === "08" ? "block" : "none"} data={DetailsofAppliedLand?.ddjay}></DDJAYForm>
                  <DDJAYForm displayDdjay={Purpose !== "DDJAY" ? "block" : "none"} data={DetailsofAppliedLand?.ddjay} dataForIcons={dataIcons}></DDJAYForm>
                </div>
                <div>
                  <ResidentialPlottedForm displayResidential={Purpose === "03" ? "block" : "none"} data={DetailsofAppliedLand?.residential} ></ResidentialPlottedForm>
                  <ResidentialPlottedForm displayResidential={Purpose !== "Residential Plotted" ? "block" : "none"} data={DetailsofAppliedLand?.residential} dataForIcons={dataIcons} ></ResidentialPlottedForm>
                </div>
                <div>
                  <IndustrialPlottedForm displayIndustrial={Purpose === "06" ? "block" : "none"} data={DetailsofAppliedLand?.industrial}></IndustrialPlottedForm>
                  <IndustrialPlottedForm displayIndustrial={Purpose !== "Industrial Plotted" ? "block" : "none"} data={DetailsofAppliedLand?.industrial} dataForIcons={dataIcons} ></IndustrialPlottedForm>
                </div> */}
                  {/* <div>
                  <DDJAYForm displayDdjay={Purpose !== "DDJAY" ? "block" : "none"} data={DetailsofAppliedLand?.ddjay} dataForIcons={dataIcons}></DDJAYForm>
                </div>
                <div>
                  <ResidentialPlottedForm displayResidential={Purpose !== "Residential Plotted" ? "block" : "none"} data={DetailsofAppliedLand?.residential} dataForIcons={dataIcons} ></ResidentialPlottedForm>
                </div>
                <div>
                  <IndustrialPlottedForm displayIndustrial={Purpose !== "Industrial Plotted" ? "block" : "none"} data={DetailsofAppliedLand?.industrial} dataForIcons={dataIcons} ></IndustrialPlottedForm>
                </div> */}

                <h5 className="text-black mt-4">
                  <div style={{ display: "flex" }}>
                    NILP :-
                    {/* <Form.Control height={30} style={{ maxWidth: 200, marginRight: 5 }} disabled></Form.Control> */}
                    <ReportProblemIcon
                      style={{
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
                </h5>


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

                      {DetailsofAppliedLand?.DetailsAppliedLandNILP?.proposedPocket === "Y" && (
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
                            <input type="text" className="form-control" placeholder={DetailsofAppliedLand?.DetailsAppliedLandNILP?.Area} />
                          </div>
                        </div>

                      )}
                    </div>
                  </div>
                </div>




                <hr className="mb-4" />

                <h5 className="text-black" style={{ marginBottom: "2%" }}>
                  Mandatory Documents
                </h5>
                <div className={`${classes.formLabel} row`}>
                  <div className="col col-3">
                    <h5 className="d-flex flex-column mb-2">
                      Demarcation Plan
                      <div style={{ display: "flex" }}>
                        {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                        {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                        <ReportProblemIcon
                          style={{
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
                    {/* <input type="file" className="form-control" disabled /> */}
                  </div>
                  <div className="col col-3">
                  <h5 className="d-flex flex-column mb-2">
                      Democratic Plan.
                      <div style={{ display: "flex" }}>
                        {/* Site plan. */}

                        {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                        {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                        <ReportProblemIcon
                          style={{
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
                    {/* <input type="file" className="form-control" disabled />
                    {<DownloadForOfflineIcon color="primary" />} */}
                  </div>
                  <div className="col col-3">
                    <h5 className="d-flex flex-column mb-2" >Sectoral Plan/Layout Plan.

                      <div style={{ display: "flex" }}>
                        {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                        {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                        <ReportProblemIcon
                          style={{
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
                    {/* <input type="file" className="form-control" disabled />
                    {<DownloadForOfflineIcon color="primary" />} */}


                  </div>
                    <div className="col col-3">
                      <div className="form-group">
                        <h5 className="d-flex flex-column mb-2">
                          Upload Layout Plan
                          <div style={{ display: "flex" }}>
                            {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                            {/* <Form.Control  disabled></Form.Control> */}
                            {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                            <ReportProblemIcon
                              style={{
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
                        {/* <span className="text-primary"> (Click here for instructions to capture DGPS points)</span> */}
                      </div>
                    </div>

                  <div className="row">
                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Plans showing cross sections

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.crossSectionPlans
                            }}
                            onClick={() => {
                              setLabelValue("Plan showing cross sections"),
                                setOpennedModal("crossSectionPlans")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Plan indicating positions of public health services

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.publicHealthServicePositionPlan
                            }}
                            onClick={() => {
                              setLabelValue("Plan indicating positions of public health services"),
                                setOpennedModal("publicHealthServicePositionPlan")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Specifications and designs of road works
                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.designsOfRoadWorks
                            }}
                            onClick={() => {
                              setLabelValue("Specifications and designs of road works"),
                                setOpennedModal("designsOfRoadWorks")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Designs and Sewerage, storm and water supply
                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.designOfStormAndWaterSupply
                            }}
                            onClick={() => {
                              setLabelValue("Designs and Sewerage, storm and water supply"),
                                setOpennedModal("designOfStormAndWaterSupply")
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
                      <h5 className="d-flex flex-column mb-2">Designs of disposal and treatment of storm

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.designForDisposal
                            }}
                            onClick={() => {
                              setLabelValue("Designs of disposal and treatment of storm"),
                                setOpennedModal("designForDisposal")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                    <div className="col col-3">
                      <h5 className="d-flex flex-column mb-2">Upload Layout Undertaking that no change

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.undertakingThatNoChange
                            }}
                            onClick={() => {
                              setLabelValue("Upload Layout Undertaking that no change"),
                                setOpennedModal("undertakingThatNoChange")
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
                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.existingApprovedLayoutPlan
                            }}
                            onClick={() => {
                              setLabelValue("Whether you hosted the existing approved layout plan"),
                                setOpennedModal("existingApprovedLayoutPlan")
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

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.anyObjection
                            }}
                            onClick={() => {
                              setLabelValue("Report any objection from any of the alottees"),
                                setOpennedModal("anyObjection")
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
                      <h5 className="d-flex flex-column mb-2">Consent of RERA

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.consentOfRERA
                            }}
                            onClick={() => {
                              setLabelValue("Consent of RERA"),
                                setOpennedModal("consentOfRERA")
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

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
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

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
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

                        {/* <input type="file" className="form-control" disabled /> */}
                        {/* {<DownloadForOfflineIcon color="primary" />} */}
                        <div style={{ display: "flex" }}>
                          {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                          {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                          <ReportProblemIcon
                            style={{
                              color: fieldIconColors.salientFeatureColony
                            }}
                            onClick={() => {
                              setLabelValue("Salient feature of the proposed colony"),
                                setOpennedModal("salientFeatureColony")
                              setSmShow(true),
                                console.log("modal open"),
                                setFieldValue();
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </h5>
                    </div>

                  </div>

                </div>

                {/* <Button style={{ alignSelf: "center", marginTop: 20, marginright: 867 }} variant="primary" type="submit">
                  Save as Draft
                </Button>
                <Button style={{ alignSelf: "center", marginTop: 8, marginLeft: 1025 }} variant="primary" type="submit">
                  Continue
                </Button> */}
                {/* </div>
      </Collapse> */}
              </Col>
            </Row>
            {/* <div style={{ position: "relative", marginBottom: 40 }}>
              <Button onClick={() => props.passUncheckedList({ data: uncheckedValue })}>Submit</Button>
            </div> */}
          </Form.Group>

          {/* <hr></hr> */}
        </div>
      </Collapse>
      {/* </Card> */}
    </Form>
  );
};

export default AppliedLandinfo;
