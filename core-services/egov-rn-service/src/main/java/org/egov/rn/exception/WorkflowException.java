package org.egov.rn.exception;

public class WorkflowException extends RuntimeException {
    public WorkflowException(String message, Throwable cause) {super(message, cause);}

    public WorkflowException(String message) {
        super(message);
    }
}
