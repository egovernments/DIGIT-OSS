package org.egov.commons.web.controller;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.commons.model.BusinessDetailsCriteria;
import org.egov.commons.model.EnumData;
import org.egov.commons.model.enums.BusinessType;
import org.egov.commons.service.BusinessCategoryService;
import org.egov.commons.service.BusinessDetailsService;
import org.egov.commons.util.CollectionConstants;
import org.egov.commons.web.contract.*;
import org.egov.commons.web.contract.factory.ResponseInfoFact;
import org.egov.commons.web.errorhandlers.Error;
import org.egov.commons.web.errorhandlers.ErrorResponse;
import org.egov.commons.web.errorhandlers.RequestErrorHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/businessDetails")
public class BusinessDetailsController {
	@Autowired
	BusinessDetailsService businessDetailsService;

	@Autowired
	BusinessCategoryService businessCategoryService;

	@Autowired
	private RequestErrorHandler errHandler;

	@Autowired
	private ResponseInfoFact responseInfoFactory;

	private static final Logger logger = LoggerFactory.getLogger(BusinessDetailsController.class);

	@PostMapping(value = "/_create")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<?> createBusinessDetails(@RequestBody BusinessDetailsRequest businessDetailsRequest,
			final BindingResult errors) {
		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		logger.info("businessDetailsRequest::" + businessDetailsRequest);
		final List<ErrorResponse> errorResponses = validateBusinessDetailsRequest(businessDetailsRequest,false);
		if (!errorResponses.isEmpty())
			return new ResponseEntity<List<ErrorResponse>>(errorResponses, HttpStatus.BAD_REQUEST);
		BusinessDetailsRequest detailsRequest=  businessDetailsService.createDetailsAsync(businessDetailsRequest);
			
		return getSuccessResponse(businessDetailsRequest.getRequestInfo(),detailsRequest.getBusinessDetails());
	}

	@PostMapping(value = "/_update")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> updateBusinessDetails(@RequestBody BusinessDetailsRequest businessDetailsRequest,
			final BindingResult errors) {
		if (errors.hasErrors()) {
			final ErrorResponse errRes = populateErrors(errors);
			return new ResponseEntity<ErrorResponse>(errRes, HttpStatus.BAD_REQUEST);
		}
		logger.info("businessDetailsRequest::" + businessDetailsRequest);
		final List<ErrorResponse> errorResponses = validateBusinessDetailsRequest(businessDetailsRequest,true);
		if (!errorResponses.isEmpty())
			return new ResponseEntity<List<ErrorResponse>>(errorResponses, HttpStatus.BAD_REQUEST);
		BusinessDetailsRequest detailsRequest = businessDetailsService
				.updateDetailsAsync(businessDetailsRequest);
		return getSuccessResponse(businessDetailsRequest.getRequestInfo(), detailsRequest.getBusinessDetails());
	}

