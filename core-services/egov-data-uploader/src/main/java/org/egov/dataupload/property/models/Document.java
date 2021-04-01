package org.egov.dataupload.property.models;

import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * This object holds list of documents attached during the transaciton for a property
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-11T14:12:44.497+05:30")

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of= {"fileStore","documentUid","id"})
public class Document   {

        @Size(max=64)
        @JsonProperty("id")
        private String id;

        @Size(max=64)
        @JsonProperty("documentType")
        private String documentType;

        @Size(max=64)
        @JsonProperty("fileStore")
        private String fileStore;

        @Size(max=64)
        @JsonProperty("documentUid")
        private String documentUid;

}

