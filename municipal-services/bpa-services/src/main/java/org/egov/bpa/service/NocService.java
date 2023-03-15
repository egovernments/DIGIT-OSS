package org.egov.bpa.service;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.bpa.config.BPAConfiguration;
import org.egov.bpa.repository.ServiceRequestRepository;
import org.egov.bpa.util.BPAConstants;
import org.egov.bpa.util.BPAErrorConstants;
import org.egov.bpa.web.model.BPA;
import org.egov.bpa.web.model.BPARequest;
import org.egov.bpa.web.model.RequestInfoWrapper;
import org.egov.bpa.web.model.NOC.Noc;
import org.egov.bpa.web.model.NOC.NocRequest;
import org.egov.bpa.web.model.NOC.NocResponse;
import org.egov.bpa.web.model.NOC.Workflow;
import org.egov.bpa.web.model.NOC.enums.ApplicationType;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;

import static org.egov.bpa.util.BPAConstants.INPROGRESS_STATUS;

@Service
@Slf4j
public class NocService {

	@Autowired
	private EDCRService edcrService;

	@Autowired
	private BPAConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	@SuppressWarnings("unchecked")
	public void createNocRequest(BPARequest bpaRequest, Object mdmsData) {
		BPA bpa = bpaRequest.getBPA();
		Map<String, String> edcrResponse = edcrService.getEDCRDetails(bpaRequest.getRequestInfo(), bpaRequest.getBPA());
		log.debug("applicationType in NOC is " + edcrResponse.get(BPAConstants.APPLICATIONTYPE));
		log.debug("serviceType in NOC is " + edcrResponse.get(BPAConstants.SERVICETYPE));
		
		String riskType = "ALL";
		if (StringUtils.isEmpty(bpa.getRiskType()) || bpa.getRiskType().equalsIgnoreCase("LOW")) {
			riskType = bpa.getRiskType();
		}
		log.debug("Fetching NocTypeMapping record of riskType : " + riskType);

		String nocPath = BPAConstants.NOCTYPE_REQUIRED_MAP
				.replace("{1}", edcrResponse.get(BPAConstants.APPLICATIONTYPE))
				.replace("{2}", edcrResponse.get(BPAConstants.SERVICETYPE)).replace("{3}", riskType);
		
		Map<String,String> nocSourceCnofig = config.getNocSourceConfig();

		List<Object> nocMappingResponse = (List<Object>) JsonPath.read(mdmsData, nocPath);
		List<String> nocTypes = JsonPath.read(nocMappingResponse, "$..type");
		if (!CollectionUtils.isEmpty(nocTypes)) {
			for (String nocType : nocTypes) {
				NocRequest nocRequest = NocRequest.builder()
						.noc(Noc.builder().tenantId(bpa.getTenantId())
								.applicationType(ApplicationType.valueOf(BPAConstants.NOC_APPLICATIONTYPE))
								.sourceRefId(bpa.getApplicationNo()).nocType(nocType).source(nocSourceCnofig.get(edcrResponse.get(BPAConstants.APPLICATIONTYPE)))
								.build())
						.requestInfo(bpaRequest.getRequestInfo()).build();
				createNoc(nocRequest);
			}
		} else {
			log.debug("NOC Mapping is not found!!");
		}

	}

