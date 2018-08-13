package org.egov.infra.config.security.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.admin.master.entity.Role;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.persistence.entity.enums.Gender;
import org.egov.infra.persistence.entity.enums.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.context.HttpRequestResponseHolder;
import org.springframework.security.web.context.SecurityContextRepository;

import redis.clients.jedis.JedisShardInfo;

public class ApplicationSecurityRepository implements SecurityContextRepository {

	private static final Logger LOGGER = Logger.getLogger(ApplicationSecurityRepository.class);
	
	@Autowired
	public RedisTemplate<Object, Object> redisTemplate;
	
	@Autowired
	public MicroserviceUtils msUtil;

	@Override
	public SecurityContext loadContext(HttpRequestResponseHolder requestResponseHolder) {
		// TODO Auto-generated method stub

		LOGGER.debug("Loading security context:  "+requestResponseHolder);
		
		try {

			HttpServletRequest request = requestResponseHolder.getRequest();

			Map<String,String> sessionVals = msUtil.readSessionValuesFromRedis(request.getSession().getId());
			if(sessionVals.size()>0){
				SecurityContext context = new SecurityContextImpl();
				context.setAuthentication(
						this.prepareAuthenticationObj(request, sessionVals.get("NAME"), sessionVals.get("Authorities")));
				return context;
			}
			
			 else {
				 LOGGER.info("Session is not found in Redis. Creating empty security context");
				return SecurityContextHolder.createEmptyContext();
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			LOGGER.error("Session is not found in Redis. Creating empty security context");
			return SecurityContextHolder.createEmptyContext();
		}
	}

	@Override
	public void saveContext(SecurityContext context, HttpServletRequest request, HttpServletResponse response) {

		LOGGER.debug("Got the request to cusome app security repository - saveContext");
		if (context == null || context.getAuthentication() == null){
			LOGGER.error("Securirty context/authentication is null");
			return;
			}
		try {
			HttpSession session = request.getSession();
			String sessionId = session.getId(), tenantId = String.valueOf(session.getAttribute("tenantId")),
					access_token = request.getParameter("acces_token"), user = context.getAuthentication().getName(),
					remoteIp = request.getRemoteAddr();
			
			if(access_token ==null) access_token = String.valueOf(session.getAttribute("access_token"));
			
			if(null!=access_token)
			{
				Map<String,String> sesValues = new HashMap<>();
				
				sesValues.put("ACCESS_TOKEN", access_token);
				sesValues.put("NAME", user);
				sesValues.put("RemoteIP", remoteIp);
				
				Authentication auth = context.getAuthentication();
				StringBuilder authStr = new StringBuilder();
				for (GrantedAuthority authority : auth.getAuthorities()) {
					authStr.append(authority.getAuthority() + ",");
				}
				sesValues.put("Authorities", authStr.toString());
				msUtil.SaveSessionToRedis(access_token, session.getId(), sesValues);
			}else
			{
				LOGGER.error("Null access token, Security context redis save failed");
			}
			
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}

		// SaveToSessionResponseWrapper wrappedResponse = new
		// SaveToSessionResponseWrapper(
		// response, request, httpSession != null, context);
		// requestResponseHolder.setResponse(wrappedResponse);
		//
		// if (isServlet3) {
		// requestResponseHolder.setRequest(new
		// Servlet3SaveToSessionRequestWrapper(
		// request, wrappedResponse));
		// }

	}

	@Override
	public boolean containsContext(HttpServletRequest request) {
		LOGGER.debug("containsContext: checking context avialability in redis -"
				+request.getSession().getId()+" : "
		+redisTemplate.hasKey(request.getSession().getId()));

		return redisTemplate.hasKey(request.getSession().getId());

	}

	private Authentication prepareAuthenticationObj(HttpServletRequest request, String user, String authroities) {
		List<SimpleGrantedAuthority> authlist = new ArrayList<>();
		if (authroities != null) {
			String[] auths = authroities.split(",");
			for (int count = 0; count < auths.length; ++count) {
				authlist.add(new SimpleGrantedAuthority(auths[count]));
			}

		}
		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, "dummy", authlist);
		WebAuthenticationDetails details = new WebAuthenticationDetails(request);
		auth.setDetails(details);
		return auth;

	}
	
	private void getUserDetails(){
		
	}
	
	 private User loadUserFromMS(String accessToken)
	    {
	    	System.out.println("*************** User Info microservice - started ****************");
	    	System.out.println("Recieved token:"+accessToken);
	    	//MicroserviceUtils msutil = new MicroserviceUtils();
	    	CustomUserDetails user = msUtil.getUserDetails(accessToken);
	    	System.out.println("*************** User Info microservice - end ****************");
	    	return this.parepareCurrentUser(user);
	    }
	    
	    private User parepareCurrentUser(CustomUserDetails userdetails) {
	    
	    		
	    	
	    	User user =new User(UserType.EMPLOYEE);
	    //	user.setId(userdetails.getId());
	    	user.setId(userdetails.getId());
	    	user.setUsername(userdetails.getUserName());
	    	user.setActive(true);
	    	user.setAccountLocked(false);
	    	user.setGender(Gender.FEMALE);
	    	user.setPassword("demo");
	    	user.setName(userdetails.getName());
	    	user.setPwdExpiryDate(new Date(2090,01,01));
	    	user.setLocale(userdetails.getLocale());
	    	System.out.println("***************** is password expired :  "+user.getPwdExpiryDate().isAfterNow());
	    	
//	    	for(Role _role:userdetails.getRoles()){
//	    		
//	    	}
//	    	Role role = new Role();
//	    	role.setId(4L);
//	    	role.setName("SYSTEM");
	    	Set<Role> roles = new HashSet<>(userdetails.getRoles());
	    	//roles.add(role);
	    	
	    	user.setRoles(roles);
	    	
//	    	user.setRoles(new HashSet<>(userdetails.getRoles()));
	    	
	    	
	    	
	    	return user;
//	    	currentUser.setRoles(new Set(userdetails.getRoles()));
	    	
	    }
	    

}
