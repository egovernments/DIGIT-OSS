package org.egov.swservice.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.web.models.Calculation;
import org.egov.swservice.web.models.CalculationCriteria;
import org.egov.swservice.web.models.CalculationReq;
import org.egov.swservice.web.models.CalculationRes;
import org.egov.swservice.web.models.Property;
import org.egov.swservice.web.models.SewerageConnectionRequest;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.repository.SewerageDaoImpl;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

@Service
@Slf4j
public class PdfFileStoreService {

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private SewerageServicesUtil sewerageServiceUtil;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SWConfiguration config;

	@Autowired
	private SewerageDaoImpl sewerageDao;

	@Autowired
	private WorkflowService workflowService;
	
	@Autowired
	private ValidateProperty validateProperty;

	String tenantIdReplacer = "$tenantId";
	String fileStoreIdsReplacer = "$.filestoreIds";
	String urlReplacer = "url";
	String requestInfoReplacer = "RequestInfo";
	String WaterConnectionReplacer = "WnsConnection";
	String fileStoreIdReplacer = "$fileStoreIds";
	String totalAmount = "totalAmount";
	String applicationFee = "applicationFee";
	String serviceFee = "serviceFee";
	String tax = "tax";
	String pdfTaxhead = "pdfTaxhead";
	String pdfApplicationKey = "$applicationkey";
	String sla = "sla";
	String slaDate = "slaDate";
	String sanctionLetterDate = "sanctionLetterDate";
	String tenantName = "tenantName";
	String service = "service";
	String propertyKey = "property";
	
	/**
	 * Get fileStroe Id's
	 * 
	 * @param sewerageConnectionRequest - Sewerage connection Request
	 * @param property - Property Object
	 * @param applicationKey - ApplicationKey
	 * @return file store id
	 */
	public String getFileStoreId(SewerageConnectionRequest sewerageConnectionRequest, Property property,
								 String applicationKey) {
		CalculationCriteria criteria = CalculationCriteria.builder()
				.applicationNo(sewerageConnectionRequest.getSewerageConnection().getApplicationNo())
				.sewerageConnection(sewerageConnectionRequest.getSewerageConnection()).tenantId(property.getTenantId())
				.build();
		CalculationReq calRequest = CalculationReq.builder().calculationCriteria(Arrays.asList(criteria))
				.requestInfo(sewerageConnectionRequest.getRequestInfo()).isconnectionCalculation(false).build();
		
		String applicationStatus = workflowService.getApplicationStatus(sewerageConnectionRequest.getRequestInfo(),
				sewerageConnectionRequest.getSewerageConnection().getApplicationNo(),
				sewerageConnectionRequest.getSewerageConnection().getTenantId(), config.getBusinessServiceValue());
		
		try {
			Object response = serviceRequestRepository.fetchResult(sewerageServiceUtil.getEstimationURL(), calRequest);
			CalculationRes calResponse = mapper.convertValue(response, CalculationRes.class);
			JSONObject sewerageObject = mapper.convertValue(sewerageConnectionRequest.getSewerageConnection(),
					JSONObject.class);
			if (CollectionUtils.isEmpty(calResponse.getCalculation())) {
				throw new CustomException("NO_ESTIMATION_FOUND", "Estimation not found!!!");
			}
			Optional<Calculation> calculationList = calResponse.getCalculation().stream().findFirst();
			if(calculationList.isPresent()) {
				Calculation cal = calculationList.get();
				sewerageObject.put(totalAmount, cal.getTotalAmount());
				sewerageObject.put(applicationFee, cal.getFee());
				sewerageObject.put(serviceFee, cal.getCharge());
				sewerageObject.put(tax, cal.getTaxAmount());
				cal.getTaxHeadEstimates().forEach(item -> {
					//We need to remove SW_ --> So that PDF configuration refers the common for both Water & Sewerage
					item.setTaxHeadCode(item.getTaxHeadCode().substring(3));
				});
				sewerageObject.put(pdfTaxhead, cal.getTaxHeadEstimates());
			}
			sewerageObject.put(sanctionLetterDate, System.currentTimeMillis());
			BigDecimal slaDays = workflowService.getSlaForState(config.getBusinessServiceValue(),
					sewerageConnectionRequest.getSewerageConnection().getTenantId(),
					sewerageConnectionRequest.getRequestInfo(), applicationStatus);
			sewerageObject.put(sla, slaDays.divide(BigDecimal.valueOf(SWConstants.DAYS_CONST)));
			sewerageObject.put(slaDate, slaDays.add(
					new BigDecimal(System.currentTimeMillis())));
			String[] tenantDetails = property.getTenantId().split("\\."); 
			String tenantId = tenantDetails[0];
			if(tenantDetails.length > 1)
			{
				sewerageObject.put(tenantName, tenantDetails[1].toUpperCase());
			}
			sewerageObject.put(propertyKey, property);
			sewerageObject.put(service, "SEWERAGE");
			return getFileStoreIdFromPDFService(sewerageObject, sewerageConnectionRequest.getRequestInfo(), tenantId,
					applicationKey);
		} catch (Exception ex) {
			log.error("Calculation response error!!", ex);
			throw new CustomException("SEWERAGE_CALCULATION_EXCEPTION", "Calculation response can not parsed!!!");
		}
	}

