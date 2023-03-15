package org.egov.userevent.web.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Validated
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EventSearchCriteria {
	
	private List<String> ids;
	
	private List<String> userids;
	
	private List<String> roles;
	
	private List<String> postedBy;
	
	private List<String> name;
	
	private List<String> referenceIds;
	
	private List<String> source;

	private List<String> status;
	
	private List<String> eventTypes;

	@NotNull
	private String tenantId;
	
	private List<String> recepients;
	
	private Integer offset;
	
	private Integer limit;
	
	private Boolean isCitizenSearch;

	private Boolean isEventsCountCall = false;

	private Long fromDate;

	private Long toDate;
	
	public Boolean isEmpty(EventSearchCriteria eventSearchCriteria) {
		if(CollectionUtils.isEmpty(eventSearchCriteria.getIds()) && CollectionUtils.isEmpty(eventSearchCriteria.getPostedBy())
				&& CollectionUtils.isEmpty(eventSearchCriteria.getRecepients()) && CollectionUtils.isEmpty(eventSearchCriteria.getRoles())
				&& CollectionUtils.isEmpty(eventSearchCriteria.getStatus()) && CollectionUtils.isEmpty(eventSearchCriteria.getUserids())
				&& StringUtils.isEmpty(eventSearchCriteria.getTenantId())) {
			return true;
		}else
			return false;
	}

	
}
