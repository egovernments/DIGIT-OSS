package org.egov.web.notification.mail.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.web.notification.mail.model.Email;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
@ConditionalOnProperty(value = "mail.enabled", havingValue = "true")
@Slf4j
public class ExternalEmailService implements EmailService {

	public static final String EXCEPTION_MESSAGE = "Exception creating HTML email";
	private JavaMailSenderImpl mailSender;

    public ExternalEmailService(JavaMailSenderImpl mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(Email email) {
		if(email.isHtml()) {
			sendHTMLEmail(email);
		} else {
			sendTextEmail(email);
		}
    }

	private void sendTextEmail(Email email) {
		final SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(email.getToAddress());
		mailMessage.setSubject(email.getSubject());
		mailMessage.setText(email.getBody());
		mailSender.send(mailMessage);
	}

	private void sendHTMLEmail(Email email) {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper;
		try {
			helper = new MimeMessageHelper(message, true);
			helper.setTo(email.getToAddress());
			helper.setSubject(email.getSubject());
			helper.setText(email.getBody(), true);
		} catch (MessagingException e) {
			log.error(EXCEPTION_MESSAGE, e);
			throw new RuntimeException(e);
		}
		mailSender.send(message);
	}
}
