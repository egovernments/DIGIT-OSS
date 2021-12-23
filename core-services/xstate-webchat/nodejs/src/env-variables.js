const os = require('os');

const envVariables = {
    serviceId: process.env.NAME || 'xstate-webchat',
    ver: process.env.VERSION || '0.0.1',
    port: process.env.SERVICE_PORT || 8080,
    contextPath: process.env.CONTEXT_PATH || '/xstate-webchat',
    whatsAppProvider: process.env.WHATSAPP_PROVIDER || 'web',
    serviceProvider: process.env.SERVICE_PROVIDER || 'eGov',
    repoProvider: process.env.REPO_PROVIDER || 'InMemory',
    whatsAppBusinessNumber: process.env.WHATSAPP_BUSINESS_NUMBER || '917834811114',
    rootTenantId: process.env.ROOT_TENANTID || 'pb',
    supportedLocales: process.env.SUPPORTED_LOCALES || 'en_IN,hi_IN',
    googleAPIKey: process.env.GOOGLE_MAPS_API_KEY || '',
    dateFormat: process.env.DATEFORMAT || 'DD/MM/YYYY',
    timeZone: process.env.TIMEZONE || 'Asia/Kolkata',
    msgId: process.env.MSG_ID || '20170310130900',

    postgresConfig: {
        dbHost: process.env.DB_HOST || 'localhost',
        dbPort: process.env.DB_PORT || '5432',
        dbName: process.env.DB_NAME || 'chat',
        dbUsername: process.env.DB_USER || 'postgres',
        dbPassword: process.env.DB_PASSWORD || 'postgres'
    },

    kafka: {
        kafkaBootstrapServer: process.env.KAFKA_BOOTSTRAP_SERVER || 'localhost:9092',
        chatbotTelemetryTopic: process.env.CHATBOT_TELEMETRY_TOPIC || 'chatbot-telemetry-v2',

        kafkaConsumerEnabled: process.env.KAFKA_CONSUMER_ENABLED || false,
        kafkaConsumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'xstate-webchat',
    },

    egovServices: {
        egovServicesHost: process.env.EGOV_SERVICES_HOST || 'https://qa.digit.org/',
        externalHost: process.env.EXTERNAL_HOST || 'https://qa.digit.org/',
        searcherHost: process.env.EGOV_SEARCHER_HOST || "http://egov-searcher.egov:8080/",

        userServiceHost: process.env.USER_SERVICE_HOST || 'https://qa.digit.org/',
        userServiceOAuthPath: process.env.USER_SERVICE_OAUTH_PATH || 'user/oauth/token',
        userServiceCreateCitizenPath: process.env.USER_SERVICE_CREATE_CITIZEN_PATH || 'user/citizen/_create',
        userServiceUpdateProfilePath: process.env.USER_SERVICE_UPDATE_PROFILE_PATH || 'user/profile/_update',
        userServiceCitizenDetailsPath: process.env.USER_SERVICE_CITIZEN_DETAILS_PATH || 'user/_details',

        mdmsSearchPath: process.env.MDMS_SEARCH_PATH || 'egov-mdms-service/v1/_search',
        localisationServiceSearchPath: process.env.LOCALISATION_SERVICE_SEARCH_PATH || 'localization/messages/v1/_search',
        billServiceSearchPath: process.env.BILL_SERVICE_SEARCH_PATH || 'billing-service/bill/v2/_fetchbill',
        egovFilestoreServiceUploadEndpoint: process.env.EGOV_FILESTORE_SERVICE_UPLOAD_ENDPOINT || "filestore/v1/files?module=chatbot",
        egovFilestoreServiceDownloadEndpoint: process.env.EGOV_FILESTORE_SERVICE_DOWNLOAD_ENDPOINT || "filestore/v1/files/url",
        urlShortnerEndpoint: process.env.URL_SHORTNER_ENDPOINT || 'egov-url-shortening/shortener',
        collectonServicSearchEndpoint: process.env.COLLECTION_SERVICE_SEARCH_ENDPOINT || 'collection-services/payments/$module/_search',
        pgrCreateEndpoint: process.env.PGR_CREATE_ENDPOINT || 'pgr-services/v2/request/_create',
        pgrSearchEndpoint: process.env.PGR_SEARCH_ENDPOINT || 'pgr-services/v2/request/_search',
        pgrv1CreateEndpoint: process.env.PGR_CREATE_ENDPOINT || 'rainmaker-pgr/v1/requests/_create',
        pgrv1SearchEndpoint: process.env.PGR_SEARCH_ENDPOINT || 'rainmaker-pgr/v1/requests/_search',
        waterConnectionSearch: process.env.WATER_CONNECTION_SEARCH || 'ws-services/wc/_search?searchType=CONNECTION',
        sewerageConnectionSearch: process.env.SEWERAGE_CONNECTION_SEARCH || 'sw-services/swc/_search?searchType=CONNECTION',
        cityFuzzySearch: process.env.CITY_FUZZY_SEARCH || 'nlp-engine/fuzzy/city',
        localityFuzzySearch: process.env.LOCALITY_FUZZY_SEARCH || 'nlp-engine/fuzzy/locality',

        cityExternalWebpagePath: process.env.CITY_EXTERNAL_WEBPAGE_PATH || 'citizen/openlink/whatsapp/city',
        localityExternalWebpagePath: process.env.LOCALITY_EXTERNAL_WEBPAGE_PATH || 'citizen/openlink/whatsapp/locality',
        receiptdownladlink: process.env.RECEIPT_DOWNLOAD_LINK || 'citizen/withoutAuth/egov-common/download-receipt?status=success&consumerCode=$consumercode&tenantId=$tenantId&receiptNumber=$receiptnumber&businessService=$businessservice&smsLink=true&mobileNo=$mobilenumber&channel=whatsapp&redirectNumber=+$whatsAppBussinessNumber&locale=$locale',
        msgpaylink: process.env.MSG_PAY_LINK || 'citizen/withoutAuth/egov-common/pay?consumerCode=$consumercode&tenantId=$tenantId&businessService=$businessservice&redirectNumber=$redirectNumber&channel=whatsapp&locale=$locale',
        wsOpenSearch: process.env.WS_OPEN_SEARCH || 'citizen/withoutAuth/wns/public-search',
        ptOpenSearch: process.env.PT_OPEN_SEARCH || 'citizen/withoutAuth/pt-mutation/public-search'
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
        geoSearch: process.env.GEO_SEARCH || true
    },

    billsAndReceiptsUseCase: {
        billSearchLimit: process.env.BILL_SEARCH_LIMIT || 3,
        receiptSearchLimit: process.env.RECEIPT_SEARCH_LIMIT || 3,
        billSupportedModules: process.env.BILL_SUPPORTED_MODULES || 'WS, PT',
        paymentUpdateTopic: process.env.PAYMENT_UPDATE_TOPIC || 'egov.collection.payment-create',
        pgUpdateTransaction: process.env.PG_UPDATE_TRANSACTION || 'update-pg-txns',
        openSearchImageFilestoreId: process.env.OPEN_SEARCH_IMAGE_FILESTORE_ID || 'bd150c64-2188-44ba-b77e-3030475bddc8'
    },

}

module.exports = envVariables;
