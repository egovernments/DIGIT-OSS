package org.egov.infra.config.security.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.admin.master.entity.Role;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.config.security.authentication.userdetail.CurrentUser;
import org.egov.infra.microservice.contract.UserSearchResponse;
import org.egov.infra.microservice.contract.UserSearchResponseContent;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.persistence.entity.enums.Gender;
import org.egov.infra.persistence.entity.enums.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.CustomEditorConfigurer;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.messaging.simp.user.UserSessionRegistryAdapter;
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
	public MicroserviceUtils microserviceUtils;

	@Override
	public SecurityContext loadContext(HttpRequestResponseHolder requestResponseHolder) {
		// TODO Auto-generated method stub

		LOGGER.debug("Loading security context:  " + requestResponseHolder);
		SecurityContext context = new SecurityContextImpl();
		CurrentUser cur_user= null;
		try {

			HttpServletRequest request = requestResponseHolder.getRequest();
			cur_user = (CurrentUser)this.microserviceUtils.readFromRedis(request.getSession().getId(), "current_user");
			if (cur_user==null) {
				LOGGER.info("Session is not available in redis and trying to login");
				cur_user = new CurrentUser(this.getUserDetails(request));
				this.microserviceUtils.savetoRedis(request.getSession().getId(), "current_user", cur_user);

			}
			context.setAuthentication(this.prepareAuthenticationObj(request, cur_user));
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			LOGGER.error("Session is not found in Redis. Creating empty security context");
			return SecurityContextHolder.createEmptyContext();
		}
		return context;
	}

	@Override
	public void saveContext(SecurityContext context, HttpServletRequest request, HttpServletResponse response) {

//		LOGGER.debug("Got the request to cusome app security repository - saveContext");
//		if (context == null || context.getAuthentication() == null) {
//			LOGGER.error("Securirty context/authentication is null");
//			return;
//		}
//		try {
//			HttpSession session = request.getSession();
//			String sessionId = session.getId(), tenantId = String.valueOf(session.getAttribute("tenantId")),
//					access_token = request.getParameter("acces_token"), user = context.getAuthentication().getName(),
//					remoteIp = request.getRemoteAddr();
//
//			if (access_token == null)
//				access_token = String.valueOf(session.getAttribute("access_token"));
//
//			if (null != access_token) {
//				Map<String, String> sesValues = new HashMap<>();
//
//				sesValues.put("ACCESS_TOKEN", access_token);
//				sesValues.put("NAME", user);
//				sesValues.put("RemoteIP", remoteIp);
//
//				Authentication auth = context.getAuthentication();
//				StringBuilder authStr = new StringBuilder();
//				for (GrantedAuthority authority : auth.getAuthorities()) {
//					authStr.append(authority.getAuthority() + ",");
//				}
//				sesValues.put("Authorities", authStr.toString());
//				msUtil.SaveSessionToRedis(access_token, session.getId(), sesValues);
//			} else {
//				LOGGER.error("Null access token, Security context redis save failed");
//			}
//
//		} catch (Exception e) {
//			LOGGER.error(e.getMessage());
//		}

	}

	@Override
	public boolean containsContext(HttpServletRequest request) {
		LOGGER.debug("containsContext: checking context avialability in redis -" + request.getSession().getId() + " : "
				+ redisTemplate.hasKey(request.getSession().getId()));

		return redisTemplate.hasKey(request.getSession().getId());

	}

//	private Authentication prepareAuthenticationObj(HttpServletRequest request, String user, String authroities) {
//		List<SimpleGrantedAuthority> authlist = new ArrayList<>();
//		if (authroities != null) {
//			String[] auths = authroities.split(",");
//			for (int count = 0; count < auths.length; ++count) {
//				authlist.add(new SimpleGrantedAuthority(auths[count]));
//			}
//
//		}
//		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, "dummy", authlist);
//		WebAuthenticationDetails details = new WebAuthenticationDetails(request);
//		auth.setDetails(details);
//		return auth;
//
//	}

	private Authentication prepareAuthenticationObj(HttpServletRequest request, CurrentUser user) {

		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, "dummy",
				user.getAuthorities());
		WebAuthenticationDetails details = new WebAuthenticationDetails(request);
		auth.setDetails(details);
		return auth;
	}

	private User getUserDetails(HttpServletRequest request) throws Exception{
		String user_token = request.getParameter("auth_token");
		if(user_token==null)
			throw new Exception("AuthToken not found");
		String sessionId = request.getSession().getId();
		this.microserviceUtils.savetoRedis(sessionId, "auth_token", user_token);
		String admin_token = this.microserviceUtils.generateAdminToken();
		this.microserviceUtils.savetoRedis(sessionId, "admin_token", admin_token);
		CustomUserDetails user = this.microserviceUtils.getUserDetails(user_token, admin_token);
		this.microserviceUtils.savetoRedis(sessionId, "_details", user);
		UserSearchResponse response = this.microserviceUtils.getUserInfo(user_token, user.getTenantId(), user.getUserName());
		return this.parepareCurrentUser(response.getUserSearchResponseContent().get(0));
	}

	private User parepareCurrentUser(UserSearchResponseContent userinfo) {

		User user = new User(UserType.EMPLOYEE);
		user.setId(userinfo.getId());
		user.setUsername(userinfo.getUserName());
		user.setActive(userinfo.getActive());
		user.setAccountLocked(userinfo.getAccountLocked());
		user.setGender(Gender.FEMALE);
		user.setPassword("demo");
		user.setName(userinfo.getName());
		user.setPwdExpiryDate(userinfo.getPwdExpiryDate());
		user.setLocale(userinfo.getLocale());

		Set<Role> roles = new HashSet<>();

		userinfo.getRoles().forEach(roleReq -> {
			Role role = new Role();
			role.setId(roleReq.getId());
			role.setName(roleReq.getName());
			roles.add(role);
		});

		return user;

	}

}
