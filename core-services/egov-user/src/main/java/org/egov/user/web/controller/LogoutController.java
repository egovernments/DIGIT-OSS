package org.egov.user.web.controller;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
public class LogoutController {

	private TokenStore tokenStore;

	public LogoutController(TokenStore tokenStore) {
		this.tokenStore = tokenStore;
	}

	/**
	 * End-point to logout the session.
	 * 
	 * @param accessToken
	 * @return
	 * @throws Exception
	 */
	@PostMapping("/_logout")
	public ResponseInfo deleteToken(@RequestParam("access_token") String accessToken) throws Exception {
		OAuth2AccessToken redisToken = tokenStore.readAccessToken(accessToken);
		tokenStore.removeAccessToken(redisToken);
		return new ResponseInfo("", "", new Date().toString(), "", "", "Logout successfully");
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleError(Exception ex) {
		ex.printStackTrace();
		ErrorResponse response = new ErrorResponse();
		ResponseInfo responseInfo = new ResponseInfo("", "", new Date().toString(), "", "", "Logout failed");
		response.setResponseInfo(responseInfo);
		Error error = new Error();
		error.setCode(400);
		error.setDescription("Logout failed");
		response.setError(error);
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}
}