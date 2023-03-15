package org.egov.nationaldashboardingest.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AckEntity {

    @NotNull
    @NotBlank
    @JsonProperty("uuid")
    private String uuid;

    @NotNull
    @NotBlank
    @JsonProperty("datakey")
    private String datakey;

}
