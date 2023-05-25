package org.egov.chat.models;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Response {

    private String type;

    private String nodeId;

    private Long timestamp;

    private List<LocalizationCode> localizationCodes;

    private String text;

    // OR

    private String fileStoreId;

    private JsonNode location;

    private JsonNode contactCard;
}
