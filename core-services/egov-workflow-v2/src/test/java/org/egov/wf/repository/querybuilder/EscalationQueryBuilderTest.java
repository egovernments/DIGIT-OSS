package org.egov.wf.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.wf.web.models.EscalationSearchCriteria;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {EscalationQueryBuilder.class})
@ExtendWith(SpringExtension.class)
class EscalationQueryBuilderTest {
    @Autowired
    private EscalationQueryBuilder escalationQueryBuilder;


    @Test
    void testGetEscalationQuery() {
        EscalationSearchCriteria escalationSearchCriteria = mock(EscalationSearchCriteria.class);
        when(escalationSearchCriteria.getBusinessSlaExceededBy()).thenReturn(1L);
        when(escalationSearchCriteria.getStateSlaExceededBy()).thenReturn(1L);
        when(escalationSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(escalationSearchCriteria.getStatus()).thenReturn("Status");
        when(escalationSearchCriteria.getTenantId()).thenReturn("42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 WHERE businessservice = ? AND tenantid= ? ) wf  WHERE"
                        + " rank_number = 1  AND wf.status = ?  AND (select extract(epoch from current_timestamp)) * 1000 -"
                        + " wf.createdtime - wf.statesla > ?  AND (select extract(epoch from current_timestamp)) * 1000 -"
                        + " wf.createdtime - wf.businessservicesla > ? ",
                this.escalationQueryBuilder.getEscalationQuery(escalationSearchCriteria, objectList));
        verify(escalationSearchCriteria, atLeast(1)).getBusinessSlaExceededBy();
        verify(escalationSearchCriteria, atLeast(1)).getStateSlaExceededBy();
        verify(escalationSearchCriteria).getBusinessService();
        verify(escalationSearchCriteria).getStatus();
        verify(escalationSearchCriteria).getTenantId();
        assertEquals(5, objectList.size());
    }


    @Test
    void testGetEscalationQuerywithstatesla() {
        EscalationSearchCriteria escalationSearchCriteria = mock(EscalationSearchCriteria.class);
        when(escalationSearchCriteria.getBusinessSlaExceededBy()).thenReturn(null);
        when(escalationSearchCriteria.getStateSlaExceededBy()).thenReturn(1L);
        when(escalationSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(escalationSearchCriteria.getStatus()).thenReturn("Status");
        when(escalationSearchCriteria.getTenantId()).thenReturn("42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 WHERE businessservice = ? AND tenantid= ? ) wf  WHERE"
                        + " rank_number = 1  AND wf.status = ?  AND (select extract(epoch from current_timestamp)) * 1000 -"
                        + " wf.createdtime - wf.statesla > ? ",
                this.escalationQueryBuilder.getEscalationQuery(escalationSearchCriteria, objectList));
        verify(escalationSearchCriteria).getBusinessSlaExceededBy();
        verify(escalationSearchCriteria, atLeast(1)).getStateSlaExceededBy();
        verify(escalationSearchCriteria).getBusinessService();
        verify(escalationSearchCriteria).getStatus();
        verify(escalationSearchCriteria).getTenantId();
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetEscalationQuerywithbusinessservicesla() {
        EscalationSearchCriteria escalationSearchCriteria = mock(EscalationSearchCriteria.class);
        when(escalationSearchCriteria.getBusinessSlaExceededBy()).thenReturn(1L);
        when(escalationSearchCriteria.getStateSlaExceededBy()).thenReturn(null);
        when(escalationSearchCriteria.getBusinessService()).thenReturn("Business Service");
        when(escalationSearchCriteria.getStatus()).thenReturn("Status");
        when(escalationSearchCriteria.getTenantId()).thenReturn("42");
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "select businessId from (  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC)"
                        + " rank_number  FROM eg_wf_processinstance_v2 WHERE businessservice = ? AND tenantid= ? ) wf  WHERE"
                        + " rank_number = 1  AND wf.status = ?  AND (select extract(epoch from current_timestamp)) * 1000 -"
                        + " wf.createdtime - wf.businessservicesla > ? ",
                this.escalationQueryBuilder.getEscalationQuery(escalationSearchCriteria, objectList));
        verify(escalationSearchCriteria, atLeast(1)).getBusinessSlaExceededBy();
        verify(escalationSearchCriteria).getStateSlaExceededBy();
        verify(escalationSearchCriteria).getBusinessService();
        verify(escalationSearchCriteria).getStatus();
        verify(escalationSearchCriteria).getTenantId();
        assertEquals(4, objectList.size());
    }
}

