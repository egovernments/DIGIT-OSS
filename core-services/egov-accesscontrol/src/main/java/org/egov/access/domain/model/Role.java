package org.egov.access.domain.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Role {

	private Long id;
	private String name;
	private String description;
	private String code;
	private Date createdDate;
	private Long createdBy;
	private Date lastModifiedDate;
	private Long lastModifiedBy;
}
