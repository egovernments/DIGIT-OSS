package org.egov.demand.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.model.enums.Category;

import org.egov.demand.repository.TaxHeadMasterRepository;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.TaxHeadMasterRequest;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.egov.demand.web.contract.TaxPeriodResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.ObjectMapper;

@RunWith(MockitoJUnitRunner.class)
public class TaxHeadMasterServiceTest {

	@InjectMocks
	private TaxHeadMasterService taxHeadMasterService;

	@Mock
	private ResponseFactory responseInfoFactory;

	@Mock
	private TaxHeadMasterRepository taxHeadMasterRepository;

	@Mock
	private ObjectMapper objectMapper;

	@Mock
	private ApplicationProperties applicationProperties;
	
	@Mock
	private TaxPeriodService taxPeriodService;
	
	@Mock
	private SequenceGenService sequenceGenService;

	@Mock
	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;
	
	@Test
	public void testSearch() {
		List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();
		taxHeadMasters.add(getTaxHeadMaster());
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMasters);
		//Added for tax period
		List<TaxPeriod> taxPeriods = new ArrayList<>();
        taxPeriods.add(getTaxPeriod());
        TaxPeriodResponse taxPeriodResponse = new TaxPeriodResponse();
        taxPeriodResponse.setTaxPeriods(taxPeriods);
        taxPeriodResponse.setResponseInfo(new ResponseInfo());
      //Added for tax period end
		when(taxHeadMasterRepository.findForCriteria(Matchers.any(TaxHeadMasterCriteria.class)))
				.thenReturn(taxHeadMasters);
		when(taxPeriodService.searchTaxPeriods(Matchers.any(TaxPeriodCriteria.class), Matchers.any(RequestInfo.class)))
        .thenReturn(taxPeriodResponse);
		
		TaxHeadMasterCriteria taxHeadMasterCriteria = TaxHeadMasterCriteria.builder().tenantId("ap.kurnool").build();
		assertEquals(taxHeadMasterResponse, taxHeadMasterService.getTaxHeads(taxHeadMasterCriteria, new RequestInfo()));
	}
	
	@Test
	public void testCreate() {
		List<TaxHeadMaster> taxHead = new ArrayList<>();
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		taxHead.add(taxHeadMaster);
		TaxHeadMasterRequest taxHeadMasterRequest = new TaxHeadMasterRequest();
		taxHeadMasterRequest.setTaxHeadMasters(taxHead);

		List<TaxHeadMaster> taxHeads = new ArrayList<>();
		taxHeads.add(taxHeadMaster);
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setResponseInfo(null);
		taxHeadMasterResponse.setTaxHeadMasters(taxHeads);

		when(taxHeadMasterRepository.create(any(TaxHeadMasterRequest.class))).thenReturn(taxHead);
		
		assertTrue(taxHeadMasterResponse.equals(taxHeadMasterService.create(taxHeadMasterRequest)));
	}
	
	@Test
	public void testCreateAsync() {
		
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		TaxHeadMasterRequest taxHeadMasterRequest = new TaxHeadMasterRequest();
		

		List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();
		taxHeadMasters.add(taxHeadMaster);
		taxHeadMasterRequest.setTaxHeadMasters(taxHeadMasters);
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setResponseInfo(null);
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMasters);
		List<String> ids=new ArrayList<>();
		ids.add("23");
		
		when(applicationProperties.getTaxHeadSeqName()).thenReturn("seq_egbs_taxHeadMaster");
//		when(applicationProperties.getTaxHeadCodeSeqName()).thenReturn("seq_egbs_taxHeadMastercode");
		when(sequenceGenService.getIds(taxHeadMasters.size(),applicationProperties.getTaxHeadSeqName())).thenReturn(ids);
		/*when(sequenceGenService.getIds(taxHeadMasters.size(),
				applicationProperties.getTaxHeadCodeSeqName())).thenReturn(ids);*/
		
		
		when(sequenceGenService.getIds(any(Integer.class),any(String.class))).thenReturn(ids);
		
		assertTrue(taxHeadMasterResponse.equals(taxHeadMasterService.createAsync(taxHeadMasterRequest)));
	}

	@Test
	public void testUpdate() {
		List<TaxHeadMaster> taxHead = new ArrayList<>();
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		taxHead.add(taxHeadMaster);
		TaxHeadMasterRequest taxHeadMasterRequest = new TaxHeadMasterRequest();
		taxHeadMasterRequest.setTaxHeadMasters(taxHead);

		List<TaxHeadMaster> taxHeads = new ArrayList<>();
		taxHeads.add(taxHeadMaster);
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setResponseInfo(null);
		taxHeadMasterResponse.setTaxHeadMasters(taxHeads);

		when(taxHeadMasterRepository.update(any(TaxHeadMasterRequest.class))).thenReturn(taxHead);
		
		assertTrue(taxHeadMasterResponse.equals(taxHeadMasterService.update(taxHeadMasterRequest)));
	}
	
	@Test
	public void testUpdateAsync() {
		
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		TaxHeadMasterRequest taxHeadMasterRequest = new TaxHeadMasterRequest();
		

		List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();
		taxHeadMasters.add(taxHeadMaster);
		taxHeadMasterRequest.setTaxHeadMasters(taxHeadMasters);
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setResponseInfo(null);
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMasters);
		
		
		assertTrue(taxHeadMasterResponse.equals(taxHeadMasterService.updateAsync(taxHeadMasterRequest)));
	}

	
	private TaxHeadMaster getTaxHeadMaster() {
		TaxHeadMaster taxHeadMaster = new TaxHeadMaster();
		TaxPeriod taxPeriod = new TaxPeriod();
		taxHeadMaster.setId("23");
		taxHeadMaster.setCode("23");
		taxHeadMaster.setTenantId("ap.kurnool");
		taxHeadMaster.setCategory(Category.fromValue("TAX"));
		taxHeadMaster.setService("string");
		taxHeadMaster.setName("string");
		taxHeadMaster.setIsDebit(true);
		taxHeadMaster.setIsActualDemand(true);
		taxHeadMaster.setValidFrom(324l);
		taxHeadMaster.setValidTill(23l);
		taxHeadMaster.setOrder(12);

		return taxHeadMaster;
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
        return taxPeriod;
    }

}
