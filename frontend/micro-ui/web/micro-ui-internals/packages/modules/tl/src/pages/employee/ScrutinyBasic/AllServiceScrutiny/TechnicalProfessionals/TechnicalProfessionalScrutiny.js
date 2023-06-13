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

import { FormControl, FormHelperText, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";

function TechnicalProfessionalScrutiny({ apiResponse, refreshScrutinyData, applicationNumber, passUncheckedList, passCheckedList, dataForIcons, applicationStatus }) {

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
            label: t('QULAIFICATION_CERTIFICATES'),
            fileName: "qualificationCertificate",
            selectorKey: "qualificationCertificateFile"
        },
        {
            label: t('EXPERIENCE_CERTIFICATES'),
            fileName: "experienceCertificate",
            selectorKey: "experienceCertificateFile"
        },
        {
            label: t('COA_LETTER'),
            fileName: "coaLetter",
            selectorKey: "coaLetterFile"
        },
        {
            label: t('IDENTITY_PROOF'),
            fileName: "identifyProof",
            selectorKey: "identifyProofFile"
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
            console.log("scene", apiResponse?.areaInAcres);

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
                    Technical Professional
                </span>
                {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
            </div>
            <Collapse in={open2}>
                <div id="example-collapse-text">
                    <Card
                    // style={{ width: "126%", border: "5px solid #1266af" }}
                    >
                        <h4 style={{ fontSize: "25px", marginLeft: "21px" }}>Technical Professional</h4>
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
                                            {`${t("NAME")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("name")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('NAME')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('NAME'));
                                                    setLabelValue(t('NAME')),
                                                        setFieldValue(watch('name') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>

                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("GENDER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("gender")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('GENDER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('GENDER'));
                                                    setLabelValue(t('GENDER')),
                                                        setFieldValue(watch('gender') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("MOBILE_NUMBER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("mobileNumber")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('MOBILE_NUMBER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('MOBILE_NUMBER'));
                                                    setLabelValue(t('MOBILE_NUMBER')),
                                                        setFieldValue(watch('mobileNumber') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("DOB")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("dob")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('DOB')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('DOB'));
                                                    setLabelValue(t('DOB')),
                                                        setFieldValue(watch('dob') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("EMAIL")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("email")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('EMAIL')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('EMAIL'));
                                                    setLabelValue(t('EMAIL')),
                                                        setFieldValue(watch('email') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("PAN_NUMBER")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("pan")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('PAN_NUMBER')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('PAN_NUMBER'));
                                                    setLabelValue(t('PAN_NUMBER')),
                                                        setFieldValue(watch('pan') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("ADDRESS_LINE_1")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("addressLine1")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('ADDRESS_LINE_1')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('ADDRESS_LINE_1'));
                                                    setLabelValue(t('ADDRESS_LINE_1')),
                                                        setFieldValue(watch('addressLine1') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("ADDRESS_LINE_2")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("addressLine2")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('ADDRESS_LINE_2')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('ADDRESS_LINE_2'));
                                                    setLabelValue(t('ADDRESS_LINE_2')),
                                                        setFieldValue(watch('addressLine2') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("ADDRESS_LINE_3")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("addressLine3")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('ADDRESS_LINE_3')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('ADDRESS_LINE_3'));
                                                    setLabelValue(t('ADDRESS_LINE_3')),
                                                        setFieldValue(watch('addressLine3') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>

                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("ADDRESS_LINED")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("addressLined")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('ADDRESS_LINED')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('ADDRESS_LINED'));
                                                    setLabelValue(t('ADDRESS_LINED')),
                                                        setFieldValue(watch('addressLined') || null);
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
                                            {`${t("PINCODE")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("pin")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('PINCODE')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('PINCODE'));
                                                    setLabelValue(t('PINCODE')),
                                                        setFieldValue(watch('pin') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("VILLAGE")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("village")} />
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
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("TEHSIL")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("tehsil")} />
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
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("STATE")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("state")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('STATE')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('STATE'));
                                                    setLabelValue(t('STATE')),
                                                        setFieldValue(watch('state') || null);
                                                }}
                                            ></ReportProblemIcon>
                                        </div>
                                    </FormControl>
                                </div>


                                <div className="col col-3">
                                    <FormControl className="w-100">
                                        <h2 className="FormLable">
                                            {`${t("DISTRICT")}`} <span style={{ color: "red" }}>*</span>
                                        </h2>
                                        <div className="d-flex align-items-center">

                                            <input className="form-control" disabled {...register("district")} />
                                            <ReportProblemIcon
                                                style={{
                                                    color: getIconColor(t('DISTRICT')),
                                                }}
                                                className="ml-2"
                                                onClick={() => {
                                                    setSmShow(true);
                                                    setOpennedModal(t('DISTRICT'));
                                                    setLabelValue(t('DISTRICT')),
                                                        setFieldValue(watch('district') || null);
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

export default TechnicalProfessionalScrutiny;
