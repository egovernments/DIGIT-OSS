package org.egov.access.domain.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.access.domain.criteria.RoleSearchCriteria;
import org.egov.access.domain.model.Role;
import org.egov.access.persistence.repository.BaseRepository;
import org.egov.access.persistence.repository.RoleRepository;
import org.egov.access.persistence.repository.querybuilder.RoleFinderQueryBuilder;
import org.egov.access.persistence.repository.rowmapper.RoleRowMapper;
import org.egov.access.web.contract.role.RoleRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

@RunWith(MockitoJUnitRunner.class)
public class RoleServiceTest {

	@Mock
	private BaseRepository repository;

	@Mock
	private RoleRepository roleRepository;

	private RoleService roleService;

	@Mock
	private JdbcTemplate jdbcTemplate;

	@Mock
	private NamedParameterJdbcTemplate namedParameterJdbcTemplat;

	@Before
	public void before() {

		roleService = new RoleService(repository, roleRepository);
	}

	@Test
	public void testShouldReturnRolesForCodes() throws Exception {

		RoleSearchCriteria roleSearchCriteria = RoleSearchCriteria.builder().build();
		List<Object> expectedRoles = getRoles();
		when(repository.run(Mockito.any(RoleFinderQueryBuilder.class), Mockito.any(RoleRowMapper.class)))
				.thenReturn(expectedRoles);

		List<Role> actualActions = roleService.getRoles(roleSearchCriteria);
		assertEquals(expectedRoles, actualActions);
	}

	private List<Object> getRoles() {
		List<Object> roles = new ArrayList<>();
		Role role1 = Role.builder().id(1L).name("Employee").code("EMP").description("Employee of an org").build();
		Role role2 = Role.builder().id(1L).name("Another Employee").code("EMP").description("Employee of an org")
				.build();
		roles.add(role1);
		roles.add(role2);
		return roles;
	}

	@Test
	public void testShouldCreateRoles() {

		RoleRequest roleRequest = new RoleRequest();

		List<Role> roles = new ArrayList<>();
		Role role1 = Role.builder().id(1L).name("Employee").code("EMP").description("Employee of an org").build();
		Role role2 = Role.builder().id(1L).name("Another Employee").code("EMP").description("Employee of an org")
				.build();
		roles.add(role1);
		roles.add(role2);

		roleRequest.setRoles(roles);

		roleRequest.setRequestInfo(getRequestInfo());

		when(roleRepository.createRole(roleRequest)).thenReturn(roleRequest.getRoles());

		List<Role> rolesList = roleService.createRole(roleRequest);

		assertThat(rolesList).isEqualTo(roleRequest.getRoles());

	}

	@Test
	public void testShouldUpdateActions() {

		RoleRequest roleRequest = new RoleRequest();

		List<Role> roles = new ArrayList<>();
		Role role1 = Role.builder().id(1L).name("Employee").code("EMP").description("Employee of an org").build();
		Role role2 = Role.builder().id(1L).name("Another Employee").code("EMP").description("Employee of an org")
				.build();
		roles.add(role1);
		roles.add(role2);

		roleRequest.setRoles(roles);

		roleRequest.setRequestInfo(getRequestInfo());

		when(roleRepository.updateRole(roleRequest)).thenReturn(roleRequest.getRoles());

		List<Role> rolesList = roleService.updateRole(roleRequest);

		assertThat(rolesList).isEqualTo(roleRequest.getRoles());

	}

	private RequestInfo getRequestInfo() {

		RequestInfo request = new RequestInfo();

		User user = new User();

		user.setId(1);
		request.setUserInfo(user);

		return request;
	}
}
