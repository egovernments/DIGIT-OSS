package org.egov.user.web.adapters.errors;

import org.egov.common.contract.response.ErrorResponse;

public interface ErrorAdapter<T> {
    ErrorResponse adapt(T model);
}
