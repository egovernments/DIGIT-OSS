package org.egov.wf.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.wf.web.models.BusinessServiceSearchCriteria;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BusinessServiceQueryBuilder.class})
@ExtendWith(SpringExtension.class)
class BusinessServiceQueryBuilderTest {
    @Autowired
    private BusinessServiceQueryBuilder businessServiceQueryBuilder;


    @Test
    void testGetBusinessServices() {
        BusinessServiceSearchCriteria criteria = new BusinessServiceSearchCriteria();
        assertEquals("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId as"
                + " bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE  ORDER"
                + " BY seq", this.businessServiceQueryBuilder.getBusinessServices(criteria, new ArrayList<>()));
    }



    @Test
    void testGetBusinessServiceswithcriteria() {
        ArrayList<String> businessServices = new ArrayList<>();
        ArrayList<String> stateUuids = new ArrayList<>();
        BusinessServiceSearchCriteria criteria = new BusinessServiceSearchCriteria("42", businessServices, stateUuids,
                new ArrayList<>());

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                        + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId as"
                        + " bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                        + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                        + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                        + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                        + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                        + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE  WHERE"
                        + "  bs.tenantId = ?  ORDER BY seq",
                this.businessServiceQueryBuilder.getBusinessServices(criteria, objectList));
        assertEquals(1, objectList.size());
    }


    @Test
    void testGetBusinessServiceswithbusinesscriteria() {
        BusinessServiceSearchCriteria businessServiceSearchCriteria = mock(BusinessServiceSearchCriteria.class);
        when(businessServiceSearchCriteria.getTenantId()).thenReturn("42");
        when(businessServiceSearchCriteria.getActionUuids()).thenReturn(new ArrayList<>());
        when(businessServiceSearchCriteria.getBusinessServices()).thenReturn(new ArrayList<>());
        when(businessServiceSearchCriteria.getStateUuids()).thenReturn(new ArrayList<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                        + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId as"
                        + " bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                        + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                        + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                        + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                        + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                        + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE  WHERE"
                        + "  bs.tenantId = ?  ORDER BY seq",
                this.businessServiceQueryBuilder.getBusinessServices(businessServiceSearchCriteria, objectList));
        verify(businessServiceSearchCriteria).getTenantId();
        verify(businessServiceSearchCriteria).getActionUuids();
        verify(businessServiceSearchCriteria).getBusinessServices();
        verify(businessServiceSearchCriteria).getStateUuids();
        assertEquals(1, objectList.size());
    }


    @Test
    void testGetBusinessServicesexpected2() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId"
                + " as bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE ");
        BusinessServiceSearchCriteria businessServiceSearchCriteria = mock(BusinessServiceSearchCriteria.class);
        when(businessServiceSearchCriteria.getTenantId()).thenReturn("42");
        when(businessServiceSearchCriteria.getActionUuids()).thenReturn(stringList);
        when(businessServiceSearchCriteria.getBusinessServices()).thenReturn(new ArrayList<>());
        when(businessServiceSearchCriteria.getStateUuids()).thenReturn(new ArrayList<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                        + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId as"
                        + " bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                        + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                        + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                        + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                        + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                        + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE  WHERE"
                        + "  bs.tenantId = ?  AND  ac.uuid IN ( ?) ORDER BY seq",
                this.businessServiceQueryBuilder.getBusinessServices(businessServiceSearchCriteria, objectList));
        verify(businessServiceSearchCriteria).getTenantId();
        verify(businessServiceSearchCriteria).getActionUuids();
        verify(businessServiceSearchCriteria).getBusinessServices();
        verify(businessServiceSearchCriteria).getStateUuids();
        assertEquals(2, objectList.size());
    }


    @Test
    void GetBusinessServicesorderbyseq() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId"
                + " as bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE ");
        BusinessServiceSearchCriteria businessServiceSearchCriteria = mock(BusinessServiceSearchCriteria.class);
        when(businessServiceSearchCriteria.getTenantId()).thenReturn("42");
        when(businessServiceSearchCriteria.getActionUuids()).thenReturn(new ArrayList<>());
        when(businessServiceSearchCriteria.getBusinessServices()).thenReturn(stringList);
        when(businessServiceSearchCriteria.getStateUuids()).thenReturn(new ArrayList<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                        + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId as"
                        + " bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                        + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                        + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                        + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                        + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                        + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE  WHERE"
                        + "  bs.tenantId = ?  AND  bs.businessService IN ( ?) ORDER BY seq",
                this.businessServiceQueryBuilder.getBusinessServices(businessServiceSearchCriteria, objectList));
        verify(businessServiceSearchCriteria).getTenantId();
        verify(businessServiceSearchCriteria).getActionUuids();
        verify(businessServiceSearchCriteria).getBusinessServices();
        verify(businessServiceSearchCriteria).getStateUuids();
        assertEquals(2, objectList.size());
    }


    @Test
    void GetBusinessServices() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId"
                + " as bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE ");
        BusinessServiceSearchCriteria businessServiceSearchCriteria = mock(BusinessServiceSearchCriteria.class);
        when(businessServiceSearchCriteria.getTenantId()).thenReturn("42");
        when(businessServiceSearchCriteria.getActionUuids()).thenReturn(new ArrayList<>());
        when(businessServiceSearchCriteria.getBusinessServices()).thenReturn(new ArrayList<>());
        when(businessServiceSearchCriteria.getStateUuids()).thenReturn(stringList);
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                        + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId as"
                        + " bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                        + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                        + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                        + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                        + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                        + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE  WHERE"
                        + "  bs.tenantId = ?  AND  st.uuid IN ( ?) ORDER BY seq",
                this.businessServiceQueryBuilder.getBusinessServices(businessServiceSearchCriteria, objectList));
        verify(businessServiceSearchCriteria).getTenantId();
        verify(businessServiceSearchCriteria).getActionUuids();
        verify(businessServiceSearchCriteria).getBusinessServices();
        verify(businessServiceSearchCriteria).getStateUuids();
        assertEquals(2, objectList.size());
    }


    @Test
    void testGetBusinessServices3() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId"
                + " as bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE ");
        stringList.add("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId"
                + " as bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE ");
        BusinessServiceSearchCriteria businessServiceSearchCriteria = mock(BusinessServiceSearchCriteria.class);
        when(businessServiceSearchCriteria.getTenantId()).thenReturn("42");
        when(businessServiceSearchCriteria.getActionUuids()).thenReturn(stringList);
        when(businessServiceSearchCriteria.getBusinessServices()).thenReturn(new ArrayList<>());
        when(businessServiceSearchCriteria.getStateUuids()).thenReturn(new ArrayList<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT bs.*,st.*,ac.*,bs.uuid as bs_uuid, bs.lastModifiedTime as bs_lastModifiedTime,bs.createdTime"
                        + " as bs_createdTime,bs.createdBy as bs_createdBy,bs.lastModifiedBy as bs_lastModifiedBy,bs.tenantId as"
                        + " bs_tenantId, st.lastModifiedTime as st_lastModifiedTime,st.createdTime as st_createdTime,st.tenantId"
                        + " as st_tenantId,st.createdBy as st_createdBy,st.uuid as st_uuid, st.lastModifiedBy as st_lastModifiedBy,"
                        + " ac.lastModifiedTime as ac_lastModifiedTime,ac.createdTime as ac_createdTime,ac.createdBy as"
                        + " ac_createdBy,ac.lastModifiedBy as ac_lastModifiedBy,ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.active"
                        + " as ac_active  FROM eg_wf_businessService_v2 bs  INNER JOIN  eg_wf_state_v2 st ON st.businessServiceId"
                        + " = bs.uuid  LEFT OUTER JOIN  eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE  WHERE"
                        + "  bs.tenantId = ?  AND  ac.uuid IN ( ?, ?) ORDER BY seq",
                this.businessServiceQueryBuilder.getBusinessServices(businessServiceSearchCriteria, objectList));
        verify(businessServiceSearchCriteria).getTenantId();
        verify(businessServiceSearchCriteria).getActionUuids();
        verify(businessServiceSearchCriteria).getBusinessServices();
        verify(businessServiceSearchCriteria).getStateUuids();
        assertEquals(3, objectList.size());
    }
}

