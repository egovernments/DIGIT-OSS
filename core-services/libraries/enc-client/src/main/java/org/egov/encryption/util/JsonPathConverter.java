package org.egov.encryption.util;


import java.util.ArrayList;
import java.util.List;

public class JsonPathConverter {

    public static List<String> convertToArrayJsonPaths(List<String> jsonPaths) {
        List<String> arrayJsonPaths = new ArrayList<>();
        jsonPaths.stream().map(path -> "*/" + path).forEach(arrayJsonPaths::add);
        return arrayJsonPaths;
    }

}
