package org.egov.demand.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.util.ArrayList;
import java.util.List;

import org.egov.demand.amendment.model.Amendment;
import org.egov.demand.amendment.model.AmendmentCriteria;
import org.egov.demand.amendment.model.AmendmentRequest;
import org.egov.demand.amendment.model.AmendmentUpdate;
import org.egov.demand.amendment.model.Document;
import org.egov.demand.amendment.model.ProcessInstance;
import org.egov.demand.amendment.model.enums.AmendmentReason;
import org.egov.demand.amendment.model.enums.AmendmentStatus;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.repository.querybuilder.AmendmentQueryBuilder;
import org.egov.demand.repository.rowmapper.AmendmentRowMapper;
import org.egov.demand.util.Util;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AmendmentRepository.class})
@ExtendWith(SpringExtension.class)
class AmendmentRepositoryTest {
    @MockBean
    private AmendmentQueryBuilder amendmentQueryBuilder;

    @Autowired
    private AmendmentRepository amendmentRepository;

    @MockBean
    private AmendmentRowMapper amendmentRowMapper;

    @MockBean
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @MockBean
    private Util util;


    @Test
    void testSaveAmendment() throws DataAccessException {
        when(this.util.getPGObject((Object) any())).thenReturn(new PGobject());
        when(this.namedParameterJdbcTemplate.update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any())).thenReturn(1);
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        Amendment amendment = new Amendment();
        amendment.setAmendmentReason(AmendmentReason.COURT_CASE_SETTLEMENT);
        AmendmentRequest amendmentRequest = mock(AmendmentRequest.class);
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        ArrayList<Document> documents = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        when(amendmentRequest.getAmendment()).thenReturn(new Amendment("42", "42", "42",
                "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice, consumercode, amendmentreason,"
                        + " reasondocumentnumber, status, effectivetill, effectivefrom, amendeddemandid, createdby, createdtime,"
                        + " lastmodifiedby, lastmodifiedtime, additionaldetails) \tVALUES (:id, :tenantid, :amendmentid,"
                        + " :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status, :effectivetill,"
                        + " :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime,"
                        + " :additionaldetails);",
                "42",
                "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice, consumercode, amendmentreason,"
                        + " reasondocumentnumber, status, effectivetill, effectivefrom, amendeddemandid, createdby, createdtime,"
                        + " lastmodifiedby, lastmodifiedtime, additionaldetails) \tVALUES (:id, :tenantid, :amendmentid,"
                        + " :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status, :effectivetill,"
                        + " :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime,"
                        + " :additionaldetails);",
                AmendmentReason.COURT_CASE_SETTLEMENT, "Just cause", AmendmentStatus.ACTIVE, workflow, demandDetails, documents,
                1L, 1L, auditDetails, MissingNode.getInstance()));
        doNothing().when(amendmentRequest).setAmendment((Amendment) any());
        amendmentRequest.setAmendment(amendment);
        this.amendmentRepository.saveAmendment(amendmentRequest);
        verify(this.util).getPGObject((Object) any());
        verify(this.namedParameterJdbcTemplate).update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any());
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
        verify(amendmentRequest, atLeast(1)).getAmendment();
        verify(amendmentRequest).setAmendment((Amendment) any());
    }


    @Test
    void testSaveAmendmentWithCOURT_CASE_SETTLEMENT() throws DataAccessException {
        when(this.util.getPGObject((Object) any())).thenReturn(new PGobject());
        when(this.namedParameterJdbcTemplate.update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any())).thenReturn(1);
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        Amendment amendment = new Amendment();
        amendment.setAmendmentReason(AmendmentReason.COURT_CASE_SETTLEMENT);

        ArrayList<DemandDetail> demandDetailList = new ArrayList<>();
        demandDetailList.add(new DemandDetail());
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<Document> documents = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        AmendmentRequest amendmentRequest = mock(AmendmentRequest.class);
        when(amendmentRequest.getAmendment()).thenReturn(new Amendment("42", "42", "42",
                "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice, consumercode, amendmentreason,"
                        + " reasondocumentnumber, status, effectivetill, effectivefrom, amendeddemandid, createdby, createdtime,"
                        + " lastmodifiedby, lastmodifiedtime, additionaldetails) \tVALUES (:id, :tenantid, :amendmentid,"
                        + " :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status, :effectivetill,"
                        + " :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime,"
                        + " :additionaldetails);",
                "42",
                "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice, consumercode, amendmentreason,"
                        + " reasondocumentnumber, status, effectivetill, effectivefrom, amendeddemandid, createdby, createdtime,"
                        + " lastmodifiedby, lastmodifiedtime, additionaldetails) \tVALUES (:id, :tenantid, :amendmentid,"
                        + " :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status, :effectivetill,"
                        + " :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime,"
                        + " :additionaldetails);",
                AmendmentReason.COURT_CASE_SETTLEMENT, "Just cause", AmendmentStatus.ACTIVE, workflow, demandDetailList,
                documents, 1L, 1L, auditDetails, MissingNode.getInstance()));
        doNothing().when(amendmentRequest).setAmendment((Amendment) any());
        amendmentRequest.setAmendment(amendment);
        this.amendmentRepository.saveAmendment(amendmentRequest);
        verify(this.util).getPGObject((Object) any());
        verify(this.namedParameterJdbcTemplate).update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any());
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
        verify(amendmentRequest, atLeast(1)).getAmendment();
        verify(amendmentRequest).setAmendment((Amendment) any());
    }


    @Test
    void testSaveAmendmentAmendmentStatusACTIVE() throws DataAccessException {
        when(this.util.getPGObject((Object) any())).thenReturn(new PGobject());
        when(this.namedParameterJdbcTemplate.update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any())).thenReturn(1);
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        Amendment amendment = new Amendment();
        amendment.setAmendmentReason(AmendmentReason.COURT_CASE_SETTLEMENT);

        ArrayList<Document> documentList = new ArrayList<>();
        documentList.add(new Document());
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        AmendmentRequest amendmentRequest = mock(AmendmentRequest.class);
        when(amendmentRequest.getAmendment()).thenReturn(new Amendment("42", "42", "42",
                "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice, consumercode, amendmentreason,"
                        + " reasondocumentnumber, status, effectivetill, effectivefrom, amendeddemandid, createdby, createdtime,"
                        + " lastmodifiedby, lastmodifiedtime, additionaldetails) \tVALUES (:id, :tenantid, :amendmentid,"
                        + " :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status, :effectivetill,"
                        + " :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime,"
                        + " :additionaldetails);",
                "42",
                "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice, consumercode, amendmentreason,"
                        + " reasondocumentnumber, status, effectivetill, effectivefrom, amendeddemandid, createdby, createdtime,"
                        + " lastmodifiedby, lastmodifiedtime, additionaldetails) \tVALUES (:id, :tenantid, :amendmentid,"
                        + " :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status, :effectivetill,"
                        + " :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime,"
                        + " :additionaldetails);",
                AmendmentReason.COURT_CASE_SETTLEMENT, "Just cause", AmendmentStatus.ACTIVE, workflow, demandDetails,
                documentList, 1L, 1L, auditDetails, MissingNode.getInstance()));
        doNothing().when(amendmentRequest).setAmendment((Amendment) any());
        amendmentRequest.setAmendment(amendment);
        this.amendmentRepository.saveAmendment(amendmentRequest);
        verify(this.util).getPGObject((Object) any());
        verify(this.namedParameterJdbcTemplate).update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any());
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
        verify(amendmentRequest, atLeast(1)).getAmendment();
        verify(amendmentRequest).setAmendment((Amendment) any());
    }


    @Test
    void testSaveAmendmentwithdateandtime() throws DataAccessException {
        when(this.util.getPGObject((Object) any())).thenReturn(new PGobject());
        when(this.namedParameterJdbcTemplate.update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any())).thenReturn(1);
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        Amendment amendment = new Amendment();
        amendment.setAmendmentReason(AmendmentReason.COURT_CASE_SETTLEMENT);
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getCreatedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getCreatedBy()).thenReturn("Jan 1, 2020 8:00am GMT+0100");
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        ArrayList<Document> documents = new ArrayList<>();
        AmendmentRequest amendmentRequest = mock(AmendmentRequest.class);
        when(amendmentRequest.getAmendment()).thenReturn(new Amendment("42", "42", "42",
                "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice, consumercode, amendmentreason,"
                        + " reasondocumentnumber, status, effectivetill, effectivefrom, amendeddemandid, createdby, createdtime,"
                        + " lastmodifiedby, lastmodifiedtime, additionaldetails) \tVALUES (:id, :tenantid, :amendmentid,"
                        + " :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status, :effectivetill,"
                        + " :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime,"
                        + " :additionaldetails);",
                "42",
                "INSERT INTO egbs_amendment (id, tenantid, amendmentid, businessservice, consumercode, amendmentreason,"
                        + " reasondocumentnumber, status, effectivetill, effectivefrom, amendeddemandid, createdby, createdtime,"
                        + " lastmodifiedby, lastmodifiedtime, additionaldetails) \tVALUES (:id, :tenantid, :amendmentid,"
                        + " :businessservice, :consumercode, :amendmentreason, :reasondocumentnumber, :status, :effectivetill,"
                        + " :effectivefrom, :amendeddemandid, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime,"
                        + " :additionaldetails);",
                AmendmentReason.COURT_CASE_SETTLEMENT, "Just cause", AmendmentStatus.ACTIVE, workflow, demandDetails, documents,
                1L, 1L, auditDetails, MissingNode.getInstance()));
        doNothing().when(amendmentRequest).setAmendment((Amendment) any());
        amendmentRequest.setAmendment(amendment);
        this.amendmentRepository.saveAmendment(amendmentRequest);
        verify(this.util).getPGObject((Object) any());
        verify(this.namedParameterJdbcTemplate).update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any());
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
        verify(amendmentRequest, atLeast(1)).getAmendment();
        verify(amendmentRequest).setAmendment((Amendment) any());
        verify(auditDetails).getCreatedTime();
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getCreatedBy();
        verify(auditDetails).getLastModifiedBy();
    }


    @Test
    void testGetAmendments() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
        when(this.amendmentQueryBuilder.getSearchQuery((AmendmentCriteria) any(),
                (org.springframework.jdbc.core.namedparam.MapSqlParameterSource) any())).thenReturn("Search Query");
        List<Amendment> actualAmendments = this.amendmentRepository.getAmendments(new AmendmentCriteria());
        assertSame(objectList, actualAmendments);
        assertTrue(actualAmendments.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.amendmentQueryBuilder).getSearchQuery((AmendmentCriteria) any(),
                (org.springframework.jdbc.core.namedparam.MapSqlParameterSource) any());
    }


    @Test
    void testUpdateAmendment() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.amendmentRepository.updateAmendment(new ArrayList<>());
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }


    @Test
    void testUpdateAmendment4() {
        when(this.util.getPGObject((Object) any())).thenReturn(new PGobject());
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        ProcessInstance workflow = new ProcessInstance();
        AmendmentUpdate amendmentUpdate = new AmendmentUpdate("42", "42", "42", auditDetails, additionalDetails, workflow,
                AmendmentStatus.ACTIVE, new ArrayList<>(), AmendmentReason.COURT_CASE_SETTLEMENT, "123456",
                Long.parseLong("16710091300"), Long.parseLong("16710091300"));
        amendmentUpdate.setStatus(AmendmentStatus.ACTIVE);
        ArrayList<AmendmentUpdate> amendmentUpdateList = new ArrayList<>();
        amendmentUpdateList.add(amendmentUpdate);
        this.amendmentRepository.updateAmendment(amendmentUpdateList);
        verify(this.util).getPGObject((Object) any());
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }


    @Test
    void testUpdateAmendmentWithTimeanddate() {
        when(this.util.getPGObject((Object) any())).thenReturn(new PGobject());
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        MissingNode additionalDetails = MissingNode.getInstance();
        ProcessInstance workflow = new ProcessInstance();

        AmendmentUpdate amendmentUpdate = new AmendmentUpdate("42", "42", "42", auditDetails, additionalDetails, workflow,
                AmendmentStatus.ACTIVE, new ArrayList<>(), AmendmentReason.COURT_CASE_SETTLEMENT, "123456",
                Long.parseLong("16710091300"), Long.parseLong("16710091300"));
        amendmentUpdate.setStatus(AmendmentStatus.ACTIVE);

        ArrayList<AmendmentUpdate> amendmentUpdateList = new ArrayList<>();
        amendmentUpdateList.add(amendmentUpdate);
        this.amendmentRepository.updateAmendment(amendmentUpdateList);
        verify(this.util).getPGObject((Object) any());
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getLastModifiedBy();
    }


    @Test
    void testGetAmendmentSqlParameter() {
        when(this.util.getPGObject((Object) any())).thenReturn(new PGobject());

        Amendment amendment = new Amendment();
        amendment.setAmendmentReason(AmendmentReason.COURT_CASE_SETTLEMENT);
        AmendmentRequest amendmentRequest = mock(AmendmentRequest.class);
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        ArrayList<Document> documents = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        when(amendmentRequest.getAmendment()).thenReturn(new Amendment("42", "42", "42", "id", "42", "id",
                AmendmentReason.COURT_CASE_SETTLEMENT, "Just cause", AmendmentStatus.ACTIVE, workflow, demandDetails, documents,
                1L, 1L, auditDetails, MissingNode.getInstance()));
        doNothing().when(amendmentRequest).setAmendment((Amendment) any());
        amendmentRequest.setAmendment(amendment);
        assertEquals(Short.SIZE,
                this.amendmentRepository.getAmendmentSqlParameter(amendmentRequest).getParameterNames().length);
        verify(this.util).getPGObject((Object) any());
        verify(amendmentRequest).getAmendment();
        verify(amendmentRequest).setAmendment((Amendment) any());
    }


    @Test
    void testGetAmendmentSqlParameterWIthDate() {
        when(this.util.getPGObject((Object) any())).thenReturn(new PGobject());

        Amendment amendment = new Amendment();
        amendment.setAmendmentReason(AmendmentReason.COURT_CASE_SETTLEMENT);
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getCreatedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getCreatedBy()).thenReturn("Jan 1, 2020 8:00am GMT+0100");
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        ProcessInstance workflow = new ProcessInstance();
        ArrayList<DemandDetail> demandDetails = new ArrayList<>();
        ArrayList<Document> documents = new ArrayList<>();
        AmendmentRequest amendmentRequest = mock(AmendmentRequest.class);
        when(amendmentRequest.getAmendment()).thenReturn(new Amendment("42", "42", "42", "id", "42", "id",
                AmendmentReason.COURT_CASE_SETTLEMENT, "Just cause", AmendmentStatus.ACTIVE, workflow, demandDetails, documents,
                1L, 1L, auditDetails, MissingNode.getInstance()));
        doNothing().when(amendmentRequest).setAmendment((Amendment) any());
        amendmentRequest.setAmendment(amendment);
        assertEquals(Short.SIZE,
                this.amendmentRepository.getAmendmentSqlParameter(amendmentRequest).getParameterNames().length);
        verify(this.util).getPGObject((Object) any());
        verify(amendmentRequest).getAmendment();
        verify(amendmentRequest).setAmendment((Amendment) any());
        verify(auditDetails).getCreatedTime();
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getCreatedBy();
        verify(auditDetails).getLastModifiedBy();
    }
}