	@PostMapping(value = "/_search")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> searchBusinessDetails(
			@ModelAttribute @Valid final BusinessDetailsGetRequest detailsGetRequest,
			final BindingResult modelAttributeBindingResult,
			@RequestBody @Valid final RequestInfoWrap requestInfoWrapper,
			final BindingResult requestBodyBindingResult) {

		BusinessDetailsCriteria detailsCriteria = BusinessDetailsCriteria.builder()
				.active(detailsGetRequest.getActive()).businessCategoryCode(detailsGetRequest.getBusinessCategoryCode())
				.businessType(detailsGetRequest.getBusinessType())
				.businessDetailsCodes(detailsGetRequest.getBusinessDetailsCodes()).ids(detailsGetRequest.getId())
				.sortBy(detailsGetRequest.getSortBy()).sortOrder(detailsGetRequest.getSortOrder())
				.tenantId(detailsGetRequest.getTenantId()).build();
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
		if (modelAttributeBindingResult.hasErrors())
			return errHandler.getErrorResponseEntityForMissingParameters(modelAttributeBindingResult, requestInfo);

		if (requestBodyBindingResult.hasErrors())
			return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult, requestInfo);
		List<BusinessDetails> detailsRequestInfo = new ArrayList<>();
		try {
			detailsRequestInfo = businessDetailsService.getForCriteria(detailsCriteria).toDomainContract();

		} catch (final Exception exception) {
			logger.error("Error while processing request " + detailsGetRequest, exception);
			return errHandler.getResponseEntityForUnexpectedErrors(requestInfo);
		}
		return getSuccessResponse(requestInfo, detailsRequestInfo);
	}

    @RequestMapping(value = "/_getBusinessTypes")
    public ResponseEntity<?> getBusinessTypes(@RequestParam final String tenantId,@RequestBody @Valid final RequestInfoWrapper requestInfoWrapper,
                                                   final BindingResult requestBodyBindingResult) {
        if (requestBodyBindingResult.hasErrors())
            return errHandler.getErrorResponseEntityForMissingRequestInfo(requestBodyBindingResult,
                    requestInfoWrapper.getRequestInfo());

        final List<EnumData> modelList = new ArrayList<>();
        for (final BusinessType key : BusinessType.values())
            modelList.add(new EnumData(key.name(), key));
        return getSuccessResponse(modelList, requestInfoWrapper.getRequestInfo());
    }

	private ResponseEntity<?> getSuccessResponse(RequestInfo requestInfo,
			List<BusinessDetails> detailsRequestInfo) {
		BusinessDetailsResponse response = new BusinessDetailsResponse();
		response.setBusinessDetails(detailsRequestInfo);
		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
		responseInfo.setStatus(HttpStatus.OK.toString());
		response.setResponseInfo(responseInfo);
		return new ResponseEntity<BusinessDetailsResponse>(response, HttpStatus.OK);
	}

	private List<ErrorResponse> validateBusinessDetailsRequest(final BusinessDetailsRequest businessDetailsRequest
			,Boolean isUpdate) {
		final List<ErrorResponse> errorResponses = new ArrayList<>();
		final ErrorResponse errorResponse = new ErrorResponse();
		final Error error = getError(businessDetailsRequest,isUpdate);
		errorResponse.setError(error);
		if (!errorResponse.getErrorFields().isEmpty())
			errorResponses.add(errorResponse);
		return errorResponses;
	}

	private Error getError(final BusinessDetailsRequest businessDetailsRequest,Boolean isUpdate) {
		final List<ErrorField> errorFields = getErrorFields(businessDetailsRequest,isUpdate);
		return Error.builder().code(HttpStatus.BAD_REQUEST.value())
				.message(CollectionConstants.INVALID_DETAILS_REQUEST_MESSAGE).errorFields(errorFields).build();
	}

	private List<ErrorField> getErrorFields(final BusinessDetailsRequest businessDetailsRequest,Boolean isUpdate) {
		final List<ErrorField> errorFields = new ArrayList<>();

		addTenantIdValidationErrors(businessDetailsRequest, errorFields);
		addNameValidationErrors(businessDetailsRequest, errorFields,isUpdate);
		addCodeValidationErrors(businessDetailsRequest, errorFields,isUpdate);
		addBusinessTypeValidationErrors(businessDetailsRequest, errorFields);
		addFundValidationErrors(businessDetailsRequest, errorFields);
		addFunctionValidationErrors(businessDetailsRequest, errorFields);
		addCategoryValidationErrors(businessDetailsRequest, errorFields);
		return errorFields;
	}

	private void addCategoryValidationErrors(BusinessDetailsRequest businessDetailsRequest,
			List<ErrorField> errorFields) {
		final List<BusinessDetails> detailsInfoList = businessDetailsRequest.getBusinessDetails();
        for(BusinessDetails businessDetail : detailsInfoList) {
            if (businessDetail.getBusinessCategory() == null) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_CATEGORY_MANDATORY_CODE)
                        .message(CollectionConstants.DETAILS_CATEGORY_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.DETAILS_CATEGORY_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            } else
                return;
        }
	}

	private void addFundValidationErrors(BusinessDetailsRequest businessDetailsRequest, List<ErrorField> errorFields) {
		final List<BusinessDetails> detailsInfoList = businessDetailsRequest.getBusinessDetails();
        for(BusinessDetails businessDetail : detailsInfoList) {
            if (StringUtils.isBlank(businessDetail.getFund())) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_FUND_MANDATORY_CODE)
                        .message(CollectionConstants.DETAILS_FUND_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.DETAILS_FUND_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            } else
                return;
        }
	}

	private void addFunctionValidationErrors(BusinessDetailsRequest businessDetailsRequest,
			List<ErrorField> errorFields) {
        final List<BusinessDetails> detailsInfoList = businessDetailsRequest.getBusinessDetails();
        for(BusinessDetails businessDetail : detailsInfoList) {
            if (StringUtils.isBlank(businessDetail.getFunction())) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_FUNCTION_MANDATORY_CODE)
                        .message(CollectionConstants.DETAILS_FUNCTION_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.DETAILS_FUNCTION_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            } else
                return;
        }
	}

	private void addBusinessTypeValidationErrors(BusinessDetailsRequest businessDetailsRequest,
			List<ErrorField> errorFields) {
        final List<BusinessDetails> detailsInfoList = businessDetailsRequest.getBusinessDetails();
        for(BusinessDetails businessDetail : detailsInfoList) {
            if (StringUtils.isBlank(businessDetail.getBusinessType())) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_TYPE_MANDATORY_CODE)
                        .message(CollectionConstants.DETAILS_TYPE_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.DETAILS_TYPE_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            }  else if(!BusinessType.getAllObjectValues().contains(businessDetail.getBusinessType())) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_VALID_BUSINESS_TYPE_CODE)
                        .message(CollectionConstants.DETAILS_VALID_BUSINESS_TYPE_FIELD_NAME)
                        .field(CollectionConstants.DETAILS_VALID_BUSINESS_TYPE_CODE_MESSAGE).build();
                errorFields.add(errorField);
            }  else
                return;
        }

	}

	private void addTenantIdValidationErrors(final BusinessDetailsRequest businessDetailsRequest,
			final List<ErrorField> errorFields) {
        final List<BusinessDetails> detailsInfoList = businessDetailsRequest.getBusinessDetails();
        for(BusinessDetails businessDetail : detailsInfoList) {
            if (StringUtils.isBlank(businessDetail.getTenantId())) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.TENANT_MANDATORY_CODE)
                        .message(CollectionConstants.TENANT_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.TENANT_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            } else
                return;
        }
	}

	private void addNameValidationErrors(final BusinessDetailsRequest businessDetailsRequest,
			final List<ErrorField> errorFields,Boolean isUpdate) {
        final List<BusinessDetails> detailsInfoList = businessDetailsRequest.getBusinessDetails();
        for(BusinessDetails businessDetail : detailsInfoList) {
            if (StringUtils.isBlank(businessDetail.getName())) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_NAME_MANDATORY_CODE)
                        .message(CollectionConstants.DETAILS_NAME_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.DETAILS_NAME_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            } else if (!businessDetailsService.getBusinessDetailsByNameAndTenantId(businessDetail.getName(),
                    businessDetail.getTenantId(), businessDetail.getId(), isUpdate)) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_NAME_UNIQUE_CODE)
                        .message(CollectionConstants.DETAILS_NAME_UNIQUE_ERROR_MESSAGE)
                        .field(CollectionConstants.DETAILS_NAME_UNIQUE_FIELD_NAME).build();
                errorFields.add(errorField);
            } else
                return;
        }
	}

	private void addCodeValidationErrors(final BusinessDetailsRequest businessDetailsRequest,
			List<ErrorField> errorFields,Boolean isUpdate) {
        final List<BusinessDetails> detailsInfoList = businessDetailsRequest.getBusinessDetails();
        for(BusinessDetails businessDetail : detailsInfoList) {
            if (StringUtils.isBlank(businessDetail.getCode())) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_CODE_MANDATORY_CODE)
                        .message(CollectionConstants.DETAILS_CODE_MANADATORY_ERROR_MESSAGE)
                        .field(CollectionConstants.DETAILS_CODE_MANADATORY_FIELD_NAME).build();
                errorFields.add(errorField);
            } else if (!businessDetailsService.getBusinessDetailsByCodeAndTenantId(businessDetail.getCode(),
                    businessDetail.getTenantId(), businessDetail.getId(), isUpdate)) {
                final ErrorField errorField = ErrorField.builder().code(CollectionConstants.DETAILS_CODE_UNIQUE_CODE)
                        .message(CollectionConstants.DETAILS_CODE_UNIQUE_ERROR_MESSAGE)
                        .field(CollectionConstants.DETAILS_CODE_UNIQUE_FIELD_NAME).build();
                errorFields.add(errorField);
            } else
                return;
        }
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


    private ResponseEntity<?> getSuccessResponse(final List<EnumData> modelList,
                                                 final RequestInfo requestInfo) {
        final EnumResponse response = new EnumResponse();
        final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
        responseInfo.setStatus(HttpStatus.OK.toString());
        response.setResponseInfo(responseInfo);
        response.setDataModelList(modelList);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
}
