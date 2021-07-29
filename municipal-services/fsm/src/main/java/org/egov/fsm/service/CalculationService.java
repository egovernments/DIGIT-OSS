package org.egov.fsm.service;


import java.util.Arrays;
import java.util.List;

import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.calculator.CalculationReq;
import org.egov.fsm.web.model.calculator.CalulationCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class CalculationService {

	private ServiceRequestRepository serviceRequestRepository;

	private FSMConfiguration config;

	@Autowired
	public CalculationService(ServiceRequestRepository serviceRequestRepository, FSMConfiguration config) {
		this.serviceRequestRepository = serviceRequestRepository;
		this.config = config;
	}

	public void addCalculation(FSMRequest fsmRequest, String feeType) {

		CalculationReq calulcationRequest = new CalculationReq();
		calulcationRequest.setRequestInfo(fsmRequest.getRequestInfo());
		CalulationCriteria calculationCriteria = new CalulationCriteria();
		calculationCriteria.setApplicationNo(fsmRequest.getFsm().getApplicationNo());
		calculationCriteria.setFsm(fsmRequest.getFsm());
		calculationCriteria.setFeeType(feeType);
		calculationCriteria.setTenantId(fsmRequest.getFsm().getTenantId());
		List<CalulationCriteria> criterias = Arrays.asList(calculationCriteria);
		calulcationRequest.setCalulationCriteria(criterias);
		StringBuilder url = new StringBuilder();
		url.append(this.config.getCalculatorHost());
		url.append(this.config.getCalulatorEndPoint());

		this.serviceRequestRepository.fetchResult(url, calulcationRequest);
	}

}
