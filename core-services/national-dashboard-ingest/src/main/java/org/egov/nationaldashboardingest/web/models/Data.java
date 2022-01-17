package org.egov.nationaldashboardingest.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

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
    @JsonProperty("date")
    private String date;

    @NotNull
    @JsonProperty("module")
    private String module;

    @NotNull
    @JsonProperty("ward")
    private String ward;

    @NotNull
    @JsonProperty("ulb")
    private String ulb;

    @NotNull
    @JsonProperty("region")
    private String region;

    @NotNull
    @JsonProperty("state")
    private String state;

    @NotNull
    @JsonProperty("metrics")
    private HashMap<String,Object> metrics;

}
