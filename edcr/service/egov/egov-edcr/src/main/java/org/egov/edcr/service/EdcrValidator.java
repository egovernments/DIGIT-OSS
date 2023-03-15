package org.egov.edcr.service;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.egov.edcr.contract.ComparisonRequest;
import org.egov.edcr.contract.EdcrRequest;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
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
    private static Logger LOG = LogManager.getLogger(EdcrValidator.class);
    private static final String INVALID_VAL = "The %s value is invalid";
    private static final String ALPHANUMERIC_WITH_SPECIAL_CHARS = "^[a-zA-Z0-9]+(([ _\\-&:,/.][a-zA-Z0-9])?[a-zA-Z0-9]*)*$";
    private static final String ALPHA_CHARS = "^[a-zA-Z]*$";
    private static final String INVALID_CHAR_MSG = " _-&:,/.";
    private static final String INVALID_CHAR = "The (%s) contains invalid value. Only following special characters are allowed %s, The String should not start with special characters and should not follow two immediately.";
    
    private static final List<String> VALIDATION_NOT_REQUIRED_FIELDS = new ArrayList<>();
    
    static {
        VALIDATION_NOT_REQUIRED_FIELDS.add("ver");
        VALIDATION_NOT_REQUIRED_FIELDS.add("msgId");
        VALIDATION_NOT_REQUIRED_FIELDS.add("password");
        VALIDATION_NOT_REQUIRED_FIELDS.add("did");
        VALIDATION_NOT_REQUIRED_FIELDS.add("apiId");
        VALIDATION_NOT_REQUIRED_FIELDS.add("action");
        VALIDATION_NOT_REQUIRED_FIELDS.add("userName");
    }

    public ErrorDetail validate(final EdcrRequest edcr) {
        if (edcr != null) {
            ErrorDetail error = new ErrorDetail();
            Field[] edcrFields = edcr.getClass().getDeclaredFields();
            ErrorDetail e1 = validateAttributes(edcr, edcrFields, error);
            if (e1 != null)
                return error;
            if (edcr.getRequestInfo() != null) {
                Field[] reqInfoFields = edcr.getRequestInfo().getClass().getDeclaredFields();
                ErrorDetail e2 = validateAttributes(edcr.getRequestInfo(), reqInfoFields, error);
                if (e2 != null)
                    return error;
            }
            if (edcr.getRequestInfo() != null && edcr.getRequestInfo().getUserInfo() != null) {
                Field[] userInfoFields = edcr.getRequestInfo().getUserInfo().getClass().getDeclaredFields();
                ErrorDetail e3 = validateAttributes(edcr.getRequestInfo().getUserInfo(), userInfoFields, error);
                if (e3 != null)
                    return error;
            }
        }
        return null;
    }

    public ErrorDetail validate(final RequestInfoWrapper requestInfoWrapper) {
        if (requestInfoWrapper != null) {
            ErrorDetail error = new ErrorDetail();
            if (requestInfoWrapper.getRequestInfo() != null) {
                Field[] reqInfoFields = requestInfoWrapper.getRequestInfo().getClass().getDeclaredFields();
                ErrorDetail e2 = validateAttributes(requestInfoWrapper.getRequestInfo(), reqInfoFields, error);
                if (e2 != null)
                    return e2;
            }
            if (requestInfoWrapper.getRequestInfo() != null && requestInfoWrapper.getRequestInfo().getUserInfo() != null) {
                Field[] userInfoFields = requestInfoWrapper.getRequestInfo().getUserInfo().getClass().getDeclaredFields();
                ErrorDetail e3 = validateAttributes(requestInfoWrapper.getRequestInfo().getUserInfo(), userInfoFields, error);
                if (e3 != null)
                    return e3;
            }
        }
        return null;
    }

    public ErrorDetail validate(final ComparisonRequest comparisonRequest) {
        if (comparisonRequest != null) {
            ErrorDetail error = new ErrorDetail();
            Field[] compaFields = comparisonRequest.getClass().getDeclaredFields();
            ErrorDetail e1 = validateAttributes(comparisonRequest, compaFields, error);
            if (e1 != null)
                return e1;
            if (comparisonRequest.getRequestInfo() != null) {
                Field[] reqInfoFields = comparisonRequest.getRequestInfo().getClass().getDeclaredFields();
                ErrorDetail e2 = validateAttributes(comparisonRequest.getRequestInfo(), reqInfoFields, error);
                if (e2 != null)
                    return e2;
            }
            if (comparisonRequest.getRequestInfo() != null && comparisonRequest.getRequestInfo().getUserInfo() != null) {
                Field[] userInfoFields = comparisonRequest.getRequestInfo().getUserInfo().getClass().getDeclaredFields();
                ErrorDetail e3 = validateAttributes(comparisonRequest.getRequestInfo().getUserInfo(), userInfoFields, error);
                if (e3 != null)
                    return e3;
            }
        }
        return null;
    }

    private ErrorDetail validateAttributes(final Object obj, Field[] edcrFields, ErrorDetail error) {
        for (Field f : edcrFields) {
            if (f.getType().isAssignableFrom(String.class) && !VALIDATION_NOT_REQUIRED_FIELDS.contains(f.getName())) {
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
                    if (StringUtils.isNotBlank(value) && value.length() > 1) {
                        value = value.trim();
                        boolean isAllow = Pattern.matches(ALPHANUMERIC_WITH_SPECIAL_CHARS, value);
                        if (!isAllow) {
                            LOG.info("The Inalid Value is" + value);
                            error.setErrorCode("EDCR-31");
                            error.setErrorMessage(String.format(INVALID_CHAR, f.getName(), INVALID_CHAR_MSG));
                            return error;
                        }

                        if(f.getName().equals("applicantName") && StringUtils.isNotBlank(value) && value.length() > 1)
                        {
                        	 boolean isAllowName = Pattern.matches(ALPHA_CHARS, value);
                        	  if (!isAllowName) {
                                  LOG.info("The Inalid Value is" + value);
                                  error.setErrorCode("EDCR-31");
                                  error.setErrorMessage(String.format(INVALID_CHAR, f.getName(), INVALID_CHAR_MSG));
                                  return error;
                              }
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
