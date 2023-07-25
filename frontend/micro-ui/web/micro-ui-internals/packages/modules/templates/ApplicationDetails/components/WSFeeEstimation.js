import React, { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardSectionHeader, CardLabel } from "@egovernments/digit-ui-react-components";
import { Modal, Dropdown, Row, StatusTable, TextInput, Toast } from "@egovernments/digit-ui-react-components";
import cloneDeep from "lodash/cloneDeep";

const Penality_menu = [
    {
        title: "PT_PENDING_DUES_FROM_EARLIER",
        value: "Pending dues from earlier",
    },
    {
        title: "PT_MISCALCULATION_OF_EARLIER_ASSESSMENT",
        value: "Miscalculation of earlier Assessment",
    },
    {
        title: "PT_ONE_TIME_PENALITY",
        value: "One time penality",
    },
    {
        title: "PT_OTHERS",
        value: "Others",
    },
]
const Rebate_menu = [
    {
        title: "PT_ADVANCED_PAID_BY_CITIZEN_EARLIER",
        value: "Advanced Paid By Citizen Earlier",
    },
    {
        title: "PT_REBATE_PROVIDED_BY_COMMISSIONER_EO",
        value: "Rebate provided by commissioner/EO",
    },
    {
        title: "PT_ADDITIONAL_AMOUNT_CHARGED_FROM_THE_CITIZEN",
        value: "Additional amount charged from the citizen",
    },
    {
        title: "PT_OTHERS",
        value: "Others",
    },
];


