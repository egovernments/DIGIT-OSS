import React, { useEffect, useMemo } from "react";
import SearchMdmsTypes from "./SearchMdmsTypes"

const useServiceTypeFromApplicationType = ({Applicationtype, tenantId}) => {

    const {data: applicationTypes } = SearchMdmsTypes.useApplicationTypes(tenantId)
    const {data: serviceTypes, isLoading: isLoadingServiceTypes } = SearchMdmsTypes.useServiceTypes(tenantId)
    const ServiceTypes = useMemo(() => {
        const serviceTypesWithStakeholer = [...serviceTypes ? serviceTypes : [], {
            applicationType:["BPA_STAKEHOLDER_REGISTRATION"],
            code: "BPA_STAKEHOLDER_REGISTRATION",
            i18nKey: "BPA_SERVICETYPE_BPA_STAKEHOLDER_REGISTRATION",
        }]
        return serviceTypesWithStakeholer?.filter((e) => e.applicationType.includes(Applicationtype)).map(e => ({ code:e.code, i18nKey:e.i18nKey }))
    }
    ,[serviceTypes, isLoadingServiceTypes, Applicationtype])
    const applicationTypesWithStakeholder = [...applicationTypes ? applicationTypes : [],{
        code: "BPA_STAKEHOLDER_REGISTRATION",
        i18nKey: "WF_BPA_BPA_STAKEHOLDER_REGISTRATION",
    }]
    return { applicationTypes: applicationTypesWithStakeholder, ServiceTypes }
}

export default useServiceTypeFromApplicationType