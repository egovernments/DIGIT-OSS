import { useTranslation } from "react-i18next";

const useInboxMobileCardsData = ({parentRoute, table }) => {
    const { t } = useTranslation();

    const dataForMobileInboxCards = table?.map(({ applicationId, date, source, locality, status, owner, sla, businessService}) => ({
            [t("NOC_APP_NO_LABEL")]: applicationId,
            [t("TL_COMMON_TABLE_COL_APP_DATE")]: date,
            [t("NOC_MODULE_SOURCE_LABEL")]: t(source),
            // [t("ES_INBOX_LOCALITY")]: locality,
            [t("NOC_STATUS_LABEL")]: t(status),
            [t("WF_INBOX_HEADER_CURRENT_OWNER")]: owner,
            [t("ES_INBOX_SLA_DAYS_REMAINING")]: sla
    }))

    return ({ data:dataForMobileInboxCards, linkPrefix:`${parentRoute}/inbox/application-overview/`, serviceRequestIdKey:t("NOC_APP_NO_LABEL")})

}

export default useInboxMobileCardsData