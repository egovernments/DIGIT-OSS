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
package org.egov.demand.web.controller;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.demand.TestConfiguration;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.model.enums.PeriodCycle;
import org.egov.demand.service.TaxPeriodService;
import org.egov.demand.util.FileUtils;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.egov.demand.web.contract.TaxPeriodRequest;
import org.egov.demand.web.contract.TaxPeriodResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.demand.web.validator.TaxPeriodValidator;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(TaxPeriodController.class)
@Import(TestConfiguration.class)
@ActiveProfiles("test")
public class TaxPeriodControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaxPeriodService taxPeriodService;

    @MockBean
    private ResponseFactory responseFactory;

    @MockBean
    private TaxPeriodValidator taxPeriodValidator;

    @Test
    public void shouldSearchTaxPeriods() throws Exception {
        List<TaxPeriod> taxPeriods = new ArrayList<>();

        taxPeriods.add(getTaxPeriod());

        TaxPeriodResponse taxPeriodResponse = new TaxPeriodResponse();
        taxPeriodResponse.setTaxPeriods(taxPeriods);
        taxPeriodResponse.setResponseInfo(new ResponseInfo());

        when(taxPeriodService.searchTaxPeriods(Matchers.any(TaxPeriodCriteria.class), Matchers.any(RequestInfo.class)))
                .thenReturn(taxPeriodResponse);

        mockMvc.perform(post("/taxperiods/_search").param("service", "Test Service").param("tenantId", "ap.kurnool")
                .contentType(MediaType.APPLICATION_JSON)
                .content(getFileContents("requestinfowrapper.json"))).andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().json(getFileContents("taxperiodsearchresponse.json")));
    }

    @Test
    public void shouldCreateTaxPeriod() throws Exception {

        List<TaxPeriod> taxPeriods = new ArrayList<>();
        TaxPeriod taxPeriod = getTaxPeriod();
        taxPeriods.add(taxPeriod);
        TaxPeriodResponse taxPeriodResponse = new TaxPeriodResponse();
        taxPeriodResponse.setTaxPeriods(taxPeriods);
        taxPeriodResponse.setResponseInfo(new ResponseInfo());

        when(taxPeriodService.createAsync(any(TaxPeriodRequest.class))).thenReturn(taxPeriodResponse);

        mockMvc.perform(post("/taxperiods/_create").contentType(MediaType.APPLICATION_JSON)
                .content(getFileContents("taxperiodcreaterequest.json"))).andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().json(getFileContents("taxperiodcreateresponse.json")));
    }

    @Test
    public void shouldUpdateTaxPeriod() throws Exception {
        List<TaxPeriod> taxPeriods = new ArrayList<>();
        taxPeriods.add(getTaxPeriod());

        TaxPeriodResponse taxPeriodResponse = new TaxPeriodResponse();
        taxPeriodResponse.setTaxPeriods(taxPeriods);
        taxPeriodResponse.setResponseInfo(new ResponseInfo());

        when(taxPeriodService.updateAsync(any(TaxPeriodRequest.class))).thenReturn(taxPeriodResponse);

        mockMvc.perform(post("/taxperiods/_update").contentType(MediaType.APPLICATION_JSON)
                .content(getFileContents("taxperiodupdaterequest.json"))).andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().json(getFileContents("taxperiodupdateresponse.json")));
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
        taxPeriod.setPeriodCycle(PeriodCycle.fromValue("QUARTER"));
        return taxPeriod;
    }

    private String getFileContents(final String fileName) throws IOException {
        return new FileUtils().getFileContents(fileName);
    }

}
