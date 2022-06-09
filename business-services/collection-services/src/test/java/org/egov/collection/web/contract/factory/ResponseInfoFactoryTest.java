package org.egov.collection.web.contract.factory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.junit.jupiter.api.Test;

class ResponseInfoFactoryTest {

    @Test
    void testCreateResponseInfoFromRequestInfo() {
        ResponseInfo actualCreateResponseInfoFromRequestInfoResult = ResponseInfoFactory
                .createResponseInfoFromRequestInfo(new RequestInfo(), true);
        assertNull(actualCreateResponseInfoFromRequestInfoResult.getApiId());
        assertNull(actualCreateResponseInfoFromRequestInfoResult.getVer());
        assertNull(actualCreateResponseInfoFromRequestInfoResult.getTs());
        assertNull(actualCreateResponseInfoFromRequestInfoResult.getStatus());
        assertEquals("uief87324", actualCreateResponseInfoFromRequestInfoResult.getResMsgId());
        assertNull(actualCreateResponseInfoFromRequestInfoResult.getMsgId());
    }

    @Test
    void testCreateResponseInfoFromRequestInfo2() {
        ResponseInfo actualCreateResponseInfoFromRequestInfoResult = ResponseInfoFactory
                .createResponseInfoFromRequestInfo(null, true);
        assertEquals("", actualCreateResponseInfoFromRequestInfoResult.getApiId());
        assertEquals("", actualCreateResponseInfoFromRequestInfoResult.getVer());
        assertNull(actualCreateResponseInfoFromRequestInfoResult.getTs());
        assertNull(actualCreateResponseInfoFromRequestInfoResult.getStatus());
        assertEquals("uief87324", actualCreateResponseInfoFromRequestInfoResult.getResMsgId());
        assertEquals("", actualCreateResponseInfoFromRequestInfoResult.getMsgId());
    }

    @Test
    void testCreateResponseInfoFromRequestInfo3() {
        RequestInfo requestInfo = mock(RequestInfo.class);
        when(requestInfo.getTs()).thenReturn(1L);
        when(requestInfo.getApiId()).thenReturn("42");
        when(requestInfo.getMsgId()).thenReturn("42");
        when(requestInfo.getVer()).thenReturn("Ver");
        ResponseInfo actualCreateResponseInfoFromRequestInfoResult = ResponseInfoFactory
                .createResponseInfoFromRequestInfo(requestInfo, true);
        assertEquals("42", actualCreateResponseInfoFromRequestInfoResult.getApiId());
        assertEquals("Ver", actualCreateResponseInfoFromRequestInfoResult.getVer());
        assertEquals(1L, actualCreateResponseInfoFromRequestInfoResult.getTs().longValue());
        assertNull(actualCreateResponseInfoFromRequestInfoResult.getStatus());
        assertEquals("uief87324", actualCreateResponseInfoFromRequestInfoResult.getResMsgId());
        assertEquals("42", actualCreateResponseInfoFromRequestInfoResult.getMsgId());
        verify(requestInfo).getTs();
        verify(requestInfo).getApiId();
        verify(requestInfo).getMsgId();
        verify(requestInfo).getVer();
    }
}

