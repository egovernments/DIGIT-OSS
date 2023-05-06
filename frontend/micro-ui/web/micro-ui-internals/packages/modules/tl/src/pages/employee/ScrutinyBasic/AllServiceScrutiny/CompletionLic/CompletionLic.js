import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Collapse from "react-bootstrap/Collapse";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ModalChild from "../../Remarks/ModalChild";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { useStyles } from "../../css/personalInfoChild.style";
import '../../css/personalInfoChild.style.js'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";
import Visibility from "@mui/icons-material/Visibility";
import { FormControl, FormHelperText } from "@mui/material";

function Completionscrutiny({ apiResponse, dataForIcons, refreshScrutinyData, applicationNumber, passUncheckedList, passCheckedList, applicationStatus }) {
  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [open2, setOpen2] = useState(false);

  const { t } = useTranslation();

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
    watch
  } = useForm({});

  const completionLic = (data) => console.log(data);

  const classes = useStyles();

  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  useEffect(() => {
    if (apiResponse) {
      setFields(apiResponse)
    }
  }, [apiResponse])

  const setFields = (details) => {
    setValue("licenseNo", details?.licenseNumber);
    setValue("licenseValidTill", details?.licenseValidTill);
    setValue("statusOfComplainsIfAny", details?.statusOfComplainsIfAny);
    setValue("complianceOfRules", details?.complianceOfRules);
    setValue("complainsDetails", details?.complainsDetails);
    setValue("statusOfComplainsIfAny", details?.statusOfComplainsIfAny);
    setValue("statusOfTotalComunity", details?.statusOfTotalComunity);
    setValue("statusOfNplPlot", details?.statusOfNplPlot);
    setValue("statusOfHandlingOver", details?.statusOfHandlingOver);
    setValue("statusOfReadingHandlingOver", details?.statusOfReadingHandlingOver);
    setValue("handlingOverComunitySite", details?.handlingOverComunitySite);
    setValue("caCertificate", details?.caCertificate);
    setValue("iacAplicable", details?.iacAplicable);
    setValue("statusOfComplainsForRules", details?.statusOfComplainsForRules);
    setValue("statusOfEDCisFullyPaid", details?.statusOfEDCisFullyPaid);
    setValue("statusOfSIDCisFullyPaid", details?.statusOfSIDCisFullyPaid);
    setValue("bgOnAccountTillValid", details?.bgOnAccountTillValid);
    setValue("copyApprovalServicePlan", details?.copyApprovalServicePlan);
    setValue("electricServicePlan", details?.electricServicePlan);
    setValue("transferOfLicenseCertificate", details?.transferOfLicenseCertificate);
    setValue("occupationCertificate", details?.occupationCertificate);
    setValue("updatedComplianceWithRules", details?.updatedComplianceWithRules);
    setValue("paymentAugmentationCharges", details?.paymentAugmentationCharges);
    setValue("caCertificateRegarding15Percentage", details?.caCertificateRegarding15Percentage);
    setValue("statusOfDevelopmentWork", details?.statusOfDevelopmentWork);
    setValue("completionApprovalLayoutPlan", details?.completionApprovalLayoutPlan);
    setValue("nocFromMOEF", details?.nocFromMOEF);
    setValue("nocFromFairSafety", details?.nocFromFairSafety);
    setValue("affidavitNoUnauthorized", details?.affidavitNoUnauthorized);
    setValue("accessPermissionFromNHAI", details?.accessPermissionFromNHAI);


    setValue("areaAcres", details?.newAdditionalDetails?.areaAcres);
    setValue("colonizerName", details?.newAdditionalDetails?.colonizerName);
    setValue("colonyType", details?.newAdditionalDetails?.colonyType);
    setValue("developmentPlan", details?.newAdditionalDetails?.developmentPlan);
    setValue("district", details?.newAdditionalDetails?.district);
    setValue("periodOfRenewal", details?.newAdditionalDetails?.periodOfRenewal);
    setValue("renewalRequiredUpto", details?.newAdditionalDetails?.renewalRequiredUpto);
    setValue("revenueEstate", details?.newAdditionalDetails?.revenueEstate);
    setValue("sectorNo", details?.newAdditionalDetails?.sectorNo);
    setValue("selectLicence", details?.newAdditionalDetails?.selectLicence);
    setValue("tehsil", details?.newAdditionalDetails?.tehsil);
    setValue("validUpto", details?.newAdditionalDetails?.validUpto);
  }

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602",
    conditional: "#2874A6"
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

  const documents = [
    {
      label: t("COPY_OF_APPROVED_SERVICE_PLAN_ESTIMATE"),
      selectorKey: "copyApprovalServicePlanFile",
      fileName: "copyApprovalServicePlan"
    },
    {
      label: t("ELECTRICAL_PLAN_IS_VERIFIED"),
      selectorKey: "electricServicePlanFile",
      fileName: "electricServicePlan"
    },
    {
      label: t("TRANSFER_OF_LICENSED_LAND"),
      selectorKey: "transferOfLicenseCertificateFile",
      fileName: "transferOfLicenseCertificate"
    },
    {
      label: t("OCCUPATION_CERTIFICATION"),
      selectorKey: "occupationCertificateFile",
      fileName: "occupationCertificate"
    },
    {
      label: t("UPDATED_COMPLIANCE_WITH_RULES"),
      selectorKey: "updatedComplianceWithRulesFile",
      fileName: "updatedComplianceWithRules"
    },
    {
      label: t("PAYMENT_OF_AUGMENTATION_CHARGES"),
      selectorKey: "paymentAugmentationChargesFile",
      fileName: "paymentAugmentationCharges"
    },
    {
      label: t("THIRD_PARTY_AUDIT_ON_15%"),
      selectorKey: "caCertificateFile",
      fileName: "caCertificate"
    },
    {
      label: t("STATUS_OF_DEVELOPMENT_WORK_ALONG_WITH_SITE_PHOTO"),
      selectorKey: "statusOfDevelopmentWorkFile",
      fileName: "statusOfDevelopmentWork"
    },
    {
      label: t("IF_PART_COMPLETION_IS_APPLIED"),
      selectorKey: "completionApprovalLayoutPlanFile",
      fileName: "completionApprovalLayoutPlan"
    },
    {
      label: t("NOC_FROM_MOEF"),
      selectorKey: "nocFromMOEFFile",
      fileName: "nocFromMOEF"
    },
    {
      label: t("NOC_FROM_FIRE_SAFETY"),
      selectorKey: "nocFromFairSafetyFile",
      fileName: "nocFromFairSafety"
    },
    {
      label: t("AFFIDAVIT_OF_NO_UNAUTHORIZED"),
      selectorKey: "affidavitNoUnauthorizedFile",
      fileName: "affidavitNoUnauthorized"
    },
    {
      label: t("ACCESS_PERMISSION_FROM_NHAI"),
      selectorKey: "accessPermissionFromNHAIFile",
      fileName: "accessPermissionFromNHAI"
    }
  ]

  const fields = [
    {
      label: t('IS_LICENSE_NO_VALID_TILL_COMPLETION_CERTIFICATE'),
      register: "licenseValidTill",
    },
    {
      label: t('COMPLIANCE_STATUS_WITH_RULES'),
      register: "statusOfComplainsForRules",
    },
    {
      label: t('STATUS_OF_EDC'),
      register: "statusOfEDCisFullyPaid",
    },
    {
      label: t('STATUS_OF_SIDC'),
      register: "statusOfSIDCisFullyPaid",
    },
    {
      label: t('BANK_GUARANTEE_ON_ACCOUNT_OF_IDW'),
      register: "bgOnAccountTillValid",
    },
    {
      label: t('STATUS_OF_COMPLAINT'),
      register: "statusOfComplainsIfAny",
    },
    {
      label: t('STATUS_OF_TOTAL_COMMUNITY'),
      register: "statusOfTotalComunity",
    },
    {
      label: t('STATUS_OF_NPNL_PLOTS'),
      register: "statusOfNplPlot",
    },
    {
      label: t('STATUS_OF_HANDLING_OVER_EWS_PLOTS'),
      register: "statusOfHandlingOver",
    },
    {
      label: t('STATUS_REGARDING_HANDLING_OVER_OF_PARK'),
      register: "statusOfReadingHandlingOver",
    },
    {
      label: t('DETAILS_OF_COMPLAINT'),
      register: "complainsDetails",
    },
    {
      label: t('UPLOAD_COMPLIANCE_OF_RULES'),
      register: "complianceOfRules",
    }
  ]

  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("")
  const [fieldIconColors, setFieldIconColors] = useState({
    developer: Colors.info,
    authPersonName: Colors.info,
    authMobileNo1: Colors.info,
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
    emailForCommunication: Colors.info
  })


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

  return (


    <form onSubmit={handleSubmit(completionLic)}>
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
          Completion Certificate In Licence Colony
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div id="example-collapse-text">

          <Card style={{ width: "126%", border: "5px solid #1266af" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Completion Certificate In Licence Colony</h4>
            <div className="card">

              <div className="row px-3" style={{ placeItems: "end", rowGap: "10px" }}>

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


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("LICENSE_NO")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("licenseNo")} />
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
                    </div>

                  </FormControl>
                </div>

                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Area in Acres (License)")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("areaAcres")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Area in Acres (License)')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Area in Acres (License)'));
                          setLabelValue(t('Area in Acres (License)')),
                            setFieldValue(watch('areaAcres') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Colonizer Name")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("colonizerName")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Colonizer Name')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Colonizer Name'));
                          setLabelValue(t('Colonizer Name')),
                            setFieldValue(watch('colonizerName') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Colony Type")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("colonyType")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Colony Type')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Colony Type'));
                          setLabelValue(t('Colony Type')),
                            setFieldValue(watch('colonyType') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Development Plan")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("developmentPlan")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Development Plan')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Development Plan'));
                          setLabelValue(t('Development Plan')),
                            setFieldValue(watch('developmentPlan') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("District")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("district")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('District')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('District'));
                          setLabelValue(t('District')),
                            setFieldValue(watch('district') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Period of Renewal")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("periodOfRenewal")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Period of Renewal')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Period of Renewal'));
                          setLabelValue(t('Period of Renewal')),
                            setFieldValue(watch('periodOfRenewal') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Renewal required upto")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("renewalRequiredUpto")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Renewal required upto')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Renewal required upto'));
                          setLabelValue(t('Renewal required upto')),
                            setFieldValue(watch('renewalRequiredUpto') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Revenue Estate")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("revenueEstate")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Revenue Estate')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Revenue Estate'));
                          setLabelValue(t('Revenue Estate')),
                            setFieldValue(watch('revenueEstate') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Sector No.")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("sectorNo")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Sector No.')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Sector No.'));
                          setLabelValue(t('Sector No.')),
                            setFieldValue(watch('sectorNo') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Select License")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("selectLicence")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Select License')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Select License'));
                          setLabelValue(t('Select License')),
                            setFieldValue(watch('selectLicence') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Tehsil")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("tehsil")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Tehsil')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Tehsil'));
                          setLabelValue(t('Tehsil')),
                            setFieldValue(watch('tehsil') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                <div className="col col-4">
                  <FormControl className="w-100">
                    <h2 className="FormLable">
                      {`${t("Valid Upto")}`} <span style={{ color: "red" }}>*</span>
                    </h2>
                    <div className="d-flex align-items-center">

                      <input className="form-control" disabled {...register("validUpto")} />
                      <ReportProblemIcon
                        style={{
                          color: getIconColor(t('Valid Upto')),
                        }}
                        className="ml-2"
                        onClick={() => {
                          setSmShow(true);
                          setOpennedModal(t('Valid Upto'));
                          setLabelValue(t('Valid Upto')),
                            setFieldValue(watch('validUpto') || null);
                        }}
                      ></ReportProblemIcon>
                    </div>
                  </FormControl>
                </div>


                {
                  fields.map((item, index) => (
                    <div className="col col-4">
                      <FormControl className="w-100">
                        <h2 className="FormLable">
                          {item?.label} <span style={{ color: "red" }}>*</span>
                        </h2>
                        <div className="d-flex align-items-center">

                          <input className="form-control" disabled {...register(item?.register)} />
                          <ReportProblemIcon
                            style={{
                              color: getIconColor(item?.label),
                            }}
                            className="ml-2"
                            onClick={() => {
                              setSmShow(true);
                              setOpennedModal(item?.label);
                              setLabelValue(item?.label),
                                setFieldValue(watch(item?.register) || null);
                            }}
                          ></ReportProblemIcon>
                        </div>
                      </FormControl>
                    </div>
                  ))
                }

              </div>
              <br />
              <div className="row px-3">
                <div className="col col-12 ">
                  <h6>
                    {`${t("IF_PROFIT_COMPONENT_IS_LESS_THAN_15%")}`} <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                    <label htmlFor="caCertificateRegarding15Percentage">
                      <input
                        type="radio"
                        value="yes"
                        label="Yes"
                        disabled
                        name="areaFallingUnder"
                        id="areaFallingUnder"
                        {...register("caCertificateRegarding15Percentage", {
                          required: "Please Select (Yes/No)",
                        })}
                      // onChange={(e) => handleselects(e)}
                      />
                      &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                    </label>
                    <label htmlFor="caCertificateRegarding15Percentage">
                      <input
                        type="radio"
                        value="no"
                        label="No"
                        disabled
                        name="caCertificateRegarding15Percentage"
                        id="caCertificateRegarding15Percentage"
                        {...register("caCertificateRegarding15Percentage", {
                          required: "Please Select (Yes/No)",
                        })}
                      // onChange={(e) => handleselects(e)}
                      />
                      &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                    </label>
                    <h3 className="error-message" style={{ color: "red" }}>
                      {errors?.caCertificateRegarding15Percentage && errors?.caCertificateRegarding15Percentage?.message}
                    </h3>
                  </h6>
                </div>

                {
                  watch('caCertificateRegarding15Percentage') && (
                    <div className="col-4">
                      <FormControl class="w-100">
                        <h2 class="mb-2">
                          {t('DEPOSIT_APPLICABLE')}  <span style={{ color: "red" }}>*</span>
                        </h2>

                        <input disabled className="form-control" placeholder="" {...register("iacAplicable", {
                          required: "This field cannot be blank",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]+)?$/,
                            message: "Invalid Value."
                          }
                        })} />
                      </FormControl>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {Boolean(errors?.iacAplicable) && errors?.iacAplicable?.message}
                      </h3>
                    </div>

                  )
                }
              </div>
              <br>
              </br>

              <div className="table table-bordered table-responsive">
                {/* <caption>List of users</caption> */}
                <thead>
                  <tr>
                    <th class="fw-normal">Sr.No</th>
                    <th class="fw-normal">Field Name</th>
                    <th class="fw-normal">Documents download</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    documents.map((item, index) => (

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
                                    <Visibility color="info" className="icon" />
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


              {/* <Row className="justify-content-end">
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="save" aria-label="right-end">
                Save as Draft
              </Button>
              <Button variant="outline-primary" className="col-md-2 my-2 mx-2" type="submit" aria-label="right-end">
                Submit
              </Button>
            </Row> */}
            </div>
          </Card>
        </div>
      </Collapse>
    </form>


  );
}

export default Completionscrutiny;
