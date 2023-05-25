package org.egov.dataupload.service;

import org.egov.dataupload.model.Document;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public interface FileIO {

    Document read(InputStream stream) throws IOException;
    void write(OutputStream stream, Document document) throws IOException;

}
