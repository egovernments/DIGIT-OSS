package org.egov.pgr.annotation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

public class AdditionalDetailValidator  implements ConstraintValidator<CharacterConstraint, Object> {


    private Integer size;


    @Override
    public void initialize(CharacterConstraint additionalDetails) {
        size = additionalDetails.size();
    }

    @Override
    public boolean isValid(Object additionalDetails, ConstraintValidatorContext cxt) {

        if(additionalDetails==null)
            return true;

        if(additionalDetails.toString().length() > size)
            return false;
        else
            return true;
    }

}
