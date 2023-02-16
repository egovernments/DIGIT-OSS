package digit.models.coremodels.user.exception;

import digit.models.coremodels.user.User;
import lombok.Getter;

public class InvalidUserUpdateException extends RuntimeException {

    private static final long serialVersionUID = 580361940613077431L;
    @Getter
    private User user;

    public InvalidUserUpdateException(User user) {
        this.user = user;
    }

}
