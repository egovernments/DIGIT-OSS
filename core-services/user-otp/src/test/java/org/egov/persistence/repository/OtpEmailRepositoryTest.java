package org.egov.persistence.repository;

import org.egov.persistence.contract.EmailMessage;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class OtpEmailRepositoryTest {

	private static final String EMAIL_TOPIC = "email.topic";
	@Mock
	private CustomKafkaTemplate<String, EmailMessage> kakfaTemplate;
	private OtpEmailRepository repository;

	@Before
	public void before() {
		repository = new OtpEmailRepository(kakfaTemplate, EMAIL_TOPIC);
	}

	@Test
	public void test_should_not_send_email_when_email_address_is_not_present() {
		repository.send(null, "otpNumber");

		verify(kakfaTemplate, never()).send(any(), any());
	}

	@Test
	public void test_should_send_email_message() {
		final EmailMessage expectedEmailMessage = EmailMessage.builder()
				.subject("Password Reset")
				.body("Your OTP for recovering password is otpNumber.")
				.sender("")
				.email("foo@bar.com")
				.build();

		repository.send("foo@bar.com", "otpNumber");

		verify(kakfaTemplate).send(EMAIL_TOPIC, expectedEmailMessage);
	}

}