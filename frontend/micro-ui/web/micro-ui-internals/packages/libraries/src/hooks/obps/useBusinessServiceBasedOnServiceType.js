const useBusinessServiceBasedOnServiceType = ({applicationType}) => {
    const configData = {
        BUILDING_PLAN_SCRUTINY: [{code: "BPA_LOW",i18nKey: "WF_BPA_LOW_LABEL"}, {code: "BPA",i18nKey: "WF_BPA_LABEL"}],
        BUILDING_OC_PLAN_SCRUTINY: [{code: "BPA_OC_LOW", i18nKey: "WF_BPA_LOW_LABEL"}, {code: "BPA_OC", i18nKey: "WF_BPA_LABEL"}],
    }

    const selectedBusinessServicesObjectin2dArray = configData[applicationType]
    // const selectedBusinessServicesObjectin2dArray = applicationType?.map(type => configData[type.code])
    
    // const selectedBusinessServices = selectedBusinessServicesObjectin2dArray?.length > 0 ? selectedBusinessServicesObjectin2dArray?.reduce((acc, curr) => [...acc, ...curr] , []) : null

    return selectedBusinessServicesObjectin2dArray
}

export default useBusinessServiceBasedOnServiceType