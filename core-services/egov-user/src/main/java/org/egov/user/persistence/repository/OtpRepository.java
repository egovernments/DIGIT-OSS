package org.egov.user.persistence.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.ServiceCallException;
import org.egov.user.domain.model.OtpValidationRequest;
import org.egov.user.persistence.dto.Otp;
import org.egov.user.persistence.dto.OtpRequest;
import org.egov.user.persistence.dto.OtpResponse;
import org.egov.user.web.contract.OtpValidateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Repository
@Slf4j
public class OtpRepository {
    private final RestTemplate restTemplate;
    private final String otpSearchEndpoint;
    private final String otpValidateEndpoint;

    @Autowired
    public OtpRepository(@Value("${egov.otp.host}") String otpServiceHost,
                         @Value("${egov.services.otp.search_otp}") String otpSearchContextEndpoint,
                         @Value("${egov.services.otp.validate_otp}") String otpValidateEndpoint,
                         RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.otpSearchEndpoint = otpServiceHost + otpSearchContextEndpoint;
        this.otpValidateEndpoint = otpServiceHost + otpValidateEndpoint;
    }

    /**
     * rest-call to egov-otp to check otp validation is complete or not.
     * @param request
     * @return
     */
	public boolean isOtpValidationComplete(OtpValidationRequest request) {
		Otp otp = Otp.builder().tenantId(request.getTenantId()).uuid(request.getOtpReference()).build();
		OtpRequest otpRequest = new OtpRequest(otp);
		OtpResponse otpResponse = restTemplate.postForObject(otpSearchEndpoint, otpRequest, OtpResponse.class);
		return otpResponse.isValidationComplete(request.getMobileNumber());
	}

	
	/**
	 * rest call to egov-otp to validate the otp.
	 * @param request
	 * @return
	 */
	public boolean validateOtp(OtpValidateRequest request) {
		try {
            OtpResponse otpResponse = restTemplate.postForObject(otpValidateEndpoint, request, OtpResponse.class);
            if(null!=otpResponse && null!=otpResponse.getOtp())
                return otpResponse.getOtp().isValidationSuccessful();
            else
                return false;
		}catch(HttpClientErrorException e){
			log.error("Otp validation failed", e);
			throw new ServiceCallException(e.getResponseBodyAsString());
		}
	}
}


