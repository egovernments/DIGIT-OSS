package org.egov.persistence.repository;

import org.egov.persistence.contract.EmailMessage;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class OtpEmailRepository {
    private static final String PASSWORD_RESET_SUBJECT = "Password Reset";
    private static final String PASSWORD_RESET_BODY = "Your OTP for recovering password is %s.";
    private CustomKafkaTemplate<String, EmailMessage> kafkaTemplate;
    private String emailTopic;

    @Autowired
    public OtpEmailRepository(CustomKafkaTemplate<String, EmailMessage> kafkaTemplate,
							  @Value("${email.topic}") String emailTopic) {
        this.kafkaTemplate = kafkaTemplate;
        this.emailTopic = emailTopic;
    }

    public void send(String email, String otpNumber) {
    	if (isEmpty(email)) {
			return;
		}
		sendEmail(email, otpNumber);
    }

	private void sendEmail(String email, String otpNumber) {
		final EmailMessage emailMessage = EmailMessage.builder()
				.body(getBody(otpNumber))
				.subject(getSubject())
				.email(email)
				.sender(EMPTY)
				.build();
		kafkaTemplate.send(emailTopic, emailMessage);
	}

	private String getSubject() {
		return PASSWORD_RESET_SUBJECT;
	}

	private String getBody(String otpNumber) {
		return format(PASSWORD_RESET_BODY, otpNumber);
	}

}
