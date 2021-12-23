package org.egov.filters.pre;

import static org.egov.constants.RequestContextConstants.AUTH_BOOLEAN_FLAG_NAME;
import static org.egov.constants.RequestContextConstants.AUTH_TOKEN_KEY;
import static org.egov.constants.RequestContextConstants.CURRENT_REQUEST_SANITIZED_BODY;
import static org.egov.constants.RequestContextConstants.CURRENT_REQUEST_SANITIZED_BODY_STR;
import static org.egov.constants.RequestContextConstants.USER_INFO_FIELD_NAME;
import static org.egov.constants.RequestContextConstants.USER_INFO_KEY;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.egov.Utils.ExceptionUtils;
import org.egov.Utils.UserUtils;
import org.egov.Utils.Utils;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.contract.User;
import org.egov.model.RequestBodyInspector;
import org.egov.wrapper.CustomRequestWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.util.ObjectUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import lombok.extern.slf4j.Slf4j;

/**
 *  2nd pre filter to get executed.
 *  Identifies if the URI is part of open or mixed endpoint list.
 *  If its not present in the open list then the auth token is retrieved from the request body.
 *  For a restricted endpoint if auth token is not present then an error response is returned.
 */
@Slf4j
public class AuthPreCheckFilter extends ZuulFilter {
    private static final String AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE = "Retrieving of auth token failed";
    private static final String OPEN_ENDPOINT_MESSAGE = "Routing to an open endpoint: {}";
    private static final String AUTH_TOKEN_HEADER_MESSAGE = "Fetching auth-token from header for URI: {}";
    private static final String AUTH_TOKEN_BODY_MESSAGE = "Fetching auth-token from request body for URI: {}";
    private static final String AUTH_TOKEN_HEADER_NAME = "auth-token";
    private static final String RETRIEVED_AUTH_TOKEN_MESSAGE = "Auth-token: {}";
    private static final String ROUTING_TO_ANONYMOUS_ENDPOINT_MESSAGE = "Routing to anonymous endpoint: {}";
    private static final String ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE =
        "Routing to protected endpoint {} restricted - No auth token";
    private static final String UNAUTHORIZED_USER_MESSAGE = "You are not authorized to access this resource";
    private static final String PROCEED_ROUTING_MESSAGE = "Routing to an endpoint: {} - auth provided";
    private static final String NO_REQUEST_INFO_FIELD_MESSAGE = "No request-info field in request body for: {}";
    private static final String AUTH_TOKEN_REQUEST_BODY_FIELD_NAME = "authToken";
    private static final String FAILED_TO_SERIALIZE_REQUEST_BODY_MESSAGE = "Failed to serialize requestBody";
    
    private List<String> openEndpointsWhitelist;
    private List<String> mixedModeEndpointsWhitelist;
    private final ObjectMapper objectMapper;
    private UserUtils userUtils;
    private MultiStateInstanceUtil centralInstanceUtil;
	public AuthPreCheckFilter(List<String> openEndpointsWhitelist, List<String> mixedModeEndpointsWhitelist,
			UserUtils userUtils, MultiStateInstanceUtil centralInstanceUtil) {
		
		this.openEndpointsWhitelist = openEndpointsWhitelist;
		this.mixedModeEndpointsWhitelist = mixedModeEndpointsWhitelist;
		this.userUtils = userUtils;
		this.centralInstanceUtil = centralInstanceUtil;
		objectMapper = new ObjectMapper();
	}

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        String authToken;
        if (openEndpointsWhitelist.contains(getRequestURI())) {
            setShouldDoAuth(false);
            log.info(OPEN_ENDPOINT_MESSAGE, getRequestURI());
            return null;
        }
        try {
            authToken = getAuthTokenFromRequest();
        } catch (IOException e) {
            log.error(AUTH_TOKEN_RETRIEVE_FAILURE_MESSAGE, e);
            ExceptionUtils.RaiseException(e);
            return null;
        }

