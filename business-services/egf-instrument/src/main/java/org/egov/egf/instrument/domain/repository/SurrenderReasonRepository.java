package org.egov.egf.instrument.domain.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.persistence.entity.SurrenderReasonEntity;
import org.egov.egf.instrument.persistence.queue.repository.SurrenderReasonQueueRepository;
import org.egov.egf.instrument.persistence.repository.SurrenderReasonJdbcRepository;
import org.egov.egf.instrument.web.contract.SurrenderReasonSearchContract;
import org.egov.egf.instrument.web.mapper.SurrenderReasonMapper;
import org.egov.egf.instrument.web.requests.SurrenderReasonRequest;
import org.egov.egf.master.web.repository.FinancialConfigurationContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SurrenderReasonRepository {

    private SurrenderReasonJdbcRepository surrenderReasonJdbcRepository;

    private SurrenderReasonQueueRepository surrenderReasonQueueRepository;

    private String persistThroughKafka;

    private FinancialConfigurationContractRepository financialConfigurationContractRepository;

    private SurrenderReasonESRepository surrenderReasonESRepository;

    @Autowired
    public SurrenderReasonRepository(SurrenderReasonJdbcRepository surrenderReasonJdbcRepository,
            SurrenderReasonQueueRepository surrenderReasonQueueRepository,
            @Value("${persist.through.kafka}") String persistThroughKafka,
            FinancialConfigurationContractRepository financialConfigurationContractRepository,
            SurrenderReasonESRepository surrenderReasonESRepository) {
        this.surrenderReasonJdbcRepository = surrenderReasonJdbcRepository;
        this.surrenderReasonQueueRepository = surrenderReasonQueueRepository;
        this.persistThroughKafka = persistThroughKafka;
        this.financialConfigurationContractRepository = financialConfigurationContractRepository;
        this.surrenderReasonESRepository = surrenderReasonESRepository;

    }

    public SurrenderReason findById(SurrenderReason surrenderReason) {
        SurrenderReasonEntity entity = surrenderReasonJdbcRepository
                .findById(new SurrenderReasonEntity().toEntity(surrenderReason));
        if (entity != null)
            return entity.toDomain();

        return null;

    }

    @Transactional
    public List<SurrenderReason> save(List<SurrenderReason> surrenderReasons, RequestInfo requestInfo) {

        SurrenderReasonMapper mapper = new SurrenderReasonMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (SurrenderReason iac : surrenderReasons)
                request.getSurrenderReasons().add(mapper.toContract(iac));

            surrenderReasonQueueRepository.addToQue(request);

            return surrenderReasons;
        } else {

            List<SurrenderReason> resultList = new ArrayList<SurrenderReason>();

            for (SurrenderReason iac : surrenderReasons)
                resultList.add(save(iac));

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (SurrenderReason iac : resultList)
                request.getSurrenderReasons().add(mapper.toContract(iac));

            surrenderReasonQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public List<SurrenderReason> update(List<SurrenderReason> surrenderReasons, RequestInfo requestInfo) {

        SurrenderReasonMapper mapper = new SurrenderReasonMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (SurrenderReason iac : surrenderReasons)
                request.getSurrenderReasons().add(mapper.toContract(iac));

            surrenderReasonQueueRepository.addToQue(request);

            return surrenderReasons;
        } else {

            List<SurrenderReason> resultList = new ArrayList<SurrenderReason>();

            for (SurrenderReason iac : surrenderReasons)
                resultList.add(update(iac));

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (SurrenderReason iac : resultList)
                request.getSurrenderReasons().add(mapper.toContract(iac));

            surrenderReasonQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public List<SurrenderReason> delete(List<SurrenderReason> surrenderReasons, RequestInfo requestInfo) {

        SurrenderReasonMapper mapper = new SurrenderReasonMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (SurrenderReason iac : surrenderReasons)
                request.getSurrenderReasons().add(mapper.toContract(iac));

            surrenderReasonQueueRepository.addToQue(request);

            return surrenderReasons;
        } else {

            List<SurrenderReason> resultList = new ArrayList<SurrenderReason>();

            for (SurrenderReason iac : surrenderReasons)
                resultList.add(delete(iac));

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (SurrenderReason iac : resultList)
                request.getSurrenderReasons().add(mapper.toContract(iac));

            surrenderReasonQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public SurrenderReason save(SurrenderReason surrenderReason) {
        SurrenderReasonEntity entity = surrenderReasonJdbcRepository
                .create(new SurrenderReasonEntity().toEntity(surrenderReason));
        return entity.toDomain();
    }

    @Transactional
    public SurrenderReason update(SurrenderReason surrenderReason) {
        SurrenderReasonEntity entity = surrenderReasonJdbcRepository
                .update(new SurrenderReasonEntity().toEntity(surrenderReason));
        return entity.toDomain();
    }

    @Transactional
    public SurrenderReason delete(SurrenderReason surrenderReason) {
        SurrenderReasonEntity entity = surrenderReasonJdbcRepository
                .delete(new SurrenderReasonEntity().toEntity(surrenderReason));
        return entity.toDomain();
    }

    public Pagination<SurrenderReason> search(SurrenderReasonSearch domain) {

        if (financialConfigurationContractRepository.fetchDataFrom() != null
                && financialConfigurationContractRepository.fetchDataFrom().equalsIgnoreCase("es")) {

            SurrenderReasonMapper mapper = new SurrenderReasonMapper();
            SurrenderReasonSearchContract surrenderReasonSearchContract = new SurrenderReasonSearchContract();
            surrenderReasonSearchContract = mapper.toSearchContract(domain);

            return surrenderReasonESRepository.search(surrenderReasonSearchContract);

        } else
            return surrenderReasonJdbcRepository.search(domain);

    }

    public boolean uniqueCheck(String fieldName, SurrenderReason surrenderReason) {
        return surrenderReasonJdbcRepository.uniqueCheck(fieldName, new SurrenderReasonEntity().toEntity(surrenderReason));
    }

}