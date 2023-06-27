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
import ModalChild from "../remarks/ModalChild";
import Collapse from "react-bootstrap/Collapse";
import { useStyles } from "../../css/personalInfoChild.style";
import '../../css/personalInfoChild.style.js'

import { FormControl, FormHelperText, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../docview.helper";

function LowMediumScrutiny({ apiResponse, refreshScrutinyData, applicationNumber, passUncheckedList, passCheckedList, dataForIcons, applicationStatus }) {

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

    const documentsList = [
        {
            label: t("Form BRS – I "),
            fileName: "formBRSI",
            selectorKey: "formBRSIFile",
        },
        {
            label: t("Form BRS - II "),
            fileName: "formBRSII",
            selectorKey: "formBRSIIFile",
        },
        {
            label: t("Form BRS -V (A1) (up to 16.5 M Ht "),
            fileName: "formBRSV",
            selectorKey: "formBRSVFile",
        },
        {
            label: t(`An Affidavit from the Owner for
            ownership and Technical Person that they
            have understood the provisions of the
            zoning plan/Haryana Building Code 2017
            (whichever is applicable) and shall not
            deviate from the same`),
            fileName: "anAfidavitFromOwner",
            selectorKey: "anAfidavitFromOwnerFile",
        },
        {
            label: t(`Certificate regarding the functionality of
            services as obtained from colonizer by
            owner/Technical Person`),
            fileName: "certificateRegardingTheFunctionality",
            selectorKey: "certificateRegardingTheFunctionalityFile",
        },
        {
            label: t(` Copy of Zoning plan/Verification of
            boundary duly verified by the colonizer`),
            fileName: "copyOfZoningPlan",
            selectorKey: "copyOfZoningPlanFile",
        },
        {
            label: t(`Ownership documents duly verified by
            the Technical Person`),
            fileName: "ownershipDocuments",
            selectorKey: "ownershipDocumentsFile",
        },
        {
            label: t(`Site report w.r.t. any construction at the
            applied site and on adjoining plots`),
            fileName: "siteReport",
            selectorKey: "siteReportFile",
        },
        {
            label: t(`Structural Stability Certificate as
            applicable from Haryana Building code
            2017`),
            fileName: "structuralStabilityCertificate",
            selectorKey: "structuralStabilityCertificateFile",
        },
        {
            label: t(`Copy of sale deed/Allotment Letter`),
            fileName: "copyOfSaleDeed",
            selectorKey: "copyOfSaleDeedFile",
        },
        {
            label: t(`Copy of approved zoning plan certified by
            the Technical Person`),
            fileName: "copyOfApprovedZoning",
            selectorKey: "copyOfApprovedZoningFile",
        },
        {
            label: t(`Copy of affidavit clarifying the status of
            roof right`),
            fileName: "copyOfAffidavitClarifying",
            selectorKey: "copyOfAffidavitClarifyingFile",
        },
    ];

    const [fileStoreId, setFileStoreId] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);
    // const [loader, setLoader] = useState(false);
    const token = window?.localStorage?.getItem("token");
    const userInfo = Digit.UserService.getUser()?.info || {};
    const [details, setDetails] = useState();
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
            setDetails(apiResponse);
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
            let details = apiResponse?.tradeLicenseDetail?.additionalDetail?.[0]?.licenceDetails;
            let documents = apiResponse?.tradeLicenseDetail?.additionalDetail?.[0]?.licensesDoc?.[0]

            setDetails(apiResponse);
            setValue("name", details?.name);
            setValue("gender", details?.gender);
            setValue("dob", details?.dob);
            setValue("mobileNumber", details?.mobileNumber);
            setValue("email", details?.email);
            setValue("pan", details?.PanNumber);
            setValue("addressLine1", details?.addressLine1);
            setValue("addressLine2", details?.addressLine2);
            setValue("addressLine3", details?.addressLine3);
            setValue("addressLine4", details?.addressLine4);
            setValue("village", details?.village);
            setValue("tehsil", details?.tehsil);
            setValue("state", details?.state);
            setValue("district", details?.district);
            setValue("pin", details?.pincode);

            setValue("coaLetter", documents?.coaLetter);
            setValue("experienceCertificate", documents?.experienceCertificate);
            setValue("identifyProof", documents?.identityProof);
            setValue("qualificationCertificate", documents?.qualificationCertificate);
            // console.log("scene", details?.areaInAcres);

            setLoader(false);

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
                    {t("LOW_MEDIUM_RISK_BUILDINGS")}
                </span>
                {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
            </div>
            <Collapse in={open2}>
                <div id="example-collapse-text">
                    <Card
                    // style={{ width: "126%", border: "5px solid #1266af" }}
                    >
                        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>{t("LOW_MEDIUM_RISK_BUILDINGS")}</h4>
                        <div className="card">
                            <Row className="col-12">

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

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("APPLICATION_DATE")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("applicationDate")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('APPLICATION_DATE')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('APPLICATION_DATE'));
                                                    setLabelValue(t('APPLICATION_DATE')),
                                                        setFieldValue(watch('applicationDate') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("APPLICATION_TYPE")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("applicationType")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('APPLICATION_TYPE')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('APPLICATION_TYPE'));
                                                    setLabelValue(t('APPLICATION_TYPE')),
                                                        setFieldValue(watch('applicationType') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("SERVICE_TYPE")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("serviceType")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('SERVICE_TYPE')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('SERVICE_TYPE'));
                                                    setLabelValue(t('SERVICE_TYPE')),
                                                        setFieldValue(watch('serviceType') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("OCCUPANCY")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("occupancy")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('OCCUPANCY')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('OCCUPANCY'));
                                                    setLabelValue(t('OCCUPANCY')),
                                                        setFieldValue(watch('occupancy') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("RISK_TYPE")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("riskType")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('RISK_TYPE')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('RISK_TYPE'));
                                                    setLabelValue(t('RISK_TYPE')),
                                                        setFieldValue(watch('riskType') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("APPLICANT_NAME")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("applicationName")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('APPLICANT_NAME')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('APPLICANT_NAME'));
                                                    setLabelValue(t('APPLICANT_NAME')),
                                                        setFieldValue(watch('applicationName') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                            </Row>

                            <br />

                            <h3 className="mt-3 mb-4" style={{ fontSize: "22px", fontWeight: "600" }}>EDCR Details</h3>
                            <Row className="col-12">

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("EDCR_NUMBER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("edcrNumber")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('EDCR_NUMBER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('EDCR_NUMBER'));
                                                    setLabelValue(t('EDCR_NUMBER')),
                                                        setFieldValue(watch('edcrNumber') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("PLAN_DIAGRAM")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <a onClick={() => getDocShareholding(watch("planDiagram"), setLoader)} className="btn btn-sm ">
                                                <Visibility color="info" className="icon" />
                                            </a>

                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('PLAN_DIAGRAM')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('PLAN_DIAGRAM'));
                                                    setLabelValue(t('PLAN_DIAGRAM')),
                                                        setFieldValue(watch('planDiagram') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>

                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("SCRUTINY_REPORT_OUTPUT")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <a onClick={() => getDocShareholding(watch("scrutinyReportOutput"), setLoader)} className="btn btn-sm ">
                                                <Visibility color="info" className="icon" />
                                            </a>
                                            
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('SCRUTINY_REPORT_OUTPUT')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('SCRUTINY_REPORT_OUTPUT'));
                                                    setLabelValue(t('SCRUTINY_REPORT_OUTPUT')),
                                                        setFieldValue(watch('scrutinyReportOutput') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>

                                    </FormControl>
                                </div>


                            </Row>


                            <br />

                            <h3 className="mt-3 mb-4" style={{ fontSize: "22px", fontWeight: "600" }}>Location Details</h3>
                            <Row className="col-12">

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("GIS")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("gis")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('GIS')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('GIS'));
                                                    setLabelValue(t('GIS')),
                                                        setFieldValue(watch('gis') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("PIN")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("pin")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('PIN')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('PIN'));
                                                    setLabelValue(t('PIN')),
                                                        setFieldValue(watch('pin') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>

                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("CITY")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("city")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('CITY')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('CITY'));
                                                    setLabelValue(t('CITY')),
                                                        setFieldValue(watch('city') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("LOCALITY_MOHALLA")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("locality")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('LOCALITY_MOHALLA')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('LOCALITY_MOHALLA'));
                                                    setLabelValue(t('LOCALITY_MOHALLA')),
                                                        setFieldValue(watch('locality') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("STREET_NAME")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("street")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('STREET_NAME')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('STREET_NAME'));
                                                    setLabelValue(t('STREET_NAME')),
                                                        setFieldValue(watch('street') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("LANDMARK")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("landmark")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('LANDMARK')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('LANDMARK'));
                                                    setLabelValue(t('LANDMARK')),
                                                        setFieldValue(watch('landmark') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                            </Row>

                            <br />

<h3 className="mt-3 mb-4" style={{ fontSize: "22px", fontWeight: "600" }}>Proposed Building Abstract</h3>
<Row className="col-12">

    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("TOTAL_AREA")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("totalArea")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('TOTAL_AREA')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('TOTAL_AREA'));
                        setLabelValue(t('TOTAL_AREA')),
                            setFieldValue(watch('totalArea') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>

    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("TOTAL_BUILTUP_AREA")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("totalBuiltUPArea")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('TOTAL_BUILTUP_AREA')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('TOTAL_BUILTUP_AREA'));
                        setLabelValue(t('TOTAL_BUILTUP_AREA')),
                            setFieldValue(watch('totalBuiltUPArea') || null);
                    }}
                ></ReportProblemIcon>
            </div>

        </FormControl>
    </div>


    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("NUMBER_OF_FLOORS")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("noOfFloors")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('NUMBER_OF_FLOORS')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('NUMBER_OF_FLOORS'));
                        setLabelValue(t('NUMBER_OF_FLOORS')),
                            setFieldValue(watch('noOfFloors') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>


    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("FLOOR")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("floor")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('FLOOR')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('FLOOR'));
                        setLabelValue(t('FLOOR')),
                            setFieldValue(watch('floor') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>

    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("COVERAGE")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("coverage")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('COVERAGE')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('COVERAGE'));
                        setLabelValue(t('COVERAGE')),
                            setFieldValue(watch('coverage') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>


</Row>

<br />

<h3 className="mt-3 mb-4" style={{ fontSize: "22px", fontWeight: "600" }}>{t('BPA_BUILDING_SETBACK_HEADER')}</h3>
<Row className="col-12">

    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("TOTAL_AREA")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("totalArea")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('TOTAL_AREA')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('TOTAL_AREA'));
                        setLabelValue(t('TOTAL_AREA')),
                            setFieldValue(watch('totalArea') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>

    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("BPA_FRONT_AREA_HEADER")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("frontArea")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('BPA_FRONT_AREA_HEADER')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('BPA_FRONT_AREA_HEADER'));
                        setLabelValue(t('BPA_FRONT_AREA_HEADER')),
                            setFieldValue(watch('frontArea') || null);
                    }}
                ></ReportProblemIcon>
            </div>

        </FormControl>
    </div>


    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("BPA_REAR_AREA_HEADER")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("rearArea")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('BPA_REAR_AREA_HEADER')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('BPA_REAR_AREA_HEADER'));
                        setLabelValue(t('BPA_REAR_AREA_HEADER')),
                            setFieldValue(watch('rearArea') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>


    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("BPA_SCRUTINY_SIDE1_LABEL")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("side1")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('BPA_SCRUTINY_SIDE1_LABEL')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('BPA_SCRUTINY_SIDE1_LABEL'));
                        setLabelValue(t('BPA_SCRUTINY_SIDE1_LABEL')),
                            setFieldValue(watch('side1') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>

    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("BPA_SCRUTINY_SIDE2_LABEL")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("side2")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('BPA_SCRUTINY_SIDE2_LABEL')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('BPA_SCRUTINY_SIDE2_LABEL'));
                        setLabelValue(t('BPA_SCRUTINY_SIDE2_LABEL')),
                            setFieldValue(watch('side2') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>


</Row>

<br />

<h3 className="mt-3 mb-4" style={{ fontSize: "22px", fontWeight: "600" }}>Basement Position</h3>
<Row className="col-12">

    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("DISTANCE_FROM_LEFT")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("distanceFromLeft")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('DISTANCE_FROM_LEFT')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('DISTANCE_FROM_LEFT'));
                        setLabelValue(t('DISTANCE_FROM_LEFT')),
                            setFieldValue(watch('distanceFromLeft') || null);
                    }}
                ></ReportProblemIcon>
            </div>
        </FormControl>
    </div>

    <div className="col col-3">
        <FormControl className="w-100">
            <h2 className="FormLable">
                {`${t("DISTANCE_FROM_RIGHT")}`} <span style={{ color: "red" }}>*</span>
            </h2>
            <div className="d-flex align-items-center">

                <input className="form-control" disabled {...register("distanceFromRight")} />
                <ReportProblemIcon
                    style={{
                        color: getIconColor(t('DISTANCE_FROM_RIGHT')),
                    }}
                    className="ml-2"
                    onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('DISTANCE_FROM_RIGHT'));
                        setLabelValue(t('DISTANCE_FROM_RIGHT')),
                            setFieldValue(watch('distanceFromRight') || null);
                    }}
                ></ReportProblemIcon>
            </div>

        </FormControl>
    </div>


