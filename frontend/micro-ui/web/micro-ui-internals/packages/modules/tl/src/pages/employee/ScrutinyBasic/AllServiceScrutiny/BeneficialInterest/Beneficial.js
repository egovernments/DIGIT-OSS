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

import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";

function BeneficialScrutitny({ apiResponse, refreshScrutinyData, applicationNumber, passUncheckedList, passCheckedList, dataForIcons, applicationStatus }) {

  const [applicantId, setApplicantId] = useState("");
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const [beneficialInterestLabel, setBeneficialInterestLabel] = useState([]);
  const [loader, setLoader] = useState(false);
  // const [ open2,setOpen2 ] = useState(false);
  const { t } = useTranslation();
  const { pathname: url } = useLocation();
  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };

  const SurrenderLic = (data) => console.log(data);
  const [open2, setOpen2] = useState(false);

  const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602",
    conditional: "#2874A6"
  };



  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({});

  const changeOfDeveloperForm = [
    {
      label: t('NO_OBJECTION_CERTIFICATE_LABEL'),
      fileName: "noObjectionCertificate",
      selectorKey: "noObjectionCertificateFile"
    },
    {
      label: t('CONSENT_LETTER_FROM_NEW_ENTITY_LABEL'),
      fileName: "consentLetter",
      selectorKey: "consentLetterFile"
    },
    {
      label: t('JUSTIFICATION_FOR_SUCH_REQUEST_LABEL'),
      fileName: "justificationCertificate",
      selectorKey: "justificationCertificateFile"
    },
    {
      label: t('THIRD_PARTY_RIGHTS_CERTIFICATE_LABEL'),
      fileName: "thirdPartyRightsCertificate",
      selectorKey: "thirdPartyRightsCertificateFile"
    },
    {
      label: t('FINANCIAL_CAPACITY_CERTIFICATE_LABEL'),
      fileName: "fiancialCapacityCertificate",
      selectorKey: "fiancialCapacityCertificateFile"
    },
    {
      label: t('ADMINISTRATIVE_CHARGE_CERTIFICATE_LABEL'),
      fileName: "aministrativeChargeCertificate",
      selectorKey: "aministrativeChargeCertificateFile"
    },
    {
      label: t('RERA_REGISTRATION_CERTIFICATION_LABEL'),
      fileName: "reraRegistrationCertificate",
      selectorKey: "reraRegistrationCertificateFile"
    },
    {
      label: t('BOARD_RESOLUTION_EXISTING_LABEL'),
      fileName: "boardResolutionExisting",
      selectorKey: "boardResolutionExistingFile"
    },
    {
      label: t('BOARD_RESOLUTION_NEW_LABEL'),
      fileName: "boardResolutionNewEntity",
      selectorKey: "boardResolutionNewEntityFile"
    },

  ]

  const joinDevForm = [
    {
      label: t('NO_OBJECTION_CERTIFICATE_LABEL'),
      fileName: "noObjectionCertificate",
      selectorKey: "noObjectionCertificateFile"
    },
    {
      label: t('CONSENT_LETTER_FROM_NEW_ENTITY_LABEL'),
      fileName: "consentLetter",
      selectorKey: "consentLetterFile"
    },
    {
      label: t('JUSTIFICATION_FOR_SUCH_REQUEST_LABEL'),
      fileName: "justificationCertificate",
      selectorKey: "justificationCertificateFile"
    },
    {
      label: t('THIRD_PARTY_RIGHTS_CERTIFICATE_LABEL'),
      fileName: "thirdPartyRightsCertificate",
      selectorKey: "thirdPartyRightsCertificateFile"
    },
    {
      label: t('ADMINISTRATIVE_CHARGE_CERTIFICATE_LABEL'),
      fileName: "aministrativeChargeCertificate",
      selectorKey: "aministrativeChargeCertificateFile"
    },
    {
      label: t('JOINT_DEVELOPMENT_CERTIFICATE_LABEL'),
      fileName: "jointDevelopmentCertificate",
      selectorKey: "jointDevelopmentCertificateFile"
    },
    {
      label: t('BOARD_RESOLUTION_EXISTING_LABEL'),
      fileName: "boardResolutionExisting",
      selectorKey: "boardResolutionExistingFile"
    },
    {
      label: t('BOARD_RESOLUTION_NEW_LABEL'),
      fileName: "boardResolutionNewEntity",
      selectorKey: "boardResolutionNewEntityFile"
    },

  ]

  const changeInShareholding = [
    {
      label: t('CONSENT_LETTER_FROM_NEW_ENTITY_LABEL'),
      fileName: "consentLetter",
      selectorKey: "consentLetterFile"
    },
    {
      label: t('JUSTIFICATION_FOR_SUCH_REQUEST_LABEL'),
      fileName: "justificationCertificate",
      selectorKey: "justificationCertificateFile"
    },
    {
      label: t('THIRD_PARTY_RIGHTS_CERTIFICATE_LABEL'),
      fileName: "thirdPartyRightsCertificate",
      selectorKey: "thirdPartyRightsCertificateFile"
    },
    {
      label: t('ADMINISTRATIVE_CHARGE_CERTIFICATE_LABEL'),
      fileName: "aministrativeChargeCertificate",
      selectorKey: "aministrativeChargeCertificateFile"
    },
    {
      label: t('SHAREHOLDING_PATTERN_CERTIFICATE_LABEL'),
      fileName: "shareholdingPatternCertificate",
      selectorKey: "shareholdingPatternCertificateFile"
    },
    {
      label: t('RERA_REGISTRATION_CERTIFICATION_LABEL'),
      fileName: "reraRegistrationCertificate",
      selectorKey: "reraRegistrationCertificateFile"
    },
    {
      label: t('BOARD_RESOLUTION_EXISTING_LABEL'),
      fileName: "boardResolutionExisting",
      selectorKey: "boardResolutionExistingFile"
    },
    {
      label: t('BOARD_RESOLUTION_NEW_LABEL'),
      fileName: "boardResolutionNewEntity",
      selectorKey: "boardResolutionNewEntityFile"
    },

  ]
  const [fileStoreId, setFileStoreId] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [loader, setLoader] = useState(false);
  const token = window?.localStorage?.getItem("token");
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [beneficialDetails, setBeneficialDetails] = useState();
  const [developerServices, setDeveloperServices] = useState([]);

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    // if (openedModal && data) {
    //   setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    // }
    setOpennedModal("");
    setLabelValue("");
  };
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");

  useEffect(() => {
    console.log("logger123...", dataForIcons)
  }, [dataForIcons])

  useEffect(() => {
    if (apiResponse) {
      setBeneficialDetails(apiResponse);
    }
  }, [apiResponse])

  const findfisrtObj = (list = [], label) => {
    return list?.filter((item, index) => item.fieldIdL === label)?.[0] || {}
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

  useEffect(() => {
    if (labelValue) {
      setSelectedFieldData(findfisrtObj(dataForIcons?.egScrutiny, labelValue))
    } else {
      setSelectedFieldData(null)
    }
    console.log("regergerg", labelValue, selectedFieldData)
  }, [labelValue])


  const getDeveloperServices = async () => {
    setLoader(false);
    try {
      const body = {

        "RequestInfo": {

          "apiId": "Rainmaker",

          "ver": "v1",

          "ts": 0,

          "action": "_search",

          "did": "",

          "key": "",

          "msgId": "090909",

          "authToken": "",

          "correlationId": null



        },

        "MdmsCriteria": {

          "tenantId": "hr",

          "moduleDetails": [

            {

              "tenantId": "hr",

              "moduleName": "common-masters",

              "masterDetails": [

                {



                  "name": "ChangeBeneficial"



                }

              ]

            }

          ]

        }

      }
      const Resp = await axios.post("/egov-mdms-service/v1/_search", body);
      setDeveloperServices(Resp.data?.MdmsRes?.['common-masters']?.ChangeBeneficial || []);

      setLoader(false);
    } catch (err) {
      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
    }
  }



  const getBeneficiaryDetails = async () => {
    setLoader(true);
    try {
      setBeneficialDetails(apiResponse);
      setValue("licenseNo", apiResponse?.licenseNumber);
      setValue("noObjectionCertificate", apiResponse?.noObjectionCertificate);
      setValue("justificationCertificate", apiResponse?.justificationCertificate);
      setValue("consentLetter", apiResponse?.consentLetter);
      setValue("thirdPartyRightsCertificate", apiResponse?.thirdPartyRightsCertificate);
      setValue("jointDevelopmentCertificate", apiResponse?.jointDevelopmentCertificate);
      setValue("aministrativeChargeCertificate", apiResponse?.aministrativeChargeCertificate);
      setValue("boardResolutionExisting", apiResponse?.boardResolutionExisting);
      setValue("boardResolutionNewEntity", apiResponse?.boardResolutionNewEntity);
      setValue("shareholdingPatternCertificate", apiResponse?.shareholdingPatternCertificate);
      setValue("fiancialCapacityCertificate", apiResponse?.fiancialCapacityCertificate);
      setValue("developerServiceCode", developerServices.filter((item) => item?.developerServiceCode === apiResponse?.developerServiceCode)?.[0]?.developerServiceName || "");
      setShowhide(apiResponse?.developerServiceCode);
      setValue("reraRegistrationCertificate", apiResponse?.reraRegistrationCertificate);
      setValue("paidAmount", apiResponse?.paidAmount);
      setValue("areaInAcres", apiResponse?.areaInAcres);
      console.log("scene", apiResponse?.areaInAcres)



      setLoader(false);
      setShowhide(apiResponse?.developerServiceCode)

    } catch (err) {
      console.log("Submit Error ====> ", err.message);
      setLoader(false);
      setShowToastError({ label: err.message, error: true, success: false });
      return error.message;
    }
  }

  useEffect(() => {
    getDeveloperServices();
    getBeneficiaryDetails();
  }, [apiResponse])


  return (
    <form>
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
          CHANGE IN BENEFICIAL INTEREST
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">
          <Card
          // style={{ width: "126%", border: "5px solid #1266af" }}
          >
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>CHANGE IN BENEFICIAL INTEREST</h4>
            <div className="card">
              <Row className="col-12">
                <Col className="col-4">
                  {/* <Form.Group as={Col} controlId="formGridLicence"> */}
                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>{t('LICENSE_NO')} &nbsp;</h5>
                    </Form.Label>
                    <span className={classes.required}>*</span> &nbsp;&nbsp;
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control
                      className={classes.formControl}
                      placeholder=""
                      disabled
                      {...register("licenseNo")}
                    ></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('LICENSE_NO')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('LICENSE_NO'));
                        setLabelValue(t('LICENSE_NO')),
                          setFieldValue(watch('licenseNo') || null);
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
                  {/* </Form.Group> */}
                </Col>
                <Col className="col-4">
                  {/* <Form.Group as={Col} controlId="formGridState">
                <Form.Label>
                  <h2>Select Service</h2>
                </Form.Label>
                <select className="form-control" {...register("selectService")} onChange={(e) => handleshowhide(e)}>
                  <option value=" ">----Select value-----</option>
                  <option value="1">(a)Change of Developer</option>
                  <option value="2">(b) Joint Development and/or Marketing rights</option>
                  <option value="3">(c)Change in Share Holding Pattern</option>
                </select>
              </Form.Group> */}
                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>{t('SELECT_SERVICE')} &nbsp;</h5>
                    </Form.Label>
                    <span className={classes.required}>*</span> &nbsp;&nbsp;
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control
                      className={classes.formControl}
                      placeholder=""
                      disabled
                      {...register("developerServiceCode")}
                    ></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('SELECT_SERVICE')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('SELECT_SERVICE'));
                        setLabelValue(t('SELECT_SERVICE')),
                          setFieldValue(watch('developerServiceCode') || null);
                      }}
                    ></ReportProblemIcon>

                  </div>
                </Col>
                <Col className="col-4">




                  <div>
                    <Form.Label>
                      <h5 className={classes.formLabel}>{t('Amount')} &nbsp;</h5>
                    </Form.Label>
                    <span className={classes.required}>*</span> &nbsp;&nbsp;
                  </div>
                  <div className={classes.fieldContainer}>
                    <Form.Control
                      className={classes.formControl}
                      placeholder=""
                      disabled
                      {...register("paidAmount")}
                    ></Form.Control>

                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('Amount')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('Amount'));
                        setLabelValue(t('Amount')),
                          setFieldValue(watch('paidAmount') || null);
                      }}
                    ></ReportProblemIcon>

                  </div>



                  {/* <Col className="col-4">
                  <Button variant="success" className="col my-4" type="submit" aria-label="right-end">
                    Pay
                  </Button>
                </Col> */}

                </Col>
                <Col className="col-4">
                  <Form.Group controlId="formGridArea">
                    <div>
                      {showhide === "JDAMR" && (
                        <div>
                          <Form.Label>
                            <h2>{t('AREA_IN_ACRES')}</h2>
                          </Form.Label>
                          {/* <input type="number" className="form-control" placeholder="" {...register("areaInAcres")} /> */}


                          <div className={classes.fieldContainer}>
                            <Form.Control
                              className={classes.formControl}
                              placeholder=""
                              disabled
                              {...register("areaInAcres")}
                            ></Form.Control>

                            <ReportProblemIcon
                              style={{
                                color: getIconColor(t('AREA_IN_ACRES')),
                              }}
                              className="ml-2"
                              onClick={() => {
                                setSmShow(true);
                                setOpennedModal(t('AREA_IN_ACRES'));
                                setLabelValue(t('AREA_IN_ACRES')),
                                  setFieldValue(watch('areaInAcres') || null);
                              }}
                            ></ReportProblemIcon>

                          </div>
                        </div>


                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <Row>

                <div className="row-12 mt-3">
                  <div>
                    {showhide === "COD" && (
                      // <div className="card">
                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">{t('SR_NO')}</th>
                            <th class="fw-normal">{t('FIELD_NAME')}</th>
                            <th class="fw-normal">{t("UPLOAD_DOCUMENTS")}</th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            changeOfDeveloperForm.map((item, index) => (

                              <tr key={index}>
                                <th class="fw-normal">{index + 1}</th>
                                <td>
                                  {item.label}
                                </td>

                                {
                                  watch(item.fileName) &&
                                    (

                                      <td>

                                        <div className="d-flex justify-content-center">
                                        {watch(item.fileName) && (
                                          <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm ">
                                            <Visibility />
                                          </a>
                                        )}

                                        <ReportProblemIcon
                                          style={{
                                            color: getIconColor(item.label),
                                          }}
                                          className="ml-2"
                                          onClick={() => {
                                            setSmShow(true)
                                            setOpennedModal(item.label);
                                            setLabelValue(item.label),
                                              setFieldValue(watch(item.fileName) || null);
                                          }}
                                        ></ReportProblemIcon>
                                        </div>
                                      </td>


                                    )
                                }

                              </tr>

                            ))
                          }

                        </tbody>
                      </div>
                      // </div>
                    )}
                  </div>
                  <div>
                    {showhide === "JDAMR" && (
                      // <div className="card">
                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">{t('SR_NO')}</th>
                            <th class="fw-normal">{t('FIELD_NAME')}</th>
                            <th class="fw-normal">{t("UPLOAD_DOCUMENTS")}</th>
                          </tr>
                        </thead>
                        <tbody>


                          {
                            joinDevForm.map((item, index) => (

                              <tr key={index + "b"}>
                                <th class="fw-normal">{index + 1}</th>
                                <td>
                                  {item.label}
                                </td>



                                {
                                  watch(item.fileName) &&
                                    (

                                      <td>

                                        <div className="d-flex justify-content-center">
                                        {watch(item.fileName) && (
                                          <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm ">
                                            <Visibility />
                                          </a>
                                        )}

                                        <ReportProblemIcon
                                          style={{
                                            color: getIconColor(item.label),
                                          }}
                                          className="ml-2"
                                          onClick={() => {
                                            setSmShow(true)
                                            setOpennedModal(item.label);
                                            setLabelValue(item.label),
                                              setFieldValue(watch(item.fileName) || null);
                                          }}
                                        ></ReportProblemIcon>
                                        </div>
                                      </td>


                                    )
                                }

                              </tr>

                            ))
                          }

                        </tbody>
                      </div>
                      // </div>
                    )}
                  </div>
                  <div>
                    {showhide === "CISP" && (
                      // <div className="card">

                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th class="fw-normal">{t('SR_NO')}</th>
                            <th class="fw-normal">{t('FIELD_NAME')}</th>
                            <th class="fw-normal">{t("UPLOAD_DOCUMENTS")}</th>
                          </tr>
                        </thead>
                        <tbody>


                          {
                            changeInShareholding.map((item, index) => (

                              <tr key={index + "c"}>
                                <th class="fw-normal">{index + 1}</th>
                                <td>
                                  {item.label}
                                </td>

                                {
                                  watch(item.fileName) &&
                                    (

                                      <td>

                                        <div className="d-flex justify-content-center">
                                        {watch(item.fileName) && (
                                          <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm ">
                                            <Visibility />
                                          </a>
                                        )}

                                        <ReportProblemIcon
                                          style={{
                                            color: getIconColor(item.label),
                                          }}
                                          className="ml-2"
                                          onClick={() => {
                                            setSmShow(true)
                                            setOpennedModal(item.label);
                                            setLabelValue(item.label),
                                              setFieldValue(watch(item.fileName) || null);
                                          }}
                                        ></ReportProblemIcon>
                                        </div>
                                      </td>


                                    )
                                }
                              </tr>

                            ))
                          }

                        </tbody>
                      </div>

                      // </div>
                    )}
                  </div>
                </div>

              </Row>


              {/* <Row className="justify-content-end">
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="save" aria-label="right-end">
                Save as Draft
              </Button>
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                Submit
              </Button>
            </Row> gf*/}

            </div>
          </Card>
        </div>
      </Collapse>
    </form>
  );
}

export default BeneficialScrutitny;
