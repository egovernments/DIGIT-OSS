package org.egov.nationaldashboardingest.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.HashMap;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Data {

    @NotNull
    @NotBlank
    @JsonProperty("date")
    private String date;

    @NotNull
    @NotBlank
    @JsonProperty("module")
    private String module;

    @NotNull
    @NotBlank
    @JsonProperty("ward")
    private String ward;

    @NotNull
    @NotBlank
    @JsonProperty("ulb")
    private String ulb;

    @NotNull
    @NotBlank
    @JsonProperty("region")
    private String region;

    @NotNull
    @NotBlank
    @JsonProperty("state")
    private String state;

    @NotNull
    @JsonProperty("metrics")
    private HashMap<String,Object> metrics;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

}
