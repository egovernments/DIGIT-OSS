package org.egov.land.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.exception.InvalidTenantIdException;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.land.config.LandConfiguration;
import org.egov.land.producer.Producer;
import org.egov.land.repository.querybuilder.LandQueryBuilder;
import org.egov.land.repository.rowmapper.LandRowMapper;
import org.egov.land.web.models.LandInfo;
import org.egov.land.web.models.LandInfoRequest;
import org.egov.land.web.models.LandSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class LandRepository {

	@Autowired
	private LandConfiguration config;

	@Autowired
	private Producer producer;
	
	@Autowired
	private LandQueryBuilder queryBuilder;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private LandRowMapper rowMapper;

	@Autowired
	private MultiStateInstanceUtil centralInstanceUtil;

	/**
	 * Pushes the request on save topic through kafka
	 *
	 * @param bpaRequest
	 *            The landinfo create request
	 */
	public void save(String tenantId, LandInfoRequest landRequest) {
		producer.push(tenantId, config.getSaveLandInfoTopic(), landRequest);
	}

	public void update(String tenantId, LandInfoRequest landRequest) {
		producer.push(tenantId, config.getUpdateLandInfoTopic(), landRequest);
	}
	
	/**
	 * LandInfo search in database
	 *
	 * @param criteria
	 *            The LandInfo Search criteria
	 * @return List of LandInfo from search
	 */
	public List<LandInfo> getLandInfoData(LandSearchCriteria criteria) {
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getLandInfoSearchQuery(criteria, preparedStmtList);
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, criteria.getTenantId());
		} catch (InvalidTenantIdException e) {
			throw new CustomException("LAND_SEARCH_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
		List<LandInfo> landInfoData = jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
		if(!CollectionUtils.isEmpty(landInfoData)) {
			log.debug("Received data from Query..");
		}
		return landInfoData;
	}
}
