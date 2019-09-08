/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.demand.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.BillDetail;
import org.egov.demand.model.CollectedReceipt;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.DemandDetailCriteria;
import org.egov.demand.model.DemandUpdateMisRequest;
import org.egov.demand.repository.querybuilder.DemandQueryBuilder;
import org.egov.demand.repository.rowmapper.CollectedReceiptsRowMapper;
import org.egov.demand.repository.rowmapper.DemandDetailRowMapper;
import org.egov.demand.repository.rowmapper.DemandRowMapper;
import org.egov.demand.util.Constants;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class DemandRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private DemandQueryBuilder demandQueryBuilder;
	
	@Autowired
	private SequenceGenService sequenceGenService;
	
	@Autowired
	private ApplicationProperties applicationProperties;
	
	@Autowired
	private DemandRowMapper demandRowMapper;
	
	@Autowired
	private ObjectMapper mapper;
	
	public List<Demand> getDemands(DemandCriteria demandCriteria) {

		List<Object> preparedStatementValues = new ArrayList<>();
		String searchDemandQuery = demandQueryBuilder.getDemandQuery(demandCriteria, preparedStatementValues);
		return jdbcTemplate.query(searchDemandQuery, preparedStatementValues.toArray(), new DemandRowMapper());
	}
	
	/**
	 * Fetches demand from DB based on a map of business code and set of consumer codes
	 * 
	 * @param businessConsumercodeMap
	 * @param tenantId
	 * @return
	 */
	public List<Demand> getDemandsForConsumerCodes(Map<String, Set<String>> businessConsumercodeMap, String tenantId) {

		List<Object> presparedStmtList = new ArrayList<>();
		String sql = demandQueryBuilder.getDemandQueryForConsumerCodes(businessConsumercodeMap, presparedStmtList,
				tenantId);
		return jdbcTemplate.query(sql, presparedStmtList.toArray(), demandRowMapper);
	}

	public List<DemandDetail> getDemandDetails(DemandDetailCriteria demandDetailCriteria) {

		List<Object> preparedStatementValues = new ArrayList<>();
		String searchDemandDetailQuery = DemandQueryBuilder.getDemandDetailQuery(demandDetailCriteria,preparedStatementValues);
		return jdbcTemplate.query(searchDemandDetailQuery, preparedStatementValues.toArray(),new DemandDetailRowMapper());
	}

	@Transactional
	public void save(DemandRequest demandRequest) {

		log.debug("DemandRepository save, the request object : " + demandRequest);
		List<Demand> demands = demandRequest.getDemands();
		List<DemandDetail> demandDetails = new ArrayList<>();
		
		for (Demand demand : demands) {
			demandDetails.addAll(demand.getDemandDetails());
		}
		
		insertBatch(demands, demandDetails);
		log.debug("Demands saved >>>> ");
		insertBatchForAudit(demands, demandDetails);
	}
	
	@Transactional
	public void update(DemandRequest demandRequest) {

		List<Demand> demands = demandRequest.getDemands();
		List<Demand> oldDemands = new ArrayList<>();
		List<DemandDetail> oldDemandDetails = new ArrayList<>();
		List<Demand> newDemands = new ArrayList<>();
		List<DemandDetail> newDemandDetails = new ArrayList<>();

		DemandCriteria demandCriteria = DemandCriteria.builder()
				.demandId(demands.stream().map(Demand::getId).collect(Collectors.toSet()))
				.tenantId(demands.get(0).getTenantId()).build();
		List<Demand> existingDemands = getDemands(demandCriteria);
		
		log.debug("repository demands "+existingDemands);
		Map<String, String> existingDemandMap = existingDemands.stream().collect(
						Collectors.toMap(Demand::getId, Demand::getId));
		Map<String, String> existingDemandDetailMap = new HashMap<>();
		for (Demand demand : existingDemands) {
			for (DemandDetail demandDetail : demand.getDemandDetails())
				existingDemandDetailMap.put(demandDetail.getId(), demandDetail.getId());
		}

		for (Demand demand : demands) {
			if (existingDemandMap.get(demand.getId()) == null)
				newDemands.add(demand);
			else
				oldDemands.add(demand);
			for (DemandDetail demandDetail : demand.getDemandDetails()) {
				if (existingDemandDetailMap.get(demandDetail.getId()) == null)
					newDemandDetails.add(demandDetail);
				else
					oldDemandDetails.add(demandDetail);
			}
		}
		
		updateBatch(oldDemands, oldDemandDetails);
		insertBatchForAudit(oldDemands, oldDemandDetails);
		
		if (!newDemands.isEmpty() || !newDemandDetails.isEmpty()) {
			
			insertBatch(newDemands, newDemandDetails);
			insertBatchForAudit(newDemands, newDemandDetails);
		}
	}

	public void insertBatch(List<Demand> newDemands, List<DemandDetail> newDemandDetails) {

		jdbcTemplate.batchUpdate(DemandQueryBuilder.DEMAND_INSERT_QUERY, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps, int rowNum) throws SQLException {
				
				Demand demand = newDemands.get(rowNum);
				String status = demand.getStatus() != null ? demand.getStatus().toString() : null;
				AuditDetails auditDetail = demand.getAuditDetails();
				String payerUuid = null != demand.getPayer() ? demand.getPayer().getUuid() : null;
				ps.setString(1, demand.getId());
				ps.setString(2, demand.getConsumerCode());
				ps.setString(3, demand.getConsumerType());
				ps.setString(4, demand.getBusinessService());
				ps.setString(5, payerUuid);
				ps.setLong(6, demand.getTaxPeriodFrom());
				ps.setLong(7, demand.getTaxPeriodTo());
				ps.setBigDecimal(8, demand.getMinimumAmountPayable());
				ps.setString(9, auditDetail.getCreatedBy());
				ps.setString(10, auditDetail.getLastModifiedBy());
				ps.setLong(11, auditDetail.getCreatedTime());
				ps.setLong(12, auditDetail.getLastModifiedTime());
				ps.setString(13, demand.getTenantId());
				ps.setString(14, status);
				ps.setObject(15, getPGObject(demand.getAdditionalDetails()));
				ps.setObject(16, demand.getBillExpiryTime());
			}

			@Override
			public int getBatchSize() {
				return newDemands.size();
			}
		});

		jdbcTemplate.batchUpdate(DemandQueryBuilder.DEMAND_DETAIL_INSERT_QUERY, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps, int rowNum) throws SQLException {
				
				DemandDetail demandDetail = newDemandDetails.get(rowNum);
				AuditDetails auditDetail = demandDetail.getAuditDetails();
				ps.setString(1, demandDetail.getId());
				ps.setString(2, demandDetail.getDemandId());
				ps.setString(3, demandDetail.getTaxHeadMasterCode());
				ps.setBigDecimal(4, demandDetail.getTaxAmount());
				ps.setBigDecimal(5, demandDetail.getCollectionAmount());
				ps.setString(6, auditDetail.getCreatedBy());
				ps.setString(7, auditDetail.getLastModifiedBy());
				ps.setLong(8, auditDetail.getCreatedTime());
				ps.setLong(9, auditDetail.getLastModifiedTime());
				ps.setString(10, demandDetail.getTenantId());
				ps.setObject(11, getPGObject(demandDetail.getAdditionalDetails()));
			}

			@Override
			public int getBatchSize() {
				return newDemandDetails.size();
			}
		});
	}
	
	public void updateBatch(List<Demand> oldDemands, List<DemandDetail> oldDemandDetails) {

		jdbcTemplate.batchUpdate(DemandQueryBuilder.DEMAND_UPDATE_QUERY, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int rowNum) throws SQLException {
				Demand demand = oldDemands.get(rowNum);

				String status = demand.getStatus() != null ? demand.getStatus().toString() : null;
				String payerUuid = null != demand.getPayer() ? demand.getPayer().getUuid() : null;
				AuditDetails auditDetail = demand.getAuditDetails();

				ps.setString(1, payerUuid);
				ps.setLong(2, demand.getTaxPeriodFrom());
				ps.setLong(3, demand.getTaxPeriodTo());
				ps.setBigDecimal(4, demand.getMinimumAmountPayable());
				ps.setString(5, auditDetail.getLastModifiedBy());
				ps.setLong(6, auditDetail.getLastModifiedTime());
				ps.setString(7, demand.getTenantId());
				ps.setString(8, status);
				ps.setObject(9, getPGObject(demand.getAdditionalDetails()));
				ps.setObject(10, demand.getBillExpiryTime());
				ps.setString(11, demand.getId());
				ps.setString(12, demand.getTenantId());
			}

			@Override
			public int getBatchSize() {
				return oldDemands.size();
			}
		});

		jdbcTemplate.batchUpdate(DemandQueryBuilder.DEMAND_DETAIL_UPDATE_QUERY, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int rowNum) throws SQLException {
				DemandDetail demandDetail = oldDemandDetails.get(rowNum);
				AuditDetails auditDetail = demandDetail.getAuditDetails();

				ps.setBigDecimal(1, demandDetail.getTaxAmount());
				ps.setBigDecimal(2, demandDetail.getCollectionAmount());
				ps.setString(3, auditDetail.getLastModifiedBy());
				ps.setLong(4, auditDetail.getLastModifiedTime());
				ps.setObject(5, getPGObject(demandDetail.getAdditionalDetails()));
				ps.setString(6, demandDetail.getId());
				ps.setString(7, demandDetail.getDemandId());
				ps.setString(8, demandDetail.getTenantId());
			}

			@Override
			public int getBatchSize() {
				return oldDemandDetails.size();
			}
		});
	}
	
	
	/*
	 * Audit 
	 */
	
	@Transactional
	public void insertBatchForAudit(List<Demand> demands, List<DemandDetail> demandDetails) {

		jdbcTemplate.batchUpdate(DemandQueryBuilder.DEMAND_AUDIT_INSERT_QUERY, new BatchPreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps, int rowNum) throws SQLException {

				Demand demand = demands.get(rowNum);
				String status = demand.getStatus() != null ? demand.getStatus().toString() : null;
				AuditDetails auditDetail = demand.getAuditDetails();
				String payerUuid = null != demand.getPayer() ? demand.getPayer().getUuid() : null;
				ps.setString(1, demand.getId());
				ps.setString(2, demand.getConsumerCode());
				ps.setString(3, demand.getConsumerType());
				ps.setString(4, demand.getBusinessService());
				ps.setString(5, payerUuid);
				ps.setLong(6, demand.getTaxPeriodFrom());
				ps.setLong(7, demand.getTaxPeriodTo());
				ps.setBigDecimal(8, demand.getMinimumAmountPayable());
				ps.setString(9, auditDetail.getLastModifiedBy());
				ps.setLong(10, auditDetail.getLastModifiedTime());
				ps.setString(11, demand.getTenantId());
				ps.setString(12, status);
				ps.setObject(13, getPGObject(demand.getAdditionalDetails()));
				ps.setString(14, UUID.randomUUID().toString());
				ps.setObject(15, demand.getBillExpiryTime());
			}

			@Override
			public int getBatchSize() {
				return demands.size();
			}
		});

		jdbcTemplate.batchUpdate(DemandQueryBuilder.DEMAND_DETAIL_AUDIT_INSERT_QUERY,
				new BatchPreparedStatementSetter() {
					@Override
					public void setValues(PreparedStatement ps, int rowNum) throws SQLException {

						DemandDetail demandDetail = demandDetails.get(rowNum);
						AuditDetails auditDetail = demandDetail.getAuditDetails();
						ps.setString(1, demandDetail.getId());
						ps.setString(2, demandDetail.getDemandId());
						ps.setString(3, demandDetail.getTaxHeadMasterCode());
						ps.setBigDecimal(4, demandDetail.getTaxAmount());
						ps.setBigDecimal(5, demandDetail.getCollectionAmount());
						ps.setString(6, auditDetail.getLastModifiedBy());
						ps.setLong(7, auditDetail.getLastModifiedTime());
						ps.setString(8, demandDetail.getTenantId());
						ps.setObject(9, getPGObject(demandDetail.getAdditionalDetails()));
						ps.setString(10, UUID.randomUUID().toString());
					}

					@Override
					public int getBatchSize() {
						return demandDetails.size();
					}
				});
	}
	
	//update mis method for updating consumer code
	@Deprecated
	public void updateMIS(DemandUpdateMisRequest demandRequest) {

		jdbcTemplate.update(demandQueryBuilder.getDemandUpdateMisQuery(demandRequest), new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setString(1, demandRequest.getConsumerCode());
				ps.setString(2, demandRequest.getRequestInfo().getDid());
				ps.setLong(3, new Date().getTime());
				ps.setString(4, demandRequest.getTenantId());
			}
		});
	}
	
	@Deprecated
	public void saveCollectedReceipts(List<BillDetail> billDetails,RequestInfo requestInfo) {
		List<String> ids=sequenceGenService.getIds(billDetails.size(), applicationProperties.getCollectedReceiptSequence());
		
		jdbcTemplate.batchUpdate(DemandQueryBuilder.COLLECTED_RECEIPT_INSERT_QUERY, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int rowNum) throws SQLException {
				BillDetail billDetail = billDetails.get(rowNum);
				ps.setString(1, ids.get(rowNum));
				ps.setString(2, billDetail.getBusinessService());
				ps.setString(3, billDetail.getConsumerCode());
				ps.setString(4, null);
				ps.setBigDecimal(5, billDetail.getTotalAmount());
				ps.setObject(6, null);
				ps.setString(7, billDetail.getStatus().toString());
				ps.setString(8, billDetail.getTenantId());
				ps.setString(9, requestInfo.getUserInfo().getId().toString());
				ps.setLong(10, new Date().getTime());
				ps.setString(11, requestInfo.getUserInfo().getId().toString());
				ps.setLong(12, new Date().getTime());
			}

			@Override
			public int getBatchSize() {
				return billDetails.size();
			}
		});
	}
	
	@Deprecated
	public List<CollectedReceipt> getCollectedReceipts(DemandCriteria demandCriteria){
		return jdbcTemplate.query(demandQueryBuilder.getCollectedReceiptsQuery(demandCriteria), new CollectedReceiptsRowMapper());
	}

	/*
	 * Utility methods
	 */
	/**
	 * converts the object to a pgObject for persistence
	 * 
	 * @param additionalDetails
	 * @return
	 */
	private PGobject getPGObject(Object additionalDetails) {

		String value = null;
		try {
			value = mapper.writeValueAsString(additionalDetails);
		} catch (JsonProcessingException e) {
			throw new CustomException(Constants.EG_BS_JSON_EXCEPTION_KEY, Constants.EG_BS_JSON_EXCEPTION_MSG);
		}

		PGobject json = new PGobject();
		json.setType(Constants.DB_TYPE_JSONB);
		try {
			json.setValue(value);
		} catch (SQLException e) {
			throw new CustomException(Constants.EG_BS_JSON_EXCEPTION_KEY, Constants.EG_BS_JSON_EXCEPTION_MSG);
		}
		return json;
	}
}