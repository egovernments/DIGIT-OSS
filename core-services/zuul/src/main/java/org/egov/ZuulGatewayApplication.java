package org.egov;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.config.RateLimitUtils;
import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.config.properties.RateLimitProperties;
import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.support.SecuredRateLimitUtils;
import org.egov.Utils.CustomRateLimitUtils;
import org.egov.Utils.UserUtils;
import org.egov.filters.pre.AuthFilter;
import org.egov.filters.pre.AuthPreCheckFilter;
import org.egov.filters.pre.RbacFilter;
import org.egov.filters.pre.RbacPreCheckFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashSet;

import javax.annotation.PostConstruct;

@EnableZuulProxy
@EnableCaching
@SpringBootApplication
@PropertySource({"${zuul.routes.filepath}","${zuul.limiter.filepath}"})
public class ZuulGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }

    @Autowired
    CacheManager cacheManager;

    @PostConstruct
    public void evictUserCaches() {
        cacheManager.getCache("systemUser").clear();
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

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserUtils userUtils;

    @Autowired
    private CustomRateLimitUtils customRateLimitUtils;

    @Bean
    public AuthPreCheckFilter authCheckFilter() {
        return new AuthPreCheckFilter(new HashSet<>(Arrays.asList(openEndpointsWhitelist)),
            new HashSet<>(Arrays.asList(mixedModeEndpointsWhitelist)),userUtils);
    }

    @Bean
    public AuthFilter authFilter() {
        final ProxyRequestHelper proxyRequestHelper = new ProxyRequestHelper();
        return new AuthFilter(proxyRequestHelper, restTemplate, authServiceHost, authServiceUri);
    }

    @Bean
    public RbacFilter rbacFilter() {
        return new RbacFilter(restTemplate, authorizationUrl, objectMapper);
    }

    @Bean
    public RbacPreCheckFilter rbacCheckFilter() {
        return new RbacPreCheckFilter(new HashSet<>(Arrays.asList(openEndpointsWhitelist)),
            new HashSet<>(Arrays.asList(mixedModeEndpointsWhitelist))
        );
    }

    @Configuration
    public static class RateLimitUtilsConfiguration {

        @Bean
        @ConditionalOnClass(name = "org.springframework.security.core.Authentication")
        public RateLimitUtils securedRateLimitUtils(final RateLimitProperties rateLimitProperties) {
            return new SecuredRateLimitUtils(rateLimitProperties);
        }

        @Bean
        public RateLimitUtils rateLimitUtils(final RateLimitProperties rateLimitProperties) {
            return new CustomRateLimitUtils(rateLimitProperties);
        }
    }

}