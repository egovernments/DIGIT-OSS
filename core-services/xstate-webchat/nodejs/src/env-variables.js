// const os = require('os');

const envVariables = {
  serviceId: process.env.NAME || 'xstate-webchat',
  ver: process.env.VERSION || '0.0.1',
  port: process.env.SERVICE_PORT || 8080,
  contextPath: process.env.CONTEXT_PATH || '/xstate-webchat',
  serviceProvider: process.env.SERVICE_PROVIDER || 'eGov',
  repoProvider: process.env.REPO_PROVIDER || 'PostgreSQL',
  rootTenantId: process.env.ROOT_TENANTID || 'pb',
  supportedLocales: process.env.SUPPORTED_LOCALES || 'en_IN,hi_IN',
  dateFormat: process.env.DATEFORMAT || 'DD/MM/YYYY',
  timeZone: process.env.TIMEZONE || 'Asia/Kolkata',

  postgresConfig: {
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '5432',
    dbName: process.env.DB_NAME || 'chat',
    dbUsername: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || 'postgres',
  },

  kafka: {
    kafkaBootstrapServer: process.env.KAFKA_BOOTSTRAP_SERVER || 'localhost:9092',
    chatbotTelemetryTopic: process.env.CHATBOT_TELEMETRY_TOPIC || 'chatbot-telemetry-v2',

    kafkaConsumerEnabled: process.env.KAFKA_CONSUMER_ENABLED || false,
    kafkaConsumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'xstate-webchat',

    sendEmailTopic: process.env.CHATBOT_EMAIL_TOPIC || 'egov.core.notification.email',
  },

  egovServices: {
    egovServicesHost: process.env.EGOV_SERVICES_HOST || 'https://qa.digit.org/',
    externalHost: process.env.EXTERNAL_HOST || 'https://qa.digit.org/',
    searcherHost: process.env.EGOV_SEARCHER_HOST || 'http://egov-searcher.egov:8080/',

    userServiceHost: process.env.USER_SERVICE_HOST || 'https://qa.digit.org/',
    userServiceOAuthPath: process.env.USER_SERVICE_OAUTH_PATH || 'user/oauth/token',
    userServiceCreateCitizenPath: process.env.USER_SERVICE_CREATE_CITIZEN_PATH || 'user/citizen/_create',
    userServiceUpdateProfilePath: process.env.USER_SERVICE_UPDATE_PROFILE_PATH || 'user/profile/_update',
    userServiceCitizenDetailsPath: process.env.USER_SERVICE_CITIZEN_DETAILS_PATH || 'user/_details',

    mdmsSearchPath: process.env.MDMS_SEARCH_PATH || 'egov-mdms-service/v1/_search',
    localisationServiceSearchPath: process.env.LOCALISATION_SERVICE_SEARCH_PATH || 'localization/messages/v1/_search',
    billServiceSearchPath: process.env.BILL_SERVICE_SEARCH_PATH || 'billing-service/bill/v2/_fetchbill',
    egovFilestoreServiceUploadEndpoint: process.env.EGOV_FILESTORE_SERVICE_UPLOAD_ENDPOINT || 'filestore/v1/files?module=chatbot',
    egovFilestoreServiceDownloadEndpoint: process.env.EGOV_FILESTORE_SERVICE_DOWNLOAD_ENDPOINT || 'filestore/v1/files/url',
    urlShortnerEndpoint: process.env.URL_SHORTNER_ENDPOINT || 'egov-url-shortening/shortener',
    collectonServicSearchEndpoint: process.env.COLLECTION_SERVICE_SEARCH_ENDPOINT || 'collection-services/payments/$module/_search',
    pgrCreateEndpoint: process.env.PGR_CREATE_ENDPOINT || 'pgr-services/v2/request/_create',
    pgrSearchEndpoint: process.env.PGR_SEARCH_ENDPOINT || 'pgr-services/v2/request/_search',
    pgrv1CreateEndpoint: process.env.PGR_CREATE_ENDPOINT || 'rainmaker-pgr/v1/requests/_create',
    pgrv1SearchEndpoint: process.env.PGR_SEARCH_ENDPOINT || 'rainmaker-pgr/v1/requests/_search',
    egovWorkflowSearchPath: process.env.WORKFLOW_SEARCH_PATH || 'egov-workflow-v2/egov-wf/process/_search',
    maxStarRating: process.env.MAX_STAR_RATING || 5,

  },

  userService: {
    userServiceHardCodedPassword: process.env.USER_SERVICE_HARDCODED_PASSWORD || '123456',
    userLoginAuthorizationHeader: process.env.USER_LOGIN_AUTHORIZATION_HEADER || 'Basic ZWdvdi11c2VyLWNsaWVudDo=',
  },

  pgrUseCase: {
    pgrVersion: process.env.PGR_VERSION || 'v2',
    complaintSearchLimit: process.env.COMPLAINT_SEARCH_LIMIT || 3,
    informationImageFilestoreId: process.env.INFORMATION_IMAGE_FILESTORE_ID || '16dff22d-06dd-485d-a03d-6d11e8564dff',
    pgrUpdateTopic: process.env.PGR_UPDATE_TOPIC || 'update-pgr-request',

  },

};

module.exports = envVariables;
