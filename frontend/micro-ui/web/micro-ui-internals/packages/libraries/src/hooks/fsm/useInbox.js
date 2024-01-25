import React from "react"
import useInbox from "../useInbox"

const useFSMInbox = (tenantId, filters, config = {}, overRideUUID = false) => {

  const { applicationNos, mobileNumber, limit, offset, sortBy, sortOrder } = filters;
  const _filters = {
    tenantId,
    processSearchCriteria: {
      businessService: ["FSM", "FSM_POST_PAY_SERVICE","PAY_LATER_SERVICE", "FSM_ADVANCE_PAY_SERVICE", "FSM_ZERO_PAY_SERVICE"],
      ...(filters?.applicationStatus?.length > 0 ? { status: getIds(filters.applicationStatus) } : {}),
      moduleName: "fsm",
    },
    moduleSearchCriteria: {
      ...(mobileNumber ? { mobileNumber } : {}),
      ...(applicationNos ? { applicationNos } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      ...(filters?.locality?.length > 0 ? { locality: filters.locality.map((item) => item.code.split("_").pop()) } : {}),
    },
    limit,
    offset,
  }
  const appList = useInbox({
    tenantId, filters: _filters, config: {
      select: (data) => ({
        totalCount: data.totalCount,
        nearingSlaCount: data.nearingSlaCount,
        statuses: data.statusMap,
        table: tableData(data)
      }),
      ...config
    }
  })
  if (filters?.uuid?.code === "ASSIGNED_TO_ME" && !overRideUUID) {
    return {
      data: {
        totalCount: 0,
        statuses: [],
        table: []
      },
      isLoading: false
    }
  }
  return { ...appList }
}

const getIds = (status) => {
  let ids = []
  status?.map((data) => {
    let temp = data.id.split(',')
    ids.push(...temp)
  })
  return ids
}

const tableData = (data) => {
  let result = [];
  if (data && data.items && data.items.length) {
    data.items.map((application) => {
      result.push({
        tenantId: application?.businessObject?.tenantId || '',
        totalCount: application?.businessObject?.totalCount || '',
        applicationNo: application?.businessObject?.applicationNo || '',
        createdTime: application?.businessObject?.auditDetails?.createdTime
          ? new Date(application.businessObject.auditDetails.createdTime)
          : new Date(),
        locality: application?.businessObject?.address?.locality?.code || '',
        status: application?.businessObject?.applicationStatus || '',
        citizen: {
          name: application?.ProcessInstance?.assigner?.name || '',
          mobileNumber: application?.ProcessInstance?.assigner?.mobileNumber || ''
        },
        propertyUsage: application?.businessObject?.propertyUsage || '',
        sla:
          Math.round(
            application?.ProcessInstance?.businesssServiceSla /
            (24 * 60 * 60 * 1000)
          ) || "-",
        mathsla: application?.ProcessInstance?.businesssServiceSla || ''
      });
    });
  }
  return result;
};

export default useFSMInbox