package org.egov.infra.indexer.util;

import org.springframework.stereotype.Component;

@Component
public class IndexerConstants {

	public static final String ES_INDEX_HEADER_FORMAT = "{ \"index\" : {\"_id\" : \"%s\" } }%n ";
	public static final String ES_INDEX_WRAPPER_FORMAT = "{ \"root\" : \"%s\" }";
}
