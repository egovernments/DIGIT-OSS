package org.egov.win.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
public class PropertyManager {
	
	@Value("${egov.searcher.host}")
	public String searcherHost;

	@Value("${egov.searcher.endpoint}")
	public String searcherEndpoint;

	@Value("${egov.impact.emailer.interval.in.secs}")
	public Long timeInterval;
	
	@Value("${egov.ws.host}")
	public String wsHost;

	@Value("${egov.ws.endpoint}")
	public String wsEndpoint;
	
	@Value("${egov.mdms.host}")
	public String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	public String mdmsSearchEndpoint;
	
	@Value("${egov.ws.ulbcode}")
	public String wsULBCode;
	
	@Value("${egov.ws.interval.in.ms}")
	public Long wsIntervalInMS;
	
	@Value("${egov.resttemplate.timeout.in.ms}")
	public Integer restTemplateInMS;
	

}
