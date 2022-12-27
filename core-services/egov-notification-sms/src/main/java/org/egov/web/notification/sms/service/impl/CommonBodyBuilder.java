package org.egov.web.notification.sms.service.impl;

import org.egov.web.notification.sms.config.SMSProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Primary
public class CommonBodyBuilder implements SMSBodyBuilder {

	@Autowired
	private SMSProperties smsProps;
	
	public static final String SMS_TEMPLATE_ID = "template_id";
	
	public static final String SMS_PE_ID = "pe_id";

	public MultiValueMap<String, String> getSmsRequestBody(Sms sms) {
		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		String template_id= null;
		String pe_id= null;
		for (String key : smsProps.getConfigMap().keySet()) {
			String value = smsProps.getConfigMap().get(key);
			if (value.contains("$")) {
				if (value.equals("$username")) {
					map.add(key, smsProps.getUsername());
				} else if (value.equals("$password")) {
					map.add(key, smsProps.getPassword());
				} else if (value.equals("$senderid")) {
					map.add(key, smsProps.getSenderid());
				} else if (value.equals("$securekey")) {
					map.add(key, smsProps.getSecureKey());
				} else if (value.equals("$mobileno")) {
					map.add(key, sms.getMobileNumber());
				} else if (value.equals("$message")) {
					log.info("actual message extracted: "+sms.getMessage());
			        String msgs[]=sms.getMessage().split("\\|"); 
			        if(msgs.length >1){
			        	template_id=msgs[1];
			            if(msgs.length>2)
			            	pe_id=msgs[2];
			            log.info("filetered message:"+msgs[0]);
			            log.info("sms_entity_id:"+template_id);
			            log.info("sms_template_id:"+pe_id);
			            map.add(key, msgs[0]);
			            map.add(SMS_TEMPLATE_ID, template_id);
			            map.add(SMS_PE_ID, pe_id);
			        }else{
					map.add(key, sms.getMessage());
			        }
				} else
					map.add(key, value);
			} else {
				map.add(key, value);
			}

		}

		return map;
	}

}
