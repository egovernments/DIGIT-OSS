package org.egov.egf.instrument.web.mapper;

import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.web.contract.InstrumentTypeContract;
import org.egov.egf.instrument.web.contract.InstrumentTypeSearchContract;

public class InstrumentTypeMapper {

    public InstrumentType toDomain(InstrumentTypeContract contract) {

        InstrumentType instrumentType = new InstrumentType();

        instrumentType.setId(contract.getId());

        instrumentType.setActive(contract.getActive());
        instrumentType.setDescription(contract.getDescription());
        instrumentType.setName(contract.getName());
        instrumentType.setCreatedBy(contract.getCreatedBy());
        instrumentType.setCreatedDate(contract.getCreatedDate());
        instrumentType.setLastModifiedBy(contract.getLastModifiedBy());
        instrumentType.setLastModifiedDate(contract.getLastModifiedDate());
        instrumentType.setTenantId(contract.getTenantId());

        return instrumentType;
    }

    public InstrumentTypeContract toContract(InstrumentType instrumentType) {

        InstrumentTypeContract contract = new InstrumentTypeContract();

        contract.setId(instrumentType.getId());

        contract.setActive(instrumentType.getActive());
        contract.setDescription(instrumentType.getDescription());
        contract.setName(instrumentType.getName());

        contract.setCreatedBy(instrumentType.getCreatedBy());
        contract.setCreatedDate(instrumentType.getCreatedDate());
        contract.setLastModifiedBy(instrumentType.getLastModifiedBy());
        contract.setLastModifiedDate(instrumentType.getLastModifiedDate());
        contract.setTenantId(instrumentType.getTenantId());

        return contract;
    }

    public InstrumentTypeSearch toSearchDomain(InstrumentTypeSearchContract contract) {

        InstrumentTypeSearch instrumentTypeSearch = new InstrumentTypeSearch();

        instrumentTypeSearch.setId(contract.getId());

        instrumentTypeSearch.setActive(contract.getActive());
        instrumentTypeSearch.setDescription(contract.getDescription());
        instrumentTypeSearch.setName(contract.getName());
        instrumentTypeSearch.setCreatedBy(contract.getCreatedBy());
        instrumentTypeSearch.setCreatedDate(contract.getCreatedDate());
        instrumentTypeSearch.setLastModifiedBy(contract.getLastModifiedBy());
        instrumentTypeSearch.setLastModifiedDate(contract.getLastModifiedDate());
        instrumentTypeSearch.setTenantId(contract.getTenantId());
        instrumentTypeSearch.setPageSize(contract.getPageSize());
        instrumentTypeSearch.setOffset(contract.getOffset());
        instrumentTypeSearch.setSortBy(contract.getSortBy());
        instrumentTypeSearch.setIds(contract.getIds());

        return instrumentTypeSearch;
    }

    public InstrumentTypeSearchContract toSearchContract(InstrumentTypeSearch instrumentTypeSearch) {

        InstrumentTypeSearchContract contract = new InstrumentTypeSearchContract();

        contract.setId(instrumentTypeSearch.getId());

        contract.setActive(instrumentTypeSearch.getActive());
        contract.setDescription(instrumentTypeSearch.getDescription());
        contract.setName(instrumentTypeSearch.getName());
        contract.setCreatedBy(instrumentTypeSearch.getCreatedBy());
        contract.setCreatedDate(instrumentTypeSearch.getCreatedDate());
        contract.setLastModifiedBy(instrumentTypeSearch.getLastModifiedBy());
        contract.setLastModifiedDate(instrumentTypeSearch.getLastModifiedDate());
        contract.setTenantId(instrumentTypeSearch.getTenantId());
        contract.setPageSize(instrumentTypeSearch.getPageSize());
        contract.setOffset(instrumentTypeSearch.getOffset());
        contract.setSortBy(instrumentTypeSearch.getSortBy());
        contract.setIds(instrumentTypeSearch.getIds());
        return contract;
    }

}