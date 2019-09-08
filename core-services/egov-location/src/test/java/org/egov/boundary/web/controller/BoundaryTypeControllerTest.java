package org.egov.boundary.web.controller;

import org.apache.commons.io.IOUtils;
import org.egov.boundary.TestConfiguration;
import org.egov.boundary.domain.service.BoundaryTypeService;
import org.egov.boundary.domain.service.HierarchyTypeService;
import org.egov.boundary.web.contract.BoundaryType;
import org.egov.boundary.web.contract.BoundaryTypeRequest;
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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(BoundaryTypeController.class)
@Import(TestConfiguration.class)
public class BoundaryTypeControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private BoundaryTypeService boundaryTypeService;

	@MockBean
	private ResponseInfoFactory responseInfoFactory;

	@MockBean
	private HierarchyTypeService hierarchyTypeService;

	@Test
	public void testShouldFetchAllBoundarieTypesForHierarchyTypeidAndtenantId() throws Exception {
		final BoundaryType expectedBoundaryType = BoundaryType.builder().id("1").name("City").tenantId("tenantId")
				.build();
		when(boundaryTypeService.getAllBoundarTypesByHierarchyTypeIdAndTenantName(any(String.class), any(String.class)))
				.thenReturn(Collections.singletonList(expectedBoundaryType));
		mockMvc.perform(post("/boundarytypes/getByHierarchyType").param("hierarchyTypeName", "ADMINISTRATION")
				.param("tenantId", "tenantId").header("X-CORRELATION-ID", "someId")).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryTypeResponse.json")));
	}

	@Test
	public void testShouldCreateBoundaryType() throws Exception {
		HierarchyType hierarchyType = new HierarchyType();
		ResponseInfo responseInfo = ResponseInfo.builder().build();
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);
		when(boundaryTypeService.findByTenantIdAndCode(any(String.class),any(String.class))).thenReturn(null);
		when(boundaryTypeService.createBoundaryType(any(BoundaryType.class))).thenReturn(getBoundaryType());
		when(hierarchyTypeService.findByCodeAndTenantId(any(String.class), any(String.class)))
				.thenReturn(hierarchyType);
		mockMvc.perform(post("/boundarytypes").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryTypeCreateRequest.json"))).andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryTypeCreateResponse.json")));
	}
	
	@Test
	public void testShouldUpdateBoundaryType() throws Exception {
		HierarchyType hierarchyType = new HierarchyType();
		ResponseInfo responseInfo = ResponseInfo.builder().build();
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);
		when(boundaryTypeService.updateBoundaryType(any(BoundaryType.class))).thenReturn(getBoundaryType());
		when(hierarchyTypeService.findByCodeAndTenantId(any(String.class), any(String.class)))
				.thenReturn(hierarchyType);
		mockMvc.perform(put("/boundarytypes/TEST").contentType(MediaType.APPLICATION_JSON_UTF8).param("tenantId", "default")
				.content(getFileContents("boundaryTypeCreateRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryTypeUpdateResponse.json")));
	}
	
	@Test
	public void testShouldGetBadRequestwhenTenantIsNotThere() throws Exception {
		mockMvc.perform(put("/boundarytypes/TEST").contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isBadRequest());
	}
	
	@Test
	public void testShouldGetBadRequestWithoutTenant() throws Exception {
		mockMvc.perform(get("/boundarytypes").contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isBadRequest());
	}
	
	@Test
	public void testShouldGetBoundaryTypes() throws Exception {
		List<BoundaryType> list = new ArrayList<BoundaryType>();
		list.add(getBoundaryType());
		when(boundaryTypeService.getAllBoundaryTypes(any(BoundaryTypeRequest.class))).thenReturn(list);
		mockMvc.perform(get("/boundarytypes").param("BoundaryType.tenantId", "default").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryTypeSearchResponse.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryTypeSearchResponse.json")));
	}
	
	@Test
	public void testShouldNotCreateBoundaryTypeWithoutTenant() throws Exception {
		HierarchyType hierarchyType = new HierarchyType();
		hierarchyType.setCode("Test");
		when(hierarchyTypeService.findByCodeAndTenantId(any(String.class), any(String.class))).thenReturn(hierarchyType);
		mockMvc.perform(post("/boundarytypes").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryTypeCreateRequestWithoutTenant.json"))).andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryTypeCreateResponseWithoutTenant.json")));
	}
	
	@Test
	public void testShouldNotCreateBoundaryTypeWithoutName() throws Exception {
		mockMvc.perform(post("/boundarytypes").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryTypeCreateRequestWithoutNameAndCode.json"))).andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryTypeCreateResponseWithoutNameAndCode.json")));
	}

	private BoundaryType getBoundaryType(){
    	BoundaryType boundaryType = BoundaryType.builder().id("120").name("Test1234").code("BNDRYTYPE").hierarchy(12l).tenantId("default").createdBy(1l).lastModifiedBy(1l).createdDate(1508284800000l).lastModifiedDate(1508284800000l).build();
    	HierarchyType hierarchyType = new HierarchyType();
    	hierarchyType.setId(3l);
    	hierarchyType.setName("ADMINISTRATION");
    	hierarchyType.setCode("ADMIN");
    	hierarchyType.setTenantId("default");
    	hierarchyType.setCreatedBy(1l);
    	hierarchyType.setLastModifiedBy(1l);
    	hierarchyType.setCreatedDate(1262304000000l);
    	hierarchyType.setLastModifiedDate(1420070400000l);
    	boundaryType.setHierarchyType(hierarchyType);
    	return boundaryType;
    }

	private String getFileContents(String fileName) {
		try {
			return IOUtils.toString(this.getClass().getClassLoader().getResourceAsStream(fileName), "UTF-8");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

}
