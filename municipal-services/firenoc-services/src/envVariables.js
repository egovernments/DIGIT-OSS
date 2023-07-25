const envVariables = {
  // DB configurations
  DB_USER: process.env.DB_USER || "thpqnqhvqfbvqw",
  DB_PASSWORD:
    process.env.DB_PASSWORD ||
    "46ad4cd2bd2d8d2f3a6cb567482b6c703473dc0eaf150baea5a92909131302b5",
  DB_HOST: process.env.DB_HOST || "ec2-54-225-68-133.compute-1.amazonaws.com",
  DB_NAME: process.env.DB_NAME || "d9jf2v9doprlot",
  DB_SSL: process.env.DB_SSL || false,
  DB_PORT: process.env.DB_PORT || 5432,
  DB_MAX_POOL_SIZE: process.env.DB_MAX_POOL_SIZE || "5",

  //server configurations
  SERVER_PORT: process.env.SERVER_PORT || "8080",

  //kafka configurations
  KAFKA_BROKER_HOST: process.env.KAFKA_BROKER_HOST || "localhost:9092",
  KAFKA_TOPICS_FIRENOC_CREATE:
    process.env.KAFKA_TOPICS_FIRENOC_CREATE || "save-fn-firenoc",
  KAFKA_TOPICS_FIRENOC_UPDATE:
    process.env.KAFKA_TOPICS_FIRENOC_UPDATE || "update-fn-firenoc",
  KAFKA_TOPICS_FIRENOC_WORKFLOW:
    process.env.KAFKA_TOPICS_FIRENOC_WORKFLOW || "update-fn-workflow",
  KAFKA_TOPICS_RECEIPT_CREATE:
    process.env.KAFKA_TOPICS_RECEIPT_CREATE || "egov.collection.payment-create",
  KAFKA_TOPICS_NOTIFICATION:
    process.env.KAFKA_TOPICS_NOTIFICATION || "egov.core.notification.sms",
  KAFKA_TOPICS_EVENT_NOTIFICATION:
    process.env.KAFKA_TOPICS_EVENT_NOTIFICATION || "persist-events-async",

  //tracer configurations
  TRACER_ENABLE_REQUEST_LOGGING:
    process.env.TRACER_ENABLE_REQUEST_LOGGING || false,

  //default host configurations
  HOST_URL: process.env.HOST_URL || "https://dev.digit.org",

  //logger configurations
  HTTP_CLIENT_DETAILED_LOGGING_ENABLED:
    process.env.HTTP_CLIENT_DETAILED_LOGGING_ENABLED || false,

  //workflow service configurations
  EGOV_WORKFLOW_HOST: process.env.EGOV_WORKFLOW_HOST || "http://localhost:8089",
  // "https://dev.digit.org",
  EGOV_WORKFLOW_TRANSITION_ENDPOINT:
    process.env.EGOV_WORKFLOW_TRANSITION_PATH ||
    "/egov-workflow-v2/egov-wf/process/_transition",
  BUSINESS_SERVICE: process.env.BUSINESS_SERVICE || "FIRENOC",

  //location service configurations
  EGOV_LOCATION_HOST: process.env.EGOV_LOCATION_HOST || "http://localhost:8090",
  EGOV_LOCATION_CONTEXT_PATH:
    process.env.EGOV_LOCATION_CONTEXT_PATH || "/egov-location/location/v11/",
  EGOV_LOCATION_SEARCH_ENDPOINT:
    process.env.EGOV_LOCATION_SEARCH_ENDPOINT || "/boundarys/_search",
  EGOV_LOCATION_HIERARCHY_TYPE_CODE: process.env.EGOV_LOCATION || "REVENUE",
  EGOV_LOCATION_BOUNDARY_TYPE_CODE: process.env.EGOV_BOUNDARY || "Locality",

  //user service configurations
  EGOV_USER_HOST: process.env.EGOV_USER_HOST || "http://localhost:8088",
  //"https://dev.digit.org",
  EGOV_USER_CONTEXT_PATH: process.env.EGOV_USER_CONTEXT_PATH || "/user",
  EGOV_USER_CREATE_ENDPOINT:
    process.env.EGOV_USER_CREATE_ENDPOINT || "/users/_createnovalidate",
  EGOV_USER_SEARCH_ENDPOINT:
    process.env.EGOV_USER_SEARCH_ENDPOINT || "/_search",
  EGOV_USER_UPDATE_ENDPOINT:
    process.env.EGOV_USER_UPDATE_ENDPOINT || "/users/_updatenovalidate",
  EGOV_USER_USERNAME_PREFIX: process.env.EGOV_USER_USERNAME_PREFIX || "FN-",

  //idgen service configurations
  EGOV_IDGEN_HOST: process.env.EGOV_IDGEN_HOST || "http://localhost:8087",
  EGOV_IDGEN_CONTEXT_PATH: process.env.EGOV_IDGEN_CONTEXT_PATH || "/egov-idgen",
  EGOV_IDGEN_GENERATE_ENPOINT:
    process.env.EGOV_IDGEN_GENERATE_ENPOINT || "/id/_generate",
  EGOV_IDGEN_FN_APPLICATION_NO_NAME:
    process.env.EGOV_IDGEN_FN_APPLICATION_NO_NAME ||
    "fn.fireNOCDetails.applicationNumber",
  EGOV_IDGEN_FN_CERTIFICATE_NO_NAME:
    process.env.EGOV_IDGEN_FN_CERTIFICATE_NO_NAME || "fn.fireNOCNumber",
  EGOV_APPLICATION_FORMATE:
    process.env.APPLICATION_FORMATE || "PB-FN-[cy:yyyy-MM-dd]-[SEQ_EG_TL_APL]",
  EGOV_CIRTIFICATE_FORMATE:
    process.env.CIRTIFICATE_FORMATE || "PB-FN-[cy:yyyy-MM-dd]-[SEQ_EG_PT_LN]",

  //mdms service configurations
  EGOV_MDMS_HOST:
    process.env.EGOV_MDMS_HOST || "https://dev.digit.org",
  EGOV_MDMS_CONTEXT_PATH:
    process.env.EGOV_MDMS_CONTEXT_PATH || "/egov-mdms-service/v1",
  EGOV_MDMS_SEARCH_ENPOINT: process.env.EGOV_MDMS_SEARCH_ENPOINT || "/_search",

  //event service configurations
  EGOV_EVENT_HOST:
    process.env.EGOV_EVENT_HOST || "https://dev.digit.org",
  EGOV_EVENT_CONTEXT_PATH:
    process.env.EGOV_EVENT_CONTEXT_PATH || "/egov-user-event/v1/events",
  EGOV_EVENT_CREATE_ENPOINT:
    process.env.EGOV_EVENT_CREATE_ENPOINT || "/_create",

  //firenoc calcultor service configurations
  EGOV_FN_CALCULATOR_HOST:
    process.env.EGOV_FN_CALCULATOR_HOST || "http://localhost:8083",
  EGOV_FN_CALCULATOR_CONTEXT_PATH:
    process.env.EGOV_FN_CALCULATOR_CONTEXT_PATH || "/firenoc-calculator/v1",
  EGOV_FN_CALCULATOR_CALCULATOR_ENPOINT:
    process.env.EGOV_FN_CALCULATOR_CALCULATOR_ENPOINT || "/_calculate",
  EGOV_FN_CALCULATOR_GETBILL_ENPOINT:
    process.env.EGOV_FN_GETBILLE_CALCULATOR_ENPOINT || "/_getbill",

  //property service configurations
  EGOV_PROPERTY_HOST:
    process.env.EGOV_PROPERTY_HOST || "https://dev.digit.org",
  EGOV_PROPERTY_CONTEXT_PATH:
    process.env.EGOV_PROPERTY_CONTEXT_PATH || "/pt-services-v2/property",
  EGOV_PROPERTY_SEARCH_ENPOINT:
    process.env.EGOV_PROPERTY_SEARCH_ENPOINT || "/_search",

  //localization service configurations
  EGOV_LOCALIZATION_HOST:
    process.env.EGOV_LOCALIZATION_HOST ||
    "https://dev.digit.org",
  EGOV_LOCALIZATION_CONTEXT_PATH:
    process.env.EGOV_LOCALIZATION_CONTEXT_PATH || "/localization/messages/v1",
  EGOV_LOCALIZATION_SEARCH_ENPOINT:
    process.env.EGOV_LOCALIZATION_SEARCH_ENPOINT || "/_search",
  EGOV_LOCALIZATION_STATE_LEVEL:
    process.env.EGOV_LOCALIZATION_STATE_LEVEL || true,

  // default state // IDEA:
  EGOV_DEFAULT_STATE_ID: process.env.EGOV_DEFAULT_STATE_ID || "pb",

  //pagination configurations
  EGOV_FN_DEFAULT_OFFSET: process.env.EGOV_FN_DEFAULT_OFFSET || 0,
  EGOV_FN_DEFAULT_LIMIT: process.env.EGOV_FN_DEFAULT_OFFSET || 10,
  EGOV_FN_MAX_OFFSET: process.env.EGOV_FN_DEFAULT_OFFSET || 100,
  EGOV_HOST_BASE_URL:process.env.EGOV_HOST_BASE_URL|| "https://dev.digit.org/",
  EGOV_RECEIPT_URL:process.EGOV_RECEIPT_URL||"citizen/fire-noc/search-preview",
  ACTION_PAY: "PAY",
  SENDBACK:"SENDBACK",
  SENDBACKTOCITIZEN:"SENDBACKTOCITIZEN"
};
export default envVariables;
