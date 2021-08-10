package org.egov.egf.contract.model;

import java.io.Serializable;
import java.util.List;

import org.egov.infra.microservice.contract.Pagination;
import org.egov.infra.microservice.contract.ResponseInfo;

public class FunctionResponse implements Serializable {

    private static final long serialVersionUID = -4713676611587416407L;
    private ResponseInfo responseInfo;
    private List<Function> functions;
    private Pagination pagination;

    public FunctionResponse() {
    }

    public FunctionResponse(final ResponseInfo responseInfo, final List<Function> functions,
            final Pagination pagination) {
        this.responseInfo = responseInfo;
        this.functions = functions;
        this.pagination = pagination;
    }

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(final ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<Function> getFunctions() {
        return functions;
    }

    public void setFunctions(final List<Function> functions) {
        this.functions = functions;
    }

    public Pagination getPagination() {
        return pagination;
    }

    public void setPagination(final Pagination pagination) {
        this.pagination = pagination;
    }

}
