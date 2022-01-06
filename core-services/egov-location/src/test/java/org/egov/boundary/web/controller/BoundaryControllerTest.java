package org.egov.boundary.web.controller;

import org.apache.commons.io.IOUtils;
import org.egov.boundary.TestConfiguration;
import org.egov.boundary.domain.model.Boundary;
import org.egov.boundary.domain.model.BoundarySearchRequest;
import org.egov.boundary.domain.service.BoundaryService;
import org.egov.boundary.domain.service.BoundaryTypeService;
import org.egov.boundary.domain.service.CrossHierarchyService;
import org.egov.boundary.domain.service.HierarchyTypeService;
import org.egov.boundary.web.contract.BoundaryRequest;
import org.egov.boundary.web.contract.BoundaryType;
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
import java.nio.charset.Charset;
import java.util.*;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(BoundaryController.class)
@Import(TestConfiguration.class)
public class BoundaryControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private BoundaryService boundaryService;

	@MockBean
	private BoundaryTypeService boundaryTypeService;

	@MockBean
	private CrossHierarchyService crossHierarchyService;

	@MockBean
	private ResponseInfoFactory responseInfoFactory;

	@MockBean
	private HierarchyTypeService hierarchyTypeService;

	private MediaType contentType = new MediaType("application", "json", Charset.forName("UTF-8"));

	private static final String BOUNDARY_PATH="/boundarys";

	private static final String TENANT_ID="tenantId";

	private static final String DEFAULT="default";

	private static final String BOUNDARY_SEARCH_RESPONSE_JSON="boundarySearchResponse.json";

	private static final String BOUNDARYS_GET_LOCATION_BY_LOCATION_NAME="/boundarys/getLocationByLocationName";

	private static final String BANK_ROAD="Bank Road";

	private static final String AP_PUBLIC="ap.public";

	private static final String BOUNDARY_RESPONSE_JSON="boundaryResponse.json";

	private static final String X_CORRELATION_ID="X-CORRELATION-ID";

	private static final String SOME_ID="someId";

	private static final String BOUNDARYS_SEARCH="/boundarys/_search";

	@Test
	public void testShouldCreateBoundary() throws Exception {
		BoundaryType boundaryType = BoundaryType.builder().build();
		ResponseInfo responseInfo = ResponseInfo.builder().build();
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);
		when(boundaryService.createBoundary(any(Boundary.class))).thenReturn(getBoundaries().get(0));
		when(boundaryTypeService.findByTenantIdAndCode(any(String.class), any(String.class))).thenReturn(boundaryType);
		mockMvc.perform(post(BOUNDARY_PATH).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryCreateRequest.json"))).andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryCreateResponse.json")));
	}

	@Test
	public void testShouldNotCreateBoundaryWhenCodeIsNotThere() throws Exception {
		BoundaryType boundaryType = BoundaryType.builder().build();
		when(boundaryService.createBoundary(any(Boundary.class))).thenReturn(getBoundaries().get(0));
		when(boundaryTypeService.findByTenantIdAndCode(any(String.class), any(String.class))).thenReturn(boundaryType);
		mockMvc.perform(post(BOUNDARY_PATH).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryCreateRequestWithoutCode.json"))).andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryCreateResponseWithoutCode.json")));
	}

	@Test
	public void testShouldNotCreateBoundaryWhenTenantIdIsNotThere() throws Exception {
		BoundaryType boundaryType = BoundaryType.builder().build();
		when(boundaryService.createBoundary(any(Boundary.class))).thenReturn(getBoundaries().get(0));
		when(boundaryTypeService.findByTenantIdAndCode(any(String.class), any(String.class))).thenReturn(boundaryType);
		mockMvc.perform(put("/boundarys/create").contentType(contentType)
				.content(getFileContents("boundaryCreateRequestWithoutTenant.json"))).andExpect(status().isBadRequest())
				.andExpect(content().contentType(contentType))
				.andExpect(content().json(getFileContents("boundaryCreateResponseWithoutTenant.json")));
	}

	@Test
	public void testShouldNotCreateBoundaryWhenBoundaryTypeCodeIsNotThere() throws Exception {
		BoundaryType boundaryType = BoundaryType.builder().build();
		when(boundaryService.createBoundary(any(Boundary.class))).thenReturn(getBoundaries().get(0));
		when(boundaryTypeService.findByTenantIdAndCode(any(String.class), any(String.class))).thenReturn(boundaryType);
		mockMvc.perform(post(BOUNDARY_PATH).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryRequestWithoutBoundaryTypeCode.json")))
				.andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryResponseWithoutBoundaryTypeCode.json")));
	}

	@Test
	public void testShouldNotCreateBoundaryWhenBoundaryNameIsNotThere() throws Exception {
		Boundary boundary = Boundary.builder().build();
		BoundaryType boundaryType = BoundaryType.builder().build();
		boundary.setBoundaryType(boundaryType);
		when(boundaryService.createBoundary(boundary)).thenReturn(getBoundaries().get(0));
		when(boundaryTypeService.findByTenantIdAndCode(any(String.class), any(String.class))).thenReturn(boundaryType);
		mockMvc.perform(post(BOUNDARY_PATH).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryRequestWithoutBoundaryName.json"))).andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryResponseWithoutBoundaryName.json")));
	}

	@Test
	public void testShouldUpdateBoundary() throws Exception {
		Boundary boundary = Boundary.builder().build();
		BoundaryType boundaryType = BoundaryType.builder().build();
		boundary.setBoundaryType(boundaryType);
		when(boundaryService.updateBoundary(any(Boundary.class))).thenReturn(getBoundaries().get(0));
		when(boundaryTypeService.findByTenantIdAndCode(any(String.class), any(String.class))).thenReturn(boundaryType);
		mockMvc.perform(put("/boundarys/TEST").param(TENANT_ID, DEFAULT).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryCreateRequest.json"))).andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("boundaryCreateResponse.json")));
	}

	@Test
	public void testShouldGetBoundaries() throws Exception {
		when(boundaryService.getAllBoundary(any(BoundaryRequest.class))).thenReturn(getSearchBoundaries());
		mockMvc.perform(get(BOUNDARY_PATH).param("Boundary.tenantId", DEFAULT).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents(BOUNDARY_SEARCH_RESPONSE_JSON))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents(BOUNDARY_SEARCH_RESPONSE_JSON)));
	}
	
	@Test
	public void testShouldNotGetBoundariesWhenTenantIdIsNotThere() throws Exception {
		when(boundaryService.getAllBoundary(any(BoundaryRequest.class))).thenReturn(getSearchBoundaries());
		mockMvc.perform(get(BOUNDARY_PATH).contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isBadRequest());
				
	}
	
	@Test
	public void testShouldGetLocationByLocationName() throws Exception {
		when(boundaryService.getBoundaryDataByTenantIdAndNameLike(any(String.class),any(String.class))).thenReturn(getBoundariesByLocationByLocationName());
		mockMvc.perform(get(BOUNDARYS_GET_LOCATION_BY_LOCATION_NAME).param("locationName", "Appikonda Veedhi").param(TENANT_ID, DEFAULT).contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("boundaryResponseByLocationByLocationName.json"))).andExpect(content().json(getFileContents("boundaryResponseByLocationByLocationName.json")));
	}
	
	@Test
	public void testShouldNotGetLocationByLocationNameWhenLocationNameIsNotThere() throws Exception {
		when(boundaryService.getBoundaryDataByTenantIdAndNameLike(any(String.class),any(String.class))).thenReturn(getBoundariesByLocationByLocationName());
		mockMvc.perform(get(BOUNDARYS_GET_LOCATION_BY_LOCATION_NAME).param(TENANT_ID, DEFAULT).contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isBadRequest());
	}
	
	@Test
	public void testShouldNotGetLocationByLocationNameWhenTenantIsNotThere() throws Exception {
		when(boundaryService.getBoundaryDataByTenantIdAndNameLike(any(String.class),any(String.class))).thenReturn(getBoundariesByLocationByLocationName());
		mockMvc.perform(get(BOUNDARYS_GET_LOCATION_BY_LOCATION_NAME).param("locationName", "Appikonda Veedhi").contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isBadRequest());
	}

	@Test
	public void testShouldFetchAllLocationsForGivenWard() throws Exception {
		final Boundary expectedBoundary = Boundary.builder().id(1L).name(BANK_ROAD).build();
		when(crossHierarchyService.getActiveChildBoundariesByBoundaryIdAndTenantId(any(Long.class), any(String.class)))
				.thenReturn(Collections.singletonList(expectedBoundary));
		mockMvc.perform(
				post("/boundarys/childLocationsByBoundaryId").param("boundaryId", "1").param(TENANT_ID, AP_PUBLIC))
				.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents(BOUNDARY_RESPONSE_JSON)));
	}

	@Test
	public void testShouldReturnBadRequestWhenWardIsEmpty() throws Exception {
		when(crossHierarchyService.getActiveChildBoundariesByBoundaryIdAndTenantId(any(Long.class), any(String.class)))
				.thenReturn(null);
		mockMvc.perform(
				post("/boundarys/childLocationsByBoundaryId").param("boundaryId", "").param(TENANT_ID, AP_PUBLIC)
						.header(X_CORRELATION_ID, SOME_ID).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isBadRequest());
	}

	@Test
	public void testShouldFetchAllBoundariesForBoundarytypenameAndHierarchytypename() throws Exception {
		final Boundary expectedBoundary = Boundary.builder().id(1L).name(BANK_ROAD).build();
		when(boundaryService.getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId(any(String.class),
				any(String.class), any(String.class))).thenReturn(Collections.singletonList(expectedBoundary));
		mockMvc.perform(post("/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName").param(TENANT_ID, AP_PUBLIC)
				.param("boundaryTypeName", "Ward").param("hierarchyTypeName", "Admin")
				.header(X_CORRELATION_ID, SOME_ID)).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents(BOUNDARY_RESPONSE_JSON)));
	}

	@Test
	public void testShouldReturnBadRequestWhenBoundarytypenameAndHierarchytypenameIsEmpty() throws Exception {
		when(boundaryService.getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId(any(String.class),
				any(String.class), any(String.class))).thenReturn(null);
		mockMvc.perform(post("/boundarys/boundariesByBndryTypeNameAndHierarchyTypeName").param(TENANT_ID, AP_PUBLIC)
				.param("boundaryTypeName", "").param("hierarchyTypeName", "").header(X_CORRELATION_ID, SOME_ID)
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isBadRequest());
	}

	@Test
	public void testShouldFetchAllBoundariesForBoundarytypeidAndtenantId() throws Exception {
		final Boundary expectedBoundary = Boundary.builder().id(1L).name(BANK_ROAD).build();
		when(boundaryService.getAllBoundariesByBoundaryTypeIdAndTenantId(any(Long.class), any(String.class)))
				.thenReturn(Collections.singletonList(expectedBoundary));
		mockMvc.perform(post("/boundarys/getByBoundaryType").param("boundaryTypeId", "7").param(TENANT_ID, TENANT_ID))
				.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents(BOUNDARY_RESPONSE_JSON)));
	}

	@Test
	public void testShouldReturnBadRequestWhenBoundarytypeidAndTenmantIdIsEmpty() throws Exception {
		when(boundaryService.getAllBoundariesByBoundaryTypeIdAndTenantId(any(Long.class), any(String.class)))
				.thenReturn(null);
		mockMvc.perform(post("/boundarys/getByBoundaryType").param("boundaryTypeId", "").param(TENANT_ID, "")
				.header(X_CORRELATION_ID, SOME_ID).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().isBadRequest());
	}
	
	@Test
	public void isShapeFileExist() throws Exception {
		when(boundaryService.checkTenantShapeFileExistOrNot(any(String.class)))
				.thenReturn(true);
		ResponseInfo responseInfo = ResponseInfo.builder().build();
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);
		mockMvc.perform(post("/boundarys/isshapefileexist").param(TENANT_ID, DEFAULT)
				.contentType(MediaType.APPLICATION_JSON_UTF8).content(getFileContents("requestInfoWrapper.json")))
				.andExpect(status().isOk()).andExpect(content().json(getFileContents("tenantShapeFileExistOrNotResponse.json")));
	}

	@Test
	public void testShouldReturnBadRequestWhenTenantIsNotThere() throws Exception {
		mockMvc.perform(post(BOUNDARYS_SEARCH).header(X_CORRELATION_ID, SOME_ID)
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isBadRequest());
	}
	
	@Test
	public void testShouldReturnBoundaries() throws Exception {
		when(boundaryService.getAllBoundariesByIdsAndTypeAndNumberAndCodeAndTenant(any(BoundarySearchRequest.class))).thenReturn(getSearchBoundaries());
		mockMvc.perform(post(BOUNDARYS_SEARCH).param(TENANT_ID, DEFAULT)
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isOk())
			    .andExpect(content().json(getFileContents(BOUNDARY_SEARCH_RESPONSE_JSON)));
	}

	@Test
	public void testShouldReturnBadRequestWhenTenantIsEmpty() throws Exception {
		mockMvc.perform(post(BOUNDARYS_SEARCH).param(TENANT_ID, "").header(X_CORRELATION_ID, SOME_ID)
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isBadRequest());
	}

	private List<Boundary> getBoundaries() {
		List<Boundary> boundaryList = new ArrayList<Boundary>();
		Boundary boundary1 = new Boundary();
		boundary1.setId(1l);
		boundary1.setTenantId(DEFAULT);
		boundary1.setName("TestBoundaryOne");
		Boundary boundary2 = new Boundary();
		boundary2.setId(2l);
		boundary2.setName("TestBoundaryTwo");
		boundary2.setTenantId(DEFAULT);
		boundaryList.add(boundary1);
		boundaryList.add(boundary2);
		return boundaryList;
	}

    private List<Boundary> getSearchBoundaries(){
    	List<Boundary> boundaryList = new ArrayList<Boundary>();
    	Boundary boundary1 = Boundary.builder().id(1l).name("Srikakulam  Municipality").boundaryNum(1l).tenantId(DEFAULT).build();
    	BoundaryType boundaryType1 = BoundaryType.builder().id("1").name("City").hierarchy(1l).tenantId(DEFAULT).build();
    	boundary1.setBoundaryType(boundaryType1);
    	
    	Boundary boundary2 = Boundary.builder().id(2l).name("Zone-1").boundaryNum(1l).tenantId(DEFAULT).build();
    	BoundaryType boundaryType2 = BoundaryType.builder().id("3").name("Zone").hierarchy(3l).tenantId(DEFAULT).build();
    	boundary2.setParent(boundary1);
    	boundary2.setBoundaryType(boundaryType2);
    	
    	boundaryList.add(boundary1);
    	boundaryList.add(boundary2);
    	
    	return boundaryList;
    }
    
    private List<Map<String, Object>> getBoundariesByLocationByLocationName(){
    	List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
    	final Map<String, Object> res1 = new HashMap<>();
    	res1.put("id", 147);
		res1.put("name", "Appikonda Veedhi - Election Ward No 1 - Srikakulam  Municipality");
    	final Map<String, Object> res2 = new HashMap<>();
    	res2.put("id", 197);
		res2.put("name", "Appikonda Veedhi - Election Ward No 30 - Srikakulam  Municipality");
    	list.add(res1);
    	list.add(res2);
    	return list;
    }
	private String getFileContents(String fileName) {
		try {
			return IOUtils.toString(this.getClass().getClassLoader().getResourceAsStream(fileName), "UTF-8");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