const WSFeeEstimation = ({ wsAdditionalDetails, workflowDetails }) => {
    const { t } = useTranslation();
    const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("ADHOC_ADD_REBATE_DATA", {});
    const [sessionBillFormData, setSessionBillFormData, clearBillSessionFormData] = Digit.Hooks.useSessionStorage("ADHOC_BILL_ADD_REBATE_DATA", {});
    const isPaid = wsAdditionalDetails?.additionalDetails?.isPaid ? true : false;
    const [popup, showPopUp] = useState(false);
    const [fields, setFields] = useState(sessionFormData ? sessionFormData : {});
    const [showToast, setShowToast] = useState(null);
    const [billDetails, setBillDetails] = useState(wsAdditionalDetails.additionalDetails.data ? wsAdditionalDetails.additionalDetails.data : {});
    const [values, setValues] = useState(wsAdditionalDetails.additionalDetails.values ? wsAdditionalDetails.additionalDetails.values : []);

    const stateCode = Digit.ULBService.getStateId();
    const { isMdmsLoading, data: mdmsRes } = Digit.Hooks.ws.useMDMS(stateCode, "BillingService", ["TaxHeadMaster"]);

    useEffect(() => {
        const data = { ...wsAdditionalDetails?.additionalDetails?.appDetails?.additionalDetails };
        setSessionFormData(data);
        setFields(data);
        if (sessionFormData?.billDetails?.length > 0) {
            const values = [
                { title: "WS_APPLICATION_FEE_HEADER", value: sessionFormData?.billDetails?.[0]?.fee },
                { title: "WS_SERVICE_FEE_HEADER", value: sessionFormData?.billDetails?.[0]?.charge },
                { title: "WS_TAX_HEADER", value: sessionFormData?.billDetails?.[0]?.taxAmount },
            ];
            setValues(values);
            setBillDetails(sessionFormData?.billDetails?.[0]);
        }
    }, []);

    let validation = {};

    const Heading = (props) => {
        return <h1 className="heading-m">{props.label}</h1>;
    };

    const Close = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
    );

    const CloseBtn = (props) => {
        return (
            <div className="icon-bg-secondary" onClick={props.onClick}>
                <Close />
            </div>
        );
    };

    const closeToast = () => {
        setShowToast(false);
    };

    const addAdhocRebatePenality = (e) => {
        const adhocAmount = fields?.adhocPenalty ? Number(fields?.adhocPenalty) : 0;
        const rebateAmount = fields?.adhocRebate ? Number(fields?.adhocRebate) : 0;
        if (adhocAmount || rebateAmount) {

            const totalAmount = wsAdditionalDetails?.additionalDetails?.data?.totalAmount;
            const demandId = wsAdditionalDetails?.additionalDetails?.data?.billDetails?.[0]?.demandId;

            if (rebateAmount > totalAmount) {
                setShowToast({ isError: false, isWarning: true, key: "error", message: t("ERR_WS_REBATE_GREATER_THAN_AMOUNT") });
            } else {
                const applicationNo = wsAdditionalDetails?.additionalDetails?.appDetails?.applicationNo;
                const tenantId = wsAdditionalDetails?.additionalDetails?.appDetails?.tenantId;
                const appAdditionalDetails = { ...wsAdditionalDetails?.additionalDetails?.appDetails?.additionalDetails, ...fields }
                wsAdditionalDetails.additionalDetails.appDetails.additionalDetails = appAdditionalDetails;

                const data = {
                    CalculationCriteria:
                        wsAdditionalDetails?.additionalDetails?.appDetails?.service == "WATER"
                            ? [
                                {
                                    applicationNo: applicationNo,
                                    tenantId: tenantId,
                                    waterConnection: wsAdditionalDetails.additionalDetails.appDetails,
                                },
                            ]
                            : [
                                {
                                    applicationNo: applicationNo,
                                    tenantId: tenantId,
                                    sewerageConnection: wsAdditionalDetails.additionalDetails.appDetails,
                                },
                            ],
                    isconnectionCalculation: false,
                };

                let businessService = wsAdditionalDetails?.additionalDetails?.appDetails?.service == "WATER" ? "WS" : "SW";
                Digit.WSService.wsCalculationEstimate(data, businessService)
                    .then((result, err) => {
                        if (result?.Calculation?.[0]?.taxHeadEstimates?.length > 0) {
                            result?.Calculation?.[0]?.taxHeadEstimates?.forEach(data => data.amount = data.estimateAmount);
                          }

                        result.Calculation[0].billSlabData = _.groupBy(result?.Calculation?.[0]?.taxHeadEstimates, 'category');
                        const values = [
                            { title: "WS_APPLICATION_FEE_HEADER", value: result.Calculation?.[0]?.fee },
                            { title: "WS_SERVICE_FEE_HEADER", value: result.Calculation?.[0]?.charge },
                            { title: "WS_TAX_HEADER", value: result.Calculation?.[0]?.taxAmount },
                        ];
                        setSessionBillFormData(cloneDeep(result.Calculation[0]));
                        setBillDetails(result?.Calculation?.[0]);
                        setValues(values);
                        fields.billDetails = result?.Calculation;
                        setSessionFormData(fields);
                        showPopUp(false);
                    })
                    .catch((e) => {
                        setShowToast({ isError: true, isWarning: false, key: "error", message: e?.response?.data?.Errors[0]?.message ? t(`${e?.response?.data?.Errors[0]?.code}`) : t("PT_COMMON_ADD_REBATE_PENALITY") });
                    });
            }
        } else {
            setShowToast({ isError: false, isWarning: true, key: "warning", message: t("ERR_WS_ENTER_ATLEAST_ONE_FIELD") });
        }
    }

    const selectedValuesData = (value, isDropDownValue = false, e) => {
        let values = { ...fields };
        if (isDropDownValue) {
            values[`${value}_data`] = e;
            values[value] = e.title;
            if (e.title == "PT_OTHERS" && value == "adhocPenaltyReason") values[`adhocPenaltyComment`] = "";
            if (e.title == "PT_OTHERS" && value == "adhocRebateReason") values[`adhocRebateComment`] = "";
        } else {
            values[value] = e.target.value;
        }
        setFields(values);
    }

    return (
        <Fragment>
            <div style={{ lineHeight: "19px", maxWidth: "950px", minWidth: "280px" }}>
                {values &&
                    <StatusTable>
                        <div>
                            {values?.map((value, index) => {
                                return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.value ? Number(value?.value).toFixed(2) : ""} />
                            })}
                        </div>
                        <hr style={{ border: "1px solid #D6D5D4", color: "#D6D5D4", margin: "16px 0px" }}></hr>
                        <div>
                            <Row className="border-none" key={`WS_COMMON_TOTAL_AMT`} label={`${t(`WS_COMMON_TOTAL_AMT`)}`} text={Number(billDetails?.totalAmount).toFixed(2) || 0} />
                            <Row className="border-none" key={`CS_INBOX_STATUS_FILTER`} label={`${t(`CS_INBOX_STATUS_FILTER`)}`} text={isPaid ? t("WS_COMMON_PAID_LABEL") : t("WS_COMMON_NOT_PAID")} textStyle={!isPaid ? { color: "#D4351C" } : { color: "#00703C" }} />
                        </div>
                    </StatusTable>}
                {
                    wsAdditionalDetails?.additionalDetails?.isAdhocRebate ? <div
                        onClick={(e) => {
                            showPopUp(true)
                        }}
                    >
                        <span style={{ cursor: "pointer", color: "#F47738" }}>{t("WS_PAYMENT_ADD_REBATE_PENALTY")}</span>
                    </div> : null
                }
                {popup &&
                    <Modal
                        headerBarMain={<Heading label={t("PT_ADD_REBATE_PENALITY")} />}
                        headerBarEnd={
                            <CloseBtn
                                onClick={() => {
                                    setFields(sessionFormData);
                                    showPopUp(false);
                                }} />}
                        actionCancelLabel={t("PT_CANCEL")}
                        actionCancelOnSubmit={() => {
                            setFields(sessionFormData);
                            showPopUp(false);
                        }}
                        actionSaveLabel={t("PT_ADD")}
                        actionSaveOnSubmit={(e) => addAdhocRebatePenality(e)}
                        hideSubmit={false}
                        popupStyles={{ overflowY: "auto" }}
                    >
                        {
                            <div>
                                <Card style={{ padding: "10px 10px 1px 10px", margin: "0px 0px 15px 0px" }}>
                                    <CardSectionHeader style={{ fontSize: "16px", fontWeight: "700", lineHeight: "18px", padding: "0px", margin: "0px 0px 10px 0px" }} >{t("PT_AD_PENALTY")}</CardSectionHeader>
                                    <CardLabel>
                                        {t("PT_TX_HEADS")}
                                    </CardLabel>
                                    <div className="field">
                                        <Dropdown
                                            isMandatory
                                            option={Penality_menu}
                                            optionKey="title"
                                            select={(e) => selectedValuesData("adhocPenaltyReason", true, e)}
                                            selected={fields?.adhocPenaltyReason_data || ""}
                                            isPropertyAssess={true}
                                            name={"adhocPenaltyReason_data"}
                                            t={t}
                                        />
                                    </div>
                                    {fields?.adhocPenaltyReason_data?.title === "PT_OTHERS" && <div className="field">
                                        <CardLabel>{t("PT_REASON")}</CardLabel>
                                        <div className="field">
                                            <TextInput
                                                style={{ background: "#FAFAFA" }}
                                                t={t}
                                                type={"text"}
                                                isMandatory={false}
                                                name="adhocPenaltyComment"
                                                value={fields?.adhocPenaltyComment || ""}
                                                onChange={(e) => selectedValuesData("adhocPenaltyComment", false, e)}
                                                {...(validation = {
                                                    isRequired: true,
                                                    pattern: "^[a-zA-Z-.`' ]*$",
                                                    type: "text",
                                                    title: t("TL_NAME_ERROR_MESSAGE"),
                                                })}
                                            />
                                        </div>
                                    </div>}
                                    <CardLabel>{t("PT_HEAD_AMT")}</CardLabel>
                                    <div className="field">
                                        <TextInput
                                            style={{ background: "#FAFAFA" }}
                                            t={t}
                                            type={"number"}
                                            isMandatory={false}
                                            name="adhocPenalty"
                                            value={fields?.adhocPenalty || ""}
                                            onChange={(e) => selectedValuesData("adhocPenalty", false, e)}
                                            {...(validation = {
                                                isRequired: true,
                                                pattern: "^[1-9]+[0-9]*$",
                                                title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                                            })}
                                        />

                                    </div>
                                </Card>
                                <Card style={{ padding: "10px 10px 1px 10px", margin: "0px 0px 15px 0px" }}>
                                    <CardSectionHeader style={{ fontSize: "16px", fontWeight: "700", lineHeight: "18px", padding: "0px", margin: "0px 0px 10px 0px" }} >{t("PT_AD_REBATE")}</CardSectionHeader>
                                    <CardLabel>{t("PT_TX_HEADS")}</CardLabel>
                                    <div className="field">
                                        <Dropdown
                                            isMandatory
                                            option={Rebate_menu}
                                            optionKey="title"
                                            select={(e) => selectedValuesData("adhocRebateReason", true, e)}
                                            selected={fields?.adhocRebateReason_data || ""}
                                            name={"adhocRebateReason_data"}
                                            isPropertyAssess={true}
                                            t={t}
                                        />
                                    </div>
                                    {fields?.adhocRebateReason_data?.title === "PT_OTHERS" && <div className="field">
                                        <CardLabel>{t("PT_REASON")}</CardLabel>
                                        <TextInput
                                            style={{ background: "#FAFAFA" }}
                                            t={t}
                                            type={"text"}
                                            isMandatory={false}
                                            name="adhocRebateComment"
                                            value={fields?.adhocRebateComment || ""}
                                            onChange={(e) => selectedValuesData("adhocRebateComment", false, e)}
                                            {...(validation = {
                                                isRequired: true,
                                                pattern: "^[a-zA-Z-.`' ]*$",
                                                type: "text",
                                                title: t("TL_NAME_ERROR_MESSAGE"),
                                            })}
                                        />
                                    </div>}
                                    <CardLabel>{t("PT_HEAD_AMT")}</CardLabel>
                                    <div className="field">
                                        <TextInput
                                            style={{ background: "#FAFAFA" }}
                                            t={t}
                                            type={"number"}
                                            isMandatory={false}
                                            name="adhocRebate"
                                            value={fields?.adhocRebate || ""}
                                            onChange={(e) => selectedValuesData("adhocRebate", false, e)}
                                            {...(validation = {
                                                isRequired: true,
                                                pattern: "^[1-9]+[0-9]*$",
                                                title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                                            })}
                                        />
                                    </div>
                                </Card>
                            </div>
                        } </Modal>}
                {showToast &&
                    <Toast
                        style={{ zIndex: "10000" }}
                        warning={showToast?.isWarning}
                        error={showToast?.isWarning ? false : true}
                        label={t(showToast?.message)}
                        onClose={closeToast}
                        isDleteBtn={true}
                    />}
            </div>
        </Fragment>
    )
}

export default WSFeeEstimation;