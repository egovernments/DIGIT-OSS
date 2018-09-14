package org.egov.egf.web.controller.microservice;

import org.egov.egf.web.controller.microservice.exception.InvalidDataException;
import org.egov.infra.microservice.models.ErrorRes;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.models.Error;
import org.egov.infra.microservice.models.ResponseInfo;
import org.egov.infra.microservice.models.ResponseInfo.StatusEnum;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.validation.exception.ValidationError;
import org.egov.infra.validation.exception.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice(basePackages = "org.egov.egf.web.controller.microservice")
@RestController
public class CustomControllerAdvice {

	private static final Logger LOG = LoggerFactory.getLogger(CustomControllerAdvice.class);

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(MissingServletRequestParameterException.class)
	public String handleMissingParamsError(Exception ex) {
		ErrorRes errRes = new ErrorRes();
		errRes.setResponseInfo(MicroserviceUtils.getResponseInfo(null, HttpStatus.BAD_REQUEST.value(), null));
		return ex.getMessage();
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(InvalidDataException.class)
	public ErrorRes handleBindingErrors(InvalidDataException ex) {
		ErrorRes errRes = new ErrorRes();
		errRes.setResponseInfo(MicroserviceUtils.getResponseInfo(null, HttpStatus.BAD_REQUEST.value(), null));
		errRes.setErrors(ex.getValidationErrors());
		return errRes;
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(ValidationException.class)
	public ErrorRes handleValidationErrors(ValidationException ex) {
		ErrorRes errRes = new ErrorRes();
		errRes.setResponseInfo(MicroserviceUtils.getResponseInfo(null, HttpStatus.BAD_REQUEST.value(), null));
		Error err;
		for (ValidationError ve : ex.getErrors()) {
			err = new Error();
			err.code(ve.getKey());
			err.description(ve.getMessage());
			err.message(ve.getMessage());
			errRes.addErrorsItem(err);
		}
		return errRes;
	}

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(ApplicationRuntimeException.class)
	public ErrorRes handleApplicationErrors(ApplicationRuntimeException ex) {
		ErrorRes errRes = new ErrorRes();
		 
		errRes.setResponseInfo(MicroserviceUtils.getResponseInfo(null, HttpStatus.BAD_REQUEST.value(), null));
		Error err = new Error();
		err.code(ex.getMessage());
		err.description(ex.getMessage());
		err.message(ex.getMessage());
		errRes.addErrorsItem(err);
		

		return errRes;
	}
	

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(Exception.class)
	public ErrorRes handleApplicationErrors(Exception ex) {
		ErrorRes errRes = new ErrorRes();
		errRes.setResponseInfo(MicroserviceUtils.getResponseInfo(null, HttpStatus.BAD_REQUEST.value(), null));
		Error err = new Error();
		err.code(ex.getMessage());
		err.message(ex.getMessage());
		err.description(ex.getMessage());
		errRes.addErrorsItem(err);

		return errRes;
	}

	/*
	 * @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	 * 
	 * @ExceptionHandler(Exception.class) public ErrorRes
	 * handleServerError(Exception ex) { ex.printStackTrace(); ErrorRes errRes =
	 * new ErrorRes(); ex.printStackTrace(); ResponseInfo responseInfo = new
	 * ResponseInfo(); responseInfo.setStatus(StatusEnum.FAILED);
	 * errRes.setResponseInfo(responseInfo); Error error = new Error();
	 * error.setCode(ErrorCode.INTERNAL_SERVER_ERROR.getCode());
	 * error.setMessage(ErrorCode.INTERNAL_SERVER_ERROR.getDescription());
	 * error.setDescription(ex.getMessage()); List<Error> errors = new
	 * ArrayList<>(); errors.add(error); errRes.setErrors(errors); return
	 * errRes;
	 * 
	 * 
	 * 
	 * }
	 */

	/*
	 * @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	 * 
	 * @ExceptionHandler(NullPointerException.class) public ErrorRes
	 * handleServerError(NullPointerException ex) { ex.printStackTrace();
	 * ErrorRes errRes = new ErrorRes(); ex.printStackTrace(); ResponseInfo
	 * responseInfo = new ResponseInfo();
	 * responseInfo.setStatus(StatusEnum.FAILED.toString());
	 * errRes.setResponseInfo(responseInfo); Error error = new Error();
	 * error.setCode(ErrorCode.NULL_POINTER_ERROR.getCode());
	 * error.setMessage(ErrorCode.NULL_POINTER_ERROR.getMessage());
	 * error.setDescription(ErrorCode.NULL_POINTER_ERROR.getDescription());
	 * List<Error> errors = new ArrayList<>(); errors.add(error);
	 * errRes.setErrors(errors); return errRes; }
	 * 
	 * @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	 * 
	 * @ExceptionHandler(InvalidDataAccessApiUsageException.class ) public
	 * ErrorRes handleServerError(InvalidDataAccessApiUsageException ex) {
	 * ex.printStackTrace(); ErrorRes errRes = new ErrorRes();
	 * ex.printStackTrace(); ResponseInfo responseInfo = new ResponseInfo();
	 * responseInfo.setStatus(StatusEnum.FAILED.toString());
	 * errRes.setResponseInfo(responseInfo); Error error = new Error();
	 * error.setCode(ErrorCode.SQL_ERROR.getCode());
	 * error.setMessage(ErrorCode.SQL_ERROR.getMessage());
	 * error.setDescription(ErrorCode.SQL_ERROR.getDescription()); List<Error>
	 * errors = new ArrayList<>(); errors.add(error); errRes.setErrors(errors);
	 * return errRes;
	 * 
	 * 
	 * 
	 * }
	 */
	/*
	 * @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	 * 
	 * @ExceptionHandler(BadSqlGrammarException.class ) public ErrorRes
	 * handleServerError(BadSqlGrammarException ex) { ex.printStackTrace();
	 * ErrorRes errRes = new ErrorRes(); ex.printStackTrace(); ResponseInfo
	 * responseInfo = new ResponseInfo();
	 * responseInfo.setStatus(StatusEnum.FAILED.toString());
	 * errRes.setResponseInfo(responseInfo); Error error = new Error();
	 * error.setCode(ErrorCode.SQL_ERROR.getCode());
	 * error.setMessage(ErrorCode.SQL_ERROR.getMessage());
	 * error.setDescription(ErrorCode.SQL_ERROR.getDescription()); List<Error>
	 * errors = new ArrayList<>(); errors.add(error); errRes.setErrors(errors);
	 * return errRes;
	 * 
	 * 
	 * 
	 * }
	 */

	/*
	 * @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	 * 
	 * @ExceptionHandler(Throwable.class) public ErrorRes
	 * handleThrowable(Exception ex) { ErrorRes errRes = new ErrorRes();
	 * ex.printStackTrace(); ResponseInfo responseInfo = new ResponseInfo();
	 * responseInfo.setStatus(StatusEnum.FAILED);
	 * errRes.setResponseInfo(responseInfo); Error error = new Error();
	 * 
	 * error.setCode(500); error.setMessage("Internal Server Error");
	 * error.setDescription(ex.getMessage()); return errRes; }
	 * 
	 * 
	 * 
	 * @ResponseStatus(HttpStatus.UNAUTHORIZED)
	 * 
	 * @ExceptionHandler(UnauthorizedAccessException.class) public ErrorResponse
	 * handleAuthenticationError(UnauthorizedAccessException ex) {
	 * ex.printStackTrace(); ErrorResponse errRes = new ErrorResponse();
	 * 
	 * ResponseInfo responseInfo = new ResponseInfo();
	 * responseInfo.setStatus(HttpStatus.UNAUTHORIZED.toString());
	 * errRes.setResponseInfo(responseInfo); Error error = new Error();
	 * 
	 * error.setCode(404); error.setMessage("Un Authorized Access");
	 * error.setDescription(ex.getMessage()); errRes.setError(error); return
	 * errRes; }
	 */
}