package org.egov.edcr.service;

import java.util.Map;

import org.egov.infra.config.core.ApplicationThreadLocals;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BpaRestService {

    private static final String BPA_RESTURL = "%s/bpa/rest/getbpaApplicationByPlanPermissionNo/{permitNumber}";

    public Map<String, Object> findByPermitNumber(final String permitNumber) {
        final RestTemplate restTemplate = new RestTemplate();

        final String url = String.format(BPA_RESTURL, ApplicationThreadLocals.getDomainURL());
        return restTemplate.getForObject(url, Map.class, permitNumber);
    }

}
