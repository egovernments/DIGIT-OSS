package org.egov.user.domain.exception;

public class PasswordMismatchException extends RuntimeException {
    private static final long serialVersionUID = -1167635504342863559L;
    public PasswordMismatchException(String message) {
        super(message);
    }
}
