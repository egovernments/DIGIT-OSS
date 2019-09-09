package org.egov;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.filters.pre.AuthFilter;
import org.egov.filters.pre.AuthPreCheckFilter;
import org.egov.filters.pre.RbacFilter;
import org.egov.filters.pre.RbacPreCheckFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashSet;

@EnableZuulProxy
@SpringBootApplication
public class ZuulGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }

    @Value("${egov.user-info-header}")
    private String userInfoHeader;

    @Value("#{'${egov.open-endpoints-whitelist}'.split(',')}")
    private String[] openEndpointsWhitelist;

    @Value("#{'${egov.mixed-mode-endpoints-whitelist}'.split(',')}")
    private String[] mixedModeEndpointsWhitelist;

    @Value("${egov.auth-service-host}")
    private String authServiceHost;

    @Value("${egov.auth-service-uri}")
    private String authServiceUri;

    @Value("${egov.authorize.access.control.host}${egov.authorize.access.control.uri}")
    private String authorizationUrl;

    @Bean
    public AuthPreCheckFilter authCheckFilter() {
        return new AuthPreCheckFilter(new HashSet<>(Arrays.asList(openEndpointsWhitelist)),
            new HashSet<>(Arrays.asList(mixedModeEndpointsWhitelist)));
    }

    @Bean
    public AuthFilter authFilter() {
        final ProxyRequestHelper proxyRequestHelper = new ProxyRequestHelper();
        return new AuthFilter(proxyRequestHelper, restTemplate(), authServiceHost, authServiceUri);
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }

    @Bean
    public RbacFilter rbacFilter() {
        return new RbacFilter(restTemplate(), authorizationUrl, objectMapper());
    }
    
    @Bean
    public RestTemplate restTemplate() {
    	return  new RestTemplate(new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory()));
    }

    @Bean
    public RbacPreCheckFilter rbacCheckFilter() {
        return new RbacPreCheckFilter(new HashSet<>(Arrays.asList(openEndpointsWhitelist)),
            new HashSet<>(Arrays.asList(mixedModeEndpointsWhitelist))
        );
    }
}