	/**
	 * Get file store id from PDF service
	 * 
	 * @param sewerageObject - Sewerage connection JSON Object
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant ID
	 * @param applicationKey - Application Key
	 * @return Returns fileStore Id values
	 */
	private String getFileStoreIdFromPDFService(JSONObject sewerageObject, RequestInfo requestInfo, String tenantId,
												String applicationKey) {
		JSONArray sewerageConnectionList = new JSONArray();
		sewerageConnectionList.add(sewerageObject);
		JSONObject requestPayload = new JSONObject();
		requestPayload.put(requestInfoReplacer, requestInfo);
		requestPayload.put(WaterConnectionReplacer, sewerageConnectionList);
		try {
			StringBuilder builder = new StringBuilder();
			builder.append(config.getPdfServiceHost());
			String pdfLink = config.getPdfServiceLink();
			pdfLink = pdfLink.replace(tenantIdReplacer, tenantId).replace(pdfApplicationKey, applicationKey);
			builder.append(pdfLink);
			Object response = serviceRequestRepository.fetchResult(builder, requestPayload);
			DocumentContext responseContext = JsonPath.parse(response);
			List<Object> fileStoreIds = responseContext.read("$.filestoreIds");
			if (CollectionUtils.isEmpty(fileStoreIds)) {
				throw new CustomException("EMPTY_FILESTORE_IDS_FROM_PDF_SERVICE",
						"No file store id found from pdf service");
			}
			return fileStoreIds.get(0).toString();
		} catch (Exception ex) {
			log.error("PDF file store id response error!!", ex);
			throw new CustomException("SEWERAGE_FILESTORE_PDF_EXCEPTION", "PDF response can not parsed!!!");
		}
	}

	@SuppressWarnings("unchecked")
	public void process(SewerageConnectionRequest sewerageConnectionRequest, String topic) {

		Property property = validateProperty.getOrValidateProperty(sewerageConnectionRequest);

		HashMap<String, Object> addDetail = mapper
				.convertValue(sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails(), HashMap.class);
		if (sewerageConnectionRequest.getSewerageConnection().getApplicationStatus()
				.equalsIgnoreCase(SWConstants.PENDING_APPROVAL_FOR_CONNECTION_CODE)) {
			addDetail.put(SWConstants.ESTIMATION_DATE_CONST, System.currentTimeMillis());
			sewerageConnectionRequest.getSewerageConnection().setAdditionalDetails(addDetail);
			addDetail.put(SWConstants.ESTIMATION_FILESTORE_ID,
					getFileStoreId(sewerageConnectionRequest, property, SWConstants.PDF_ESTIMATION_KEY));
		}
		if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()
				.equalsIgnoreCase(SWConstants.ACTION_PAY)
				&& addDetail.getOrDefault(SWConstants.SANCTION_LETTER_FILESTORE_ID, null) == null) {
			addDetail.put(SWConstants.SANCTION_LETTER_FILESTORE_ID,
					getFileStoreId(sewerageConnectionRequest, property, SWConstants.PDF_SANCTION_KEY));
		}
		sewerageConnectionRequest.getSewerageConnection().setAdditionalDetails(addDetail);
		sewerageDao.saveFileStoreIds(sewerageConnectionRequest);
	}
}
