import useInbox from "../useInbox"

const useNOCInbox = ({ tenantId, filters, config={} }) => {
    const { filterForm, searchForm , tableForm } = filters
    const { moduleName, businessService, applicationStatus, locality, assignee, businessServiceArray } = filterForm
    const { sourceRefId, applicationNo } = searchForm
    const { sortBy, limit, offset, sortOrder } = tableForm
    
    const _filters = {
        tenantId,
        processSearchCriteria: {
          moduleName: "noc-services", 
          businessService: businessService?.code ? [businessService?.code] : businessServiceArray ,
          ...(applicationStatus?.length > 0 ? {status: applicationStatus} : {}),
        },
        moduleSearchCriteria: {
          assignee,
          ...(sourceRefId ? {sourceRefId}: {}),
          ...(applicationNo ? {applicationNo} : {}),
          ...(sortOrder ? {sortOrder} : {}),
          ...(locality?.length > 0 ? {locality: locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
        },
        sortBy,
        limit,
        offset,
        sortOrder
    }

    return useInbox({tenantId, filters: _filters, config:{
        select: (data) =>({
          statuses: data.statusMap,
          table: data?.items.map( application => ({
              applicationId: application.businessObject.applicationNo,
              date: parseInt(application.businessObject?.auditDetails?.createdTime),
              businessService: application?.ProcessInstance?.businessService,
              locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}`,
              status: `WF_${application.businessObject.additionalDetails.workflowCode}_${application.businessObject.applicationStatus}`,//application.businessObject.applicationStatus,
              owner: application.ProcessInstance?.assigner?.name,
              source: application.businessObject.source,
              sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
          })),
          totalCount: data.totalCount
        }), 
        ...config 
      }
    })
}

export default useNOCInbox
