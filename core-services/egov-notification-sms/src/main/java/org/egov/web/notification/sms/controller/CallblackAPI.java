package org.egov.web.notification.sms.controller;

import org.egov.hash.HashService;
import org.egov.web.notification.sms.config.Producer;
import org.egov.web.notification.sms.models.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.constraints.NotNull;

@Service
@Controller
@RequestMapping("/smsbounce")
public class CallblackAPI {


    @Autowired
    Producer producer;

    @Autowired
    HashService hashService;

    @Value("${kafka.topics.sms.bounce}")
    private String TOPIC;

    // callback API smscountry uses to send the reports
    @GetMapping("/callback")
    public ResponseEntity getStatus(@NotNull @RequestParam String userId,
                                    @NotNull @RequestParam String jobno,
                                    @NotNull @RequestParam String mobilenumber,
                                    @NotNull @RequestParam int status,
                                    @NotNull @RequestParam String DoneTime,
                                    @NotNull @RequestParam String messagepart,
                                    @NotNull @RequestParam String sender_name) {

        Report report = new Report();
        report.setJobno(jobno);
        report.setMessagestatus(status);
        report.setDoneTime(DoneTime);
        report.setUsernameHash(hashService.getHashValue(mobilenumber));

        producer.push(TOPIC, report);
        return ResponseEntity.ok().build();
    }

}
