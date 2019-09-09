package org.egov.tracer.http;

import org.springframework.http.HttpHeaders;

public class HttpUtils {

    private static final String PASS_THROUGH_GATEWAY_HEADER_NAME = "x-pass-through-gateway";

    private HttpUtils(){}

    public static boolean isInterServiceCall(HttpHeaders headers) {
        String x_pass_through_gatewayStr = headers.getFirst(PASS_THROUGH_GATEWAY_HEADER_NAME);

        return x_pass_through_gatewayStr == null || !x_pass_through_gatewayStr.equalsIgnoreCase("true");
    }

}
