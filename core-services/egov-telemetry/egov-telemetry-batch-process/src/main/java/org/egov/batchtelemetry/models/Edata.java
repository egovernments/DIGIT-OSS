package org.egov.batchtelemetry.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Edata {

    @JsonProperty("web-browser")
    private String webBrowser;

    private String platform;

    private String cityId;
}
