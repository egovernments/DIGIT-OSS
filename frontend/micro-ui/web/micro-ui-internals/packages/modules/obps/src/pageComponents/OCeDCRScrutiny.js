import React, { useState, useEffect } from "react";
import {
    FormStep,
    DatePicker,
    CardLabel,
    TextInput,
    Toast,
    CardHeader,
    CardCaption,
    CardText,
    SubmitBar,
    StatusTable,
    Row,
    PDFSvg
} from "@egovernments/digit-ui-react-components";
import { getPattern, convertDateToEpoch, convertEpochToDate } from "../utils";

const OCeDCRScrutiny = ({ t, config, onSelect, userType, formData, ownerIndex = 0, addNewOwner, isShowToast }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [permitNumber, setPermitNumber] = useState(formData?.ScrutinyDetails?.ocPermitNumber);
    const [permitDate, setPermitDate] = useState(formData?.ScrutinyDetails?.ocPermitdate);
    const [permitEdcrData, setPermitEdcrData] = useState(formData?.ScrutinyDetails);
    const [showToast, setShowToast] = useState(null);

    let validation = {};

    function setPermitNo(e) {
        setPermitNumber(e.target.value);
    }
    function setOCPermitDate(e) {
        setPermitDate(e);
    }

    function onAdd() { };
    const onSkip = () => { };

    const handleSubmit = () => {
        const data = {};
        data.file = file;
        onSelect(config.key, data);
    };

    const getSearchResults = async () => {
        setPermitEdcrData({});
        setShowToast(null);
        let queryObj = {
            permitDate: convertDateToEpoch(permitDate),
            approvalNo: permitNumber
        };
        Digit.OBPSService.BPASearch(tenantId, queryObj)
            .then((result, err) => {
                if (result?.BPA?.length > 0) {
                    const edcrNumber = result?.BPA?.[0]?.edcrNumber;
                    const tenantIdForEdcr = result?.BPA?.[0]?.tenantId;
                    if (permitDate === convertEpochToDate(result?.BPA?.[0]?.approvalDate)) {
                        Digit.OBPSService.scrutinyDetails(tenantIdForEdcr, { edcrNumber: edcrNumber }).then((response) => {
                            Digit.WorkflowService.getAllApplication(tenantIdForEdcr, { businessIds: result?.BPA?.[0]?.applicationNo, history: true })
                                .then((workFlowData, err) => {
                                    const architectInfoDetails = workFlowData?.ProcessInstances?.[workFlowData?.ProcessInstances?.length - 1];
                                    const architectName = architectInfoDetails?.assignes?.[0]?.name || "";
                                    if (response?.edcrDetail?.length > 0) {
                                        const isPrimaryOwner = result?.BPA?.[0]?.landInfo?.owners?.filter(data => (data.isPrimaryOwner && data.isPrimaryOwner != "false"));
                                        response.edcrDetail[0].applicantName = isPrimaryOwner?.[0]?.name;
                                        response.edcrDetail[0].ocPermitNumber = permitNumber;
                                        response.edcrDetail[0].ocPermitdate = permitDate;
                                        response.edcrDetail[0].appliedBy = architectName
                                        setPermitEdcrData(response?.edcrDetail?.[0]);
                                    }
                                })
                                .catch((e) => {
                                    setShowToast({ key: "error", error: true, message: e?.response?.data?.Errors[0]?.message || null });
                                });
                        }).catch((e) => {
                            setShowToast({ key: "error", error: true, message: e?.response?.data?.Errors[0]?.message || null });
                        });
                    } else {
                        setShowToast({ key: "error", warning: true, message: t("ERR_FILL_EDCR_PERMIT_INCORRECT_DATE") });
                    }
                } else if (result?.BPA?.length == 0) {
                    setShowToast({ key: "error", error: true, message: t("BPA_NO_REC_FOUND_LABEL") });
                }
            })
            .catch((e) => {
                setShowToast({ key: "error", error: true, message: e?.response?.data?.Errors[0]?.message || null });
            });
    };

    const routeToNextPage = () => {
        onSelect(config.key, permitEdcrData);
    };

    return (
        <div>
            <FormStep
                t={t}
                config={config}
                onSelect={handleSubmit}
                onSkip={onSkip}
                isDisabled={!permitNumber}
                onAdd={onAdd}
                isMultipleAllow={true}
            >
                <CardCaption>{`${t("BPA_OC_NEW_BUILDING_CONSTRUCTION_LABEL")}`}</CardCaption>
                <CardHeader>{`${t("BPA_OC_EDCR_SCRUTINY_LABEL")}`}</CardHeader>
                <CardText>{`${t("BPA_PROVIDE_BPN_AND_BPD_APP_LABEL")}`}</CardText>
                <CardLabel>{`${t("EDCR_BUILDING_PERMIT_NUM_LABEL")} *`}</CardLabel>
                <TextInput
                    isMandatory={false}
                    optionKey="i18nKey"
                    t={t}
                    name="permitNumber"
                    onChange={setPermitNo}
                    value={permitNumber}
                    {...(validation = {
                        isRequired: true,
                        pattern: getPattern("Name"),
                        title: t("BPA_INVALID_NAME"),
                    })}
                />
                <CardLabel>{`${t("EDCR_BUILDING_PERMIT_DATE_LABEL")} *`}</CardLabel>
                <DatePicker
                    date={permitDate}
                    name="permitDate"
                    onChange={setOCPermitDate}
                />
                <div onClick={getSearchResults}>
                    <SubmitBar label={t("ACTION_TEST_BPA_STAKE_HOLDER_SEARCH")} disabled={!permitNumber || !permitDate}/>
                </div>
                {showToast && 
                    <Toast 
                        error={showToast?.error}
                        warning={showToast?.warning}
                        label={t(showToast?.message)}
                        isDleteBtn={true}
                        onClose={() => { setShowToast(null) }} 
                    />}
            </FormStep>
            {permitEdcrData?.edcrNumber ?
                <FormStep
                    t={t}
                    config={config}
                    onSelect={handleSubmit}
                    onSkip={onSkip}
                    isDisabled={!permitNumber}
                    onAdd={onAdd}
                    isMultipleAllow={true}
                >
                    <StatusTable>
                        <Row
                            label={`${t("REPORT_FSM_RESULT_APPLICANTNAME")}`}
                            text={t(permitEdcrData?.applicantName)}
                            className="border-none"
                        />
                        <Row
                            label={`${t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}`}
                            text={t(permitEdcrData?.applicationSubType)}
                            className="border-none"
                        />
                        <Row
                            label={`${t("EDCR_TOTAL_BUILD_UP_AREA_LABEL")}`}
                            text={t(permitEdcrData?.planDetail?.virtualBuilding?.totalBuitUpArea)}
                            className="border-none"
                        />
                        <Row
                            label={`${t("EDCR_BUILDING_HEIGHT_LABEL")}`}
                            text={t(permitEdcrData?.planDetail?.blocks[0]?.building?.buildingHeight)}
                            className="border-none"
                        />
                        <Row
                            label={`${t("BPA_ARCHITECT_NAME_LABEL")}`}
                            text={t(permitEdcrData?.appliedBy)}
                            className="border-none"
                        />
                    </StatusTable>
                    <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
                    <h1 style={{ fontSize: "18px", lineHeight: "21px", fontWeight: "700", padding: "0px 0px 16px 0px" }}>{`${t("BPA_PERMIT_EDCR_DETAILS_LABEL")}`}</h1>
                    <StatusTable>
                        <Row
                            label={`${t("BPA_EDCR_NO_LABEL")}`}
                            text={t(permitEdcrData?.edcrNumber)}
                            className="border-none"
                        />
                    </StatusTable>
                    <h1 style={{ fontSize: "18px", lineHeight: "21px", fontWeight: "700", padding: "0px 0px 16px 0px" }}>{`${t("BPA_UPLOADED_PLAN_DIAGRAM_LABEL")}`}</h1>
                    <a target="_" href={permitEdcrData?.updatedDxfFile} style={{ minWidth: "160px", marginRight: "20px" }} key={permitEdcrData?.updatedDxfFile}>
                        {/**TODO : refactor it to send height,weight as part of styles object instead of passing seperately */}
                        <PDFSvg />
                        <p style={{ marginTop: "8px", fontWeight: "bold", fontSize: "14px", lineHeight: "19px", color: "#505A5F", fontWeight: "400" }}>{t("BPA_UPLOADED_PLAN_DXF")}</p>
                    </a>
                    <h1 style={{ fontSize: "18px", lineHeight: "21px", fontWeight: "700", padding: "0px 0px 16px 0px" }}>{`${t("BPA_SCRUTINY_REPORT_OUTPUT_LABEL")}`}</h1>
                    <a target="_" href={permitEdcrData?.planReport} style={{ minWidth: "160px", marginRight: "20px" }} key={permitEdcrData?.planReport}>
                        {/**TODO : refactor it to send height,weight as part of styles object instead of passing seperately */}
                        <PDFSvg />
                        <p style={{ marginTop: "8px", fontWeight: "bold", fontSize: "14px", lineHeight: "19px", color: "#505A5F", fontWeight: "400" }}>{t("BPA_SCRUTINY_REPORT_PDF")}</p>
                    </a>
                    <div onClick={routeToNextPage}>
                        <SubmitBar label={t("BPA_PROCEED_OC_SCRUTINY_LABEL")} />
                    </div>
                    {/* <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}></div> */}
                </FormStep> : null
            }
        </div>
    );
};

export default OCeDCRScrutiny;
