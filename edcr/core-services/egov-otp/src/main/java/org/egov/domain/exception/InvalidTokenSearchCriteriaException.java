package org.egov.domain.exception;

import lombok.Getter;
import org.egov.domain.model.TokenSearchCriteria;

public class InvalidTokenSearchCriteriaException extends RuntimeException {

    private static final long serialVersionUID = 3634242817213671136L;
    @Getter
    private TokenSearchCriteria tokenSearchCriteria;

    public InvalidTokenSearchCriteriaException(TokenSearchCriteria tokenSearchCriteria) {
        this.tokenSearchCriteria = tokenSearchCriteria;
    }
}
