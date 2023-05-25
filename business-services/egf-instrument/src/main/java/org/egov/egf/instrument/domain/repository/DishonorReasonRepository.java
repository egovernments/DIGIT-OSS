package org.egov.egf.instrument.domain.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.DishonorReason;
import org.egov.egf.instrument.domain.model.DishonorReasonSearch;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.SurrenderReasonSearch;
import org.egov.egf.instrument.persistence.entity.DishonorReasonEntity;
import org.egov.egf.instrument.persistence.entity.SurrenderReasonEntity;
import org.egov.egf.instrument.persistence.queue.repository.SurrenderReasonQueueRepository;
import org.egov.egf.instrument.persistence.repository.DishonorReasonJdbcRepository;
import org.egov.egf.instrument.persistence.repository.SurrenderReasonJdbcRepository;
import org.egov.egf.instrument.web.contract.DishonorReasonSearchContract;
import org.egov.egf.instrument.web.contract.SurrenderReasonSearchContract;
import org.egov.egf.instrument.web.mapper.DishonorReasonMapper;
import org.egov.egf.instrument.web.mapper.SurrenderReasonMapper;
import org.egov.egf.instrument.web.requests.DishonorReasonRequest;
import org.egov.egf.instrument.web.requests.SurrenderReasonRequest;
import org.egov.egf.master.web.repository.FinancialConfigurationContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DishonorReasonRepository {

    private DishonorReasonJdbcRepository dishonorReasonJdbcRepository;

//    private SurrenderReasonQueueRepository surrenderReasonQueueRepository;

    private String persistThroughKafka;

    private FinancialConfigurationContractRepository financialConfigurationContractRepository;

    private SurrenderReasonESRepository surrenderReasonESRepository;

    @Autowired
    public DishonorReasonRepository(DishonorReasonJdbcRepository dishonorReasonJdbcRepository,
            @Value("${persist.through.kafka}") String persistThroughKafka,
            FinancialConfigurationContractRepository financialConfigurationContractRepository,
            SurrenderReasonESRepository surrenderReasonESRepository) {
        this.dishonorReasonJdbcRepository = dishonorReasonJdbcRepository;
//        this.surrenderReasonQueueRepository = surrenderReasonQueueRepository;
        this.persistThroughKafka = persistThroughKafka;
        this.financialConfigurationContractRepository = financialConfigurationContractRepository;
        this.surrenderReasonESRepository = surrenderReasonESRepository;

    }

    public DishonorReason findById(DishonorReason dishonorReason) {
        DishonorReasonEntity entity = dishonorReasonJdbcRepository
                .findById(new DishonorReasonEntity().toEntity(dishonorReason));
        if (entity != null)
            return entity.toDomain();

        return null;

    }

    @Transactional
    public List<DishonorReason> save(List<DishonorReason> dishonorReasons, RequestInfo requestInfo) {

    	DishonorReasonMapper mapper = new DishonorReasonMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

        	DishonorReasonRequest request = new DishonorReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (DishonorReason iac : dishonorReasons)
                request.getSurrenderReasons().add(mapper.toContract(iac));

//            surrenderReasonQueueRepository.addToQue(request);

            return dishonorReasons;
        } else {

            List<DishonorReason> resultList = new ArrayList<DishonorReason>();

            for (DishonorReason iac : dishonorReasons)
                resultList.add(save(iac));

            DishonorReasonRequest request = new DishonorReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

//            for (SurrenderReason iac : resultList)
//                request.getSurrenderReasons().add(mapper.toContract(iac));
//
//            dishonorReasonQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public List<SurrenderReason> update(List<SurrenderReason> dishonorReasons, RequestInfo requestInfo) {

        SurrenderReasonMapper mapper = new SurrenderReasonMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
//            request.setdishonorReasons(new ArrayList<>());

            for (SurrenderReason iac : dishonorReasons)
                request.getSurrenderReasons().add(mapper.toContract(iac));

//            dishonorReasonQueueRepository.addToQue(request);

            return dishonorReasons;
        } else {

            List<SurrenderReason> resultList = new ArrayList<SurrenderReason>();

//            for (SurrenderReason iac : dishonorReasons)
//                resultList.add(update(iac));

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (SurrenderReason iac : resultList)
                request.getSurrenderReasons().add(mapper.toContract(iac));

//            surrenderReasonQueueRepository.addToSearchQue(request);

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

//            surrenderReasonQueueRepository.addToQue(request);

            return surrenderReasons;
        } else {

            List<SurrenderReason> resultList = new ArrayList<SurrenderReason>();

//            for (SurrenderReason iac : surrenderReasons)
//                resultList.add(delete(iac));

            SurrenderReasonRequest request = new SurrenderReasonRequest();
            request.setRequestInfo(requestInfo);
            request.setSurrenderReasons(new ArrayList<>());

            for (SurrenderReason iac : resultList)
                request.getSurrenderReasons().add(mapper.toContract(iac));

//            surrenderReasonQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public DishonorReason save(DishonorReason dishonorReason) {
        DishonorReasonEntity entity = dishonorReasonJdbcRepository
                .create(new DishonorReasonEntity().toEntity(dishonorReason));
        return entity.toDomain();
    }

    @Transactional
    public DishonorReason update(DishonorReason dishonorReason) {
    	DishonorReasonEntity entity = dishonorReasonJdbcRepository
                .update(new DishonorReasonEntity().toEntity(dishonorReason));
        return entity.toDomain();
    }

    @Transactional
    public DishonorReason delete(DishonorReason surrenderReason) {
    	DishonorReasonEntity entity = dishonorReasonJdbcRepository
                .delete(new DishonorReasonEntity().toEntity(surrenderReason));
        return entity.toDomain();
    }

    public Pagination<DishonorReason> search(DishonorReasonSearch domain) {

//        if (financialConfigurationContractRepository.fetchDataFrom() != null
//                && financialConfigurationContractRepository.fetchDataFrom().equalsIgnoreCase("es")) {
//
//        	DishonorReasonMapper mapper = new DishonorReasonMapper();
//        	DishonorReasonSearchContract dishonorReasonSearchContract = new DishonorReasonSearchContract();
//        	dishonorReasonSearchContract = mapper.toSearchContract(domain);
//
//            return surrenderReasonESRepository.search(dishonorReasonSearchContract);
//
//        } else
            return dishonorReasonJdbcRepository.search(domain);

    }

    public boolean uniqueCheck(String fieldName, DishonorReason dishonorReason) {
        return dishonorReasonJdbcRepository.uniqueCheck(fieldName, new DishonorReasonEntity().toEntity(dishonorReason));
    }

}