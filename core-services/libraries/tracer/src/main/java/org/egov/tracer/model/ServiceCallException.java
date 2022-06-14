package org.egov.tracer.model;

import lombok.*;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCallException extends RuntimeException {
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private String error;
}
