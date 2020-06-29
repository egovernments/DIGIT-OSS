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

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.util.Util;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

@Repository
public class TaxHeadMasterRepository {

	@Autowired
	private Util util;

	@Autowired
	private ObjectMapper mapper;

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

		return mapper.convertValue(documentContext.read(jsonPath), new TypeReference<List<TaxHeadMaster>>() {
		});
	}
}
