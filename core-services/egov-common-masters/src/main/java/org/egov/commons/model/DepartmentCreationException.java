package org.egov.commons.model;

import lombok.Getter;

import java.io.IOException;

@Getter
public class DepartmentCreationException extends RuntimeException {
    public DepartmentCreationException(IOException ioe) {
        super(ioe);
    }
}
