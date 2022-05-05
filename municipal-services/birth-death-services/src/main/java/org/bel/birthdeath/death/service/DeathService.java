package org.bel.birthdeath.death.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.bel.birthdeath.common.calculation.collections.models.Payment;
import org.bel.birthdeath.common.calculation.collections.models.PaymentDetail;
import org.bel.birthdeath.common.calculation.collections.models.PaymentResponse;
import org.bel.birthdeath.common.calculation.collections.models.PaymentSearchCriteria;
import org.bel.birthdeath.common.consumer.ReceiptConsumer;
import org.bel.birthdeath.common.contract.DeathPdfApplicationRequest;
import org.bel.birthdeath.common.contract.EgovPdfResp;
import org.bel.birthdeath.common.contract.RequestInfoWrapper;
import org.bel.birthdeath.common.model.AuditDetails;
import org.bel.birthdeath.common.repository.ServiceRequestRepository;
import org.bel.birthdeath.config.BirthDeathConfiguration;
import org.bel.birthdeath.death.certmodel.DeathCertAppln;
import org.bel.birthdeath.death.certmodel.DeathCertRequest;
import org.bel.birthdeath.death.certmodel.DeathCertificate;
import org.bel.birthdeath.death.certmodel.DeathCertificate.StatusEnum;
import org.bel.birthdeath.death.model.EgDeathDtl;
import org.bel.birthdeath.death.model.SearchCriteria;
import org.bel.birthdeath.death.repository.DeathRepository;
import org.bel.birthdeath.death.validator.DeathValidator;
import org.bel.birthdeath.utils.CommonUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DeathService {
	
	@Autowired
	DeathRepository repository;

	@Autowired
	ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	@Qualifier("objectMapperBnd")
	ObjectMapper objectMapper;
	
	@Autowired
	DeathValidator validator;
	
	@Autowired
	EnrichmentServiceDeath enrichmentServiceDeath;
	
	@Autowired
	CalculationServiceDeath calculationServiceDeath;
	
	@Autowired
	CommonUtils commUtils;
	
	@Autowired
	BirthDeathConfiguration config;
	
	@Autowired
	ReceiptConsumer consumer;
	
	public List<EgDeathDtl> search(SearchCriteria criteria,RequestInfo requestInfo) {
		List<EgDeathDtl> deathDtls = new ArrayList<>() ;
		if(requestInfo.getUserInfo().getType().equalsIgnoreCase("EMPLOYEE")) {
			if(validator.validateFieldsEmployee(criteria)) {
				deathDtls = repository.getDeathDtls(criteria);
			}
		}
		else {
			if(validator.validateFieldsCitizen(criteria)) {
				deathDtls = repository.getDeathDtls(criteria);
			}
		}
		return deathDtls;
	}

	public List<DeathCertificate> plainSearch(SearchCriteria criteria) {
		return repository.getDeathDtlsForPlainSearch(criteria);
	}

	public DeathCertificate download(SearchCriteria criteria, RequestInfo requestInfo) {
		try {
		DeathCertificate deathCertificate = new DeathCertificate();
		deathCertificate.setSource(criteria.getSource().toString());
		deathCertificate.setDeathDtlId(criteria.getId());
		deathCertificate.setTenantId(criteria.getTenantId());
		DeathCertRequest deathCertRequest = DeathCertRequest.builder().deathCertificate(deathCertificate).requestInfo(requestInfo).build();
		List<EgDeathDtl> deathDtls = repository.getDeathDtlsAll(criteria,requestInfo);
			deathCertificate.setGender(deathDtls.get(0).getGenderStr());
			deathCertificate.setAge(deathDtls.get(0).getAge());
			deathCertificate.setWard(deathDtls.get(0).getDeathPermaddr().getTehsil());
			deathCertificate.setState(deathDtls.get(0).getDeathPermaddr().getState());
			deathCertificate.setDistrict(deathDtls.get(0).getDeathPermaddr().getDistrict());
			deathCertificate.setDateofdeath(deathDtls.get(0).getDateofdeath());
			deathCertificate.setDateofreport(deathDtls.get(0).getDateofreport());
			deathCertificate.setPlaceofdeath(deathDtls.get(0).getPlaceofdeath());
			SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
			String date = format.format(deathDtls.get(0).getDateofreport());
			String datestr= date.split("-")[2];
			deathCertificate.setYear(datestr);
		if(deathDtls.size()>1) 
			throw new CustomException("Invalid_Input","Error in processing data");
		enrichmentServiceDeath.enrichCreateRequest(deathCertRequest);
		enrichmentServiceDeath.setIdgenIds(deathCertRequest);
		if(deathDtls.get(0).getCounter()>0){
			enrichmentServiceDeath.setDemandParams(deathCertRequest);
			enrichmentServiceDeath.setGLCode(deathCertRequest);
			calculationServiceDeath.addCalculation(deathCertRequest);
			deathCertificate.setApplicationStatus(StatusEnum.ACTIVE);
		}
		else{
			deathDtls.get(0).setDeathcertificateno(deathCertRequest.getDeathCertificate().getDeathCertificateNo());
			DeathPdfApplicationRequest applicationRequest = DeathPdfApplicationRequest.builder().requestInfo(requestInfo).deathCertificate(deathDtls).build();
			EgovPdfResp pdfResp = repository.saveDeathCertPdf(applicationRequest);
			deathCertificate.setEmbeddedUrl(applicationRequest.getDeathCertificate().get(0).getEmbeddedUrl());
			deathCertificate.setDateofissue(applicationRequest.getDeathCertificate().get(0).getDateofissue());
			deathCertificate.setFilestoreid(pdfResp.getFilestoreIds().get(0));
			repository.updateCounter(deathCertificate.getDeathDtlId());
			deathCertificate.setApplicationStatus(StatusEnum.FREE_DOWNLOAD);
			
		}
		deathCertificate.setCounter(deathDtls.get(0).getCounter());
		repository.save(deathCertRequest);
		return deathCertificate;
		}
		catch(Exception e) {
			e.printStackTrace();
			throw new CustomException("DOWNLOAD_ERROR","Error in Downloading Certificate");
		}
	}

	public DeathCertificate getDeathCertReqByConsumerCode(SearchCriteria criteria, RequestInfo requestInfo) {
		return repository.getDeathCertReqByConsumerCode(criteria.getConsumerCode(),requestInfo);
	}
	
	public List<DeathCertAppln> searchApplications(RequestInfoWrapper requestInfoWrapper) {
		List<DeathCertAppln> certApplns=null;
		certApplns = repository.searchApplications(requestInfoWrapper.getRequestInfo().getUserInfo().getUuid());
		for (DeathCertAppln certAppln : certApplns) {
			if (certAppln.getStatus().equalsIgnoreCase(StatusEnum.PAID.toString())) {
				try {
					DeathCertificate cert = repository.getDeathCertReqByConsumerCode(certAppln.getApplicationNumber(),
							requestInfoWrapper.getRequestInfo());
					String uuid = requestInfoWrapper.getRequestInfo().getUserInfo().getUuid();
				    AuditDetails auditDetails = commUtils.getAuditDetails(uuid, false);
					cert.getAuditDetails().setLastModifiedBy(auditDetails.getLastModifiedBy());
					cert.getAuditDetails().setLastModifiedTime(auditDetails.getLastModifiedTime());
					cert = consumer.updateDeathPDFGEN(requestInfoWrapper.getRequestInfo(), cert);
					if (null != cert.getFilestoreid()) {
						certAppln.setFileStoreId(cert.getFilestoreid());
						certAppln.setStatus(cert.getApplicationStatus().toString());
					}

				} catch (Exception e) {
					e.printStackTrace();
				}
			} else if (certAppln.getStatus().equalsIgnoreCase(StatusEnum.ACTIVE.toString())) {
				PaymentSearchCriteria criteria = new PaymentSearchCriteria();
				criteria.setTenantId(certAppln.getTenantId());
				criteria.setConsumerCodes(Collections.singleton(certAppln.getApplicationNumber()));
				List<Payment> payments = getPayments(criteria, requestInfoWrapper);
				if (!CollectionUtils.isEmpty(payments)) {
					for (PaymentDetail paymentDetail : payments.get(0).getPaymentDetails()) {
						try {
							DeathCertificate cert = consumer.updateDeathPAID(requestInfoWrapper.getRequestInfo(),
									paymentDetail);
							if (null != cert) {
								certAppln.setStatus(cert.getApplicationStatus().toString());
							}
							cert = consumer.updateDeathPDFGEN(requestInfoWrapper.getRequestInfo(), cert);
							if (null != cert.getFilestoreid()) {
								certAppln.setFileStoreId(cert.getFilestoreid());
								certAppln.setStatus(cert.getApplicationStatus().toString());
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
		return certApplns;
	}

	public void updateDownloadStatus(DeathCertRequest certRequest) {
		if(null!=certRequest.getRequestInfo() && null!=certRequest.getRequestInfo().getUserInfo() && null!=certRequest.getRequestInfo().getUserInfo().getUuid())
		{
			AuditDetails auditDetails = commUtils.getAuditDetails(certRequest.getRequestInfo().getUserInfo().getUuid(), false);
			DeathCertificate deathCert = certRequest.getDeathCertificate();
			deathCert.getAuditDetails().setLastModifiedBy(auditDetails.getLastModifiedBy());
			deathCert.getAuditDetails().setLastModifiedTime(auditDetails.getLastModifiedTime());
			deathCert.setApplicationStatus(StatusEnum.PAID_DOWNLOAD);
			repository.update(certRequest);
		}

	}
	
	public List<EgDeathDtl> viewCertificateData(SearchCriteria criteria) {
		return repository.viewCertificateData(criteria);
	}
	
	public List<EgDeathDtl> viewfullCertMasterData(SearchCriteria criteria,RequestInfo requestInfo) {
		return repository.viewfullCertMasterData(criteria,requestInfo);
	}
	
	public List<Payment> getPayments(PaymentSearchCriteria criteria, RequestInfoWrapper requestInfoWrapper) {
        StringBuilder url = getPaymentSearchUrl(criteria);
        return objectMapper.convertValue(serviceRequestRepository.fetchResult(url, requestInfoWrapper), PaymentResponse.class).getPayments();
    }
    
    public StringBuilder getPaymentSearchUrl(PaymentSearchCriteria criteria) {
        return new StringBuilder().append(config.getCollectionServiceHost())
                .append(config.getPaymentSearchEndpoint()).append("?")
                .append("tenantId=").append(criteria.getTenantId())
                .append("&").append("consumerCodes=")
                .append(StringUtils.join(criteria.getConsumerCodes(),","))
                .append("&").append("status=APPROVED,DEPOSITED,NEW");
    }
}
