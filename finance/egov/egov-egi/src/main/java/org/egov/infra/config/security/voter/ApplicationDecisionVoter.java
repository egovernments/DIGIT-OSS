package org.egov.infra.config.security.voter;

import java.util.Collection;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;

import org.egov.infra.admin.master.entity.ActionT;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.config.security.authentication.userdetail.CurrentUser;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

public class ApplicationDecisionVoter implements AccessDecisionVoter<Object>{

	@Autowired
	public MicroserviceUtils microserviceUtils;
	
//	@Autowired
//	HttpServletRequest httprequest;
	
	@Override
	public boolean supports(ConfigAttribute attribute) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean supports(Class clazz) {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public int vote(Authentication authentication, Object object, Collection attributes) {
		
	    if(null==authentication || ! (authentication.getPrincipal() instanceof CurrentUser))
	        return ACCESS_DENIED;
			
	return ACCESS_GRANTED;
	}

}
