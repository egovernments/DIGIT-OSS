package org.egov.id.service;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.id.model.IdRequest;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsResponse;
import org.egov.mdms.service.MdmsClientService;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {MdmsService.class})
@ExtendWith(SpringExtension.class)
class MdmsServiceTest {
    @MockBean
    private MdmsClientService mdmsClientService;

    @Autowired
    private MdmsService mdmsService;

    @Test
    void testGetMasterData() {
        MdmsResponse mdmsResponse = new MdmsResponse();
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, List<MasterDetail>>) any())).thenReturn(mdmsResponse);
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertSame(mdmsResponse, this.mdmsService.getMasterData(requestInfo, "42", new HashMap<>()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, List<MasterDetail>>) any());
    }

    @Test
    void testGetMasterData2() {
        MdmsResponse mdmsResponse = new MdmsResponse();
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, List<MasterDetail>>) any())).thenReturn(mdmsResponse);
        assertSame(mdmsResponse, this.mdmsService.getMasterData(null, "42", new HashMap<>()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, List<MasterDetail>>) any());
    }

    @Test
    void testGetMasterData4() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, List<MasterDetail>>) any())).thenThrow(new CustomException("Code", "An error occurred"));
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertThrows(CustomException.class, () -> this.mdmsService.getMasterData(requestInfo, "42", new HashMap<>()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, List<MasterDetail>>) any());
    }

    @Test
    void testGetCity() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenReturn(new MdmsResponse());
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertThrows(CustomException.class, () -> this.mdmsService.getCity(requestInfo, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetCity2() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any())).thenReturn(null);
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertThrows(CustomException.class, () -> this.mdmsService.getCity(requestInfo, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetCity3() {
        ResponseInfo responseInfo = new ResponseInfo();
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenReturn(new MdmsResponse(responseInfo, new HashMap<>()));
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertThrows(CustomException.class, () -> this.mdmsService.getCity(requestInfo, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetCity4() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenReturn(new MdmsResponse());
        assertThrows(CustomException.class, () -> this.mdmsService.getCity(null, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetCity5() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenReturn(new MdmsResponse());
        org.egov.id.model.RequestInfo requestInfo = mock(org.egov.id.model.RequestInfo.class);
        assertThrows(CustomException.class, () -> this.mdmsService.getCity(requestInfo, new IdRequest()));
    }

    @Test
    void testGetCity7() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenThrow(new CustomException("tenants", "An error occurred"));
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertThrows(CustomException.class, () -> this.mdmsService.getCity(requestInfo, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetIdFormat() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenReturn(new MdmsResponse());
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertNull(this.mdmsService.getIdFormat(requestInfo, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetIdFormat2() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any())).thenReturn(null);
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertThrows(CustomException.class, () -> this.mdmsService.getIdFormat(requestInfo, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetIdFormat3() {
        ResponseInfo responseInfo = new ResponseInfo();
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenReturn(new MdmsResponse(responseInfo, new HashMap<>()));
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertNull(this.mdmsService.getIdFormat(requestInfo, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetIdFormat4() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenReturn(new MdmsResponse());
        assertNull(this.mdmsService.getIdFormat(null, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }

    @Test
    void testGetIdFormat7() {
        when(this.mdmsClientService.getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any()))
                .thenThrow(new CustomException("tenants", "An error occurred"));
        org.egov.id.model.RequestInfo requestInfo = new org.egov.id.model.RequestInfo();
        assertThrows(CustomException.class, () -> this.mdmsService.getIdFormat(requestInfo, new IdRequest()));
        verify(this.mdmsClientService).getMaster((org.egov.common.contract.request.RequestInfo) any(), (String) any(),
                (java.util.Map<String, java.util.List<org.egov.mdms.model.MasterDetail>>) any());
    }
}

