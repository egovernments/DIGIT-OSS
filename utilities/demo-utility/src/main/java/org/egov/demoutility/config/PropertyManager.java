package org.egov.demoutility.config;


import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Import({TracerConfiguration.class})
@Getter
@Builder
@Component
@AllArgsConstructor
@NoArgsConstructor
public class PropertyManager {

	@Value("${kafka.demoutility.topic}")
	public String demotopic;

	@Value("${egov.core.notification.email.topic}")
	public String emailNotificationTopic;

	@Value("${egov.user.host}")
	public String userHost;

	@Value("${egov.user.oauth.url}")
	public String userAuthUrl;

	@Value("${egov.hrms.superuser}")
	public String superUser;

	@Value("${egov.hrms.password}")
	public String password;

	@Value("${egov.hrms.host}")
	public String hrmsHost;

	@Value("${egov.hrms.create.endpoint}")
	public String hrmsCreateEndPoint;

	@Value("${egov.vendor.host}")
	public String vendorHost;

	@Value("${egov.vendor.createvendor}")
	public String vendorcreateEndpoint;
	
	@Value("${egov.user.password.update}")
	public String passwordUpdate;

}
