package org.egov.swcalculation.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.exception.InvalidTenantIdException;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.swcalculation.repository.builder.SWCalculatorQueryBuilder;
import org.egov.swcalculation.repository.rowMapper.DemandSchedulerRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.egov.tracer.model.CustomException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class SewerageCalculatorDaoImpl implements SewerageCalculatorDao {
	
	@Autowired
	SWCalculatorQueryBuilder queryBuilder;
	
	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@Autowired
	DemandSchedulerRowMapper demandSchedulerRowMapper;

	@Autowired
	private MultiStateInstanceUtil centralInstanceutil;

	@Override
	public List<String> getTenantId(RequestInfo requestInfo) {
		String query = queryBuilder.getDistinctTenantIds();
		try {
			query = centralInstanceutil.replaceSchemaPlaceholder(query, requestInfo.getUserInfo().getTenantId());
		} catch (InvalidTenantIdException e) {
			throw new CustomException("SW_AS_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
		log.info("Tenant Id's List Query : "+query);
		return (ArrayList<String>) jdbcTemplate.queryForList(query, String.class);
	}

	@Override
	public List<String> getConnectionsNoList(String tenantId, String connectionType) {
		List<Object> preparedStatement = new ArrayList<>();
		String query = queryBuilder.getConnectionNumberList(tenantId, connectionType, preparedStatement);

		try {
			query = centralInstanceutil.replaceSchemaPlaceholder(query, tenantId);
		} catch (InvalidTenantIdException e) {
			throw new CustomException("SW_AS_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}

		StringBuilder builder = new StringBuilder();
		builder.append("sewerage ").append(connectionType).append(" connection list : ").append(query);
		log.info(builder.toString());
		return jdbcTemplate.query(query, preparedStatement.toArray(), demandSchedulerRowMapper);
	}

}
