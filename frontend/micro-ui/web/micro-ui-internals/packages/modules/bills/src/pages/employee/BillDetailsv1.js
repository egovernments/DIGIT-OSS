import React, { Fragment,useState } from 'react'
import { Card, CardSectionHeader, Header, Loader, RadioButtons, Row, StatusTable, TextInput,ActionBar,SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { BillDetailsConfig } from './BillDetailsConfig';
import CancelBillModal from '../../components/CancelBill/CancelBillModal';
import { useHistory } from "react-router-dom";

const BillDetailsv1 = (props) => {
    const history = useHistory()
    //serviceTYpe -> WS,SW
    const { connectionNumber,service:serviceType,tenantId} = Digit.Hooks.useQueryParams();
    
    const result = Digit.Hooks.useFetchBillsForBuissnessService(
        { businessService: serviceType, ...{ consumerCode: connectionNumber }, tenantId }
    );
    const fetchedBill = result?.data?.Bill?.[0]


    const { state } = useLocation()
    const { t } = useTranslation()
    const bill = state
    const config = BillDetailsConfig[bill?.businessService]
    const getTotal = () => (bill?.totalAmount ? bill?.totalAmount : 0);
    const arrears =
        fetchedBill?.billDetails
            ?.sort((a, b) => b.fromPeriod - a.fromPeriod)
            ?.reduce((total, current, index) => (index === 0 ? total : total + current.amount), 0) || 0;
    const yearWiseBills = fetchedBill?.billDetails?.sort((a, b) => b.fromPeriod - a.fromPeriod);
    const billDetails = yearWiseBills?.[0] || [];
    // let result = Digit.Hooks.ws.useSearchWS({ tenantId, filters: { connectionNumber, searchType:"CONNECTION"}, config, bussinessService: serviceType, t });
    // const fetchedBill = result?.billData?.[0]
    
    const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useConnectionDetail(t, tenantId, connectionNumber, serviceType==="WS"?"WATER":"SEWERAGE"); 
    
    const [showModal, setShowModal] = useState(false)
    const handleCancelBillAction = (_data) => {
        setShowModal(false)
       
        const filters = {
            tenantId,
            consumerCodes: [bill?.consumerCode],
            businessService: bill?.businessService,
            statusToBeUpdated: "CANCELLED",
            additionalDetails: {
                reason: _data?.reason?.code,
                description: _data?.details || "",
                reasonMessage: t(_data?.reason?.message)
            }
        }
        history.push("/digit-ui/employee/bills/response-cancelBill", { filters, bill });
    }

    const getTranslatedValues = (dataValue, isNotTranslated) => {
        if (dataValue) {
            return !isNotTranslated ? t(dataValue) : dataValue;
        } else {
            return t("NA");
        }
    };

    const getTextValue = (value) => {
        if (value?.skip) return value.value;
        else if (value?.isUnit) return value?.value ? `${getTranslatedValues(value?.value, value?.isNotTranslated)} ${t(value?.isUnit)}` : t("N/A");
        else return value?.value ? getTranslatedValues(value?.value, value?.isNotTranslated) : t("N/A");
    };

    const checkLocation =
        window.location.href.includes("employee/tl") || window.location.href.includes("employee/obps") || window.location.href.includes("employee/noc");
    const isNocLocation = window.location.href.includes("employee/noc");
    const isBPALocation = window.location.href.includes("employee/obps");
    const isWS = window.location.href.includes("employee/ws");

    return (
        <>
            <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
                <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("ABG_BILL_DETAILS_HEADER")}</Header>
            </div>
            {fetchedBill && !isLoading ?<Card style={{ position: "relative" }} className={"employeeCard-override"}>
                <>
                    <StatusTable>
                        {fetchedBill &&
                            config?.details.map((obj, index) => {
                                const value = obj.keyPath.reduce((acc, key) => {
                                    if (typeof key === "function") acc = key(acc);
                                    else acc = acc[key];
                                    return acc;
                                }, fetchedBill);
                                return <Row key={index + "bill"} label={t(obj.keyValue)} text={value} />;
                        })}
                    </StatusTable>
                    
                    <StatusTable style={{ paddingTop: "46px" }}>
                        <CardSectionHeader>{t("ABG_BILL_DETAILS_HEADER")}</CardSectionHeader>
                        <Row label={t("ES_PAYMENT_TAXHEADS")} textStyle={{ fontWeight: "bold" }} text={t("ES_PAYMENT_AMOUNT")} />
                        <hr style={{ width: "40%" }} className="underline" />
                        {billDetails?.billAccountDetails
                            ?.sort((a, b) => a.order - b.order)
                            .map((amountDetails, index) => (
                                <Row
                                    key={index + "taxheads"}
                                    labelStyle={{ fontWeight: "normal" }}
                                    textStyle={{ textAlign: "right", maxWidth: "100px" }}
                                    label={t(amountDetails.taxHeadCode)}
                                    text={"₹ " + amountDetails.amount?.toFixed(2)}
                                />
                            ))}

                        {arrears?.toFixed?.(2) ? (
                            <Row
                                labelStyle={{ fontWeight: "normal" }}
                                textStyle={{ textAlign: "right", maxWidth: "100px" }}
                                label={t("COMMON_ARREARS")}
                                text={"₹ " + arrears?.toFixed?.(2) || Number(0).toFixed(2)}
                            />
                        ) : null}

                        <hr style={{ width: "40%" }} className="underline" />
                        <Row
                            label={t("CS_PAYMENT_TOTAL_AMOUNT")}
                            textStyle={{ fontWeight: "bold", textAlign: "right", maxWidth: "100px" }}
                            text={"₹ " + getTotal()}
                        />
                    </StatusTable>
                </>

                {applicationDetails?.applicationDetails?.map((detail, index) => (
                    <React.Fragment key={index}>
                        <div >
                            {index === 0 && !detail.asSectionHeader ? (
                                <CardSubHeader style={{ marginBottom: "16px", fontSize: "24px" }}>{t(detail.title)}</CardSubHeader>
                            ) : (
                                <React.Fragment>
                                    <CardSectionHeader
                                        style={
                                            index == 0 && checkLocation
                                                ? { marginBottom: "16px", fontSize: "24px" }
                                                : { marginBottom: "16px", marginTop: "32px", fontSize: "24px" }
                                        }
                                    >
                                        {isNocLocation ? `${t(detail.title)}` : t(detail.title)}
                                        {detail?.Component ? <detail.Component /> : null}
                                    </CardSectionHeader>
                                </React.Fragment>
                            )}
                            {/* TODO, Later will move to classes */}
                            {/* Here Render the table for adjustment amount details detail.isTable is true for that table*/}
                            {detail?.isTable && (
                                <table style={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
                                    <tr style={{ textAlign: "left" }}>
                                        {detail?.headers.map(header => <th style={{ padding: "10px" }}>{t(header)}</th>)}
                                    </tr>
                                    {detail?.tableRows.map(row => <tr>
                                        {row.map(element => <td style={{ paddingRight: "60px", paddingTop: "20px", textAlign: "center" }}>{t(element)}</td>)}
                                    </tr>)}
                                </table>
                            )}
                            <StatusTable >
                                {detail?.title &&
                                    !detail?.title.includes("NOC") &&
                                    detail?.values?.map((value, index) => {
                                        if (value.map === true && value.value !== "N/A") {
                                            return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" />} />;
                                        }
                                        if (value?.isLink == true) {
                                            return (
                                                <Row
                                                    key={t(value.title)}
                                                    label={
                                                        window.location.href.includes("tl") || window.location.href.includes("ws") || window.location.href.includes("bills") ? (
                                                            <div style={{ width: "200%" }}>
                                                                <Link to={value?.to}>
                                                                    <span className="link" style={{ color: "#F47738" }}>
                                                                        {t(value?.title)}
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        ) : isNocLocation || isBPALocation ? (
                                                            `${t(value.title)}`
                                                        ) : (
                                                            t(value.title)
                                                        )
                                                    }
                                                    text={
                                                        <div>
                                                            <Link to={value?.to}>
                                                                <span className="link" style={{ color: "#F47738" }}>
                                                                    {value?.value}
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    }
                                                    last={index === detail?.values?.length - 1}
                                                    caption={value.caption}
                                                    className="border-none"
                                                //rowContainerStyle={}
                                                />
                                            );
                                        }
                                        return (
                                            <Row
                                                key={t(value.title)}
                                                label={isWS ? `${t(value.title)}:` : t(value.title)}
                                                text={getTextValue(value)}
                                                last={index === detail?.values?.length - 1}
                                                caption={value.caption}
                                                className="border-none"
                                            // TODO, Later will move to classes
                                            //rowContainerStyle={}
                                            />
                                        );
                                    })}
                            </StatusTable>
                        </div>
                    </React.Fragment>
                ))}
            </Card>:<Loader/>}

            <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
                <SubmitBar label={t("ABG_CANCEL_BILL")} onSubmit={()=>setShowModal(true)}/>
            </ActionBar>

            


            {showModal && <CancelBillModal
                t={t}
                closeModal={() => setShowModal(false)}
                actionCancelLabel={"ABG_BACK"}
                actionCancelOnSubmit={() => setShowModal(false)}
                actionSaveLabel={"ABG_CANCEL_BILL"}
                actionSaveOnSubmit={handleCancelBillAction}
                onSubmit={handleCancelBillAction}
            >
            </CancelBillModal>}
        </>
    )
}

export default BillDetailsv1