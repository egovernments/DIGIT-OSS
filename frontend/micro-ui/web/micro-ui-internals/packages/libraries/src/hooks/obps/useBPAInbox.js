import useInbox from "../useInbox"

const useBPAInbox = ({ tenantId, filters, config={} }) => {
    const { filterForm, searchForm , tableForm } = filters;
    const { moduleName, businessService, applicationStatus, locality, assignee } = filterForm;
    const { mobileNumber, applicationNo } = searchForm;
    const { sortBy, limit, offset, sortOrder } = tableForm;
    let applicationNumber = "";
    if (businessService?.code == "BPAREG" || window.location.href.includes("stakeholder-inbox")) {
      applicationNumber = applicationNo;
      tenantId = Digit.ULBService.getStateId();
    }
    const _filters = {
        tenantId,
        processSearchCriteria: {
          moduleName: !window.location.href.includes("stakeholder-inbox") ? "bpa-services" : "BPAREG", 
          businessService: !window.location.href.includes("stakeholder-inbox") ? ["BPA_LOW", "BPA", "BPA_OC"] :  ["ARCHITECT","BUILDER","ENGINEER","STRUCTURALENGINEER"],
          ...(applicationStatus?.length > 0 ? {status: applicationStatus} : {}),
        },
        moduleSearchCriteria: {
          assignee,
          ...(mobileNumber ? {mobileNumber}: {}),
          ...(applicationNo ? {applicationNo} : {}),
          ...(applicationNumber ? {applicationNumber} : {}),
          ...(sortOrder ? {sortOrder} : {}),
          ...(sortBy ? {sortBy} : {}),
          ...(locality?.length > 0 ? {locality: locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
        },
        limit,
        offset,
    }

    return useInbox({tenantId, filters: _filters, config:{
        select: (data) =>({
          statuses: window.location.href.includes("stakeholder-inbox") ? data.statusMap.map(e => ({...e, applicationstatus: `WF_${businessService}_${e.applicationstatus}`})) : data.statusMap.map(e => ({...e, applicationstatus: `WF_${businessService?.code}_${e.applicationstatus}`})),
          table: data?.items.map( application => ({
              applicationId: application.businessObject.applicationNo || application.businessObject.applicationNumber,
              date: application.businessObject.applicationDate,
              businessService: application?.ProcessInstance?.businessService,
              applicationType: application?.businessObject?.additionalDetails?.applicationType ? `WF_BPA_${application?.businessObject?.additionalDetails?.applicationType}` : "-",
              locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.landInfo?.address?.locality?.code?.toUpperCase()}`,
              status: application.businessObject.status,
              owner: application.ProcessInstance?.assigner?.name,
              sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
          })),
          totalCount: data.totalCount
        }), 
        ...config 
      }
    })
}

export default useBPAInbox
