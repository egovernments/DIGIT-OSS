package org.egov.access.persistence.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;

import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.Role;
import org.egov.access.domain.model.RoleAction;
import org.egov.access.web.contract.action.RoleActionsRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class RoleActionRepositoryTest {

	@Autowired
	private RoleActionRepository roleActionRepository;

	@Mock
	private NamedParameterJdbcTemplate namedParamJdbcTemplat;

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/clearAction.sql", "/sql/insertRoleData.sql",
			"/sql/insertActionData.sql" })
	public void testShouldCreateRoleActions() {

		RoleActionsRequest roleRequest = new RoleActionsRequest();

		Role role = Role.builder().code("CITIZEN").build();

		Action action1 = new Action();

		action1.setName("Get all ReceivingMode");

		Action action2 = new Action();

		action2.setName("Get ComplaintType by type,count and tenantId");

		List<Action> actions = new ArrayList<Action>();

		actions.add(action1);
		actions.add(action2);
		roleRequest.setRole(role);

		roleRequest.setActions(actions);
		roleRequest.setTenantId("default");

		roleRequest.setRequestInfo(getRequestInfo());

		List<RoleAction> roleActions = roleActionRepository.createRoleActions(roleRequest);

		assertThat(roleActions.size()).isEqualTo(2);

		assertThat(roleActions.get(0).getRoleCode().equals("CITIZEN"));

		assertThat(roleActions.get(1).getRoleCode().equals("CITIZEN"));

		assertThat(roleActions.get(1).getRoleCode().equals("default"));

	}

	@Test(expected = NullPointerException.class)
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/clearAction.sql", "/sql/insertRoleData.sql",
			"/sql/insertActionData.sql" })
	public void testShouldNotCreateRoleActionsWithoutRole() {

		RoleActionsRequest roleRequest = new RoleActionsRequest();

		Action action1 = new Action();

		action1.setName("Get all ReceivingMode");

		Action action2 = new Action();

		action2.setName("Get ComplaintType by type,count and tenantId");

		List<Action> actions = new ArrayList<Action>();

		actions.add(action1);
		actions.add(action2);

		roleRequest.setActions(actions);
		roleRequest.setTenantId("default");

		roleRequest.setRequestInfo(getRequestInfo());

		List<RoleAction> roleActions = roleActionRepository.createRoleActions(roleRequest);

		assertThat(roleActions.size()).isEqualTo(2);

	}

	@Test(expected = NullPointerException.class)
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/clearAction.sql", "/sql/insertRoleData.sql",
			"/sql/insertActionData.sql" })
	public void testShouldNotCreateRoleActionsWithoutActions() {

		RoleActionsRequest roleRequest = new RoleActionsRequest();

		Role role = Role.builder().code("CITIZEN").build();

		roleRequest.setTenantId("default");

		roleRequest.setRequestInfo(getRequestInfo());

		roleRequest.setRole(role);

		List<RoleAction> roleActions = roleActionRepository.createRoleActions(roleRequest);

		assertThat(roleActions.size()).isEqualTo(2);

	}

	@Test(expected = BadSqlGrammarException.class)
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/clearAction.sql", "/sql/insertRoleData.sql",
			"/sql/insertActionData.sql" })
	public void testShouldNotCreateRoleActionsWithEmptyActions() {

		RoleActionsRequest roleRequest = new RoleActionsRequest();

		List<Action> actions = new ArrayList<Action>();

		Role role = Role.builder().code("CITIZEN").build();

		roleRequest.setTenantId("default");

		roleRequest.setRequestInfo(getRequestInfo());

		roleRequest.setRole(role);

		roleRequest.setActions(actions);

		List<RoleAction> roleActions = roleActionRepository.createRoleActions(roleRequest);

		assertThat(roleActions.size()).isEqualTo(2);

	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/clearAction.sql", "/sql/insertRoleData.sql",
			"/sql/insertActionData.sql" })
	public void testCheckActionNamesAreExist() {

		RoleActionsRequest roleActionRequest = new RoleActionsRequest();

		Action action1 = Action.builder().name("Get all ReceivingMode").build();
		Action action2 = Action.builder().name("Get all CompaintTypeCategory").build();

		List<Action> list = new ArrayList<Action>();

		list.add(action1);
		list.add(action2);

		roleActionRequest.setActions(list);

		boolean exist = roleActionRepository.checkActionNamesAreExistOrNot(roleActionRequest);

		assertThat(exist == true);
	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/clearAction.sql", "/sql/insertRoleData.sql",
			"/sql/insertActionData.sql" })
	public void testCheckActionNamesAreNotExist() {

		RoleActionsRequest roleActionRequest = new RoleActionsRequest();

		Action action1 = Action.builder().name("testActionOne").build();
		Action action2 = Action.builder().name("testActionTWo").build();

		List<Action> list = new ArrayList<Action>();

		list.add(action1);
		list.add(action2);

		roleActionRequest.setActions(list);

		boolean exist = roleActionRepository.checkActionNamesAreExistOrNot(roleActionRequest);

		assertThat(exist == false);
	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/clearAction.sql", "/sql/insertRoleData.sql",
			"/sql/insertActionData.sql" })
	public void testAddUniqueValidationForTenantAndRoleAndAction() {

		RoleActionsRequest roleActionRequest = new RoleActionsRequest();

		Role role = Role.builder().code("PGR").build();

		Action action1 = Action.builder().name("Get all ReceivingMode").build();
		Action action2 = Action.builder().name("Get all CompaintTypeCategory").build();

		List<Action> list = new ArrayList<Action>();

		list.add(action1);
		list.add(action2);

		roleActionRequest.setActions(list);

		roleActionRequest.setRole(role);

		boolean exist = roleActionRepository.addUniqueValidationForTenantAndRoleAndAction(roleActionRequest);

		assertThat(exist == true);
	}

	private RequestInfo getRequestInfo() {

		RequestInfo request = new RequestInfo();

		User user = new User();

		user.setId(1);
		request.setUserInfo(user);

		return request;
	}
}
