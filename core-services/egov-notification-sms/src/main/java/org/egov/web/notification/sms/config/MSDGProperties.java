package org.egov.web.notification.sms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MSDGProperties {
	
	@Value("${sms.msdg.provider.url}")
	public String url;
	
	@Value("${sms.msdg.username.parameter}")
	public String usernameParameter;
	
	@Value("${sms.msdg.username.value}")
	public String username;

	@Value("${sms.msdg.password.parameter}")
	public String passwordParameter;

	@Value("${sms.msdg.password.value}")
	public String password;

	@Value("${sms.msdg.senderid.parameter}")
	public String senderidParameter;
	
	@Value("${sms.msdg.senderid.value}")
	public String senderid;
		
	@Value("${sms.msdg.smsservicetype.parameter}")
	public String smsservicetypeParameter;

	@Value("${sms.msdg.smsservicetype.value}")
	public String smsservicetype;
	
	@Value("${sms.msdg.mobileno.parameter}")
	public String mobileNoParameter;
	
	@Value("${sms.msdg.content.parameter}")
	public String messageParameter;

}
