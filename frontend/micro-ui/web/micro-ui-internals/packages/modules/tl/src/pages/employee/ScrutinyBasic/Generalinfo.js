import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";


import Collapse from "react-bootstrap/Collapse";
import ModalChild from "./Remarks/ModalChild";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "./css/personalInfoChild.style";
import Visibility from "@mui/icons-material/Visibility";
import FileDownload from "@mui/icons-material/FileDownload";
import { IconButton } from "@mui/material"; 
import { getDocShareholding } from "./ScrutinyDevelopment/docview.helper";

const Genarelinfo = (props) => {
  const [showhide1, setShowhide1] = useState("No");
  const [uncheckedValue, setUncheckedVlue] = useState([]);
  const [checkValue, setCheckedVAlue] = useState([]);
  // const [fieldValue, setFieldValue] = useState("");
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code) || [];
  const hideRemarks = userRoles.some((item)=>item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
  const hideRemarksPatwari = userRoles.some((item)=>item ==="Patwari_HQ")
  const hideRemarksJE = userRoles.some((item)=>item ==="JE_HQ" || item === "JE_HR")

  const genarelinfo = props.genarelinfo;
  const applicationStatus = props.applicationStatus;
  const dataIcons = props.dataForIcons;
  

  const applicantInfoPersonal = props.ApiResponseData;
  console.log("personal info applicant data1", applicantInfoPersonal);

  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  const [showhide2, setShowhide2] = useState("No");
  const [open, setOpen] = useState(false);

  const handleshow2 = (e) => {
    const getshow = e.target.value;
    setShowhide2(getshow);
  };
  const [purpose, setPurpose] = useState("");
  const handleChangesetPurpose = (e) => {
    setPurpose(e.target.value);
    localStorage.setItem("Purpose", e.target.value);
    props.passUncheckedList({ data: uncheckedValue, purpose: e?.target?.value });
  };
  const [totalArea, setTotalArea] = useState("");
  const handleChangesetTotalArea = (e) => {
    setTotalArea(e.target.value);
    localStorage.setItem("TotalArea", e.target.value);
    props.passUncheckedList({ data: uncheckedValue, totalArea: e?.target?.value });
  };

  const [form, setForm] = useState([]);
  const [open2, setOpen2] = useState(false);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [showhide, setShowhide] = useState("No");

  // const [purpose, setPurpose] = useState("");
  // const handleChangesetPurpose = (e) => {
  //   setPurpose(e.target.value);
  //   localStorage.setItem("Purpose", e.target.value);
  // };

  const handleshow = (e) => {
    const getshow = e.target.value;
    setShowhide(getshow);
  };
  const [noChecked, setNochecked] = useState(true);
  const [warningOrred, setwarningOrred] = useState("#ffcf33");

  const [smShow2, setSmShow2] = useState(false);
  const [smShow3, setSmShow3] = useState(false);

  const [color, setColor] = useState({ yes: false, no: false });

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
    return obj.label === "Purpose Of License";
  });
  const developerInputCheckedFiledColor = checkValue.filter((obj) => {
    return obj.label === "Purpose Of License";
  });
  console.log("color from array", developerInputFiledColor);

  const developerInputFiledColor1 = uncheckedValue.filter((obj) => {
    return obj.label === "Potential Zone";
  });
  const developerInputCheckedFiledColor1 = checkValue.filter((obj) => {
    return obj.label === "Potential Zone";
  });
  const developerInputFiledColor2 = uncheckedValue.filter((obj) => {
    return obj.label === "district";
  });
  const developerInputCheckedFiledColor2 = checkValue.filter((obj) => {
    return obj.label === "district";
  });
  const developerInputFiledColor3 = uncheckedValue.filter((obj) => {
    return obj.label === "State";
  });
  const developerInputCheckedFiledColor3 = checkValue.filter((obj) => {
    return obj.label === "State";
  });
  const developerInputFiledColor4 = uncheckedValue.filter((obj) => {
    return obj.label === "Tehsil";
  });
  const developerInputCheckedFiledColor4 = checkValue.filter((obj) => {
    return obj.label === "Tehsil";
  });
  const developerInputFiledColor5 = uncheckedValue.filter((obj) => {
    return obj.label === "Revenue estate";
  });
  const developerInputCheckedFiledColor5 = checkValue.filter((obj) => {
    return obj.label === "Revenue estate";
  });
  const developerInputFiledColor6 = uncheckedValue.filter((obj) => {
    return obj.label === "Rectangle No.";
  });
  const developerInputCheckedFiledColor6 = checkValue.filter((obj) => {
    return obj.label === "Rectangle No.";
  });
  const developerInputFiledColor7 = uncheckedValue.filter((obj) => {
    return obj.label === "Killa";
  });
  const developerInputCheckedFiledColor7 = checkValue.filter((obj) => {
    return obj.label === "Killa";
  });
  const developerInputFiledColor8 = uncheckedValue.filter((obj) => {
    return obj.label === "Land owner";
  });
  const developerInputCheckedFiledColor8 = checkValue.filter((obj) => {
    return obj.label === "Land owner";
  });

  const developerInputFiledColor10 = uncheckedValue.filter((obj) => {
    return obj.label === "Consolidation Type";
  });
  const developerInputCheckedFiledColor10 = checkValue.filter((obj) => {
    return obj.label === "Consolidation Type";
  });
  const developerInputFiledColor11 = uncheckedValue.filter((obj) => {
    return obj.label === "Kanal/Bigha";
  });
  const developerInputCheckedFiledColor11 = checkValue.filter((obj) => {
    return obj.label === "Kanal/Bigha";
  });
  const developerInputFiledColor12 = uncheckedValue.filter((obj) => {
    return obj.label === "Marla/Biswa";
  });
  const developerInputCheckedFiledColor12 = checkValue.filter((obj) => {
    return obj.label === "Marla/Biswa";
  });
  const developerInputFiledColor13 = uncheckedValue.filter((obj) => {
    return obj.label === "Khewat";
  });
  const developerInputCheckedFiledColor13 = checkValue.filter((obj) => {
    return obj.label === "Khewat";
  });

  console.log("color for the deeloper", developerInputFiledColor);
  console.log("AccessInfortech1", purpose);
  console.log("AccessInfortech12", totalArea);
  

  const classes = useStyles();

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    conditional:"#2874A6",
    approved:"#09cb3d",
    disapproved:"#ff0000",
   
    info:"#FFB602"
  }
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    purpose: Colors.info,
    potential: Colors.info,
    district: Colors.info,
    developmentPlan : Colors.info,
    state: Colors.info,
    tehsil: Colors.info,
    revenue: Colors.info,
    rectangle: Colors.info,
    rectangleNo: Colors.info,
    rectaNo: Colors.info,
    killa: Colors.info,
    landOwner: Colors.info,
    typeLand: Colors.info,
    isChange: Colors.info,
    consolidationType: Colors.info,
    kanal: Colors.info,
    marla: Colors.info,
    sarsai: Colors.info,
    bigha: Colors.info,
    biswa: Colors.info,
    biswansi : Colors.info,
    collabrationAgreement : Colors.info,
    developerCompany : Colors.info,
    dateOfRegistering : Colors.info,
    dateOfValidity : Colors.info,
    agreementIrrevocialble : Colors.info,
    nameOfAuthSignatory : Colors.info,
    nameOfAuthSignatoryDeveloper : Colors.info,
    registeringAuthority : Colors.info,
    hadbastNo : Colors.info,
    sector : Colors.info,
    editRectangleNo : Colors.info,
    editKhewats : Colors.info,
    landOwnerRegistry :Colors.info,
    collaboration : Colors.info,
    agreementValidFrom : Colors.info,
    authSignature :Colors.info,
    nameAuthSign : Colors.info,
    registeringAuthorityDoc : Colors.info,


  })

  const fieldIdList = [{ label: "Purpose Of License", key: "purpose" }, { label: "District", key: "district" }, { label: "State", key: "state" },{ label: "Development Plan", key: "developmentPlan" }, { label: "Potential Zone", key: "potential" },{ label: "Sector", key: "sector" }, { label: "Tehsil", key: "tehsil" }, { label: "Revenue estate", key: "revenue" }, { label: "Rectangle No", key: "rectangleNo" }, { label: "Killa", key: "killa" }, { label: "Land Owner", key: "landOwner" }, { label: "Consolidation Type", key: "consolidationType" },  { label: "Type of land", key: "typeLand" }, { label: "Rectangle No./Mustil(Changed)", key: "editRectangleNo" },  { label: "khewats No(Changed)", key: "editKhewats" },  { label: "Name of the Land Ower as per Mutation/Jamabandi", key: "landOwnerRegistry" }, { label: "Whether Khasra been developed in collaboration", key: "collaboration" }, { label: "change in information", key: "isChange" },{ label: "Kanal", key: "kanal" }, { label: "Marla", key: "marla" }, { label: "Sarsai", key: "sarsai" }, { label: "Bigha", key: "bigha" }, { label: "Biswa", key: "biswa" }, { label: "Biswansi", key: "biswansi" }, { label: "Collaboration Agreement", key: "collabrationAgreement" }, { label: "Name of the developer company", key: "developerCompany" }, { label: "Date of registering collaboration agreement", key: "agreementValidFrom" },{ label: "Date of Registering", key: "dateOfRegistering" }, { label: "Name of authorized signatory on behalf of land owner(s)", key: "authSignature" },{ label: "Name of authorized signatory on behalf of developer", key: "nameAuthSign" }, { label: "Date of Validity", key: "dateOfValidity" }, { label: "Registering Authority document", key: "registeringAuthorityDoc" }, { label: "Collaboration Agreement Irrevociable", key: "agreementIrrevocialble" }, { label: "Name of Authorized Signatory Developer", key: "nameOfAuthSignatory" }, { label: "Name of Authorized Signatory Developer", key: "nameOfAuthSignatoryDeveloper" }, { label: "Registering Authority", key: "registeringAuthority" }, { label: "Hadbast Number", key: "hadbastNo" } ];


  const getColorofFieldIcon = () => {
    let tempFieldColorState = fieldIconColors;
    fieldIdList.forEach((item) => {
      if (dataIcons !== null && dataIcons !== undefined) {
        console.log("color method called");
        const fieldPresent = dataIcons?.egScrutiny?.filter(ele => (ele.fieldIdL === item.label));
        console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
        if (fieldPresent && fieldPresent.length) {
          console.log("filteration value111", fieldPresent, fieldPresent[0]?.isApproved);
          tempFieldColorState = {...tempFieldColorState,[item.key]:fieldPresent[0].isApproved === "In Order" ?Colors.approved: fieldPresent[0].isApproved === "Not In Order" ? Colors.disapproved:fieldPresent[0].isApproved === "conditional" ? Colors.conditional:Colors.info}

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
      const fieldPresent = dataIcons?.egScrutiny?.filter(ele => (ele.fieldIdL === labelValue));
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
    <Form ref={props.generalInfoRef}>
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
          Application Purpose
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Form.Group className="justify-content-center" controlId="formBasicEmail" style={{ border: "2px solid #e9ecef", margin: 10, padding: 20 }}>
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="3" className={classes.formLabel}>
                <Form.Label>
               
                  <h5 >
                    Purpose Of Licence  <span style={{ color: "red" }}>*</span>
                  </h5>
                </Form.Label>

                <div className="d-flex flex-row  align-items-center">
                  <Form.Control
                    type="text"
                    placeholder={applicantInfoPersonal !== null ? applicantInfoPersonal?.purpose : null}
                  
                    // height={30}
                    // style={{ maxWidth: 200, marginRight: 5 }}
                    disabled
                  >
                   
                  </Form.Control>
                  {/* {JSON.stringify(userRoles)}
                    {JSON.stringify(hideRemarks)} */}
                    {/* display: hideRemarks?"none":"block", */}
                  <ReportProblemIcon
                    style={{
                      display: hideRemarks || hideRemarksPatwari ?"none":"block",
                  
                      color: fieldIconColors.purpose
                    }}
                    onClick={() => {
                      setOpennedModal("purpose")
                      setLabelValue("Purpose Of License"),
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.purpose : null);
                    }}
                  ></ReportProblemIcon>
                  {/* <ModalChild
                    labelmodal={labelValue}
                    passmodalData={handlemodaldData}
                    isYesorNoChecked={handleYesOrNochecked}
                    displaymodal={smShow}
                  ></ModalChild> */}
                  {/* <ModalChild
                    labelmodal={labelValue}
                    passmodalData={handlemodaldData}
                    isYesorNoChecked={handleYesOrNochecked}
                    displaymodal={smShow}
                    setColor={setColor}
                    // fieldValue={labelValue}
                    fieldValue={fieldValue}
                  // remarksUpdate={currentRemarks}
                  ></ModalChild> */}
                </div>
              </Col>
              {/* <div className="col col-3">
                <label htmlFor="potential">
                  <h5 className={classes.formLabel}>
                    Potential Zone:<span style={{ color: "red" }}>*</span>
                  </h5>
                </label>
                  
                <div className="d-flex flex-row  align-items-center">
                  <Form.Control
                    height={30}
                    style={{ maxWidth: 200, marginRight: 5 }}
                    placeholder={applicantInfoPersonal !== null ? applicantInfoPersonal?.potential : null}
                    className="form-control"
                    id="potential"
                    name="potential"
                    disabled
                  >
                    
                  </Form.Control>
                
                  <ReportProblemIcon
                    style={{
                      display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                      color: fieldIconColors.potential
                    }}
                    onClick={() => {
                      setLabelValue("Potential Zone"),
                      setOpennedModal("potential")
                        setSmShow(true),
                        console.log("modal open"),
                        setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.potential : null);
                    }}
                  ></ReportProblemIcon>
                </div>
              </div>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <h5 className={classes.formLabel}>
                      District:  <span style={{ color: "red" }}>*</span>
                    </h5>
                   
                  </Form.Label>
                  
                </div>
                <div>
                  <div className="d-flex flex-row  align-items-center">
                    <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      placeholder={applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null}
                      disabled
                    >
                 
                    </Form.Control>
                    <ReportProblemIcon
                      style={{
                        display: hideRemarks || hideRemarksPatwari ?"none":"block",

                        color: fieldIconColors.district
                      }}
                      onClick={() => {
                        setLabelValue("District"),
                        setOpennedModal("district")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <h5 className={classes.formLabel}>
                      State  <span style={{ color: "red" }}>*</span>
                    </h5>
                  
                  </Form.Label>
                      
                </div>
                <div>
                  <div className="d-flex flex-row  align-items-center">
                    <Form.Control
                      height={30}
                      style={{ maxWidth: 200, marginRight: 5 }}
                      placeholder={applicantInfoPersonal !== null ? applicantInfoPersonal?.state : null}
                      disabled
                    ></Form.Control>
                    <ReportProblemIcon
                      style={{
                        display: hideRemarks || hideRemarksPatwari ?"none":"block",
                      
                        color: fieldIconColors.state
                      }}
                      onClick={() => {
                        setLabelValue("State"),
                        setOpennedModal("state")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.state : null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>
               
              </Col> */}
            </Row>
     
            <div className="ml-auto" style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 24 }}> Land schedule</h2>
              <p className="ml-3 mt-1">
             

Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development agreements/ Memorandum of Understanding etc. and similar agreements registered with competent authority.
              </p>
              <p className="ml-3 mt-1">
                <b>(i) Khasra-wise information to be provided in the following format</b> 
              </p>
            </div>
            <br></br>

            <div style={{overflow:"scroll"}}>
              <table className="table table-bordered">
                <thead>
                  
                  <tr className="border-bottom-0">
                  <th class="fw-normal pb-0 border-bottom-0 align-top">
                  District   
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Development Plan   
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Zone    
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Sector    
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Tehsil    
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Revenue Estate   
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Hadbast No. 
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Rectangle No.  
                    </th>
                     <th class="fw-normal pb-0 border-bottom-0 align-top">
                    {/* Khasra No. */}
                    khewats No
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Name of Land Owner
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Type of land
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    change in information
                    </th>
                    
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Rectangle No./Mustil(Changed)
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    khewats No(Changed)
                    </th>
                     <th class="fw-normal pb-0 border-bottom-0 align-top">
                     Name of the Land Ower as per Mutation/Jamabandi
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Whether Khasra been developed in collaboration  
                    </th>
                     <th class="fw-normal pb-0 border-bottom-0 align-top">
                     Name of the developer company
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Date of registering collaboration agreement 
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Whether collaboration agreement irrevocable (Yes/No)
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Name of authorized signatory on behalf of land owner(s)
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Name of authorized signatory on behalf of developer
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Registering Authority
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Registering Authority document
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Consolidation Type  
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Kanal 
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Marla  
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Sarsai
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Bigha 
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Biswa 
                    </th>

                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Biswansi 
                    </th>
                  <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Total Area
                    </th> 
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Action Remarks 
                    </th>
                     
 </tr>
                  {/* <tr className="border-top-0">
                    <th class="fw-normal py-0 border-top-0">
                       <ReportProblemIcon
                      style={{
                        display: hideRemarks || hideRemarksPatwari ?"none":"block",

                        color: fieldIconColors.district
                      }}
                      onClick={() => {
                        setLabelValue("District"),
                        setOpennedModal("district")
                          setSmShow(true),
                          console.log("modal open"),
                          // setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null);
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.district : null);
                      }}
                    ></ReportProblemIcon></th>
                    <th class="fw-normal py-0 border-top-0">
                       <ReportProblemIcon
                      style={{
                        display: hideRemarks || hideRemarksPatwari ?"none":"block",

                        color: fieldIconColors.developmentPlan
                      }}
                      onClick={() => {
                        setLabelValue("Development Plan"),
                        setOpennedModal("developmentPlan")
                          setSmShow(true),
                          console.log("modal open"),
                          // setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null);
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.developmentPlan : null);
                        }}
                    ></ReportProblemIcon></th>
                  <th class="fw-normal py-0 border-top-0">
                    <ReportProblemIcon
                    style={{
                      display: hideRemarks || hideRemarksPatwari ?"none":"block",
                
                      color: fieldIconColors.potential
                    }}
                    onClick={() => {
                      setLabelValue("Potential Zone"),
                      setOpennedModal("potential")
                        setSmShow(true),
                        console.log("modal open"),
                        // setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.potential : null);
                        setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.potential : null);
                    }}
                  ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                         
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.sector
                        }}
                        onClick={() => {
                          setLabelValue("Sector"),
                          setOpennedModal("sector")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.sector : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                         
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.tehsil
                        }}
                        onClick={() => {
                          setLabelValue("Tehsil"),
                          setOpennedModal("tehsil")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.tehsil : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks?"none":"block",
                          color: fieldIconColors.revenue
                        }}
                        onClick={() => {
                          setLabelValue("Revenue estate"),
                          setOpennedModal("revenue")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.revenueEstate : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                   <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                         
                          color: fieldIconColors.hadbastNo
                        }}
                        onClick={() => {
                          setLabelValue(" Hadbast Number"),
                          setOpennedModal("hadbastNo")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.hadbastNo : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          // display: hideRemarks?"none":"block",
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.rectangleNo
                        }}
                        onClick={() => {
                          setLabelValue("Rectangle No"),
                          setOpennedModal("rectangeNo")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.rectangleNo : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.rectaNo
                        }}
                        onClick={() => {
                          setLabelValue("khewats No"),
                          setOpennedModal("khewatsNo")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.khewats : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.landOwner
                        }}
                        onClick={() => {
                          setLabelValue("Land owner"),
                          setOpennedModal("landOwner")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.landOwner : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          // display: hideRemarks?"none":"block",
                          // display: hideRemarksPatwari?"none":"block",
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.typeLand
                        }}
                        onClick={() => {
                          setLabelValue("Type of land"),
                          setOpennedModal("typeLand")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.typeLand : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          // display: hideRemarks?"none":"block",
                          // display: hideRemarksPatwari?"none":"block",
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.isChange
                        }}
                        onClick={() => {
                          setLabelValue("change in information"),
                          setOpennedModal("isChange")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.isChange : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          // display: hideRemarks?"none":"block",
                          // display: hideRemarksPatwari?"none":"block",
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.editRectangleNo
                        }}
                        onClick={() => {
                          setLabelValue("Rectangle No./Mustil(Changed)"),
                          setOpennedModal("editRectangleNo")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.editRectangleNo : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                   
                    
                   
                    <th class="fw-normal py-0 border-top-0">
                      {" "}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.editKhewats
                        }}
                        onClick={() => {
                          setLabelValue("khewats No(Changed)"),
                          setOpennedModal("editKhewats")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.editKhewats : null);
                        }}
                      ></ReportProblemIcon>
                    </th>

                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.landOwnerRegistry
                        }}
                        onClick={() => {
                          setLabelValue("Name of the Land Ower as per Mutation/Jamabandi"),
                          setOpennedModal("landOwnerRegistry")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.landOwnerRegistry : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    
                    
                    <th class="fw-normal py-0 border-top-0">
                      {" "}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.collaboration
                        }}
                        onClick={() => {
                          setLabelValue("Whether Khasra been developed in collaboration"),
                          setOpennedModal("collaboration")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.collaboration : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      {" "}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.developerCompany
                        }}
                        onClick={() => {
                          setLabelValue("Name of the developer company"),
                          setOpennedModal("developerCompany")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.developerCompany : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      {" "}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.agreementValidFrom
                        }}
                        onClick={() => {
                          setLabelValue("Date of registering collaboration agreement"),
                          setOpennedModal("agreementValidFrom")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.agreementValidFrom : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      {" "}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.agreementIrrevocialble
                        }}
                        onClick={() => {
                          setLabelValue("Collabration Agreement Irrevociable"),
                          setOpennedModal("agreementIrrevocialble")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.agreementIrrevocialble : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      {" "}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.authSignature
                        }}
                        onClick={() => {
                          setLabelValue("Name of authorized signatory on behalf of land owner(s)"),
                          setOpennedModal("authSignature")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.authSignature : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      {" "}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.nameAuthSign
                        }}
                        onClick={() => {
                          setLabelValue("Name of authorized signatory on behalf of developer"),
                          setOpennedModal("nameAuthSign")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.nameAuthSign : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      {" "}
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.registeringAuthority
                        }}
                        onClick={() => {
                          setLabelValue("Registering Authority"),
                          setOpennedModal("registeringAuthority")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.registeringAuthority : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          // display: hideRemarks?"none":"block",
                          // display: hideRemarksPatwari?"none":"block",
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.registeringAuthorityDoc
                        }}
                        onClick={() => {
                          setLabelValue("Registering Authority document"),
                          setOpennedModal("registeringAuthorityDoc")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.registeringAuthorityDoc : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.consolidationType
                        }}
                        onClick={() => {
                          setLabelValue("Consolidation Type"),
                          setOpennedModal("consolidationType")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.consolidationType : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.kanal
                        }}
                        onClick={() => {
                          setLabelValue("Kanal"),
                          setOpennedModal("kanal")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.kanal : null);
                        }}
                      ></ReportProblemIcon>
                      
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.marla
                        }}
                        onClick={() => {
                          setLabelValue("Marla"),
                          setOpennedModal("marla")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.marla : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.sarsai
                        }}
                        onClick={() => {
                          setLabelValue("Sarsai"),
                          setOpennedModal("sarsai")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.sarsai : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.bigha
                        }}
                        onClick={() => {
                          setLabelValue("Bigha"),
                          setOpennedModal("bigha")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.bigha : null);
                        }}
                      ></ReportProblemIcon>
                     
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.biswa
                        }}
                        onClick={() => {
                          setLabelValue("Biswa"),
                          setOpennedModal("biswa")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.biswa : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          display: hideRemarks || hideRemarksJE ?"none":"block",
                          color: fieldIconColors.biswansi
                        }}
                        onClick={() => {
                          setLabelValue("Biswansi"),
                          setOpennedModal("biswansi")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.biswansi : null);
                        }}
                      ></ReportProblemIcon>
                    </th> 
                    
                    <th class="fw-normal py-0 border-top-0">
                      <ReportProblemIcon
                        style={{
                          
                          display: hideRemarks || hideRemarksPatwari ?"none":"block",
                          color: fieldIconColors.tehsil
                        }}
                        onClick={() => {
                          setLabelValue("tehsil"),
                          setOpennedModal("ConsolidatedTotal")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails[0]?.tehsil : null);
                        }}
                      ></ReportProblemIcon>
                    </th>
                  </tr> */}
                </thead>
                <tbody>
                {
                    applicantInfoPersonal?.AppliedLandDetails?.map((item,index)=>(
                      
                  <tr key={index}>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.district } disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.developmentPlan} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.potential} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.sector} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.tehsil} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.revenueEstate} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.hadbastNo} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.rectangleNo} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.khewats} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.landOwner} placeholder={item?.landOwner} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.typeLand} placeholder={item?.typeLand} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.isChange} placeholder="N/A"  value={item?.isChange} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.editRectangleNo} placeholder="N/A" value={item?.editRectangleNo} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.editKhewats} placeholder={item?.editKhewats} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.landOwnerRegistry} placeholder={item?.landOwnerRegistry} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.collaboration} placeholder={item?.collaboration} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.developerCompany} placeholder={item?.developerCompany} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.agreementValidFrom} placeholder={item?.agreementValidFrom} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.agreementIrrevocialble} placeholder={item?.agreementIrrevocialble} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.authSignature} placeholder={item?.authSignature} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.nameAuthSign} placeholder={item?.nameAuthSign} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.registeringAuthority} placeholder={item?.registeringAuthority} disabled />
                    </td>
                    <td class="text-center">
                    <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.registeringAuthorityDoc)}>
                                      <Visibility color="info" className="icon" /></IconButton>
                                  
                                  </div>
                                  <div className="btn btn-sm col-md-6">
                                    <IconButton onClick={()=>getDocShareholding(item?.registeringAuthorityDoc)}>
                                <FileDownload color="primary" className="mx-1" />
                        </IconButton>
                        </div>
                      {/* <input type="text" className="form-control" title={item?.registeringAuthorityDoc} placeholder={item?.registeringAuthorityDoc} disabled /> */}
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.consolidationType} placeholder={item?.consolidationType} disabled />
                    </td>
                    <td class="text-center">
                      {" "}
                      <input type="text" className="form-control" title={item?.kanal} placeholder={item?.kanal} disabled />{" "}
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.marla} placeholder={item?.marla} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.sarsai} placeholder={item?.sarsai} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.bigha} placeholder={item?.bigha} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.biswa} placeholder={item?.biswa} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.biswansi} placeholder={item?.biswansi} disabled />
                    </td>
                    {item?.consolidationType == "non-consolidated" && 
                      <td class="text-center">
                      <input type="text" className="form-control" title={item?.nonConsolidatedTotal} placeholder={item?.nonConsolidatedTotal} disabled />
                    </td>
                     }
                     {item?.consolidationType == "consolidated" && 
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.consolidatedTotal} placeholder={item?.consolidatedTotal} disabled />
                    </td>
                     }
                     <td  class="text-center">
                     {/* <th class="fw-normal py-0 border-top-0"> */}
                       <ReportProblemIcon
                      style={{
                        display: hideRemarks ?"none":"block",

                        color: fieldIconColors.district
                      }}
                      onClick={() => {
                        setLabelValue("Land schedule Table"),
                        setOpennedModal("district")
                          setSmShow(true),
                          console.log("modal open"),
                          setFieldValue(applicantInfoPersonal !== null ? applicantInfoPersonal?.district : null);
                          // setFieldValue(applicantInfoPersonal?.AppliedLandDetails[0] !== null ? applicantInfoPersonal?.AppliedLandDetails : null);
                      }}
                    ></ReportProblemIcon>
                    {/* </th> */}
                     </td>
  </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            {/* </div>
      </Collapse> */}
            {/* <div style={{ position: "relative", marginBottom: 40 }}>
              <Button onClick={() => props.passUncheckedList({ data: uncheckedValue, purpose: purpose })}>Submit</Button>
            </div> */}
          </Form.Group>
   </div>
      </Collapse>
      {/* </Card> */}
    </Form>
  );
};

export default Genarelinfo;
