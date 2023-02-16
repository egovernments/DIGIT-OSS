package org.egov.inbox.config;

import java.util.List;
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
	
	@Value("${workflow.process.nearing.sla.count.path}")
	private String nearingSlaProcessCountPath;

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
	
	@Value("#{${bs.businesscode.service.search}}")
	private Map<String, Map<String, String>> bsServiceSearchMapping;

	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsSearchEndPoint;

	@Value("${egov.es.username}")
	private String esUserName;

	@Value("${egov.es.password}")
	private String esPassword;

	@Value("${services.esindexer.host}")
	private String indexServiceHost;

	@Value("${egov.services.esindexer.host.search}")
	private String indexServiceHostSearchEndpoint;

	@Value("${egov.user.host}")
	private String userHost;

	@Value("${egov.user.search.path}")
	private String userSearchEndpoint;

	@Value("${egov.user.create.path}")
	private String userCreateEndpoint;

	@Value("${egov.internal.microservice.user.uuid}")
	private String egovInternalMicroserviceUserUuid;

	@Value("${state.level.tenant.id}")
	private String parentLevelTenantId;

	// ES Config

	@Value("${water.es.index}")
	private String esWSIndex;

	@Value("${sewerage.es.index}")
	private String esSWIndex;

	// Inbox service Config

	@Value("${inbox.water.search.allowed}")
	private Boolean isInboxSearchAllowed;

	@Value("${es.search.pagination.default.limit}")
	private Long defaultLimit;

	@Value("${es.search.pagination.default.offset}")
	private Long defaultOffset;

	@Value("${es.search.pagination.max.search.limit}")
	private Long maxSearchLimit;

	@Value("${state.level.tenant.id}")
	private String stateLevelTenantId;

	@Value("${es.search.default.sort.order}")
	private String defaultSortOrder;
}

