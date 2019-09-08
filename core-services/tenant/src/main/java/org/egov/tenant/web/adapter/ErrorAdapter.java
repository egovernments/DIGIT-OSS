package org.egov.tenant.web.adapter;


import org.egov.common.contract.response.ErrorResponse;

/**
 * This is to transform the model errors to web channel specific errors
 *
 * @param <T>
 */
public interface ErrorAdapter<T> {
    ErrorResponse adapt(T model);
}
