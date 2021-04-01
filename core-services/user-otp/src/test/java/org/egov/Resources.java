package org.egov;

import org.apache.commons.io.IOUtils;

import java.io.IOException;

public class Resources {
    public String getFileContents(String fileName) {
        try {
            return IOUtils.toString(this.getClass().getClassLoader()
                    .getResourceAsStream(fileName), "UTF-8")
                    .replaceAll("\\s*\\{\\s*", "\\{")
                    .replaceAll("\\s*\\}\\s*", "\\}")
                    .replaceAll("\\s*:\\s*", ":")
                    .replace("\n", "");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
