package org.egov.tenant;

import org.apache.commons.io.IOUtils;
import org.egov.tracer.model.CustomException;

import java.io.IOException;

public class Resources {
    public String getFileContents(String fileName) {
        try {
            return IOUtils.toString(this.getClass().getClassLoader()
                    .getResourceAsStream(fileName), "UTF-8")
                    .replace("\n", "");
        } catch (IOException e) {
            throw new CustomException(e.toString(),e.toString());
        }
    }
}
