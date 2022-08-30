package org.egov.rn.web.utils;

public class ExceptionUtils {
    private ExceptionUtils() {}

    public static String getErrorMessage(String message) {
        return "{\"error\": \"" + message + "\"}";
    }
}
