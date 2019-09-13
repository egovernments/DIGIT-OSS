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
public class SpiceDigitalProperties {
	
	
    public static final String SMS_PRIORITY_PARAM_VALUE = "sms.spicedigital.%s.priority.param.value";
    public static final String SMS_EXTRA_REQ_PARAMS = "sms.spicedigital.extra.req.params";
    public static final String KEY_VALUE_PAIR_DELIMITER = "&";
    public static final String KEY_VALUE_DELIMITER = "=";

    @Autowired
    private Environment environment;
    
    @Value("${sms.spicedigital.provider.url}")
    @Getter
    private String smsProviderURL;

    @Value("${sms.spicedigital.sender.username}")
    private String userName;

    @Value("${sms.spicedigital.priority.enabled}")
    private boolean isPriorityEnabled;

    @Value("${sms.spicedigital.sender.password}")
    private String password;

    @Value("${sms.spicedigital.sender}")
    private String smsSender;
    
    @Value("${sms.spicedigital.mtype}")
    private String smsMtype;
    
    @Value("${sms.spicedigital.dr}")
    private String smsDR;

    @Value("${sms.spicedigital.sender.username.req.param.name}")
    private String userParameterName;

    @Value("${sms.spicedigital.sender.password.req.param.name}")
    private String passwordParameterName;

    @Value("${sms.spicedigital.priority.param.name}")
    private String smsPriorityParameterName;

    @Value("${sms.spicedigital.sender.req.param.name}")
    private String senderIdParameterName;

    @Value("${sms.spicedigital.destination.mobile.req.param.name}")
    private String mobileNumberParameterName;

    @Value("${sms.spicedigital.message.req.param.name}")
    private String messageParameterName;

    @Value("${mobile.number.prefix:}")
    private String mobileNumberPrefix;
    
    @Value("${sms.spicedigital.message.mtype.param.name}")
    private String mtypeParameterName;
    
    @Value("${sms.spicedigital.message.dr.param.name}")
    private String drParameterName;

    @Value("#{'${sms.spicedigital.error.codes}'.split(',')}")
    @Getter
    private List<String> smsErrorCodes;
    

}
