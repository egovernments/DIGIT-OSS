package org.egov.access.web.controller;

import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.ActionValidation;
import org.egov.access.domain.model.authorize.AuthorizationRequestWrapper;
import org.egov.access.domain.service.ActionService;
import org.egov.access.util.AccessControlConstants;
import org.egov.access.web.contract.action.*;
import org.egov.access.web.contract.factory.ResponseInfoFactory;
import org.egov.access.web.contract.validateaction.ActionValidationContract;
import org.egov.access.web.contract.validateaction.ValidateActionRequest;
import org.egov.access.web.contract.validateaction.ValidateActionResponse;
import org.egov.access.web.errorhandlers.Error;
import org.egov.access.web.errorhandlers.ErrorResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ResponseInfo;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/v1/actions")
public class ActionController {

	private static final Logger logger = LoggerFactory.getLogger(ActionController.class);

	@Autowired
	private ActionService actionService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	private static final String[] taskAction = { "create", "update" };

	/*@PostMapping(value = "_search")
	public ActionResponse getActionsBasedOnRoles(@RequestBody final ActionRequest actionRequest) {
		List<Action> actionsList = actionService.getActions(actionRequest.toDomain());
		return getSuccessResponse(actionsList);
	}*/
	
	@PostMapping(value = "_search")
	public ActionResponse getActionsBasedOnRoles(@RequestBody final ActionRequest actionRequest) throws UnsupportedEncodingException, JSONException {
		List<Action> actionsList = actionService.getAllMDMSActions(actionRequest);
		return getSuccessResponse(actionsList);
	}

	@PostMapping(value = "_list")
	public ResponseEntity<?> getAllActionsBasedOnRoles(@RequestBody final ActionRequest actionRequest) {

		final List<ErrorResponse> errorResponses = validateActionRequest(actionRequest, "list");

		if (!errorResponses.isEmpty())
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		List<Module> moduleList = actionService.getAllActionsBasedOnRoles(actionRequest);

		return getListSuccessResponse(actionRequest.getRequestInfo(), moduleList);

	}

	@PostMapping(value = "_get")
	public ResponseEntity<?> getAllActions(@RequestBody final ActionRequest actionRequest){

		final List<ErrorResponse> errorResponses = validateActionRequest(actionRequest, "get");

		if (!errorResponses.isEmpty())
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
		
		List<Action> actionList = actionService.getAllActions(actionRequest);
		return getNewListSuccessResponse(actionRequest.getRequestInfo(), actionList);

	}
	
	@PostMapping(value = "mdms/_get")
	public ResponseEntity<?> getAllMDMSActions(@RequestBody final ActionRequest actionRequest) throws JSONException, UnsupportedEncodingException{

		final List<ErrorResponse> errorResponses = validateActionRequest(actionRequest, "get");

		if (!errorResponses.isEmpty())
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);
		
