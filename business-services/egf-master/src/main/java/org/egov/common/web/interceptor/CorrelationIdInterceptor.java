package org.egov.common.web.interceptor;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.egov.common.web.contract.RequestContext;
import org.slf4j.MDC;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class CorrelationIdInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {

		final String correlationId = getCorrelationId(request);
		MDC.put(RequestContext.CORRELATION_ID, correlationId);
		RequestContext.setId(correlationId);
		return super.preHandle(request, response, handler);
	}

	private String getCorrelationId(HttpServletRequest request) {
		final String incomingCorrelationId = request.getHeader(RequestContext.CORRELATION_ID);
		return incomingCorrelationId == null ? UUID.randomUUID().toString() : incomingCorrelationId;
	}
}
