import useInbox from "../useInbox";
import { useEffect } from "react";

const useWSInbox = ({ tenantId, filters, config = {} }) => {
  const { filterForm, searchForm, tableForm } = filters;
  const user = Digit.UserService.getUser();
  let { mobileNumber, applicationNumber, consumerNo } = searchForm;
  let { sortBy, limit, offset, sortOrder } = tableForm;
  let { moduleName, businessService, applicationStatus, locality, assignee, businessServiceArray, applicationType } = filterForm;

  useEffect(() => {
    if (mobileNumber || applicationNumber || consumerNo) {
      offset = 0;
    }
  },[filters?.searchForm?.applicationNumber,filters?.searchForm?.consumerNo,filters?.searchForm?.mobileNumber])

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
      businessService = ["NewWS1", "ModifyWSConnection", "DisconnectWSConnection"];
    }
  }
  if (window.location.href.includes("sewerage/inbox")) {
    if (applicationType && applicationType.length > 0) {
      businessService = applicationType;
    } else {
      businessService = ["NewSW1", "ModifySWConnection", "DisconnectSWConnection"];
    }
  }

  let _filters = {
    tenantId,
    processSearchCriteria: {
      moduleName: moduleName,
      businessService: businessService,
      ...(applicationStatus?.length > 0 ? { status: applicationStatus } : {}),
    },

    moduleSearchCriteria: {
      businessService: businessService?.join(","),
      ...(mobileNumber ? { mobileNumber } : {}),
      ...(applicationNumber ? { applicationNumber } : {}),
      ...(consumerNo ? { consumerNo } : {}),
      ...(sortOrder ? { sortOrder } : {}),
      sortBy: "additionalDetails.appCreatedDate",
      ...(locality?.length > 0 ? { locality: locality.map((item) => item.code.split("_").pop()).join(",") } : {}),
      // assignee: assignee === "ASSIGNED_TO_ME" ? user?.info?.uuid : "",
    },
    limit,
    offset,
  };

  if (assignee === "ASSIGNED_TO_ME") {
    _filters.moduleSearchCriteria.assignee = user?.info?.uuid
  }

  return useInbox({
    tenantId,
    filters: _filters,
    config: {
      select: (data) => ({
        statuses: data.statusMap,
        table: data?.items.map((application) => {
          return {
            applicationNo: application?.businessObject?.Data?.applicationNo,
            applicationType: application?.businessObject?.Data?.history?.[0]?.businessService || "NA",
            status: application?.businessObject?.Data?.history?.[0]?.state?.state,
            owner: application?.businessObject?.Data?.connectionHolders?.[0]?.name || application?.businessObject?.Data?.additionalDetails?.ownerName || "NA",
            sla: application.businessObject.serviceSLA, //Math.round(application?.businessObject?.Data?.history?.[0]?.businesssServiceSla / (24 * 60 * 60 * 1000)),
            connectionNo: application.businessObject.Data.connectionNo || "NA",
          }
        }),
        slaCount: data.nearingSlaCount,
        totalCount: data.totalCount,
      }),
      ...config,
    },
  });
};

export default useWSInbox;
