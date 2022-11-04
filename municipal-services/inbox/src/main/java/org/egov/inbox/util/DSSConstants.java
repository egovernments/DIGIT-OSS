package org.egov.inbox.util;

public class DSSConstants {

    public static final String DSS_VISUALIZATIONTYPE = "METRIC";

    public static final String DSS_INTERVAL = "month";

    public static final String TENANT_ID = "tenantId";

    public static final String AGGREGATE_MASTER_CODE = "AggregationData";

    public static final String ELASTIC_SEARCH_MASTER = "ElasticSearchQueries";

    public static final String AGGREGATE_MODULE_NAME = "inbox-dss";

    public static final String MDMS_AGGREGATE_PATH = "$.MdmsRes.inbox-dss.AggregationData";

    public static final String MDMS_ELASTIC_SEARCH_PATH = "$.MdmsRes.inbox-dss.ElasticSearchQueries[?(@.indexKey=='{{indexKey}}')]";

    public static final String MDMS_VISUALIZATION_PATH = "visualizationCode";

    public static final String MDMS_VISUALIZATION_CODES_KEY = "code";

    public static final String MDMS_VISUALIZATION_DATE_KEY = "dateRange";

    public static final String MDMS_VISUALIZATION_MODULE_KEY = "module";

    public static final String ELASTICSEARCH_SOURCE_KEY = "_source";

    public static final String ELASTICSEARCH_DATA_KEY = "Data";

    public static final String ELASTICSEARCH_USERID_KEY = "userId";

    public static final String ELASTICSEARCH_TIMESTAMP_KEY = "timestamp";

    public static final String ELASTICSEARCH_DATAVIEW_KEY = "dataView";

    public static final String ELASTICSEARCH_PALINACCESSREQUEST_KEY = "plainAccessRequest";

    public static final String ELASTICSEARCH_PALINACCESSREQUESTFIELD_KEY = "plainRequestFields";

    public static final String ELASTICSEARCH_HIT_KEY = "hits";

    public static final String ELASTICSEARCH_TOTAL_KEY = "total";

    public static final String ELASTICSEARCH_DATAVIEWEDBY_KEY = "dataViewedBy";

    public static final String ELASTICSEARCH_ROLES_KEY = "roles";

    public static final String PLACEHOLDER_UUID_KEY = "$uuid";

    public static final String PLACEHOLDER_FROMDATE_KEY = "$fromDate";

    public static final String PLACEHOLDER_TODATE_KEY = "$toDate";

    public static final String PLACEHOLDER_OFFSET_KEY = "$offset";

    public static final String PLACEHOLDER_LIMIT_KEY = "$limit";

    public static final String PLACEHOLDER_SORT_ORDER_KEY = "$sortOrder";

    public static final String INTERNALMICROSERVICEROLE_NAME = "Internal Microservice Role";

    public static final String INTERNALMICROSERVICEROLE_CODE = "INTERNAL_MICROSERVICE_ROLE";

    public static final String INTERNALMICROSERVICEUSER_NAME = "Internal Microservice User";

    public static final String INTERNALMICROSERVICEUSER_USERNAME = "INTERNAL_USER";

    public static final String INTERNALMICROSERVICEUSER_MOBILENO = "9999999999";

    public static final String INTERNALMICROSERVICEUSER_TYPE = "SYSTEM";
}
