import React from "react"
import useInbox from "../useInbox"
import { InboxGeneral } from "../../services/elements/InboxService";
import { Search } from "../../services/molecules/OBPS/Search";
import { useQuery } from "react-query"

const useBPAInbox = ({ tenantId, filters, config={} }) => {
    const { filterForm, searchForm , tableForm } = filters
    const { moduleName, businessService, applicationStatus, locality, assignee } = filterForm
    const { mobileNumber, applicationNumber } = searchForm
    const { sortBy, limit, offset, sortOrder } = tableForm
    // const USER_UUID = Digit.UserService.getUser()?.info?.uuid;
    
    const _filters = {
        tenantId,
		processSearchCriteria: {
            moduleName: moduleName ? moduleName : "bpa-services",
			businessService: businessService?.length > 0 ? businessService.map( o => o.code) : ["BPA_LOW", "BPA", "BPA_OC"],
            ...(applicationStatus?.length > 0 ? {status: applicationStatus} : {}),
        },
		moduleSearchCriteria: {
            assignee,
            ...(mobileNumber ? {mobileNumber}: {}),
            ...(applicationNumber ? {applicationNumber} : {}),
            ...(sortOrder ? {sortOrder} : {}),
            ...(locality?.length > 0 ? {locality: locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
        },
        sortBy,
        limit,
        offset,
        sortOrder
    }

    return useQuery(
      ["INBOX_DATA",tenantId, ...Object.keys(_filters)?.map( e => filters?.[e] )],
      async () => {
        const data = await InboxGeneral.Search({inbox: {..._filters}});
        const promises = data?.items?.map(application => {
          const filters = { edcrNumber: application?.businessObject?.edcrNumber }
          return Search.scrutinyDetails('pb.amritsar', filters);
        });
        const edcrData = await Promise.all(promises);
        data.items = data?.items?.map(application => ({
          ...application,
          edcr: {
            ...edcrData?.find(edcr => edcr?.edcrNumber === application?.businessObject?.edcrNumber) || {}
          }
            
        }));
        return data;
      },
      {
        select: (data) =>({
          statuses: data.statusMap,
          table: data?.items.map( application => ({
              applicationId: application.businessObject.applicationNo,
              date: application.businessObject.applicationDate,
              businessService: application?.ProcessInstance?.businessService,
              locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.landInfo?.address?.locality?.code?.toUpperCase()}`,
              status: application.businessObject.status,
              owner: application.ProcessInstance?.assigner?.name,
              edcr: application?.edcr,
              sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
          })),
          totalCount: data.totalCount
        }), 
        ...config 
      }
    )
}

export default useBPAInbox
