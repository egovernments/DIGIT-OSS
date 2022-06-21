package org.egov.collection.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.egov.collection.web.contract.CollectionConfigGetRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {CollectionConfigQueryBuilder.class})
@ExtendWith(SpringExtension.class)
class CollectionConfigQueryBuilderTest {
    @Autowired
    private CollectionConfigQueryBuilder collectionConfigQueryBuilder;

    @Test
    void testGetQuery() {
        CollectionConfigGetRequest collectionConfigGetRequest = new CollectionConfigGetRequest();
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                        + " ON c.id = cv.keyid ORDER BY keyname ASC LIMIT ? OFFSET ?",
                this.collectionConfigQueryBuilder.getQuery(collectionConfigGetRequest, objectList));
        assertEquals(2, objectList.size());
    }

    @Test
    void testGetQuery3() {
        ArrayList<Long> id = new ArrayList<>();
        LocalDateTime atStartOfDayResult = LocalDate.of(1970, 1, 1).atStartOfDay();
        CollectionConfigGetRequest collectionConfigGetRequest = new CollectionConfigGetRequest(id,
                "SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                        + " ON c.id = cv.keyid",
                Date.from(atStartOfDayResult.atZone(ZoneId.of("UTC")).toInstant()),
                "SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                        + " ON c.id = cv.keyid",
                "asc", "42", (short) 500, (short) 500);

        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                        + " ON c.id = cv.keyid WHERE cv.tenantId = ? AND c.id IN () AND c.keyname = ? AND cv.effectiveFrom = ?"
                        + " ORDER BY SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues"
                        + " cv ON c.id = cv.keyid asc LIMIT ? OFFSET ?",
                this.collectionConfigQueryBuilder.getQuery(collectionConfigGetRequest, objectList));
        assertEquals(5, objectList.size());
    }

    @Test
    void testGetQuery4() {
        CollectionConfigGetRequest collectionConfigGetRequest = mock(CollectionConfigGetRequest.class);
        when(collectionConfigGetRequest.getPageNumber()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getPageSize()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getName()).thenReturn("Name");
        when(collectionConfigGetRequest.getSortBy()).thenReturn("Sort By");
        when(collectionConfigGetRequest.getSortOrder()).thenReturn("asc");
        when(collectionConfigGetRequest.getTenantId()).thenReturn("42");
        LocalDateTime atStartOfDayResult = LocalDate.of(1970, 1, 1).atStartOfDay();
        when(collectionConfigGetRequest.getEffectiveFrom())
                .thenReturn(Date.from(atStartOfDayResult.atZone(ZoneId.of("UTC")).toInstant()));
        when(collectionConfigGetRequest.getId()).thenReturn(new ArrayList<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                        + " ON c.id = cv.keyid WHERE cv.tenantId = ? AND c.id IN () AND c.keyname = ? AND cv.effectiveFrom = ?"
                        + " ORDER BY Sort By asc LIMIT ? OFFSET ?",
                this.collectionConfigQueryBuilder.getQuery(collectionConfigGetRequest, objectList));
        verify(collectionConfigGetRequest, atLeast(1)).getPageNumber();
        verify(collectionConfigGetRequest, atLeast(1)).getPageSize();
        verify(collectionConfigGetRequest, atLeast(1)).getName();
        verify(collectionConfigGetRequest, atLeast(1)).getSortBy();
        verify(collectionConfigGetRequest, atLeast(1)).getSortOrder();
        verify(collectionConfigGetRequest, atLeast(1)).getTenantId();
        verify(collectionConfigGetRequest, atLeast(1)).getEffectiveFrom();
        verify(collectionConfigGetRequest, atLeast(1)).getId();
        assertEquals(5, objectList.size());
    }

    @Test
    void testGetQuery5() {
        CollectionConfigGetRequest collectionConfigGetRequest = mock(CollectionConfigGetRequest.class);
        when(collectionConfigGetRequest.getPageNumber()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getPageSize()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getName()).thenReturn(null);
        when(collectionConfigGetRequest.getSortBy()).thenReturn("Sort By");
        when(collectionConfigGetRequest.getSortOrder()).thenReturn("asc");
        when(collectionConfigGetRequest.getTenantId()).thenReturn("42");
        LocalDateTime atStartOfDayResult = LocalDate.of(1970, 1, 1).atStartOfDay();
        when(collectionConfigGetRequest.getEffectiveFrom())
                .thenReturn(Date.from(atStartOfDayResult.atZone(ZoneId.of("UTC")).toInstant()));
        when(collectionConfigGetRequest.getId()).thenReturn(new ArrayList<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                + " ON c.id = cv.keyid WHERE cv.tenantId = ? AND c.id IN () AND cv.effectiveFrom = ? ORDER BY Sort By asc"
                + " LIMIT ? OFFSET ?", this.collectionConfigQueryBuilder.getQuery(collectionConfigGetRequest, objectList));
        verify(collectionConfigGetRequest, atLeast(1)).getPageNumber();
        verify(collectionConfigGetRequest, atLeast(1)).getPageSize();
        verify(collectionConfigGetRequest).getName();
        verify(collectionConfigGetRequest, atLeast(1)).getSortBy();
        verify(collectionConfigGetRequest, atLeast(1)).getSortOrder();
        verify(collectionConfigGetRequest, atLeast(1)).getTenantId();
        verify(collectionConfigGetRequest, atLeast(1)).getEffectiveFrom();
        verify(collectionConfigGetRequest, atLeast(1)).getId();
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetQuery6() {
        CollectionConfigGetRequest collectionConfigGetRequest = mock(CollectionConfigGetRequest.class);
        when(collectionConfigGetRequest.getPageNumber()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getPageSize()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getName()).thenReturn("Name");
        when(collectionConfigGetRequest.getSortBy()).thenReturn("Sort By");
        when(collectionConfigGetRequest.getSortOrder()).thenReturn("asc");
        when(collectionConfigGetRequest.getTenantId()).thenReturn(null);
        LocalDateTime atStartOfDayResult = LocalDate.of(1970, 1, 1).atStartOfDay();
        when(collectionConfigGetRequest.getEffectiveFrom())
                .thenReturn(Date.from(atStartOfDayResult.atZone(ZoneId.of("UTC")).toInstant()));
        when(collectionConfigGetRequest.getId()).thenReturn(new ArrayList<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                + " ON c.id = cv.keyid WHERE c.id IN () AND c.keyname = ? AND cv.effectiveFrom = ? ORDER BY Sort By asc"
                + " LIMIT ? OFFSET ?", this.collectionConfigQueryBuilder.getQuery(collectionConfigGetRequest, objectList));
        verify(collectionConfigGetRequest, atLeast(1)).getPageNumber();
        verify(collectionConfigGetRequest, atLeast(1)).getPageSize();
        verify(collectionConfigGetRequest, atLeast(1)).getName();
        verify(collectionConfigGetRequest, atLeast(1)).getSortBy();
        verify(collectionConfigGetRequest, atLeast(1)).getSortOrder();
        verify(collectionConfigGetRequest).getTenantId();
        verify(collectionConfigGetRequest, atLeast(1)).getEffectiveFrom();
        verify(collectionConfigGetRequest, atLeast(1)).getId();
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetQuery7() {
        CollectionConfigGetRequest collectionConfigGetRequest = mock(CollectionConfigGetRequest.class);
        when(collectionConfigGetRequest.getPageNumber()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getPageSize()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getName()).thenReturn("Name");
        when(collectionConfigGetRequest.getSortBy()).thenReturn("Sort By");
        when(collectionConfigGetRequest.getSortOrder()).thenReturn("asc");
        when(collectionConfigGetRequest.getTenantId()).thenReturn("42");
        when(collectionConfigGetRequest.getEffectiveFrom()).thenReturn(null);
        when(collectionConfigGetRequest.getId()).thenReturn(new ArrayList<>());
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals("SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                + " ON c.id = cv.keyid WHERE cv.tenantId = ? AND c.id IN () AND c.keyname = ? ORDER BY Sort By asc LIMIT"
                + " ? OFFSET ?", this.collectionConfigQueryBuilder.getQuery(collectionConfigGetRequest, objectList));
        verify(collectionConfigGetRequest, atLeast(1)).getPageNumber();
        verify(collectionConfigGetRequest, atLeast(1)).getPageSize();
        verify(collectionConfigGetRequest, atLeast(1)).getName();
        verify(collectionConfigGetRequest, atLeast(1)).getSortBy();
        verify(collectionConfigGetRequest, atLeast(1)).getSortOrder();
        verify(collectionConfigGetRequest, atLeast(1)).getTenantId();
        verify(collectionConfigGetRequest).getEffectiveFrom();
        verify(collectionConfigGetRequest, atLeast(1)).getId();
        assertEquals(4, objectList.size());
    }

    @Test
    void testGetQuery8() {
        ArrayList<Long> resultLongList = new ArrayList<>();
        resultLongList.add(4L);
        CollectionConfigGetRequest collectionConfigGetRequest = mock(CollectionConfigGetRequest.class);
        when(collectionConfigGetRequest.getPageNumber()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getPageSize()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getName()).thenReturn("Name");
        when(collectionConfigGetRequest.getSortBy()).thenReturn("Sort By");
        when(collectionConfigGetRequest.getSortOrder()).thenReturn("asc");
        when(collectionConfigGetRequest.getTenantId()).thenReturn("42");
        LocalDateTime atStartOfDayResult = LocalDate.of(1970, 1, 1).atStartOfDay();
        when(collectionConfigGetRequest.getEffectiveFrom())
                .thenReturn(Date.from(atStartOfDayResult.atZone(ZoneId.of("UTC")).toInstant()));
        when(collectionConfigGetRequest.getId()).thenReturn(resultLongList);
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                        + " ON c.id = cv.keyid WHERE cv.tenantId = ? AND c.id IN (4) AND c.keyname = ? AND cv.effectiveFrom = ?"
                        + " ORDER BY Sort By asc LIMIT ? OFFSET ?",
                this.collectionConfigQueryBuilder.getQuery(collectionConfigGetRequest, objectList));
        verify(collectionConfigGetRequest, atLeast(1)).getPageNumber();
        verify(collectionConfigGetRequest, atLeast(1)).getPageSize();
        verify(collectionConfigGetRequest, atLeast(1)).getName();
        verify(collectionConfigGetRequest, atLeast(1)).getSortBy();
        verify(collectionConfigGetRequest, atLeast(1)).getSortOrder();
        verify(collectionConfigGetRequest, atLeast(1)).getTenantId();
        verify(collectionConfigGetRequest, atLeast(1)).getEffectiveFrom();
        verify(collectionConfigGetRequest, atLeast(1)).getId();
        assertEquals(5, objectList.size());
    }

    @Test
    void testGetQuery9() {
        ArrayList<Long> resultLongList = new ArrayList<>();
        resultLongList.add(4L);
        resultLongList.add(4L);
        CollectionConfigGetRequest collectionConfigGetRequest = mock(CollectionConfigGetRequest.class);
        when(collectionConfigGetRequest.getPageNumber()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getPageSize()).thenReturn((short) 1);
        when(collectionConfigGetRequest.getName()).thenReturn("Name");
        when(collectionConfigGetRequest.getSortBy()).thenReturn("Sort By");
        when(collectionConfigGetRequest.getSortOrder()).thenReturn("asc");
        when(collectionConfigGetRequest.getTenantId()).thenReturn("42");
        LocalDateTime atStartOfDayResult = LocalDate.of(1970, 1, 1).atStartOfDay();
        when(collectionConfigGetRequest.getEffectiveFrom())
                .thenReturn(Date.from(atStartOfDayResult.atZone(ZoneId.of("UTC")).toInstant()));
        when(collectionConfigGetRequest.getId()).thenReturn(resultLongList);
        ArrayList<Object> objectList = new ArrayList<>();
        assertEquals(
                "SELECT c.keyname as key, cv.value as value FROM egcl_configuration c JOIN egcl_configurationvalues cv"
                        + " ON c.id = cv.keyid WHERE cv.tenantId = ? AND c.id IN (4, 4) AND c.keyname = ? AND cv.effectiveFrom ="
                        + " ? ORDER BY Sort By asc LIMIT ? OFFSET ?",
                this.collectionConfigQueryBuilder.getQuery(collectionConfigGetRequest, objectList));
        verify(collectionConfigGetRequest, atLeast(1)).getPageNumber();
        verify(collectionConfigGetRequest, atLeast(1)).getPageSize();
        verify(collectionConfigGetRequest, atLeast(1)).getName();
        verify(collectionConfigGetRequest, atLeast(1)).getSortBy();
        verify(collectionConfigGetRequest, atLeast(1)).getSortOrder();
        verify(collectionConfigGetRequest, atLeast(1)).getTenantId();
        verify(collectionConfigGetRequest, atLeast(1)).getEffectiveFrom();
        verify(collectionConfigGetRequest, atLeast(1)).getId();
        assertEquals(5, objectList.size());
    }
}

