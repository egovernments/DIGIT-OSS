package org.egov.demand.util;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {SequenceGenService.class})
@ExtendWith(SpringExtension.class)
class SequenceGenServiceTest {
    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SequenceGenService sequenceGenService;


    @Test
    void testGetIds() throws DataAccessException {
        ArrayList<String> stringList = new ArrayList<>();
        when(this.jdbcTemplate.queryForList((String) any(), (Object[]) any(), (Class<String>) any()))
                .thenReturn(stringList);
        List<String> actualIds = this.sequenceGenService.getIds(3, "Sequence Name");
        assertSame(stringList, actualIds);
        assertTrue(actualIds.isEmpty());
        verify(this.jdbcTemplate).queryForList((String) any(), (Object[]) any(), (Class<String>) any());
    }
}

