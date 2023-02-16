import React from "react"
import useInbox from "../useInbox"
import { InboxGeneral } from "../../services/elements/InboxService";
import { Search } from "../../services/molecules/OBPS/Search";
import { useQuery } from "react-query";

const useArchitectInbox = ({ tenantId, filters, withEDCRData = true, isTotalCount = false, config={} }) => {
  if (!isTotalCount) {
    const { filterForm = {}, searchForm = {}, tableForm = {}} = filters
    const { moduleName, businessService, applicationStatus, locality, assignee } = filterForm
    const { mobileNumber, applicationNo, applicationType, serviceType } = searchForm
    const { sortBy, limit, offset, sortOrder } = tableForm
    // const USER_UUID = Digit.UserService.getUser()?.info?.uuid;
    
    const _filters = {
        tenantId,
		processSearchCriteria: {
            moduleName: moduleName ? moduleName : "bpa-services",
			businessService: businessService?.length > 0 ? [businessService] : ["BPA_LOW", "BPA", "BPA_OC"],
            ...(applicationStatus?.length > 0 ? {status: applicationStatus} : {}),
        },
		moduleSearchCriteria: {
            assignee,
            ...(mobileNumber ? {mobileNumber}: {}),
            ...(applicationType && applicationType.length > 0 ? { applicationType } : {}),
            ...(serviceType ? { serviceType } : {}),
            ...(applicationNo ? {applicationNo} : {}),
            ...(sortOrder ? {sortOrder} : {}),
            ...(locality?.length > 0 ? {locality: locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
        }
    }

    return useQuery(
      ["INBOX_DATA",tenantId, ...Object.keys(_filters)?.map( e => _filters?.[e] )],
      async () => {
        const data = await InboxGeneral.Search({inbox: {..._filters}});
        if (withEDCRData === true) {
          const promises = data?.items?.map(application => {
            const filters = { edcrNumber: application?.businessObject?.edcrNumber }
            return Search.scrutinyDetails('pb.amritsar', filters);
          });
          try{
          const edcrData = await Promise.all(promises);
          data.items = data?.items?.map(application => ({
            ...application,
            edcr: {
              ...edcrData?.find(edcr => edcr?.edcrNumber === application?.businessObject?.edcrNumber) || {}
            }
            
          }));
        }
        catch(error){
        }
        }
        return data;
      },
      {
        select: (data) =>({
          statuses: data.statusMap,
          table: data?.items.map( application => ({
              applicationId: application.businessObject.applicationNo,
              date: application.businessObject.applicationDate,
              businessService: application?.ProcessInstance?.businessService,
              applicationType:application?.businessObject?.additionalDetails?.applicationType,
              serviceType:application?.businessObject?.additionalDetails?.serviceType,
              locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.landInfo?.address?.locality?.code?.toUpperCase()}`,
              status: application?.ProcessInstance?.state?.state,
              state:  application?.ProcessInstance?.state?.state,
              owner: application.ProcessInstance?.assigner?.name,
              applicantName: application?.businessObject?.landInfo?.owners?.length == 1 ? application?.businessObject?.landInfo?.owners?.[0]?.name : application?.businessObject?.landInfo?.owners?.filter(owner => owner.isPrimaryOwner)?.[0]?.name,
              edcr: application?.edcr,
              sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
          })),
          totalCount: data.totalCount,
          nearingSlaCount: data?.nearingSlaCount
        }), 
        ...config 
      }
    )
  } else {
    const { mobileNumber, limit, offset, moduleName, businessService } = filters;
    const _filters = {
      tenantId,
      processSearchCriteria: {
        moduleName: moduleName ? moduleName : "bpa-services",
        businessService: businessService?.length > 0 ? businessService : ["BPA_LOW", "BPA", "BPA_OC"],
      },
      moduleSearchCriteria: {
        ...(mobileNumber ? { mobileNumber } : {}),
      },
      limit,
      offset
    }
    return useQuery(
      ["INBOX_DATA", tenantId, ...Object.keys(_filters)?.map(e => _filters?.[e])],
      async () => {
        const data = await InboxGeneral.Search({ inbox: { ..._filters } });
        return data;
      },
      {
        select: (data) => ({
          totalCount: data.totalCount
        }),
        ...config
      }
    )
  }
}

export default useArchitectInbox;
