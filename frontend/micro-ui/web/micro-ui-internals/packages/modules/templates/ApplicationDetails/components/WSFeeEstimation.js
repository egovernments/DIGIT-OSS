import { StatusTable, Row } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

const WSFeeEstimation = ({ wsAdditionalDetails }) => {
    const { t } = useTranslation();
    const isPaid = (wsAdditionalDetails?.additionalDetails?.appDetails?.applicationStatus === 'CONNECTION_ACTIVATED' || wsAdditionalDetails?.additionalDetails?.appDetails?.applicationStatus === 'PENDING_FOR_CONNECTION_ACTIVATION') ? true : false;

    return (
        <Fragment>
            <div style={{ lineHeight: "19px", maxWidth: "950px", minWidth: "280px" }}>
                {wsAdditionalDetails?.additionalDetails?.values &&
                    <StatusTable>
                        <div>
                            {wsAdditionalDetails?.additionalDetails?.values?.map((value, index) => {
                                return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.value ? value?.value : ""} />
                            })}
                        </div>
                        <hr style={{ border: "1px solid #D6D5D4", color: "#D6D5D4", margin: "16px 0px" }}></hr>
                        <div>
                            <Row className="border-none" key={`WS_COMMON_TOTAL_AMT`} label={`${t(`WS_COMMON_TOTAL_AMT`)}`} text={wsAdditionalDetails?.additionalDetails?.data?.totalAmount} />
                            <Row className="border-none" key={`CS_INBOX_STATUS_FILTER`} label={`${t(`CS_INBOX_STATUS_FILTER`)}`} text={isPaid ? t("WS_COMMON_PAID") : t("WS_COMMON_NOT_PAID")} textStyle={!isPaid ? { color: "#D4351C" }: {color : "#00703C"}} />
                        </div>
                    </StatusTable>}
            </div>
        </Fragment>
    )
}

export default WSFeeEstimation;