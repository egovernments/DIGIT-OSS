package org.egov.access.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Action {

	private Long id;
	private String name;
	private String url;
	private String displayName;
	private Integer orderNumber;
	private String queryParams;
	private String parentModule;
	private boolean enabled;
	private String serviceCode;
	private String tenantId;

	private Date createdDate;

	private Long createdBy;

	private Date lastModifiedDate;

	private Long lastModifiedBy;

	private String path;
	
	private String navigationURL;
	private String leftIcon;
	private String rightIcon;

}
