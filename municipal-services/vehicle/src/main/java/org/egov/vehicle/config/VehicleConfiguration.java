package org.egov.vehicle.config;
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
public class VehicleConfiguration {

    // Persister Config
    @Value("${persister.save.vehicle.topic}")
    private String saveTopic;
    
 // Persister Config
    @Value("${persister.update.vehicle.topic}")
    private String updateTopic;

	@Value("${egov.hrms.host}")
	private String employeeHost;

	@Value("${egov.hrms.context.path}")    
	private String employeeContextPath;
	@Value("${egov.hrms.create.path}")
	private String employeeCreateEndpoint;

	@Value("${egov.hrms.search.path}")
	private String employeeSearchEndpoint;

	@Value("${egov.hrms.update.path}")
	private String employeeUpdateEndpoint;
	
	// User Configuration
		@Value("${egov.user.host}")
		private String userHost;

		@Value("${egov.user.context.path}")    
		private String userContextPath;
		
		
		@Value("${egov.user.create.path}")
		private String userCreateEndpoint;

		@Value("${egov.user.search.path}")
		private String userSearchEndpoint;

		@Value("${egov.user.update.path}")
		private String userUpdateEndpoint;
		
		@Value("${egov.user.username.prefix}")
		private String usernamePrefix;
		
		// MDMS
		@Value("${egov.mdms.host}")
		private String mdmsHost;

		@Value("${egov.mdms.search.endpoint}")
		private String mdmsEndPoint;
		
		@Value("${citizen.allowed.search.params}")
		private String allowedCitizenSearchParameters;

		@Value("${employee.allowed.search.params}")
		private String allowedEmployeeSearchParameters;
		
		@Value("${egov.vehicle.default.limit}")
		private Integer defaultLimit;

		@Value("${egov.vehicle.default.offset}")
		private Integer defaultOffset;

		@Value("${egov.vehicle.max.limit}")
		private Integer maxSearchLimit;
		
		// Idgen Config
		@Value("${egov.idgen.host}")
		private String idGenHost;

		@Value("${egov.idgen.path}")
		private String idGenPath;

		@Value("${egov.idgen.vehicle.trip.applicationNum.name}")
		private String applicationNoIdgenName;

		@Value("${egov.idgen.vehicle.trip.applicationNum.format}")
		private String applicationNoIdgenFormat;


		@Value("${persister.save.vehicle.trip.topic}")
		private String saveVehicleLogTopic;

		@Value("${persister.update.vehicle.trip.topic}")
		private String updateVehicleLogTopic;
		
		@Value("${persister.update.vehicle.trip.workflow.topic}")
		private String updateWorkflowVehicleLogTopic;

		// Allowed Search Parameters
		@Value("${vehicle.log.allowed.search.params}")
		private String allowedVehicleLogSearchParameters;
		
		// Workflow
		@Value("${vehicle.trip.workflow.name}")
		private String businessServiceValue;
		public String getBusinessServiceValue() {
			return null;
		}

		@Value("${workflow.context.path}")
		private String wfHost;

		@Value("${workflow.transition.path}")
		private String wfTransitionPath;

		@Value("${workflow.businessservice.search.path}")
		private String wfBusinessServiceSearchPath;

		@Value("${workflow.process.path}")
		private String wfProcessPath;

	    @Value("${egov.fsm.host}")
	    private String fsmHost;

	    @Value("${egov.fsm.plantmap.context.path}")
	    private String fsmPlantmapContextPath;

	    @Value("${egov.fsm.plantmap.search.endpoint}")
	    private String fsmPlantmapSearchEndpoint;
	    
	    // SMS
	 	@Value("${kafka.topics.notification.sms}")
	 	private String smsNotifTopic;

 		@Value("${notification.sms.enabled}")
 		private Boolean isSMSEnabled;
 		
 		@Value("${egov.localization.statelevel}")
		private Boolean isLocalizationStateLevel;
 		
 		// Localization
		@Value("${egov.localization.host}")
		private String localizationHost;

		@Value("${egov.localization.context.path}")
		private String localizationContextPath;

		@Value("${egov.localization.search.endpoint}")
		private String localizationSearchEndpoint;
		
		@Value("${user.search.rolecode.params}")
		private String userRoleCodes;
		
		@Value("${egov.localization.search.fsm.module}")
		private String fsmSearchModule;
		
		//URL shortner
		@Value("${egov.url.shortner.host}")
		private String urlShortnerHost;
		
		@Value("${tl.url.shortner.endpoint}")
		private String urlShortnerEndpoint;
		
		@Value("${egov.ui.app.host}")
		private String uiAppHost;
		
		@Value("${egov.ui.fsm.new.link}")
		private String newFsmLink;
		
			
}
