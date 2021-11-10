import { useTranslation } from "react-i18next";

const useInboxMobileCardsData = ({ parentRoute, table }) => {
    const { t } = useTranslation()

    const dataForMobileInboxCards = table?.map(({ applicationId, date, status, owner, sla }) => ({
        [t("BPA_APPLICATION_NUMBER_LABEL")]: applicationId,
        [t("CS_APPLICATION_DETAILS_APPLICATION_DATE")]: date,
        [t("EVENTS_STATUS_LABEL")]: status,
        [t("WF_INBOX_HEADER_CURRENT_OWNER")]: owner,
        [t("ES_INBOX_SLA_DAYS_REMAINING")]: sla
    }))

    return ({ data: dataForMobileInboxCards, linkPrefix: `${parentRoute}/stakeholder-inbox/stakeholder/`, serviceRequestIdKey: t("BPA_APPLICATION_NUMBER_LABEL") })

}

export default useInboxMobileCardsData