package org.egov.auditservice.persisterauditclient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.zafarkhaja.semver.Version;
import org.egov.auditservice.persisterauditclient.models.contract.*;
import org.egov.auditservice.persisterauditclient.utils.AuditUtil;
import org.egov.auditservice.service.ChooseSignerAndVerifier;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {PersisterAuditClientService.class})
@ExtendWith(SpringExtension.class)
class PersisterAuditClientServiceTest {
    @MockBean
    private AuditUtil auditUtil;

    @MockBean
    private ChooseSignerAndVerifier chooseSignerAndVerifier;

    @MockBean
    private KafkaTemplate kafkaTemplate;

    @MockBean
    private ObjectMapper objectMapper;

    @Autowired
    private PersisterAuditClientService persisterAuditClientService;

    @MockBean
    private TopicMap topicMap;



    @Test
    void testGenerateAuditLogsWithError() {
        when(auditUtil.getSemVer((String) any())).thenReturn(Version.forIntegers(1));
        when(topicMap.getTopicMap()).thenThrow(new CustomException("$.RequestInfo.ver", "An error occurred"));
        assertThrows(CustomException.class,
                () -> persisterAuditClientService.generateAuditLogs(new PersisterClientInput("Topic", "Json")));
        verify(topicMap).getTopicMap();
    }

    @Test
    void testGetRowData() {
        ArrayList<JsonMap> jsonMaps = new ArrayList<>();

        Mapping mapping = new Mapping();
        mapping.setAuditAttributeBasePath("Audit Attribute Base Path");
        mapping.setDescription("The characteristics of someone or something");
        mapping.setFromTopic("jane.doe@example.org");
        mapping.setIsAuditEnabled(true);
        mapping.setIsBatch(true);
        mapping.setIsTransaction(true);
        mapping.setModule("Module");
        mapping.setName("Name");
        mapping.setObjecIdJsonPath("Objec Id Json Path");
        mapping.setQueryMaps(new ArrayList<>());
        mapping.setTenantIdJsonPath("Tenant Id Json Path");
        mapping.setTransactionCodeJsonPath("Transaction Code Json Path");
        mapping.setVersion("1.0.2");
        assertThrows(CustomException.class,
                () -> persisterAuditClientService.getRowData(jsonMaps, "Json Obj", "Base Json Path", mapping));
    }

    @Test
    void testGetRowDataWithAuditBasePath() {
        ArrayList<JsonMap> jsonMaps = new ArrayList<>();
        Mapping mapping = mock(Mapping.class);
        when(mapping.getAuditAttributeBasePath()).thenReturn("Audit Attribute Base Path");
        doNothing().when(mapping).setAuditAttributeBasePath((String) any());
        doNothing().when(mapping).setDescription((String) any());
        doNothing().when(mapping).setFromTopic((String) any());
        doNothing().when(mapping).setIsAuditEnabled((Boolean) any());
        doNothing().when(mapping).setIsBatch((Boolean) any());
        doNothing().when(mapping).setIsTransaction((Boolean) any());
        doNothing().when(mapping).setModule((String) any());
        doNothing().when(mapping).setName((String) any());
        doNothing().when(mapping).setObjecIdJsonPath((String) any());
        doNothing().when(mapping).setQueryMaps((List<QueryMap>) any());
        doNothing().when(mapping).setTenantIdJsonPath((String) any());
        doNothing().when(mapping).setTransactionCodeJsonPath((String) any());
        doNothing().when(mapping).setVersion((String) any());
        mapping.setAuditAttributeBasePath("Audit Attribute Base Path");
        mapping.setDescription("The characteristics of someone or something");
        mapping.setFromTopic("jane.doe@example.org");
        mapping.setIsAuditEnabled(true);
        mapping.setIsBatch(true);
        mapping.setIsTransaction(true);
        mapping.setModule("Module");
        mapping.setName("Name");
        mapping.setObjecIdJsonPath("Objec Id Json Path");
        mapping.setQueryMaps(new ArrayList<>());
        mapping.setTenantIdJsonPath("Tenant Id Json Path");
        mapping.setTransactionCodeJsonPath("Transaction Code Json Path");
        mapping.setVersion("1.0.2");
        assertThrows(CustomException.class,
                () -> persisterAuditClientService.getRowData(jsonMaps, "Json Obj", "Base Json Path", mapping));
        verify(mapping).getAuditAttributeBasePath();
        verify(mapping).setAuditAttributeBasePath((String) any());
        verify(mapping).setDescription((String) any());
        verify(mapping).setFromTopic((String) any());
        verify(mapping).setIsAuditEnabled((Boolean) any());
        verify(mapping).setIsBatch((Boolean) any());
        verify(mapping).setIsTransaction((Boolean) any());
        verify(mapping).setModule((String) any());
        verify(mapping).setName((String) any());
        verify(mapping).setObjecIdJsonPath((String) any());
        verify(mapping).setQueryMaps((List<QueryMap>) any());
        verify(mapping).setTenantIdJsonPath((String) any());
        verify(mapping).setTransactionCodeJsonPath((String) any());
        verify(mapping).setVersion((String) any());
    }
}

