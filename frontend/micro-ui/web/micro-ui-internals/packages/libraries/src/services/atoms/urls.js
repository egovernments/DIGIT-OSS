const Urls = {
  MDMS: `/egov-mdms-service/v1/_search`,
  WorkFlow: `/egov-workflow-v2/egov-wf/businessservice/_search`,
  WorkFlowProcessSearch: `/egov-workflow-v2/egov-wf/process/_search`,
  localization: `/localization/messages/v1/_search`,
  location: {
    localities: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Locality`,
    revenue_localities: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality`,
  },

  pgr_search: `/pgr-services/v2/request/_search`,
  pgr_update: `/pgr-services/v2/request/_update`,
  filter_data: `https://run.mocky.io/v3/597a50a0-90e5-4a45-b82e-8a2186b760bd`,
  FileStore: "/filestore/v1/files",

  FileFetch: "/filestore/v1/files/url",
  PGR_Create: `/pgr-services/v2/request/_create`,
  pgr_count: `/pgr-services/v2/request/_count`,

  OTP_Send: "/user-otp/v1/_send",
  Authenticate: "/user/oauth/token",
  RegisterUser: "/user/citizen/_create",
  ChangePassword: "/user/password/nologin/_update",
  UserProfileUpdate: "/user/profile/_update",
  EmployeeSearch: "/egov-hrms/employees/_search",

  InboxSearch: "/inbox/v1/_search",

  UserSearch: "/user/_search",

  Shortener: "/egov-url-shortening/shortener",

  fsm: {
    search: "/fsm/v1/_search",
    create: "/fsm/v1/_create",
    update: "/fsm/v1/_update",
    vendorSearch: "/vendor/v1/_search",
    vehicleSearch: "/vehicle/v1/_search",
    audit: "/fsm/v1/_audit",
    vehicleTripSearch: "/vehicle/trip/v1/_search",
    billingSlabSearch: "/fsm-calculator/v1/billingSlab/_search",
    vehilceUpdate: "/vehicle/trip/v1/_update",
  },

  payment: {
    fetch_bill: "/billing-service/bill/v2/_fetchbill",
    demandSearch: "/billing-service/demand/_search",
    create_reciept: "/collection-services/payments/_create",
    print_reciept: "/collection-services/payments",
    generate_pdf: "/pdf-service/v1/_create",
    create_citizen_reciept: "/pg-service/transaction/v1/_create",
    update_citizen_reciept: "/pg-service/transaction/v1/_update",
    search_bill: "/billing-service/bill/v2/_search",
    reciept_search: "/collection-services/payments/:buisnessService/_search",
  },

  pt: {
    fectch_property: "/property-services/property/_search",
    fetch_payment_details: "/billing-service/bill/v2/_fetchbill",
    create: "/property-services/property/_create",
    search: "/property-services/property/_search",
    update: "/property-services/property/_update",
    pt_calculation_estimate: "/pt-calculator-v2/propertytax/v2/_estimate",
    assessment_create: "/property-services/assessment/_create",
    assessment_search: "/property-services/assessment/_search",
  },

  dss: {
    dashboardConfig: "/dashboard-analytics/dashboard/getDashboardConfig",
    getCharts: "/dashboard-analytics/dashboard/getChartV2",
  },

  mcollect: {
    search: "/echallan-services/eChallan/v1/_search",
    create: "/echallan-services/eChallan/v1/_create?",
    fetch_bill: "/billing-service/bill/v2/_fetchbill?",
    search_bill: "/egov-searcher/bill-genie/mcollectbills/_get",
    search_bill_pt: "/egov-searcher/bill-genie/billswithaddranduser/_get",
    update: "/echallan-services/eChallan/v1/_update",
    download_pdf: "/egov-pdf/download/UC/mcollect-challan",
    receipt_download: "/egov-pdf/download/PAYMENT/consolidatedreceipt",
    count: "/echallan-services/eChallan/v1/_count"
  },
  hrms: {
    search: "/egov-hrms/employees/_search",
    count: "/egov-hrms/employees/_count",
    create: "/egov-hrms/employees/_create",
    update: "/egov-hrms/employees/_update",
  },
  tl: {
    create: "/tl-services/v1/_create",
    search: "/tl-services/v1/_search",
    fetch_payment_details: "/billing-service/bill/v2/_fetchbill",
    download_pdf: "/egov-pdf/download/TL/",
    update:"/tl-services/v1/_update",
    billingslab: "/tl-calculator/billingslab/_search"
  },
  receipts: {
    receipt_download: "/egov-pdf/download/PAYMENT/consolidatedreceipt",
    payments: "/collection-services/payments",
    count: "/egov-hrms/employees/_count"
  },
};

export default Urls;
