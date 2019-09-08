package org.egov.filestore.web.common;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.egov.filestore.domain.exception.ArtifactNotFoundException;
import org.egov.filestore.domain.exception.EmptyFileUploadRequestException;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.Error;
import org.egov.tracer.model.ErrorRes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@RestController
@Slf4j
public class GlobalExceptionHandler {
	
    @ExceptionHandler(value = ArtifactNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleFileNotFoundException(Exception e) {
    	log.error(e.getMessage());
        return e.getMessage();
    }

	@ExceptionHandler(value = EmptyFileUploadRequestException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public String handleEmptyFileUploadRequestException(Exception e) {
    	log.error(e.getMessage());
		return e.getMessage();
	}
	
    @ExceptionHandler(value = CustomException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<?> customException(CustomException e) {
    	
		ErrorRes errorRes = new ErrorRes();
		List<Error> errors = new ArrayList<>();
		populateCustomErrros(e, errors);
		errorRes.setErrors(errors);
    	return new ResponseEntity<>(errorRes, HttpStatus.BAD_REQUEST);
    }
    
	private void populateCustomErrros(CustomException customException, List<Error> errors) {
		Map<String, String> map = customException.getErrors();
		if (map != null && !map.isEmpty()) {
			for (Map.Entry<String, String> entry : map.entrySet()) {
				Error error = new Error();
				error.setCode(entry.getKey());
				error.setMessage(entry.getValue());
				errors.add(error);
			}
		} else {
			Error error = new Error();
			error.setCode(customException.getCode());
			error.setMessage(customException.getMessage());
			errors.add(error);
		}

	}
}
