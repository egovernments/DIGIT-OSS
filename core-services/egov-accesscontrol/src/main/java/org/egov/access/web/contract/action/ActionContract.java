package org.egov.access.web.contract.action;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.egov.access.domain.model.Action;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionContract {

	private Long id;
	private String name;
	private String url;
	private String queryParams;
	private String parentModule;
	private String displayName;
	private boolean enabled;
	private Integer orderNumber;
	private String serviceCode;

	@JsonFormat(pattern = "dd/MM/yyyy")
	private Date createdDate;

	private Long createdBy;

	private Date lastModifiedDate;

	private Long lastModifiedBy;

	public List<ActionContract> getActions(List<Action> actions) {
		List<ActionContract> actionsContractList = new ArrayList<ActionContract>();
		for (Action action : actions) {
			ActionContract actionContract = ActionContract.builder().name(action.getName()).id(action.getId())
					.createdBy(action.getCreatedBy()).createdDate(action.getCreatedDate())
					.lastModifiedBy(action.getLastModifiedBy()).lastModifiedDate(action.getLastModifiedDate())
					.url(action.getUrl()).queryParams(action.getQueryParams()).orderNumber(action.getOrderNumber())
					.parentModule(action.getParentModule()).serviceCode(action.getServiceCode())
					.displayName(action.getDisplayName()).enabled(action.isEnabled()).build();
			actionsContractList.add(actionContract);
		}

		return actionsContractList;
	}

}
