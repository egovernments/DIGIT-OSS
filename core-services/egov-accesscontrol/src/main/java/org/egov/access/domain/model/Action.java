package org.egov.access.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Size;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Action {

	private Long id;

	@Size(max = 100)
	private String name;

	@Size(max = 100)
	private String url;

	@Size(max = 100)
	private String displayName;
	private Integer orderNumber;

	@Size(max = 100)
	private String queryParams;

	@Size(max = 50)
	private String parentModule;
	private boolean enabled;

	@Size(max = 50)
	private String serviceCode;

	@Size(max = 50)
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
