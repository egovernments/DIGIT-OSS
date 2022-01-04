package org.egov.chat.models;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocalizationCode {

    private String code;

    private String tenantId;        // Optional. Defaults to state level tenantId

    // OR

    private String value;

    // OR

    private String templateId;

    private JsonNode params;

}
