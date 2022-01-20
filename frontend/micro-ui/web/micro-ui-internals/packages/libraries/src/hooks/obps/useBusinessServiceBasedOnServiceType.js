const useBusinessServiceBasedOnServiceType = ({applicationType}) => {
    const configData = {
        BUILDING_PLAN_SCRUTINY: [{code: "BPA_LOW",i18nKey: "WF_BPA_LOW"}, {code: "BPA",i18nKey: "WF_BPA"}],
        BUILDING_OC_PLAN_SCRUTINY: [{code: "BPA_OC", i18nKey: "WF_BPA_OC"}],
    }

    const selectedBusinessServicesObjectin2dArray = applicationType?.map(type => configData[type.code])
    
    const selectedBusinessServices = selectedBusinessServicesObjectin2dArray?.length > 0 ? selectedBusinessServicesObjectin2dArray?.reduce((acc, curr) => [...acc, ...curr] , []) : null

    return selectedBusinessServices
}

export default useBusinessServiceBasedOnServiceType