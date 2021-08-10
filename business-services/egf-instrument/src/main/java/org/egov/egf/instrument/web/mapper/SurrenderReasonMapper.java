package org.egov.egf.instrument.web.mapper;

import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.web.contract.SurrenderReasonContract;
import org.egov.egf.instrument.web.contract.SurrenderReasonSearchContract;

public class SurrenderReasonMapper {

    public SurrenderReason toDomain(SurrenderReasonContract contract) {

        SurrenderReason surrenderReason = new SurrenderReason();

        surrenderReason.setId(contract.getId());
        surrenderReason.setName(contract.getName());
        surrenderReason.setDescription(contract.getDescription());
        surrenderReason.setCreatedBy(contract.getCreatedBy());
        surrenderReason.setCreatedDate(contract.getCreatedDate());
        surrenderReason.setLastModifiedBy(contract.getLastModifiedBy());
        surrenderReason.setLastModifiedDate(contract.getLastModifiedDate());
        surrenderReason.setTenantId(contract.getTenantId());

        return surrenderReason;
    }

    public SurrenderReasonContract toContract(SurrenderReason surrenderReason) {

        SurrenderReasonContract contract = new SurrenderReasonContract();

        contract.setId(surrenderReason.getId());
        contract.setName(surrenderReason.getName());
        contract.setDescription(surrenderReason.getDescription());
        contract.setCreatedBy(surrenderReason.getCreatedBy());
        contract.setCreatedDate(surrenderReason.getCreatedDate());
        contract.setLastModifiedBy(surrenderReason.getLastModifiedBy());
        contract.setLastModifiedDate(surrenderReason.getLastModifiedDate());
        contract.setTenantId(surrenderReason.getTenantId());

        return contract;
    }

    public SurrenderReasonSearch toSearchDomain(SurrenderReasonSearchContract contract) {

        SurrenderReasonSearch surrenderReasonSearch = new SurrenderReasonSearch();

        surrenderReasonSearch.setId(contract.getId());
        surrenderReasonSearch.setName(contract.getName());
        surrenderReasonSearch.setDescription(contract.getDescription());
        surrenderReasonSearch.setCreatedBy(contract.getCreatedBy());
        surrenderReasonSearch.setCreatedDate(contract.getCreatedDate());
        surrenderReasonSearch.setLastModifiedBy(contract.getLastModifiedBy());
        surrenderReasonSearch.setLastModifiedDate(contract.getLastModifiedDate());
        surrenderReasonSearch.setTenantId(contract.getTenantId());
        surrenderReasonSearch.setPageSize(contract.getPageSize());
        surrenderReasonSearch.setOffset(contract.getOffset());
        surrenderReasonSearch.setSortBy(contract.getSortBy());
        surrenderReasonSearch.setIds(contract.getIds());

        return surrenderReasonSearch;
    }

    public SurrenderReasonSearchContract toSearchContract(SurrenderReasonSearch surrenderReasonSearch) {

        SurrenderReasonSearchContract contract = new SurrenderReasonSearchContract();

        contract.setId(surrenderReasonSearch.getId());
        contract.setName(surrenderReasonSearch.getName());
        contract.setDescription(surrenderReasonSearch.getDescription());
        contract.setCreatedBy(surrenderReasonSearch.getCreatedBy());
        contract.setCreatedDate(surrenderReasonSearch.getCreatedDate());
        contract.setLastModifiedBy(surrenderReasonSearch.getLastModifiedBy());
        contract.setLastModifiedDate(surrenderReasonSearch.getLastModifiedDate());
        contract.setTenantId(surrenderReasonSearch.getTenantId());
        contract.setPageSize(surrenderReasonSearch.getPageSize());
        contract.setOffset(surrenderReasonSearch.getOffset());
        contract.setSortBy(surrenderReasonSearch.getSortBy());
        contract.setIds(surrenderReasonSearch.getIds());

        return contract;
    }

}