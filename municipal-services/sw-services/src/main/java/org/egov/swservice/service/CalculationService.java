package org.egov.swservice.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.SewerageDao;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.web.models.*;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.web.models.collection.Bill;
import org.egov.swservice.web.models.collection.BillResponse;
import org.egov.swservice.workflow.WorkflowIntegrator;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import static org.egov.swservice.util.SWConstants.PENDING_FOR_PAYMENT_STATUS_CODE;
import static org.egov.swservice.util.SWConstants.WORKFLOW_NODUE_COMMENT;

@Service
@Slf4j
public class CalculationService {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private SewerageServicesUtil sewerageServicesUtil;

	@Autowired
	private WorkflowIntegrator wfIntegrator;

	@Autowired
	private SWConfiguration config;

	@Autowired
	private SewerageDao sewerageDao;

	@Autowired
	private SewerageService sewerageService;

	@Autowired
	private EnrichmentService enrichmentService;

	/**
	 * 
	 * @param request
	 * 
	 *            If action would be APPROVE_FOR_CONNECTION then
	 * 
	 *            Estimate the fee for sewerage application and generate the
	 *            demand
	 */
	public void calculateFeeAndGenerateDemand(SewerageConnectionRequest request, Property property) {
		if (request.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase("APPROVE_FOR_CONNECTION")){
			StringBuilder uri = sewerageServicesUtil.getCalculatorURL();
			CalculationCriteria criteria = CalculationCriteria.builder()
					.applicationNo(request.getSewerageConnection().getApplicationNo())
					.sewerageConnection(request.getSewerageConnection())
					.tenantId(property.getTenantId()).build();
			List<CalculationCriteria> calculationCriterias = Arrays.asList(criteria);
			CalculationReq calRequest = CalculationReq.builder().calculationCriteria(calculationCriterias)
					.requestInfo(request.getRequestInfo()).isconnectionCalculation(false).disconnectRequest(false).build();
			try {
				Object response = serviceRequestRepository.fetchResult(uri, calRequest);
				CalculationRes calResponse = mapper.convertValue(response, CalculationRes.class);
				log.info(mapper.writeValueAsString(calResponse));
			} catch (Exception ex) {
				log.error("Calculation response error!!", ex);
				throw new CustomException("SEWERAGE_CALCULATION_EXCEPTION", "Calculation response can not parsed!!!");
			}
		}
		if (request.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase("APPROVE_FOR_DISCONNECTION")){
				StringBuilder uri = sewerageServicesUtil.getCalculatorURL();
				CalculationCriteria criteria = CalculationCriteria.builder()
						.applicationNo(request.getSewerageConnection().getApplicationNo())
						.sewerageConnection(request.getSewerageConnection())
						.connectionNo(request.getSewerageConnection().getConnectionNo())
						.tenantId(property.getTenantId()).build();
				List<CalculationCriteria> calculationCriterias = Arrays.asList(criteria);
				CalculationReq calRequest = CalculationReq.builder().calculationCriteria(calculationCriterias)
						.requestInfo(request.getRequestInfo()).isconnectionCalculation(false).disconnectRequest(true).build();
				try {
					Object response = serviceRequestRepository.fetchResult(uri, calRequest);
					CalculationRes calResponse = mapper.convertValue(response, CalculationRes.class);
					log.info(mapper.writeValueAsString(calResponse));
				} catch (Exception ex) {
					log.error("Calculation response error!!", ex);
					throw new CustomException("SEWERAGE_CALCULATION_EXCEPTION", "Calculation response can not parsed!!!");
				}
			}
		}

	public boolean fetchBill(String tenantId, String connectionNo, RequestInfo requestInfo) {
		boolean isNoPayment = false;
		try {
			Object result = serviceRequestRepository.fetchResult(getFetchBillURL(tenantId, connectionNo)
					, RequestInfoWrapper.builder().requestInfo(requestInfo).build());
			BillResponse billResponse = mapper.convertValue(result, BillResponse.class);
			for (Bill bill : billResponse.getBill()) {
				if (bill.getTotalAmount().equals(BigDecimal.valueOf(0.0))) {
					isNoPayment = true;
				}
			}
		} catch (Exception ex) {
			throw new CustomException("SEWERAGE_FETCH_BILL_ERRORCODE", "Error while fetching the bill" + ex.getMessage());
		}
		return isNoPayment;
	}
	private StringBuilder getFetchBillURL(String tenantId, String connectionNo) {

		return new StringBuilder().append(config.getBillingServiceHost())
				.append(config.getFetchBillEndPoint()).append(SWConstants.URL_PARAMS_SEPARATER)
				.append(SWConstants.TENANT_ID_FIELD_FOR_SEARCH_URL).append(tenantId)
				.append(SWConstants.SEPARATER).append(SWConstants.CONSUMER_CODE_SEARCH_FIELD_NAME)
				.append(connectionNo).append(SWConstants.SEPARATER)
				.append(SWConstants.BUSINESSSERVICE_FIELD_FOR_SEARCH_URL)
				.append(SWConstants.SEWERAGE_TAX_SERVICE_CODE);
	}
}
