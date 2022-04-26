package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.egov.common.entity.edcr.Plan;
import org.egov.infra.utils.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class GeneralRule extends FeatureProcess {
    public static final String MSG_ERROR_MANDATORY = "msg.error.mandatory.object.not.defined";
    
 
    public static final String STATUS = "Status";

    public static final String PROVIDED = "Provided";
    public static final String LEVEL = "Level";
    public static final String OCCUPANCY = "Occupancy";
    public static final String FIELDVERIFIED = "Field Verified";
    public static final String REQUIRED = "Required";
    public static final String PERMISSIBLE = "Permissible";
    public static final String DESCRIPTION = "Description";

    public static final String RULE_NO = "Byelaw";

    @Override
    public String getLocaleMessage(String code, String... args) {
        return edcrMessageSource.getMessage(code, args, LocaleContextHolder.getLocale());

    }

    /**
     * @param strValue
     * @param pl
     * @param fieldName
     * @return
     */
    public BigDecimal getNumericValue(String strValue, Plan pl, String fieldName) {

        try {
            if (!StringUtils.isEmpty(strValue))
                return BigDecimal.valueOf(Double.parseDouble(strValue));
        } catch (NumberFormatException e) {
            pl.addError(fieldName, "The value for " + fieldName + " '" + strValue + "' Is Invalid");
        }
        return null;
    }

    public String prepareMessage(String code, String... args) {
        return edcrMessageSource.getMessage(code, args, LocaleContextHolder.getLocale());

    }

    @Override
    public MessageSource getEdcrMessageSource() {
        return edcrMessageSource;
    }

    @Override
    public void setEdcrMessageSource(MessageSource edcrMessageSource) {
        this.edcrMessageSource = edcrMessageSource;
    }

    @Override
    public Plan validate(Plan pl) {
        return null;
    }

    @Override
    public Plan process(Plan pl) {
        return null;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
