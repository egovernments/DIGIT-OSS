package com.tarento.analytics.helper;

import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ComputedFieldFactory {

    @Autowired
    private PercentageComputedField percentageComputedField;
    @Autowired
    private AverageComputedField averageComputedField;
    @Autowired
    private AdditiveComputedField additiveComputedField;

    public IComputedField getInstance(String className){

        if(className.equalsIgnoreCase(percentageComputedField.getClass().getSimpleName())){
            return percentageComputedField;

        } else if(className.equalsIgnoreCase(averageComputedField.getClass().getSimpleName())) {
            return averageComputedField;

        } else if(className.equalsIgnoreCase(additiveComputedField.getClass().getSimpleName())) {
            return additiveComputedField;

        } else {
            throw new CustomException("COMPUTEDFIELD_NOT_FOUND","Computer field not found for className "+className);
        }

    }

}
