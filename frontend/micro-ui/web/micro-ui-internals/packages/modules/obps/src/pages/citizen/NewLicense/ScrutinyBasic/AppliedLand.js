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
    sitePlan: Colors.info,
    democraticPlan: Colors.info,
    sectoralPlan: Colors.info,
    developmentPlan: Colors.info,
    uploadLayoutPlan: Colors.info,
  })

  const fieldIdList = [{ label: "DGPS Point", key: "dgpsPoint" }, { label: "Details of Plots", key: "detailsOfPlots" }, { label: "Area Under", key: "areaUnder" }, { label: "NILP", key: "nilp" }, { label: "Site plan", key: "nilp" }, { label: "Democratic Plan", key: "nilp" }, { label: "Sectoral Plan/Layout Plan", key: "sectoralPlan" }, { label: "Development Plan", key: "developmentPlan" }, { label: "Upload Layout Plan", key: "uploadLayoutPlan" },];


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
                        setFieldValue();
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
                      <input type="number" name="XLongitude" className="form-control" disabled />
                    </div>
                    <div className="col col-6">
                      <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                      <input type="number" name="YLatitude" className="form-control" disabled />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  (ii)Add point 2 &nbsp;
                  <div className="row ">
                    <br></br>
                    <div className="col col-6">
                      <label className={classes.formLabel} htmlFor="pitentialZone">X:Longitude</label>
                      <input type="number" name="XLongitude" className="form-control" disabled />
                    </div>
                    <div className="col col-6">
                      <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                      <input type="number" name="YLatitude" className="form-control" disabled />
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
                        <input type="number" name="XLongitude" className="form-control" disabled />
                      </div>
                      <div className="col col-6">
                        <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" disabled />
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
                        <input type="number" name="XLongitude" className="form-control" disabled />
                      </div>
                      <div className="col col-6">
                        <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" disabled />
                      </div>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                  </div>

                  {[...Array(noOfRows)].map((elementInArray, index) => {
                    return (
                      <div className="row ">
                        <div className="col col-6">
                          <label className={classes.formLabel} htmlFor="pitentialZone">X:Longiude</label>
                          <input type="number" name="XLongitude" className="form-control" disabled />
                        </div>
                        <div className="col col-6">
                          <label className={classes.formLabel} htmlFor="pitentialZone">Y:Latitude</label>
                          <input type="number" name="YLatitude" className="form-control" disabled />
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
                    <input type="radio" id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow18} disabled />
                    <label className={`${classes.formLabel}  m-0  mx-1`} htmlFor="gen">Regular</label>&nbsp;&nbsp;
                    <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow18} disabled />
                    <label  className={`${classes.formLabel}  m-0  mx-1`} htmlFor="npnl">Irregular</label>
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
                        setFieldValue();
                      }}
                    ></ReportProblemIcon>
                  </div>
                </h5>
                <br></br>
                {showhide18 === "1" && (
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
                          <input type="text" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Gen</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">NPNL</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">EWS</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
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
                          <input type="text" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
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
                          <input type="text" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
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
                          <input type="text" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
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
                          <input type="text" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">STP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="number" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">ETP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="number" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">WTP</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="number" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">UGT</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="number" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">Milk Booth</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="number" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="px-2">
                            <p className="mb-2">GSS</p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="number" className="form-control" disabled />
                        </td>

                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                        <td align="right">
                          {" "}
                          <input type="number" className="form-control" disabled />
                        </td>
                      </tr>
                    </tbody>
                  </div>
                )}
                {showhide18 === "2" && (
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
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
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
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
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
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled />
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
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
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
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
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
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
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
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td component="th" scope="row">
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
                          </td>
                          <td align="right">
                            {" "}
                            <input type="number" className="form-control" disabled />
                          </td>
                        </tr>
                      </tbody>
                    </div>
                  </div>
                )}

                <div>
                  <DDJAYForm displayDdjay={Purpose === "08" ? "block" : "none"}></DDJAYForm>
                </div>
                <div>
                  <ResidentialPlottedForm displayResidential={Purpose === "03" ? "block" : "none"}></ResidentialPlottedForm>
                </div>
                <div>
                  <IndustrialPlottedForm displayIndustrial={Purpose === "06" ? "block" : "none"}></IndustrialPlottedForm>
                </div>

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
                    <div class="col-2 border p-1 d-flex flex-row justify-content-center align-items-center ">
                      <input
                        type="radio"
                        value="Yes"
                        id="Yes"
                        disabled
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                      />
                      <label className={`${classes.formLabel}  m-0  mx-2`} for="Yes">Yes</label>

                      <input
                        type="radio"
                        value="No"
                        id="No"
                        disabled
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                      />
                      <label className={`${classes.formLabel}  m-0  mx-2`} for="No">No</label></div>
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
                    <div class="col-2 border p-1 d-flex flex-row justify-content-center align-items-center ">
                      <input
                        type="radio"
                        value="Yes"
                        id="Yes"
                        disabled
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                      />
                      <label className={`${classes.formLabel}  m-0  mx-2`} for="Yes">Yes</label>

                      <input
                        type="radio"
                        value="No"
                        id="No"
                        disabled
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                      />
                      <label className={`${classes.formLabel}  m-0  mx-2`} for="No">No</label></div>
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
                    <div class="col-2 border p-1 d-flex flex-row justify-content-center align-items-center ">
                      <input
                        type="radio"
                        value="Yes"
                        id="Yes"
                        disabled
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                      />
                      <label className={`${classes.formLabel}  m-0  mx-2`} for="Yes">Yes</label>

                      <input
                        type="radio"
                        value="No"
                        id="No"
                        disabled
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                      />
                      <label className={`${classes.formLabel}  m-0  mx-2`} for="No">No</label></div>
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
                    <div class="col-2 border p-1 d-flex flex-row justify-content-center align-items-center ">
                      <input
                        type="radio"
                        value="Yes"
                        id="Yes"
                        disabled
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                      />
                      <label className={`${classes.formLabel}  m-0  mx-2`} for="Yes">Yes</label>

                      <input
                        type="radio"
                        value="No"
                        id="No"
                        disabled
                      // onChange={handleChange} name="Yes" onClick={handleshow0}
                      />
                      <label className={`${classes.formLabel}  m-0  mx-2`} for="No">No</label></div>
                  </div>
                </div>




                <hr className="mb-4" />

                <h5 className="text-black" style={{ marginBottom: "2%" }}>
                  Mandatory Documents
                </h5>
                <div className={`${classes.formLabel} row`}>
                  <div className="col col-3">
                    <h6 className="d-flex flex-row align-items-center">
                      Site plan.
                      <div style={{ display: "flex" }}>
                        {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                        {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.sitePlan
                          }}
                          onClick={() => {
                            setLabelValue("Site plan"),
                        setOpennedModal("sitePlan")
                      setSmShow(true),
                        console.log("modal open"),
                        setFieldValue();
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </h6>
                    {/* <input type="file" className="form-control" disabled /> */}
                  </div>
                  <div className="col col-3">
                    <h6 className="d-flex flex-row align-items-center">
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
                    </h6>
                    {/* <input type="file" className="form-control" disabled />
                    {<DownloadForOfflineIcon color="primary" />} */}
                  </div>
                  <div className="col col-3">
                    <h5 className="d-flex flex-row align-items-center" >Sectoral Plan/Layout Plan.

                      <div style={{ display: "flex" }}>
                        {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                        {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                        <ReportProblemIcon
                          style={{
                            color:fieldIconColors.sectoralPlan
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
                    <h5 className="d-flex flex-row align-items-center">Development Plan.

                      {/* <input type="file" className="form-control" disabled /> */}
                      {/* {<DownloadForOfflineIcon color="primary" />} */}
                      <div style={{ display: "flex" }}>
                        {/* <input type="file" height={30} style={{ maxWidth: 200, marginRight: 5 }} className="form-control" disabled /> */}
                        {<DownloadForOfflineIcon color="primary" className="mx-1" />}
                        <ReportProblemIcon
                          style={{
                            color: fieldIconColors.developmentPlan
                          }}
                          onClick={() => {
                            setLabelValue("Development Plan"),
                            setOpennedModal("developmentPlan")
                          setSmShow(true),
                            console.log("modal open"),
                            setFieldValue();                          }}
                        ></ReportProblemIcon>
                      </div>
                    </h5>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <h5 className="d-flex flex-row">
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
                        <span className="text-primary"> (Click here for instructions to capture DGPS points)</span>
                      </div>
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
