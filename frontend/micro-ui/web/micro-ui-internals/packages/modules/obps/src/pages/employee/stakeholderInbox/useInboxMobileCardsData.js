import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { SearchField, RadioButtons } from "@egovernments/digit-ui-react-components";
import { Controller, useFormContext } from "react-hook-form";

const useInboxMobileCardsData = ({ parentRoute, table }) => {
    const { t } = useTranslation()

    const dataForMobileInboxCards = table?.map(({ applicationId, date,businessService, status, owner, sla }) => ({
        [t("BPA_APPLICATION_NUMBER_LABEL")]: applicationId,
        [t("CS_APPLICATION_DETAILS_APPLICATION_DATE")]: format(new Date(date), 'dd/MM/yyyy'),
        [t("EVENTS_STATUS_LABEL")]: t(`WF_${businessService}_${status}`),
        [t("WF_INBOX_HEADER_CURRENT_OWNER")]: owner,
        [t("ES_INBOX_SLA_DAYS_REMAINING")]: sla
    }))

    const MobileSortFormValues = () => {
        const sortOrderOptions = [{
            code: "DESC",
            i18nKey: "ES_COMMON_SORT_BY_DESC"
        },{
            code: "ASC",
            i18nKey: "ES_COMMON_SORT_BY_ASC"
        }]
        const { control: controlSortForm  } = useFormContext()
        return <SearchField>
            <Controller
                name="sortOrder"
                control={controlSortForm}
                render={({onChange, value}) => <RadioButtons
                    onSelect={(e) => {
                        onChange(e.code)
                    }}
                    selectedOption={sortOrderOptions.filter((option) => option.code === value)[0]}
                    optionsKey="i18nKey"
                    name="sortOrder"
                    options={sortOrderOptions}
                />}
            />
        </SearchField>
    }

    return ({ data: dataForMobileInboxCards, linkPrefix: `${parentRoute}/stakeholder-inbox/stakeholder/`, serviceRequestIdKey: t("BPA_APPLICATION_NUMBER_LABEL"), MobileSortFormValues })

}

export default useInboxMobileCardsData