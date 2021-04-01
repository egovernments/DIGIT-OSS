package org.egov.tracer.constants;

public class TracerConstants {

    public static final String CORRELATION_ID_HEADER = "x-correlation-id";
    public static final String CORRELATION_ID_FIELD_NAME= "correlationId";
    public static final String CORRELATION_ID_MDC = "CORRELATION_ID";
    public static final String CORRELATION_ID_OPENTRACING_FORMAT = "correlation.id";
    public static final String TIME_ZONE_PROPERTY = "app.timezone";
    public static final String REQUEST_INFO_FIELD_NAME_IN_JAVA_CLASS_CASE = "RequestInfo";
    public static final String REQUEST_INFO_IN_CAMEL_CASE = "requestInfo";

    private TracerConstants(){}
}
