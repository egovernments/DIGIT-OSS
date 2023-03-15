package org.egov.infra.microservice.contract;

import java.util.Collections;
import java.util.List;

import org.egov.infra.microservice.models.RequestInfo;
import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserSearchRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("id")
    private List<Long> id;

    @JsonProperty("uuid")
    private List<String> uuid;

    @JsonProperty("userName")
    @SafeHtml
    private String userName;

    @JsonProperty("name")
    @SafeHtml
    private String name;

    @JsonProperty("mobileNumber")
    @SafeHtml
    private String mobileNumber;

    @JsonProperty("aadhaarNumber")
    @SafeHtml
    private String aadhaarNumber;

    @JsonProperty("pan")
    @SafeHtml
    private String pan;

    @JsonProperty("emailId")
    @SafeHtml
    private String emailId;

    @JsonProperty("fuzzyLogic")
    private boolean fuzzyLogic;

    @JsonProperty("active")
    private Boolean active;

    @JsonProperty("tenantId")
    @SafeHtml
    private String tenantId;

    @JsonProperty("pageSize")
    private int pageSize;

    @JsonProperty("pageNumber")
    private int pageNumber = 0;

    @JsonProperty("sort")
    private List<String> sort = Collections.singletonList("name");

    @JsonProperty("userType")
    @SafeHtml
    private String userType;

    @JsonProperty("roleCodes")
    private List<String> roleCodes;

    public RequestInfo getRequestInfo() {
        return requestInfo;
    }

    public void setRequestInfo(final RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    public List<Long> getId() {
        return id;
    }

    public void setId(final List<Long> id) {
        this.id = id;
    }

    public List<String> getUuid() {
        return uuid;
    }

    public void setUuid(final List<String> uuid) {
        this.uuid = uuid;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(final String userName) {
        this.userName = userName;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(final String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(final String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getPan() {
        return pan;
    }

    public void setPan(final String pan) {
        this.pan = pan;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(final String emailId) {
        this.emailId = emailId;
    }

    public boolean isFuzzyLogic() {
        return fuzzyLogic;
    }

    public void setFuzzyLogic(final boolean fuzzyLogic) {
        this.fuzzyLogic = fuzzyLogic;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(final Boolean active) {
        this.active = active;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(final String tenantId) {
        this.tenantId = tenantId;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(final int pageSize) {
        this.pageSize = pageSize;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(final int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public List<String> getSort() {
        return sort;
    }

    public void setSort(final List<String> sort) {
        this.sort = sort;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(final String userType) {
        this.userType = userType;
    }

    public List<String> getRoleCodes() {
        return roleCodes;
    }

    public void setRoleCodes(final List<String> roleCodes) {
        this.roleCodes = roleCodes;
    }

}
