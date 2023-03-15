package org.egov.infra.web.filter;

import static org.egov.infra.utils.ApplicationConstant.MS_TENANTID_KEY;
import static org.egov.infra.utils.ApplicationConstant.MS_USER_TOKEN;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpStatus;
import org.apache.log4j.Logger;
import org.egov.infra.admin.master.entity.CustomUserDetails;
import org.egov.infra.admin.master.entity.Role;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.config.security.authentication.userdetail.CurrentUser;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.exception.AuthorizationException;
import org.egov.infra.microservice.contract.Error;
import org.egov.infra.microservice.contract.ErrorResponse;
import org.egov.infra.microservice.contract.UserSearchResponse;
import org.egov.infra.microservice.contract.UserSearchResponseContent;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.persistence.entity.enums.Gender;
import org.egov.infra.persistence.entity.enums.UserType;
import org.owasp.esapi.ESAPI;
import org.owasp.esapi.HTTPUtilities;
import org.owasp.esapi.filters.SecurityWrapperRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;

public class RestServiceAuthFilter implements Filter {

	private static final Logger LOGGER = Logger.getLogger(RestServiceAuthFilter.class);

	@Value("${egov.services.user.authsrvc.url}")
	private String authSrvcUrl;

	@Autowired
	public MicroserviceUtils microserviceUtils;

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws ServletException, IOException {
		LOGGER.info("Rest service authentication initiated");

		HttpServletRequest httpRequest = (HttpServletRequest) req;
		HttpServletResponse httpResponse = (HttpServletResponse) res;

		HTTPUtilities httpUtilities = ESAPI.httpUtilities();
		httpUtilities.setCurrentHTTP(httpRequest, httpResponse);
		if (httpRequest.getRequestURI().contains("/ClearToken")
				|| httpRequest.getRequestURI().contains("/refreshToken")) {
			LOGGER.info("Clear Token request recieved ");
			httpRequest.getRequestDispatcher(httpRequest.getServletPath()).forward(req, res);
		} else if (httpRequest.getRequestURI().contains("/rest/voucher/")) {
			try {
				RestRequestWrapper request = new RestRequestWrapper(httpRequest);
				String tenantId = readTenantId(request);
				String userToken = readAuthToken(request, tenantId);
				HttpSession session = httpRequest.getSession();
				session.setAttribute(MS_TENANTID_KEY, tenantId);
				session.setAttribute(MS_USER_TOKEN, userToken);
				CurrentUser user = new CurrentUser(this.getUserDetails(request));
				Authentication auth = this.prepareAuthenticationObj(request, user);
				SecurityContextHolder.getContext().setAuthentication(auth);
				chain.doFilter(request, res);
			} catch (IOException | ServletException | AuthorizationException e) {
				httpUtilities.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
				httpResponse.setStatus(HttpStatus.SC_UNAUTHORIZED);
				httpResponse.getWriter().write(getErrorResponse(e.getMessage()));
			}
		} else {
			RestRequestWrapper request = new RestRequestWrapper(httpRequest);

			try {
				CurrentUser user = new CurrentUser(this.getUserDetails(request));
				Authentication auth = this.prepareAuthenticationObj(request, user);
				SecurityContextHolder.getContext().setAuthentication(auth);
				chain.doFilter(request, res);

			} catch (AuthorizationException e) {
				res.setContentType(MediaType.APPLICATION_JSON_VALUE);
				res.getWriter().write(getErrorResponse(e.getMessage()));
			}
		}
		LOGGER.info("Rest service authentication completed");

	}

	private String getErrorResponse(String errorMsg) throws JsonProcessingException {
		ErrorResponse errorResp = new ErrorResponse();
		List<Error> errorlist = new ArrayList<>();

		Error error = new Error();
		error.setCode(401);
		error.setDescription(errorMsg);
		error.setMessage(errorMsg);

		errorlist.add(error);
		errorResp.setErrors(errorlist);
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(errorResp);

	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void destroy() {
	}

	private Authentication prepareAuthenticationObj(HttpServletRequest request, CurrentUser user) {

		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, " ",
				user.getAuthorities());
		WebAuthenticationDetails details = new WebAuthenticationDetails(request);
		auth.setDetails(details);
		return auth;
	}

