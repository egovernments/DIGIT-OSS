package org.egov.user.avm.developer.entity;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;
import org.egov.user.web.contract.UserRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class DeveloperInfo {

	private RequestInfo requestInfo;
	private DeveloperRegistration developerRegistration;
}
