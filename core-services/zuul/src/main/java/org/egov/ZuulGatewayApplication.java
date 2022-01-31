package org.egov;

import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;

import org.egov.Utils.CustomRateLimitUtils;
import org.egov.Utils.UserUtils;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.filters.pre.AuthFilter;
import org.egov.filters.pre.AuthPreCheckFilter;
import org.egov.filters.pre.CorrelationIdFilter;
import org.egov.filters.pre.RbacFilter;
import org.egov.filters.pre.RbacPreCheckFilter;
import org.egov.tracer.config.TracerConfiguration;
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
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.config.RateLimitUtils;
import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.config.properties.RateLimitProperties;
import com.marcosbarbero.cloud.autoconfigure.zuul.ratelimit.support.SecuredRateLimitUtils;

import javax.annotation.PostConstruct;

@EnableZuulProxy
@EnableCaching
@SpringBootApplication
@PropertySource({"${zuul.routes.filepath}","${zuul.limiter.filepath}"})
@Import({TracerConfiguration.class, MultiStateInstanceUtil.class})
public class ZuulGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }

    @Autowired
    CacheManager cacheManager;

    
    @Autowired
    private MultiStateInstanceUtil multiStateInstanceUtil;

    @PostConstruct
    public void evictUserCaches() {
        cacheManager.getCache("systemUser").clear();
    }


    @Value("${egov.user-info-header}")
    private String userInfoHeader;

    
    private List<String> encryptedUrlSet;
    
    private List<String> openEndpointsWhitelist;

    private List<String> mixedModeEndpointsWhitelist;
    
	@Value("${egov.encrypted-endpoints-list}")
	public void setEncrytpedUrlListValues(List<String> EcryptedListFromProperties) {
		this.encryptedUrlSet = Collections.unmodifiableList(EcryptedListFromProperties);
	}

	@Value("${egov.open-endpoints-whitelist}")
	public void setOpenEndpointsWhitelistValues(List<String> openUrlListFromProperties) {
		this.openEndpointsWhitelist = Collections.unmodifiableList(openUrlListFromProperties);
	}

	@Value("${egov.mixed-mode-endpoints-whitelist}")
	public void setMixModeEndpointListVaaues(List<String> mixModeUrlListFromProperties) {
		this.mixedModeEndpointsWhitelist = Collections.unmodifiableList(mixModeUrlListFromProperties);
	}

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
	public CorrelationIdFilter correlationIdFilter() {
		return new CorrelationIdFilter(openEndpointsWhitelist, mixedModeEndpointsWhitelist, this.objectMapper);
	}
    
    @Bean
    public AuthPreCheckFilter authCheckFilter() {
        return new AuthPreCheckFilter(openEndpointsWhitelist, mixedModeEndpointsWhitelist,userUtils, multiStateInstanceUtil);
    }

    @Bean
    public AuthFilter authFilter() {
        final ProxyRequestHelper proxyRequestHelper = new ProxyRequestHelper();
        return new AuthFilter(proxyRequestHelper, restTemplate, authServiceHost, authServiceUri, multiStateInstanceUtil);
    }

    @Bean
    public RbacFilter rbacFilter() {
        return new RbacFilter(restTemplate, authorizationUrl);
    }

    @Bean
    public RbacPreCheckFilter rbacCheckFilter() {
        return new RbacPreCheckFilter(openEndpointsWhitelist, mixedModeEndpointsWhitelist);
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