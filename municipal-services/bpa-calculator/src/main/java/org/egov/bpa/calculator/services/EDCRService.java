package org.egov.bpa.calculator.services;

import java.util.LinkedHashMap;

import org.egov.bpa.calculator.config.BPACalculatorConfig;
import org.egov.bpa.calculator.repository.ServiceRequestRepository;
import org.egov.bpa.calculator.utils.BPACalculatorConstants;
import org.egov.bpa.calculator.web.models.RequestInfoWrapper;
import org.egov.bpa.calculator.web.models.bpa.BPA;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class EDCRService {

	@Autowired
	 private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private BPACalculatorConfig config;
	
	@SuppressWarnings("rawtypes")
	public LinkedHashMap getEDCRDetails(RequestInfo requestInfo, BPA bpa) {

		String edcrNo = bpa.getEdcrNumber();
		StringBuilder uri = new StringBuilder(config.getEdcrHost());

		uri.append(config.getGetPlanEndPoint());
		uri.append("?").append("tenantId=").append(bpa.getTenantId());
		uri.append("&").append("edcrNumber=").append(edcrNo);
		RequestInfo edcrRequestInfo = new RequestInfo();
		BeanUtils.copyProperties(requestInfo, edcrRequestInfo);
		edcrRequestInfo.setUserInfo(null); // since EDCR service is not
											// accepting userInfo
		LinkedHashMap responseMap = null;
		try {
			responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri,
					new RequestInfoWrapper(edcrRequestInfo));
		} catch (ServiceCallException se) {
			throw new CustomException(BPACalculatorConstants.EDCR_ERROR, " EDCR Number is Invalid");
		}

		if (CollectionUtils.isEmpty(responseMap))
			throw new CustomException(BPACalculatorConstants.EDCR_ERROR, "The response from EDCR service is empty or null");

		return responseMap;
	}
	
}
