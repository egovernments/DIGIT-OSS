package org.egov.user.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.egov.common.contract.request.RequestInfo;
import org.egov.user.domain.model.UserSearchCriteria;
import org.egov.user.domain.model.enums.UserType;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
@ToString
public class UserSearchRequest {

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

	@JsonProperty("id")
	private List<Long> id;
	
	@JsonProperty("uuid")
	private List<String> uuid;

	@JsonProperty("userName")
	private String userName;

	@JsonProperty("name")
	private String name;

	@JsonProperty("mobileNumber")
	private String mobileNumber;

	@JsonProperty("aadhaarNumber")
	private String aadhaarNumber;

	@JsonProperty("pan")
	private String pan;

	@JsonProperty("emailId")
	private String emailId;

	@JsonProperty("fuzzyLogic")
	private boolean fuzzyLogic;

	@JsonProperty("active")
	@Setter
	private Boolean active;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("pageSize")
	private int pageSize;

	@JsonProperty("pageNumber")
	private int pageNumber = 0;

	@JsonProperty("sort")
	private List<String> sort = Collections.singletonList("name");

	@JsonProperty("userType")
	private String userType;

	@JsonProperty("roleCodes")
	private List<String> roleCodes;

	public UserSearchCriteria toDomain() {
		return UserSearchCriteria.builder()
				.id(id)
				.userName(userName)
				.name(name)
				.mobileNumber(mobileNumber)
//				.pan(pan)
				.emailId(emailId)
				.fuzzyLogic(fuzzyLogic)
				.active(active)
				.limit(pageSize)
				.offset(pageNumber)
				.sort(sort)
				.type(UserType.fromValue(userType))
				.tenantId(tenantId)
				.roleCodes(roleCodes)
				.uuid(uuid)
				.build();
	}
}
