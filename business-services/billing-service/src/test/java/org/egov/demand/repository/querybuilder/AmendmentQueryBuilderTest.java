package org.egov.demand.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashSet;

import org.egov.demand.amendment.model.AmendmentCriteria;
import org.egov.demand.amendment.model.enums.AmendmentStatus;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AmendmentQueryBuilder.class})
@ExtendWith(SpringExtension.class)
class AmendmentQueryBuilderTest {
    @Autowired
    private AmendmentQueryBuilder amendmentQueryBuilder;


    @Test
    void testGetSearchQuery() {
        AmendmentCriteria amendmentCriteria = new AmendmentCriteria();
        MapSqlParameterSource mapSqlParameterSource = mock(MapSqlParameterSource.class);
        when(mapSqlParameterSource.addValue((String) any(), (Object) any())).thenReturn(mock(MapSqlParameterSource.class));
        assertEquals(
                "SELECT amendment.id as amendmentuuid, tenantid, amendment.amendmentid as amendmentid, businessservice,"
                        + " consumercode, amendmentreason, reasondocumentnumber, amendment.status as amendmentstatus, effectivetill,"
                        + " effectivefrom, amendeddemandid, createdby, createdtime, lastmodifiedby, lastmodifiedtime, additionaldetails,"
                        + " amdl.id as detailid, amdl.amendmentid as detailamendmentid, taxheadcode, taxamount, doc.id as docid,"
                        + " doc.amendmentid as docamendmentid, documentType, fileStoreid, documentuid, doc.status as docstatus "
                        + " FROM egbs_amendment amendment  INNER JOIN  egbs_amendment_taxdetail amdl ON amendment.id = amdl.amendmentid"
                        + " \tINNER JOIN egbs_document doc ON amendment.id = doc.amendmentid WHERE  amendment.tenantid = :tenantid"
                        + "  LIMIT :limit  OFFSET :offset",
                this.amendmentQueryBuilder.getSearchQuery(amendmentCriteria, mapSqlParameterSource));
        verify(mapSqlParameterSource, atLeast(1)).addValue((String) any(), (Object) any());
    }

}

