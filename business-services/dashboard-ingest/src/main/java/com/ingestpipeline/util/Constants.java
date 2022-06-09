package com.ingestpipeline.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Constants which are with respect to the Ingest App
 * 
 * @author Darshan Nagesh
 *
 */

public interface Constants {
	public interface Paths {
		final String ELASTIC_PUSH_CONTROLLER_PATH = "/ingest";
		final String SAVE = "/save";
		final String UPLOAD = "/upload";
		final String Targets = "/targets";
		final String Collections = "/getCollections";
		final String ES_INDEX = "/migrate/{indexName}/{version}";
	}
	
	public interface Qualifiers { 
		final String INGEST_SERVICE = "ingestService"; 
		final String VALIDATOR_SERVICE = "validatorService";
		final String TRANSFORM_SERVICE = "transformService";
		final String ENRICHMENT_SERVICE = "enrichmentService";
		final String TRANSFORM_COLLECTION_SERVICE = "transformCollectionService";
		final String DIGRESS_SERVICE = "digressService"; 
	}

	public static String SUCCESS = "success";
	public static int UNAUTHORIZED_ID = 401;
	public static int SUCCESS_ID = 200;
	public static int FAILURE_ID = 320;
	public static String UNAUTHORIZED = "Invalid credentials. Please try again.";
	public static String PROCESS_FAIL = "Process failed, Please try again.";
	public static String DATE_FORMAT = "yyyy.MM.dd G 'at' HH:mm:ss z";
	public static String INDIAN_TIMEZONE = "IST";

	public static String ALLOWED_METHODS_GET = "GET";
	public static String ALLOWED_METHODS_POST = "POST";
	public static String MDMS_MCOLLECT_SEARCH  = "{\"MdmsCriteria\":{\"tenantId\":\"TENANTID_PLACEHOLDER\",\"moduleDetails\":[{\"moduleName\":\"BillingService\",\"masterDetails\":[{\"name\":\"BusinessService\",\"filter\":\"[?(@.type=='Adhoc')]\"}]}]},\"RequestInfo\":{}}";
	public static String TENANTID_PLACEHOLDER = "TENANTID_PLACEHOLDER";
	public static String CONTENT_TYPE = "content-type";
	public static String JSON = "application/json;charset=UTF-8";
	public static String MDMS_URL = "http://egov-mdms-service.egov:8080/egov-mdms-service/v1/_search";
	public static String MDMS_RES = "MdmsRes";
	public static String BUSINESS_SERVICE="BusinessService";
	public static String BILLING_SERVICE = "BillingService";
	public static String CATEGORY_CODE= "code";

	public interface KafkaTopics {
		public static final String INGEST_DATA = "ingestData";
		public static final String VALID_DATA = "validData";
		public static final String TRANSFORMED_DATA = "transformedData";
		public static final String ERROR_INTENT = "DataError";
		public static final String TOPIC_ONE = "topicOne"; 
		public static final String TOPIC_TWO = "topicTwo"; 
		public static final String TOPIC_THREE = "topicThree"; 
		public static final String TOPIC_FOUR = "topicFour"; 
	}
	
	public interface BeanContainerFactory { 
		public static final String INCOMING_KAFKA_LISTENER = "incomingKafkaListenerContainerFactory"; 
	}
	
	public interface DomainConfigurations { 
		public static final String COLLECTION_DOMAIN_CONFIG = "DomainConfig";
		public static final String ENHANCE_DOMAIN_CONFIG = "EnhanceDomainConfig";
	}
	
	public interface PipelineRules {
		public static final String VALIDATE_DATA = "VALIDATE";
		public static final String TRANSFORM_DATA = "TRANSFORM";
		public static final String ENRICH_DATA = "ENRICH";
	}

	public interface ScrollSearch { 
		public static final String SCROLL_ID = "scrollId"; 
		public static final String SEARCH_PATH = "searchPath"; 
		public static final String QUERY = "query"; 
		public static final String SCROLL_ID_PARAMS = "_scroll_id";
		public static final String SCROLL_SEARCH_DEFAULT_QUERY = "{\"scroll\":\"1m\",\"scroll_id\":"; 
	}
	
	public interface DataContexts { 
		public static final String CONTEXT = "context"; 
		public static final String COLLECTION = "collection"; 
		public static final String BILLING = "billing" ; 
		public static final String PAYMENT = "payment" ; 
	}
	
	public static String DATA_CONTEXT = "dataContext";
	public static String DATA_CONTEXT_VERSION = "dataContextVersion";
	public static String DATA_OBJECT = "dataObject";

	public static String ERROR_IN_PIPEINE = "errorPipeline";
	
	public static int HEADER_ROW = 1;
	public static String MUNICIPAL_CORPORATIONS = "Municipal Corporations";
	public static String ES_INDEX_COLLECTION = "collectionsindex-v1";
	public static String ES_INDEX_BILLING = "billingservice";
	public static String ES_INDEX_PAYMENT = "paymentsindex-v1"; 
	
	public interface ErrorMessages {
		Map<String,String> errorCodeMessageMap = new HashMap<String, String>() {{
	        put("INGEST","Error finding Context for the Topic");
	        put("VALIDATE","Error while validating the Document");
	        put("TRANSFORM","Error while transforming the Document");
	        put("ENRICH","Error while enriching the Document");
	    }};
	}
	
	public static interface ConfigurationFileNames { 
		public static final String DIGRESSION_POINTS = "DigressionPoints.json"; 
	}
	public static interface TransformationType {
		public static final String COLLECTION = "collection";

	}
	public static final String IDENTIFIER = "identifier";
	public static final String TRANSACTION_ID = "transactionId";

}
