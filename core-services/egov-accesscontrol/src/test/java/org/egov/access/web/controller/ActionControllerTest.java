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
import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.ActionValidation;
import org.egov.access.domain.service.ActionService;
import org.egov.access.web.contract.action.Module;
import org.egov.access.web.contract.action.ActionRequest;
import org.egov.access.web.contract.factory.ResponseInfoFactory;
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
@WebMvcTest(ActionController.class)
@Import(TestConfiguration.class)
public class ActionControllerTest {

	@MockBean
	private ActionService actionService;

	@MockBean
	ResponseInfoFactory responseInfoFactory;

	@Autowired
	private MockMvc mockMvc;

	/*@Test
	public void testShouldGetActionsForUserRoles() throws Exception {
		List<String> roleCodesList = new ArrayList<String>();
		roleCodesList.add("CITIZEN");
		roleCodesList.add("SUPERUSER");
		ActionSearchCriteria actionSearchCriteria = ActionSearchCriteria.builder().roleCodes(roleCodesList).build();

		final List<Action> actions = getActions();
		when(actionService.getActions(actionSearchCriteria)).thenReturn(actions);
		when(actionService.getAllMDMSActions(actionSearchCriteria)).thenReturn(actions);

		mockMvc.perform(post("/v1/actions/_search").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("actionResponse.json")));
	}*/

	/*@Test
	public void testActionValidation() throws Exception {
		ActionValidation actionValidation = ActionValidation.builder().allowed(true).build();
		ValidateActionCriteria criteria = ValidateActionCriteria.builder()
				.roleNames(Arrays.asList("Citizen", "Employee")).tenantId("ap.public").actionUrl("/pgr/_statuses")
				.build();
		when(actionService.validate(criteria)).thenReturn(actionValidation);

		mockMvc.perform(post("/v1/actions/_validate").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("validateActionRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("validateActionResponse.json")));
	}*/

	private List<Action> getActions() {
		List<Action> actions = new ArrayList<Action>();
		Action action1 = Action.builder().id(1L).displayName("Create Complaint").name("Create Complaint").createdBy(1L)
				.lastModifiedBy(1L).url("/createcomplaint").orderNumber(1).enabled(true).tenantId("default").build();
		Action action2 = Action.builder().id(2L).displayName("Update Complaint").name("Update Complaint").createdBy(1L)
				.lastModifiedBy(1L).url("/updatecomplaint").orderNumber(2).enabled(false).tenantId("default").build();
		actions.add(action1);
		actions.add(action2);
		return actions;
	}

