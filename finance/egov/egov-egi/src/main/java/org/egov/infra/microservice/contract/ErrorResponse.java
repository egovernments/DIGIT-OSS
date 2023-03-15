package org.egov.infra.microservice.contract;

import java.io.Serializable;
import java.util.List;

public class ErrorResponse implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 2406705204682954355L;
    private ResponseInfo responseInfo;
    private List<Error> errors;

    public ErrorResponse() {
    }

    public ErrorResponse(final ResponseInfo responseInfo, final List<Error> errors) {
        this.responseInfo = responseInfo;
        this.errors = errors;
    }

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(final ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<Error> getErrors() {
        return errors;
    }

    public void setErrors(final List<Error> errors) {
        this.errors = errors;
    }

}
