package org.egov.access.web.contract.role;

import lombok.*;
import org.egov.access.domain.model.Role;

import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Getter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleContract {

	@Size(max = 32)
	private String name;
	@Size(max = 50)
	private String code;
	@Size(max = 128)
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
