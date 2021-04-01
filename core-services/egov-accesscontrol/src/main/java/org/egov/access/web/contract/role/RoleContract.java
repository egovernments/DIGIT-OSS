package org.egov.access.web.contract.role;

import lombok.*;
import org.egov.access.domain.model.Role;

import java.util.ArrayList;
import java.util.List;

@Getter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleContract {

	private String name;
	private String code;
	private String description;

	public List<RoleContract> getRoles(List<Role> roles) {
		List<RoleContract> roleContracts = new ArrayList<RoleContract>();
		for (Role role : roles) {
			RoleContract roleContract = RoleContract.builder().name(role.getName()).code(role.getCode())
					.description(role.getDescription()).build();
			roleContracts.add(roleContract);
		}

		return roleContracts;
	}

}
