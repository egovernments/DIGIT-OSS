package org.egov.web.notification.sms.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SMSCountryPorperties {

    public static final String SMS_PRIORITY_PARAM_VALUE = "sms.smscountry.%s.priority.param.value";
    public static final String SMS_EXTRA_REQ_PARAMS = "sms.smscountry.extra.req.params";
    public static final String KEY_VALUE_PAIR_DELIMITER = "&";
    public static final String KEY_VALUE_DELIMITER = "=";

    @Autowired
    private Environment environment;
    
    @Value("${sms.smscountry.provider.url}")
    @Getter
    private String smsProviderURL;

    @Value("${sms.smscountry.sender.username}")
    private String userName;

    @Value("${sms.smscountry.priority.enabled}")
    private boolean isPriorityEnabled;

    @Value("${sms.smscountry.sender.password}")
    private String password;

    @Value("${sms.smscountry.sender}")
    private String smsSender;
    
    @Value("${sms.smscountry.mtype}")
    private String smsMtype;
    
    @Value("${sms.smscountry.dr}")
    private String smsDR;

    @Value("${sms.smscountry.sender.username.req.param.name}")
    private String userParameterName;

    @Value("${sms.smscountry.sender.password.req.param.name}")
    private String passwordParameterName;

    @Value("${sms.smscountry.priority.param.name}")
    private String smsPriorityParameterName;

    @Value("${sms.smscountry.sender.req.param.name}")
    private String senderIdParameterName;

    @Value("${sms.smscountry.destination.mobile.req.param.name}")
    private String mobileNumberParameterName;

    @Value("${sms.smscountry.message.req.param.name}")
    private String messageParameterName;

    @Value("${mobile.number.prefix:}")
    private String mobileNumberPrefix;
    
    @Value("${sms.smscountry.message.mtype.param.name}")
    private String mtypeParameterName;
    
    @Value("${sms.smscountry.message.dr.param.name}")
    private String drParameterName;

    @Value("#{'${sms.smscountry.error.codes}'.split(',')}")
    @Getter
    private List<String> smsErrorCodes;
	
}
