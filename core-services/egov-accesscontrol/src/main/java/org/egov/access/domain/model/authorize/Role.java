package org.egov.access.domain.model.authorize;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = {"code", "tenantId"})
public class Role {
    @JsonProperty("id")
    private Long id;

    @Size(max = 32)
    @JsonProperty("name")
    private String name;

    @Size(max = 50)
    @JsonProperty("code")
    private String code;

    @Size(max = 50)
    @JsonProperty("tenantId")
    private String tenantId;

}
