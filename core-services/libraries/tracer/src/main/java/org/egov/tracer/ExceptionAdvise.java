package org.egov.tracer;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.egov.tracer.config.TracerProperties;
import org.egov.tracer.http.filters.MultiReadRequestWrapper;
import org.egov.tracer.kafka.ErrorQueueProducer;
import org.egov.tracer.model.*;
import org.egov.tracer.model.Error;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.ResourceAccessException;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.egov.tracer.constants.TracerConstants.CORRELATION_ID_MDC;


@ControllerAdvice
@Slf4j
@Order(Ordered.LOWEST_PRECEDENCE)
@EnableConfigurationProperties({TracerProperties.class})
public class ExceptionAdvise {

    @Value("${tracer.errors.provideExceptionInDetails:false}")
    private boolean provideExceptionInDetails;

	@Autowired
	private ErrorQueueProducer errorQueueProducer;

	@Autowired
    private TracerProperties tracerProperties;

    @ExceptionHandler(value = Exception.class)
	@ResponseBody
	public ResponseEntity<?> exceptionHandler(HttpServletRequest request ,Exception ex) {

		String contentType = request.getContentType();
		boolean isJsonContentType = (contentType != null && contentType.toLowerCase().contains("application/json"));
        log.error("Exception caught in tracer ", ex);
        String body = "";

        try {
            if(request instanceof MultiReadRequestWrapper) {
                ServletInputStream stream = request.getInputStream();
                body = IOUtils.toString(stream, "UTF-8");
            } else
                body = "Unable to retrieve request body";

        } catch (IOException ignored) {
            body = "Unable to retrieve request body";
        }

		ErrorRes errorRes = new ErrorRes();
		List<Error> errors = new ArrayList<>();

		try {
			if (ex instanceof HttpMediaTypeNotSupportedException) {
				errorRes.setErrors(new ArrayList<>(Collections.singletonList(new Error("UnsupportedMediaType", "An " +
                    "unsupported media Type was used - " + request.getContentType(), null, null))));
			} else if (ex instanceof ResourceAccessException) {
				Error err = new Error();
				err.setCode("ResourceAccessError");
				err.setMessage("An error occurred while accessing a underlying resource");
				errors.add(err);
				errorRes.setErrors(errors);
			} else if (ex instanceof HttpMessageNotReadableException) {
				Error err = new Error();
				String message = ex.getMessage();
	
				if (ex.getCause() instanceof JsonMappingException) {
					
					Pattern pattern = Pattern.compile("(.+)Can not deserialize instance of ([a-z]+\\.){1,}(?<objecttype>[^ ]+).*\\[\"(?<objectname>[^\"]+)\"\\].*",
							Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
					Matcher match = pattern.matcher(message);
					boolean matched = match.find();
					if (matched) {
						err.setMessage("Failed to parse field - " + match.group("objectname") + ". Expected type is " + match.group("objecttype"));
					} else {
						err.setMessage("Failed to deserialize certain JSON fields");
					}
					
					err.setCode("JsonMappingException");
					
				} else if (ex.getCause() instanceof JsonParseException) {
					err.setCode("JsonParseException");
					message = ex.getCause().getMessage().replaceAll("Source: [^;]+; ", "").replaceAll(" \\(code \\d+\\)", "").replaceAll("\\n", "");
					err.setMessage(message);
				} else {
					try {
						err.setMessage("JSON body has errors or is missing");
						JsonPath.parse(request).json();
					} catch (Exception jsonParseException) {
						log.warn("Error while parsing JSON", jsonParseException);
					}
 					err.setCode("MissingJsonException");
				}
				errors.add(err);
				errorRes.setErrors(errors);
			} else if (ex instanceof MethodArgumentNotValidException) {
				MethodArgumentNotValidException argumentNotValidException = (MethodArgumentNotValidException) ex;
				errorRes.setErrors(getBindingErrors(argumentNotValidException.getBindingResult(), errors));
	
			} else if (ex instanceof CustomBindingResultExceprion) {
				CustomBindingResultExceprion customBindingResultExceprion = (CustomBindingResultExceprion) ex;
				errorRes.setErrors(getBindingErrors(customBindingResultExceprion.getBindingResult(), errors));
			} else if (ex instanceof CustomException) {
				CustomException customException = (CustomException) ex;
				populateCustomErrors(customException, errors);
				errorRes.setErrors(errors);
			} else if (ex instanceof ServiceCallException) {
				ServiceCallException serviceCallException = (ServiceCallException) ex;
				sendErrorMessage(body, ex, request.getRequestURL().toString(),errorRes, isJsonContentType);
				DocumentContext documentContext = JsonPath.parse(serviceCallException.getError());
				LinkedHashMap<Object, Object> linkedHashMap = documentContext.json();
				return new ResponseEntity<>(linkedHashMap, HttpStatus.BAD_REQUEST);
				
			} else if (ex instanceof MissingServletRequestParameterException) {
				MissingServletRequestParameterException exception = (MissingServletRequestParameterException) ex;
				Error error = new Error();
				error.setCode("");
				error.setMessage(exception.getMessage());
				//error.setDescription(exception.getCause().toString());
				List<String> params = new ArrayList<>();
				params.add(exception.getParameterName());
				error.setParams(params);
				errors.add(error);
				errorRes.setErrors(errors);
			} else if (ex instanceof BindException) {
				BindException bindException = (BindException) ex;
	
				errorRes.setErrors(getBindingErrors(bindException.getBindingResult(), errors));
	
				//errorRes.setErrors(errors);
			}

            String exceptionName = ex.getClass().getSimpleName();
			String exceptionMessage = ex.getMessage();

			if (errorRes.getErrors() == null || errorRes.getErrors().size() == 0) {
				errorRes.setErrors(new ArrayList<>(Collections.singletonList(new Error(exceptionName, "An unhandled exception occurred on the server", exceptionMessage, null))));
			} else if (provideExceptionInDetails && errorRes.getErrors() != null && errorRes.getErrors().size() > 0) {
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                errorRes.getErrors().get(0).setDescription(sw.toString());
            }

			sendErrorMessage(body, ex, request.getRequestURL().toString(),errorRes, isJsonContentType);
		} catch (Exception tracerException) {
		    log.error("Error in tracer", tracerException);
			errorRes.setErrors(new ArrayList<>(Collections.singletonList(new Error("TracerException", "An unhandled exception occurred in tracer handler", null, null))));
		}
		return new ResponseEntity<>(errorRes, HttpStatus.BAD_REQUEST);
	}

	private List<Error> getBindingErrors(BindingResult bindingResult, List<Error> errors) {

		List<ObjectError> objectErrors = bindingResult.getAllErrors();

		for (ObjectError objectError : objectErrors) {
			Error error = new Error();
			String[] codes = objectError.getCodes();
			error.setCode(codes[0]);
			error.setMessage(objectError.getDefaultMessage());
			errors.add(error);
		}

		return errors;
	}

	private void populateCustomErrors(CustomException customException, List<Error> errors) {
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
		
	void sendErrorMessage(String body, Exception ex, String source, ErrorRes errorRes, boolean isJsonContentType) {
		DocumentContext documentContext;

        if (tracerProperties.isErrorsPublish()) {
            Object requestBody = body;
            if (isJsonContentType) {
                try {
                    documentContext = JsonPath.parse(body);
                    requestBody = documentContext.json();
                } catch (Exception exception) {
                    requestBody = body;
                }
            }

            StackTraceElement elements[] = ex.getStackTrace();

            ErrorQueueContract errorQueueContract = ErrorQueueContract.builder()
                .id(UUID.randomUUID().toString())
                .correlationId(MDC.get(CORRELATION_ID_MDC))
                .body(requestBody)
                .source(source)
                .ts(new Date().getTime())
                .errorRes(errorRes)
                .exception(Arrays.asList(elements))
                .message(ex.getMessage())
                .build();

            errorQueueProducer.sendMessage(errorQueueContract);
        }

	}
	
}
