package org.egov.id.exception;

import lombok.extern.slf4j.Slf4j;
import org.egov.id.config.PropertiesManager;
import org.egov.id.model.Error;
import org.egov.id.model.ErrorRes;
import org.egov.id.model.ResponseInfo;
import org.egov.id.model.ResponseStatusEnum;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.mockito.Mock;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)

@Slf4j
class GlobalExceptionHandlerTest {

    @Mock
    private PropertiesManager propertiesManager;

    void testUnknownException() {
        GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();
        Exception ex = new Exception("An error occurred");
        ErrorRes actualUnknownExceptionResult = globalExceptionHandler.unknownException(ex,
                new ServletWebRequest(new MockHttpServletRequest()));
        List<Error> errors = actualUnknownExceptionResult.getErrors();
        assertEquals(1, errors.size());
        ResponseInfo responseInfo = actualUnknownExceptionResult.getResponseInfo();
        assertNull(responseInfo.getVer());
        assertNull(responseInfo.getApiId());
        assertNull(responseInfo.getResMsgId());
        assertEquals(ResponseStatusEnum.FAILED, responseInfo.getStatus());
        assertNull(responseInfo.getMsgId());
        assertNull(responseInfo.getTs());
        Error getResult = errors.get(0);
        assertTrue(getResult.getFileds().isEmpty());
        assertEquals("An error occurred", getResult.getMessage());
        assertEquals("400 BAD_REQUEST", getResult.getCode());
        assertNull(getResult.getDescription());
    }

    @Test
    void testUnknownExceptionNull() {
        GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();
        Exception ex = new Exception("nullValue");
        ErrorRes actualUnknownExceptionResult = globalExceptionHandler.unknownException(ex,
                new ServletWebRequest(new MockHttpServletRequest()));
        List<Error> errors = actualUnknownExceptionResult.getErrors();
        assertEquals(1, errors.size());
        ResponseInfo responseInfo = actualUnknownExceptionResult.getResponseInfo();
        assertNull(responseInfo.getVer());
        assertNull(responseInfo.getApiId());
        assertNull(responseInfo.getResMsgId());
        assertEquals(ResponseStatusEnum.FAILED, responseInfo.getStatus());
        assertNull(responseInfo.getMsgId());
        assertNull(responseInfo.getTs());
        Error getResult = errors.get(0);
        assertTrue(getResult.getFileds().isEmpty());
        assertEquals("nullValue", getResult.getMessage());
        assertEquals("400 BAD_REQUEST", getResult.getCode());
        assertNull(getResult.getDescription());
    }

    @Test
    void testUnknownExceptionIDSeqNotFoundException() {
        GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();
        Exception ex = new Exception("IDSeqNotFoundException");
        ErrorRes actualUnknownExceptionResult = globalExceptionHandler.unknownException(ex,
                new ServletWebRequest(new MockHttpServletRequest()));
        List<Error> errors = actualUnknownExceptionResult.getErrors();
        assertEquals(1, errors.size());
        ResponseInfo responseInfo = actualUnknownExceptionResult.getResponseInfo();
        assertNull(responseInfo.getVer());
        assertNull(responseInfo.getApiId());
        assertNull(responseInfo.getResMsgId());
        assertEquals(ResponseStatusEnum.FAILED, responseInfo.getStatus());
        assertNull(responseInfo.getMsgId());
        assertNull(responseInfo.getTs());
        Error getResult = errors.get(0);
        assertTrue(getResult.getFileds().isEmpty());
        assertEquals("IDSeqNotFoundException", getResult.getMessage());
        assertEquals("400 BAD_REQUEST", getResult.getCode());
        assertNull(getResult.getDescription());
    }
}

