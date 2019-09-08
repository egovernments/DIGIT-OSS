package org.egov.demand.web.advice;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@Deprecated
public class BillingControllerAdvice {

	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(Exception.class)
	public ErrorResponse handleServerError(Exception ex) {
		ex.printStackTrace();
		ErrorResponse errRes = new ErrorResponse();

		ResponseInfo responseInfo = new ResponseInfo();
		responseInfo.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.toString());
		errRes.setResponseInfo(responseInfo);
		Error error = new Error();

		error.setCode(400);
		error.setMessage(ex.getMessage());
		error.setDescription(ex.getMessage());
		errRes.setError(error);
		return errRes;
	}
}
