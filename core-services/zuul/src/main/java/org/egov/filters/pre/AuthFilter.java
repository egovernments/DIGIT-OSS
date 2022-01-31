package org.egov.filters.pre;

import static org.egov.constants.RequestContextConstants.AUTH_BOOLEAN_FLAG_NAME;
import static org.egov.constants.RequestContextConstants.AUTH_TOKEN_KEY;
import static org.egov.constants.RequestContextConstants.CORRELATION_ID_HEADER_NAME;
import static org.egov.constants.RequestContextConstants.CORRELATION_ID_KEY;
import static org.egov.constants.RequestContextConstants.REQUEST_TENANT_ID_KEY;
import static org.egov.constants.RequestContextConstants.TENANTID_MDC;
import static org.egov.constants.RequestContextConstants.USER_INFO_KEY;

import java.util.Set;

import org.egov.Utils.ExceptionUtils;
import org.egov.Utils.Utils;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.contract.User;
import org.egov.exceptions.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

/**
 *  4th pre filter to get executed.
 *  If the auth flag is enabled then the user is retrieved for the given auth token.
 */
public class AuthFilter extends ZuulFilter {

    private static final String RETRIEVING_USER_FAILED_MESSAGE = "Retrieving user failed";
    private final ProxyRequestHelper helper;
    private final String authServiceHost;
    private final String authUri;
    private final RestTemplate restTemplate;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private Utils utils;
    
    private MultiStateInstanceUtil centralInstanceUtil;

	public AuthFilter(ProxyRequestHelper helper, RestTemplate restTemplate, String authServiceHost, String authUri,
			MultiStateInstanceUtil centralInstanceUtil) {
		this.helper = helper;
		this.restTemplate = restTemplate;
		this.authServiceHost = authServiceHost;
		this.authUri = authUri;
		this.centralInstanceUtil = centralInstanceUtil;
	}

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 3;
    }

    @Override
    public boolean shouldFilter() {
        return RequestContext.getCurrentContext().getBoolean(AUTH_BOOLEAN_FLAG_NAME);
    }

    @Override
    public Object run() throws CustomException {
        RequestContext ctx = RequestContext.getCurrentContext();
        String authToken = (String) ctx.get(AUTH_TOKEN_KEY);
        try {
            User user = getUser(authToken, ctx);
            ctx.set(USER_INFO_KEY, user);
        } catch (HttpClientErrorException ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            ExceptionUtils.RaiseException(ex);
        } catch (ResourceAccessException ex) {
            logger.error(RETRIEVING_USER_FAILED_MESSAGE, ex);
            ExceptionUtils.raiseCustomException(HttpStatus.INTERNAL_SERVER_ERROR, "User authentication service is down");
        }
        
		if (centralInstanceUtil.getIsEnvironmentCentralInstance() && StringUtils.isEmpty(ctx.get(TENANTID_MDC))) {
			
			Set<String> tenantIds = utils.validateRequestAndSetRequestTenantId();
			/*
			 * Adding tenantId to header for tracer logging with correlation-id and routing
			 */
			String singleTenantId = utils.getLowLevelTenatFromSet(tenantIds);
			MDC.put(TENANTID_MDC, singleTenantId);
			ctx.set(TENANTID_MDC, singleTenantId);
		}
        
        return null;
    }

    private User getUser(String authToken, RequestContext ctx) {
        String authURL = String.format("%s%s%s", authServiceHost, authUri, authToken);
        final HttpHeaders headers = new HttpHeaders();
        headers.add(CORRELATION_ID_HEADER_NAME, (String) ctx.get(CORRELATION_ID_KEY));
		if (centralInstanceUtil.getIsEnvironmentCentralInstance())
			headers.add(REQUEST_TENANT_ID_KEY, (String) ctx.get(TENANTID_MDC));
        final HttpEntity<Object> httpEntity = new HttpEntity<>(null, headers);
        return restTemplate.postForObject(authURL, httpEntity, User.class);
    }
    
}