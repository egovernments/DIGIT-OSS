
package org.egov.commons.web.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.commons.model.BusinessCategoryCriteria;
import org.egov.commons.service.BusinessCategoryService;
import org.egov.commons.util.CollectionConstants;
import org.egov.commons.web.contract.BusinessCategory;
import org.egov.commons.web.contract.BusinessCategoryGetRequest;
import org.egov.commons.web.contract.BusinessCategoryRequest;
import org.egov.commons.web.contract.BusinessCategoryResponse;
import org.egov.commons.web.contract.RequestInfoWrap;
import org.egov.commons.web.contract.factory.ResponseInfoFact;
import org.egov.commons.web.errorhandlers.RequestErrorHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = { "/businessCategory" })
public class BusinessCategoryController {
	private static final Logger logger = LoggerFactory.getLogger(BusinessCategoryController.class);

	@Autowired
	private BusinessCategoryService businessCategoryService;

	@Autowired
	private ResponseInfoFact responseInfoFact;

	@Autowired
	private RequestErrorHandler errHandler;

	@PostMapping(value = "/_create")
	@ResponseBody
	public ResponseEntity<?> createServiceCategory(@RequestBody BusinessCategoryRequest businessCategoryRequest,
			final BindingResult errors) {
		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		logger.info("businessCategoryRequest::" + businessCategoryRequest);
            List<ErrorResponse> errResponses= validateBusinessCategoryRequest(businessCategoryRequest,false);
            if(!errResponses.isEmpty())
            return new ResponseEntity<List<ErrorResponse>>(errResponses, HttpStatus.BAD_REQUEST);
		BusinessCategoryRequest categoryRequest = businessCategoryService.createAsync(businessCategoryRequest);
		return getSuccessResponse(businessCategoryRequest.getRequestInfo(),categoryRequest.getBusinessCategory());

	}

	@PostMapping(value = "/_update")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> updateServiceCategory(@RequestBody BusinessCategoryRequest businessCategoryRequest,
			 final BindingResult errors) {
		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		logger.info("businessCategoryRequest::" + businessCategoryRequest);
		 List<ErrorResponse> errResponses= validateBusinessCategoryRequest(businessCategoryRequest,true);
         if(!errResponses.isEmpty())
         return new ResponseEntity<List<ErrorResponse>>(errResponses, HttpStatus.BAD_REQUEST);
         BusinessCategoryRequest categoryRequest =  businessCategoryService.updateAsync(businessCategoryRequest);
		return getSuccessResponse(businessCategoryRequest.getRequestInfo(),categoryRequest.getBusinessCategory());

	}

