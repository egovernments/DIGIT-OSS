package org.egov.access.domain.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Size;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Role {

	private Long id;

	@Size(max = 128)
	private String name;

	@Size(max = 128)
	private String description;

	@Size(max = 50)
	private String code;
	private Date createdDate;
	private Long createdBy;
	private Date lastModifiedDate;
	private Long lastModifiedBy;
}
