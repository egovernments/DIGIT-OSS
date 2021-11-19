import { useTranslation } from "react-i18next";

const useInboxMobileCardsData = ({parentRoute, table, getRedirectionLink }) => {
    const { t } = useTranslation()

    const dataForMobileInboxCards = table?.map(({ applicationId, date, applicationType, locality, status, owner, sla, state}) => ({
            [t("BPA_APPLICATION_NUMBER_LABEL")]: applicationId,
            [t("CS_APPLICATION_DETAILS_APPLICATION_DATE")]: date,
            [t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")]: t(applicationType),
            [t("ES_INBOX_LOCALITY")]: locality,
            [t("EVENTS_STATUS_LABEL")]: state ? state : status,
            [t("WF_INBOX_HEADER_CURRENT_OWNER")]: owner,
            [t("ES_INBOX_SLA_DAYS_REMAINING")]: sla
    }))

    return ({ data:dataForMobileInboxCards,isTwoDynamicPrefix:true, linkPrefix: `/digit-ui/employee/obps/`,getRedirectionLink:getRedirectionLink, serviceRequestIdKey: "applicationNo"})

}

export default useInboxMobileCardsData