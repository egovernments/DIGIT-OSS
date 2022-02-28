package org.egov.web.notification.sms.controller;

import org.apache.http.HttpResponse;
import org.egov.web.notification.sms.config.Producer;
import org.egov.web.notification.sms.models.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@Controller
@RequestMapping("/smsbounce")
public class CallblackAPI {


    @Autowired
    Producer producer;

    @Value("${kafka.topics.sms.bounce}")
    private String TOPIC;

    @PostMapping("/callback")
    public void postStatus(@RequestParam String jobno,
                          @RequestParam String mobilenumber,
                          @RequestParam int status,
                          @RequestParam String doneTime,
                          @RequestParam String message) {

        Report report = new Report();
        report.setJobno(jobno);
        report.setMobilenumber(mobilenumber);
        report.setMessagestatus(status);
        report.setDoneTime(doneTime);
        report.setMessage(message);

        producer.push(TOPIC, report);

    }

    @GetMapping("/callback")
    public void getStatus(@RequestParam String jobno,
                          @RequestParam String mobilenumber,
                          @RequestParam int status,
                          @RequestParam String doneTime,
                          @RequestParam String message) {

        Report report = new Report();
        report.setJobno(jobno);
        report.setMobilenumber(mobilenumber);
        report.setMessagestatus(status);
        report.setDoneTime(doneTime);
        report.setMessage(message);

        producer.push(TOPIC, report);

    }
}
