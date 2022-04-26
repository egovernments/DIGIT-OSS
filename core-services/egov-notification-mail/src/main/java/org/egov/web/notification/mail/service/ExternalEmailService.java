package org.egov.web.notification.mail.service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
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
	private String filestore_host;

	@Value("${egov.filestore.workdir.path}")
	private String filestore_workdir;

	@Value("${egov.filestore.string.format}")
	private String filestore_format;

	@Value("${egov.filestore.tenant.id}")
	private String filestore_tenant_id;

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


			for(int i=0; i<email.getFileStoreId().size(); i++) {
				String uri = String.format(filestore_format, filestore_host, filestore_workdir, filestore_tenant_id, email.getFileStoreId().toArray()[i]);
				URL url = new URL(uri);
				log.info("filename",FilenameUtils.getName(url.getPath()));
				URLConnection con = url.openConnection();
				String fieldValue = "Application Form " + "[" + i + "]";
				File download = new File(System.getProperty("java.io.tmpdir"), fieldValue);
				ReadableByteChannel rbc = Channels.newChannel(con.getInputStream());
				FileOutputStream fos = new FileOutputStream(download);
				fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
				fos.close();
				helper.addAttachment(fieldValue, download);
			}

			mailSender.send(message);

		} catch (MessagingException | MalformedURLException e) {
			log.error(EXCEPTION_MESSAGE, e);
		} catch (IOException e) {
			log.info(EXCEPTION_MESSAGE, e);
		}catch (MailException e){
			log.error(EXCEPTION_MESSAGE, e);
		} finally {
//			try {
//				FileUtils.deleteDirectory(new File(System.getProperty("java.io.tmpdir")));
//			} catch (IOException e) {
//				log.info(EXCEPTION_MESSAGE, e);
//			}
		}
	}
}
