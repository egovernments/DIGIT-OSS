package org.egov.demand.web.controller;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.demand.TestConfiguration;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.model.enums.Category;
import org.egov.demand.service.TaxHeadMasterService;
import org.egov.demand.util.FileUtils;
import org.egov.demand.web.contract.TaxHeadMasterRequest;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.demand.web.validator.TaxHeadMasterValidator;
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
@WebMvcTest(TaxHeadMasterController.class)
@Import(TestConfiguration.class)
@ActiveProfiles("test")
public class TaxHeadMasterControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private TaxHeadMasterService taxHeadMasterService;
	
	@MockBean
	private TaxHeadMasterValidator taxHeadMasterValidator;
	
	@MockBean
	private ResponseFactory responseFactory;

	
	@Test
	public void test_Should_Search_TaxHeadMaster() throws Exception {
		List<TaxHeadMaster> taxHeadMaster = new ArrayList<>();
		taxHeadMaster.add(getTaxHeadMaster());

		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMaster);
		taxHeadMasterResponse.setResponseInfo(new ResponseInfo());

		when(taxHeadMasterService.getTaxHeads(Matchers.any(TaxHeadMasterCriteria.class), Matchers.any(RequestInfo.class)))
				.thenReturn(taxHeadMasterResponse);

		mockMvc.perform(post("/taxheads/_search").param("tenantId", "ap.kurnool")
				.param("service","string").contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("requestinfowrapper.json"))).andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andExpect(content().json(getFileContents("taxHeadsSearchResponse.json")));
	}
	
	@Test
	public void test_Should_Search_TaxHeadMaster_Exception() throws Exception {
		List<TaxHeadMaster> taxHeadMaster = new ArrayList<>();
		taxHeadMaster.add(getTaxHeadMaster());

		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMaster);
		taxHeadMasterResponse.setResponseInfo(new ResponseInfo());

		when(taxHeadMasterService.getTaxHeads(Matchers.any(TaxHeadMasterCriteria.class), Matchers.any(RequestInfo.class)))
				.thenReturn(taxHeadMasterResponse);

		mockMvc.perform(post("/taxheads/_search").param("tenantId", "ap.kurnool")
				.contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("requestinfowrapper.json"))).andExpect(status().isBadRequest());
	}
	
	
	@Test
	public void test_Should_Create_TaxHeadMaster() throws Exception {

		List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		taxHeadMasters.add(taxHeadMaster);
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMasters);
		taxHeadMasterResponse.setResponseInfo(new ResponseInfo());

		when(taxHeadMasterService.createAsync(any(TaxHeadMasterRequest.class))).thenReturn(taxHeadMasterResponse);

		mockMvc.perform(post("/taxheads/_create").contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("taxHeadsCreateRequest.json"))).andExpect(status().isCreated())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andExpect(content().json(getFileContents("taxHeadsCreateResponse.json")));
	}
	
	@Test
	public void test_Should_Create_TaxHeadMaster_Exception() throws Exception {

		List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		taxHeadMasters.add(taxHeadMaster);
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMasters);
		taxHeadMasterResponse.setResponseInfo(new ResponseInfo());

		when(taxHeadMasterService.createAsync(any(TaxHeadMasterRequest.class))).thenReturn(taxHeadMasterResponse);

		mockMvc.perform(post("/taxheads/_create").contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("taxHeadsCreateRequest2.json"))).andExpect(status().isBadRequest());
	}
	
	@Test
	public void test_Should_Update_TaxHeadMaster() throws Exception {

		List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		taxHeadMasters.add(taxHeadMaster);
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMasters);
		taxHeadMasterResponse.setResponseInfo(new ResponseInfo());

		when(taxHeadMasterService.updateAsync(any(TaxHeadMasterRequest.class))).thenReturn(taxHeadMasterResponse);

		mockMvc.perform(post("/taxheads/_update").contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("taxHeadsUpdateRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andExpect(content().json(getFileContents("taxHeadsUpdateResponse.json")));
	}
	
	@Test
	public void test_Should_Update_TaxHeadMaster_Ex() throws Exception {

		List<TaxHeadMaster> taxHeadMasters = new ArrayList<>();
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		taxHeadMasters.add(taxHeadMaster);
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMasters);
		taxHeadMasterResponse.setResponseInfo(new ResponseInfo());

		when(taxHeadMasterService.updateAsync(any(TaxHeadMasterRequest.class))).thenReturn(taxHeadMasterResponse);

		mockMvc.perform(post("/taxheads/_update").contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("taxHeadsCreateRequest2.json"))).andExpect(status().isBadRequest());
	}
	
	
	private String getFileContents(String fileName) throws IOException {
		return new FileUtils().getFileContents(fileName);
	}
	
	private TaxHeadMaster getTaxHeadMaster() {
		TaxHeadMaster taxHeadMaster = new TaxHeadMaster();
		TaxPeriod taxPeriod=new TaxPeriod();
		taxHeadMaster.setId("23");
		taxHeadMaster.setCode("string");
		taxHeadMaster.setTenantId("ap.kurnool");
		taxHeadMaster.setCategory(Category.fromValue("TAX"));
		taxHeadMaster.setService("string");
		taxHeadMaster.setName("string");
		taxHeadMaster.setIsDebit(true);
		taxHeadMaster.setIsActualDemand(true);
		
		taxHeadMaster.setValidFrom(324l);
		taxHeadMaster.setValidTill(23l);
		taxHeadMaster.setOrder(12);
	/*	taxPeriod.setFinancialYear("2017-2018");
		taxPeriod.setFromDate(123L);
		taxPeriod.setToDate(345L);
		
*/
		
	return taxHeadMaster;
	}


}
