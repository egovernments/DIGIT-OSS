import React, { useEffect, useMemo } from "react";
import SearchMdmsTypes from "./SearchMdmsTypes"

const useServiceTypeFromApplicationType = ({Applicationtype, tenantId}) => {
    const {data: applicationTypes } = SearchMdmsTypes.useApplicationTypes(tenantId);
    const {data: serviceTypes, isLoading: isLoadingServiceTypes } = SearchMdmsTypes.useBPAServiceTypes(tenantId);
    const {data: BPAREGserviceTypes, isLoading: isLoadingBPAREGServiceTypes } = SearchMdmsTypes.useBPAREGServiceTypes(tenantId);
    const userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
    const userInfo = userInfos ? JSON.parse(userInfos) : {};
    const userInformation = userInfo?.value?.info;

    const uniqueBPAREGserviceTypes = useMemo(() => {
        const tradeTypes = BPAREGserviceTypes?.map((ob) => ob?.code)
        return BPAREGserviceTypes?.filter(({code}, index) => !tradeTypes.includes(code, index + 1))
    },[BPAREGserviceTypes,isLoadingBPAREGServiceTypes])

    const ServiceTypes = useMemo(() => {
        const serviceTypesWithStakeholer = [...serviceTypes ? serviceTypes : []/* , {
            applicationType:["BPA_STAKEHOLDER_REGISTRATION"],
            code: "BPA_STAKEHOLDER_REGISTRATION",
            i18nKey: "BPA_SERVICETYPE_BPA_STAKEHOLDER_REGISTRATION",
        } */]
        if(Applicationtype === "BPA_STAKEHOLDER_REGISTRATION" && uniqueBPAREGserviceTypes && userInformation?.roles?.filter((ob) => ob.code.includes("BPAREG_"))?.length > 0 && userInformation?.roles?.filter((ob) =>(ob.code.includes("BPA_"))).length <= 0)
        return [...uniqueBPAREGserviceTypes]
        else
        return serviceTypesWithStakeholer?.filter((e) => e.applicationType.includes(Applicationtype)).map(e => ({ code:e.code, i18nKey:e.i18nKey }))
    }
    ,[serviceTypes, isLoadingServiceTypes, uniqueBPAREGserviceTypes, Applicationtype])
    const applicationTypesWithStakeholder = [...applicationTypes ? applicationTypes : [],{
        code: "BPA_STAKEHOLDER_REGISTRATION",
        i18nKey: "WF_BPA_BPA_STAKEHOLDER_REGISTRATION",
    }]

    const filteredapplicationTypes = useMemo(() => {
        return applicationTypesWithStakeholder.filter(function (curr){
        let temp = 0;
        serviceTypes?.map((ob) => {
           const found = ob && ob?.applicationType && ob?.applicationType.some((ap) => ap === curr.code)
            if(found) temp = 1
        })
        if(temp == 1)return true;
        else return false;
    })
    },[serviceTypes,applicationTypesWithStakeholder])

    return { applicationTypes: filteredapplicationTypes, ServiceTypes }
}

export default useServiceTypeFromApplicationType