package org.egov.boundary.web.contract;

import java.util.Date;

import org.egov.boundary.domain.model.Boundary;
import org.egov.boundary.web.contract.BoundaryType;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Size;

@Getter
@Setter
public class CrossHierarchy {

	private Long id;
	private Boundary parent;
	@Size(max = 100)
	private String code;
	private Boundary child;
	@JsonProperty(access = Access.WRITE_ONLY)
	private BoundaryType parentType;
	@JsonProperty(access = Access.WRITE_ONLY)
	private BoundaryType childType;
	@Size(max = 256)
	private String tenantId;
	private Long createdBy;
	private Date createdDate;
	private Long lastModifiedBy;
	private Date lastModifiedDate;
}