	@Test
	public void createAction() throws Exception {

		List<Action> actions = getActions();

		when(actionService.createAction(any(ActionRequest.class))).thenReturn(actions);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("actionResponse.json")));

	}

	@Test
	public void testShouldNotCreateActionIfNoActions() throws Exception {

		List<Action> actions = getActions();

		when(actionService.createAction(any(ActionRequest.class))).thenReturn(actions);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionRequestWithoutActions.json")))
				.andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("actionResponseWithoutActions.json")));

	}

	@Test
	public void testShouldNotCreateActionWithWrongRequestInfo() throws Exception {

		when(actionService.createAction(any(ActionRequest.class))).thenReturn(null);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionCreateRequestWithWrongRequestInfo.json")))
				.andExpect(status().isBadRequest());

	}

	@Test
	public void testShouldNotUpdateActionWithWrongRequestInfo() throws Exception {

		when(actionService.updateAction(any(ActionRequest.class))).thenReturn(null);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionCreateRequestWithWrongRequestInfo.json")))
				.andExpect(status().isBadRequest());

	}

	@Test
	public void testShouldNotUpdateAction() throws Exception {

		List<Action> actions = getActions();

		when(actionService.updateAction(any(ActionRequest.class))).thenReturn(actions);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionUpdateRequest.json")))
				.andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("actionUpdateResponse.json")));

	}

	@Test
	public void testShouldUpdateAction() throws Exception {

		List<Action> actions = new ArrayList<Action>();

		Action action1 = new Action();

		Action action2 = new Action();

		action1.setId(1l);
		action1.setName("test1");
		action1.setUrl("/test");
		action1.setDisplayName("Create  Test");
		action1.setEnabled(true);
		action1.setOrderNumber(1);
		action1.setCreatedBy(1l);
		action1.setLastModifiedBy(1l);

		action2.setId(2l);
		action2.setName("test2");
		action2.setUrl("/test/test2");
		action2.setDisplayName("Update Test");
		action2.setEnabled(true);
		action2.setOrderNumber(2);
		action2.setCreatedBy(1l);
		action2.setLastModifiedBy(1l);

		actions.add(action1);
		actions.add(action2);

		when(actionService.updateAction(any(ActionRequest.class))).thenReturn(actions);

		when(actionService.checkActionNameExit(any(String.class))).thenReturn(true);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		responseInfo.setApiId("org.egov.accesscontrol");
		responseInfo.setTs("Thu Mar 09 18:30:00 UTC 2017");
		responseInfo.setResMsgId("uief87324");

		mockMvc.perform(post("/v1/actions/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionUpdateRequest.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("actionUpdateSuccessResponse.json")));

	}

	@Test
	public void testShouldNotUpdateActionIfNoName() throws Exception {

		List<Action> actions = getActions();

		when(actionService.updateAction(any(ActionRequest.class))).thenReturn(actions);

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionUpdateRequestWithoutName.json")))
				.andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("actionUpdateResponseWithoutName.json")));

	}

	@Test
	public void testShouldGetModuleList() throws Exception {

		when(actionService.getAllActions(any(ActionRequest.class))).thenReturn(getModuleList());

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		responseInfo.setApiId("org.egov.accesscontrol");
		responseInfo.setTs("Thu Mar 09 18:30:00 UTC 2017");
		responseInfo.setMsgId("20170310130900");
		responseInfo.setResMsgId("uief87324");
		responseInfo.setVer("1.0");

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_get").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionListRequest.json"))).andExpect(status().isOk());

	}

	@Test
	public void testShouldNotGetModuleListWithoutTenant() throws Exception {

		when(actionService.getAllActions(any(ActionRequest.class))).thenReturn(getModuleList());

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_get").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionListRequestWithoutTenant.json")))
				.andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("actionListResponseWithoutTenant.json")));

	}

	@Test
	public void testShouldNotGetModuleListWithoutRoleCode() throws Exception {

		when(actionService.getAllActions(any(ActionRequest.class))).thenReturn(getModuleList());

		ResponseInfo responseInfo = ResponseInfo.builder().build();

		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), any(Boolean.class)))
				.thenReturn(responseInfo);

		mockMvc.perform(post("/v1/actions/_get").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(new Resources().getFileContents("actionListRequestWithoutRoleCode.json")))
				.andExpect(status().isBadRequest()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(new Resources().getFileContents("actionListResponseWithoutRoleCode.json")));

	}

	private List<Action> getModuleList() {

		List<Action> actionList = new ArrayList<Action>();

		Module module = new Module();

		module.setId(74l);
		module.setName("ess");
		module.setCode("ESS");
		module.setDisplayName("Employee Self Service");
		module.setEnabled(false);

		Action action1 = new Action();

		action1.setId(268l);

		action1.setName("ESS Leave Application");
		action1.setUrl("/app/hr/leavemaster/apply-leave.html");
		action1.setDisplayName("Apply Leave");
		action1.setEnabled(false);
		action1.setServiceCode("ESS");

		Action action2 = new Action();

		action2.setId(267l);
		action2.setName("View ESS Employee");
		action2.setUrl("/app/hr/employee/create.html");
		action2.setDisplayName("My Details");
		action2.setEnabled(false);
		action2.setServiceCode("ESS");

		actionList.add(action1);
		actionList.add(action2);

		module.setActionList(actionList);

		return actionList;
	}
}