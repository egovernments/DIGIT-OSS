package org.egov.fsm.plantmapping.config;

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
public class PlantMappingConfiguration {

	// MDMS
			@Value("${egov.mdms.host}")
			private String mdmsHost;

			@Value("${egov.mdms.search.endpoint}")
			private String mdmsEndPoint;
			
	//User service 

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
			

	// Persister Config
			@Value("${persister.save.plantmap.topic}")
			private String saveTopic;
			

			@Value("${plant.mapping.allowed.search.params}")
			private String allowedPlantMappingSearchParameters;
			
			@Value("${persister.update.plantmap.topic}")
			private String updateTopic;
}
