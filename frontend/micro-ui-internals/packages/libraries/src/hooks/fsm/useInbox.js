import React from "react"
import useInbox from "../useInbox"

const useFSMInbox = (tenantId, filters, config = {}, overRideUUID=false) => {

    const { applicationNos, mobileNumber, limit, offset, sortBy, sortOrder } = filters;
    const _filters = {
		tenantId,
		processSearchCriteria: {
			businessService: ["FSM"],
            ...(filters?.applicationStatus?.length > 0 ? {status: filters.applicationStatus.map((status) => status?.id)} : {}),
		},
		moduleSearchCriteria: {
            ...(mobileNumber ? {mobileNumber}: {}),
            ...(applicationNos ? {applicationNos} : {}),
            ...(sortBy ? {sortBy} : {}),
            ...(sortOrder ? {sortOrder} : {}),
            ...(filters?.locality?.length > 0 ? {locality: filters.locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
		},
		limit,
		offset,
	}
    const appList = useInbox({tenantId, filters: _filters, config:{
        select: (data) => ({
            totalCount: data.totalCount,
            statuses: data.statusMap,
            table: data?.items?.map( application => ({
                tenantId: application.businessObject.tenantId,
                totalCount: application.businessObject.totalCount,
                applicationNo: application.businessObject.applicationNo,
                createdTime: new Date(application.businessObject.auditDetails.createdTime),
                locality: application.businessObject.address.locality.code,
                status: application.businessObject.applicationStatus,
                citizen:{
                    name: application.ProcessInstance?.assigner?.name,
                    mobileNumber: application.ProcessInstance?.assigner?.mobileNumber
                },
                propertyUsage: application.businessObject.propertyUsage,
                sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000)) || "-",
                mathsla: application.ProcessInstance?.businesssServiceSla,
            }))
        }),
        ...config
    }})
    if(filters?.uuid?.code === "ASSIGNED_TO_ME" && !overRideUUID){
        return {
            data:{
                totalCount: 0,
                statuses: [],
                table: []
            },
            isLoading: false
        }
    }
    return { ...appList }
}

export default useFSMInbox