        RequestContext.getCurrentContext().set(AUTH_TOKEN_KEY, authToken);
        if (authToken == null) {
            if (mixedModeEndpointsWhitelist.contains(getRequestURI())) {
                log.info(ROUTING_TO_ANONYMOUS_ENDPOINT_MESSAGE, getRequestURI());
                setShouldDoAuth(false);
                setAnonymousUser();
            } else {
                log.info(ROUTING_TO_PROTECTED_ENDPOINT_RESTRICTED_MESSAGE, getRequestURI());
                ExceptionUtils.raiseCustomException(HttpStatus.UNAUTHORIZED, UNAUTHORIZED_USER_MESSAGE);
                return null;
            }
        } else {
            log.info(PROCEED_ROUTING_MESSAGE, getRequestURI());
            setShouldDoAuth(true);
        }
        return null;
    }

    private String getAuthTokenFromRequest() throws IOException {

        String authToken = getAuthTokenFromRequestHeader();
        // header will be preferred for auth body
        String authTokenFromBody = null;

        HttpServletRequest req = RequestContext.getCurrentContext().getRequest();

        if (Utils.isRequestBodyCompatible(req)) {
            // if body is json try and extract the token from body
            // call this method even if we found authtoken in header
            // this is just to make sure the authToken doesn't get leaked
            // if it was both in header as well as body
            authTokenFromBody = getAuthTokenFromRequestBody();
        }

        if (ObjectUtils.isEmpty(authTokenFromBody)) {
            // if token is not there, return whatever we had from header
            authTokenFromBody = authToken;
        }

        return authTokenFromBody;
    }

    private String getAuthTokenFromRequestBody() throws IOException {
        if (!Utils.isRequestBodyCompatible(getRequest()))
            return null;

        CustomRequestWrapper requestWrapper = new CustomRequestWrapper(getRequest());
        HashMap<String, Object> requestBody = getRequestBody(requestWrapper);
        final RequestBodyInspector requestBodyInspector = new RequestBodyInspector(requestBody);
        @SuppressWarnings("unchecked")
        HashMap<String, Object> requestInfo = requestBodyInspector.getRequestInfo();
        if (requestInfo == null) {
            log.info(NO_REQUEST_INFO_FIELD_MESSAGE, getRequestURI());
            return null;
        }
        String authToken = (String) requestInfo.get(AUTH_TOKEN_REQUEST_BODY_FIELD_NAME);
        sanitizeAndSetRequest(requestBodyInspector, requestWrapper);
        return authToken;
    }

    private HashMap<String, Object> getRequestBody(CustomRequestWrapper requestWrapper) throws IOException {
        return objectMapper.readValue(requestWrapper.getPayload(),
            new TypeReference<HashMap<String, Object>>() { });
    }

    private void sanitizeAndSetRequest(RequestBodyInspector requestBodyInspector, CustomRequestWrapper requestWrapper) {
        HashMap<String, Object> requestInfo = requestBodyInspector.getRequestInfo();
        RequestContext ctx = RequestContext.getCurrentContext();
        requestInfo.remove(USER_INFO_FIELD_NAME);
        requestInfo.remove(AUTH_TOKEN_REQUEST_BODY_FIELD_NAME);
        requestBodyInspector.updateRequestInfo(requestInfo);
        try {
            String requestSanitizedBody = objectMapper.writeValueAsString(requestBodyInspector.getRequestBody());
            ctx.set(CURRENT_REQUEST_SANITIZED_BODY, requestBodyInspector.getRequestBody());
            ctx.set(CURRENT_REQUEST_SANITIZED_BODY_STR, requestSanitizedBody);
            requestWrapper.setPayload(requestSanitizedBody);
        } catch (JsonProcessingException e) {
            log.error(FAILED_TO_SERIALIZE_REQUEST_BODY_MESSAGE, e);
            ExceptionUtils.RaiseException(e);
        }
        ctx.setRequest(requestWrapper);
    }

    private String  getAuthTokenFromRequestHeader() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest().getHeader(AUTH_TOKEN_HEADER_NAME);
    }

    private void setShouldDoAuth(boolean enableAuth) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(AUTH_BOOLEAN_FLAG_NAME, enableAuth);
    }

    private String getRequestURI() {
        return getRequest().getRequestURI();
    }

    private HttpServletRequest getRequest() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getRequest();
    }

    private String getRequestMethod() {
        return getRequest().getMethod();
    }

    private void setAnonymousUser(){
    	
    	RequestContext ctx = RequestContext.getCurrentContext();
    	String tenantId = getStateLevelTenantForHost(ctx);
        User systemUser = userUtils.fetchSystemUser(tenantId);
        ctx.set(USER_INFO_KEY, systemUser);
    }

	/**
	 * method to fetch state level tenant-id based on whether the server is a
	 * multi-state instance or single-state instance
	 * 
	 * @param ctx
	 * @return
	 */
	private String getStateLevelTenantForHost(RequestContext ctx) {
		String tenantId = "";
    	if(centralInstanceUtil.getIsEnvironmentCentralInstance()) {
    		
    		String host = ctx.getRequest().getRequestURL().toString()
    				.replace(getRequestURI(), "")
    				.replace("https://", "")
    				.replace("http://", "");
    		tenantId = userUtils.getStateLevelTenantMap().get(host);
    	}else {
    		tenantId = userUtils.getStateLevelTenant();
    	}
		return tenantId;
	}

}