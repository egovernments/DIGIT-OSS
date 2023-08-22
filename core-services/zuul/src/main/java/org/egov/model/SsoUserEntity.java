package org.egov.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.egov.model.eservicesso.ServiceInfo;
import org.egov.model.eservicesso.UserInfo;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class SsoUserEntity {

    @JsonProperty("service")
    private ServiceInfo service;

    @JsonProperty("user")
    private UserInfo user;

    @JsonProperty("iat")
    private long iat;

    @JsonProperty("exp")
    private long exp;

}
