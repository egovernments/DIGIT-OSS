package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.infra.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class GeneralRule extends FeatureProcess {
    public static final String MSG_ERROR_MANDATORY = "msg.error.mandatory.object.not.defined";
    @Autowired
    @Qualifier("parentMessageSource")
    protected MessageSource edcrMessageSource;
    // Dont use class variable like this .
    protected ScrutinyDetail scrutinyDetail = new ScrutinyDetail();
    public static final String STATUS = "Status";

    public static final String PROVIDED = "Provided";
    public static final String LEVEL = "Level";
    public static final String OCCUPANCY = "Occupancy";
    public static final String FIELDVERIFIED = "Field Verified";
    public static final String REQUIRED = "Required";
    public static final String PERMISSIBLE = "Permissible";
    public static final String DESCRIPTION = "Description";

    public static final String RULE_NO = "Byelaw";

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

    public MessageSource getEdcrMessageSource() {
        return edcrMessageSource;
    }

    public void setEdcrMessageSource(MessageSource edcrMessageSource) {
        this.edcrMessageSource = edcrMessageSource;
    }

    @Override
    public Plan validate(Plan pl) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Plan process(Plan pl) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }
}
