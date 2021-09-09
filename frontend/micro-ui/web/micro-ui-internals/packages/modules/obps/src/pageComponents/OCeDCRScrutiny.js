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
    Row
} from "@egovernments/digit-ui-react-components";
import { getPattern, convertDateToEpoch } from "../utils";

const OCeDCRScrutiny = ({ t, config, onSelect, userType, formData, ownerIndex = 0, addNewOwner, isShowToast }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [permitNumber, setPermitNumber] = useState(formData?.ScrutinyDetails?.ocPermitNumber);
    const [permitDate, setPermitDate] = useState(formData?.ScrutinyDetails?.ocPermitdate);
    const [permitEdcrData, setPermitEdcrData] = useState(formData?.ScrutinyDetails);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const PDFSvg = ({ width = 34, height = 34, style }) => (
        <svg style={style} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 34 34" fill="gray">
            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
        </svg>
    );

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
        let queryObj = {
            permitDate: convertDateToEpoch(permitDate),
            approvalNo: permitNumber
        };
        Digit.OBPSService.BPASearch(tenantId, queryObj)
            .then((result, err) => {
                if (result?.BPA?.length > 0) {
                    const edcrNumber = result?.BPA?.[0]?.edcrNumber;
                    const tenantIdForEdcr = result?.BPA?.[0]?.tenantId;
                    Digit.OBPSService.scrutinyDetails(tenantIdForEdcr, { edcrNumber: edcrNumber }).then((response) => {
                        const userInfo = Digit.UserService.getUser();
                        const queryObject = { 0: { tenantId: stateId }, 1: { id: userInfo?.info?.id } };
                        Digit.OBPSService.BPAREGSearch(tenantId, queryObject).then((License, error) => {
                            let architectName = "";
                            for (let i = 0; i < License.Licenses.length; i++) {
                                if (License.Licenses[i].status === "APPROVED") {
                                    architectName = License.Licenses[i].tradeLicenseDetail.owners[0].name;
                                }
                            }
                            if (response?.edcrDetail?.length > 0) {
                                const isPrimaryOwner = result?.BPA?.[0]?.landInfo?.owners?.filter(data => data.isPrimaryOwner);
                                response.edcrDetail[0].applicantName = isPrimaryOwner?.[0]?.name;
                                response.edcrDetail[0].ocPermitNumber = permitNumber;
                                response.edcrDetail[0].ocPermitdate = permitDate;
                                response.edcrDetail[0].appliedBy = architectName
                                setPermitEdcrData(response?.edcrDetail?.[0]);
                            }
                        }).catch((e) => {
                            setShowToast({ key: "error" });
                            setError(e?.response?.data?.Errors[0]?.message || null);
                        });

                    }).catch((e) => {
                        setShowToast({ key: "error" });
                        setError(e?.response?.data?.Errors[0]?.message || null);
                    });
                }
            })
            .catch((e) => {
                setShowToast({ key: "error" });
                setError(e?.response?.data?.Errors[0]?.message || null);
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
                <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}></div>
                {showToast && <Toast error={showToast?.key === "error" ? true : false} label={error} onClose={() => { setShowToast(null); setError(null); }} />}
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
                            label={`${t("REPORT_FSM_RESULT_APPLICANTNAME")} :`}
                            text={t(permitEdcrData?.applicantName)}
                            className="border-none"
                        />
                        <Row
                            label={`${t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")} :`}
                            text={t(permitEdcrData?.applicationSubType)}
                            className="border-none"
                        />
                        <Row
                            label={`${t("EDCR_TOTAL_BUILD_UP_AREA_LABEL")} :`}
                            text={t(permitEdcrData?.planDetail?.virtualBuilding?.totalBuitUpArea)}
                            className="border-none"
                        />
                        <Row
                            label={`${t("EDCR_BUILDING_HEIGHT_LABEL")} :`}
                            text={t(permitEdcrData?.planDetail?.blocks[0]?.building?.buildingHeight)}
                            className="border-none"
                        />
                        <Row
                            label={`${t("BPA_ARCHITECT_NAME_LABEL")} :`}
                            text={t(permitEdcrData?.appliedBy)}
                        />
                    </StatusTable>
                    <h1 style={{ fontSize: "18px", lineHeight: "21px", fontWeight: "700", padding: "16px 0px" }}>{`${t("BPA_PERMIT_EDCR_DETAILS_LABEL")}`}</h1>
                    <StatusTable>
                        <Row
                            label={`${t("BPA_EDCR_NO_LABEL")} :`}
                            text={t(permitEdcrData?.edcrNumber)}
                            className="border-none"
                        />
                    </StatusTable>
                    <h1 style={{ fontSize: "18px", lineHeight: "21px", fontWeight: "700", padding: "16px 0px" }}>{`${t("BPA_UPLOADED_PLAN_DIAGRAM_LABEL")} :`}</h1>
                    <a target="_" href={permitEdcrData?.updatedDxfFile} style={{ minWidth: "160px", marginRight: "20px" }} key={permitEdcrData?.updatedDxfFile}>
                        <PDFSvg width={140} height={140} style={{ background: "#f6f6f6", padding: "8px" }} />
                        <p style={{ marginTop: "8px", fontWeight: "bold", fontSize: "16px", lineHeight: "19px", color: "#505A5F" }}>{t("Uploaded Plan.DXF")}</p>
                    </a>
                    <h1 style={{ fontSize: "18px", lineHeight: "21px", fontWeight: "700", padding: "16px 0px" }}>{`${t("BPA_SCRUTINY_REPORT_OUTPUT_LABEL")} :`}</h1>
                    <a target="_" href={permitEdcrData?.planReport} style={{ minWidth: "160px", marginRight: "20px" }} key={permitEdcrData?.planReport}>
                        <PDFSvg width={140} height={140} style={{ background: "#f6f6f6", padding: "8px" }} />
                        <p style={{ marginTop: "8px", fontWeight: "bold", fontSize: "16px", lineHeight: "19px", color: "#505A5F" }}>{t("Scrutiny Report.PDF")}</p>
                    </a>
                    <div onClick={routeToNextPage}>
                        <SubmitBar label={t("BPA_PROCEED_OC_SCRUTINY_LABEL")} />
                    </div>
                    <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}></div>
                </FormStep> : null
            }
        </div>
    );
};

export default OCeDCRScrutiny;
