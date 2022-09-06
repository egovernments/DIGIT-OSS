package org.egov.rn.web.exceptionhandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.rn.exception.EnrichmentException;
import org.egov.rn.exception.ProducerException;
import org.egov.rn.exception.ValidationException;
import org.egov.rn.exception.WorkflowException;
import org.egov.rn.service.dhis2.errors.ErrorResponse;
import org.egov.rn.web.models.Error;
import org.egov.rn.web.models.ErrorRes;
import org.egov.rn.web.models.RegistrationRequest;
import org.egov.rn.web.utils.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.util.Collections;

@ControllerAdvice
@Slf4j
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
        log.error("Error occurred", ex);
        return handleExceptionInternal(ex, errorRes,
                new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }


    @ExceptionHandler(value
            = { EmptyResultDataAccessException.class})
    protected ResponseEntity<Object> handleNoDataFound(
            RuntimeException ex, WebRequest request) {


        ErrorRes errorRes = ErrorRes.builder().errors(Collections.singletonList(Error.builder()
                        .message("Record Not Found").build()))
                .build();
        log.error("Error occurred", ex);
        return handleExceptionInternal(ex, errorRes,
                new HttpHeaders(), HttpStatus.NOT_FOUND, request);
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
        log.error("Error occurred", ex);
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


    @ExceptionHandler(HttpStatusCodeException.class)
    protected ResponseEntity<ErrorResponse> handleEntityNotFound(
            HttpStatusCodeException ex) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        log.error(ex.toString());
        ErrorResponse r = mapper.readValue(ex.getResponseBodyAsString(), ErrorResponse.class);
        return new ResponseEntity<ErrorResponse>(r, HttpStatus.valueOf(ex.getRawStatusCode()));
    }
}