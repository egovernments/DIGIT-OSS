export const filterFunctions = {
  PT: (filtersArg) => {
    let { uuid } = Digit.UserService.getUser()?.info || {};

    const searchFilters = {};
    const workflowFilters = {};

    const { propertyIds, mobileNumber, limit, offset, sortBy, sortOrder, total, applicationStatus, services } = filtersArg || {};

    if (filtersArg?.acknowledgementIds) {
      searchFilters.acknowledgementIds = filtersArg?.acknowledgementIds;
    }
    if (filtersArg?.propertyIds) {
      searchFilters.propertyIds = propertyIds;
    }
    if (filtersArg?.oldpropertyids) {
      searchFilters.oldpropertyids = filtersArg?.oldpropertyids;
    }
    if (applicationStatus && applicationStatus?.[0]) {
      workflowFilters.applicationStatus = applicationStatus.map((status) => status.code).join(",");
    }
    if (filtersArg?.locality?.length) {
      searchFilters.locality = filtersArg?.locality.map((item) => item.code.split("_").pop()).join(",");
    }

    if (filtersArg?.locality?.code) {
      searchFilters.locality = filtersArg?.locality?.code;
    }

    if (filtersArg?.uuid && filtersArg?.uuid.code === "ASSIGNED_TO_ME") {
      workflowFilters.assignee = uuid;
    }
    if (mobileNumber) {
      searchFilters.mobileNumber = mobileNumber;
    }
    if (propertyIds) {
      searchFilters.propertyIds = propertyIds;
    }
    if (sortBy) {
      searchFilters.sortBy = sortBy;
    }
    if (sortOrder) {
      searchFilters.sortOrder = sortOrder;
    }
    if (services) {
      workflowFilters.businessServices = services.join();
    }
    if (limit) {
      searchFilters.limit = limit;
    }
    if (offset) {
      searchFilters.offset = offset;
    }

    return { searchFilters, workflowFilters };
  },
  TL: (filtersArg) => {
    let { uuid } = Digit.UserService.getUser()?.info || {};

    const searchFilters = {};
    const workflowFilters = {};

    const { propertyIds, mobileNumber, limit, offset, sortBy, sortOrder, total, applicationStatus, services } = filtersArg || {};

    if (filtersArg?.acknowledgementIds) {
      searchFilters.acknowledgementIds = filtersArg?.acknowledgementIds;
    }
    if (filtersArg?.propertyIds) {
      searchFilters.propertyIds = propertyIds;
    }
    if (filtersArg?.oldpropertyids) {
      searchFilters.oldpropertyids = filtersArg?.oldpropertyids;
    }
    if (applicationStatus && applicationStatus?.[0]) {
      workflowFilters.applicationStatus = applicationStatus.map((status) => status.code).join(",");
    }
    if (filtersArg?.locality?.length) {
      searchFilters.locality = filtersArg?.locality.map((item) => item.code.split("_").pop()).join(",");
    }

    if (filtersArg?.uuid && filtersArg?.uuid.code === "ASSIGNED_TO_ME") {
      workflowFilters.assignee = uuid;
    }
    if (mobileNumber) {
      searchFilters.mobileNumber = mobileNumber;
    }
    if (propertyIds) {
      searchFilters.propertyIds = propertyIds;
    }
    if (sortBy) {
      searchFilters.sortBy = sortBy;
    }
    if (sortOrder) {
      searchFilters.sortOrder = sortOrder;
    }
    if (services) {
      workflowFilters.businessServices = services.join();
    }
    if (limit) {
      searchFilters.limit = limit;
    }
    if (offset) {
      searchFilters.offset = offset;
    }

    return { searchFilters, workflowFilters };
  },
};
