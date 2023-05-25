package org.egov.demand.repository.querybuilder;

import org.egov.demand.amendment.model.AmendmentCriteria;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
public class AmendmentQueryBuilder {
	
	public static final String AMENDMENT_UPDATE_QUERY = "UPDATE egbs_amendment SET status=:status, amendeddemandid=:amendeddemandid,"
			+ " lastmodifiedby=:lastmodifiedby,lastmodifiedtime=:lastmodifiedtime, additionaldetails=:additionaldetails "
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
	
	public static final String AMENDMENT_SEARCH_QUERY = "SELECT amendment.id as amendmentuuid, tenantid, amendment.amendmentid as amendmentid, businessservice,"
			+ " consumercode, amendmentreason, reasondocumentnumber, amendment.status as amendmentstatus, effectivetill,"
			+ " effectivefrom, amendeddemandid, createdby, createdtime, lastmodifiedby, lastmodifiedtime, additionaldetails,"
			+ " amdl.id as detailid, amdl.amendmentid as detailamendmentid, taxheadcode, taxamount, doc.id as docid,"
			+ " doc.amendmentid as docamendmentid, documentType, fileStoreid, documentuid, doc.status as docstatus "
			+ " FROM egbs_amendment amendment "
			+ " INNER JOIN "
			+ " egbs_amendment_taxdetail amdl ON amendment.id = amdl.amendmentid " 
			+ "	INNER JOIN egbs_document doc ON amendment.id = doc.amendmentid WHERE ";

	
	public String getSearchQuery(AmendmentCriteria amendmentCriteria, MapSqlParameterSource searchParamMap) {

		StringBuilder queryBuilder = new StringBuilder(AMENDMENT_SEARCH_QUERY);

		queryBuilder.append(" amendment.tenantid = :tenantid ");
		searchParamMap.addValue("tenantid", amendmentCriteria.getTenantId());
		
		if (!CollectionUtils.isEmpty(amendmentCriteria.getConsumerCode())) {

			addAndClause(queryBuilder);
			queryBuilder.append(" consumercode IN (:consumercode)");
			searchParamMap.addValue("consumercode", amendmentCriteria.getConsumerCode());
		}
		
		if (amendmentCriteria.getBusinessService() != null) {

			addAndClause(queryBuilder);
			queryBuilder.append(" businessservice= :businessservice");
			searchParamMap.addValue("businessservice", amendmentCriteria.getBusinessService());
		}
		
		if (amendmentCriteria.getAmendmentId() != null) {

			addAndClause(queryBuilder);
			queryBuilder.append(" amendment.amendmentid=:amendmentid");
			searchParamMap.addValue("amendmentid", amendmentCriteria.getAmendmentId());
		}
		
		if (amendmentCriteria.getStatus() != null) {

			addAndClause(queryBuilder);
			queryBuilder.append(" amendment.status=:status ");
			searchParamMap.addValue("status", amendmentCriteria.getStatus().toString());
		}
		
		addPagingClause(queryBuilder, searchParamMap);
		return queryBuilder.toString();
	}

	private static void addPagingClause(StringBuilder amendmentQueryBuilder, MapSqlParameterSource searchParamMap) {
		
		amendmentQueryBuilder.append(" LIMIT :limit ");
		searchParamMap.addValue("limit", 500);
		amendmentQueryBuilder.append(" OFFSET :offset");
		searchParamMap.addValue("offset", 0);
	}
	
	private static boolean addAndClause(StringBuilder queryString) {
		queryString.append(" AND ");
		return true;
	}

}
