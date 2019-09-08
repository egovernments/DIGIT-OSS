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

import static org.egov.demand.util.Constants.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.repository.querybuilder.BusinessServDetailQueryBuilder;
import org.egov.demand.repository.rowmapper.BusinessServDetailRowMapper;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.demand.web.contract.BusinessServiceDetailRequest;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

@Repository
public class BusinessServiceDetailRepository {

    private static final Logger logger = LoggerFactory.getLogger(BusinessServiceDetailRepository.class);

    @Autowired
    private Util util;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private BusinessServDetailRowMapper businessServDetailRowMapper;

    @Autowired
    private BusinessServDetailQueryBuilder businessServDetailQueryBuilder;

    public List<BusinessServiceDetail> searchBusinessServiceDetails(final BusinessServiceDetailCriteria businessServiceDetailCriteria) {

        final List<Object> preparedStatementValues = new ArrayList<>();
        final String queryStr = businessServDetailQueryBuilder.prepareSearchQuery(businessServiceDetailCriteria, preparedStatementValues);
        List<BusinessServiceDetail> businessServiceDetailList = new ArrayList<>();
        try {
            logger.info("queryStr -> " + queryStr + "preparedStatementValues -> " + preparedStatementValues.toString());
            businessServiceDetailList = jdbcTemplate.query(queryStr, preparedStatementValues.toArray(), businessServDetailRowMapper);
            logger.info("BusinessServiceDetailRepository businessServiceDetailList -> " + businessServiceDetailList);
        } catch (final Exception ex) {
            logger.info("the exception from searchBusinessServiceDetails : " + ex);
        }
        return businessServiceDetailList;
    }



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






    public List<BusinessServiceDetail> create(BusinessServiceDetailRequest businessServiceDetailRequest) {
        List<BusinessServiceDetail> businessServiceDetails = businessServiceDetailRequest.getBusinessServiceDetails();
        if (!businessServiceDetails.isEmpty()) {
            String query = businessServDetailQueryBuilder.getInsertQuery();
            List<Object[]> argsList = new ArrayList<>();
            RequestInfo requestInfo = businessServiceDetailRequest.getRequestInfo();
            for (int i = 0; i < businessServiceDetails.size(); i++) {
                Object[] values = {businessServiceDetails.get(i).getId(), businessServiceDetails.get(i).getBusinessService(),
                        StringUtils.join(businessServiceDetails.get(i).getCollectionModesNotAllowed(), ','), businessServiceDetails.get(i).getPartPaymentAllowed(),
                        businessServiceDetails.get(i).getCallBackForApportioning(), businessServiceDetails.get(i).getCallBackApportionURL(),
                        new Date().getTime(), new Date().getTime(), requestInfo.getUserInfo().getId(), requestInfo.getUserInfo().getId(), businessServiceDetails.get(i).getTenantId()};
                argsList.add(values);
            }
            try {
                jdbcTemplate.batchUpdate(query, argsList);
            } catch (DataAccessException ex) {
                ex.printStackTrace();
                throw new RuntimeException(ex.getMessage());
            }
        }
        return businessServiceDetails;
    }

    public List<BusinessServiceDetail> update(BusinessServiceDetailRequest businessServiceDetailRequest) {
        List<BusinessServiceDetail> businessServiceDetails = businessServiceDetailRequest.getBusinessServiceDetails();
        if (!businessServiceDetails.isEmpty()) {
            String query = businessServDetailQueryBuilder.getUpdateQuery();
            List<Object[]> argsList = new ArrayList<>();
            RequestInfo requestInfo = businessServiceDetailRequest.getRequestInfo();
            for (int i = 0; i < businessServiceDetails.size(); i++) {
                Object[] values = {businessServiceDetails.get(i).getBusinessService(), StringUtils.join(businessServiceDetails.get(i).getCollectionModesNotAllowed(), ','),
                        businessServiceDetails.get(i).getPartPaymentAllowed(), businessServiceDetails.get(i).getCallBackForApportioning(),
                        businessServiceDetails.get(i).getCallBackApportionURL(), new Date().getTime(), requestInfo.getUserInfo().getId(),
                        businessServiceDetails.get(i).getTenantId(), businessServiceDetails.get(i).getId()};
                argsList.add(values);
            }
            try {
                jdbcTemplate.batchUpdate(query, argsList);
            } catch (DataAccessException ex) {
                ex.printStackTrace();
                throw new RuntimeException(ex.getMessage());
            }
        }
        return businessServiceDetails;
    }

    public boolean checkForDuplicates(List<BusinessServiceDetail> businessServiceDetailList, String mode) {
        boolean duplicatesExist = false;
        String query = businessServDetailQueryBuilder.prepareQueryForValidation(businessServiceDetailList, mode);
        try {
            duplicatesExist = jdbcTemplate.queryForObject(query, Boolean.class);
        } catch (DataAccessException ex) {
            ex.printStackTrace();
            throw new RuntimeException(ex.getMessage());
        }
        return duplicatesExist;
    }
}
