package org.egov.collection.util;

import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;

import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {RemittanceEnricher.class})
@ExtendWith(SpringExtension.class)
class emittanceEnricherTest {
    @Autowired
    private RemittanceEnricher remittanceEnricher;

    @Test
    void testEnrichRemittancePreValidate4() {
        ArrayList<Remittance> remittanceList = new ArrayList<>();
        remittanceList.add(new Remittance());
        RemittanceRequest remittanceRequest = mock(RemittanceRequest.class);
        when(remittanceRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(remittanceRequest.getRemittances()).thenReturn(remittanceList);
        this.remittanceEnricher.enrichRemittancePreValidate(remittanceRequest);
        verify(remittanceRequest).getRemittances();
        verify(remittanceRequest, atLeast(1)).getRequestInfo();
    }

    @Test
    void testEnrichRemittancePreValidate8() {
        ArrayList<Remittance> remittanceList = new ArrayList<>();
        remittanceList.add(new Remittance());

        User user = new User();
        user.setId(123L);
        RemittanceRequest remittanceRequest = mock(RemittanceRequest.class);
        when(remittanceRequest.getRequestInfo())
                .thenReturn(new RequestInfo("42", "-", 4L, "-", "-", "-", "42", "ABC123", "42", user));
        when(remittanceRequest.getRemittances()).thenReturn(remittanceList);
        this.remittanceEnricher.enrichRemittancePreValidate(remittanceRequest);
        verify(remittanceRequest).getRemittances();
        verify(remittanceRequest, atLeast(1)).getRequestInfo();
    }
}

@ContextConfiguration(classes = {RemittanceEnricher.class})
@ExtendWith(SpringExtension.class)
class RemittanceEnricherTest {
    @Autowired
    private RemittanceEnricher remittanceEnricher;

    @Test
    void testEnrichRemittancePreValidate4() {
        ArrayList<Remittance> remittanceList = new ArrayList<>();
        remittanceList.add(new Remittance());
        RemittanceRequest remittanceRequest = mock(RemittanceRequest.class);
        when(remittanceRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(remittanceRequest.getRemittances()).thenReturn(remittanceList);
        this.remittanceEnricher.enrichRemittancePreValidate(remittanceRequest);
        verify(remittanceRequest).getRemittances();
        verify(remittanceRequest, atLeast(1)).getRequestInfo();
    }

    @Test
    void testEnrichRemittancePreValidate8() {
        ArrayList<Remittance> remittanceList = new ArrayList<>();
        remittanceList.add(new Remittance());

        User user = new User();
        user.setId(123L);
        RemittanceRequest remittanceRequest = mock(RemittanceRequest.class);
        when(remittanceRequest.getRequestInfo())
                .thenReturn(new RequestInfo("42", "-", 4L, "-", "-", "-", "42", "ABC123", "42", user));
        when(remittanceRequest.getRemittances()).thenReturn(remittanceList);
        this.remittanceEnricher.enrichRemittancePreValidate(remittanceRequest);
        verify(remittanceRequest).getRemittances();
        verify(remittanceRequest, atLeast(1)).getRequestInfo();
    }
}


