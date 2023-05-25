package org.egov.collection.service;

import java.util.List;

import org.egov.collection.repository.RemittanceRepository;
import org.egov.collection.util.RemittanceEnricher;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceRequest;
import org.egov.collection.web.contract.RemittanceSearchRequest;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RemittanceService {

    private RemittanceRepository remittanceRepository;
    private RemittanceEnricher remittanceEnricher;

    @Autowired
    public RemittanceService(RemittanceRepository remittanceRepository, RemittanceEnricher remittanceEnricher) {
        this.remittanceRepository = remittanceRepository;
        this.remittanceEnricher = remittanceEnricher;
    }

    public List<Remittance> getRemittances(RequestInfo requestInfo, RemittanceSearchRequest remittanceSearchRequest) {
        remittanceSearchRequest.setOffset(0);
        remittanceSearchRequest.setLimit(25);

        List<Remittance> remittances = remittanceRepository.fetchRemittances(remittanceSearchRequest);
        return remittances;
    }

    @Transactional
    public Remittance createRemittance(RemittanceRequest request) {
        Remittance remittance = request.getRemittances().get(0);

        remittanceEnricher.enrichRemittancePreValidate(request);
        remittanceRepository.saveRemittance(remittance);

        return remittance;
    }

    @Transactional
    public Remittance updateRemittance(RemittanceRequest request) {

        Remittance remittance = request.getRemittances().get(0);

        remittanceRepository.updateRemittance(remittance);

        return remittance;
    }

}
