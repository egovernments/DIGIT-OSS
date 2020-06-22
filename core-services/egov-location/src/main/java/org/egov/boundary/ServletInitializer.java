package org.egov.boundary;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import static org.springframework.boot.WebApplicationType.SERVLET;

public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		application.web(SERVLET);
		return application.sources(BoundaryApplication.class);
	}
	
	

}
