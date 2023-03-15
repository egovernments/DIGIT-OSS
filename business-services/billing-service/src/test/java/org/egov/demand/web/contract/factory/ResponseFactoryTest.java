package org.egov.demand.web.contract.factory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {ResponseFactory.class})
@ExtendWith(SpringExtension.class)
class ResponseFactoryTest {
    @Autowired
    private ResponseFactory responseFactory;

    @Test
    void testGetResponseInfo() {
        ResponseFactory responseFactory = new ResponseFactory();
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(new RequestInfo(), HttpStatus.CONTINUE);
        assertNull(actualResponseInfo.getApiId());
        assertNull(actualResponseInfo.getVer());
        assertNull(actualResponseInfo.getTs());
        assertEquals("100 CONTINUE", actualResponseInfo.getStatus());
        assertNull(actualResponseInfo.getMsgId());
    }


    @Test
    void testGetResponseInfo2() {


        (new ResponseFactory()).getResponseInfo(null, HttpStatus.CONTINUE);
    }


    @Test
    void testGetResponseInfo3() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.CONTINUE);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("100 CONTINUE", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }



    @Test
    void testGetResponseInfo5() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.SWITCHING_PROTOCOLS);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("101 SWITCHING_PROTOCOLS", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo6() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.PROCESSING);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("102 PROCESSING", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo7() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.CHECKPOINT);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("103 CHECKPOINT", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo8() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.OK);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("200 OK", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo9() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.CREATED);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("201 CREATED", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }

    @Test
    void testGetResponseInfo10() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.ACCEPTED);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("202 ACCEPTED", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo11() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo,
                HttpStatus.NON_AUTHORITATIVE_INFORMATION);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("203 NON_AUTHORITATIVE_INFORMATION", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }

    @Test
    void testGetResponseInfo12() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.NO_CONTENT);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("204 NO_CONTENT", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }

    @Test
    void testGetResponseInfo13() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.RESET_CONTENT);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("205 RESET_CONTENT", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo14() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.PARTIAL_CONTENT);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("206 PARTIAL_CONTENT", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo15() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.MULTI_STATUS);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("207 MULTI_STATUS", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo16() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.ALREADY_REPORTED);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("208 ALREADY_REPORTED", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo17() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.IM_USED);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("226 IM_USED", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo18() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.MULTIPLE_CHOICES);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("300 MULTIPLE_CHOICES", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo19() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.MOVED_PERMANENTLY);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("301 MOVED_PERMANENTLY", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetResponseInfo20() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.FOUND);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("302 FOUND", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }

    @Test
    void testGetResponseInfo21() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.MOVED_TEMPORARILY);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("302 MOVED_TEMPORARILY", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }

    @Test
    void testGetResponseInfo22() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualResponseInfo = responseFactory.getResponseInfo(requestInfo, HttpStatus.SEE_OTHER);
        assertEquals("42", actualResponseInfo.getApiId());
        assertEquals("Ver", actualResponseInfo.getVer());
        assertEquals(1L, actualResponseInfo.getTs().longValue());
        assertEquals("303 SEE_OTHER", actualResponseInfo.getStatus());
        assertEquals("42", actualResponseInfo.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }


    @Test
    void testGetErrorResponse() {
        ResponseFactory responseFactory = new ResponseFactory();
        ErrorResponse actualErrorResponse = responseFactory.getErrorResponse(new RequestInfo());
        Error error = actualErrorResponse.getError();
        assertEquals("EG_BS_API_ERROR", error.getMessage());
        ResponseInfo responseInfo = actualErrorResponse.getResponseInfo();
        assertNull(responseInfo.getVer());
        assertNull(responseInfo.getTs());
        assertEquals("400 BAD_REQUEST", responseInfo.getStatus());
        assertNull(responseInfo.getMsgId());
        assertNull(responseInfo.getApiId());
        assertEquals("The API you are trying to access has been depricated, Access the V2 API's", error.getDescription());
        assertEquals(400, error.getCode());
    }


    @Test
    void testGetErrorResponse2() {
        Error error = (new ResponseFactory()).getErrorResponse(null).getError();
        assertEquals("EG_BS_API_ERROR", error.getMessage());
        assertEquals("The API you are trying to access has been depricated, Access the V2 API's", error.getDescription());
        assertEquals(400, error.getCode());
    }

    @Test
    void testGetErrorResponse3() {
        ResponseFactory responseFactory = new ResponseFactory();
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ErrorResponse actualErrorResponse = responseFactory.getErrorResponse(requestInfo);
        Error error = actualErrorResponse.getError();
        assertEquals("EG_BS_API_ERROR", error.getMessage());
        ResponseInfo responseInfo = actualErrorResponse.getResponseInfo();
        assertEquals("Ver", responseInfo.getVer());
        assertEquals(1L, responseInfo.getTs().longValue());
        assertEquals("400 BAD_REQUEST", responseInfo.getStatus());
        assertEquals("42", responseInfo.getMsgId());
        assertEquals("42", responseInfo.getApiId());
        assertEquals("The API you are trying to access has been depricated, Access the V2 API's", error.getDescription());
        assertEquals(400, error.getCode());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }
}

