package org.egov.infra.exception;

public class MicroServiceNotAuthroizedException extends RuntimeException {

    public MicroServiceNotAuthroizedException() {
        super();
    }

    public MicroServiceNotAuthroizedException(String msg) {
        super(msg);
    }

    public MicroServiceNotAuthroizedException(String msg,Throwable throwable) {
        super(msg,throwable);
    }

}
