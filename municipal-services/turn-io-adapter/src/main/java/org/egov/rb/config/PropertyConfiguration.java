package org.egov.rb.config;

import java.math.BigDecimal;
import java.util.List;
import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Import({ TracerConfiguration.class })
@Getter
@Builder
@Component
@AllArgsConstructor
@NoArgsConstructor
public class PropertyConfiguration {

	@Value("${egov.pgr.host}")
	private String pgrBasePath;

	@Value("${egov.pgr.create.endpoint}")
	private String pgrCreateEndPoint;

	@Value("${kafka.topics.update.pgr}")
	private String pgrUpdateTopic;

	@Value("${egov.external.host}")
	private String egovExternalHost;

	@Value("${authorization.token}")
	private String authorizationToken;

	@Value("${turn.io.message.api}")
	private String turnIoMessageAPI;

	@Value("${turn.io.profile.api}")
	private String turnIoProfileUpdateAPI;

	@Value("${state.level.tenant.id}")
	private String stateLevelTenantId;

	@Value("${pgr.v1.enabled}")
	private String pgrv1enabled;
	
	@Value("${egov.pgr.service.host}")
	private String pgrServiceHost;
	
	@Value("${egov.pgr.service.create.endpoint}")
	private String pgrServiceCreateEndpoint;
	
	

}
