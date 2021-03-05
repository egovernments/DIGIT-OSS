package org.egov.edcr.service;

import java.lang.reflect.Field;

import org.apache.log4j.Logger;
import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.egov.edcr.contract.EdcrRequest;
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
    public ErrorDetail validate(final EdcrRequest edcr) {
        if(edcr != null) {
            ErrorDetail error = new ErrorDetail();
            Field[] edcrFields = edcr.getClass().getDeclaredFields();
            validateAttributes(edcr, edcrFields, error);
            Field[] reqInfoFields = edcr.getRequestInfo().getClass().getDeclaredFields();
            validateAttributes(edcr.getRequestInfo(), reqInfoFields, error);
            Field[] userInfoFields = edcr.getRequestInfo().getUserInfo().getClass().getDeclaredFields();
            validateAttributes(edcr.getRequestInfo().getUserInfo(), userInfoFields, error);
            return error;
        }
        return null;
    }
    private void validateAttributes(final Object obj, Field[] edcrFields, ErrorDetail error) {
        for(Field f : edcrFields) {
            if(f.getType().isAssignableFrom(String.class)) {
                f.setAccessible(true);
                String value;
                try {
                    value = (String) f.get(obj);
                    boolean isValid = Jsoup.isValid(String.valueOf(value), Whitelist.basic());
                    if(!isValid) {
                        error.setErrorCode("EDCR-30");
                        error.setErrorMessage(String.format(INVALID_VAL, f.getName()));
                    }
                } catch (IllegalArgumentException | IllegalAccessException e) {
                    LOG.error("Error Occurred while getting field value!!!", e);
                }
            }
        }
    }
}
