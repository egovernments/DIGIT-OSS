package org.egov.common.contract.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class RequestInfo {

    private String apiId;

    private String ver;

    private Long ts;

    private String action;

    private String did;

    private String key;

    private String msgId;

    private String authToken;

    private String correlationId;

    private List<String> plainRequestFields;

    private User userInfo;
}