</Row>
                            <br />

                            <h3 className="mt-3 mb-4" style={{ fontSize: "22px", fontWeight: "600" }}>{t('BPA_BUILDING_EXISTING_FLOOR_AREA_HEADER')}</h3>
                            <Row className="col-12">

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("BPA_EXISTING_AREA_OF_ALL_FLOOR_HEADER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("existingAreaOfAllFloor")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('BPA_EXISTING_AREA_OF_ALL_FLOOR_HEADER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('BPA_EXISTING_AREA_OF_ALL_FLOOR_HEADER'));
                                                    setLabelValue(t('BPA_EXISTING_AREA_OF_ALL_FLOOR_HEADER')),
                                                        setFieldValue(watch('existingAreaOfAllFloor') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("BPA_EXISTING_FAR_ACHIEVED_HEADER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("existingForAchieved")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('BPA_EXISTING_FAR_ACHIEVED_HEADER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('BPA_EXISTING_FAR_ACHIEVED_HEADER'));
                                                    setLabelValue(t('BPA_EXISTING_FAR_ACHIEVED_HEADER')),
                                                        setFieldValue(watch('existingForAchieved') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>

                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("PURCHASABLE_AREA")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("purchasableArea")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('PURCHASABLE_AREA')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('PURCHASABLE_AREA'));
                                                    setLabelValue(t('PURCHASABLE_AREA')),
                                                        setFieldValue(watch('purchasableArea') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                            </Row>
                            <br />

                            <h3 className="mt-3 mb-4" style={{ fontSize: "22px", fontWeight: "600" }}>{t('BPA_BUILDING_PROPOSED_AREA_HEADER')}</h3>
                            <Row className="col-12">

                                <div className="col col-3"> 
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("BPA_PROPOSED_FLOOR_WISE_COVERAGED_AREA_HEADER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("proposedFloorWiseCoverageArea")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('BPA_PROPOSED_FLOOR_WISE_COVERAGED_AREA_HEADER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('BPA_PROPOSED_FLOOR_WISE_COVERAGED_AREA_HEADER'));
                                                    setLabelValue(t('BPA_PROPOSED_FLOOR_WISE_COVERAGED_AREA_HEADER')),
                                                        setFieldValue(watch('proposedFloorWiseCoverageArea') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("BPA_PROPOSED_TOTAL_AREA_HEADER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("proposedTotalArea")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('BPA_PROPOSED_TOTAL_AREA_HEADER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('BPA_PROPOSED_TOTAL_AREA_HEADER'));
                                                    setLabelValue(t('BPA_PROPOSED_TOTAL_AREA_HEADER')),
                                                        setFieldValue(watch('proposedTotalArea') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>

                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("BPA_PROPOSED_BUILDUP_AREA_HEADER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("proposedBuiltUpArea")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('BPA_PROPOSED_BUILDUP_AREA_HEADER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('BPA_PROPOSED_BUILDUP_AREA_HEADER'));
                                                    setLabelValue(t('BPA_PROPOSED_BUILDUP_AREA_HEADER')),
                                                        setFieldValue(watch('proposedBuiltUpArea') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("BPA_PROPOSED_PURCHASABLE_AREA_HEADER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("proposedPurchasableArea")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('BPA_PROPOSED_PURCHASABLE_AREA_HEADER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('BPA_PROPOSED_PURCHASABLE_AREA_HEADER'));
                                                    setLabelValue(t('BPA_PROPOSED_PURCHASABLE_AREA_HEADER')),
                                                        setFieldValue(watch('proposedPurchasableArea') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                            </Row>
                            <br />
                            <Row>

                                <div className="row-12 mt-3">
                                    <div>
                                        {/* {showhide === "COD" && (
                      // <div className="card"> */}
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
                                                    documentsList.map((item, index) => (

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
                                        {/* // </div>
                    // )} */}
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

export default LowMediumScrutiny;
