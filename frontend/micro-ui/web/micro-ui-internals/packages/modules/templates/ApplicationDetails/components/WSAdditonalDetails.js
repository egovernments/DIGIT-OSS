import { StatusTable, Row, CardSubHeader } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

const cardSubHeaderStyles = () => {
    return { fontSize: "24px", padding: "0px", margin: "0px", color: "#505A5F" }
}

const cardDivStyles = () => {
    return { border: "1px solid #D6D5D4", background: "#FAFAFA", borderRadius: "4px", padding: "10px 10px 0px 10px", marginBottom: "10px" }
}

const WSAdditonalDetails = ({ wsAdditionalDetails }) => {
    const { t } = useTranslation();
    return (
        <Fragment>
            <div style={{ lineHeight: "19px", maxWidth: "950px", minWidth: "280px" }}>
                {wsAdditionalDetails?.additionalDetails?.connectionDetails &&
                    <StatusTable>
                        <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_COMMON_CONNECTION_DETAIL")}</CardSubHeader>
                        <div style={cardDivStyles()}>
                            {wsAdditionalDetails?.additionalDetails?.connectionDetails?.map((value, index) => {
                                return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.value ? value?.value : ""} />
                            })}
                        </div>

                    </StatusTable>}
                {wsAdditionalDetails?.additionalDetails?.plumberDetails &&
                    <StatusTable>
                        <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_COMMON_PLUMBER_DETAILS")}</CardSubHeader>
                        <div style={cardDivStyles()}>
                            {wsAdditionalDetails?.additionalDetails?.plumberDetails?.map((value, index) => {
                                return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.value ? value?.value : ""} />
                            })}
                        </div>
                    </StatusTable>}
                {wsAdditionalDetails?.additionalDetails?.roadCuttingDetails &&
                    <StatusTable>
                        <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_ROAD_CUTTING_DETAILS")}</CardSubHeader>
                        <div style={cardDivStyles()}>
                            {wsAdditionalDetails?.additionalDetails?.roadCuttingDetails?.map((value) => {
                                return <div style={wsAdditionalDetails?.additionalDetails?.roadCuttingDetails?.length > 1 ? { border: "1px solid #D6D5D4", background: "#FAFAFA", borderRadius: "4px", padding: "10px 10px 0px 10px", margin: "5px 0px" } : {}}>
                                    {value?.values?.map(roadValue => <Row className="border-none" key={`${roadValue.title}`} label={`${t(`${roadValue.title}`)}`} text={roadValue?.value ? roadValue?.value : ""} />)}
                                </div>
                            })}
                        </div>
                    </StatusTable>
                }
                {wsAdditionalDetails?.additionalDetails?.activationDetails &&
                    <StatusTable>
                        <CardSubHeader style={cardSubHeaderStyles()}>{t("WS_ACTIVATION_DETAILS")}</CardSubHeader>
                        <div style={cardDivStyles()}>
                            {wsAdditionalDetails?.additionalDetails?.activationDetails?.map((value, index) => {
                                return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.value ? value?.value : ""} />
                            })}
                        </div>

                    </StatusTable>}
            </div>
        </Fragment>
    )
}

export default WSAdditonalDetails;