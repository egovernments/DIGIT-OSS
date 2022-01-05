package org.egov.web.notification.mail.service;

import org.egov.web.notification.mail.EgovNotificationMailApplication;
import org.egov.web.notification.mail.consumer.contract.Email;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest(
        classes = EgovNotificationMailApplication.class)
@TestPropertySource(
        locations = "classpath:application.properties")
public class ExternalEmailServiceTest {
    @Autowired
    EmailService emailService;

    @Test
    void sendEmail() {
        Set<String> email_list = new HashSet<String>();
        email_list.add("pranithgoud619@gmail.com");
        Email email = new Email();
        email.setEmailTo(email_list);
        email.setBody("this is body");
        email.setSubject("this is subject");
        email.setFileStoreId("f44b709d-1256-41d8-aaf4-63fcbfc34e74");
        email.setTenantId("pb");
        email.setHTML(true);
        emailService.sendEmail(email);
    }
}