import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Collapse from "react-bootstrap/Collapse";
import ModalChild from "../../Remarks/ModalChild";
import { FormHelperText, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";

const Colors = {
  approved: "#09cb3d",
  disapproved: "#ff0000",
  info: "#FFB602",
};

function ExtensionClu({ apiResponse, dataForIcons, refreshScrutinyData, applicationNumber, passUncheckedList, passCheckedList, applicationStatus }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch
  } = useForm({});

  const extensionClu = (data) => console.log(data);
  const [open2, setOpen2] = useState(false);
  const [openedModal, setOpennedModal] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [fieldValue, setFieldValue] = useState("");
  const [selectedFieldData, setSelectedFieldData] = useState();
  const { t } = useTranslation();
  const { pathname: url } = useLocation();
  const [loader, setLoading] = useState(false);
  const [fieldIconColors, setFieldIconColors] = useState({
    caseNo: Colors.info,
    applicationNo: Colors.info,
    naturePurpose: Colors.info,
    totalAreaSq: Colors.info,
    cluDate: Colors.info,
    expiryClu: Colors.info,
    stageConstruction: Colors.info,
    applicantName: Colors.info,
    mobile: Colors.info,
    emailAddress: Colors.info,
    address: Colors.info,
    village: Colors.info,
    tehsil: Colors.info,
    pinCode: Colors.info,
    reasonDelay: Colors.info,
    uploadbrIII: Colors.info,
    uploadPhotographs: Colors.info,
    receiptApplication: Colors.info,
    uploadBuildingPlan: Colors.info,
    indemnityBond: Colors.info,
  });

  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    if (openedModal && data) {
      setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    }
    setOpennedModal("");
    setLabelValue("");
  };

  useEffect(() => {
    if (apiResponse) {
      setCLUData(apiResponse)
    }
  }, [apiResponse])

  const setCLUData = (details) => {
    // setCLUpermissionDetails(details || {});
    setValue("applicationNo", details?.applicationNo);
    setValue("caseNo", details?.caseNo);
    setValue("naturePurpose", details?.naturePurpose);
    setValue("totalAreaSq", details?.totalAreaSq);
    setValue("cluDate", details?.cluDate);
    setValue("applicantName", details?.applicantName);
    setValue("expiryClu", details?.expiryClu);
    setValue("stageConstruction", details?.stageConstruction);
    setValue("mobile", details?.mobile);
    setValue("emailAddress", details?.emailAddress);
    setValue("address", details?.address);
    setValue("village", details?.village);
    setValue("pinCode", details?.pinCode);
    setValue("tehsil", details?.tehsil);
    setValue("reasonDelay", details?.reasonDelay);
    setValue("buildingPlanApprovalStatus", details?.buildingPlanApprovalStatus);
    setValue("zoningPlanApprovalDate", details?.zoningPlanApprovalDate);
    setValue("dateOfSanctionBuildingPlan", details?.dateOfSanctionBuildingPlan);
    setValue("appliedFirstTime", details?.appliedFirstTime);
    setValue("uploadbrIIIfileUrl", details?.uploadbrIIIfileUrl);
    setValue("cluPermissionLetterfileUrl", details?.cluPermissionLetterfileUrl);
    setValue("uploadPhotographsfileUrl", details?.uploadPhotographsfileUrl);
    setValue("receiptApplicationfileUrl", details?.receiptApplicationfileUrl);
    setValue("uploadBuildingPlanfileUrl", details?.uploadBuildingPlanfileUrl);
    setValue("indemnityBondfileUrl", details?.indemnityBondfileUrl);
  }

  const getIconColor = (label) => {
    if (findfisrtObj(dataForIcons?.egScrutiny, label)?.isApproved === 'In Order') {
      return Colors.approved;
    }
    if (findfisrtObj(dataForIcons?.egScrutiny, label)?.isApproved === 'Not In Order') {
      return Colors.disapproved;
    }
    if (findfisrtObj(dataForIcons?.egScrutiny, label)?.isApproved === "Conditional") {
      return Colors.conditional;
    }
    return Colors.info
  }

  const findfisrtObj = (list = [], label) => {
    return list?.filter((item, index) => item.fieldIdL === label)?.[0] || {}
  }

  return (
    <form onSubmit={handleSubmit(extensionClu)}>
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
          {`${t("EXTENSION_CLU_PERMISSION")}`}
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>{`${t("EXTENSION_CLU_PERMISSION")}`}</h4>



            <div className="card">
              <Row className="col-12">

                <Form.Group className="col-4" as={Col} controlId="formGridCase">
                  <Form.Label>
                    <h2>
                      {`${t("CASE_NO")}`}<span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input className="form-control" disabled placeholder="" {...register("caseNo", {
                      required: "This field can not be blank",
                      minLength: {
                        value: 7,
                        message: "Invalid Case No."
                      },
                      maxLength: {
                        value: 19,
                        message: "Invalid Case No."
                      }
                    })}
                    />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('CASE_NO')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('CASE_NO'));
                        setLabelValue(t('CASE_NO')),
                          setFieldValue(watch('caseNo') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.caseNo)}>
                    {errors?.caseNo?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("APPLICATION_NUMBER")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input className="form-control" disabled placeholder="" {...register("applicationNo", {
                      minLength: {
                        value: 2,
                        message: "Invalid Application Number"
                      },
                      maxLength: {
                        value: 50,
                        message: "Invalid Application Number"
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('APPLICATION_NUMBER')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('APPLICATION_NUMBER'));
                        setLabelValue(t('APPLICATION_NUMBER')),
                          setFieldValue(watch('applicationNo') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.applicationNo)}>
                    {errors?.applicationNo?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("NATURE_PURPOSE")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("naturePurpose", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 2,
                        message: "Invalid Nature (land Use) Purpose."
                      }, maxLength: {
                        value: 50,
                        message: "Invalid Nature (land Use) Purpose."
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9]*$/,
                        message: "Invalid Nature (land Use) Purpose."
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('NATURE_PURPOSE')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('NATURE_PURPOSE'));
                        setLabelValue(t('NATURE_PURPOSE')),
                          setFieldValue(watch('naturePurpose') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.naturePurpose)}>
                    {errors?.naturePurpose?.message}
                  </FormHelperText>
                </Form.Group>
                {/* </Row>
              <Row className="col-12"> */}
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("TOTAL_AREA_IN_SQ_METER")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input className="form-control" disabled placeholder="" {...register("totalAreaSq", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 2,
                        message: "Invalid Area in sq. meter."
                      }, maxLength: {
                        value: 20,
                        message: "Invalid Area in sq. meter."
                      },
                      pattern: {
                        value: /^[0-9]+(\.[0-9]+)?$/,
                        message: "Invalid Area in sq. meter."
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('TOTAL_AREA_IN_SQ_METER')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('TOTAL_AREA_IN_SQ_METER'));
                        setLabelValue(t('TOTAL_AREA_IN_SQ_METER')),
                          setFieldValue(watch('totalAreaSq') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.totalAreaSq)}>
                    {errors?.totalAreaSq?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("DATE_OF_CLU")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="date" className="form-control" disabled placeholder="" {...register("cluDate", {
                      required: "This field cannot be blank"
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('DATE_OF_CLU')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('DATE_OF_CLU'));
                        setLabelValue(t('DATE_OF_CLU')),
                          setFieldValue(watch('cluDate') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.cluDate)}>
                    {errors?.cluDate?.message}
                  </FormHelperText>
                </Form.Group>
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("DATE_OF_EXPIRY_OF_CLU")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="date" className="form-control" disabled placeholder="" {...register("expiryClu", {
                      required: "This field cannot be blank"
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('DATE_OF_EXPIRY_OF_CLU')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('DATE_OF_EXPIRY_OF_CLU'));
                        setLabelValue(t('DATE_OF_EXPIRY_OF_CLU')),
                          setFieldValue(watch('expiryClu') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.expiryClu)}>
                    {errors?.expiryClu?.message}
                  </FormHelperText>
                </Form.Group>
                {/* </Row> */}

                {/* <Row className="col-12"> */}


                {/* </Row>

              <Row className="col-12"> */}
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("STAGE_OF_CONSTRUCTION")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("stageConstruction", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 2,
                        message: "Invalid Stage of Construction."
                      },
                      maxLength: {
                        value: 99,
                        message: "Invalid Stage of Construction."
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9 ]*$/
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('STAGE_OF_CONSTRUCTION')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('STAGE_OF_CONSTRUCTION'));
                        setLabelValue(t('STAGE_OF_CONSTRUCTION')),
                          setFieldValue(watch('stageConstruction') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.stageConstruction)}>
                    {errors?.stageConstruction?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("NAME_OF_APPLICANT")}`}
                      <span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("applicantName", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 1,
                        message: "Invalid Application Name."
                      },
                      maxLength: {
                        value: 50,
                        message: "Invalid Application Name."
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9 ]*$/,
                        message: "Invalid Application Name."
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('NAME_OF_APPLICANT')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('NAME_OF_APPLICANT'));
                        setLabelValue(t('NAME_OF_APPLICANT')),
                          setFieldValue(watch('applicantName') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.applicantName)}>
                    {errors?.applicantName?.message}
                  </FormHelperText>
                </Form.Group>
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("MOBILE")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="tel" className="form-control" disabled placeholder="" {...register("mobile", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 10,
                        message: "Invalid Mobile No."
                      },
                      maxLength: {
                        value: 10,
                        message: "Invalid Mobile No."
                      },
                      pattern: {
                        value: /^[0-9\b]+$/,
                        message: "Invalid Mobile No."
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('MOBILE')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('MOBILE'));
                        setLabelValue(t('MOBILE')),
                          setFieldValue(watch('mobile') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.mobile)}>
                    {errors?.mobile?.message}
                  </FormHelperText>
                </Form.Group>
                {/* </Row>
              <Row className="col-12"> */}
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("EMAIL_ADDRESS")}`}<span style={{ color: "red" }}>*</span>{" "}
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="email" className="form-control" disabled placeholder="" {...register("emailAddress", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 1,
                        message: "Invalid Email Address"
                      },
                      maxLength: {
                        value: 50,
                        message: "Invalid Email Address"
                      },
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid Email Address"
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('EMAIL_ADDRESS')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('EMAIL_ADDRESS'));
                        setLabelValue(t('EMAIL_ADDRESS')),
                          setFieldValue(watch('emailAddress') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.emailAddress)}>
                    {errors?.emailAddress?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("ADDRESS")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("address", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 1,
                        message: "Invalid Address"
                      },
                      maxLength: {
                        value: 50,
                        message: "Invalid Address"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9]*$/,
                        message: "Invalid Address"
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('ADDRESS')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('ADDRESS'));
                        setLabelValue(t('ADDRESS')),
                          setFieldValue(watch('address') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.address)}>
                    {errors?.address?.message}
                  </FormHelperText>
                </Form.Group>
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("VILLAGE")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("village", {
                      minLength: {
                        value: 1,
                        message: "Invalid Village"
                      },
                      maxLength: {
                        value: 50,
                        message: "Invalid Village"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9]*$/,
                        message: "Invalid Village"
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('VILLAGE')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('VILLAGE'));
                        setLabelValue(t('VILLAGE')),
                          setFieldValue(watch('village') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.village)}>
                    {errors?.village?.message}
                  </FormHelperText>
                </Form.Group>
                {/* </Row>
              <Row className="col-12"> */}
                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("TEHSIL")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("tehsil", {
                      minLength: {
                        value: 1,
                        message: "Invalid Tehsil"
                      },
                      maxLength: {
                        value: 50,
                        message: "Invalid Tehsil"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9]*$/,
                        message: "Invalid Tehsil"
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('TEHSIL')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('TEHSIL'));
                        setLabelValue(t('TEHSIL')),
                          setFieldValue(watch('tehsil') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.tehsil)}>
                    {errors?.tehsil?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("PIN_CODE")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="number" className="form-control" disabled placeholder="" {...register("pinCode", {
                      minLength: {
                        value: 6,
                        message: "Invalid Pincode"
                      },
                      maxLength: {
                        value: 6,
                        message: "Invalid Pincode"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9]*$/,
                        message: "Invalid Pincode"
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('PIN_CODE')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('PIN_CODE'));
                        setLabelValue(t('PIN_CODE')),
                          setFieldValue(watch('pinCode') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.pinCode)}>
                    {errors?.pinCode?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-4" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("REASON_FOR_DELAY")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="textarea" className="form-control" disabled placeholder="" {...register("reasonDelay", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 2,
                        message: "Invalid Reason for Delay"
                      },
                      maxLength: {
                        value: 9,
                        message: "Invalid Reason for Delay"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9]*$/,
                        message: "Invalid Reason for Delay"
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('REASON_FOR_DELAY')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('REASON_FOR_DELAY'));
                        setLabelValue(t('REASON_FOR_DELAY')),
                          setFieldValue(watch('reasonDelay') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.reasonDelay)}>
                    {errors?.reasonDelay?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-6" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {`${t("STATUS_OF_APPROVAL_OF_BUILDING_PLAN")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="text" className="form-control" disabled placeholder="" {...register("buildingPlanApprovalStatus", {
                      required: "This field cannot be blank",
                      minLength: {
                        value: 2,
                        message: "Invalid Approval of Building plan."
                      },
                      maxLength: {
                        value: 99,
                        message: "Invalid Approval of Building plan."
                      },
                      pattern: {
                        value: /^[a-zA-Z]*$/,
                        message: "Invalid Approval of Building plan."
                      }
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('STATUS_OF_APPROVAL_OF_BUILDING_PLAN')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('STATUS_OF_APPROVAL_OF_BUILDING_PLAN'));
                        setLabelValue(t('STATUS_OF_APPROVAL_OF_BUILDING_PLAN')),
                          setFieldValue(watch('buildingPlanApprovalStatus') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.buildingPlanApprovalStatus)}>
                    {errors?.buildingPlanApprovalStatus?.message}
                  </FormHelperText>
                </Form.Group>



                <Form.Group className="col-6" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("DATE_OF_APPROVAL_OF_ZONING_PLAN")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="date" className="form-control" disabled placeholder="" {...register("zoningPlanApprovalDate", {
                      required: "This field cannot be blank"
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('DATE_OF_APPROVAL_OF_ZONING_PLAN')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('DATE_OF_APPROVAL_OF_ZONING_PLAN'));
                        setLabelValue(t('DATE_OF_APPROVAL_OF_ZONING_PLAN')),
                          setFieldValue(watch('zoningPlanApprovalDate') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.zoningPlanApprovalDate)}>
                    {errors?.zoningPlanApprovalDate?.message}
                  </FormHelperText>
                </Form.Group>

                <Form.Group className="col-12" as={Col} controlId="formGridState">
                  <Form.Label>
                    <h2>
                      {" "}
                      {`${t("DATE_OF_SANCTION_OF_BUILDING_PLAN")}`}
                      <span style={{ color: "red" }}>*</span>
                    </h2>
                  </Form.Label>
                  <div className=" d-flex align-items-center">
                    <input type="date" className="form-control" disabled placeholder="" {...register("dateOfSanctionBuildingPlan", {
                      required: "This field cannot be blank"
                    })} />
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('DATE_OF_SANCTION_OF_BUILDING_PLAN')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('DATE_OF_SANCTION_OF_BUILDING_PLAN'));
                        setLabelValue(t('DATE_OF_SANCTION_OF_BUILDING_PLAN')),
                          setFieldValue(watch('dateOfSanctionBuildingPlan') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                  <FormHelperText error={Boolean(errors?.dateOfSanctionBuildingPlan)}>
                    {errors?.dateOfSanctionBuildingPlan?.message}
                  </FormHelperText>
                </Form.Group>

                <div className="col col-12  mt-3">
                  <div className=" d-flex align-items-center">
                    <h6>
                      {`${t("WHETHER_APPLIED_FOR_FIRST_TIME")}`}   <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="appliedFirstTime">
                        <input
                          type="radio"
                          value="yes"
                          label="Yes"
                          name="appliedFirstTime"
                          id="appliedFirstTime"
                          {...register("appliedFirstTime", {
                            required: "Please Select (Yes/No)"
                          })}
                        />
                        &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                      </label>
                      <label htmlFor="appliedFirstTime">
                        <input
                          type="radio"
                          value="no"
                          label="No"
                          name="appliedFirstTime"
                          id="appliedFirstTime"
                          {...register("appliedFirstTime", {
                            required: "Please Select (Yes/No)"
                          })}
                        // onChange={(e) => handleselects(e)}
                        />
                        &nbsp; {`${t("NO")}`} &nbsp;&nbsp;

                      </label>



                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.appliedFirstTime && errors?.appliedFirstTime?.message}
                      </h3>
                    </h6>
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('DATE_OF_SANCTION_OF_BUILDING_PLAN')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('DATE_OF_SANCTION_OF_BUILDING_PLAN'));
                        setLabelValue(t('DATE_OF_SANCTION_OF_BUILDING_PLAN')),
                          setFieldValue(watch('dateOfSanctionBuildingPlan') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>

              </Row>
              <br></br>
              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}> {`${t("SR_NO")}`}</th>
                    <th style={{ textAlign: "center" }}> {`${t("FIELD_NAME")}`}</th>
                    <th style={{ textAlign: "center" }}> {`${t("UPLOAD_DOCUMENTS")}`}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>
                      {`${t("UPLOAD_BR_III")}`}<span style={{ color: "red" }}>*</span>
                    </td>

                      <td className="d-flex justify-content-center align-items-center">

                        {watch('uploadbrIIIfileUrl') && (
                          <a onClick={() => getDocShareholding(watch('uploadbrIIIfileUrl'), setLoading)} className="btn btn-sm ">
                            <Visibility color="info" className="icon" />
                          </a>
                        )}

                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('UPLOAD_BR_III')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true)
                            setOpennedModal(t('UPLOAD_BR_III'));
                            setLabelValue(t('UPLOAD_BR_III')),
                              setFieldValue(watch('uploadbrIIIfileUrl') || null);
                          }}
                        ></ReportProblemIcon>
                      </td>

                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>
                      {`${t("UPLOAD_CLU_PERMISSION_LETTER")}`}<span style={{ color: "red" }}>*</span>
                    </td>


                    <td className="d-flex justify-content-center align-items-center">

                      {watch('cluPermissionLetterfileUrl') && (
                        <a onClick={() => getDocShareholding(watch('cluPermissionLetterfileUrl'), setLoading)} className="btn btn-sm ">
                          <Visibility color="info" className="icon" />
                        </a>
                      )}

                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('UPLOAD_CLU_PERMISSION_LETTER')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true)
                          setOpennedModal(t('UPLOAD_CLU_PERMISSION_LETTER'));
                          setLabelValue(t('UPLOAD_CLU_PERMISSION_LETTER')),
                            setFieldValue(watch('cluPermissionLetterfileUrl') || null);
                        }}
                      ></ReportProblemIcon>
                    </td>

                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>
                      {" "}
                      {`${t("UPLOAD_UNDER_CONSTRUCTION_BUILDING_PHOTO")}`}{" "}<span style={{ color: "red" }}>*</span>
                    </td>


                    <td className="d-flex justify-content-center align-items-center">

                      {watch('uploadPhotographsfileUrl') && (
                        <a onClick={() => getDocShareholding(watch('uploadPhotographsfileUrl'), setLoading)} className="btn btn-sm ">
                          <Visibility color="info" className="icon" />
                        </a>
                      )}

                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('UPLOAD_UNDER_CONSTRUCTION_BUILDING_PHOTO')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true)
                          setOpennedModal(t('UPLOAD_UNDER_CONSTRUCTION_BUILDING_PHOTO'));
                          setLabelValue(t('UPLOAD_UNDER_CONSTRUCTION_BUILDING_PHOTO')),
                            setFieldValue(watch('uploadPhotographsfileUrl') || null);
                        }}
                      ></ReportProblemIcon>
                    </td>

                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>
                      {" "}
                      {`${t("RECEIPT_OF_APPLICATION_IF_ANY_SUBMITTED_FOR_TAKING_CERTIFICATE")}`}<span style={{ color: "red" }}>*</span>
                    </td>


                    <td className="d-flex justify-content-center align-items-center">

                      {watch('receiptApplicationfileUrl') && (
                        <a onClick={() => getDocShareholding(watch('receiptApplicationfileUrl'), setLoading)} className="btn btn-sm ">
                          <Visibility color="info" className="icon" />
                        </a>
                      )}

                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('RECEIPT_OF_APPLICATION_IF_ANY_SUBMITTED_FOR_TAKING_CERTIFICATE')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true)
                          setOpennedModal(t('RECEIPT_OF_APPLICATION_IF_ANY_SUBMITTED_FOR_TAKING_CERTIFICATE'));
                          setLabelValue(t('RECEIPT_OF_APPLICATION_IF_ANY_SUBMITTED_FOR_TAKING_CERTIFICATE')),
                            setFieldValue(watch('receiptApplicationfileUrl') || null);
                        }}
                      ></ReportProblemIcon>
                    </td>

                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>
                      {" "}
                      {`${t("UPLOAD_APPROVED_BUILDING_PLAN")}`} <span style={{ color: "red" }}>*</span>
                    </td>

                    <td className="d-flex justify-content-center align-items-center">

                      {watch('receiptApplicationfileUrl') && (
                        <a onClick={() => getDocShareholding(watch('receiptApplicationfileUrl'), setLoading)} className="btn btn-sm ">
                          <Visibility color="info" className="icon" />
                        </a>
                      )}

                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('UPLOAD_APPROVED_BUILDING_PLAN')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true)
                          setOpennedModal(t('UPLOAD_APPROVED_BUILDING_PLAN'));
                          setLabelValue(t('UPLOAD_APPROVED_BUILDING_PLAN')),
                            setFieldValue(watch('uploadBuildingPlanfileUrl') || null);
                        }}
                      ></ReportProblemIcon>
                    </td>


                  </tr>
                  <tr>
                    <th scope="row">6</th>
                    <td>
                      {" "}
                      {`${t("INDEMNITY_BOND")}`} <span style={{ color: "red" }}>*</span>
                    </td>

                    <td className="d-flex justify-content-center align-items-center">

                      {watch('indemnityBondfileUrl') && (
                        <a onClick={() => getDocShareholding(watch('indemnityBondfileUrl'), setLoading)} className="btn btn-sm ">
                          <Visibility color="info" className="icon" />
                        </a>
                      )}

                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('INDEMNITY_BOND')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true)
                          setOpennedModal(t('INDEMNITY_BOND'));
                          setLabelValue(t('INDEMNITY_BOND')),
                            setFieldValue(watch('indemnityBondfileUrl') || null);
                        }}
                      ></ReportProblemIcon>
                    </td>

                  </tr>
                </tbody>
              </div>

            </div>

          </Card>
        </div>
      </Collapse>
      <ModalChild
        labelmodal={labelValue}
        passmodalData={handlemodaldData}
        displaymodal={smShow}
        onClose={() => setSmShow(false)}
        selectedFieldData={selectedFieldData}
        fieldValue={fieldValue}
        remarksUpdate={currentRemarks}
        applicationStatus={applicationStatus}
      />
    </form>
  );
}

export default ExtensionClu;
