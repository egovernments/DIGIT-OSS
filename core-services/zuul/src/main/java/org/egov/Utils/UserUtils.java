package org.egov.Utils;


import static org.egov.constants.RequestContextConstants.CORRELATION_ID_HEADER_NAME;
import static org.egov.constants.RequestContextConstants.CORRELATION_ID_KEY;
import static org.egov.constants.RequestContextConstants.REQUEST_TENANT_ID_KEY;
import static org.egov.constants.RequestContextConstants.TENANTID_MDC;

import java.util.Collections;
import java.util.Map;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.contract.User;
import org.egov.model.UserDetailResponse;
import org.egov.model.UserSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.context.RequestContext;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class UserUtils {
	
	@Getter
    @Value("#{${egov.statelevel.tenant.map:{}}}")
    private Map<String, String> stateLevelTenantMap;
    
	@Getter
    @Value("${egov.statelevel.tenant}")
    private String stateLevelTenant;

    @Value("${egov.auth-service-host}${egov.user.search.path}")
    private String userSearchURI;
    
    @Autowired
    private MultiStateInstanceUtil centralInstanceUtil;

    private RestTemplate restTemplate;

    private ObjectMapper objectMapper;


    @Autowired
    public UserUtils(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }


    @Cacheable(value = "systemUser" , sync = true)
    public User fetchSystemUser(String tenantId){

        UserSearchRequest userSearchRequest =new UserSearchRequest();
        userSearchRequest.setRoleCodes(Collections.singletonList("ANONYMOUS"));
        userSearchRequest.setUserType("SYSTEM");
        userSearchRequest.setPageSize(1);
		userSearchRequest.setTenantId(tenantId);
		
		RequestContext ctx = RequestContext.getCurrentContext();
		final HttpHeaders headers = new HttpHeaders();
		headers.add(CORRELATION_ID_HEADER_NAME, (String) ctx.get(CORRELATION_ID_KEY));
		if (centralInstanceUtil.getIsEnvironmentCentralInstance())
			headers.add(REQUEST_TENANT_ID_KEY, (String) ctx.get(TENANTID_MDC));
		final HttpEntity<Object> httpEntity = new HttpEntity<>(userSearchRequest, headers);

        StringBuilder uri = new StringBuilder(userSearchURI);
		User user = null;
		try {
			UserDetailResponse response = restTemplate.postForObject(uri.toString(), httpEntity, UserDetailResponse.class);
			if (!CollectionUtils.isEmpty(response.getUser()))
				user = response.getUser().get(0);
		} catch(Exception e) {
            log.error("Exception while fetching system user: ",e);
        }

        /*if(user == null)
            throw new CustomException("NO_SYSTEUSER_FOUND","No system user found");*/

        return user;
    }




}
