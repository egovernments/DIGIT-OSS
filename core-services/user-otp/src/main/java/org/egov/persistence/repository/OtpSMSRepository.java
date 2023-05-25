package org.egov.persistence.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.domain.model.Category;
import org.egov.domain.model.OtpRequest;
import org.egov.domain.service.LocalizationService;
import org.egov.persistence.contract.SMSRequest;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.Map;

import static java.lang.String.format;


@Service
@Slf4j
public class OtpSMSRepository {

    private static final String LOCALIZATION_KEY_REGISTER_SMS = "sms.register.otp.msg";
    private static final String LOCALIZATION_KEY_LOGIN_SMS = "sms.login.otp.msg";
    private static final String LOCALIZATION_KEY_PWD_RESET_SMS = "sms.pwd.reset.otp.msg";

    @Value("${expiry.time.for.otp: 4000}")
    private long maxExecutionTime=2000L;

    @Value("${egov.localisation.tenantid.strip.suffix.count}")
    private int tenantIdStripSuffixCount;

    private CustomKafkaTemplate<String, SMSRequest> kafkaTemplate;
    private String smsTopic;

    @Autowired
    private LocalizationService localizationService;

    @Autowired
    public OtpSMSRepository(CustomKafkaTemplate<String, SMSRequest> kafkaTemplate,
                            @Value("${sms.topic}") String smsTopic) {
        this.kafkaTemplate = kafkaTemplate;
        this.smsTopic = smsTopic;
    }


    public void send(OtpRequest otpRequest, String otpNumber) {
		Long currentTime = System.currentTimeMillis() + maxExecutionTime;
		final String message = getMessage(otpNumber, otpRequest);
        kafkaTemplate.send(smsTopic, new SMSRequest(otpRequest.getMobileNumber(), message, Category.OTP, currentTime));
    }

    private String getMessage(String otpNumber, OtpRequest otpRequest) {
        final String messageFormat = getMessageFormat(otpRequest);
        return format(messageFormat, otpNumber);
    }

    private String getMessageFormat(OtpRequest otpRequest) {
        String tenantId = getRequiredTenantId(otpRequest.getTenantId());
        Map<String, String> localisedMsgs = localizationService.getLocalisedMessages(tenantId, "en_IN", "egov-user");
        if (localisedMsgs.isEmpty()) {
            log.info("Localization Service didn't return any msgs so using default...");
            localisedMsgs.put(LOCALIZATION_KEY_REGISTER_SMS, "Dear Citizen, Your OTP to complete your mSeva Registration is %s.");
            localisedMsgs.put(LOCALIZATION_KEY_LOGIN_SMS, "Dear Citizen, Your Login OTP is %s.");
            localisedMsgs.put(LOCALIZATION_KEY_PWD_RESET_SMS, "Dear Citizen, Your OTP for recovering password is %s.");
        }
        String message = null;

        if (otpRequest.isRegistrationRequestType())
            message = localisedMsgs.get(LOCALIZATION_KEY_REGISTER_SMS);
        else if (otpRequest.isLoginRequestType())
            message = localisedMsgs.get(LOCALIZATION_KEY_LOGIN_SMS);
        else
            message = localisedMsgs.get(LOCALIZATION_KEY_PWD_RESET_SMS);

        return message;
    }

    /**
     *  getRequiredTenantId() method return tenatid for loclisation 
     *  as per the tenantIdStripSuffixCount. 
     *  Example:- If provided tenantid is X.Y.Z and tenantIdStripSuffixCount = 1 
     *  then this function return X.Y as  required tenant id for localisation.
     *  Depend on the value of tenantIdStripSuffixCount, the level of tenantid
     *  is removed from suffix of provided tenant id.
     * 
     *  For tenantIdStripSuffixCount = 2 returns tenatId as X
     *  Similarly, for tenantIdStripSuffixCount = 3 or any other higher value
     *  will return top level tenantId (In this case it will return X as tenantId) 
     * 
     *  For tenantIdStripSuffixCount = 0 return tenantId as X.Y.Z
     *  here tenantIdStripSuffixCount as 0 means no cut from suffix.
     *  
     * 
     * @param tenantId tenantId of the PT
     *  
     * @return Return tenantid for localisation
     */

    private String getRequiredTenantId(String tenantId) {
        String[] tenantList = tenantId.split("\\.");
        if(tenantIdStripSuffixCount>0 && tenantIdStripSuffixCount<tenantList.length) {    // handeled case if tenantIdStripSuffixCount 
            int cutIndex = tenantList.length - tenantIdStripSuffixCount;                  // is in between 0 and tenantList size 
            String requriedTenantId = tenantList[0];                                      // (excluding 0 & tenantList size)
            for(int idx =1; idx<cutIndex; idx++)
                requriedTenantId = requriedTenantId + "." + tenantList[idx];

            return requriedTenantId;
        }
        else if(tenantIdStripSuffixCount>=tenantList.length)                              // handled case if tenantIdStripSuffixCount
            return tenantList[0];                                                         // is greater than or equal to tenantList size  
        else                                                                            
            return tenantId;                                                              // handled case if tenantIdStripSuffixCount    
                                                                                          // is less than or equal to 0
        }
}
