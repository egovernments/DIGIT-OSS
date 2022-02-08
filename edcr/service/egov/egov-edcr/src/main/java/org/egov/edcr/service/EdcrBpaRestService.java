package org.egov.edcr.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.egov.infra.config.core.EnvironmentSettings;
import org.egov.infra.web.utils.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service("edcrBpaRestService")
public class EdcrBpaRestService {

    private static final String COMMON_DOMAIN_NAME = "common.domain.name";
    private static final String IS_ENVIRONMENT_CENTRAL_INSTANCE = "is.environment.central.instance";
    private static final String BPACHECKDEMOND = "%s/bpa/rest/stakeholder/check/demand-pending/{userId}";
    private static final String REDIRECTTOCOLLECTION = "%s/bpa/application/stakeholder/generate-bill/{userId}";
    private static final String STAKEHOLDER_VALIDATION_URL = "%s/bpa/rest/validate/stakeholder/{userId}";
    private static final String EDCR_SERVICES_URL = "%s/bpa/rest/fetch/servicetype/edcr-required";

    @Autowired
    private EnvironmentSettings environmentSettings;

    public Boolean checkAnyTaxIsPendingToCollectForStakeHolder(final Long userId, final HttpServletRequest request) {
        final RestTemplate restTemplate = new RestTemplate();
        final String url = String.format(BPACHECKDEMOND,
                WebUtils.extractRequestDomainURL(request, false,
                        environmentSettings.getProperty(IS_ENVIRONMENT_CENTRAL_INSTANCE, Boolean.class),
                        environmentSettings.getProperty(COMMON_DOMAIN_NAME)));
        Map<String, Boolean> checkPending = restTemplate.getForObject(url, Map.class, userId);
        return checkPending.get("pending") != null && checkPending.get("pending");
    }

    public String generateBillAndRedirectToCollection(final Long userId, final HttpServletRequest request) {
        final RestTemplate restTemplate = new RestTemplate();
        final String url = String.format(REDIRECTTOCOLLECTION,
                WebUtils.extractRequestDomainURL(request, false,
                        environmentSettings.getProperty(IS_ENVIRONMENT_CENTRAL_INSTANCE, Boolean.class),
                        environmentSettings.getProperty(COMMON_DOMAIN_NAME)));
        return restTemplate.getForObject(url, String.class, userId);
    }

    public ErrorDetail validateStakeholder(final Long userId, final HttpServletRequest request) {
        final RestTemplate restTemplate = new RestTemplate();
        Boolean isDomainBased = environmentSettings.getProperty("stakeholder.domain.based", Boolean.class);
        String url;
        String externalDomainUrl = environmentSettings.getProperty("stakeholder.domain.url", String.class);
        if (!isDomainBased && StringUtils.isNotBlank(externalDomainUrl))
            url = String.format(STAKEHOLDER_VALIDATION_URL,
                    environmentSettings.getProperty("stakeholder.domain.url", String.class));
        else
            url = String.format(STAKEHOLDER_VALIDATION_URL,
                    WebUtils.extractRequestDomainURL(request, false,
                            environmentSettings.getProperty(IS_ENVIRONMENT_CENTRAL_INSTANCE, Boolean.class),
                            environmentSettings.getProperty(COMMON_DOMAIN_NAME)));
        return restTemplate.getForObject(url, ErrorDetail.class, userId);
    }

    public List<String> getEdcrIntegratedServices(final HttpServletRequest request) {
        final RestTemplate restTemplate = new RestTemplate();
        final String url = String.format(EDCR_SERVICES_URL,
                WebUtils.extractRequestDomainURL(request, false,
                        environmentSettings.getProperty(IS_ENVIRONMENT_CENTRAL_INSTANCE, Boolean.class),
                        environmentSettings.getProperty(COMMON_DOMAIN_NAME)));
        return restTemplate.getForObject(url, List.class);
    }
}
