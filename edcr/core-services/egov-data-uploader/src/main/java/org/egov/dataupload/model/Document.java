package org.egov.dataupload.model;

import java.util.List;

public class Document {

    private final List<String> headers;
    private final List<List<Object>> rows;

    public Document(List<String> headers, List<List<Object>> rows) {
        this.headers = headers;
        this.rows = rows;
    }

    public List<String> getHeaders() {
        return headers;
    }

    public List<List<Object>> getRows() {
        return rows;
    }

    @Override
    public String toString() {
        return "Document{" +
                "headers=" + headers +
                ", rows=" + rows +
                '}';
    }
}
