package org.egov.web.notification.mail.consumer.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.web.notification.mail.model.Email;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class EmailRequest {
    private String email;
    private String subject;
    private String body;
    @JsonProperty("isHTML")
    private boolean isHTML;

    public Email toDomain() {
        return Email.builder()
				.toAddress(email)
				.subject(subject)
				.body(body)
				.html(isHTML)
				.build();
    }
}
