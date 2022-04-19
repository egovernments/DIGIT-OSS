package org.egov.web.notification.mail.service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.egov.web.notification.mail.consumer.contract.Email;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

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
		if(email.isHTML()) {
			sendHTMLEmail(email);
		} else {
			sendTextEmail(email);
		}
    }

	private void sendTextEmail(Email email) {
		try {
			log.info(email.toString());
			log.info(mailSender.getHost());
			log.info(mailSender.getProtocol());
			log.info(mailSender.getDefaultEncoding());
			log.info(mailSender.getUsername());
			log.info(String.valueOf(mailSender.getPort()));
			final SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setTo(email.getEmailTo().toArray(new String[0]));
			mailMessage.setSubject(email.getSubject());
			mailMessage.setText(email.getBody());
			mailSender.send(mailMessage);
		} catch (MailException e){
			log.info(EXCEPTION_MESSAGE, e);
			throw new RuntimeException(e);
		}
	}

	private void sendHTMLEmail(Email email) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper;
			try {
				helper = new MimeMessageHelper(message, true);
				helper.setTo(email.getEmailTo().toArray(new String[0]));
				helper.setSubject(email.getSubject());
				helper.setText(email.getBody(), true);
			} catch (MessagingException e) {
				log.error(EXCEPTION_MESSAGE, e);
				throw new RuntimeException(e);
			}
			mailSender.send(message);
		} catch (MailException e) {
			log.info(EXCEPTION_MESSAGE, e);
			throw new RuntimeException(e);
		}
	}
}
