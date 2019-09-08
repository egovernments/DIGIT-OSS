package org.egov.user.web.controller;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.user.domain.service.UserService;
import org.egov.user.web.contract.LoggedInUserUpdatePasswordRequest;
import org.egov.user.web.contract.NonLoggedInUserUpdatePasswordRequest;
import org.egov.user.web.contract.UpdatePasswordResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("password")
public class PasswordController {

	private UserService userService;

	public PasswordController(UserService userService) {
		this.userService = userService;
	}

	/**
	 * end-point to update the password for loggedInUser
	 * 
	 * @param request
	 * @return
	 */
	@PostMapping("/_update")
	public UpdatePasswordResponse updatePassword(@RequestBody LoggedInUserUpdatePasswordRequest request) {
		userService.updatePasswordForLoggedInUser(request.toDomain());
		return new UpdatePasswordResponse(ResponseInfo.builder().status(String.valueOf(HttpStatus.OK.value())).build());
	}

	/**
	 * end-point to update the password for non logged in user
	 * 
	 * @param request
	 * @return
	 */
	@PostMapping("/nologin/_update")
	public UpdatePasswordResponse updatePasswordForNonLoggedInUser(@RequestBody NonLoggedInUserUpdatePasswordRequest request) {
		userService.updatePasswordForNonLoggedInUser(request.toDomain());
		return new UpdatePasswordResponse(ResponseInfo.builder().status(String.valueOf(HttpStatus.OK.value())).build());
	}
}
