package org.egov.infra.web.filter;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.owasp.esapi.ESAPI;
import org.owasp.esapi.HTTPUtilities;
import org.owasp.esapi.errors.AccessControlException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class ApplicationAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationAuthenticationEntryPoint.class);

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
			throws IOException, ServletException {
		HttpSession session = request.getSession();
		Object errorCode = session.getAttribute("error-code");
		String errorRedirectUrl = "/error/accessdenied.jsp";
		if (errorCode != null) {
			switch ((int) errorCode) {
			case 440: {
				errorRedirectUrl = "/error/sessionExpired.jsp";
				session.removeAttribute("error-code");
				break;
			}
			}
		}
		HTTPUtilities httpUtilities = ESAPI.httpUtilities();
		httpUtilities.setCurrentHTTP(request, response);
		try {
			httpUtilities.sendRedirect(request.getContextPath() + errorRedirectUrl);
		} catch (AccessControlException e) {
			LOGGER.error("Error occurred: ", e);
		}
	}

}
