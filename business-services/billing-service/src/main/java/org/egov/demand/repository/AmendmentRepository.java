package org.egov.demand.repository;

import static org.egov.demand.repository.querybuilder.AmendmentQueryBuilder.AMENDMENT_INSERT_QUERY;
import static org.egov.demand.repository.querybuilder.AmendmentQueryBuilder.AMENDMENT_TAXDETAIL_INSERT_QUERY;
import static org.egov.demand.repository.querybuilder.AmendmentQueryBuilder.AMENDMENT_UPDATE_QUERY;
import static org.egov.demand.repository.querybuilder.AmendmentQueryBuilder.DOCUMET_INSERT_QUERY;

import java.util.ArrayList;
import java.util.List;

import org.egov.demand.amendment.model.Amendment;
import org.egov.demand.amendment.model.AmendmentCriteria;
import org.egov.demand.amendment.model.AmendmentRequest;
import org.egov.demand.amendment.model.AmendmentUpdate;
import org.egov.demand.amendment.model.Document;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.repository.querybuilder.AmendmentQueryBuilder;
import org.egov.demand.repository.rowmapper.AmendmentRowMapper;
import org.egov.demand.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class AmendmentRepository {

	@Autowired
	private Util util;
	
	@Autowired
	private NamedParameterJdbcTemplate namedJdbcTemplate;
	
	@Autowired
	private AmendmentRowMapper amendmentRowMapper;
	
	@Autowired
	private AmendmentQueryBuilder amendmentQueryBuilder;
	
	@Transactional
	public void saveAmendment (AmendmentRequest amendmentRequest) {
		
		Amendment amendment = amendmentRequest.getAmendment();

		namedJdbcTemplate.update(AMENDMENT_INSERT_QUERY, getAmendmentSqlParameter(amendmentRequest));
		saveTaxDetail(amendment.getDemandDetails(), amendment.getId());
		savedocs(amendment.getDocuments(), amendment.getId());
	}
	
	private void saveTaxDetail(List<DemandDetail> demandDetails, String amendmentId) {

		List<MapSqlParameterSource> sqlParameterSources = getSqlParameterListForTaxDetails(demandDetails, amendmentId);
		namedJdbcTemplate.batchUpdate(AMENDMENT_TAXDETAIL_INSERT_QUERY, sqlParameterSources.toArray(new MapSqlParameterSource[0]));
	}
	
	private void savedocs(List<Document> documents, String amendmentId) {

		List<MapSqlParameterSource> sqlParameterSources = getSqlParameterListForDocs(documents, amendmentId);
		namedJdbcTemplate.batchUpdate(DOCUMET_INSERT_QUERY, sqlParameterSources.toArray(new MapSqlParameterSource[0]));
	}

	public List<Amendment> getAmendments (AmendmentCriteria amendmentCriteria) {

		MapSqlParameterSource searchParamMap = new MapSqlParameterSource();
		String searchQuery = amendmentQueryBuilder.getSearchQuery(amendmentCriteria, searchParamMap);
		return namedJdbcTemplate.query(searchQuery, searchParamMap, amendmentRowMapper);
	}

	@Transactional
	public void updateAmendment(List<AmendmentUpdate> amendmentUpdates) {

		List<MapSqlParameterSource> sqlParameterSources = getSqlParameterListForAmendmentUpdate(amendmentUpdates);
		namedJdbcTemplate.batchUpdate(AMENDMENT_UPDATE_QUERY, sqlParameterSources.toArray(new MapSqlParameterSource[0]));
	}

	/*
	 * map-sql-parameter construction methods
	 */
	public SqlParameterSource getAmendmentSqlParameter(AmendmentRequest amendmentRequest) {

		MapSqlParameterSource mapSqlParameterSource = new MapSqlParameterSource();
		Amendment amendment = amendmentRequest.getAmendment();
		AuditDetails auditDetails = amendment.getAuditDetails();

		mapSqlParameterSource.addValue("id", amendment.getId());
		mapSqlParameterSource.addValue("tenantid", amendment.getTenantId());
		mapSqlParameterSource.addValue("amendmentid", amendment.getAmendmentId());
		mapSqlParameterSource.addValue("businessservice", amendment.getBusinessService());
		mapSqlParameterSource.addValue("consumercode", amendment.getConsumerCode());
		mapSqlParameterSource.addValue("amendmentreason", amendment.getAmendmentReason().toString());
		mapSqlParameterSource.addValue("reasondocumentnumber", amendment.getReasonDocumentNumber());
		mapSqlParameterSource.addValue("status", amendment.getStatus().toString());
		mapSqlParameterSource.addValue("effectivetill", amendment.getEffectiveTill());
		mapSqlParameterSource.addValue("effectivefrom", amendment.getEffectiveFrom());
		mapSqlParameterSource.addValue("amendeddemandid", amendment.getAmendedDemandId());
		mapSqlParameterSource.addValue("createdby", auditDetails.getCreatedBy());
		mapSqlParameterSource.addValue("createdtime", auditDetails.getCreatedTime());
		mapSqlParameterSource.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
		mapSqlParameterSource.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
		mapSqlParameterSource.addValue("additionaldetails", util.getPGObject(amendment.getAdditionalDetails()));

		return mapSqlParameterSource;
	}

	private List<MapSqlParameterSource> getSqlParameterListForTaxDetails(List<DemandDetail> demandDetails,
			String amendmentId) {

		List<MapSqlParameterSource> taxDetailParamMapList = new ArrayList<>();
		for (DemandDetail detail : demandDetails) {

			MapSqlParameterSource taxDetailParamMap = new MapSqlParameterSource();
			taxDetailParamMap.addValue("id", detail.getId());
			taxDetailParamMap.addValue("amendmentid", amendmentId);
			taxDetailParamMap.addValue("taxheadcode", detail.getTaxHeadMasterCode());
			taxDetailParamMap.addValue("taxamount", detail.getTaxAmount());
			taxDetailParamMapList.add(taxDetailParamMap);
		}
		return taxDetailParamMapList;
	}

	private List<MapSqlParameterSource> getSqlParameterListForDocs(List<Document> documents, String amendmentId) {

		List<MapSqlParameterSource> documentsParamMapList = new ArrayList<>();
		for (Document document : documents) {

			MapSqlParameterSource documentParamMap = new MapSqlParameterSource();
			documentParamMap.addValue("id", document.getId());
			documentParamMap.addValue("amendmentid", amendmentId);
			documentParamMap.addValue("documenttype", document.getDocumentType());
			documentParamMap.addValue("filestoreid", document.getFileStoreId());
			documentParamMap.addValue("documentuid", document.getDocumentUid());
			documentParamMap.addValue("status", "ACTIVE");
			documentsParamMapList.add(documentParamMap);
		}

		return documentsParamMapList;
	}

	private List<MapSqlParameterSource> getSqlParameterListForAmendmentUpdate(List<AmendmentUpdate> amendmentUpdates) {

		List<MapSqlParameterSource> updateParamMapList = new ArrayList<>();
		for (AmendmentUpdate amendmentUpdate : amendmentUpdates) {

			AuditDetails auditDetails = amendmentUpdate.getAuditDetails();
			MapSqlParameterSource updateParamMap = new MapSqlParameterSource();

			updateParamMap.addValue("status", amendmentUpdate.getStatus().toString());
			updateParamMap.addValue("amendeddemandid", amendmentUpdate.getAmendedDemandId());
			updateParamMap.addValue("lastmodifiedby", auditDetails.getLastModifiedBy());
			updateParamMap.addValue("lastmodifiedtime", auditDetails.getLastModifiedTime());
			updateParamMap.addValue("additionaldetails", util.getPGObject(amendmentUpdate.getAdditionalDetails()));
			updateParamMap.addValue("tenantid", amendmentUpdate.getTenantId());
			updateParamMap.addValue("amendmentid", amendmentUpdate.getAmendmentId());
			updateParamMap.addValue("amendmentreason", amendmentUpdate.getAmendmentReason().toString());
			updateParamMap.addValue("reasondocumentnumber", amendmentUpdate.getReasonDocumentNumber());
			updateParamMap.addValue("effectivefrom", amendmentUpdate.getEffectiveFrom());
			updateParamMap.addValue("effectivetill", amendmentUpdate.getEffectiveTill());

			updateParamMapList.add(updateParamMap);
		}
		return updateParamMapList;
	}

}
