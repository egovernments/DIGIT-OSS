package org.egov.Utils;


import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.config.RateLimitUtils;
import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.config.properties.RateLimitProperties;
import com.netflix.zuul.context.RequestContext;
import org.egov.contract.User;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import java.util.Set;

import static org.egov.constants.RequestContextConstants.USER_INFO_KEY;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.X_FORWARDED_FOR_HEADER;

@Component
public class CustomRateLimitUtils implements RateLimitUtils {


    private static final String UUID_JSON_PATH = "$.RequestInfo.userInfo.uuid";
    private static final String ANONYMOUS_USER = "anonymous";
    private static final String X_FORWARDED_FOR_HEADER_DELIMITER = ",";

    private final RateLimitProperties properties;

    @PostConstruct
    void changeFilterOrder() {
        properties.setPreFilterOrder(10);
    }

    public CustomRateLimitUtils(RateLimitProperties properties) {
        this.properties = properties;
    }

    @Override
    public String getUser(final HttpServletRequest request) {
        RequestContext ctx = RequestContext.getCurrentContext();
        try{
            User user = (User)ctx.get(USER_INFO_KEY);
            if(user!=null)
                return user.getUuid();
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String getRemoteAddress(final HttpServletRequest request) {
        String xForwardedFor = request.getHeader(X_FORWARDED_FOR_HEADER);
        if (properties.isBehindProxy() && xForwardedFor != null) {
            return xForwardedFor.split(X_FORWARDED_FOR_HEADER_DELIMITER)[0].trim();
        }
        return request.getRemoteAddr();
    }

    @Override
    public Set<String> getUserRoles() {
        throw new UnsupportedOperationException("Not supported");
    }
}