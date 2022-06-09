package org.bel.birthdeath.common.consumer;

import static org.bel.birthdeath.utils.BirthDeathConstants.BIRTH_CERT;
import static org.bel.birthdeath.utils.BirthDeathConstants.DEATH_CERT;

import java.util.HashMap;
import java.util.List;

import org.bel.birthdeath.birth.certmodel.BirthCertRequest;
import org.bel.birthdeath.birth.certmodel.BirthCertificate;
import org.bel.birthdeath.birth.certmodel.BirthCertificate.StatusEnum;
import org.bel.birthdeath.birth.model.EgBirthDtl;
import org.bel.birthdeath.birth.model.SearchCriteria;
import org.bel.birthdeath.birth.repository.BirthRepository;
import org.bel.birthdeath.common.calculation.collections.models.PaymentDetail;
import org.bel.birthdeath.common.calculation.collections.models.PaymentRequest;
import org.bel.birthdeath.common.contract.BirthPdfApplicationRequest;
import org.bel.birthdeath.common.contract.DeathPdfApplicationRequest;
import org.bel.birthdeath.common.contract.EgovPdfResp;
import org.bel.birthdeath.common.model.AuditDetails;
import org.bel.birthdeath.common.producer.BndProducer;
import org.bel.birthdeath.config.BirthDeathConfiguration;
import org.bel.birthdeath.death.certmodel.DeathCertRequest;
import org.bel.birthdeath.death.certmodel.DeathCertificate;
import org.bel.birthdeath.death.model.EgDeathDtl;
import org.bel.birthdeath.death.repository.DeathRepository;
import org.bel.birthdeath.utils.BirthDeathConstants;
import org.bel.birthdeath.utils.CommonUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;



@Slf4j
@Component
public class ReceiptConsumer {

	@Autowired
	@Qualifier("objectMapperBnd")
	private ObjectMapper mapper;
	
	@Autowired
	private CommonUtils commUtils;
	
	@Autowired
	private BirthDeathConfiguration config ;
	
	@Autowired
	private BndProducer bndProducer;
	
	@Autowired
	private BirthRepository repository;
	
	@Autowired
	private DeathRepository repositoryDeath;

