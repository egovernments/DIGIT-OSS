package org.egov.access.persistence.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.egov.access.domain.model.Role;
import org.egov.access.web.contract.role.RoleRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class RoleRepositoryTest {

	@Autowired
	private RoleRepository roleRepository;

	@MockBean
	private NamedParameterJdbcTemplate namedParamJdbcTemplat;

	@Test
	@Sql(scripts = { "/sql/clearRole.sql" })
	public void testshouldcreateroles() {

		RoleRequest roleRequest = new RoleRequest();

		roleRequest.setRequestInfo(getRequestInfo());
		roleRequest.setRoles(getRoles());

		List<Role> roles = roleRepository.createRole(roleRequest);
		assertThat(roles.size()).isEqualTo(2);
	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql" })
	public void testRolessIfThereisNoRoles() {

		RoleRequest roleRequest = new RoleRequest();

		List<Role> roleList = new ArrayList<Role>();

		roleRequest.setRoles(roleList);

		List<Role> roles = roleRepository.createRole(roleRequest);

		assertThat(roles.size()).isEqualTo(0);
	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/insertRoleData.sql" })
	public void testShouldUpdateRoles() {

		RoleRequest roleRequest = new RoleRequest();

		roleRequest.setRequestInfo(getRequestInfo());

		List<Role> roleList = new ArrayList<Role>();

		Role role = Role.builder().id(1L).name("Citizen").code("citizencode").description("citizendescription").build();

		roleList.add(role);
		roleRequest.setRoles(roleList);

		List<Role> roles = roleRepository.updateRole(roleRequest);

		assertThat(roles.size()).isEqualTo(1);
		assertThat(roles.get(0).getCode().equals("citizencode"));
		assertThat(roles.get(0).getDescription().equals("citizendescription"));
	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/insertRoleData.sql" })
	public void testCheckRoleNameDuplicationValidationExist() {

		boolean exist = roleRepository.checkRoleNameDuplicationValidationErrors("SUPERUSER");

		assertThat(exist == true);

	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/insertRoleData.sql" })
	public void testCheckRoleNameDuplicationValidationErrors() {

		boolean exist = roleRepository.checkRoleNameDuplicationValidationErrors("Super User");

		assertThat(exist == false);

	}

	private List<Role> getRoles() {

		List<Role> roles = new ArrayList<>();
		Role role1 = Role.builder().id(1L).name("Citizen").code("test1").description("Citizen of a demography").build();
		Role role2 = Role.builder().id(2L).name("Employee").code("test2").description("Employee of an org").build();
		roles.add(role1);
		roles.add(role2);

		return roles;
	}

	private RequestInfo getRequestInfo() {

		RequestInfo request = new RequestInfo();

		User user = new User();

		user.setId(1);
		request.setUserInfo(user);

		return request;
	}

}
