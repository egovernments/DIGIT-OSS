export const LOCALATION = {
  GET: {
    URL: "localization/messages/v1/_search",
    ACTION: "_search",
  },
};

export const COMPLAINT = {
  GET: {
    URL: "rainmaker-pgr/v1/requests/_search",
    ACTION: "_search",
  },
};

export const DRAFTS = {
  GET: {
    URL: "pt-services-v2/drafts/_search",
    ACTION: "_search",
  },
};

export const FILE_UPLOAD = {
  POST: {
    URL: "filestore/v1/files",
  },
};

export const CATEGORY = {
  GET: {
    URL: "egov-mdms-service/v1/_search",
    ACTION: "_search",
  },
};

export const AUTH = {
  LOGOUT: {
    URL: "/user/_logout",
    ACTION: "_logout",
  },
};

export const USER = {
  SEARCH: {
    URL: "/user/_search",
    ACTION: "search",
  },
  UPDATE: {
    URL: "/profile/_update",
    ACTION: "create",
  },
};

export const OTP = {
  RESEND: {
    URL: "/user-otp/v1/_send",
    ACTION: "_send",
  },
};

export const EMPLOYEE = {
  GET: {
    URL: "/egov-hrms/employees/_search",
    ACTION: "_search",
  },
};

export const EMPLOYEE_ASSIGN = {
  GET: {
    URL: "/egov-hrms/employees/_search",
    ACTION: "_search",
  },
};

export const CITIZEN = {
  GET: {
    URL: "/user/v1/_search",
    ACTION: "_search",
  },
};

export const MDMS = {
  GET: {
    URL: "/egov-mdms-service/v1/_search",
    ACTION: "_search",
  },
};

export const TENANT = {
  POST: {
    URL: "egov-location/location/v11/tenant/_search",
    ACTION: "_search",
  },
};

export const SPEC = {
  GET: {
    URL: "spec-directory",
    ACTION: "_search",
  },
};

export const CITY = {
  GET: {
    URL: "/egov-mdms-service/v1/_search",
    ACTION: "_search",
  },
};

export const FLOOR = {
  GET: {
    URL: "/egov-mdms-service/v1/_search",
    ACTION: "_search",
  },
};
export const ACTIONMENU = {
  GET: {
    URL: "/access/v1/actions/mdms/_get",
    ACTION: "_get",
  },
};
export const INBOXRECORDS = {
  GET: {
    URL: "/egov-workflow-v2/egov-wf/process/_search",
    ACTION: "_search",
  },
};
export const INBOXRECORDSCOUNT = {
  GET: {
    URL: "/egov-workflow-v2/egov-wf/process/_count",
    ACTION: "_get",
  },
};
export const INBOXESCALTEDRECORDS = {
  GET: {
    URL: "/egov-workflow-v2/egov-wf/escalate/_search",
    ACTION: "_search",
  },
}; 


export const PROPERTY = {
  GET: {
    URL: "/property-services/property/_search",
    ACTION: "_get",
  },
};

export const DRAFT = {
  GET: {
    URL: "/pt-services-v2/drafts/_search",
    ACTION: "_get",
  },
};

export const PGService = {
  GET: {
    URL: "/pg-service/transaction/v1/_search",
    ACTION: "_get",
  },
};

export const RECEIPT = {
  GET: {
    URL: "/collection-services/receipts/_search",
    ACTION: "_get",
  },
};

export const BOUNDARY = {
  GET: {
    URL: "/egov-location/location/v11/boundarys/_search",
    ACTION: "_get",
  },
};

export const EVENTSCOUNT = {
  GET: {
    URL: "/egov-user-event/v1/events/notifications/_count",
    ACTION: "_search",
  },
};

export const NOTIFICATIONS = {
  GET: {
    URL: "/egov-user-event/v1/events/_search",
    ACTION: "_search",
  },
};

export const FETCHBILL = {
  GET: {
    URL: "/billing-service/bill/v2/_fetchbill",
    ACTION: "_get",
  },
};
export const FETCHRECEIPT = {
  GET: {
    ACTION: "_search",
  },
};
export const DOWNLOADRECEIPT = {
  GET: {
    URL: "/pdf-service/v1/_create",
    ACTION: "_get",
  },
};
export const FETCHASSESSMENTS = {
  GET: {
    URL: "/property-services/assessment/_search",
    ACTION: "_search",
  },
};
export const PAYMENTSEARCH = {
  GET: {
    URL: "/collection-services/payments/",
    ACTION: "_search",
  },
};
