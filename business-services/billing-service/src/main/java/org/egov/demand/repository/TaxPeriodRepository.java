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

import static org.egov.demand.util.Constants.MDMS_NO_FILTER_TAXPERIOD;
import static org.egov.demand.util.Constants.MODULE_NAME;
import static org.egov.demand.util.Constants.TAXPERIOD_CODE_SEARCH_FILTER;
import static org.egov.demand.util.Constants.TAXPERIOD_DATE_FILTER;
import static org.egov.demand.util.Constants.TAXPERIOD_EXPRESSION;
import static org.egov.demand.util.Constants.TAXPERIOD_FROMDATE_FILTER;
import static org.egov.demand.util.Constants.TAXPERIOD_IDS_FILTER;
import static org.egov.demand.util.Constants.TAXPERIOD_MASTERNAME;
import static org.egov.demand.util.Constants.TAXPERIOD_PERIODCYCLE_FILTER;
import static org.egov.demand.util.Constants.TAXPERIOD_SERVICES_FILTER;
import static org.egov.demand.util.Constants.TAXPERIOD_TODATE_FILTER;

import java.util.Collections;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

@Repository
public class TaxPeriodRepository {

	@Autowired
	private Util util;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Fetches the TaxPeriod based on search criteria
	 * 
	 * @param requestInfo       The requestInfo of the search request
	 * @param taxPeriodCriteria The search criteria for TaxPeriod
	 * @return List of TaxPeriod
	 */
	public List<TaxPeriod> getTaxPeriod(RequestInfo requestInfo, TaxPeriodCriteria taxPeriodCriteria) {

		MdmsCriteriaReq mdmsCriteriaReq = util.prepareMdMsRequest(taxPeriodCriteria.getTenantId(), MODULE_NAME,
				Collections.singletonList(TAXPERIOD_MASTERNAME), null, requestInfo);

		DocumentContext documentContext = util.getAttributeValues(mdmsCriteriaReq);
		StringBuilder filterExpression = new StringBuilder();

		if (taxPeriodCriteria.getCode() != null) {
			filterExpression.append(TAXPERIOD_CODE_SEARCH_FILTER.replace("VAL", taxPeriodCriteria.getCode()));
		}

		if (taxPeriodCriteria.getId() != null && !taxPeriodCriteria.getId().isEmpty()) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(TAXPERIOD_IDS_FILTER.replace("VAL", util.getStringVal(taxPeriodCriteria.getId())));
		}
		if (!CollectionUtils.isEmpty(taxPeriodCriteria.getService())) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(
					TAXPERIOD_SERVICES_FILTER.replace("VAL", util.getStringVal(taxPeriodCriteria.getService())));
		}

		if (taxPeriodCriteria.getFromDate() != null) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression
					.append(TAXPERIOD_FROMDATE_FILTER.replace("VAL", taxPeriodCriteria.getFromDate().toString()));
		}

		if (taxPeriodCriteria.getToDate() != null) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(TAXPERIOD_TODATE_FILTER.replace("VAL", taxPeriodCriteria.getToDate().toString()));
		}

		if (taxPeriodCriteria.getDate() != null) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(TAXPERIOD_DATE_FILTER.replace("VAL", taxPeriodCriteria.getDate().toString()));
		}

		if (taxPeriodCriteria.getPeriodCycle() != null) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression
					.append(TAXPERIOD_PERIODCYCLE_FILTER.replace("VAL", taxPeriodCriteria.getPeriodCycle().toString()));
		}

		String jsonPath;
		if (filterExpression.length() != 0)
			jsonPath = TAXPERIOD_EXPRESSION.replace("EXPRESSION", filterExpression.toString());
		else
			jsonPath = MDMS_NO_FILTER_TAXPERIOD;

		return mapper.convertValue(documentContext.read(jsonPath), new TypeReference<List<TaxPeriod>>() {
		});
	}
}
