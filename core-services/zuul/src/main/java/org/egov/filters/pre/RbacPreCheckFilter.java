package org.egov.filters.pre;

import static org.egov.constants.RequestContextConstants.RBAC_BOOLEAN_FLAG_NAME;
import static org.egov.constants.RequestContextConstants.SKIP_RBAC;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

/**
 *  3rd pre filter to get executed.
 *  If the URI is part of open or mixed endpoint list then RBAC check is marked as false
 */
public class RbacPreCheckFilter extends ZuulFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private List<String> openEndpointsWhitelist;
    private List<String> anonymousEndpointsWhitelist;

    @Autowired
    public RbacPreCheckFilter(List<String> openEndpointsWhitelist,
                              List<String> anonymousEndpointsWhitelist) {
        this.openEndpointsWhitelist = openEndpointsWhitelist;
        this.anonymousEndpointsWhitelist = anonymousEndpointsWhitelist;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 2;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        if ((openEndpointsWhitelist.contains(getRequestURI())
            || anonymousEndpointsWhitelist.contains(getRequestURI()))) {
            setShouldDoRbac(false);
            logger.info(SKIP_RBAC, getRequestURI());
            return null;
        }
        setShouldDoRbac(true);
        return null;
    }

    private void setShouldDoRbac(boolean enableRbac) {
        RequestContext ctx = RequestContext.getCurrentContext();
        ctx.set(RBAC_BOOLEAN_FLAG_NAME, enableRbac);
    }

    private String getRequestURI() {
        return RequestContext.getCurrentContext().getRequest().getRequestURI();
    }

}
