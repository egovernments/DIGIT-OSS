package org.egov.common.web.contract;

public class RequestContext {

	public static String CORRELATION_ID = "X-CORRELATION-ID";

	private static final ThreadLocal<String> id = new ThreadLocal<>();

	public static String getId() {
		return id.get();
	}

	public static void setId(String correlationId) {
		id.set(correlationId);
	}
}
