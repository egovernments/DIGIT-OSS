package org.egov.web.notification.mail.consumer.contract;

import org.springframework.kafka.support.serializer.JsonDeserializer;

public class EmailRequestDeserializer extends JsonDeserializer<EmailRequest> {
    public EmailRequestDeserializer() {
        super(EmailRequest.class);
    }
}
