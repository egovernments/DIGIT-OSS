package org.egov.access.web.controller;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.access.Resources;
import org.egov.access.TestConfiguration;
import org.egov.access.domain.criteria.RoleSearchCriteria;
import org.egov.access.domain.model.Role;
import org.egov.access.domain.service.RoleService;
import org.egov.access.web.contract.action.ActionRequest;
import org.egov.access.web.contract.factory.ResponseInfoFactory;
import org.egov.access.web.contract.role.RoleRequest;
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

@RunWith(SpringRunner.class)
@WebMvcTest(RoleController.class)
@Import(TestConfiguration.class)
public class RoleControllerTest {

	@MockBean
	private RoleService roleService;

	@MockBean
	private ResponseInfoFactory responseInfoFactory;

	@Autowired
	private MockMvc mockMvc;

	/*@Test
	public void testShouldGetRolesForCodes() throws Exception {
		List<Role> roles = getRoles();
		RoleSearchCriteria criteria = RoleSearchCriteria.builder().codes(Arrays.asList("CITIZEN", "EMPLOYEE")).tenantId("default").build();
		when(roleService.getRoles(criteria)).thenReturn(roles);

		mockMvc.perform(post("/v1/roles/_search").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleRequest.json")).param("code", "CITIZEN,EMPLOYEE").param("tenantId", "default"))
				.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("roleResponse.json")));

	}

	@Test
	public void testShouldGetRolesShouldTrimWhiteSpacesInCodes() throws Exception {
		List<Role> roles = getRoles();
		RoleSearchCriteria criteria = RoleSearchCriteria.builder().codes(Arrays.asList("CITIZEN", "EMPLOYEE")).tenantId("default").build();
		when(roleService.getRoles(criteria)).thenReturn(roles);

		mockMvc.perform(post("/v1/roles/_search").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleRequest.json")).param("code", "  CITIZEN,   EMPLOYEE   ").param("tenantId", "default"))
				.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("roleResponse.json")));

	}
*/
	@Test
	public void createRole() throws Exception {

		List<Role> roles = getRoles();

		when(roleService.createRole(any(RoleRequest.class))).thenReturn(roles);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/roles/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("roleResponse.json")));

	}

	@Test
	public void testShouldNotCreateRoleWithoutRole() throws Exception {

		List<Role> roles = getRoles();

		when(roleService.createRole(any(RoleRequest.class))).thenReturn(roles);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/roles/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleRequestWithoutRoles.json")))
				.andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("roleResponseWithoutRoles.json")));

	}

	@Test
	public void testShouldNotCreateRoleWithWrongRequestInfo() throws Exception {

		when(roleService.createRole(any(RoleRequest.class))).thenReturn(null);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/roles/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleCreateRequestWithWrongRequestInfo.json")))
				.andExpect(status().isBadRequest());
	}

	@Test
	public void testShouldNotupdateRole() throws Exception {

		List<Role> roles = getRoles();

		when(roleService.updateRole(any(RoleRequest.class))).thenReturn(roles);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/roles/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleUpdateRequest.json"))).andExpect(status().isBadRequest())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("roleUpdateResponse.json")));

	}

	@Test
	public void testShouldNotUpdateRoleWithWrongRequestInfo() throws Exception {

		when(roleService.updateRole(any(RoleRequest.class))).thenReturn(null);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/roles/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleCreateRequestWithWrongRequestInfo.json")))
				.andExpect(status().isBadRequest());
	}

	@Test
	public void testShouldupdateRole() throws Exception {

		List<Role> roles = new ArrayList<>();
		Role role1 = Role.builder().id(1L).name("test1test1").code("testonecode112234324")
				.description("test1description").build();
		Role role2 = Role.builder().id(2L).name("test2test2").code("testtwocode11234354")
				.description("test2codedescription").build();
		roles.add(role1);
		roles.add(role2);

		when(roleService.updateRole(any(RoleRequest.class))).thenReturn(roles);

		when(roleService.checkRoleNameDuplicationValidationErrors(any(String.class))).thenReturn(true);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		responseInfo.setApiId("org.egov.accesscontrol");
		responseInfo.setMsgId("20170310130900");
		responseInfo.setResMsgId("uief87324");
		responseInfo.setTs("Thu Mar 09 18:30:00 UTC 2017");
		responseInfo.setVer("1.0");

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/roles/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleUpdateRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("roleUpdateSuccessResponse.json")));

	}

	@Test
	public void testShouldNotUpdateRoleIfNoName() throws Exception {

		List<Role> roles = getRoles();

		when(roleService.updateRole(any(RoleRequest.class))).thenReturn(roles);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/roles/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("roleUpdateRequestWithoutName.json")))
				.andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("roleUpdateResponseWithoutName.json")));

	}

	private List<Role> getRoles() {
		List<Role> roles = new ArrayList<>();
		Role role1 = Role.builder().id(1L).name("Citizen").code("CITIZEN").description("Citizen of a demography")
				.build();
		Role role2 = Role.builder().id(2L).name("Employee").code("EMPLOYEE").description("Employee of an org").build();
		roles.add(role1);
		roles.add(role2);
		return roles;
	}
}