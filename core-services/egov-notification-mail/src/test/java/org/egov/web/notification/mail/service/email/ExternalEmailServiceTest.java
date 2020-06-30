/*package org.egov.web.notification.mail.service.email;

import org.egov.web.notification.mail.model.Email;
import org.egov.web.notification.mail.service.ExternalEmailService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ExternalEmailServiceTest {

    @Mock
    private JavaMailSenderImpl javaMailSender;

    private ExternalEmailService externalEmailService;

    @Before
    public void before() {
		externalEmailService = new ExternalEmailService(javaMailSender);
    }

    @Test
    public void test_email_service_uses_mail_sender_to_send_text_email() {
        final String EMAIL_ADDRESS = "email@gmail.com";
        final String SUBJECT = "Subject";
        final String BODY = "body of the email";
        final Email email = Email.builder()
				.toAddress(EMAIL_ADDRESS)
				.body(BODY)
				.subject(SUBJECT)
				.html(false)
				.build();
        SimpleMailMessage expectedMailMessage = new SimpleMailMessage();
        expectedMailMessage.setTo(EMAIL_ADDRESS);
        expectedMailMessage.setSubject(SUBJECT);
        expectedMailMessage.setText(BODY);

        externalEmailService.sendEmail(email);

        verify(javaMailSender).send(expectedMailMessage);
    }

	@Test
	public void test_email_service_uses_mail_sender_to_send_html_email() throws MessagingException {
		final String EMAIL_ADDRESS = "email@gmail.com";
		final String SUBJECT = "Subject";
		final String BODY = "body of the email";
		final Email email = Email.builder()
				.toAddress(EMAIL_ADDRESS)
				.body(BODY)
				.subject(SUBJECT)
				.html(true)
				.build();
		final MimeMessage mimeMessage = mock(MimeMessage.class);
		when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);

		externalEmailService.sendEmail(email);

		verify(javaMailSender).send(mimeMessage);
	}
}*/