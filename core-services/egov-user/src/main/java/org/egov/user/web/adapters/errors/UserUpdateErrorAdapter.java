package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.user.domain.model.User;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class UserUpdateErrorAdapter implements ErrorAdapter<User> {

	private static final String INVALID_USER_OBJECT = "Invalid user object";

	private static final String INVALID_PERMANENT_ADDRESS_CODE = "core-user.PERMANENT_ADDRESS_INVALID";
	private static final String PERMANENT_ADDRESS_FIELD = "user.permanentAddress";
	private static final String INVALID_PERMANENT_ADDRESS_MESSAGE =
			"City max length (300), Address max length (300), PinCode max length(10)";

	private static final String INVALID_CORRESPONDENCE_ADDRESS_CODE = "core-user.CORRESPONDENCE_ADDRESS_INVALID";
	private static final String CORRESPONDENCE_ADDRESS_FIELD = "user.correspondenceAddress";
	private static final String INVALID_CORRESPONDENCE_ADDRESS_MESSAGE =
			"City max length (300), Address max length (300), PinCode max length(10)";

	private static final String TENANT_MISSING_CODE = "core-user.TENANT_MANDATORY";
	private static final String TENANT_FIELD = "tenantId";
	private static final String TENANT_MISSING_MESSAGE = "Tenant is required";

	public ErrorResponse adapt(User user) {
		final Error error = getError(user);
		return new ErrorResponse(null, error);
	}

	private Error getError(User user) {
		List<ErrorField> errorFields = getErrorFields(user);
		return Error.builder()
				.code(HttpStatus.BAD_REQUEST.value())
				.message(INVALID_USER_OBJECT)
				.fields(errorFields)
				.build();
	}

	private List<ErrorField> getErrorFields(User user) {
		List<ErrorField> errorFields = new ArrayList<>();
		addCorrespondenceAddressError(user, errorFields);
		addPermanentAddressError(user, errorFields);
		addTenantMandatoryError(user, errorFields);
		return errorFields;
	}

	private void addTenantMandatoryError(User user, List<ErrorField> errorFields) {
		if (user.isTenantIdAbsent()) {
			errorFields.add(ErrorField.builder()
					.code(TENANT_MISSING_CODE)
					.field(TENANT_FIELD)
					.message(TENANT_MISSING_MESSAGE)
					.build());
		}
	}

	private void addPermanentAddressError(User user, List<ErrorField> errorFields) {
		if (user.isPermanentAddressInvalid()) {
			errorFields.add(ErrorField.builder()
					.code(INVALID_PERMANENT_ADDRESS_CODE)
					.field(PERMANENT_ADDRESS_FIELD)
					.message(INVALID_PERMANENT_ADDRESS_MESSAGE)
					.build());
		}
	}

	private void addCorrespondenceAddressError(User user, List<ErrorField> errorFields) {
		if (user.isCorrespondenceAddressInvalid()) {
			errorFields.add(ErrorField.builder()
					.code(INVALID_CORRESPONDENCE_ADDRESS_CODE)
					.field(CORRESPONDENCE_ADDRESS_FIELD)
					.message(INVALID_CORRESPONDENCE_ADDRESS_MESSAGE)
					.build());
		}
	}

}

