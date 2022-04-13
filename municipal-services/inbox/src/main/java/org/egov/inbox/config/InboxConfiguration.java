package org.egov.inbox.config;

import java.util.Map;
import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class InboxConfiguration {

	@Value("${app.timezone}")
	private String timeZone;

	@PostConstruct
	public void initialize() {
		TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
	}

	@Value("${workflow.host}")
	private String workflowHost;

	@Value("${workflow.process.search.path}")
	private String processSearchPath;

	@Value("${workflow.businessservice.search.path}")
	private String businessServiceSearchPath;

	@Value("#{${service.search.mapping}}")
	private Map<String, Map<String, String>> serviceSearchMapping;

	@Value("${workflow.process.count.path}")
	private String processCountPath;

	@Value("${workflow.process.statuscount.path}")
	private String processStatusCountPath;

	@Value("${egov.searcher.host}")
	private String searcherHost;

	@Value("${egov.searcher.fsm.dsoid.path}")
	private String fsmInboxDSoIDEndpoint;
	
	@Value("${egov.vehicle.host}")
	private String vehicleHost;
	
	@Value("${vehicle.search.path}")
	private String vehicleSearchPath;
	
	@Value("${vehicle.fetchApplicationStatusCount.path}")
	private String vehicleApplicationStatusCountPath;
	
	@Value("${vehicle.searchTrip.path}")
	private String vehicleSearchTripPath;
	
	@Value("${egov.fsm.host}")
	private String fsmHost;

	@Value("${egov.fsm.fetchApplicationIds.path}")
	private String fetchApplicationIds;

}