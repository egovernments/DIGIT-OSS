package org.egov.egf.instrument.domain.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.persistence.entity.InstrumentTypeEntity;
import org.egov.egf.instrument.persistence.queue.repository.InstrumentTypeQueueRepository;
import org.egov.egf.instrument.persistence.repository.InstrumentTypeJdbcRepository;
import org.egov.egf.instrument.web.contract.InstrumentTypeSearchContract;
import org.egov.egf.instrument.web.mapper.InstrumentTypeMapper;
import org.egov.egf.instrument.web.requests.InstrumentTypeRequest;
import org.egov.egf.master.web.repository.FinancialConfigurationContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InstrumentTypeRepository {

    private InstrumentTypeJdbcRepository instrumentTypeJdbcRepository;

    private InstrumentTypeQueueRepository instrumentTypeQueueRepository;

    private String persistThroughKafka;

    private FinancialConfigurationContractRepository financialConfigurationContractRepository;

    private InstrumentTypeESRepository instrumentTypeESRepository;

    @Autowired
    public InstrumentTypeRepository(InstrumentTypeJdbcRepository instrumentTypeJdbcRepository,
            InstrumentTypeQueueRepository instrumentTypeQueueRepository,
            @Value("${persist.through.kafka}") String persistThroughKafka,
            FinancialConfigurationContractRepository financialConfigurationContractRepository,
            InstrumentTypeESRepository instrumentTypeESRepository) {
        this.instrumentTypeJdbcRepository = instrumentTypeJdbcRepository;
        this.instrumentTypeQueueRepository = instrumentTypeQueueRepository;
        this.persistThroughKafka = persistThroughKafka;
        this.financialConfigurationContractRepository = financialConfigurationContractRepository;
        this.instrumentTypeESRepository = instrumentTypeESRepository;

    }

    public InstrumentType findById(InstrumentType instrumentType) {
        InstrumentTypeEntity entity = instrumentTypeJdbcRepository
                .findById(new InstrumentTypeEntity().toEntity(instrumentType));
        if (entity != null)
            return entity.toDomain();

        return null;

    }

    @Transactional
    public List<InstrumentType> save(List<InstrumentType> instrumentTypes, RequestInfo requestInfo) {

        InstrumentTypeMapper mapper = new InstrumentTypeMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            InstrumentTypeRequest request = new InstrumentTypeRequest();
            request.setRequestInfo(requestInfo);
            request.setInstrumentTypes(new ArrayList<>());

            for (InstrumentType iac : instrumentTypes)
                request.getInstrumentTypes().add(mapper.toContract(iac));

            instrumentTypeQueueRepository.addToQue(request);

            return instrumentTypes;
        } else {

            List<InstrumentType> resultList = new ArrayList<InstrumentType>();

            for (InstrumentType iac : instrumentTypes)
                resultList.add(save(iac));

            InstrumentTypeRequest request = new InstrumentTypeRequest();
            request.setRequestInfo(requestInfo);
            request.setInstrumentTypes(new ArrayList<>());

            for (InstrumentType iac : resultList)
                request.getInstrumentTypes().add(mapper.toContract(iac));

            instrumentTypeQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public List<InstrumentType> update(List<InstrumentType> instrumentTypes, RequestInfo requestInfo) {

        InstrumentTypeMapper mapper = new InstrumentTypeMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            InstrumentTypeRequest request = new InstrumentTypeRequest();
            request.setRequestInfo(requestInfo);
            request.setInstrumentTypes(new ArrayList<>());

            for (InstrumentType iac : instrumentTypes)
                request.getInstrumentTypes().add(mapper.toContract(iac));

            instrumentTypeQueueRepository.addToQue(request);

            return instrumentTypes;
        } else {

            List<InstrumentType> resultList = new ArrayList<InstrumentType>();

            for (InstrumentType iac : instrumentTypes)
                resultList.add(update(iac));

            InstrumentTypeRequest request = new InstrumentTypeRequest();
            request.setRequestInfo(requestInfo);
            request.setInstrumentTypes(new ArrayList<>());

            for (InstrumentType iac : resultList)
                request.getInstrumentTypes().add(mapper.toContract(iac));

            instrumentTypeQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public List<InstrumentType> delete(List<InstrumentType> instrumentTypes, RequestInfo requestInfo) {

        InstrumentTypeMapper mapper = new InstrumentTypeMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            InstrumentTypeRequest request = new InstrumentTypeRequest();
            request.setRequestInfo(requestInfo);
            request.setInstrumentTypes(new ArrayList<>());

            for (InstrumentType iac : instrumentTypes)
                request.getInstrumentTypes().add(mapper.toContract(iac));

            instrumentTypeQueueRepository.addToQue(request);

            return instrumentTypes;
        } else {

            List<InstrumentType> resultList = new ArrayList<InstrumentType>();

            for (InstrumentType iac : instrumentTypes)
                resultList.add(delete(iac));

            InstrumentTypeRequest request = new InstrumentTypeRequest();
            request.setRequestInfo(requestInfo);
            request.setInstrumentTypes(new ArrayList<>());

            for (InstrumentType iac : resultList)
                request.getInstrumentTypes().add(mapper.toContract(iac));

            instrumentTypeQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public InstrumentType save(InstrumentType instrumentType) {
        InstrumentTypeEntity entity = instrumentTypeJdbcRepository
                .create(new InstrumentTypeEntity().toEntity(instrumentType));
        return entity.toDomain();
    }

    @Transactional
    public InstrumentType update(InstrumentType instrumentType) {
        InstrumentTypeEntity entity = instrumentTypeJdbcRepository
                .update(new InstrumentTypeEntity().toEntity(instrumentType));
        return entity.toDomain();
    }

    @Transactional
    public InstrumentType delete(InstrumentType instrumentType) {
        InstrumentTypeEntity entity = instrumentTypeJdbcRepository.delete(new InstrumentTypeEntity().toEntity(instrumentType));
        return entity.toDomain();
    }

    public Pagination<InstrumentType> search(InstrumentTypeSearch domain) {

        if (financialConfigurationContractRepository.fetchDataFrom() != null
                && financialConfigurationContractRepository.fetchDataFrom().equalsIgnoreCase("es")) {

            InstrumentTypeSearchContract instrumentTypeSearchContract = new InstrumentTypeSearchContract();
            InstrumentTypeMapper mapper = new InstrumentTypeMapper();
            instrumentTypeSearchContract = mapper.toSearchContract(domain);
            Pagination<InstrumentType> instrumenttypes = instrumentTypeESRepository
                    .search(instrumentTypeSearchContract);

            return instrumenttypes;

        } else
            return instrumentTypeJdbcRepository.search(domain);

    }

    public boolean uniqueCheck(String fieldName, InstrumentType instrumentType) {
        return instrumentTypeJdbcRepository.uniqueCheck(fieldName, new InstrumentTypeEntity().toEntity(instrumentType));
    }

}