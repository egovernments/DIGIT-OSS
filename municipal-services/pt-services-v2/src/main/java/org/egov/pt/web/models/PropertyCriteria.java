package org.egov.pt.web.models;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.egov.pt.web.models.PropertyDetail.StatusEnum;
import org.springframework.util.CollectionUtils;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyCriteria {

	private String tenantId;

	private Set<String> ids;

	private Set<String> oldpropertyids;

	private Set<String> propertyDetailids;

	private Set<String> addressids;

	private Set<String> unitids;

	private Set<String> documentids;

	private Set<String> ownerids;

	private String userName;

	private String mobileNumber;
	
	private StatusEnum propertyDetailStatus;

	private String name;

	private String doorNo;

	private String locality;

	private String accountId;

	private List<PropertyInfo.StatusEnum> statuses;
	
    @JsonProperty("offset")
    private Long offset;

    @JsonProperty("limit")
    private Long limit;





	public List<PropertyInfo.StatusEnum> getStatuses() {
		if(!CollectionUtils.isEmpty(this.statuses))
			return statuses;
        else return Collections.singletonList(PropertyInfo.StatusEnum.ACTIVE);
	}
}
