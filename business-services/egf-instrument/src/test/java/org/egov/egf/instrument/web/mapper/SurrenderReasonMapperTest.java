package org.egov.egf.instrument.web.mapper;

import static org.junit.Assert.assertEquals;

import org.egov.common.contract.request.User;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.web.contract.SurrenderReasonContract;
import org.egov.egf.instrument.web.contract.SurrenderReasonSearchContract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class SurrenderReasonMapperTest {

    @InjectMocks
    private SurrenderReasonMapper surrenderReasonMapper;

    @Before
    public void setup() {
        surrenderReasonMapper = new SurrenderReasonMapper();
    }

    @Test
    public void test_to_domain() {

        SurrenderReason expectedDomain = surrenderReasonMapper.toDomain(contract());

        assertEquals(expectedDomain.getId(), domain().getId());
        assertEquals(expectedDomain.getDescription(), domain().getDescription());
        assertEquals(expectedDomain.getName(), domain().getName());
        assertEquals(expectedDomain.getCreatedBy().getId(), domain().getCreatedBy().getId());
        assertEquals(expectedDomain.getLastModifiedBy().getId(), domain().getLastModifiedBy().getId());
        assertEquals(expectedDomain.getTenantId(), domain().getTenantId());

    }

    @Test
    public void test_to_contract() {

        SurrenderReasonContract expectedContract = surrenderReasonMapper.toContract(domain());

        assertEquals(expectedContract.getId(), contract().getId());
        assertEquals(expectedContract.getDescription(), contract().getDescription());
        assertEquals(expectedContract.getName(), contract().getName());
        assertEquals(expectedContract.getCreatedBy().getId(), contract().getCreatedBy().getId());
        assertEquals(expectedContract.getLastModifiedBy().getId(), contract().getLastModifiedBy().getId());
        assertEquals(expectedContract.getTenantId(), contract().getTenantId());

    }

    @Test
    public void test_to_search_domain() {

        SurrenderReasonSearch expectedSearchDomain = surrenderReasonMapper.toSearchDomain(searchContract());

        assertEquals(expectedSearchDomain.getId(), searchDomain().getId());
        assertEquals(expectedSearchDomain.getDescription(), searchDomain().getDescription());
        assertEquals(expectedSearchDomain.getName(), searchDomain().getName());
        assertEquals(expectedSearchDomain.getCreatedBy().getId(), searchDomain().getCreatedBy().getId());
        assertEquals(expectedSearchDomain.getLastModifiedBy().getId(), searchDomain().getLastModifiedBy().getId());
        assertEquals(expectedSearchDomain.getTenantId(), searchDomain().getTenantId());
        assertEquals(expectedSearchDomain.getPageSize(), searchDomain().getPageSize());
        assertEquals(expectedSearchDomain.getOffset(), searchDomain().getOffset());
    }

    @Test
    public void test_to_search_contract() {

        SurrenderReasonSearchContract expectedSearchContract = surrenderReasonMapper.toSearchContract(searchDomain());

        assertEquals(expectedSearchContract.getId(), searchContract().getId());
        assertEquals(expectedSearchContract.getDescription(), searchContract().getDescription());
        assertEquals(expectedSearchContract.getName(), searchContract().getName());
        assertEquals(expectedSearchContract.getCreatedBy().getId(), searchContract().getCreatedBy().getId());
        assertEquals(expectedSearchContract.getLastModifiedBy().getId(), searchContract().getLastModifiedBy().getId());
        assertEquals(expectedSearchContract.getTenantId(), searchContract().getTenantId());
        assertEquals(expectedSearchContract.getPageSize(), searchContract().getPageSize());
        assertEquals(expectedSearchContract.getOffset(), searchContract().getOffset());

    }

    public SurrenderReason domain() {

        SurrenderReason surrenderReason = new SurrenderReason();

        surrenderReason.setId("id");
        surrenderReason.setDescription("description");
        surrenderReason.setName("name");
        surrenderReason.setCreatedBy(User.builder().id(1l).build());
        surrenderReason.setLastModifiedBy(User.builder().id(1l).build());
        surrenderReason.setTenantId("tenantId");

        return surrenderReason;
    }

    public SurrenderReasonContract contract() {

        SurrenderReasonContract contract = new SurrenderReasonContract();

        contract.setId("id");
        contract.setDescription("description");
        contract.setName("name");
        contract.setCreatedBy(User.builder().id(1l).build());
        contract.setLastModifiedBy(User.builder().id(1l).build());
        contract.setTenantId("tenantId");

        return contract;
    }

    public SurrenderReasonSearch searchDomain() {

        SurrenderReasonSearch surrenderReasonSearch = new SurrenderReasonSearch();

        surrenderReasonSearch.setId("id");
        surrenderReasonSearch.setDescription("description");
        surrenderReasonSearch.setName("name");
        surrenderReasonSearch.setCreatedBy(User.builder().id(1l).build());
        surrenderReasonSearch.setLastModifiedBy(User.builder().id(1l).build());
        surrenderReasonSearch.setTenantId("tenantId");
        surrenderReasonSearch.setPageSize(1);
        surrenderReasonSearch.setOffset(1);

        return surrenderReasonSearch;
    }

    public SurrenderReasonSearchContract searchContract() {

        SurrenderReasonSearchContract contract = new SurrenderReasonSearchContract();

        contract.setId("id");
        contract.setDescription("description");
        contract.setName("name");
        contract.setCreatedBy(User.builder().id(1l).build());
        contract.setLastModifiedBy(User.builder().id(1l).build());
        contract.setTenantId("tenantId");
        contract.setPageSize(1);
        contract.setOffset(1);

        return contract;
    }

}
