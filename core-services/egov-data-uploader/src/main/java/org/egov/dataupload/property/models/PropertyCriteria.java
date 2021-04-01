package org.egov.dataupload.property.models;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

	private String name;

	private String doorNo;

	private String locality;

	private String accountId;


}
