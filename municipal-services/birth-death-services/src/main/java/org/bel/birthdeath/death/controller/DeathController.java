package org.bel.birthdeath.death.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import org.bel.birthdeath.common.contract.BirthResponse;
import org.bel.birthdeath.common.contract.DeathPdfApplicationRequest;
import org.bel.birthdeath.common.contract.DeathResponse;
import org.bel.birthdeath.common.contract.RequestInfoWrapper;
import org.bel.birthdeath.death.certmodel.DeathCertAppln;
import org.bel.birthdeath.death.certmodel.DeathCertApplnResponse;
import org.bel.birthdeath.death.certmodel.DeathCertRequest;
import org.bel.birthdeath.death.certmodel.DeathCertResponse;
import org.bel.birthdeath.death.certmodel.DeathCertificate;
import org.bel.birthdeath.death.model.EgDeathDtl;
import org.bel.birthdeath.death.model.SearchCriteria;
import org.bel.birthdeath.death.service.DeathService;
import org.bel.birthdeath.utils.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/death")
public class DeathController {
	
	@Autowired
	DeathService deathService;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	@Value("#{'${egov.bnd.live.citizen.tenants}'.split(',')}")
    private String[] liveCitizenTenants;
	
	private List<String> liveCitizenTenantsList = new ArrayList<String>();
	
	@PostConstruct
    public void loadTenants() {
    	liveCitizenTenantsList = Arrays.asList(liveCitizenTenants);
    }
	
	@RequestMapping(value = { "/_search"}, method = RequestMethod.POST)
    public ResponseEntity<DeathResponse> search(@RequestBody RequestInfoWrapper requestInfoWrapper,
                                                       @Valid @ModelAttribute SearchCriteria criteria) {
		if(requestInfoWrapper.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN") && liveCitizenTenantsList.contains(criteria.getTenantId()))
		{
			return new ResponseEntity<>(new DeathResponse(), HttpStatus.OK);
		}
        List<EgDeathDtl> deathCerts = deathService.search(criteria,requestInfoWrapper.getRequestInfo());
        DeathResponse response = DeathResponse.builder().deathCerts(deathCerts).responseInfo(
                responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
	@RequestMapping(value = { "/_download"}, method = RequestMethod.POST)
    public ResponseEntity<DeathCertResponse> download(@RequestBody RequestInfoWrapper requestInfoWrapper,
                                                       @Valid @ModelAttribute SearchCriteria criteria) {
		if(liveCitizenTenantsList.contains(criteria.getTenantId()))
		{
			return new ResponseEntity<>(new DeathCertResponse(), HttpStatus.OK);
		}
        DeathCertificate deathCert = deathService.download(criteria,requestInfoWrapper.getRequestInfo());
        DeathCertResponse response ;
        if(deathCert.getCounter()<=0)
        	response = DeathCertResponse.builder().filestoreId(deathCert.getFilestoreid()).responseInfo(
                responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        else
        	response = DeathCertResponse.builder().consumerCode(deathCert.getDeathCertificateNo()).tenantId(deathCert.getTenantId())
        			.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                    .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
	@RequestMapping(value = { "/_getfilestoreid"}, method = RequestMethod.POST)
    public ResponseEntity<DeathCertResponse> getfilestoreid(@RequestBody RequestInfoWrapper requestInfoWrapper,
                                                       @Valid @ModelAttribute SearchCriteria criteria) {
		
        DeathCertificate deathCert = deathService.getDeathCertReqByConsumerCode(criteria,requestInfoWrapper.getRequestInfo());
        DeathCertResponse response = DeathCertResponse.builder().filestoreId(deathCert.getFilestoreid()).tenantId(criteria.getTenantId()).responseInfo(
                responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        if(null!=deathCert.getFilestoreid()) {
        	deathCert.setDeathCertificateNo(criteria.getConsumerCode());
        	deathService.updateDownloadStatus(DeathCertRequest.builder().deathCertificate(deathCert).requestInfo(requestInfoWrapper.getRequestInfo()).build());
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
	@RequestMapping(value = { "/_searchApplications"}, method = RequestMethod.POST)
    public ResponseEntity<DeathCertApplnResponse> searchApplications(@RequestBody RequestInfoWrapper requestInfoWrapper,
                                                        @ModelAttribute SearchCriteria criteria ) {
        List<DeathCertAppln> applications = deathService.searchApplications(requestInfoWrapper);
        DeathCertApplnResponse response = DeathCertApplnResponse.builder().applications(applications).responseInfo(
                responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
	@RequestMapping(value = { "/_viewCertData"}, method = RequestMethod.POST)
    public ResponseEntity<DeathPdfApplicationRequest> viewCertificateData(@RequestBody RequestInfoWrapper requestInfoWrapper,
                                                        @ModelAttribute SearchCriteria criteria ) {
        List<EgDeathDtl> certData = deathService.viewCertificateData(criteria);
        DeathPdfApplicationRequest response = DeathPdfApplicationRequest.builder().deathCertificate(certData).requestInfo(requestInfoWrapper.getRequestInfo())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
	@RequestMapping(value = { "/_viewfullCertData"}, method = RequestMethod.POST)
    public ResponseEntity<DeathPdfApplicationRequest> viewfullCertMasterData(@RequestBody RequestInfoWrapper requestInfoWrapper,
                                                        @ModelAttribute SearchCriteria criteria ) {
        List<EgDeathDtl> certData = deathService.viewfullCertMasterData(criteria,requestInfoWrapper.getRequestInfo());
        DeathPdfApplicationRequest response = DeathPdfApplicationRequest.builder().deathCertificate(certData).requestInfo(requestInfoWrapper.getRequestInfo())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value = { "/_plainsearch"}, method = RequestMethod.POST)
    public ResponseEntity<DeathResponse> plainSearch(@RequestBody RequestInfoWrapper requestInfoWrapper,
                                                @Valid @ModelAttribute SearchCriteria criteria) {
        List<EgDeathDtl> deathCerts = deathService.plainSearch(criteria,requestInfoWrapper.getRequestInfo());
        DeathResponse response = DeathResponse.builder().deathCerts(deathCerts).responseInfo(
                        responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