		List<Action> actionList = actionService.getAllMDMSActions(actionRequest);
		return getNewListSuccessResponse(actionRequest.getRequestInfo(), actionList);

	}
    
	
	@PostMapping(value = "_validate")
	public ValidateActionResponse validateAction(@RequestBody ValidateActionRequest validateActionRequest) {
		ActionValidation actionValidation = actionService.validate(validateActionRequest.toDomain());
		return getValidateActionResponse(actionValidation);
	}

	@PostMapping(value = "_authorize")
	public ResponseEntity<Void> authorize(@RequestBody @Valid AuthorizationRequestWrapper authorizationRequestWrapper) {
		boolean authorized = actionService.isAuthorized(authorizationRequestWrapper.getAuthorizationRequest());

		if(authorized)
			return new ResponseEntity<>(HttpStatus.OK);
		else
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	private ResponseEntity<?> getListSuccessResponse(final RequestInfo requestInfo, final List<Module> moduleList) {

		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		ActionSearchResponse response = new ActionSearchResponse();
		response.setResponseInfo(responseInfo);
		response.setModules(moduleList);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	private ResponseEntity<?> getNewListSuccessResponse(final RequestInfo requestInfo, final List<Action> actionList) {

		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		ActionSearchResponse response = new ActionSearchResponse();
		response.setResponseInfo(responseInfo);
		response.setActions(actionList);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	private ActionResponse getSuccessResponse(final List<Action> actionList) {
		final ResponseInfo responseInfo = ResponseInfo.builder().status(HttpStatus.OK.toString()).build();
		List<ActionContract> actionContracts = new ActionContract().getActions(actionList);
		return new ActionResponse(responseInfo, actionContracts);
	}

	private ValidateActionResponse getValidateActionResponse(ActionValidation actionValidation) {
		final ResponseInfo responseInfo = ResponseInfo.builder().status(HttpStatus.OK.toString()).build();
		return new ValidateActionResponse(responseInfo,
				ActionValidationContract.builder().allowed(actionValidation.isAllowed() ? "TRUE" : "FALSE").build());
	}

	@PostMapping(value = "_create")
	public ResponseEntity<?> createAction(@RequestBody @Valid final ActionRequest actionRequest,
			final BindingResult errors) {

		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<>(errRes, HttpStatus.BAD_REQUEST);
		}

		logger.info("Create Action Type Request::" + actionRequest);

		final List<ErrorResponse> errorResponses = validateActionRequest(actionRequest, taskAction[0]);

		if (!errorResponses.isEmpty())
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		List<Action> actions = actionService.createAction(actionRequest);

		return getSuccessResponse(actions, actionRequest.getRequestInfo());
	}

	@PostMapping(value = "_update")
	public ResponseEntity<?> updateAction(@RequestBody @Valid final ActionRequest actionRequest,
			final BindingResult errors) {

		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<>(errRes, HttpStatus.BAD_REQUEST);
		}

		logger.info("Update Action Request::" + actionRequest);

		final List<ErrorResponse> errorResponses = validateActionRequest(actionRequest, taskAction[1]);

		if (!errorResponses.isEmpty())
			return new ResponseEntity<>(errorResponses, HttpStatus.BAD_REQUEST);

		List<Action> actions = actionService.updateAction(actionRequest);

		return getSuccessResponse(actions, actionRequest.getRequestInfo());
	}

	private ResponseEntity<?> getSuccessResponse(final List<Action> actionList, final RequestInfo requestInfo) {
		final ActionResponse actionres = new ActionResponse();
		final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		actionres.setResponseInfo(responseInfo);
		actionres.setActions(new ActionContract().getActions(actionList));
		return new ResponseEntity<>(actionres, HttpStatus.OK);
	}

	private ErrorResponse populateErrors(final BindingResult errors) {
		final ErrorResponse errRes = new ErrorResponse();

		final Error error = new Error();
		error.setCode(1);
		error.setDescription("Error while binding request");
		if (errors.hasFieldErrors())
			for (final FieldError fieldError : errors.getFieldErrors())
				error.getFields().put(fieldError.getField(), fieldError.getRejectedValue());
		errRes.setError(error);
		return errRes;
	}

	private List<ErrorResponse> validateActionRequest(final ActionRequest actionRequest, final String action) {

		final List<ErrorResponse> errorResponses = new ArrayList<>();
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(actionRequest, action);
		errorResponse.setError(error);
		if (!errorResponse.getErrorFields().isEmpty())
			errorResponses.add(errorResponse);
		return errorResponses;
	}

	private Error getError(final ActionRequest actionRequest, final String action) {
		final List<ErrorField> errorFields = getErrorFields(actionRequest, action);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(AccessControlConstants.INVALID_ACTION_REQUEST_MESSAGE).errorFields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final ActionRequest actionRequest, final String action) {
		final List<ErrorField> errorFields = new ArrayList<>();

		if (action.equals("list") || action.equals("get")) {

			addTenantIdValidationError(actionRequest, errorFields);
			addRoleLenthValidationError(actionRequest, errorFields);

		} else {

			addActionsLengthValidationErrors(actionRequest, errorFields);

			if (actionRequest.getActions() != null && actionRequest.getActions().size() >= 1) {

				addActionNameValidationErrors(actionRequest, errorFields);
				if (action.equals(taskAction[0])) {

					checkDuplicateActionNameValidationErrors(actionRequest, errorFields);
				} else if (action.equals(taskAction[1])) {
					checkActionNameDoesNotExistError(actionRequest, errorFields);
				}

				checkCombinationOfUrlAndqueryparamsExist(actionRequest, errorFields);
			}

			return errorFields;
		}
		return errorFields;
	}

	private void addActionNameValidationErrors(final ActionRequest actionRequest, final List<ErrorField> errorFields) {

		for (int i = 0; i < actionRequest.getActions().size(); i++) {
			if (actionRequest.getActions().get(i).getName() == null
					|| actionRequest.getActions().get(i).getName().isEmpty()) {
				final ErrorField errorField = ErrorField.builder()
						.code(AccessControlConstants.ACTION_NAME_MANDATORY_CODE)
						.message(AccessControlConstants.ACTION_NAME_MANADATORY_ERROR_MESSAGE + " in " + (i + 1)
								+ " Object")
						.field(AccessControlConstants.ACTION_NAME_MANADATORY_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
	}

	private void checkDuplicateActionNameValidationErrors(final ActionRequest actionRequest,
			final List<ErrorField> errorFields) {

		for (int i = 0; i < actionRequest.getActions().size(); i++) {
			if (actionService.checkActionNameExit(actionRequest.getActions().get(i).getName())) {
				final ErrorField errorField = ErrorField.builder()
						.code(AccessControlConstants.ACTION_NAME_DUPLICATE_CODE)
						.message(AccessControlConstants.ACTION_NAME_DUPLICATE_ERROR_MESSAGE + " in " + (i + 1)
								+ " Object")
						.field(AccessControlConstants.ACTION_NAME_DUPLICATEFIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
	}

	private void checkActionNameDoesNotExistError(final ActionRequest actionRequest,
			final List<ErrorField> errorFields) {

		for (int i = 0; i < actionRequest.getActions().size(); i++) {
			if (!actionService.checkActionNameExit(actionRequest.getActions().get(i).getName())) {
				final ErrorField errorField = ErrorField.builder()
						.code(AccessControlConstants.ACTION_NAME_DOESNOT_EXIT_CODE)
						.message(AccessControlConstants.ACTION_NAME_DOESNOT_EXIT_ERROR_MESSAGE + " in " + (i + 1)
								+ " Object")
						.field(AccessControlConstants.ACTION_NAME_DOESNOT_EXIT_FIELD_NAME).build();
				errorFields.add(errorField);
			}
		}
	}

	private void checkCombinationOfUrlAndqueryparamsExist(final ActionRequest actionRequest,
			final List<ErrorField> errorFields) {

		for (int i = 0; i < actionRequest.getActions().size(); i++) {
			if (actionService.checkCombinationOfUrlAndqueryparamsExist(actionRequest.getActions().get(i).getUrl(),
					actionRequest.getActions().get(i).getQueryParams())) {
				final ErrorField errorField = ErrorField.builder()
						.code(AccessControlConstants.ACTION_URL_QUERYPARAMS_UNIQUE_CODE)
						.message(AccessControlConstants.ACTION_URL_QUERYPARAMS_UNIQUE_ERROR_MESSAGE + " in " + (i + 1)
								+ " Object")
						.field(AccessControlConstants.ACTION_URL_QUERYPARAMS_UNIQUE_FIELD_NAME).build();
				errorFields.add(errorField);
			}

		}
	}

	private void addActionsLengthValidationErrors(final ActionRequest actionRequest,
			final List<ErrorField> errorFields) {

		if (!(actionRequest.getActions() != null && actionRequest.getActions().size() >= 1)) {

			final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.ACTIONS_NAME_MANDATORY_CODE)
					.message(AccessControlConstants.ACTIONS_NAME_MANDATORY_ERROR_MESSAGE)
					.field(AccessControlConstants.ACTIONS_NAME_MANDATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}

	}

	private void addTenantIdValidationError(final ActionRequest actionRequest, final List<ErrorField> errorFields) {

		if (actionRequest.getTenantId() == null || actionRequest.getTenantId().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.TENANTID_MANDATORY_CODE)
					.message(AccessControlConstants.TENANTID_MANADATORY_ERROR_MESSAGE)
					.field(AccessControlConstants.TENANTID_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		}

	}

	private void addRoleLenthValidationError(final ActionRequest actionRequest, final List<ErrorField> errorFields) {

		if (!(actionRequest.getRoleCodes() != null && actionRequest.getRoleCodes().size() > 0)) {

			final ErrorField errorField = ErrorField.builder().code(AccessControlConstants.ROLE_LENGHTH_MANDATORY_CODE)
					.message(AccessControlConstants.ROLE_LENGTH_MANADATORY_ERROR_MESSAGE)
					.field(AccessControlConstants.ROLE_LENGTH_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);

		}
	}
}
