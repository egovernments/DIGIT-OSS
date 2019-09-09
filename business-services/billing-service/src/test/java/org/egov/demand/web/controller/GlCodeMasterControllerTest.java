package org.egov.demand.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.demand.TestConfiguration;
import org.egov.demand.model.GlCodeMaster;
import org.egov.demand.model.GlCodeMasterCriteria;
import org.egov.demand.service.GlCodeMasterService;
import org.egov.demand.util.FileUtils;
import org.egov.demand.web.contract.GlCodeMasterRequest;
import org.egov.demand.web.contract.GlCodeMasterResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.demand.web.validator.GlCodeMasterValidator;
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
@WebMvcTest(GlCodeMasterController.class)
@Import(TestConfiguration.class)
@Slf4j
@ActiveProfiles("test")
public class GlCodeMasterControllerTest {

	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private ResponseFactory responseFactory;
	
	@MockBean
	private GlCodeMasterService glCodeMasterService;
	
	@MockBean
	private GlCodeMasterValidator  glCodeMasterValidator;
	
	@Test
	public void test_Should_Search_GlCodeMaster() throws Exception {
		List<GlCodeMaster> glCodeMaster = new ArrayList<>();
		glCodeMaster.add(getGlCodeMaster());

		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setGlCodeMasters(glCodeMaster);
		glCodeMasterResponse.setResponseInfo(new ResponseInfo());

		when(glCodeMasterService.getGlCodes(Matchers.any(GlCodeMasterCriteria.class), Matchers.any(RequestInfo.class)))
				.thenReturn(glCodeMasterResponse);
		
		mockMvc.perform(post("/glcodemasters/_search").param("tenantId", "ap.kurnool")
				.param("service","string").contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("requestinfowrapper.json"))).andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andExpect(content().json(getFileContents("glCodeMasterSearchResponse.json")));
	}
	
	@Test
	public void test_Should_Create_GlCodeMaster() throws Exception {

		List<GlCodeMaster> glCodeMasters = new ArrayList<>();
		GlCodeMaster glCodeMaster = getGlCodeMaster();
		glCodeMasters.add(glCodeMaster);
		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setGlCodeMasters(glCodeMasters);
		glCodeMasterResponse.setResponseInfo(new ResponseInfo());

		when(glCodeMasterService.createAsync(any(GlCodeMasterRequest.class))).thenReturn(glCodeMasterResponse);

		mockMvc.perform(post("/glcodemasters/_create").contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("glCodeMasterCreateRequest.json"))).andExpect(status().isCreated())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andExpect(content().json(getFileContents("glCodeMasterCreateResponse.json")));
	}
	
	@Test
	public void test_Should_Update_GlCodeMaster() throws Exception {

		List<GlCodeMaster> glCodeMasters = new ArrayList<>();
		GlCodeMaster glCodeMaster = getGlCodeMaster();
		glCodeMasters.add(glCodeMaster);
		GlCodeMasterResponse glCodeMasterResponse = new GlCodeMasterResponse();
		glCodeMasterResponse.setGlCodeMasters(glCodeMasters);
		glCodeMasterResponse.setResponseInfo(new ResponseInfo());

		when(glCodeMasterService.updateAsync(any(GlCodeMasterRequest.class))).thenReturn(glCodeMasterResponse);

		mockMvc.perform(post("/glcodemasters/_update").contentType(MediaType.APPLICATION_JSON)
				.content(getFileContents("glCodeMasterUpdateRequest.json"))).andExpect(status().isCreated())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
				.andExpect(content().json(getFileContents("glCodeMasterUpdateResponse.json")));
	}
	
	private String getFileContents(String fileName) throws IOException {
		return new FileUtils().getFileContents(fileName);
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
