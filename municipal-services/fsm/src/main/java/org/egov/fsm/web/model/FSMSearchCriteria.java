package org.egov.fsm.web.model;

import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FSMSearchCriteria {
    @JsonProperty("offset")
    private Integer offset;

    @JsonProperty("limit")
    private Integer limit;

    @SafeHtml
    @JsonProperty("tenantId")
    private String tenantId;

    @SafeHtml
    @JsonProperty("mobileNumber")
    private String mobileNumber; 
    
    @JsonProperty("applicationStatus")
    private List<String> applicationStatus;
    
    @JsonProperty("locality")
    private List<String> locality;
    
    
    @JsonProperty("ownerIds")
    private List<String> ownerIds;
    
    @JsonProperty("fromDate")
    private Long fromDate; 
    
    @JsonProperty("toDate")
    private Long toDate;
    
    @JsonProperty("applicationNos")
    private List<String> applicationNos;
    

    @JsonProperty("applicationType")
    private String applicationType;
    
    @JsonProperty("oldApplicationNos")
    private List<String> oldApplicationNos;
    
    @JsonProperty("ids")
    private List <String> ids;
    
    
    
    @JsonProperty("sortBy")
    private SortBy sortBy;
    
    @JsonProperty("sortOrder")
    private SortOrder sortOrder;
    
    public enum SortOrder {
        ASC,
        DESC
    }

    public enum SortBy {
        applicationStatus,
        applicationNumber,
        propertyUsage,
        vehicle,
        locality,
        createdTime
    }
    
    public boolean isEmpty() {
		// TODO Auto-generated method stub
		 return (this.tenantId == null && this.offset == null && this.limit == null && !StringUtils.hasText(this.mobileNumber)
				 && CollectionUtils.isEmpty(this.applicationStatus)  && CollectionUtils.isEmpty(this.ownerIds) && this.fromDate == null && this.toDate == null && CollectionUtils.isEmpty(this.applicationNos) && CollectionUtils.isEmpty(this.ids));
	}

	public boolean tenantIdOnly() {
		// TODO Auto-generated method stub
		return (this.tenantId != null && !StringUtils.hasText(this.mobileNumber)
                && CollectionUtils.isEmpty(this.applicationStatus) && CollectionUtils.isEmpty(this.ownerIds) && this.fromDate == null && this.toDate == null && CollectionUtils.isEmpty(this.applicationNos) && CollectionUtils.isEmpty(this.ids));
	} 
}
