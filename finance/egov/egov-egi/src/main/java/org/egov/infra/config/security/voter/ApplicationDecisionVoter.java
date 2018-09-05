package org.egov.infra.config.security.voter;

import java.util.Collection;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;

import org.egov.infra.admin.master.entity.ActionT;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.microservice.utils.MicroserviceUtils;
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
	public int vote(Authentication auth, Object object, Collection attributes) {
		
		/*try {
			String sessionId = ((WebAuthenticationDetails)auth.getDetails()).getSessionId(),
				   current_url = String.valueOf(object);
				
			CustomUserDetails userDetails = (CustomUserDetails) this.msUtil.readFromRedis(sessionId, "_details");
			
			if(userDetails==null)
				return ACCESS_DENIED;
			
			Iterator<ActionT> actlistItr = userDetails.getActions().iterator();
			
			while(actlistItr.hasNext()){
				ActionT action = actlistItr.next();
				if(action.getUrl().equalsIgnoreCase(current_url)){
					  return ACCESS_GRANTED;
				  }
			}
		} catch (Exception e) {
			return ACCESS_DENIED;
		}*/
		
		return ACCESS_GRANTED;
	}

}
