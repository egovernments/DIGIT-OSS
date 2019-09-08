package org.egov.demand.repository;

import static org.egov.demand.util.Constants.MDMS_NO_FILTER_TAXHEADMASTER;
import static org.egov.demand.util.Constants.MODULE_NAME;
import static org.egov.demand.util.Constants.TAXHEADMASTER_CATEGORY_FILTER;
import static org.egov.demand.util.Constants.TAXHEADMASTER_CODES_FILTER;
import static org.egov.demand.util.Constants.TAXHEADMASTER_EXPRESSION;
import static org.egov.demand.util.Constants.TAXHEADMASTER_IDS_FILTER;
import static org.egov.demand.util.Constants.TAXHEADMASTER_ISACTUALAMOUNT_FILTER;
import static org.egov.demand.util.Constants.TAXHEADMASTER_ISDEBIT_FILTER;
import static org.egov.demand.util.Constants.TAXHEADMASTER_NAME_FILTER;
import static org.egov.demand.util.Constants.TAXHEADMASTER_SERVICE_FILTER;
import static org.egov.demand.util.Constants.TAXHEAD_MASTERNAME;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.repository.querybuilder.TaxHeadMasterQueryBuilder;
import org.egov.demand.repository.rowmapper.TaxHeadMasterRowMapper;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.TaxHeadMasterRequest;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class TaxHeadMasterRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private TaxHeadMasterQueryBuilder taxHeadMasterQueryBuilder;
	
	@Autowired
	private TaxHeadMasterRowMapper taxHeadMasterRowMapper;

	@Autowired
	private Util util;

	@Autowired
	private ObjectMapper mapper;
	
	public List<TaxHeadMaster> findForCriteria(TaxHeadMasterCriteria taxHeadMasterCriteria) {

		List<Object> preparedStatementValues = new ArrayList<>();
		String queryStr = taxHeadMasterQueryBuilder.getQuery(taxHeadMasterCriteria, preparedStatementValues);
		return jdbcTemplate.query(queryStr, preparedStatementValues.toArray(), taxHeadMasterRowMapper);
	}

	/**
	 * Fetches the taxHeadMaster based on search criteria
	 * 
	 * @param requestInfo           The requestInfo of the search request
	 * @param taxHeadMasterCriteria The search criteria for taxHeads
	 * @return List of taxHeads
	 */
	public List<TaxHeadMaster> getTaxHeadMaster(RequestInfo requestInfo, TaxHeadMasterCriteria taxHeadMasterCriteria) {

		String filter = null;
		if (null != taxHeadMasterCriteria.getService())
			filter = TAXHEADMASTER_SERVICE_FILTER.replace("{}", taxHeadMasterCriteria.getService());

		MdmsCriteriaReq mdmsCriteriaReq = util.prepareMdMsRequest(taxHeadMasterCriteria.getTenantId(), MODULE_NAME,
				Collections.singletonList(TAXHEAD_MASTERNAME), filter, requestInfo);

		DocumentContext documentContext = util.getAttributeValues(mdmsCriteriaReq);

		StringBuilder filterExpression = new StringBuilder();

		if (taxHeadMasterCriteria.getName() != null) {
			filterExpression.append(TAXHEADMASTER_NAME_FILTER.replace("VAL", taxHeadMasterCriteria.getName()));
		}

		if (taxHeadMasterCriteria.getId() != null && !taxHeadMasterCriteria.getId().isEmpty()) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression
					.append(TAXHEADMASTER_IDS_FILTER.replace("VAL", util.getStringVal(taxHeadMasterCriteria.getId())));
		}
		if (!CollectionUtils.isEmpty(taxHeadMasterCriteria.getCode())) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(
					TAXHEADMASTER_CODES_FILTER.replace("VAL", util.getStringVal(taxHeadMasterCriteria.getCode())));
		}

		if (!StringUtils.isEmpty(taxHeadMasterCriteria.getCategory())) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(TAXHEADMASTER_CATEGORY_FILTER.replace("VAL", taxHeadMasterCriteria.getCategory()));
		}

		if (taxHeadMasterCriteria.getIsActualDemand() != null) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(TAXHEADMASTER_ISACTUALAMOUNT_FILTER.replace("VAL",
					taxHeadMasterCriteria.getIsActualDemand().toString()));
		}

		if (taxHeadMasterCriteria.getIsDebit() != null) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression
					.append(TAXHEADMASTER_ISDEBIT_FILTER.replace("VAL", taxHeadMasterCriteria.getIsDebit().toString()));
		}

		String jsonPath;
		if (filterExpression.length() != 0)
			jsonPath = TAXHEADMASTER_EXPRESSION.replace("EXPRESSION", filterExpression.toString());
		else
			jsonPath = MDMS_NO_FILTER_TAXHEADMASTER;

		return mapper.convertValue(documentContext.read(jsonPath), new TypeReference<List<TaxHeadMaster>>() {});
	}


	
	@Transactional
	public List<TaxHeadMaster> create(TaxHeadMasterRequest taxHeadMasterRequest){
		
		RequestInfo requestInfo = taxHeadMasterRequest.getRequestInfo();
		List<TaxHeadMaster> taxHeadMasters = taxHeadMasterRequest.getTaxHeadMasters();
		log.debug("create requestInfo:"+ requestInfo);
		log.debug("create taxHeadMasters:"+ taxHeadMasters);
		
		jdbcTemplate.batchUpdate(TaxHeadMasterQueryBuilder.INSERT_QUERY, new BatchPreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				TaxHeadMaster taxHeadMaster = taxHeadMasters.get(index);

				ps.setString(1, taxHeadMaster.getId());
				ps.setString(2, taxHeadMaster.getTenantId());
				
				if(taxHeadMaster.getCategory().toString()!=null)
					ps.setString(3, taxHeadMaster.getCategory().toString());
				
				ps.setString(4, taxHeadMaster.getService());
				ps.setString(5, taxHeadMaster.getName());
				ps.setString(6, taxHeadMaster.getCode());
				ps.setBoolean(7, taxHeadMaster.getIsDebit());
				ps.setBoolean(8, taxHeadMaster.getIsActualDemand());
				ps.setObject(9, taxHeadMaster.getOrder());
				ps.setObject(10, taxHeadMaster.getValidFrom());
				ps.setObject(11, taxHeadMaster.getValidTill());
				ps.setString(12, requestInfo.getUserInfo().getId().toString());
				ps.setLong(13, new Date().getTime());
				ps.setString(14, requestInfo.getUserInfo().getId().toString());
				ps.setLong(15, new Date().getTime());
			}
			
			@Override
			public int getBatchSize() {
				return taxHeadMasters.size();
			}
		});
		return taxHeadMasters;
	}






	
	@Transactional
	public List<TaxHeadMaster> update(TaxHeadMasterRequest taxHeadMasterRequest) {
		RequestInfo requestInfo = taxHeadMasterRequest.getRequestInfo();
		List<TaxHeadMaster> taxHeadMasters = taxHeadMasterRequest.getTaxHeadMasters();
		log.debug("update requestInfo:"+ requestInfo);
		log.debug("update taxHeadMasters:"+ taxHeadMasters);
		
		jdbcTemplate.batchUpdate(TaxHeadMasterQueryBuilder.UPDATE_QUERY, new BatchPreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				TaxHeadMaster taxHeadMaster = taxHeadMasters.get(index);
				if(taxHeadMaster.getCategory().toString()!=null)
					ps.setString(1, taxHeadMaster.getCategory().toString());
				
				ps.setString(2, taxHeadMaster.getService());
				ps.setString(3, taxHeadMaster.getName());
				ps.setString(4, taxHeadMaster.getCode());
				ps.setBoolean(5, taxHeadMaster.getIsDebit());
				ps.setBoolean(6, taxHeadMaster.getIsActualDemand());
				ps.setObject(7, taxHeadMaster.getOrder());
				ps.setObject(8, taxHeadMaster.getValidFrom());
				ps.setObject(9, taxHeadMaster.getValidTill());
				ps.setString(10, requestInfo.getUserInfo().getId().toString());
				ps.setLong(11, new Date().getTime());
				ps.setString(12, taxHeadMaster.getTenantId());
				ps.setString(13, taxHeadMaster.getId());
			}
			@Override
			public int getBatchSize() {
				return taxHeadMasters.size();
			}
		});
		return taxHeadMasters;
		}
}
