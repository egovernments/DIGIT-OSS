package org.egov.Utils;

import static java.util.Objects.isNull;
import static org.egov.constants.RequestContextConstants.PATCH;
import static org.egov.constants.RequestContextConstants.POST;
import static org.egov.constants.RequestContextConstants.PUT;
import static org.egov.constants.RequestContextConstants.REQUEST_INFO_FIELD_NAME_CAMEL_CASE;
import static org.egov.constants.RequestContextConstants.REQUEST_INFO_FIELD_NAME_PASCAL_CASE;
import static org.egov.constants.RequestContextConstants.REQUEST_TENANT_ID_KEY;
import static org.egov.constants.RequestContextConstants.USER_INFO_KEY;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.egov.contract.User;
import org.egov.exceptions.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.netflix.zuul.context.RequestContext;

@Configuration
public class Utils {

	@Autowired
	private ObjectMapper objectMapper;
	
    private static final String EMPTY_STRING = "";
    public static final String JSON_TYPE = "json";

    public static String getResponseBody(RequestContext ctx) throws IOException {
        String body = ctx.getResponseBody();

        if (body == null) {
            body = IOUtils.toString(ctx.getResponseDataStream());
            ctx.setResponseBody(body);
        }
        
        return body;
    }

    public static boolean isRequestBodyCompatible(HttpServletRequest servletRequest) {
        return (
            POST.equalsIgnoreCase(getRequestMethod(servletRequest))
                || PUT.equalsIgnoreCase(getRequestMethod(servletRequest))
                || PATCH.equalsIgnoreCase(getRequestMethod(servletRequest))
            )
            && getRequestContentType(servletRequest).contains(JSON_TYPE);
    }

    private static String getRequestMethod(HttpServletRequest servletRequest) {
        return servletRequest.getMethod();
    }

    public static String getRequestContentType(HttpServletRequest servletRequest) {
        return Optional.ofNullable(servletRequest.getContentType()).orElse(EMPTY_STRING).toLowerCase();
    }

    
    public Set<String> validateRequestAndSetRequestTenantId() {

        RequestContext ctx = RequestContext.getCurrentContext();

        return getTenantIdForRequest(ctx);
    }

    private Set<String> getTenantIdForRequest(RequestContext ctx) {
        HttpServletRequest request = ctx.getRequest();
        Map<String, String[]> queryParams = request.getParameterMap();

        Set<String> tenantIds = new HashSet<>();


        if (Utils.isRequestBodyCompatible(request)) {

            try {
                ObjectNode requestBody = (ObjectNode) objectMapper.readTree(request.getInputStream());

                stripRequestInfo(requestBody);

                List<String> tenants = new LinkedList<>();

                for (JsonNode node : requestBody.findValues(REQUEST_TENANT_ID_KEY)) {
                    if (node.getNodeType() == JsonNodeType.ARRAY)
                    {
                        node.elements().forEachRemaining(n -> tenants.add(n.asText()));
                    } else if (node.getNodeType() == JsonNodeType.STRING) {
                        tenants.add(node.asText());
                    }
				}
				if (!tenants.isEmpty()) {
					/*
					 * Filtering null tenantids will be removed once fix is done in TL service.
					 */
					tenants.forEach(tenant -> {
						if (tenant != null && !tenant.equalsIgnoreCase("null"))
							tenantIds.add(tenant);
					});
				} 
            } catch (IOException e) {
                throw new RuntimeException( new CustomException("REQUEST_PARSE_FAILED", HttpStatus.UNAUTHORIZED.value() ,"Failed to parse request at" +
                    " API gateway"));
            }
        }

        if (tenantIds.isEmpty()) {
        	setTenantIdsFromQueryParams(queryParams, tenantIds);
            tenantIds.add(((User) ctx.get(USER_INFO_KEY)).getTenantId());
        }

        return tenantIds;
    }
    
	private void setTenantIdsFromQueryParams(Map<String, String[]> queryParams, Set<String> tenantIds) {
		
		if (!isNull(queryParams) && queryParams.containsKey(REQUEST_TENANT_ID_KEY)
				&& queryParams.get(REQUEST_TENANT_ID_KEY).length > 0) {
			String tenantId = queryParams.get(REQUEST_TENANT_ID_KEY)[0];
			if (tenantId.contains(",")) {
				tenantIds.addAll(Arrays.asList(tenantId.split(",")));
			} else
				tenantIds.add(tenantId);
		}
	}
    
    private void stripRequestInfo(ObjectNode requestBody) {
        if (requestBody.has(REQUEST_INFO_FIELD_NAME_PASCAL_CASE))
            requestBody.remove(REQUEST_INFO_FIELD_NAME_PASCAL_CASE);

        else if (requestBody.has(REQUEST_INFO_FIELD_NAME_CAMEL_CASE))
            requestBody.remove(REQUEST_INFO_FIELD_NAME_CAMEL_CASE);

    }
    
    /**
     * Picks the lowest level tenantId from the set of state all levels of tenants
     *  
     * @param tenants
     * @return
     */
	public String getLowLevelTenatFromSet(Set<String> tenants) {

		String lowLevelTenant = null;
		int countOfSubTenantsPresent = 0;

		for (String tenant : tenants) {
			int currentCount = tenant.split("\\.").length;
			if (currentCount >= countOfSubTenantsPresent) {
				countOfSubTenantsPresent = currentCount;
				lowLevelTenant = tenant;
			}
		}
		return lowLevelTenant;
	}
}
