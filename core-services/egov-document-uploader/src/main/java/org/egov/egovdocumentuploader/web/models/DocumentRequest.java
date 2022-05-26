package org.egov.egovdocumentuploader.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.common.contract.request.RequestInfo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DocumentRequest {

    @JsonProperty("DocumentEntity")
    DocumentEntity documentEntity;

    @JsonProperty("RequestInfo")
    RequestInfo requestInfo;

}