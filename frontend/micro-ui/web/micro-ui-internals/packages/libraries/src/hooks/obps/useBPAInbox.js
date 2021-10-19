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
    // debugger
    const _filters = {
        tenantId,
        processSearchCriteria: {
          moduleName: businessService?.code === "BPA"? "bpa-services" : "BPAREG", 
          businessService: businessService?.code === "BPA" ? ["BPA_LOW", "BPA", "BPA_OC"] :  ["ARCHITECT","BUILDER","ENGINEER","STRUCTURALENGINEER"],
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

    return useInbox({tenantId, filters: _filters, config:{
        select: (data) =>({
          statuses: data.statusMap,
          table: data?.items.map( application => ({
              applicationId: application.businessObject.applicationNumber,
              date: application.businessObject.applicationDate,
              businessService: application?.ProcessInstance?.businessService,
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
