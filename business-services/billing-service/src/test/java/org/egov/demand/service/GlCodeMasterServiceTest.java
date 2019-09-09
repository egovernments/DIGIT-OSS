package org.egov.demand.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.GlCodeMaster;
import org.egov.demand.model.GlCodeMasterCriteria;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.repository.GlCodeMasterRepository;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.GlCodeMasterRequest;
import org.egov.demand.web.contract.GlCodeMasterResponse;
import org.egov.demand.web.contract.TaxHeadMasterRequest;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class GlCodeMasterServiceTest {
	
	@InjectMocks
	GlCodeMasterService glCodeMasterService;
	
	@Mock
	private ResponseFactory responseInfoFactory;
	
	@Mock
	private ApplicationProperties applicationProperties;
	
	@Mock
	private GlCodeMasterRepository glCodeMasterRepository;
	
	@Mock
	private SequenceGenService sequenceGenService;
	
	@Mock
	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;
	
	@Test
	public void testSearch() {
		List<GlCodeMaster> glCodeMasters = new ArrayList<>();
		glCodeMasters.add(getGlCodeMaster());
		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setGlCodeMasters(glCodeMasters);
		
		when(glCodeMasterRepository.findForCriteria(Matchers.any(GlCodeMasterCriteria.class)))
				.thenReturn(glCodeMasters);
		
		GlCodeMasterCriteria taxHeadMasterCriteria = GlCodeMasterCriteria.builder().tenantId("ap.kurnool").build();
		assertEquals(glCodeMasterResponse, glCodeMasterService.getGlCodes(taxHeadMasterCriteria, new RequestInfo()));
	}
	
	/*@Test
	public void testCreateTest() {
		List<GlCodeMaster> glCOde = new ArrayList<>();
		GlCodeMaster glCodeMaster = getGlCodeMaster();
		glCOde.add(glCodeMaster);
		GlCodeMasterRequest glCodeMasterRequest = new GlCodeMasterRequest();
		glCodeMasterRequest.setGlCodeMasters(glCOde);

		List<GlCodeMaster> glCodes = new ArrayList<>();
		glCodes.add(glCodeMaster);
		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setResponseInfo(null);
		glCodeMasterResponse.setGlCodeMasters(glCodes);

		when(glCodeMasterRepository.create(any(GlCodeMasterRequest.class))).thenReturn(glCOde);
		
		assertTrue(glCodeMasterResponse.equals(glCodeMasterService.create(glCodeMasterRequest)));
	}*/
	
	@Test
	public void testCreateAsync() {
		
		GlCodeMaster glCodeMaster = getGlCodeMaster();
		GlCodeMasterRequest glCodeMasterRequest = new GlCodeMasterRequest();

		List<GlCodeMaster> glCodeMasters = new ArrayList<>();
		glCodeMasters.add(glCodeMaster);
		glCodeMasterRequest.setGlCodeMasters(glCodeMasters);
		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setResponseInfo(null);
		glCodeMasterResponse.setGlCodeMasters(glCodeMasters);
		List<String> ids=new ArrayList<>();
		ids.add("12");
		
		when(applicationProperties.getGlCodeMasterseqName()).thenReturn("seq_egbs_glcodemaster");
		when(sequenceGenService.getIds(glCodeMasters.size(),applicationProperties.getGlCodeMasterseqName())).thenReturn(ids);
		
		when(sequenceGenService.getIds(any(Integer.class),any(String.class))).thenReturn(ids);
		
		assertTrue(glCodeMasterResponse.equals(glCodeMasterService.createAsync(glCodeMasterRequest)));
	}
	/*@Test
	public void testUpdateTest() {
		List<GlCodeMaster> glCOde = new ArrayList<>();
		GlCodeMaster glCodeMaster = getGlCodeMaster();
		glCOde.add(glCodeMaster);
		GlCodeMasterRequest glCodeMasterRequest = new GlCodeMasterRequest();
		glCodeMasterRequest.setGlCodeMasters(glCOde);

		List<GlCodeMaster> glCodes = new ArrayList<>();
		glCodes.add(glCodeMaster);
		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setResponseInfo(null);
		glCodeMasterResponse.setGlCodeMasters(glCodes);

		when(glCodeMasterRepository.update(any(GlCodeMasterRequest.class))).thenReturn(glCOde);
		
		assertTrue(glCodeMasterResponse.equals(glCodeMasterService.update(glCodeMasterRequest)));
	}*/
	
	@Test
	public void testUpdateAsync() {
		
		GlCodeMaster glCodeMaster = getGlCodeMaster();
		GlCodeMasterRequest glCodeMasterRequest = new GlCodeMasterRequest();

		List<GlCodeMaster> glCodeMasters = new ArrayList<>();
		glCodeMasters.add(glCodeMaster);
		glCodeMasterRequest.setGlCodeMasters(glCodeMasters);
		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setResponseInfo(null);
		glCodeMasterResponse.setGlCodeMasters(glCodeMasters);
		
		assertTrue(glCodeMasterResponse.equals(glCodeMasterService.updateAsync(glCodeMasterRequest)));
	}
	
	private GlCodeMaster getGlCodeMaster(){
		GlCodeMaster glCodeMaster=new GlCodeMaster();
		
		glCodeMaster.setId("12");
		glCodeMaster.setService("string");
		glCodeMaster.setTaxHead("string");
		glCodeMaster.setTenantId("ap.kurnool");
		glCodeMaster.setGlCode("string");
		glCodeMaster.setFromDate(0l);
		glCodeMaster.setToDate(0l);
		
		return glCodeMaster;
	}
}
