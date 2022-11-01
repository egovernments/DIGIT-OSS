package org.egov.user.avm.developer.dto;

import java.util.List;

import org.egov.user.avm.developer.entity.DeveloperRegistration;
import org.egov.user.avm.developer.entity.DirectorsInformation;
import org.egov.user.avm.developer.entity.FinancialCapacity;
import org.egov.user.avm.developer.entity.ShareholdingPattens;
import org.egov.user.domain.model.User;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserDeveloperDto {

	private User user;
	private DeveloperRegistration developerRegistration;
	
}