	@KafkaListener(topics = {"${kafka.topics.receipt.create}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
        process(record);
        } catch (final Exception e) {
            log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e.getMessage());
        }
    }
    
    public void process(HashMap<String, Object> record) {

		try {
			log.info("Process for object"+ record);
			PaymentRequest paymentRequest = mapper.convertValue(record, PaymentRequest.class);
			RequestInfo requestInfo = paymentRequest.getRequestInfo();
			if( paymentRequest.getPayment().getTotalAmountPaid().compareTo(paymentRequest.getPayment().getTotalDue())!=0) 
				return;
			List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();
			for (PaymentDetail paymentDetail : paymentDetails) {
				if(paymentDetail.getBusinessService().equalsIgnoreCase(BIRTH_CERT)) {
					BirthCertificate birthCertificate = updateBirthPAID(requestInfo, paymentDetail);
					updateBirthPDFGEN(requestInfo, birthCertificate);
				}
				if(paymentDetail.getBusinessService().equalsIgnoreCase(DEATH_CERT)) {
					DeathCertificate deathCertificate = updateDeathPAID(requestInfo, paymentDetail);
					updateDeathPDFGEN(requestInfo, deathCertificate);
				}
			}
		} catch (Exception e) {
			log.error("Exception while processing payment update: ",e);
		}

	}

	public DeathCertificate updateDeathPAID(RequestInfo requestInfo, PaymentDetail paymentDetail) {
		try {
			DeathCertificate deathCertificate = repositoryDeath.getDeathCertReqByConsumerCode(paymentDetail.getBill().getConsumerCode(),requestInfo);
			if(deathCertificate.getApplicationStatus().equals(org.bel.birthdeath.death.certmodel.DeathCertificate.StatusEnum.ACTIVE)) {
				String uuid = requestInfo.getUserInfo().getUuid();
			    AuditDetails auditDetails = commUtils.getAuditDetails(uuid, false);
				deathCertificate.getAuditDetails().setLastModifiedBy(auditDetails.getLastModifiedBy());
				deathCertificate.getAuditDetails().setLastModifiedTime(auditDetails.getLastModifiedTime());
				deathCertificate.setApplicationStatus(org.bel.birthdeath.death.certmodel.DeathCertificate.StatusEnum.PAID);
				deathCertificate.setDeathCertificateNo(paymentDetail.getBill().getConsumerCode());
				DeathCertRequest request = DeathCertRequest.builder().requestInfo(requestInfo).deathCertificate(deathCertificate).build();
				bndProducer.push(config.getUpdateDeathTopic(), request);
			}
			return deathCertificate;
		}
		catch (Exception e) {
			throw new CustomException(BirthDeathConstants.UPDATE_ERROR_MESSAGE, BirthDeathConstants.PAYMENT_ERROR_MESSAGE);
		}
	}

	public DeathCertificate updateDeathPDFGEN(RequestInfo requestInfo, DeathCertificate deathCertificate) {
		try {
			if(deathCertificate.getApplicationStatus().equals(org.bel.birthdeath.death.certmodel.DeathCertificate.StatusEnum.PAID)) {
				org.bel.birthdeath.death.model.SearchCriteria criteria=new org.bel.birthdeath.death.model.SearchCriteria();
				criteria.setId(deathCertificate.getDeathDtlId());
				List<EgDeathDtl> deathDtls = repositoryDeath.getDeathDtlsAll(criteria,requestInfo);
				if(deathDtls.size()>1) 
					throw new CustomException("Invalid_Input","Error in processing data");
				deathDtls.get(0).setDeathcertificateno(deathCertificate.getDeathCertificateNo());
				DeathPdfApplicationRequest applicationRequest = DeathPdfApplicationRequest.builder().requestInfo(requestInfo).deathCertificate(deathDtls).build();
				EgovPdfResp pdfResp = repositoryDeath.saveDeathCertPdf(applicationRequest);
				if(null!=pdfResp) {
					deathCertificate.setFilestoreid(pdfResp.getFilestoreIds().get(0));
					deathCertificate.setEmbeddedUrl(applicationRequest.getDeathCertificate().get(0).getEmbeddedUrl());
					deathCertificate.setDateofissue(applicationRequest.getDeathCertificate().get(0).getDateofissue());
				}
				deathCertificate.setApplicationStatus(org.bel.birthdeath.death.certmodel.DeathCertificate.StatusEnum.PAID_PDF_GENERATED);
				DeathCertRequest requestNew = DeathCertRequest.builder().requestInfo(requestInfo).deathCertificate(deathCertificate).build();
				bndProducer.push(config.getUpdateDeathTopic(), requestNew);
				repositoryDeath.updateCounter(deathCertificate.getDeathDtlId());
			}
			return deathCertificate;
		}
		catch (Exception e) {
			throw new CustomException(BirthDeathConstants.PAYMENT_ERROR_MESSAGE, e.getMessage());
		}
	}

	public BirthCertificate updateBirthPAID(RequestInfo requestInfo, PaymentDetail paymentDetail) {
		try {
			
			BirthCertificate birthCertificate = repository.getBirthCertReqByConsumerCode(paymentDetail.getBill().getConsumerCode(),requestInfo);
			if(birthCertificate.getApplicationStatus().equals(StatusEnum.ACTIVE)) {
				String uuid = requestInfo.getUserInfo().getUuid();
				AuditDetails auditDetails = commUtils.getAuditDetails(uuid, false);
				birthCertificate.getAuditDetails().setLastModifiedBy(auditDetails.getLastModifiedBy());
				birthCertificate.getAuditDetails().setLastModifiedTime(auditDetails.getLastModifiedTime());
				birthCertificate.setApplicationStatus(StatusEnum.PAID);
				birthCertificate.setBirthCertificateNo(paymentDetail.getBill().getConsumerCode());
				BirthCertRequest request = BirthCertRequest.builder().requestInfo(requestInfo).birthCertificate(birthCertificate).build();
				bndProducer.push(config.getUpdateBirthTopic(), request);
			}
			return birthCertificate;
		}
		catch (Exception e) {
			throw new CustomException(BirthDeathConstants.PAYMENT_ERROR_MESSAGE,e.getMessage());
		}
	}

	public BirthCertificate updateBirthPDFGEN(RequestInfo requestInfo,  BirthCertificate birthCertificate) {
		try{
			if(birthCertificate.getApplicationStatus().equals(StatusEnum.PAID)) {
				SearchCriteria criteria=new SearchCriteria();
				criteria.setId(birthCertificate.getBirthDtlId());
				List<EgBirthDtl> birtDtls = repository.getBirthDtlsAll(criteria,requestInfo);
				if(birtDtls.size()>1) 
					throw new CustomException("Invalid_Input","Error in processing data");
				birtDtls.get(0).setBirthcertificateno(birthCertificate.getBirthCertificateNo());
				BirthPdfApplicationRequest applicationRequest = BirthPdfApplicationRequest.builder().requestInfo(requestInfo).birthCertificate(birtDtls).build();
				EgovPdfResp pdfResp = repository.saveBirthCertPdf(applicationRequest);
				if(null!=pdfResp) {
					birthCertificate.setFilestoreid(pdfResp.getFilestoreIds().get(0));
					birthCertificate.setEmbeddedUrl(applicationRequest.getBirthCertificate().get(0).getEmbeddedUrl());
					birthCertificate.setDateofissue(applicationRequest.getBirthCertificate().get(0).getDateofissue());
				}
				birthCertificate.setApplicationStatus(StatusEnum.PAID_PDF_GENERATED);
				BirthCertRequest requestNew = BirthCertRequest.builder().requestInfo(requestInfo).birthCertificate(birthCertificate).build();
				bndProducer.push(config.getUpdateBirthTopic(), requestNew);
				repository.updateCounter(birthCertificate.getBirthDtlId());
			}
			return birthCertificate;
		}
		catch (Exception e) {
			throw new CustomException(BirthDeathConstants.PAYMENT_ERROR_MESSAGE, e.getMessage());
		}
	}
}
