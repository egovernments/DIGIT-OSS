import useInbox from "../useInbox";
import { useEffect } from "react";

const useWSInbox = ({ tenantId, filters, config = {} }) => {
  const { filterForm, searchForm, tableForm } = filters;
  const user = Digit.UserService.getUser();
  let { mobileNumber, applicationNumber, consumerNo } = searchForm;
  let { sortBy, limit, offset, sortOrder } = tableForm;
  let { moduleName, businessService, applicationStatus, locality, assignee, businessServiceArray, applicationType } = filterForm;

  if (mobileNumber || applicationNumber || consumerNo) {
    offset = 0;
  }

  if (!window.location.href.includes("digit-ui/employee/")) {
    moduleName = moduleName;
  } else {
    if (window.location.href.includes("water/inbox")) moduleName = "ws-services";
    if (window.location.href.includes("sewerage/inbox")) moduleName = "sw-services";
  }

  if (moduleName === "ws-services") {
    if (applicationType && applicationType.length > 0) {
      businessService = applicationType;
    } else {
      businessService = ["NewWS1", "ModifyWSConnection"];
    }
  }
  if (window.location.href.includes("sewerage/inbox")) {
    if (applicationType && applicationType.length > 0) {
      businessService = applicationType;
    } else {
      businessService = ["NewSW1", "ModifySWConnection"];
    }
  }

  const _filters = {
    tenantId,
    processSearchCriteria: {
      assignee: assignee === "ASSIGNED_TO_ME" ? user?.info?.uuid : "",
      moduleName: moduleName,
      businessService: businessService,
      ...(applicationStatus?.length > 0 ? { status: applicationStatus } : {}),
    },

    moduleSearchCriteria: {
      ...(mobileNumber ? { mobileNumber } : {}),
      ...(applicationNumber ? { applicationNumber } : {}),
      ...(consumerNo ? { consumerNo } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      sortBy: "createdTime",
      ...(locality?.length > 0 ? { locality: locality.map((item) => item.code.split("_").pop()).join(",") } : {}),
    },
    limit,
    offset,
  };

  return useInbox({
    tenantId,
    filters: _filters,
    config: {
      select: (data) => ({
        statuses: data.statusMap,
        table: data?.items.map((application) => ({
          applicationNo: application.businessObject.applicationNo,
          applicationType: application?.ProcessInstance?.businessService || "NA",
          status: application?.ProcessInstance?.state?.state,
          owner: application?.businessObject?.connectionHolders?.[0]?.name || application?.businessObject?.additionalDetails?.ownerName || "NA",
          sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000)),
          connectionNo: application.businessObject.connectionNo || "NA",
        })),
        slaCount: data.nearingSlaCount,
        totalCount: data.totalCount,
      }),
      ...config,
    },
  });
};

export default useWSInbox;
