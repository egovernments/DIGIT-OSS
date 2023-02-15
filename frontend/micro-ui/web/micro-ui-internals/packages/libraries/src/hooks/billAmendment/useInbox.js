import useInbox from "../useInbox";
import { useEffect } from "react";

const useBillAmendmentInbox = ({ tenantId, filters, config = {} }) => {
  const { filterForm, searchForm, tableForm } = filters;
  const user = Digit.UserService.getUser();
  let { mobileNumber, applicationNumber, consumerCode } = searchForm;
  let { sortBy, limit, offset, sortOrder } = tableForm;
  let { moduleName, businessService, applicationStatus, locality, assignee, applicationType } = filterForm;

  if (mobileNumber || applicationNumber || consumerCode) {
    offset = 0;
  }

  if (!window.location.href.includes("digit-ui/employee/")) {
    moduleName = moduleName;
  } else {
    if (window.location.href.includes("/ws/water/bill-amendment/inbox")) moduleName = "bsWs-service";
    if (window.location.href.includes("/ws/sewerage/bill-amendment/inbox")) moduleName = "bsSw-service";
  }

  if (window.location.href.includes("/ws/water/bill-amendment/inbox")) {
    businessService = ["WS.AMENDMENT"];
  }
  if (window.location.href.includes("/ws/sewerage/bill-amendment/inbox")) {
    businessService = ["SW.AMENDMENT"];
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
      ...(consumerCode ? { consumerCode } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      sortBy: "createdTime",
      ...(locality?.length > 0 ? { locality: locality.map((item) => item.code.split("_").pop()) } : {}),
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
          service: application?.businessObject?.businessService,
          applicationNo: application?.businessObject?.amendmentId || "NA",
          amendmentReason: application?.businessObject?.amendmentReason || "NA",
          status: application?.ProcessInstance?.state?.state,
          owner: application?.serviceObject?.additionalDetails?.ownerName || "NA",
          address: application?.serviceObject?.additionalDetails?.locality || "NA",
          status: application?.businessObject?.status,
          taskOwner: application?.ProcessInstance?.assigner?.name || "NA",
          tenantId: application?.ProcessInstance?.tenantId,
        })),
        slaCount: data?.nearingSlaCount,
        totalCount: data?.totalCount,
      }),
      ...config,
    },
  });
};

export default useBillAmendmentInbox;
