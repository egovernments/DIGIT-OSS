package org.egov.egovdocumentuploader.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DocumentCategory {

    @JsonProperty("category")
    private String category;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

}