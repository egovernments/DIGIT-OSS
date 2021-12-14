package org.egov.egovdocumentuploader.web.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DocumentEntity {

    @JsonProperty("uuid")
    private String uuid;

    @NotNull
    @JsonProperty("tenantIds")
    private List<String> tenantIds;

    @JsonProperty("name")
    private String name;

    @JsonProperty("category")
    private String category;

    @Size(max = 140)
    @JsonProperty("description")
    private String description;

    @JsonProperty("filestoreId")
    private String filestoreId;

    @JsonProperty("documentLink")
    private String documentLink;

    @JsonProperty("active")
    private Boolean active;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty
    private String postedBy;

    @JsonProperty("fileType")
    private String fileType;

    @JsonProperty("fileSize")
    private Long fileSize;

}