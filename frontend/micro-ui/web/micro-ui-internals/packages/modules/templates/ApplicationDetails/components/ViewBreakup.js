import React, { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { CardSectionHeader, Modal, Row, StatusTable } from "@egovernments/digit-ui-react-components";

const ViewBreakup = ({ wsAdditionalDetails, workflowDetails }) => {
    const { t } = useTranslation();
    const [popup, showPopUp] = useState(false);
    const [breakUpData, setBreakUpData] = useState({});

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

    const onPopupOpen = () => {
        let breakupData = wsAdditionalDetails.additionalDetails.data || {};
        const sessionBillData = sessionStorage.getItem("Digit.ADHOC_BILL_ADD_REBATE_DATA");
        const sessionBillFormData = sessionBillData ? JSON.parse(sessionBillData) : {};
        if (sessionBillFormData?.value?.totalAmount) breakupData = sessionBillFormData?.value;
        setBreakUpData(breakupData);
        showPopUp(true);
    }

    return (
        <Fragment>
            <div style={{ lineHeight: "19px", maxWidth: "950px", minWidth: "280px" }}>
                {wsAdditionalDetails?.additionalDetails?.isViewBreakup ? <div onClick={(e) => onPopupOpen()} style={{ marginTop: "12px" }}>
                    <span style={{ cursor: "pointer", color: "#F47738" }}>{t("WS_PAYMENT_VIEW_BREAKUP")}</span>
                </div> : null
                }
                {popup &&
                    <Modal
                        headerBarMain={<Heading label={t("WS_CALCULATION_BREAKUP")} />}
                        headerBarEnd={<CloseBtn onClick={() => { showPopUp(false); }} />}
                        hideSubmit={true}
                        popupStyles={{ overflowY: "auto" }} //maxHeight: "calc(100% - 90px)"
                        headerBarMainStyle={{ marginBottom: "0px" }}
                        popupModuleMianStyles={{ paddingTop: "0px" }}
                    >
                        {<StatusTable style={{ padding: "10px", paddingTop: "0px" }}>
                            <CardSectionHeader style={{ margin: "10px 0px" }}>{t("WS_APPLICATION_FEE_HEADER")}</CardSectionHeader>
                            {breakUpData?.billSlabData?.FEE?.map(data => <Row className="border-none" rowContainerStyle={{ margin: "0px" }} labelStyle={{ width: "50%" }} key={`${data?.taxHeadCode}`} label={`${t(`${data?.taxHeadCode}`)}`} text={<span>&#8377;{Number(data?.amount) || 0}</span>} textStyle={{ textAlign: "right" }} />)}
                            <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", marginBottom: "10px" }} />
                            <Row className="border-none" rowContainerStyle={{ margin: "0px" }} labelStyle={{ width: "50%" }} key={`PDF_STATIC_LABEL_CONSOLIDATED_TLAPP_TOTAL_AMOUNT1`} label={`${t(`PDF_STATIC_LABEL_CONSOLIDATED_TLAPP_TOTAL_AMOUNT`)}`} text={<span>&#8377;{Number(breakUpData?.fee) || 0}</span>} textStyle={{ textAlign: "right", fontWeight: "700", fontSize: "24px" }} />
                            <CardSectionHeader style={{ margin: "10px 0px" }}>{t("WS_SERVICE_FEE_HEADER")}</CardSectionHeader>
                            {breakUpData?.billSlabData?.CHARGES?.map(data => <Row className="border-none" rowContainerStyle={{ margin: "0px" }} labelStyle={{ width: "50%" }} key={`${data?.taxHeadCode}`} label={`${t(`${data?.taxHeadCode}`)}`} text={<span>&#8377;{Number(data?.amount) || 0}</span>} textStyle={{ textAlign: "right" }} />)}
                            <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", marginBottom: "10px" }} />
                            <Row className="border-none" rowContainerStyle={{ margin: "0px" }} labelStyle={{ width: "50%" }} key={`PDF_STATIC_LABEL_CONSOLIDATED_TLAPP_TOTAL_AMOUNT2`} label={`${t(`PDF_STATIC_LABEL_CONSOLIDATED_TLAPP_TOTAL_AMOUNT`)}`} text={<span>&#8377;{Number(breakUpData?.charge) || 0}</span>} textStyle={{ textAlign: "right", fontWeight: "700", fontSize: "24px" }} />
                            {breakUpData?.billSlabData?.TAX?.map(data => <Row className="border-none" rowContainerStyle={{ margin: "0px" }} labelStyle={{ width: "50%" }} key={`${data?.taxHeadCode}`} label={`${t(`${data?.taxHeadCode}`)}`} text={<span>&#8377;{Number(data?.amount) || 0}</span>} textStyle={{ textAlign: "right" }} />)}
                            <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", marginBottom: "10px" }} />
                            <Row className="border-none" rowContainerStyle={{ margin: "0px" }} labelStyle={{ width: "50%" }} key={`PDF_STATIC_LABEL_CONSOLIDATED_TLAPP_TOTAL_AMOUNT3`} label={`${t(`PDF_STATIC_LABEL_CONSOLIDATED_TLAPP_TOTAL_AMOUNT`)}`} text={<span>&#8377;{Number(breakUpData?.totalAmount) || 0}</span>} textStyle={{ textAlign: "right", fontWeight: "700", fontSize: "24px" }} />
                        </StatusTable>}
                    </Modal>}
            </div>
        </Fragment>
    )
}

export default ViewBreakup;