package org.egov.web.notification.mail.service;

import javax.activation.DataSource;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import lombok.Value;
import org.egov.web.notification.mail.config.ApplicationConfiguration;
import org.egov.web.notification.mail.consumer.contract.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

@Service
@ConditionalOnProperty(value = "mail.enabled", havingValue = "true")
@Slf4j
public class ExternalEmailService implements EmailService {

	ApplicationConfiguration applicationConfiguration;

	@Autowired
	private Environment env;

	public static final String EXCEPTION_MESSAGE = "Exception creating HTML email";
	private JavaMailSenderImpl mailSender;

    public ExternalEmailService(JavaMailSenderImpl mailSender, ApplicationConfiguration applicationConfiguration) {
        this.mailSender = mailSender;
		this.applicationConfiguration = applicationConfiguration;
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
		final SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(email.getEmailTo().toArray(new String[0]));
		mailMessage.setSubject(email.getSubject());
		mailMessage.setText(email.getBody());
		mailSender.send(mailMessage);
	}

	private void sendHTMLEmail(Email email) {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper;
		try {
			helper = new MimeMessageHelper(message, true);
			helper.setTo(email.getEmailTo().toArray(new String[0]));
			helper.setSubject(email.getSubject());
			helper.setText(email.getBody(), true);

			String tenantId = applicationConfiguration.getStateTenantId();
			String localhost = env.getProperty("egov.fileStore.host");
//			Need to fill uri
			String uri = String.format("%s/v1/files/id?%s&%s",localhost, email.getFileStoreId(), tenantId);
//			RestTemplate restTemplate = new RestTemplate();
			InputStream inputStream = new URL(uri).openStream();
			DataSource file = (DataSource) inputStream;
			helper.addAttachment(file.getName(), file);

		} catch (MessagingException | MalformedURLException e) {
			log.error(EXCEPTION_MESSAGE, e);
			throw new RuntimeException(e);
		} catch (IOException e) {
			e.printStackTrace();
		}
		mailSender.send(message);
	}
}
