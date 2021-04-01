package org.egov.demand.service;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.repository.TaxHeadMasterRepository;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
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

	public TaxHeadMasterResponse getTaxHeads(TaxHeadMasterCriteria searchTaxHead, RequestInfo requestInfo) {
		log.info("TaxHeadMasterService getTaxHeads");
		List<TaxHeadMaster> taxHeadMaster = taxHeadMasterRepository.getTaxHeadMaster(requestInfo,searchTaxHead);
		return getTaxHeadMasterResponse(taxHeadMaster, requestInfo);
	}

	private TaxHeadMasterResponse getTaxHeadMasterResponse(List<TaxHeadMaster> taxHeadMaster, RequestInfo requestInfo) {
		TaxHeadMasterResponse taxHeadMasterResponse = new TaxHeadMasterResponse();
		taxHeadMasterResponse.setTaxHeadMasters(taxHeadMaster);
		taxHeadMasterResponse.setResponseInfo(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.OK));
		return taxHeadMasterResponse;
	}
}