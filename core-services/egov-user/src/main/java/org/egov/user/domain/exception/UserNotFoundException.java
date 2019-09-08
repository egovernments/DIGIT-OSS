package org.egov.user.domain.exception;

import lombok.Getter;
import org.egov.user.domain.model.UserSearchCriteria;

@Getter
public class UserNotFoundException extends RuntimeException {

    private static final long serialVersionUID = -761312648494992125L;
    private UserSearchCriteria userSearchCriteria;

    public UserNotFoundException(final UserSearchCriteria userSearchCriteria) {
        super("User not found for given criteria: "+userSearchCriteria.toString());
        this.userSearchCriteria = userSearchCriteria;
    }



}

