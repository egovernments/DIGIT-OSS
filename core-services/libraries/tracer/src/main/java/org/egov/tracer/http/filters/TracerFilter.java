package org.egov.tracer.http.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.egov.tracer.config.ObjectMapperFactory;
import org.egov.tracer.config.TracerProperties;
import org.slf4j.MDC;
import org.springframework.http.MediaType;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;

import static java.util.Objects.isNull;
import static org.egov.tracer.constants.TracerConstants.*;
import static org.springframework.util.StringUtils.isEmpty;

@Slf4j
public class TracerFilter implements Filter {

    private static final List<String> JSON_MEDIA_TYPES =
        Arrays.asList(MediaType.APPLICATION_JSON_UTF8_VALUE, MediaType.APPLICATION_JSON_VALUE);
    private static final String POST = "POST";
    private static final String REQUEST_BODY_LOG_MESSAGE = "Request body - {}";
    private static final String FAILED_TO_LOG_REQUEST_MESSAGE = "Failed to log request body";
    private static final String UTF_8 = "UTF-8";
    private static final String REQUEST_URI_LOG_MESSAGE = "Received request URI: {} ";
    private static final String REQUEST_PARAMS_LOG_MESSAGE = "Request Query params: {} ";
    private static final String LOG_RESPONSE_CODE_MESSAGE = "Response code sent: {}";

    private final ObjectMapper objectMapper;
    private TracerProperties tracerProperties;
    private Pattern skipPattern;

    public TracerFilter(TracerProperties tracerProperties, ObjectMapperFactory objectMapperFactory) {
        this.tracerProperties = tracerProperties;
        this.objectMapper = objectMapperFactory.getObjectMapper();
        this.skipPattern = isNull(tracerProperties.getFilterSkipPattern()) ? null :
            Pattern.compile(tracerProperties.getFilterSkipPattern());
    }

    @Override
    public void init(FilterConfig filterConfig) {

    }

    /**
     *
     * Cache the request for future body reads in case the body is compatible [json]
     * Retrieves correlation id
     *  - From header
     *  - if not exists, attempt to retrieve from body RequestInfo
     *  - if not exists, generate a uuid
     *
     * Set correlation id in MDC for future use, like logging etc
     * Log Request and Response depending on configuration
     *
     * @param servletRequest HTTP request
     * @param servletResponse HTTP response
     * @param filterChain pass control to the chain
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
        throws IOException, ServletException {
        String correlationId = null;
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;

        if (!this.isTraced(httpRequest)) {
            filterChain.doFilter(httpRequest, servletResponse);
        }
        else {

            if (isBodyCompatibleForParsing(httpRequest)) {
                final MultiReadRequestWrapper wrappedRequest = new MultiReadRequestWrapper(httpRequest);
                correlationId = getCorrelationId(wrappedRequest);
                MDC.put(CORRELATION_ID_MDC, correlationId);
                logRequestURI(httpRequest);

                if (tracerProperties.isRequestLoggingEnabled()) {
                    logRequestBodyAndParams(wrappedRequest);
                }

                filterChain.doFilter(wrappedRequest, servletResponse);

            } else {
                correlationId = getCorrelationId(httpRequest);
                MDC.put(CORRELATION_ID_MDC, correlationId);
                logRequestURI(httpRequest);
                filterChain.doFilter(httpRequest, servletResponse);
            }

            logResponse(servletResponse);
        }
    }

    @Override
    public void destroy() {
        MDC.clear();
    }

    private boolean isTraced(HttpServletRequest httpServletRequest) {
        if (this.skipPattern != null) {
            String url = httpServletRequest.getRequestURI().substring(httpServletRequest.getContextPath().length());
            return !this.skipPattern.matcher(url).matches();
        } else {
            return true;
        }
    }

    private void logResponse(ServletResponse servletResponse) {
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
        log.info(LOG_RESPONSE_CODE_MESSAGE, httpServletResponse.getStatus());
    }

    private void logRequestURI(HttpServletRequest httpRequest) {
        String url = httpRequest.getRequestURL().toString();
        log.info(REQUEST_URI_LOG_MESSAGE, url);
    }

    private String getCorrelationId(HttpServletRequest httpRequest) {
        String correlationId = getCorrelationIdFromHeader(httpRequest);

        if (isNull(correlationId) && httpRequest instanceof MultiReadRequestWrapper) {
            correlationId = getCorrelationIdFromBody(httpRequest);
        }

        if(isNull(correlationId))
            correlationId = getRandomCorrelationId();

        return correlationId;

    }

    private boolean isBodyCompatibleForParsing(HttpServletRequest httpRequest) {
        return POST.equals(httpRequest.getMethod())
            && JSON_MEDIA_TYPES.contains(httpRequest.getContentType());
    }


    private void logRequestBodyAndParams(HttpServletRequest requestWrapper) {
        try {
            final String requestBody = IOUtils.toString(requestWrapper.getInputStream(), UTF_8);
            String requestParams = requestWrapper.getQueryString();

            if(!isEmpty(requestParams))
                log.info(REQUEST_PARAMS_LOG_MESSAGE, requestParams);

            if(!isEmpty(requestBody))
                log.info(REQUEST_BODY_LOG_MESSAGE, requestBody);

        } catch (IOException e) {
            log.error(FAILED_TO_LOG_REQUEST_MESSAGE, e);
        }
    }

    private String getCorrelationIdFromHeader(HttpServletRequest httpRequest) {
        return httpRequest.getHeader(CORRELATION_ID_HEADER);
    }


    @SuppressWarnings("unchecked")
    private String getCorrelationIdFromBody(HttpServletRequest httpServletRequest) {
        String correlationId = null;
        try {
            final HashMap<String, Object> requestMap = (HashMap<String, Object>)
                objectMapper.readValue(httpServletRequest.getInputStream(), HashMap.class);
            Object requestInfo = requestMap.containsKey(REQUEST_INFO_FIELD_NAME_IN_JAVA_CLASS_CASE) ? requestMap.get
                (REQUEST_INFO_FIELD_NAME_IN_JAVA_CLASS_CASE) : requestMap.get(REQUEST_INFO_IN_CAMEL_CASE);

            if (isNull(requestInfo))
                return null;
            else {
                if (requestInfo instanceof Map) {
                    correlationId = (String) ((Map) requestInfo).get(CORRELATION_ID_FIELD_NAME);
                }
            }
        } catch (IOException ignored){}

        return correlationId;
    }

    private String getRandomCorrelationId() {
        return UUID.randomUUID().toString();
    }


}
