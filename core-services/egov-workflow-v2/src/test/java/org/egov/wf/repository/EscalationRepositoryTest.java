package org.egov.wf.repository;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.wf.repository.querybuilder.EscalationQueryBuilder;
import org.egov.wf.web.models.EscalationSearchCriteria;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {EscalationRepository.class})
@ExtendWith(SpringExtension.class)
class EscalationRepositoryTest {
    @MockBean
    private EscalationQueryBuilder escalationQueryBuilder;

    @Autowired
    private EscalationRepository escalationRepository;

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Test
    void testGetBusinessIds() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.jdbcTemplate.query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);
        when(this.escalationQueryBuilder.getEscalationQuery((EscalationSearchCriteria) any(), (List<Object>) any()))
                .thenReturn("Escalation Query");
        List<String> actualBusinessIds = this.escalationRepository.getBusinessIds(mock(EscalationSearchCriteria.class));
        assertSame(objectList, actualBusinessIds);
        assertTrue(actualBusinessIds.isEmpty());
        verify(this.jdbcTemplate).query((String) any(), (Object[]) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
        verify(this.escalationQueryBuilder).getEscalationQuery((EscalationSearchCriteria) any(), (List<Object>) any());
    }
}

