package org.egov.edcr.feature;

import java.math.BigDecimal;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.entity.edcr.Plan;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public abstract class FeatureExtract {
    public abstract PlanDetail extract(PlanDetail pl);

    public abstract PlanDetail validate(PlanDetail pl);

    @Autowired
    @Qualifier("parentMessageSource")
    protected MessageSource edcrMessageSource;

    public MessageSource getEdcrMessageSource() {
        return edcrMessageSource;
    }

    public void setEdcrMessageSource(MessageSource edcrMessageSource) {
        this.edcrMessageSource = edcrMessageSource;
    }

    public String getLocaleMessage(String code, String... args) {
        return edcrMessageSource.getMessage(code, args, LocaleContextHolder.getLocale());

    }

    public BigDecimal getNumericValue(String strValue, Plan pl, String fieldName) {

        try {
            if (!StringUtils.isEmpty(strValue))
                return BigDecimal.valueOf(Double.parseDouble(strValue));
        } catch (NumberFormatException e) {
            pl.addError(fieldName, "The value for " + fieldName + " '" + strValue + "' Is Invalid");
        }
        return null;
    }

}
