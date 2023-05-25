package org.egov.egf.instrument.web.mapper;

import static org.junit.Assert.assertEquals;

import org.egov.common.contract.request.User;
import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.domain.model.InstrumentAccountCodeSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeContract;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeSearchContract;
import org.egov.egf.instrument.web.contract.InstrumentTypeContract;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class InstrumentAccountCodeMapperTest {

    @InjectMocks
    private InstrumentAccountCodeMapper instrumentAccountCodeMapper;

    @Before
    public void setup() {
        instrumentAccountCodeMapper = new InstrumentAccountCodeMapper();
    }

    @Test
    public void test_to_domain() {

        InstrumentAccountCode expectedDomain = instrumentAccountCodeMapper.toDomain(contract());

        assertEquals(expectedDomain.getId(), domain().getId());
        assertEquals(expectedDomain.getInstrumentType().getId(), domain().getInstrumentType().getId());
        assertEquals(expectedDomain.getAccountCode().getId(), domain().getAccountCode().getId());
        assertEquals(expectedDomain.getCreatedBy().getId(), domain().getCreatedBy().getId());
        assertEquals(expectedDomain.getLastModifiedBy().getId(), domain().getLastModifiedBy().getId());
        assertEquals(expectedDomain.getTenantId(), domain().getTenantId());

    }

    @Test
    public void test_to_contract() {

        InstrumentAccountCodeContract expectedContract = instrumentAccountCodeMapper.toContract(domain());

        assertEquals(expectedContract.getId(), contract().getId());
        assertEquals(expectedContract.getInstrumentType().getId(), contract().getInstrumentType().getId());
        assertEquals(expectedContract.getAccountCode().getId(), contract().getAccountCode().getId());
        assertEquals(expectedContract.getCreatedBy().getId(), contract().getCreatedBy().getId());
        assertEquals(expectedContract.getLastModifiedBy().getId(), contract().getLastModifiedBy().getId());
        assertEquals(expectedContract.getTenantId(), contract().getTenantId());

    }

    @Test
    public void test_to_search_domain() {

        InstrumentAccountCodeSearch expectedSearchDomain = instrumentAccountCodeMapper.toSearchDomain(searchContract());

        assertEquals(expectedSearchDomain.getId(), searchDomain().getId());
        assertEquals(expectedSearchDomain.getInstrumentType().getId(), searchDomain().getInstrumentType().getId());
        assertEquals(expectedSearchDomain.getAccountCode().getId(), searchDomain().getAccountCode().getId());
        assertEquals(expectedSearchDomain.getCreatedBy().getId(), searchDomain().getCreatedBy().getId());
        assertEquals(expectedSearchDomain.getLastModifiedBy().getId(), searchDomain().getLastModifiedBy().getId());
        assertEquals(expectedSearchDomain.getTenantId(), searchDomain().getTenantId());
        assertEquals(expectedSearchDomain.getPageSize(), searchDomain().getPageSize());
        assertEquals(expectedSearchDomain.getOffset(), searchDomain().getOffset());
    }

    @Test
    public void test_to_search_contract() {

        InstrumentAccountCodeSearchContract expectedSearchContract = instrumentAccountCodeMapper
                .toSearchContract(searchDomain());

        assertEquals(expectedSearchContract.getId(), searchContract().getId());
        assertEquals(expectedSearchContract.getInstrumentType().getId(), searchContract().getInstrumentType().getId());
        assertEquals(expectedSearchContract.getAccountCode().getId(), searchContract().getAccountCode().getId());
        assertEquals(expectedSearchContract.getCreatedBy().getId(), searchContract().getCreatedBy().getId());
        assertEquals(expectedSearchContract.getLastModifiedBy().getId(), searchContract().getLastModifiedBy().getId());
        assertEquals(expectedSearchContract.getTenantId(), searchContract().getTenantId());
        assertEquals(expectedSearchContract.getPageSize(), searchContract().getPageSize());
        assertEquals(expectedSearchContract.getOffset(), searchContract().getOffset());

    }

    public InstrumentAccountCode domain() {

        InstrumentAccountCode instrumentAccountCode = new InstrumentAccountCode();

        instrumentAccountCode.setId("id");
        instrumentAccountCode.setInstrumentType(InstrumentType.builder().id("id").build());
        instrumentAccountCode.setAccountCode(ChartOfAccountContract.builder().id("id").build());
        instrumentAccountCode.setCreatedBy(User.builder().id(1l).build());
        instrumentAccountCode.setLastModifiedBy(User.builder().id(1l).build());
        instrumentAccountCode.setTenantId("tenantId");

        return instrumentAccountCode;
    }

    public InstrumentAccountCodeContract contract() {

        InstrumentAccountCodeContract contract = new InstrumentAccountCodeContract();

        contract.setId("id");
        contract.setInstrumentType(InstrumentTypeContract.builder().id("id").build());
        contract.setAccountCode(ChartOfAccountContract.builder().id("id").build());
        contract.setCreatedBy(User.builder().id(1l).build());
        contract.setLastModifiedBy(User.builder().id(1l).build());
        contract.setTenantId("tenantId");

        return contract;
    }

    public InstrumentAccountCodeSearch searchDomain() {

        InstrumentAccountCodeSearch instrumentAccountCodeSearch = new InstrumentAccountCodeSearch();

        instrumentAccountCodeSearch.setId("id");
        instrumentAccountCodeSearch.setInstrumentType(InstrumentType.builder().id("id").build());
        instrumentAccountCodeSearch.setAccountCode(ChartOfAccountContract.builder().id("id").build());
        instrumentAccountCodeSearch.setCreatedBy(User.builder().id(1l).build());
        instrumentAccountCodeSearch.setLastModifiedBy(User.builder().id(1l).build());
        instrumentAccountCodeSearch.setTenantId("tenantId");
        instrumentAccountCodeSearch.setPageSize(1);
        instrumentAccountCodeSearch.setOffset(1);

        return instrumentAccountCodeSearch;
    }

    public InstrumentAccountCodeSearchContract searchContract() {

        InstrumentAccountCodeSearchContract contract = new InstrumentAccountCodeSearchContract();

        contract.setId("id");
        contract.setInstrumentType(InstrumentTypeContract.builder().id("id").build());
        contract.setAccountCode(ChartOfAccountContract.builder().id("id").build());
        contract.setCreatedBy(User.builder().id(1l).build());
        contract.setLastModifiedBy(User.builder().id(1l).build());
        contract.setTenantId("tenantId");
        contract.setPageSize(1);
        contract.setOffset(1);

        return contract;
    }

}
