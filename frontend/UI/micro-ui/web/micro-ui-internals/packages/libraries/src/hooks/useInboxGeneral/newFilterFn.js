export const filterFunctions = {
  PT: (filtersArg) => {
    let { uuid } = Digit.UserService.getUser()?.info || {};

    const searchFilters = {};
    const workflowFilters = {};

    const { propertyIds, mobileNumber, limit, offset, sortBy, sortOrder, total, applicationStatus, services } = filtersArg || {};

    if (filtersArg?.acknowledgementIds) {
      searchFilters.applicationNumber = filtersArg?.acknowledgementIds;
    }
    if (filtersArg?.propertyIds) {
      searchFilters.propertyId = propertyIds;
    }
    if (filtersArg?.oldpropertyids) {
      searchFilters.oldpropertyids = filtersArg?.oldpropertyids;
    }
    if (applicationStatus && applicationStatus?.[0]) {
      workflowFilters.status = applicationStatus.map((status) => status.uuid);
      if (applicationStatus?.some((e) => e.nonActionableRole)) {
        searchFilters.fetchNonActionableRecords = true;
      }
    }
    if (filtersArg?.locality?.length) {
      searchFilters.locality = filtersArg?.locality.map((item) => item.code.split("_").pop());
    }
    if (filtersArg?.uuid && filtersArg?.uuid.code === "ASSIGNED_TO_ME") {
      workflowFilters.assignee = uuid;
    }
    if (mobileNumber) {
      searchFilters.mobileNumber = mobileNumber;
    }
    if (services) {
      workflowFilters.businessService = services;
    }
    searchFilters["isInboxSearch"] = true;
    searchFilters["creationReason"] = ["CREATE", "MUTATION", "UPDATE"];
    workflowFilters["moduleName"] = "PT";

    // if (limit) {
    //   searchFilters.limit = limit;
    // }
    // if (offset) {
    //   searchFilters.offset = offset;
    // }

    // workflowFilters.businessService = "PT.CREATE";
    // searchFilters.mobileNumber = "9898568989";
    return { searchFilters, workflowFilters, limit, offset, sortBy, sortOrder };
  },
};
