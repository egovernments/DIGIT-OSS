package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ErrorResponse {
    private ResponseInfo responseInfo;
    private Error error;

    @JsonIgnore
    public List<ErrorField> getErrorFields() {
        return error.getFields();
    }
}

