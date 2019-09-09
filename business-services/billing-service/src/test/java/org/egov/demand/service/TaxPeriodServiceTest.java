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
package org.egov.demand.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.AuditDetail;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.repository.TaxPeriodRepository;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.egov.demand.web.contract.TaxPeriodRequest;
import org.egov.demand.web.contract.TaxPeriodResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
public class TaxPeriodServiceTest {

    @InjectMocks
    private TaxPeriodService taxPeriodService;

    @Mock
    private TaxPeriodRepository taxPeriodRepository;

    @Mock
    private ResponseFactory responseInfoFactory;

    @Mock
    private SequenceGenService sequenceGenService;

    @Mock
    private ApplicationProperties applicationProperties;

    @Mock
    private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

    @Test
    public void shouldSearchTaxPeriods() {
        List<TaxPeriod> taxPeriods = new ArrayList<>();

        taxPeriods.add(getTaxPeriod());

        TaxPeriodResponse taxPeriodResponse = new TaxPeriodResponse();
        taxPeriodResponse.setTaxPeriods(taxPeriods);

        TaxPeriodCriteria taxPeriodCriteria = TaxPeriodCriteria.builder().tenantId("ap").build();
        when(taxPeriodRepository.searchTaxPeriods(any(TaxPeriodCriteria.class))).thenReturn(taxPeriods);
        assertEquals(taxPeriodResponse, taxPeriodService.searchTaxPeriods(taxPeriodCriteria, new RequestInfo()));
    }

    @Test
    public void shouldCreateTaxPeriods() {
        List<TaxPeriod> taxPeriodsForRequest = new ArrayList<>();
        taxPeriodsForRequest.add(getTaxPeriod());
        TaxPeriodRequest taxPeriodRequest = new TaxPeriodRequest();
        taxPeriodRequest.setTaxPeriods(taxPeriodsForRequest);

        List<TaxPeriod> taxPeriodsForResponse = new ArrayList<>();
        taxPeriodsForResponse.add(getTaxPeriod());
        TaxPeriodResponse taxPeriodResponse = new TaxPeriodResponse();
        taxPeriodResponse.setResponseInfo(null);
        taxPeriodResponse.setTaxPeriods(taxPeriodsForResponse);

        when(taxPeriodRepository.create(any(TaxPeriodRequest.class))).thenReturn(taxPeriodsForRequest);
        assertTrue(taxPeriodResponse.equals(taxPeriodService.create(taxPeriodRequest)));
    }

    @Test
    public void shouldUpdateTaxPeriods() {

        TaxPeriodRequest taxPeriodRequest = new TaxPeriodRequest();
        List<TaxPeriod> taxPeriods = new ArrayList<>();
        taxPeriods.add(getTaxPeriod());
        taxPeriodRequest.setTaxPeriods(taxPeriods);
        RequestInfo requestInfo = new RequestInfo();
        User user = new User();
        user.setId(1l);
        requestInfo.setUserInfo(user);
        taxPeriodRequest.setRequestInfo(requestInfo);

        TaxPeriodResponse taxPeriodResponse = new TaxPeriodResponse();
        taxPeriodResponse.setResponseInfo(null);
        taxPeriodResponse.setTaxPeriods(taxPeriods);

        assertTrue(taxPeriodResponse.equals(taxPeriodService.updateAsync(taxPeriodRequest)));
    }

    private TaxPeriod getTaxPeriod() {
        TaxPeriod taxPeriod = new TaxPeriod();
        taxPeriod.setId("1");
        taxPeriod.setTenantId("ap.kurnool");
        taxPeriod.setService("Test Service");
        taxPeriod.setCode("2017-2018-I");
        taxPeriod.setFromDate(1478930l);
        taxPeriod.setToDate(4783525l);
        taxPeriod.setFinancialYear("2017-18");
        taxPeriod.setAuditDetail(new AuditDetail());
        return taxPeriod;
    }
}
