package org.egov.access.domain.service;

import org.egov.access.domain.criteria.ActionSearchCriteria;
import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.ActionValidation;
import org.egov.access.persistence.repository.ActionRepository;
import org.egov.access.persistence.repository.BaseRepository;
import org.egov.access.persistence.repository.MdmsRepository;
import org.egov.access.persistence.repository.querybuilder.ActionFinderQueryBuilder;
import org.egov.access.persistence.repository.querybuilder.ValidateActionQueryBuilder;
import org.egov.access.persistence.repository.rowmapper.ActionRowMapper;
import org.egov.access.persistence.repository.rowmapper.ActionValidationRowMapper;
import org.egov.access.web.contract.action.ActionRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ActionServiceTest {

	@Mock
	private BaseRepository repository;

	@Mock
	private ActionRepository actionRepository;

	@Mock
	private MdmsRepository mdmsRepository;

	private ActionService actionService;

	@Mock
	private JdbcTemplate jdbcTemplate;

	@Mock
	private NamedParameterJdbcTemplate namedParameterJdbcTemplat;

	@Before
	public void before() {

		actionService = new ActionService(repository, actionRepository, mdmsRepository);
	}

	@Test
	public void testShouldReturnActionsForUserRole() throws Exception {

		ActionSearchCriteria actionSearchCriteria = ActionSearchCriteria.builder().build();

		List<Object> actionsExpected = getActions();
		ActionFinderQueryBuilder queryBuilder = new ActionFinderQueryBuilder(actionSearchCriteria);
		when(repository.run(Mockito.any(ActionFinderQueryBuilder.class), Mockito.any(ActionRowMapper.class)))
				.thenReturn(actionsExpected);

		List<Action> actualActions = actionService.getActions(actionSearchCriteria);
		assertEquals(actionsExpected, actualActions);
	}

	@Test
	public void testValidateQueriesRepositoryToValidateTheCriteria() {
		ActionValidation expectedValidation = ActionValidation.builder().allowed(true).build();
		when(repository.run(Mockito.any(ValidateActionQueryBuilder.class),
				Mockito.any(ActionValidationRowMapper.class))).thenReturn(Arrays.asList(expectedValidation));

		assert (actionService.validate(ValidateActionCriteria.builder().build()).isAllowed());
	}

	private List<Object> getActions() {
		List<Object> actions = new ArrayList<>();
		Action action1 = Action.builder().id(1L).name("Create Complaint").displayName("Create Complaint").createdBy(1L)
				.lastModifiedBy(1L).url("/createcomplaint").build();
		Action action2 = Action.builder().id(2L).name("Update Complaint").displayName("Update Complaint").createdBy(1L)
				.lastModifiedBy(1L).url("/updatecomplaint").build();
		actions.add(action1);
		actions.add(action2);
		return actions;
	}

	@Test
	public void testShouldCreateActions() {

		ActionRequest actionRequest = new ActionRequest();

		actionRequest.setActions(getListOfActions());

		actionRequest.setRequestInfo(getRequestInfo());

		when(actionRepository.createAction(actionRequest)).thenReturn(actionRequest.getActions());

		List<Action> actions = actionService.createAction(actionRequest);

		assertThat(actions).isEqualTo(actionRequest.getActions());

	}

	@Test
	public void testCheckActionNameExit() {

		when(actionRepository.checkActionNameExit("test")).thenReturn(false);

		Boolean exist = actionService.checkActionNameExit("test");

		assertThat(exist == false);
	}

	@Test
	public void testCheckCombinationOfUrlAndqueryparamsExist() {

		when(actionRepository.checkCombinationOfUrlAndqueryparamsExist("/test", "tenant")).thenReturn(false);

		Boolean exist = actionService.checkCombinationOfUrlAndqueryparamsExist("/test", "tenant");

		assertThat(exist == false);
	}

	@Test
	public void testShouldUpdateActions() {

		ActionRequest actionRequest = new ActionRequest();

		actionRequest.setActions(getListOfActions());

		actionRequest.setRequestInfo(getRequestInfo());

		when(actionRepository.updateAction(actionRequest)).thenReturn(actionRequest.getActions());

		List<Action> actions = actionService.updateAction(actionRequest);

		assertThat(actions).isEqualTo(actionRequest.getActions());

	}

	@Test
	public void testShouldGetModules() throws UnsupportedEncodingException, JSONException {

		ActionRequest actionRequest = new ActionRequest();

		actionRequest.setRequestInfo(getRequestInfo());

		when(actionRepository.getAllActions(actionRequest)).thenReturn(getActionList());

		List<Action> actions = actionService.getAllActions(actionRequest);

		assertThat(getActionList().size() == actions.size());
		assertThat(actions.equals(getActionList()));

	}

	private List<Action> getActionList() {

		List<Action> actionList = new ArrayList<Action>();

		Action action1 = new Action();

		action1.setId(268l);

		action1.setName("ESS Leave Application");
		action1.setUrl("/app/hr/leavemaster/apply-leave.html");
		action1.setDisplayName("Apply Leave");
		action1.setEnabled(false);
		action1.setServiceCode("ESS");
		action1.setPath("/ess");

		Action action2 = new Action();

		action2.setId(267l);
		action2.setName("View ESS Employee");
		action2.setUrl("/app/hr/employee/create.html");
		action2.setDisplayName("My Details");
		action2.setEnabled(false);
		action2.setServiceCode("ESS");
		action1.setPath("/ess");
		actionList.add(action1);
		actionList.add(action2);

		return actionList;
	}

	private List<Action> getListOfActions() {

		List<Action> actionList = new ArrayList<Action>();

		Action action1 = new Action();

		action1.setName("ActionOne");
		action1.setUrl("/actionone");
		action1.setDisplayName("ActionOne");
		action1.setTenantId("default");
		action1.setServiceCode("ACTION");

		Action action2 = new Action();

		action1.setName("test");
		action1.setUrl("/test");
		action1.setDisplayName("TEST");
		action1.setTenantId("default");
		action1.setServiceCode("TEST");

		actionList.add(action1);
		actionList.add(action2);

		return actionList;
	}

	private RequestInfo getRequestInfo() {

		RequestInfo request = new RequestInfo();

		User user = new User();

		user.setId(1);
		request.setUserInfo(user);

		return request;
	}
}