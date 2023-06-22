package digit.service;

import digit.config.VTRConfiguration;
import digit.producer.Producer;
import digit.web.models.coremodels.SMSRequest;
import digit.web.models.VoterRegistrationApplication;
import digit.web.models.VoterRegistrationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class NotificationService {

    @Autowired
    private Producer producer;

    @Autowired
    private VTRConfiguration config;

    @Autowired
    private RestTemplate restTemplate;

    private static final String smsTemplate = "Dear {NAME}, your voter registration application has been successfully created on the system with application number - {APPNUMBER}.";

    public void prepareEventAndSend(VoterRegistrationRequest request){
        List<SMSRequest> smsRequestList = new ArrayList<>();
        request.getVoterRegistrationApplications().forEach(application -> {
            SMSRequest smsRequest = SMSRequest.builder().mobileNumber(application.getApplicant().getMobileNumber()).message(getCustomMessage(smsTemplate, application)).build();
            smsRequestList.add(smsRequest);
        });
        for (SMSRequest smsRequest : smsRequestList) {
            producer.push(config.getSmsNotificationTopic(), smsRequest);
            log.info("Messages: " + smsRequest.getMessage());
        }
    }

    private String getCustomMessage(String template, VoterRegistrationApplication application) {
        template = template.replace("{APPNUMBER}", application.getApplicationNumber());
        template = template.replace("{NAME}", application.getApplicant().getName());
        return template;
    }

}
