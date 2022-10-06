package org.egov.infra.mdms.avm.controller;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.egov.infra.mdms.avm.api.ApiIntegration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiIntigrationController {

	@Autowired ApiIntegration apiIntegration;
	
	@GetMapping("companyinfo")
	public StringBuffer  getCompanyInfo() throws ClientProtocolException, IOException {
		return apiIntegration.getMcaCompanyInformation();
	}
}
