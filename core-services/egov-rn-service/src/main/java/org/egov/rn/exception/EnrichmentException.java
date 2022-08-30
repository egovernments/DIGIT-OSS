package org.egov.rn.exception;

public class EnrichmentException extends RuntimeException {
    public EnrichmentException(String message, Throwable cause) {
        super(message, cause);
    }

    public EnrichmentException(String message) {
        super(message);
    }
}
