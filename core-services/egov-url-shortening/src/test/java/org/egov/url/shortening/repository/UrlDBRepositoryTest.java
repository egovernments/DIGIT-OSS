package org.egov.url.shortening.repository;

import org.egov.url.shortening.model.ShortenRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {UrlDBRepository.class})
@ExtendWith(SpringExtension.class)
class UrlDBRepositoryTest {
    @MockBean
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UrlDBRepository urlDBRepository;

    private ShortenRequest shortenRequest;

    @Test
    void IncrementID() throws DataAccessException {
        when(this.jdbcTemplate.queryForObject((String) any(), (Object[]) any(), (Class<Long>) any())).thenReturn(1L);
        assertEquals(0L, this.urlDBRepository.incrementID().longValue());
        verify(this.jdbcTemplate).queryForObject((String) any(), (Object[]) any(), (Class<Long>) any());
    }


    @Test
    void SaveUrl() throws DataAccessException {
        when(this.jdbcTemplate.execute((String) any(),
                (org.springframework.jdbc.core.PreparedStatementCallback<Boolean>) any())).thenReturn(true);
        this.urlDBRepository.saveUrl("https://example.org/example", new ShortenRequest());
        verify(this.jdbcTemplate).execute((String) any(),
                (org.springframework.jdbc.core.PreparedStatementCallback<Boolean>) any());
    }

    @Test
    void GetUrlsuccess() throws Exception {
        when(this.jdbcTemplate.queryForObject((String) any(), (Object[]) any(), (Class<String>) any()))
                .thenReturn("Query For Object");
        assertEquals("Query For Object", this.urlDBRepository.getUrl(123L));
        verify(this.jdbcTemplate).queryForObject((String) any(), (Object[]) any(), (Class<String>) any());
    }


    @Test
    void GetUrlfail() throws Exception {
        when(this.jdbcTemplate.queryForObject((String) any(), (Object[]) any(), (Class<String>) any())).thenReturn(null);
        assertThrows(Exception.class, () -> this.urlDBRepository.getUrl(123L));
        verify(this.jdbcTemplate).queryForObject((String) any(), (Object[]) any(), (Class<String>) any());
    }
}

