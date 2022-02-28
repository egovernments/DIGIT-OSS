package org.egov.web.notification.sms.controller;

import org.egov.web.notification.sms.config.Producer;
import org.egov.web.notification.sms.models.Report;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import static org.junit.jupiter.api.Assertions.*;

class CallblackAPITest {

    @Autowired
    Producer producer;

    @Value("${kafka.topics.sms.bounce}")
    private String TOPIC;

    @Test
    void postStatus() {
        Report report = new Report();
        report.setJobno("1234");
        report.setMobilenumber("9718157753");
        report.setDoneTime("justnow");
        report.setMessagestatus(2);
        report.setMessage("hello");

        producer.push(TOPIC, report);

    }

    @Test
    void getStatus() {
    }
}