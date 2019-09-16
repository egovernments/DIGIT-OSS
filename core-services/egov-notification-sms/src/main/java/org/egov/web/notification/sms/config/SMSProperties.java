package org.egov.web.notification.sms.config;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@Data
public class SMSProperties {
	
	@Value("${sms.provider.url}")
	public String url;
	
	@Value("${sms.sender.username}")
	public String username;

	@Value("${sms.sender.password}")
	public String password;
	
	@Value("${sms.sender.senderid}")
	public String senderid;

	@Value("${sms.sender.securekey}")
	public String secureKey;
	
	@Value("#{${sms.config.map}}")
	Map<String, String> configMap;

}
