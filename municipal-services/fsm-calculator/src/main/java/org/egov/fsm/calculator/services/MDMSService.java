package org.egov.fsm.calculator.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.calculator.config.CalculatorConfig;
import org.egov.fsm.calculator.repository.ServiceRequestRepository;
import org.egov.fsm.calculator.utils.CalculatorConstants;
import org.egov.fsm.calculator.web.models.CalculationReq;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MDMSService {

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private CalculatorConfig config;

	public Object mDMSCall(CalculationReq calculationReq, String tenantId) {
		MdmsCriteriaReq mdmsCriteriaReq = getMDMSRequest(calculationReq, tenantId);
		StringBuilder url = getMdmsSearchUrl();
		return serviceRequestRepository.fetchResult(url, mdmsCriteriaReq);
	}

	/**
	 * returns the url for mdms search endpoint for advancePayment
	 *
	 * @return MDMS Search URL
	 */
	public Object mDMSCall(RequestInfo requestInfo, String tenantId) {
		List<ModuleDetail> moduleRequest = getFSMModuleRequest();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.addAll(moduleRequest);
		MdmsCriteriaReq mdmsCriteriaReq = getAdvanceMDMSRequest(requestInfo, tenantId);

		StringBuilder url = getMdmsSearchUrl();
		return serviceRequestRepository.fetchResult(url, mdmsCriteriaReq);
	}

	/**
	 * Creates and returns the url for mdms search endpoint
	 *
	 * @return MDMS Search URL
	 */
	private StringBuilder getMdmsSearchUrl() {
		return new StringBuilder().append(config.getMdmsHost()).append(config.getMdmsSearchEndpoint());
	}

	/**
	 * Creates MDMS request
	 * 
	 * @param requestInfo The RequestInfo of the calculationRequest
	 * @param tenantId    The tenantId of the tradeLicense
	 * @return MDMSCriteria Request
	 */
	private MdmsCriteriaReq getMDMSRequest(CalculationReq calculationReq, String tenantId) {
		List<ModuleDetail> moduleRequest = getFSMModuleRequest();

		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.addAll(moduleRequest);

		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId).build();
		return MdmsCriteriaReq.builder().requestInfo(calculationReq.getRequestInfo()).mdmsCriteria(mdmsCriteria)
				.build();
	}

	private MdmsCriteriaReq getAdvanceMDMSRequest(RequestInfo requestInfo, String tenantId) {
		List<ModuleDetail> moduleRequest = getFSMModuleRequest();

		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.addAll(moduleRequest);

		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(moduleDetails).tenantId(tenantId).build();
		return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
	}

	public List<ModuleDetail> getFSMModuleRequest() {

		// filter to only get code field from master data
		final String filterCode = "$.[?(@.active==true)]";
		List<MasterDetail> fsmMasterDtls = new ArrayList<>();
		fsmMasterDtls.add(MasterDetail.builder().name(CalculatorConstants.FSM_CONFIG).filter(filterCode).build());

		// advance balance mdms
		fsmMasterDtls
				.add(MasterDetail.builder().name(CalculatorConstants.FSM_ADVANCEPAYMENT).filter(filterCode).build());
		fsmMasterDtls
				.add(MasterDetail.builder().name(CalculatorConstants.FSM_CANCELLATIONFEE).filter(filterCode).build());
		fsmMasterDtls.add(
				MasterDetail.builder().name(CalculatorConstants.ZERO_PRICE_CHECK_FROM_MDMS).build());

		ModuleDetail fsmMasterMDtl = ModuleDetail.builder().masterDetails(fsmMasterDtls)
				.moduleName(CalculatorConstants.MODULE_CODE).build();

		List<MasterDetail> vehicleMasterDtls = new ArrayList<>();
		vehicleMasterDtls
				.add(MasterDetail.builder().name(CalculatorConstants.VEHICLE_MAKE_MODEL).filter(filterCode).build());
		ModuleDetail vehicleMasterMDtl = ModuleDetail.builder().masterDetails(vehicleMasterDtls)
				.moduleName(CalculatorConstants.VEHICLE_MODULE_CODE).build();

		return Arrays.asList(vehicleMasterMDtl, fsmMasterMDtl);

	}

}
