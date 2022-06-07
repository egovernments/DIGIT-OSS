package org.egov.encryption.models;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;
import org.egov.common.contract.request.PlainAccessRequest;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuditObject {

    private String id;

    private String userId;

    private Long timestamp;

    private String purpose;

    private String model;

    private List<String> entityIds;

    private PlainAccessRequest plainAccessRequest;

    private JsonNode additionalInfo;

}