	@PostMapping(value = "/_search")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> getAllBusinessCategories(
			@ModelAttribute @Valid final BusinessCategoryGetRequest categoryGetRequest,
			final BindingResult modelAttributeBindingResult,
			@RequestBody @Valid final RequestInfoWrap requestInfoWrapper,
			final BindingResult requestBodyBindingResult) {

		BusinessCategoryCriteria criteria = BusinessCategoryCriteria.builder().active(categoryGetRequest.getActive())
				.businessCategoryName(categoryGetRequest.getName()).id(categoryGetRequest.getId())
				.sortBy(categoryGetRequest.getSortBy()).sortOrder(categoryGetRequest.getSortOrder())
				.tenantId(categoryGetRequest.getTenantId()).build();
		final RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
		if (modelAttributeBindingResult.hasErrors())
			return errHandler.getErrorResponseEntityForMissingParameters(modelAttributeBindingResult, requestInfo);

		if (requestBodyBindingResult.hasErrors())
			return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult, requestInfo);
		List<BusinessCategory> categoryContract = new ArrayList<>();
		try {
			List<org.egov.commons.model.BusinessCategory> modelCategory = businessCategoryService
					.getForCriteria(criteria);
			categoryContract = modelCategory.stream().map(category -> category.toDomain()).collect(Collectors.toList());
		} catch (final Exception exception) {
			logger.error("Error while processing request " + categoryGetRequest, exception);
			return errHandler.getResponseEntityForUnexpectedErrors(requestInfo);
		}
		return getSuccessResponse(requestInfo, categoryContract);
	}

	private ResponseEntity<?> getSuccessResponse(RequestInfo requestInfo, List<BusinessCategory> category) {
		BusinessCategoryResponse response = new BusinessCategoryResponse();
		response.setBusinessCategoryInfo(category);
		ResponseInfo responseInfo = responseInfoFact.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		response.setResponseInfo(responseInfo);
		return new ResponseEntity<BusinessCategoryResponse>(response, HttpStatus.OK);
	}

	private ErrorResponse populateErrors(final BindingResult errors) {
		final ErrorResponse errRes = new ErrorResponse();
		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.BAD_REQUEST.toString());
		responseInfo.setApiId("");
		errRes.setResponseInfo(responseInfo);

		final org.egov.common.contract.response.Error error = new org.egov.common.contract.response.Error();
		error.setCode(1);
		error.setDescription("Error while binding request");
		if (errors.hasFieldErrors())
			for (final FieldError errs : errors.getFieldErrors())
	    error.getFields().add(new ErrorField(errs.getCode(), errs.getDefaultMessage(), errs.getObjectName()));

		errRes.setError(error);
		return errRes;
	}

	private List<ErrorResponse> validateBusinessCategoryRequest(final BusinessCategoryRequest businessCategoryRequest,Boolean isUpdate) {
		final ResponseInfo responseInfo = responseInfoFact.createResponseInfoFromRequestInfo(businessCategoryRequest.getRequestInfo(), false);
		List<ErrorResponse>errorResponses=new ArrayList<>();
		final ErrorResponse errorResponse = new ErrorResponse();
		errorResponse.setResponseInfo(responseInfo);
		final org.egov.common.contract.response.Error error = getError(businessCategoryRequest,isUpdate);
		errorResponse.setError(error);
		if (!errorResponse.getError().getFields().isEmpty())
		 errorResponses.add(errorResponse);
		 return errorResponses;
		}

	private org.egov.common.contract.response.Error getError(final BusinessCategoryRequest businessCategoryRequest,Boolean isUpdate) {

		final List<ErrorField> errorFields = getErrorFields(businessCategoryRequest,isUpdate);
		return org.egov.common.contract.response.Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(CollectionConstants.INVALID_CATEGORY_REQUEST_MESSAGE).fields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final BusinessCategoryRequest businessCategoryRequest,Boolean isUpdate) {
		final List<ErrorField> errorFields = new ArrayList<>();

		addTenantIdValidationErrors(businessCategoryRequest, errorFields);
		addNameValidationErrors(businessCategoryRequest, errorFields,isUpdate);
		addCodeValidationErrors(businessCategoryRequest, errorFields,isUpdate);
		return errorFields;
	}

	private void addCodeValidationErrors(BusinessCategoryRequest businessCategoryRequest,
			List<ErrorField> errorFields,Boolean isUpdate) {
		final List<BusinessCategory> categoryList = businessCategoryRequest.getBusinessCategory();
        for(BusinessCategory category : categoryList) {
            if (category.getCode() == null || category.getCode().isEmpty()) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.CATEGORY_CODE_MANDATORY_CODE)
                        .message(CollectionConstants.CATEGORY_CODE_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.CATEGORY_CODE_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            } else if (!businessCategoryService.getBusinessCategoryByCodeAndTenantId(category.getCode(),
                    category.getTenantId(), category.getId(), isUpdate)) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.CATEGORY_CODE_UNIQUE_CODE)
                        .message(CollectionConstants.CATEGORY_CODE_UNIQUE_ERROR_MESSAGE)
                        .field(CollectionConstants.CATEGORY_CODE_UNIQUE_FIELD_NAME).build();
                errorFields.add(errorField);
            } else
                return;
        }
	}

	private void addTenantIdValidationErrors(final BusinessCategoryRequest businessCategoryRequest,
			final List<ErrorField> errorFields) {
		final List<BusinessCategory> categoryList = businessCategoryRequest.getBusinessCategory();
        for(BusinessCategory category : categoryList) {
            if (category.getTenantId() == null || category.getTenantId().isEmpty()) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.TENANT_MANDATORY_CODE)
                        .message(CollectionConstants.TENANT_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.TENANT_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            } else
                return;
        }
	}

	private void addNameValidationErrors(final BusinessCategoryRequest businessCategoryRequest,
			final List<ErrorField> errorFields,Boolean isUpdate) {
		final List<BusinessCategory> categoryList = businessCategoryRequest.getBusinessCategory();
        for(BusinessCategory category : categoryList)
		if (category.getName() == null || category.getName().isEmpty()) {
			final ErrorField errorField = ErrorField.builder().code(CollectionConstants.CATEGORY_NAME_MANDATORY_CODE)
					.message(CollectionConstants.CATEGORY_NAME_MANADATORY_ERROR_MESSAGE)
					.field(CollectionConstants.CATEGORY_NAME_MANADATORY_FIELD_NAME).build();
			errorFields.add(errorField);
		} else if (!businessCategoryService.getBusinessCategoryByNameAndTenantId(category.getName(),
				category.getTenantId(),category.getId(),isUpdate)) {
			final ErrorField errorField = ErrorField.builder().code(CollectionConstants.CATEGORY_NAME_UNIQUE_CODE)
					.message(CollectionConstants.CATEGORY_NAME_UNIQUE_ERROR_MESSAGE)
					.field(CollectionConstants.CATEGORY_NAME_UNIQUE_FIELD_NAME).build();
			errorFields.add(errorField);
		} else
			return;
	}
}
