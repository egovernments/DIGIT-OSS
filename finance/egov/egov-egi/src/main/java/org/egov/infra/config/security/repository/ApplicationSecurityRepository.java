package org.egov.infra.config.security.repository;

import static org.egov.infra.utils.ApplicationConstant.MS_TENANTID_KEY;
import static org.egov.infra.utils.ApplicationConstant.MS_USER_TOKEN;
import static org.egov.infra.utils.ApplicationConstant.USERID_KEY;

import java.util.HashSet;
import java.util.Set;

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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.context.HttpRequestResponseHolder;
import org.springframework.security.web.context.SecurityContextRepository;

import com.mchange.rmi.NotAuthorizedException;

public class ApplicationSecurityRepository implements SecurityContextRepository {

	private static final String AUTH_TOKEN = "auth_token";

	private static final Logger LOGGER = Logger.getLogger(ApplicationSecurityRepository.class);

	@Autowired
	public RedisTemplate<Object, Object> redisTemplate;

	@Autowired
	public MicroserviceUtils microserviceUtils;

	@Override
	public SecurityContext loadContext(HttpRequestResponseHolder requestResponseHolder) {

		SecurityContext context = new SecurityContextImpl();
		CurrentUser curUser = null;
		try {

			HttpServletRequest request = requestResponseHolder.getRequest();
			HttpSession session = request.getSession();
			LOGGER.info(" *** URI " + request.getRequestURL().toString());
			curUser = (CurrentUser) this.microserviceUtils.readFromRedis(request.getSession().getId(), "current_user");
			if (curUser == null) {
				LOGGER.info(" ***  Session is not available in redis.... , trying to login");
				curUser = new CurrentUser(this.getUserDetails(request));
				this.microserviceUtils.savetoRedis(session.getId(), "current_user", curUser);
			}
			String oldToken = (String) session.getAttribute(MS_USER_TOKEN);
			String newToken = (String) this.microserviceUtils.readFromRedis(session.getId(), AUTH_TOKEN);
			if (null != oldToken && null != newToken && !oldToken.equals(newToken)) {
				session.setAttribute(MS_USER_TOKEN, newToken);
			}
			LOGGER.info(" ***  Session   found  in redis.... ," + request.getSession().getId());

			context.setAuthentication(this.prepareAuthenticationObj(request, curUser));
		} catch (SecurityException | NotAuthorizedException e) {
			LOGGER.error(e.getMessage());
			LOGGER.error(" ***  Session is not found in Redis. Creating empty security context");
			return SecurityContextHolder.createEmptyContext();
		}
		return context;
	}

	@Override
	public void saveContext(SecurityContext context, HttpServletRequest request, HttpServletResponse response) {

	}

	@Override
	public boolean containsContext(HttpServletRequest request) {
		LOGGER.debug("containsContext: checking context avialability in redis -" + request.getSession().getId() + " : "
				+ redisTemplate.hasKey(request.getSession().getId()));

		return redisTemplate.hasKey(request.getSession().getId());

	}

	private Authentication prepareAuthenticationObj(HttpServletRequest request, CurrentUser user) {

		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, "dummy",
				user.getAuthorities());
		WebAuthenticationDetails details = new WebAuthenticationDetails(request);
		auth.setDetails(details);
		return auth;
	}

	private User getUserDetails(HttpServletRequest request) throws NotAuthorizedException {
		String userToken = null;
		String tenantid = null;
		userToken = request.getParameter(AUTH_TOKEN);
		tenantid = request.getParameter("tenantId");
		HttpSession session = request.getSession();
		LOGGER.info(" *** authtoken " + userToken);

		if (userToken == null) {
			session.setAttribute("error-code", 440);
			throw new NotAuthorizedException("AuthToken not found");
		}

		String adminToken = this.microserviceUtils.generateAdminToken(tenantid);
		session.setAttribute(MS_USER_TOKEN, userToken);
		CustomUserDetails user = this.microserviceUtils.getUserDetails(userToken, adminToken);
		if (null == user || user.getId() == null)
			throw new NotAuthorizedException("Invalid Token");
		session.setAttribute(MS_TENANTID_KEY, user.getTenantId());
		session.setAttribute(USERID_KEY, user.getId());
		UserSearchResponse response = this.microserviceUtils.getUserInfo(userToken, user.getTenantId(), user.getUuid());

		this.microserviceUtils.removeSessionFromRedis(userToken, session.getId());
		this.microserviceUtils.savetoRedis(session.getId(), AUTH_TOKEN, userToken);
		this.microserviceUtils.savetoRedis(session.getId(), "_details", user);
		this.microserviceUtils.saveAuthToken(userToken, session.getId());

		this.microserviceUtils.setExpire(session.getId());
		this.microserviceUtils.setExpire(userToken);

		return this.parepareCurrentUser(response.getUserSearchResponseContent().get(0));
	}

	private User parepareCurrentUser(UserSearchResponseContent userinfo) {

		User user = new User(UserType.valueOf(userinfo.getType().toUpperCase()));
		user.setId(userinfo.getId());
		user.setUsername(userinfo.getUserName());
		user.setActive(userinfo.getActive());
		user.setAccountLocked(userinfo.getAccountLocked());
		user.setGender(Gender.valueOf(userinfo.getGender().toUpperCase()));
		user.setPassword(" ");
		user.setName(userinfo.getName());
		user.setPwdExpiryDate(userinfo.getPwdExpiryDate());
		user.setLocale(userinfo.getLocale());
		user.setUuid(userinfo.getUuid());

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
