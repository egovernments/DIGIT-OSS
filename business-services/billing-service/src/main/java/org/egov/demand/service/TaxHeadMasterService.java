package org.egov.demand.service;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.repository.TaxHeadMasterRepository;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.TaxHeadMasterRequest;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TaxHeadMasterService {


	@Autowired
	private ResponseFactory responseInfoFactory;

	@Autowired
	private TaxHeadMasterRepository taxHeadMasterRepository;

	@Autowired
	private SequenceGenService sequenceGenService;

	@Autowired
	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private ApplicationProperties applicationProperties;

	public TaxHeadMasterResponse getTaxHeads(TaxHeadMasterCriteria searchTaxHead, RequestInfo requestInfo) {
		log.info("TaxHeadMasterService getTaxHeads");
		List<TaxHeadMaster> taxHeadMaster = taxHeadMasterRepository.getTaxHeadMaster(requestInfo,searchTaxHead);
		return getTaxHeadMasterResponse(taxHeadMaster, requestInfo);
	}

	public TaxHeadMasterResponse create(TaxHeadMasterRequest taxHeadMasterRequest) {
		
		try {
			taxHeadMasterRepository.create(taxHeadMasterRequest);
		} catch (Exception e) {
			log.debug("Exception occured while inserting record");
			e.printStackTrace();
		}

		return getTaxHeadMasterResponse(taxHeadMasterRequest.getTaxHeadMasters(),
				taxHeadMasterRequest.getRequestInfo());
	}

	public TaxHeadMasterResponse createAsync(TaxHeadMasterRequest taxHeadMasterRequest) {
		List<TaxHeadMaster> taxHeadMaster = taxHeadMasterRequest.getTaxHeadMasters();

		List<String> taxHeadIds = sequenceGenService.getIds(taxHeadMaster.size(),
				applicationProperties.getTaxHeadSeqName());
		int index = 0;
		for (TaxHeadMaster master : taxHeadMaster) {
			master.setId(taxHeadIds.get(index++));
		}

		log.info("taxHeadMasterRequest createAsync::" + taxHeadMasterRequest);

		kafkaTemplate.send(applicationProperties.getCreateTaxHeadMasterTopicName(),
				applicationProperties.getCreateTaxHeadMasterTopicKey(), taxHeadMasterRequest);

		return getTaxHeadMasterResponse(taxHeadMaster, taxHeadMasterRequest.getRequestInfo());
	}

	public TaxHeadMasterResponse updateAsync(TaxHeadMasterRequest taxHeadMasterRequest) {
		List<TaxHeadMaster> taxHeadMaster = taxHeadMasterRequest.getTaxHeadMasters();

		log.info("taxHeadMasterRequest createAsync::" + taxHeadMasterRequest);

		kafkaTemplate.send(applicationProperties.getUpdateTaxHeadMasterTopicName(),
				applicationProperties.getUpdateTaxHeadMasterTopicKey(), taxHeadMasterRequest);
		return getTaxHeadMasterResponse(taxHeadMaster, taxHeadMasterRequest.getRequestInfo());
	}

	public TaxHeadMasterResponse update(TaxHeadMasterRequest taxHeadMasterRequest) {
		
		try {
			taxHeadMasterRepository.update(taxHeadMasterRequest);
		} catch (Exception e) {
			log.debug("Exception occured while updating record");
			e.printStackTrace();
		}
		return getTaxHeadMasterResponse(taxHeadMasterRequest.getTaxHeadMasters(), taxHeadMasterRequest.getRequestInfo());
	}

	private TaxHeadMasterResponse getTaxHeadMasterResponse(List<TaxHeadMaster> taxHeadMaster, RequestInfo requestInfo) {
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMaster);
		taxHeadMasterResponse.setResponseInfo(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.OK));
		return taxHeadMasterResponse;
	}
}