package org.egov.rn.exception;

public class ProducerException extends RuntimeException {
    public ProducerException(String message, Throwable cause) {super(message, cause);}

    public ProducerException(String message) {
        super(message);
    }
}
