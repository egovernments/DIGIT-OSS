package org.egov.egf.master.domain.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.Supplier;
import org.egov.egf.master.domain.model.SupplierSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.SupplierEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.SupplierJdbcRepository;
import org.egov.egf.master.web.contract.SupplierSearchContract;
import org.egov.egf.master.web.requests.SupplierRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SupplierRepository {

    @Autowired
    private SupplierJdbcRepository supplierJdbcRepository;

    @Autowired
    private MastersQueueRepository supplierQueueRepository;

    @Autowired
    private FinancialConfigurationService financialConfigurationService;

    @Autowired
    private SupplierESRepository supplierESRepository;

    public Supplier findById(Supplier supplier) {
        SupplierEntity entity = supplierJdbcRepository.findById(new SupplierEntity().toEntity(supplier));
        return entity.toDomain();

    }
    
    public String getNextSequence(){
        return supplierJdbcRepository.getSequence(SupplierEntity.SEQUENCE_NAME);
    }

    @Transactional
    public Supplier save(Supplier supplier) {
        SupplierEntity entity = supplierJdbcRepository.create(new SupplierEntity().toEntity(supplier));
        return entity.toDomain();
    }

    @Transactional
    public Supplier update(Supplier supplier) {
        SupplierEntity entity = supplierJdbcRepository.update(new SupplierEntity().toEntity(supplier));
        return entity.toDomain();
    }

    public void add(SupplierRequest request) {
        Map<String, Object> message = new HashMap<>();

        if (request.getRequestInfo().getAction().equalsIgnoreCase(Constants.ACTION_CREATE)) {
            message.put("supplier_create", request);
        } else {
            message.put("supplier_update", request);
        }
        supplierQueueRepository.add(message);
    }

    public Pagination<Supplier> search(SupplierSearch domain) {

        if (!financialConfigurationService.fetchDataFrom().isEmpty()
                && financialConfigurationService.fetchDataFrom().equalsIgnoreCase("es")) {
            SupplierSearchContract supplierSearchContract = new SupplierSearchContract();
            ModelMapper mapper = new ModelMapper();
            mapper.map(domain, supplierSearchContract);
            return supplierESRepository.search(supplierSearchContract);
        } else {
            return supplierJdbcRepository.search(domain);
        }

    }

    public boolean uniqueCheck(String fieldName, Supplier supplier) {
        return supplierJdbcRepository.uniqueCheck(fieldName, new SupplierEntity().toEntity(supplier));
    }

}