/*package org.egov.web.notification.mail.consumer.contract;

import org.egov.web.notification.mail.model.Email;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class EmailRequestTest {

    @Test
    public void to_domain_should_return_domain_object() throws Exception {
    	EmailRequest emailRequest = EmailRequest.builder()
				.email("email@gmail.com")
				.body("body")
				.subject("subject")
				.isHTML(true)
				.build();

        Email email = emailRequest.toDomain();

        assertThat(email.getToAddress()).isEqualTo("email@gmail.com");
        assertThat(email.getSubject()).isEqualTo("subject");
        assertThat(email.getBody()).isEqualTo("body");
        assertThat(email.isHtml()).isTrue();
    }
}*/