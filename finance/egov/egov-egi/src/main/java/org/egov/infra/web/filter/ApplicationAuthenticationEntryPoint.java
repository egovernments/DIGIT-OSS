package org.egov.infra.web.filter;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class ApplicationAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
            throws IOException, ServletException {
        HttpSession session = request.getSession();
        Object error_code = session.getAttribute("error-code");
        String error_redirect_url = "/error/accessdenied.jsp";
        if (error_code != null) {
            switch ((int) error_code) {
            case 440: {
                error_redirect_url= "/error/sessionExpired.jsp";
                session.removeAttribute("error-code");
                break;
            }
            }
        }
        response.sendRedirect(request.getContextPath() + error_redirect_url);
    }

}
