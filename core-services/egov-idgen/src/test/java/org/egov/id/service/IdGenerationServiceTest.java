package org.egov.id.service;

import org.egov.id.model.IdGenerationRequest;
import org.egov.id.model.IdRequest;
import org.egov.id.model.RequestInfo;
import org.egov.id.model.ResponseInfoFactory;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
@RunWith(SpringJUnit4ClassRunner.class)
@ExtendWith(SpringExtension.class)

class IdGenerationServiceTest {


    @MockBean
    ResponseInfoFactory responseInfoFactory;

    @Test
    void testGenerateIdResponse() throws Exception {

        IdGenerationService idGenerationService = new IdGenerationService();

        ArrayList<IdRequest> idRequestList = new ArrayList<>();
        idRequestList.add(new IdRequest());

        IdGenerationRequest idGenerationRequest = new IdGenerationRequest();
        idGenerationRequest.setIdRequests(idRequestList);
        assertThrows(CustomException.class, () -> idGenerationService.generateIdResponse(idGenerationRequest));
    }

    @Test
    void testGenerateIdResponse3() throws Exception {

        IdGenerationService idGenerationService = new IdGenerationService();

        ArrayList<IdRequest> idRequestList = new ArrayList<>();
        idRequestList.add(new IdRequest());
        IdGenerationRequest idGenerationRequest = new IdGenerationRequest();
        idGenerationRequest.setIdRequests(idRequestList);
        assertThrows(CustomException.class, () -> idGenerationService.generateIdResponse(idGenerationRequest));

    }

    @Test
    void testGenerateIdResponse4() throws Exception {
        IdGenerationService idGenerationService = new IdGenerationService();

        ArrayList<IdRequest> idRequestList = new ArrayList<>();
        idRequestList.add(new IdRequest());

        IdGenerationRequest idGenerationRequest = new IdGenerationRequest();
        idGenerationRequest.setIdRequests(idRequestList);
        assertThrows(CustomException.class, () -> idGenerationService.generateIdResponse(idGenerationRequest));
    }

    @Test
    void testGenerateIdResponseWithArguments() throws Exception {

        IdGenerationService idGenerationService = new IdGenerationService();

        ArrayList<IdRequest> idRequestList = new ArrayList<>();
        idRequestList.add(new IdRequest());

        IdRequest idRequest = new IdRequest("Id Name", "42", "Format", 3);
        idRequest.setFormat("\\[(.*?)\\]");

        ArrayList<IdRequest> idRequestList1 = new ArrayList<>();
        idRequestList1.add(idRequest);
        IdGenerationRequest idGenerationRequest = mock(IdGenerationRequest.class);
        when(idGenerationRequest.getIdRequests()).thenReturn(idRequestList1);
        when(idGenerationRequest.getRequestInfo()).thenReturn(new RequestInfo());
        doNothing().when(idGenerationRequest).setIdRequests((List<IdRequest>) any());
        idGenerationRequest.setIdRequests(idRequestList);
        assertThrows(CustomException.class, () -> idGenerationService.generateIdResponse(idGenerationRequest));
        verify(idGenerationRequest).getIdRequests();
        verify(idGenerationRequest).getRequestInfo();
        verify(idGenerationRequest).setIdRequests((List<IdRequest>) any());
    }

    @Test
    void testGenerateIdResponseTenantIdNull() throws Exception {

        IdGenerationService idGenerationService = new IdGenerationService();

        ArrayList<IdRequest> idRequestList = new ArrayList<>();
        idRequestList.add(new IdRequest());

        IdRequest idRequest = new IdRequest("Id Name", null, "Format", 3);
        idRequest.setFormat("\\[(.*?)\\]");

        ArrayList<IdRequest> idRequestList1 = new ArrayList<>();
        idRequestList1.add(idRequest);
        IdGenerationRequest idGenerationRequest = mock(IdGenerationRequest.class);
        when(idGenerationRequest.getIdRequests()).thenReturn(idRequestList1);
        when(idGenerationRequest.getRequestInfo()).thenReturn(new RequestInfo());
        doNothing().when(idGenerationRequest).setIdRequests((List<IdRequest>) any());
        idGenerationRequest.setIdRequests(idRequestList);
        assertThrows(CustomException.class, () -> idGenerationService.generateIdResponse(idGenerationRequest));
        verify(idGenerationRequest).getIdRequests();
        verify(idGenerationRequest).getRequestInfo();
        verify(idGenerationRequest).setIdRequests((List<IdRequest>) any());
    }

    @Test
    void testGenerateIdResponseNullCount() throws Exception {

        IdGenerationService idGenerationService = new IdGenerationService();

        ArrayList<IdRequest> idRequestList = new ArrayList<>();
        idRequestList.add(new IdRequest());

        IdRequest idRequest = new IdRequest("Id Name", "42", "Format", null);
        idRequest.setFormat("\\[(.*?)\\]");

        ArrayList<IdRequest> idRequestList1 = new ArrayList<>();
        idRequestList1.add(idRequest);
        IdGenerationRequest idGenerationRequest = mock(IdGenerationRequest.class);
        when(idGenerationRequest.getIdRequests()).thenReturn(idRequestList1);
        when(idGenerationRequest.getRequestInfo()).thenReturn(new RequestInfo());
        doNothing().when(idGenerationRequest).setIdRequests((List<IdRequest>) any());
        idGenerationRequest.setIdRequests(idRequestList);
        assertThrows(CustomException.class, () -> idGenerationService.generateIdResponse(idGenerationRequest));
        verify(idGenerationRequest).getIdRequests();
        verify(idGenerationRequest).getRequestInfo();
        verify(idGenerationRequest).setIdRequests((List<IdRequest>) any());
    }

    @Test
    void testGenerateIdResponseIdnull() throws Exception {

        IdGenerationService idGenerationService = new IdGenerationService();

        ArrayList<IdRequest> idRequestList = new ArrayList<>();
        idRequestList.add(new IdRequest());

        IdRequest idRequest = new IdRequest(null, "42", "Format", 3);
        idRequest.setFormat("\\[(.*?)\\]");

        ArrayList<IdRequest> idRequestList1 = new ArrayList<>();
        idRequestList1.add(idRequest);
        IdGenerationRequest idGenerationRequest = mock(IdGenerationRequest.class);
        when(idGenerationRequest.getIdRequests()).thenReturn(idRequestList1);
        when(idGenerationRequest.getRequestInfo()).thenReturn(new RequestInfo());
        doNothing().when(idGenerationRequest).setIdRequests((List<IdRequest>) any());
        idGenerationRequest.setIdRequests(idRequestList);
        assertThrows(CustomException.class, () -> idGenerationService.generateIdResponse(idGenerationRequest));
        verify(idGenerationRequest).getIdRequests();
        verify(idGenerationRequest).getRequestInfo();
        verify(idGenerationRequest).setIdRequests((List<IdRequest>) any());
    }

}

