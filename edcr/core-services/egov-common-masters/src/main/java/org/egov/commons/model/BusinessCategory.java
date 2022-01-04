package org.egov.commons.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.egov.common.contract.request.User;

@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
@EqualsAndHashCode
public class BusinessCategory {

	@NotNull
	private Long id;

	@NotNull
	private String name;

	@NotNull
	private String code;

	@NotNull
	private Boolean isactive;

	@NotNull
	private String tenantId;

	@NotNull
	private Long createdBy;

	private Long createdDate;

	@NotNull
	private Long lastModifiedBy;

	private Long lastModifiedDate;

	public BusinessCategory(org.egov.commons.web.contract.BusinessCategory category,User user) {

		id = category.getId();
		name = category.getName();
		code = category.getCode();
		isactive = category.getActive();
		tenantId = category.getTenantId();
		createdBy = user.getId();
        lastModifiedBy = user.getId();

	}


    public org.egov.commons.web.contract.BusinessCategory toDomain() {
		return org.egov.commons.web.contract.BusinessCategory.builder().id(id).name(name).code(code).active(isactive)
				.tenantId(tenantId).build();

	}

    public List<BusinessCategory> getDomainList(List<org.egov.commons.web.contract.BusinessCategory> categoryContractList,User user) {
        return categoryContractList.stream().map(businessCategory -> new BusinessCategory(businessCategory,user))
                .collect(Collectors.toList());
    }

}
