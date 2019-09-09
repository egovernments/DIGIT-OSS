package org.egov.egf.instrument.persistence.queue;

import java.util.HashMap;

import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentAccountCode;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.service.InstrumentAccountCodeService;
import org.egov.egf.instrument.domain.service.InstrumentService;
import org.egov.egf.instrument.domain.service.InstrumentTypeService;
import org.egov.egf.instrument.domain.service.SurrenderReasonService;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeContract;
import org.egov.egf.instrument.web.contract.InstrumentContract;
import org.egov.egf.instrument.web.contract.InstrumentTypeContract;
import org.egov.egf.instrument.web.contract.SurrenderReasonContract;
import org.egov.egf.instrument.web.mapper.InstrumentAccountCodeMapper;
import org.egov.egf.instrument.web.mapper.InstrumentMapper;
import org.egov.egf.instrument.web.mapper.InstrumentTypeMapper;
import org.egov.egf.instrument.web.mapper.SurrenderReasonMapper;
import org.egov.egf.instrument.web.requests.InstrumentAccountCodeRequest;
import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.egov.egf.instrument.web.requests.InstrumentTypeRequest;
import org.egov.egf.instrument.web.requests.SurrenderReasonRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FinancialInstrumentListener {

    @Value("${kafka.topics.egf.instrument.completed.topic}")
    private String completedTopic;

    @Value("${kafka.topics.egf.instrument.instrument.accountcode.completed.key}")
    private String instrumentAccountCodeCompletedKey;

    @Value("${kafka.topics.egf.instrument.instrument.completed.key}")
    private String instrumentCompletedKey;

    @Value("${kafka.topics.egf.instrument.instrument.type.completed.key}")
    private String instrumentTypeCompletedKey;

    @Value("${kafka.topics.egf.instrument.surrender.reason.completed.key}")
    private String surrenderReasonCompletedKey;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FinancialInstrumentProducer financialProducer;

    @Autowired
    private InstrumentAccountCodeService instrumentAccountCodeService;

    @Autowired
    private InstrumentService instrumentService;

    @Autowired
    private InstrumentTypeService instrumentTypeService;

    @Autowired
    private SurrenderReasonService surrenderReasonService;

    @KafkaListener(id = "${kafka.topics.egf.instrument.validated.id}", topics = "${kafka.topics.egf.instrument.validated.topic}", group = "${kafka.topics.egf.instrument.validated.group}")
    public void process(HashMap<String, Object> mastersMap) {

        InstrumentAccountCodeMapper accountCodeMapper = new InstrumentAccountCodeMapper();
        InstrumentMapper instrumentMapper = new InstrumentMapper();
        InstrumentTypeMapper typeMapper = new InstrumentTypeMapper();
        SurrenderReasonMapper srMapper = new SurrenderReasonMapper();

        if (mastersMap.get("instrumentaccountcode_create") != null) {

            InstrumentAccountCodeRequest request = objectMapper
                    .convertValue(mastersMap.get("instrumentaccountcode_create"), InstrumentAccountCodeRequest.class);

            for (InstrumentAccountCodeContract instrumentAccountCodeContract : request.getInstrumentAccountCodes()) {
                InstrumentAccountCode domain = accountCodeMapper.toDomain(instrumentAccountCodeContract);
                instrumentAccountCodeService.save(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrumentaccountcode_persisted", request);
            financialProducer.sendMessage(completedTopic, instrumentAccountCodeCompletedKey, mastersMap);
        }

        if (mastersMap.get("instrumentaccountcode_update") != null)

        {

            InstrumentAccountCodeRequest request = objectMapper
                    .convertValue(mastersMap.get("instrumentaccountcode_update"), InstrumentAccountCodeRequest.class);

            for (InstrumentAccountCodeContract instrumentAccountCodeContract : request.getInstrumentAccountCodes()) {
                InstrumentAccountCode domain = accountCodeMapper.toDomain(instrumentAccountCodeContract);
                instrumentAccountCodeService.update(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrumentaccountcode_persisted", request);
            financialProducer.sendMessage(completedTopic, instrumentAccountCodeCompletedKey, mastersMap);
        }

        if (mastersMap.get("instrumentaccountcode_delete") != null)

        {

            InstrumentAccountCodeRequest request = objectMapper
                    .convertValue(mastersMap.get("instrumentaccountcode_delete"), InstrumentAccountCodeRequest.class);

            for (InstrumentAccountCodeContract instrumentAccountCodeContract : request.getInstrumentAccountCodes()) {
                InstrumentAccountCode domain = accountCodeMapper.toDomain(instrumentAccountCodeContract);
                instrumentAccountCodeService.delete(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrumentaccountcode_deleted", request);
            financialProducer.sendMessage(completedTopic, instrumentAccountCodeCompletedKey, mastersMap);
        }

        if (mastersMap.get("instrument_create") != null) {

            InstrumentRequest request = objectMapper.convertValue(mastersMap.get("instrument_create"),
                    InstrumentRequest.class);

            for (InstrumentContract instrumentContract : request.getInstruments()) {
                Instrument domain = instrumentMapper.toDomain(instrumentContract);
                instrumentService.save(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrument_persisted", request);
            financialProducer.sendMessage(completedTopic, instrumentCompletedKey, mastersMap);
        }

        if (mastersMap.get("instrument_update") != null)

        {

            InstrumentRequest request = objectMapper.convertValue(mastersMap.get("instrument_update"),
                    InstrumentRequest.class);

            for (InstrumentContract instrumentContract : request.getInstruments()) {
                Instrument domain = instrumentMapper.toDomain(instrumentContract);
                instrumentService.update(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrument_persisted", request);
            financialProducer.sendMessage(completedTopic, instrumentCompletedKey, mastersMap);
        }

        if (mastersMap.get("instrument_delete") != null)

        {

            InstrumentRequest request = objectMapper.convertValue(mastersMap.get("instrument_delete"),
                    InstrumentRequest.class);

            for (InstrumentContract instrumentContract : request.getInstruments()) {
                Instrument domain = instrumentMapper.toDomain(instrumentContract);
                instrumentService.delete(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrument_deleted", request);
            financialProducer.sendMessage(completedTopic, instrumentCompletedKey, mastersMap);
        }

        if (mastersMap.get("instrumenttype_create") != null) {

            InstrumentTypeRequest request = objectMapper.convertValue(mastersMap.get("instrumenttype_create"),
                    InstrumentTypeRequest.class);

            for (InstrumentTypeContract instrumentTypeContract : request.getInstrumentTypes()) {
                InstrumentType domain = typeMapper.toDomain(instrumentTypeContract);
                instrumentTypeService.save(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrumenttype_persisted", request);
            financialProducer.sendMessage(completedTopic, instrumentTypeCompletedKey, mastersMap);
        }

        if (mastersMap.get("instrumenttype_update") != null)

        {

            InstrumentTypeRequest request = objectMapper.convertValue(mastersMap.get("instrumenttype_update"),
                    InstrumentTypeRequest.class);

            for (InstrumentTypeContract instrumentTypeContract : request.getInstrumentTypes()) {
                InstrumentType domain = typeMapper.toDomain(instrumentTypeContract);
                instrumentTypeService.update(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrumenttype_persisted", request);
            financialProducer.sendMessage(completedTopic, instrumentTypeCompletedKey, mastersMap);
        }

        if (mastersMap.get("instrumenttype_delete") != null)

        {

            InstrumentTypeRequest request = objectMapper.convertValue(mastersMap.get("instrumenttype_delete"),
                    InstrumentTypeRequest.class);

            for (InstrumentTypeContract instrumentTypeContract : request.getInstrumentTypes()) {
                InstrumentType domain = typeMapper.toDomain(instrumentTypeContract);
                instrumentTypeService.delete(domain);
            }

            mastersMap.clear();
            mastersMap.put("instrumenttype_deleted", request);
            financialProducer.sendMessage(completedTopic, instrumentTypeCompletedKey, mastersMap);
        }

        if (mastersMap.get("surrenderreason_create") != null) {

            SurrenderReasonRequest request = objectMapper.convertValue(mastersMap.get("surrenderreason_create"),
                    SurrenderReasonRequest.class);

            for (SurrenderReasonContract surrenderReasonContract : request.getSurrenderReasons()) {
                SurrenderReason domain = srMapper.toDomain(surrenderReasonContract);
                surrenderReasonService.save(domain);
            }

            mastersMap.clear();
            mastersMap.put("surrenderreason_persisted", request);
            financialProducer.sendMessage(completedTopic, surrenderReasonCompletedKey, mastersMap);
        }

        if (mastersMap.get("surrenderreason_update") != null)

        {

            SurrenderReasonRequest request = objectMapper.convertValue(mastersMap.get("surrenderreason_update"),
                    SurrenderReasonRequest.class);

            for (SurrenderReasonContract surrenderReasonContract : request.getSurrenderReasons()) {
                SurrenderReason domain = srMapper.toDomain(surrenderReasonContract);
                surrenderReasonService.update(domain);
            }

            mastersMap.clear();
            mastersMap.put("surrenderreason_persisted", request);
            financialProducer.sendMessage(completedTopic, surrenderReasonCompletedKey, mastersMap);
        }

        if (mastersMap.get("surrenderreason_delete") != null)

        {
            SurrenderReasonRequest request = objectMapper.convertValue(mastersMap.get("surrenderreason_delete"),
                    SurrenderReasonRequest.class);

            for (SurrenderReasonContract surrenderReasonContract : request.getSurrenderReasons()) {
                SurrenderReason domain = srMapper.toDomain(surrenderReasonContract);
                surrenderReasonService.delete(domain);
            }

            mastersMap.clear();
            mastersMap.put("surrenderreason_deleted", request);
            financialProducer.sendMessage(completedTopic, surrenderReasonCompletedKey, mastersMap);
        }

    }

}
