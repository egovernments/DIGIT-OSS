package org.egov.tracer.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.BindingResult;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CustomBindingResultExceprion extends RuntimeException {

    private static final long serialVersionUID = 4581677752337709974L;

    private BindingResult bindingResult;
}
