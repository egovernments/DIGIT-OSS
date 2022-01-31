package org.egov.filters.pre;

import static java.util.Objects.isNull;
import static org.egov.constants.RequestContextConstants.CORRELATION_ID_KEY;
import static org.egov.constants.RequestContextConstants.REQUEST_INFO_FIELD_NAME_CAMEL_CASE;
import static org.egov.constants.RequestContextConstants.REQUEST_INFO_FIELD_NAME_PASCAL_CASE;
import static org.egov.constants.RequestContextConstants.REQUEST_TENANT_ID_KEY;
import static org.egov.constants.RequestContextConstants.TENANTID_MDC;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.egov.Utils.Utils;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.exceptions.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

/**
 *  1st pre filter to get executed.
 *  Sets the context and MDC with the newly generated correlation id.
 */
public class CorrelationIdFilter extends ZuulFilter {
	
    private static final String RECEIVED_REQUEST_MESSAGE = "Received request for: {}";

    private Logger logger = LoggerFactory.getLogger(this.getClass());
    
    private ObjectMapper objectMapper;
    private List<String> openEndpointsWhitelist;
    private List<String> mixedModeEndpointsWhitelist;
    
    @Autowired
    private Utils utils;
    
    @Autowired
    private MultiStateInstanceUtil centralInstanceUtil;
    
	@Autowired
	public CorrelationIdFilter(List<String> openEndpointsWhitelist, List<String> mixedModeEndpointsWhitelist,
			ObjectMapper objectMapper) {
		super();
		this.openEndpointsWhitelist = openEndpointsWhitelist;
		this.mixedModeEndpointsWhitelist = mixedModeEndpointsWhitelist;
		this.objectMapper = objectMapper;
	}

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() throws CustomException {
        RequestContext ctx = RequestContext.getCurrentContext();
        
        String requestURI = ctx.getRequest().getRequestURI();
        Boolean isOpenRequest = openEndpointsWhitelist.contains(requestURI);
        Boolean isMixModeRequest = mixedModeEndpointsWhitelist.contains(requestURI);
        
		if (centralInstanceUtil.getIsEnvironmentCentralInstance() && (isOpenRequest || isMixModeRequest)
				&& !requestURI.equalsIgnoreCase("/user/oauth/token")) {
			/*
			 * Adding tenantid to header for open urls, authorized urls will get ovverrided
			 * in RBAC filter
			 */
			Set<String> tenantIds = getTenantIdsFromRequest();
			if (tenantIds.size() == 0 && isOpenRequest) {
				throw new CustomException("Unique value of tenantId must be given for open URI requests", 400,
						"multiple or No tenantids found in Request body");
			}
			String tenantId = utils.getLowLevelTenatFromSet(tenantIds);
			MDC.put(TENANTID_MDC, tenantId);
			ctx.set(TENANTID_MDC, tenantId);

		}

        final String correlationId = UUID.randomUUID().toString();
        MDC.put(CORRELATION_ID_KEY, correlationId);
        ctx.set(CORRELATION_ID_KEY, correlationId);
        logger.debug(RECEIVED_REQUEST_MESSAGE, ctx.getRequest().getRequestURI());
        return null;
    }
    
	private Set<String> getTenantIdsFromRequest() throws CustomException {

		RequestContext ctx = RequestContext.getCurrentContext();
		HttpServletRequest request = ctx.getRequest();
		Map<String, String[]> queryParams = request.getParameterMap();
		

		Set<String> tenantIds = new HashSet<>();

		if (Utils.isRequestBodyCompatible(request)) {

			try {
				ObjectNode requestBody = (ObjectNode) objectMapper.readTree(request.getInputStream());

				if (requestBody.has(REQUEST_INFO_FIELD_NAME_PASCAL_CASE))
					requestBody.remove(REQUEST_INFO_FIELD_NAME_PASCAL_CASE);

				else if (requestBody.has(REQUEST_INFO_FIELD_NAME_CAMEL_CASE))
					requestBody.remove(REQUEST_INFO_FIELD_NAME_CAMEL_CASE);

				List<String> tenants = new LinkedList<>();

				for (JsonNode node : requestBody.findValues(REQUEST_TENANT_ID_KEY)) {
					if (node.getNodeType() == JsonNodeType.ARRAY) {
						node.elements().forEachRemaining(n -> tenants.add(n.asText()));
					} else if (node.getNodeType() == JsonNodeType.STRING) {
						tenants.add(node.asText());
					}
				}
				
				if (!tenants.isEmpty()) {
					// Filtering null tenantids will be removed once fix is done in TL service.
					tenants.forEach(tenant -> {
						if (tenant != null && !tenant.equalsIgnoreCase("null"))
							tenantIds.add(tenant);
					});
				} else {
					setTenantIdsFromQueryParams(queryParams, tenantIds);
				}

			} catch (IOException e) {
				throw new RuntimeException(new CustomException("REQUEST_PARSE_FAILED", HttpStatus.UNAUTHORIZED.value(),
						"Failed to parse request at" + " API gateway"));
			}
		} else {
			setTenantIdsFromQueryParams(queryParams, tenantIds);
		}

		return tenantIds;
	}

	private void setTenantIdsFromQueryParams(Map<String, String[]> queryParams, Set<String> tenantIds) throws CustomException {
		
		if (!isNull(queryParams) && queryParams.containsKey(REQUEST_TENANT_ID_KEY)
				&& queryParams.get(REQUEST_TENANT_ID_KEY).length > 0) {
			String tenantId = queryParams.get(REQUEST_TENANT_ID_KEY)[0];
			if (tenantId.contains(",")) {
				tenantIds.addAll(Arrays.asList(tenantId.split(",")));
			} else
				tenantIds.add(tenantId);

		}else {
			throw new CustomException("tenantId is mandatory in URL for non json requests", 400, "");
		}
	}
	
}