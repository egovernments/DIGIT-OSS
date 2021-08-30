package org.egov.tlcalculator.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Data;


@Configuration
@Data
public class BillingSlabConfigs {

	@Value("${kafka.topics.save.service}")
	public String persisterSaveTopic;
	
	@Value("${kafka.topics.update.service}")
	public String persisterUpdateTopic;
	
}
