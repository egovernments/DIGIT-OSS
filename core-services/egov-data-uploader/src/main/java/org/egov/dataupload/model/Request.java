package org.egov.dataupload.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Request {

    @JsonProperty("url")
    private String url;

    @JsonProperty("apiRequest")
    private Object apiRequest;

    @JsonProperty("excelHeadersToRequestMap")
    private Map<String, List<String>> excelHeadersToRequestMap;

    @JsonProperty("prevResponseToRequestMap")
    private Map<String, List<String>> prevResponseToRequestMap;

    @JsonProperty("arrayPath")
    private String arrayPath;

    @JsonProperty("tenantIdPaths")
    private List<String> tenantIdPaths;

    @JsonProperty("templateFileName")
    private String templateFileName;

    @JsonProperty("additionalResFields")
    private Map<String, String> additionalResFields;
}
