package org.egov.user.domain.exception;

import lombok.Getter;
import org.egov.user.domain.model.UserSearchCriteria;

public class DuplicateUserNameException extends RuntimeException {

    private static final long serialVersionUID = -6903761146294214595L;
    @Getter
    private UserSearchCriteria userSearchCriteria;

    public DuplicateUserNameException(UserSearchCriteria userSearchCriteria) {
        this.userSearchCriteria = userSearchCriteria;
    }

}
