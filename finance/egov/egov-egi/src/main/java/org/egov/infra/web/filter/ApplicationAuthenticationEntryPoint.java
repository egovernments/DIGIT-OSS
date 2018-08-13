package org.egov.infra.web.filter;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
@Component
public class ApplicationAuthenticationEntryPoint implements AuthenticationEntryPoint {

	@Override
	public void commence(HttpServletRequest arg0, HttpServletResponse arg1, AuthenticationException arg2)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		System.out.println("*********************** request processing failed **********************");
		//arg1.sendError( HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized" );
		arg1.setStatus(org.apache.http.HttpStatus.SC_OK);
	}

}
