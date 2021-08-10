package org.egov.infra.exception;

public class MicroServiceInvalidTokenException extends RuntimeException {

    private static final long serialVersionUID = -7104984341574667619L;
        
    public MicroServiceInvalidTokenException(){
        super();
    }
    
    public MicroServiceInvalidTokenException(String msg){
        super(msg);
    }
    
    public MicroServiceInvalidTokenException(String msg,Throwable throwable){
        super(msg,throwable);
    }
}