	@SuppressWarnings("unchecked")
	private void createNoc(NocRequest nocRequest) {
		StringBuilder uri = new StringBuilder(config.getNocServiceHost());
		uri.append(config.getNocCreateEndpoint());

		LinkedHashMap<String, Object> responseMap = null;
		try {
			log.debug("Creating NOC application with nocType : " + nocRequest.getNoc().getNocType());
			responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, nocRequest);
			NocResponse nocResponse = mapper.convertValue(responseMap, NocResponse.class);
			log.debug("NOC created with applicationNo : " + nocResponse.getNoc().get(0).getApplicationNo());
		} catch (Exception se) {
			throw new CustomException(BPAErrorConstants.NOC_SERVICE_EXCEPTION,
					" Failed to create NOC of Type " + nocRequest.getNoc().getNocType());
		}
	}

	@SuppressWarnings("unchecked")
	private void updateNoc(NocRequest nocRequest) {
		StringBuilder uri = new StringBuilder(config.getNocServiceHost());
		uri.append(config.getNocUpdateEndpoint());

		LinkedHashMap<String, Object> responseMap = null;
		try {
			responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, nocRequest);
			NocResponse nocResponse = mapper.convertValue(responseMap, NocResponse.class);
			log.debug("NOC updated with applicationNo : " + nocResponse.getNoc().get(0).getApplicationNo());
		} catch (Exception se) {
			throw new CustomException(BPAErrorConstants.NOC_SERVICE_EXCEPTION,
					" Failed to update NOC of Type " + nocRequest.getNoc().getNocType());
		}
	}

	@SuppressWarnings("unchecked")
	public List<Noc> fetchNocRecords(BPARequest bpaRequest) {

		StringBuilder url = getNOCWithSourceRef(bpaRequest);

		RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(bpaRequest.getRequestInfo())
				.build();
		LinkedHashMap<String, Object> responseMap = null;
		try {
			responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(url, requestInfoWrapper);
			NocResponse nocResponse = mapper.convertValue(responseMap, NocResponse.class);
			return nocResponse.getNoc();
		} catch (Exception e) {
			throw new CustomException(BPAErrorConstants.NOC_SERVICE_EXCEPTION, " Unable to fetch the NOC records");
		}
	}

	/**
	 * fetch the noc records with sourceRefId
	 * @param bpaRequest
	 * @return
	 */
	private StringBuilder getNOCWithSourceRef(BPARequest bpaRequest) {
		StringBuilder uri = new StringBuilder(config.getNocServiceHost());
		uri.append(config.getNocSearchEndpoint());
		uri.append("?tenantId=");
		uri.append(bpaRequest.getBPA().getTenantId());
		NocRequest nocRequest = new NocRequest();
		nocRequest.setRequestInfo(bpaRequest.getRequestInfo());
		uri.append("&sourceRefId=");
		uri.append(bpaRequest.getBPA().getApplicationNo());
		return uri;
	}

	/**
	 * Calls the iniate  workflow for the applicable noc records
	 * @param bpaRequest
	 * @param mdmsData
	 */
	public void initiateNocWorkflow(BPARequest bpaRequest, Object mdmsData) {
		log.debug("====> initiateNocWorkflow");
		List<Noc> nocs = fetchNocRecords(bpaRequest);
		log.debug("====> initiateNocWorkflow = no of noc "+ nocs.size());
		initiateNocWorkflow(bpaRequest, mdmsData, nocs);
	}
	
	/**
	 * Calls the  approve offline workflow for the applicable noc records
	 * @param bpaRequest
	 * @param mdmsData
	 */
	public void manageOfflineNocs(BPARequest bpaRequest, Object mdmsData) {
		List<Noc> nocs = fetchNocRecords(bpaRequest);
		approveOfflineNoc(bpaRequest, mdmsData, nocs);
	}

	/**
	 * fetches the applicable offline noc's and mark them as approved
	 * @param bpaRequest
	 * @param mdmsData
	 * @param nocs
	 */
	@SuppressWarnings("unchecked")
	private void approveOfflineNoc(BPARequest bpaRequest, Object mdmsData, List<Noc> nocs) {
		BPA bpa = bpaRequest.getBPA();
		log.debug(" auto approval of offline noc with bpa status "+ bpa.getStatus() +" and "+bpa.getWorkflow().getAction());
		if (bpa.getStatus().equalsIgnoreCase(BPAConstants.NOCVERIFICATION_STATUS)
				&& bpa.getWorkflow().getAction().equalsIgnoreCase(BPAConstants.ACTION_FORWORD)) {
			List<String> statuses = Arrays.asList(config.getNocValidationCheckStatuses().split(","));
			List<String> offlneNocs = (List<String>) JsonPath.read(mdmsData, BPAConstants.NOCTYPE_OFFLINE_MAP);
			log.debug(" auto approval of offline noc with bpa status and no of nocs "+offlneNocs.size()+" noc statuses"+ statuses.toString());
			if (!CollectionUtils.isEmpty(nocs)) {
				nocs.forEach(noc -> {
					log.debug(" auto approval of offline noc "+ noc.getApplicationNo() +" _"+noc.getApplicationStatus());
						if (offlneNocs.contains(noc.getNocType()) && !statuses.contains(noc.getApplicationStatus())) {
							Workflow workflow = Workflow.builder().action(config.getNocAutoApproveAction()).build();
							noc.setWorkflow(workflow);
							NocRequest nocRequest = NocRequest.builder().noc(noc)
									.requestInfo(bpaRequest.getRequestInfo()).build();
							updateNoc(nocRequest);
							log.debug("Offline NOC is Auto-Approved " + noc.getApplicationNo());
						}
					
				});
			}
		}
	}

	/**
	 *
	 *initate the workflow of applicale NOc to the bpa
	 * @param bpaRequest
	 * @param mdmsData
	 * @param nocs
	 */
	@SuppressWarnings("unchecked")
	private void initiateNocWorkflow(BPARequest bpaRequest, Object mdmsData, List<Noc> nocs) {
		BPA bpa = bpaRequest.getBPA();
		
		Map<String, String> edcrResponse = edcrService.getEDCRDetails(bpaRequest.getRequestInfo(), bpaRequest.getBPA());
		String nocPath = BPAConstants.NOC_TRIGGER_STATE_MAP
				.replace("{1}", edcrResponse.get(BPAConstants.APPLICATIONTYPE))
				.replace("{2}", edcrResponse.get(BPAConstants.SERVICETYPE))
				.replace("{3}", (StringUtils.isEmpty(bpa.getRiskType()) || !bpa.getRiskType().equalsIgnoreCase("LOW"))
						? "ALL" : bpa.getRiskType().toString());
		List<Object> triggerActionStates = (List<Object>) JsonPath.read(mdmsData, nocPath);
		log.debug("====> initiateNocWorkflow = triggerStates" + triggerActionStates.toString());
		if (!CollectionUtils.isEmpty(triggerActionStates)
				&& triggerActionStates.get(0).toString().equalsIgnoreCase(bpa.getStatus())) {
			if (!CollectionUtils.isEmpty(nocs)) {
				nocs.forEach(noc -> {
					log.debug("====> noc application status " + noc.getApplicationStatus()  +" for noc appno "+ noc.getApplicationNo());
					if(!noc.getApplicationStatus().equalsIgnoreCase(INPROGRESS_STATUS)){
						noc.setWorkflow(Workflow.builder().action(config.getNocInitiateAction()).build());
						NocRequest nocRequest = NocRequest.builder().noc(noc).requestInfo(bpaRequest.getRequestInfo())
								.build();
						updateNoc(nocRequest);
						log.debug("Noc Initiated with applicationNo : " + noc.getApplicationNo());
					}
				});
			}
		}
	}

	/**
	 * handles the BPA reject and revocate state by voiding the NOC applicable to BPA
	 * @param bpaRequest
	 */
	public void handleBPARejectedStateForNoc(BPARequest bpaRequest) {
		List<Noc> nocs = fetchNocRecords(bpaRequest);
		BPA bpa = bpaRequest.getBPA();

		nocs.forEach(noc -> {
			if(noc.getApplicationStatus().equalsIgnoreCase(INPROGRESS_STATUS)) {
				noc.setWorkflow(Workflow.builder().action(config.getNocVoidAction())
						.comment(bpa.getWorkflow().getComments()).build());
				NocRequest nocRequest = NocRequest.builder().noc(noc).requestInfo(bpaRequest.getRequestInfo())
						.build();
				updateNoc(nocRequest);
				log.debug("Noc Voided having applicationNo : " + noc.getApplicationNo());
			}
		});
	}
}
