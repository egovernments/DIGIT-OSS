package org.egov.user.domain.model;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@AllArgsConstructor
@ToString
@EqualsAndHashCode(of = {"code", "tenantId"})
public class Role {
	private static final String CITIZEN = "CITIZEN";
    private String name;
    private String code;
    private String description;
    private Long createdBy;
    private Date createdDate;
    private Long lastModifiedBy;
    private Date lastModifiedDate;
    private String tenantId;

    public static Role getCitizenRole() {
    	return Role.builder().code(CITIZEN).build();
	}
}