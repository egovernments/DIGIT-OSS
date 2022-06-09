import React from "react";
import { useTranslation } from "react-i18next";
import { SearchField, RadioButtons } from "@egovernments/digit-ui-react-components";
import { Controller, useFormContext } from "react-hook-form";
import { format } from "date-fns";


const useInboxMobileCardsData = ({parentRoute, table }) => {
    const { t } = useTranslation();

    const dataForMobileInboxCards = table?.map(({ applicationId, date, source, locality, status, owner, sla, businessService}) => ({
            [t("NOC_APP_NO_LABEL")]: applicationId,
            [t("TL_COMMON_TABLE_COL_APP_DATE")]:  format(new Date(date), 'dd/MM/yyyy'),
            [t("NOC_MODULE_SOURCE_LABEL")]: t(`MODULE_${source}`),
            // [t("ES_INBOX_LOCALITY")]: locality,
            [t("NOC_STATUS_LABEL")]: t(status),
            [t("WF_INBOX_HEADER_CURRENT_OWNER")]: owner,
            [t("ES_INBOX_SLA_DAYS_REMAINING")]: t(sla)
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


    return ({ data:dataForMobileInboxCards, linkPrefix:`${parentRoute}/inbox/application-overview/`, serviceRequestIdKey:t("NOC_APP_NO_LABEL"), MobileSortFormValues})

}

export default useInboxMobileCardsData