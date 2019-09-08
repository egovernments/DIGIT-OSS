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

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.repository.querybuilder.BusinessServDetailQueryBuilder;
import org.egov.demand.repository.rowmapper.BusinessServDetailRowMapper;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.demand.web.contract.BusinessServiceDetailRequest;
import org.egov.demand.web.contract.TaxPeriodRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
public class BusinessServiceDetailRepositoryTest {

    @InjectMocks
    private BusinessServiceDetailRepository businessServiceDetailRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private BusinessServDetailRowMapper businessServDetailRowMapper;

    @Mock
    private BusinessServDetailQueryBuilder businessServDetailQueryBuilder;

    @Test
    public void shouldSearchForBusinessServiceDetails() {
        final List<Object> preparedStatementValues = new ArrayList<>();
        final BusinessServiceDetailCriteria BusinessServiceDetailCriteria = Mockito.mock(BusinessServiceDetailCriteria.class);
        final String queryString = "testQuery";
        when(businessServDetailQueryBuilder.prepareSearchQuery(BusinessServiceDetailCriteria, preparedStatementValues)).thenReturn(queryString);
        final List<BusinessServiceDetail> businessServiceDetailList = new ArrayList<>();
        when(jdbcTemplate.query(queryString, preparedStatementValues.toArray(), businessServDetailRowMapper))
                .thenReturn(businessServiceDetailList);
        assertTrue(businessServiceDetailList.equals(businessServiceDetailRepository.searchBusinessServiceDetails(BusinessServiceDetailCriteria)));
    }

    @Test
    public void shouldCreateBusinessServiceDetails() {
        BusinessServiceDetailRequest businessServiceDetailRequest = new BusinessServiceDetailRequest();
        RequestInfo requestInfo = new RequestInfo();
        User user = new User();
        user.setId(1l);
        requestInfo.setUserInfo(user);
        businessServiceDetailRequest.setRequestInfo(requestInfo);
        List<BusinessServiceDetail> businessServiceDetails = new ArrayList<>();
        businessServiceDetails.add(getBusinessServiceDetail());
        businessServiceDetailRequest.setBusinessServiceDetails(businessServiceDetails);

        when(jdbcTemplate.update(any(String.class),any(Object[].class))).thenReturn(1);
        assertTrue(businessServiceDetails.equals(businessServiceDetailRepository.create(businessServiceDetailRequest)));
    }

    @Test
    public void shouldUpdateBusinessServiceDetails() {
        BusinessServiceDetailRequest businessServiceDetailRequest = new BusinessServiceDetailRequest();
        RequestInfo requestInfo = new RequestInfo();
        User user = new User();
        user.setId(1l);
        requestInfo.setUserInfo(user);
        businessServiceDetailRequest.setRequestInfo(requestInfo);

        List<BusinessServiceDetail> businessServiceDetails = new ArrayList<>();
        businessServiceDetails.add(getBusinessServiceDetail());
        businessServiceDetailRequest.setBusinessServiceDetails(businessServiceDetails);

        when(jdbcTemplate.update(any(String.class),any(Object[].class))).thenReturn(1);
        assertTrue(businessServiceDetails.equals(businessServiceDetailRepository.update(businessServiceDetailRequest)));
    }

    private BusinessServiceDetail getBusinessServiceDetail() {
        BusinessServiceDetail businessServiceDetail = new BusinessServiceDetail();
        businessServiceDetail.setId("1");
        businessServiceDetail.setTenantId("ap.kurnool");
        businessServiceDetail.setBusinessService("Test Business Service");
        businessServiceDetail.setPartPaymentAllowed(false);
        businessServiceDetail.setCallBackForApportioning(false);
        businessServiceDetail.setCollectionModesNotAllowed(Collections.EMPTY_LIST);
        return businessServiceDetail;
    }
}
