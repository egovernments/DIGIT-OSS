package org.egov.demand.repository.querybuilder;

import org.egov.demand.amendment.model.AmendmentCriteria;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class AmendmentQueryBuilder {
	
	@Value("${amendment.default.limit}")
	private Integer defaultLimit;
	
	public static final String AMENDMENT_UPDATE_QUERY = "UPDATE egbs_amendment SET status=:status, amendeddemandid=:amendeddemandid,"
			+ " lastmodifiedby=:lastmodifiedby,lastmodifiedtime=:lastmodifiedtime, additionaldetails=:additionaldetails, "
			+ " amendmentreason=:amendmentreason, reasondocumentnumber=:reasondocumentnumber, effectivefrom=:effectivefrom, "
			+ " effectivetill=:effectivetill "
			+ " WHERE tenantid=:tenantid AND amendmentid=:amendmentid;";
	
	public static final String AMENDMENT_INSERT_QUERY = "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice,"
			+ " consumercode, amendmentreason, reasondocumentnumber, status, effectivetill, effectivefrom,"
			+ " amendeddemandid, createdby, createdtime, lastmodifiedby, lastmodifiedtime, additionaldetails) "
			+ "	VALUES (:id, :tenantid, :amendmentid, :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status,"
			+ " :effectivetill, :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime, :additionaldetails);";

	public static final String AMENDMENT_TAXDETAIL_INSERT_QUERY = "INSERT INTO egbs_amendment_taxdetail(id, amendmentid, taxheadcode, taxamount)"
			+ " VALUES (:id, :amendmentid, :taxheadcode, :taxamount);";

	public static final String DOCUMET_INSERT_QUERY = "INSERT INTO egbs_document(id, amendmentid, documenttype, filestoreid, documentuid, status)"
			+ " VALUES (:id, :amendmentid, :documenttype, :filestoreid, :documentuid, :status);";
	
	public static final String AMENDMENT_SEARCH_QUERY = "SELECT amendment.id as amendmentuuid, amendment.tenantid, "
			+ " amendment.amendmentid as amendmentid, businessservice,"
			+ " consumercode, amendmentreason, reasondocumentnumber, amendment.status as amendmentstatus, effectivetill,"
			+ " effectivefrom, amendeddemandid, createdby, createdtime, lastmodifiedby, lastmodifiedtime, additionaldetails,"
			+ " amdl.id as detailid, amdl.amendmentid as detailamendmentid, taxheadcode, taxamount, doc.id as docid,"
			+ " doc.amendmentid as docamendmentid, documentType, fileStoreid, documentuid, doc.status as docstatus "
			+ " FROM egbs_amendment amendment "
			+ " INNER JOIN "
			+ " egbs_amendment_taxdetail amdl ON amendment.id = amdl.amendmentid " 
			+ "	INNER JOIN egbs_document doc ON amendment.id = doc.amendmentid "
			+ " INNER JOIN (SELECT id, tenantid FROM egbs_amendment amendment WHERE {$WHERE} {$PAGE}) pagedresult "
			+ " ON amendment.id = pagedresult.id AND amendment.tenantid = pagedresult.tenantid ";
	
	public static final String AMENDMENT_SEARCH_QUERY_WHERE = "{$WHERE}";
	
	public static final String AMENDMENT_SEARCH_QUERY_PAGINATION = "{$PAGE}";

	
	public String getSearchQuery(AmendmentCriteria amendmentCriteria, MapSqlParameterSource searchParamMap) {

		StringBuilder whereCondition =   new StringBuilder();

		whereCondition.append(" amendment.tenantid = :tenantid ");
		searchParamMap.addValue("tenantid", amendmentCriteria.getTenantId());
		
		if (!CollectionUtils.isEmpty(amendmentCriteria.getConsumerCode())) {

			addAndClause(whereCondition);
			whereCondition.append(" consumercode IN (:consumercode)");
			searchParamMap.addValue("consumercode", amendmentCriteria.getConsumerCode());
		}
		
		if (amendmentCriteria.getBusinessService() != null) {

			addAndClause(whereCondition);
			whereCondition.append(" businessservice= :businessservice");
			searchParamMap.addValue("businessservice", amendmentCriteria.getBusinessService());
		}
		
		if (amendmentCriteria.getAmendmentId() != null) {

			addAndClause(whereCondition);
			whereCondition.append(" amendment.amendmentid=:amendmentid");
			searchParamMap.addValue("amendmentid", amendmentCriteria.getAmendmentId());
		}
		
		if (!CollectionUtils.isEmpty(amendmentCriteria.getStatus())) {
			addAndClause(whereCondition);
			whereCondition.append(" amendment.status IN ( :status )");
			searchParamMap.addValue("status", amendmentCriteria.getStatus());
		}

		StringBuilder pageQuery = addPagingClause( searchParamMap, amendmentCriteria);
		
		return AMENDMENT_SEARCH_QUERY
				.replace(AMENDMENT_SEARCH_QUERY_WHERE, whereCondition)
				.replace(AMENDMENT_SEARCH_QUERY_PAGINATION, pageQuery);
	}

	private StringBuilder addPagingClause(MapSqlParameterSource searchParamMap, AmendmentCriteria amendmentCriteria) {
		
	
		int offset = 0;
		int limit = defaultLimit;
		StringBuilder pageQuery = new StringBuilder(); 
		
		if (amendmentCriteria.getOffset() != null)
			offset = amendmentCriteria.getOffset();
		if (amendmentCriteria.getLimit() != null)
			limit = amendmentCriteria.getLimit();
		
		pageQuery.append(" OFFSET :offset");
		searchParamMap.addValue("offset", offset);
		
		pageQuery.append(" LIMIT :limit ");
		searchParamMap.addValue("limit", limit);
		
		return pageQuery;
	}
	
	private static boolean addAndClause(StringBuilder queryString) {
		queryString.append(" AND ");
		return true;
	}

}
