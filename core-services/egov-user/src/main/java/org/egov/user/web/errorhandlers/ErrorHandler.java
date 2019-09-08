package org.egov.user.web.errorhandlers;




import org.egov.user.web.contract.factory.ResponseInfoFactory;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@Component
public class ErrorHandler {
	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	public ResponseEntity<org.egov.common.contract.response.ErrorResponse> getErrorResponseEntityForMissingRequestInfo(BindingResult bindingResult,
			RequestInfo requestInfo) {
		org.egov.common.contract.response.Error error = new org.egov.common.contract.response.Error();
		error.setCode(400);
		error.setMessage("Missing RequestBody Fields");
		error.setDescription("Error While Binding RequestBody");
	
		if (bindingResult.hasFieldErrors()) {
			for (FieldError fieldError : bindingResult.getFieldErrors()) {
				ErrorField errorField=new ErrorField();
				errorField.setCode("400");
				errorField.setMessage("Missing RequestBody Fields");
				errorField.setField(fieldError.getField());
				error.getFields().add(errorField);
			}
		}

		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, false);

		org.egov.common.contract.response.ErrorResponse errorResponse = new org.egov.common.contract.response.ErrorResponse();
		errorResponse.setResponseInfo(responseInfo);
		errorResponse.setError(error);

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	public ResponseEntity<org.egov.common.contract.response.ErrorResponse> getErrorResponseEntityForMissingParameters(BindingResult bindingResult,
			RequestInfo requestInfo) {
		org.egov.common.contract.response.Error error = new org.egov.common.contract.response.Error();
		error.setCode(400);
		error.setMessage("Missing Required Query Parameter");
		error.setDescription("Error While Binding ModelAttribute");
		if (bindingResult.hasFieldErrors()) {
			for (FieldError fieldError : bindingResult.getFieldErrors()) {
				ErrorField errorField=new ErrorField();
				errorField.setCode("400");
				errorField.setMessage("Missing RequestBody Fields");
				errorField.setField(fieldError.getField());
				error.getFields().add(errorField);
			}
		}

		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, false);

		org.egov.common.contract.response.ErrorResponse errorResponse = new org.egov.common.contract.response.ErrorResponse();
		errorResponse.setResponseInfo(responseInfo);
		errorResponse.setError(error);

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	public ResponseEntity<org.egov.common.contract.response.ErrorResponse> getResponseEntityForUnexpectedErrors(RequestInfo requestInfo) {
		org.egov.common.contract.response.Error error = new org.egov.common.contract.response.Error();
		error.setCode(500);
		error.setMessage("Internal Server Error");
		error.setDescription("Unexpected Error Occurred");

		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, false);

		org.egov.common.contract.response.ErrorResponse errorResponse = new org.egov.common.contract.response.ErrorResponse();
		errorResponse.setResponseInfo(responseInfo);
		errorResponse.setError(error);

		return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}