package org.egov.web.notification.mail.service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.egov.web.notification.mail.config.ApplicationConfiguration;
import org.egov.web.notification.mail.consumer.contract.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;

@Service
@ConditionalOnProperty(value = "mail.enabled", havingValue = "true")
@Slf4j
public class ExternalEmailService implements EmailService {

	ApplicationConfiguration applicationConfiguration;

	@Value("${egov.filestore.host}")
	private String FILESTORE_HOST;

	@Value("${egov.filestore.workdir.path}")
	private String FILESTORE_WORKDIR;

	@Value("${egov.filestore.string.format}")
	private String FILESTORE_FORMAT;

	@Value("${egov.filestore.tenant.id}")
	private String FILESTORE_TENANT_ID;

	@Autowired
	private Environment env;

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
			/*log here*/
			log.info(email.toString());
			log.info(mailSender.getHost());
			log.info(mailSender.getProtocol());
			log.info(mailSender.getDefaultEncoding());
			log.info(mailSender.getUsername());
			log.info(String.valueOf(mailSender.getPort()));
			for(int i=0; i<email.getFileStoreId().size(); i++) {
				String uri = String.format(FILESTORE_FORMAT, FILESTORE_HOST,FILESTORE_WORKDIR, FILESTORE_TENANT_ID, email.getFileStoreId().toArray()[i]);
				URL url = new URL(uri);
				URLConnection con = url.openConnection();
				String fieldValue = "Application Form " + "[" + i + "]";
				File download = new File(System.getProperty("java.io.tmpdir"), fieldValue);
				ReadableByteChannel rbc = Channels.newChannel(con.getInputStream());
				FileOutputStream fos = new FileOutputStream(download);
				try {
					fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
				} finally {
					fos.close();
				}
				helper.addAttachment(fieldValue, download);
			}
			log.info("added attachments");

		} catch (MessagingException | MalformedURLException e) {
			log.error(EXCEPTION_MESSAGE, e);
			throw new RuntimeException(e);
		} catch (IOException e) {
			e.printStackTrace();
		}
		try{
			mailSender.send(message);
		} catch (MailException e){
			log.error(EXCEPTION_MESSAGE, e);
		}
	}
}
