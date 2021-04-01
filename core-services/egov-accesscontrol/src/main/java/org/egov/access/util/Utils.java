package org.egov.access.util;

public class Utils {

    private Utils(){}

    private static final String OPENING_BRACES = "{";
    private static final String CLOSING_BRACES = "}";
    private static final String PARAMETER_PLACEHOLDER_REGEX = "\\{\\w+\\}";
    private static final String ANY_WORD_REGEX = "\\\\w+";


    public static boolean isRegexUri(String url) {
        return url.contains(OPENING_BRACES) & url.contains(CLOSING_BRACES);
    }

    public static boolean isRegexUriMatch(String actionUri, String requestUri){

        return requestUri.matches(getRegexUri(actionUri));
    }

    private static String getRegexUri(String url) {
        return url.replaceAll(PARAMETER_PLACEHOLDER_REGEX, ANY_WORD_REGEX);
    }
}
