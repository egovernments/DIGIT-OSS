package org.egov.utils;

import java.io.IOException;
import java.util.HashMap;

import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ErrorUtils {

	private static final String SEND_ERROR_FILTER_RAN = "sendErrorFilter.ran";

	private static final ThreadLocal<ObjectMapper> om = new ThreadLocal<ObjectMapper>() {
		@Override
		protected ObjectMapper initialValue() {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			return objectMapper;
		}
	};

	public static ObjectMapper getObjectMapper() {
		return om.get();
	}

	public static String getResponseBody(RequestContext ctx) throws IOException {
		String body = ctx.getResponseBody();

		if (body == null) {
			body = IOUtils.toString(ctx.getResponseDataStream());
			ctx.setResponseBody(body);
		}

		return body;
	}

	public static void raiseErrorFilterException(RequestContext ctx) {

		Throwable e = ctx.getThrowable() == null ? (Throwable) ctx.get("error.exception") : ctx.getThrowable();

		try {
			String message = e.getMessage();
			while (e.getCause() != null)
				e = e.getCause();
			_setExceptionBody(HttpStatus.INTERNAL_SERVER_ERROR,
					getErrorInfoObject(e.getClass().getName(), message, e.getMessage()));
		} catch (Exception e1) {
			e1.printStackTrace();
		}
	}

	private static HashMap<String, Object> getErrorInfoObject(String code, String message, String description) {

		HashMap<String, Object> error = new HashMap<String, Object>();
		error.put("code", "INTERNAL_GATEWAY_ERROR");
		error.put("message", code + " : " + message);
		error.put("description", description);
		return error;
	}

	public static void setCustomException(HttpStatus status, String message) {
		try {
			_setExceptionBody(status, getErrorInfoObject("CustomException", message, message));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}

	private static void _setExceptionBody(HttpStatus status, Object body) throws JsonProcessingException {
		_setExceptionBody(status, getObjectJSONString(body));
	}

	private static void _setExceptionBody(HttpStatus status, String body) {
		RequestContext ctx = RequestContext.getCurrentContext();

		ctx.setSendZuulResponse(false);
		ctx.setResponseStatusCode(status.value());
		ctx.getResponse().setContentType("application/json");
		if (body == null)
			body = "{}";
		ctx.setResponseBody(body);
		ctx.remove("error.status_code");
		ctx.set(SEND_ERROR_FILTER_RAN);
		ctx.remove("throwable");
	}

	private static String getObjectJSONString(Object obj) throws JsonProcessingException {
		return om.get().writeValueAsString(obj);
	}

}
