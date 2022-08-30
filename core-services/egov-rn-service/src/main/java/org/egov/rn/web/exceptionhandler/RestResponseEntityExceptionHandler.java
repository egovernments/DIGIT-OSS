package org.egov.rn.web.exceptionhandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.rn.exception.EnrichmentException;
import org.egov.rn.exception.ProducerException;
import org.egov.rn.exception.ValidationException;
import org.egov.rn.exception.WorkflowException;
import org.egov.rn.web.models.Error;
import org.egov.rn.web.models.ErrorRes;
import org.egov.rn.web.models.RegistrationRequest;
import org.egov.rn.web.utils.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.util.Collections;

@ControllerAdvice
public class RestResponseEntityExceptionHandler
        extends ResponseEntityExceptionHandler {

    private final ObjectMapper objectMapper;

    @Autowired
    public RestResponseEntityExceptionHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @ExceptionHandler(value
            = { EnrichmentException.class, WorkflowException.class, ProducerException.class })
    protected ResponseEntity<Object> handleInternalServerErrors(
            RuntimeException ex, WebRequest request) {

        RegistrationRequest registrationRequest = (RegistrationRequest)
                getRequestBody(request, RegistrationRequest.class);

        ErrorRes errorRes = ErrorRes.builder().errors(Collections.singletonList(Error.builder()
                        .message(ex.getMessage()).build()))
                .responseInfo(ModelMapper.map(registrationRequest.getRequestInfo(), false))
                .build();
        return handleExceptionInternal(ex, errorRes,
                new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler(value
            = { ValidationException.class })
    protected ResponseEntity<Object> handleValidationErrors(
            RuntimeException ex, WebRequest request) {
        RegistrationRequest registrationRequest = (RegistrationRequest)
                getRequestBody(request, RegistrationRequest.class);

        ErrorRes errorRes = ErrorRes.builder().errors(Collections.singletonList(Error.builder()
                        .message(ex.getMessage()).build()))
                .responseInfo(ModelMapper.map(registrationRequest.getRequestInfo(), false))
                .build();
        return handleExceptionInternal(ex, errorRes,
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    private Object getRequestBody(WebRequest request, Class clazz) {
        try {
            ContentCachingRequestWrapper nativeRequest = (ContentCachingRequestWrapper)
                    ((ServletWebRequest) request).getNativeRequest();
            return objectMapper.readValue(new String(nativeRequest.getContentAsByteArray()), clazz);
        } catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }
}