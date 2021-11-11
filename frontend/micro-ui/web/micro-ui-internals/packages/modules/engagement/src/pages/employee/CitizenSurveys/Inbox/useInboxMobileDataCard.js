import { useTranslation } from "react-i18next";

const useInboxMobileCardsData = ({parentRoute, table }) => {
    const { t } = useTranslation()

    /**
     * Todo : after creating surveys details page handle serviceRequestIdKey
     */
    console.log('<><>', table)
    const dataForMobileInboxCards = table?.map(({ title, startDate, endDate, answersCount, status, postedBy}) => ({
            [t("CS_SURVEY_TITLE")]: title,
            [t("EVENTS_START_DATE_LABEL")]: startDate,
            [t("EVENTS_END_DATE_LABEL")]: endDate,
            [t("CS_RESPONSE_COUNT")]: answersCount,
            [t("EVENTS_STATUS_LABEL")]: status,
            [t("EVENTS_POSTEDBY_LABEL")]: postedBy,
    }))

    return ({ data:dataForMobileInboxCards, linkPrefix:`${parentRoute}/inbox/`, serviceRequestIdKey:t("TL_COMMON_TABLE_COL_APP_NO")})

}

export default useInboxMobileCardsData