package org.egov.user.web.controller;

import org.egov.common.contract.response.ErrorResponse;
import org.egov.user.domain.exception.AtleastOneRoleCodeException;
import org.egov.user.domain.exception.DuplicateUserNameException;
import org.egov.user.domain.exception.InvalidAccessTokenException;
import org.egov.user.domain.exception.InvalidLoggedInUserUpdatePasswordRequestException;
import org.egov.user.domain.exception.InvalidNonLoggedInUserUpdatePasswordRequestException;
import org.egov.user.domain.exception.InvalidOtpException;
import org.egov.user.domain.exception.InvalidRoleCodeException;
import org.egov.user.domain.exception.InvalidUpdatePasswordRequestException;
import org.egov.user.domain.exception.InvalidUserCreateException;
import org.egov.user.domain.exception.InvalidUserSearchCriteriaException;
import org.egov.user.domain.exception.InvalidUserUpdateException;
import org.egov.user.domain.exception.OtpValidationPendingException;
import org.egov.user.domain.exception.PasswordMismatchException;
import org.egov.user.domain.exception.UserDetailsException;
import org.egov.user.domain.exception.UserIdMandatoryException;
import org.egov.user.domain.exception.UserNameNotValidException;
import org.egov.user.domain.exception.UserNotFoundException;
import org.egov.user.domain.exception.UserProfileUpdateDeniedException;
import org.egov.user.web.adapters.errors.AtleastOneRoleCodeErrorHandler;
import org.egov.user.web.adapters.errors.DuplicateUserNameErrorHandler;
import org.egov.user.web.adapters.errors.InvalidAccessTokenErrorHandler;
import org.egov.user.web.adapters.errors.InvalidLoggedInUserUpdatePasswordRequestErrorHandler;
import org.egov.user.web.adapters.errors.InvalidNonLoggedInUserUpdatePasswordRequestErrorHandler;
import org.egov.user.web.adapters.errors.InvalidOtpErrorHandler;
import org.egov.user.web.adapters.errors.InvalidRoleCodeErrorHandler;
import org.egov.user.web.adapters.errors.InvalidUserSearchRequestErrorHandler;
import org.egov.user.web.adapters.errors.OtpValidationErrorAdapter;
import org.egov.user.web.adapters.errors.PasswordMissMatchErrorHandler;
import org.egov.user.web.adapters.errors.UserDetailsErrorHandler;
import org.egov.user.web.adapters.errors.UserIdMandatoryErrorHandler;
import org.egov.user.web.adapters.errors.UserInvalidUpdatePasswordRequest;
import org.egov.user.web.adapters.errors.UserNameNotValidErrorHandler;
import org.egov.user.web.adapters.errors.UserNotFoundErrorHandler;
import org.egov.user.web.adapters.errors.UserProfileUpdateDeniedErrorHandler;
import org.egov.user.web.adapters.errors.UserRequestErrorAdapter;
import org.egov.user.web.adapters.errors.UserUpdateErrorAdapter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

//@ControllerAdvice
//@RestController
//public class CustomControllerAdvice {
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(UserIdMandatoryException.class)
//	public ErrorResponse handleUserIdMandatoryException() {
//		return new UserIdMandatoryErrorHandler().adapt(null);
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(UserProfileUpdateDeniedException.class)
//	public ErrorResponse handleUserProfileUpdateDeniedException() {
//		return new UserProfileUpdateDeniedErrorHandler().adapt(null);
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidUserCreateException.class)
//	public ErrorResponse handleInvalidUserException(InvalidUserCreateException ex) {
//		return new UserRequestErrorAdapter().adapt(ex.getUser());
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidUserUpdateException.class)
//	public ErrorResponse handleInvalidUserUpdateException(InvalidUserUpdateException ex) {
//		return new UserUpdateErrorAdapter().adapt(ex.getUser());
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(DuplicateUserNameException.class)
//	public ErrorResponse handleDuplicateUserNameException(DuplicateUserNameException ex) {
//		return new DuplicateUserNameErrorHandler().adapt(ex.getUser());
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(OtpValidationPendingException.class)
//	public ErrorResponse handleInvalidComplaintException() {
//		return new OtpValidationErrorAdapter().adapt(null);
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(UserNotFoundException.class)
//	public ErrorResponse handleUserNotFoundException() {
//		return new UserNotFoundErrorHandler().adapt(null);
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidAccessTokenException.class)
//	public ErrorResponse accessTokenException() {
//		return new InvalidAccessTokenErrorHandler().adapt();
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidRoleCodeException.class)
//	public ErrorResponse handleInvalidRoleCodeException(InvalidRoleCodeException ex) {
//		return new InvalidRoleCodeErrorHandler().adapt(ex.getRoleCode());
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(AtleastOneRoleCodeException.class)
//	public ErrorResponse handleAtleastOneRoleCodeException(AtleastOneRoleCodeException ex) {
//		return new AtleastOneRoleCodeErrorHandler().adapt();
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(UserDetailsException.class)
//	public ErrorResponse userDetailsException() {
//		return new UserDetailsErrorHandler().adapt(null);
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(PasswordMismatchException.class)
//	public ErrorResponse handlePasswordMismatchException() {
//		return new PasswordMissMatchErrorHandler().adapt(null);
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidLoggedInUserUpdatePasswordRequestException.class)
//	public ErrorResponse handleInvalidUpdatePasswordRequestException(
//			InvalidLoggedInUserUpdatePasswordRequestException ex) {
//		return new InvalidLoggedInUserUpdatePasswordRequestErrorHandler().adapt(ex.getRequest());
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidNonLoggedInUserUpdatePasswordRequestException.class)
//	public ErrorResponse handleInvalidNonLoggedInUserUpdatePasswordRequestException(
//			InvalidNonLoggedInUserUpdatePasswordRequestException ex) {
//		return new InvalidNonLoggedInUserUpdatePasswordRequestErrorHandler().adapt(ex.getModel());
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidUserSearchCriteriaException.class)
//	public ErrorResponse handleInvalidNonLoggedInUserUpdatePasswordRequestException(
//			InvalidUserSearchCriteriaException ex) {
//		return new InvalidUserSearchRequestErrorHandler().adapt(ex.getSearchCriteria());
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidOtpException.class)
//	public ErrorResponse handleInvalidOtpException(InvalidOtpException ex) {
//		return new InvalidOtpErrorHandler().adapt(ex.getErrorMessage());
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(UserNameNotValidException.class)
//	public ErrorResponse handleUserNameIsNumericException() {
//		return new UserNameNotValidErrorHandler().adapt(null);
//	}
//
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
//	@ExceptionHandler(InvalidUpdatePasswordRequestException.class)
//	public ErrorResponse handleInvalidUpdatePasswordRequest() {
//		return new UserInvalidUpdatePasswordRequest().adapt(null);
//	}
//}
