package org.egov.edcr.service;

import java.lang.reflect.Field;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;
import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.egov.edcr.contract.EdcrRequest;
import org.egov.infra.utils.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.springframework.stereotype.Service;

/**
 * @author vinoth
 *
 */
@Service
public class EdcrValidator {
    private static Logger LOG = Logger.getLogger(EdcrValidator.class);
    private static final String INVALID_VAL = "The %s value is invalid";
    private static final String ALPHANUMERIC_WITH_SPECIAL_CHARS = "^([a-zA-Z0-9]+([ _\\-&:,/.()])?[a-zA-Z0-9])+$";
    private static final String INVALID_CHAR_MSG = "_\\-&:,/.()";
    private static final String INVALID_CHAR = "The %s contains some invalid  special characters. Only following are allowed %s";

    public ErrorDetail validate(final EdcrRequest edcr) {
        if (edcr != null) {
            ErrorDetail error = new ErrorDetail();
            Field[] edcrFields = edcr.getClass().getDeclaredFields();
            ErrorDetail e1 = validateAttributes(edcr, edcrFields, error);
            if(e1 != null)
                return error;
            Field[] reqInfoFields = edcr.getRequestInfo().getClass().getDeclaredFields();
            ErrorDetail e2 = validateAttributes(edcr.getRequestInfo(), reqInfoFields, error);
            if(e2 != null)
                return error;
            Field[] userInfoFields = edcr.getRequestInfo().getUserInfo().getClass().getDeclaredFields();
            ErrorDetail e3 = validateAttributes(edcr.getRequestInfo().getUserInfo(), userInfoFields, error);
            if(e3 != null)
                return error;
        }
        return null;
    }

    private ErrorDetail validateAttributes(final Object obj, Field[] edcrFields, ErrorDetail error) {
        for (Field f : edcrFields) {
            if (f.getType().isAssignableFrom(String.class)) {
                f.setAccessible(true);
                String value;
                try {
                    value = (String) f.get(obj);
                    boolean isValid = Jsoup.isValid(String.valueOf(value), Whitelist.basic());
                    if (!isValid) {
                        error.setErrorCode("EDCR-30");
                        error.setErrorMessage(String.format(INVALID_VAL, f.getName()));
                        return error;
                    }
                    if (StringUtils.isNotBlank(value)) {
                        boolean isAllow = Pattern.matches(ALPHANUMERIC_WITH_SPECIAL_CHARS, value);
                        if (!isAllow) {
                            error.setErrorCode("EDCR-31");
                            error.setErrorMessage(String.format(INVALID_CHAR, f.getName(), INVALID_CHAR_MSG));
                            return error;
                        }
                        
                        if (value.length() > 256) {
                            error.setErrorCode("EDCR-32");
                            error.setErrorMessage(String.format(INVALID_CHAR, f.getName(), "Upto 256 characters only allowed"));
                            return error;
                        }
                    }
                } catch (IllegalArgumentException | IllegalAccessException e) {
                    LOG.error("Error Occurred while getting field value!!!", e);
                }
            }
        }
        return null;
    }
}
