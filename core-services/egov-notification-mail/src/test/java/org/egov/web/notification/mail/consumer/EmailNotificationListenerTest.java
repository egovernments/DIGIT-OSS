/*package org.egov.web.notification.mail.consumer;

import org.egov.web.notification.mail.consumer.contract.EmailRequest;
import org.egov.web.notification.mail.model.Email;
import org.egov.web.notification.mail.service.EmailService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class EmailNotificationListenerTest {

	@Mock
	private EmailService emailService;

	@Test
	public void test_should_send_email() throws Exception {
		EmailNotificationListener emailNotificationListener = new EmailNotificationListener(emailService);
		EmailRequest emailRequest = EmailRequest.builder()
				.isHTML(true)
				.email("email")
				.subject("subject")
				.body("body")
				.build();

		emailNotificationListener.listen(emailRequest);

		final Email expectedEmail = Email.builder()
				.subject("subject")
				.body("body")
				.toAddress("email")
				.html(true)
				.build();
		verify(emailService).sendEmail(expectedEmail);
	}
}*/