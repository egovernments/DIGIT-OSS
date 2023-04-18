import useInbox from "../useInbox"

const useTOLInbox = ({ tenantId, filters, config }) => {

    const {applicationStatus, mobileNumber, applicationNumber, sortBy, sortOrder, locality, uuid, limit, offset } = filters
    const USER_UUID = Digit.UserService.getUser()?.info?.uuid;
    
    const _filters = {
        tenantId,
		processSearchCriteria: {
            moduleName: "tl-services",
			businessService: ["TRANSFER_OF_LICIENCE"],
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

    return useInbox({tenantId, filters: _filters, config:{
        select: (data) =>({
            statuses: data.statusMap,
            table: data?.items.map( application => ({
                applicationId: application.businessObject.applicationNumber,
                date: application.businessObject.auditDetails.createdTime,
                businessService: application.businessObject.businessService,
                locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.tradeLicenseDetail?.address?.locality?.code?.toUpperCase()}`,
                status: application.businessObject.status,
                owner: application.ProcessInstance?.assigner?.name,
                dairyNo: application?.businessObject?.tcpDairyNumber,
                sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
            })),
            totalCount: data.totalCount
        }),
        ...config
    }})
}

export default useTOLInbox