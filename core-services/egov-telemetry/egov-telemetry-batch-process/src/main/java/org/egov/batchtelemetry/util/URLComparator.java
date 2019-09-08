package org.egov.batchtelemetry.util;

public class URLComparator {

    public static boolean compareURLs(String url, String checkFor) {

        if(url.contains(checkFor)) {
            if (url.length() - url.indexOf(checkFor) <= checkFor.length() + 2) {
                return true;
            }
        }
        return false;
    }
}