	private User getUserDetails(HttpServletRequest request) throws AuthorizationException {

		String tenantId = readTenantId(request);
		String userToken = readAuthToken(request, tenantId);
		setSchema(tenantId);
		if (userToken == null)
			throw new AuthorizationException("AuthToken not found");
		HttpSession session = request.getSession();
		String adminToken = this.microserviceUtils.generateAdminToken(tenantId);
		if (adminToken == null)
			throw new AuthorizationException("SI token generation failed");
		session.setAttribute(MS_USER_TOKEN, userToken);
		CustomUserDetails user = this.microserviceUtils.getUserDetails(userToken, adminToken);
		session.setAttribute(MS_TENANTID_KEY, user.getTenantId());
		UserSearchResponse response = this.microserviceUtils.getUserInfo(userToken, user.getTenantId(), user.getUuid());

		return parepareCurrentUser(response.getUserSearchResponseContent().get(0));
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

		Set<Role> roles = new HashSet<>();

		userinfo.getRoles().forEach(roleReq -> {
			Role role = new Role();
			role.setId(roleReq.getId());
			role.setName(roleReq.getName());
			roles.add(role);
		});

		return user;

	}

	@SuppressWarnings({ "deprecation", "unchecked" })
	private String readAuthToken(HttpServletRequest request, String tenantId) {
		LOGGER.info("Rest service - reading authtoken");

		try {
			ObjectMapper mapper = new ObjectMapper();
			mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
			mapper.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

			String strReq = IOUtils.toString(request.getInputStream());
			LOGGER.info("Rest service request json : " + strReq);

			HashMap<Object, Object> reqMap = mapper.readValue(strReq, HashMap.class);
			HashMap<Object, Object> reqInfo = null;
			reqInfo = (HashMap) reqMap.get("RequestInfo");

			String authToken = (String) reqInfo.get("authToken");
			if (authToken == null)
				authToken = this.microserviceUtils.generateAdminToken(tenantId);
			return authToken;
		} catch (IOException e) {
			LOGGER.error("Request processing failed" + e.getMessage());
			throw new ApplicationRuntimeException("Request processing failed" + e.getMessage());
		}
	}

	@SuppressWarnings({ "deprecation", "unchecked" })
	private String readTenantId(HttpServletRequest request) {
		LOGGER.info("Rest service - reading tenantId");
		try {
			ObjectMapper mapper = new ObjectMapper();
			mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
			mapper.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

			String strReq = IOUtils.toString(request.getInputStream());
			HashMap<Object, Object> reqMap = mapper.readValue(strReq, HashMap.class);
			String tenantId = String.valueOf(reqMap.get("tenantId"));
			if (tenantId == null || "null".equalsIgnoreCase(tenantId)) {
				LOGGER.info("Trying to read tenantid in query string ");
				tenantId = request.getParameter("tenantId");
			}
			if (tenantId == null || "null".equalsIgnoreCase(tenantId))
				throw new NullPointerException("tenantId is not found");

			return tenantId;
		} catch (JsonParseException e) {
			throw new ApplicationRuntimeException("Request parsing failed" + e.getMessage());
		} catch (JsonMappingException e) {
			throw new ApplicationRuntimeException("Request object Mapping failed" + e.getMessage());
		} catch (IOException e) {
			throw new ApplicationRuntimeException("Request processing failed" + e.getMessage());
		}

	}

	private void setSchema(String tenantid) {
		if (null != tenantid && !"".equals(tenantid)) {
			String[] tenantParts = tenantid.split("\\.");
			if (tenantParts != null || tenantParts.length > 1) {
				ApplicationThreadLocals.setTenantID(tenantParts[1]);
			}
		}

	}
}
