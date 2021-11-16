import React, { useEffect, useMemo } from "react";
import SearchMdmsTypes from "./SearchMdmsTypes"

const useServiceTypeFromApplicationType = ({Applicationtype, tenantId}) => {

    const {data: applicationTypes } = SearchMdmsTypes.useApplicationTypes(tenantId)
    const {data: serviceTypes, isLoading: isLoadingServiceTypes } = SearchMdmsTypes.useServiceTypes(tenantId)
    const ServiceTypes = useMemo(() => 
        serviceTypes?.filter((e) => e.applicationType.includes(Applicationtype)).map(e => ({ code:e.code, i18nKey:e.i18nKey }))
    ,[serviceTypes, isLoadingServiceTypes, Applicationtype])

    return { applicationTypes, ServiceTypes }
}

export default useServiceTypeFromApplicationType