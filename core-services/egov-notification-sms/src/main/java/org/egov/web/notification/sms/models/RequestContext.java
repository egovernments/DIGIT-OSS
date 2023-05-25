package org.egov.web.notification.sms.models;

import org.slf4j.MDC;

public class RequestContext {

    private static final ThreadLocal<String> id = new ThreadLocal<>();
    public static String CORRELATION_ID = "X-CORRELATION-ID";

    public static String getId() {
        return id.get();
    }

    public static void setId(String correlationId) {
        id.set(correlationId);
        MDC.put(RequestContext.CORRELATION_ID, correlationId);
    }
}
