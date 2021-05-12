package org.egov.wrapper;

import com.netflix.zuul.http.HttpServletRequestWrapper;
import com.netflix.zuul.http.ServletInputStreamWrapper;
import org.apache.commons.io.IOUtils;
import org.egov.tracer.model.CustomException;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class CustomRequestWrapper extends HttpServletRequestWrapper {

    private String payload;

    public CustomRequestWrapper(HttpServletRequest request) {
        super(request);
        convertInputStreamToString(request);
    }

    private void convertInputStreamToString(HttpServletRequest request) {
        try {
            payload = IOUtils.toString(request.getInputStream());
        } catch (IOException e) {
            throw new CustomException("INPUT_TO_STRING_CONVERSION_ERROR", e.getMessage());
        }
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload){
        this.payload = payload;
    }

    @Override
    public int getContentLength() {
        return payload.length();
    }

    @Override
    public long getContentLengthLong() {
        return payload.length();
    }

    @Override
    public ServletInputStream getInputStream() {
        return new ServletInputStreamWrapper(payload.getBytes());
    }
}
