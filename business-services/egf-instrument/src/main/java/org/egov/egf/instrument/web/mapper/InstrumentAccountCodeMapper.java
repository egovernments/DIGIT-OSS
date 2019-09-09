package org.egov.egf.instrument.web.mapper;

import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.domain.model.InstrumentAccountCodeSearch;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeContract;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeSearchContract;

public class InstrumentAccountCodeMapper {

    private InstrumentTypeMapper typeMapper = new InstrumentTypeMapper();

    public InstrumentAccountCode toDomain(InstrumentAccountCodeContract contract) {

        InstrumentAccountCode instrumentAccountCode = new InstrumentAccountCode();

        instrumentAccountCode.setId(contract.getId());

        if (contract.getInstrumentType() != null)
            instrumentAccountCode.setInstrumentType(typeMapper.toDomain(contract.getInstrumentType()));

        if (contract.getAccountCode() != null)
            instrumentAccountCode.setAccountCode(contract.getAccountCode());

        instrumentAccountCode.setCreatedBy(contract.getCreatedBy());
        instrumentAccountCode.setCreatedDate(contract.getCreatedDate());
        instrumentAccountCode.setLastModifiedBy(contract.getLastModifiedBy());
        instrumentAccountCode.setLastModifiedDate(contract.getLastModifiedDate());
        instrumentAccountCode.setTenantId(contract.getTenantId());

        return instrumentAccountCode;
    }

    public InstrumentAccountCodeContract toContract(InstrumentAccountCode instrumentAccountCode) {

        InstrumentAccountCodeContract contract = new InstrumentAccountCodeContract();

        contract.setId(instrumentAccountCode.getId());

        if (instrumentAccountCode.getInstrumentType() != null)
            contract.setInstrumentType(typeMapper.toContract(instrumentAccountCode.getInstrumentType()));

        if (instrumentAccountCode.getAccountCode() != null)
            contract.setAccountCode(instrumentAccountCode.getAccountCode());

        contract.setCreatedBy(instrumentAccountCode.getCreatedBy());
        contract.setCreatedDate(instrumentAccountCode.getCreatedDate());
        contract.setLastModifiedBy(instrumentAccountCode.getLastModifiedBy());
        contract.setLastModifiedDate(instrumentAccountCode.getLastModifiedDate());
        contract.setTenantId(instrumentAccountCode.getTenantId());

        return contract;
    }

    public InstrumentAccountCodeSearch toSearchDomain(InstrumentAccountCodeSearchContract contract) {

        InstrumentAccountCodeSearch instrumentAccountCodeSearch = new InstrumentAccountCodeSearch();

        instrumentAccountCodeSearch.setId(contract.getId());

        if (contract.getInstrumentType() != null)
            instrumentAccountCodeSearch.setInstrumentType(typeMapper.toDomain(contract.getInstrumentType()));

        if (contract.getAccountCode() != null)
            instrumentAccountCodeSearch.setAccountCode(contract.getAccountCode());

        instrumentAccountCodeSearch.setCreatedBy(contract.getCreatedBy());
        instrumentAccountCodeSearch.setCreatedDate(contract.getCreatedDate());
        instrumentAccountCodeSearch.setLastModifiedBy(contract.getLastModifiedBy());
        instrumentAccountCodeSearch.setLastModifiedDate(contract.getLastModifiedDate());
        instrumentAccountCodeSearch.setTenantId(contract.getTenantId());
        instrumentAccountCodeSearch.setPageSize(contract.getPageSize());
        instrumentAccountCodeSearch.setOffset(contract.getOffset());
        instrumentAccountCodeSearch.setSortBy(contract.getSortBy());
        instrumentAccountCodeSearch.setIds(contract.getIds());

        return instrumentAccountCodeSearch;
    }

    public InstrumentAccountCodeSearchContract toSearchContract(
            InstrumentAccountCodeSearch instrumentAccountCodeSearch) {

        InstrumentAccountCodeSearchContract contract = new InstrumentAccountCodeSearchContract();

        contract.setId(instrumentAccountCodeSearch.getId());

        if (instrumentAccountCodeSearch.getInstrumentType() != null)
            contract.setInstrumentType(typeMapper.toContract(instrumentAccountCodeSearch.getInstrumentType()));

        if (instrumentAccountCodeSearch.getAccountCode() != null)
            contract.setAccountCode(instrumentAccountCodeSearch.getAccountCode());

        contract.setCreatedBy(instrumentAccountCodeSearch.getCreatedBy());
        contract.setCreatedDate(instrumentAccountCodeSearch.getCreatedDate());
        contract.setLastModifiedBy(instrumentAccountCodeSearch.getLastModifiedBy());
        contract.setLastModifiedDate(instrumentAccountCodeSearch.getLastModifiedDate());
        contract.setTenantId(instrumentAccountCodeSearch.getTenantId());
        contract.setPageSize(instrumentAccountCodeSearch.getPageSize());
        contract.setOffset(instrumentAccountCodeSearch.getOffset());
        contract.setSortBy(instrumentAccountCodeSearch.getSortBy());
        contract.setIds(instrumentAccountCodeSearch.getIds());

        return contract;
    }

}