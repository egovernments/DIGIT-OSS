package org.egov.web.notification.sms.controller;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.egov.web.notification.sms.config.Producer;
import org.egov.web.notification.sms.models.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Service
@Controller
@RequestMapping("/smsbounce")
public class CallblackAPI {


    @Autowired
    Producer producer;

    @Value("${kafka.topics.sms.bounce}")
    private String TOPIC;

    @PostMapping("/callback")
    public ResponseEntity postStatus(@RequestParam String userId,
                                     @RequestParam String jobno,
                                     @RequestParam String mobilenumber,
                                     @RequestParam int status,
                                     @RequestParam String DoneTime,
                                     @RequestParam String messagepart,
                                     @RequestParam String sender_name) {

        Report report = new Report();
        report.setJobno(jobno);
        report.setMessagestatus(status);
        report.setDoneTime(DoneTime);
        report.setUsernameHash(toHash(mobilenumber));

        producer.push(TOPIC, report);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/callback")
    public ResponseEntity getStatus(@RequestParam String userId,
                                    @RequestParam String jobno,
                                    @RequestParam String mobilenumber,
                                    @RequestParam int status,
                                    @RequestParam String DoneTime,
                                    @RequestParam String messagepart,
                                    @RequestParam String sender_name) {

        Report report = new Report();
        report.setJobno(jobno);
        report.setMessagestatus(status);
        report.setDoneTime(DoneTime);
        report.setUsernameHash(toHash(mobilenumber));

        producer.push(TOPIC, report);
        return ResponseEntity.ok().build();
    }

    private String toHash(String mobileno) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(mobileno.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashtext = no.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }

            return hashtext;
        } catch(NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
