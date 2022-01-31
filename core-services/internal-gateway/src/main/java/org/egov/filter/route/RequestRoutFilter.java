package org.egov.filter.route;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;
import java.util.Map.Entry;

import org.egov.utils.RoutingConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RequestRoutFilter extends ZuulFilter {

	@Autowired
	private RoutingConfig routingConfig;

	@Override
	public boolean shouldFilter() {
		return true;
	}

	@Override
	public Object run() {

		RequestContext ctx = RequestContext.getCurrentContext();
		String requestURI = ctx.getRequest().getRequestURI();
		String requestTenantId = ctx.getRequest().getHeader("tenantId");
		log.info(" Route filter routing for URI ....... " + ctx.getRequest().getRequestURI() 
				+ " and tenantId : " + requestTenantId);
		URL url = null;
		for (Entry<String, Map<String, String>> tenantRoutingConfig : 
			 								routingConfig.getTeanantRoutingConfigWrapper().entrySet()) {

			if (requestURI.matches(tenantRoutingConfig.getKey())) {
				
				Map<String, String> tenantRoutingMap = tenantRoutingConfig.getValue();
				String routingHost = findTenant(tenantRoutingMap, requestTenantId);
				if (routingHost != null) {
					try {
						url = new URL(routingHost);
						ctx.setRouteHost(url);
					} catch (MalformedURLException e) {
						e.printStackTrace();
					}
					break;
				}
				break;
			}
		}
		return null;
	}

	@Override
	public String filterType() {
		return "route";
	}

	@Override
	public int filterOrder() {
		return 3;
	}

	private String findTenant(Map<String, String> tenantRoutingMap, String reqTenantId) {
		int count = StringUtils.countOccurrencesOf(reqTenantId, ".") + 1;
		String tmpTenantId = new String(reqTenantId);
		for (int i = 0; i < count; i++) {
			if (tenantRoutingMap.containsKey(tmpTenantId)) {
				return tenantRoutingMap.get(tmpTenantId);
			}
			tmpTenantId = tmpTenantId.substring(0,tmpTenantId.lastIndexOf("."));
		}
		return null;
	}

}
