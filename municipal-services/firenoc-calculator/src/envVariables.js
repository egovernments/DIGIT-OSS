const envVariables = {
  //---------------------------- DATABASE CONFIGURATIONS -----------------------------//
  DB_USERNAME: process.env.DB_USERNAME || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "egov_firenoc",
  DB_PORT: process.env.DB_PORT || 5432,
  DB_SSL: process.env.DB_SSL || true,
  DB_MAX_POOL_SIZE: process.env.DB_MAX_POOL_SIZE || "5",

  //----------------------------- FLYWAY CONFIGURATIONS ------------------------------//

  //--------------------------- PATH & PORT CONFIGURATIONS ---------------------------//
  SERVER_PORT: process.env.SERVER_PORT || 8083,

  //-------------------------- EXTERNAL API CONFIGURATIONS ---------------------------//

  //mdms urls
  EGOV_MDMS_HOST:
    process.env.EGOV_MDMS_HOST || "https://dev.digit.org",
  EGOV_MDMS_SEARCH_ENDPOINT:
    process.env.EGOV_MDMS_SEARCH_ENDPOINT || "/egov-mdms-service/v1/_search",

  BUSINESSSERVICE: process.env.BUSINESSSERVICE || "FIRENOC",

  //firenoc service
  EGOV_FIRENOC_SERVICE_HOST:
    process.env.EGOV_FIRENOC_SERVICE_HOST ||
    "https://dev.digit.org",
  EGOV_FIRENOC_SEARCH_ENDPOINT:
    process.env.EGOV_FIRENOC_SEARCH_ENDPOINT || "firenoc-services/v1/_search",

  //billing sercice urls
  EGOV_BILLINGSERVICE_HOST:
    process.env.EGOV_BILLINGSERVICE_HOST || "http://localhost:8084",
  EGOV_TAXHEAD_SEARCH_ENDPOINT:
    process.env.EGOV_TAXHEAD_SEARCH_ENDPOINT ||
    "/billing-service/taxheads/_search",
  EGOV_TAXPERIOD_SEARCH_ENDPOINT:
    process.env.EGOV_TAXPERIOD_SEARCH_ENDPOINT ||
    "/billing-service/taxperiods/_search",
  EGOV_DEMAND_CREATE_ENDPOINT:
    process.env.EGOV_DEMAND_CREATE_ENDPOINT ||
    "/billing-service/demand/_create",
  EGOV_DEMAND_UPDATE_ENDPOINT:
    process.env.EGOV_DEMAND_UPDATE_ENDPOINT ||
    "/billing-service/demand/_update",
  EGOV_DEMAND_SEARCH_ENDPOINT:
    process.env.EGOV_DEMAND_SEARCH_ENDPOINT ||
    "/billing-service/demand/_search",
  EGOV_BILL_GEN_ENDPOINT:
    process.env.EGOV_BILL_GEN_ENDPOINT || "/billing-service/bill/_generate",
  TAXABLE_TAXHEADS: process.env.TAXABLE_TAXHEADS || ["FIRENOC_FEES"],
  DEBIT_TAXHEADS: process.env.DEBIT_TAXHEADS || ["FIRENOC_ADHOC_REBATE"],

  EGOV_DEMAND_MINIMUM_PAY_AMOUNT:
    process.env.EGOV_DEMAND_MINIMUM_PAY_AMOUNT || 100,
  EGOV_DEMAND_BUSINESSSERVICIE:
    process.env.EGOV_DEMAND_BUSINESSSERVICIE || "FIRENOC",

  //------------------------------ KAFKA CONFIGURATIONS ------------------------------//
  // KAFKA SERVER CONFIGURATIONS
  KAFKA_BOOTSTRAP_SERVER:
    process.env.KAFKA_BOOTSTRAP_SERVER || "localhost:9092",
  KAFKA_BROKER_HOST: process.env.KAFKA_BROKER_HOST || "localhost:9092",

  // KAFKA TOPIC CONFIGURATIONS
  KAFKA_TOPICS_SAVE_SERVICE:
    process.env.KAFKA_TOPICS_SAVE_SERVICE ||
    "save-firenoc-calculator-billingslab",
  KAFKA_TOPICS_UPDATE_SERVICE:
    process.env.KAFKA_TOPICS_UPDATE_SERVICE ||
    "update-firenoc-calculator-billingslab",

  TRACER_ENABLE_REQUEST_LOGGING:
    process.env.TRACER_ENABLE_REQUEST_LOGGING || false,
  HTTP_CLIENT_DETAILED_LOGGING_ENABLED:
    process.env.HTTP_CLIENT_DETAILED_LOGGING_ENABLED || false
};

export default envVariables;
