package org.egov.egf.instrument.web.mapper;

import org.egov.egf.instrument.domain.model.DishonorReason;
import org.egov.egf.instrument.domain.model.DishonorReasonSearch;
import org.egov.egf.instrument.web.contract.DishonorReasonContract;
import org.egov.egf.instrument.web.contract.DishonorReasonSearchContract;

public class DishonorReasonMapper {

    public DishonorReason toDomain(DishonorReasonContract contract) {

    	DishonorReason dishonorReason = new DishonorReason();

    	dishonorReason.setId(contract.getId());
        dishonorReason.setReason(contract.getReason());
        dishonorReason.setRemarks(contract.getRemarks());
        dishonorReason.setCreatedBy(contract.getCreatedBy());
        dishonorReason.setCreatedDate(contract.getCreatedDate());
        dishonorReason.setLastModifiedBy(contract.getLastModifiedBy());
        dishonorReason.setLastModifiedDate(contract.getLastModifiedDate());
        dishonorReason.setTenantId(contract.getTenantId());

        return dishonorReason;
    }

    public DishonorReasonContract toContract(DishonorReason dishonorReason) {

    	DishonorReasonContract contract = new DishonorReasonContract();

        contract.setId(dishonorReason.getId());
        contract.setReason(dishonorReason.getReason());
        contract.setRemarks(dishonorReason.getRemarks());
        contract.setCreatedBy(dishonorReason.getCreatedBy());
        contract.setCreatedDate(dishonorReason.getCreatedDate());
        contract.setLastModifiedBy(dishonorReason.getLastModifiedBy());
        contract.setLastModifiedDate(dishonorReason.getLastModifiedDate());
        contract.setTenantId(dishonorReason.getTenantId());

        return contract;
    }

    public DishonorReasonSearch toSearchDomain(DishonorReasonSearchContract contract) {

    	DishonorReasonSearch dishonorReasonSearch = new DishonorReasonSearch();

    	dishonorReasonSearch.setId(contract.getId());
    	dishonorReasonSearch.setReason(contract.getReason());
    	dishonorReasonSearch.setRemarks(contract.getRemarks());
    	dishonorReasonSearch.setCreatedBy(contract.getCreatedBy());
    	dishonorReasonSearch.setCreatedDate(contract.getCreatedDate());
    	dishonorReasonSearch.setLastModifiedBy(contract.getLastModifiedBy());
    	dishonorReasonSearch.setLastModifiedDate(contract.getLastModifiedDate());
    	dishonorReasonSearch.setTenantId(contract.getTenantId());
    	dishonorReasonSearch.setPageSize(contract.getPageSize());
    	dishonorReasonSearch.setOffset(contract.getOffset());
    	dishonorReasonSearch.setSortBy(contract.getSortBy());
    	dishonorReasonSearch.setIds(contract.getIds());

        return dishonorReasonSearch;
    }

    public DishonorReasonSearchContract toSearchContract(DishonorReasonSearch dishonorReasonSearch) {

    	DishonorReasonSearchContract contract = new DishonorReasonSearchContract();

        contract.setId(dishonorReasonSearch.getId());
        contract.setReason(dishonorReasonSearch.getReason());
        contract.setRemarks(dishonorReasonSearch.getRemarks());
        contract.setCreatedBy(dishonorReasonSearch.getCreatedBy());
        contract.setCreatedDate(dishonorReasonSearch.getCreatedDate());
        contract.setLastModifiedBy(dishonorReasonSearch.getLastModifiedBy());
        contract.setLastModifiedDate(dishonorReasonSearch.getLastModifiedDate());
        contract.setTenantId(dishonorReasonSearch.getTenantId());
        contract.setPageSize(dishonorReasonSearch.getPageSize());
        contract.setOffset(dishonorReasonSearch.getOffset());
        contract.setSortBy(dishonorReasonSearch.getSortBy());
        contract.setIds(dishonorReasonSearch.getIds());

        return contract;
    }

}