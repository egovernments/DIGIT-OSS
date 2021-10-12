import React from "react"
import useInbox from "../useInbox"
import { InboxGeneral } from "../../services/elements/InboxService";
import { Search } from "../../services/molecules/OBPS/Search";
import { useQuery } from "react-query"

const useBPAInbox = ({ tenantId, moduleName, businessService, filters, config }) => {

    const {applicationStatus, mobileNumber, applicationNumber, sortBy, sortOrder, locality, uuid, limit, offset } = filters
    const USER_UUID = Digit.UserService.getUser()?.info?.uuid;
    
    const _filters = {
        tenantId,
		processSearchCriteria: {
            moduleName: moduleName ? moduleName : "bpa-services",
			businessService: businessService ? businessService : ["BPA_LOW", "BPA", "BPA_OC"],
            ...(applicationStatus?.length > 0 ? {status: applicationStatus} : {}),
            ...(uuid && Object.keys(uuid).length > 0 ? {assignee: uuid.code === "ASSIGNED_TO_ME" ? USER_UUID : ""} : {}),
        },
		moduleSearchCriteria: {
            ...(mobileNumber ? {mobileNumber}: {}),
            ...(applicationNumber ? {applicationNumber} : {}),
            ...(sortBy ? {sortBy} : {}),
            ...(sortOrder ? {sortOrder} : {}),
            ...(locality?.length > 0 ? {locality: locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
        },
        limit,
        offset
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
        console.log(data, 'edcrData');
        return data;
      },
      {
        select: (data) =>({
          statuses: data.statusMap,
          table: data?.items.map( application => ({
              applicationId: application.businessObject.applicationNo,
              date: application.businessObject.applicationDate,
              businessService: application?.ProcessInstance?.businessService,
              locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.tradeLicenseDetail?.address?.locality?.code?.toUpperCase()}`,
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

    // return useInbox({tenantId, filters: _filters, config:{
    //     select: (data) =>({
    //         statuses: data.statusMap,
    //         table: data?.items.map( application => ({
    //             applicationId: application.businessObject.applicationNumber,
    //             date: application.businessObject.applicationDate,
    //             businessService: application?.ProcessInstance?.businessService,
    //             locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.tradeLicenseDetail?.address?.locality?.code?.toUpperCase()}`,
    //             status: application.businessObject.status,
    //             owner: application.ProcessInstance?.assigner?.name,
    //             sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
    //         })),
    //         totalCount: data.totalCount
    //     }),
    //     queryFn: (contextData) => {
    //       debugger
    //       console.log(contextData, 'context');
    //       return InboxGeneral.Search({inbox: {..._filters}});
    //     },
    //     ...config
    // }})
}

export default useBPAInbox
