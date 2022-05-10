package org.egov.Utils;

import com.netflix.zuul.context.RequestContext;
import org.apache.commons.io.IOUtils;
import org.apache.http.entity.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import static org.egov.constants.RequestContextConstants.*;

@Component
public class Utils {

    private static final String EMPTY_STRING = "";
    private static final String JSON_TYPE = "json";

    @Value("#{'${whitelist.url.patterns}'.split(',')}")
    private List<String> whiteListedPatterns;

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

    private static String getRequestContentType(HttpServletRequest servletRequest) {
        return Optional.ofNullable(servletRequest.getContentType()).orElse(EMPTY_STRING).toLowerCase();
    }

    private static String getRequestURI(HttpServletRequest servletRequest) {
        return servletRequest.getRequestURI();
    }

    // Checks if the uri matches with any of the whitelisted pattern
    public boolean isWhitelistingPatternMatching(String uri){
        boolean isPatternMatching = false;

        for (String regex : whiteListedPatterns){
            isPatternMatching = Pattern.matches(regex, uri);

            if (isPatternMatching)
                break;
        }
        return isPatternMatching;
    }
}
