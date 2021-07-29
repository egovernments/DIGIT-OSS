package org.egov.pgr.annotation;


import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = AdditionalDetailValidator.class)
@Target( {ElementType.METHOD,ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface CharacterConstraint {

    String message() default "Invalid Additional Details";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    int size();


}