package org.egov.web.notification.sms.service.spicedigital.impl;

import java.util.HashMap;

import org.apache.commons.lang3.StringUtils;
import org.egov.web.notification.sms.config.SMSCountryPorperties;
import org.egov.web.notification.sms.config.SpiceDigitalProperties;
import org.egov.web.notification.sms.models.Priority;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;


@Service
@ConditionalOnProperty(value = "sms.gateway.to.use", havingValue = "SPICE_DIGITAL")
public class SpiceDigitalSMSBodyBuilderImpl implements SMSBodyBuilder{
	
	@Autowired
	private SpiceDigitalProperties smsProps;
	
    @Autowired
    private Environment environment;
	
    public MultiValueMap<String, String> getSmsRequestBody(Sms sms) {
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add(smsProps.getUserParameterName(), smsProps.getUserName());
        map.add(smsProps.getPasswordParameterName(), smsProps.getPassword());
        map.add(smsProps.getSenderIdParameterName(), smsProps.getSmsSender());
        map.add(smsProps.getMtypeParameterName(), smsProps.getSmsMtype());
        map.add(smsProps.getDrParameterName(), smsProps.getSmsDR());
        map.add(smsProps.getMobileNumberParameterName(), getMobileNumberWithPrefix(sms.getMobileNumber()));
        map.add(smsProps.getMessageParameterName(), sms.getMessage());
        populateSmsPriority(sms.getPriority(), map);
        populateAdditionalSmsParameters(map);

        return map;
    }

    private void populateSmsPriority(Priority priority, MultiValueMap<String, String> requestBody) {
        if (smsProps.isPriorityEnabled()) {
            requestBody.add(smsProps.getSmsPriorityParameterName(), getSmsPriority(priority));
        }
    }

    private void populateAdditionalSmsParameters(MultiValueMap<String, String> map) {
        if (isExtraRequestParametersPresent()) {
            map.setAll(getExtraRequestParameters());
        }
    }

    private String getSmsPriority(Priority priority) {
        return getProperty(String.format(SMSCountryPorperties.SMS_PRIORITY_PARAM_VALUE, priority.toString()));
    }

    private String getMobileNumberWithPrefix(String mobileNumber) {
        return smsProps.getMobileNumberPrefix() + mobileNumber;
    }

    private String getProperty(String propKey) {
        return this.environment.getProperty(propKey, "");
    }

    private boolean isExtraRequestParametersPresent() {
        return StringUtils.isNotBlank(getProperty(SMSCountryPorperties.SMS_EXTRA_REQ_PARAMS));
    }

    private HashMap<String, String> getExtraRequestParameters() {
        String[] extraParameters = getProperty(SMSCountryPorperties.SMS_EXTRA_REQ_PARAMS).split(SMSCountryPorperties.KEY_VALUE_PAIR_DELIMITER);
        final HashMap<String, String> map = new HashMap<>();
        if (extraParameters.length > 0) {
            for (String extraParm : extraParameters) {
                String[] paramNameValue = extraParm.split(SMSCountryPorperties.KEY_VALUE_DELIMITER);
                map.put(paramNameValue[0], paramNameValue[1]);
            }
        }
        return map;
    }



}
