package org.egov.boundary.web.controller;

import org.apache.commons.io.IOUtils;
import org.egov.boundary.TestConfiguration;
import org.egov.boundary.domain.service.HierarchyTypeService;
import org.egov.boundary.web.contract.HierarchyType;
import org.egov.boundary.web.contract.factory.ResponseInfoFactory;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.io.IOException;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(HierarchyTypeController.class)
@Import(TestConfiguration.class)
public class HierarchyTypeControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private HierarchyTypeService hierarchyTypeService;

	@MockBean
	private ResponseInfoFactory responseInfoFactory;

	@Test
	public void testShouldCreateHierarchyType() throws Exception {
		ResponseInfo responseInfo = ResponseInfo.builder().build();
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);
		when(hierarchyTypeService.createHierarchyType(any(HierarchyType.class))).thenReturn(getHierarchyType());
		when(hierarchyTypeService.findByCodeAndTenantId(any(String.class), any(String.class)))
				.thenReturn(null);
		mockMvc.perform(post("/hierarchytypes").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("hierarchyTypeCreateRequest.json"))).andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("hierarchyTypeCreateResponse.json")));
	}
	
	@Test
	public void testShouldUpdateHierarchyType() throws Exception {
		ResponseInfo responseInfo = ResponseInfo.builder().build();
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);
		when(hierarchyTypeService.updateHierarchyType(any(HierarchyType.class))).thenReturn(getHierarchyType());
		mockMvc.perform(put("/hierarchytypes/Revenue").contentType(MediaType.APPLICATION_JSON_UTF8).param("tenantId", "default")
				.content(getFileContents("hierarchyTypeCreateRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("hierarchyTypeUpdateResponse.json")));
	}
	
	@Test
	public void testShouldGetBadRequestWhenUpdatingWithoutCode() throws Exception {
		when(hierarchyTypeService.updateHierarchyType(any(HierarchyType.class))).thenReturn(getHierarchyType());
		mockMvc.perform(put("/hierarchytypes").contentType(MediaType.APPLICATION_JSON_UTF8).param("tenantId",
				"default")).andExpect(status().isBadRequest());
	}
	
	@Test
	public void testShouldGetBadRequestWhenUpdatingWithoutTenant() throws Exception {
		when(hierarchyTypeService.updateHierarchyType(any(HierarchyType.class))).thenReturn(getHierarchyType());
		mockMvc.perform(put("/hierarchytypes/Revenue").contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isBadRequest());
	}
	
	private HierarchyType getHierarchyType(){
    	HierarchyType hierarchyType = new HierarchyType();
    	hierarchyType.setId(31l);
    	hierarchyType.setName("TESTTEST12");
    	hierarchyType.setCode("Revenue");
    	hierarchyType.setTenantId("default");
    	return hierarchyType;
    }

	private String getFileContents(String fileName) {
		try {
			return IOUtils.toString(this.getClass().getClassLoader().getResourceAsStream(fileName), "UTF-8");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

}
