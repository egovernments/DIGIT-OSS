package org.egov.filters.pre;

import static org.egov.constants.RequestContextConstants.CORRELATION_ID_HEADER_NAME;
import static org.egov.constants.RequestContextConstants.CORRELATION_ID_KEY;
import static org.egov.constants.RequestContextConstants.CURRENT_REQUEST_TENANTID;
import static org.egov.constants.RequestContextConstants.RBAC_BOOLEAN_FLAG_NAME;
import static org.egov.constants.RequestContextConstants.REQUEST_TENANT_ID_KEY;
import static org.egov.constants.RequestContextConstants.TENANTID_MDC;
import static org.egov.constants.RequestContextConstants.USER_INFO_KEY;

import java.util.HashSet;
import java.util.Set;

import org.egov.Utils.ExceptionUtils;
import org.egov.Utils.Utils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.contract.User;
import org.egov.model.AuthorizationRequest;
import org.egov.model.AuthorizationRequestWrapper;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import lombok.extern.slf4j.Slf4j;

/**
 * 5th pre filter to get executed.
 * Filter gets executed if the RBAC flag is enabled. Returns an error if the URI is not present in the authorized action list.
 */
@Slf4j
public class RbacFilter extends ZuulFilter {

    private static final String FORBIDDEN_MESSAGE = "Not authorized to access this resource";

    @Autowired
    private Utils utils;
    
    @Autowired
    private MultiStateInstanceUtil centralInstanceUtil;
    
    private RestTemplate restTemplate;

    private String authorizationUrl;

    @Autowired
    public RbacFilter(RestTemplate restTemplate, String authorizationUrl) {
        this.restTemplate = restTemplate;
        this.authorizationUrl = authorizationUrl;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 4;
    }

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return ctx.getBoolean(RBAC_BOOLEAN_FLAG_NAME);
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        final boolean isIncomingURIInAuthorizedActionList = isIncomingURIInAuthorizedActionList(ctx);
        if (isIncomingURIInAuthorizedActionList)
            return null;

        ExceptionUtils.raiseCustomException(HttpStatus.FORBIDDEN, FORBIDDEN_MESSAGE);
        return null;
    }

    private boolean isIncomingURIInAuthorizedActionList(RequestContext ctx) {
        String requestUri = ctx.getRequest().getRequestURI();
        User user = (User) ctx.get(USER_INFO_KEY);

        if (user == null) {
            ExceptionUtils.raiseCustomException(HttpStatus.UNAUTHORIZED, "User information not found. Can't execute RBAC filter");
        }

        Set<String> tenantIds = utils.validateRequestAndSetRequestTenantId();
        
        /*
         * Adding tenantId to header for tracer logging with correlation-id
         */
		if (centralInstanceUtil.getIsEnvironmentCentralInstance() && StringUtils.isEmpty(ctx.get(TENANTID_MDC))) {
			String singleTenantId = utils.getLowLevelTenatFromSet(tenantIds);
			MDC.put(TENANTID_MDC, singleTenantId);
			ctx.set(TENANTID_MDC, singleTenantId);
		}

        ctx.set(CURRENT_REQUEST_TENANTID, String.join(",", tenantIds));

        AuthorizationRequest request = AuthorizationRequest.builder()
            .roles(new HashSet<>(user.getRoles()))
            .uri(requestUri)
            .tenantIds(tenantIds)
            .build();

        return isUriAuthorized(request);

    }

    private boolean isUriAuthorized(AuthorizationRequest authorizationRequest) {
    	
        AuthorizationRequestWrapper authorizationRequestWrapper = new AuthorizationRequestWrapper(new RequestInfo(),
            authorizationRequest);
        RequestContext ctx = RequestContext.getCurrentContext();
        
        final HttpHeaders headers = new HttpHeaders();
        headers.add(CORRELATION_ID_HEADER_NAME, (String) ctx.get(CORRELATION_ID_KEY));
		if (centralInstanceUtil.getIsEnvironmentCentralInstance())
			headers.add(REQUEST_TENANT_ID_KEY, (String) ctx.get(TENANTID_MDC));
        final HttpEntity<Object> httpEntity = new HttpEntity<>(authorizationRequestWrapper, headers);

        try {
            ResponseEntity<Void> responseEntity = restTemplate.postForEntity(authorizationUrl, httpEntity, Void
                .class);

            return responseEntity.getStatusCode().equals(HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            log.warn("Exception while attempting to authorize via access control", e);
            return false;
        } catch (Exception e) {
            log.error("Unknown exception occurred while attempting to authorize via access control", e);
            return false;
        }

    }


}
