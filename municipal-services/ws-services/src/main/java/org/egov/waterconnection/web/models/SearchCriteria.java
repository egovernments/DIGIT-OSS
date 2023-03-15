package org.egov.waterconnection.web.models;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchCriteria {

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("tenantIds")
	private Set<String> tenantIds;

	private Set<String> propertyIds;

	private Set<String> userIds;

	@JsonProperty("status")
	private String status;

	@JsonProperty("ids")
	private Set<String> ids;

	@JsonProperty("applicationNumber")
	private Set<String> applicationNumber;

	@JsonProperty("applicationStatus")
	private Set<String> applicationStatus;

	@JsonProperty("connectionNumber")
	private Set<String> connectionNumber;

	@JsonProperty("oldConnectionNumber")
	private String oldConnectionNumber;

	@JsonProperty("mobileNumber")
	private String mobileNumber;

	@JsonProperty("propertyId")
	private String propertyId;

	@JsonIgnore
	private String accountId;

	@JsonProperty("fromDate")
	private Long fromDate = null;

	@JsonProperty("toDate")
	private Long toDate = null;

	@JsonProperty("offset")
	private Integer offset;

	@JsonProperty("limit")
	private Integer limit;

	@JsonProperty("applicationType")
	private String applicationType;

	@JsonProperty("locality")
	private String locality;

	@JsonProperty("isPropertyDetailsRequired")
	private Boolean isPropertyDetailsRequired = false;

	@JsonProperty("searchType")
	private String searchType = "APPLICATION";

	@JsonIgnore
	private List<String> ownerIds;

	@JsonProperty("doorNo")
	private String doorNo;

	@JsonProperty("ownerName")
	private String ownerName;

	@JsonProperty("assignee")
	private String assignee;

	@JsonProperty("sortOrder")
	private SortOrder sortOrder;

	@JsonIgnore
	private Boolean isCountCall = false;

	@JsonProperty("isFilestoreIdRequire")
	private Boolean isFilestoreIdRequire = false;

	@Builder.Default
	@JsonProperty("isInternalCall")
	private Boolean	isInternalCall = false;

	@Builder.Default
	@JsonProperty("isSkipLevelSearch")
	private Boolean	isSkipLevelSearch = false;

	public enum SortOrder {
	    ASC,
	    DESC
	}

	public boolean isEmpty() {
		return (StringUtils.isEmpty(this.tenantId) && StringUtils.isEmpty(this.mobileNumber)
				&& StringUtils.isEmpty(this.propertyId) && CollectionUtils.isEmpty(this.ids)
				&& StringUtils.isEmpty(this.oldConnectionNumber) && StringUtils.isEmpty(this.connectionNumber)
				&& StringUtils.isEmpty(this.status) && StringUtils.isEmpty(this.applicationNumber)
				&& StringUtils.isEmpty(this.applicationStatus) && StringUtils.isEmpty(this.fromDate)
				&& StringUtils.isEmpty(this.toDate) && StringUtils.isEmpty(this.applicationType)
				&& StringUtils.isEmpty(this.doorNo) && StringUtils.isEmpty(this.ownerName)
				&& StringUtils.isEmpty(this.assignee));
	}

	public boolean tenantIdOnly() {
		return (this.tenantId != null && this.status == null && this.ids == null && this.applicationNumber == null
				&& this.connectionNumber == null && this.oldConnectionNumber == null && this.mobileNumber == null
				&& this.fromDate == null && this.toDate == null && this.ownerIds == null && this.propertyId == null
				&& this.applicationType == null && this.doorNo == null && this.ownerName == null
				&& this.assignee == null);
	}

}