package org.egov.infra.indexer.util;

import org.springframework.stereotype.Component;

@Component
public class IndexerConstants {

	public static final String ES_INDEX_HEADER_FORMAT = "{ \"index\" : {\"_id\" : \"%s\" } }%n ";
	public static final String ES_INDEX_WRAPPER_FORMAT = "{ \"root\" : \"%s\" }";
	public static final String RAINMAKER_PGR_MODULE_NAME = "RAINMAKER-PGR";
	public static final String PGR_SERVICE_DEFS = "ServiceDefs";
	public static final String DEPT_CODE = "deptCode";
	public static final String SAVE_PGR_TOPIC = "save-pgr-request";
	public static final String SAVE_PGR_REQUEST_BATCH_TOPIC = "save-pgr-request-batch";
	public static final String DEPARTMENT_PLACEHOLDER = "\"department\"";
	public static final String DEPT_CODE_PLACEHOLDER = "\"deptCode\"";
}
