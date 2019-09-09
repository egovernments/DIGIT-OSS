package org.egov.egf.instrument.domain.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentSearch;
import org.egov.egf.instrument.domain.model.InstrumentVoucher;
import org.egov.egf.instrument.persistence.entity.InstrumentEntity;
import org.egov.egf.instrument.persistence.entity.InstrumentVoucherEntity;
import org.egov.egf.instrument.persistence.queue.repository.InstrumentQueueRepository;
import org.egov.egf.instrument.persistence.repository.InstrumentJdbcRepository;
import org.egov.egf.instrument.persistence.repository.InstrumentVoucherJdbcRepository;
import org.egov.egf.instrument.web.contract.InstrumentSearchContract;
import org.egov.egf.instrument.web.mapper.InstrumentMapper;
import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.egov.egf.master.web.repository.FinancialConfigurationContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InstrumentRepository {

    private InstrumentJdbcRepository instrumentJdbcRepository;

    private InstrumentVoucherJdbcRepository instrumentVoucherJdbcRepository;

    private InstrumentQueueRepository instrumentQueueRepository;

    private String persistThroughKafka;

    private InstrumentESRepository instrumentESRepository;

    private FinancialConfigurationContractRepository financialConfigurationContractRepository;

    @Autowired
    public InstrumentRepository(InstrumentJdbcRepository instrumentJdbcRepository,
            InstrumentQueueRepository instrumentQueueRepository,
            @Value("${persist.through.kafka}") String persistThroughKafka,
            InstrumentESRepository instrumentESRepository,
            FinancialConfigurationContractRepository financialConfigurationContractRepository,
            InstrumentVoucherJdbcRepository instrumentVoucherJdbcRepository) {
        this.instrumentJdbcRepository = instrumentJdbcRepository;
        this.instrumentQueueRepository = instrumentQueueRepository;
        this.persistThroughKafka = persistThroughKafka;
        this.instrumentESRepository = instrumentESRepository;
        this.financialConfigurationContractRepository = financialConfigurationContractRepository;
        this.instrumentVoucherJdbcRepository = instrumentVoucherJdbcRepository;

    }

    public Instrument findById(Instrument instrument) {
        InstrumentEntity entity = instrumentJdbcRepository.findById(new InstrumentEntity().toEntity(instrument));
        if (entity != null)
            return entity.toDomain();

        return null;

    }

    @Transactional
    public List<Instrument> save(List<Instrument> instruments, RequestInfo requestInfo) {

        InstrumentMapper mapper = new InstrumentMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            InstrumentRequest request = new InstrumentRequest();
            request.setRequestInfo(requestInfo);
            request.setInstruments(new ArrayList<>());

            for (Instrument iac : instruments)
                request.getInstruments().add(mapper.toContract(iac));

            instrumentQueueRepository.addToQue(request);

            return instruments;
        } else {

            List<Instrument> resultList = new ArrayList<Instrument>();

            for (Instrument iac : instruments)
                resultList.add(save(iac));

            InstrumentRequest request = new InstrumentRequest();
            request.setRequestInfo(requestInfo);
            request.setInstruments(new ArrayList<>());

            for (Instrument iac : resultList)
                request.getInstruments().add(mapper.toContract(iac));

            instrumentQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public List<Instrument> update(List<Instrument> instruments, RequestInfo requestInfo) {

        InstrumentMapper mapper = new InstrumentMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            InstrumentRequest request = new InstrumentRequest();
            request.setRequestInfo(requestInfo);
            request.setInstruments(new ArrayList<>());

            for (Instrument iac : instruments)
                request.getInstruments().add(mapper.toContract(iac));

            instrumentQueueRepository.addToQue(request);

            return instruments;
        } else {

            List<Instrument> resultList = new ArrayList<Instrument>();

            for (Instrument iac : instruments)
                resultList.add(update(iac));

            InstrumentRequest request = new InstrumentRequest();
            request.setRequestInfo(requestInfo);
            request.setInstruments(new ArrayList<>());

            for (Instrument iac : resultList)
                request.getInstruments().add(mapper.toContract(iac));

            instrumentQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public List<Instrument> delete(List<Instrument> instruments, RequestInfo requestInfo) {

        InstrumentMapper mapper = new InstrumentMapper();

        if (persistThroughKafka != null && !persistThroughKafka.isEmpty()
                && persistThroughKafka.equalsIgnoreCase("yes")) {

            InstrumentRequest request = new InstrumentRequest();
            request.setRequestInfo(requestInfo);
            request.setInstruments(new ArrayList<>());

            for (Instrument iac : instruments)
                request.getInstruments().add(mapper.toContract(iac));

            instrumentQueueRepository.addToQue(request);

            return instruments;
        } else {

            List<Instrument> resultList = new ArrayList<Instrument>();

            for (Instrument iac : instruments)
                resultList.add(delete(iac));

            InstrumentRequest request = new InstrumentRequest();
            request.setRequestInfo(requestInfo);
            request.setInstruments(new ArrayList<>());

            for (Instrument iac : resultList)
                request.getInstruments().add(mapper.toContract(iac));

            instrumentQueueRepository.addToSearchQue(request);

            return resultList;
        }

    }

    @Transactional
    public Instrument save(Instrument instrument) {
        InstrumentEntity entity = instrumentJdbcRepository.create(new InstrumentEntity().toEntity(instrument));
        if (instrument.getInstrumentVouchers() != null)
            for (InstrumentVoucher iv : instrument.getInstrumentVouchers())
                instrumentVoucherJdbcRepository.create(new InstrumentVoucherEntity().toEntity(iv));
        return entity.toDomain();
    }

    @Transactional
    public Instrument update(Instrument instrument) {
        InstrumentEntity entity = instrumentJdbcRepository.update(new InstrumentEntity().toEntity(instrument));
        instrumentVoucherJdbcRepository.delete(instrument.getTenantId(), instrument.getId());
        if (instrument.getInstrumentVouchers() != null)
            for (InstrumentVoucher iv : instrument.getInstrumentVouchers())
                instrumentVoucherJdbcRepository.create(new InstrumentVoucherEntity().toEntity(iv));
        return entity.toDomain();
    }

    @Transactional
    public Instrument delete(Instrument instrument) {
        InstrumentEntity entity = instrumentJdbcRepository.delete(new InstrumentEntity().toEntity(instrument));
        return entity.toDomain();
    }

    public Pagination<Instrument> search(InstrumentSearch domain) {

        if (financialConfigurationContractRepository.fetchDataFrom() != null
                && financialConfigurationContractRepository.fetchDataFrom().equalsIgnoreCase("es")) {

            InstrumentMapper mapper = new InstrumentMapper();
            InstrumentSearchContract instrumentSearchContract = new InstrumentSearchContract();
            instrumentSearchContract = mapper.toSearchContract(domain);
            Pagination<Instrument> instruments = instrumentESRepository.search(instrumentSearchContract);

            return instruments;

        } else
            return instrumentJdbcRepository.search(domain);

    }

    public boolean uniqueCheck(String fieldName, Instrument instrument) {
        return instrumentJdbcRepository.uniqueCheck(fieldName, new InstrumentEntity().toEntity(instrument));
    }

}