package org.egov.infra.microservice.contract;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserSearchResponse {

    @JsonProperty("responseInfo")
    ResponseInfo responseInfo;

    @JsonProperty("user")
    List<UserSearchResponseContent> userSearchResponseContent;

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<UserSearchResponseContent> getUserSearchResponseContent() {
        return userSearchResponseContent;
    }

    public void setUserSearchResponseContent(List<UserSearchResponseContent> userSearchResponseContent) {
        this.userSearchResponseContent = userSearchResponseContent;
    }

}
