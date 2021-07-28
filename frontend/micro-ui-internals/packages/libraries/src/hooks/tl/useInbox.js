import React from "react"
import useInbox from "../useInbox"

const useTLInbox = ({ tenantId, filters, config }) => {

    const {applicationStatus, mobileNumber, applicationNumber, sortBy, sortOrder, locality, uuid, limit, offset } = filters
    const _filters = {
        tenantId,
		processSearchCriteria: {
            moduleName: "tl-services",
			businessService: ["NewTL", "DIRECTRENEWAL","EDITRENEWAL"],
            ...(applicationStatus?.length > 0 ? {status: applicationStatus} : {})
        },
		moduleSearchCriteria: {
            ...(mobileNumber ? {mobileNumber}: {}),
            ...(applicationNumber ? {applicationNumber} : {}),
            ...(sortBy ? {sortBy} : {}),
            ...(sortOrder ? {sortOrder} : {}),
            ...(locality?.length > 0 ? {locality: locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
            ...(uuid && Object.keys(uuid).length > 0 ? {assignedToMe: uuid.code === "ASSIGNED_TO_ME" ? true : ""} : {}),
        },
        limit,
        offset
    }

    return useInbox({tenantId, filters: _filters, config:{
        select: (data) =>({
            statuses: data.statusMap,
            table: data?.items.map( application => ({
                applicationId: application.businessObject.applicationNumber,
                date: application.businessObject.applicationDate,
                businessService: application?.ProcessInstance?.businessService,
                locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.tradeLicenseDetail?.address?.locality?.code?.toUpperCase()}`,
                status: application.businessObject.status,
                owner: application.ProcessInstance?.assigner?.name,
                sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
            })),
            totalCount: data.totalCount
        }),
        ...config
    }})
}

export default useTLInbox