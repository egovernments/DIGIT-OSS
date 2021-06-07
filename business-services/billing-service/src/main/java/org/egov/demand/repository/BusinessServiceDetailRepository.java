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

import static org.egov.demand.util.Constants.BUSINESSSERVICE_EXPRESSION;
import static org.egov.demand.util.Constants.BUSINESSSERVICE_IDS_FILTER;
import static org.egov.demand.util.Constants.BUSINESSSERVICE_MASTERNAME;
import static org.egov.demand.util.Constants.BUSINESSSERVICE_SERVICES_FILTER;
import static org.egov.demand.util.Constants.MDMS_NO_FILTER_BUSINESSSERVICE;
import static org.egov.demand.util.Constants.MODULE_NAME;

import java.util.Collections;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

@Repository
public class BusinessServiceDetailRepository {

    @Autowired
    private Util util;
    
    @Autowired
    private ObjectMapper mapper;


    /**
     * Fetches the BussinessServiceDetail based on search criteria
     * @param requestInfo The requestInfo of the search request
     * @param BusinessServiceDetailsCriteria The search criteria for BussinessServiceDetailBussinessServiceDetail
     * @return List of BussinessServiceDetail
     */
    public List<BusinessServiceDetail> getBussinessServiceDetail(RequestInfo requestInfo,BusinessServiceDetailCriteria BusinessServiceDetailsCriteria){

        MdmsCriteriaReq mdmsCriteriaReq = util.prepareMdMsRequest(BusinessServiceDetailsCriteria.getTenantId(),
                MODULE_NAME, Collections.singletonList(BUSINESSSERVICE_MASTERNAME), null,
                requestInfo);

        DocumentContext documentContext = util.getAttributeValues(mdmsCriteriaReq);

        StringBuilder filterExpression = new StringBuilder();

		if (BusinessServiceDetailsCriteria.getId() != null && !BusinessServiceDetailsCriteria.getId().isEmpty()) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(
					BUSINESSSERVICE_IDS_FILTER.replace("VAL", util.getStringVal(BusinessServiceDetailsCriteria.getId())));
		}
		
		if (!CollectionUtils.isEmpty(BusinessServiceDetailsCriteria.getBusinessService())) {
			if (filterExpression.length() != 0)
				filterExpression.append(" && ");
			filterExpression.append(BUSINESSSERVICE_SERVICES_FILTER.replace("VAL",
					util.getStringVal(BusinessServiceDetailsCriteria.getBusinessService())));
		}

        String jsonPath;
        if(filterExpression.length()!=0)
            jsonPath = BUSINESSSERVICE_EXPRESSION.replace("EXPRESSION",filterExpression.toString());
        else jsonPath = MDMS_NO_FILTER_BUSINESSSERVICE;

        return  mapper.convertValue(documentContext.read(jsonPath), new TypeReference<List<BusinessServiceDetail>>() {});
    }

}
